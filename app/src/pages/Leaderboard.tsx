import React, { useState, useEffect, useRef } from 'react';
import { fetchLeagueData, initialLeagueData } from '../lib/data';
import type { LeagueData } from '../types';
import { Loader2 } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { DivisionTabs } from '../components/DivisionTabs';
import { PageTabs } from '../components/PageTabs';
import { LeaderboardTable } from '../components/LeaderboardTable';

export const Leaderboard: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabsRef = useRef<HTMLDivElement>(null);
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
  }, [searchParams]); // Re-run if URL params change externally, though local state handles clicks

  // Sync state to URL when user clicks tabs
  const handleDivisionChange = (div: string) => {
    setActiveDivision(div);
    setSearchParams({ division: div });
  };

  // Scroll active tab into view
  useEffect(() => {
    if (tabsRef.current && activeDivision) {
      const activeButton = tabsRef.current.querySelector(`button[data-value="${activeDivision}"]`);
      if (activeButton) {
        activeButton.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeDivision, loading]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="w-10 h-10 text-brand-blue animate-spin" />
      </div>
    );
  }

  const divisions = Object.keys(data.leaderboard);
  const stats = data.leaderboard[activeDivision] || [];

  return (
    <div className="space-y-4">
      {/* Navigation */}
      <div>
        <PageTabs />
        
        {/* Division Toggle */}
        <div ref={tabsRef} className="w-full">
          <DivisionTabs 
            divisions={divisions} 
            activeDivision={activeDivision} 
            onChange={handleDivisionChange} 
          />
        </div>
      </div>

      <div className="space-y-12">
        <LeaderboardTable stats={stats} />
      </div>
    </div>
  );
};
