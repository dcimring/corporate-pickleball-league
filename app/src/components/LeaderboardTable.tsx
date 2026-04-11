import React from 'react';
import { clsx } from 'clsx';
import { Info } from 'lucide-react';
import type { LeaderboardEntry } from '../types';

interface LeaderboardTableProps {
  stats: LeaderboardEntry[];
  onTeamClick: (teamName: string) => void;
}

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ stats, onTeamClick }) => {
  
  if (stats.length === 0) return (
    <div className="p-20 text-center flex flex-col items-center justify-center gap-6 bg-surface-container-low">
      <div className="bg-primary/5 p-8 rounded-none">
        <Info className="w-12 h-12 text-primary opacity-20" />
      </div>
      <div className="space-y-4">
        <h3 className="display-sm text-primary uppercase">No teams found</h3>
        <p className="body-lg text-on-surface-variant opacity-60 max-w-md mx-auto">The league is preparing for action. Check back soon for the latest standings and results.</p>
      </div>
    </div>
  );

  return (
    <div className="w-full flex flex-col gap-0">
      {/* Header Row - Tightened for mobile */}
      <div className="flex items-center px-2 md:px-6 py-4 bg-surface-container-high label-sm md:label-md text-on-surface-variant opacity-80">
        <div className="w-10 md:w-20 text-center">Rank</div>
        <div className="flex-1 pl-2 md:pl-12 text-left">Team</div>
        <div className="flex items-center justify-end gap-2 md:gap-12">
            <div className="w-12 md:w-24 text-center">W-L</div>
            <div className="w-12 md:w-24 text-center">Win %</div>
            <div className="hidden md:block w-32 text-center">Pts For/Against</div>
            <div className="w-10 md:w-20 text-right">
              <span className="md:hidden">Pts</span>
              <span className="hidden md:inline">Diff</span>
            </div>
        </div>
      </div>

      {/* Team Rows */}
      <div className="flex flex-col gap-0">
        {stats.map((entry, index) => {
          const diff = entry.pointsFor - entry.pointsAgainst;
          const isTop3 = index < 3;
          
          return (
            <div 
              key={entry.team} 
              onClick={() => onTeamClick(entry.team)}
              className="flex items-center transition-all duration-500 cursor-pointer group relative overflow-visible h-20 md:h-24 bg-surface-container-lowest hover:bg-surface-container-low z-10 border-b border-outline-variant/5 md:border-none"
            >
              {/* Rank */}
              <div className="h-full flex items-center justify-center w-10 md:w-20 relative">
                <span className={clsx(
                  "display-sm transition-transform duration-500 group-hover:scale-110",
                  index === 0 ? "text-primary" : 
                  index === 1 ? "text-primary/70" :
                  index === 2 ? "text-primary/50" : "text-primary/20",
                  "text-2xl md:text-4xl"
                )}>
                  {index + 1}
                </span>
              </div>

              {/* Team Name - Editorial Voice */}
              <div className="flex-1 pl-2 md:pl-12 pr-2">
                <span className="headline-md uppercase tracking-tight line-clamp-1 leading-none text-primary block transition-transform duration-500 group-hover:translate-x-4 text-sm md:text-2xl lg:text-3xl">
                    {entry.team}
                </span>
              </div>

              {/* Stats Group - Optimized gaps for mobile */}
              <div className="flex items-center justify-end gap-2 md:gap-12 pr-2 md:pr-6">
                {/* W-L */}
                <div className="w-12 md:w-24 text-center font-stat font-bold text-xs md:text-xl text-primary/60">
                  {entry.wins}-{entry.losses}
                </div>

                {/* % */}
                <div className={clsx(
                  "w-12 md:w-24 text-center font-stat font-black text-sm md:text-3xl tracking-tighter",
                  isTop3 ? "text-primary" : "text-primary/80"
                )}>
                  {(entry.winPct * 100).toFixed(0)}<span className="text-[0.6em] opacity-40 ml-0.5">%</span>
                </div>

                {/* PF-PA (Desktop Only) */}
                <div className="hidden md:block w-32 text-center font-stat font-medium text-sm text-on-surface-variant opacity-40">
                  {entry.pointsFor} <span className="mx-1 opacity-20">/</span> {entry.pointsAgainst}
                </div>

                {/* Pts (Mobile) / DIFF (Desktop) */}
                <div className="w-10 md:w-20 text-right">
                    {/* Mobile: Show Points For */}
                    <span className="md:hidden font-stat font-black text-sm text-primary/60">
                        {entry.pointsFor}
                    </span>
                    
                    {/* Desktop: Show Diff */}
                    <span className={clsx(
                      "hidden md:inline font-stat font-black md:text-lg",
                      diff > 0 ? "text-[#00A651]" : 
                      diff < 0 ? "text-[#E31837]" : 
                      "text-on-surface-variant opacity-20"
                    )}>
                        {diff > 0 ? '+' : ''}{diff}
                    </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
