import React from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';
import { clsx } from 'clsx';

interface ConnectionErrorProps {
  onRetry: () => void;
  isRetrying?: boolean;
}

export const ConnectionError: React.FC<ConnectionErrorProps> = ({ onRetry, isRetrying = false }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-6 w-full py-20">
      <div className="editorial-card w-full max-w-2xl bg-surface-container-low p-12 text-center relative overflow-hidden group">
        
        {/* Magazine Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-multiply z-0" 
             style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/stardust.png")` }} 
        />

        {/* Top Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-4 bg-primary z-10" />

        <div className="relative z-10 flex flex-col items-center gap-12 pt-8">
          
          <div className="relative">
            <div className="absolute inset-0 bg-primary/5 scale-150 animate-pulse" />
            <div className="bg-surface-container-lowest p-8 shadow-ambient relative">
              <WifiOff className="w-16 h-16 text-primary opacity-20" />
            </div>
          </div>

          <div className="space-y-4">
            <p className="label-md text-secondary font-black tracking-[0.2em]">
              SYSTEM INTERRUPTED
            </p>
            <h2 className="display-sm text-primary uppercase">
              CONNECTION ISSUE
            </h2>
            <p className="body-lg text-on-surface-variant opacity-60 max-w-md mx-auto">
              The editorial feed has been disconnected. We're having trouble reaching the tournament server.
            </p>
          </div>

          <button 
            onClick={onRetry}
            disabled={isRetrying}
            className={clsx(
                "btn-primary flex items-center gap-4 transition-all duration-300",
                isRetrying ? "opacity-70 cursor-not-allowed" : "hover:scale-105"
            )}
          >
            <RefreshCw className={clsx("w-5 h-5", isRetrying && "animate-spin")} />
            <span className="label-md">{isRetrying ? 'RECONNECTING...' : 'RETRY CONNECTION'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
