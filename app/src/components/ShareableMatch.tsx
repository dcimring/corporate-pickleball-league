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
        "bg-[#f7f9fb] relative overflow-hidden flex flex-col font-body selection:none",
        isPost ? "p-16" : "pb-0"
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
        {/* Magazine Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.05] z-0 pointer-events-none" 
            style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/stardust.png")` }} 
        />

        {/* Decorative Background Elements */}
        <div className={clsx(
            "absolute transform -rotate-6 z-0 opacity-15 bg-linear-to-bl from-[#005a87] to-[#005596]",
            isPost ? "h-[400px] w-[800px] top-[-100px] right-[-100px]" : "h-[800px] w-[1200px] top-[-200px] right-[-200px]"
        )} style={{ clipPath: 'polygon(10% 20%, 90% 0%, 100% 90%, 0% 100%)' }} />

        {isPost ? (
            /* Post Layout (Landscape) */
            <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-12">
                    <div>
                        <p className="font-stat font-black tracking-[0.4em] text-[#ffc72c] uppercase mb-4 text-xl">
                            MATCH DAY REPORT
                        </p>
                        <h1 className="font-display font-black text-[#005a87] text-[100px] uppercase tracking-tighter leading-[0.85]">
                            THE<br/><span className="text-[#005596]">RESULT</span>
                        </h1>
                    </div>
                    <div className="text-right">
                        <div className="bg-[#ffc72c] text-[#005a87] px-8 py-3 font-display font-black uppercase tracking-widest shadow-xl text-2xl">
                            {formatDateNoTz(match.date)}
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex gap-12 items-center">
                    {/* Scoreboard Post */}
                    <div className="flex-1 bg-white shadow-[0_12px_32px_rgba(25,28,30,0.06)] p-12 flex flex-col gap-12 relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-4 bg-[#ffc72c]" />
                        
                        <div className="flex justify-between items-center relative">
                            <div className="flex flex-col gap-2 flex-1 relative">
                                <span className={clsx(
                                    "font-display font-black uppercase text-5xl tracking-tighter leading-tight",
                                    isWin1 ? "text-[#005a87]" : "text-[#005a87]/20"
                                )}>
                                    {match.team1}
                                </span>
                                <div className="flex items-center gap-4">
                                    <span className="font-stat font-bold text-xl text-[#005a87]/30 uppercase tracking-[0.2em]">POINTS</span>
                                    <span className={clsx("font-stat font-black text-3xl", isWin1 ? "text-[#005a87]" : "text-[#005a87]/20")}>
                                        {match.team1Points}
                                    </span>
                                </div>
                                {isWin1 && (
                                    <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#ffc72c] shadow-[0_0_15px_rgba(255,199,44,0.8)]" />
                                )}
                            </div>
                            <span className={clsx(
                                "font-stat font-black text-[140px] leading-none ml-12",
                                isWin1 ? "text-[#005a87]" : "text-[#005a87]/10"
                            )}>
                                {match.team1Wins}
                            </span>
                        </div>

                        <div className="flex justify-between items-center relative">
                            <div className="flex flex-col gap-2 flex-1 relative">
                                <span className={clsx(
                                    "font-display font-black uppercase text-5xl tracking-tighter leading-tight",
                                    isWin2 ? "text-[#005a87]" : "text-[#005a87]/20"
                                )}>
                                    {match.team2}
                                </span>
                                <div className="flex items-center gap-4">
                                    <span className="font-stat font-bold text-xl text-[#005a87]/30 uppercase tracking-[0.2em]">POINTS</span>
                                    <span className={clsx("font-stat font-black text-3xl", isWin2 ? "text-[#005a87]" : "text-[#005a87]/20")}>
                                        {match.team2Points}
                                    </span>
                                </div>
                                {isWin2 && (
                                    <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#ffc72c] shadow-[0_0_15px_rgba(255,199,44,0.8)]" />
                                )}
                            </div>
                            <span className={clsx(
                                "font-stat font-black text-[140px] leading-none ml-12",
                                isWin2 ? "text-[#005a87]" : "text-[#005a87]/10"
                            )}>
                                {match.team2Wins}
                            </span>
                        </div>
                    </div>

                    {/* Winner Column Post */}
                    <div className="w-[400px] flex flex-col gap-12 items-center justify-center">
                        <div className="text-center space-y-4">
                            <Trophy className="w-16 h-16 text-[#ffc72c] mx-auto" strokeWidth={3} />
                            <h3 className="font-display font-black italic text-[#005a87] text-4xl uppercase tracking-[0.2em]">
                                {isTie ? 'TIE' : 'WINNER'}
                            </h3>
                            <div className="bg-[#005a87] text-white p-8 w-full text-center">
                                <span className="font-display font-black text-5xl uppercase tracking-widest leading-none">
                                    {isTie ? 'NO WINNER' : (isWin1 ? match.team1 : match.team2)}
                                </span>
                            </div>
                        </div>
                        <div className="font-stat font-black text-2xl tracking-[0.4em] text-[#005a87] opacity-20 uppercase">
                           PICKLEBALL.KY
                        </div>
                    </div>
                </div>
            </div>
        ) : (
            /* Story Layout (Portrait) */
            <div className="flex flex-col justify-start items-center relative z-10 px-16 gap-16 flex-1">
                {/* League Heading Story */}
                <div className="text-center pt-32 w-full space-y-8">
                    <p className="font-stat font-black tracking-[0.5em] text-[#ffc72c] uppercase text-4xl">
                        OFFICIAL MATCH RECORD
                    </p>
                    <h1 className="font-display font-black text-[#005a87] text-[150px] uppercase tracking-tighter leading-[0.8] mb-12">
                        THE<br/><span className="text-[#005596]">FINAL</span><br/>SCORE
                    </h1>
                </div>

                {/* Scoreboard Story */}
                <div className="w-full bg-white shadow-[0_24px_64px_rgba(25,28,30,0.1)] p-20 flex flex-col gap-20 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-8 bg-[#005a87]" />

                    {/* Team 1 */}
                    <div className="flex justify-between items-center relative">
                        <div className="flex flex-col gap-6 max-w-[65%] relative">
                            <span className={clsx(
                                "font-display font-black uppercase text-8xl tracking-tighter leading-[0.9]",
                                isWin1 ? "text-[#005a87]" : "text-[#005a87]/20"
                            )}>
                                {match.team1}
                            </span>
                            <div className="flex items-center gap-6">
                                <span className="font-stat font-bold text-3xl text-[#005a87]/30 uppercase tracking-[0.2em]">POINTS</span>
                                <span className={clsx("font-stat font-black text-5xl", isWin1 ? "text-[#005a87]" : "text-[#005a87]/20")}>
                                    {match.team1Points}
                                </span>
                            </div>
                            {isWin1 && (
                                <div className="absolute -left-12 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#ffc72c] shadow-[0_0_20px_rgba(255,199,44,0.8)]" />
                            )}
                        </div>
                        <div className="relative">
                            <span className={clsx(
                                "font-stat font-black text-[320px] leading-none",
                                isWin1 ? "text-[#005a87]" : "text-[#005a87]/10"
                            )}>
                                {match.team1Wins}
                            </span>
                        </div>
                    </div>

                    <div className="h-1 bg-[#f2f4f6] w-full relative" />

                    {/* Team 2 */}
                    <div className="flex justify-between items-center relative">
                        <div className="flex flex-col gap-6 max-w-[65%] relative">
                            <span className={clsx(
                                "font-display font-black uppercase text-8xl tracking-tighter leading-[0.9]",
                                isWin2 ? "text-[#005a87]" : "text-[#005a87]/20"
                            )}>
                                {match.team2}
                            </span>
                            <div className="flex items-center gap-6">
                                <span className="font-stat font-bold text-3xl text-[#005a87]/30 uppercase tracking-[0.2em]">POINTS</span>
                                <span className={clsx("font-stat font-black text-5xl", isWin2 ? "text-[#005a87]" : "text-[#005a87]/20")}>
                                    {match.team2Points}
                                </span>
                            </div>
                            {isWin2 && (
                                <div className="absolute -left-12 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#ffc72c] shadow-[0_0_20px_rgba(255,199,44,0.8)]" />
                            )}
                        </div>
                        <div className="relative">
                            <span className={clsx(
                                "font-stat font-black text-[320px] leading-none",
                                isWin2 ? "text-[#005a87]" : "text-[#005a87]/10"
                            )}>
                                {match.team2Wins}
                            </span>
                        </div>
                    </div>

                    <div className="pt-16 border-t-[10px] border-[#005a87] text-center font-stat font-black text-6xl uppercase tracking-[0.4em] text-[#005a87]">
                        {formatDateNoTz(match.date)}
                    </div>
                </div>

                {/* Winner Badge Story */}
                <div className="bg-[#ffc72c] text-[#005a87] p-20 w-full relative overflow-hidden text-center space-y-8">
                    <Trophy className="w-24 h-24 mx-auto" strokeWidth={3} />
                    <h3 className="font-display font-black text-6xl uppercase tracking-[0.3em]">
                        {isTie ? 'TIE' : 'WINNER'}
                    </h3>
                    <span className="font-display font-black text-[100px] uppercase tracking-widest leading-[0.85] block">
                        {isTie ? 'NO WINNER' : (isWin1 ? match.team1 : match.team2)}
                    </span>
                </div>

                {/* Footer Story */}
                <div className="mt-auto pb-24 text-center">
                     <p className="font-display font-black uppercase tracking-[0.6em] text-5xl text-[#005a87] opacity-20">
                        PICKLEBALL.KY
                     </p>
                </div>
            </div>
        )}
    </div>
  );
};
