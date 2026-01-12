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

export interface MatchResult {
  winner: string;
  loser: string;
  winnerScore: number;
  loserScore: number;
  date: string;
}

export interface TeamStats {
  gamesPlayed: number;
  avgPointsPerGame: number;
  avgPointDiff: number;
  longestWinStreak: number;
}

export interface PlayerStats {
  name: string;
  gamesPlayed: number;
  avgPoints: number;
  totalAces: number;
  faultsPerGame: number;
}

export interface LeagueData {
  divisions: Division[];
  leaderboard: Record<string, LeaderboardEntry[]>;
  scores: MatchResult[];
  teamStats: Record<string, TeamStats>;
  playerStats: PlayerStats[];
}