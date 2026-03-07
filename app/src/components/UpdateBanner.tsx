import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, X } from 'lucide-react';
import { useRegisterSW } from 'virtual:pwa-register/react';

export const UpdateBanner: React.FC = () => {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered: ' + r);
    },
    onRegisterError(error) {
      console.error('SW registration error', error);
    },
  });

  const handleRefresh = () => {
    updateServiceWorker(true);
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
          className="sticky top-0 left-0 right-0 z-[200] bg-brand-blue border-b border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.3)] overflow-hidden mb-4"
          onClick={handleRefresh}
        >
          <div className="max-w-7xl mx-auto px-4 h-12 flex items-center justify-between cursor-pointer group">
            <div className="flex-1 flex justify-center items-center gap-3">
              <RefreshCw size={14} className="text-brand-yellow animate-spin-slow group-hover:rotate-180 transition-transform duration-500" />
              <p className="text-[10px] md:text-xs font-mono font-black tracking-[0.2em] text-brand-yellow uppercase">
                New Version Available • <span className="underline decoration-brand-yellow/30 underline-offset-4">Click to Refresh</span>
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
