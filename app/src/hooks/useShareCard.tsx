import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ShareToastState } from '../components/ShareToast';
import { captureShareCard, deliverShareFile, detectShareMode, type ShareMode } from '../lib/share';

interface UseShareCardOptions<T> {
  fileName: (payload: T) => string;
  shareText: (payload: T) => string;
  shareTitle?: string;
  format?: 'jpeg' | 'png';
  quality?: number;
}

export interface UseShareCardResult<T> {
  /** Payload currently being captured; the page mounts a <ShareStage> with the card while non-null. */
  pending: T | null;
  /** Callback ref for the <ShareStage>; the capture reads this node once it is mounted. */
  mountStage: (node: HTMLDivElement | null) => void;
  request: (payload: T, toastTarget?: HTMLElement | null) => void;
  busy: boolean;
  mode: ShareMode;
  toast: ShareToastState | null;
  toastTarget: HTMLElement | null;
  dismissToast: () => void;
}

const TOAST_MS = 6000;

const SHARED_TOAST: ShareToastState = {
  title: 'SHARED SUCCESSFULLY',
  message: 'Your league coverage has been shared.',
  icon: 'share',
};

const DOWNLOADED_TOAST: ShareToastState = {
  title: 'IMAGE SAVED',
  message: (
    <>
      Check your <span className="font-bold underline decoration-yellow underline-offset-4">Downloads</span> folder to share.
    </>
  ),
  icon: 'download',
};

// Orchestrates one share: mount the card off-screen, rasterise it, hand it
// to the share sheet or a download, then show a toast.
export function useShareCard<T>(options: UseShareCardOptions<T>): UseShareCardResult<T> {
  const [pending, setPending] = useState<T | null>(null);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<ShareToastState | null>(null);
  const [toastTarget, setToastTarget] = useState<HTMLElement | null>(null);
  // A callback ref (not a RefObject) so the returned object holds no ref and
  // consumers can read `pending`/`busy` during render without lint noise.
  const stageNodeRef = useRef<HTMLDivElement | null>(null);
  const mountStage = useCallback((node: HTMLDivElement | null) => {
    stageNodeRef.current = node;
  }, []);
  const runningRef = useRef<T | null>(null);
  const optionsRef = useRef(options);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mode = useMemo(() => detectShareMode(), []);

  useEffect(() => {
    optionsRef.current = options;
  });

  const showToast = useCallback((state: ShareToastState) => {
    setToast(state);
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(50);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), TOAST_MS);
  }, []);

  const dismissToast = useCallback(() => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(null);
  }, []);

  useEffect(() => () => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
  }, []);

  useEffect(() => {
    if (pending === null) return;
    // StrictMode runs effects twice in dev; only start one capture per payload.
    if (runningRef.current === pending) return;
    runningRef.current = pending;
    const payload = pending;

    const run = async () => {
      const node = stageNodeRef.current;
      if (!node) {
        runningRef.current = null;
        setPending(null);
        return;
      }
      setBusy(true);
      try {
        const opts = optionsRef.current;
        const file = await captureShareCard(node, {
          fileName: opts.fileName(payload),
          format: opts.format,
          quality: opts.quality,
        });
        const result = await deliverShareFile(file, {
          mode,
          title: opts.shareTitle ?? 'Corporate Pickleball League',
          text: opts.shareText(payload),
        });
        if (result === 'shared') showToast(SHARED_TOAST);
        else if (result === 'downloaded') showToast(DOWNLOADED_TOAST);
      } catch (err) {
        console.error('Sharing failed:', err);
        alert('Could not create the share image. Try taking a screenshot!');
      } finally {
        runningRef.current = null;
        setBusy(false);
        setPending(null);
      }
    };
    void run();
  }, [pending, mode, showToast]);

  const request = useCallback((payload: T, target?: HTMLElement | null) => {
    if (runningRef.current !== null) return;
    setToastTarget(target ?? null);
    setPending(payload);
  }, []);

  return { pending, mountStage, request, busy, mode, toast, toastTarget, dismissToast };
}
