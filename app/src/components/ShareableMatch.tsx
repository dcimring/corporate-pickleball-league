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
      const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      const monthIdx = Math.max(1, Math.min(12, Number(month))) - 1;
      return `${day.padStart(2, '0')} ${months[monthIdx]} ${year}`;
    }
    const fallback = new Date(dateStr);
    if (Number.isNaN(fallback.getTime())) return dateStr;
    return fallback.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
  };

  return (
    <div 
      className={clsx(
        "bg-white relative overflow-hidden flex flex-col font-body selection:none",
        isPost ? "p-12" : "pt-4 pb-0"
      )}
      style={{ 
        width: isPost ? '1200px' : '1080px',
        height: isPost ? '630px' : '1920px',
        minWidth: isPost ? '1200px' : '1080px',
        maxWidth: isPost ? '1200px' : '1080px',
        minHeight: isPost ? '630px' : '1920px',
        maxHeight: isPost ? '630px' : '1920px',
      }}
    >
        {/* Grainy Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.03] z-0 pointer-events-none" 
            style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/stardust.png")` }} 
        />

        {/* Dynamic Background Gradients */}
        <div className={clsx(
            "absolute top-0 left-0 right-0 mix-blend-multiply blur-3xl",
            isPost ? "h-[300px] bg-[#E0F2FE] opacity-40" : "h-[600px] bg-[#E0F2FE] opacity-30"
        )} />
        <div className={clsx(
            "absolute bottom-0 left-0 right-0 mix-blend-multiply blur-3xl",
            isPost ? "h-[200px] bg-[#FFC72C] opacity-20" : "h-[420px] bg-[#FFC72C] opacity-15"
        )} />

        {isPost ? (
            /* Post Layout (Landscape) */
            <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <p className="font-heading font-black italic text-[#005596] text-5xl uppercase tracking-tighter leading-[0.9]">
                            La Roche Posay<br/>Pickleball League
                        </p>
                    </div>
                    <div className="text-right">
                        <h3 className="font-heading font-black italic text-[#005596]/30 text-2xl tracking-[0.3em] uppercase mb-2">Match Result</h3>
                        <div className="h-1.5 w-24 ml-auto bg-[#FFC72C] rounded-full" />
                    </div>
                </div>

                <div className="flex-1 flex gap-8 items-center">
                    {/* Scoreboard Post */}
                    <div className="flex-1 bg-white rounded-3xl shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06)] p-12 border border-[#0F172A]/10 flex flex-col gap-8 relative overflow-hidden">
                        <div className="absolute top-0 left-10 right-10 h-3 bg-[#E0F2FE] rounded-b-xl" />
                        
                        <div className="flex justify-between items-center relative">
                            <div className="flex flex-col gap-1 flex-1 relative">
                                <span className={clsx(
                                    "font-heading font-black uppercase text-5xl tracking-tighter leading-tight",
                                    isWin1 ? "text-[#005596]" : "text-[#005596]/20"
                                )}>
                                    {match.team1}
                                </span>
                                <div className="flex items-center gap-3">
                                    <span className="font-heading font-bold text-xl text-[#005596]/30 uppercase tracking-[0.2em]">
                                        PTS
                                    </span>
                                    <span className={clsx("font-heading font-black text-2xl", isWin1 ? "text-[#005596]" : "text-[#005596]/20")}>
                                        {match.team1Points}
                                    </span>
                                </div>
                                {isWin1 && (
                                    <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#FFC72C] shadow-[0_0_15px_rgba(255,199,44,0.8)]" />
                                )}
                            </div>
                            <span className={clsx(
                                "font-heading font-black text-[120px] leading-none ml-6",
                                isWin1 ? "text-[#005596] drop-shadow-[4px_4px_0px_#FFC72C]" : "text-[#005596]/10"
                            )}>
                                {match.team1Wins}
                            </span>
                        </div>

                        <div className="h-px bg-[#0F172A]/5 w-full" />

                        <div className="flex justify-between items-center relative">
                            <div className="flex flex-col gap-1 flex-1 relative">
                                <span className={clsx(
                                    "font-heading font-black uppercase text-5xl tracking-tighter leading-tight",
                                    isWin2 ? "text-[#005596]" : "text-[#005596]/20"
                                )}>
                                    {match.team2}
                                </span>
                                <div className="flex items-center gap-3">
                                    <span className="font-heading font-bold text-xl text-[#005596]/30 uppercase tracking-[0.2em]">
                                        PTS
                                    </span>
                                    <span className={clsx("font-heading font-black text-2xl", isWin2 ? "text-[#005596]" : "text-[#005596]/20")}>
                                        {match.team2Points}
                                    </span>
                                </div>
                                {isWin2 && (
                                    <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#FFC72C] shadow-[0_0_15px_rgba(255,199,44,0.8)]" />
                                )}
                            </div>
                            <span className={clsx(
                                "font-heading font-black text-[120px] leading-none ml-6",
                                isWin2 ? "text-[#005596] drop-shadow-[4px_4px_0px_#FFC72C]" : "text-[#005596]/10"
                            )}>
                                {match.team2Wins}
                            </span>
                        </div>
                    </div>

                    {/* Winner Column Post */}
                    <div className="w-[450px] flex flex-col gap-8 items-center justify-center">
                        <div className="bg-[#FFC72C] text-[#005596] px-10 py-8 rounded-3xl border-4 border-white shadow-lg w-full text-center relative overflow-hidden">
                            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
                            <div className="flex flex-col items-center gap-4 relative z-10">
                                <div className="flex items-center gap-4">
                                    <Trophy className="w-10 h-10" strokeWidth={3} />
                                    <span className="font-heading font-black italic text-3xl uppercase tracking-[0.2em]">
                                        {isTie ? 'Tie' : 'Winner'}
                                    </span>
                                </div>
                                <span className="font-heading font-black italic text-5xl uppercase tracking-widest leading-none">
                                    {isTie ? 'No Winner' : (isWin1 ? match.team1 : match.team2)}
                                </span>
                            </div>
                        </div>
                        <div className="font-heading font-black text-3xl uppercase tracking-[0.4em] text-[#005596]/40">
                            {formatDateNoTz(match.date)}
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <p className="font-heading font-black uppercase tracking-[0.5em] text-xl text-[#005596]/20">
                        PICKLEBALL.KY
                    </p>
                </div>
            </div>
        ) : (
            /* Story Layout (Portrait) */
            <div className="flex flex-col justify-start items-center relative z-10 px-16 gap-12 flex-1">
                {/* League Heading Story */}
                <div className="text-center pt-24 w-full">
                    <p className="font-heading font-black italic text-[#005596] text-[120px] uppercase tracking-tighter leading-[0.85] mb-12">
                        La Roche Posay<br/>Pickleball League
                    </p>
                    <div className="h-4 w-64 mx-auto bg-[#FFC72C] rounded-full" />
                </div>
                
                <div className="text-center">
                    <h3 className="font-heading font-black italic text-[#005596]/20 text-5xl tracking-[0.5em] uppercase mb-0">Match Result</h3>
                </div>

                {/* Scoreboard Story */}
                <div className="w-full bg-white rounded-[60px] shadow-[0_4px_40px_-4px_rgba(15,23,42,0.1)] pt-20 px-16 pb-16 border border-[#0F172A]/10 flex flex-col gap-16 relative overflow-hidden">
                    <div className="absolute top-0 left-16 right-16 h-6 bg-[#E0F2FE] rounded-b-3xl" />

                    {/* Team 1 */}
                    <div className="flex justify-between items-center relative">
                        <div className="flex flex-col gap-6 max-w-[65%] relative">
                            <span className={clsx(
                                "font-heading font-black uppercase text-8xl tracking-tighter leading-[0.9]",
                                isWin1 ? "text-[#005596]" : "text-[#005596]/20"
                            )}>
                                {match.team1}
                            </span>
                            <div className="flex items-center gap-4">
                                <span className="font-heading font-bold text-3xl text-[#005596]/30 uppercase tracking-[0.2em]">PTS</span>
                                <span className={clsx("font-heading font-black text-4xl", isWin1 ? "text-[#005596]" : "text-[#005596]/20")}>
                                    {match.team1Points}
                                </span>
                            </div>
                            {isWin1 && (
                                <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#FFC72C] shadow-[0_0_20px_rgba(255,199,44,0.8)]" />
                            )}
                        </div>
                        <div className="relative">
                            <span className={clsx(
                                "font-heading font-black text-[280px] leading-none",
                                isWin1 ? "text-[#005596] drop-shadow-[8px_8px_0px_#FFC72C]" : "text-[#005596]/10"
                            )}>
                                {match.team1Wins}
                            </span>
                        </div>
                    </div>

                    <div className="h-px bg-[#0F172A]/5 w-full relative">
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-10 text-[#005596]/10 font-black italic text-5xl uppercase tracking-widest">VS</div>
                    </div>

                    {/* Team 2 */}
                    <div className="flex justify-between items-center relative">
                        <div className="flex flex-col gap-6 max-w-[65%] relative">
                            <span className={clsx(
                                "font-heading font-black uppercase text-8xl tracking-tighter leading-[0.9]",
                                isWin2 ? "text-[#005596]" : "text-[#005596]/20"
                            )}>
                                {match.team2}
                            </span>
                            <div className="flex items-center gap-4">
                                <span className="font-heading font-bold text-3xl text-[#005596]/30 uppercase tracking-[0.2em]">PTS</span>
                                <span className={clsx("font-heading font-black text-4xl", isWin2 ? "text-[#005596]" : "text-[#005596]/20")}>
                                    {match.team2Points}
                                </span>
                            </div>
                            {isWin2 && (
                                <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#FFC72C] shadow-[0_0_20px_rgba(255,199,44,0.8)]" />
                            )}
                        </div>
                        <div className="relative">
                            <span className={clsx(
                                "font-heading font-black text-[280px] leading-none",
                                isWin2 ? "text-[#005596] drop-shadow-[8px_8px_0px_#FFC72C]" : "text-[#005596]/10"
                            )}>
                                {match.team2Wins}
                            </span>
                        </div>
                    </div>

                    <div className="pt-12 border-t border-[#0F172A]/5 text-center font-heading font-black text-4xl uppercase tracking-[0.4em] text-[#005596]/40">
                        {formatDateNoTz(match.date)}
                    </div>
                </div>

                {/* Winner Badge Story */}
                <div className="bg-[#FFC72C] text-[#005596] px-20 py-12 rounded-[60px] shadow-xl border-[8px] border-white w-full relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
                    <div className="flex flex-col items-center gap-6 text-center relative z-10">
                        <div className="flex items-center gap-6">
                            <Trophy className="w-14 h-14" strokeWidth={3} />
                            <span className="font-heading font-black italic text-5xl uppercase tracking-[0.3em]">
                                {isTie ? 'Tie' : 'Winner'}
                            </span>
                        </div>
                        <span className="font-heading font-black italic text-[90px] uppercase tracking-widest leading-[0.85]">
                            {isTie ? 'No Winner' : (isWin1 ? match.team1 : match.team2)}
                        </span>
                    </div>
                </div>

                {/* Footer Story */}
                <div className="mt-auto pb-16 text-center">
                     <p className="font-heading font-black uppercase tracking-[0.6em] text-4xl text-[#005596]/20">
                        PICKLEBALL.KY
                     </p>
                </div>
            </div>
        )}
    </div>
  );
};
