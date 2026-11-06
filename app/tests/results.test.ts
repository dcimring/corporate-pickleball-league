import { describe, it, expect } from 'vitest';
import { matchOutcome, teamRecords } from '../src/lib/results';
import type { Match } from '../src/types';

const m = (date: string, team1: string, team2: string, g1: number, g2: number, p1: number, p2: number): Match => ({
  id: `${date}|${team1}|${team2}|0`,
  date,
  team1,
  team2,
  team1Wins: g1,
  team2Wins: g2,
  team1Points: p1,
  team2Points: p2,
});

describe('matchOutcome', () => {
  it('goes to more games, then more points, else a draw', () => {
    expect(matchOutcome(m('2026-05-01', 'A', 'B', 5, 3, 60, 70))).toBe('team1');
    expect(matchOutcome(m('2026-05-01', 'A', 'B', 4, 4, 62, 66))).toBe('team2');
    expect(matchOutcome(m('2026-05-01', 'A', 'B', 4, 4, 60, 60))).toBe('draw');
  });
});

describe('teamRecords', () => {
  // Newest first, as league.get returns them.
  const matches = [
    m('2026-05-08', 'A', 'C', 2, 6, 40, 70),
    m('2026-05-08', 'B', 'C', 4, 4, 55, 55),
    m('2026-05-01', 'A', 'B', 5, 3, 70, 60),
    m('2026-05-01', 'C', 'A', 4, 4, 50, 66),
  ];
  const records = teamRecords(matches);

  it('counts match wins, draws and losses', () => {
    expect(records.get('A')).toMatchObject({ won: 2, drawn: 0, lost: 1 });
    expect(records.get('B')).toMatchObject({ won: 0, drawn: 1, lost: 1 });
    expect(records.get('C')).toMatchObject({ won: 1, drawn: 1, lost: 1 });
  });

  it('lists form oldest first, keeping sheet order within a date', () => {
    expect(records.get('A')!.form).toEqual(['W', 'W', 'L']);
    expect(records.get('C')!.form).toEqual(['L', 'W', 'D']);
  });

  it('keeps only the last five results', () => {
    const many = Array.from({ length: 7 }, (_, i) =>
      m(`2026-05-0${i + 1}`, 'A', 'B', i === 0 ? 0 : 5, i === 0 ? 5 : 0, 0, 0),
    ).reverse();
    expect(teamRecords(many).get('A')!.form).toEqual(['W', 'W', 'W', 'W', 'W']);
  });
});
