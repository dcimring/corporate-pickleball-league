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

  return (
    <div className="flex flex-col gap-6 px-6 md:px-0">
      {/* Page Tabs (Underline Glow) */}
      <div className="flex items-center gap-8 border-b border-gray-100 pb-px">
        {pageTabs.map((tab) => {
          const isActive = activePage === tab.path;
          return (
            <button
              key={tab.name}
              onClick={() => onPageChange(tab.path)}
              className={clsx(
                "relative pb-4 text-lg md:text-xl font-heading font-black italic uppercase tracking-tight transition-colors",
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
          {/* Mobile Dropdown */}
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

        {/* Desktop Tabs (Pills) */}
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
};
