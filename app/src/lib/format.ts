import type { Match } from '../types';

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

// "JUN 24TH" style, matching the editorial banner treatment
export const formatMatchDate = (dateString: string): string => {
  const d = new Date(dateString);
  const day = d.getUTCDate();
  const suffix = (day % 10 === 1 && day !== 11) ? 'ST' :
                 (day % 10 === 2 && day !== 12) ? 'ND' :
                 (day % 10 === 3 && day !== 13) ? 'RD' : 'TH';
  return `${MONTHS[d.getUTCMonth()]} ${day}${suffix}`;
};

export const getLatestMatchDate = (matches: Match[]): string | null => {
  if (matches.length === 0) return null;
  return matches.reduce(
    (latest, current) => (new Date(current.date) > new Date(latest) ? current.date : latest),
    matches[0].date
  );
};

// "24 JUN 2026" — full date for the share cards. Match dates are ISO
// `YYYY-MM-DD`, which `new Date` parses as UTC midnight, so UTC getters keep
// the calendar day stable in every timezone.
export const formatMatchDateLong = (dateString: string): string => {
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return dateString;
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
};
