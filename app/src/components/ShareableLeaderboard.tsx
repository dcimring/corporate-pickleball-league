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
        background: 'linear-gradient(to bottom, #ffffff 0%, #f7f9fb 15%, #f7f9fb 85%, #ffffff 100%)'
      }}
    >
        {/* Magazine Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.05] z-0 pointer-events-none" 
            style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/stardust.png")` }} 
        />

        {isPost ? (
            /* Post Layout (Landscape) - REFACTORED TO TOP MASTHEAD + BOTTOM COLUMNS */
            <div className="relative z-10 flex flex-col h-full items-center">
                
                {/* Top Section: Masthead */}
                <div className="w-full flex justify-between items-start mb-10 pt-2 px-8">
                    <div className="flex flex-col items-start gap-4">
                         <h1 className="font-display font-black text-[#005a87] text-[64px] uppercase tracking-tighter leading-none">
                            LA ROCHE POSAY PICKLEBALL LEAGUE
                        </h1>
                        <div className="flex items-center gap-4 mt-2">
                             <div className="w-12 h-1.5 bg-[#ffc72c]" />
                             <p className="font-stat font-black tracking-[0.4em] text-[#005a87] opacity-60 uppercase text-xs">
                                OFFICIAL STANDINGS
                             </p>
                        </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-6">
                        <div className="bg-[#ffc72c] text-[#005a87] px-6 py-2 font-display font-black uppercase tracking-widest text-2xl shadow-sm">
                            {division}
                        </div>
                        <p className="font-stat font-black uppercase tracking-[0.4em] text-xl text-[#005a87] opacity-40">
                            PICKLEBALL.KY
                        </p>
                    </div>
                </div>

                {/* Bottom Section: Leaderboard Columns */}
                <div className="w-full flex-1 flex flex-col gap-0 px-8">
                    {isSingleColumnPost ? (
                        <div className="max-w-[900px] w-full mx-auto flex flex-col">
                            <LeaderboardHeader isPost={true} />
                            <div className="flex flex-col border border-[#005a87]/5">
                                {displayEntries.map((entry, idx) => (
                                    <LeaderboardRow key={entry.team} entry={entry} index={idx} isPost={true} />
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="w-full flex gap-x-12">
                            <div className="flex-1 flex flex-col">
                                <LeaderboardHeader isPost={true} />
                                <div className="flex flex-col border border-[#005a87]/5">
                                    {displayEntries.slice(0, 6).map((entry, idx) => (
                                        <LeaderboardRow key={entry.team} entry={entry} index={idx} isPost={true} />
                                    ))}
                                </div>
                            </div>
                            <div className="flex-1 flex flex-col">
                                <LeaderboardHeader isPost={true} />
                                <div className="flex flex-col border border-[#005a87]/5">
                                    {displayEntries.slice(6, 12).map((entry, idx) => (
                                        <LeaderboardRow key={entry.team} entry={entry} index={idx + 6} isPost={true} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        ) : (
            /* Story Layout (Portrait) */
            <div className="flex flex-col justify-start items-center relative z-10 px-8 pt-20 pb-16 flex-1">
                {/* Masthead - Tighter leading and smaller margin */}
                <div className="text-center space-y-2 mb-10">
                    <h1 className="font-display font-black text-[#005a87] text-[100px] uppercase tracking-tighter leading-[0.75] flex flex-col">
                        <span>LA ROCHE</span>
                        <span>POSAY</span>
                        <span>PICKLEBALL</span>
                        <span>LEAGUE</span>
                    </h1>
                    
                    <div className="flex flex-col items-center gap-4 pt-2">
                        <div className="w-40 h-1.5 bg-[#ffc72c]" />
                        <p className="font-stat font-black tracking-[0.5em] text-[#005a87] opacity-60 uppercase text-2xl">
                            OFFICIAL STANDINGS
                        </p>
                    </div>

                    <div className="bg-[#ffc72c] text-[#005a87] px-6 py-2 font-display font-black uppercase tracking-widest text-2xl mt-8 inline-block">
                        {division}
                    </div>
                </div>

                {/* List Section - Reduced internal padding to fit more */}
                <div className="w-full flex flex-col">
                    <LeaderboardHeader isPost={false} />
                    {displayEntries.map((entry, index) => (
                        <LeaderboardRow key={entry.team} entry={entry} index={index} isPost={false} />
                    ))}
                    
                    {entries.length > 12 && (
                        <div className="text-center pt-6">
                            <p className="font-display font-black text-[#005a87] opacity-20 uppercase tracking-widest text-2xl">
                                + {entries.length - 12} MORE TEAMS IN DIVISION
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer Story */}
                <div className="mt-auto pt-16">
                     <p className="font-stat font-black uppercase tracking-[0.6em] text-4xl text-[#005a87] opacity-40">
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
        "flex items-center text-[#005a87] opacity-50 font-stat font-bold uppercase tracking-[0.2em]",
        isPost ? "text-xs py-2 px-4 bg-[#005a87]/5" : "text-2xl py-6 px-6 bg-[#005a87]/5"
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

const LeaderboardRow: React.FC<{ entry: LeaderboardEntry, index: number, isPost: boolean }> = ({ entry, index, isPost }) => {
    return (
        <div className={clsx(
            "flex items-center relative transition-colors",
            isPost ? "h-[46px] px-4 border-b border-[#005a87]/5 last:border-b-0" : "h-[90px] px-6",
            index % 2 === 0 ? "bg-[#ffffff]" : "bg-[#f2f4f6]"
        )}>
            {/* Rank */}
            <div className={clsx("flex items-center justify-center font-display font-black", isPost ? "w-10 text-2xl" : "w-20 text-5xl")}>
                <span className={clsx(
                    index === 0 ? "text-[#005a87]" : 
                    index === 1 ? "text-[#005a87]/70" :
                    index === 2 ? "text-[#005a87]/50" : "text-[#005a87]/20"
                )}>
                    {index + 1}
                </span>
            </div>

            {/* Team Name */}
            <div className="flex-1 pl-4 pr-2">
                <span className={clsx(
                    "font-display font-black uppercase text-[#005a87] tracking-tight leading-none block truncate",
                    isPost ? "text-lg" : "text-4xl"
                )}>
                    {entry.team}
                </span>
            </div>
            
            {/* Stats Columns */}
            <div className="flex items-center gap-2 md:gap-6">
                <div className={clsx(
                    "text-center font-stat font-bold text-[#005a87] opacity-60",
                    isPost ? "w-16 text-[15px]" : "w-32 text-3xl"
                )}>
                    {entry.wins}-{entry.losses}
                </div>
                
                <div className={clsx(
                    "text-center font-stat font-black text-[#005a87]",
                    isPost ? "text-lg w-16" : "text-4xl w-32"
                )}>
                    {(entry.winPct * 100).toFixed(0)}%
                </div>

                <div className={clsx(
                    "text-center font-stat font-black text-[#005a87]/60",
                    isPost ? "w-12 text-[15px]" : "w-32 text-3xl"
                )}>
                    {entry.pointsFor}
                </div>
            </div>
        </div>
    );
};