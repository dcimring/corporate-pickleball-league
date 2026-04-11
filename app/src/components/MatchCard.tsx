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
      year: '2-digit',
      timeZone: 'UTC'
    }).format(date).toUpperCase();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);

  const handleShareClick = (type: 'story' | 'post' | 'wa') => (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    onShare?.(match, type, toastContainerRef);
  };

  return (
    <div className="w-full h-full relative group z-10">
      <div ref={toastContainerRef} className="absolute inset-0 z-[100] pointer-events-none flex items-center justify-center p-2" />

      <div className="editorial-card h-full relative overflow-hidden flex flex-col">
        {/* Subtle tonal layering background shift on hover */}
        <div className="absolute inset-0 bg-surface-container-low opacity-0 group-hover:opacity-100" />
        
        <div className="relative p-5 md:p-6 flex flex-col gap-6 z-10 h-full">
            {/* Top Metadata Bar */}
            <div className="flex justify-between items-center border-b border-outline-variant/10 pb-3 flex-shrink-0">
                <div className="font-stat font-bold text-primary text-[10px] md:text-xs tracking-widest opacity-60">
                    {formatDate(match.date)}
                </div>
                <div className="flex items-center gap-3">
                    <div className="font-stat font-bold text-primary text-[10px] md:text-xs tracking-widest opacity-60 flex items-center gap-2">
                        <span className={clsx(isWin1 ? "font-black opacity-100" : "opacity-40")}>{match.team1Points}</span>
                        <span className="opacity-20">/</span>
                        <span className={clsx(isWin2 ? "font-black opacity-100" : "opacity-40")}>{match.team2Points}</span>
                        <span className="ml-1">PTS</span>
                    </div>
                    
                    {/* Share Action Trigger */}
                    <div className="relative" ref={menuRef}>
                        <button 
                          onClick={() => setIsMenuOpen(!isMenuOpen)}
                          disabled={isSharing}
                          className={clsx(
                              "flex items-center justify-center p-1.5 rounded-none",
                              isMenuOpen ? "text-secondary" : "text-primary opacity-30 hover:opacity-100"
                          )}
                        >
                            {isSharing ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                                <Share2 className="w-3.5 h-3.5" />
                            )}
                        </button>

                        <AnimatePresence>
                            {isMenuOpen && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.95, y: -5 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -5 }}
                                    className="absolute top-full right-0 mt-2 w-40 glass-nav rounded-none shadow-ambient overflow-hidden z-[200]"
                                >
                                    <div className="p-1 flex flex-col">
                                        <button 
                                            onClick={handleShareClick('story')}
                                            className="flex items-center gap-3 w-full px-3 py-2 hover:bg-surface-container-low text-primary transition-colors group"
                                        >
                                            <Instagram className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                            <span className="label-sm text-left">Story</span>
                                        </button>
                                        <button 
                                            onClick={handleShareClick('post')}
                                            className="flex items-center gap-3 w-full px-3 py-2 hover:bg-surface-container-low text-primary transition-colors group"
                                        >
                                            <ImageIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                            <span className="label-sm text-left">Post</span>
                                        </button>
                                        <button 
                                            onClick={handleShareClick('wa')}
                                            className="flex items-center gap-3 w-full px-3 py-2 hover:bg-surface-container-low text-[#25D366] transition-colors group"
                                        >
                                            <MessageCircle className="w-4 h-4 fill-[#25D366] group-hover:scale-110 transition-transform" />
                                            <span className="label-sm text-left">WhatsApp</span>
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Teams and Scores - Flex Grow to push cards to same height */}
            <div className="flex-1 flex flex-col justify-center space-y-6">
                {/* Team 1 */}
                <div className="flex justify-between items-center group/team relative">
                    <div 
                      onClick={() => onTeamClick?.(match.team1)}
                      className={clsx(
                      "font-heading font-black uppercase text-2xl md:text-3xl lg:text-4xl tracking-tighter leading-[0.9] cursor-pointer transition-colors relative flex-1 pr-4",
                      isWin1 ? "text-primary" : "text-on-surface-variant opacity-30"
                    )}>
                      {match.team1}
                      {isWin1 && (
                        <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-secondary shadow-[0_0_8px_rgba(255,199,44,0.8)]" />
                      )}
                    </div>
                    <div className={clsx(
                      "font-stat font-black text-5xl md:text-5xl lg:text-6xl tracking-tighter flex-shrink-0",
                      isWin1 ? "text-primary" : "text-on-surface-variant opacity-10"
                    )}>
                      {match.team1Wins}
                    </div>
                </div>

                {/* Team 2 */}
                <div className="flex justify-between items-center group/team relative">
                    <div 
                      onClick={() => onTeamClick?.(match.team2)}
                      className={clsx(
                      "font-heading font-black uppercase text-2xl md:text-3xl lg:text-4xl tracking-tighter leading-[0.9] cursor-pointer transition-colors relative flex-1 pr-4",
                      isWin2 ? "text-primary" : "text-on-surface-variant opacity-30"
                    )}>
                      {match.team2}
                      {isWin2 && (
                        <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-secondary shadow-[0_0_8px_rgba(255,199,44,0.8)]" />
                      )}
                    </div>
                    <div className={clsx(
                      "font-stat font-black text-5xl md:text-5xl lg:text-6xl tracking-tighter flex-shrink-0",
                      isWin2 ? "text-primary" : "text-on-surface-variant opacity-10"
                    )}>
                      {match.team2Wins}
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
