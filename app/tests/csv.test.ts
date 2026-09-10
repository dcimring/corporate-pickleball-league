import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { parseResultsCsv, parseSheetDate } from '../convex/lib/csv';

const fixture = readFileSync(new URL('./fixtures/Export-5.csv', import.meta.url), 'utf8');

describe('parseSheetDate', () => {
  it('converts D-Mon-YY to ISO', () => {
    expect(parseSheetDate('4-Feb-26')).toBe('2026-02-04');
    expect(parseSheetDate('13-Jan-26')).toBe('2026-01-13');
    expect(parseSheetDate('25-jun-2026')).toBe('2026-06-25');
  });
  it('rejects anything else', () => {
    expect(parseSheetDate('2026-02-04')).toBeNull();
    expect(parseSheetDate('4-Foo-26')).toBeNull();
    expect(parseSheetDate('')).toBeNull();
  });
});

describe('parseResultsCsv on the real export', () => {
  const parsed = parseResultsCsv(fixture);

  it('keeps every row, fixtures included', () => {
    expect(parsed.rows).toHaveLength(244);
    expect(parsed.rows.filter((r) => !r.scores)).toHaveLength(5);
    expect(parsed.errors).toEqual([]);
  });

  it('uppercases division codes and finds the seven divisions', () => {
    const codes = [...new Set(parsed.rows.map((r) => r.division))].sort();
    expect(codes).toEqual(['A', 'B2', 'B3', 'B4', 'C1', 'C2', 'CPL']);
  });

  it('records wins-without-points as 0-0 with a warning instead of dropping the row', () => {
    const row = parsed.rows.find((r) => r.division === 'CPL' && r.date === '2026-05-08' && r.team1 === 'Jennie Invest');
    expect(row?.scores).toEqual({ team1Wins: 6, team2Wins: 0, team1Points: 0, team2Points: 0 });
    expect(parsed.warnings.some((w) => w.includes('points missing') && w.includes('Jennie Invest'))).toBe(true);
  });

  it('warns about unexpected game totals (that CPL row totals 6, not 8 or 9)', () => {
    expect(parsed.warnings.some((w) => w.includes('total games (6) is not 8 or 9'))).toBe(true);
    // Every other played row has the right total, so exactly one such warning.
    expect(parsed.warnings.filter((w) => w.includes('total games')).length).toBe(1);
  });

  it('parses a scored row completely', () => {
    expect(parsed.rows[0]).toEqual({
      division: 'CPL',
      team1: 'Burger Shack',
      team2: 'Interesting Things',
      date: '2026-02-04',
      line: 1,
      scores: { team1Wins: 2, team2Wins: 6, team1Points: 61, team2Points: 81 },
    });
  });
});

describe('parseResultsCsv edge cases', () => {
  it('skips blank lines and short rows, strips non-ASCII, tolerates CRLF', () => {
    const text = 'A,Team X,v,Team Y,1-Jun-26,4,2,50,40\r\n\r\nheader,only\r\nA,Team éZ,v,Team Y,2-Jun-26,,,,\r\n';
    const parsed = parseResultsCsv(text);
    expect(parsed.rows).toHaveLength(2);
    expect(parsed.rows[1]).toMatchObject({ team1: 'Team Z', date: '2026-06-02' });
    expect(parsed.rows[1].scores).toBeUndefined();
  });

  it('reports invalid numbers and bad dates as errors and drops those rows', () => {
    const text = ['A,X,v,Y,1-Jun-26,four,2,50,40', 'A,X,v,Y,June 1,4,2,50,40', 'A,X,v,Y,1-Jun-26,4,2,50,abc'].join('\n');
    const parsed = parseResultsCsv(text);
    expect(parsed.rows).toHaveLength(0);
    expect(parsed.errors).toHaveLength(3);
    expect(parsed.errors[0]).toMatch(/Row 1: invalid wins/);
    expect(parsed.errors[1]).toMatch(/Row 2: unrecognised date/);
    expect(parsed.errors[2]).toMatch(/Row 3: invalid points/);
  });

  it('rejects a team listed against itself', () => {
    const parsed = parseResultsCsv('A,Same,v,same,1-Jun-26,4,2,50,40');
    expect(parsed.rows).toHaveLength(0);
    expect(parsed.errors[0]).toMatch(/against itself/);
  });
});
