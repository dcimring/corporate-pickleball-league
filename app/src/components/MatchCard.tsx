import React, { useRef } from 'react';
import { clsx } from 'clsx';
import { Loader2, Share2 } from 'lucide-react';
import type { Match } from '../types';

interface MatchCardProps {
  match: Match;
  onTeamClick?: (teamName: string) => void;
  /** Called with the match and the card's toast overlay element. */
  onShare?: (match: Match, toastTarget: HTMLElement | null) => void;
  isSharing?: boolean;
}

const MarginBar: React.FC<{ wins1: number; wins2: number; isWin1: boolean }> = ({ wins1, wins2, isWin1 }) => {
  const total = wins1 + wins2 || 1;
  const p1 = (wins1 / total) * 100;
  const p2 = (wins2 / total) * 100;
  return (
    <div className="margin-bar h-[5px] bg-rule rounded-sm overflow-hidden flex gap-[2px]">
      <div className={`margin-a h-full ${isWin1 ? 'bg-yellow' : 'bg-rule-2'}`} style={{ width: `${p1}%` }} />
      <div className={`margin-b h-full ${!isWin1 ? 'bg-yellow' : 'bg-rule-2'}`} style={{ width: `${p2}%` }} />
    </div>
  );
};

export const MatchCard: React.FC<MatchCardProps> = ({ match, onTeamClick, onShare, isSharing }) => {
  const toastContainerRef = useRef<HTMLDivElement>(null);

  const isWin1 = match.team1Wins > match.team2Wins || (match.team1Wins === match.team2Wins && match.team1Points > match.team2Points);
  const isWin2 = match.team2Wins > match.team1Wins || (match.team2Wins === match.team1Wins && match.team2Points > match.team1Points);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      timeZone: 'UTC'
    }).format(date).toUpperCase();
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onShare?.(match, toastContainerRef.current);
  };

  return (
    <div className="match-card p-5.5 md:p-6 flex flex-col gap-4.5 relative group overflow-hidden bg-white">
      <div ref={toastContainerRef} className="absolute inset-0 z-[100] pointer-events-none flex items-center justify-center p-2" />

      {/* Match Header */}
      <div className="match-head flex items-center justify-between gap-3 flex-shrink-0">
        <span className="match-date text-navy-faint mono text-[11px] whitespace-nowrap">{formatDate(match.date)}</span>
        <div className="match-head-right flex items-center gap-3">
          <div className="match-pts text-navy-faint text-[12px] mono">
            <strong className={clsx("transition-colors", isWin1 ? "text-navy font-bold" : "text-navy-faint font-semibold")}>{match.team1Points}</strong>
            <span className="mx-1 text-rule-3">/</span>
            <strong className={clsx("transition-colors", isWin2 ? "text-navy font-bold" : "text-navy-faint font-semibold")}>{match.team2Points}</strong>
            <span className="ml-1 text-[10px] opacity-40">PTS</span>
          </div>

          {onShare && (
            <button
              type="button"
              onClick={handleShareClick}
              disabled={isSharing}
              aria-label={`Share result: ${match.team1} vs ${match.team2}`}
              title="Share result"
              className="match-share w-6.5 h-6.5 flex items-center justify-center rounded-md hover:bg-rule transition-colors text-navy-faint hover:text-navy disabled:cursor-wait"
            >
              {isSharing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Share2 className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>

      {/* Match Body */}
      <div className="match-body flex flex-col gap-0.5 -mx-1 flex-1 justify-center">
        {/* Team 1 Row */}
        <div className={clsx("mt-row grid grid-cols-[1fr_auto] items-center gap-4 px-1 py-1.5 rounded-md transition-colors", isWin1 ? "mt-row-win" : "mt-row-lose")}>
          <div className="mt-name-wrap flex items-center gap-3 min-w-0">
            <span className={clsx("mt-dot w-2 h-2 rounded-full border-[1.5px] flex-shrink-0 transition-all", isWin1 ? "on bg-yellow border-yellow shadow-[0_0_0_4px_var(--yellow-glow)]" : "border-rule-2")} />
            <button
              onClick={() => onTeamClick?.(match.team1)}
              aria-label={`Filter matches by ${match.team1}`}
              className={clsx("mt-name text-left font-display font-extrabold uppercase tracking-wide text-[clamp(18px,1.7vw,22px)] leading-[0.95] cursor-pointer hover:underline decoration-yellow decoration-2 underline-offset-2 rounded-sm focus-visible:outline-2 focus-visible:outline-yellow focus-visible:outline-offset-2", isWin1 ? "text-navy" : "text-navy-faint-2")}
            >
              {match.team1}
            </button>
          </div>
          <span className={clsx("mt-games font-display font-black text-[clamp(38px,4.2vw,56px)] leading-[0.9] tracking-tighter self-center", isWin1 ? "text-navy" : "text-navy-faint-2")}>
            {match.team1Wins}
          </span>
        </div>

        {/* Team 2 Row */}
        <div className={clsx("mt-row grid grid-cols-[1fr_auto] items-center gap-4 px-1 py-1.5 rounded-md transition-colors", isWin2 ? "mt-row-win" : "mt-row-lose")}>
          <div className="mt-name-wrap flex items-center gap-3 min-w-0">
            <span className={clsx("mt-dot w-2 h-2 rounded-full border-[1.5px] flex-shrink-0 transition-all", isWin2 ? "on bg-yellow border-yellow shadow-[0_0_0_4px_var(--yellow-glow)]" : "border-rule-2")} />
            <button
              onClick={() => onTeamClick?.(match.team2)}
              aria-label={`Filter matches by ${match.team2}`}
              className={clsx("mt-name text-left font-display font-extrabold uppercase tracking-wide text-[clamp(18px,1.7vw,22px)] leading-[0.95] cursor-pointer hover:underline decoration-yellow decoration-2 underline-offset-2 rounded-sm focus-visible:outline-2 focus-visible:outline-yellow focus-visible:outline-offset-2", isWin2 ? "text-navy" : "text-navy-faint-2")}
            >
              {match.team2}
            </button>
          </div>
          <span className={clsx("mt-games font-display font-black text-[clamp(38px,4.2vw,56px)] leading-[0.9] tracking-tighter self-center", isWin2 ? "text-navy" : "text-navy-faint-2")}>
            {match.team2Wins}
          </span>
        </div>
      </div>

      {/* Match Footer */}
      <div className="match-foot flex flex-col gap-2.5 flex-shrink-0">
        <MarginBar wins1={match.team1Wins} wins2={match.team2Wins} isWin1={isWin1} />
        <div className="match-foot-meta flex flex-wrap items-center gap-x-2.5 gap-y-1 text-navy-faint text-[11px] mono">
          <span className="whitespace-nowrap">Winner: <strong className="font-bold text-navy uppercase">{isWin1 ? match.team1 : match.team2}</strong></span>
          <span className="match-foot-sep text-rule-3 opacity-50">|</span>
          <span className="whitespace-nowrap">{match.team1Wins + match.team2Wins} Games Played</span>
        </div>
      </div>
    </div>
  );
};
