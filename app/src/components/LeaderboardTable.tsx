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
      {/* Header Row - Refined Editorial Labels */}
      <div className="flex items-center px-1 md:px-6 py-4 border-b border-primary/10 label-sm md:label-md text-primary/40 font-black tracking-widest uppercase">
        <div className="w-10 md:w-20 text-center">Rank</div>
        <div className="flex-1 pl-2 md:pl-12 text-left">Team</div>
        <div className="flex items-center justify-end gap-1 md:gap-12">
            <div className="w-14 md:w-24 text-center">W-L</div>
            <div className="w-14 md:w-24 text-center">Win %</div>
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
              className={clsx(
                "flex items-center transition-all duration-500 cursor-pointer group relative overflow-visible h-20 md:h-24 z-10 border-b border-outline-variant/5 md:border-none px-1 md:px-0",
                index === 0 ? "bg-primary/[0.03] hover:bg-primary/[0.05]" : "bg-surface-container-lowest hover:bg-surface-container-low"
              )}
            >
              {/* Vertical Accent Bar */}
              <div className={clsx(
                "absolute left-0 top-0 bottom-0 w-1 md:w-1.5 transition-transform duration-500",
                index === 0 ? "bg-secondary scale-y-100" : 
                index < 3 ? "bg-primary/40 scale-y-75 group-hover:scale-y-100" : 
                "bg-primary/5 scale-y-50 group-hover:scale-y-75"
              )} />

              {/* Rank */}
              <div className="h-full flex items-center justify-center w-10 md:w-20 relative">
                <span className={clsx(
                  "display-sm transition-transform duration-500 group-hover:scale-110",
                  index === 0 ? "text-primary" : 
                  index === 1 ? "text-primary/70" :
                  index === 2 ? "text-primary/50" : "text-primary/20",
                  "text-3xl md:text-4xl"
                )}>
                  {index + 1}
                </span>
              </div>

              {/* Team Name - Editorial Voice */}
              <div className="flex-1 pl-2 md:pl-12 pr-2">
                <span className={clsx(
                    "headline-md uppercase tracking-tight line-clamp-1 leading-none block transition-transform duration-500 group-hover:translate-x-4 text-sm md:text-2xl lg:text-3xl",
                    index === 0 ? "text-primary font-black" : "text-primary/90"
                )}>
                    {entry.team}
                </span>
              </div>

              {/* Stats Group - Optimized gaps for mobile */}
              <div className="flex items-center justify-end gap-1 md:gap-12 pr-1 md:pr-6">
                {/* W-L */}
                <div className="w-14 md:w-24 text-center font-stat font-bold text-base md:text-xl">
                  <span className={clsx(index === 0 ? "text-primary" : "text-primary/60")}>{entry.wins}</span>
                  <span className="text-primary/10 mx-0.5">-</span>
                  <span className="text-primary/30 font-medium">{entry.losses}</span>
                </div>

                {/* % */}
                <div className={clsx(
                  "w-14 md:w-24 text-center font-stat font-black text-xl md:text-3xl tracking-tighter",
                  index === 0 ? "text-primary" : 
                  index < 3 ? "text-primary/80" : "text-primary/60"
                )}>
                  {(entry.winPct * 100).toFixed(0)}<span className="text-[0.6em] opacity-30 ml-0.5 font-bold">%</span>
                </div>

                {/* PF-PA (Desktop Only) */}
                <div className="hidden md:block w-32 text-center font-stat font-medium text-sm text-on-surface-variant opacity-40">
                  {entry.pointsFor} <span className="mx-1 opacity-20">/</span> {entry.pointsAgainst}
                </div>

                {/* Pts (Mobile) / DIFF (Desktop) */}
                <div className="w-10 md:w-20 text-right">
                    {/* Mobile: Show Points For */}
                    <span className="md:hidden font-stat font-black text-base text-primary/60">
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
