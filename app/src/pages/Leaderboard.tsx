import React, { useState } from 'react';
import { leagueData } from '../lib/data';
import { clsx } from 'clsx';
import { Trophy, TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';
import { Card } from '../components/Card';
import { Underline, Squiggle } from '../components/Doodle';

export const Leaderboard: React.FC = () => {
  const [activeDivision, setActiveDivision] = useState<string>('Division A');
  const divisions = Object.keys(leagueData.leaderboard);
  const stats = leagueData.leaderboard[activeDivision] || [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="pb-3 relative inline-block">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-brand-ink relative inline-block">
            Leaderboard
            <Underline className="absolute bottom-0 left-0 w-full text-brand-soft-blue -z-10 opacity-60" />
          </h1>
          <p className="font-hand text-xl text-gray-500 mt-2 rotate-1">Who's smashing it this week?</p>
          <Squiggle className="w-32 h-6 text-brand-acid absolute -bottom-1 left-0 -translate-x-0" />
        </div>

        {/* Division Toggle - Flex Wrapped for multiple items */}
        <div className="flex flex-wrap gap-2 bg-white border-2 border-brand-ink p-2 rounded-2xl shadow-hard-sm max-w-full">
          {divisions.map((div) => (
            <button
              key={div}
              onClick={() => setActiveDivision(div)}
              className={clsx(
                'px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-tight transition-all border-2',
                activeDivision === div
                  ? 'bg-brand-ink text-white border-brand-ink shadow-md'
                  : 'bg-transparent text-gray-500 border-transparent hover:bg-gray-100 hover:text-brand-ink'
              )}
            >
              {div}
            </button>
          ))}
        </div>
      </div>

      {/* Table Card */}
      <Card className="p-0 overflow-hidden bg-white border-2 border-brand-ink rounded-2xl shadow-hard">
        {stats.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-brand-cream border-b-2 border-brand-ink font-heading text-lg text-brand-ink uppercase tracking-wider">
                  <th className="px-6 py-5 whitespace-nowrap">Rank</th>
                  <th className="px-6 py-5 w-1/3 whitespace-nowrap">Team</th>
                  <th className="px-6 py-5 text-center bg-white/50 border-x border-brand-ink/10 whitespace-nowrap">W</th>
                  <th className="px-6 py-5 text-center whitespace-nowrap">L</th>
                  <th className="px-6 py-5 text-center text-brand-orange bg-brand-orange/5 whitespace-nowrap">Win %</th>
                  <th className="px-6 py-5 text-center hidden sm:table-cell border-l border-brand-ink/10 whitespace-nowrap">PF</th>
                  <th className="px-6 py-5 text-center hidden sm:table-cell whitespace-nowrap">PA</th>
                  <th className="px-6 py-5 text-center hidden sm:table-cell border-l border-brand-ink/10 whitespace-nowrap">Diff</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-ink/10">
                {stats.map((entry, index) => {
                  const diff = entry.pointsFor - entry.pointsAgainst;
                  return (
                    <tr 
                      key={entry.team} 
                      className={clsx(
                        "hover:bg-brand-soft-blue/20 transition-colors font-body",
                        index < 3 && "bg-brand-cream/30"
                      )}
                    >
                      <td className="px-6 py-4 font-heading font-bold text-xl text-gray-400">
                        #{index + 1}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {index === 0 && <div className="bg-brand-acid p-1 rounded border border-brand-ink"><Trophy className="w-4 h-4 text-brand-ink" /></div>}
                          <span className={clsx("font-bold text-lg whitespace-nowrap", index === 0 ? "text-brand-ink" : "text-gray-700")}>
                            {entry.team}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-xl border-x border-brand-ink/10 bg-white/30">{entry.wins}</td>
                      <td className="px-6 py-4 text-center font-medium text-gray-400">{entry.losses}</td>
                      <td className="px-6 py-4 text-center font-heading font-bold text-lg text-brand-ink bg-brand-orange/5">
                        {(entry.winPct * 100).toFixed(0)}%
                      </td>
                      <td className="px-6 py-4 text-center hidden sm:table-cell text-gray-500">{entry.pointsFor}</td>
                      <td className="px-6 py-4 text-center hidden sm:table-cell text-gray-500">{entry.pointsAgainst}</td>
                      <td className="px-6 py-4 text-center hidden sm:table-cell border-l border-brand-ink/10">
                        <span className={clsx(
                          "inline-flex items-center px-2 py-1 rounded-lg text-sm font-bold border-2",
                          diff > 0 ? "bg-green-100 text-green-800 border-green-200" : diff < 0 ? "bg-red-50 text-red-800 border-red-100" : "bg-gray-100 text-gray-800 border-gray-200"
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
        ) : (
          <div className="p-12 text-center flex flex-col items-center justify-center gap-4 text-gray-400">
            <div className="bg-gray-100 p-4 rounded-full border-2 border-gray-200">
              <Info className="w-8 h-8" />
            </div>
            <p className="font-heading text-xl font-bold">No data available yet</p>
            <p className="font-hand text-lg rotate-1">Matches start soon!</p>
          </div>
        )}
      </Card>
    </div>
  );
};