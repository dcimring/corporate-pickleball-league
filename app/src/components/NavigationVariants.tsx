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
  variant?: 'refined-pill' | 'underline-glow' | 'varsity-block';
}

const shortenDivisionName = (name: string) => {
  if (name === 'Cayman Premier League') return 'CPL';
  return name.replace('Division ', 'Div ');
};

export const NavigationVariant: React.FC<NavigationProps> = ({ 
  pageTabs, 
  activePage, 
  divisions, 
  activeDivision, 
  onPageChange, 
  onDivisionChange,
  variant = 'refined-pill'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMobileSelect = (div: string) => {
    onDivisionChange(div);
    setIsOpen(false);
  };

  // Option 1: Refined Pill (Polished version of current)
  // Cleaner, flatter, better integrated with the grey/black table header
  if (variant === 'refined-pill') {
    return (
      <div className="flex flex-col gap-4 px-6 md:px-0">
        {/* Page Tabs */}
        <div className="flex items-center gap-2">
          {pageTabs.map((tab) => {
            const isActive = activePage === tab.path;
            return (
              <button
                key={tab.name}
                onClick={() => onPageChange(tab.path)}
                className={clsx(
                  "relative z-10 px-6 py-2 md:px-8 md:py-2.5 rounded-full font-heading font-bold uppercase tracking-wider text-xs transition-all duration-200 border",
                  isActive 
                    ? "bg-brand-blue text-brand-yellow border-brand-blue shadow-sm" 
                    : "bg-white text-gray-400 border-gray-200 hover:border-gray-300 hover:text-brand-blue"
                )}
              >
                {tab.name}
              </button>
            );
          })}
        </div>

        {/* Division Selector */}
        <div className="w-full relative" ref={containerRef}>
          {/* Mobile Dropdown */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm text-brand-blue font-heading font-bold text-sm uppercase tracking-wide active:bg-gray-50 transition-colors"
            >
              <span>{shortenDivisionName(activeDivision) || 'Select Division'}</span>
              <ChevronDown className={clsx("w-5 h-5 transition-transform duration-200", isOpen && "rotate-180")} />
            </button>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden max-h-[60vh] overflow-y-auto"
                >
                  <div className="py-1">
                    {divisions.map((div) => (
                      <button
                        key={div}
                        onClick={() => handleMobileSelect(div)}
                        className={clsx(
                          "w-full flex items-center justify-between px-4 py-3 text-left font-heading font-bold text-sm uppercase tracking-wide transition-colors",
                          activeDivision === div ? "bg-blue-50 text-brand-blue" : "text-gray-600 hover:bg-gray-50"
                        )}
                      >
                        {shortenDivisionName(div)}
                        {activeDivision === div && <Check className="w-4 h-4 text-brand-blue" />}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Desktop Tabs */}
          <div className="hidden md:flex md:flex-wrap gap-2 justify-start">
            {divisions.map((div) => {
              const isActive = activeDivision === div;
              return (
                <button
                  key={div}
                  onClick={() => onDivisionChange(div)}
                  className={clsx(
                    "relative px-4 py-1.5 text-xs font-heading font-bold uppercase tracking-widest transition-colors whitespace-nowrap flex-shrink-0 border-b-2",
                    isActive 
                      ? "text-brand-blue border-brand-blue" 
                      : "text-gray-400 border-transparent hover:text-gray-600 hover:border-gray-200"
                  )}
                >
                  {shortenDivisionName(div)}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Option 2: Underline Glow (High Impact, "Electric")
  if (variant === 'underline-glow') {
    return (
      <div className="flex flex-col gap-6 px-6 md:px-0">
        {/* Page Tabs */}
        <div className="flex items-center gap-8 border-b border-gray-100 pb-px">
          {pageTabs.map((tab) => {
            const isActive = activePage === tab.path;
            return (
              <button
                key={tab.name}
                onClick={() => onPageChange(tab.path)}
                className={clsx(
                  "relative pb-4 text-xl font-heading font-black italic uppercase tracking-tight transition-colors",
                  isActive ? "text-brand-blue" : "text-gray-300 hover:text-gray-400"
                )}
              >
                {tab.name}
                {isActive && (
                  <motion.div
                    layoutId="glow-line"
                    className="absolute bottom-0 left-0 right-0 h-[4px] bg-brand-yellow shadow-[0_0_15px_#FFC72C] rounded-t-sm z-10"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Division Selector */}
        <div className="w-full relative" ref={containerRef}>
           {/* Mobile Dropdown (Same as above for consistency) */}
           <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-full flex items-center justify-between px-4 py-3 bg-brand-blue text-white rounded-none shadow-sm font-heading font-bold text-sm uppercase tracking-wide"
            >
              <span>{shortenDivisionName(activeDivision) || 'Select Division'}</span>
              <ChevronDown className={clsx("w-5 h-5 transition-transform duration-200", isOpen && "rotate-180")} />
            </button>
             <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-brand-blue text-white overflow-hidden"
                >
                    {divisions.map((div) => (
                      <button
                        key={div}
                        onClick={() => handleMobileSelect(div)}
                        className={clsx(
                          "w-full flex items-center justify-between px-4 py-3 text-left font-heading font-bold text-sm uppercase tracking-wide border-t border-white/10 hover:bg-white/10",
                          activeDivision === div && "bg-white/20"
                        )}
                      >
                        {shortenDivisionName(div)}
                        {activeDivision === div && <Check className="w-4 h-4 text-brand-yellow" />}
                      </button>
                    ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Desktop Tabs */}
          <div className="hidden md:flex md:flex-wrap gap-3 justify-start p-1 bg-gray-50 rounded-lg w-fit">
            {divisions.map((div) => {
              const isActive = activeDivision === div;
              return (
                <button
                  key={div}
                  onClick={() => onDivisionChange(div)}
                  className={clsx(
                    "relative px-4 py-1.5 text-xs font-heading font-bold uppercase tracking-widest transition-all whitespace-nowrap flex-shrink-0 rounded-md",
                    isActive 
                      ? "bg-white text-brand-blue shadow-sm" 
                      : "text-gray-400 hover:text-gray-600"
                  )}
                >
                  {shortenDivisionName(div)}
                  {isActive && <motion.div layoutId="glow-pill" className="absolute inset-0 rounded-md ring-1 ring-black/5" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Option 3: Varsity Block (Bold, Sporty, High Contrast)
  if (variant === 'varsity-block') {
    return (
      <div className="flex flex-col gap-4 px-6 md:px-0">
        {/* Page Tabs */}
        <div className="flex items-center gap-1 bg-brand-blue p-1 rounded-full w-fit shadow-md">
          {pageTabs.map((tab) => {
            const isActive = activePage === tab.path;
            return (
              <button
                key={tab.name}
                onClick={() => onPageChange(tab.path)}
                className={clsx(
                  "relative z-10 px-8 py-2.5 rounded-full font-heading font-bold uppercase tracking-wider text-xs transition-all duration-300",
                  isActive 
                    ? "bg-brand-yellow text-brand-blue shadow-sm" 
                    : "text-white/60 hover:text-white"
                )}
              >
                {tab.name}
              </button>
            );
          })}
        </div>

        {/* Division Selector */}
        <div className="w-full relative" ref={containerRef}>
           {/* Mobile Dropdown */}
           <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-full flex items-center justify-between px-4 py-3 border-2 border-brand-blue bg-white text-brand-blue rounded-lg shadow-[4px_4px_0_#0F172A] font-heading font-black text-sm uppercase tracking-wide active:translate-y-[2px] active:shadow-none transition-all"
            >
              <span>{shortenDivisionName(activeDivision) || 'Select Division'}</span>
              <ChevronDown className={clsx("w-5 h-5 transition-transform duration-200", isOpen && "rotate-180")} />
            </button>
             <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-brand-blue rounded-lg shadow-[4px_4px_0_#0F172A] z-50 overflow-hidden"
                >
                    {divisions.map((div) => (
                      <button
                        key={div}
                        onClick={() => handleMobileSelect(div)}
                        className={clsx(
                          "w-full flex items-center justify-between px-4 py-3 text-left font-heading font-bold text-sm uppercase tracking-wide border-b border-gray-100 last:border-0 hover:bg-yellow-50",
                          activeDivision === div && "bg-brand-yellow text-brand-blue"
                        )}
                      >
                        {shortenDivisionName(div)}
                      </button>
                    ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Desktop Tabs */}
          <div className="hidden md:flex md:flex-wrap gap-2 justify-start items-center">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mr-2">DIV:</span>
            {divisions.map((div) => {
              const isActive = activeDivision === div;
              return (
                <button
                  key={div}
                  onClick={() => onDivisionChange(div)}
                  className={clsx(
                    "relative px-3 py-1 text-[11px] font-heading font-bold uppercase tracking-widest transition-all whitespace-nowrap flex-shrink-0 border",
                    isActive 
                      ? "bg-brand-blue border-brand-blue text-white" 
                      : "bg-white border-gray-200 text-gray-400 hover:border-brand-blue hover:text-brand-blue"
                  )}
                >
                  {shortenDivisionName(div)}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return null;
};
