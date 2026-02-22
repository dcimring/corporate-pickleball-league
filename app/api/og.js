import React from 'react';
import { readFile } from 'node:fs/promises';
import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'nodejs',
};

const withTimeout = async (promise, ms, label) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ms);
  try {
    return await promise(controller.signal);
  } finally {
    clearTimeout(timeout);
  }
};

const readFont = async (relativePath) => {
  const fileUrl = new URL(relativePath, import.meta.url);
  const data = await readFile(fileUrl);
  return data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
};

const fontCache = Promise.all([
  readFont('./fonts/Montserrat-ExtraBold.ttf'),
  readFont('./fonts/Montserrat-ExtraBoldItalic.ttf'),
  readFont('./fonts/OpenSans-Regular.ttf'),
  readFont('./fonts/RobotoMono-Bold.ttf'),
])
  .then(([montserrat, montserratItalic, openSans, robotoMono]) => ({
    montserrat,
    montserratItalic,
    openSans,
    robotoMono,
  }))
  .catch((err) => ({ error: String(err) }));

const noiseSvg = `data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E`;

const fetchSupabase = async (url, supabaseKey) => {
  const res = await withTimeout(
    (signal) =>
      fetch(url, {
        signal,
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
        },
      }),
    5000,
    'supabase'
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Supabase request failed: ${res.status} ${body}`);
  }

  return res.json();
};

const buildLeaderboard = (teams, matches) => {
  const teamAggregates = new Map();

  teams.forEach((team) => {
    teamAggregates.set(team.id, {
      gamesWon: 0,
      gamesLost: 0,
      pointsFor: 0,
      pointsAgainst: 0,
    });
  });

  matches.forEach((match) => {
    const team1 = teamAggregates.get(match.team1_id);
    const team2 = teamAggregates.get(match.team2_id);

    if (team1) {
      team1.gamesWon += match.team1_wins;
      team1.gamesLost += match.team2_wins;
      team1.pointsFor += match.team1_points_for;
      team1.pointsAgainst += match.team2_points_for;
    }

    if (team2) {
      team2.gamesWon += match.team2_wins;
      team2.gamesLost += match.team1_wins;
      team2.pointsFor += match.team2_points_for;
      team2.pointsAgainst += match.team1_points_for;
    }
  });

  const entries = teams.map((team) => {
    const stats = teamAggregates.get(team.id);
    const gamesWon = stats?.gamesWon ?? 0;
    const gamesLost = stats?.gamesLost ?? 0;
    const totalGames = gamesWon + gamesLost;
    const winPct = totalGames > 0 ? gamesWon / totalGames : 0;

    return {
      team: team.name,
      wins: gamesWon,
      losses: gamesLost,
      winPct: Number(winPct.toFixed(3)),
      pointsFor: stats?.pointsFor ?? 0,
      pointsAgainst: stats?.pointsAgainst ?? 0,
    };
  });

  entries.sort((a, b) => {
    if (b.winPct !== a.winPct) return b.winPct - a.winPct;
    return b.pointsFor - a.pointsFor;
  });

  return entries;
};

const h = (tag, props, ...children) => {
  if (tag === 'div') {
    const style = props?.style ?? {};
    if (!('display' in style)) {
      props = {
        ...props,
        style: {
          display: 'flex',
          flexDirection: 'column',
          ...style,
        },
      };
    }
  }
  return React.createElement(tag, props, ...children);
};

const findDisplayViolations = (node, path = 'root') => {
  const issues = [];
  if (!node) return issues;

  const isElement = typeof node === 'object' && node.type;
  if (isElement) {
    const { type, props } = node;
    const children = React.Children.toArray(props?.children ?? []);
    if (type === 'div' && children.length > 1) {
      const style = props?.style ?? {};
      if (!('display' in style)) {
        issues.push({
          path,
          children: children.length,
          styleKeys: Object.keys(style),
        });
      }
    }
    children.forEach((child, idx) => {
      issues.push(...findDisplayViolations(child, `${path}.${type}[${idx}]`));
    });
  }

  return issues;
};

export default async function handler(req, res) {
  try {
    if (req?.url?.includes('ping=1')) {
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Cache-Control', 'no-store, max-age=0');
      res.statusCode = 200;
      res.end('pong');
      return;
    }

    const hostHeader =
      typeof req.headers?.get === 'function'
        ? req.headers.get('host')
        : req.headers?.host || req.headers?.Host || process.env.VERCEL_URL;
    const requestUrl = req.url.startsWith('http')
      ? req.url
      : `https://${hostHeader}${req.url}`;
    const { searchParams } = new URL(requestUrl);
    const type = searchParams.get('type');
    const divisionName = searchParams.get('division');
    const debug = searchParams.get('debug') === '1';

    if (type !== 'leaderboard') {
      res.statusCode = 400;
      res.end('Unsupported share type.');
      return;
    }

    if (!divisionName) {
      res.statusCode = 400;
      res.end('Missing division.');
      return;
    }

    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey =
      process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

    let probeUrl = null;
    let probeStatus = null;
    let probeBody = null;
    if (debug) {
      if (!supabaseUrl || !supabaseKey) {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 'no-store, max-age=0');
        res.statusCode = 200;
        res.end(
          JSON.stringify(
            {
              hostHeader,
              requestUrl,
              supabaseUrlSet: Boolean(supabaseUrl),
              supabaseKeySet: Boolean(supabaseKey),
            },
            null,
            2
          )
        );
        return;
      }

      probeUrl = `${supabaseUrl}/rest/v1/divisions?select=id&limit=1`;
      try {
        const probeRes = await withTimeout(
          (signal) =>
            fetch(probeUrl, {
              signal,
              headers: {
                apikey: supabaseKey,
                Authorization: `Bearer ${supabaseKey}`,
                'Content-Type': 'application/json',
              },
            }),
          5000,
          'supabase-probe'
        );
        probeStatus = probeRes.status;
        probeBody = (await probeRes.text()).slice(0, 500);
      } catch (err) {
        probeBody = String(err);
      }
    }

    if (!supabaseUrl || !supabaseKey) {
      res.statusCode = 500;
      res.end('Supabase env vars not configured.');
      return;
    }

    const divisions = await fetchSupabase(
      `${supabaseUrl}/rest/v1/divisions?select=id,name&name=eq.${encodeURIComponent(
        divisionName
      )}`,
      supabaseKey
    );

    if (!divisions.length) {
      res.statusCode = 404;
      res.end('Division not found.');
      return;
    }

    const divisionId = divisions[0].id;

    const teams = await fetchSupabase(
      `${supabaseUrl}/rest/v1/teams?select=id,name,division_id&division_id=eq.${divisionId}`,
      supabaseKey
    );

    const matches = await fetchSupabase(
      `${supabaseUrl}/rest/v1/matches?select=id,division_id,team1_id,team2_id,team1_wins,team2_wins,team1_points_for,team2_points_for&division_id=eq.${divisionId}`,
      supabaseKey
    );

    const entries = buildLeaderboard(teams, matches);
    const fontResult = await fontCache;

    if (debug) {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Cache-Control', 'no-store, max-age=0');
      res.statusCode = 200;
      res.end(
        JSON.stringify(
          {
            divisionName,
            teams: teams.length,
            matches: matches.length,
            entries: entries.length,
            fontsLoaded: Boolean(fontResult && !('error' in fontResult)),
            fontError: fontResult && 'error' in fontResult ? fontResult.error : null,
            hostHeader,
            requestUrl,
            supabaseUrlSet: Boolean(supabaseUrl),
            supabaseKeySet: Boolean(supabaseKey),
            supabaseKeyPrefix: supabaseKey ? supabaseKey.slice(0, 6) : null,
            probeUrl,
            probeStatus,
            probeBody,
          },
          null,
          2
        )
      );
      return;
    }

    if (!fontResult || 'error' in fontResult) {
      res.statusCode = 500;
      res.end('Failed to load fonts.');
      return;
    }

    const tree = h(
      'div',
      {
        style: {
          width: 1080,
          height: 1350,
          backgroundColor: '#FFFEFC',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          color: '#0F172A',
          fontFamily: 'Open Sans',
        },
      },
      h('div', {
        style: {
          position: 'absolute',
          inset: 0,
          opacity: 0.05,
          backgroundImage: `url(${noiseSvg})`,
        },
      }),
      h('div', {
        style: {
          position: 'absolute',
          top: -200,
          right: -100,
          width: 800,
          height: 800,
          backgroundColor: 'rgba(142, 209, 252, 0.06)',
          borderRadius: 9999,
          filter: 'blur(60px)',
        },
      }),
      h('div', {
        style: {
          position: 'absolute',
          bottom: -200,
          left: -100,
          width: 600,
          height: 600,
          backgroundColor: 'rgba(247, 191, 38, 0.08)',
          borderRadius: 9999,
          filter: 'blur(60px)',
        },
      }),
      h(
        'div',
        { style: { padding: '80px 48px 32px', position: 'relative', zIndex: 2 } },
        h(
          'div',
          {
            style: {
              borderBottom: '6px solid rgb(0,85,150)',
              paddingBottom: 32,
              display: 'flex',
              flexDirection: 'column',
            },
          },
          h(
            'div',
            {
              style: {
                fontFamily: 'Montserrat',
                fontWeight: 800,
                fontStyle: 'italic',
                fontSize: 64,
                color: 'rgb(0,85,150)',
                textTransform: 'uppercase',
                letterSpacing: '-0.04em',
                lineHeight: 0.95,
                marginBottom: 24,
                display: 'flex',
                flexDirection: 'column',
              },
            },
            'La Roche Posay',
            h('br'),
            'Corporate Pickleball League'
          ),
          h(
            'div',
            { style: { display: 'flex', alignItems: 'center', gap: 24 } },
            h(
              'div',
              {
                style: {
                  backgroundColor: 'rgb(247,191,38)',
                  color: 'rgb(0,85,150)',
                  padding: '16px 40px',
                  borderRadius: 9999,
                  fontFamily: 'Montserrat',
                  fontWeight: 800,
                  fontStyle: 'italic',
                  fontSize: 34,
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  transform: 'skewX(-12deg)',
                  border: '2px solid #fff',
                },
              },
              h('span', { style: { display: 'block', transform: 'skewX(12deg)' } }, divisionName)
            ),
            h(
              'span',
              {
                style: {
                  fontFamily: 'Roboto Mono',
                  fontWeight: 700,
                  fontSize: 26,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: '#9CA3AF',
                },
              },
              'Standings'
            )
          )
        )
      ),
      h(
        'div',
        {
          style: {
            padding: '16px 48px 8px',
            display: 'flex',
            alignItems: 'center',
            fontFamily: 'Montserrat',
            fontWeight: 800,
            fontStyle: 'italic',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            color: '#9CA3AF',
            fontSize: 22,
            zIndex: 2,
          },
        },
        h('div', { style: { width: 96, textAlign: 'center' } }),
        h(
          'div',
          {
            style: {
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              marginLeft: -10,
              paddingLeft: 32,
              paddingRight: 24,
            },
          },
          h('div', { style: { flex: 1 } }, 'Team'),
          h('div', { style: { width: 144, textAlign: 'center' } }, 'W-L'),
          h('div', { style: { width: 144, textAlign: 'center' } }, '%'),
          h('div', { style: { width: 112, textAlign: 'center' } }, 'PTS')
        )
      ),
      h(
        'div',
        {
          style: {
            flex: 1,
            padding: '0 48px',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            position: 'relative',
            zIndex: 2,
          },
        },
        entries.map((entry, index) => {
          const isTop3 = index < 3;
          const rankBg =
            index === 0
              ? 'rgb(247,191,38)'
              : index === 1
              ? '#E5E7EB'
              : 'rgb(254, 215, 170)';
          const rankColor =
            index === 0 ? 'rgb(0,85,150)' : index === 1 ? '#4B5563' : '#9A3412';
          const pctColor = isTop3 ? 'rgb(0,85,150)' : '#9CA3AF';

          return h(
            'div',
            { key: `${entry.team}-${index}`, style: { display: 'flex', alignItems: 'center', height: 96 } },
            h(
              'div',
              {
                style: {
                  width: 96,
                  height: 96,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                },
              },
              isTop3
                ? h(
                    'div',
                    {
                      style: {
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: 'Montserrat',
                        fontWeight: 800,
                        fontSize: 36,
                        transform: 'skewX(-12deg)',
                        backgroundColor: rankBg,
                        color: rankColor,
                        border: '2px solid #fff',
                      },
                    },
                    h('span', { style: { display: 'block', transform: 'skewX(12deg)' } }, index + 1)
                  )
                : h(
                    'span',
                    {
                      style: {
                        fontFamily: 'Montserrat',
                        fontWeight: 800,
                        fontSize: 36,
                        color: '#D1D5DB',
                      },
                    },
                    index + 1
                  )
            ),
            h(
              'div',
              {
                style: {
                  flex: 1,
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#fff',
                  border: '1px solid #F3F4F6',
                  borderTopRightRadius: 24,
                  borderBottomRightRadius: 24,
                  paddingLeft: 32,
                  paddingRight: 24,
                  marginLeft: -10,
                },
              },
              h(
                'div',
                { style: { flex: 1, paddingRight: 16, overflow: 'hidden' } },
                h(
                  'span',
                  {
                    style: {
                      fontFamily: 'Montserrat',
                      fontWeight: 800,
                      fontStyle: 'italic',
                      fontSize: 30,
                      color: 'rgb(0,85,150)',
                      textTransform: 'uppercase',
                      letterSpacing: '-0.02em',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: 'block',
                    },
                  },
                  entry.team
                )
              ),
              h(
                'div',
                { style: { display: 'flex', alignItems: 'center' } },
                h(
                  'div',
                  {
                    style: {
                      width: 144,
                      textAlign: 'center',
                      fontFamily: 'Roboto Mono',
                      fontWeight: 700,
                      fontSize: 26,
                      color: '#4B5563',
                    },
                  },
                  `${entry.wins}-${entry.losses}`
                ),
                h(
                  'div',
                  {
                    style: {
                      width: 144,
                      textAlign: 'center',
                      fontFamily: 'Montserrat',
                      fontWeight: 800,
                      fontStyle: 'italic',
                      fontSize: 34,
                      letterSpacing: '-0.02em',
                      color: pctColor,
                    },
                  },
                  `${(entry.winPct * 100).toFixed(0)}%`
                ),
                h(
                  'div',
                  {
                    style: {
                      width: 112,
                      textAlign: 'center',
                      fontFamily: 'Roboto Mono',
                      fontWeight: 700,
                      fontSize: 26,
                      color: '#6B7280',
                    },
                  },
                  String(entry.pointsFor)
                )
              )
            )
          );
        })
      ),
      h(
        'div',
        {
          style: {
            padding: '64px 0 48px',
            textAlign: 'center',
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          },
        },
        h('div', {
          style: {
            width: 192,
            height: 6,
            backgroundColor: '#E5E7EB',
            margin: '0 auto 32px',
            borderRadius: 9999,
          },
        }),
        h(
          'div',
          {
            style: {
              fontFamily: 'Montserrat',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.3em',
              fontSize: 22,
              color: '#9CA3AF',
            },
          },
          'Corporate Pickleball League'
        )
      )
    );

    const violations = findDisplayViolations(tree);
    if (violations.length) {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Cache-Control', 'no-store, max-age=0');
      res.statusCode = 500;
      res.end(JSON.stringify({ violations: violations.slice(0, 20) }, null, 2));
      return;
    }

    const imageResponse = new ImageResponse(
      tree,
      {
        width: 1080,
        height: 1350,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
        fonts: fontResult
          ? [
              {
                name: 'Montserrat',
                data: fontResult.montserrat,
                weight: 800,
                style: 'normal',
              },
              {
                name: 'Montserrat',
                data: fontResult.montserratItalic,
                weight: 800,
                style: 'italic',
              },
              {
                name: 'Open Sans',
                data: fontResult.openSans,
                weight: 400,
                style: 'normal',
              },
              {
                name: 'Roboto Mono',
                data: fontResult.robotoMono,
                weight: 700,
                style: 'normal',
              },
            ]
          : [],
      }
    );
    const buffer = Buffer.from(await imageResponse.arrayBuffer());
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    res.statusCode = 200;
    res.end(buffer);
    return;
  } catch (error) {
    console.error('OG generation error', error);
    res.statusCode = 500;
    res.end(`Failed to generate image: ${error?.message ?? String(error)}`);
  }
}
