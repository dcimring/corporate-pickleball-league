import React from 'react';
import { clsx } from 'clsx';
import { Trophy } from 'lucide-react';
import type { Match } from '../types';

interface ShareableMatchProps {
  match: Match;
  layout?: 'post' | 'story';
}

const SpeedTrails: React.FC<{ 
    className?: string;
    count?: number;
    color?: string;
    direction?: 'left' | 'right';
}> = ({ className, count = 3, color = '#476800', direction = 'left' }) => (
    <div className={clsx("absolute flex flex-col gap-2 pointer-events-none", className)}>
        {Array.from({ length: count }).map((_, i) => (
            <div 
                key={i}
                className="h-1.5 rounded-full opacity-20"
                style={{ 
                    backgroundColor: color,
                    width: `${120 - (i * 30)}px`,
                    transform: direction === 'left' ? 'translateX(-100%)' : 'translateX(100%) scaleX(-1)',
                    marginLeft: direction === 'left' ? '-16px' : '16px'
                }}
            />
        ))}
    </div>
);

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
    return fallback.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div 
      className={clsx(
        "bg-[#f7f9fb] relative overflow-hidden flex flex-col font-body selection:none",
        isPost ? "p-16" : "pt-8 pb-0"
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
        {/* Background Decorative Glow */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />

        {isPost ? (
            /* Post Layout */
            <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-12">
                    <h1 className="font-display font-extrabold italic text-secondary text-6xl uppercase tracking-tighter leading-none">
                        Corporate<br/>Pickleball League
                    </h1>
                    <div className="text-right">
                        <span className="font-display font-bold text-secondary/30 text-2xl tracking-[0.4em] uppercase">Result</span>
                    </div>
                </div>

                <div className="flex-1 flex gap-12 items-center">
                    <div className="flex-1 bg-white rounded-[48px] p-12 shadow-ambient flex flex-col gap-8 relative overflow-hidden">
                        {/* Team 1 */}
                        <div className="flex justify-between items-center">
                            <div className="flex flex-col gap-2">
                                <span className={clsx(
                                    "font-display font-black italic text-5xl uppercase tracking-tight",
                                    isWin1 ? "text-secondary" : "text-secondary/20"
                                )}>
                                    {match.team1}
                                </span>
                                <span className="font-display font-bold text-xl text-secondary/30 uppercase tracking-[0.2em]">
                                    Points {match.team1Points}
                                </span>
                            </div>
                            <span className={clsx(
                                "font-display font-black text-8xl",
                                isWin1 ? "text-primary italic" : "text-secondary/5"
                            )}>
                                {match.team1Wins}
                            </span>
                        </div>

                        <div className="h-px bg-secondary/5 w-full" />

                        {/* Team 2 */}
                        <div className="flex justify-between items-center">
                            <div className="flex flex-col gap-2">
                                <span className={clsx(
                                    "font-display font-black italic text-5xl uppercase tracking-tight",
                                    isWin2 ? "text-secondary" : "text-secondary/20"
                                )}>
                                    {match.team2}
                                </span>
                                <span className="font-display font-bold text-xl text-secondary/30 uppercase tracking-[0.2em]">
                                    Points {match.team2Points}
                                </span>
                            </div>
                            <span className={clsx(
                                "font-display font-black text-8xl",
                                isWin2 ? "text-primary italic" : "text-secondary/5"
                            )}>
                                {match.team2Wins}
                            </span>
                        </div>
                    </div>

                    <div className="w-[380px] flex flex-col gap-8 items-center justify-center">
                        <div className="bg-gradient-to-br from-primary to-primary-container text-white px-12 py-10 rounded-[40px] shadow-ambient w-full text-center relative overflow-hidden">
                            <div className="relative z-10 flex flex-col items-center gap-4">
                                <Trophy className="w-12 h-12 text-white/40" strokeWidth={2.5} />
                                <span className="font-display font-black italic text-5xl uppercase tracking-tight leading-none">
                                    {isTie ? 'Tie' : (isWin1 ? match.team1 : match.team2)}
                                </span>
                            </div>
                        </div>
                        <div className="font-display font-bold text-2xl uppercase tracking-[0.3em] text-secondary/40">
                            {formatDateNoTz(match.date)}
                        </div>
                    </div>
                </div>

                <div className="mt-auto text-center opacity-20">
                    <p className="font-display font-black uppercase tracking-[0.5em] text-xl text-secondary">
                        PICKLEBALL.KY
                    </p>
                </div>
            </div>
        ) : (
            /* Story Layout */
            <div className="flex flex-col justify-start items-center relative z-10 px-16 gap-12 flex-1">
                <div className="text-center pt-24 mb-4">
                    <h1 className="font-display font-extrabold italic text-secondary text-[110px] uppercase tracking-tighter leading-[0.85] mb-12">
                        Corporate<br/>Pickleball<br/>League
                    </h1>
                    <span className="font-display font-bold text-secondary/20 text-4xl tracking-[0.5em] uppercase">Match Result</span>
                </div>

                <div className="w-full bg-white rounded-[100px] shadow-ambient pt-20 px-16 pb-16 flex flex-col gap-16 relative overflow-hidden">
                    {/* Team 1 */}
                    <div className="flex justify-between items-center relative">
                        <div className="flex flex-col gap-4 max-w-[65%]">
                            <span className={clsx(
                                "font-display font-black italic text-7xl uppercase tracking-tight leading-tight",
                                isWin1 ? "text-secondary" : "text-secondary/20"
                            )}>
                                {match.team1}
                            </span>
                            <div className="font-display font-bold text-3xl uppercase tracking-[0.2em] text-secondary/30">
                                Points {match.team1Points}
                            </div>
                        </div>
                        <div className="relative">
                            {isWin1 && <SpeedTrails className="right-full top-1/2 -translate-y-1/2" />}
                            <span className={clsx(
                                "font-display font-black text-[200px] leading-none",
                                isWin1 ? "text-primary italic" : "text-secondary/5"
                            )}>
                                {match.team1Wins}
                            </span>
                        </div>
                    </div>

                    <div className="h-px bg-secondary/5 w-full relative">
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-10 text-secondary/10 font-display font-black italic text-5xl tracking-widest">VS</div>
                    </div>

                    {/* Team 2 */}
                    <div className="flex justify-between items-center relative">
                        <div className="flex flex-col gap-4 max-w-[65%]">
                            <span className={clsx(
                                "font-display font-black italic text-7xl uppercase tracking-tight leading-tight",
                                isWin2 ? "text-secondary" : "text-secondary/20"
                            )}>
                                {match.team2}
                            </span>
                            <div className="font-display font-bold text-3xl uppercase tracking-[0.2em] text-secondary/30">
                                Points {match.team2Points}
                            </div>
                        </div>
                        <div className="relative">
                            {isWin2 && <SpeedTrails className="right-full top-1/2 -translate-y-1/2" />}
                            <span className={clsx(
                                "font-display font-black text-[200px] leading-none",
                                isWin2 ? "text-primary italic" : "text-secondary/5"
                            )}>
                                {match.team2Wins}
                            </span>
                        </div>
                    </div>

                    <div className="pt-12 border-t border-secondary/5 text-center font-display font-bold text-4xl uppercase tracking-[0.4em] text-secondary/30">
                        {formatDateNoTz(match.date)}
                    </div>
                </div>

                <div className="w-full bg-gradient-to-br from-primary to-primary-container text-white px-16 py-12 rounded-[60px] shadow-ambient relative overflow-hidden mt-4">
                    <div className="flex flex-col items-center gap-6 text-center relative z-10">
                        <Trophy className="w-16 h-12 text-white/30" strokeWidth={2.5} />
                        <span className="font-display font-black italic text-8xl uppercase tracking-tighter leading-none">
                            {isTie ? 'Tie' : (isWin1 ? match.team1 : match.team2)}
                        </span>
                    </div>
                </div>

                <div className="mt-auto pb-20 opacity-20">
                     <p className="font-display font-black uppercase tracking-[0.6em] text-4xl text-secondary">
                        PICKLEBALL.KY
                     </p>
                </div>
            </div>
        )}
    </div>
  );
};
