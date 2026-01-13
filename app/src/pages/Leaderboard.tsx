import React, { useState, useEffect, useRef } from 'react';
import { leagueData } from '../lib/data';
import { clsx } from 'clsx';
import { Trophy, TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';
import { Card } from '../components/Card';
import { Underline, Squiggle } from '../components/Doodle';
import { useSearchParams } from 'react-router-dom';

export const Leaderboard: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const divisions = Object.keys(leagueData.leaderboard);
  const tabsRef = useRef<HTMLDivElement>(null);
  
  // Initialize from URL or default
  const [activeDivision, setActiveDivision] = useState<string>(() => {
    const div = searchParams.get('division');
    return div && divisions.includes(div) ? div : 'Division A';
  });

  // Sync state to URL when user clicks tabs
  const handleDivisionChange = (div: string) => {
    setActiveDivision(div);
    setSearchParams({ division: div });
  };

  // Scroll active tab into view
  useEffect(() => {
    if (tabsRef.current) {
      const activeButton = tabsRef.current.querySelector(`button[data-value="${activeDivision}"]`);
      if (activeButton) {
        activeButton.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeDivision]);

  const stats = leagueData.leaderboard[activeDivision] || [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="pb-3 relative inline-block">
          <h1 className="text-6xl font-heading text-white italic relative inline-block tracking-wide">
            LEADERBOARD
            <Underline className="absolute bottom-0 left-0 w-full h-4 text-brand-acid -z-10" />
          </h1>
          <p className="font-body text-xl text-gray-400 mt-2 uppercase tracking-widest">Who's dominating the court?</p>
          <Squiggle className="w-32 h-6 text-brand-acid absolute -bottom-4 left-0" />
        </div>

        {/* Division Toggle */}
        <div className="relative group max-w-full">
          <div ref={tabsRef} className="flex gap-2 bg-brand-soft-blue border border-white/10 p-2 shadow-glow overflow-x-auto no-scrollbar md:flex-wrap md:overflow-visible">
            {divisions.map((div) => (
              <button
                key={div}
                data-value={div}
                onClick={() => handleDivisionChange(div)}
                className={clsx(
                  'px-4 py-2 text-sm font-heading italic tracking-wider transition-all border skew-x-[-10deg] whitespace-nowrap flex-shrink-0',
                  activeDivision === div
                    ? 'bg-brand-acid text-brand-cream border-brand-acid shadow-glow'
                    : 'bg-transparent text-gray-400 border-transparent hover:border-white/30 hover:text-white'
                )}
              >
                <span className="skew-x-[10deg] block">{div}</span>
              </button>
            ))}
          </div>
          {/* Fade Mask */}
          <div className="absolute top-0 bottom-0 right-0 w-12 bg-gradient-to-l from-brand-soft-blue via-brand-soft-blue/40 to-transparent pointer-events-none md:hidden" />
        </div>
      </div>

      {/* Table Card */}
      <Card className="p-0 overflow-hidden bg-brand-soft-blue border border-white/10 shadow-hard">
        {stats.length > 0 ? (
          <div className="relative">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-black/20 border-b border-white/10 font-heading text-lg sm:text-xl text-brand-acid italic tracking-wider">
                    <th className="px-3 sm:px-6 py-3 sm:py-5 whitespace-nowrap">Rank</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-5 w-1/3 whitespace-nowrap">Team</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-5 text-center bg-white/5 border-x border-white/5 whitespace-nowrap">W</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-5 text-center whitespace-nowrap">L</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-5 text-center text-white bg-brand-acid/10 whitespace-nowrap">Win %</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-5 text-center hidden sm:table-cell border-l border-white/5 whitespace-nowrap">PF</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-5 text-center hidden sm:table-cell whitespace-nowrap">PA</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-5 text-center hidden sm:table-cell border-l border-white/5 whitespace-nowrap">Diff</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {stats.map((entry, index) => {
                    const diff = entry.pointsFor - entry.pointsAgainst;
                    return (
                      <tr 
                        key={entry.team} 
                        className={clsx(
                          "hover:bg-white/5 transition-colors font-body",
                          index < 3 && "bg-brand-acid/5"
                        )}
                      >
                        <td className="px-3 sm:px-6 py-3 sm:py-4 font-heading text-lg sm:text-2xl text-gray-500 italic">
                          #{index + 1}
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4">
                          <div className="flex items-center gap-3">
                            {index === 0 && <div className="bg-brand-acid text-brand-cream p-1 skew-x-[-10deg]"><Trophy className="w-3 h-3 sm:w-4 sm:h-4 skew-x-[10deg]" /></div>}
                            <span className={clsx("font-bold text-sm sm:text-lg whitespace-nowrap", index === 0 ? "text-brand-acid" : "text-white")}>
                              {entry.team}
                            </span>
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-center font-bold text-base sm:text-xl border-x border-white/5 bg-black/20 text-white">{entry.wins}</td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-center font-medium text-sm sm:text-base text-gray-500">{entry.losses}</td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-center font-heading text-base sm:text-xl text-brand-acid bg-brand-acid/5">
                          {(entry.winPct * 100).toFixed(0)}%
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-center hidden sm:table-cell text-gray-400">{entry.pointsFor}</td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-center hidden sm:table-cell text-gray-400">{entry.pointsAgainst}</td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-center hidden sm:table-cell border-l border-white/5">
                          <span className={clsx(
                            "inline-flex items-center px-2 py-1 text-sm font-bold border skew-x-[-10deg]",
                            diff > 0 ? "bg-green-900/30 text-green-400 border-green-500/30" : diff < 0 ? "bg-red-900/30 text-red-400 border-red-500/30" : "bg-gray-800 text-gray-400 border-gray-600"
                          )}>
                            <span className="skew-x-[10deg] flex items-center">
                              {diff > 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : diff < 0 ? <TrendingDown className="w-3 h-3 mr-1" /> : <Minus className="w-3 h-3 mr-1" />}
                              {diff > 0 ? '+' : ''}{diff}
                            </span>
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {/* Fade Mask (Scrim) */}
            <div className="absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-brand-soft-blue via-brand-soft-blue/40 to-transparent pointer-events-none md:hidden" />
          </div>
        ) : (
          <div className="p-16 text-center flex flex-col items-center justify-center gap-4 text-gray-500 bg-black/20">
            <div className="bg-brand-soft-blue p-4 border border-brand-acid/30 shadow-glow">
              <Info className="w-8 h-8 text-brand-acid" />
            </div>
            <p className="font-heading text-2xl italic text-white">No data available yet</p>
            <p className="font-body text-lg">Matches start soon!</p>
          </div>
        )}
      </Card>
    </div>
  );
};