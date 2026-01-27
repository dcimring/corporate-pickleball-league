import React from 'react';
import { clsx } from 'clsx';
import type { Match } from '../types';

interface MatchCardProps {
  match: Match;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match }) => {
  const isWin1 = match.team1Wins > match.team2Wins || (match.team1Wins === match.team2Wins && match.team1Points > match.team2Points);
  const isWin2 = match.team2Wins > match.team1Wins || (match.team1Wins === match.team2Wins && match.team2Points > match.team1Points);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: '2-digit',
      timeZone: 'UTC'
    }).format(date).toUpperCase(); // 14-JAN-26
  };

  return (
    <div className="w-full bg-white rounded-3xl shadow-soft hover:shadow-lg transition-all duration-300 relative overflow-hidden group border border-gray-100/50">
      
      {/* Top Accent Bar (Inset) */}
      <div className="absolute top-0 left-6 right-6 h-2 bg-[rgb(142,209,252)] rounded-b-md z-10" />

      <div className="pt-6 md:pt-10 pb-3 px-5 md:px-8 flex flex-col h-full">
        
        {/* Teams Container */}
        <div className="flex-1 flex flex-col justify-center gap-2 md:gap-4">
            {/* Team 1 */}
            <div className="flex justify-between items-center group/team">
                <div className={clsx(
                  "font-heading font-black italic uppercase text-base md:text-2xl tracking-tight leading-none max-w-[80%]",
                  isWin1 ? "text-[rgb(0,85,150)]" : "text-gray-300"
                )}>
                  {match.team1}
                </div>
                <div className={clsx(
                  "font-heading font-black text-3xl md:text-5xl relative",
                  isWin1 ? "text-[rgb(0,85,150)] drop-shadow-[2px_2px_0px_rgb(247,191,38)] md:drop-shadow-[3px_3px_0px_rgb(247,191,38)]" : "text-gray-100"
                )}>
                  {match.team1Wins}
                </div>
            </div>

            {/* Subtle Divider */}
            <div className="h-px bg-gray-50 w-full" />

            {/* Team 2 */}
            <div className="flex justify-between items-center group/team">
                <div className={clsx(
                  "font-heading font-black italic uppercase text-base md:text-2xl tracking-tight leading-none max-w-[80%]",
                  isWin2 ? "text-[rgb(0,85,150)]" : "text-gray-300"
                )}>
                  {match.team2}
                </div>
                <div className={clsx(
                  "font-heading font-black text-3xl md:text-5xl relative",
                  isWin2 ? "text-[rgb(0,85,150)] drop-shadow-[2px_2px_0px_rgb(247,191,38)] md:drop-shadow-[3px_3px_0px_rgb(247,191,38)]" : "text-gray-100"
                )}>
                  {match.team2Wins}
                </div>
            </div>
        </div>

        {/* Footer (Date & Points) */}
        <div className="mt-2 md:mt-4 pt-3 border-t border-gray-100 flex justify-between items-end">
            <div className="font-heading font-bold text-[rgb(142,209,252)] text-xs tracking-[0.2em] uppercase">
                {formatDate(match.date)}
            </div>
            
            <div className="flex items-center gap-2 font-mono text-[10px] font-bold text-gray-400">
                <span className="tracking-widest uppercase">PTS:</span>
                <span className={clsx("text-sm", isWin1 ? "text-[rgb(0,85,150)]" : "text-gray-400")}>{match.team1Points}</span>
                <span className="text-gray-300">/</span>
                <span className={clsx("text-sm", isWin2 ? "text-[rgb(0,85,150)]" : "text-gray-400")}>{match.team2Points}</span>
            </div>
        </div>

      </div>
    </div>
  );
};
