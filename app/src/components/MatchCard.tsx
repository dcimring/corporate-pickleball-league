import React from 'react';
import { clsx } from 'clsx';
import type { Match } from '../types';

interface MatchCardProps {
  match: Match;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match }) => {
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      year: '2-digit',
      timeZone: 'UTC'
    }).format(date);
  };

  const isWin1 = match.team1Wins > match.team2Wins;
  const isWin2 = match.team2Wins > match.team1Wins;

  return (
    <div className="relative w-full bg-white rounded-xl overflow-hidden border border-gray-100 shadow-soft hover:shadow-hover transition-all group">
      {/* Date Tag */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold px-3 py-1 rounded-b-lg shadow-sm z-10 font-heading tracking-widest">
        {formatDate(match.date)}
      </div>

      <div className="flex h-full min-h-[100px]">
        {/* Team 1 Side */}
        <div className={clsx(
          "flex-1 flex flex-col justify-center items-center p-4 relative overflow-hidden",
          isWin1 ? "bg-blue-50" : "bg-white"
        )}>
          <span className={clsx(
            "font-heading font-black text-lg md:text-xl uppercase text-center relative z-10",
            isWin1 ? "text-brand-blue" : "text-gray-400"
          )}>
            {match.team1}
          </span>
          <span className={clsx(
            "text-4xl md:text-5xl font-heading font-black mt-2 relative z-10",
            isWin1 ? "text-brand-blue" : "text-gray-200"
          )}>
            {match.team1Wins}
          </span>
          {isWin1 && <div className="absolute inset-0 bg-brand-yellow/10 skew-x-[-12deg] w-[120%] -ml-[10%]" />}
        </div>

        {/* VS Divider */}
        <div className="relative w-px bg-gray-200 flex items-center justify-center">
          <div className="bg-white border border-gray-200 rounded-full w-8 h-8 flex items-center justify-center text-[10px] font-bold text-gray-300 font-heading z-20">
            VS
          </div>
        </div>

        {/* Team 2 Side */}
        <div className={clsx(
          "flex-1 flex flex-col justify-center items-center p-4 relative overflow-hidden",
          isWin2 ? "bg-blue-50" : "bg-white"
        )}>
          <span className={clsx(
            "font-heading font-black text-lg md:text-xl uppercase text-center relative z-10",
            isWin2 ? "text-brand-blue" : "text-gray-400"
          )}>
            {match.team2}
          </span>
          <span className={clsx(
            "text-4xl md:text-5xl font-heading font-black mt-2 relative z-10",
            isWin2 ? "text-brand-blue" : "text-gray-200"
          )}>
            {match.team2Wins}
          </span>
          {isWin2 && <div className="absolute inset-0 bg-brand-yellow/10 skew-x-[12deg] w-[120%] -ml-[10%]" />}
        </div>
      </div>
      
      {/* Points Footer */}
      <div className="bg-gray-50 border-t border-gray-100 px-4 py-1.5 flex justify-center gap-4 text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest">
        <span>Pts: {match.team1Points}</span>
        <span className="text-gray-200">|</span>
        <span>Pts: {match.team2Points}</span>
      </div>
    </div>
  );
};
