import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { ChevronDown, Check } from 'lucide-react';

interface DivisionTabsProps {
  divisions: string[];
  activeDivision: string;
  onChange: (division: string) => void;
}

const shortenDivisionName = (name: string) => {
  if (name === 'Cayman Premier League') return 'CPL';
  return name.replace('Division ', 'Div ');
};

export const DivisionTabs: React.FC<DivisionTabsProps> = ({ 
  divisions, 
  activeDivision, 
  onChange
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

  const handleSelect = (div: string) => {
    onChange(div);
    setIsOpen(false);
  };

  return (
    <div className="w-full relative" ref={containerRef}>
      
      {/* Mobile Dropdown */}
      <div className="md:hidden px-6">
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
                    onClick={() => handleSelect(div)}
                    className={clsx(
                      "w-full flex items-center justify-between px-4 py-3 text-left font-heading font-bold text-sm uppercase tracking-wide transition-colors",
                      activeDivision === div 
                        ? "bg-blue-50 text-brand-blue" 
                        : "text-gray-600 hover:bg-gray-50"
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
      <div className="hidden md:flex md:flex-wrap gap-6 md:gap-8 justify-start px-6 md:pl-8">
        {divisions.map((div) => {
          const isActive = activeDivision === div;
          return (
            <button
              key={div}
              onClick={() => onChange(div)}
              className={clsx(
                "relative py-3 md:py-4 text-xs md:text-sm font-heading font-bold uppercase tracking-widest transition-colors whitespace-nowrap flex-shrink-0",
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