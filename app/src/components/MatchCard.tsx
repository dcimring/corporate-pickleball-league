import React, { useRef, useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { Loader2, Share2, MessageCircle, Image as ImageIcon, Instagram } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Match } from '../types';
import { ShareButton, type ShareButtonHandle } from './ShareButton';
import { ShareableMatch } from './ShareableMatch';

interface MatchCardProps {
  match: Match;
  onTeamClick?: (teamName: string) => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, onTeamClick }) => {
  const storyShareRef = useRef<HTMLDivElement>(null);
  const postShareRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const mobileStoryShareButtonRef = useRef<ShareButtonHandle>(null);
  const desktopStoryShareButtonRef = useRef<ShareButtonHandle>(null);
  const mobilePostShareButtonRef = useRef<ShareButtonHandle>(null);
  const desktopPostShareButtonRef = useRef<ShareButtonHandle>(null);
  const mobileWhatsAppShareButtonRef = useRef<ShareButtonHandle>(null);
  const desktopWhatsAppShareButtonRef = useRef<ShareButtonHandle>(null);

  const [loadingType, setLoadingType] = useState<'story' | 'post' | 'wa' | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const isWin1 = match.team1Wins > match.team2Wins || (match.team1Wins === match.team2Wins && match.team1Points > match.team2Points);
  const isWin2 = match.team2Wins > match.team1Wins || (match.team2Wins === match.team2Wins && match.team2Points > match.team1Points);

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
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  const handleShareStory = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    const isDesktop = typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches;
    if (isDesktop) {
      desktopStoryShareButtonRef.current?.triggerShare();
    } else {
      mobileStoryShareButtonRef.current?.triggerShare();
    }
  };

  const handleSharePost = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    const isDesktop = typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches;
    if (isDesktop) {
      desktopPostShareButtonRef.current?.triggerShare();
    } else {
      mobilePostShareButtonRef.current?.triggerShare();
    }
  };

  const handleShareWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    const isDesktop = typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches;
    if (isDesktop) {
      desktopWhatsAppShareButtonRef.current?.triggerShare();
    } else {
      mobileWhatsAppShareButtonRef.current?.triggerShare();
    }
  };

  return (
    <div className="w-full relative group">
      {/* Visual Card Container (Handles overflow and background) */}
      <div className="w-full bg-[#FFFEFC] rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden border border-gray-100">
        {/* Grainy Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.1] pointer-events-none mix-blend-multiply" 
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
        />

        {/* Top Accent Bar (Inset) */}
        <div className="absolute top-0 left-4 md:left-6 right-4 md:right-6 h-2 bg-[rgb(142,209,252)] rounded-b-md z-10" />

        <div className="pt-4 md:pt-6 pb-2.5 px-4 md:px-8 flex flex-col h-full relative z-10">
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
                    "font-heading font-black italic uppercase text-base md:text-2xl tracking-tight leading-none max-w-[80%] cursor-pointer hover:text-brand-blue transition-colors relative z-10",
                    isWin1 ? "text-brand-blue" : "text-gray-400"
                  )}>
                    {match.team1}
                  </div>
                  <div className={clsx(
                    "font-heading font-black text-3xl md:text-5xl transition-all duration-300",
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
                    "font-heading font-black italic uppercase text-base md:text-2xl tracking-tight leading-none max-w-[80%] cursor-pointer hover:text-brand-blue transition-colors relative z-10",
                    isWin2 ? "text-brand-blue" : "text-gray-400"
                  )}>
                    {match.team2}
                  </div>
                  <div className={clsx(
                    "font-heading font-black text-3xl md:text-5xl transition-all duration-300",
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
                            disabled={loadingType !== null}
                            className={clsx(
                                "flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0",
                                isMenuOpen ? "bg-brand-yellow text-brand-blue" : "bg-brand-blue text-white"
                            )}
                          >
                              {loadingType !== null ? (
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
                                      className="absolute bottom-full right-0 mb-3 w-40 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[100]"
                                  >
                                      <div className="p-1.5 flex flex-col gap-1">
                                          <button 
                                              onClick={handleShareStory}
                                              className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl hover:bg-brand-gray text-brand-blue transition-colors group"
                                          >
                                              <Instagram className="w-4 h-4 text-brand-blue group-hover:scale-110 transition-transform" />
                                              <span className="font-heading font-bold uppercase text-[9px] tracking-widest">Story</span>
                                          </button>
                                          <button 
                                              onClick={handleSharePost}
                                              className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl hover:bg-brand-gray text-brand-blue transition-colors group"
                                          >
                                              <ImageIcon className="w-4 h-4 text-brand-blue group-hover:scale-110 transition-transform" />
                                              <span className="font-heading font-bold uppercase text-[9px] tracking-widest">Post</span>
                                          </button>
                                          <button 
                                              onClick={handleShareWhatsApp}
                                              className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl hover:bg-[#25D366]/5 text-[#25D366] transition-colors group"
                                          >
                                              <MessageCircle className="w-4 h-4 fill-[#25D366] group-hover:scale-110 transition-transform" />
                                              <span className="font-heading font-bold uppercase text-[9px] tracking-widest font-[#25D366]">WhatsApp</span>
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

      {/* Actual ShareButtons (Anchoring point for Absolute Toasts) */}
      <div className="absolute right-4 bottom-4 w-0 h-0 overflow-visible z-[100] pointer-events-none">
          <ShareButton
            ref={mobileStoryShareButtonRef}
            targetRef={storyShareRef}
            hidden
            toastPosition="absolute"
            onShareStart={() => setLoadingType('story')}
            onShareEnd={() => setLoadingType(null)}
            fileName={`LRP-Pickleball-Match-${match.team1}-vs-${match.team2}-story.jpg`}
            shareText={`Match result: ${match.team1} vs ${match.team2}! 🥒🏆\n\nFull stats at pickleball.ky`}
          />
          <ShareButton
            ref={desktopStoryShareButtonRef}
            targetRef={storyShareRef}
            hidden
            toastPosition="absolute"
            onShareStart={() => setLoadingType('story')}
            onShareEnd={() => setLoadingType(null)}
            fileName={`LRP-Pickleball-Match-${match.team1}-vs-${match.team2}-story.jpg`}
            preferDownload
          />
          <ShareButton
            ref={mobilePostShareButtonRef}
            targetRef={postShareRef}
            hidden
            toastPosition="absolute"
            onShareStart={() => setLoadingType('post')}
            onShareEnd={() => setLoadingType(null)}
            fileName={`LRP-Pickleball-Match-${match.team1}-vs-${match.team2}-post.jpg`}
            shareText={`Pickleball Match Result: ${match.team1} vs ${match.team2}! 🔥`}
          />
          <ShareButton
            ref={desktopPostShareButtonRef}
            targetRef={postShareRef}
            hidden
            toastPosition="absolute"
            onShareStart={() => setLoadingType('post')}
            onShareEnd={() => setLoadingType(null)}
            fileName={`LRP-Pickleball-Match-${match.team1}-vs-${match.team2}-post.jpg`}
            preferDownload
          />
          <ShareButton
            ref={mobileWhatsAppShareButtonRef}
            targetRef={storyShareRef}
            hidden
            toastPosition="absolute"
            onShareStart={() => setLoadingType('wa')}
            onShareEnd={() => setLoadingType(null)}
            fileName={`LRP-Pickleball-Match-WA-${match.team1}-vs-${match.team2}.jpg`}
            shareText={`Check out this match result! 🥒🏆\n\n${match.team1} vs ${match.team2}\n\nSee the schedule: pickleball.ky`}
          />
          <ShareButton
            ref={desktopWhatsAppShareButtonRef}
            targetRef={storyShareRef}
            hidden
            toastPosition="absolute"
            onShareStart={() => setLoadingType('wa')}
            onShareEnd={() => setLoadingType(null)}
            fileName={`LRP-Pickleball-Match-WA-${match.team1}-vs-${match.team2}.jpg`}
            preferDownload
          />
      </div>

      {/* Hidden Shareable Content */}
      <div className="absolute left-[-9999px] top-[-9999px] w-max">
        <div ref={storyShareRef} className="w-fit">
            <ShareableMatch match={match} layout="story" />
        </div>
        <div ref={postShareRef} className="w-fit">
            <ShareableMatch match={match} layout="post" />
        </div>
      </div>
    </div>
  );
};
