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
        maxWidth: isPost ? '1080px' : '1080px',
        minHeight: isPost ? '630px' : '1920px',
        maxHeight: isPost ? '630px' : '1920px',
        background: 'linear-gradient(180deg, #eef2f7 0%, #e8edf3 100%)'
      }}
    >
        {/* Grain Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.15] z-50 pointer-events-none mix-blend-multiply" 
            style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/stardust.png")` }} 
        />

        {/* Background Decorative Accent */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-[#143a78]/5 rounded-full blur-3xl z-0" />

        {isPost ? (
            /* Post Layout (Landscape) */
            <div className="relative z-10 flex flex-col h-full w-full">
                {/* Branding Anchor Top Left */}
                <div className="absolute top-0 left-0">
                    <h1 className="font-display uppercase tracking-tighter leading-none flex flex-col">
                        <span className="font-black text-[#143a78] text-[84px]">MATCH RESULT</span>
                        <div className="w-20 h-2 bg-[#ffc93c] mt-4 rounded-sm" />
                    </h1>
                </div>

                {/* Match Info Label Top Right */}
                <div className="absolute top-1 right-0 flex flex-col items-end gap-2 text-right">
                    <p className="font-mono font-bold tracking-[0.4em] text-[#143a78] opacity-50 uppercase text-[12px]">
                        {formatDateNoTz(match.date)}
                    </p>
                    <p className="font-mono font-bold tracking-[0.4em] text-[#143a78] opacity-30 uppercase text-[10px]">
                        PICKLEBALL.KY
                    </p>
                </div>

                {/* Main Duel Stage */}
                <div className="flex-1 flex flex-col justify-center relative mt-24">
                    <div className="w-full bg-white py-10 px-14 shadow-2xl border border-[#143a78]/5 rounded-xl flex items-center justify-between">
                        {/* Team 1 Duel Block */}
                        <div className="flex flex-col items-start gap-4 relative z-10 w-[380px] flex-shrink-0">
                            {isWin1 && !isTie && (
                                <div className="px-6 py-2 bg-[#ffc93c] text-[#143a78] shadow-lg rounded-sm transform -rotate-1 mb-2">
                                    <div className="flex items-center gap-2">
                                        <Trophy size={20} strokeWidth={3} />
                                        <span className="font-mono font-bold text-xl uppercase tracking-[0.2em]">WINNER</span>
                                    </div>
                                </div>
                            )}
                            <h2 className={clsx(
                                "font-display font-black uppercase tracking-tighter leading-[0.85] break-words w-full",
                                isWin1 ? "text-[#143a78]" : "text-[#143a78]/30",
                                match.team1.length > 15 ? "text-5xl" : "text-6xl"
                            )}>
                                {match.team1}
                            </h2>
                            <div className="flex items-center gap-3">
                                <span className="font-mono font-bold text-lg text-[#143a78]/40 uppercase tracking-widest">PTS</span>
                                <span className={clsx("font-mono font-bold text-4xl", isWin1 ? "text-[#143a78]" : "text-[#143a78]/20")}>
                                    {match.team1Points}
                                </span>
                            </div>
                        </div>

                        {/* Central Scores */}
                        <div className="flex items-center justify-center relative z-10 mx-2">
                            <span className={clsx(
                                "font-display font-black text-[180px] leading-none tracking-tighter",
                                isWin1 ? "text-[#143a78]" : "text-[#143a78]/10"
                            )}>
                                {match.team1Wins}
                            </span>
                            <div className="flex flex-col gap-3 mx-6 opacity-20">
                                 {[...Array(3)].map((_, i) => <div key={i} className="w-2.5 h-2.5 rounded-sm bg-[#143a78]" />)}
                            </div>
                            <span className={clsx(
                                "font-display font-black text-[180px] leading-none tracking-tighter",
                                isWin2 ? "text-[#143a78]" : "text-[#143a78]/10"
                            )}>
                                {match.team2Wins}
                            </span>
                        </div>

                        {/* Team 2 Duel Block */}
                        <div className="flex flex-col items-end gap-4 relative z-10 w-[380px] text-right flex-shrink-0">
                            {isWin2 && !isTie && (
                                <div className="px-6 py-2 bg-[#ffc93c] text-[#143a78] shadow-lg rounded-sm transform rotate-1 mb-2">
                                    <div className="flex items-center gap-2">
                                        <Trophy size={20} strokeWidth={3} />
                                        <span className="font-mono font-bold text-xl uppercase tracking-[0.2em]">WINNER</span>
                                    </div>
                                </div>
                            )}
                            <h2 className={clsx(
                                "font-display font-black uppercase tracking-tighter leading-[0.85] break-words w-full",
                                isWin2 ? "text-[#143a78]" : "text-[#143a78]/30",
                                match.team2.length > 15 ? "text-5xl" : "text-6xl"
                            )}>
                                {match.team2}
                            </h2>
                            <div className="flex items-center gap-3">
                                <span className={clsx("font-mono font-bold text-4xl", isWin2 ? "text-[#143a78]" : "text-[#143a78]/20")}>
                                    {match.team2Points}
                                </span>
                                <span className="font-mono font-bold text-lg text-[#143a78]/40 uppercase tracking-widest">PTS</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Section */}
                <div className="mt-auto flex flex-col items-center gap-4 opacity-20">
                     <div className="w-[400px] h-[1px] bg-[#143a78]" />
                </div>
            </div>
        ) : (
            /* Story Layout (Portrait) */
            <div className="flex flex-col justify-start items-center relative z-10 px-12 pt-28 pb-16 flex-1">
                {/* Masthead */}
                <div className="text-center space-y-4 mb-16">
                    <h1 className="font-display uppercase tracking-tighter leading-[0.8] flex flex-col items-center">
                        <span className="font-black text-[#143a78] text-[150px]">MATCH</span>
                        <span className="font-black text-[#143a78]/40 text-[120px] -mt-4">RESULT</span>
                        <div className="w-32 h-3 bg-[#ffc93c] mt-10 rounded-sm shadow-[0_0_32px_rgba(255,201,60,0.5)]" />
                    </h1>
                </div>

                {/* Scoreboard Card */}
                <div className="w-full bg-white p-16 flex flex-col gap-12 relative overflow-hidden shadow-2xl border border-[#143a78]/10 rounded-2xl">
                    <div className="absolute top-0 left-0 right-0 h-2.5 bg-[#143a78]" />

                    {/* Team 1 */}
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col gap-2">
                            <span className={clsx(
                                "font-display font-black uppercase tracking-tighter leading-none max-w-[500px]",
                                storyTeamFontSize
                            )}>
                                <span className={isWin1 ? "text-[#143a78]" : "text-[#143a78]/30"}>
                                    {match.team1}
                                </span>
                            </span>
                            <div className="flex items-center gap-4">
                                <span className="font-mono font-bold text-2xl text-[#143a78]/40 uppercase tracking-widest">PTS</span>
                                <span className={clsx("font-mono font-bold text-5xl", isWin1 ? "text-[#143a78]" : "text-[#143a78]/20")}>
                                    {match.team1Points}
                                </span>
                            </div>
                        </div>
                        <span className={clsx(
                            "font-display font-black text-[280px] leading-none tracking-tighter drop-shadow-xl",
                            isWin1 ? "text-[#143a78]" : "text-[#143a78]/5"
                        )}>
                            {match.team1Wins}
                        </span>
                    </div>

                    <div className="flex items-center justify-center relative my-6">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t-2 border-[#143a78]/5"></div></div>
                        <span className="relative z-10 bg-white px-10 font-display font-black italic text-[#143a78] opacity-10 text-6xl tracking-[0.4em] uppercase">VS</span>
                    </div>

                    {/* Team 2 */}
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col gap-2">
                            <span className={clsx(
                                "font-display font-black uppercase tracking-tighter leading-none max-w-[500px]",
                                storyTeamFontSize
                            )}>
                                <span className={isWin2 ? "text-[#143a78]" : "text-[#143a78]/30"}>
                                    {match.team2}
                                </span>
                            </span>
                            <div className="flex items-center gap-4">
                                <span className="font-mono font-bold text-2xl text-[#143a78]/40 uppercase tracking-widest">PTS</span>
                                <span className={clsx("font-mono font-bold text-5xl", isWin2 ? "text-[#143a78]" : "text-[#143a78]/20")}>
                                    {match.team2Points}
                                </span>
                            </div>
                        </div>
                        <span className={clsx(
                            "font-display font-black text-[280px] leading-none tracking-tighter drop-shadow-xl",
                            isWin2 ? "text-[#143a78]" : "text-[#143a78]/5"
                        )}>
                            {match.team2Wins}
                        </span>
                    </div>

                    <div className="pt-12 mt-4 border-t-2 border-[#143a78]/5 text-center font-mono font-bold text-4xl uppercase tracking-[0.6em] text-[#143a78]/30">
                        {formatDateNoTz(match.date)}
                    </div>
                </div>

                {/* Winner Block Story */}
                <div className="mt-16 bg-[#ffc93c] text-[#143a78] p-12 w-full text-center space-y-4 relative overflow-hidden shadow-2xl transform -rotate-1 border-4 border-white rounded-sm">
                    <div className="flex items-center justify-center gap-6">
                        <Trophy size={48} strokeWidth={3} />
                        <h3 className="font-mono font-bold text-4xl uppercase tracking-[0.3em]">
                            {isTie ? 'TIE' : 'WINNER'}
                        </h3>
                    </div>
                    <span className="font-display font-black text-[96px] uppercase tracking-tighter leading-none block truncate">
                        {isTie ? 'NO WINNER' : (isWin1 ? match.team1 : match.team2)}
                    </span>
                </div>

                {/* Footer Story */}
                <div className="mt-auto pt-20 flex flex-col items-center gap-6">
                     <p className="font-mono font-bold uppercase tracking-[1em] text-4xl text-[#143a78] opacity-30">
                        PICKLEBALL.KY
                     </p>
                </div>
            </div>
        )}
    </div>
  );
};