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
    <div className="w-full relative group transition-all duration-300 z-10 hover:z-20">
      <div ref={toastContainerRef} className="absolute inset-0 z-[100] pointer-events-none flex items-center justify-center p-2" />

      <div className="editorial-card relative overflow-hidden group-hover:scale-[1.01] transition-transform duration-500">
        {/* Subtle tonal layering background shift on hover */}
        <div className="absolute inset-0 bg-surface-container-low opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative p-6 md:p-8 flex flex-col md:grid md:grid-cols-[1fr_200px] gap-8 z-10">
            {/* Left Column: Teams and Scores */}
            <div className="space-y-6">
                {/* Team 1 */}
                <div className="flex justify-between items-center group/team">
                    <div 
                      onClick={() => onTeamClick?.(match.team1)}
                      className={clsx(
                      "font-heading font-black uppercase text-2xl md:text-3xl tracking-tighter leading-none cursor-pointer transition-colors relative",
                      isWin1 ? "text-primary" : "text-on-surface-variant opacity-40"
                    )}>
                      {match.team1}
                      {isWin1 && (
                        <motion.div 
                          layoutId={`win-dot-${match.id}`}
                          className="absolute -left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-secondary shadow-[0_0_12px_rgba(255,199,44,0.8)]" 
                        />
                      )}
                    </div>
                    <div className={clsx(
                      "font-stat font-black text-5xl md:text-6xl tracking-tighter transition-all duration-500",
                      isWin1 ? "text-primary" : "text-on-surface-variant opacity-10"
                    )}>
                      {match.team1Wins}
                    </div>
                </div>

                {/* Team 2 */}
                <div className="flex justify-between items-center group/team">
                    <div 
                      onClick={() => onTeamClick?.(match.team2)}
                      className={clsx(
                      "font-heading font-black uppercase text-2xl md:text-3xl tracking-tighter leading-none cursor-pointer transition-colors relative",
                      isWin2 ? "text-primary" : "text-on-surface-variant opacity-40"
                    )}>
                      {match.team2}
                      {isWin2 && (
                        <motion.div 
                          layoutId={`win-dot-${match.id}`}
                          className="absolute -left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-secondary shadow-[0_0_12px_rgba(255,199,44,0.8)]" 
                        />
                      )}
                    </div>
                    <div className={clsx(
                      "font-stat font-black text-5xl md:text-6xl tracking-tighter transition-all duration-500",
                      isWin2 ? "text-primary" : "text-on-surface-variant opacity-10"
                    )}>
                      {match.team2Wins}
                    </div>
                </div>
            </div>

            {/* Right Column: Metadata (Desktop Asymmetry) */}
            <div className="flex flex-row md:flex-col justify-between md:justify-end items-end md:items-end gap-4">
                <div className="text-right space-y-1">
                    <div className="label-sm text-on-surface-variant opacity-60">
                        Match Date
                    </div>
                    <div className="font-stat font-bold text-primary text-sm tracking-widest">
                        {formatDate(match.date)}
                    </div>
                </div>

                <div className="text-right space-y-1">
                    <div className="label-sm text-on-surface-variant opacity-60">
                        Points Scored
                    </div>
                    <div className="font-stat font-bold text-primary flex items-center justify-end gap-2">
                        <span className={clsx("text-lg", isWin1 ? "font-black" : "opacity-40")}>{match.team1Points}</span>
                        <span className="opacity-20 text-xs">/</span>
                        <span className={clsx("text-lg", isWin2 ? "font-black" : "opacity-40")}>{match.team2Points}</span>
                    </div>
                </div>

                {/* Share Action */}
                <div className="relative mt-2" ref={menuRef}>
                    <button 
                      onClick={() => setIsMenuOpen(!isMenuOpen)}
                      disabled={isSharing}
                      className={clsx(
                          "flex items-center gap-2 p-3 rounded-none transition-all duration-300",
                          isMenuOpen ? "bg-primary text-on-primary shadow-ambient" : "bg-surface-container-high text-primary hover:bg-surface-container-highest"
                      )}
                    >
                        {isSharing ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Share2 className="w-5 h-5" />
                        )}
                    </button>

                    <AnimatePresence>
                        {isMenuOpen && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                className="absolute bottom-full md:top-full right-0 mb-3 md:mt-3 w-48 glass-nav rounded-none shadow-ambient overflow-hidden z-[200]"
                            >
                                <div className="p-1 flex flex-col">
                                    <button 
                                        onClick={handleShareClick('story')}
                                        className="flex items-center gap-3 w-full px-4 py-3 hover:bg-surface-container-low text-primary transition-colors group"
                                    >
                                        <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                        <span className="label-md text-left">Story</span>
                                    </button>
                                    <button 
                                        onClick={handleShareClick('post')}
                                        className="flex items-center gap-3 w-full px-4 py-3 hover:bg-surface-container-low text-primary transition-colors group"
                                    >
                                        <ImageIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                        <span className="label-md text-left">Post</span>
                                    </button>
                                    <button 
                                        onClick={handleShareClick('wa')}
                                        className="flex items-center gap-3 w-full px-4 py-3 hover:bg-surface-container-low text-[#25D366] transition-colors group"
                                    >
                                        <MessageCircle className="w-5 h-5 fill-[#25D366] group-hover:scale-110 transition-transform" />
                                        <span className="label-md text-left">WhatsApp</span>
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
