import React, { useState, useEffect } from 'react';
import { fetchLeagueData, initialLeagueData } from '../lib/data';
import type { LeagueData } from '../types';
import { Loader2 } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { LeaderboardTable } from '../components/LeaderboardTable';
import { Navigation } from '../components/Navigation';

export const Leaderboard: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [data, setData] = useState<LeagueData>(initialLeagueData);
  const [loading, setLoading] = useState(true);
  const [activeDivision, setActiveDivision] = useState<string>('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const fetched = await fetchLeagueData();
        setData(fetched);
        
        // Initial division selection logic
        const divisions = Object.keys(fetched.leaderboard);
        const paramDiv = searchParams.get('division');
        const defaultDiv = paramDiv && divisions.includes(paramDiv) 
          ? paramDiv 
          : (divisions.includes('Division A') ? 'Division A' : divisions[0] || '');
        
        if (activeDivision === '' || (paramDiv && activeDivision !== paramDiv)) {
             setActiveDivision(defaultDiv);
        }
      } catch (error) {
        console.error("Failed to fetch league data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [searchParams]);

  const handleDivisionChange = (div: string) => {
    setActiveDivision(div);
    setSearchParams({ division: div });
  };

  const handlePageChange = (path: string) => {
    // Navigate while preserving division param if possible, or just append it
    const currentDiv = searchParams.get('division') || activeDivision;
    if (currentDiv) {
        navigate(`${path}?division=${encodeURIComponent(currentDiv)}`);
    } else {
        navigate(path);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="w-10 h-10 text-brand-blue animate-spin" />
      </div>
    );
  }

  const divisions = Object.keys(data.leaderboard);
  const stats = data.leaderboard[activeDivision] || [];

  const pageTabs = [
    { name: 'Leaderboard', path: '/leaderboard' },
    { name: 'Matches', path: '/matches' },
  ];

  return (
    <div className="space-y-8">
      <Navigation 
        pageTabs={pageTabs} 
        activePage="/leaderboard" 
        divisions={divisions} 
        activeDivision={activeDivision} 
        onPageChange={handlePageChange} 
        onDivisionChange={handleDivisionChange} 
      />

      <div className="space-y-12">
        <LeaderboardTable stats={stats} />
      </div>
    </div>
  );
};
