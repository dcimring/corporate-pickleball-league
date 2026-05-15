import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown, Crown } from 'lucide-react';
import type { LeaderboardEntry } from '../types';

interface LeaderboardTableProps {
  stats: LeaderboardEntry[];
  onTeamClick: (teamName: string) => void;
}

// Win/Loss proportion bar — yellow for wins, faint navy for losses.
const WLBar: React.FC<{ w: number; l: number }> = ({ w, l }) => {
  const total = w + l;
  const pct = total ? (w / total) * 100 : 0;
  return (
    <div className="wlbar flex flex-col gap-1.5 min-w-0" title={`${w} wins, ${l} losses`}>
      <div className="wlbar-track h-[7px] bg-rule rounded-full overflow-hidden relative">
        <div className="wlbar-w h-full bg-linear-to-r from-yellow to-[#ffd667] rounded-full" style={{ width: `${pct}%` }} />
      </div>
      <div className="wlbar-labels flex justify-between mono text-[11px]">
        <span className="wlbar-w-label text-navy font-bold">{w}<span className="dim">w</span></span>
        <span className="wlbar-l-label text-navy-faint">{l}<span className="dim">l</span></span>
      </div>
    </div>
  );
};

// Win % ring — thin circular progress (yellow on near-transparent navy).
const WinRing: React.FC<{ pct: number; size?: number; stroke?: number }> = ({ pct, size = 46, stroke = 5 }) => {
  const r = (size - stroke) / 2;
  const C = 2 * Math.PI * r;
  const dash = (pct / 100) * C;
  return (
    <div className="ring relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--rule-2)" strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--yellow)"
                strokeWidth={stroke} strokeLinecap="round"
                strokeDasharray={`${dash} ${C}`}
                transform={`rotate(-90 ${size/2} ${size/2})`} />
      </svg>
      <span className="ring-label absolute font-display font-bold text-[13px] text-navy inline-flex items-baseline">
        <strong className="font-extrabold">{pct.toFixed(0)}</strong><span className="ring-pct text-[9px] text-navy-faint ml-0.5">%</span>
      </span>
    </div>
  );
};

// Points for/against — center-anchored bar showing diff magnitude relative
// to the largest |diff| in the division.
const DiffBar: React.FC<{ pf: number; pa: number; diff: number; max: number }> = ({ pf, pa, diff, max }) => {
  const pct = max > 0 ? Math.min(100, (Math.abs(diff) / max) * 100) : 0;
  const positive = diff >= 0;
  return (
    <div className="diffbar flex flex-col gap-1.5 min-w-0">
      <div className="diffbar-track relative h-[7px] bg-rule rounded-full overflow-visible">
        <div className="diffbar-mid absolute left-1/2 top-[-2px] w-px h-[11px] bg-rule-3 translate-x-[-50%]" />
        <div
          className={`diffbar-fill absolute top-0 bottom-0 h-full rounded-sm ${positive ? "bg-success" : "bg-error"}`}
          style={{
            width: `${pct / 2}%`,
            left: positive ? "50%" : `${50 - pct/2}%`,
          }}
        />
      </div>
      <div className="diffbar-labels flex gap-1.5 mono text-[11px] text-navy-faint">
        <span className="text-navy font-bold">{pf}</span>
        <span className="dim">/</span>
        <span>{pa}</span>
      </div>
    </div>
  );
};

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ stats, onTeamClick }) => {
  const [sortConfig, setSortConfig] = useState<{ key: keyof LeaderboardEntry | 'rank' | 'diff'; direction: 'asc' | 'desc' }>({
    key: 'rank',
    direction: 'asc'
  });

  const maxDiff = useMemo(() => 
    stats.reduce((max, entry) => Math.max(max, Math.abs(entry.pointsFor - entry.pointsAgainst)), 1),
    [stats]
  );

  const sortedStats = useMemo(() => {
    const sortableItems = [...stats].map((item, idx) => ({ ...item, rank: idx + 1, diff: item.pointsFor - item.pointsAgainst }));
    
    sortableItems.sort((a: any, b: any) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    return sortableItems;
  }, [stats, sortConfig]);

  const requestSort = (key: any) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key) return null;
    return <span className="text-yellow ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>;
  };

  if (stats.length === 0) {
    return (
      <div className="empty-state bg-card border border-dashed border-rule-2 rounded-lg py-16 px-6 text-center text-navy-faint">
        <p className="mono">No standings yet for this division.</p>
        <p className="mt-1.5 text-muted text-[10px] mono">Check back after week 1.</p>
      </div>
    );
  }

  return (
    <section className="leaderboard bg-card rounded-lg border border-rule overflow-hidden shadow-[0_24px_60px_-40px_rgba(20,58,120,0.25)]">
      {/* Table Header */}
      <div className="lb-row lb-head bg-card-tint py-4 px-5.5 border-bottom border-rule">
        <button onClick={() => requestSort('rank')} className={`th text-left flex items-center gap-1.5 mono text-[11px] ${sortConfig.key === 'rank' ? 'text-navy' : 'text-navy-faint hover:text-navy-soft'}`}>
          Rank {getSortIcon('rank')}
        </button>
        <button onClick={() => requestSort('team')} className={`th text-left flex items-center gap-1.5 mono text-[11px] ${sortConfig.key === 'team' ? 'text-navy' : 'text-navy-faint hover:text-navy-soft'}`}>
          Team {getSortIcon('team')}
        </button>
        <button onClick={() => requestSort('wins')} className={`th text-left flex items-center gap-1.5 mono text-[11px] ${sortConfig.key === 'wins' ? 'text-navy' : 'text-navy-faint hover:text-navy-soft'}`}>
          W — L {getSortIcon('wins')}
        </button>
        <button onClick={() => requestSort('winPct')} className={`th text-left flex items-center gap-1.5 mono text-[11px] ${sortConfig.key === 'winPct' ? 'text-navy' : 'text-navy-faint hover:text-navy-soft'}`}>
          Win % {getSortIcon('winPct')}
        </button>
        <button onClick={() => requestSort('pointsFor')} className={`th text-left flex items-center gap-1.5 mono text-[11px] ${sortConfig.key === 'pointsFor' ? 'text-navy' : 'text-navy-faint hover:text-navy-soft'}`}>
          Pts for / against {getSortIcon('pointsFor')}
        </button>
        <button onClick={() => requestSort('diff')} className={`th text-right flex items-center justify-end gap-1.5 mono text-[11px] ${sortConfig.key === 'diff' ? 'text-navy' : 'text-navy-faint hover:text-navy-soft'}`}>
          Diff {getSortIcon('diff')}
        </button>
      </div>

      <div className="lb-body">
        {sortedStats.map((entry) => {
          const diff = entry.pointsFor - entry.pointsAgainst;
          const positive = diff >= 0;
          const isFeatured = entry.rank === 1 && sortConfig.key === 'rank' && sortConfig.direction === 'asc';

          return (
            <div 
              key={entry.team}
              onClick={() => onTeamClick(entry.team)}
              className={`lb-row lb-data group py-4.5 px-5.5 border-t border-rule transition-colors duration-150 cursor-pointer hover:bg-card-tint relative ${isFeatured ? 'lb-featured bg-linear-to-r from-[rgba(255,201,60,0.10)] via-[rgba(255,201,60,0.04)] to-transparent' : ''}`}
            >
              {isFeatured && <span className="lb-accent absolute left-0 top-2 bottom-2 w-1 bg-yellow rounded-r-[3px]" />}

              <div className="col-rank flex items-center gap-2">
                <span className={`rank-num font-mono font-semibold text-[22px] tracking-wider ${isFeatured ? 'text-navy font-bold' : 'text-navy-faint'}`}>
                  {String(entry.rank).padStart(2, "0")}
                </span>
                {isFeatured && <Crown size={18} className="text-yellow" />}
              </div>

              <div className="col-team flex flex-col gap-1">
                <span className={`team-name font-display font-extrabold leading-[1.05] tracking-wide uppercase group-hover:underline decoration-yellow decoration-2 underline-offset-4 transition-all ${isFeatured ? 'text-[clamp(20px,2vw,28px)]' : 'text-[clamp(18px,1.8vw,24px)]'}`}>
                  {entry.team}
                </span>
                {isFeatured && <span className="lb-pill self-start inline-flex items-center px-2 py-0.5 bg-yellow text-navy rounded-sm text-[9.5px] font-semibold mono">Top of the table</span>}
              </div>

              <div className="col-wl">
                <WLBar w={entry.wins} l={entry.losses} />
              </div>

              <div className="col-pct">
                <WinRing pct={entry.winPct * 100} />
              </div>

              <div className="col-pts">
                <DiffBar pf={entry.pointsFor} pa={entry.pointsAgainst} diff={diff} max={maxDiff} />
              </div>

              <div className="col-diff flex justify-end">
                <span className={`diff-chip inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[12px] font-bold mono ${positive ? 'bg-[rgba(31,155,81,0.10)] text-success' : 'bg-[rgba(214,54,42,0.10)] text-error'}`}>
                  {positive ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                  {positive ? "+" : ""}{diff}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <footer className="lb-foot flex items-center justify-between py-4 px-5.5 bg-card-tint border-t border-rule text-navy-faint text-[11px] mono">
        <span>{stats.length} teams · Standings</span>
        <span>Sorted by {sortConfig.key} ({sortConfig.direction})</span>
      </footer>
    </section>
  );
};
