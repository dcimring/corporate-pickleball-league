import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, X } from 'lucide-react';

export const UpdateBanner: React.FC = () => {
  const [needRefresh, setNeedRefresh] = useState(false);
  // Source of truth for the version currently running in the browser
  const initialVersionRef = useRef<string>(String(__BUILD_ID__));
  const lastCheckRef = useRef<number>(0);
  const THROTTLE_MS = 120000; // 2 minutes

  const checkForUpdates = async () => {
    const now = Date.now();
    if (now - lastCheckRef.current < THROTTLE_MS) {
      return;
    }
    lastCheckRef.current = now;

    try {
      console.log('UpdateBanner: Checking for updates via /version.json...');
      const response = await fetch('/version.json?t=' + now);
      
      const contentType = response.headers.get('content-type');
      if (!response.ok || !contentType || !contentType.includes('application/json')) {
        console.warn('UpdateBanner: Received invalid version response.');
        return;
      }

      const data = await response.json();
      if (!data || typeof data.version === 'undefined') {
        console.warn('UpdateBanner: Received malformed version.json.');
        return;
      }

      const currentVersion = String(data.version);
      
      if (currentVersion === 'DEV') {
        return;
      }

      if (currentVersion !== initialVersionRef.current) {
        console.log('UpdateBanner: New version detected! (Current:', currentVersion, 'Initial:', initialVersionRef.current, ')');
        setNeedRefresh(true);
      }
    } catch (e) {
      console.warn('UpdateBanner: Update check failed.', e);
    }
  };
  
  // Triggers: On Load and On Visibility Change
  useEffect(() => {
    // 1. Initial check on mount
    checkForUpdates();

    // 2. Check when user returns to the tab
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkForUpdates();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const handleRefresh = () => {
    console.log('UpdateBanner: User triggered application refresh.');
    window.location.reload();
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNeedRefresh(false);
  };

  return (
    <AnimatePresence>
      {needRefresh && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 48 }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="sticky top-0 left-0 right-0 z-[500] bg-brand-blue border-b border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.3)] overflow-hidden mb-4"
          onClick={handleRefresh}
        >
          <div className="max-w-7xl mx-auto px-4 h-12 flex items-center justify-between cursor-pointer group">
            <div className="flex-1 flex justify-center items-center gap-3">
              <RefreshCw size={14} className="text-brand-yellow animate-spin-slow group-hover:rotate-180 transition-transform duration-500" />
              <p className="text-[10px] md:text-xs font-mono font-black tracking-[0.2em] text-brand-yellow uppercase text-center">
                New Version Available • <span className="underline decoration-brand-yellow/30 underline-offset-4">Sync Now</span>
              </p>
            </div>
            
            <button 
              onClick={handleClose}
              className="p-1 hover:bg-white/10 rounded-full transition-colors"
              aria-label="Close"
            >
              <X size={16} className="text-white/40" />
            </button>
          </div>
          
          {/* Subtle progress/loading line at top of banner */}
          <div className="absolute top-0 left-0 h-[1px] bg-brand-yellow/30 w-full" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
