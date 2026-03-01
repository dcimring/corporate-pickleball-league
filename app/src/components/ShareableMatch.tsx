import React from 'react';
import { clsx } from 'clsx';
import { Trophy } from 'lucide-react';
import type { Match } from '../types';

interface ShareableMatchProps {
  match: Match;
}

export const ShareableMatch: React.FC<ShareableMatchProps> = ({ match }) => {
  const winsEqual = match.team1Wins === match.team2Wins;
  const pointsEqual = match.team1Points === match.team2Points;
  const isTie = winsEqual && pointsEqual;
  const isWin1 = !isTie && (match.team1Wins > match.team2Wins || (winsEqual && match.team1Points > match.team2Points));
  const isWin2 = !isTie && (match.team2Wins > match.team1Wins || (winsEqual && match.team2Points > match.team1Points));
  const formatDateNoTz = (dateStr: string) => {
    const datePart = dateStr.split('T')[0];
    const parts = datePart.split('-');
    if (parts.length === 3) {
      const [year, month, day] = parts;
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthIdx = Math.max(1, Math.min(12, Number(month))) - 1;
      return `${day.padStart(2, '0')} ${months[monthIdx]} ${year}`;
    }
    const fallback = new Date(dateStr);
    if (Number.isNaN(fallback.getTime())) return dateStr;
    return fallback.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div 
      className="w-[1080px] h-[1660px] bg-[#FFFEFC] relative overflow-hidden flex flex-col font-body selection:none pt-8 pb-0"
      style={{ fontFamily: "'Open Sans', sans-serif" }}
    >
        {/* Grainy Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.04] z-0 pointer-events-none" 
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
        />

        {/* Dynamic Background Gradients */}
        <div className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-to-b from-[rgb(142,209,252)]/8 to-transparent mix-blend-multiply" />
        <div className="absolute bottom-0 left-0 right-0 h-[420px] bg-gradient-to-t from-[rgb(247,191,38)]/12 to-transparent mix-blend-multiply" />

        <div className="flex flex-col justify-start items-center relative z-10 px-16 gap-8 flex-1">

            {/* League Heading */}
            <div className="text-center">
                <p className="font-heading font-black italic text-[rgb(0,85,150)] text-[96px] uppercase tracking-[0.18em] leading-[1.05]">
                    La Roche Posay Corporate Pickleball League
                </p>
            </div>
            
            {/* Header */}
            <div className="text-center">
                <h3 className="font-heading font-black italic text-gray-400 text-3xl tracking-[0.5em] uppercase mb-4">Match Result</h3>
                <div className="h-2 w-32 mx-auto bg-[rgb(0,85,150)] rounded-full" />
            </div>

            {/* Scoreboard */}
            <div className="w-full bg-white rounded-[60px] shadow-none p-16 border border-gray-100 flex flex-col gap-12 relative overflow-hidden">
                {/* Accent Bar */}
                <div className="absolute top-0 left-16 right-16 h-4 bg-[rgb(142,209,252)] rounded-b-2xl" />

                {/* Team 1 */}
                <div className="flex justify-between items-center group">
                    <div className="flex flex-col gap-2 max-w-[70%]">
                        <span className={clsx(
                            "font-heading font-black italic text-6xl uppercase tracking-tighter leading-tight",
                            isWin1 ? "text-[rgb(0,85,150)]" : "text-gray-400"
                        )}>
                            {match.team1}
                        </span>
                        <div className="font-mono text-2xl uppercase tracking-[0.25em] text-gray-400">
                            PTS {match.team1Points}
                        </div>
                    </div>
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
                    <div className="flex flex-col gap-2 max-w-[70%]">
                        <span className={clsx(
                            "font-heading font-black italic text-6xl uppercase tracking-tighter leading-tight",
                            isWin2 ? "text-[rgb(0,85,150)]" : "text-gray-400"
                        )}>
                            {match.team2}
                        </span>
                        <div className="font-mono text-2xl uppercase tracking-[0.25em] text-gray-400">
                            PTS {match.team2Points}
                        </div>
                    </div>
                    <span className={clsx(
                        "font-heading font-black text-9xl",
                        isWin2 ? "text-[rgb(0,85,150)] drop-shadow-[4px_4px_0px_rgb(247,191,38)]" : "text-gray-200"
                    )}>
                        {match.team2Wins}
                    </span>
                </div>
            </div>

            {/* Winner Badge */}
            <div className="bg-brand-yellow text-brand-blue px-12 py-5 rounded-full shadow-none border-4 border-white">
                <div className="flex flex-col items-center gap-2 text-center">
                    <div className="flex items-center gap-3">
                        <Trophy className="w-7 h-7" strokeWidth={2} />
                        <span className="font-heading font-black italic text-3xl uppercase tracking-[0.35em]">
                            {isTie ? 'Tie' : 'Winner'}
                        </span>
                    </div>
                    <span className="font-heading font-black italic text-5xl uppercase tracking-widest">
                        {isTie ? 'No Winner' : (isWin1 ? match.team1 : match.team2)}
                    </span>
                </div>
            </div>

            {/* Date */}
            <div className="font-mono font-bold text-gray-400 text-3xl uppercase tracking-widest mb-2">
                {formatDateNoTz(match.date)}
            </div>

        </div>

        {/* Footer */}
        <div className="px-12 py-4 text-center bg-white/50 backdrop-blur-sm mt-auto">
             <p className="font-heading font-bold uppercase tracking-[0.3em] text-2xl text-[rgb(0,85,150)]">
                Corporate Pickleball League
             </p>
        </div>
    </div>
  );
};
