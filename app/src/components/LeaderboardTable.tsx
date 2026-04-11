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
      {/* Header Row - Tonal Layering */}
      <div className="flex items-center px-6 py-4 bg-surface-container-high label-md text-on-surface-variant opacity-80">
        <div className="w-12 md:w-20 text-center">Rank</div>
        <div className="flex-1 pl-4 md:pl-12 text-left">Team</div>
        <div className="flex items-center justify-end gap-6 md:gap-12">
            <div className="w-16 md:w-24 text-center">Record</div>
            <div className="w-16 md:w-24 text-center">Win %</div>
            <div className="hidden md:block w-32 text-center">Pts For/Against</div>
            <div className="hidden md:block w-20 text-right">Diff</div>
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
              className="flex items-center transition-all duration-500 cursor-pointer group relative overflow-visible h-20 md:h-24 bg-surface-container-lowest hover:bg-surface-container-low z-10"
            >
              {/* Rank - Stadium Voice */}
              <div className="h-full flex items-center justify-center w-12 md:w-20 relative">
                <span className={clsx(
                  "display-sm transition-transform duration-500 group-hover:scale-110",
                  index === 0 ? "text-primary" : 
                  index === 1 ? "text-primary/70" :
                  index === 2 ? "text-primary/50" : "text-primary/20"
                )}>
                  {(index + 1).toString().padStart(2, '0')}
                </span>
              </div>

              {/* Team Name - Editorial Voice */}
              <div className="flex-1 pl-4 md:pl-12 pr-4">
                <span className="headline-md uppercase tracking-tight line-clamp-1 leading-none text-primary block transition-transform duration-500 group-hover:translate-x-4">
                    {entry.team}
                </span>
              </div>

              {/* Stats Group - Stat Voice (Lexend) */}
              <div className="flex items-center justify-end gap-6 md:gap-12 pr-6">
                {/* W-L */}
                <div className="w-16 md:w-24 text-center font-stat font-bold text-sm md:text-xl text-primary/60">
                  {entry.wins}-{entry.losses}
                </div>

                {/* % */}
                <div className={clsx(
                  "w-16 md:w-24 text-center font-stat font-black text-xl md:text-3xl tracking-tighter",
                  isTop3 ? "text-primary" : "text-primary/80"
                )}>
                  {(entry.winPct * 100).toFixed(0)}<span className="text-[0.6em] opacity-40 ml-0.5">%</span>
                </div>

                {/* PF-PA (Desktop Only) */}
                <div className="hidden md:block w-32 text-center font-stat font-medium text-sm text-on-surface-variant opacity-40">
                  {entry.pointsFor} <span className="mx-1 opacity-20">/</span> {entry.pointsAgainst}
                </div>

                {/* DIFF (Desktop Only) */}
                <div className="hidden md:block w-20 text-right">
                    <span className={clsx(
                      "font-stat font-black text-lg",
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
