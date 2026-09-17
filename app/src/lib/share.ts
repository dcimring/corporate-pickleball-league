// Pure helpers for the social share cards: device detection, capture and
// delivery. No React in here so the pieces are unit-testable.
import { domToBlob } from 'modern-screenshot';

// Portrait 4:5 — Instagram feed's largest size, fills a phone in WhatsApp,
// and posts to a Story with only light letterboxing.
export const SHARE_CARD = { width: 1080, height: 1350 } as const;

// Navy ground of the card; also the capture's fallback background so any
// transparent gap renders navy rather than white.
export const SHARE_CARD_BG = '#005596';

export type ShareMode = 'share' | 'download';

const MOBILE_UA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;

// Phones and tablets get the native share sheet; everything else downloads.
export const detectShareMode = (): ShareMode => {
  if (typeof navigator === 'undefined' || typeof window === 'undefined') return 'download';
  const touchDevice = MOBILE_UA.test(navigator.userAgent) || (navigator.maxTouchPoints > 0 && window.innerWidth < 1024);
  const canShareFiles = typeof navigator.share === 'function' && typeof navigator.canShare === 'function';
  return touchDevice && canShareFiles ? 'share' : 'download';
};

export const slugify = (value: string): string =>
  value
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'team';

const nextFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

export interface CaptureOptions {
  fileName: string;
  format?: 'jpeg' | 'png';
  quality?: number;
}

// Rasterises a mounted share card. The node is expected to be laid out at
// exactly SHARE_CARD size; width/height are pinned so the output never
// drifts with layout.
export const captureShareCard = async (node: HTMLElement, { fileName, format = 'jpeg', quality = 0.9 }: CaptureOptions): Promise<File> => {
  if (typeof document !== 'undefined' && 'fonts' in document) {
    await document.fonts.ready;
  }
  await nextFrame();
  await nextFrame();

  const type = format === 'jpeg' ? 'image/jpeg' : 'image/png';
  const blob = await domToBlob(node, {
    width: SHARE_CARD.width,
    height: SHARE_CARD.height,
    scale: 1,
    type,
    quality,
    backgroundColor: SHARE_CARD_BG,
  });
  if (!blob) throw new Error('Failed to generate share image');

  const extension = format === 'jpeg' ? 'jpg' : 'png';
  const baseName = fileName.replace(/\.(png|jpe?g)$/i, '');
  return new File([blob], `${baseName}.${extension}`, { type: blob.type || type });
};

export interface DeliverOptions {
  mode: ShareMode;
  title: string;
  text: string;
}

export type DeliverResult = 'shared' | 'downloaded' | 'cancelled';

const downloadFile = (file: File) => {
  const url = URL.createObjectURL(file);
  const link = document.createElement('a');
  link.download = file.name;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
};

// Hands the file to the native share sheet where available, otherwise
// triggers a download. A dismissed share sheet reports 'cancelled'.
export const deliverShareFile = async (file: File, { mode, title, text }: DeliverOptions): Promise<DeliverResult> => {
  const payload = { files: [file], title, text };
  if (mode === 'share' && navigator.canShare?.(payload)) {
    try {
      await navigator.share(payload);
      return 'shared';
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return 'cancelled';
      console.error('Web Share failed, falling back to download:', err);
    }
  }
  downloadFile(file);
  return 'downloaded';
};
