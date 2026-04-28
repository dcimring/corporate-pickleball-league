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

  // Determine font size based on the longest name between both teams to keep them balanced
  const maxTeamNameLength = Math.max(match.team1.length, match.team2.length);
  const storyTeamFontSize = maxTeamNameLength > 15 ? "text-[80px]" : "text-[110px]";

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
        "relative overflow-hidden flex flex-col font-body selection:none",
        isPost ? "p-12" : "pb-0"
      )}
      style={{ 
        width: isPost ? '1200px' : '1080px',
        height: isPost ? '630px' : '1920px',
        minWidth: isPost ? '1200px' : '1080px',
        maxWidth: isPost ? '1200px' : '1080px',
        minHeight: isPost ? '630px' : '1920px',
        maxHeight: isPost ? '1920px' : '1920px',
        background: 'linear-gradient(135deg, #ffffff 0%, #f0f4f8 100%)'
      }}
    >
        {/* Grain Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.08] z-50 pointer-events-none mix-blend-multiply" 
            style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/stardust.png")` }} 
        />

        {/* Background Decorative Accent */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-[#16559a]/5 rounded-full blur-3xl z-0" />

        {isPost ? (
            /* Post Layout (Landscape) - FIXED OVERFLOW */
            <div className="relative z-10 flex flex-col h-full w-full">
                {/* Branding Anchor Top Left */}
                <div className="absolute top-0 left-0">
                    <h1 className="font-display uppercase tracking-tighter leading-none flex flex-col">
                        <span className="font-black text-[#16559a] text-[64px]">PICKLEBALL</span>
                        <span className="font-thin text-[#16559a]/50 text-[48px] -mt-2">LEAGUE</span>
                    </h1>
                </div>

                {/* Match Result Label Top Right */}
                <div className="absolute top-1 right-0 flex flex-col items-end gap-2">
                    <div className="w-16 h-1 bg-[#ffc72c]" />
                    <p className="font-stat font-black tracking-[0.4em] text-[#16559a] opacity-50 uppercase text-[10px]">
                        MATCH RESULT
                    </p>
                </div>

                {/* Main Duel Stage - REFACTORED WITH CARD BG */}
                <div className="flex-1 flex flex-col justify-center relative mt-24">
                    <div className="w-full bg-white/80 backdrop-blur-md p-10 shadow-2xl border border-white/50 flex items-center justify-between">
                        {/* Team 1 Duel Block */}
                        <div className="flex flex-col items-start gap-4 relative z-10 w-[380px] flex-shrink-0">
                            {isWin1 && !isTie && (
                                <div className="px-6 py-2 bg-[#ffc72c] text-[#16559a] shadow-lg transform -rotate-1 mb-2">
                                    <div className="flex items-center gap-2">
                                        <Trophy className="w-6 h-6" strokeWidth={3} />
                                        <span className="font-stat font-black text-xl uppercase tracking-[0.2em]">WINNER</span>
                                    </div>
                                </div>
                            )}
                            <h2 className={clsx(
                                "font-display font-black uppercase text-6xl tracking-tighter leading-[0.85] break-words w-full",
                                isWin1 ? "text-[#16559a]" : "text-[#16559a]/20"
                            )}>
                                {match.team1}
                            </h2>
                            <div className="flex items-center gap-3">
                                <span className="font-stat font-bold text-lg text-[#16559a]/40 uppercase tracking-widest">PTS</span>
                                <span className={clsx("font-stat font-black text-4xl", isWin1 ? "text-[#16559a]" : "text-[#16559a]/20")}>
                                    {match.team1Points}
                                </span>
                            </div>
                        </div>

                        {/* Central Scores */}
                        <div className="flex items-center justify-center relative z-10 mx-4">
                            <span className={clsx(
                                "font-stat font-black text-[180px] leading-none tracking-tighter drop-shadow-xl",
                                isWin1 ? "text-[#16559a]" : "text-[#16559a]/10"
                            )}>
                                {match.team1Wins}
                            </span>
                            <div className="flex flex-col gap-3 mx-6 opacity-20">
                                 {[...Array(3)].map((_, i) => <div key={i} className="w-2 h-2 rounded-full bg-[#16559a]" />)}
                            </div>
                            <span className={clsx(
                                "font-stat font-black text-[180px] leading-none tracking-tighter drop-shadow-xl",
                                isWin2 ? "text-[#16559a]" : "text-[#16559a]/10"
                            )}>
                                {match.team2Wins}
                            </span>
                        </div>

                        {/* Team 2 Duel Block */}
                        <div className="flex flex-col items-end gap-4 relative z-10 w-[380px] text-right flex-shrink-0">
                            {isWin2 && !isTie && (
                                <div className="px-6 py-2 bg-[#ffc72c] text-[#16559a] shadow-lg transform rotate-1 mb-2">
                                    <div className="flex items-center gap-2">
                                        <Trophy className="w-6 h-6" strokeWidth={3} />
                                        <span className="font-stat font-black text-xl uppercase tracking-[0.2em]">WINNER</span>
                                    </div>
                                </div>
                            )}
                            <h2 className={clsx(
                                "font-display font-black uppercase text-6xl tracking-tighter leading-[0.85] break-words w-full",
                                isWin2 ? "text-[#16559a]" : "text-[#16559a]/20"
                            )}>
                                {match.team2}
                            </h2>
                            <div className="flex items-center gap-3">
                                <span className={clsx("font-stat font-black text-4xl", isWin2 ? "text-[#16559a]" : "text-[#16559a]/20")}>
                                    {match.team2Points}
                                </span>
                                <span className="font-stat font-bold text-lg text-[#16559a]/40 uppercase tracking-widest">PTS</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Section */}
                <div className="flex justify-between items-end border-t-2 border-[#16559a]/5 pt-8 mt-auto">
                    <div className="font-stat font-black text-2xl tracking-[0.4em] text-[#16559a]/60">
                        {formatDateNoTz(match.date)}
                    </div>
                    <div className="flex items-center gap-6">
                         <div className="h-8 w-[1px] bg-[#16559a]/20" />
                         <p className="font-stat font-black uppercase tracking-[0.6em] text-2xl text-[#16559a] opacity-30">
                            PICKLEBALL.KY
                         </p>
                    </div>
                </div>
            </div>
        ) : (
            /* Story Layout (Portrait) */
            <div className="flex flex-col justify-start items-center relative z-10 px-12 pt-28 pb-16 flex-1">
                {/* Masthead */}
                <div className="text-center space-y-4 mb-16">
                    <h1 className="font-display uppercase tracking-tighter leading-[0.8] flex flex-col items-center">
                        <span className="font-black text-[#16559a] text-[150px]">PICKLEBALL</span>
                        <span className="font-thin text-[#16559a]/40 text-[100px] -mt-2">LEAGUE</span>
                    </h1>
                    
                    <div className="flex flex-col items-center gap-6 pt-4">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-[2px] bg-[#16559a]/20" />
                            <p className="font-stat font-black tracking-[0.5em] text-[#16559a] opacity-60 uppercase text-3xl">
                                MATCH RESULT
                            </p>
                            <div className="w-16 h-[2px] bg-[#16559a]/20" />
                        </div>
                    </div>
                </div>

                {/* Scoreboard Card */}
                <div className="w-full bg-white/90 backdrop-blur-xl p-16 flex flex-col gap-12 relative overflow-hidden shadow-2xl border border-white">
                    <div className="absolute top-0 left-0 right-0 h-2 bg-linear-to-r from-[#16559a] via-[#ffc72c] to-[#16559a]" />

                    {/* Team 1 */}
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col gap-2">
                            <span className={clsx(
                                "font-display font-black uppercase tracking-tighter leading-none max-w-[500px]",
                                storyTeamFontSize
                            )}>
                                <span className={isWin1 ? "text-[#16559a]" : "text-[#16559a]/20"}>
                                    {match.team1}
                                </span>
                            </span>
                            <div className="flex items-center gap-4">
                                <span className="font-stat font-bold text-2xl text-[#16559a]/30 uppercase tracking-widest">PTS</span>
                                <span className={clsx("font-stat font-black text-5xl", isWin1 ? "text-[#16559a]" : "text-[#16559a]/20")}>
                                    {match.team1Points}
                                </span>
                            </div>
                        </div>
                        <span className={clsx(
                            "font-stat font-black text-[280px] leading-none tracking-tighter drop-shadow-xl",
                            isWin1 ? "text-[#16559a]" : "text-[#16559a]/5"
                        )}>
                            {match.team1Wins}
                        </span>
                    </div>

                    <div className="flex items-center justify-center relative my-4">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t-2 border-[#16559a]/5"></div></div>
                        <span className="relative z-10 bg-white/0 px-12 font-display font-black italic text-[#16559a] opacity-20 text-6xl tracking-[0.2em] uppercase">VS</span>
                    </div>

                    {/* Team 2 */}
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col gap-2">
                            <span className={clsx(
                                "font-display font-black uppercase tracking-tighter leading-none max-w-[500px]",
                                storyTeamFontSize
                            )}>
                                <span className={isWin2 ? "text-[#16559a]" : "text-[#16559a]/20"}>
                                    {match.team2}
                                </span>
                            </span>
                            <div className="flex items-center gap-4">
                                <span className="font-stat font-bold text-2xl text-[#16559a]/30 uppercase tracking-widest">PTS</span>
                                <span className={clsx("font-stat font-black text-5xl", isWin2 ? "text-[#16559a]" : "text-[#16559a]/20")}>
                                    {match.team2Points}
                                </span>
                            </div>
                        </div>
                        <span className={clsx(
                            "font-stat font-black text-[280px] leading-none tracking-tighter drop-shadow-xl",
                            isWin2 ? "text-[#16559a]" : "text-[#16559a]/5"
                        )}>
                            {match.team2Wins}
                        </span>
                    </div>

                    <div className="pt-12 mt-4 border-t-2 border-[#16559a]/10 text-center font-stat font-black text-4xl uppercase tracking-[0.6em] text-[#16559a]/40">
                        {formatDateNoTz(match.date)}
                    </div>
                </div>

                {/* Winner Block Story */}
                <div className="mt-16 bg-[#ffc72c] text-[#16559a] p-12 w-full text-center space-y-4 relative overflow-hidden shadow-2xl transform -rotate-1 border-4 border-white/40">
                    <div className="flex items-center justify-center gap-6">
                        <Trophy className="w-12 h-12" strokeWidth={3} />
                        <h3 className="font-stat font-black text-4xl uppercase tracking-[0.3em]">
                            {isTie ? 'TIE' : 'WINNER'}
                        </h3>
                    </div>
                    <span className="font-display font-black text-[96px] uppercase tracking-tighter leading-none block truncate">
                        {isTie ? 'NO WINNER' : (isWin1 ? match.team1 : match.team2)}
                    </span>
                </div>

                {/* Footer Story */}
                <div className="mt-auto pt-20 flex flex-col items-center gap-6">
                     <p className="font-stat font-black uppercase tracking-[1em] text-4xl text-[#16559a] opacity-30">
                        PICKLEBALL.KY
                     </p>
                     <div className="w-80 h-[2px] bg-linear-to-r from-transparent via-[#16559a]/20 to-transparent" />
                </div>
            </div>
        )}
    </div>
  );
};
