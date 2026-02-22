import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

const fetchGoogleFont = async (
  cssUrl: string,
  fontStyle: 'normal' | 'italic',
  fontWeight: number
) => {
  const css = await fetch(cssUrl, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    },
  }).then((res) => res.text());

  const regex = new RegExp(
    `font-style: ${fontStyle};[\\s\\S]*?font-weight: ${fontWeight};[\\s\\S]*?src: url\\(([^)]+)\\) format\\('woff2'\\)`,
    'm'
  );
  const match = css.match(regex);
  if (!match) {
    throw new Error(`Font not found for ${cssUrl} ${fontStyle} ${fontWeight}`);
  }

  return fetch(match[1]).then((res) => res.arrayBuffer());
};

const fontCache: Promise<{
  montserrat: ArrayBuffer;
  montserratItalic: ArrayBuffer;
  openSans: ArrayBuffer;
  robotoMono: ArrayBuffer;
}> = Promise.all([
  fetchGoogleFont(
    'https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,800;1,800&display=swap',
    'normal',
    800
  ),
  fetchGoogleFont(
    'https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,800;1,800&display=swap',
    'italic',
    800
  ),
  fetchGoogleFont(
    'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap',
    'normal',
    400
  ),
  fetchGoogleFont(
    'https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@700&display=swap',
    'normal',
    700
  ),
]).then(([montserrat, montserratItalic, openSans, robotoMono]) => ({
  montserrat,
  montserratItalic,
  openSans,
  robotoMono,
}));

type LeaderboardEntry = {
  team: string;
  wins: number;
  losses: number;
  winPct: number;
  pointsFor: number;
  pointsAgainst: number;
};

type DivisionRow = {
  id: string;
  name: string;
};

type TeamRow = {
  id: string;
  name: string;
  division_id: string;
};

type MatchRow = {
  id: string;
  division_id: string;
  team1_id: string;
  team2_id: string;
  team1_wins: number;
  team2_wins: number;
  team1_points_for: number;
  team2_points_for: number;
};

const noiseSvg = `data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E`;

const fetchSupabase = async <T,>(url: string, supabaseKey: string): Promise<T> => {
  const res = await fetch(url, {
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Supabase request failed: ${res.status} ${body}`);
  }

  return res.json() as Promise<T>;
};

const buildLeaderboard = (teams: TeamRow[], matches: MatchRow[]): LeaderboardEntry[] => {
  const teamAggregates = new Map<
    string,
    {
      gamesWon: number;
      gamesLost: number;
      pointsFor: number;
      pointsAgainst: number;
    }
  >();

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

export default async function handler(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const divisionName = searchParams.get('division');

    if (type !== 'leaderboard') {
      return new Response('Unsupported share type.', { status: 400 });
    }

    if (!divisionName) {
      return new Response('Missing division.', { status: 400 });
    }

    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return new Response('Supabase env vars not configured.', { status: 500 });
    }

    const divisions = await fetchSupabase<DivisionRow[]>(
      `${supabaseUrl}/rest/v1/divisions?select=id,name&name=eq.${encodeURIComponent(
        divisionName
      )}`,
      supabaseKey
    );

    if (!divisions.length) {
      return new Response('Division not found.', { status: 404 });
    }

    const divisionId = divisions[0].id;

    const teams = await fetchSupabase<TeamRow[]>(
      `${supabaseUrl}/rest/v1/teams?select=id,name,division_id&division_id=eq.${divisionId}`,
      supabaseKey
    );

    const matches = await fetchSupabase<MatchRow[]>(
      `${supabaseUrl}/rest/v1/matches?select=id,division_id,team1_id,team2_id,team1_wins,team2_wins,team1_points_for,team2_points_for&division_id=eq.${divisionId}`,
      supabaseKey
    );

    const entries = buildLeaderboard(teams, matches);
    const { montserrat, montserratItalic, openSans, robotoMono } = await fontCache;

    return new ImageResponse(
      (
        <div
          style={{
            width: 1080,
            height: 1350,
            backgroundColor: '#FFFEFC',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            color: '#0F172A',
            fontFamily: 'Open Sans',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0.05,
              backgroundImage: `url(${noiseSvg})`,
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: -200,
              right: -100,
              width: 800,
              height: 800,
              backgroundColor: 'rgba(142, 209, 252, 0.06)',
              borderRadius: 9999,
              filter: 'blur(60px)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: -200,
              left: -100,
              width: 600,
              height: 600,
              backgroundColor: 'rgba(247, 191, 38, 0.08)',
              borderRadius: 9999,
              filter: 'blur(60px)',
            }}
          />

          <div style={{ padding: '80px 48px 32px', position: 'relative', zIndex: 2 }}>
            <div
              style={{
                borderBottom: '6px solid rgb(0,85,150)',
                paddingBottom: 32,
              }}
            >
              <div
                style={{
                  fontFamily: 'Montserrat',
                  fontWeight: 800,
                  fontStyle: 'italic',
                  fontSize: 64,
                  color: 'rgb(0,85,150)',
                  textTransform: 'uppercase',
                  letterSpacing: '-0.04em',
                  lineHeight: 0.95,
                  marginBottom: 24,
                }}
              >
                La Roche Posay
                <br />
                Corporate Pickleball League
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                <div
                  style={{
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
                  }}
                >
                  <span style={{ display: 'block', transform: 'skewX(12deg)' }}>
                    {divisionName}
                  </span>
                </div>
                <span
                  style={{
                    fontFamily: 'Roboto Mono',
                    fontWeight: 700,
                    fontSize: 26,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: '#9CA3AF',
                  }}
                >
                  Standings
                </span>
              </div>
            </div>
          </div>

          <div
            style={{
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
            }}
          >
            <div style={{ width: 96, textAlign: 'center' }} />
            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                marginLeft: -10,
                paddingLeft: 32,
                paddingRight: 24,
              }}
            >
              <div style={{ flex: 1 }}>Team</div>
              <div style={{ width: 144, textAlign: 'center' }}>W-L</div>
              <div style={{ width: 144, textAlign: 'center' }}>%</div>
              <div style={{ width: 112, textAlign: 'center' }}>PTS</div>
            </div>
          </div>

          <div
            style={{
              flex: 1,
              padding: '0 48px',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              position: 'relative',
              zIndex: 2,
            }}
          >
            {entries.map((entry, index) => {
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

              return (
                <div
                  key={`${entry.team}-${index}`}
                  style={{ display: 'flex', alignItems: 'center', height: 96 }}
                >
                  <div
                    style={{
                      width: 96,
                      height: 96,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {isTop3 ? (
                      <div
                        style={{
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
                        }}
                      >
                        <span style={{ display: 'block', transform: 'skewX(12deg)' }}>
                          {index + 1}
                        </span>
                      </div>
                    ) : (
                      <span
                        style={{
                          fontFamily: 'Montserrat',
                          fontWeight: 800,
                          fontSize: 36,
                          color: '#D1D5DB',
                        }}
                      >
                        {index + 1}
                      </span>
                    )}
                  </div>

                  <div
                    style={{
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
                    }}
                  >
                    <div style={{ flex: 1, paddingRight: 16, overflow: 'hidden' }}>
                      <span
                        style={{
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
                        }}
                      >
                        {entry.team}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div
                        style={{
                          width: 144,
                          textAlign: 'center',
                          fontFamily: 'Roboto Mono',
                          fontWeight: 700,
                          fontSize: 26,
                          color: '#4B5563',
                        }}
                      >
                        {entry.wins}-{entry.losses}
                      </div>
                      <div
                        style={{
                          width: 144,
                          textAlign: 'center',
                          fontFamily: 'Montserrat',
                          fontWeight: 800,
                          fontStyle: 'italic',
                          fontSize: 34,
                          letterSpacing: '-0.02em',
                          color: pctColor,
                        }}
                      >
                        {(entry.winPct * 100).toFixed(0)}%
                      </div>
                      <div
                        style={{
                          width: 112,
                          textAlign: 'center',
                          fontFamily: 'Roboto Mono',
                          fontWeight: 700,
                          fontSize: 26,
                          color: '#6B7280',
                        }}
                      >
                        {entry.pointsFor}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div
            style={{
              padding: '64px 0 48px',
              textAlign: 'center',
              zIndex: 2,
            }}
          >
            <div
              style={{
                width: 192,
                height: 6,
                backgroundColor: '#E5E7EB',
                margin: '0 auto 32px',
                borderRadius: 9999,
              }}
            />
            <div
              style={{
                fontFamily: 'Montserrat',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.3em',
                fontSize: 22,
                color: '#9CA3AF',
              }}
            >
              Corporate Pickleball League
            </div>
          </div>
        </div>
      ),
      {
        width: 1080,
        height: 1350,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
        fonts: [
          {
            name: 'Montserrat',
            data: montserrat,
            weight: 800,
            style: 'normal',
          },
          {
            name: 'Montserrat',
            data: montserratItalic,
            weight: 800,
            style: 'italic',
          },
          {
            name: 'Open Sans',
            data: openSans,
            weight: 400,
            style: 'normal',
          },
          {
            name: 'Roboto Mono',
            data: robotoMono,
            weight: 700,
            style: 'normal',
          },
        ],
      }
    );
  } catch (error) {
    console.error('OG generation error', error);
    return new Response('Failed to generate image.', { status: 500 });
  }
}
