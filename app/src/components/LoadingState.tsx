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
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-surface overflow-hidden py-32">
      {/* Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-multiply" 
           style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/stardust.png")` }} 
      />

      {/* Atmospheric Layout Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
      <div className="absolute bottom-0 left-0 w-full h-20 bg-surface-container-low" />

      <div className="relative flex flex-col items-center gap-20 max-w-2xl px-8">
        {/* The Hero Loading Object */}
        <div className="relative h-48 flex items-center justify-center w-full">
            {/* Background Stadium Voice */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <h1 className="display-lg text-primary opacity-5 scale-150 rotate-[-15deg] whitespace-nowrap">
                    LOADING
                </h1>
            </div>

            {/* The Animated Element */}
            <motion.div
                animate={{ 
                    y: [0, -40, 0],
                    rotate: [0, 90, 180, 270, 360]
                }}
                transition={{ 
                    duration: 1.2, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                }}
                className="w-24 h-24 bg-primary flex items-center justify-center shadow-ambient relative z-10"
                style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}
            >
                <div className="w-8 h-8 bg-secondary" />
            </motion.div>
        </div>

        {/* Messaging - Editorial Rhythm */}
        <div className="text-center space-y-8 relative z-10">
            <p className="label-md text-secondary font-black tracking-[0.3em]">
                EDITORIAL IN PROGRESS
            </p>
            
            <div className="h-16 overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.h2
                        key={msgIndex}
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -30, opacity: 0 }}
                        transition={{ duration: 0.6, ease: "circOut" }}
                        className="display-sm text-primary uppercase"
                    >
                        {messages[msgIndex]}
                    </motion.h2>
                </AnimatePresence>
            </div>
            
            {/* Editorial Progress Line */}
            <div className="w-64 h-1 bg-surface-container-highest mx-auto overflow-hidden relative">
                <motion.div 
                    animate={{ x: [-256, 256] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 w-32 bg-primary"
                />
            </div>

            <p className="body-md text-on-surface-variant opacity-40 uppercase tracking-widest">
                Official Tournament Records
            </p>
        </div>
      </div>
    </div>
  );
};
