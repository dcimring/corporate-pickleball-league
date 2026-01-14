export interface Team {
  name: string;
}

export interface Division {
  name: string;
  playTime: string;
  teams: string[];
}

export interface LeaderboardEntry {
  team: string;
  wins: number;
  losses: number;
  winPct: number;
  pointsFor: number;
  pointsAgainst: number;
}

export interface TeamStats {
  gamesPlayed: number;
  avgPointsPerGame: number;
  avgPointDiff: number;
  longestWinStreak: number;
}

export interface LeagueData {
  divisions: Division[];
  leaderboard: Record<string, LeaderboardEntry[]>;
  teamStats: Record<string, Record<string, TeamStats>>;
}