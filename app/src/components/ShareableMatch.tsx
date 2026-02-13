import React from 'react';
import { clsx } from 'clsx';
import type { Match } from '../types';

interface ShareableMatchProps {
  match: Match;
}

export const ShareableMatch: React.FC<ShareableMatchProps> = ({ match }) => {
  const isWin1 = match.team1Wins > match.team2Wins;
  const isWin2 = match.team2Wins > match.team1Wins;

  return (
    <div 
      className="w-[1080px] h-[1920px] bg-[#FFFEFC] relative overflow-hidden flex flex-col font-body selection:none"
      style={{ fontFamily: "'Open Sans', sans-serif" }}
    >
        {/* Grainy Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.15] mix-blend-multiply z-0 pointer-events-none" 
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
        />

        {/* Dynamic Background Gradients */}
        <div className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-to-b from-[rgb(142,209,252)]/30 to-transparent mix-blend-multiply" />
        <div className="absolute bottom-0 left-0 right-0 h-[600px] bg-gradient-to-t from-[rgb(247,191,38)]/30 to-transparent mix-blend-multiply" />

        <div className="flex-1 flex flex-col justify-center items-center relative z-10 px-16 gap-16">
            
            {/* Header */}
            <div className="text-center">
                <h3 className="font-heading font-black italic text-gray-400 text-3xl tracking-[0.5em] uppercase mb-4">Match Result</h3>
                <div className="h-2 w-32 mx-auto bg-[rgb(0,85,150)] rounded-full" />
            </div>

            {/* Scoreboard */}
            <div className="w-full bg-white rounded-[60px] shadow-2xl p-16 border border-gray-100 flex flex-col gap-12 relative overflow-hidden">
                {/* Accent Bar */}
                <div className="absolute top-0 left-16 right-16 h-4 bg-[rgb(142,209,252)] rounded-b-2xl" />

                {/* Team 1 */}
                <div className="flex justify-between items-center group">
                    <span className={clsx(
                        "font-heading font-black italic text-6xl uppercase tracking-tighter max-w-[70%] leading-tight",
                        isWin1 ? "text-[rgb(0,85,150)]" : "text-gray-400"
                    )}>
                        {match.team1}
                    </span>
                    <span className={clsx(
                        "font-heading font-black text-9xl",
                        isWin1 ? "text-[rgb(0,85,150)] drop-shadow-[4px_4px_0px_rgb(247,191,38)]" : "text-gray-200"
                    )}>
                        {match.team1Wins}
                    </span>
                </div>

                {/* Divider */}
                <div className="h-px bg-gray-100 w-full relative">
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-gray-300 font-black italic text-2xl">VS</div>
                </div>

                {/* Team 2 */}
                <div className="flex justify-between items-center group">
                    <span className={clsx(
                        "font-heading font-black italic text-6xl uppercase tracking-tighter max-w-[70%] leading-tight",
                        isWin2 ? "text-[rgb(0,85,150)]" : "text-gray-400"
                    )}>
                        {match.team2}
                    </span>
                    <span className={clsx(
                        "font-heading font-black text-9xl",
                        isWin2 ? "text-[rgb(0,85,150)] drop-shadow-[4px_4px_0px_rgb(247,191,38)]" : "text-gray-200"
                    )}>
                        {match.team2Wins}
                    </span>
                </div>
            </div>

            {/* Winner Badge */}
            <div className="bg-[rgb(0,85,150)] text-white px-12 py-6 rounded-full transform -rotate-3 shadow-xl border-4 border-white">
                <span className="font-heading font-black italic text-4xl uppercase tracking-widest">
                    {isWin1 ? match.team1 : isWin2 ? match.team2 : 'Draw'} Wins!
                </span>
            </div>

            {/* Date */}
            <div className="font-mono font-bold text-gray-400 text-3xl uppercase tracking-widest">
                {new Date(match.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
            </div>

        </div>

        {/* Footer */}
        <div className="p-12 text-center bg-white/50 backdrop-blur-sm">
             <p className="font-heading font-bold uppercase tracking-[0.3em] text-2xl text-[rgb(0,85,150)]">
                Cayman Islands Corporate League
             </p>
        </div>
    </div>
  );
};
