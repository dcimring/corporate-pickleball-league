import React from 'react';
import { leagueData } from '../lib/data';
import { Activity, Flame, Zap } from 'lucide-react';

export const Stats: React.FC = () => {
  const teams = Object.keys(leagueData.teamStats);

  return (
    <div className="space-y-12">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-brand-blue">Performance Analytics</h1>
        <p className="text-slate-500 mt-2">Advanced metrics for teams and players.</p>
      </div>

      {/* Team Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {teams.map((teamName) => {
          const stats = leagueData.teamStats[teamName];
          return (
            <div key={teamName} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-brand-blue p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-brand-orange opacity-20 rounded-full blur-xl"></div>
                <h2 className="text-2xl font-bold relative z-10">{teamName}</h2>
                <div className="flex items-center gap-2 text-brand-orange font-mono text-sm mt-1 relative z-10">
                  <Activity className="w-4 h-4" />
                  Team Overview
                </div>
              </div>
              
              <div className="p-6 grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Games Played</div>
                  <div className="text-2xl font-bold text-slate-800">{stats.gamesPlayed}</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Flame className="w-3 h-3 text-brand-orange" /> Streak
                  </div>
                  <div className="text-2xl font-bold text-brand-orange">{stats.longestWinStreak} W</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Avg Points</div>
                  <div className="text-2xl font-bold text-slate-800">{stats.avgPointsPerGame}</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Point Diff</div>
                  <div className="text-2xl font-bold text-green-600">+{stats.avgPointDiff}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Player Stats Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-brand-blue">Player Roster Stats</h2>
            <p className="text-sm text-slate-500">Dilluminati Squad Data</p>
          </div>
          <div className="bg-brand-orange/10 text-brand-orange px-3 py-1 rounded-full text-xs font-bold uppercase">
            Featured Team
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Player</th>
                <th className="px-6 py-4 text-center">Games</th>
                <th className="px-6 py-4 text-center">Avg Pts</th>
                <th className="px-6 py-4 text-center">Total Aces</th>
                <th className="px-6 py-4 text-center">Faults/Game</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leagueData.playerStats.map((player) => (
                <tr key={player.name} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-800 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">
                      {player.name.charAt(0)}
                    </div>
                    {player.name}
                  </td>
                  <td className="px-6 py-4 text-center text-slate-600">{player.gamesPlayed}</td>
                  <td className="px-6 py-4 text-center font-bold text-slate-800">{player.avgPoints}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-yellow-50 text-yellow-700 text-xs font-bold">
                      <Zap className="w-3 h-3" /> {player.totalAces}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-slate-500">{player.faultsPerGame}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};