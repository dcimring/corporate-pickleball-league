import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const messages = [
  "CALIBRATING THE COURT...",
  "FETCHING MATCH INTEL...",
  "TALLYING THE DIMPLES...",
  "SCANNING THE BASELINE...",
  "PREPARING THE KITCHEN..."
];

export const LoadingState: React.FC = () => {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % messages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-brand-cream/95 backdrop-blur-sm overflow-hidden">
      {/* Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
      />

      {/* Atmospheric Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-blue/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative flex flex-col items-center gap-12">
        {/* The Bouncing Dimple */}
        <div className="relative h-24 flex items-end justify-center">
            {/* Shadow */}
            <motion.div 
                animate={{ 
                    scaleX: [1, 1.4, 1],
                    opacity: [0.2, 0.4, 0.2]
                }}
                transition={{ 
                    duration: 0.6, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                }}
                className="absolute bottom-[-10px] w-12 h-2 bg-brand-blue/20 rounded-full blur-sm"
            />

            {/* The Ball */}
            <motion.div
                animate={{ 
                    y: [0, -60, 0],
                    scaleY: [0.8, 1, 0.8],
                    scaleX: [1.2, 1, 1.2],
                    rotate: [0, 90, 180]
                }}
                transition={{ 
                    duration: 0.6, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                }}
                className="w-16 h-16 bg-brand-blue rounded-full border-4 border-white shadow-xl flex items-center justify-center overflow-hidden relative"
            >
                {/* Dimples */}
                <div className="absolute top-2 left-2 w-3 h-3 bg-white/20 rounded-full" />
                <div className="absolute top-4 right-3 w-2 h-2 bg-white/30 rounded-full" />
                <div className="absolute bottom-3 left-4 w-4 h-4 bg-white/10 rounded-full" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white/40 rounded-full" />
                
                {/* Skew lines */}
                <div className="absolute inset-0 border-t-2 border-white/5 transform -skew-y-12" />
            </motion.div>
        </div>

        {/* Messaging */}
        <div className="text-center space-y-3 relative z-10">
            <div className="h-8 overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.h2
                        key={msgIndex}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.4, ease: "circOut" }}
                        className="font-heading font-black italic text-brand-blue text-2xl md:text-3xl tracking-[0.15em] uppercase"
                    >
                        {messages[msgIndex]}
                    </motion.h2>
                </AnimatePresence>
            </div>
            
            {/* Progress Bar */}
            <div className="w-48 h-1 bg-brand-blue/10 rounded-full mx-auto overflow-hidden relative">
                <motion.div 
                    animate={{ x: [-200, 200] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 w-1/2 bg-brand-yellow rounded-full shadow-[0_0_10px_rgba(255,199,44,0.5)]"
                />
            </div>
        </div>
      </div>
    </div>
  );
};
