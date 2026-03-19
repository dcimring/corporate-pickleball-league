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
  
  const displayEntries = entries.slice(0, 12);

  return (
    <div 
      className={clsx(
        "bg-[#f7f9fb] relative overflow-hidden flex flex-col font-body selection:none",
        isPost ? "pt-10 px-12 pb-6" : "pb-12"
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

        {/* Header Section */}
        <div className={clsx("relative z-10", isPost ? "mb-10" : "pt-24 px-16 mb-12")}>
            <div className="flex flex-col gap-4">
                <h1 className={clsx(
                    "font-display font-extrabold italic text-secondary uppercase tracking-tighter leading-[0.85]",
                    isPost ? "text-7xl" : "text-[120px]"
                )}>
                    {isPost ? (
                        <>Corporate<br/>Pickleball League</>
                    ) : (
                        <>Corporate<br/>Pickleball<br/>League</>
                    )}
                </h1>
                
                <div className="flex items-center gap-6">
                    <div className="bg-gradient-to-br from-primary to-primary-container text-white px-8 py-3 rounded-2xl font-display font-black italic text-2xl md:text-3xl uppercase tracking-widest shadow-ambient">
                        {division}
                    </div>
                    <div className="h-px flex-1 bg-secondary/10" />
                    <span className="font-display font-bold text-secondary/40 uppercase tracking-[0.3em] text-xl md:text-2xl text-right">
                        Standings
                    </span>
                </div>
            </div>
        </div>

        {/* List Section */}
        <div className={clsx("relative z-10 flex flex-col flex-1", isPost ? "" : "px-16")}>
            {isPost ? (
                isSingleColumnPost ? (
                    <div className="max-w-[960px] mx-auto w-full flex flex-col">
                        <LeaderboardHeader isPost={true} isSingleColumnPost={true} />
                        <div className="flex flex-col gap-y-3">
                            {displayEntries.map((entry, idx) => (
                                <LeaderboardRow key={entry.team} entry={entry} index={idx} isPost={true} isSingleColumnPost={true} />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="flex gap-x-16">
                        <div className="flex-1 flex flex-col">
                            <LeaderboardHeader isPost={true} />
                            <div className="flex flex-col gap-y-3">
                                {displayEntries.slice(0, 6).map((entry, idx) => (
                                    <LeaderboardRow key={entry.team} entry={entry} index={idx} isPost={true} />
                                ))}
                            </div>
                        </div>
                        <div className="flex-1 flex flex-col">
                            <LeaderboardHeader isPost={true} />
                            <div className="flex flex-col gap-y-3">
                                {displayEntries.slice(6, 12).map((entry, idx) => (
                                    <LeaderboardRow key={entry.team} entry={entry} index={idx + 6} isPost={true} />
                                ))}
                            </div>
                        </div>
                    </div>
                )
            ) : (
                <div className="flex flex-col gap-4">
                    <LeaderboardHeader isPost={false} />
                    {displayEntries.map((entry, index) => (
                        <LeaderboardRow key={entry.team} entry={entry} index={index} isPost={false} />
                    ))}
                    
                    {entries.length > 12 && (
                        <div className="text-center pt-6">
                            <p className="font-display font-bold italic text-secondary/30 uppercase tracking-[0.2em] text-2xl">
                                + {entries.length - 12} more teams in {division}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>

        {/* Footer (Story only) */}
        {!isPost && (
            <div className="relative z-10 pt-12 pb-16 text-center mt-auto">
                <p className="font-display font-black uppercase tracking-[0.5em] text-3xl text-secondary/20 mb-4">
                    PICKLEBALL.KY
                </p>
                <div className="w-24 h-1.5 bg-primary/20 mx-auto rounded-full" />
            </div>
        )}
    </div>
  );
};

const LeaderboardHeader: React.FC<{ isPost: boolean; isSingleColumnPost?: boolean }> = ({ isPost, isSingleColumnPost }) => (
    <div className={clsx(
        "flex items-center text-secondary/30 font-display font-bold uppercase tracking-[0.25em]",
        isPost ? (isSingleColumnPost ? "text-sm mb-2" : "text-xs mb-2") : "pb-4 text-2xl"
    )}>
        <div className={clsx("text-center", isPost ? (isSingleColumnPost ? "w-20" : "w-16") : "w-28")}>Rank</div>
        <div className="flex-1 text-left pl-4">Team</div>
        <div className="flex items-center justify-end">
            <div className={clsx("text-center", isPost ? (isSingleColumnPost ? "w-32" : "w-20") : "w-40")}>W-L</div>
            <div className={clsx("text-center", isPost ? (isSingleColumnPost ? "w-32" : "w-20") : "w-40")}>%</div>
        </div>
    </div>
);

const LeaderboardRow: React.FC<{ entry: LeaderboardEntry, index: number, isPost: boolean, isSingleColumnPost?: boolean }> = ({ entry, index, isPost, isSingleColumnPost }) => {
    const isTop3 = index < 3;
    return (
        <div className={clsx("flex items-center relative", isPost ? (isSingleColumnPost ? "h-20" : "h-16") : "h-24")}>
            {/* Row Card */}
            <div className={clsx(
                "absolute inset-0 rounded-2xl transition-all duration-500",
                isTop3 ? "bg-white shadow-ambient" : "bg-white/40"
            )} />

            {/* Rank */}
            <div className={clsx("flex items-center justify-center relative z-20", isPost ? (isSingleColumnPost ? "w-20" : "w-16") : "w-28")}>
                <span className={clsx(
                    "font-display font-black italic tracking-tighter",
                    isTop3 ? "text-primary scale-110" : "text-secondary/20",
                    isPost ? (isSingleColumnPost ? "text-4xl" : "text-3xl") : "text-6xl"
                )}>
                    {index + 1}
                </span>
            </div>

            {/* Content */}
            <div className="flex-1 h-full flex items-center relative z-10 pl-4 pr-8">
                 {/* Team Name */}
                <div className="flex-1">
                    <span className={clsx(
                        "font-display font-bold uppercase tracking-tight line-clamp-1 leading-none text-secondary",
                        isPost ? (isSingleColumnPost ? "text-3xl" : "text-2xl") : "text-5xl"
                    )}>
                        {entry.team}
                    </span>
                </div>
                
                {/* Stats */}
                <div className="flex items-center justify-end">
                    <div className={clsx(
                        "text-center font-display font-medium text-secondary/60",
                        isPost ? (isSingleColumnPost ? "w-32 text-2xl" : "w-20 text-xl") : "w-40 text-4xl"
                    )}>
                        {entry.wins}-{entry.losses}
                    </div>
                    
                    <div className={clsx(
                        "text-center font-display font-black italic tracking-tighter text-primary",
                        isPost ? (isSingleColumnPost ? "w-32 text-3xl" : "w-20 text-2xl") : "w-40 text-5xl"
                    )}>
                        {(entry.winPct * 100).toFixed(0)}%
                    </div>
                </div>
            </div>
        </div>
    );
};
