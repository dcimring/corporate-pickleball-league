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
  const postRowHeight = isSingleColumnPost ? "h-[52px]" : "h-[46px]";
  
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
        maxWidth: isPost ? '1200px' : '1080px',
        minHeight: isPost ? '630px' : '1920px',
        maxHeight: isPost ? '1200px' : '1080px',
        background: 'linear-gradient(135deg, #ffffff 0%, #f0f4f8 100%)'
      }}
    >
        {/* Grain / Noise Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.08] z-50 pointer-events-none mix-blend-multiply" 
            style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/stardust.png")` }} 
        />
        
        {/* Background Decorative Accent */}
        <div className="absolute -top-20 -right-20 w-[600px] h-[600px] bg-[#16559a]/5 rounded-full blur-3xl z-0" />

        {isPost ? (
            /* Post Layout (Landscape) */
            <div className="relative z-10 flex flex-col h-full items-center">
                
                {/* Top Section: Masthead */}
                <div className="w-full flex justify-between items-start mb-10 pt-2 px-8">
                    <div className="flex flex-col items-start">
                         <h1 className="font-display uppercase tracking-tighter leading-none flex flex-col">
                            <span className="font-black text-[#16559a] text-[84px]">PICKLEBALL</span>
                            <span className="font-thin text-[#16559a]/60 text-[54px] -mt-4">LEAGUE</span>
                        </h1>
                        <div className="flex items-center gap-3 mt-4">
                             <div className="w-12 h-1 bg-[#ffc72c]" />
                             <p className="font-stat font-black tracking-[0.4em] text-[#16559a] opacity-80 uppercase text-[10px]">
                                OFFICIAL STANDINGS
                             </p>
                        </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-4">
                        <div className="backdrop-blur-md bg-[#ffc72c]/90 text-[#16559a] px-8 py-3 font-display font-black uppercase tracking-widest text-3xl shadow-lg border border-white/20">
                            {division}
                        </div>
                        <div className="flex flex-col items-end opacity-40">
                             <p className="font-stat font-black uppercase tracking-[0.4em] text-lg text-[#16559a]">
                                PICKLEBALL.KY
                             </p>
                             <div className="w-32 h-[1px] bg-[#16559a] mt-1" />
                        </div>
                    </div>
                </div>

                {/* Bottom Section: Leaderboard Columns */}
                <div className="w-full flex-1 flex flex-col gap-0 px-8">
                    {isSingleColumnPost ? (
                        <div className="max-w-[1000px] w-full mx-auto flex flex-col">
                            <LeaderboardHeader isPost={true} />
                            <div className="flex flex-col border border-[#16559a]/10 bg-white/40 backdrop-blur-sm">
                                {displayEntries.map((entry, idx) => (
                                    <LeaderboardRow key={entry.team} entry={entry} index={idx} isPost={true} rowHeightClass={postRowHeight} />
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="w-full flex gap-x-12">
                            <div className="flex-1 flex flex-col">
                                <LeaderboardHeader isPost={true} />
                                <div className="flex flex-col border border-[#16559a]/10 bg-white/40 backdrop-blur-sm">
                                    {displayEntries.slice(0, 6).map((entry, idx) => (
                                        <LeaderboardRow key={entry.team} entry={entry} index={idx} isPost={true} rowHeightClass={postRowHeight} />
                                    ))}
                                </div>
                            </div>
                            <div className="flex-1 flex flex-col">
                                <LeaderboardHeader isPost={true} />
                                <div className="flex flex-col border border-[#16559a]/10 bg-white/40 backdrop-blur-sm">
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
                <div className="text-center space-y-4 mb-12">
                    <h1 className="font-display uppercase tracking-tighter leading-[0.8] flex flex-col items-center">
                        <span className="font-black text-[#16559a] text-[150px]">PICKLEBALL</span>
                        <span className="font-thin text-[#16559a]/40 text-[100px] -mt-2">LEAGUE</span>
                    </h1>
                    
                    <div className="flex flex-col items-center gap-6 pt-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-[2px] bg-[#16559a]/20" />
                            <p className="font-stat font-black tracking-[0.5em] text-[#16559a] opacity-60 uppercase text-2xl">
                                OFFICIAL STANDINGS
                            </p>
                            <div className="w-12 h-[2px] bg-[#16559a]/20" />
                        </div>
                        
                        <div className="backdrop-blur-lg bg-[#ffc72c] text-[#16559a] px-12 py-5 font-display font-black uppercase tracking-[0.2em] text-5xl shadow-2xl border-4 border-white/30 transform -rotate-1">
                            {division}
                        </div>
                    </div>
                </div>

                {/* List Section */}
                <div className="w-full flex flex-col bg-white/60 backdrop-blur-md shadow-2xl border border-white/50">
                    <LeaderboardHeader isPost={false} />
                    {displayEntries.map((entry, index) => (
                        <LeaderboardRow key={entry.team} entry={entry} index={index} isPost={false} />
                    ))}
                    
                    {entries.length > 12 && (
                        <div className="text-center py-8 bg-[#16559a]/5">
                            <p className="font-display font-black text-[#16559a] opacity-30 uppercase tracking-[0.2em] text-2xl">
                                + {entries.length - 12} ADDITIONAL TEAMS
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer Story */}
                <div className="mt-auto pt-16 flex flex-col items-center gap-4">
                     <p className="font-stat font-black uppercase tracking-[0.8em] text-4xl text-[#16559a] opacity-30">
                        PICKLEBALL.KY
                     </p>
                     <div className="w-64 h-[2px] bg-linear-to-r from-transparent via-[#16559a]/20 to-transparent" />
                </div>
            </div>
        )}
    </div>
  );
};

const LeaderboardHeader: React.FC<{ isPost: boolean }> = ({ isPost }) => (
    <div className={clsx(
        "flex items-center text-[#16559a] opacity-50 font-stat font-bold uppercase tracking-[0.2em]",
        isPost ? "text-xs py-2 px-4 bg-[#16559a]/5" : "text-2xl py-6 px-6 bg-[#16559a]/5"
    )}>
        <div className={clsx("text-center", isPost ? "w-10" : "w-20")}>#</div>
        <div className="flex-1 pl-4">Team</div>
        <div className="flex items-center gap-2 md:gap-6">
            <div className={clsx("text-center", isPost ? "w-16" : "w-32")}>W-L</div>
            <div className={clsx("text-center", isPost ? "w-16" : "w-32")}>Win %</div>
            <div className={clsx("text-center", isPost ? "w-12" : "w-32")}>Pts</div>
        </div>
    </div>
);

const LeaderboardRow: React.FC<{ entry: LeaderboardEntry, index: number, isPost: boolean, rowHeightClass?: string }> = ({ entry, index, isPost, rowHeightClass = "h-[46px]" }) => {
    return (
        <div className={clsx(
            "flex items-center relative transition-colors",
            isPost ? clsx(rowHeightClass, "px-4 border-b border-[#16559a]/5 last:border-b-0") : "min-h-[110px] py-3 px-6",
            index % 2 === 0 ? "bg-[#ffffff]" : "bg-[#f2f4f6]"
        )}>
            {/* Rank */}
            <div className={clsx("flex items-center justify-center font-display font-black", isPost ? "w-10 text-2xl" : "w-20 text-5xl")}>
                <span className={clsx(
                    index === 0 ? "text-[#16559a]" : 
                    index === 1 ? "text-[#16559a]/70" :
                    index === 2 ? "text-[#16559a]/50" : "text-[#16559a]/20"
                )}>
                    {index + 1}
                </span>
            </div>

            {/* Team Name */}
            <div className="flex-1 pl-4 pr-2 flex flex-col justify-center">
                <span className={clsx(
                    "font-display font-black uppercase text-[#16559a] tracking-tight block",
                    isPost ? "text-lg truncate leading-tight" : (entry.team.length > 20 ? "text-[32px] leading-none" : "text-4xl leading-none")
                )}>
                    {entry.team}
                </span>
            </div>
            
            {/* Stats Columns */}
            <div className="flex items-center gap-2 md:gap-6">
                <div className={clsx(
                    "text-center font-stat font-bold text-[#16559a] opacity-60",
                    isPost ? "w-16 text-[15px]" : "w-32 text-3xl"
                )}>
                    {entry.wins}-{entry.losses}
                </div>
                
                <div className={clsx(
                    "text-center font-stat font-black text-[#16559a]",
                    isPost ? "text-lg w-16" : "text-4xl w-32"
                )}>
                    {(entry.winPct * 100).toFixed(0)}%
                </div>

                <div className={clsx(
                    "text-center font-stat font-black text-[#16559a]/60",
                    isPost ? "w-12 text-[15px]" : "w-32 text-3xl"
                )}>
                    {entry.pointsFor}
                </div>
            </div>
        </div>
    );
};