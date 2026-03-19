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
  const isWin2 = match.team2Wins > match.team1Wins || (match.team1Wins === match.team2Wins && match.team2Points > match.team1Points);

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
    <div className="w-full relative group transition-all duration-500">
      {/* Toast Portal Target */}
      <div ref={toastContainerRef} className="absolute inset-0 z-[100] pointer-events-none flex items-center justify-center p-2" />

      {/* Main Card Surface - Tonal Layering */}
      <div className="absolute inset-0 bg-surface-container-lowest rounded-2xl shadow-soft group-hover:shadow-ambient transition-all duration-500" />

      {/* Winner Glow (Kinetic Gradient) */}
      {(isWin1 || isWin2) && (
        <div className={clsx(
          "absolute inset-0 rounded-2xl transition-opacity duration-500 opacity-0 group-hover:opacity-[0.03] bg-gradient-to-br from-primary to-primary-container"
        )} />
      )}

      {/* Content Layer */}
      <div className="relative p-6 md:p-8 flex flex-col h-full z-10">
          {/* Teams Container */}
          <div className="flex-1 flex flex-col justify-center gap-4 relative">
              
              {/* Team 1 */}
              <div className="flex justify-between items-center group/team relative">
                  <div 
                    onClick={() => onTeamClick?.(match.team1)}
                    className={clsx(
                    "headline-md !text-lg md:!text-xl tracking-tight leading-none max-w-[75%] cursor-pointer transition-all duration-300 relative",
                    isWin1 ? "text-secondary" : "text-secondary/40 hover:text-secondary/60"
                  )}>
                    {match.team1}
                    {isWin1 && (
                      <motion.div 
                        layoutId={`win-indicator-${match.id}`}
                        className="absolute -left-4 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-gradient-to-b from-primary to-primary-container rounded-full shadow-[0_0_10px_rgba(71,104,0,0.4)]" 
                      />
                    )}
                  </div>
                  <div className={clsx(
                    "display-sm !text-3xl md:!text-4xl transition-all duration-500",
                    isWin1 ? "text-primary italic" : "text-secondary/10"
                  )}>
                    {match.team1Wins}
                  </div>
              </div>

              {/* Tonal Divider (Ghost Border Rule) */}
              <div className="h-px bg-on-surface/[0.05] w-full" />

              {/* Team 2 */}
              <div className="flex justify-between items-center group/team relative">
                  <div 
                    onClick={() => onTeamClick?.(match.team2)}
                    className={clsx(
                    "headline-md !text-lg md:!text-xl tracking-tight leading-none max-w-[75%] cursor-pointer transition-all duration-300 relative",
                    isWin2 ? "text-secondary" : "text-secondary/40 hover:text-secondary/60"
                  )}>
                    {match.team2}
                    {isWin2 && (
                      <motion.div 
                        layoutId={`win-indicator-${match.id}`}
                        className="absolute -left-4 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-gradient-to-b from-primary to-primary-container rounded-full shadow-[0_0_10px_rgba(71,104,0,0.4)]" 
                      />
                    )}
                  </div>
                  <div className={clsx(
                    "display-sm !text-3xl md:!text-4xl transition-all duration-500",
                    isWin2 ? "text-primary italic" : "text-secondary/10"
                  )}>
                    {match.team2Wins}
                  </div>
              </div>
          </div>

          {/* Footer (Date & Points) */}
          <div className="mt-6 pt-4 border-t border-on-surface/[0.05] flex justify-between items-center">
              <div className="label-md !text-[9px] text-secondary/30">
                  {formatDate(match.date)}
              </div>
              
              <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 font-mono text-[10px] font-bold text-secondary/40">
                      <span className="opacity-30 tracking-widest uppercase">PTS</span>
                      <span className={clsx(isWin1 ? "text-primary font-black scale-110" : "opacity-60")}>{match.team1Points}</span>
                      <span className="opacity-20">/</span>
                      <span className={clsx(isWin2 ? "text-primary font-black scale-110" : "opacity-60")}>{match.team2Points}</span>
                  </div>

                  {/* Share Action */}
                  <div className="relative" ref={menuRef}>
                      <button 
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        disabled={isSharing}
                        className={clsx(
                            "flex items-center justify-center w-8 h-8 rounded-full transition-all duration-500",
                            isMenuOpen ? "bg-primary text-on-primary rotate-90" : "bg-surface-container-low text-secondary/40 hover:text-secondary hover:bg-surface-container-highest"
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
                                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                  className="absolute bottom-full right-0 mb-3 w-44 bg-surface-container-lowest/90 backdrop-blur-xl rounded-2xl shadow-ambient border border-on-surface/5 overflow-hidden z-[100]"
                              >
                                  <div className="p-1.5 flex flex-col gap-1">
                                      <button 
                                          onClick={handleShareClick('story')}
                                          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl hover:bg-surface-container-low text-secondary/80 transition-colors group"
                                      >
                                          <Instagram className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                                          <span className="label-md !text-[10px] tracking-widest text-left">Story</span>
                                      </button>
                                      <button 
                                          onClick={handleShareClick('post')}
                                          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl hover:bg-surface-container-low text-secondary/80 transition-colors group"
                                      >
                                          <ImageIcon className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                                          <span className="label-md !text-[10px] tracking-widest text-left">Post</span>
                                      </button>
                                      <button 
                                          onClick={handleShareClick('wa')}
                                          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl hover:bg-surface-container-low text-secondary/80 transition-colors group"
                                      >
                                          <MessageCircle className="w-4 h-4 text-[#25D366] group-hover:scale-110 transition-transform" />
                                          <span className="label-md !text-[10px] tracking-widest text-left">WhatsApp</span>
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
