import React from 'react';
import { SHARE_CARD, SHARE_CARD_BG } from '../../lib/share';

// Frame and shared chrome for the 1080×1350 social cards ("Masthead"
// direction, chosen from mockups Sep 2026). Everything is fixed-pixel and
// literal-hex on purpose: the card is rasterised off-screen, so it must not
// inherit viewport breakpoints or the `[data-theme]` token remaps.

export const ARCHIVO = 'Archivo, "Helvetica Neue", Arial, sans-serif';
export const MONO = '"JetBrains Mono", Menlo, Consolas, monospace';

export const NAVY = SHARE_CARD_BG;
export const YELLOW = '#ffc93c';
export const WHITE = '#ffffff';
export const RULE = 'rgba(255,255,255,0.18)';
export const RULE_SOFT = 'rgba(255,255,255,0.12)';
export const TILE = 'rgba(0,0,0,0.18)';
export const POSITIVE = '#7be495';
export const NEGATIVE = '#ff8a7a';

export const LEAGUE_NAME = 'Corporate Pickleball League';
export const SITE_URL = 'pickleball.ky/corporate-league';

interface ShareCardProps {
  /** Headline lines, e.g. ['Standings'] or ['Match', 'Result']. */
  title: string[];
  titleSize?: number;
  division: string;
  /** Right-aligned meta beside the division, e.g. season or date · season. */
  meta: string;
  /** Footer lines on the right, above the site URL. */
  footerLines?: string[];
  children: React.ReactNode;
}

export const ShareCard: React.FC<ShareCardProps> = ({ title, titleSize = 150, division, meta, footerLines = [], children }) => (
  <div
    style={{
      width: SHARE_CARD.width,
      height: SHARE_CARD.height,
      boxSizing: 'border-box',
      padding: '72px 72px 64px',
      background: NAVY,
      color: WHITE,
      fontFamily: ARCHIVO,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      position: 'relative',
    }}
  >
    <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 22, lineHeight: 1, letterSpacing: '0.35em', textTransform: 'uppercase', color: YELLOW }}>
      {LEAGUE_NAME}
    </div>

    <div style={{ fontWeight: 900, fontSize: titleSize, lineHeight: 0.85, letterSpacing: '-0.04em', textTransform: 'uppercase', marginTop: 22 }}>
      {title.map((line) => (
        <div key={line}>{line}</div>
      ))}
    </div>

    <div style={{ width: 180, height: 14, background: YELLOW, borderRadius: 2, margin: '34px 0 30px' }} />

    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 32 }}>
      <div style={{ fontWeight: 800, fontSize: 44, lineHeight: 1, letterSpacing: '0.02em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
        {division}
      </div>
      <div style={{ fontFamily: MONO, fontWeight: 600, fontSize: 20, lineHeight: 1, letterSpacing: '0.25em', textTransform: 'uppercase', opacity: 0.6, whiteSpace: 'nowrap' }}>
        {meta}
      </div>
    </div>

    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>{children}</div>

    <div style={{ marginTop: 'auto', paddingTop: 36, borderTop: `2px solid ${RULE}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontWeight: 800, fontSize: 24, lineHeight: 1, letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
        <img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="" width={56} height={56} style={{ width: 56, height: 56, borderRadius: 12, display: 'block' }} />
        Pickleball Cayman
      </div>
      <div style={{ fontFamily: MONO, fontWeight: 600, fontSize: 19, lineHeight: 1.5, letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.6, textAlign: 'right', whiteSpace: 'nowrap' }}>
        {footerLines.map((line) => (
          <div key={line}>{line}</div>
        ))}
        <div>{SITE_URL}</div>
      </div>
    </div>
  </div>
);
