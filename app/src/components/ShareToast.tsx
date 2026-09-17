import React from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, X, Smartphone, Share } from 'lucide-react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

export interface ShareToastState {
  title: string;
  message: React.ReactNode;
  icon: 'download' | 'share';
}

interface ShareToastProps {
  state: ShareToastState | null;
  onClose: () => void;
  /** Element to portal into (e.g. a card overlay). Falls back to a fixed corner on body. */
  portalTarget?: HTMLElement | null;
  position?: 'fixed' | 'absolute';
}

export const ShareToast: React.FC<ShareToastProps> = ({ state, onClose, portalTarget, position = 'fixed' }) => (
  <AnimatePresence mode="wait">
    {state && (
      <ToastBody key={state.title} config={state} onClose={onClose} portalTarget={portalTarget} position={position} />
    )}
  </AnimatePresence>
);

const ToastBody: React.FC<{
  config: ShareToastState;
  onClose: () => void;
  portalTarget?: HTMLElement | null;
  position: 'fixed' | 'absolute';
}> = ({ config, onClose, portalTarget, position }) => {
  if (typeof document === 'undefined') return null;

  const content = (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -20, opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      style={{ pointerEvents: 'auto' }}
      className={clsx(
        'z-[9999] w-[320px] md:w-[420px] visible',
        portalTarget ? 'mt-4' : position === 'fixed' ? 'fixed bottom-12 right-12' : 'absolute bottom-full right-0 mb-6'
      )}
    >
      <div className="bg-navy text-white p-6 shadow-2xl relative overflow-hidden rounded-lg border border-white/10">
        <div className="flex gap-6 relative z-10">
          <div className="bg-white/10 p-4 self-start rounded-sm">
            {config.icon === 'download' ? (
              <CheckCircle2 className="w-8 h-8 text-yellow" />
            ) : (
              <Share className="w-8 h-8 text-yellow" />
            )}
          </div>

          <div className="flex-1 space-y-2 text-left">
            <div className="mono font-bold tracking-widest text-yellow text-[13px]">{config.title}</div>
            <div className="font-display font-medium text-white/80 leading-snug text-[14px]">{config.message}</div>

            {config.icon === 'download' && (
              <div className="pt-4 mt-4 border-t border-white/10 flex items-start gap-3">
                <Smartphone className="w-5 h-5 text-yellow opacity-60 mt-0.5 flex-shrink-0" />
                <p className="mono text-[10px] opacity-40 italic">Tip: Open this site on mobile for direct one-tap sharing.</p>
              </div>
            )}
          </div>

          <button onClick={onClose} aria-label="Dismiss" className="text-white/20 hover:text-white transition-colors self-start p-1">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );

  if (position === 'fixed') {
    return createPortal(content, portalTarget ?? document.body);
  }
  return content;
};
