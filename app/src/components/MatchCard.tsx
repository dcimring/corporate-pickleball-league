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
    <div className="w-full relative group hover:-translate-y-1 transition-all duration-300">
      {/* Toast Portal Target - Centered over the card */}
      <div ref={toastContainerRef} className="absolute inset-0 z-[100] pointer-events-none flex items-center justify-center p-2" />

      {/* Decorative Layer (Clipped Background) */}
      <div className="absolute inset-0 bg-[#FFFEFC] rounded-3xl shadow-xl border border-gray-100 overflow-hidden group-hover:shadow-2xl transition-shadow duration-300">
        {/* Grainy Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.1] pointer-events-none mix-blend-multiply" 
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
        />

        {/* Top Accent Bar (Inset) */}
        <div className="absolute top-0 left-4 md:left-6 right-4 md:right-6 h-2 bg-[rgb(142,209,252)] rounded-b-md z-10" />
      </div>

      {/* Content Layer (Not Clipped, allows popover overflow) */}
      <div className="relative pt-4 md:pt-6 pb-2.5 px-4 md:px-8 flex flex-col h-full z-10">
          {/* Teams Container */}
          <div className="flex-1 flex flex-col justify-center gap-1.5 md:gap-2 relative">
              {/* Winner Vertical Bar - Team 1 */}
              {isWin1 && (
                <div className="absolute left-[-16px] md:left-[-32px] top-0 bottom-1/2 w-1.5 bg-brand-yellow rounded-r-full z-20" />
              )}
              {/* Winner Vertical Bar - Team 2 */}
              {isWin2 && (
                <div className="absolute left-[-16px] md:left-[-32px] top-1/2 bottom-0 w-1.5 bg-brand-yellow rounded-r-full z-20" />
              )}

              {/* Team 1 */}
              <div className="flex justify-between items-center group/team relative">
                  <div 
                    onClick={() => onTeamClick?.(match.team1)}
                    className={clsx(
                    "font-heading font-black italic uppercase text-xl md:text-2xl tracking-tight leading-none max-w-[80%] cursor-pointer hover:text-brand-blue transition-colors relative z-10",
                    isWin1 ? "text-brand-blue" : "text-gray-400"
                  )}>
                    {match.team1}
                  </div>
                  <div className={clsx(
                    "font-heading font-black text-4xl md:text-5xl transition-all duration-300",
                    isWin1 ? "text-brand-blue drop-shadow-[2px_2px_0px_#FFC72C] md:drop-shadow-[2.5px_2.5px_0px_#FFC72C]" : "text-gray-200"
                  )}>
                    {match.team1Wins}
                  </div>
              </div>

              {/* Subtle Divider */}
              <div className="h-px bg-gray-50 w-full" />

              {/* Team 2 */}
              <div className="flex justify-between items-center group/team relative">
                  <div 
                    onClick={() => onTeamClick?.(match.team2)}
                    className={clsx(
                    "font-heading font-black italic uppercase text-xl md:text-2xl tracking-tight leading-none max-w-[80%] cursor-pointer hover:text-brand-blue transition-colors relative z-10",
                    isWin2 ? "text-brand-blue" : "text-gray-400"
                  )}>
                    {match.team2}
                  </div>
                  <div className={clsx(
                    "font-heading font-black text-4xl md:text-5xl transition-all duration-300",
                    isWin2 ? "text-brand-blue drop-shadow-[2px_2px_0px_#FFC72C] md:drop-shadow-[2.5px_2.5px_0px_#FFC72C]" : "text-gray-200"
                  )}>
                    {match.team2Wins}
                  </div>
              </div>
          </div>

          {/* Footer (Date & Points) */}
          <div className="mt-2 md:mt-3 pt-2 border-t border-gray-100">
              <div className="flex justify-between items-center">
                  <div className="font-heading font-bold text-[rgb(142,209,252)] text-[10px] tracking-[0.2em] uppercase">
                      {formatDate(match.date)}
                  </div>
                  
                  <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 font-mono text-[9px] font-bold text-gray-400">
                          <span className="tracking-widest uppercase opacity-50">PTS:</span>
                          <span className={clsx("text-xs", isWin1 ? "text-brand-blue font-black" : "text-gray-400")}>{match.team1Points}</span>
                          <span className="text-gray-200">/</span>
                          <span className={clsx("text-xs", isWin2 ? "text-brand-blue font-black" : "text-gray-400")}>{match.team2Points}</span>
                      </div>

                      {/* Option A: Single Action Popover (Refined Size) */}
                      <div className="relative" ref={menuRef}>
                          <button 
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            disabled={isSharing}
                            className={clsx(
                                "flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0",
                                isMenuOpen ? "bg-brand-yellow text-brand-blue" : "bg-brand-blue text-white"
                            )}
                          >
                              {isSharing ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                  <>
                                    <span className="font-heading font-black uppercase italic text-[10px] tracking-widest">Share</span>
                                    <Share2 className="w-3.5 h-3.5 fill-current" />
                                  </>
                              )}
                          </button>

                          <AnimatePresence>
                              {isMenuOpen && (
                                  <motion.div 
                                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                      animate={{ opacity: 1, scale: 1, y: 0 }}
                                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                      className="absolute bottom-full right-0 mb-3 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[100]"
                                  >
                                      <div className="p-1.5 flex flex-col gap-1">
                                          <button 
                                              onClick={handleShareClick('story')}
                                              className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl hover:bg-brand-gray text-brand-blue transition-colors group"
                                          >
                                              <Instagram className="w-5 h-5 text-brand-blue group-hover:scale-110 transition-transform" />
                                              <span className="font-heading font-bold uppercase text-xs tracking-widest text-left">Story</span>
                                          </button>
                                          <button 
                                              onClick={handleShareClick('post')}
                                              className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl hover:bg-brand-gray text-brand-blue transition-colors group"
                                          >
                                              <ImageIcon className="w-5 h-5 text-brand-blue group-hover:scale-110 transition-transform" />
                                              <span className="font-heading font-bold uppercase text-xs tracking-widest text-left">Post</span>
                                          </button>
                                          <button 
                                              onClick={handleShareClick('wa')}
                                              className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl hover:bg-[#25D366]/5 text-[#25D366] transition-colors group"
                                          >
                                              <MessageCircle className="w-5 h-5 fill-[#25D366] group-hover:scale-110 transition-transform" />
                                              <span className="font-heading font-bold uppercase text-xs tracking-widest text-left font-[#25D366]">WhatsApp</span>
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