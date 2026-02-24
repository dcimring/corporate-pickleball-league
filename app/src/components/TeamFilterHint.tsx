import React, { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import { Info, X } from 'lucide-react';

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
    <div
      className={clsx(
        "relative overflow-hidden rounded-2xl border-2 border-brand-blue/10 bg-brand-light-blue/40 px-5 py-4",
        className
      )}
    >
      <div className="relative z-10 flex items-start gap-3">
        <div className="mt-0.5 shrink-0 rounded-full bg-white/80 p-2 shadow-sm">
          <Info className="h-4 w-4 text-brand-blue" />
        </div>
        <div className="flex-1">
          <p className="font-heading font-black italic uppercase text-[11px] tracking-widest text-brand-blue">
            Tip
          </p>
          <p className="font-body text-sm text-gray-600">
            Click any team name to see all of their matches.
          </p>
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss tip"
          className="ml-1 inline-flex h-8 w-8 items-center justify-center rounded-full border border-brand-blue/10 bg-white/80 text-brand-blue transition hover:-translate-y-0.5 hover:bg-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-brand-yellow/20 blur-2xl" />
    </div>
  );
};
