import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { createPortal } from 'react-dom';
import { Share2, Loader2, Download, CheckCircle2, X, Smartphone } from 'lucide-react';
import { toBlob, toJpeg } from 'html-to-image';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

export interface ShareButtonHandle {
  triggerShare: () => void;
}

interface ShareButtonProps {
  targetRef: React.RefObject<HTMLElement | null>;
  fileName?: string;
  className?: string;
  variant?: 'icon' | 'button';
  buttonLabel?: string;
  loadingLabel?: string;
  preferDownload?: boolean;
  imageFormat?: 'jpeg' | 'png';
  imageQuality?: number;
  pixelRatio?: number;
  tabIndex?: number;
  shareTitle?: string;
  shareText?: string;
  toastPosition?: 'fixed' | 'absolute';
  hidden?: boolean;
  hideIcon?: boolean;
  onShareStart?: () => void;
  onShareEnd?: () => void;
}

export const ShareButton = forwardRef<ShareButtonHandle, ShareButtonProps>(({
  targetRef,
  fileName = 'pickleball-share.jpg',
  className,
  variant = 'button',
  buttonLabel = 'Share Leaderboard',
  loadingLabel = 'Generating...',
  preferDownload = false,
  imageFormat = 'jpeg',
  imageQuality = 0.95,
  pixelRatio = 2,
  tabIndex,
  shareTitle = 'Corporate Pickleball League',
  shareText = 'Check out the latest stats from the Corporate Pickleball League! 🥒🏆',
  toastPosition = 'fixed',
  hidden = false,
  hideIcon = false,
  onShareStart,
  onShareEnd
}, ref) => {
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleShare = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const node = targetRef.current;
    if (!node) return;

    try {
      setLoading(true);
      onShareStart?.();

      // Wait a tick to ensure any hidden/rendering states are ready if needed
      await new Promise(resolve => setTimeout(resolve, 200));

      const exportOptions = {
        cacheBust: true,
        backgroundColor: '#FFFEFC',
        pixelRatio,
      };

      const blob = imageFormat === 'jpeg'
        ? await (async () => {
            const dataUrl = await toJpeg(node, { ...exportOptions, quality: imageQuality });
            const response = await fetch(dataUrl);
            return response.blob();
          })()
        : await toBlob(node, exportOptions);

      if (!blob) throw new Error('Failed to generate image');

      const timestamp = Date.now();
      const extension = imageFormat === 'jpeg' ? 'jpg' : 'png';
      const baseName = fileName.replace(/\.(png|jpg|jpeg)$/i, '');
      const uniqueFileName = `${baseName}-${timestamp}.${extension}`;
      const file = new File([blob], uniqueFileName, { type: imageFormat === 'jpeg' ? 'image/jpeg' : 'image/png' });

      // Check if we are on a mobile/tablet device
      const isMobileOrTablet = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                              (navigator.maxTouchPoints > 0 && window.innerWidth < 1024);

      if (!preferDownload && isMobileOrTablet && navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: shareTitle,
          text: shareText,
        });
      } else {
        // Desktop or forced download: Trigger download
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = uniqueFileName;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);

        // Show Toast on Desktop
        if (!isMobileOrTablet) {
          setShowToast(true);
          setTimeout(() => setShowToast(false), 6000);
        }
      }
    } catch (err) {
      console.error('Sharing failed:', err);
      // Fallback for some browsers/contexts where share API might fail mid-flight
      alert('Could not share directly. Try taking a screenshot!');
    } finally {
      setLoading(false);
      onShareEnd?.();
    }
  };

  useImperativeHandle(ref, () => ({
    triggerShare: () => {
      void handleShare();
    },
  }));

  const renderToast = () => (
    <Toast 
      show={showToast} 
      onClose={() => setShowToast(false)} 
      position={toastPosition} 
    />
  );

  if (hidden) {
    return renderToast();
  }

  if (variant === 'icon') {
    return (
      <div className="relative inline-block">
        <button 
          onClick={handleShare}
          disabled={loading}
          tabIndex={tabIndex}
          className={clsx(
            "p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-brand-blue transition-colors relative",
            className
          )}
          title="Share"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Share2 className="w-5 h-5" />}
        </button>
        {renderToast()}
      </div>
    );
  }

  return (
    <div className={clsx("relative", className?.includes('!w-full') ? 'w-full' : 'inline-block')}>
      <button 
        onClick={handleShare}
        disabled={loading}
        tabIndex={tabIndex}
        className={clsx(
          "relative flex items-center gap-3 px-8 py-3 bg-gray-50 text-brand-blue font-heading font-bold rounded-2xl border border-white",
          "shadow-[5px_5px_10px_#d1d5db,-5px_-5px_10px_#ffffff]",
          "before:absolute before:inset-[-2px] before:rounded-2xl before:border-4 before:border-brand-light-blue-strong before:opacity-0 before:scale-125 before:transition-all before:duration-200 before:pointer-events-none",
          "hover:before:opacity-100 hover:before:scale-100",
          "active:scale-95 transition-all duration-200",
          loading && "opacity-80 cursor-wait",
          className
        )}
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin text-brand-blue" />
            <span>{loadingLabel}</span>
          </>
        ) : (
          <>
            {!hideIcon && (
              preferDownload ? (
                <Download className="w-5 h-5 text-brand-yellow drop-shadow-sm" />
              ) : (
                <Share2 className="w-5 h-5 text-brand-yellow drop-shadow-sm" />
              )
            )}
            <span>{buttonLabel}</span>
          </>
        )}
      </button>
      {renderToast()}
    </div>
  );
});

/* Internal Toast Component with Portal/Absolute Support */
const Toast: React.FC<{ show: boolean; onClose: () => void; position: 'fixed' | 'absolute' }> = ({ show, onClose, position }) => {
  if (typeof document === 'undefined') return null;

  const content = (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={position === 'fixed' ? { x: 400, opacity: 0 } : { y: 20, opacity: 0 }}
          animate={position === 'fixed' ? { x: 0, opacity: 1 } : { y: 0, opacity: 1 }}
          exit={position === 'fixed' ? { x: 400, opacity: 0 } : { y: 20, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 100 }}
          className={clsx(
            "z-[9999] w-[320px] md:w-[380px] visible pointer-events-auto",
            position === 'fixed' ? "fixed bottom-6 right-6" : "absolute bottom-full right-0 mb-4"
          )}
        >
          <div className="bg-brand-blue text-white p-4 md:p-5 rounded-2xl shadow-2xl border-2 border-brand-yellow relative overflow-hidden">
            {/* Texture Overlay */}
            <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay" 
                 style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }} 
            />
            
            <div className="flex gap-3 md:gap-4 relative z-10">
              <div className="bg-brand-yellow/20 p-2 rounded-xl self-start">
                <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-brand-yellow" />
              </div>
              
              <div className="flex-1 space-y-1 text-left">
                <h5 className="font-heading font-black italic uppercase tracking-wider text-base md:text-lg leading-tight">
                  Image Downloaded!
                </h5>
                <p className="text-[13px] md:text-sm font-body text-blue-50 leading-snug">
                  Check your <span className="font-bold underline decoration-brand-yellow underline-offset-2">Downloads</span> folder to share.
                </p>
                
                <div className="pt-2 mt-2 border-t border-white/10 flex items-start gap-2">
                  <Smartphone className="w-3.5 h-3.5 md:w-4 md:h-4 text-brand-yellow mt-0.5 flex-shrink-0" />
                  <p className="text-[10px] md:text-[11px] font-mono leading-tight text-blue-100 italic">
                    Tip: Open this site on mobile for direct one-tap sharing.
                  </p>
                </div>
              </div>

              <button 
                onClick={onClose}
                className="text-white/40 hover:text-white transition-colors self-start"
              >
                <X className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (position === 'fixed') {
    return createPortal(content, document.body);
  }

  return content;
};

ShareButton.displayName = 'ShareButton';
