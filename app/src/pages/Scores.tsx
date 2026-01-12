import React, { useState } from 'react';
import { leagueData } from '../lib/data';
import { CalendarDays, Info } from 'lucide-react';
import { Card } from '../components/Card';
import { Squiggle } from '../components/Doodle';
import { clsx } from 'clsx';

export const Scores: React.FC = () => {
  const [activeDivision, setActiveDivision] = useState<string>('Division A');
  const divisions = Object.keys(leagueData.scores);
  const scores = leagueData.scores[activeDivision] || [];

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="relative inline-block pb-3">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-brand-ink mb-2">Match Results</h1>
          <p className="font-hand text-xl text-gray-500">The thrill of victory...</p>
          <Squiggle className="w-32 h-6 text-brand-acid absolute -bottom-1 left-0 -translate-x-0" />
        </div>

        {/* Division Toggle */}
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

      <div className="space-y-6">
        {scores.length > 0 ? (
          scores.map((match, idx) => (
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
          ))
        ) : (
          <div className="p-12 text-center flex flex-col items-center justify-center gap-4 text-gray-400 bg-white border-2 border-brand-ink rounded-2xl border-dashed">
            <div className="bg-gray-100 p-4 rounded-full border-2 border-gray-200">
              <Info className="w-8 h-8" />
            </div>
            <p className="font-heading text-xl font-bold">No match results yet</p>
            <p className="font-hand text-lg rotate-1">Check back later!</p>
          </div>
        )}
      </div>
    </div>
  );
};