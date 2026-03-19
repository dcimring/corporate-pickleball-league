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
    <div className="p-16 text-center flex flex-col items-center justify-center gap-4 text-secondary/40 bg-surface-container-low rounded-2xl">
      <div className="bg-primary/10 p-4 rounded-full">
        <Info className="w-8 h-8 text-primary" />
      </div>
      <p className="headline-md text-secondary">No teams found</p>
      <p className="body-md">Check back later for the schedule!</p>
    </div>
  );

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Header Row - Editorial Alignment */}
      <div className="flex items-center px-6 py-2 text-secondary/40">
        <div className="w-12 md:w-16 text-center label-md">Rank</div>
        <div className="flex-1 pl-4 md:pl-8 text-left title-md opacity-60">Team</div>
        <div className="flex items-center justify-end gap-2 md:gap-8 pr-4 md:pr-10">
            <div className="w-14 md:w-20 text-center label-md">W-L</div>
            <div className="w-12 md:w-16 text-center label-md">%</div>
            <div className="w-12 md:hidden text-center label-md opacity-0">PF</div>
            <div className="hidden md:block w-24 text-center label-md">PF-PA</div>
            <div className="hidden md:block w-16 text-right label-md">Diff</div>
        </div>
      </div>

      {/* Team Rows - Tonal Layering & Asymmetry */}
      <div className="flex flex-col gap-3">
        {stats.map((entry, index) => {
          const diff = entry.pointsFor - entry.pointsAgainst;
          const isTop3 = index < 3;
          
          return (
            <div 
              key={entry.team} 
              onClick={() => onTeamClick(entry.team)}
              className={clsx(
                "flex items-center rounded-2xl transition-all duration-500 cursor-pointer group relative overflow-visible h-16 md:h-20",
                isTop3 ? "bg-surface-container-lowest shadow-ambient scale-[1.01] z-10" : "bg-surface-container-low hover:bg-surface-container-highest/50"
              )}
            >
              {/* Rank Badge - Editorial Lexend Overlap */}
              <div className="h-full flex items-center justify-center w-12 md:w-16 relative">
                <span className={clsx(
                  "display-sm italic tracking-tighter transition-all duration-500",
                  index === 0 ? "text-primary scale-110" : 
                  index === 1 ? "text-secondary/60" :
                  index === 2 ? "text-tertiary/60" :
                  "text-secondary/20 headline-md not-italic"
                )}>
                  {index + 1}
                </span>
                
                {/* Visual marker for top rank */}
                {index === 0 && (
                  <div className="absolute -top-1 -left-1 w-4 h-4 bg-primary-container rounded-full blur-md opacity-50" />
                )}
              </div>

              {/* Team Name - Editorial Plus Jakarta */}
              <div className="flex-1 pl-4 md:pl-8 pr-2 relative z-10">
                <span className={clsx(
                  "headline-md transition-colors duration-300 line-clamp-1",
                  isTop3 ? "text-secondary" : "text-secondary/80 group-hover:text-secondary"
                )}>
                    {entry.team}
                </span>
              </div>

              {/* Stats Group - Lexend Impact */}
              <div className="flex items-center justify-end gap-2 md:gap-8 pr-4 md:pr-10 relative z-10">
                {/* W-L */}
                <div className="w-14 md:w-20 text-center headline-md !text-lg md:!text-xl text-secondary/90">
                  {entry.wins}<span className="opacity-30 mx-0.5">-</span>{entry.losses}
                </div>

                {/* % */}
                <div className="w-12 md:w-16 text-center display-sm !text-lg md:!text-2xl tracking-tighter text-primary">
                  {(entry.winPct * 100).toFixed(0)}<span className="text-[10px] md:text-xs ml-0.5 opacity-50">%</span>
                </div>

                {/* PF / PF-PA */}
                <div className="w-12 md:hidden text-center label-md text-secondary/40">
                  {entry.pointsFor}
                </div>
                <div className="hidden md:block w-24 text-center title-md !text-sm text-secondary/40 font-medium">
                  {entry.pointsFor}<span className="mx-1 opacity-20">/</span>{entry.pointsAgainst}
                </div>

                {/* DIFF (Desktop Only) - Subtle Tonal Pills */}
                <div className="hidden md:block w-16 text-right">
                    <span className={clsx(
                      "inline-flex items-center justify-center min-w-[44px] py-1 px-2 rounded-lg label-md !text-[10px] tracking-normal transition-all duration-500",
                      diff > 0 ? "bg-primary/10 text-primary" : 
                      diff < 0 ? "bg-tertiary/10 text-tertiary" : 
                      "bg-secondary/5 text-secondary/30"
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
