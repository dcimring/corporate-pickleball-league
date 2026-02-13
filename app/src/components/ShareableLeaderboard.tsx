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
        {/* Grainy Texture Overlay - Very Subtle */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-multiply z-0 pointer-events-none" 
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
        />

        {/* Decorative Background Elements - Extremely Subtle */}
        <div className="absolute top-[-200px] right-[-100px] w-[800px] h-[800px] bg-[rgb(142,209,252)] rounded-full mix-blend-multiply opacity-[0.05] blur-3xl" />
        <div className="absolute bottom-[-200px] left-[-100px] w-[600px] h-[600px] bg-[rgb(247,191,38)] rounded-full mix-blend-multiply opacity-[0.08] blur-3xl" />
        
        {/* Header Section */}
        <div className="relative z-10 pt-20 px-12 pb-8">
            <div className="border-b-[6px] border-[rgb(0,85,150)] pb-8">
                <h1 className="font-heading font-black italic text-[rgb(0,85,150)] text-7xl leading-[0.9] uppercase tracking-tighter mb-6">
                    La Roche Posay<br/>Corporate Pickleball League
                </h1>
                <div className="flex items-center gap-6">
                    <span className="bg-[rgb(247,191,38)] text-[rgb(0,85,150)] px-10 py-4 rounded-full font-heading font-black italic text-4xl uppercase tracking-widest transform -skew-x-12 inline-block border-2 border-white">
                        <span className="skew-x-12 inline-block">{division}</span>
                    </span>
                    <span className="font-mono font-bold text-gray-400 uppercase tracking-[0.2em] text-3xl">Standings</span>
                </div>
            </div>
        </div>

        {/* Table Header */}
        <div className="px-12 pt-4 pb-2 flex items-center text-gray-400 font-heading font-black italic uppercase tracking-widest text-2xl">
             <div className="w-24 text-center">{/* Empty for Rank */}</div>
             
             {/* Header matching Row Card structure exactly for perfect alignment */}
             <div className="flex-1 flex items-center ml-[-10px] pl-8 pr-6 border border-transparent">
                 <div className="flex-1">Team</div>
                 <div className="w-36 text-center">W-L</div>
                 <div className="w-36 text-center">%</div>
                 <div className="w-28 text-center">PTS</div>
             </div>
        </div>

        {/* List Section */}
        <div className="flex-1 px-12 relative z-10 flex flex-col gap-4">
            {entries.map((entry, index) => (
                <div key={entry.team} className="flex items-center h-24 group relative">
                    {/* Rank Badge */}
                    <div className="w-24 h-24 flex items-center justify-center relative z-20">
                        {index < 3 ? (
                            <div className={clsx(
                                "w-full h-full flex items-center justify-center font-heading font-black text-4xl transform -skew-x-12 border-2 border-white",
                                index === 0 ? "bg-[rgb(247,191,38)] text-[rgb(0,85,150)]" : 
                                index === 1 ? "bg-gray-200 text-gray-600" :
                                "bg-orange-100 text-orange-800"
                            )}>
                                <span className="skew-x-12">{index + 1}</span>
                            </div>
                        ) : (
                            <span className="font-heading font-black text-4xl text-gray-300">
                                {index + 1}
                            </span>
                        )}
                    </div>

                    {/* Row Card */}
                    <div className="flex-1 h-full flex items-center bg-white border border-gray-100 rounded-r-2xl relative overflow-hidden pl-8 pr-6 ml-[-10px] z-10">
                         {/* Team Name */}
                        <div className="flex-1 pr-4">
                             <span className="font-heading font-black italic text-4xl text-[rgb(0,85,150)] uppercase tracking-tight line-clamp-1 leading-none">
                                {entry.team}
                             </span>
                        </div>
                        
                        {/* Stats Columns */}
                        <div className="flex items-center">
                            {/* W-L */}
                            <div className="w-36 text-center font-mono font-bold text-3xl text-gray-600">
                                {entry.wins}-{entry.losses}
                            </div>
                            
                            {/* % */}
                            <div className={clsx(
                                "w-36 text-center font-heading font-black italic text-4xl tracking-tighter",
                                index < 3 ? "text-[rgb(0,85,150)]" : "text-gray-400"
                            )}>
                                {(entry.winPct * 100).toFixed(0)}%
                            </div>

                            {/* PTS */}
                            <div className="w-28 text-center font-mono font-bold text-3xl text-gray-500">
                                {entry.pointsFor}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        {/* Footer */}
        <div className="relative z-10 pt-16 pb-12 text-center mt-auto">
             <div className="w-48 h-1.5 bg-gray-200 mx-auto rounded-full mb-8" />
             <p className="font-heading font-bold uppercase tracking-[0.3em] text-2xl text-gray-400">
                Corporate Pickleball League
             </p>
        </div>
    </div>
  );
};
