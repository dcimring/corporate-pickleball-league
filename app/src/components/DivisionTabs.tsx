import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface DivisionTabsProps {
  divisions: string[];
  activeDivision: string;
  onChange: (division: string) => void;
  variant?: 'underline' | 'segmented' | 'block';
}

const shortenDivisionName = (name: string) => {
  if (name === 'Cayman Premier League') return 'CPL';
  return name.replace('Division ', 'Div ');
};

export const DivisionTabs: React.FC<DivisionTabsProps> = ({ 
  divisions, 
  activeDivision, 
  onChange,
  variant = 'underline'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logic
  useEffect(() => {
    if (containerRef.current && activeDivision) {
      const activeButton = containerRef.current.querySelector(`button[data-active="true"]`);
      if (activeButton) {
        activeButton.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeDivision]);

  // Variant 2: Segmented Pill (Clean, Modern, Contained)
  if (variant === 'segmented') {
    return (
      <div 
        ref={containerRef}
        className="flex overflow-x-auto md:overflow-x-visible md:flex-wrap gap-1 p-1 bg-gray-100 rounded-xl no-scrollbar border border-gray-200 md:justify-end"
      >
        {divisions.map((div) => {
          const isActive = activeDivision === div;
          return (
            <button
              key={div}
              data-active={isActive}
              onClick={() => onChange(div)}
              className={clsx(
                "relative px-4 py-2 md:px-5 md:py-2 rounded-lg text-xs md:text-sm font-heading font-bold uppercase tracking-wider transition-colors whitespace-nowrap z-10 flex-shrink-0",
                isActive ? "text-brand-blue" : "text-gray-400 hover:text-brand-blue"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="segmented-tab"
                  className="absolute inset-0 bg-white rounded-lg -z-10 shadow-sm border border-gray-100"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              {shortenDivisionName(div)}
            </button>
          );
        })}
      </div>
    );
  }

  // Variant 3: Varsity Block (Bold, Athletic, High Contrast)
  if (variant === 'block') {
    return (
      <div 
        ref={containerRef}
        className="flex overflow-x-auto md:overflow-x-visible md:flex-wrap gap-2 no-scrollbar pb-2 md:justify-end"
      >
        {divisions.map((div) => {
          const isActive = activeDivision === div;
          return (
            <button
              key={div}
              data-active={isActive}
              onClick={() => onChange(div)}
              className={clsx(
                "relative px-4 py-2 md:px-6 md:py-2 text-xs md:text-sm font-heading font-bold uppercase tracking-widest border transition-all duration-200 whitespace-nowrap skew-x-[-10deg] flex-shrink-0",
                isActive 
                  ? "bg-brand-blue border-brand-blue text-white shadow-[4px_4px_0_#FFC72C] translate-y-[-2px]" 
                  : "bg-white border-gray-200 text-gray-400 hover:border-brand-blue hover:text-brand-blue"
              )}
            >
              <span className="block skew-x-[10deg]">{shortenDivisionName(div)}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // Variant 1: Pro League Underline (Minimal, Dashboard feel) - Default
  return (
    <div className="border-b border-gray-100 w-full">
      <div 
        ref={containerRef}
        className="flex overflow-x-auto md:overflow-x-visible md:flex-wrap gap-6 md:gap-8 no-scrollbar px-2 md:justify-end"
      >
        {divisions.map((div) => {
          const isActive = activeDivision === div;
          return (
            <button
              key={div}
              data-active={isActive}
              onClick={() => onChange(div)}
              className={clsx(
                "relative py-3 md:py-4 text-sm md:text-base font-heading font-bold uppercase tracking-widest transition-colors whitespace-nowrap flex-shrink-0",
                isActive ? "text-brand-blue" : "text-gray-400 hover:text-brand-blue"
              )}
            >
              {shortenDivisionName(div)}
              {isActive && (
                <motion.div
                  layoutId="underline-tab"
                  className="absolute bottom-0 left-0 right-0 h-[3px] bg-brand-yellow"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};