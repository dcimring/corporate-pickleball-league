import React, { useRef, useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { Loader2, Share2, MessageCircle, Image as ImageIcon, Instagram } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Match } from '../types';

interface MatchCardProps {
  match: Match;
  onTeamClick?: (teamName: string) => void;
  onShare?: (match: Match, type: 'story' | 'post' | 'wa', toastRef: React.RefObject<HTMLDivElement | null>) => void;
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
  const menuRef = useRef<HTMLDivElement>(null);
  const toastContainerRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  const handleShareClick = (type: 'story' | 'post' | 'wa') => (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    onShare?.(match, type, toastContainerRef);
  };

  return (
    <div className="match-card p-5.5 md:p-6 flex flex-col gap-4.5 relative group overflow-hidden">
      <div ref={toastContainerRef} className="absolute inset-0 z-[100] pointer-events-none flex items-center justify-center p-2" />
      
      {/* Match Header */}
      <div className="match-head flex items-center justify-between gap-3 flex-shrink-0">
        <span className="match-date text-navy-faint mono text-[11px]">{formatDate(match.date)}</span>
        <div className="match-head-right flex items-center gap-3">
          <div className="match-pts text-navy-faint text-[12px] mono">
            <strong className={clsx("transition-colors", isWin1 ? "text-navy font-bold" : "text-navy-faint font-semibold")}>{match.team1Points}</strong>
            <span className="mx-1 text-rule-3">/</span>
            <strong className={clsx("transition-colors", isWin2 ? "text-navy font-bold" : "text-navy-faint font-semibold")}>{match.team2Points}</strong>
            <span className="ml-1 text-[10px] opacity-40">PTS</span>
          </div>

          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              disabled={isSharing}
              className="match-share w-6.5 h-6.5 flex items-center justify-center rounded-md hover:bg-rule transition-colors text-navy-faint hover:text-navy"
            >
              {isSharing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Share2 className="w-3.5 h-3.5" />}
            </button>
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: -5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -5 }}
                  className="absolute top-full right-0 mt-2 w-40 bg-card border border-rule rounded-md shadow-[0_12px_32px_rgba(0,0,0,0.12)] overflow-hidden z-[200]"
                >
                  <div className="p-1 flex flex-col">
                    <button onClick={handleShareClick('story')} className="flex items-center gap-3 w-full px-3 py-2 hover:bg-card-tint text-navy transition-colors">
                      <Instagram size={14} className="text-navy-soft" />
                      <span className="mono text-[11px] text-left">Story</span>
                    </button>
                    <button onClick={handleShareClick('post')} className="flex items-center gap-3 w-full px-3 py-2 hover:bg-card-tint text-navy transition-colors">
                      <ImageIcon size={14} className="text-navy-soft" />
                      <span className="mono text-[11px] text-left">Post</span>
                    </button>
                    <button onClick={handleShareClick('wa')} className="flex items-center gap-3 w-full px-3 py-2 hover:bg-card-tint text-navy transition-colors">
                      <MessageCircle size={14} className="text-success fill-success/10" />
                      <span className="mono text-[11px] text-left">WhatsApp</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Match Body */}
      <div className="match-body flex flex-col gap-0.5 -mx-1 flex-1 justify-center">
        {/* Team 1 Row */}
        <div className={clsx("mt-row grid grid-cols-[1fr_auto] items-center gap-4 px-1 py-1.5 rounded-md transition-colors", isWin1 ? "mt-row-win" : "mt-row-lose")}>
          <div className="mt-name-wrap flex items-center gap-3 min-w-0">
            <span className={clsx("mt-dot w-2 h-2 rounded-full border-[1.5px] flex-shrink-0 transition-all", isWin1 ? "on bg-yellow border-yellow shadow-[0_0_0_4px_var(--yellow-glow)]" : "border-rule-2")} />
            <span 
              onClick={() => onTeamClick?.(match.team1)}
              className={clsx("mt-name font-display font-extrabold uppercase tracking-wide text-[clamp(18px,1.7vw,22px)] leading-[0.95] cursor-pointer hover:underline decoration-yellow decoration-2 underline-offset-2", isWin1 ? "text-navy" : "text-navy-faint-2")}
            >
              {match.team1}
            </span>
          </div>
          <span className={clsx("mt-games font-display font-black text-[clamp(38px,4.2vw,56px)] leading-[0.9] tracking-tighter self-center", isWin1 ? "text-navy" : "text-navy-faint-2")}>
            {match.team1Wins}
          </span>
        </div>

        {/* Team 2 Row */}
        <div className={clsx("mt-row grid grid-cols-[1fr_auto] items-center gap-4 px-1 py-1.5 rounded-md transition-colors", isWin2 ? "mt-row-win" : "mt-row-lose")}>
          <div className="mt-name-wrap flex items-center gap-3 min-w-0">
            <span className={clsx("mt-dot w-2 h-2 rounded-full border-[1.5px] flex-shrink-0 transition-all", isWin2 ? "on bg-yellow border-yellow shadow-[0_0_0_4px_var(--yellow-glow)]" : "border-rule-2")} />
            <span 
              onClick={() => onTeamClick?.(match.team2)}
              className={clsx("mt-name font-display font-extrabold uppercase tracking-wide text-[clamp(18px,1.7vw,22px)] leading-[0.95] cursor-pointer hover:underline decoration-yellow decoration-2 underline-offset-2", isWin2 ? "text-navy" : "text-navy-faint-2")}
            >
              {match.team2}
            </span>
          </div>
          <span className={clsx("mt-games font-display font-black text-[clamp(38px,4.2vw,56px)] leading-[0.9] tracking-tighter self-center", isWin2 ? "text-navy" : "text-navy-faint-2")}>
            {match.team2Wins}
          </span>
        </div>
      </div>

      {/* Match Footer */}
      <div className="match-foot flex flex-col gap-2.5 flex-shrink-0">
        <MarginBar wins1={match.team1Wins} wins2={match.team2Wins} isWin1={isWin1} />
        <div className="match-foot-meta flex items-center gap-2.5 text-navy-faint text-[11px] mono">
          <span>Winner: <strong className="font-bold text-navy uppercase">{isWin1 ? match.team1 : match.team2}</strong></span>
          <span className="match-foot-sep text-rule-3 opacity-50">|</span>
          <span>{match.team1Wins + match.team2Wins} Games Played</span>
        </div>
      </div>
    </div>
  );
};
