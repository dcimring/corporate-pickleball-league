import { ImageResponse } from '@vercel/og';
import { createClient } from '@supabase/supabase-js';

export const config = {
  runtime: 'edge',
};

// Supabase environment variables
// Note: Vercel Edge runtime supports standard process.env but TS may complain without @types/node.
// We cast to any to bypass the 'process' check if needed, or use a fallback.
const env = (typeof process !== 'undefined' ? process.env : {}) as Record<string, string>;
const supabaseUrl = env.VITE_SUPABASE_URL || env.SUPABASE_URL!;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// "Warm Paper" Grainy Texture SVG (Satori-compatible simple pattern)
const GRAIN_TEXTURE = `data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='2' height='2' fill='%23000' opacity='0.05'/%3E%3Crect x='10' y='10' width='1' height='1' fill='%23000' opacity='0.03'/%3E%3Crect x='50' y='30' width='1' height='1' fill='%23000' opacity='0.04'/%3E%3C/svg%3E`;

// Helper to fetch fonts
async function loadFont(family: string, weight: number, style: 'normal' | 'italic' = 'normal') {
  const familyName = family.replace(/\+/g, ' ');
  const url = `https://fonts.googleapis.com/css2?family=${family}:ital,wght@${style === 'italic' ? 1 : 0},${weight}&display=swap`;
  
  // Need a modern browser user agent to get TTF/WOFF2 instead of ancient formats
  const cssResponse = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
    }
  });
  
  if (!cssResponse.ok) throw new Error(`Failed to fetch CSS for ${familyName}`);
  const css = await cssResponse.text();

  // Robust regex to capture the URL from src: url(...)
  const fontUrlMatch = css.match(/src:\s*url\(([^)]+)\)/i);
  if (!fontUrlMatch) throw new Error(`Could not find font resource for ${familyName}`);
  
  const fontUrl = fontUrlMatch[1].replace(/['"]/g, '');
  const res = await fetch(fontUrl);
  if (!res.ok) throw new Error(`Failed to fetch font from ${fontUrl}`);

  return res.arrayBuffer();
}

export default async function handler(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'leaderboard';
    const divisionName = searchParams.get('division');
    const matchId = searchParams.get('matchId');

    // Load fonts in parallel
    const [montserratBold, montserratBlack, montserratBlackItalic, openSansBold] = await Promise.all([
      loadFont('Montserrat', 700),
      loadFont('Montserrat', 900),
      loadFont('Montserrat', 900, 'italic'),
      loadFont('Open+Sans', 700)
    ]);

    const fonts = [
      { name: 'Montserrat', data: montserratBold, weight: 700 as const, style: 'normal' as const },
      { name: 'Montserrat', data: montserratBlack, weight: 900 as const, style: 'normal' as const },
      { name: 'Montserrat', data: montserratBlackItalic, weight: 900 as const, style: 'italic' as const },
      { name: 'Open Sans', data: openSansBold, weight: 700 as const, style: 'normal' as const },
    ];

    if (type === 'leaderboard' && divisionName) {
      return await renderLeaderboard(divisionName, fonts);
    }

    if (type === 'match' && matchId) {
      return await renderMatch(matchId, fonts);
    }

    return new Response('Invalid request', { status: 400 });
  } catch (e: unknown) {
    const error = e as Error;
    console.error(`OG Generation Error: ${error.message}`);
    return new Response(`Failed to generate the image: ${error.message}`, { status: 500 });
  }
}

async function renderLeaderboard(divisionName: string, fonts: any[]) {
  const { data: div } = await supabase.from('divisions').select('*').eq('name', divisionName).single();
  if (!div) throw new Error('Division not found');

  const { data: teams } = await supabase.from('teams').select('id, name').eq('division_id', div.id);
  const { data: matches } = await supabase.from('matches').select('*').eq('division_id', div.id);

  if (!teams) throw new Error('Teams not found');

  const teamAggregates = new Map();
  teams.forEach(t => teamAggregates.set(t.id, { wins: 0, losses: 0, pointsFor: 0 }));

  matches?.forEach(m => {
    const t1 = teamAggregates.get(m.team1_id);
    const t2 = teamAggregates.get(m.team2_id);
    if (t1) { t1.wins += m.team1_wins; t1.losses += m.team2_wins; t1.pointsFor += m.team1_points_for; }
    if (t2) { t2.wins += m.team2_wins; t2.losses += m.team1_wins; t2.pointsFor += m.team2_points_for; }
  });

  const entries = teams.map(t => {
    const s = teamAggregates.get(t.id);
    const total = s.wins + s.losses;
    return { team: t.name, wins: s.wins, losses: s.losses, winPct: total > 0 ? s.wins / total : 0, pointsFor: s.pointsFor };
  }).sort((a, b) => b.winPct !== a.winPct ? b.winPct - a.winPct : b.pointsFor - a.pointsFor);

  return new ImageResponse(
    (
      <div style={{
        height: '100%', width: '100%', display: 'flex', flexDirection: 'column',
        backgroundColor: '#FFFEFC', padding: '80px', position: 'relative', overflow: 'hidden',
        fontFamily: 'Open Sans'
      }}>
        {/* Grainy Texture */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${GRAIN_TEXTURE})`, opacity: 0.1 }} />
        
        {/* Branded Header */}
        <div style={{ display: 'flex', flexDirection: 'column', borderBottom: '10px solid #005596', paddingBottom: '40px', marginBottom: '60px', position: 'relative' }}>
          <h1 style={{ fontSize: '80px', fontWeight: 900, fontStyle: 'italic', color: '#005596', margin: 0, textTransform: 'uppercase', lineHeight: 0.9, fontFamily: 'Montserrat' }}>
            Corporate<br />Pickleball League
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', marginTop: '30px' }}>
            <div style={{ backgroundColor: '#FFC72C', color: '#005596', padding: '15px 40px', borderRadius: '100px', fontSize: '40px', fontWeight: 900, fontStyle: 'italic', textTransform: 'uppercase', marginRight: '30px', fontFamily: 'Montserrat' }}>
              {divisionName}
            </div>
            <span style={{ fontSize: '32px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.3em', fontFamily: 'Montserrat' }}>Standings</span>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
          {entries.slice(0, 8).map((entry, i) => (
            <div key={entry.team} style={{ display: 'flex', alignItems: 'center', height: '100px' }}>
              <div style={{ 
                width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: i === 0 ? '#FFC72C' : i === 1 ? '#e2e8f0' : i === 2 ? '#ffedd5' : 'transparent',
                color: i < 3 ? '#005596' : '#cbd5e1', fontSize: '48px', fontWeight: 900, fontStyle: 'italic',
                borderRadius: i < 3 ? '20px' : '0', marginRight: '20px', fontFamily: 'Montserrat'
              }}>
                <span style={{ transform: 'rotate(-5deg)' }}>{i + 1}</span>
              </div>
              <div style={{ 
                flex: 1, height: '100%', display: 'flex', alignItems: 'center', backgroundColor: 'white',
                border: '1px solid #f1f5f9', borderRadius: '0 30px 30px 0', padding: '0 40px',
                boxShadow: '10px 10px 0px rgba(0,0,0,0.02)'
              }}>
                <span style={{ flex: 1, fontSize: '42px', fontWeight: 900, fontStyle: 'italic', color: '#005596', textTransform: 'uppercase', letterSpacing: '-0.02em', fontFamily: 'Montserrat' }}>
                  {entry.team}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
                  <span style={{ fontSize: '32px', color: '#64748b', fontWeight: 700 }}>{entry.wins}-{entry.losses}</span>
                  <span style={{ fontSize: '42px', color: i < 3 ? '#005596' : '#94a3b8', fontWeight: 900, fontStyle: 'italic', fontFamily: 'Montserrat' }}>
                    {(entry.winPct * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ marginTop: 'auto', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: '200px', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '100px', marginBottom: '30px' }} />
          <p style={{ fontSize: '28px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.4em', fontFamily: 'Montserrat' }}>
            Cayman Corporate League
          </p>
        </div>
      </div>
    ),
    { width: 1080, height: 1350, fonts }
  );
}

async function renderMatch(matchId: string, fonts: any[]) {
  const { data: m } = await supabase.from('matches').select('*').eq('id', matchId).single();
  if (!m) throw new Error('Match not found');

  const { data: teams } = await supabase.from('teams').select('id, name').in('id', [m.team1_id, m.team2_id]);
  const t1 = teams?.find(t => t.id === m.team1_id)?.name || 'Team 1';
  const t2 = teams?.find(t => t.id === m.team2_id)?.name || 'Team 2';

  const isW1 = m.team1_wins > m.team2_wins;
  const isW2 = m.team2_wins > m.team1_wins;

  const matchDate = new Date(m.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }).toUpperCase();

  return new ImageResponse(
    (
      <div style={{
        height: '100%', width: '100%', display: 'flex', flexDirection: 'column',
        backgroundColor: '#FFFEFC', alignItems: 'center', justifyContent: 'center', padding: '100px',
        position: 'relative', overflow: 'hidden', fontFamily: 'Open Sans'
      }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${GRAIN_TEXTURE})`, opacity: 0.1 }} />
        
        {/* Dynamic Backgrounds */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '800px', background: 'linear-gradient(to bottom, rgba(142,209,252,0.1), transparent)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '800px', background: 'linear-gradient(to top, rgba(247,191,38,0.1), transparent)' }} />

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '80px', position: 'relative' }}>
          <h3 style={{ fontSize: '40px', fontWeight: 900, fontStyle: 'italic', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.6em', margin: 0, fontFamily: 'Montserrat' }}>Match Result</h3>
          <div style={{ height: '12px', width: '160px', backgroundColor: '#005596', borderRadius: '100px', marginTop: '20px' }} />
        </div>

        <div style={{
          width: '100%', backgroundColor: 'white', borderRadius: '80px', padding: '100px',
          display: 'flex', flexDirection: 'column', gap: '60px', boxShadow: '0 50px 100px -20px rgba(0, 0, 0, 0.1)',
          border: '1px solid #f1f5f9', position: 'relative', overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: 0, left: '80px', right: '80px', height: '20px', backgroundColor: '#8ed1fc', borderRadius: '0 0 20px 20px' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '72px', fontWeight: 900, fontStyle: 'italic', color: isW1 ? '#005596' : '#cbd5e1', textTransform: 'uppercase', flex: 1, letterSpacing: '-0.03em', fontFamily: 'Montserrat' }}>{t1}</span>
            <span style={{ fontSize: '180px', fontWeight: 900, color: isW1 ? '#005596' : '#f1f5f9', lineHeight: 1, fontFamily: 'Montserrat' }}>{m.team1_wins}</span>
          </div>

          <div style={{ height: '3px', backgroundColor: '#f1f5f9', width: '100%', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <span style={{ backgroundColor: 'white', padding: '0 30px', color: '#e2e8f0', fontSize: '32px', fontWeight: 900, fontStyle: 'italic', fontFamily: 'Montserrat' }}>VS</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '72px', fontWeight: 900, fontStyle: 'italic', color: isW2 ? '#005596' : '#cbd5e1', textTransform: 'uppercase', flex: 1, letterSpacing: '-0.03em', fontFamily: 'Montserrat' }}>{t2}</span>
            <span style={{ fontSize: '180px', fontWeight: 900, color: isW2 ? '#005596' : '#f1f5f9', lineHeight: 1, fontFamily: 'Montserrat' }}>{m.team2_wins}</span>
          </div>
        </div>

        <div style={{
          backgroundColor: '#005596', color: 'white', padding: '30px 80px', borderRadius: '150px',
          marginTop: '80px', fontSize: '56px', fontWeight: 900, fontStyle: 'italic', textTransform: 'uppercase',
          border: '10px solid white', boxShadow: '0 20px 30px -10px rgba(0, 0, 0, 0.2)', transform: 'rotate(-2deg)', fontFamily: 'Montserrat'
        }}>
          {isW1 ? t1 : isW2 ? t2 : 'Draw'} Wins!
        </div>

        <div style={{ marginTop: '60px', fontSize: '36px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.3em', fontFamily: 'Montserrat' }}>
          {matchDate}
        </div>

        <div style={{ position: 'absolute', bottom: '80px', textAlign: 'center' }}>
          <p style={{ fontSize: '32px', fontWeight: 700, color: '#005596', textTransform: 'uppercase', letterSpacing: '0.4em', fontFamily: 'Montserrat' }}>
            Cayman Corporate League
          </p>
        </div>
      </div>
    ),
    { width: 1080, height: 1920, fonts }
  );
}

