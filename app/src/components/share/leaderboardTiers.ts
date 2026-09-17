// Row sizing for the standings share card. The canvas is fixed (1080×1350),
// so the list has to scale with the number of teams instead of the viewport.
// Fixture divisions have 6–11 teams; the compact tiers are safety margins.

export interface RowTier {
  rowHeight: number;
  nameSize: number;
  statSize: number;
  rankSize: number;
  /** Rows rendered before the "+N more teams" line kicks in. */
  maxRows: number;
}

export const pickRowTier = (teamCount: number): RowTier => {
  if (teamCount <= 6) return { rowHeight: 112, nameSize: 38, statSize: 30, rankSize: 30, maxRows: 6 };
  if (teamCount <= 8) return { rowHeight: 90, nameSize: 33, statSize: 28, rankSize: 28, maxRows: 8 };
  if (teamCount <= 10) return { rowHeight: 74, nameSize: 29, statSize: 26, rankSize: 26, maxRows: 10 };
  if (teamCount <= 12) return { rowHeight: 62, nameSize: 26, statSize: 24, rankSize: 24, maxRows: 12 };
  if (teamCount <= 16) return { rowHeight: 46, nameSize: 22, statSize: 20, rankSize: 20, maxRows: 16 };
  return { rowHeight: 46, nameSize: 22, statSize: 20, rankSize: 20, maxRows: 15 };
};

/**
 * Long names step down so they fit the ~460px team column on one line.
 * Fixture names run up to 28 characters ("Pickleball Cayman Youth Team").
 */
export const LONG_NAME_CHARS = 16;
export const VERY_LONG_NAME_CHARS = 24;

export const nameFontSize = (name: string, tier: RowTier): number => {
  if (name.length > VERY_LONG_NAME_CHARS) return Math.round(tier.nameSize * 0.68);
  if (name.length > LONG_NAME_CHARS) return Math.round(tier.nameSize * 0.8);
  return tier.nameSize;
};
