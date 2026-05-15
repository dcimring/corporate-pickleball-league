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
  const postRowHeight = isSingleColumnPost ? "h-[64px]" : "h-[54px]";
  
  // Fit 12 entries max for both formats
  const displayEntries = entries.slice(0, 12);

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
        {/* Grain / Noise Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.15] z-50 pointer-events-none mix-blend-multiply" 
            style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/stardust.png")` }} 
        />
        
        {/* Background Decorative Accent */}
        <div className="absolute -top-20 -right-20 w-[800px] h-[800px] bg-[#ffc93c]/10 rounded-full blur-3xl z-0" />

        {isPost ? (
            /* Post Layout (Landscape) */
            <div className="relative z-10 flex flex-col h-full items-center">
                
                {/* Top Section: Masthead */}
                <div className="w-full flex justify-between items-start mb-10 pt-2 px-8">
                    <div className="flex flex-col items-start">
                         <h1 className="font-display uppercase tracking-tighter leading-none flex flex-col">
                            <span className="font-black text-[#143a78] text-[84px]">STANDINGS</span>
                            <div className="w-20 h-2 bg-[#ffc93c] mt-4 rounded-sm" />
                        </h1>
                    </div>
                    
                    <div className="flex flex-col items-end gap-3">
                        <div className="bg-[#143a78] text-white px-8 py-3 font-display font-black uppercase tracking-widest text-3xl shadow-xl rounded-sm">
                            {division}
                        </div>
                        <div className="flex flex-col items-end opacity-40">
                             <p className="font-mono font-bold uppercase tracking-[0.4em] text-lg text-[#143a78]">
                                PICKLEBALL.KY
                             </p>
                        </div>
                    </div>
                </div>

                {/* Bottom Section: Leaderboard Columns */}
                <div className="w-full flex-1 flex flex-col gap-0 px-8">
                    {isSingleColumnPost ? (
                        <div className="max-w-[1000px] w-full mx-auto flex flex-col">
                            <LeaderboardHeader isPost={true} />
                            <div className="flex flex-col border border-[#143a78]/10 bg-white shadow-2xl rounded-lg overflow-hidden">
                                {displayEntries.map((entry, idx) => (
                                    <LeaderboardRow key={entry.team} entry={entry} index={idx} isPost={true} rowHeightClass={postRowHeight} />
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="w-full flex gap-x-12">
                            <div className="flex-1 flex flex-col">
                                <LeaderboardHeader isPost={true} />
                                <div className="flex flex-col border border-[#143a78]/10 bg-white shadow-2xl rounded-lg overflow-hidden">
                                    {displayEntries.slice(0, 6).map((entry, idx) => (
                                        <LeaderboardRow key={entry.team} entry={entry} index={idx} isPost={true} rowHeightClass={postRowHeight} />
                                    ))}
                                </div>
                            </div>
                            <div className="flex-1 flex flex-col">
                                <LeaderboardHeader isPost={true} />
                                <div className="flex flex-col border border-[#143a78]/10 bg-white shadow-2xl rounded-lg overflow-hidden">
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
            <div className="flex flex-col justify-start items-center relative z-10 px-8 pt-24 pb-16 flex-1">
                {/* Masthead */}
                <div className="text-center space-y-4 mb-14">
                    <h1 className="font-display uppercase tracking-tighter leading-[0.8] flex flex-col items-center">
                        <span className="font-black text-[#143a78] text-[150px]">STANDINGS</span>
                        <div className="w-32 h-3 bg-[#ffc93c] mt-8 rounded-sm shadow-[0_0_24px_rgba(255,201,60,0.4)]" />
                    </h1>
                    
                    <div className="flex flex-col items-center gap-6 pt-10">
                        <div className="bg-[#143a78] text-white px-12 py-5 font-display font-black uppercase tracking-[0.2em] text-5xl shadow-2xl rounded-sm">
                            {division}
                        </div>
                    </div>
                </div>

                {/* List Section */}
                <div className="w-full flex flex-col bg-white shadow-2xl border border-[#143a78]/10 rounded-xl overflow-hidden">
                    <LeaderboardHeader isPost={false} />
                    {displayEntries.map((entry, index) => (
                        <LeaderboardRow key={entry.team} entry={entry} index={index} isPost={false} />
                    ))}
                    
                    {entries.length > 12 && (
                        <div className="text-center py-8 bg-[#143a78]/5">
                            <p className="font-mono font-bold text-[#143a78] opacity-30 uppercase tracking-[0.2em] text-2xl">
                                + {entries.length - 12} ADDITIONAL TEAMS
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer Story */}
                <div className="mt-auto pt-16 flex flex-col items-center gap-4">
                     <p className="font-mono font-bold uppercase tracking-[0.8em] text-4xl text-[#143a78] opacity-30">
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
        "flex items-center text-[#143a78] opacity-40 font-mono font-bold uppercase tracking-[0.2em]",
        isPost ? "text-xs py-2 px-6 bg-[#143a78]/5" : "text-2xl py-6 px-8 bg-[#143a78]/5"
    )}>
        <div className={clsx("text-center", isPost ? "w-10" : "w-20")}>#</div>
        <div className="flex-1 pl-4">Team</div>
        <div className="flex items-center gap-2 md:gap-10">
            <div className={clsx("text-center", isPost ? "w-16" : "w-32")}>W-L</div>
            <div className={clsx("text-center", isPost ? "w-16" : "w-32")}>%</div>
            <div className={clsx("text-center", isPost ? "w-12" : "w-32")}>Pts</div>
        </div>
    </div>
);

const LeaderboardRow: React.FC<{ entry: LeaderboardEntry, index: number, isPost: boolean, rowHeightClass?: string }> = ({ entry, index, isPost, rowHeightClass = "h-[54px]" }) => {
    return (
        <div className={clsx(
            "flex items-center relative transition-colors",
            isPost ? clsx(rowHeightClass, "px-6 border-b border-[#143a78]/5 last:border-b-0") : "min-h-[115px] py-3 px-8 border-b border-[#143a78]/5 last:border-b-0",
            index === 0 ? "bg-[#ffc93c]/5" : "bg-white"
        )}>
            {/* Rank */}
            <div className={clsx("flex items-center justify-center font-mono font-bold", isPost ? "w-10 text-2xl" : "w-20 text-5xl")}>
                <span className={clsx(
                    index === 0 ? "text-[#143a78]" : "text-[#143a78]/30"
                )}>
                    {String(index + 1).padStart(2, "0")}
                </span>
            </div>

            {/* Team Name */}
            <div className="flex-1 pl-6 pr-2 flex flex-col justify-center">
                <span className={clsx(
                    "font-display font-black uppercase text-[#143a78] tracking-tight block",
                    isPost ? "text-xl truncate leading-tight" : (entry.team.length > 20 ? "text-[36px] leading-none" : "text-[46px] leading-none")
                )}>
                    {entry.team}
                </span>
            </div>
            
            {/* Stats Columns */}
            <div className="flex items-center gap-2 md:gap-10">
                <div className={clsx(
                    "text-center font-mono font-bold text-[#143a78]/50",
                    isPost ? "w-16 text-[16px]" : "w-32 text-3xl"
                )}>
                    {entry.wins}-{entry.losses}
                </div>
                
                <div className={clsx(
                    "text-center font-mono font-bold text-[#143a78]",
                    isPost ? "text-lg w-16" : "text-4xl w-32"
                )}>
                    {(entry.winPct * 100).toFixed(0)}%
                </div>

                <div className={clsx(
                    "text-center font-mono font-bold text-[#143a78]/50",
                    isPost ? "w-12 text-[16px]" : "w-32 text-3xl"
                )}>
                    {entry.pointsFor}
                </div>
            </div>
        </div>
    );
};