import { supabase } from './supabase';
import type { LeagueData, DivisionRow, TeamRow, MatchRow, Division, LeaderboardEntry, TeamStats, Match } from '../types';

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

    // Calculate aggregated stats for all teams in this division based on matches
    const teamAggregates = new Map<string, {
      matchWins: number;
      matchLosses: number;
      gamesWon: number;
      gamesLost: number;
      pointsFor: number;
      pointsAgainst: number;
      matchesPlayed: number;
    }>();

    // Initialize aggregates
    divTeams.forEach(t => {
      teamAggregates.set(t.id, {
        matchWins: 0,
        matchLosses: 0,
        gamesWon: 0,
        gamesLost: 0,
        pointsFor: 0,
        pointsAgainst: 0,
        matchesPlayed: 0
      });
    });

    // Process matches
    divMatches.forEach(m => {
      const t1 = teamAggregates.get(m.team1_id);
      const t2 = teamAggregates.get(m.team2_id);

      if (t1) {
        t1.matchesPlayed++;
        t1.gamesWon += m.team1_wins;
        t1.gamesLost += m.team2_wins;
        t1.pointsFor += m.team1_points_for;
        t1.pointsAgainst += m.team2_points_for;
        if (m.team1_wins > m.team2_wins) t1.matchWins++;
        else if (m.team2_wins > m.team1_wins) t1.matchLosses++;
      }

      if (t2) {
        t2.matchesPlayed++;
        t2.gamesWon += m.team2_wins;
        t2.gamesLost += m.team1_wins;
        t2.pointsFor += m.team2_points_for;
        t2.pointsAgainst += m.team1_points_for;
        if (m.team2_wins > m.team1_wins) t2.matchWins++;
        else if (m.team1_wins > m.team2_wins) t2.matchLosses++;
      }
    });
    
    // Build Leaderboard
    const entries: LeaderboardEntry[] = divTeams.map(t => {
      const stats = teamAggregates.get(t.id)!;
      const totalGames = stats.gamesWon + stats.gamesLost;
      const winPct = totalGames > 0 ? stats.gamesWon / totalGames : 0;
      
      return {
        team: t.name,
        wins: stats.gamesWon,
        losses: stats.gamesLost,
        winPct: Number(winPct.toFixed(3)),
        pointsFor: stats.pointsFor,
        pointsAgainst: stats.pointsAgainst
      };
    });
    
    // Sort leaderboard (Win % desc, then Points For desc)
    entries.sort((a, b) => {
        if (b.winPct !== a.winPct) return b.winPct - a.winPct;
        return b.pointsFor - a.pointsFor;
    });

    leaderboard[div.name] = entries;

    // Helper to find rank
    const getRank = (teamName: string) => entries.findIndex(e => e.team === teamName) + 1;

    // Build Team Stats
    const statsMap: Record<string, TeamStats> = {};
    divTeams.forEach(t => {
      const stats = teamAggregates.get(t.id)!;
      const totalGames = stats.gamesWon + stats.gamesLost;
      const winPct = totalGames > 0 ? stats.gamesWon / totalGames : 0;

      statsMap[t.name] = {
        rank: getRank(t.name),
        matchesPlayed: stats.matchesPlayed,
        gamesWon: stats.gamesWon,
        gamesLost: stats.gamesLost,
        winPct: Number(winPct.toFixed(3)),
        pointsFor: stats.pointsFor,
        pointsAgainst: stats.pointsAgainst
      };
    });
    teamStats[div.name] = statsMap;
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