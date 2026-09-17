import { createContext } from 'react';
import type { LeagueData } from '../types';

export interface LeagueContextType {
  data: LeagueData;
  loading: boolean;
  error: Error | null;
  refresh: () => void;
}

export const LeagueContext = createContext<LeagueContextType | undefined>(undefined);
