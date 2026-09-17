import { describe, it, expect } from 'vitest';
import { slugify } from '../src/lib/share';
import { formatMatchDateLong } from '../src/lib/format';
import { pickRowTier, nameFontSize } from '../src/components/share/leaderboardTiers';

describe('slugify', () => {
  it('lowercases and collapses punctuation into single dashes', () => {
    expect(slugify('Quality - Dill with it!')).toBe('quality-dill-with-it');
    expect(slugify('20/20 Picklers')).toBe('20-20-picklers');
    expect(slugify('Division C1')).toBe('division-c1');
  });

  it('strips accents and never returns an empty slug', () => {
    expect(slugify('Café Élite')).toBe('cafe-elite');
    expect(slugify('!!!')).toBe('team');
  });
});

describe('formatMatchDateLong', () => {
  it('renders ISO dates as "D MON YYYY" without a timezone shift', () => {
    expect(formatMatchDateLong('2026-06-24')).toBe('24 JUN 2026');
    expect(formatMatchDateLong('2026-01-01')).toBe('1 JAN 2026');
    expect(formatMatchDateLong('2026-12-31')).toBe('31 DEC 2026');
  });

  it('passes unparseable input through', () => {
    expect(formatMatchDateLong('TBD')).toBe('TBD');
  });
});

describe('pickRowTier', () => {
  it('gives small divisions the tallest rows and never hides them', () => {
    for (const n of [1, 6, 8, 10, 12, 16]) {
      expect(pickRowTier(n).maxRows).toBeGreaterThanOrEqual(n);
    }
    expect(pickRowTier(6).rowHeight).toBeGreaterThan(pickRowTier(10).rowHeight);
    expect(pickRowTier(10).rowHeight).toBeGreaterThan(pickRowTier(16).rowHeight);
  });

  it('caps very large divisions so the "+N more" line fits the canvas', () => {
    const tier = pickRowTier(24);
    expect(tier.maxRows).toBeLessThan(24);
    expect(tier.maxRows * tier.rowHeight).toBeLessThanOrEqual(760);
  });

  it('keeps every tier inside the card body', () => {
    for (const n of [6, 8, 10, 12, 16]) {
      const tier = pickRowTier(n);
      expect(Math.min(n, tier.maxRows) * tier.rowHeight).toBeLessThanOrEqual(760);
    }
  });
});

describe('nameFontSize', () => {
  it('steps long names down one size', () => {
    const tier = pickRowTier(8);
    expect(nameFontSize('Dart 1', tier)).toBe(tier.nameSize);
    expect(nameFontSize('Pickleball Cayman Youth Team', tier)).toBeLessThan(tier.nameSize);
  });
});
