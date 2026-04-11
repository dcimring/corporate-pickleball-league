import React, { useState } from 'react';
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
  const [isDismissed, setIsDismissed] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.localStorage.getItem(storageKey) === '1';
    }
    return false;
  });

  const handleDismiss = () => {
    window.localStorage.setItem(storageKey, '1');
    setIsDismissed(true);
  };

  if (isDismissed !== false) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 5 }}
        className={clsx(
          "w-full",
          className
        )}
      >
        <div className="flex items-center justify-center gap-4 py-3 bg-surface-container-high text-primary/60 px-6">
          <Info className="h-4 w-4 shrink-0 opacity-40" />
          
          <p className="label-sm font-bold tracking-widest text-center leading-none">
            TIP: Click team name to see all matches
          </p>

          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Dismiss tip"
            className="ml-4 p-1 hover:text-primary transition-colors hover:bg-surface-container-highest"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
