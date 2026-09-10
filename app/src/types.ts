// The app-facing data shape is defined once, next to the code that computes it
// on the Convex side, so the UI and the query can never drift apart.
export type {
  LeagueData,
  Division,
  LeaderboardEntry,
  Match,
  UpcomingMatch,
} from '../convex/lib/aggregate';
