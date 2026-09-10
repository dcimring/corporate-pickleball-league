// Builds the shape the React app consumes from one imported results sheet.
// Pure: no Convex imports, so it is unit-testable and reusable from scripts.

import type { ResultRow } from './csv';
import { divisionLabel, compareDivisionLabels } from './divisions';

export interface Division {
  name: string;
  teams: string[];
}

export interface LeaderboardEntry {
  team: string;
  /** Games won (not matches) — matches the historical "W-L" column. */
  wins: number;
  losses: number;
  winPct: number;
  pointsFor: number;
  pointsAgainst: number;
}

export interface Match {
  /** Deterministic: `${date}|${team1}|${team2}|${n}`; stable across imports. */
  id: string;
  date: string;
  team1: string;
  team2: string;
  team1Wins: number;
  team2Wins: number;
  team1Points: number;
  team2Points: number;
}

export interface UpcomingMatch {
  id: string;
  date: string;
  team1: string;
  team2: string;
}

export interface LeagueData {
  season: string;
  /** Epoch ms of the import the data came from; 0 when there is none yet. */
  importedAt: number;
  divisions: Division[];
  /** Keyed by division label, sorted best first. Rank = index + 1. */
  leaderboard: Record<string, LeaderboardEntry[]>;
  /** Keyed by division label, newest first. */
  matches: Record<string, Match[]>;
  /** Keyed by division label, soonest first. */
  upcoming: Record<string, UpcomingMatch[]>;
}

export const emptyLeagueData = (): LeagueData => ({
  season: '',
  importedAt: 0,
  divisions: [],
  leaderboard: {},
  matches: {},
  upcoming: {},
});

interface Aggregate {
  gamesWon: number;
  gamesLost: number;
  pointsFor: number;
  pointsAgainst: number;
}

const matchBase = (row: ResultRow) => `${row.date}|${row.team1}|${row.team2}`;

export const buildLeagueData = (input: {
  season: string;
  importedAt: number;
  rows: ResultRow[];
}): LeagueData => {
  const byDivision = new Map<string, ResultRow[]>();
  for (const row of input.rows) {
    const list = byDivision.get(row.division) ?? [];
    list.push(row);
    byDivision.set(row.division, list);
  }

  const divisionCodes = [...byDivision.keys()].sort((a, b) =>
    compareDivisionLabels(divisionLabel(a), divisionLabel(b)),
  );

  const data = emptyLeagueData();
  data.season = input.season;
  data.importedAt = input.importedAt;

  for (const code of divisionCodes) {
    const label = divisionLabel(code);
    const rows = byDivision.get(code)!;

    // Teams: distinct names, case-insensitive, first-seen casing wins, sorted by name.
    const canonical = new Map<string, string>();
    const teamName = (name: string) => {
      const key = name.toLowerCase();
      const existing = canonical.get(key);
      if (existing) return existing;
      canonical.set(key, name);
      return name;
    };
    for (const row of rows) {
      teamName(row.team1);
      teamName(row.team2);
    }
    const teams = [...canonical.values()].sort((a, b) => a.localeCompare(b, 'en'));

    const aggregates = new Map<string, Aggregate>();
    for (const team of teams) {
      aggregates.set(team, { gamesWon: 0, gamesLost: 0, pointsFor: 0, pointsAgainst: 0 });
    }

    const played = rows.filter((r): r is ResultRow & { scores: NonNullable<ResultRow['scores']> } => !!r.scores);
    for (const row of played) {
      const t1 = aggregates.get(teamName(row.team1))!;
      const t2 = aggregates.get(teamName(row.team2))!;
      t1.gamesWon += row.scores.team1Wins;
      t1.gamesLost += row.scores.team2Wins;
      t1.pointsFor += row.scores.team1Points;
      t1.pointsAgainst += row.scores.team2Points;
      t2.gamesWon += row.scores.team2Wins;
      t2.gamesLost += row.scores.team1Wins;
      t2.pointsFor += row.scores.team2Points;
      t2.pointsAgainst += row.scores.team1Points;
    }

    const entries: LeaderboardEntry[] = teams.map((team) => {
      const a = aggregates.get(team)!;
      const total = a.gamesWon + a.gamesLost;
      const winPct = total > 0 ? a.gamesWon / total : 0;
      return {
        team,
        wins: a.gamesWon,
        losses: a.gamesLost,
        winPct: Number(winPct.toFixed(3)),
        pointsFor: a.pointsFor,
        pointsAgainst: a.pointsAgainst,
      };
    });
    // Win % desc, then points for desc; Array.prototype.sort is stable, so
    // remaining ties keep alphabetical order.
    entries.sort((a, b) => {
      if (b.winPct !== a.winPct) return b.winPct - a.winPct;
      return b.pointsFor - a.pointsFor;
    });

    // Matches: newest date first, sheet order within a date. Ids are stable
    // across imports because they derive from the row content.
    const occurrences = new Map<string, number>();
    const matches: Match[] = played
      .map((row) => {
        const base = matchBase(row);
        const n = occurrences.get(base) ?? 0;
        occurrences.set(base, n + 1);
        return {
          id: `${base}|${n}`,
          date: row.date,
          team1: teamName(row.team1),
          team2: teamName(row.team2),
          team1Wins: row.scores.team1Wins,
          team2Wins: row.scores.team2Wins,
          team1Points: row.scores.team1Points,
          team2Points: row.scores.team2Points,
        };
      })
      .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

    const upcomingOccurrences = new Map<string, number>();
    const upcoming: UpcomingMatch[] = rows
      .filter((row) => !row.scores)
      .map((row) => {
        const base = matchBase(row);
        const n = upcomingOccurrences.get(base) ?? 0;
        upcomingOccurrences.set(base, n + 1);
        return { id: `${base}|${n}`, date: row.date, team1: teamName(row.team1), team2: teamName(row.team2) };
      })
      .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));

    data.divisions.push({ name: label, teams });
    data.leaderboard[label] = entries;
    data.matches[label] = matches;
    data.upcoming[label] = upcoming;
  }

  return data;
};
