import { describe, it, expect } from 'vitest';
import type { ResultRow } from '../convex/lib/csv';
import { diffImports } from '../convex/lib/diff';

const row = (
  division: string,
  team1: string,
  team2: string,
  date: string,
  scores?: [number, number, number, number],
): ResultRow => ({
  division,
  team1,
  team2,
  date,
  line: 1,
  scores: scores && { team1Wins: scores[0], team2Wins: scores[1], team1Points: scores[2], team2Points: scores[3] },
});

describe('diffImports', () => {
  const previous = [
    row('A', 'Alpha', 'Bravo', '2026-05-01', [4, 2, 60, 50]),
    row('A', 'Charlie', 'Alpha', '2026-05-08', [3, 3, 50, 50]),
    row('A', 'Bravo', 'Charlie', '2026-05-15'),
  ];

  it('reports nothing when the sheet is unchanged', () => {
    const diff = diffImports(previous, previous);
    expect(diff).toEqual({ newMatches: {}, modifiedMatches: {}, newTeams: [] });
  });

  it('detects new results, including a fixture that has now been played', () => {
    const incoming = [...previous.slice(0, 2), row('A', 'Bravo', 'Charlie', '2026-05-15', [1, 5, 30, 60])];
    const diff = diffImports(incoming, previous);
    expect(diff.newMatches).toEqual({
      'Division A': [{ date: '2026-05-15', team1: 'Bravo', team2: 'Charlie', team1Wins: 1, team2Wins: 5, team1Points: 30, team2Points: 60 }],
    });
    expect(diff.modifiedMatches).toEqual({});
  });

  it('detects a corrected score', () => {
    const incoming = [row('A', 'Alpha', 'Bravo', '2026-05-01', [4, 2, 61, 50]), previous[1], previous[2]];
    const diff = diffImports(incoming, previous);
    expect(diff.modifiedMatches['Division A']).toHaveLength(1);
    expect(diff.modifiedMatches['Division A'][0].team1Points).toBe(61);
    expect(diff.newMatches).toEqual({});
  });

  it('treats swapped team order with mirrored scores as unchanged', () => {
    const incoming = [row('A', 'bravo', 'ALPHA', '2026-05-01', [2, 4, 50, 60]), previous[1], previous[2]];
    const diff = diffImports(incoming, previous);
    expect(diff.newMatches).toEqual({});
    expect(diff.modifiedMatches).toEqual({});
    expect(diff.newTeams).toEqual([]);
  });

  it('distinguishes repeat pairings on the same day by occurrence', () => {
    const incoming = [...previous, row('A', 'Alpha', 'Bravo', '2026-05-01', [2, 4, 40, 55])];
    const diff = diffImports(incoming, previous);
    expect(diff.newMatches['Division A']).toEqual([
      { date: '2026-05-01', team1: 'Alpha', team2: 'Bravo', team1Wins: 2, team2Wins: 4, team1Points: 40, team2Points: 55 },
    ]);
  });

  it('lists teams that were not in the previous import, per division', () => {
    const incoming = [...previous, row('CPL', 'Kings', 'Queens', '2026-05-02', [5, 4, 80, 79]), row('A', 'Delta', 'Alpha', '2026-05-22')];
    const diff = diffImports(incoming, previous);
    expect(diff.newTeams).toEqual([
      { division: 'Cayman Premier League', team: 'Kings' },
      { division: 'Cayman Premier League', team: 'Queens' },
      { division: 'Division A', team: 'Delta' },
    ]);
  });

  it('reports everything as new against an empty previous import', () => {
    const diff = diffImports(previous, []);
    expect(diff.newMatches['Division A']).toHaveLength(2);
    expect(diff.newTeams.map((t) => t.team).sort()).toEqual(['Alpha', 'Bravo', 'Charlie']);
  });
});
