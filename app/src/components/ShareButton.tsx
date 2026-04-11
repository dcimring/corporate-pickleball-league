import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { createPortal } from 'react-dom';
import { Share2, Loader2, Download, CheckCircle2, X, Smartphone, Share } from 'lucide-react';
import { toBlob, toJpeg } from 'html-to-image';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

export interface ShareButtonHandle {
  triggerShare: () => void;
}

interface ShareButtonProps {
  targetRef: React.RefObject<HTMLElement | null>;
  portalTarget?: React.RefObject<HTMLElement | null>;
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

interface ToastConfig {
  title: string;
  message: React.ReactNode;
  icon: 'download' | 'share';
}

export const ShareButton = forwardRef<ShareButtonHandle, ShareButtonProps>(({
  targetRef,
  portalTarget,
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
  const [toastConfig, setToastConfig] = useState<ToastConfig>({
    title: 'Image Downloaded!',
    message: 'Check your Downloads folder.',
    icon: 'download'
  });

  const triggerToast = (config: ToastConfig) => {
    setToastConfig(config);
    setShowToast(true);
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(50);
    }
    setTimeout(() => setShowToast(false), 6000);
  };

  const handleShare = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const node = targetRef.current;
    if (!node) return;

    try {
      setLoading(true);
      onShareStart?.();

      await new Promise(resolve => setTimeout(resolve, 200));

      const exportOptions = {
        cacheBust: true,
        backgroundColor: '#f7f9fb',
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

      const isMobileOrTablet = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                              (navigator.maxTouchPoints > 0 && window.innerWidth < 1024);

      if (!preferDownload && isMobileOrTablet && navigator.share && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: shareTitle,
            text: shareText,
          });
          
          triggerToast({
            title: 'SHARED SUCCESSFULLY',
            message: 'Your league coverage has been shared.',
            icon: 'share'
          });
        } catch (shareErr) {
          if (shareErr instanceof Error && shareErr.name !== 'AbortError') {
            console.error('Web Share failed:', shareErr);
          }
        }
      } else {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = uniqueFileName;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);

        if (!isMobileOrTablet) {
          triggerToast({
            title: 'ASSET EXPORTED',
            message: <>Check your <span className="font-bold underline decoration-secondary underline-offset-4">Downloads</span> folder to share.</>,
            icon: 'download'
          });
        }
      }
    } catch (err) {
      console.error('Sharing failed:', err);
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
    <AnimatePresence mode="wait">
      {showToast && (
        <Toast 
          key={`toast-${fileName}`}
          show={true} 
          onClose={() => setShowToast(false)} 
          position={toastPosition}
          config={toastConfig}
          portalTarget={portalTarget}
        />
      )}
    </AnimatePresence>
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
            "p-3 bg-surface-container-high text-primary hover:bg-surface-container-highest transition-colors relative",
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
          "relative flex items-center justify-center gap-4 px-10 py-4 bg-primary text-on-primary font-heading font-black uppercase tracking-widest rounded-none shadow-ambient active:scale-95 transition-all duration-300",
          loading && "opacity-80 cursor-wait",
          className
        )}
      >
        {loading ? (
          <>
            <Loader2 className="w-6 h-6 animate-spin text-on-primary" />
            <span className="label-md">{loadingLabel.toUpperCase()}</span>
          </>
        ) : (
          <>
            {!hideIcon && (
              preferDownload ? (
                <Download className="w-6 h-6 text-secondary" />
              ) : (
                <Share2 className="w-6 h-6 text-secondary" />
              )
            )}
            <span className="label-md">{buttonLabel.toUpperCase()}</span>
          </>
        )}
      </button>
      {renderToast()}
    </div>
  );
});

const Toast: React.FC<{ 
  show: boolean; 
  onClose: () => void; 
  position: 'fixed' | 'absolute';
  config: ToastConfig;
  portalTarget?: React.RefObject<HTMLElement | null>;
}> = ({ onClose, position, config, portalTarget }) => {
  if (typeof document === 'undefined') return null;

  const content = (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -20, opacity: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      style={{ pointerEvents: 'auto' }}
      className={clsx(
        "z-[9999] w-[320px] md:w-[420px] visible",
        portalTarget?.current 
          ? "mt-4" 
          : (position === 'fixed' ? "fixed bottom-12 right-12" : "absolute bottom-full right-0 mb-6")
      )}
    >
      <div className="bg-primary text-on-primary p-6 shadow-ambient relative overflow-hidden">
        {/* Magazine Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.1] pointer-events-none mix-blend-overlay" 
             style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/stardust.png")` }} 
        />
        
        <div className="flex gap-6 relative z-10">
          <div className="bg-white/10 p-4 self-start">
            {config.icon === 'download' ? (
              <CheckCircle2 className="w-8 h-8 text-secondary" />
            ) : (
              <Share className="w-8 h-8 text-secondary" />
            )}
          </div>
          
          <div className="flex-1 space-y-2 text-left">
            <div className="label-md font-black tracking-widest text-secondary">
              {config.title}
            </div>
            <div className="body-md text-on-primary/80 leading-snug">
              {config.message}
            </div>
            
            {config.icon === 'download' && (
              <div className="pt-4 mt-4 border-t border-white/10 flex items-start gap-3">
                <Smartphone className="w-5 h-5 text-secondary opacity-60 mt-0.5 flex-shrink-0" />
                <p className="label-sm opacity-40 italic">
                  Tip: Open this site on mobile for direct one-tap sharing.
                </p>
              </div>
            )}
          </div>

          <button 
            onClick={onClose}
            className="text-white/20 hover:text-white transition-colors self-start"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );

  if (position === 'fixed') {
    const target = portalTarget?.current || document.body;
    return createPortal(content, target);
  }

  return content;
};

ShareButton.displayName = 'ShareButton';
