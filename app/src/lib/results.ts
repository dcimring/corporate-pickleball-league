import type { Match } from '../types';

export type Outcome = 'team1' | 'team2' | 'draw';
export type FormResult = 'W' | 'D' | 'L';

/**
 * Who won a match: more games wins; level on games goes to more points;
 * level on both is a draw. Same rule the match cards have always used.
 */
export const matchOutcome = (m: Match): Outcome => {
  if (m.team1Wins !== m.team2Wins) return m.team1Wins > m.team2Wins ? 'team1' : 'team2';
  if (m.team1Points !== m.team2Points) return m.team1Points > m.team2Points ? 'team1' : 'team2';
  return 'draw';
};

export interface TeamRecord {
  won: number;
  drawn: number;
  lost: number;
  /** Up to the last five results, oldest first. */
  form: FormResult[];
}

const FORM_LENGTH = 5;

/**
 * Match (not game) record and recent form per team. `matches` is a
 * division's list as `league.get` returns it: newest date first, sheet order
 * within a date. Derived client-side so the Convex payload stays unchanged.
 */
export const teamRecords = (matches: Match[]): Map<string, TeamRecord> => {
  const records = new Map<string, TeamRecord>();
  const get = (team: string) => {
    let r = records.get(team);
    if (!r) {
      r = { won: 0, drawn: 0, lost: 0, form: [] };
      records.set(team, r);
    }
    return r;
  };

  // Walk oldest → newest. Reversing the newest-first list also reverses the
  // sheet order within a date, so sort by date with a stable index tiebreak.
  const chronological = matches
    .map((m, i) => ({ m, i }))
    .sort((a, b) => (a.m.date < b.m.date ? -1 : a.m.date > b.m.date ? 1 : a.i - b.i))
    .map(({ m }) => m);

  for (const m of chronological) {
    const outcome = matchOutcome(m);
    const r1 = get(m.team1);
    const r2 = get(m.team2);
    const res1: FormResult = outcome === 'draw' ? 'D' : outcome === 'team1' ? 'W' : 'L';
    const res2: FormResult = outcome === 'draw' ? 'D' : outcome === 'team2' ? 'W' : 'L';
    for (const [r, res] of [[r1, res1], [r2, res2]] as const) {
      if (res === 'W') r.won++;
      else if (res === 'D') r.drawn++;
      else r.lost++;
      r.form.push(res);
    }
  }

  for (const r of records.values()) r.form = r.form.slice(-FORM_LENGTH);
  return records;
};
