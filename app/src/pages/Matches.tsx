import React, { useState, useEffect } from 'react';
import { fetchLeagueData, initialLeagueData } from '../lib/data';
import type { LeagueData } from '../types';
import { Loader2, Info } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Navigation } from '../components/Navigation';
import { MatchCard } from '../components/MatchCard';

export const Matches: React.FC = () => {
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
        const divisions = Object.keys(fetched.matches);
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

  const divisions = Object.keys(data.matches);
  const matches = data.matches[activeDivision] || [];

  const pageTabs = [
    { name: 'Leaderboard', path: '/leaderboard' },
    { name: 'Matches', path: '/matches' },
  ];

  return (
    <div className="space-y-8">
      <Navigation 
        pageTabs={pageTabs} 
        activePage="/matches" 
        divisions={divisions} 
        activeDivision={activeDivision} 
        onPageChange={handlePageChange} 
        onDivisionChange={handleDivisionChange} 
      />

      <div className="grid gap-6">
        {matches.length > 0 ? (
          matches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))
        ) : (
          <div className="p-16 text-center flex flex-col items-center justify-center gap-4 text-gray-400 bg-white rounded-2xl border border-gray-100">
            <div className="bg-blue-50 p-4 rounded-full">
              <Info className="w-8 h-8 text-brand-blue" />
            </div>
            <p className="font-heading font-bold text-xl text-brand-blue">No matches found</p>
            <p className="font-body text-gray-500">Check back later for the schedule!</p>
          </div>
        )}
      </div>
    </div>
  );
};
