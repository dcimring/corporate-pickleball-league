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
    <div className="p-20 text-center flex flex-col items-center justify-center gap-6 bg-brand-gray rounded-lg shadow-ambient border border-outline-variant">
      <div className="bg-brand-blue/10 p-5 rounded-full">
        <Info className="w-10 h-10 text-brand-blue" />
      </div>
      <div className="space-y-2">
        <h3 className="headline-md text-brand-blue uppercase">No teams found</h3>
        <p className="body-md text-brand-ink/40">Check back soon for the latest schedule and results!</p>
      </div>
    </div>
  );

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Header Row */}
      <div className="flex items-center px-2 py-1 label-md text-brand-blue/40 uppercase tracking-[0.2em]">
        <div className="w-12 md:w-16 text-center">#</div>
        <div className="flex-1 pl-4 md:pl-8 text-left">Team</div>
        <div className="flex items-center justify-end gap-3 md:gap-8 pr-4 md:pr-10">
            <div className="w-12 md:w-20 text-center">W-L</div>
            <div className="w-12 md:w-16 text-center">%</div>
            <div className="hidden md:block w-24 text-center">PF-PA</div>
            <div className="hidden md:block w-16 text-right">DIFF</div>
        </div>
      </div>

      {/* Team Rows as Cards */}
      <div className="flex flex-col gap-2">
        {stats.map((entry, index) => {
          const diff = entry.pointsFor - entry.pointsAgainst;
          const isTop3 = index < 3;
          
          return (
            <div 
              key={entry.team} 
              onClick={() => onTeamClick(entry.team)}
              className="flex items-center rounded-lg shadow-ambient transition-all duration-300 cursor-pointer group relative overflow-visible h-[64px] md:h-20 bg-white hover:scale-[1.02] hover:z-20 z-10"
            >
              {/* Rank Badge - Kinetic Overlap */}
              <div className="h-full flex items-center justify-center w-12 md:w-16 relative z-20">
                {isTop3 ? (
                  <div className={clsx(
                    "w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-sm -ml-4 transition-transform duration-300 group-hover:scale-110",
                    index === 0 ? "bg-brand-yellow" : 
                    "bg-brand-gray border border-outline-variant"
                  )}>
                    <span className={clsx(
                      "font-heading font-black italic text-xl md:text-2xl",
                      index === 0 ? "text-brand-blue" : 
                      index === 1 ? "text-brand-blue/60" : "text-brand-blue/40"
                    )}>
                      {index + 1}
                    </span>
                  </div>
                ) : (
                  <span className="display-sm italic -ml-4 text-brand-blue/20">
                    {index + 1}
                  </span>
                )}
              </div>

              {/* Team Name - Editorial Style */}
              <div className="flex-1 pl-2 md:pl-4 pr-2 relative z-10">
                <span className="title-md md:headline-md uppercase tracking-tight line-clamp-1 leading-none text-brand-blue block transition-transform duration-300 group-hover:translate-x-2">
                    {entry.team}
                </span>
              </div>

              {/* Stats Group */}
              <div className="flex items-center justify-end gap-3 md:gap-8 pr-4 md:pr-10 relative z-10">
                {/* W-L */}
                <div className="w-12 md:w-20 text-center font-heading font-bold text-xs md:text-base text-brand-blue/60">
                  {entry.wins}-{entry.losses}
                </div>

                {/* % */}
                <div className={clsx(
                  "w-12 md:w-16 text-center font-heading font-extrabold italic text-base md:text-2xl tracking-tighter",
                  isTop3 ? "text-brand-blue" : "text-brand-blue/80"
                )}>
                  {(entry.winPct * 100).toFixed(0)}%
                </div>

                {/* PF-PA (Desktop Only) */}
                <div className="hidden md:block w-24 text-center font-body font-medium text-sm text-brand-ink/40">
                  {entry.pointsFor}-{entry.pointsAgainst}
                </div>

                {/* DIFF (Desktop Only) - Semantic Kinetic Pills */}
                <div className="hidden md:block w-16 text-right">
                    <span className={clsx(
                      "inline-block min-w-[44px] px-2 py-1 rounded-md font-heading font-bold text-[10px] text-center uppercase tracking-wider",
                      diff > 0 ? "bg-green-100 text-green-700" : 
                      diff < 0 ? "bg-brand-red/10 text-brand-red" : 
                      "bg-brand-gray text-brand-ink/30"
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
