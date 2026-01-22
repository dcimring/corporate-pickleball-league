import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchLeagueData, initialLeagueData } from '../lib/data';
import type { LeagueData } from '../types';

interface LeagueContextType {
  data: LeagueData;
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

const LeagueContext = createContext<LeagueContextType | undefined>(undefined);

export const useLeagueData = () => {
  const context = useContext(LeagueContext);
  if (!context) {
    throw new Error('useLeagueData must be used within a LeagueProvider');
  }
  return context;
};

interface LeagueProviderProps {
  children: React.ReactNode;
  refreshInterval?: number; // Milliseconds, default 60000 (1 min)
}

export const LeagueProvider: React.FC<LeagueProviderProps> = ({ 
  children, 
  refreshInterval = 60000 
}) => {
  const [data, setData] = useState<LeagueData>(initialLeagueData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadData = async (isBackground = false) => {
    try {
      if (!isBackground) setLoading(true);
      const fetched = await fetchLeagueData();
      setData(fetched);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch league data:", err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    loadData();

    // Background refresh
    if (refreshInterval > 0) {
      const interval = setInterval(() => {
        loadData(true); // true = background refresh (no loading spinner)
      }, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [refreshInterval]);

  return (
    <LeagueContext.Provider value={{ data, loading, error, refresh: () => loadData(false) }}>
      {children}
    </LeagueContext.Provider>
  );
};
