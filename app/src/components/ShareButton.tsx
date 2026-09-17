import React from 'react';
import { Share2, Loader2, Download } from 'lucide-react';
import { clsx } from 'clsx';
import type { ShareMode } from '../lib/share';

interface ShareButtonProps {
  onClick: () => void;
  mode: ShareMode;
  busy?: boolean;
  disabled?: boolean;
  labels?: { share: string; download: string };
  loadingLabel?: string;
  className?: string;
}

// Presentational trigger for a share card. The capture itself lives in
// `useShareCard`; this only picks the label and icon for the device.
export const ShareButton: React.FC<ShareButtonProps> = ({
  onClick,
  mode,
  busy = false,
  disabled = false,
  labels = { share: 'Share image', download: 'Download image' },
  loadingLabel = 'Generating…',
  className,
}) => {
  const label = mode === 'share' ? labels.share : labels.download;
  const Icon = mode === 'share' ? Share2 : Download;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy || disabled}
      aria-busy={busy}
      className={clsx(
        'inline-flex items-center justify-center gap-3 px-10 py-4 bg-navy text-white font-display font-extrabold text-[13px] tracking-widest uppercase rounded-full shadow-lg active:scale-95 transition-all duration-300',
        busy && 'opacity-80 cursor-wait',
        disabled && 'opacity-40 cursor-not-allowed',
        className
      )}
    >
      {busy ? <Loader2 className="w-5 h-5 animate-spin" /> : <Icon className="w-5 h-5 text-yellow" />}
      <span>{busy ? loadingLabel : label}</span>
    </button>
  );
};
