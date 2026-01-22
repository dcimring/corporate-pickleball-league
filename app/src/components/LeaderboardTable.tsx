import React from 'react';
import { clsx } from 'clsx';
import { Trophy } from 'lucide-react';
import type { LeaderboardEntry } from '../types';

interface LeaderboardTableProps {
  stats: LeaderboardEntry[];
  variant?: 'minimal-stripes' | 'grid-card' | 'high-contrast';
}

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ stats, variant = 'minimal-stripes' }) => {
  
  if (stats.length === 0) return (
    <div className="p-8 text-center text-gray-400 font-heading font-bold text-lg">
      No data available
    </div>
  );

  // Variant 1: Minimal Stripes (Clean, Professional, Data-First)
  if (variant === 'minimal-stripes') {
    return (
      <div className="w-full overflow-hidden rounded-xl border border-gray-100 bg-white">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="py-4 pl-6 pr-4 font-heading font-black text-xs text-gray-400 uppercase tracking-widest w-[10%]">Rank</th>
              <th className="py-4 px-4 font-heading font-black text-xs text-gray-400 uppercase tracking-widest w-[40%]">Team</th>
              <th className="py-4 px-4 font-heading font-black text-xs text-gray-400 uppercase tracking-widest text-center">W</th>
              <th className="py-4 px-4 font-heading font-black text-xs text-gray-400 uppercase tracking-widest text-center">L</th>
              <th className="py-4 px-4 font-heading font-black text-xs text-brand-blue uppercase tracking-widest text-center">Win %</th>
              <th className="hidden md:table-cell py-4 px-4 font-heading font-black text-xs text-gray-400 uppercase tracking-widest text-center">PF</th>
              <th className="hidden md:table-cell py-4 px-4 font-heading font-black text-xs text-gray-400 uppercase tracking-widest text-center">PA</th>
              <th className="hidden md:table-cell py-4 pl-4 pr-6 font-heading font-black text-xs text-gray-400 uppercase tracking-widest text-right">Diff</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {stats.map((entry, index) => {
              const diff = entry.pointsFor - entry.pointsAgainst;
              return (
                <tr key={entry.team} className="group hover:bg-blue-50/30 transition-colors">
                  <td className="py-4 pl-6 pr-4 font-heading font-bold text-gray-400 text-sm group-hover:text-brand-blue">
                    #{index + 1}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      {index === 0 && <Trophy className="w-4 h-4 text-brand-yellow fill-brand-yellow" />}
                      <span className={clsx(
                        "font-bold text-sm tracking-wide transition-colors",
                        index === 0 ? "text-brand-blue" : "text-gray-700 group-hover:text-brand-blue"
                      )}>
                        {entry.team}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center font-bold text-gray-600 text-sm">{entry.wins}</td>
                  <td className="py-4 px-4 text-center font-bold text-gray-400 text-sm">{entry.losses}</td>
                  <td className="py-4 px-4 text-center">
                    <span className="inline-block px-2.5 py-1 bg-blue-50 text-brand-blue rounded-md font-bold text-xs">
                      {(entry.winPct * 100).toFixed(0)}%
                    </span>
                  </td>
                  <td className="hidden md:table-cell py-4 px-4 text-center text-gray-400 text-xs font-mono">{entry.pointsFor}</td>
                  <td className="hidden md:table-cell py-4 px-4 text-center text-gray-400 text-xs font-mono">{entry.pointsAgainst}</td>
                  <td className={clsx(
                    "hidden md:table-cell py-4 pl-4 pr-6 text-right font-bold text-xs",
                    diff > 0 ? "text-brand-green" : diff < 0 ? "text-brand-red" : "text-gray-400"
                  )}>
                    {diff > 0 ? '+' : ''}{diff}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  // Variant 2: Grid Card (Modern, Spacious, Mobile-Friendly feel)
  if (variant === 'grid-card') {
    return (
      <div className="space-y-2">
        <div className="grid grid-cols-12 gap-4 px-6 py-2 border-b border-gray-200">
          <div className="col-span-1 text-xs font-bold text-gray-400 uppercase tracking-wider">#</div>
          <div className="col-span-5 md:col-span-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Team</div>
          <div className="col-span-3 md:col-span-2 text-center text-xs font-bold text-brand-blue uppercase tracking-wider">Win %</div>
          <div className="col-span-3 md:col-span-2 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Record</div>
          <div className="hidden md:block col-span-3 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Diff</div>
        </div>
        
        {stats.map((entry, index) => {
          const diff = entry.pointsFor - entry.pointsAgainst;
          return (
            <div 
              key={entry.team}
              className={clsx(
                "grid grid-cols-12 gap-4 px-6 py-4 rounded-xl items-center transition-all duration-200 border",
                index === 0 
                  ? "bg-gradient-to-r from-blue-50 to-white border-blue-100 shadow-sm" 
                  : "bg-white border-gray-100 hover:border-blue-200 hover:shadow-md"
              )}
            >
              <div className="col-span-1 font-heading font-black text-lg text-gray-300">
                {index + 1}
              </div>
              <div className="col-span-5 md:col-span-4 font-bold text-gray-800 text-sm md:text-base truncate pr-2">
                {entry.team}
                {index === 0 && <span className="ml-2 inline-block w-2 h-2 rounded-full bg-brand-yellow" />}
              </div>
              <div className="col-span-3 md:col-span-2 text-center">
                <div className="relative h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="absolute top-0 left-0 bottom-0 bg-brand-blue rounded-full" 
                    style={{ width: `${entry.winPct * 100}%` }} 
                  />
                </div>
                <span className="text-[10px] font-bold text-brand-blue mt-1 block">
                  {(entry.winPct * 100).toFixed(1)}%
                </span>
              </div>
              <div className="col-span-3 md:col-span-2 text-right font-mono text-xs text-gray-500">
                <span className="text-gray-900 font-bold">{entry.wins}</span>W - {entry.losses}L
              </div>
              <div className="hidden md:block col-span-3 text-right text-xs font-bold">
                <span className={diff > 0 ? "text-brand-green" : "text-brand-red"}>
                  {diff > 0 ? '+' : ''}{diff}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Variant 3: High Contrast (Bold, Athletic, "Night Court" vibe)
  if (variant === 'high-contrast') {
    return (
      <div className="w-full bg-brand-blue rounded-t-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-brand-blue text-white">
              <th className="py-5 pl-6 font-heading font-bold text-sm tracking-widest opacity-60 w-[80px]">POS</th>
              <th className="py-5 font-heading font-bold text-sm tracking-widest opacity-60">CLUB</th>
              <th className="py-5 text-center font-heading font-bold text-sm tracking-widest opacity-60 w-[100px]">RECORD</th>
              <th className="py-5 pr-6 text-right font-heading font-bold text-sm tracking-widest text-brand-yellow w-[100px]">PCT</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {stats.map((entry, index) => (
              <tr key={entry.team} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                <td className="py-4 pl-6">
                  <div className={clsx(
                    "w-8 h-8 flex items-center justify-center rounded-full font-heading font-bold text-sm",
                    index === 0 ? "bg-brand-yellow text-brand-blue" : "bg-gray-100 text-gray-500"
                  )}>
                    {index + 1}
                  </div>
                </td>
                <td className="py-4 font-bold text-gray-800 text-sm md:text-base">
                  {entry.team}
                </td>
                <td className="py-4 text-center">
                  <div className="inline-flex items-center gap-1 font-mono text-xs text-gray-500">
                    <span className="font-bold text-gray-900">{entry.wins}</span>
                    <span className="text-gray-300">/</span>
                    <span>{entry.losses}</span>
                  </div>
                </td>
                <td className="py-4 pr-6 text-right">
                  <span className="font-heading font-black text-lg text-brand-blue tracking-tight">
                    {(entry.winPct * 100).toFixed(0)}
                    <span className="text-xs align-top ml-0.5 text-gray-400">%</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return null;
};
