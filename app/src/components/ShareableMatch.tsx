import React from 'react';
import { clsx } from 'clsx';
import { Trophy } from 'lucide-react';
import type { Match } from '../types';

interface ShareableMatchProps {
  match: Match;
  layout?: 'post' | 'story';
}

export const ShareableMatch: React.FC<ShareableMatchProps> = ({ 
  match,
  layout = 'story'
}) => {
  const isPost = layout === 'post';
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
      className={clsx(
        "bg-[#FFFEFC] relative overflow-hidden flex flex-col font-body selection:none",
        isPost ? "w-[1200px] h-[630px] p-12" : "w-[1080px] h-[1920px] pt-4 pb-0"
      )}
      style={{ fontFamily: "'Open Sans', sans-serif" }}
    >
        {/* Grainy Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.03] z-0 pointer-events-none" 
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
        />

        {/* Dynamic Background Gradients */}
        <div className={clsx(
            "absolute top-0 left-0 right-0 mix-blend-multiply",
            isPost ? "h-[300px] bg-gradient-to-b from-[rgb(142,209,252)]/12 to-transparent" : "h-[600px] bg-gradient-to-b from-[rgb(142,209,252)]/8 to-transparent"
        )} />
        <div className={clsx(
            "absolute bottom-0 left-0 right-0 mix-blend-multiply",
            isPost ? "h-[200px] bg-gradient-to-t from-[rgb(247,191,38)]/15 to-transparent" : "h-[420px] bg-gradient-to-t from-[rgb(247,191,38)]/12 to-transparent"
        )} />

        {isPost ? (
            /* Post Layout (Landscape) */
            <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <p className="font-heading font-black italic text-[rgb(0,85,150)] text-4xl uppercase tracking-[0.1em] leading-tight">
                            La Roche Posay<br/>Corporate Pickleball League
                        </p>
                    </div>
                    <div className="text-right">
                        <h3 className="font-heading font-black italic text-gray-500 text-xl tracking-[0.3em] uppercase mb-2">Match Result</h3>
                        <div className="h-1.5 w-24 ml-auto bg-[rgb(0,85,150)] rounded-full" />
                    </div>
                </div>

                <div className="flex-1 flex gap-8 items-center">
                    {/* Scoreboard Post */}
                    <div className="flex-1 bg-white rounded-[40px] shadow-none p-10 border border-gray-100 flex flex-col gap-6 relative overflow-hidden">
                        <div className="absolute top-0 left-10 right-10 h-3 bg-[rgb(142,209,252)] rounded-b-xl" />
                        
                        <div className="flex justify-between items-center">
                            <div className="flex flex-col gap-1 flex-1">
                                <span className={clsx(
                                    "font-heading font-black italic text-4xl uppercase tracking-tighter leading-tight",
                                    isWin1 ? "text-[rgb(0,85,150)]" : "text-gray-400"
                                )}>
                                    {match.team1}
                                </span>
                                <span className="font-mono font-black text-xl text-gray-400 uppercase tracking-widest">
                                    PTS {match.team1Points}
                                </span>
                            </div>
                            <span className={clsx(
                                "font-heading font-black text-7xl ml-6",
                                isWin1 ? "text-[rgb(0,85,150)] drop-shadow-[3px_3px_0px_rgb(247,191,38)]" : "text-gray-200"
                            )}>
                                {match.team1Wins}
                            </span>
                        </div>

                        <div className="h-px bg-gray-100 w-full" />

                        <div className="flex justify-between items-center">
                            <div className="flex flex-col gap-1 flex-1">
                                <span className={clsx(
                                    "font-heading font-black italic text-4xl uppercase tracking-tighter leading-tight",
                                    isWin2 ? "text-[rgb(0,85,150)]" : "text-gray-400"
                                )}>
                                    {match.team2}
                                </span>
                                <span className="font-mono font-black text-xl text-gray-400 uppercase tracking-widest">
                                    PTS {match.team2Points}
                                </span>
                            </div>
                            <span className={clsx(
                                "font-heading font-black text-7xl ml-6",
                                isWin2 ? "text-[rgb(0,85,150)] drop-shadow-[3px_3px_0px_rgb(247,191,38)]" : "text-gray-200"
                            )}>
                                {match.team2Wins}
                            </span>
                        </div>
                    </div>

                    {/* Winner Column Post */}
                    <div className="w-[400px] flex flex-col gap-6 items-center justify-center">
                        <div className="bg-brand-yellow text-brand-blue px-10 py-6 rounded-[30px] border-4 border-white shadow-none w-full text-center">
                            <div className="flex flex-col items-center gap-2">
                                <div className="flex items-center gap-3">
                                    <Trophy className="w-8 h-8" strokeWidth={3} />
                                    <span className="font-heading font-black italic text-2xl uppercase tracking-[0.2em]">
                                        {isTie ? 'Tie' : 'Winner'}
                                    </span>
                                </div>
                                <span className="font-heading font-black italic text-4xl uppercase tracking-widest leading-none">
                                    {isTie ? 'No Winner' : (isWin1 ? match.team1 : match.team2)}
                                </span>
                            </div>
                        </div>
                        <div className="font-mono font-black text-2xl uppercase tracking-[0.2em] text-brand-blue">
                            {formatDateNoTz(match.date)}
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <p className="font-heading font-black uppercase tracking-[0.4em] text-xl text-gray-400">
                        PICKLEBALL.KY
                    </p>
                </div>
            </div>
        ) : (
            /* Story Layout (Portrait) */
            <div className="flex flex-col justify-start items-center relative z-10 px-16 gap-8 flex-1">
                {/* League Heading Story */}
                <div className="text-center pt-16">
                    <p className="font-heading font-black italic text-[rgb(0,85,150)] text-[100px] uppercase tracking-[0.1em] leading-[0.95] mb-8">
                        La Roche Posay<br/>Pickleball League
                    </p>
                    <div className="h-3 w-48 mx-auto bg-[rgb(247,191,38)] rounded-full" />
                </div>
                
                <div className="text-center">
                    <h3 className="font-heading font-black italic text-gray-500 text-4xl tracking-[0.4em] uppercase mb-0">Match Result</h3>
                </div>

                {/* Scoreboard Story */}
                <div className="w-full bg-white rounded-[80px] shadow-none pt-16 px-16 pb-12 border border-gray-100 flex flex-col gap-12 relative overflow-hidden">
                    <div className="absolute top-0 left-16 right-16 h-6 bg-[rgb(142,209,252)] rounded-b-3xl" />

                    {/* Team 1 */}
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col gap-4 max-w-[70%]">
                            <span className={clsx(
                                "font-heading font-black italic text-7xl uppercase tracking-tighter leading-tight",
                                isWin1 ? "text-[rgb(0,85,150)]" : "text-gray-400"
                            )}>
                                {match.team1}
                            </span>
                            <div className="font-mono font-black text-3xl uppercase tracking-[0.2em] text-gray-500">
                                PTS {match.team1Points}
                            </div>
                        </div>
                        <span className={clsx(
                            "font-heading font-black text-[180px] leading-none",
                            isWin1 ? "text-[rgb(0,85,150)] drop-shadow-[8px_8px_0px_rgb(247,191,38)]" : "text-gray-100"
                        )}>
                            {match.team1Wins}
                        </span>
                    </div>

                    <div className="h-px bg-gray-100 w-full relative">
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-8 text-gray-300 font-black italic text-4xl">VS</div>
                    </div>

                    {/* Team 2 */}
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col gap-4 max-w-[70%]">
                            <span className={clsx(
                                "font-heading font-black italic text-7xl uppercase tracking-tighter leading-tight",
                                isWin2 ? "text-[rgb(0,85,150)]" : "text-gray-400"
                            )}>
                                {match.team2}
                            </span>
                            <div className="font-mono font-black text-3xl uppercase tracking-[0.2em] text-gray-500">
                                PTS {match.team2Points}
                            </div>
                        </div>
                        <span className={clsx(
                            "font-heading font-black text-[180px] leading-none",
                            isWin2 ? "text-[rgb(0,85,150)] drop-shadow-[8px_8px_0px_rgb(247,191,38)]" : "text-gray-100"
                        )}>
                            {match.team2Wins}
                        </span>
                    </div>

                    <div className="pt-8 border-t border-gray-100 text-center font-mono font-black text-3xl uppercase tracking-[0.3em] text-[rgb(0,85,150)]">
                        {formatDateNoTz(match.date)}
                    </div>
                </div>

                {/* Winner Badge Story */}
                <div className="bg-brand-yellow text-brand-blue px-16 py-10 rounded-[50px] shadow-none border-[6px] border-white w-full">
                    <div className="flex flex-col items-center gap-4 text-center">
                        <div className="flex items-center gap-4">
                            <Trophy className="w-10 h-10" strokeWidth={3} />
                            <span className="font-heading font-black italic text-4xl uppercase tracking-[0.3em]">
                                {isTie ? 'Tie' : 'Winner'}
                            </span>
                        </div>
                        <span className="font-heading font-black italic text-7xl uppercase tracking-widest leading-none">
                            {isTie ? 'No Winner' : (isWin1 ? match.team1 : match.team2)}
                        </span>
                    </div>
                </div>

                {/* Footer Story */}
                <div className="mt-auto pb-12 text-center">
                     <p className="font-heading font-black uppercase tracking-[0.5em] text-3xl text-[rgb(0,85,150)]">
                        PICKLEBALL.KY
                     </p>
                </div>
            </div>
        )}
    </div>
  );
};
