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

  // Constants to match main design system
  const NAVY = "#005596";
  const YELLOW = "#ffc93c";

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
        "relative overflow-hidden flex flex-col font-display selection:none",
        isPost ? "p-0" : "pb-0"
      )}
      style={{ 
        width: isPost ? '1200px' : '1080px',
        height: isPost ? '630px' : '1920px',
        minWidth: isPost ? '1200px' : '1080px',
        maxWidth: isPost ? '1200px' : '1080px',
        minHeight: isPost ? '630px' : '1920px',
        maxHeight: isPost ? '630px' : '1920px',
        background: `linear-gradient(180deg, #ffffff 0%, #eef2f7 15%, #e8edf3 85%, #ffffff 100%)`
      }}
    >
        {/* Grain Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.1] z-50 pointer-events-none mix-blend-multiply" 
            style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/stardust.png")` }} 
        />

        {/* Broadcast Ticker Bar */}
        <div className="w-full bg-[#005596] h-10 flex items-center justify-between px-10 relative z-[60]">
            <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-[#ffc93c] animate-pulse" />
                <span className="mono text-[12px] text-[#ffc93c] font-bold tracking-[0.3em] uppercase">Status: Official Result</span>
            </div>
            <span className="mono text-[12px] text-white/40 font-bold tracking-[0.3em] uppercase">Official.League.Platform</span>
        </div>

        {isPost ? (
            /* Post Layout (Landscape) */
            <div className="relative z-10 flex flex-col h-full w-full p-12">
                {/* Branding Anchor Top Left */}
                <div className="flex justify-between items-start mb-12">
                    <div className="flex flex-col items-start gap-1">
                         <span className="mono text-[14px] text-[#005596] opacity-40 font-bold tracking-[0.4em] uppercase">Tournament Match</span>
                         <h1 className="font-display font-black text-[#005596] text-[90px] leading-[0.85] tracking-tighter uppercase">
                            RESULT
                         </h1>
                    </div>

                    {/* Match Info Label Top Right */}
                    <div className="flex flex-col items-end gap-3">
                        <div className="bg-[#ffc93c] text-[#005596] px-8 py-3 font-display font-black uppercase tracking-wider text-2xl shadow-lg border-2 border-[#005596]">
                            {formatDateNoTz(match.date)}
                        </div>
                        <p className="mono font-bold uppercase tracking-[0.4em] text-lg text-[#005596] opacity-30">
                            PICKLEBALL.KY
                        </p>
                    </div>
                </div>

                {/* Main Duel Stage */}
                <div className="flex-1 flex flex-col justify-center">
                    <div className="w-full bg-white py-12 px-10 shadow-[0_32px_80px_-32px_rgba(20,58,120,0.3)] border border-[#005596]/10 flex items-center justify-between relative">
                        {/* Team 1 Duel Block */}
                        <div className="flex flex-col items-start gap-5 relative z-10 w-[340px] flex-shrink-0">
                            {isWin1 && (
                                <div className="px-6 py-2 bg-[#ffc93c] text-[#005596] shadow-lg border-2 border-[#005596] transform -rotate-1 mb-2">
                                    <div className="flex items-center gap-2">
                                        <Trophy size={22} strokeWidth={3} />
                                        <span className="mono font-bold text-xl uppercase tracking-[0.2em]">WINNER</span>
                                    </div>
                                </div>
                            )}
                            <h2 className={clsx(
                                "font-display font-black uppercase tracking-tighter leading-[0.85] break-words w-full",
                                isWin1 ? "text-[#005596]" : "text-[#005596]/30",
                                match.team1.length > 15 ? "text-[48px]" : "text-[60px]"
                            )}>
                                {match.team1}
                            </h2>
                            <div className="flex items-center gap-3">
                                <span className="mono font-bold text-lg text-[#005596]/40 uppercase tracking-widest">PTS</span>
                                <span className={clsx("mono font-bold text-4xl", isWin1 ? "text-[#005596]" : "text-[#005596]/20")}>
                                    {match.team1Points}
                                </span>
                            </div>
                        </div>

                        {/* Central Scores */}
                        <div className="flex items-center justify-center relative z-10 mx-2">
                            <span className={clsx(
                                "font-display font-black text-[180px] leading-none tracking-tighter drop-shadow-sm",
                                isWin1 ? "text-[#005596]" : "text-[#005596]/10"
                            )}>
                                {match.team1Wins}
                            </span>
                            <div className="flex flex-col gap-4 mx-6 opacity-20">
                                 {[...Array(3)].map((_, i) => <div key={i} className="w-3 h-3 bg-[#005596]" />)}
                            </div>
                            <span className={clsx(
                                "font-display font-black text-[180px] leading-none tracking-tighter drop-shadow-sm",
                                isWin2 ? "text-[#005596]" : "text-[#005596]/10"
                            )}>
                                {match.team2Wins}
                            </span>
                        </div>

                        {/* Team 2 Duel Block */}
                        <div className="flex flex-col items-end gap-5 relative z-10 w-[340px] text-right flex-shrink-0">
                            {isWin2 && (
                                <div className="px-6 py-2 bg-[#ffc93c] text-[#005596] shadow-lg border-2 border-[#005596] transform rotate-1 mb-2">
                                    <div className="flex items-center gap-2">
                                        <Trophy size={22} strokeWidth={3} />
                                        <span className="mono font-bold text-xl uppercase tracking-[0.2em]">WINNER</span>
                                    </div>
                                </div>
                            )}
                            <h2 className={clsx(
                                "font-display font-black uppercase tracking-tighter leading-[0.85] break-words w-full",
                                isWin2 ? "text-[#005596]" : "text-[#005596]/30",
                                match.team2.length > 15 ? "text-[48px]" : "text-[60px]"
                            )}>
                                {match.team2}
                            </h2>
                            <div className="flex items-center gap-3">
                                <span className={clsx("mono font-bold text-4xl", isWin2 ? "text-[#005596]" : "text-[#005596]/20")}>
                                    {match.team2Points}
                                </span>
                                <span className="mono font-bold text-lg text-[#005596]/40 uppercase tracking-widest">PTS</span>
                            </div>
                        </div>

                        {/* Top/Bottom accents for the box */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-[#005596]" />
                    </div>
                </div>
            </div>
        ) : (
            /* Story Layout (Portrait) */
            <div className="flex flex-col justify-start items-center relative z-10 px-12 pt-20 pb-12 flex-1">
                {/* Masthead */}
                <div className="text-center space-y-4 mb-12 w-full">
                    <div className="flex flex-col items-center gap-4">
                        <span className="mono text-[24px] text-[#005596] opacity-30 font-bold tracking-[0.6em] uppercase">League Official</span>
                        <h1 className="font-display uppercase tracking-tighter leading-[0.8] flex flex-col items-center">
                            <span className="font-black text-[#005596] text-[155px]">MATCH</span>
                            <span className="font-black text-[#005596]/40 text-[125px] -mt-6">RESULT</span>
                            <div className="w-48 h-3 bg-[#ffc93c] mt-10 rounded-sm shadow-[0_8px_32px_rgba(255,201,60,0.5)]" />
                        </h1>
                    </div>
                </div>

                {/* Scoreboard Card */}
                <div className="w-full bg-white p-16 flex flex-col gap-10 relative overflow-hidden shadow-[0_40px_100px_-40px_rgba(20,58,120,0.4)] border border-[#005596]/15">
                    <div className="absolute top-0 left-0 right-0 h-3 bg-[#005596]" />

                    {/* Team 1 */}
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col gap-3 min-w-0 flex-1 pr-6">
                            <span className={clsx(
                                "font-display font-black uppercase tracking-tighter leading-[0.85]",
                                isWin1 ? "text-[#005596]" : "text-[#005596]/30",
                                match.team1.length > 15 ? "text-[52px]" : "text-[64px]"
                            )}>
                                {match.team1}
                            </span>
                            <div className="flex items-center gap-4">
                                <span className="mono font-bold text-2xl text-[#005596]/40 uppercase tracking-widest">PTS</span>
                                <span className={clsx("mono font-bold text-5xl", isWin1 ? "text-[#005596]" : "text-[#005596]/20")}>
                                    {match.team1Points}
                                </span>
                            </div>
                        </div>
                        <span className={clsx(
                            "font-display font-black text-[260px] leading-none tracking-tighter drop-shadow-lg",
                            isWin1 ? "text-[#005596]" : "text-[#005596]/5"
                        )}>
                            {match.team1Wins}
                        </span>
                    </div>

                    <div className="flex items-center justify-center relative my-2">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t-4 border-[#005596]/10"></div></div>
                        <span className="relative z-10 bg-white px-10 font-display font-black italic text-[#005596] opacity-10 text-6xl tracking-[0.5em] uppercase">VS</span>
                    </div>

                    {/* Team 2 */}
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col gap-3 min-w-0 flex-1 pr-6">
                            <span className={clsx(
                                "font-display font-black uppercase tracking-tighter leading-[0.85]",
                                isWin2 ? "text-[#005596]" : "text-[#005596]/30",
                                match.team2.length > 15 ? "text-[52px]" : "text-[64px]"
                            )}>
                                {match.team2}
                            </span>
                            <div className="flex items-center gap-4">
                                <span className="mono font-bold text-2xl text-[#005596]/40 uppercase tracking-widest">PTS</span>
                                <span className={clsx("mono font-bold text-5xl", isWin2 ? "text-[#005596]" : "text-[#005596]/20")}>
                                    {match.team2Points}
                                </span>
                            </div>
                        </div>
                        <span className={clsx(
                            "font-display font-black text-[260px] leading-none tracking-tighter drop-shadow-lg",
                            isWin2 ? "text-[#005596]" : "text-[#005596]/5"
                        )}>
                            {match.team2Wins}
                        </span>
                    </div>

                    <div className="pt-10 mt-2 border-t-4 border-[#005596]/10 text-center mono font-bold text-4xl uppercase tracking-[0.6em] text-[#005596]/30">
                        {formatDateNoTz(match.date)}
                    </div>
                </div>

                {/* Winner Block Story */}
                {!isTie && (
                    <div className="mt-12 bg-[#ffc93c] text-[#005596] p-10 w-full text-center space-y-4 relative overflow-hidden shadow-2xl transform -rotate-1 border-b-8 border-[#005596]/20">
                        <div className="flex items-center justify-center gap-6">
                            <Trophy size={48} strokeWidth={3} />
                            <h3 className="mono font-bold text-4xl uppercase tracking-[0.3em]">WINNER</h3>
                        </div>
                        <span className="font-display font-black text-[84px] uppercase tracking-tighter leading-[0.85] block">
                            {isWin1 ? match.team1 : match.team2}
                        </span>
                    </div>
                )}

                {/* Footer Story */}
                <div className="mt-auto pt-16 flex flex-col items-center gap-6">
                     <div className="w-32 h-1 bg-[#ffc93c] opacity-50 mb-4" />
                     <p className="mono font-bold uppercase tracking-[1.2em] text-4xl text-[#005596] opacity-30">
                        PICKLEBALL.KY
                     </p>
                </div>
            </div>
        )}
    </div>
  );
};