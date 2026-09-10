// Pure parser for the league results CSV that arrives by email.
//
// Format (positional, comma-separated, no quoting):
//   division, team1, "v", team2, D-Mon-YY, team1Wins, team2Wins, team1Points, team2Points
// Rows with blank wins are fixtures (not yet played). Rows with wins but blank
// points are ingested with points = 0 and a warning.

export interface Scores {
  team1Wins: number;
  team2Wins: number;
  team1Points: number;
  team2Points: number;
}

export interface ResultRow {
  /** Division code as written in the sheet, uppercased (e.g. "A", "B2", "CPL"). */
  division: string;
  team1: string;
  team2: string;
  /** ISO date, YYYY-MM-DD. */
  date: string;
  /** 1-based line number in the source CSV, for messages. */
  line: number;
  /** Absent for fixtures that have not been played yet. */
  scores?: Scores;
}

export interface ParsedCsv {
  rows: ResultRow[];
  warnings: string[];
  errors: string[];
}

const MONTHS: Record<string, string> = {
  jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
  jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12',
};

/** "13-Jan-26" -> "2026-01-13". Returns null when the value is not in that form. */
export const parseSheetDate = (raw: string): string | null => {
  const parts = raw.trim().split('-');
  if (parts.length !== 3) return null;
  const day = parts[0].padStart(2, '0');
  const month = MONTHS[parts[1].toLowerCase()];
  const yearRaw = parts[2];
  if (!month || !/^\d{1,2}$/.test(parts[0]) || !/^\d{2}(\d{2})?$/.test(yearRaw)) return null;
  const year = yearRaw.length === 2 ? `20${yearRaw}` : yearRaw;
  return `${year}-${month}-${day}`;
};

/** Total games expected in a match: CPL plays to 8 (9 if tied 4-4), everyone else 6. */
export const expectedGameTotals = (divisionCode: string): number[] =>
  divisionCode === 'CPL' ? [8, 9] : [6];

const parseIntStrict = (raw: string): number | null => {
  const trimmed = raw.trim();
  if (!/^-?\d+$/.test(trimmed)) return null;
  return Number(trimmed);
};

export const parseResultsCsv = (text: string): ParsedCsv => {
  const rows: ResultRow[] = [];
  const warnings: string[] = [];
  const errors: string[] = [];

  // Match the historical ingestion: strip anything outside 7-bit ASCII.
  const clean = text.replace(/[^ -~\t\r\n]/g, '');
  const lines = clean.split(/\r\n|\n|\r/);

  lines.forEach((rawLine, index) => {
    const line = index + 1;
    if (!rawLine.trim()) return;
    const cols = rawLine.split(',');
    if (cols.length < 9) return;

    const division = cols[0].trim().toUpperCase();
    const team1 = cols[1].trim();
    const team2 = cols[3].trim();
    const date = parseSheetDate(cols[4]);

    if (!division || !team1 || !team2) {
      errors.push(`Row ${line}: missing division or team name.`);
      return;
    }
    if (!date) {
      errors.push(`Row ${line}: unrecognised date '${cols[4].trim()}' (expected D-Mon-YY).`);
      return;
    }
    if (team1.toLowerCase() === team2.toLowerCase()) {
      errors.push(`Row ${line}: ${team1} is listed against itself.`);
      return;
    }

    const winsBlank = !cols[5].trim() || !cols[6].trim();
    if (winsBlank) {
      rows.push({ division, team1, team2, date, line });
      return;
    }

    const team1Wins = parseIntStrict(cols[5]);
    const team2Wins = parseIntStrict(cols[6]);
    if (team1Wins === null || team2Wins === null || team1Wins < 0 || team2Wins < 0) {
      errors.push(`Row ${line}: invalid wins (${cols[5].trim()}/${cols[6].trim()}) for ${team1} vs ${team2}.`);
      return;
    }

    let team1Points = parseIntStrict(cols[7]);
    let team2Points = parseIntStrict(cols[8]);
    if (team1Points === null || team2Points === null || team1Points < 0 || team2Points < 0) {
      if (!cols[7].trim() && !cols[8].trim()) {
        warnings.push(`Row ${line}: points missing for ${team1} vs ${team2} (${date}); recorded as 0-0.`);
        team1Points = 0;
        team2Points = 0;
      } else {
        errors.push(`Row ${line}: invalid points (${cols[7].trim()}/${cols[8].trim()}) for ${team1} vs ${team2}.`);
        return;
      }
    }

    const total = team1Wins + team2Wins;
    const expected = expectedGameTotals(division);
    if (!expected.includes(total)) {
      warnings.push(
        `Row ${line}: total games (${total}) is not ${expected.join(' or ')} (${team1} vs ${team2}, ${date}).`,
      );
    }

    rows.push({ division, team1, team2, date, line, scores: { team1Wins, team2Wins, team1Points, team2Points } });
  });

  return { rows, warnings, errors };
};
