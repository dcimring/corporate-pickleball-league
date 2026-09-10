import { internalMutation } from './_generated/server';
import { v } from 'convex/values';
import { parseResultsCsv } from './lib/csv';
import { diffImports } from './lib/diff';
import { sourceValidator } from './schema';

// Receives the raw results CSV, validates it, compares it with the previous
// import of the same season, and stores it as a new `imports` document. One transaction: either
// the whole sheet is recorded or nothing changes.
export const apply = internalMutation({
  args: {
    csv: v.string(),
    season: v.string(),
    source: sourceValidator,
    receivedAt: v.optional(v.number()),
    dryRun: v.optional(v.boolean()),
    force: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const parsed = parseResultsCsv(args.csv);
    const playedCount = parsed.rows.filter((r) => r.scores).length;

    // Compare only with the previous import of the same season, so the first
    // sheet of a new season (few matches) is not refused for having fewer rows
    // than the end of the last one. Forgetting to bump SEASON in the Apps
    // Script therefore fails loudly with `fewer_rows` instead of mislabelling.
    const previous = await ctx.db
      .query('imports')
      .withIndex('by_season', (q) => q.eq('season', args.season))
      .order('desc')
      .first();
    const previousCount = previous?.playedCount ?? 0;

    const diff = diffImports(parsed.rows, previous?.rows ?? []);

    const base = {
      dryRun: args.dryRun === true,
      previousCount,
      newCount: playedCount,
      rowCount: parsed.rows.length,
      newTeams: diff.newTeams,
      warnings: parsed.warnings,
      errors: parsed.errors,
      newMatches: diff.newMatches,
      modifiedMatches: diff.modifiedMatches,
    };

    if (playedCount === 0) {
      return { ok: false, skippedReason: 'zero_rows' as const, ...base };
    }
    if (playedCount < previousCount && !args.force) {
      return { ok: false, skippedReason: 'fewer_rows' as const, ...base };
    }
    if (args.dryRun) {
      return { ok: true, ...base };
    }

    const importId = await ctx.db.insert('imports', {
      season: args.season,
      receivedAt: args.receivedAt ?? Date.now(),
      source: args.source,
      rowCount: parsed.rows.length,
      playedCount,
      rows: parsed.rows,
      warnings: parsed.warnings,
    });
    return { ok: true, importId, ...base };
  },
});

// Removes the most recent import so the one before it becomes live again.
//   npx convex run ingest:rollback --prod
export const rollback = internalMutation({
  args: {},
  handler: async (ctx) => {
    const latest = await ctx.db.query('imports').order('desc').first();
    if (!latest) return { removed: null };
    await ctx.db.delete(latest._id);
    const now = await ctx.db.query('imports').order('desc').first();
    return {
      removed: { id: latest._id, subject: latest.source.subject, receivedAt: latest.receivedAt },
      nowLive: now ? { id: now._id, subject: now.source.subject, receivedAt: now.receivedAt } : null,
    };
  },
});
