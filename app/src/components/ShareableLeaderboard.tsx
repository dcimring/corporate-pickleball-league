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
        "bg-white relative overflow-hidden flex flex-col font-body selection:none",
        isPost ? "pt-4 px-10 pb-2" : "pb-8"
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
        {/* Grainy Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-multiply z-0 pointer-events-none" 
            style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/stardust.png")` }} 
        />

        {/* Decorative Background Elements */}
        <div className={clsx(
            "absolute rounded-full mix-blend-multiply blur-3xl",
            isPost 
                ? "top-[-80px] right-[-40px] w-[350px] h-[350px] bg-[#E0F2FE] opacity-40" 
                : "top-[-200px] right-[-100px] w-[800px] h-[800px] bg-[#E0F2FE] opacity-30"
        )} />
        <div className={clsx(
            "absolute rounded-full mix-blend-multiply blur-3xl",
            isPost 
                ? "bottom-[-80px] left-[-40px] w-[250px] h-[250px] bg-[#FFC72C] opacity-20" 
                : "bottom-[-200px] left-[-100px] w-[600px] h-[600px] bg-[#FFC72C] opacity-15"
        )} />
        
        {/* Header Section */}
        <div className={clsx("relative z-10", isPost ? (isSingleColumnPost ? "mb-1" : "mb-2") : "pt-16 px-12 pb-4")}>
            <div className={clsx("border-[#005596]/10", isPost ? "border-b-4 pb-2 flex justify-between items-end" : "border-b-[6px] pb-4")}>
                <div>
                    <h1 className={clsx(
                        "font-heading font-black italic text-[#005596] uppercase tracking-tighter leading-[0.9]",
                        isPost ? "text-5xl" : "text-[120px] mb-4"
                    )}>
                        {isPost ? (
                            <>La Roche Posay<br/>Pickleball League</>
                        ) : (
                            <>La Roche Posay<br/>Corporate<br/>Pickleball League</>
                        )}
                    </h1>
                    {isPost && (
                         <div className="flex items-center gap-4 mt-2">
                            <div className="bg-[#FFC72C] text-[#005596] px-6 py-2 rounded-full font-heading font-black italic text-xl uppercase tracking-widest border-2 border-white shadow-sm">
                                <span>{division}</span>
                            </div>
                            <span className="font-heading font-black text-[#005596]/40 uppercase tracking-[0.2em] text-xl">Standings</span>
                         </div>
                    )}
                </div>
                {!isPost && (
                    <div className="flex items-center gap-6 mt-6">
                        <div className="bg-[#FFC72C] text-[#005596] px-10 py-4 rounded-full font-heading font-black italic text-4xl uppercase tracking-widest border-2 border-white shadow-sm">
                            <span>{division}</span>
                        </div>
                        <span className="font-heading font-black text-[#005596]/40 uppercase tracking-[0.2em] text-4xl">Standings</span>
                    </div>
                )}
                {isPost && (
                    <div className="text-right pb-1">
                        <p className="font-heading font-black uppercase tracking-[0.4em] text-base text-[#005596] mb-1">
                           PICKLEBALL.KY
                        </p>
                        <p className="font-heading font-black uppercase tracking-[0.2em] text-xs text-[#005596]/30">
                           Corporate Pickleball League
                        </p>
                    </div>
                )}
            </div>
        </div>

        {/* List Section */}
        <div className={clsx("relative z-10 flex flex-col flex-1", isPost ? "" : "px-12")}>
            {isPost ? (
                isSingleColumnPost ? (
                    /* SINGLE COLUMN SHOWCASE FOR POST (<= 6 teams) */
                    <div className="max-w-[900px] mx-auto w-full flex flex-col pt-1">
                        <LeaderboardHeader isPost={true} isSingleColumnPost={true} />
                        <div className="flex flex-col gap-y-1.5">
                            {displayEntries.map((entry, idx) => (
                                <LeaderboardRow key={entry.team} entry={entry} index={idx} isPost={true} isSingleColumnPost={true} />
                            ))}
                        </div>
                    </div>
                ) : (
                    /* TWO COLUMN GRID FOR POST (> 6 teams) */
                    <div className="flex gap-x-10">
                        {/* Left Column (1-6) */}
                        <div className="flex-1 flex flex-col">
                            <LeaderboardHeader isPost={true} />
                            <div className="flex flex-col gap-y-2">
                                {displayEntries.slice(0, 6).map((entry, idx) => (
                                    <LeaderboardRow key={entry.team} entry={entry} index={idx} isPost={true} />
                                ))}
                            </div>
                        </div>
                        {/* Right Column (7-12) */}
                        <div className="flex-1 flex flex-col">
                            <LeaderboardHeader isPost={true} />
                            <div className="flex flex-col gap-y-2">
                                {displayEntries.slice(6, 12).map((entry, idx) => (
                                    <LeaderboardRow key={entry.team} entry={entry} index={idx + 6} isPost={true} />
                                ))}
                            </div>
                        </div>
                    </div>
                )
            ) : (
                /* SINGLE COLUMN FOR STORY */
                <div className="flex flex-col gap-3">
                    <LeaderboardHeader isPost={false} />
                    {displayEntries.map((entry, index) => (
                        <LeaderboardRow key={entry.team} entry={entry} index={index} isPost={false} />
                    ))}
                    
                    {entries.length > 12 && (
                        <div className="text-center pt-1">
                            <p className="font-heading font-black italic text-[#005596]/30 uppercase tracking-widest text-2xl">
                                + {entries.length - 12} more teams in {division}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>

        {/* Footer (Story only) */}
        {!isPost && (
            <div className="relative z-10 pt-8 pb-8 text-center mt-auto">
                <div className="w-48 h-2 bg-[#E0F2FE] mx-auto rounded-full mb-10" />
                <p className="font-heading font-black uppercase tracking-[0.4em] text-4xl text-[#005596]">
                    Corporate Pickleball League
                </p>
                <p className="font-heading font-black text-[#005596]/30 uppercase tracking-[0.2em] text-2xl mt-6">
                    PICKLEBALL.KY
                </p>
            </div>
        )}
    </div>
  );
};

/* Helper Header Component */
const LeaderboardHeader: React.FC<{ isPost: boolean; isSingleColumnPost?: boolean }> = ({ isPost, isSingleColumnPost }) => (
    <div className={clsx(
        "flex items-center text-[#005596]/40 font-heading font-bold uppercase tracking-widest",
        isPost ? (isSingleColumnPost ? "text-[11px] mb-1" : "text-[10px] mb-1") : "pt-4 pb-2 text-2xl"
    )}>
        <div className={clsx("text-center", isPost ? (isSingleColumnPost ? "w-16" : "w-14") : "w-24")}>#</div>
        <div className={clsx(
            "flex-1 flex items-center",
            isPost ? (isSingleColumnPost ? "pl-6 pr-6 ml-[-10px]" : "pl-5 pr-4 ml-[-8px]") : "pl-8 pr-6 ml-[-10px]"
        )}>
            <div className="flex-1">Team</div>
            <div className="flex items-center">
                <div className={clsx("text-center", isPost ? (isSingleColumnPost ? "w-24" : "w-14") : "w-32")}>W-L</div>
                <div className={clsx("text-center", isPost ? (isSingleColumnPost ? "w-24" : "w-12") : "w-32")}>%</div>
                <div className={clsx("text-center", isPost ? (isSingleColumnPost ? "w-20" : "w-14") : "w-24")}>DIFF</div>
            </div>
        </div>
    </div>
);

/* Helper Row Component for cleaner grid logic */
const LeaderboardRow: React.FC<{ entry: LeaderboardEntry, index: number, isPost: boolean, isSingleColumnPost?: boolean }> = ({ entry, index, isPost, isSingleColumnPost }) => {
    const diff = entry.pointsFor - entry.pointsAgainst;
    return (
        <div className={clsx("flex items-center group relative", isPost ? (isSingleColumnPost ? "h-[66px]" : "h-[65px]") : "h-24")}>
            {/* Rank Badge */}
            <div className={clsx("flex items-center justify-center relative z-20", isPost ? (isSingleColumnPost ? "w-16 h-[66px]" : "w-14 h-14") : "w-24 h-24")}>
                <span className={clsx(
                    "font-heading font-black italic transition-transform duration-300",
                    index === 0 ? "text-[#005596] drop-shadow-[2px_2px_0px_#FFC72C]" : 
                    index === 1 ? "text-[#005596]/60" :
                    index === 2 ? "text-[#005596]/40" : "text-[#005596]/20",
                    isPost ? (isSingleColumnPost ? "text-3xl" : "text-2xl") : "text-[80px] -ml-8"
                )}>
                    {index + 1}
                </span>
            </div>

            {/* Row Card */}
            <div className={clsx(
                "flex-1 h-full flex items-center bg-white border border-[#0F172A]/10 rounded-lg relative overflow-hidden z-10 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06)]",
                isPost ? (isSingleColumnPost ? "pl-8 pr-6 ml-[-10px]" : "pl-5 pr-4 ml-[-8px]") : "pl-12 pr-10 ml-[-20px]"
            )}>
                 {/* Team Name */}
                <div className="flex-1 pr-2">
                    <span className={clsx(
                        "font-heading font-black uppercase text-[#005596] tracking-tight line-clamp-1 leading-none",
                        isPost ? (isSingleColumnPost ? "text-2xl" : "text-xl") : "text-4xl"
                    )}>
                        {entry.team}
                    </span>
                </div>
                
                {/* Stats Columns */}
                <div className="flex items-center">
                    {/* W-L */}
                    <div className={clsx(
                        "text-center font-heading font-bold text-[#005596]/60",
                        isPost ? (isSingleColumnPost ? "w-24 text-xl" : "w-14 text-base") : "w-32 text-2xl"
                    )}>
                        {entry.wins}-{entry.losses}
                    </div>
                    
                    {/* % */}
                    <div className={clsx(
                        "text-center font-heading font-black italic tracking-tighter text-[#005596]",
                        isPost ? (isSingleColumnPost ? "text-2xl w-24" : "text-xl w-12") : "text-4xl w-32"
                    )}>
                        {(entry.winPct * 100).toFixed(0)}%
                    </div>

                    {/* DIFF */}
                    <div className={clsx(
                        "text-center font-heading font-black",
                        isPost ? (isSingleColumnPost ? "w-20 text-lg" : "w-14 text-sm") : "w-24 text-xl"
                    )}>
                        <span className={clsx(
                            "inline-block min-w-[44px] px-2 py-1 rounded-md uppercase tracking-wider",
                            diff > 0 ? "bg-green-100 text-green-700" : 
                            diff < 0 ? "bg-[#E31837]/10 text-[#E31837]" : 
                            "bg-gray-100 text-gray-400"
                        )}>
                            {diff > 0 ? '+' : ''}{diff}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
