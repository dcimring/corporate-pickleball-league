import React, { useState } from 'react';
import { leagueData } from '../lib/data';
import { clsx } from 'clsx';
import { Trophy, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export const Leaderboard: React.FC = () => {
  const [activeDivision, setActiveDivision] = useState<string>('Division A');
  const divisions = Object.keys(leagueData.leaderboard);

  const stats = leagueData.leaderboard[activeDivision];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-brand-blue">League Standings</h1>
          <p className="text-slate-500 mt-1">Real-time performance tracking</p>
        </div>

        {/* Division Toggle */}
        <div className="bg-white p-1 rounded-lg border border-slate-200 inline-flex shadow-sm">
          {divisions.map((div) => (
            <button
              key={div}
              onClick={() => setActiveDivision(div)}
              className={clsx(
                'px-4 py-2 rounded-md text-sm font-bold uppercase tracking-wide transition-all',
                activeDivision === div
                  ? 'bg-brand-blue text-white shadow-md'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              )}
            >
              {div}
            </button>
          ))}
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4">Rank</th>
                <th className="px-6 py-4 w-1/3">Team</th>
                <th className="px-6 py-4 text-center">W</th>
                <th className="px-6 py-4 text-center">L</th>
                <th className="px-6 py-4 text-center text-brand-orange">Win %</th>
                <th className="px-6 py-4 text-center hidden sm:table-cell">PF</th>
                <th className="px-6 py-4 text-center hidden sm:table-cell">PA</th>
                <th className="px-6 py-4 text-center hidden sm:table-cell">Diff</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stats.map((entry, index) => {
                const diff = entry.pointsFor - entry.pointsAgainst;
                return (
                  <tr 
                    key={entry.team} 
                    className="hover:bg-slate-50 transition-colors group"
                  >
                    <td className="px-6 py-4 text-slate-400 font-mono">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800 flex items-center gap-3">
                      {index === 0 && <Trophy className="w-4 h-4 text-yellow-500" />}
                      {index === 1 && <Trophy className="w-4 h-4 text-slate-400" />}
                      {index === 2 && <Trophy className="w-4 h-4 text-orange-400" />}
                      {entry.team}
                    </td>
                    <td className="px-6 py-4 text-center font-medium text-slate-700">{entry.wins}</td>
                    <td className="px-6 py-4 text-center text-slate-500">{entry.losses}</td>
                    <td className="px-6 py-4 text-center font-bold text-brand-blue bg-slate-50/50">
                      {(entry.winPct * 100).toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 text-center hidden sm:table-cell text-slate-600">{entry.pointsFor}</td>
                    <td className="px-6 py-4 text-center hidden sm:table-cell text-slate-600">{entry.pointsAgainst}</td>
                    <td className="px-6 py-4 text-center hidden sm:table-cell">
                      <span className={clsx(
                        "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
                        diff > 0 ? "bg-green-100 text-green-800" : diff < 0 ? "bg-red-100 text-red-800" : "bg-slate-100 text-slate-800"
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
      </div>
    </div>
  );
};