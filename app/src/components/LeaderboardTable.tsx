import React, { useMemo, useState } from 'react';
import { ArrowUp, ArrowDown, Crown, Info } from 'lucide-react';
import type { LeaderboardEntry } from '../types';

interface LeaderboardTableProps {
  stats: LeaderboardEntry[];
  onTeamClick: (teamName: string) => void;
}

type SortKey = keyof LeaderboardEntry | 'rank' | 'diff';

const SORT_LABELS: Partial<Record<SortKey, string>> = {
  rank: 'Rank',
  team: 'Team',
  wins: 'W-L',
  winPct: 'Win %',
  pointsFor: 'Points For',
  diff: 'Diff'
};

const HEADER_COLS: { key: SortKey; className: string; desktop: string; mobile: string }[] = [
  { key: 'rank', className: 'col-rank text-left', desktop: 'Rank', mobile: '#' },
  { key: 'team', className: 'col-team text-left', desktop: 'Team', mobile: 'Team' },
  { key: 'wins', className: 'col-wl justify-center', desktop: 'W — L', mobile: 'W-L' },
  { key: 'winPct', className: 'col-pct justify-center', desktop: 'Win %', mobile: 'WIN%' },
  { key: 'pointsFor', className: 'col-pts justify-center', desktop: 'Pts for / against', mobile: 'PTS' },
  { key: 'diff', className: 'col-diff justify-end', desktop: 'Diff', mobile: 'DIFF' }
];

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ stats, onTeamClick }) => {
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'asc' | 'desc' }>({
    key: 'rank',
    direction: 'asc'
  });

  const sortedStats = useMemo(() => {
    const sortableItems = [...stats].map((item, idx) => ({ ...item, rank: idx + 1, diff: item.pointsFor - item.pointsAgainst }));
    
    sortableItems.sort((a, b) => {
      const aVal = a[sortConfig.key as keyof typeof a];
      const bVal = b[sortConfig.key as keyof typeof b];
      
      if (aVal < bVal) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aVal > bVal) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    return sortableItems;
  }, [stats, sortConfig]);

  const requestSort = (key: SortKey) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key) return null;
    return <span aria-hidden="true" className="text-yellow-deep ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>;
  };

  if (stats.length === 0) {
    return (
      <div className="py-32 text-center flex flex-col items-center justify-center gap-8 bg-card border border-dashed border-rule-2 rounded-lg">
        <div className="bg-navy/5 p-8 rounded-full">
          <Info className="w-12 h-12 text-navy opacity-20" />
        </div>
        <div className="space-y-4">
          <h3 className="font-display font-black text-navy uppercase text-2xl">No standings found</h3>
          <p className="font-display font-medium text-navy-faint opacity-60 max-w-md mx-auto">
            The league is preparing for action. Check back soon for the latest standings and results.
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="leaderboard">
      {/* Table Header */}
      <div className="lb-row lb-head bg-card-tint py-4 px-1.25 md:px-5.5 border-b border-rule">
        {HEADER_COLS.map((col) => {
          const isActive = sortConfig.key === col.key;
          return (
            <button
              key={col.key}
              onClick={() => requestSort(col.key)}
              aria-pressed={isActive}
              aria-label={isActive
                ? `${SORT_LABELS[col.key]}, sorted ${sortConfig.direction === 'asc' ? 'ascending' : 'descending'}`
                : `Sort by ${SORT_LABELS[col.key]}`}
              className={`th ${col.className} flex items-center gap-1.5 mono text-[11px] whitespace-nowrap ${isActive ? 'text-navy' : 'text-navy-faint hover:text-navy-soft'}`}
            >
              {col.desktop === col.mobile ? col.desktop : (
                <>
                  <span className="hidden md:inline">{col.desktop}</span>
                  <span className="md:hidden">{col.mobile}</span>
                </>
              )}
              {getSortIcon(col.key)}
            </button>
          );
        })}
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
              className={`lb-row lb-data group py-4.5 px-1.25 md:px-5.5 border-t border-rule transition-colors duration-150 cursor-pointer hover:bg-card-tint relative ${isFeatured ? 'lb-featured bg-linear-to-r from-[rgba(255,201,60,0.10)] via-[rgba(255,201,60,0.04)] to-transparent' : ''}`}
            >

              {isFeatured && <span className="lb-accent absolute left-0 top-2 bottom-2 w-1 bg-yellow rounded-r-[3px]" />}

              <div className="col-rank flex items-center gap-2">
                <span className={`rank-num font-mono font-semibold text-[22px] tracking-wider ${isFeatured ? 'text-navy font-bold' : 'text-navy-faint'}`}>
                  {String(entry.rank).padStart(2, "0")}
                </span>
                {isFeatured && <Crown size={18} className="text-yellow" />}
              </div>

              <div className="col-team flex flex-col gap-1 min-w-0">
                <button
                  onClick={(e) => { e.stopPropagation(); onTeamClick(entry.team); }}
                  aria-label={`View matches for ${entry.team}`}
                  className={`team-name text-left font-display font-extrabold leading-[1.05] tracking-wide uppercase group-hover:underline decoration-yellow decoration-2 underline-offset-4 transition-all rounded-sm focus-visible:outline-2 focus-visible:outline-yellow focus-visible:outline-offset-2 ${isFeatured ? 'text-[clamp(20px,2vw,28px)]' : 'text-[clamp(18px,1.8vw,24px)]'}`}
                >
                  {entry.team}
                </button>
                {isFeatured && <span className="lb-pill self-start inline-flex items-center px-2 py-0.5 bg-yellow text-navy rounded-sm text-[9.5px] font-semibold mono whitespace-nowrap">Top of the table</span>}
              </div>

              <div className="col-wl flex justify-center">
                <span className="mono text-[14px] whitespace-nowrap">
                  <strong className="text-navy font-bold">{entry.wins}</strong>
                  <span className="md:hidden text-navy-faint opacity-50">-</span>
                  <span className="hidden md:inline dim mx-1">—</span>
                  <span className="text-navy-faint">{entry.losses}</span>
                </span>
              </div>

              <div className="col-pct flex justify-center">
                {/* Desktop/Tablet: Dynamic Bar */}
                <div className="hidden sm:flex items-center justify-center w-full max-w-[100px] h-7 bg-navy/5 rounded-[4px] relative overflow-hidden">
                  <div 
                    className="absolute left-0 top-0 bottom-0 bg-navy/15 transition-all duration-500 ease-out"
                    style={{ width: `${entry.winPct * 100}%` }}
                  />
                  <span className="relative z-10 text-navy text-[13px] font-bold mono">
                    {(entry.winPct * 100).toFixed(0)}
                    <span className="text-[10px] opacity-60 ml-0.5">%</span>
                  </span>
                </div>

                {/* Mobile: Dynamic Bar (Compact) */}
                <div className="flex sm:hidden items-center justify-center w-full max-w-[64px] h-6.5 bg-navy/5 rounded-[4px] relative overflow-hidden">
                  <div 
                    className="absolute left-0 top-0 bottom-0 bg-navy/15 transition-all duration-500 ease-out"
                    style={{ width: `${entry.winPct * 100}%` }}
                  />
                  <span className="relative z-10 text-navy text-[12px] font-bold mono">
                    {(entry.winPct * 100).toFixed(0)}
                    <span className="text-[9px] opacity-60 ml-0.5">%</span>
                  </span>
                </div>
              </div>

              <div className="col-pts flex justify-center">
                <span className="mono text-[14px] whitespace-nowrap">
                  <strong className="text-navy font-bold">{entry.pointsFor}</strong>
                  <span className="hidden md:inline">
                    <span className="dim mx-1">/</span>
                    <span className="text-navy-faint">{entry.pointsAgainst}</span>
                  </span>
                </span>
              </div>

              <div className="col-diff flex justify-end">
                <span className={`diff-chip inline-flex items-center justify-center gap-1.5 px-2 py-1 rounded-md text-[12px] font-bold mono ${positive ? 'bg-[rgba(31,155,81,0.10)] text-success' : 'bg-[rgba(214,54,42,0.10)] text-error'}`}>
                  {positive ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                  {positive ? "+" : ""}{diff}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <footer className="lb-foot flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-4 px-1.25 md:px-5.5 bg-card-tint border-t border-rule text-navy-faint text-[11px] mono">
        <span className="whitespace-nowrap">{stats.length} teams · Standings</span>
        <span className="whitespace-nowrap">Sorted by {SORT_LABELS[sortConfig.key] ?? sortConfig.key} ({sortConfig.direction === 'asc' ? 'ascending' : 'descending'})</span>
      </footer>
    </section>
  );
};
