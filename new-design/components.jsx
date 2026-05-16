// Shared chrome: logo, top tabs, division pills, page header. Vanilla JSX.
// All components are attached to window at the bottom so other Babel scripts
// can reach them.

const { useState, useEffect, useRef } = React;

// ───────────────────────────────────────────────────────────── Logo / icons ──
function Logo({ size = 28, color = "var(--yellow)" }) {
  // Three slanted bars — preserved from the original brand mark.
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" aria-hidden="true">
      <g fill={color}>
        <rect x="2"  y="6" width="4" height="16" transform="skewX(-20)" rx="1" />
        <rect x="11" y="6" width="4" height="16" transform="skewX(-20)" rx="1" />
        <rect x="20" y="6" width="4" height="16" transform="skewX(-20)" rx="1" />
      </g>
    </svg>
  );
}

function MenuIcon({ size = 24 }) {
  // Three vertical bars on the right side of the original header.
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <g fill="var(--navy-faint)">
        <rect x="5"  y="5" width="3" height="14" rx="0.5" />
        <rect x="10.5" y="5" width="3" height="14" rx="0.5" />
        <rect x="16" y="5" width="3" height="14" rx="0.5" />
      </g>
    </svg>
  );
}

function ShareIcon({ size = 14, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="12" cy="3.5" r="1.8" stroke={color} strokeWidth="1.2" />
      <circle cx="4"  cy="8"   r="1.8" stroke={color} strokeWidth="1.2" />
      <circle cx="12" cy="12.5" r="1.8" stroke={color} strokeWidth="1.2" />
      <line x1="5.5" y1="7.1" x2="10.5" y2="4.4" stroke={color} strokeWidth="1.2" />
      <line x1="5.5" y1="8.9" x2="10.5" y2="11.6" stroke={color} strokeWidth="1.2" />
    </svg>
  );
}

function InfoIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" />
      <line x1="8" y1="7.2" x2="8" y2="11.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <circle cx="8" cy="5" r="0.9" fill="currentColor" />
    </svg>
  );
}

function CrownIcon({ size = 22, color = "var(--yellow)" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 8 L7 13 L12 5 L17 13 L21 8 L19 19 H5 Z" fill={color} stroke="var(--navy)" strokeWidth="1.2" strokeLinejoin="round"/>
    </svg>
  );
}

function ArrowUp({ size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" aria-hidden="true">
      <path d="M6 2 L10 7 H7.5 V10 H4.5 V7 H2 Z" fill="currentColor" />
    </svg>
  );
}
function ArrowDown({ size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" aria-hidden="true">
      <path d="M6 10 L10 5 H7.5 V2 H4.5 V5 H2 Z" fill="currentColor" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────── Top header ──
function TopBar({ tab, onTab }) {
  return (
    <header className="topbar" data-screen-label="header">
      <div className="topbar-side topbar-left">
        <a className="brand" href="#">
          <Logo />
          <span className="brand-name mono">CPL</span>
        </a>
      </div>

      <nav className="topbar-tabs" role="tablist">
        <button
          role="tab"
          className={`tab ${tab === "leaderboard" ? "tab-active" : ""}`}
          onClick={() => onTab("leaderboard")}
        >
          Leaderboard
        </button>
        <button
          role="tab"
          className={`tab ${tab === "matches" ? "tab-active" : ""}`}
          onClick={() => onTab("matches")}
        >
          Matches
        </button>
      </nav>

      <div className="topbar-side topbar-right">
        <button className="icon-btn" aria-label="View options">
          <MenuIcon />
        </button>
      </div>
    </header>
  );
}

// ─────────────────────────────────────────────────────── Division switcher ──
function DivisionTabs({ value, onChange, divisions }) {
  return (
    <div className="div-tabs" role="tablist" aria-label="Division">
      <div className="div-tabs-inner">
        {divisions.map((d) => (
          <button
            key={d}
            role="tab"
            className={`div-tab ${value === d ? "div-tab-active" : ""}`}
            onClick={() => onChange(d)}
          >
            <span className="div-tab-label mono">{d}</span>
            {value === d && <span className="div-tab-underline" />}
          </button>
        ))}
      </div>
      <div className="div-tabs-rule" />
    </div>
  );
}

// ───────────────────────────────────────────────── Tip / meta info banner ──
function MetaBanner({ tip = true, asOf }) {
  const [tipOpen, setTipOpen] = useState(tip);
  return (
    <div className="meta">
      {tipOpen && (
        <div className="meta-tip">
          <span className="meta-tip-icon"><InfoIcon /></span>
          <span className="mono">Tip: click team name to see all matches</span>
          <button className="meta-close" onClick={() => setTipOpen(false)} aria-label="Dismiss tip">×</button>
        </div>
      )}
      {asOf && (
        <div className="meta-asof">
          <span className="meta-dot" />
          <span className="mono">Data current through {asOf}</span>
          <span className="meta-dot" />
        </div>
      )}
    </div>
  );
}

Object.assign(window, {
  Logo, MenuIcon, ShareIcon, InfoIcon, CrownIcon, ArrowUp, ArrowDown,
  TopBar, DivisionTabs, MetaBanner,
});
