import React from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';
import { clsx } from 'clsx';

interface ConnectionErrorProps {
  onRetry: () => void;
  isRetrying?: boolean;
}

export const ConnectionError: React.FC<ConnectionErrorProps> = ({ onRetry, isRetrying = false }) => {
  const isIframe = React.useMemo(() => {
    try {
      return window.self !== window.top;
    } catch {
      return true;
    }
  }, []);

  return (
    <div className={clsx(
      "flex flex-col items-center justify-center px-6 w-full py-20",
      !isIframe && "min-h-[50vh]"
    )}>
      <div className="w-full max-w-2xl bg-card border border-rule rounded-[var(--radius)] p-10 md:p-16 text-center relative overflow-hidden shadow-[0_24px_60px_-40px_rgba(20,58,120,0.25)]">
        
        {/* Top Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-yellow z-10" />

        <div className="relative z-10 flex flex-col items-center gap-10">
          
          <div className="relative">
            <div className="absolute inset-0 bg-navy/5 rounded-full scale-150 animate-pulse" />
            <div className="bg-card-tint p-8 rounded-full border border-rule-2 relative shadow-ambient">
              <WifiOff className="w-12 h-12 text-navy opacity-30" />
            </div>
          </div>

          <div className="space-y-4">
            <p className="mono text-[11px] text-navy-faint font-bold tracking-[0.25em] uppercase">
              System Interrupted
            </p>
            <h2 className="font-display font-black text-navy text-[clamp(32px,4vw,48px)] leading-tight tracking-tight uppercase">
              Connection Lost
            </h2>
            <p className="font-display font-medium text-navy/60 max-w-md mx-auto text-[16px] leading-relaxed">
              We're having trouble reaching the league servers. The live leaderboard and match feed are currently unavailable.
            </p>
          </div>

          <button 
            onClick={onRetry}
            disabled={isRetrying}
            className={clsx(
                "group relative flex items-center gap-4 px-10 py-4 font-display font-extrabold text-[13px] tracking-[0.14em] uppercase rounded-full transition-all duration-200 overflow-hidden shadow-[0_8px_24px_-8px_rgba(0,85,150,0.3)]",
                isRetrying 
                  ? "bg-navy/10 text-navy-faint cursor-not-allowed" 
                  : "bg-navy text-white hover:bg-navy-soft active:scale-95"
            )}
          >
            <RefreshCw className={clsx("w-4 h-4 transition-transform", isRetrying ? "animate-spin" : "group-hover:rotate-180")} />
            <span>{isRetrying ? 'Synchronizing...' : 'Reconnect System'}</span>
          </button>
        </div>

        {/* Bottom Corner Accent */}
        <div className="absolute bottom-[-20px] right-[-20px] w-40 h-40 bg-navy opacity-[0.02] rounded-full" />
      </div>
    </div>
  );
};
