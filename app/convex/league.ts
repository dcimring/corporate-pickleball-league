import { query } from './_generated/server';
import { buildLeagueData, emptyLeagueData } from './lib/aggregate';

// Everything the site renders, computed from the most recent results import.
export const get = query({
  args: {},
  handler: async (ctx) => {
    const latest = await ctx.db.query('imports').order('desc').first();
    if (!latest) return emptyLeagueData();
    return buildLeagueData({ season: latest.season, importedAt: latest.receivedAt, rows: latest.rows });
  },
});
