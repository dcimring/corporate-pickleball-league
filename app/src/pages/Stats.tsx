import React, { useState, useEffect, useRef } from 'react';
import { fetchLeagueData, initialLeagueData } from '../lib/data';
import type { LeagueData } from '../types';
import { Activity, Loader2 } from 'lucide-react';
import { Card } from '../components/Card';
import { clsx } from 'clsx';
import { useSearchParams } from 'react-router-dom';

export const Stats: React.FC = () => {
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
        const divisionNames = Object.keys(fetched.teamStats);
        const paramDiv = searchParams.get('division');
        const defaultDiv = paramDiv && divisionNames.includes(paramDiv) ? paramDiv : divisionNames[0] || '';
        
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

  // Get all division names for the toggle
  const divisionNames = Object.keys(data.teamStats);
  
  // Get stats object for the active division
  const divisionStats = data.teamStats[activeDivision] || {};
  
  // Convert object to array for mapping and sort by rank
  const relevantTeamStats = Object.entries(divisionStats)
    .map(([name, stats]) => ({
      name,
      ...stats
    }))
    .sort((a, b) => a.rank - b.rank);

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-4xl font-heading font-bold text-brand-blue uppercase tracking-wide">
            The Numbers
          </h1>
          <p className="font-body text-gray-500 mt-2">Stats don't lie...</p>
        </div>

        {/* Division Toggle */}
        <div className="flex gap-2 overflow-x-auto md:overflow-x-visible md:flex-wrap no-scrollbar pb-2" ref={tabsRef}>
          {divisionNames.map((div) => (
            <button
              key={div}
              data-value={div}
              onClick={() => handleDivisionChange(div)}
              className={clsx(
                'px-4 py-1.5 md:px-6 md:py-2 text-xs md:text-sm font-heading font-bold uppercase tracking-wide rounded-full transition-all whitespace-nowrap',
                activeDivision === div
                  ? 'bg-brand-blue text-white shadow-md'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              )}
            >
              {div}
            </button>
          ))}
        </div>
      </div>

      {/* Team Stats Cards Grid */}
      {relevantTeamStats.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {relevantTeamStats.map((team, idx) => (
            <Card 
              key={team.name} 
              className="p-0 overflow-hidden"
              variant={idx % 2 === 0 ? 'highlight' : 'default'}
            >
              <div className={clsx(
                  "p-6 border-b flex justify-between items-center",
                  idx % 2 === 0 ? "bg-blue-50 border-blue-100" : "bg-gray-50 border-gray-100"
              )}>
                <div>
                    <h2 className="text-2xl font-heading font-bold text-brand-blue">{team.name}</h2>
                    <div className="flex items-center gap-2 font-bold text-xs mt-1 text-gray-500 uppercase tracking-widest">
                    <Activity className="w-4 h-4 text-brand-yellow" />
                    Team Analytics
                    </div>
                </div>
                <div className="text-2xl md:text-4xl font-heading font-bold text-gray-200">
                    #{team.rank}
                </div>
              </div>
              
              <div className="p-4 md:p-6 grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                
                {/* Matches Played */}
                <div className="bg-white p-3 md:p-4 rounded-xl border border-gray-100 shadow-sm">
                  <div className="text-[10px] md:text-xs font-bold uppercase tracking-wider mb-1 text-gray-400">Matches</div>
                  <div className="text-xl md:text-3xl font-heading font-bold text-brand-blue">{team.matchesPlayed}</div>
                </div>

                {/* Games Won */}
                <div className="bg-white p-3 md:p-4 rounded-xl border border-gray-100 shadow-sm">
                   <div className="text-[10px] md:text-xs font-bold uppercase tracking-wider mb-1 text-gray-400">Games Won</div>
                   <div className="text-xl md:text-3xl font-heading font-bold text-green-500">{team.gamesWon}</div>
                </div>

                {/* Games Lost */}
                <div className="bg-white p-3 md:p-4 rounded-xl border border-gray-100 shadow-sm">
                   <div className="text-[10px] md:text-xs font-bold uppercase tracking-wider mb-1 text-gray-400">Games Lost</div>
                   <div className="text-xl md:text-3xl font-heading font-bold text-red-500">{team.gamesLost}</div>
                </div>

                {/* Win % */}
                <div className="bg-white p-3 md:p-4 rounded-xl border border-gray-100 shadow-sm">
                  <div className="text-[10px] md:text-xs font-bold uppercase tracking-wider mb-1 text-gray-400">Win %</div>
                  <div className="text-xl md:text-3xl font-heading font-bold text-brand-blue">{(team.winPct * 100).toFixed(1)}%</div>
                </div>

                {/* Points For */}
                <div className="bg-white p-3 md:p-4 rounded-xl border border-gray-100 shadow-sm">
                   <div className="text-[10px] md:text-xs font-bold uppercase tracking-wider mb-1 text-gray-400">Points For</div>
                   <div className="text-xl md:text-3xl font-heading font-bold text-brand-blue">{team.pointsFor}</div>
                </div>

                {/* Points Against */}
                <div className="bg-white p-3 md:p-4 rounded-xl border border-gray-100 shadow-sm">
                   <div className="text-[10px] md:text-xs font-bold uppercase tracking-wider mb-1 text-gray-400">Points Agst</div>
                   <div className="text-xl md:text-3xl font-heading font-bold text-brand-blue">{team.pointsAgainst}</div>
                </div>

              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-100">
          <p className="font-heading text-xl text-gray-400">No stats available for this division yet.</p>
        </div>
      )}
    </div>
  );
};