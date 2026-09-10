// Display labels for the division codes used in the results sheet.
// Anything not listed here is shown as "Division <code>".

const LABELS: Record<string, string> = {
  CPL: 'Cayman Premier League',
};

export const divisionLabel = (code: string): string => LABELS[code] ?? `Division ${code}`;

/** Ordering used for division tabs: alphabetical by label (matches the old site). */
export const compareDivisionLabels = (a: string, b: string): number => a.localeCompare(b, 'en');
