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
    <div className="flex flex-col gap-3 w-full">
      {/* Page Tabs - Editorial Style - Centered Pills with Court Markers */}
      <div className="relative w-full flex justify-center py-2">
          {/* Court Markers - Desktop Only */}
          <div className="hidden md:flex absolute inset-0 items-center justify-between pointer-events-none px-4">
              {/* Left Slashes */}
              <div className="flex gap-1.5 opacity-40">
                  <div className="w-1.5 h-8 bg-secondary skew-x-[-20deg]" />
                  <div className="w-1.5 h-8 bg-secondary skew-x-[-20deg]" />
                  <div className="w-1.5 h-8 bg-secondary skew-x-[-20deg]" />
              </div>
              
              {/* Right Barcode */}
              <div className="flex items-end gap-1 opacity-20">
                  <div className="w-1 h-6 bg-primary" />
                  <div className="w-3 h-6 bg-primary" />
                  <div className="w-0.5 h-6 bg-primary" />
                  <div className="w-2 h-6 bg-primary" />
              </div>
          </div>

          <div className="flex justify-center gap-3 w-full md:w-auto relative px-0 md:px-8">
              {pageTabs.map((tab) => {
                const isActive = activePage === tab.path;
                return (
                  <button
                    key={tab.name}
                    onClick={() => onPageChange(tab.path)}
                    className={clsx(
                      "relative px-6 py-4 md:px-16 md:py-5 transition-all duration-300 group rounded-none overflow-hidden flex-1 md:flex-none",
                      isActive 
                        ? "text-on-secondary-container" 
                        : "text-primary/40 hover:text-primary hover:bg-primary/5"
                    )}
                  >
                    <span className="relative z-20 label-md md:text-xl md:tracking-[0.1em] font-bold uppercase">{tab.name}</span>
                    {isActive && (
                      <motion.div
                        layoutId="active-pill-bg"
                        className="absolute inset-0 bg-secondary shadow-ambient"
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
          {/* Mobile Dropdown - Remains as refined version */}
          <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={clsx(
              "w-full flex items-center justify-between px-6 py-4 bg-surface-container-high label-md text-primary transition-all duration-300 relative",
              isOpen ? "ring-2 ring-secondary" : ""
            )}
          >
            <span>{activeDivision || 'Select Division'}</span>
            <ChevronDown className={clsx("w-5 h-5 transition-transform duration-300 opacity-60", isOpen && "rotate-180")} />
          </button>
            <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-surface-container-highest text-primary overflow-hidden w-full mt-0 shadow-ambient z-50 relative"
              >
                  {divisions.map((div) => (
                    <button
                      key={div}
                      onClick={() => handleMobileSelect(div)}
                      className={clsx(
                        "w-full flex items-center justify-between px-6 py-5 text-left label-md border-t border-outline-variant hover:bg-surface-container-low transition-colors",
                        activeDivision === div && "bg-surface-container-lowest text-primary"
                      )}
                    >
                      {div}
                      {activeDivision === div && <Check className="w-4 h-4 text-secondary" />}
                    </button>
                  ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Desktop Tabs (Pills - Recessed Style restored - Now Square & Transparent) */}
        <div className="hidden md:flex md:flex-wrap gap-2 md:justify-center p-1.5 rounded-none w-full border border-outline-variant/10 relative">
          {divisions.map((div) => {
            const isActive = activeDivision === div;
            return (
              <button
                key={div}
                onClick={() => onDivisionChange(div)}
                className={clsx(
                  "relative px-6 py-2.5 text-[11px] font-stat font-bold uppercase tracking-[0.2em] transition-all whitespace-nowrap flex-shrink-0 rounded-none",
                  isActive 
                    ? "text-primary z-10" 
                    : "text-primary/40 hover:text-primary/60 hover:bg-white/50"
                )}
              >
                <span className="relative z-20">{shortenDivisionName(div)}</span>
                {isActive && (
                  <motion.div 
                    layoutId="division-pill" 
                    className="absolute inset-0 bg-white shadow-md rounded-none ring-1 ring-primary/5 z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
