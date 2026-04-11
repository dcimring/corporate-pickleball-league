import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, X } from 'lucide-react';

export const UpdateBanner: React.FC = () => {
  const [needRefresh, setNeedRefresh] = useState(false);
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
      const response = await fetch('/version.json?t=' + now);
      const contentType = response.headers.get('content-type');
      if (!response.ok || !contentType || !contentType.includes('application/json')) return;

      const data = await response.json();
      if (!data || typeof data.version === 'undefined') return;

      const currentVersion = String(data.version);
      if (currentVersion === 'DEV') return;

      if (currentVersion !== initialVersionRef.current) {
        setNeedRefresh(true);
      }
    } catch (e) {
      console.warn('Update check failed.', e);
    }
  };
  
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    checkForUpdates();
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkForUpdates();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const handleRefresh = () => {
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
          initial={{ opacity: 0, y: -48 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -48 }}
          className="sticky top-0 left-0 right-0 z-[500] glass-nav shadow-ambient overflow-hidden"
          onClick={handleRefresh}
        >
          <div className="w-full px-6 h-12 flex items-center justify-between cursor-pointer group">
            <div className="flex-1 flex justify-center items-center gap-4">
              <RefreshCw size={16} className="text-secondary animate-spin-slow" />
              <p className="label-sm font-black tracking-[0.2em] text-primary uppercase text-center">
                SYSTEM UPDATE READY • <span className="underline decoration-secondary underline-offset-4">SYNCHRONIZE NOW</span>
              </p>
            </div>
            
            <button 
              onClick={handleClose}
              className="p-2 hover:bg-primary/5 transition-colors"
              aria-label="Close"
            >
              <X size={18} className="text-primary opacity-30" />
            </button>
          </div>
          
          <div className="absolute top-0 left-0 h-[2px] bg-secondary w-full" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
