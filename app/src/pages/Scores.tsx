import React from 'react';
import { leagueData } from '../lib/data';
import { CalendarDays, ArrowRight } from 'lucide-react';

export const Scores: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-brand-blue">Recent Results</h1>
        <p className="text-slate-500 mt-2">Division A - Latest Matches</p>
      </div>

      <div className="space-y-4">
        {leagueData.scores.map((match, idx) => (
          <div 
            key={idx}
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-6 hover:shadow-md transition-shadow"
          >
            {/* Date Badge */}
            <div className="flex flex-col items-center justify-center bg-slate-50 border border-slate-100 rounded-lg p-3 min-w-[80px]">
              <CalendarDays className="w-5 h-5 text-slate-400 mb-1" />
              <span className="text-xs font-bold text-slate-500 uppercase">
                {new Date(match.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>

            {/* Matchup */}
            <div className="flex-grow flex items-center justify-between w-full sm:w-auto gap-4">
              {/* Winner */}
              <div className="flex-1 text-right">
                <div className="font-bold text-brand-blue text-lg leading-tight">{match.winner}</div>
                <div className="text-xs text-brand-green font-bold uppercase tracking-wider mt-1">Winner</div>
              </div>

              {/* Score Box */}
              <div className="flex items-center gap-3 px-4 py-2 bg-slate-900 rounded text-white font-mono text-xl font-bold shadow-inner">
                <span className="text-brand-orange">{match.winnerScore}</span>
                <span className="text-slate-600">-</span>
                <span>{match.loserScore}</span>
              </div>

              {/* Loser */}
              <div className="flex-1 text-left">
                <div className="font-medium text-slate-600 text-lg leading-tight">{match.loser}</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">Defeated</div>
              </div>
            </div>
            
            {/* Mobile Arrow for flow */}
            <div className="sm:hidden text-slate-300">
              <ArrowRight className="w-5 h-5 rotate-90" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};