import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { parseResultsCsv, type ResultRow } from '../convex/lib/csv';
import { buildLeagueData, emptyLeagueData } from '../convex/lib/aggregate';

const row = (
  division: string,
  team1: string,
  team2: string,
  date: string,
  scores?: [number, number, number, number],
  line = 1,
): ResultRow => ({
  division,
  team1,
  team2,
  date,
  line,
  scores: scores && { team1Wins: scores[0], team2Wins: scores[1], team1Points: scores[2], team2Points: scores[3] },
});

describe('buildLeagueData (hand-computed fixture)', () => {
  const rows: ResultRow[] = [
    row('B2', 'Bravo', 'Alpha', '2026-05-01', [4, 2, 60, 50], 1),
    row('B2', 'Charlie', 'Alpha', '2026-05-01', [3, 3, 55, 55], 2),
    row('B2', 'bravo', 'Charlie', '2026-05-08', [2, 4, 45, 62], 3),
    row('B2', 'Alpha', 'Bravo', '2026-05-08', [5, 1, 66, 30], 4),
    row('B2', 'Alpha', 'Charlie', '2026-05-15', undefined, 5),
    row('CPL', 'Kings', 'Queens', '2026-05-02', [5, 4, 80, 79], 6),
  ];
  const data = buildLeagueData({ season: 'Test', importedAt: 123, rows });

  it('derives divisions with labels in alphabetical label order and sorted teams', () => {
    expect(data.divisions).toEqual([
      { name: 'Cayman Premier League', teams: ['Kings', 'Queens'] },
      { name: 'Division B2', teams: ['Alpha', 'Bravo', 'Charlie'] },
    ]);
    expect(data.season).toBe('Test');
    expect(data.importedAt).toBe(123);
  });

  it('computes games won/lost, points, win% and sort order', () => {
    // Alpha: 2-4 vs Bravo, 3-3 vs Charlie, 5-1 vs Bravo => 10 won, 8 lost; PF 50+55+66=171, PA 60+55+30=145
    // Bravo: 4-2, 2-4, 1-5 => 7 won, 11 lost; PF 60+45+30=135, PA 50+62+66=178
    // Charlie: 3-3, 4-2 => 7 won, 5 lost; PF 55+62=117, PA 55+45=100
    expect(data.leaderboard['Division B2']).toEqual([
      { team: 'Charlie', wins: 7, losses: 5, winPct: 0.583, pointsFor: 117, pointsAgainst: 100 },
      { team: 'Alpha', wins: 10, losses: 8, winPct: 0.556, pointsFor: 171, pointsAgainst: 145 },
      { team: 'Bravo', wins: 7, losses: 11, winPct: 0.389, pointsFor: 135, pointsAgainst: 178 },
    ]);
  });

  it('merges team names case-insensitively using the first spelling seen', () => {
    const teams = data.leaderboard['Division B2'].map((e) => e.team);
    expect(teams).not.toContain('bravo');
    expect(data.matches['Division B2'].find((m) => m.date === '2026-05-08' && m.team2 === 'Charlie')?.team1).toBe('Bravo');
  });

  it('lists played matches newest first with stable deterministic ids', () => {
    const matches = data.matches['Division B2'];
    expect(matches.map((m) => m.date)).toEqual(['2026-05-08', '2026-05-08', '2026-05-01', '2026-05-01']);
    expect(matches[0].id).toBe('2026-05-08|bravo|Charlie|0');
    expect(matches[1]).toEqual({
      id: '2026-05-08|Alpha|Bravo|0',
      date: '2026-05-08',
      team1: 'Alpha',
      team2: 'Bravo',
      team1Wins: 5,
      team2Wins: 1,
      team1Points: 66,
      team2Points: 30,
    });
  });

  it('exposes fixtures as upcoming and excludes them from standings', () => {
    expect(data.upcoming['Division B2']).toEqual([
      { id: '2026-05-15|Alpha|Charlie|0', date: '2026-05-15', team1: 'Alpha', team2: 'Charlie' },
    ]);
    expect(data.upcoming['Cayman Premier League']).toEqual([]);
  });

  it('breaks full ties alphabetically and handles teams with no games', () => {
    const tied = buildLeagueData({
      season: 'T',
      importedAt: 0,
      rows: [row('A', 'Zed', 'Amy', '2026-01-01', [3, 3, 40, 40]), row('A', 'Bob', 'Amy', '2026-01-08')],
    });
    expect(tied.leaderboard['Division A'].map((e) => e.team)).toEqual(['Amy', 'Zed', 'Bob']);
    expect(tied.leaderboard['Division A'][2]).toEqual({ team: 'Bob', wins: 0, losses: 0, winPct: 0, pointsFor: 0, pointsAgainst: 0 });
  });

  it('numbers repeat pairings on the same day', () => {
    const twice = buildLeagueData({
      season: 'T',
      importedAt: 0,
      rows: [row('A', 'X', 'Y', '2026-01-01', [4, 2, 1, 1], 1), row('A', 'X', 'Y', '2026-01-01', [2, 4, 1, 1], 2)],
    });
    expect(twice.matches['Division A'].map((m) => m.id)).toEqual(['2026-01-01|X|Y|0', '2026-01-01|X|Y|1']);
  });
});

describe('buildLeagueData on the real export', () => {
  const fixture = readFileSync(new URL('./fixtures/Export-5.csv', import.meta.url), 'utf8');
  const data = buildLeagueData({ season: 'Summer 2026', importedAt: 0, rows: parseResultsCsv(fixture).rows });

  it('produces the seven divisions with the expected team counts', () => {
    expect(data.divisions.map((d) => `${d.name}:${d.teams.length}`)).toEqual([
      'Cayman Premier League:6',
      'Division A:6',
      'Division B2:8',
      'Division B3:8',
      'Division B4:8',
      'Division C1:10',
      'Division C2:10',
    ]);
  });

  it('keeps every played row and every fixture', () => {
    const played = Object.values(data.matches).reduce((n, m) => n + m.length, 0);
    const upcoming = Object.values(data.upcoming).reduce((n, m) => n + m.length, 0);
    expect(played).toBe(239);
    expect(upcoming).toBe(5);
  });

  it('matches the standings the live site showed for Division A (checked 2026-09-10)', () => {
    // Snapshot of the top of Division A; games won/lost per team must add up to 30 matches * 6 games.
    const entries = data.leaderboard['Division A'];
    const totalGames = entries.reduce((n, e) => n + e.wins, 0);
    expect(totalGames).toBe(30 * 6);
    expect(entries.map((e) => e.team)).toMatchSnapshot();
  });

  it('starts empty when there is no import yet', () => {
    expect(emptyLeagueData()).toEqual({ season: '', importedAt: 0, divisions: [], leaderboard: {}, matches: {}, upcoming: {} });
  });
});
