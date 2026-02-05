import React from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';
import { clsx } from 'clsx';

interface ConnectionErrorProps {
  onRetry: () => void;
  isRetrying?: boolean;
}

export const ConnectionError: React.FC<ConnectionErrorProps> = ({ onRetry, isRetrying = false }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-4 w-full">
      <div className="w-full max-w-md bg-[#FFFEFC] rounded-3xl shadow-xl relative overflow-hidden border border-gray-100 p-8 text-center group">
        
        {/* Grainy Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.1] pointer-events-none mix-blend-multiply z-0" 
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
        />

        {/* Top Accent Bar */}
        <div className="absolute top-0 left-6 right-6 h-2 bg-[rgb(142,209,252)] rounded-b-md z-10" />

        <div className="relative z-10 flex flex-col items-center gap-6 pt-4">
          
          {/* Icon Container with subtle animation */}
          <div className="relative">
            <div className="absolute inset-0 bg-red-100 rounded-full scale-150 animate-pulse opacity-50" />
            <div className="bg-white p-4 rounded-full shadow-soft relative">
              <WifiOff className="w-10 h-10 text-[rgb(0,85,150)]" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="font-heading font-black italic uppercase text-2xl text-[rgb(0,85,150)] tracking-tight">
              Connection Issue
            </h2>
            <p className="font-body text-gray-500 max-w-[280px] mx-auto leading-relaxed">
              We're having trouble connecting to the league server. Please try again later.
            </p>
          </div>

          <button 
            onClick={onRetry}
            disabled={isRetrying}
            className={clsx(
                "btn-primary flex items-center gap-2 transition-all duration-300",
                isRetrying ? "opacity-70 cursor-not-allowed" : "group-hover:scale-105"
            )}
          >
            <RefreshCw className={clsx("w-4 h-4", isRetrying && "animate-spin")} />
            <span>{isRetrying ? 'Connecting...' : 'Retry Connection'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
