import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { ChevronDown, Check } from 'lucide-react';

interface NavigationProps {
  pageTabs: { name: string; path: string }[];
  activePage: string;
  divisions: string[];
  activeDivision: string;
  onPageChange: (path: string) => void;
  onDivisionChange: (division: string) => void;
}

const shortenDivisionName = (name: string) => {
  if (name === 'Cayman Premier League') return 'CPL';
  return name.replace('Division ', 'Div ');
};

export const Navigation: React.FC<NavigationProps> = ({ 
  pageTabs, 
  activePage, 
  divisions, 
  activeDivision, 
  onPageChange, 
  onDivisionChange
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Close dropdown when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleMobileSelect = (div: string) => {
    onDivisionChange(div);
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col gap-6 px-4 md:px-0">
      {/* Page Tabs - Kinetic Editorial Style */}
      <div className="flex justify-center w-full overflow-visible pt-2">
        <div className="p-1 rounded-2xl flex gap-1 relative bg-surface-container-low w-full max-w-[calc(100vw-32px)] md:max-w-md shadow-soft">
          {pageTabs.map((tab) => {
            const isActive = activePage === tab.path;
            return (
              <button
                key={tab.name}
                onClick={() => onPageChange(tab.path)}
                className={clsx(
                  "relative flex-1 px-4 md:px-8 py-2.5 rounded-xl label-md transition-all duration-500 z-10",
                  isActive ? "text-on-primary" : "text-secondary/60 hover:text-secondary"
                )}
              >
                <span className="relative z-20">{tab.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="active-nav-pill"
                    className="absolute inset-0 bg-gradient-to-br from-primary to-primary-container shadow-ambient"
                    style={{ borderRadius: '0.75rem' }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Division Selector */}
      <div className="w-full relative" ref={containerRef}>
          {/* Mobile Dropdown - Glass & Gradient Motif */}
          <div className="md:hidden px-2">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={clsx(
              "w-full max-w-xs mx-auto flex items-center justify-between px-6 py-4 bg-surface-container-lowest text-on-surface rounded-2xl shadow-ambient font-body font-bold text-sm tracking-tight transition-all duration-300",
              isOpen ? "ring-2 ring-primary/20 scale-[1.02]" : ""
            )}
          >
            <span className="text-secondary/40 font-mono text-[10px] uppercase tracking-widest mr-2">Div:</span>
            <span className="flex-1 text-left">{shortenDivisionName(activeDivision) || 'Select Division'}</span>
            <ChevronDown className={clsx("w-5 h-5 transition-transform duration-300 text-primary", isOpen && "rotate-180")} />
          </button>
            <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="bg-surface-container-lowest/90 backdrop-blur-xl text-on-surface overflow-hidden max-w-xs mx-auto rounded-2xl mt-3 shadow-ambient z-50 relative"
              >
                  {divisions.map((div) => (
                    <button
                      key={div}
                      onClick={() => handleMobileSelect(div)}
                      className={clsx(
                        "w-full flex items-center justify-between px-6 py-4 text-left font-body font-medium text-xs tracking-tight border-t border-on-surface/5 first:border-t-0 hover:bg-surface-container-low transition-colors",
                        activeDivision === div && "bg-primary/5 text-primary font-bold"
                      )}
                    >
                      {shortenDivisionName(div)}
                      {activeDivision === div && <Check className="w-4 h-4 text-primary" />}
                    </button>
                  ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Desktop Tabs - Tonal Recessed Style */}
        <div className="hidden md:flex md:flex-wrap gap-2 md:justify-center p-1.5 bg-surface-container-low rounded-2xl w-full">
          {divisions.map((div) => {
            const isActive = activeDivision === div;
            return (
              <button
                key={div}
                onClick={() => onDivisionChange(div)}
                className={clsx(
                  "relative px-6 py-2 title-md transition-all whitespace-nowrap flex-shrink-0 rounded-xl",
                  isActive 
                    ? "bg-surface-container-lowest text-primary shadow-soft" 
                    : "text-secondary/50 hover:text-secondary hover:bg-surface-container-highest/50"
                )}
              >
                <span className="relative z-10 text-[13px] tracking-tight">{shortenDivisionName(div)}</span>
                {isActive && <motion.div layoutId="glow-pill" className="absolute inset-0 rounded-xl" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
