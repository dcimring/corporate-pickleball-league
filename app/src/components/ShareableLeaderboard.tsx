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
  
  // Limit entries for post layout to keep it clean (top 5 usually fits well in 630px height)
  const displayEntries = isPost ? entries.slice(0, 5) : entries.slice(0, 10);

  return (
    <div 
      className={clsx(
        "bg-[#FFFEFC] relative overflow-hidden flex flex-col font-body selection:none",
        isPost ? "w-[1200px] h-[630px] p-8" : "w-[1080px] h-[1920px] pb-12"
      )}
    >
        {/* Grainy Texture Overlay - Slightly more visible for character */}
        <div className="absolute inset-0 opacity-[0.02] mix-blend-multiply z-0 pointer-events-none" 
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
        />

        {/* Decorative Background Elements */}
        <div className={clsx(
            "absolute rounded-full mix-blend-multiply blur-3xl",
            isPost 
                ? "top-[-100px] right-[-50px] w-[400px] h-[400px] bg-[rgb(142,209,252)] opacity-[0.05]" 
                : "top-[-200px] right-[-100px] w-[800px] h-[800px] bg-[rgb(142,209,252)] opacity-[0.03]"
        )} />
        <div className={clsx(
            "absolute rounded-full mix-blend-multiply blur-3xl",
            isPost 
                ? "bottom-[-100px] left-[-50px] w-[300px] h-[300px] bg-[rgb(247,191,38)] opacity-[0.06]" 
                : "bottom-[-200px] left-[-100px] w-[600px] h-[600px] bg-[rgb(247,191,38)] opacity-[0.04]"
        )} />
        
        {/* Header Section */}
        <div className={clsx("relative z-10", isPost ? "mb-6" : "pt-24 px-12 pb-4")}>
            <div className={clsx("border-[rgb(0,85,150)]", isPost ? "border-b-4 pb-4 flex justify-between items-end" : "border-b-[6px] pb-4")}>
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
                        <p className="font-heading font-black uppercase tracking-[0.2em] text-sm text-gray-400">
                           Corporate Pickleball League
                        </p>
                    </div>
                )}
            </div>
        </div>

        {/* Table Header */}
        <div className={clsx(
            "flex items-center text-gray-500 font-heading font-black italic uppercase tracking-widest",
            isPost ? "px-4 pt-2 pb-1 text-lg" : "px-12 pt-4 pb-2 text-2xl"
        )}>
             <div className={clsx("text-center", isPost ? "w-16" : "w-24")}>{/* Rank */}</div>
             <div className="flex-1 flex items-center ml-[-10px] pl-8 pr-6">
                 <div className="flex-1">Team</div>
                 <div className={clsx("text-center", isPost ? "w-24" : "w-36")}>W-L</div>
                 <div className={clsx("text-center", isPost ? "w-24" : "w-36")}>%</div>
                 <div className={clsx("text-center", isPost ? "w-20" : "w-28")}>PTS</div>
             </div>
        </div>

        {/* List Section */}
        <div className={clsx("relative z-10 flex flex-col", isPost ? "px-4 gap-2" : "flex-1 px-12 gap-4")}>
            {displayEntries.map((entry, index) => (
                <div key={entry.team} className={clsx("flex items-center group relative", isPost ? "h-16" : "h-24")}>
                    {/* Rank Badge */}
                    <div className={clsx("flex items-center justify-center relative z-20", isPost ? "w-16 h-16" : "w-24 h-24")}>
                        {index < 3 ? (
                            <div className={clsx(
                                "w-full h-full flex items-center justify-center font-heading font-black transform -skew-x-12 border-2 border-white",
                                index === 0 ? "bg-[rgb(247,191,38)] text-[rgb(0,85,150)]" : 
                                index === 1 ? "bg-gray-200 text-gray-700" :
                                "bg-orange-100 text-orange-900",
                                isPost ? "text-2xl" : "text-4xl"
                            )}>
                                <span className="skew-x-12">{index + 1}</span>
                            </div>
                        ) : (
                            <span className={clsx("font-heading font-black text-gray-300", isPost ? "text-2xl" : "text-4xl")}>
                                {index + 1}
                            </span>
                        )}
                    </div>

                    {/* Row Card */}
                    <div className="flex-1 h-full flex items-center bg-white border border-gray-100 rounded-r-2xl relative overflow-hidden pl-8 pr-6 ml-[-10px] z-10 shadow-none">
                         {/* Team Name */}
                        <div className="flex-1 pr-4">
                             <span className={clsx(
                                "font-heading font-black italic text-[rgb(0,85,150)] uppercase tracking-tight line-clamp-1 leading-none",
                                isPost ? "text-2xl" : "text-4xl"
                             )}>
                                {entry.team}
                             </span>
                        </div>
                        
                        {/* Stats Columns */}
                        <div className="flex items-center">
                            {/* W-L */}
                            <div className={clsx(
                                "text-center font-mono font-black text-gray-700",
                                isPost ? "w-24 text-xl" : "w-36 text-3xl"
                            )}>
                                {entry.wins}-{entry.losses}
                            </div>
                            
                            {/* % */}
                            <div className={clsx(
                                "text-center font-heading font-black italic tracking-tighter",
                                index < 3 ? "text-[rgb(0,85,150)]" : "text-gray-500",
                                isPost ? "w-24 text-2xl" : "w-36 text-4xl"
                            )}>
                                {(entry.winPct * 100).toFixed(0)}%
                            </div>

                            {/* PTS */}
                            <div className={clsx(
                                "text-center font-mono font-black text-gray-600",
                                isPost ? "w-20 text-xl" : "w-28 text-3xl"
                            )}>
                                {entry.pointsFor}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            
            {isPost && entries.length > 5 && (
                <div className="text-center pt-2">
                    <p className="font-heading font-black italic text-gray-400 uppercase tracking-widest text-sm">
                        + {entries.length - 5} more teams in {division}
                    </p>
                </div>
            )}
        </div>

        {/* Footer (Story only) */}
        {!isPost && (
            <div className="relative z-10 pt-16 pb-12 text-center mt-auto">
                <div className="w-48 h-2 bg-[rgb(142,209,252)] mx-auto rounded-full mb-8" />
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
