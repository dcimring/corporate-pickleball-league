import React, { useMemo, useState } from 'react';
import { ArrowUp, ArrowDown, Crown, Info } from 'lucide-react';
import type { LeaderboardEntry } from '../types';

interface LeaderboardTableProps {
  stats: LeaderboardEntry[];
  onTeamClick: (teamName: string) => void;
}

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ stats, onTeamClick }) => {
  const [sortConfig, setSortConfig] = useState<{ key: keyof LeaderboardEntry | 'rank' | 'diff'; direction: 'asc' | 'desc' }>({
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

  const requestSort = (key: keyof LeaderboardEntry | 'rank' | 'diff') => {
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
      <div className="lb-row lb-head bg-card-tint py-4 px-5.5 border-bottom border-rule">
        <button onClick={() => requestSort('rank')} className={`th col-rank text-left flex items-center gap-1.5 mono text-[11px] ${sortConfig.key === 'rank' ? 'text-navy' : 'text-navy-faint hover:text-navy-soft'}`}>
          <span className="hidden md:inline">Rank</span>
          <span className="md:hidden">#</span>
          {getSortIcon('rank')}
        </button>
        <button onClick={() => requestSort('team')} className={`th col-team text-left flex items-center gap-1.5 mono text-[11px] ${sortConfig.key === 'team' ? 'text-navy' : 'text-navy-faint hover:text-navy-soft'}`}>
          Team {getSortIcon('team')}
        </button>
        <button onClick={() => requestSort('wins')} className={`th col-wl justify-center flex items-center gap-1.5 mono text-[11px] ${sortConfig.key === 'wins' ? 'text-navy' : 'text-navy-faint hover:text-navy-soft'}`}>
          <span className="hidden md:inline">W — L</span>
          <span className="md:hidden">W-L</span>
          {getSortIcon('wins')}
        </button>
        <button onClick={() => requestSort('winPct')} className={`th col-pct justify-center flex items-center gap-1.5 mono text-[11px] ${sortConfig.key === 'winPct' ? 'text-navy' : 'text-navy-faint hover:text-navy-soft'}`}>
          <span className="hidden md:inline">Win %</span>
          <span className="md:hidden">WIN%</span>
          {getSortIcon('winPct')}
        </button>
        <button onClick={() => requestSort('pointsFor')} className={`th col-pts justify-center flex items-center gap-1.5 mono text-[11px] ${sortConfig.key === 'pointsFor' ? 'text-navy' : 'text-navy-faint hover:text-navy-soft'}`}>
          <span className="hidden md:inline">Pts for / against</span>
          <span className="md:hidden">PTS</span>
          {getSortIcon('pointsFor')}
        </button>
        <button onClick={() => requestSort('diff')} className={`th col-diff justify-end flex items-center gap-1.5 mono text-[11px] ${sortConfig.key === 'diff' ? 'text-navy' : 'text-navy-faint hover:text-navy-soft'}`}>
          <span className="hidden md:inline">Diff</span>
          <span className="md:hidden">DIFF</span>
          {getSortIcon('diff')}
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

              <div className="col-team flex flex-col gap-1 min-w-0">
                <span className={`team-name font-display font-extrabold leading-[1.05] tracking-wide uppercase group-hover:underline decoration-yellow decoration-2 underline-offset-4 transition-all ${isFeatured ? 'text-[clamp(20px,2vw,28px)]' : 'text-[clamp(18px,1.8vw,24px)]'}`}>
                  {entry.team}
                </span>
                {isFeatured && <span className="lb-pill self-start inline-flex items-center px-2 py-0.5 bg-yellow text-navy rounded-sm text-[9.5px] font-semibold mono">Top of the table</span>}
              </div>

              <div className="col-wl flex justify-center">
                <span className="mono text-[14px]">
                  <strong className="text-navy font-bold">{entry.wins}</strong>
                  <span className="md:hidden text-navy-faint opacity-50">-</span>
                  <span className="hidden md:inline dim mx-1">—</span>
                  <span className="text-navy-faint">{entry.losses}</span>
                </span>
              </div>

              <div className="col-pct flex justify-center">
                <span className="mono text-[14px]">
                  <strong className="text-navy font-bold">{(entry.winPct * 100).toFixed(0)}</strong>
                  <span className="dim">%</span>
                </span>
              </div>

              <div className="col-pts flex justify-center">
                <span className="mono text-[14px]">
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

      <footer className="lb-foot flex items-center justify-between py-4 px-5.5 bg-card-tint border-t border-rule text-navy-faint text-[11px] mono">
        <span>{stats.length} teams · Standings</span>
        <span>Sorted by {sortConfig.key} ({sortConfig.direction})</span>
      </footer>
    </section>
  );
};
