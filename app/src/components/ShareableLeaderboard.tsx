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
  
  // Post: 12 entries max, Story: 12 entries max
  const displayEntries = entries.slice(0, 12);

  return (
    <div 
      className={clsx(
        "bg-[#f7f9fb] relative overflow-hidden flex flex-col font-body selection:none",
        isPost ? "pt-12 px-16 pb-8" : "pb-16"
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
        <div className="absolute inset-0 opacity-[0.05] mix-blend-multiply z-0 pointer-events-none" 
            style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/stardust.png")` }} 
        />

        {/* Decorative Background Elements (Refined Tonal Depth) */}
        <div className={clsx(
            "absolute transform rotate-12 z-0 opacity-20 bg-linear-to-tr from-[#003e6f] to-[#005596]",
            isPost 
                ? "top-[-100px] right-[-100px] w-[500px] h-[500px]" 
                : "top-[-300px] right-[-200px] w-[1000px] h-[1000px]"
        )} style={{ clipPath: 'polygon(20% 0%, 100% 40%, 80% 100%, 0% 80%)' }} />

        {/* Header Section */}
        <div className={clsx("relative z-10", isPost ? "mb-12 flex justify-between items-end" : "pt-24 px-16 mb-16")}>
            <div className="max-w-[70%]">
                <p className={clsx("font-stat font-black tracking-[0.4em] text-[#ffc72c] uppercase mb-4", isPost ? "text-xl" : "text-3xl")}>
                    OFFICIAL STANDINGS
                </p>
                <h1 className={clsx(
                    "font-display font-black text-[#003e6f] uppercase tracking-tighter leading-[0.85]",
                    isPost ? "text-[100px]" : "text-[160px]"
                )}>
                    {isPost ? (
                        <>THE<br/><span className="text-[#005596]">LEADERBOARD</span></>
                    ) : (
                        <>THE<br/><span className="text-[#005596]">CORPORATE</span><br/>LEADERBOARD</>
                    )}
                </h1>
                <div className={clsx("mt-8 flex items-center gap-6", isPost ? "text-2xl" : "text-4xl")}>
                    <div className="bg-[#ffc72c] text-[#003e6f] px-8 py-3 font-display font-black uppercase tracking-widest shadow-xl">
                        {division}
                    </div>
                </div>
            </div>
            {isPost && (
                <div className="text-right">
                    <div className="font-display font-black text-[120px] text-[#003e6f] opacity-5 leading-none">
                        RANK
                    </div>
                    <div className="font-stat font-black text-2xl tracking-[0.3em] text-[#003e6f] mt-[-60px]">
                        PICKLEBALL.KY
                    </div>
                </div>
            )}
        </div>

        {/* List Section */}
        <div className={clsx("relative z-10 flex flex-col flex-1", isPost ? "" : "px-16")}>
            {isPost ? (
                isSingleColumnPost ? (
                    <div className="max-w-[1000px] mx-auto w-full flex flex-col">
                        <LeaderboardHeader isPost={true} />
                        <div className="flex flex-col">
                            {displayEntries.map((entry, idx) => (
                                <LeaderboardRow key={entry.team} entry={entry} index={idx} isPost={true} />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="flex gap-x-12">
                        <div className="flex-1 flex flex-col">
                            <LeaderboardHeader isPost={true} />
                            <div className="flex flex-col">
                                {displayEntries.slice(0, 6).map((entry, idx) => (
                                    <LeaderboardRow key={entry.team} entry={entry} index={idx} isPost={true} />
                                ))}
                            </div>
                        </div>
                        <div className="flex-1 flex flex-col">
                            <LeaderboardHeader isPost={true} />
                            <div className="flex flex-col">
                                {displayEntries.slice(6, 12).map((entry, idx) => (
                                    <LeaderboardRow key={entry.team} entry={entry} index={idx + 6} isPost={true} />
                                ))}
                            </div>
                        </div>
                    </div>
                )
            ) : (
                <div className="flex flex-col">
                    <LeaderboardHeader isPost={false} />
                    {displayEntries.map((entry, index) => (
                        <LeaderboardRow key={entry.team} entry={entry} index={index} isPost={false} />
                    ))}
                    
                    {entries.length > 12 && (
                        <div className="text-center pt-8">
                            <p className="font-display font-black text-[#003e6f] opacity-20 uppercase tracking-widest text-3xl">
                                + {entries.length - 12} MORE TEAMS IN DIVISION
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>

        {/* Footer (Story only) */}
        {!isPost && (
            <div className="relative z-10 px-16 pt-16 pb-16 mt-auto flex justify-between items-end border-t-[20px] border-[#003e6f]">
                <div className="space-y-2">
                    <p className="font-stat font-black uppercase tracking-[0.4em] text-4xl text-[#003e6f]">
                        CORPORATE LEAGUE
                    </p>
                    <p className="font-stat font-black text-[#003e6f] opacity-30 uppercase tracking-[0.2em] text-2xl">
                        OFFICIAL TOURNAMENT RECORD
                    </p>
                </div>
                <div className="text-right">
                    <p className="font-display font-black text-[#003e6f] uppercase tracking-widest text-5xl">
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
        "flex items-center text-[#003e6f] opacity-40 font-stat font-bold uppercase tracking-widest",
        isPost ? "text-sm pb-4 px-6 bg-[#ebeef1]" : "text-3xl py-8 px-10 bg-[#ebeef1]"
    )}>
        <div className={clsx("text-center", isPost ? "w-16" : "w-32")}>#</div>
        <div className="flex-1 pl-8">Team</div>
        <div className="flex items-center gap-8">
            <div className={clsx("text-center", isPost ? "w-24" : "w-40")}>Record</div>
            <div className={clsx("text-center", isPost ? "w-24" : "w-40")}>Win %</div>
            <div className={clsx("text-center", isPost ? "w-20" : "w-32")}>Diff</div>
        </div>
    </div>
);

const LeaderboardRow: React.FC<{ entry: LeaderboardEntry, index: number, isPost: boolean }> = ({ entry, index, isPost }) => {
    const diff = entry.pointsFor - entry.pointsAgainst;
    return (
        <div className={clsx(
            "flex items-center relative transition-colors",
            isPost ? "h-[60px] px-6" : "h-[100px] px-10",
            index % 2 === 0 ? "bg-[#ffffff]" : "bg-[#f2f4f6]"
        )}>
            {/* Rank */}
            <div className={clsx("flex items-center justify-center font-display font-black", isPost ? "w-16 text-3xl" : "w-32 text-6xl")}>
                <span className={clsx(
                    index === 0 ? "text-[#003e6f]" : 
                    index === 1 ? "text-[#003e6f]/70" :
                    index === 2 ? "text-[#003e6f]/50" : "text-[#003e6f]/20"
                )}>
                    {index + 1}
                </span>
            </div>

            {/* Team Name */}
            <div className="flex-1 pl-8 pr-4">
                <span className={clsx(
                    "font-display font-black uppercase text-[#003e6f] tracking-tight line-clamp-1 leading-none",
                    isPost ? "text-2xl" : "text-5xl"
                )}>
                    {entry.team}
                </span>
            </div>
            
            {/* Stats Columns */}
            <div className="flex items-center gap-8">
                <div className={clsx(
                    "text-center font-stat font-bold text-[#003e6f] opacity-60",
                    isPost ? "w-24 text-xl" : "w-40 text-4xl"
                )}>
                    {entry.wins}-{entry.losses}
                </div>
                
                <div className={clsx(
                    "text-center font-stat font-black text-[#003e6f]",
                    isPost ? "text-2xl w-24" : "text-5xl w-40"
                )}>
                    {(entry.winPct * 100).toFixed(0)}%
                </div>

                <div className={clsx(
                    "text-center font-stat font-black",
                    isPost ? "w-20 text-2xl" : "w-32 text-4xl"
                )}>
                    <span className={clsx(
                        diff > 0 ? "text-[#00A651]" : 
                        diff < 0 ? "text-[#E31837]" : 
                        "text-[#003e6f] opacity-20"
                    )}>
                        {diff > 0 ? '+' : ''}{diff}
                    </span>
                </div>
            </div>
        </div>
    );
};
