// Compares a newly received sheet with the previous import so the
// notification email can list new and changed results. Pure.

import type { ResultRow, Scores } from './csv';
import { divisionLabel } from './divisions';

export interface MatchSummary {
  date: string;
  team1: string;
  team2: string;
  team1Wins: number;
  team2Wins: number;
  team1Points: number;
  team2Points: number;
}

export interface ImportDiff {
  newMatches: Record<string, MatchSummary[]>;
  modifiedMatches: Record<string, MatchSummary[]>;
  /** Teams (per division label) that did not appear in the previous import. */
  newTeams: { division: string; team: string }[];
}

type PlayedRow = ResultRow & { scores: Scores };

const isPlayed = (row: ResultRow): row is PlayedRow => !!row.scores;

// Identity: division + date + the two teams regardless of order. An occurrence
// counter distinguishes repeat pairings on the same day.
const baseKey = (row: ResultRow) => {
  const teams = [row.team1.toLowerCase(), row.team2.toLowerCase()].sort();
  return `${row.division}|${row.date}|${teams[0]}|${teams[1]}`;
};

const summarize = (row: PlayedRow): MatchSummary => ({
  date: row.date,
  team1: row.team1,
  team2: row.team2,
  team1Wins: row.scores.team1Wins,
  team2Wins: row.scores.team2Wins,
  team1Points: row.scores.team1Points,
  team2Points: row.scores.team2Points,
});

const scoresDiffer = (existing: PlayedRow, incoming: PlayedRow): boolean => {
  const sameOrder = existing.team1.toLowerCase() === incoming.team1.toLowerCase();
  const e = existing.scores;
  const i = incoming.scores;
  if (sameOrder) {
    return (
      e.team1Wins !== i.team1Wins ||
      e.team2Wins !== i.team2Wins ||
      e.team1Points !== i.team1Points ||
      e.team2Points !== i.team2Points
    );
  }
  return (
    e.team1Wins !== i.team2Wins ||
    e.team2Wins !== i.team1Wins ||
    e.team1Points !== i.team2Points ||
    e.team2Points !== i.team1Points
  );
};

const teamKeys = (rows: ResultRow[]) => {
  const keys = new Map<string, { division: string; team: string }>();
  for (const row of rows) {
    for (const team of [row.team1, row.team2]) {
      const key = `${row.division}|${team.toLowerCase()}`;
      if (!keys.has(key)) keys.set(key, { division: divisionLabel(row.division), team });
    }
  }
  return keys;
};

export const diffImports = (incomingRows: ResultRow[], previousRows: ResultRow[]): ImportDiff => {
  const previous = new Map<string, PlayedRow>();
  const previousCounts = new Map<string, number>();
  for (const row of previousRows.filter(isPlayed)) {
    const key = baseKey(row);
    const n = previousCounts.get(key) ?? 0;
    previousCounts.set(key, n + 1);
    previous.set(`${key}|${n}`, row);
  }

  const newMatches: Record<string, MatchSummary[]> = {};
  const modifiedMatches: Record<string, MatchSummary[]> = {};
  const incomingCounts = new Map<string, number>();

  for (const row of incomingRows.filter(isPlayed)) {
    const key = baseKey(row);
    const n = incomingCounts.get(key) ?? 0;
    incomingCounts.set(key, n + 1);
    const existing = previous.get(`${key}|${n}`);
    const label = divisionLabel(row.division);
    if (!existing) {
      (newMatches[label] ??= []).push(summarize(row));
    } else if (scoresDiffer(existing, row)) {
      (modifiedMatches[label] ??= []).push(summarize(row));
    }
  }

  const previousTeams = teamKeys(previousRows);
  const newTeams = [...teamKeys(incomingRows)]
    .filter(([key]) => !previousTeams.has(key))
    .map(([, value]) => value);

  return { newMatches, modifiedMatches, newTeams };
};
