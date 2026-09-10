// One-time cutover check: compares standings computed by the new Convex code
// from a results CSV against the live Supabase-backed site's numbers, using a
// verbatim copy of the old client-side aggregation.
//
//   npx esbuild scripts/parity.ts --bundle --platform=node --format=esm --outfile=/tmp/parity.mjs \
//     && node --env-file=.env /tmp/parity.mjs [path/to/Export.csv]
//
// Needs VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (read-only) in app/.env.
// Delete this script once Supabase is retired.

import { readFileSync } from 'node:fs';
import { parseResultsCsv } from '../convex/lib/csv';
import { buildLeagueData, type LeaderboardEntry } from '../convex/lib/aggregate';

const csvPath = process.argv[2] ?? 'tests/fixtures/Export-5.csv';
const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY;
if (!url || !key) {
  console.error('Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY');
  process.exit(2);
}

interface DivisionRow { id: string; name: string }
interface TeamRow { id: string; name: string; division_id: string }
interface MatchRow {
  id: string; division_id: string; team1_id: string; team2_id: string; date: string;
  team1_wins: number; team2_wins: number; team1_points_for: number; team2_points_for: number;
}

const get = async <T,>(path: string): Promise<T> => {
  const res = await fetch(`${url}/rest/v1/${path}`, { headers: { apikey: key, Authorization: `Bearer ${key}` } });
  if (!res.ok) throw new Error(`${path}: ${res.status}`);
  return (await res.json()) as T;
};

// --- verbatim port of the old app/src/lib/data.ts leaderboard math ---
const legacyLeaderboard = (divisions: DivisionRow[], teams: TeamRow[], matches: MatchRow[]) => {
  const out: Record<string, LeaderboardEntry[]> = {};
  for (const div of divisions) {
    const divTeams = teams.filter((t) => t.division_id === div.id);
    const divMatches = matches.filter((m) => m.division_id === div.id);
    const agg = new Map<string, { gamesWon: number; gamesLost: number; pointsFor: number; pointsAgainst: number }>();
    divTeams.forEach((t) => agg.set(t.id, { gamesWon: 0, gamesLost: 0, pointsFor: 0, pointsAgainst: 0 }));
    divMatches.forEach((m) => {
      const t1 = agg.get(m.team1_id);
      const t2 = agg.get(m.team2_id);
      if (t1) {
        t1.gamesWon += m.team1_wins; t1.gamesLost += m.team2_wins;
        t1.pointsFor += m.team1_points_for; t1.pointsAgainst += m.team2_points_for;
      }
      if (t2) {
        t2.gamesWon += m.team2_wins; t2.gamesLost += m.team1_wins;
        t2.pointsFor += m.team2_points_for; t2.pointsAgainst += m.team1_points_for;
      }
    });
    const entries = divTeams.map((t) => {
      const s = agg.get(t.id)!;
      const total = s.gamesWon + s.gamesLost;
      const winPct = total > 0 ? s.gamesWon / total : 0;
      return { team: t.name, wins: s.gamesWon, losses: s.gamesLost, winPct: Number(winPct.toFixed(3)), pointsFor: s.pointsFor, pointsAgainst: s.pointsAgainst };
    });
    entries.sort((a, b) => (b.winPct !== a.winPct ? b.winPct - a.winPct : b.pointsFor - a.pointsFor));
    out[div.name] = entries;
  }
  return out;
};

const [divisions, teams, matches] = await Promise.all([
  get<DivisionRow[]>('divisions?select=id,name'),
  get<TeamRow[]>('teams?select=id,name,division_id'),
  get<MatchRow[]>('matches?select=*&limit=5000'),
]);
const legacy = legacyLeaderboard(divisions, teams, matches);
const legacyCounts = Object.fromEntries(divisions.map((d) => [d.name, matches.filter((m) => m.division_id === d.id).length]));

const next = buildLeagueData({ season: 'parity', importedAt: 0, rows: parseResultsCsv(readFileSync(csvPath, 'utf8')).rows });

let failures = 0;
const fmt = (e: LeaderboardEntry) => `${e.team} ${e.wins}-${e.losses} ${e.winPct} ${e.pointsFor}/${e.pointsAgainst}`;

for (const [name, entries] of Object.entries(next.leaderboard)) {
  const old = legacy[name];
  const newCount = next.matches[name].length;
  const oldCount = legacyCounts[name] ?? 0;
  if (!old) { console.log(`! ${name}: not in Supabase (new division)`); continue; }
  if (newCount !== oldCount) {
    console.log(`~ ${name}: match counts differ (csv ${newCount}, supabase ${oldCount}) — skipped, expected only for CPL`);
    if (name !== 'Cayman Premier League') failures++;
    continue;
  }
  const a = entries.map(fmt);
  // Teams that exist in Supabase with no games are leftovers (mis-filed or stale) that the CSV cannot produce.
  const ghosts = old.filter((e) => e.wins + e.losses === 0 && !entries.some((n) => n.team === e.team));
  if (ghosts.length) console.log(`  i ${name}: ignoring ${ghosts.length} Supabase-only team(s) with no games: ${ghosts.map((g) => g.team).join(', ')}`);
  const b = old.filter((e) => !ghosts.includes(e)).map(fmt);
  const sameSet = [...a].sort().join('\n') === [...b].sort().join('\n');
  const sameOrder = a.join('\n') === b.join('\n');
  if (sameOrder) console.log(`✓ ${name}: identical (${newCount} matches)`);
  else if (sameSet) console.log(`~ ${name}: same numbers, tied teams ordered differently (alphabetical now)\n    new: ${a.join(' | ')}\n    old: ${b.join(' | ')}`);
  else { failures++; console.log(`✗ ${name}: DIFFERENT\n    new: ${a.join('\n         ')}\n    old: ${b.join('\n         ')}`); }
}
for (const name of Object.keys(legacy)) {
  if (!next.leaderboard[name]) console.log(`- ${name}: in Supabase only (${legacyCounts[name]} matches) — dropped as empty/stale`);
}
process.exit(failures ? 1 : 0);
