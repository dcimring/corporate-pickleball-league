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
    <div className="flex flex-col gap-8 w-full">
      {/* Page Tabs - Editorial Style */}
      <div className="flex justify-center md:justify-start w-full gap-4">
          {pageTabs.map((tab) => {
            const isActive = activePage === tab.path;
            return (
              <button
                key={tab.name}
                onClick={() => onPageChange(tab.path)}
                className={clsx(
                  "relative px-4 md:px-0 py-2 headline-md uppercase tracking-tighter transition-all duration-500 group",
                  isActive ? "text-primary" : "text-on-surface-variant opacity-30 hover:opacity-100"
                )}
              >
                <span className="relative z-20">{tab.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="active-nav-line"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-secondary"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <div className="absolute bottom-0 left-0 w-0 h-1 bg-primary group-hover:w-full transition-all duration-300" />
              </button>
            );
          })}
      </div>

      {/* Division Selector - Tournament Chips */}
      <div className="w-full relative" ref={containerRef}>
          {/* Mobile Dropdown */}
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

        {/* Desktop Tournament Chips (Pill-shaped) */}
        <div className="hidden md:flex flex-wrap gap-3">
          {divisions.map((div) => {
            const isActive = activeDivision === div;
            return (
              <button
                key={div}
                onClick={() => onDivisionChange(div)}
                className={clsx(
                  "relative px-6 py-2 label-md rounded-full transition-all duration-300 whitespace-nowrap",
                  isActive 
                    ? "bg-secondary-container text-on-secondary-container shadow-sm" 
                    : "bg-surface-container-highest text-primary/60 hover:bg-surface-container-high hover:text-primary"
                )}
              >
                {div}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
