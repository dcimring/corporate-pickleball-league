import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

// One document per results sheet received. The sheet is the complete season,
// so everything the site shows is derived from the latest document.
export const scoresValidator = v.object({
  team1Wins: v.number(),
  team2Wins: v.number(),
  team1Points: v.number(),
  team2Points: v.number(),
});

export const rowValidator = v.object({
  division: v.string(),
  team1: v.string(),
  team2: v.string(),
  date: v.string(),
  line: v.number(),
  scores: v.optional(scoresValidator),
});

export const sourceValidator = v.object({
  subject: v.string(),
  from: v.optional(v.string()),
  messageId: v.optional(v.string()),
  fileName: v.optional(v.string()),
});

export default defineSchema({
  imports: defineTable({
    season: v.string(),
    /** When the results email was received (epoch ms). */
    receivedAt: v.number(),
    source: sourceValidator,
    rowCount: v.number(),
    playedCount: v.number(),
    rows: v.array(rowValidator),
    warnings: v.array(v.string()),
  }).index('by_season', ['season']),
});
