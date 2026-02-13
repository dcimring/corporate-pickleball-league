import React, { useState } from 'react';
import { Share2, Loader2 } from 'lucide-react';
import { toBlob } from 'html-to-image';
import { clsx } from 'clsx';

interface ShareButtonProps {
  targetRef: React.RefObject<HTMLElement | null>;
  fileName?: string;
  className?: string;
  variant?: 'icon' | 'button';
  onShareStart?: () => void;
  onShareEnd?: () => void;
}

export const ShareButton: React.FC<ShareButtonProps> = ({ 
  targetRef, 
  fileName = 'pickleball-share.png',
  className,
  variant = 'button',
  onShareStart,
  onShareEnd
}) => {
  const [loading, setLoading] = useState(false);

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!targetRef.current) return;

    try {
      setLoading(true);
      onShareStart?.();

      // Wait a tick to ensure any hidden/rendering states are ready if needed
      await new Promise(resolve => setTimeout(resolve, 100));

      const blob = await toBlob(targetRef.current, {
        cacheBust: true,
        backgroundColor: '#FFFEFC', // Ensure background is captured
        pixelRatio: 2, // High res for retina
      });

      if (!blob) throw new Error('Failed to generate image');

      const timestamp = Date.now();
      const uniqueFileName = fileName.replace('.png', `-${timestamp}.png`);
      const file = new File([blob], uniqueFileName, { type: 'image/png' });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Corporate Pickleball League',
          text: 'Check out the latest stats from the Corporate Pickleball League! 🥒🏆',
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
        "btn-primary flex items-center gap-2 px-6 py-2 text-sm",
        loading && "opacity-80 cursor-wait",
        className
      )}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Generating...</span>
        </>
      ) : (
        <>
          <Share2 className="w-4 h-4" />
          <span>Share Standings</span>
        </>
      )}
    </button>
  );
};
