import React, { useState } from 'react';
import { leagueData } from '../lib/data';
import { Activity, Flame } from 'lucide-react';
import { Card } from '../components/Card';
import { CircleHighlight, Squiggle } from '../components/Doodle';
import { clsx } from 'clsx';

export const Stats: React.FC = () => {
  const [activeDivision, setActiveDivision] = useState<string>('Division A');
  
  // Get all division names for the toggle
  const divisionNames = Object.keys(leagueData.teamStats);
  
  // Get stats object for the active division
  const divisionStats = leagueData.teamStats[activeDivision] || {};
  
  // Convert object to array for mapping
  const relevantTeamStats = Object.entries(divisionStats).map(([name, stats]) => ({
    name,
    ...stats
  }));

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="relative inline-block pb-3">
          <h1 className="text-6xl font-heading text-white italic tracking-wide">
            THE NUMBERS
          </h1>
          <p className="font-body text-xl text-gray-400 mt-2 uppercase tracking-widest">Stats don't lie...</p>
          <CircleHighlight className="w-40 h-20 text-brand-acid absolute top-0 left-0 -z-10 opacity-50 translate-x-1/4" />
          <Squiggle className="w-32 h-6 text-brand-acid absolute -bottom-1 left-0 -translate-x-0" />
        </div>

        {/* Division Toggle */}
        <div className="flex gap-2 bg-brand-soft-blue border border-white/10 p-2 shadow-glow max-w-full overflow-x-auto no-scrollbar md:flex-wrap md:overflow-visible">
          {divisionNames.map((div) => (
            <button
              key={div}
              onClick={() => setActiveDivision(div)}
              className={clsx(
                'px-4 py-2 text-sm font-heading italic tracking-wider transition-all border skew-x-[-10deg] whitespace-nowrap flex-shrink-0',
                activeDivision === div
                  ? 'bg-brand-acid text-brand-cream border-brand-acid shadow-glow'
                  : 'bg-transparent text-gray-400 border-transparent hover:border-white/30 hover:text-white'
              )}
            >
              <span className="skew-x-[10deg] block">{div}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Team Stats Cards Grid */}
      {relevantTeamStats.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {relevantTeamStats.map((team, idx) => (
            <Card 
              key={team.name} 
              className="overflow-hidden p-0 bg-brand-soft-blue border border-white/10 shadow-hard"
              variant={idx % 2 === 0 ? 'acid' : 'blue'}
            >
              <div className="p-6 border-b border-white/10 bg-black/20 backdrop-blur-md relative">
                <h2 className="text-4xl font-heading text-white italic tracking-wide">{team.name}</h2>
                <div className="flex items-center gap-2 font-bold text-sm mt-1 text-brand-acid uppercase tracking-widest">
                  <Activity className="w-4 h-4" />
                  Team Analytics
                </div>
              </div>
              
              <div className="p-6 grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 border border-white/5 hover:border-brand-acid/50 transition-colors">
                  <div className="text-xs font-bold uppercase tracking-wider mb-1 text-gray-500">Games</div>
                  <div className="text-4xl font-heading text-white">{team.gamesPlayed}</div>
                </div>
                
                <div className="bg-white/5 p-4 border border-white/5 hover:border-brand-acid/50 transition-colors">
                  <div className="text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1 text-gray-500">
                    <Flame className="w-3 h-3 text-brand-orange" /> Streak
                  </div>
                  <div className="text-4xl font-heading text-brand-orange">
                    {team.longestWinStreak} <span className="text-lg text-white">W</span>
                  </div>
                </div>

                <div className="bg-white/5 p-4 border border-white/5 hover:border-brand-acid/50 transition-colors">
                  <div className="text-xs font-bold uppercase tracking-wider mb-1 text-gray-500">Avg Pts</div>
                  <div className="text-4xl font-heading text-white">{team.avgPointsPerGame}</div>
                </div>

                <div className="bg-white/5 p-4 border border-white/5 hover:border-brand-acid/50 transition-colors">
                  <div className="text-xs font-bold uppercase tracking-wider mb-1 text-gray-500">Diff</div>
                  <div className={clsx(
                    "text-4xl font-heading",
                    team.avgPointDiff > 0 ? "text-brand-acid" : "text-red-500"
                  )}>
                    {team.avgPointDiff > 0 ? '+' : ''}{team.avgPointDiff}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-brand-soft-blue border border-white/10">
          <p className="font-heading text-2xl text-gray-500 italic">No stats available for this division yet.</p>
        </div>
      )}

      {/* Player Stats Section */}
      <Card className="p-0 overflow-hidden bg-brand-soft-blue border border-white/10">
        <div className="p-6 border-b border-white/10 bg-black/20 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-heading text-white italic tracking-wide">ROSTER DEEP DIVE</h2>
            <p className="font-body text-gray-400 uppercase tracking-widest text-sm">Dilluminati Squad</p>
          </div>
          <div className="bg-brand-acid text-brand-cream border border-white px-4 py-1 skew-x-[-10deg] shadow-glow">
            <span className="skew-x-[10deg] block font-heading text-lg">FEATURED</span>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 border-b border-white/10 text-sm font-heading text-brand-acid italic tracking-wider">
              <tr>
                <th className="px-6 py-4">Player</th>
                <th className="px-6 py-4 text-center">Games</th>
                <th className="px-6 py-4 text-center">Avg Pts</th>
                <th className="px-6 py-4 text-center">Points For</th>
                <th className="px-6 py-4 text-center">Points Against</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-body text-gray-300">
              {leagueData.playerStats.map((player) => (
                <tr key={player.name} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4 font-heading text-xl text-white italic tracking-wide flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-acid text-brand-cream flex items-center justify-center font-bold shadow-glow skew-x-[-10deg]">
                      <span className="skew-x-[10deg]">{player.name.charAt(0)}</span>
                    </div>
                    {player.name}
                  </td>
                  <td className="px-6 py-4 text-center text-white/50 font-medium">{player.gamesPlayed}</td>
                  <td className="px-6 py-4 text-center font-heading text-2xl text-white">{player.avgPoints}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-900/30 border border-green-500/30 text-green-400 text-xs font-bold skew-x-[-10deg]">
                      <span className="skew-x-[10deg]">{player.pointsFor}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-900/30 border border-red-500/30 text-red-400 text-xs font-bold skew-x-[-10deg]">
                      <span className="skew-x-[10deg]">{player.pointsAgainst}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};