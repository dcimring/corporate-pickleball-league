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
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 5 }}
        className={clsx(
          "w-full max-w-lg mx-auto px-4",
          className
        )}
      >
        <div className="flex items-center justify-center gap-3 py-2.5 border-b border-brand-blue/10 bg-brand-light-blue/20 text-brand-blue/70">
          <Info className="h-3.5 w-3.5 shrink-0 opacity-60" />
          
          <p className="font-mono text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-center leading-none">
            TIP:CLICK TEAM NAME TO SEE ALL THEIR MATCHES
          </p>

          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Dismiss tip"
            className="ml-2 p-1 hover:text-brand-blue transition-colors rounded-full hover:bg-brand-blue/10"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
