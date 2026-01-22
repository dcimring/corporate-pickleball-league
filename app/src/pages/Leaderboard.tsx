import React, { useState, useEffect, useRef } from 'react';
import { fetchLeagueData, initialLeagueData } from '../lib/data';
import type { LeagueData } from '../types';
import { Loader2 } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { LeaderboardTable } from '../components/LeaderboardTable';
import { NavigationVariant } from '../components/NavigationVariants';

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

  const pageTabs = [
    { name: 'Leaderboard', path: '/leaderboard' },
    { name: 'Matches', path: '/matches' },
  ];

  const handlePageChange = (path: string) => {
    // Just a mock handler for the visual review
    console.log("Navigating to:", path);
  };

  return (
    <div className="space-y-12">
      {/* Design Review: Option 1 */}
      <div className="space-y-4">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4">Option 1: Refined Pill (Current Polish)</p>
        <NavigationVariant 
            pageTabs={pageTabs} 
            activePage="/leaderboard" 
            divisions={divisions} 
            activeDivision={activeDivision} 
            onPageChange={handlePageChange} 
            onDivisionChange={handleDivisionChange}
            variant="refined-pill" 
        />
        <div className="pt-4">
            <LeaderboardTable stats={stats} />
        </div>
      </div>

      {/* Design Review: Option 2 */}
      <div className="space-y-4 pt-12 border-t border-dashed border-gray-200">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4">Option 2: Underline Glow</p>
        <NavigationVariant 
            pageTabs={pageTabs} 
            activePage="/leaderboard" 
            divisions={divisions} 
            activeDivision={activeDivision} 
            onPageChange={handlePageChange} 
            onDivisionChange={handleDivisionChange}
            variant="underline-glow" 
        />
        <div className="pt-4">
            <LeaderboardTable stats={stats} />
        </div>
      </div>

      {/* Design Review: Option 3 */}
      <div className="space-y-4 pt-12 border-t border-dashed border-gray-200">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4">Option 3: Varsity Block</p>
        <NavigationVariant 
            pageTabs={pageTabs} 
            activePage="/leaderboard" 
            divisions={divisions} 
            activeDivision={activeDivision} 
            onPageChange={handlePageChange} 
            onDivisionChange={handleDivisionChange}
            variant="varsity-block" 
        />
        <div className="pt-4">
            <LeaderboardTable stats={stats} />
        </div>
      </div>
    </div>
  );
};
