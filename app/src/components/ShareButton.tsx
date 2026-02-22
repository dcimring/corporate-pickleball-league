import React, { useState } from 'react';
import { Share2, Loader2 } from 'lucide-react';
import { toBlob } from 'html-to-image';
import { clsx } from 'clsx';

interface ShareButtonProps {
  targetRef?: React.RefObject<HTMLElement | null>;
  shareUrl?: string;
  fileName?: string;
  className?: string;
  variant?: 'icon' | 'button';
  onShareStart?: () => void;
  onShareEnd?: () => void;
  shareTitle?: string;
  shareText?: string;
}

export const ShareButton: React.FC<ShareButtonProps> = ({ 
  targetRef,
  shareUrl,
  fileName = 'pickleball-share.png',
  className,
  variant = 'button',
  onShareStart,
  onShareEnd,
  shareTitle = 'Corporate Pickleball League',
  shareText = 'Check out the latest stats from the Corporate Pickleball League! 🥒🏆'
}) => {
  const [loading, setLoading] = useState(false);

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!shareUrl && !targetRef?.current) return;

    try {
      setLoading(true);
      onShareStart?.();

      let blob: Blob | null = null;

      if (shareUrl) {
        const response = await fetch(shareUrl, { cache: 'no-store' });
        if (!response.ok) {
          throw new Error(`Failed to fetch share image: ${response.status}`);
        }
        blob = await response.blob();
      } else if (targetRef?.current) {
        // Wait a tick to ensure any hidden/rendering states are ready if needed
        await new Promise(resolve => setTimeout(resolve, 100));

        blob = await toBlob(targetRef.current, {
          cacheBust: true,
          backgroundColor: '#FFFEFC', // Ensure background is captured
          pixelRatio: 2, // High res for retina
        });
      }

      if (!blob) throw new Error('Failed to generate image');

      const timestamp = Date.now();
      const uniqueFileName = fileName.replace('.png', `-${timestamp}.png`);
      const file = new File([blob], uniqueFileName, { type: 'image/png' });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: shareTitle,
          text: shareText,
        });
      } else {
        // Fallback to download
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = uniqueFileName;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
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

  if (variant === 'icon') {
    return (
      <button 
        onClick={handleShare}
        disabled={loading}
        className={clsx(
          "p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-brand-blue transition-colors relative",
          className
        )}
        title="Share"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Share2 className="w-5 h-5" />}
      </button>
    );
  }

  return (
    <button 
      onClick={handleShare}
      disabled={loading}
      className={clsx(
        "flex items-center gap-3 px-8 py-3 bg-gray-50 text-brand-blue font-heading font-bold rounded-2xl border border-white",
        "shadow-[5px_5px_10px_#d1d5db,-5px_-5px_10px_#ffffff]",
        "hover:shadow-[inset_5px_5px_10px_#d1d5db,inset_-5px_-5px_10px_#ffffff]",
        "active:scale-95 transition-all duration-200",
        loading && "opacity-80 cursor-wait",
        className
      )}
    >
      {loading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin text-brand-blue" />
          <span>Generating...</span>
        </>
      ) : (
        <>
          <Share2 className="w-5 h-5 text-brand-yellow drop-shadow-sm" />
          <span>Share Leaderboard</span>
        </>
      )}
    </button>
  );
};
