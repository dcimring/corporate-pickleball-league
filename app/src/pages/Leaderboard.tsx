import React, { useState, useEffect, useRef } from 'react';
import { fetchLeagueData, initialLeagueData } from '../lib/data';
import type { LeagueData } from '../types';
import { clsx } from 'clsx';
import { Trophy, TrendingUp, TrendingDown, Minus, Info, Loader2 } from 'lucide-react';
import { Card } from '../components/Card';
import { useSearchParams } from 'react-router-dom';

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
        const defaultDiv = paramDiv && divisions.includes(paramDiv) ? paramDiv : divisions[0] || '';
        
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
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-4xl font-heading font-bold text-brand-blue uppercase tracking-wide">
            Leaderboard
          </h1>
          <p className="font-body text-gray-500 mt-2">Who's dominating the court?</p>
        </div>

        {/* Division Toggle */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2" ref={tabsRef}>
          {divisions.map((div) => (
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

      {/* Table Card */}
      <Card className="p-0 overflow-hidden shadow-soft">
        {stats.length > 0 ? (
          <div className="relative">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 font-heading font-bold text-xs md:text-sm text-gray-500 uppercase tracking-wider">
                    <th className="px-2 py-2 md:px-6 md:py-4 whitespace-nowrap">Rank</th>
                    <th className="px-2 py-2 md:px-6 md:py-4 whitespace-nowrap">Team</th>
                    <th className="px-2 py-2 md:px-6 md:py-4 text-center whitespace-nowrap">W</th>
                    <th className="px-2 py-2 md:px-6 md:py-4 text-center whitespace-nowrap">L</th>
                    <th className="px-2 py-2 md:px-6 md:py-4 text-center whitespace-nowrap">Win %</th>
                    <th className="px-2 py-2 md:px-6 md:py-4 text-center hidden sm:table-cell whitespace-nowrap">PF</th>
                    <th className="px-2 py-2 md:px-6 md:py-4 text-center hidden sm:table-cell whitespace-nowrap">PA</th>
                    <th className="px-2 py-2 md:px-6 md:py-4 text-center hidden sm:table-cell whitespace-nowrap">Diff</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {stats.map((entry, index) => {
                    const diff = entry.pointsFor - entry.pointsAgainst;
                    return (
                      <tr 
                        key={entry.team} 
                        className={clsx(
                          "hover:bg-blue-50/50 transition-colors font-body",
                          index < 3 && "bg-yellow-50/50"
                        )}
                      >
                        <td className="px-2 py-2 md:px-6 md:py-4 font-heading font-bold text-gray-400 text-xs md:text-sm">
                          #{index + 1}
                        </td>
                        <td className="px-2 py-2 md:px-6 md:py-4 text-xs md:text-sm">
                          <div className="flex items-center gap-2 md:gap-3">
                            {index === 0 && <Trophy className="w-4 h-4 md:w-5 md:h-5 text-brand-yellow" />}
                            <span className={clsx("font-bold whitespace-nowrap text-brand-blue text-xs md:text-base")}>
                              {entry.team}
                            </span>
                          </div>
                        </td>
                        <td className="px-2 py-2 md:px-6 md:py-4 text-center font-bold text-brand-blue text-xs md:text-sm">{entry.wins}</td>
                        <td className="px-2 py-2 md:px-6 md:py-4 text-center font-medium text-gray-400 text-xs md:text-sm">{entry.losses}</td>
                        <td className="px-2 py-2 md:px-6 md:py-4 text-center font-bold text-brand-blue text-xs md:text-sm">
                          {(entry.winPct * 100).toFixed(0)}%
                        </td>
                        <td className="px-2 py-2 md:px-6 md:py-4 text-center hidden sm:table-cell text-gray-500 text-xs md:text-sm">{entry.pointsFor}</td>
                        <td className="px-2 py-2 md:px-6 md:py-4 text-center hidden sm:table-cell text-gray-500 text-xs md:text-sm">{entry.pointsAgainst}</td>
                        <td className="px-2 py-2 md:px-6 md:py-4 text-center hidden sm:table-cell text-xs md:text-sm">
                          <span className={clsx(
                            "inline-flex items-center px-2 py-1 text-[10px] md:text-xs font-bold rounded-full",
                            diff > 0 ? "bg-green-100 text-green-700" : diff < 0 ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-500"
                          )}>
                             {diff > 0 ? <TrendingUp className="w-2.5 h-2.5 md:w-3 md:h-3 mr-1" /> : diff < 0 ? <TrendingDown className="w-2.5 h-2.5 md:w-3 md:h-3 mr-1" /> : <Minus className="w-2.5 h-2.5 md:w-3 md:h-3 mr-1" />}
                             {diff > 0 ? '+' : ''}{diff}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="p-16 text-center flex flex-col items-center justify-center gap-4 text-gray-400">
            <div className="bg-blue-50 p-4 rounded-full">
              <Info className="w-8 h-8 text-brand-blue" />
            </div>
            <p className="font-heading font-bold text-xl text-brand-blue">No data available yet</p>
            <p className="font-body text-gray-500">Matches start soon!</p>
          </div>
        )}
      </Card>
    </div>
  );
};
