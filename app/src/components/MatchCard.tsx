import React, { useRef } from 'react';
import { Loader2, Share2 } from 'lucide-react';
import type { Match } from '../types';
import { matchOutcome } from '../lib/results';

interface MatchCardProps {
  match: Match;
  onTeamClick?: (teamName: string) => void;
  /** Called with the match and the card's toast overlay element. */
  onShare?: (match: Match, toastTarget: HTMLElement | null) => void;
  isSharing?: boolean;
}

const TeamLine: React.FC<{
  team: string;
  games: number;
  points: number;
  won: boolean;
  strong: boolean;
  onTeamClick?: (teamName: string) => void;
}> = ({ team, games, points, won, strong, onTeamClick }) => (
  <div className="grid grid-cols-[12px_minmax(0,1fr)_30px_48px] md:grid-cols-[16px_minmax(0,1fr)_40px_56px] items-center gap-2 md:gap-2.5">
    <span aria-hidden="true" className={`block w-[9px] h-[9px] md:w-2.5 md:h-2.5 rounded-[3px] ${won ? 'bg-yellow' : ''}`} />
    <button
      type="button"
      onClick={() => onTeamClick?.(team)}
      aria-label={`Show matches for ${team}`}
      className={`text-left truncate font-display text-[15px] md:text-[16px] rounded-sm hover:underline decoration-yellow decoration-2 underline-offset-2 focus-visible:outline-2 focus-visible:outline-yellow focus-visible:outline-offset-2 ${
        strong ? 'font-extrabold text-navy' : 'font-semibold text-[#4f6680]'
      }`}
    >
      {team}
    </button>
    <span className={`text-center mono text-[20px] md:text-[22px] font-bold tabular-nums ${strong ? 'text-navy' : 'text-[#7d8ea3]'}`}>
      {games}
    </span>
    <span className="text-right mono text-[11px] md:text-[12px] font-semibold text-navy-faint tabular-nums">{points} pts</span>
  </div>
);

export const MatchCard: React.FC<MatchCardProps> = ({ match, onTeamClick, onShare, isSharing }) => {
  const toastContainerRef = useRef<HTMLDivElement>(null);
  const outcome = matchOutcome(match);
  const draw = outcome === 'draw';
  const winner = outcome === 'team1' ? match.team1 : outcome === 'team2' ? match.team2 : null;
  const levelOnGames = match.team1Wins === match.team2Wins;

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onShare?.(match, toastContainerRef.current);
  };

  return (
    <article className="match-card relative overflow-hidden bg-white border border-rule-2 rounded-[14px] px-4 py-3.5 md:px-5 md:py-4 flex flex-col gap-2 md:gap-2.5 shadow-[0_24px_60px_-40px_rgba(20,58,120,0.25)]">
      <div ref={toastContainerRef} className="absolute inset-0 z-[100] pointer-events-none flex items-center justify-center p-2" />

      <TeamLine
        team={match.team1}
        games={match.team1Wins}
        points={match.team1Points}
        won={outcome === 'team1'}
        strong={outcome !== 'team2'}
        onTeamClick={onTeamClick}
      />
      <TeamLine
        team={match.team2}
        games={match.team2Wins}
        points={match.team2Points}
        won={outcome === 'team2'}
        strong={outcome !== 'team1'}
        onTeamClick={onTeamClick}
      />

      <div className="flex items-center justify-between gap-3 pt-2 md:pt-2.5 border-t border-rule mono text-[10px] md:text-[11px] font-bold tracking-[0.08em] uppercase">
        {onShare ? (
          <button
            type="button"
            onClick={handleShareClick}
            disabled={isSharing}
            aria-label={`Share result: ${match.team1} vs ${match.team2}`}
            title="Share result"
            className="-ml-2 inline-flex items-center gap-1.5 min-h-9 px-2 rounded-md text-navy-faint hover:text-navy hover:bg-navy/5 transition-colors disabled:cursor-wait"
          >
            {isSharing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Share2 className="w-3.5 h-3.5" />}
            Share
          </button>
        ) : (
          <span className="text-navy-faint">Games</span>
        )}
        <span className={`truncate ${draw ? 'text-[#4f6680]' : 'text-navy'}`}>
          {draw
            ? `Draw · ${match.team1Wins}–${match.team2Wins}`
            : `${winner} won${levelOnGames ? ' on points' : ''}`}
        </span>
      </div>
    </article>
  );
};
