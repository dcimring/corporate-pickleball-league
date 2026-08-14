import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLeagueData } from '../context/LeagueContext';

// Shared division resolution: URL param wins, then preferred defaults, then first available.
// Deriving directly from the URL prevents dual-render flicker on navigation.
export const useActiveDivision = () => {
  const [searchParams] = useSearchParams();
  const { data, loading } = useLeagueData();

  const divisions = useMemo(() => {
    if (loading || !data.leaderboard) return [];
    return Object.keys(data.leaderboard);
  }, [loading, data.leaderboard]);

  const activeDivision = useMemo(() => {
    if (divisions.length === 0) return '';
    const paramDiv = searchParams.get('division');
    if (paramDiv && divisions.includes(paramDiv)) return paramDiv;

    if (divisions.includes('Division A')) return 'Division A';
    return divisions.includes('Cayman Premier League') ? 'Cayman Premier League' : divisions[0] || '';
  }, [divisions, searchParams]);

  return { divisions, activeDivision };
};
