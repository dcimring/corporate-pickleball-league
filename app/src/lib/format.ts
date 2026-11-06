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

// "Wed 6 May 2026" — date group headings and the "results through" line.
export const formatMatchDay = (dateString: string): string => {
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return dateString;
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(d).replace(',', '');
};

// Division button labels: "CPL" / "Div B2" on desktop, "CPL" / "B2" in the
// phone grid. The full name stays available as the accessible label.
export const divisionShortLabel = (name: string, compact = false): string => {
  if (name.toLowerCase() === 'cayman premier league') return 'CPL';
  const code = name.replace(/^division\s+/i, '');
  return compact ? code : `Div ${code}`;
};
