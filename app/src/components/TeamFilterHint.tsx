import React, { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import { Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TeamFilterHintProps {
  className?: string;
  storageKey?: string;
}

const DEFAULT_STORAGE_KEY = 'cl_team_filter_hint_dismissed';

export const TeamFilterHint: React.FC<TeamFilterHintProps> = ({
  className,
  storageKey = DEFAULT_STORAGE_KEY,
}) => {
  const [isDismissed, setIsDismissed] = useState<boolean | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);
    setIsDismissed(stored === '1');
  }, [storageKey]);

  const handleDismiss = () => {
    window.localStorage.setItem(storageKey, '1');
    setIsDismissed(true);
  };

  if (isDismissed !== false) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 10 }}
        className={clsx(
          "max-w-md mx-auto w-full relative group",
          className
        )}
      >
        <div className="relative overflow-hidden rounded-2xl border-2 border-brand-blue bg-brand-yellow px-5 py-4 shadow-[6px_6px_0px_0px_rgba(0,85,150,1)] transition-transform duration-300">
          {/* Grainy Texture Overlay */}
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
          
          <div className="relative z-10 flex items-center gap-4">
            <div className="shrink-0 rounded-full bg-brand-blue p-2 shadow-inner">
              <Info className="h-4 w-4 text-brand-yellow" />
            </div>
            
            <div className="flex-1">
              <p className="font-heading font-black italic uppercase text-[10px] tracking-[0.2em] text-brand-blue leading-none mb-1">
                Pro Tip
              </p>
              <p className="font-mono text-[11px] md:text-xs font-bold text-brand-blue leading-tight uppercase tracking-tight">
                Click any team name to see all of their matches.
              </p>
            </div>

            <button
              type="button"
              onClick={handleDismiss}
              aria-label="Dismiss tip"
              className="shrink-0 inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-brand-blue bg-white text-brand-blue transition-all hover:bg-brand-blue hover:text-white active:scale-95 shadow-[2px_2px_0px_0px_rgba(0,85,150,1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
