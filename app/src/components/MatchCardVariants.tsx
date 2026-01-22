import React from 'react';
import { clsx } from 'clsx';
import { Calendar as CalendarIcon, Trophy } from 'lucide-react';
import type { Match } from '../types';

interface MatchCardProps {
  match: Match;
  variant?: 'high-contrast' | 'versus-split' | 'digital-board';
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, variant = 'high-contrast' }) => {
  
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

  // Variant 1: High Contrast (Matches Leaderboard style)
  // Square corners, bold headers, grey/black theme, clear data separation
  if (variant === 'high-contrast') {
    return (
      <div className="w-full bg-white border border-gray-200 shadow-sm transition-all hover:shadow-md group">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-brand-gray border-b border-gray-200">
          <div className="flex items-center gap-2 text-xs font-heading font-bold text-gray-500 uppercase tracking-widest">
            <CalendarIcon className="w-3 h-3" />
            {formatDate(match.date)}
          </div>
          <div className="text-[10px] font-heading font-black text-gray-400 uppercase tracking-widest">
            MATCH RESULT
          </div>
        </div>

        {/* Content */}
        <div className="p-4 grid grid-cols-[1fr,auto,1fr] gap-4 items-center">
          
          {/* Team 1 */}
          <div className={clsx(
            "flex flex-col items-start gap-1 transition-colors",
            isWin1 ? "text-brand-blue" : "text-gray-500 group-hover:text-gray-700"
          )}>
            <div className="flex items-center gap-2">
              <span className="font-heading font-bold text-sm md:text-base uppercase tracking-wide leading-tight">
                {match.team1}
              </span>
              {isWin1 && <Trophy className="w-3 h-3 text-brand-yellow fill-brand-yellow flex-shrink-0" />}
            </div>
            <span className="text-[10px] font-mono text-gray-400">PTS: {match.team1Points}</span>
          </div>

          {/* Score Box */}
          <div className="flex items-center bg-gray-100 px-4 py-2 rounded-none font-heading font-black text-xl md:text-2xl text-black tracking-tighter">
            <span className={isWin1 ? "text-brand-blue" : "text-gray-400"}>{match.team1Wins}</span>
            <span className="mx-1 text-gray-300 text-base">-</span>
            <span className={isWin2 ? "text-brand-blue" : "text-gray-400"}>{match.team2Wins}</span>
          </div>

          {/* Team 2 */}
          <div className={clsx(
            "flex flex-col items-end gap-1 transition-colors text-right",
            isWin2 ? "text-brand-blue" : "text-gray-500 group-hover:text-gray-700"
          )}>
            <div className="flex items-center gap-2 flex-row-reverse">
              <span className="font-heading font-bold text-sm md:text-base uppercase tracking-wide leading-tight">
                {match.team2}
              </span>
              {isWin2 && <Trophy className="w-3 h-3 text-brand-yellow fill-brand-yellow flex-shrink-0" />}
            </div>
            <span className="text-[10px] font-mono text-gray-400">PTS: {match.team2Points}</span>
          </div>

        </div>
      </div>
    );
  }

  // Variant 2: Versus Split (Dramatic, Diagonal, Action-oriented)
  if (variant === 'versus-split') {
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
      </div>
    );
  }

  // Variant 3: Digital Scoreboard (Tech, Data-rich, Compact)
  if (variant === 'digital-board') {
    return (
      <div className="w-full bg-gray-900 rounded-lg p-1 shadow-md hover:shadow-lg transition-all">
        <div className="bg-gray-800 rounded border border-gray-700 p-3 md:p-4">
          
          {/* Header */}
          <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2">
            <span className="text-[10px] text-gray-400 font-mono uppercase tracking-widest">FINAL SCORE</span>
            <span className="text-[10px] text-brand-yellow font-mono uppercase tracking-widest">{formatDate(match.date)}</span>
          </div>

          {/* Score Rows */}
          <div className="space-y-2">
            
            {/* Team 1 */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className={clsx(
                  "w-1 h-8 rounded-full",
                  isWin1 ? "bg-brand-yellow shadow-[0_0_8px_#FFC72C]" : "bg-gray-700"
                )} />
                <span className={clsx(
                  "font-heading font-bold text-sm md:text-base uppercase tracking-wide",
                  isWin1 ? "text-white text-shadow-glow" : "text-gray-500"
                )}>
                  {match.team1}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-mono text-gray-500">PTS: {match.team1Points}</span>
                <span className={clsx(
                  "font-mono font-bold text-xl w-8 text-right",
                  isWin1 ? "text-brand-yellow" : "text-gray-600"
                )}>
                  {match.team1Wins}
                </span>
              </div>
            </div>

            {/* Team 2 */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className={clsx(
                  "w-1 h-8 rounded-full",
                  isWin2 ? "bg-brand-yellow shadow-[0_0_8px_#FFC72C]" : "bg-gray-700"
                )} />
                <span className={clsx(
                  "font-heading font-bold text-sm md:text-base uppercase tracking-wide",
                  isWin2 ? "text-white text-shadow-glow" : "text-gray-500"
                )}>
                  {match.team2}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-mono text-gray-500">PTS: {match.team2Points}</span>
                <span className={clsx(
                  "font-mono font-bold text-xl w-8 text-right",
                  isWin2 ? "text-brand-yellow" : "text-gray-600"
                )}>
                  {match.team2Wins}
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  return null;
};
