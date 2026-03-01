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
  
  // Post: 12 entries (630px, 2 columns), Story: 12 entries (1920px)
  const displayEntries = entries.slice(0, 12);

  return (
    <div 
      className={clsx(
        "bg-[#FFFEFC] relative overflow-hidden flex flex-col font-body selection:none",
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
        <div className="absolute inset-0 opacity-[0.02] mix-blend-multiply z-0 pointer-events-none" 
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
        />

        {/* Decorative Background Elements */}
        <div className={clsx(
            "absolute rounded-full mix-blend-multiply blur-3xl",
            isPost 
                ? "top-[-80px] right-[-40px] w-[350px] h-[350px] bg-[rgb(142,209,252)] opacity-[0.05]" 
                : "top-[-200px] right-[-100px] w-[800px] h-[800px] bg-[rgb(142,209,252)] opacity-[0.03]"
        )} />
        <div className={clsx(
            "absolute rounded-full mix-blend-multiply blur-3xl",
            isPost 
                ? "bottom-[-80px] left-[-40px] w-[250px] h-[250px] bg-[rgb(247,191,38)] opacity-[0.06]" 
                : "bottom-[-200px] left-[-100px] w-[600px] h-[600px] bg-[rgb(247,191,38)] opacity-[0.04]"
        )} />
        
        {/* Header Section */}
        <div className={clsx("relative z-10", isPost ? "mb-4" : "pt-16 px-12 pb-4")}>
            <div className={clsx("border-[rgb(0,85,150)]", isPost ? "border-b-4 pb-3 flex justify-between items-end" : "border-b-[6px] pb-4")}>
                <div>
                    <h1 className={clsx(
                        "font-heading font-black italic text-[rgb(0,85,150)] uppercase tracking-tighter leading-[0.9]",
                        isPost ? "text-5xl" : "text-8xl mb-0"
                    )}>
                        {isPost ? (
                            <>La Roche Posay<br/>Pickleball League</>
                        ) : (
                            <>La Roche Posay<br/>Corporate<br/>Pickleball League</>
                        )}
                    </h1>
                    {isPost && (
                         <div className="flex items-center gap-4 mt-2">
                            <div className="bg-[rgb(247,191,38)] text-[rgb(0,85,150)] px-6 py-2 rounded-full font-heading font-black italic text-xl uppercase tracking-widest transform -skew-x-12 border-2 border-white">
                                <span className="skew-x-12 block">{division}</span>
                            </div>
                            <span className="font-mono font-black text-gray-500 uppercase tracking-[0.2em] text-xl">Standings</span>
                         </div>
                    )}
                </div>
                {!isPost && (
                    <div className="flex items-center gap-6 mt-6">
                        <div className="bg-[rgb(247,191,38)] text-[rgb(0,85,150)] px-10 py-4 rounded-full font-heading font-black italic text-4xl uppercase tracking-widest transform -skew-x-12 flex items-center border-2 border-white">
                            <span className="skew-x-12 block">{division}</span>
                        </div>
                        <span className="font-mono font-black text-gray-500 uppercase tracking-[0.2em] text-3xl">Standings</span>
                    </div>
                )}
                {isPost && (
                    <div className="text-right pb-1">
                        <p className="font-heading font-black uppercase tracking-[0.4em] text-base text-[rgb(0,85,150)] mb-1">
                           PICKLEBALL.KY
                        </p>
                        <p className="font-heading font-black uppercase tracking-[0.2em] text-xs text-gray-400">
                           Corporate Pickleball League
                        </p>
                    </div>
                )}
            </div>
        </div>

        {/* List Section */}
        <div className={clsx("relative z-10 flex flex-col flex-1", isPost ? "" : "px-12")}>
            {isPost ? (
                /* TWO COLUMN GRID FOR POST - 1-6 left, 7-12 right */
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
            ) : (
                /* SINGLE COLUMN FOR STORY */
                <div className="flex flex-col gap-3">
                    <LeaderboardHeader isPost={false} />
                    {displayEntries.map((entry, index) => (
                        <LeaderboardRow key={entry.team} entry={entry} index={index} isPost={false} />
                    ))}
                    
                    {entries.length > 12 && (
                        <div className="text-center pt-1">
                            <p className="font-heading font-black italic text-gray-400 uppercase tracking-widest text-lg">
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
                <div className="w-48 h-2 bg-[rgb(142,209,252)] mx-auto rounded-full mb-6" />
                <p className="font-heading font-black uppercase tracking-[0.4em] text-3xl text-[rgb(0,85,150)]">
                    Corporate Pickleball League
                </p>
                <p className="font-mono font-black text-gray-400 uppercase tracking-[0.2em] text-xl mt-4">
                    PICKLEBALL.KY
                </p>
            </div>
        )}
    </div>
  );
};

/* Helper Header Component */
const LeaderboardHeader: React.FC<{ isPost: boolean }> = ({ isPost }) => (
    <div className={clsx(
        "flex items-center text-gray-500 font-heading font-black italic uppercase tracking-widest",
        isPost ? "text-[10px] mb-1" : "pt-4 pb-2 text-xl"
    )}>
        <div className={clsx("text-center", isPost ? "w-14" : "w-24")}>{/* Rank Space */}</div>
        <div className={clsx(
            "flex-1 flex items-center",
            isPost ? "pl-5 pr-4 ml-[-8px]" : "pl-8 pr-6 ml-[-10px]"
        )}>
            <div className="flex-1">Team</div>
            <div className="flex items-center">
                <div className={clsx("text-center", isPost ? "w-14" : "w-32")}>W-L</div>
                <div className={clsx("text-center", isPost ? "w-12" : "w-32")}>%</div>
                <div className={clsx("text-center", isPost ? "w-14" : "w-24")}>PTS</div>
            </div>
        </div>
    </div>
);

/* Helper Row Component for cleaner grid logic */
const LeaderboardRow: React.FC<{ entry: LeaderboardEntry, index: number, isPost: boolean }> = ({ entry, index, isPost }) => {
    return (
        <div className={clsx("flex items-center group relative", isPost ? "h-[65px]" : "h-20")}>
            {/* Rank Badge */}
            <div className={clsx("flex items-center justify-center relative z-20", isPost ? "w-14 h-14" : "w-24 h-20")}>
                {index < 3 ? (
                    <div className={clsx(
                        "w-full h-full flex items-center justify-center font-heading font-black transform -skew-x-12 border-2 border-white",
                        index === 0 ? "bg-[rgb(247,191,38)] text-[rgb(0,85,150)]" : 
                        index === 1 ? "bg-gray-200 text-gray-700" :
                        "bg-orange-100 text-orange-900",
                        isPost ? "text-2xl" : "text-3xl"
                    )}>
                        <span className="skew-x-12">{index + 1}</span>
                    </div>
                ) : (
                    <span className={clsx("font-heading font-black text-gray-300", isPost ? "text-2xl" : "text-3xl")}>
                        {index + 1}
                    </span>
                )}
            </div>

            {/* Row Card */}
            <div className={clsx(
                "flex-1 h-full flex items-center bg-white border border-gray-100 rounded-r-2xl relative overflow-hidden z-10 shadow-none",
                isPost ? "pl-5 pr-4 ml-[-8px]" : "pl-8 pr-6 ml-[-10px]"
            )}>
                 {/* Team Name */}
                <div className="flex-1 pr-2">
                     <span className={clsx(
                        "font-heading font-black italic text-[rgb(0,85,150)] uppercase tracking-tight line-clamp-1 leading-none",
                        isPost ? "text-xl" : "text-3xl"
                     )}>
                        {entry.team}
                     </span>
                </div>
                
                {/* Stats Columns */}
                <div className="flex items-center">
                    {/* W-L */}
                    <div className={clsx(
                        "text-center font-mono font-black text-gray-700",
                        isPost ? "w-14 text-base" : "w-32 text-2xl"
                    )}>
                        {entry.wins}-{entry.losses}
                    </div>
                    
                    {/* % */}
                    <div className={clsx(
                        "text-center font-heading font-black italic tracking-tighter",
                        index < 3 ? "text-[rgb(0,85,150)]" : "text-gray-500",
                        isPost ? "w-12 text-lg" : "w-32 text-3xl"
                    )}>
                        {(entry.winPct * 100).toFixed(0)}%
                    </div>

                    {/* PTS */}
                    <div className={clsx(
                        "text-center font-mono font-black text-gray-600",
                        isPost ? "w-14 text-base" : "w-24 text-2xl"
                    )}>
                        {entry.pointsFor}
                    </div>
                </div>
            </div>
        </div>
    );
};
