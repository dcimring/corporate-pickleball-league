import React from 'react';
import { clsx } from 'clsx';
import type { LeaderboardEntry } from '../types';

interface ShareableLeaderboardProps {
  division: string;
  entries: LeaderboardEntry[];
}

export const ShareableLeaderboard: React.FC<ShareableLeaderboardProps> = ({ division, entries }) => {
  // Take top 5 for the graphic
  const topTeams = entries.slice(0, 5);

  return (
    <div 
      className="w-[1080px] h-[1350px] bg-[#FFFEFC] relative overflow-hidden flex flex-col font-body selection:none"
      style={{ fontFamily: "'Open Sans', sans-serif" }} // Ensure font is available
    >
        {/* Grainy Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.15] mix-blend-multiply z-0 pointer-events-none" 
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
        />

        {/* Decorative Background Elements */}
        <div className="absolute top-[-100px] right-[-100px] w-[600px] h-[600px] bg-[rgb(142,209,252)] rounded-full mix-blend-multiply opacity-20 blur-3xl animate-blob" />
        <div className="absolute bottom-[-100px] left-[-100px] w-[500px] h-[500px] bg-[rgb(247,191,38)] rounded-full mix-blend-multiply opacity-20 blur-3xl animate-blob animation-delay-2000" />
        
        {/* Header Section */}
        <div className="relative z-10 pt-24 px-16 pb-12 border-b-4 border-[rgb(0,85,150)]">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="font-heading font-black italic text-[rgb(0,85,150)] text-4xl tracking-widest uppercase mb-2">
                        Corporate Pickleball
                    </h2>
                    <h1 className="font-heading font-black italic text-[rgb(142,209,252)] text-8xl leading-[0.9] uppercase tracking-tighter drop-shadow-md">
                        {division}
                    </h1>
                </div>
                <div className="w-32 h-32 bg-[rgb(247,191,38)] rounded-full flex items-center justify-center transform rotate-12 shadow-lg border-4 border-white">
                     <span className="text-6xl">🥒</span>
                </div>
            </div>
            <div className="mt-8 flex items-center gap-4">
                 <div className="h-2 flex-1 bg-[rgb(0,85,150)] rounded-full" />
                 <span className="font-mono font-bold text-2xl text-gray-400 uppercase tracking-widest">Current Standings</span>
            </div>
        </div>

        {/* List Section */}
        <div className="flex-1 px-16 py-12 relative z-10 flex flex-col justify-center gap-6">
            {topTeams.map((entry, index) => (
                <div key={entry.team} className="flex items-center gap-8 group">
                    {/* Rank */}
                    <div className={clsx(
                        "w-24 h-24 flex items-center justify-center font-heading font-black text-5xl transform -skew-x-12 shadow-sm border-2 border-white",
                        index === 0 ? "bg-[rgb(247,191,38)] text-[rgb(0,85,150)]" : 
                        index === 1 ? "bg-gray-200 text-gray-600" :
                        index === 2 ? "bg-orange-100 text-orange-800" : "bg-white text-gray-400 border-gray-200"
                    )}>
                        <span className="skew-x-12">{index + 1}</span>
                    </div>

                    {/* Team Info */}
                    <div className="flex-1 bg-white/80 backdrop-blur-sm p-6 rounded-r-2xl border-l-8 border-[rgb(0,85,150)] shadow-sm flex justify-between items-center">
                        <span className="font-heading font-black italic text-4xl text-[rgb(0,85,150)] uppercase tracking-tight line-clamp-1">
                            {entry.team}
                        </span>
                        
                        <div className="flex items-center gap-8">
                            <div className="text-center">
                                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Win %</div>
                                <div className="font-heading font-black text-3xl text-[rgb(0,85,150)]">{(entry.winPct * 100).toFixed(0)}%</div>
                            </div>
                             <div className="text-center">
                                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Record</div>
                                <div className="font-mono font-bold text-2xl text-gray-600">{entry.wins}-{entry.losses}</div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            
            {entries.length > 5 && (
                <div className="text-center mt-4">
                    <span className="font-heading font-bold italic text-gray-400 text-2xl">...and {entries.length - 5} more teams</span>
                </div>
            )}
        </div>

        {/* Footer */}
        <div className="relative z-10 p-8 bg-[rgb(0,85,150)] text-white text-center">
             <p className="font-heading font-bold uppercase tracking-[0.3em] text-xl text-[rgb(142,209,252)]">
                Cayman Islands Corporate League
             </p>
        </div>
    </div>
  );
};
