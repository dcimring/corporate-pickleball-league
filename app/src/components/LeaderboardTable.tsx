import React from 'react';
import { clsx } from 'clsx';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { LeaderboardEntry } from '../types';

interface LeaderboardTableProps {
  stats: LeaderboardEntry[];
}

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ stats }) => {
  
  if (stats.length === 0) return (
    <div className="p-8 text-center text-gray-400 font-heading font-bold text-lg">
      No data available
    </div>
  );

  // Variant 3: High Contrast (Bold, Athletic, "Night Court" vibe)
  return (
    <div className="w-full overflow-hidden shadow-soft">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-brand-gray text-black border-b border-gray-200">
            <th className="py-5 pl-6 font-heading font-bold text-sm tracking-widest w-[60px] md:w-[80px]">#</th>
            <th className="py-5 font-heading font-bold text-sm tracking-widest">TEAM</th>
            <th className="py-5 text-center font-heading font-bold text-sm tracking-widest w-[80px]">REC</th>
            <th className="py-5 text-center font-heading font-bold text-sm tracking-widest text-brand-blue w-[80px]">PCT</th>
            <th className="hidden md:table-cell py-5 text-center font-heading font-bold text-sm tracking-widest w-[100px]">PTS</th>
            <th className="hidden md:table-cell py-5 pr-6 text-right font-heading font-bold text-sm tracking-widest w-[100px]">DIFF</th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {stats.map((entry, index) => {
            const diff = entry.pointsFor - entry.pointsAgainst;
            return (
              <tr key={entry.team} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors group">
                <td className="py-4 pl-6">
                  <div className={clsx(
                    "w-8 h-8 flex items-center justify-center rounded-full font-heading font-bold text-sm transition-transform group-hover:scale-110",
                    index === 0 ? "bg-brand-yellow text-brand-blue" : "bg-gray-100 text-gray-500"
                  )}>
                    {index + 1}
                  </div>
                </td>
                <td className="py-4 font-bold text-gray-800 text-sm md:text-base">
                  {entry.team}
                </td>
                <td className="py-4 text-center">
                  <div className="inline-flex items-center gap-1 font-mono text-xs text-gray-500 font-bold bg-gray-50 px-2 py-1 rounded">
                    <span className="text-gray-900">{entry.wins}</span>
                    <span className="text-gray-300">-</span>
                    <span>{entry.losses}</span>
                  </div>
                </td>
                <td className="py-4 text-center">
                  <span className="font-heading font-black text-lg text-brand-blue tracking-tight">
                    {(entry.winPct * 100).toFixed(0)}
                    <span className="text-xs align-top ml-0.5 text-gray-400">%</span>
                  </span>
                </td>
                <td className="hidden md:table-cell py-4 text-center">
                  <div className="inline-flex items-center gap-1 font-mono text-xs text-gray-500 font-bold bg-gray-50 px-2 py-1 rounded">
                    <span className="text-gray-900">{entry.pointsFor}</span>
                    <span className="text-gray-300">-</span>
                    <span>{entry.pointsAgainst}</span>
                  </div>
                </td>
                <td className="hidden md:table-cell py-4 pr-6 text-right">
                  <span className={clsx(
                    "inline-flex items-center px-2.5 py-1 text-[10px] md:text-xs font-bold rounded-full ml-auto",
                    diff > 0 ? "bg-green-100 text-green-700" : diff < 0 ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-500"
                  )}>
                     {diff > 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : diff < 0 ? <TrendingDown className="w-3 h-3 mr-1" /> : <Minus className="w-3 h-3 mr-1" />}
                     {diff > 0 ? '+' : ''}{diff}
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
