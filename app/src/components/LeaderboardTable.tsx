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
    <div className="w-full overflow-hidden bg-white relative rounded-[2rem]">
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-left border-collapse relative z-10 min-w-[320px]">
          <thead>
            <tr className="text-brand-blue border-b-4 border-brand-yellow">
              {/* Rank */}
              <th className="py-6 text-center font-heading font-black italic text-xs md:text-sm tracking-widest w-[40px] md:w-[80px] bg-gray-50/50">#</th>
              
              {/* Team */}
              <th className="py-6 pl-4 md:pl-8 font-heading font-black italic text-xs md:text-sm tracking-widest">TEAM</th>
              
              {/* W-L */}
              <th className="py-6 text-center font-heading font-black italic text-xs md:text-sm tracking-widest w-[60px] md:w-[100px]">W-L</th>

              {/* Shared: % */}
              <th className="py-6 text-center font-heading font-black italic text-xs md:text-sm tracking-widest w-[50px] md:w-[100px]">%</th>

              {/* Desktop: PTS (For-Against) */}
              <th className="hidden md:table-cell py-6 text-center font-heading font-black italic text-sm tracking-widest w-[120px]">PTS</th>

              {/* Mobile: PTS (For only) */}
              <th className="md:hidden py-6 text-center font-heading font-black italic text-xs tracking-widest w-[50px]">PTS</th>

              {/* Desktop: DIFF */}
              <th className="hidden md:table-cell py-6 pr-8 text-right font-heading font-black italic text-sm tracking-widest w-[100px]">DIFF</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 divide-dashed">
            {stats.map((entry, index) => {
              const diff = entry.pointsFor - entry.pointsAgainst;
              const isTop3 = index < 3;
              
              return (
                <tr 
                  key={entry.team} 
                  onClick={() => onTeamClick(entry.team)}
                  className="hover:bg-brand-blue/[0.02] transition-colors duration-200 group cursor-pointer align-middle relative overflow-hidden"
                >
                  {/* Rank */}
                  <td className="py-4 bg-gray-50/30">
                    <div className={clsx(
                      "flex items-center justify-center font-heading font-black mx-auto transform transition-transform group-hover:scale-110",
                      "w-7 h-7 text-[10px] md:w-9 md:h-9 md:text-base -skew-x-12",
                      index === 0 ? "bg-brand-yellow text-brand-blue border-2 border-brand-blue/10 shadow-sm" : 
                      index === 1 ? "bg-gray-200 text-gray-600" :
                      index === 2 ? "bg-orange-100 text-orange-800" : "text-gray-300 skew-x-12"
                    )}>
                      <span className={clsx(index < 3 && "skew-x-12")}>{index + 1}</span>
                    </div>
                  </td>

                  {/* Team Name */}
                  <td className="py-4 pl-4 md:pl-8">
                    <span className={clsx(
                      "font-heading font-black italic text-sm md:text-xl uppercase tracking-tight group-hover:text-brand-blue transition-colors duration-300 leading-tight line-clamp-2",
                      isTop3 ? "text-brand-blue" : "text-gray-500"
                    )}>
                        {entry.team}
                    </span>
                  </td>

                  {/* W-L */}
                  <td className="py-4 text-center">
                    <div className="font-mono font-bold text-gray-600 text-xs md:text-base whitespace-nowrap">
                      {entry.wins}<span className="text-gray-300 mx-0.5 md:mx-1">-</span>{entry.losses}
                    </div>
                  </td>

                  {/* Shared: WIN% */}
                  <td className="py-4 text-center">
                    <span className={clsx(
                        "font-heading font-black tracking-tighter leading-none text-sm md:text-2xl",
                        isTop3 ? "text-brand-blue" : "text-gray-400"
                    )}>
                      {(entry.winPct * 100).toFixed(0)}<span className="text-[10px] md:text-sm ml-0.5">%</span>
                    </span>
                  </td>

                  {/* Desktop: PTS */}
                  <td className="py-4 text-center hidden md:table-cell">
                    <div className="font-mono font-bold text-gray-400 text-sm">
                      {entry.pointsFor}
                      <span className="text-gray-200 text-xs mx-1">/</span>
                      {entry.pointsAgainst}
                    </div>
                  </td>

                  {/* Mobile: PTS */}
                  <td className="py-4 text-center md:hidden">
                    <div className="font-mono font-bold text-gray-400 text-xs">
                      {entry.pointsFor}
                    </div>
                  </td>

                  {/* Desktop: DIFF */}
                  <td className="hidden md:table-cell py-4 pr-8 text-right">
                    <span className={clsx(
                      "inline-flex items-center px-3 py-1 text-xs font-bold font-mono border-2",
                      diff > 0 ? "bg-green-50 text-green-700 border-green-100" : 
                      diff < 0 ? "bg-red-50 text-red-700 border-red-100" : 
                      "bg-gray-50 text-gray-400 border-gray-100"
                    )}>
                        {diff > 0 ? '+' : ''}{diff}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {/* Dynamic Background Element (Bottom Right) */}
      <div className="absolute bottom-[-20px] right-[-20px] w-40 h-40 bg-brand-yellow/5 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
};
