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
