import React, { forwardRef } from 'react';
import { SHARE_CARD } from '../../lib/share';

// Off-screen mount point for a share card while it is being captured.
// Fixed positioning keeps it out of the document flow, so it never changes
// the iframe height or adds horizontal scroll.
export const ShareStage = forwardRef<HTMLDivElement, { children: React.ReactNode }>(({ children }, ref) => (
  <div
    aria-hidden
    inert
    style={{
      position: 'fixed',
      left: -10000,
      top: 0,
      width: SHARE_CARD.width,
      height: SHARE_CARD.height,
      overflow: 'hidden',
      pointerEvents: 'none',
      zIndex: -1,
    }}
  >
    <div ref={ref} style={{ width: SHARE_CARD.width, height: SHARE_CARD.height }}>
      {children}
    </div>
  </div>
));

ShareStage.displayName = 'ShareStage';
