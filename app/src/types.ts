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
  rank: number;
  matchesPlayed: number;
  gamesWon: number;
  gamesLost: number;
  winPct: number;
  pointsFor: number;
  pointsAgainst: number;
}

export interface Match {
  id: string;
  date: string;
  team1: string;
  team2: string;
  team1Wins: number;
  team2Wins: number;
  team1Points: number;
  team2Points: number;
}

export interface LeagueData {
  divisions: Division[];
  leaderboard: Record<string, LeaderboardEntry[]>;
  teamStats: Record<string, Record<string, TeamStats>>;
  matches: Record<string, Match[]>;
}

// Database Row Types
export interface DivisionRow {
  id: string;
  name: string;
  play_time: string;
}

export interface TeamRow {
  id: string;
  division_id: string;
  name: string;
  wins: number;
  losses: number;
  points_for: number;
  points_against: number;
  longest_win_streak: number;
}

export interface MatchRow {
  id: string;
  division_id: string;
  team1_id: string;
  team2_id: string;
  date: string;
  team1_wins: number;
  team2_wins: number;
  team1_points_for: number;
  team2_points_for: number;
}