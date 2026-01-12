import React, { useState } from 'react';
import { leagueData } from '../lib/data';
import { Activity, Flame } from 'lucide-react';
import { Card } from '../components/Card';
import { CircleHighlight } from '../components/Doodle';
import { clsx } from 'clsx';

export const Stats: React.FC = () => {
  const [activeDivision, setActiveDivision] = useState<string>('Division A');
  
  // Get all division names for the toggle
  const divisionNames = leagueData.divisions.map(d => d.name);
  
  // Find the current active division object
  const currentDivisionObj = leagueData.divisions.find(d => d.name === activeDivision);
  
  // Filter teams that belong to the current division
  const divisionTeams = currentDivisionObj ? currentDivisionObj.teams : [];
  
  // Get stats only for these teams
  // We assume leagueData.teamStats has keys matching team names
  const relevantTeamStats = divisionTeams
    .filter(teamName => leagueData.teamStats[teamName])
    .map(teamName => ({
      name: teamName,
      ...leagueData.teamStats[teamName]
    }));

  return (
    <div className="space-y-12">
      <div className="text-center max-w-4xl mx-auto relative space-y-6">
        <div>
          <h1 className="text-5xl font-heading font-bold text-brand-ink mb-4">The Numbers</h1>
          <p className="font-hand text-xl text-gray-500 -rotate-1">Stats don't lie!</p>
          <CircleHighlight className="w-40 h-20 text-brand-soft-blue absolute top-0 left-1/2 -translate-x-1/2 -z-10 opacity-50" />
        </div>

        {/* Division Toggle */}
        <div className="flex flex-wrap justify-center gap-2 bg-white border-2 border-brand-ink p-2 rounded-2xl shadow-hard-sm">
          {divisionNames.map((div) => (
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

      {/* Team Stats Cards Grid */}
      {relevantTeamStats.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {relevantTeamStats.map((team, idx) => (
            <Card 
              key={team.name} 
              className="overflow-hidden p-0"
              variant={idx % 2 === 0 ? 'acid' : 'blue'}
            >
              <div className="p-6 border-b-2 border-brand-ink bg-white/40 backdrop-blur-md relative">
                <h2 className="text-3xl font-heading font-bold uppercase">{team.name}</h2>
                <div className="flex items-center gap-2 font-bold text-sm mt-1 opacity-70">
                  <Activity className="w-4 h-4" />
                  Team Analytics
                </div>
              </div>
              
              <div className="p-6 grid grid-cols-2 gap-4">
                <div className="bg-white/80 p-4 rounded-xl border-2 border-brand-ink shadow-sm">
                  <div className="text-xs font-bold uppercase tracking-wider mb-1 opacity-60">Games</div>
                  <div className="text-3xl font-heading font-bold">{team.gamesPlayed}</div>
                </div>
                
                <div className="bg-white/80 p-4 rounded-xl border-2 border-brand-ink shadow-sm">
                  <div className="text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1 opacity-60">
                    <Flame className="w-3 h-3" /> Streak
                  </div>
                  <div className="text-3xl font-heading font-bold text-brand-orange">
                    {team.longestWinStreak} <span className="text-lg text-brand-ink">W</span>
                  </div>
                </div>

                <div className="bg-white/80 p-4 rounded-xl border-2 border-brand-ink shadow-sm">
                  <div className="text-xs font-bold uppercase tracking-wider mb-1 opacity-60">Avg Pts</div>
                  <div className="text-3xl font-heading font-bold">{team.avgPointsPerGame}</div>
                </div>

                <div className="bg-white/80 p-4 rounded-xl border-2 border-brand-ink shadow-sm">
                  <div className="text-xs font-bold uppercase tracking-wider mb-1 opacity-60">Diff</div>
                  <div className={clsx(
                    "text-3xl font-heading font-bold",
                    team.avgPointDiff > 0 ? "text-brand-green" : "text-red-500"
                  )}>
                    {team.avgPointDiff > 0 ? '+' : ''}{team.avgPointDiff}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-300">
          <p className="font-heading text-2xl text-gray-400">No stats available for this division yet.</p>
        </div>
      )}

      {/* Player Stats Section */}
      <Card className="p-0 overflow-hidden">
        <div className="p-6 border-b-2 border-brand-ink bg-gray-50 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-heading font-bold text-brand-ink">Roster Deep Dive</h2>
            <p className="font-body text-gray-500">Dilluminati Squad</p>
          </div>
          <div className="bg-brand-orange text-white border-2 border-brand-ink px-4 py-1 rounded-full text-xs font-bold uppercase shadow-sm rotate-2">
            Featured
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-brand-cream border-b-2 border-brand-ink text-xs font-bold text-gray-500 uppercase tracking-wider font-heading">
              <tr>
                <th className="px-6 py-4">Player</th>
                <th className="px-6 py-4 text-center">Games</th>
                <th className="px-6 py-4 text-center">Avg Pts</th>
                <th className="px-6 py-4 text-center">Points For</th>
                <th className="px-6 py-4 text-center">Points Against</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-ink/10 font-body">
              {leagueData.playerStats.map((player) => (
                <tr key={player.name} className="hover:bg-brand-acid/10 transition-colors group">
                  <td className="px-6 py-4 font-bold text-lg text-brand-ink flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-soft-blue border-2 border-brand-ink flex items-center justify-center text-sm font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      {player.name.charAt(0)}
                    </div>
                    {player.name}
                  </td>
                  <td className="px-6 py-4 text-center text-gray-600 font-medium">{player.gamesPlayed}</td>
                  <td className="px-6 py-4 text-center font-bold text-brand-ink text-lg">{player.avgPoints}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 border border-green-200 text-green-800 text-xs font-bold">
                      {player.pointsFor}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-50 border border-red-100 text-red-800 text-xs font-bold">
                      {player.pointsAgainst}
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