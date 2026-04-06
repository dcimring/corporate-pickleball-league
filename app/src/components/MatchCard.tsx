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
    }).format(date).toUpperCase(); // 14-JAN-26
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
    <div className="w-full relative group transition-all duration-300 z-10 hover:z-50">
      {/* Toast Portal Target - Centered over the card */}
      <div ref={toastContainerRef} className="absolute inset-0 z-[100] pointer-events-none flex items-center justify-center p-2" />

      {/* Main Card Container - Removed border */}
      <div className="bg-white rounded-lg shadow-ambient group-hover:scale-[1.02] transition-transform duration-300 relative">
        {/* Grainy Texture Overlay - Wrapped in overflow-hidden container */}
        <div className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none">
          <div className="absolute inset-0 opacity-[0.03] mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
        </div>

        {/* Content Layer */}
        <div className="relative pt-6 pb-3 px-6 md:px-8 flex flex-col h-full z-10">
            {/* Teams Container */}
            <div className="flex-1 flex flex-col justify-center gap-3 relative">
                {/* Team 1 */}
                <div className="flex justify-between items-center group/team relative">
                    <div 
                      onClick={() => onTeamClick?.(match.team1)}
                      className={clsx(
                      "font-heading font-extrabold uppercase text-xl md:text-2xl tracking-tight leading-tight max-w-[75%] cursor-pointer transition-colors relative z-10",
                      isWin1 ? "text-brand-blue" : "text-brand-blue/30"
                    )}>
                      {match.team1}
                      {isWin1 && (
                        <motion.div 
                          layoutId={`win-dot-${match.id}`}
                          className="absolute -left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-brand-yellow shadow-[0_0_10px_rgba(255,199,44,0.6)]" 
                        />
                      )}
                    </div>
                    <div className={clsx(
                      "font-heading font-black text-4xl md:text-5xl transition-all duration-300",
                      isWin1 ? "text-brand-blue drop-shadow-[2px_2px_0px_#FFC72C]" : "text-brand-blue/10"
                    )}>
                      {match.team1Wins}
                    </div>
                </div>

                {/* Subtle Divider (Editorial Shift) - Replaced border with bg shift */}
                <div className="h-px bg-brand-gray w-full" />

                {/* Team 2 */}
                <div className="flex justify-between items-center group/team relative">
                    <div 
                      onClick={() => onTeamClick?.(match.team2)}
                      className={clsx(
                      "font-heading font-extrabold uppercase text-xl md:text-2xl tracking-tight leading-tight max-w-[75%] cursor-pointer transition-colors relative z-10",
                      isWin2 ? "text-brand-blue" : "text-brand-blue/30"
                    )}>
                      {match.team2}
                      {isWin2 && (
                        <motion.div 
                          layoutId={`win-dot-${match.id}`}
                          className="absolute -left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-brand-yellow shadow-[0_0_10px_rgba(255,199,44,0.6)]" 
                        />
                      )}
                    </div>
                    <div className={clsx(
                      "font-heading font-black text-4xl md:text-5xl transition-all duration-300",
                      isWin2 ? "text-brand-blue drop-shadow-[2px_2px_0px_#FFC72C]" : "text-brand-blue/10"
                    )}>
                      {match.team2Wins}
                    </div>
                </div>
            </div>

            {/* Footer (Date & Points) - Removed top border, using padding/gap */}
            <div className="mt-4 pt-3 flex justify-between items-center">
                <div className="font-heading font-black text-brand-blue/40 text-[10px] tracking-[0.2em] uppercase">
                    {formatDate(match.date)}
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 font-heading font-bold text-[10px] text-brand-blue/30">
                        <span className="tracking-widest uppercase opacity-50">PTS:</span>
                        <span className={clsx("text-xs", isWin1 ? "text-brand-blue font-black" : "")}>{match.team1Points}</span>
                        <span className="opacity-20">/</span>
                        <span className={clsx("text-xs", isWin2 ? "text-brand-blue font-black" : "")}>{match.team2Points}</span>
                    </div>

                    {/* Share Action */}
                    <div className="relative" ref={menuRef}>
                        <button 
                          onClick={() => setIsMenuOpen(!isMenuOpen)}
                          disabled={isSharing}
                          className={clsx(
                              "flex items-center gap-2 p-2 rounded-full transition-all duration-300",
                              isMenuOpen ? "bg-brand-blue text-white shadow-ambient" : "bg-brand-gray text-brand-blue hover:bg-brand-light-blue/50"
                          )}
                        >
                            {isSharing ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Share2 className="w-4 h-4" />
                            )}
                        </button>

                        <AnimatePresence>
                            {isMenuOpen && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                    className="absolute top-full right-0 mt-3 w-48 glass-nav rounded-2xl shadow-ambient overflow-hidden z-[200] border border-white/10"
                                >
                                    <div className="p-1.5 flex flex-col gap-1">
                                        <button 
                                            onClick={handleShareClick('story')}
                                            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl hover:bg-white/10 text-white transition-colors group"
                                        >
                                            <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                            <span className="font-heading font-bold uppercase text-[10px] tracking-widest text-left">Story</span>
                                        </button>
                                        <button 
                                            onClick={handleShareClick('post')}
                                            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl hover:bg-white/10 text-white transition-colors group"
                                        >
                                            <ImageIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                            <span className="font-heading font-bold uppercase text-[10px] tracking-widest text-left">Post</span>
                                        </button>
                                        <button 
                                            onClick={handleShareClick('wa')}
                                            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl hover:bg-[#25D366]/20 text-[#25D366] transition-colors group"
                                        >
                                            <MessageCircle className="w-5 h-5 fill-[#25D366] group-hover:scale-110 transition-transform" />
                                            <span className="font-heading font-bold uppercase text-[10px] tracking-widest text-left font-[#25D366]">WhatsApp</span>
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
    </div>
  );
};
