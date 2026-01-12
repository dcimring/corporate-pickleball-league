import React from 'react';
import { leagueData } from '../lib/data';
import { Clock, Users } from 'lucide-react';

export const Home: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="p-8 sm:p-12 relative z-10">
          <h1 className="text-4xl sm:text-5xl font-bold text-brand-blue mb-4">
            Winter 2026 <span className="text-brand-orange">Season</span>
          </h1>
          <p className="text-slate-600 max-w-2xl text-lg">
            Welcome to the official Corporate Pickleball League portal. Check your division schedules, standings, and stats.
          </p>
        </div>
      </div>

      {/* Divisions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {leagueData.divisions.map((div) => (
          <div 
            key={div.name} 
            className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-300 flex flex-col h-full"
          >
            {/* Card Header */}
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 rounded-t-xl">
              <h3 className="text-xl font-bold text-brand-blue mb-2">{div.name}</h3>
              <div className="flex items-center text-sm text-slate-500 font-medium">
                <Clock className="w-4 h-4 mr-2 text-brand-orange" />
                {div.playTime}
              </div>
            </div>

            {/* Teams List */}
            <div className="p-5 flex-grow">
              <div className="flex items-center gap-2 mb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <Users className="w-3 h-3" />
                <span>{div.teams.length} Teams</span>
              </div>
              
              {div.teams.length > 0 ? (
                <ul className="space-y-2">
                  {div.teams.map((team) => (
                    <li key={team} className="text-slate-700 text-sm py-1 px-2 rounded hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors">
                      {team}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-slate-400 text-sm italic py-4 text-center bg-slate-50 rounded-lg border border-dashed border-slate-200">
                  No teams assigned yet
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};