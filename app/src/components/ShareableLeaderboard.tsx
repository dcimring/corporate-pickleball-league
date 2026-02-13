import React from 'react';
import { clsx } from 'clsx';
import type { LeaderboardEntry } from '../types';

interface ShareableLeaderboardProps {
  division: string;
  entries: LeaderboardEntry[];
}

export const ShareableLeaderboard: React.FC<ShareableLeaderboardProps> = ({ division, entries }) => {
  return (
    <div 
      className="w-[1080px] min-h-[1350px] bg-[#FFFEFC] relative overflow-hidden flex flex-col font-body selection:none pb-8"
    >
        {/* Grainy Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.1] mix-blend-multiply z-0 pointer-events-none" 
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
        />

        {/* Decorative Background Elements - More subtle */}
        <div className="absolute top-[-200px] right-[-100px] w-[800px] h-[800px] bg-[rgb(142,209,252)] rounded-full mix-blend-multiply opacity-[0.15] blur-3xl" />
        <div className="absolute bottom-[-200px] left-[-100px] w-[600px] h-[600px] bg-[rgb(247,191,38)] rounded-full mix-blend-multiply opacity-[0.15] blur-3xl" />
        
        {/* Header Section */}
        <div className="relative z-10 pt-20 px-16 pb-8">
            <div className="border-b-[6px] border-[rgb(0,85,150)] pb-8">
                <h1 className="font-heading font-black italic text-[rgb(0,85,150)] text-6xl leading-[0.9] uppercase tracking-tighter mb-4">
                    Corporate<br/>Pickleball League
                </h1>
                <div className="flex items-center gap-6">
                    <span className="bg-[rgb(247,191,38)] text-[rgb(0,85,150)] px-6 py-2 rounded-full font-heading font-black italic text-2xl uppercase tracking-widest transform -skew-x-12 inline-block shadow-sm">
                        <span className="skew-x-12 inline-block">{division}</span>
                    </span>
                    <span className="font-mono font-bold text-gray-400 uppercase tracking-[0.2em] text-xl">Standings</span>
                </div>
            </div>
        </div>

        {/* Table Header */}
        <div className="px-16 pt-4 pb-2 flex items-center text-gray-400 font-heading font-black italic uppercase tracking-widest text-xl">
             <div className="w-20 text-center">#</div>
             <div className="flex-1 pl-6">Team</div>
             <div className="w-32 text-center">W-L</div>
             <div className="w-32 text-center">%</div>
             <div className="w-24 text-center">PTS</div>
        </div>

        {/* List Section */}
        <div className="flex-1 px-16 relative z-10 flex flex-col gap-3">
            {entries.map((entry, index) => (
                <div key={entry.team} className="flex items-center h-20 group relative">
                    {/* Rank Badge */}
                    <div className={clsx(
                        "w-20 h-full flex items-center justify-center font-heading font-black text-4xl italic z-10",
                        index === 0 ? "text-[rgb(247,191,38)] drop-shadow-md text-5xl" : 
                        index === 1 ? "text-gray-400" :
                        index === 2 ? "text-orange-300" : "text-gray-300"
                    )}>
                        {index + 1}
                    </div>

                    {/* Row Card */}
                    <div className={clsx(
                        "flex-1 h-full flex items-center bg-white border border-gray-100 shadow-sm rounded-r-xl relative overflow-hidden pl-6 pr-4",
                        index < 3 ? "border-l-[6px] border-l-[rgb(0,85,150)]" : "border-l-[6px] border-l-gray-200"
                    )}>
                         {/* Team Name */}
                        <div className="flex-1 pr-4">
                             <span className={clsx(
                                "font-heading font-black italic text-3xl uppercase tracking-tight line-clamp-1 leading-none",
                                index < 3 ? "text-[rgb(0,85,150)]" : "text-gray-600"
                             )}>
                                {entry.team}
                             </span>
                        </div>
                        
                        {/* Stats Columns */}
                        <div className="flex items-center">
                            {/* W-L */}
                            <div className="w-32 text-center font-mono font-bold text-2xl text-gray-600">
                                {entry.wins}-{entry.losses}
                            </div>
                            
                            {/* % */}
                            <div className={clsx(
                                "w-32 text-center font-heading font-black italic text-3xl tracking-tighter",
                                index < 3 ? "text-[rgb(0,85,150)]" : "text-gray-400"
                            )}>
                                {(entry.winPct * 100).toFixed(0)}%
                            </div>

                            {/* PTS */}
                            <div className="w-24 text-center font-mono font-bold text-2xl text-gray-500">
                                {entry.pointsFor}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        {/* Footer */}
        <div className="relative z-10 pt-12 pb-8 text-center mt-auto">
             <div className="w-32 h-1 bg-gray-200 mx-auto rounded-full mb-6" />
             <p className="font-heading font-bold uppercase tracking-[0.3em] text-xl text-gray-400">
                Corporate Pickleball League
             </p>
        </div>
    </div>
  );
};
