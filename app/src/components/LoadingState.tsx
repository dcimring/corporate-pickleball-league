import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const messages = [
  "CALIBRATING THE COURT",
  "FETCHING MATCH INTEL",
  "TALLYING THE DIMPLES",
  "SCANNING THE BASELINE",
  "PREPARING THE KITCHEN"
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
    <div className="relative min-h-[600px] w-full flex flex-col items-center justify-center bg-surface overflow-hidden py-20">
      {/* Atmospheric Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative flex flex-col items-center gap-16">
        {/* The Bouncing Dimple */}
        <div className="relative h-24 flex items-end justify-center">
            {/* Shadow */}
            <motion.div 
                animate={{ 
                    scaleX: [1, 1.4, 1],
                    opacity: [0.1, 0.2, 0.1]
                }}
                transition={{ 
                    duration: 0.6, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                }}
                className="absolute bottom-[-10px] w-12 h-2 bg-secondary/20 rounded-full blur-sm"
            />

            {/* The Ball */}
            <motion.div
                animate={{ 
                    y: [0, -80, 0],
                    scaleY: [0.8, 1, 0.8],
                    scaleX: [1.2, 1, 1.2],
                    rotate: [0, 90, 180]
                }}
                transition={{ 
                    duration: 0.6, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                }}
                className="w-16 h-16 bg-primary rounded-full shadow-ambient flex items-center justify-center overflow-hidden relative"
            >
                {/* Dimples */}
                <div className="absolute top-2 left-2 w-3 h-3 bg-white/20 rounded-full" />
                <div className="absolute top-4 right-3 w-2 h-2 bg-white/30 rounded-full" />
                <div className="absolute bottom-3 left-4 w-4 h-4 bg-white/10 rounded-full" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white/40 rounded-full" />
            </motion.div>
        </div>

        {/* Messaging */}
        <div className="text-center space-y-6 relative z-10">
            <div className="h-10 overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.h2
                        key={msgIndex}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.4, ease: "circOut" }}
                        className="headline-md !text-xl md:!text-2xl text-secondary uppercase tracking-[0.25em]"
                    >
                        {messages[msgIndex]}
                    </motion.h2>
                </AnimatePresence>
            </div>
            
            {/* Progress Bar */}
            <div className="w-40 h-1 bg-secondary/5 rounded-full mx-auto overflow-hidden relative">
                <motion.div 
                    animate={{ x: [-160, 160] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-primary to-transparent"
                />
            </div>
        </div>
      </div>
    </div>
  );
};
