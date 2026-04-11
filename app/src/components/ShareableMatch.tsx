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
        "relative overflow-hidden flex flex-col font-body selection:none",
        isPost ? "p-12" : "pb-0"
      )}
      style={{ 
        width: isPost ? '1200px' : '1080px',
        height: isPost ? '630px' : '1920px',
        minWidth: isPost ? '1200px' : '1080px',
        maxWidth: isPost ? '1200px' : '1080px',
        minHeight: isPost ? '630px' : '1920px',
        maxHeight: isPost ? '630px' : '1920px',
        background: 'linear-gradient(to bottom, #ffffff 0%, #f7f9fb 15%, #f7f9fb 85%, #ffffff 100%)'
      }}
    >
        {/* Magazine Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.05] z-0 pointer-events-none" 
            style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/stardust.png")` }} 
        />

        {isPost ? (
            /* Post Layout (Landscape) - REFACTORED TO MATCH STORY STYLE */
            <div className="relative z-10 flex h-full gap-12 items-center">
                {/* Left Column: Masthead */}
                <div className="flex flex-col justify-center items-start space-y-6 w-[450px] flex-shrink-0">
                    <h1 className="font-display font-black text-[#005a87] text-[64px] uppercase tracking-tighter leading-[0.85] flex flex-col">
                        <span>LA ROCHE POSAY</span>
                        <span>PICKLEBALL LEAGUE</span>
                    </h1>
                    
                    <div className="flex flex-col items-start gap-4 pt-2">
                        <div className="w-32 h-1.5 bg-[#ffc72c]" />
                        <p className="font-stat font-black tracking-[0.4em] text-[#005a87] opacity-60 uppercase text-lg">
                            MATCH RESULT
                        </p>
                    </div>
                </div>

                {/* Middle Column: Scoreboard */}
                <div className="flex-1 flex flex-col gap-8">
                    <div className="bg-white p-8 flex flex-col gap-8 relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-2 bg-[#005a87]/10" />
                        
                        {/* Team 1 */}
                        <div className="flex justify-between items-center relative">
                            <div className="flex flex-col gap-1">
                                <span className={clsx(
                                    "font-display font-black uppercase text-4xl tracking-tighter leading-tight",
                                    isWin1 ? "text-[#005a87]" : "text-[#005a87]/20"
                                )}>
                                    {match.team1}
                                </span>
                                <div className="flex items-center gap-2">
                                    <span className="font-stat font-bold text-sm text-[#005a87]/30 uppercase tracking-widest">PTS</span>
                                    <span className={clsx("font-stat font-black text-xl", isWin1 ? "text-[#005a87]" : "text-[#005a87]/20")}>
                                        {match.team1Points}
                                    </span>
                                </div>
                            </div>
                            <span className={clsx(
                                "font-stat font-black text-[100px] leading-none",
                                isWin1 ? "text-[#005a87]" : "text-[#005a87]/10"
                            )}>
                                {match.team1Wins}
                            </span>
                        </div>

                        <div className="flex items-center justify-center relative">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#005a87]/5"></div></div>
                            <span className="relative z-10 bg-white px-4 font-display font-black italic text-[#005a87] opacity-10 text-xl tracking-widest uppercase">VS</span>
                        </div>

                        {/* Team 2 */}
                        <div className="flex justify-between items-center relative">
                            <div className="flex flex-col gap-1">
                                <span className={clsx(
                                    "font-display font-black uppercase text-4xl tracking-tighter leading-tight",
                                    isWin2 ? "text-[#005a87]" : "text-[#005a87]/20"
                                )}>
                                    {match.team2}
                                </span>
                                <div className="flex items-center gap-2">
                                    <span className="font-stat font-bold text-sm text-[#005a87]/30 uppercase tracking-widest">PTS</span>
                                    <span className={clsx("font-stat font-black text-xl", isWin2 ? "text-[#005a87]" : "text-[#005a87]/20")}>
                                        {match.team2Points}
                                    </span>
                                </div>
                            </div>
                            <span className={clsx(
                                "font-stat font-black text-[100px] leading-none",
                                isWin2 ? "text-[#005a87]" : "text-[#005a87]/10"
                            )}>
                                {match.team2Wins}
                            </span>
                        </div>
                    </div>

                    <div className="text-center font-stat font-black text-2xl uppercase tracking-[0.4em] text-[#005a87]">
                        {formatDateNoTz(match.date)}
                    </div>
                </div>

                {/* Right Column: Winner & Footer */}
                <div className="w-[300px] flex flex-col gap-8 flex-shrink-0">
                    <div className="bg-[#ffc72c] text-[#005a87] p-8 w-full text-center space-y-4 shadow-sm relative overflow-hidden">
                        <div className="flex items-center justify-center gap-2">
                            <Trophy className="w-6 h-6" strokeWidth={3} />
                            <h3 className="font-stat font-black text-xl uppercase tracking-[0.2em]">
                                {isTie ? 'TIE' : 'WINNER'}
                            </h3>
                        </div>
                        <span className="font-display font-black text-4xl uppercase tracking-tighter leading-tight block">
                            {isTie ? 'NO WINNER' : (isWin1 ? match.team1 : match.team2)}
                        </span>
                    </div>

                    <div className="mt-auto pb-4 text-center">
                         <p className="font-stat font-black uppercase tracking-[0.4em] text-2xl text-[#005a87] opacity-40">
                            PICKLEBALL.KY
                         </p>
                    </div>
                </div>
            </div>
        ) : (
            /* Story Layout (Portrait) - MAINTAIN AS IS */
            <div className="flex flex-col justify-start items-center relative z-10 px-12 pt-24 pb-20 flex-1">
                {/* Reference-style Masthead */}
                <div className="text-center space-y-4 mb-16">
                    <h1 className="font-display font-black text-[#005a87] text-[110px] uppercase tracking-tighter leading-[0.8] flex flex-col">
                        <span>LA ROCHE</span>
                        <span>POSAY</span>
                        <span>PICKLEBALL</span>
                        <span>LEAGUE</span>
                    </h1>
                    
                    <div className="flex flex-col items-center gap-6 pt-4">
                        <div className="w-48 h-2 bg-[#ffc72c]" />
                        <p className="font-stat font-black tracking-[0.5em] text-[#005a87] opacity-60 uppercase text-3xl">
                            MATCH RESULT
                        </p>
                    </div>
                </div>

                {/* Scoreboard Card (Square Editorial Style) */}
                <div className="w-full bg-white p-12 flex flex-col gap-16 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-4 bg-[#005a87]/10" />

                    {/* Team 1 */}
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col gap-2">
                            <span className={clsx(
                                "font-display font-black uppercase text-6xl tracking-tighter leading-tight",
                                isWin1 ? "text-[#005a87]" : "text-[#005a87]/20"
                            )}>
                                {match.team1}
                            </span>
                            <div className="flex items-center gap-3">
                                <span className="font-stat font-bold text-2xl text-[#005a87]/30 uppercase tracking-widest">PTS</span>
                                <span className={clsx("font-stat font-black text-4xl", isWin1 ? "text-[#005a87]" : "text-[#005a87]/20")}>
                                    {match.team1Points}
                                </span>
                            </div>
                        </div>
                        <span className={clsx(
                            "font-stat font-black text-[180px] leading-none",
                            isWin1 ? "text-[#005a87]" : "text-[#005a87]/10"
                        )}>
                            {match.team1Wins}
                        </span>
                    </div>

                    <div className="flex items-center justify-center relative">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#005a87]/5"></div></div>
                        <span className="relative z-10 bg-white px-6 font-display font-black italic text-[#005a87] opacity-10 text-4xl tracking-widest uppercase">VS</span>
                    </div>

                    {/* Team 2 */}
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col gap-2">
                            <span className={clsx(
                                "font-display font-black uppercase text-6xl tracking-tighter leading-tight",
                                isWin2 ? "text-[#005a87]" : "text-[#005a87]/20"
                            )}>
                                {match.team2}
                            </span>
                            <div className="flex items-center gap-3">
                                <span className="font-stat font-bold text-2xl text-[#005a87]/30 uppercase tracking-widest">PTS</span>
                                <span className={clsx("font-stat font-black text-4xl", isWin2 ? "text-[#005a87]" : "text-[#005a87]/20")}>
                                    {match.team2Points}
                                </span>
                            </div>
                        </div>
                        <span className={clsx(
                            "font-stat font-black text-[180px] leading-none",
                            isWin2 ? "text-[#005a87]" : "text-[#005a87]/10"
                        )}>
                            {match.team2Wins}
                        </span>
                    </div>

                    {/* Date Centered at bottom of scoreboard */}
                    <div className="pt-12 mt-4 border-t border-[#005a87]/10 text-center font-stat font-black text-4xl uppercase tracking-[0.4em] text-[#005a87]">
                        {formatDateNoTz(match.date)}
                    </div>
                </div>

                {/* Winner Block Story (High Impact) */}
                <div className="mt-16 bg-[#ffc72c] text-[#005a87] p-12 w-full text-center space-y-6 relative overflow-hidden">
                    <div className="flex items-center justify-center gap-4">
                        <Trophy className="w-10 h-10" strokeWidth={3} />
                        <h3 className="font-stat font-black text-3xl uppercase tracking-[0.3em]">
                            {isTie ? 'TIE' : 'WINNER'}
                        </h3>
                    </div>
                    <span className="font-display font-black text-[80px] uppercase tracking-tighter leading-[0.85] block">
                        {isTie ? 'NO WINNER' : (isWin1 ? match.team1 : match.team2)}
                    </span>
                </div>

                {/* Footer Story */}
                <div className="mt-auto pt-20">
                     <p className="font-stat font-black uppercase tracking-[0.6em] text-4xl text-[#005a87] opacity-40">
                        PICKLEBALL.KY
                     </p>
                </div>
            </div>
        )}
    </div>
  );
};
