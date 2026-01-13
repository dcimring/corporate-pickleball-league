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
          <h1 className="text-6xl font-heading text-white italic mb-2 tracking-wide">
            MATCH RESULTS
          </h1>
          <p className="font-body text-xl text-gray-400 uppercase tracking-widest">The thrill of victory...</p>
          <Squiggle className="w-32 h-6 text-brand-acid absolute -bottom-1 left-0" />
        </div>

        {/* Division Toggle */}
        <div className="relative group max-w-full">
          <div className="flex gap-2 bg-brand-soft-blue border border-white/10 p-2 shadow-glow overflow-x-auto no-scrollbar md:flex-wrap md:overflow-visible">
            {divisions.map((div) => (
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
          {/* Fade Mask */}
          <div className="absolute top-0 bottom-0 right-0 w-12 bg-gradient-to-l from-brand-soft-blue via-brand-soft-blue/40 to-transparent pointer-events-none md:hidden" />
        </div>
      </div>

      <div className="space-y-6">
        {scores.length > 0 ? (
          scores.map((match, idx) => (
            <Card 
              key={idx}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-6 p-0 overflow-hidden bg-brand-soft-blue border-l-4 border-l-brand-acid border-y-0 border-r-0"
            >
              {/* Date Tab */}
              <div className="bg-black/20 p-6 flex sm:flex-col items-center justify-center min-w-[120px] gap-2 border-r border-white/5">
                <CalendarDays className="w-5 h-5 text-brand-acid" />
                <div className="text-center leading-none">
                  <div className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">
                    {new Date(match.date).toLocaleDateString('en-US', { month: 'short' })}
                  </div>
                  <div className="text-3xl font-heading text-white italic">
                    {new Date(match.date).toLocaleDateString('en-US', { day: 'numeric' })}
                  </div>
                </div>
              </div>

              {/* Matchup */}
              <div className="flex-grow flex flex-col sm:flex-row items-center justify-between p-6 sm:p-0 sm:pr-8 gap-6">
                
                {/* Winner */}
                <div className="flex-1 text-center sm:text-right w-full">
                  <div className="font-heading text-3xl text-white italic tracking-wide leading-none">{match.winner}</div>
                  <div className="inline-block bg-brand-acid text-brand-cream px-2 py-0.5 text-xs font-bold mt-2 skew-x-[-10deg]">
                    <span className="skew-x-[10deg] block uppercase tracking-widest">WINNER</span>
                  </div>
                </div>

                {/* Scoreboard */}
                <div className="bg-black/40 border border-white/10 px-8 py-4 skew-x-[-10deg] shadow-inner">
                  <div className="skew-x-[10deg] flex items-center gap-4 font-mono text-4xl text-brand-acid font-bold tracking-widest">
                    <span>{match.winnerScore}</span>
                    <span className="text-gray-600 text-2xl">:</span>
                    <span className="text-white/50">{match.loserScore}</span>
                  </div>
                </div>

                {/* Loser */}
                <div className="flex-1 text-center sm:text-left w-full opacity-50 grayscale hover:grayscale-0 transition-all">
                  <div className="font-heading text-2xl text-gray-300 italic tracking-wide leading-none">{match.loser}</div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="p-16 text-center flex flex-col items-center justify-center gap-4 text-gray-500 bg-black/20 border border-white/10">
            <div className="bg-brand-soft-blue p-4 border border-brand-acid/30 shadow-glow">
              <Info className="w-8 h-8 text-brand-acid" />
            </div>
            <p className="font-heading text-2xl italic text-white">No match results yet</p>
            <p className="font-body text-lg">Check back later!</p>
          </div>
        )}
      </div>
    </div>
  );
};