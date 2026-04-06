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
    <div className="flex flex-col gap-3 px-4 md:px-0">
      {/* Page Tabs (Kinetic Container - Transparent) */}
      <div className="flex justify-center w-full overflow-visible">
        <div className="p-1 rounded-2xl flex gap-1 relative group w-full max-w-[calc(100vw-32px)] md:max-w-md">
          {pageTabs.map((tab) => {
            const isActive = activePage === tab.path;
            return (
              <button
                key={tab.name}
                onClick={() => onPageChange(tab.path)}
                className={clsx(
                  "relative flex-1 px-2 md:px-10 py-3 rounded-xl text-base md:text-xl font-heading font-black italic uppercase tracking-tight transition-colors duration-300 z-10",
                  isActive ? "text-brand-blue" : "text-brand-blue/30 hover:text-brand-blue/50"
                )}
              >
                <span className="relative z-20">{tab.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="active-nav-pill"
                    className="absolute inset-0 bg-brand-yellow rounded-xl shadow-[0_0_20px_rgba(255,199,44,0.3)]"
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
          {/* Mobile Dropdown */}
          <div className="md:hidden px-6">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={clsx(
              "w-full max-w-xs mx-auto flex items-center justify-between px-5 py-3.5 bg-brand-gray rounded-2xl shadow-[inset_0_2px_8px_rgba(0,0,0,0.06)] border border-outline-variant font-heading font-bold text-xs uppercase tracking-[0.15em] text-brand-blue transition-all duration-300 relative overflow-hidden",
              isOpen ? "ring-1 ring-brand-yellow" : ""
            )}
          >
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-yellow" />
            <span className="pl-1">{shortenDivisionName(activeDivision) || 'Select Division'}</span>
            <ChevronDown className={clsx("w-4 h-4 transition-transform duration-300 opacity-40", isOpen && "rotate-180")} />
          </button>
            <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-brand-gray text-brand-blue overflow-hidden max-w-xs mx-auto rounded-2xl mt-2 border border-outline-variant shadow-xl z-50 relative"
              >
                  {divisions.map((div) => (
                    <button
                      key={div}
                      onClick={() => handleMobileSelect(div)}
                      className={clsx(
                        "w-full flex items-center justify-between px-5 py-4 text-left font-heading font-bold text-[10px] uppercase tracking-widest border-t border-outline-variant hover:bg-brand-light-blue transition-colors",
                        activeDivision === div && "bg-white text-brand-blue shadow-sm"
                      )}
                    >
                      {shortenDivisionName(div)}
                      {activeDivision === div && <Check className="w-3 h-3 text-brand-yellow" />}
                    </button>
                  ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Desktop Tabs (Pills - Recessed Style) */}
        <div className="hidden md:flex md:flex-wrap gap-2 md:justify-center p-1.5 bg-brand-blue/5 rounded-2xl w-full shadow-[inset_0_2px_10px_rgba(0,0,0,0.05)] border border-outline-variant">
          {divisions.map((div) => {
            const isActive = activeDivision === div;
            return (
              <button
                key={div}
                onClick={() => onDivisionChange(div)}
                className={clsx(
                  "relative px-5 py-2 text-[10px] font-heading font-bold uppercase tracking-[0.2em] transition-all whitespace-nowrap flex-shrink-0 rounded-xl",
                  isActive 
                    ? "bg-white text-brand-blue shadow-md" 
                    : "text-brand-blue/40 hover:text-brand-blue/60 hover:bg-brand-blue/5"
                )}
              >
                {shortenDivisionName(div)}
                {isActive && <motion.div layoutId="glow-pill" className="absolute inset-0 rounded-xl ring-1 ring-brand-blue/10" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
