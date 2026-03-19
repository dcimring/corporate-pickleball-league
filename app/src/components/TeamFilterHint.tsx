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
        initial={{ opacity: 0, y: 10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.98 }}
        className={clsx(
          "w-full max-w-lg mx-auto px-4",
          className
        )}
      >
        <div className="flex items-center justify-center gap-4 py-3.5 bg-surface-container-low rounded-2xl relative group overflow-hidden shadow-soft">
          {/* Subtle primary glow in background */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          
          <div className="shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center relative z-10">
            <Info className="h-3 w-3 text-primary" />
          </div>
          
          <p className="font-body text-[11px] font-medium tracking-tight text-secondary relative z-10">
            <span className="label-md !text-[10px] text-primary mr-3">Pro Tip</span>
            Click team name to see all their matches
          </p>

          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Dismiss tip"
            className="shrink-0 p-1.5 text-secondary/30 hover:text-secondary hover:bg-on-surface/5 transition-all rounded-full relative z-10"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
