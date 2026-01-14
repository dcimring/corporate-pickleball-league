import React, { useState } from 'react';
import { leagueData } from '../lib/data';
import { CalendarDays, Info } from 'lucide-react';
import { Card } from '../components/Card';
import { clsx } from 'clsx';

export const Scores: React.FC = () => {
  const [activeDivision, setActiveDivision] = useState<string>('Division A');
  const divisions = Object.keys(leagueData.scores);
  const scores = leagueData.scores[activeDivision] || [];

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-4xl font-heading font-bold text-brand-blue uppercase tracking-wide">
            Match Results
          </h1>
          <p className="font-body text-gray-500 mt-2">The thrill of victory...</p>
        </div>

        {/* Division Toggle */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {divisions.map((div) => (
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

      <div className="space-y-4">
        {scores.length > 0 ? (
          scores.map((match, idx) => (
            <Card 
              key={idx}
              className="flex flex-col sm:flex-row items-stretch sm:items-center p-0 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Date Tab */}
              <div className="bg-brand-blue p-6 flex sm:flex-col items-center justify-center min-w-[100px] gap-1 text-white">
                <CalendarDays className="w-5 h-5 text-brand-yellow mb-1" />
                <div className="text-center leading-none">
                  <div className="text-xs font-bold uppercase tracking-wider opacity-80">
                    {new Date(match.date).toLocaleDateString('en-US', { month: 'short' })}
                  </div>
                  <div className="text-2xl font-heading font-bold">
                    {new Date(match.date).toLocaleDateString('en-US', { day: 'numeric' })}
                  </div>
                </div>
              </div>

              {/* Matchup */}
              <div className="flex-grow flex flex-col sm:flex-row items-center justify-between p-6 gap-6">
                
                {/* Winner */}
                <div className="flex-1 text-center sm:text-right w-full">
                  <div className="font-heading font-bold text-xl text-brand-blue">{match.winner}</div>
                  <div className="inline-block bg-brand-light-blue text-brand-blue px-2 py-0.5 text-xs font-bold mt-1 rounded-full uppercase tracking-wider">
                    Winner
                  </div>
                </div>

                {/* Scoreboard */}
                <div className="bg-gray-50 px-6 py-3 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-3 font-mono text-3xl font-bold">
                    <span className="text-brand-blue">{match.winnerScore}</span>
                    <span className="text-gray-300 text-xl">:</span>
                    <span className="text-gray-400">{match.loserScore}</span>
                  </div>
                </div>

                {/* Loser */}
                <div className="flex-1 text-center sm:text-left w-full opacity-60">
                  <div className="font-heading font-bold text-lg text-gray-600">{match.loser}</div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="p-16 text-center flex flex-col items-center justify-center gap-4 text-gray-400 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="bg-white p-4 rounded-full shadow-sm">
              <Info className="w-8 h-8 text-brand-blue" />
            </div>
            <p className="font-heading font-bold text-xl text-brand-blue">No match results yet</p>
            <p className="font-body text-gray-500">Check back later!</p>
          </div>
        )}
      </div>
    </div>
  );
};
