import React, { useEffect, useState } from 'react';

export const TopFrame: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Cayman'
  });

  return (
    <div className="w-full bg-navy h-9 flex items-center justify-between px-4 md:px-[clamp(20px,4vw,56px)] border-b border-yellow/15 sticky top-0 z-[600] shrink-0">
      {/* Left Side: Status & Metadata */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-yellow shadow-[0_0_10px_rgba(255,201,60,0.8)] animate-pulse" />
          <span className="mono text-[10px] text-yellow/90 font-bold tracking-[0.25em] uppercase">Status: Optimal</span>
        </div>
        
        <div className="hidden sm:flex items-center gap-4">
          <div className="w-[1px] h-4 bg-white/10" />
          <span className="mono text-[10px] text-white/30 tracking-[0.2em] uppercase">Core.v2.6.5</span>
          <div className="w-[1px] h-4 bg-white/10" />
          <span className="mono text-[10px] text-white/30 tracking-[0.2em] uppercase">OFFICIAL.LEAGUE.PLATFORM</span>
        </div>
      </div>

      {/* Right Side: Location & Time */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-4">
          <span className="mono text-[10px] text-white/30 tracking-[0.2em] uppercase hidden xs:inline">GCM.LAT.19.31</span>
          <div className="w-[1px] h-4 bg-white/10 hidden xs:block" />
          <div className="flex items-center gap-2">
            <span className="mono text-[10px] text-white/40 tracking-[0.1em] uppercase">Local:</span>
            <span className="mono text-[10px] text-white/70 font-bold tracking-[0.15em]">{formattedTime}</span>
          </div>
        </div>
      </div>
      
      {/* Ultra-subtle bottom accent */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-yellow/30 to-transparent opacity-50" />
    </div>
  );
};
