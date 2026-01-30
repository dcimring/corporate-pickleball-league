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
    <div className="p-16 text-center flex flex-col items-center justify-center gap-4 text-gray-400 bg-white rounded-2xl border border-gray-100">
      <div className="bg-blue-50 p-4 rounded-full">
        <Info className="w-8 h-8 text-brand-blue" />
      </div>
      <p className="font-heading font-bold text-xl text-brand-blue">No teams found</p>
      <p className="font-body text-gray-500">Check back later for the schedule!</p>
    </div>
  );

  // Option 3: "Precision Grid" - Kinetic Aesthetic
  return (
    <div className="w-full overflow-hidden bg-[#FFFEFC] relative rounded-3xl shadow-soft border border-gray-100/50">
      {/* Grainy Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.1] pointer-events-none mix-blend-multiply z-0" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
      />

      {/* Top Accent Bar (Inset) - Matching MatchCard */}
      <div className="h-2 w-[95%] mx-auto bg-[rgb(142,209,252)] rounded-b-md mb-2 relative z-10" />

      <table className="w-full text-left border-collapse relative z-10">
        <thead>
          <tr className="text-[rgb(0,85,150)] border-b-2 border-[rgb(142,209,252)]">
            {/* Rank */}
            <th className="py-4 text-center font-heading font-black italic text-sm tracking-widest w-[30px] md:w-[80px]">#</th>
            
            {/* Team */}
            <th className="py-4 pl-1 md:pl-4 font-heading font-black italic text-sm tracking-widest">TEAM</th>
            
            {/* Desktop: W-L */}
            <th className="hidden md:table-cell py-4 text-center font-heading font-black italic text-sm tracking-widest w-[80px]">W-L</th>
            
            {/* Mobile: W-L (Combined) */}
            <th className="md:hidden py-4 text-center font-heading font-black italic text-[10px] tracking-widest w-[55px]">W-L</th>

            {/* Shared: % */}
            <th className="py-4 text-center font-heading font-black italic text-sm tracking-widest w-[40px] md:w-[80px]">%</th>

            {/* Desktop: PTS (For-Against) */}
            <th className="hidden md:table-cell py-4 text-center font-heading font-black italic text-sm tracking-widest w-[100px]">PTS</th>

            {/* Mobile: PTS (For only) */}
            <th className="md:hidden py-4 text-center font-heading font-black italic text-[10px] tracking-widest w-[35px]">PTS</th>

            {/* Desktop: DIFF */}
            <th className="hidden md:table-cell py-4 pr-8 text-right font-heading font-black italic text-sm tracking-widest w-[100px]">DIFF</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((entry, index) => {
            const diff = entry.pointsFor - entry.pointsAgainst;
            const isTop3 = index < 3;
            
            return (
              <tr 
                key={entry.team} 
                onClick={() => onTeamClick(entry.team)}
                className="border-b border-gray-100 border-dashed last:border-0 hover:bg-gray-50 transition-all duration-200 group cursor-pointer align-middle"
              >
                {/* Rank */}
                <td className="py-3">
                  <div className={clsx(
                    "flex items-center justify-center font-heading font-black mx-auto transform -skew-x-6",
                    // Smaller badge on mobile
                    "w-6 h-6 text-[10px] md:w-7 md:h-7 md:text-xs",
                    index === 0 ? "bg-[rgb(247,191,38)] text-[rgb(0,85,150)] shadow-sm" : 
                    index === 1 ? "bg-gray-200 text-gray-600" :
                    index === 2 ? "bg-orange-100 text-orange-800" : "text-gray-400"
                  )}>
                    <span className="skew-x-6">{index + 1}</span>
                  </div>
                </td>

                {/* Team Name */}
                <td className="py-3 pl-1 md:pl-4">
                  <div className="flex flex-col">
                    <span className="font-heading font-black italic text-xs md:text-base text-[rgb(0,85,150)] uppercase tracking-tight group-hover:translate-x-1 transition-transform duration-300 leading-tight line-clamp-2">
                        {entry.team}
                    </span>
                  </div>
                </td>

                {/* Desktop: WINS */}
                <td className="py-3 text-center hidden md:table-cell">
                  <div className="font-mono font-bold text-gray-600 text-sm">
                    {entry.wins}
                    <span className="text-gray-300 text-xs ml-1">-{entry.losses}</span>
                  </div>
                </td>

                {/* Mobile: W-L */}
                <td className="py-3 text-center md:hidden">
                  <div className="font-mono font-bold text-gray-600 text-[10px] whitespace-nowrap">
                    {entry.wins}-{entry.losses}
                  </div>
                </td>

                {/* Shared: WIN% */}
                <td className="py-3 text-center">
                  <div className="flex items-center justify-center h-full">
                    <span className={clsx(
                        "font-heading font-black tracking-tight leading-none",
                        "text-xs md:text-lg", // Match other columns font size on mobile
                        isTop3 ? "text-[rgb(0,85,150)]" : "text-gray-400"
                    )}>
                      {(entry.winPct * 100).toFixed(0)}%
                    </span>
                  </div>
                </td>

                {/* Desktop: PTS */}
                <td className="py-3 text-center hidden md:table-cell">
                  <div className="font-mono font-bold text-gray-500 text-sm">
                    {entry.pointsFor}
                    <span className="text-gray-300 text-xs ml-1">-{entry.pointsAgainst}</span>
                  </div>
                </td>

                {/* Mobile: PTS */}
                <td className="py-3 text-center md:hidden">
                  <div className="font-mono font-bold text-gray-500 text-[10px]">
                    {entry.pointsFor}
                  </div>
                </td>

                {/* Desktop: DIFF */}
                <td className="hidden md:table-cell py-3 pr-8 text-right">
                  <span className={clsx(
                    "inline-flex items-center px-2 py-0.5 text-xs font-bold rounded-sm font-mono transform -skew-x-6",
                    diff > 0 ? "bg-green-50 text-green-700" : diff < 0 ? "bg-red-50 text-red-700" : "bg-gray-100 text-gray-500"
                  )}>
                     <span className="skew-x-6">
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
  );
};
