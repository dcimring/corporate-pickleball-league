import { useContext } from 'react';
import { LeagueContext } from '../context/league-context';

export const useLeagueData = () => {
  const context = useContext(LeagueContext);
  if (!context) {
    throw new Error('useLeagueData must be used within a LeagueProvider');
  }
  return context;
};
