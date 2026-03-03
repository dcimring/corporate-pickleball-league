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
    <div className="p-16 text-center flex flex-col items-center justify-center gap-4 text-gray-400 bg-white rounded-2xl border-4 border-dashed border-gray-100">
      <div className="bg-blue-50 p-4 rounded-full">
        <Info className="w-8 h-8 text-brand-blue" />
      </div>
      <p className="font-heading font-bold text-xl text-brand-blue">No teams found</p>
      <p className="font-body text-gray-500">Check back later for the schedule!</p>
    </div>
  );

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Header Row */}
      <div className="flex items-center px-2 py-1 text-[10px] md:text-xs font-heading font-black italic uppercase tracking-[0.2em] text-gray-400">
        <div className="w-10 md:w-16 text-center">#</div>
        <div className="flex-1 pl-4 md:pl-8 text-left">Team</div>
        <div className="flex items-center justify-end gap-4 md:gap-8 pr-4 md:pr-12">
            <div className="w-12 md:w-20 text-center">W-L</div>
            <div className="w-10 md:w-16 text-center">%</div>
            <div className="w-12 md:w-20 text-center">PTS</div>
            <div className="hidden md:block w-20 text-right">DIFF</div>
        </div>
      </div>

      {/* Team Rows as Cards */}
      <div className="flex flex-col gap-2.5">
        {stats.map((entry, index) => {
          const diff = entry.pointsFor - entry.pointsAgainst;
          const isTop3 = index < 3;
          
          return (
            <div 
              key={entry.team} 
              onClick={() => onTeamClick(entry.team)}
              className="flex items-center bg-white rounded-xl md:rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group relative overflow-hidden h-[52px] md:h-14"
            >
              {/* Rank Badge (Skewed) */}
              <div className="h-full flex items-center justify-center w-10 md:w-12 relative z-20">
                <div className={clsx(
                  "absolute inset-0 transform -skew-x-12",
                  index === 0 ? "bg-brand-yellow shadow-[4px_0_15px_rgba(255,199,44,0.3)]" : 
                  index === 1 ? "bg-gray-200" :
                  index === 2 ? "bg-orange-100" : "bg-transparent"
                )} />
                <span className={clsx(
                  "relative z-10 font-heading font-black text-sm md:text-lg italic",
                  index === 0 ? "text-brand-blue" : 
                  index === 1 ? "text-gray-600" :
                  index === 2 ? "text-orange-800" : "text-gray-300"
                )}>
                  {index + 1}
                </span>
              </div>

              {/* Team Name */}
              <div className="flex-1 pl-4 md:pl-6 pr-2 relative z-10 transition-transform duration-200 group-hover:translate-x-1">
                <span className="font-heading font-black italic text-xs md:text-base uppercase tracking-tight line-clamp-1 leading-none text-brand-blue block transition-colors">
                    {entry.team}
                </span>
              </div>

              {/* Stats Group */}
              <div className="flex items-center justify-end gap-4 md:gap-6 pr-4 md:pr-8 relative z-10 transition-transform duration-200 group-hover:translate-x-1">
                {/* W-L */}
                <div className="w-12 md:w-16 text-center font-mono font-black text-[11px] md:text-sm text-gray-700">
                  {entry.wins}-{entry.losses}
                </div>

                {/* % */}
                <div className={clsx(
                    "w-10 md:w-14 text-center font-heading font-black italic text-[13px] md:text-lg tracking-tighter",
                    isTop3 ? "text-brand-blue" : "text-gray-500"
                )}>
                  {(entry.winPct * 100).toFixed(0)}%
                </div>

                {/* PTS */}
                <div className="w-12 md:w-16 text-center font-mono font-black text-[11px] md:text-sm text-gray-600">
                  {entry.pointsFor}
                </div>

                {/* DIFF (Desktop Only) */}
                <div className="hidden md:block w-16 text-right">
                    <span className={clsx(
                      "font-mono font-black text-sm",
                      diff > 0 ? "text-green-600" : 
                      diff < 0 ? "text-red-600" : 
                      "text-gray-400"
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
