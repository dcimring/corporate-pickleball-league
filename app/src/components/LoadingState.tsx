import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const messages = [
  "CALIBRATING THE COURT...",
  "FETCHING TOURNAMENT INTEL...",
  "TALLYING THE DIMPLES...",
  "SCANNING THE BASELINE...",
  "PREPARING THE KITCHEN..."
];

export const LoadingState: React.FC = () => {
  const [msgIndex, setMsgIndex] = useState(0);

  const isIframe = React.useMemo(() => {
    try {
      return window.self !== window.top;
    } catch {
      return true;
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % messages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`relative w-full flex flex-col items-center justify-center bg-transparent overflow-hidden py-32 ${!isIframe ? 'min-h-[80vh]' : ''}`}>
      
      <div className="relative flex flex-col items-center gap-12 max-w-2xl px-8">
        {/* The Hero Loading Object: Bouncing Pickleball */}
        <div className="relative h-48 flex flex-col items-center justify-end w-full">
            
            {/* Pickleball */}
            <motion.div
                animate={{ 
                    y: [0, -120, 0],
                    scaleY: [1, 0.9, 1.1, 1], // Squash and stretch
                    rotate: [0, 90, 180, 270, 360]
                }}
                transition={{ 
                    duration: 0.8, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                }}
                className="w-16 h-16 bg-yellow rounded-full shadow-[0_12px_24px_-8px_rgba(255,201,60,0.5)] relative z-10 flex items-center justify-center p-3 overflow-hidden"
            >
                {/* Pickleball Holes (Pattern) */}
                <div className="grid grid-cols-3 gap-2 opacity-20">
                    {[...Array(9)].map((_, i) => (
                        <div key={i} className="w-1.5 h-1.5 bg-navy rounded-full" />
                    ))}
                </div>
                
                {/* Subtle highlight */}
                <div className="absolute top-2 left-2 w-4 h-4 bg-white/30 rounded-full blur-[2px]" />
            </motion.div>

            {/* Shadow */}
            <motion.div 
                animate={{
                    scaleX: [1, 0.4, 1],
                    opacity: [0.2, 0.05, 0.2]
                }}
                transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="w-14 h-2 bg-navy/20 rounded-full blur-[4px] mt-2"
            />
        </div>

        {/* Messaging - Editorial Rhythm */}
        <div className="text-center space-y-6 relative z-10">
            <div className="flex flex-col items-center gap-2">
                <span className="mono text-[10px] text-navy-faint font-bold tracking-[0.3em] uppercase">
                    System Synchronization
                </span>
                <div className="w-8 h-[2px] bg-yellow rounded-full" />
            </div>
            
            <div className="h-12 overflow-hidden flex items-center justify-center">
                <AnimatePresence mode="wait">
                    <motion.h2
                        key={msgIndex}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.4, ease: "circOut" }}
                        className="font-display font-black text-navy text-2xl md:text-3xl uppercase tracking-tight"
                    >
                        {messages[msgIndex]}
                    </motion.h2>
                </AnimatePresence>
            </div>
            
            {/* Progress Micro-Bar */}
            <div className="w-48 h-[2px] bg-navy/5 mx-auto overflow-hidden relative rounded-full">
                <motion.div 
                    animate={{ x: [-192, 192] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 w-24 bg-gradient-to-r from-transparent via-yellow to-transparent"
                />
            </div>

            <p className="mono text-[9px] text-navy-faint opacity-40 uppercase tracking-[0.2em]">
                Live Feed • Cayman Premier League
            </p>
        </div>
      </div>
    </div>
  );
};
