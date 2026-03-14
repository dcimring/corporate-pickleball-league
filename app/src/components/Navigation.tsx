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
    <div className="flex flex-col gap-4 px-6 md:px-0">
      {/* Page Tabs (Dark Blue Kinetic Container) */}
      <div className="flex justify-center">
        <div className="bg-brand-blue p-1.5 rounded-2xl flex gap-1 shadow-2xl relative overflow-hidden group">
          {/* Subtle Grainy Texture Overlay for the nav bar itself */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
          
          {pageTabs.map((tab) => {
            const isActive = activePage === tab.path;
            return (
              <button
                key={tab.name}
                onClick={() => onPageChange(tab.path)}
                className={clsx(
                  "relative px-6 md:px-10 py-3 rounded-xl text-lg md:text-xl font-heading font-black italic uppercase tracking-tight transition-colors duration-300 z-10",
                  isActive ? "text-brand-blue" : "text-white/50 hover:text-white"
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
              "w-full max-w-xs mx-auto flex items-center justify-between px-5 py-4 bg-brand-blue text-white rounded-2xl shadow-xl font-heading font-black italic text-sm uppercase tracking-wider transition-all duration-300 border-2",
              isOpen ? "border-brand-yellow scale-[1.02]" : "border-transparent"
            )}
          >
            <span>{shortenDivisionName(activeDivision) || 'Select Division'}</span>
            <ChevronDown className={clsx("w-5 h-5 transition-transform duration-300 text-brand-yellow", isOpen && "rotate-180")} />
          </button>
            <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="bg-brand-blue text-white overflow-hidden max-w-xs mx-auto rounded-2xl mt-2 shadow-2xl border-2 border-white/10 z-50 relative"
              >
                  {divisions.map((div) => (
                    <button
                      key={div}
                      onClick={() => handleMobileSelect(div)}
                      className={clsx(
                        "w-full flex items-center justify-between px-5 py-4 text-left font-mono font-bold text-xs uppercase tracking-widest border-t border-white/5 hover:bg-white/10 transition-colors",
                        activeDivision === div && "bg-white/20 text-brand-yellow"
                      )}
                    >
                      {shortenDivisionName(div)}
                      {activeDivision === div && <Check className="w-4 h-4" />}
                    </button>
                  ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Desktop Tabs (Pills - Recessed Style) */}
        <div className="hidden md:flex md:flex-wrap gap-2 md:justify-center p-1.5 bg-brand-blue/5 rounded-2xl w-full shadow-[inset_0_2px_10px_rgba(0,0,0,0.05)] border border-black/5">
          {divisions.map((div) => {
            const isActive = activeDivision === div;
            return (
              <button
                key={div}
                onClick={() => onDivisionChange(div)}
                className={clsx(
                  "relative px-5 py-2 text-[10px] font-mono font-bold uppercase tracking-[0.2em] transition-all whitespace-nowrap flex-shrink-0 rounded-xl",
                  isActive 
                    ? "bg-white text-brand-blue shadow-md" 
                    : "text-gray-400 hover:text-gray-600 hover:bg-black/5"
                )}
              >
                {shortenDivisionName(div)}
                {isActive && <motion.div layoutId="glow-pill" className="absolute inset-0 rounded-xl ring-1 ring-black/5" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
