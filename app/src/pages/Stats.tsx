import React, { useState } from 'react';
import { leagueData } from '../lib/data';
import { Activity, Flame } from 'lucide-react';
import { Card } from '../components/Card';
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
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-4xl font-heading font-bold text-brand-blue uppercase tracking-wide">
            The Numbers
          </h1>
          <p className="font-body text-gray-500 mt-2">Stats don't lie...</p>
        </div>

        {/* Division Toggle */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {divisionNames.map((div) => (
            <button
              key={div}
              onClick={() => setActiveDivision(div)}
              className={clsx(
                'px-6 py-2 text-sm font-heading font-bold uppercase tracking-wide rounded-full transition-all whitespace-nowrap',
                activeDivision === div
                  ? 'bg-brand-blue text-white shadow-md'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              )}
            >
              {div}
            </button>
          ))}
        </div>
      </div>

      {/* Team Stats Cards Grid */}
      {relevantTeamStats.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {relevantTeamStats.map((team, idx) => (
            <Card 
              key={team.name} 
              className="p-0 overflow-hidden"
              variant={idx % 2 === 0 ? 'highlight' : 'default'}
            >
              <div className={clsx(
                  "p-6 border-b",
                  idx % 2 === 0 ? "bg-blue-50 border-blue-100" : "bg-gray-50 border-gray-100"
              )}>
                <h2 className="text-2xl font-heading font-bold text-brand-blue">{team.name}</h2>
                <div className="flex items-center gap-2 font-bold text-xs mt-1 text-gray-500 uppercase tracking-widest">
                  <Activity className="w-4 h-4 text-brand-yellow" />
                  Team Analytics
                </div>
              </div>
              
              <div className="p-6 grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <div className="text-xs font-bold uppercase tracking-wider mb-1 text-gray-400">Games</div>
                  <div className="text-3xl font-heading font-bold text-brand-blue">{team.gamesPlayed}</div>
                </div>
                
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <div className="text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1 text-gray-400">
                    <Flame className="w-3 h-3 text-brand-yellow" /> Streak
                  </div>
                  <div className="text-3xl font-heading font-bold text-brand-blue">
                    {team.longestWinStreak} <span className="text-sm text-gray-400 font-normal">W</span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <div className="text-xs font-bold uppercase tracking-wider mb-1 text-gray-400">Avg Pts</div>
                  <div className="text-3xl font-heading font-bold text-brand-blue">{team.avgPointsPerGame}</div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <div className="text-xs font-bold uppercase tracking-wider mb-1 text-gray-400">Diff</div>
                  <div className={clsx(
                    "text-3xl font-heading font-bold",
                    team.avgPointDiff > 0 ? "text-green-500" : "text-red-500"
                  )}>
                    {team.avgPointDiff > 0 ? '+' : ''}{team.avgPointDiff}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-100">
          <p className="font-heading text-xl text-gray-400">No stats available for this division yet.</p>
        </div>
      )}
    </div>
  );
};
