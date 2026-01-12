import React from 'react';
import { leagueData } from '../lib/data';
import { CalendarDays } from 'lucide-react';
import { Card } from '../components/Card';
import { Squiggle } from '../components/Doodle';

export const Scores: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-10">
      <div className="text-center relative">
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-brand-ink mb-2">Match Results</h1>
        <p className="font-hand text-xl text-gray-500">The thrill of victory...</p>
        <Squiggle className="w-32 h-6 text-brand-acid absolute -bottom-4 left-1/2 -translate-x-1/2" />
      </div>

      <div className="space-y-6">
        {leagueData.scores.map((match, idx) => (
          <Card 
            key={idx}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-6 p-0 overflow-hidden"
          >
            {/* Date Tab */}
            <div className="bg-brand-cream border-b-2 sm:border-b-0 sm:border-r-2 border-brand-ink p-4 flex sm:flex-col items-center justify-center min-w-[100px] gap-2">
              <CalendarDays className="w-5 h-5 text-gray-400" />
              <div className="text-center leading-none">
                <div className="text-sm font-bold text-gray-400 uppercase">
                  {new Date(match.date).toLocaleDateString('en-US', { month: 'short' })}
                </div>
                <div className="text-2xl font-heading font-bold text-brand-ink">
                  {new Date(match.date).toLocaleDateString('en-US', { day: 'numeric' })}
                </div>
              </div>
            </div>

            {/* Matchup */}
            <div className="flex-grow flex flex-col sm:flex-row items-center justify-between p-6 sm:p-0 sm:pr-8 gap-6">
              
              {/* Winner */}
              <div className="flex-1 text-center sm:text-right w-full">
                <div className="font-heading font-bold text-2xl text-brand-ink leading-tight">{match.winner}</div>
                <div className="inline-block bg-brand-acid px-2 py-0.5 rounded text-xs font-bold border border-brand-ink mt-1 transform -rotate-2">
                  WINNER!
                </div>
              </div>

              {/* Scoreboard */}
              <div className="bg-brand-ink text-brand-acid px-6 py-3 rounded-xl border-2 border-gray-800 font-mono text-3xl font-bold shadow-inner flex items-center gap-3">
                <span>{match.winnerScore}</span>
                <span className="text-gray-600 text-xl">:</span>
                <span className="text-white opacity-60">{match.loserScore}</span>
              </div>

              {/* Loser */}
              <div className="flex-1 text-center sm:text-left w-full opacity-60 grayscale hover:grayscale-0 transition-all">
                <div className="font-heading font-bold text-xl text-brand-ink leading-tight">{match.loser}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};