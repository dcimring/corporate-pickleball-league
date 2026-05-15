import React from 'react';
import { clsx } from 'clsx';
import type { LeaderboardEntry } from '../types';

interface ShareableLeaderboardProps {
  division: string;
  entries: LeaderboardEntry[];
  layout?: 'post' | 'story';
}

export const ShareableLeaderboard: React.FC<ShareableLeaderboardProps> = ({ 
  division, 
  entries,
  layout = 'story' 
}) => {
  const isPost = layout === 'post';
  const isSingleColumnPost = isPost && entries.length <= 6;
  const postRowHeight = isSingleColumnPost ? "h-[72px]" : "h-[60px]";
  
  // Fit 12 entries max for both formats
  const displayEntries = entries.slice(0, 12);

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
        {/* Grain / Noise Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.1] z-50 pointer-events-none mix-blend-multiply" 
            style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/stardust.png")` }} 
        />
        
        {/* Broadcast Ticker Bar */}
        <div className="w-full bg-[#005596] h-10 flex items-center justify-between px-10 relative z-[60]">
            <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-[#ffc93c] animate-pulse" />
                <span className="mono text-[12px] text-[#ffc93c] font-bold tracking-[0.3em] uppercase">Status: Live Standings</span>
            </div>
            <span className="mono text-[12px] text-white/40 font-bold tracking-[0.3em] uppercase">Official.League.Platform</span>
        </div>

        {isPost ? (
            /* Post Layout (Landscape) */
            <div className="relative z-10 flex flex-col h-full items-center p-10">
                
                {/* Top Section: Masthead */}
                <div className="w-full flex justify-between items-end mb-10 px-2">
                    <div className="flex flex-col items-start gap-1">
                         <span className="mono text-[14px] text-[#005596] opacity-40 font-bold tracking-[0.4em] uppercase">League Standings</span>
                         <h1 className="font-display font-black text-[#005596] text-[90px] leading-[0.85] tracking-tighter uppercase">
                            STANDINGS
                         </h1>
                    </div>
                    
                    <div className="flex flex-col items-end gap-3">
                        <div className="bg-[#ffc93c] text-[#005596] px-8 py-3 font-display font-black uppercase tracking-wider text-3xl shadow-lg border-2 border-[#005596]">
                            {division}
                        </div>
                    </div>
                </div>

                {/* Bottom Section: Leaderboard Columns */}
                <div className="w-full flex-1 flex flex-col gap-0 px-2">
                    {isSingleColumnPost ? (
                        <div className="max-w-[1000px] w-full mx-auto flex flex-col">
                            <LeaderboardHeader isPost={true} />
                            <div className="flex flex-col border border-[#005596]/10 bg-white shadow-2xl overflow-hidden">
                                {displayEntries.map((entry, idx) => (
                                    <LeaderboardRow key={entry.team} entry={entry} index={idx} isPost={true} rowHeightClass={postRowHeight} />
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="w-full flex gap-x-8">
                            <div className="flex-1 flex flex-col">
                                <LeaderboardHeader isPost={true} />
                                <div className="flex flex-col border border-[#005596]/10 bg-white shadow-2xl overflow-hidden">
                                    {displayEntries.slice(0, 6).map((entry, idx) => (
                                        <LeaderboardRow key={entry.team} entry={entry} index={idx} isPost={true} rowHeightClass={postRowHeight} />
                                    ))}
                                </div>
                            </div>
                            <div className="flex-1 flex flex-col">
                                <LeaderboardHeader isPost={true} />
                                <div className="flex flex-col border border-[#005596]/10 bg-white shadow-2xl overflow-hidden">
                                    {displayEntries.slice(6, 12).map((entry, idx) => (
                                        <LeaderboardRow key={entry.team} entry={entry} index={idx + 6} isPost={true} rowHeightClass={postRowHeight} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        ) : (
            /* Story Layout (Portrait) */
            <div className="flex flex-col justify-start items-center relative z-10 px-12 pt-16 pb-12 flex-1">
                {/* Masthead */}
                <div className="text-center space-y-4 mb-10 w-full">
                    <div className="flex flex-col items-center gap-2">
                        <span className="mono text-[24px] text-[#005596] opacity-30 font-bold tracking-[0.6em] uppercase">League Official</span>
                        <h1 className="font-display uppercase tracking-tighter leading-[0.8] flex flex-col items-center">
                            <span className="font-black text-[#005596] text-[155px]">STANDINGS</span>
                            <div className="w-48 h-3 bg-[#ffc93c] mt-8 rounded-sm shadow-[0_8px_32px_rgba(255,201,60,0.5)]" />
                        </h1>
                    </div>
                    
                    <div className="flex flex-col items-center gap-4 pt-8">
                        <div className="bg-[#005596] text-[#ffc93c] px-12 py-5 font-display font-black uppercase tracking-[0.1em] text-4xl shadow-2xl border-b-8 border-[#ffc93c]/20">
                            {division}
                        </div>
                    </div>
                </div>

                {/* List Section */}
                <div className="w-full flex flex-col bg-white shadow-[0_40px_100px_-40px_rgba(20,58,120,0.4)] border border-[#005596]/15 overflow-hidden">
                    <LeaderboardHeader isPost={false} />
                    {displayEntries.map((entry, index) => (
                        <LeaderboardRow key={entry.team} entry={entry} index={index} isPost={false} />
                    ))}
                    
                    {entries.length > 12 && (
                        <div className="text-center py-6 bg-[#005596]/5 border-t border-[#005596]/10">
                            <p className="mono font-bold text-[#005596] opacity-30 uppercase tracking-[0.2em] text-2xl">
                                + {entries.length - 12} ADDITIONAL TEAMS
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer Story */}
                <div className="mt-auto pt-16 flex flex-col items-center gap-4">
                     <div className="w-32 h-1 bg-[#ffc93c] opacity-50 mb-2" />
                     <p className="mono font-bold uppercase tracking-[1.2em] text-4xl text-[#005596] opacity-30">
                        PICKLEBALL.KY
                     </p>
                </div>
            </div>
        )}
    </div>
  );
};

const LeaderboardHeader: React.FC<{ isPost: boolean }> = ({ isPost }) => (
    <div className={clsx(
        "flex items-center text-[#005596] font-bold uppercase tracking-[0.25em] mono",
        isPost ? "text-[11px] py-3 px-6 bg-[#005596]/5" : "text-2xl py-6 px-12 bg-[#005596]/5"
    )}>
        <div className={clsx("text-center opacity-40", isPost ? "w-10" : "w-24")}>#</div>
        <div className={clsx("flex-1 opacity-40", isPost ? "pl-4" : "pl-6")}>Team</div>
        <div className={clsx("flex items-center", isPost ? "gap-3" : "gap-8")}>
            <div className={clsx("text-center opacity-40", isPost ? "w-16" : "w-24")}>W-L</div>
            <div className={clsx("text-center", isPost ? "w-16" : "w-32")}>Win %</div>
        </div>
    </div>
);

const LeaderboardRow: React.FC<{ entry: LeaderboardEntry, index: number, isPost: boolean, rowHeightClass?: string }> = ({ entry, index, isPost, rowHeightClass = "h-[60px]" }) => {
    return (
        <div className={clsx(
            "flex items-center relative",
            isPost ? clsx(rowHeightClass, "px-6 border-b border-[#005596]/10 last:border-b-0") : "min-h-[105px] py-3 px-12 border-b border-[#005596]/10 last:border-b-0",
            index === 0 ? "bg-[#ffc93c]/10" : "bg-white"
        )}>
            {/* Rank */}
            <div className={clsx("flex items-center justify-center mono font-bold", isPost ? "w-10 text-2xl" : "w-24 text-5xl")}>
                <span className={clsx(
                    index === 0 ? "text-[#005596]" : "text-[#005596]/20"
                )}>
                    {String(index + 1).padStart(2, "0")}
                </span>
            </div>

            {/* Team Name */}
            <div className={clsx("flex-1 flex flex-col justify-center min-w-0", isPost ? "pl-4 pr-3" : "pl-8 pr-6")}>
                <span className={clsx(
                    "font-display font-black uppercase text-[#005596] tracking-tight block leading-none truncate",
                    isPost ? "text-[20px]" : (entry.team.length > 20 ? "text-[34px]" : "text-[44px]")
                )}>
                    {entry.team}
                </span>
            </div>
            
            {/* Stats Columns */}
            <div className={clsx("flex items-center", isPost ? "gap-3" : "gap-8")}>
                <div className={clsx(
                    "text-center mono font-bold text-[#005596]/40",
                    isPost ? "w-16 text-[14px]" : "w-24 text-2xl"
                )}>
                    {entry.wins}-{entry.losses}
                </div>
                
                <div className={clsx(
                    "text-center mono font-bold text-[#005596]",
                    isPost ? "text-[18px] w-16" : "text-4xl w-32"
                )}>
                    {(entry.winPct * 100).toFixed(0)}%
                </div>
            </div>

            {/* Winner Accent */}
            {index === 0 && (
                <div className="absolute left-0 top-0 bottom-0 w-2 bg-[#ffc93c]" />
            )}
        </div>
    );
};