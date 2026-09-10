import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { emptyLeagueData } from '../../convex/lib/aggregate';
import type { LeagueData } from '../types';

interface LeagueContextType {
  data: LeagueData;
  loading: boolean;
  error: Error | null;
  refresh: () => void;
}

const LeagueContext = createContext<LeagueContextType | undefined>(undefined);

export const useLeagueData = () => {
  const context = useContext(LeagueContext);
  if (!context) {
    throw new Error('useLeagueData must be used within a LeagueProvider');
  }
  return context;
};

const initialLeagueData: LeagueData = emptyLeagueData();

// Minimum time the loading screen stays up, so the connection-error retry
// state is visible instead of flickering. Deliberate — keep it.
const MIN_LOADING_MS = 500;
// How long to wait for the first result before showing the connection error.
const CONNECT_TIMEOUT_MS = 12000;

export const LeagueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Live subscription: Convex pushes a new value whenever an import lands.
  const result = useQuery(api.league.get);
  const hasData = result !== undefined;

  const [attempt, setAttempt] = useState(0);
  const [floorElapsed, setFloorElapsed] = useState(false);
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFloorElapsed(true), MIN_LOADING_MS);
    return () => clearTimeout(timer);
  }, [attempt]);

  useEffect(() => {
    if (hasData) return;
    const timer = setTimeout(() => setTimedOut(true), CONNECT_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [hasData, attempt]);

  // The client reconnects on its own; a retry just clears the error and
  // restarts the loading floor and timeout window.
  const refresh = useCallback(() => {
    setFloorElapsed(false);
    setTimedOut(false);
    setAttempt((n) => n + 1);
  }, []);

  const error = !hasData && timedOut ? new Error('Connection timed out') : null;
  const loading = !floorElapsed || (!hasData && !error);

  return (
    <LeagueContext.Provider value={{ data: result ?? initialLeagueData, loading, error, refresh }}>
      {children}
    </LeagueContext.Provider>
  );
};
