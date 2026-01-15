import { supabase } from './supabase';
import type { LeagueData, DivisionRow, TeamRow, MatchRow, Division, LeaderboardEntry, TeamStats, Match } from '../types';

// Helper to calculate calculated stats that aren't in DB
const calculateStats = (wins: number, losses: number, pf: number, pa: number) => {
  const gamesPlayed = wins + losses;
  const winPct = gamesPlayed > 0 ? wins / gamesPlayed : 0;
  const avgPointsPerGame = gamesPlayed > 0 ? pf / gamesPlayed : 0;
  // db stores points, but stats interface wants avg point diff
  const avgPointDiff = gamesPlayed > 0 ? (pf - pa) / gamesPlayed : 0;
  
  return { winPct, avgPointsPerGame, avgPointDiff, gamesPlayed };
};

export const fetchLeagueData = async (): Promise<LeagueData> => {
  // Fetch all divisions
  const { data: divisionsData, error: divError } = await supabase
    .from('divisions')
    .select('*')
    .order('name');
    
  if (divError) throw divError;
  const divisionsRows = divisionsData as DivisionRow[];

  // Fetch all teams
  const { data: teamsData, error: teamError } = await supabase
    .from('teams')
    .select('*');
    
  if (teamError) throw teamError;
  const teamsRows = teamsData as TeamRow[];

  // Fetch all matches
  const { data: matchesData, error: matchError } = await supabase
    .from('matches')
    .select('*')
    .order('date', { ascending: false });

  if (matchError) throw matchError;
  const matchesRows = matchesData as MatchRow[];

  // Transform to existing App Structure
  const divisions: Division[] = divisionsRows.map(div => {
    // Find teams for this division
    const divTeams = teamsRows.filter(t => t.division_id === div.id);
    return {
      name: div.name,
      playTime: div.play_time,
      teams: divTeams.map(t => t.name)
    };
  });

  const leaderboard: Record<string, LeaderboardEntry[]> = {};
  const teamStats: Record<string, Record<string, TeamStats>> = {};
  const matches: Record<string, Match[]> = {};

  // Create a lookup for team names by id
  const teamNameMap = new Map<string, string>();
  teamsRows.forEach(t => teamNameMap.set(t.id, t.name));

  divisionsRows.forEach(div => {
    const divTeams = teamsRows.filter(t => t.division_id === div.id);
    
    // Build Leaderboard
    const entries: LeaderboardEntry[] = divTeams.map(t => {
      const { winPct } = calculateStats(t.wins, t.losses, t.points_for, t.points_against);
      return {
        team: t.name,
        wins: t.wins,
        losses: t.losses,
        winPct: Number(winPct.toFixed(3)),
        pointsFor: t.points_for,
        pointsAgainst: t.points_against
      };
    });
    
    // Sort leaderboard (Wins desc, then Point Diff (PF-PA) desc)
    entries.sort((a, b) => {
        if (b.wins !== a.wins) return b.wins - a.wins;
        const diffA = a.pointsFor - a.pointsAgainst;
        const diffB = b.pointsFor - b.pointsAgainst;
        return diffB - diffA;
    });

    leaderboard[div.name] = entries;

    // Build Team Stats
    const statsMap: Record<string, TeamStats> = {};
    divTeams.forEach(t => {
      const { gamesPlayed, avgPointsPerGame, avgPointDiff } = calculateStats(t.wins, t.losses, t.points_for, t.points_against);
      statsMap[t.name] = {
        gamesPlayed,
        avgPointsPerGame: Number(avgPointsPerGame.toFixed(1)),
        avgPointDiff: Number(avgPointDiff.toFixed(1)),
        longestWinStreak: t.longest_win_streak
      };
    });
    teamStats[div.name] = statsMap;

    // Build Matches
    const divMatches = matchesRows.filter(m => m.division_id === div.id);
    matches[div.name] = divMatches.map(m => ({
        id: m.id,
        date: m.date,
        team1: teamNameMap.get(m.team1_id) || 'Unknown Team',
        team2: teamNameMap.get(m.team2_id) || 'Unknown Team',
        team1Wins: m.team1_wins,
        team2Wins: m.team2_wins,
        team1Points: m.team1_points_for,
        team2Points: m.team2_points_for
    }));
  });

  return {
    divisions,
    leaderboard,
    teamStats,
    matches
  };
};

// Keep a placeholder for initial render if needed, or remove if we fully switch to async
export const initialLeagueData: LeagueData = {
  divisions: [],
  leaderboard: {},
  teamStats: {},
  matches: {}
};