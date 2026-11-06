import React, { useMemo, useState } from 'react';
import { Info } from 'lucide-react';
import type { LeaderboardEntry, Match } from '../types';
import { teamRecords, type FormResult } from '../lib/results';

interface LeaderboardTableProps {
  stats: LeaderboardEntry[];
  /** The division's matches; used for match record (W-D-L) and form. */
  matches: Match[];
  onTeamClick: (teamName: string) => void;
}

interface Row extends LeaderboardEntry {
  rank: number;
  diff: number;
  matchWins: number;
  drawn: number;
  lost: number;
  form: FormResult[];
}

type SortKey = 'rank' | 'team' | 'matchWins' | 'wins' | 'winPct' | 'pointsFor' | 'pointsAgainst' | 'diff';

const COLS: { key: SortKey; label: string; srLabel: string; align: string; title?: string }[] = [
  { key: 'rank', label: 'Pos', srLabel: 'Position', align: 'justify-start' },
  { key: 'team', label: 'Team · last 5', srLabel: 'Team', align: 'justify-start' },
  { key: 'matchWins', label: 'Matches W-D-L', srLabel: 'Matches won', align: 'justify-center' },
  { key: 'wins', label: 'Games', srLabel: 'Games won', align: 'justify-center' },
  { key: 'winPct', label: 'Games won %', srLabel: 'Games won percentage', align: 'justify-start' },
  { key: 'pointsFor', label: 'PF', srLabel: 'Points for', align: 'justify-center', title: 'Points for' },
  { key: 'pointsAgainst', label: 'PA', srLabel: 'Points against', align: 'justify-center', title: 'Points against' },
  { key: 'diff', label: 'Pts +/-', srLabel: 'Points difference', align: 'justify-end' },
];

// Desktop grid: rank, team, record, games, pct bar, PF, PA, diff.
const DESKTOP_GRID = 'lg:grid lg:grid-cols-[64px_minmax(0,1fr)_116px_92px_150px_56px_56px_84px] lg:items-center lg:gap-3';

const FORM_WORD: Record<FormResult, string> = { W: 'won', D: 'drew', L: 'lost' };
const FORM_STYLE: Record<FormResult, string> = {
  W: 'bg-navy text-white border-navy',
  D: 'bg-[#eef2f7] text-[#4f6680] border-[#eef2f7]',
  L: 'bg-white text-[#b42318] border-[rgba(180,35,24,0.35)]',
};

const FormChips: React.FC<{ form: FormResult[]; size: 'sm' | 'md' }> = ({ form, size }) => {
  if (form.length === 0) return null;
  const dims = size === 'md' ? 'w-5 h-5 text-[10px]' : 'w-[18px] h-[18px] text-[9px]';
  return (
    <span
      role="img"
      aria-label={`Last ${form.length}, oldest first: ${form.map((f) => FORM_WORD[f]).join(', ')}`}
      className="flex gap-[3px] lg:gap-1"
    >
      {form.map((f, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={`${dims} inline-flex items-center justify-center rounded border mono font-bold ${FORM_STYLE[f]}`}
        >
          {f}
        </span>
      ))}
    </span>
  );
};

const DiffChip: React.FC<{ diff: number; size: 'sm' | 'md' }> = ({ diff, size }) => {
  const positive = diff >= 0;
  return (
    <span
      className={`inline-block rounded-md mono font-bold tabular-nums ${size === 'md' ? 'px-2.5 py-1 text-[13px]' : 'px-2 py-0.5 text-[12px]'} ${
        positive ? 'bg-[#e7f4ec] text-[#17733d]' : 'bg-[#fdecea] text-[#b42318]'
      }`}
    >
      {positive ? '+' : '−'}{Math.abs(diff)}
    </span>
  );
};

const PctBar: React.FC<{ pct: number; featured: boolean; className: string }> = ({ pct, featured, className }) => (
  <span aria-hidden="true" className={`block bg-navy/[0.08] rounded overflow-hidden ${className}`}>
    <span
      className={`block h-full rounded ${featured ? 'bg-[#e0a800]' : 'bg-navy'}`}
      style={{ width: `${(pct * 100).toFixed(1)}%` }}
    />
  </span>
);

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ stats, matches, onTeamClick }) => {
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'asc' | 'desc' }>({
    key: 'rank',
    direction: 'asc',
  });

  const rows = useMemo<Row[]>(() => {
    const records = teamRecords(matches);
    const withRank = stats.map((entry, idx) => {
      const r = records.get(entry.team);
      return {
        ...entry,
        rank: idx + 1,
        diff: entry.pointsFor - entry.pointsAgainst,
        matchWins: r?.won ?? 0,
        drawn: r?.drawn ?? 0,
        lost: r?.lost ?? 0,
        form: r?.form ?? [],
      };
    });
    const { key, direction } = sortConfig;
    return withRank.sort((a, b) => {
      const av = a[key];
      const bv = b[key];
      if (av < bv) return direction === 'asc' ? -1 : 1;
      if (av > bv) return direction === 'asc' ? 1 : -1;
      return a.rank - b.rank;
    });
  }, [stats, matches, sortConfig]);

  const requestSort = (key: SortKey) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
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

  const isDefaultOrder = sortConfig.key === 'rank' && sortConfig.direction === 'asc';

  return (
    <div className="flex flex-col gap-4 md:gap-5">
      <section
        aria-label="Standings"
        className="leaderboard border border-rule-2 rounded-[14px] bg-white overflow-hidden shadow-[0_24px_60px_-40px_rgba(20,58,120,0.25)]"
      >
        {/* Desktop header: sortable columns */}
        <div className={`hidden ${DESKTOP_GRID} px-6 py-3.5 border-b border-rule-2`}>
          {COLS.map((col) => {
            const isActive = sortConfig.key === col.key;
            return (
              <button
                key={col.key}
                type="button"
                onClick={() => requestSort(col.key)}
                aria-pressed={isActive}
                aria-label={isActive
                  ? `${col.srLabel}, sorted ${sortConfig.direction === 'asc' ? 'ascending' : 'descending'}`
                  : `Sort by ${col.srLabel}`}
                title={col.title}
                className={`flex ${col.align} items-center gap-1 mono text-[11px] font-bold tracking-[0.08em] uppercase whitespace-nowrap ${
                  isActive ? 'text-navy' : 'text-navy-faint hover:text-navy'
                }`}
              >
                {col.label}
                {isActive && !isDefaultOrder && (
                  <span aria-hidden="true" className="text-yellow-deep">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Phone/tablet header */}
        <div className="lg:hidden flex justify-between px-3.5 py-2.5 border-b border-rule-2 mono text-[10px] font-bold tracking-[0.08em] uppercase text-navy-faint">
          <span>Team · last 5</span>
          <span>Games won % · +/-</span>
        </div>

        {rows.map((row) => {
          const featured = row.rank === 1 && isDefaultOrder;
          const pct = `${(row.winPct * 100).toFixed(0)}%`;
          const record = `${row.matchWins}-${row.drawn}-${row.lost}`;
          const games = `${row.wins}–${row.losses}`;
          const rankBadge = (cls: string) => (
            <span
              className={`inline-flex items-center justify-center flex-none mono font-bold ${cls} ${
                featured ? 'bg-yellow text-[#00365f]' : 'bg-[#f2f5f9] text-navy'
              }`}
            >
              {row.rank}
            </span>
          );
          const teamButton = (cls: string) => (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onTeamClick(row.team); }}
              aria-label={`View matches for ${row.team}`}
              className={`block max-w-full text-left font-display font-extrabold text-navy truncate rounded-sm hover:underline decoration-yellow decoration-2 underline-offset-4 focus-visible:outline-2 focus-visible:outline-yellow focus-visible:outline-offset-2 ${cls}`}
            >
              {row.team}
            </button>
          );

          return (
            <div
              key={row.team}
              onClick={() => onTeamClick(row.team)}
              className={`cursor-pointer border-b border-rule last:border-b-0 transition-colors ${
                featured ? 'bg-[#fff8e4]' : 'bg-white hover:bg-[#f7f9fc]'
              }`}
            >
              {/* Desktop row */}
              <div className={`hidden ${DESKTOP_GRID} px-6 py-3.5`}>
                {rankBadge('w-10 h-10 rounded-[10px] text-[18px]')}
                <div className="flex flex-col gap-1.5 min-w-0">
                  {teamButton('text-[18px]')}
                  <FormChips form={row.form} size="md" />
                </div>
                <span className="text-center mono text-[15px] font-bold text-navy tabular-nums">{record}</span>
                <span className="text-center mono text-[14px] font-semibold text-[#4f6680] tabular-nums">{games}</span>
                <span className="flex items-center gap-2.5">
                  <PctBar pct={row.winPct} featured={featured} className="flex-1 h-2" />
                  <span className="w-11 text-right mono text-[14px] font-bold text-navy tabular-nums">{pct}</span>
                </span>
                <span className="text-center mono text-[14px] font-semibold text-[#4f6680] tabular-nums">{row.pointsFor}</span>
                <span className="text-center mono text-[14px] font-semibold text-[#4f6680] tabular-nums">{row.pointsAgainst}</span>
                <span className="text-right"><DiffChip diff={row.diff} size="md" /></span>
              </div>

              {/* Phone/tablet row */}
              <div className="lg:hidden flex items-center gap-3 p-3.5">
                {rankBadge('w-[34px] h-[34px] rounded-[9px] text-[16px]')}
                <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                  {teamButton('text-[16px]')}
                  <FormChips form={row.form} size="sm" />
                  <span className="mono text-[11px] font-semibold text-[#4f6680]">
                    {record} · games {games}
                  </span>
                </div>
                <div className="flex-none flex flex-col items-end gap-1.5">
                  <span className="mono text-[18px] font-bold text-navy tabular-nums">{pct}</span>
                  <PctBar pct={row.winPct} featured={featured} className="w-16 h-1.5" />
                  <DiffChip diff={row.diff} size="sm" />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <p className="m-0 text-[12px] md:text-[13px] font-semibold text-navy-faint leading-relaxed">
        W-D-L counts matches won, drawn and lost; a match level on games goes to the side with more points.
        Ranked by games won %, then points for (PF). PA is points against. Tap a team to see its matches.
      </p>
    </div>
  );
};
