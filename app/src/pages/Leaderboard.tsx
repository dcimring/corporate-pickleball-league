import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Info, X } from 'lucide-react';
import { LeaderboardTable } from '../components/LeaderboardTable';
import { ShareButton } from '../components/ShareButton';
import { ShareableLeaderboard } from '../components/ShareableLeaderboard';
import { LoadingState } from '../components/LoadingState';
import { useLeagueData } from '../context/LeagueContext';

export const Leaderboard: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { data, loading } = useLeagueData();
  const [showTip, setShowTip] = useState(() => {
    return sessionStorage.getItem('leaderboard_tip_dismissed') !== 'true';
  });

  const handleDismissTip = () => {
    setShowTip(false);
    sessionStorage.setItem('leaderboard_tip_dismissed', 'true');
  };

  // Unified Active Division Logic - Derive directly from URL to prevent dual-render flicker
  const activeDivision = useMemo(() => {
    if (loading || !data.leaderboard) return '';
    const divisions = Object.keys(data.leaderboard);
    const paramDiv = searchParams.get('division');
    if (paramDiv && divisions.includes(paramDiv)) return paramDiv;
    
    // Default to Cayman Premier League or first available
    return divisions.includes('Cayman Premier League') ? 'Cayman Premier League' : divisions[0] || '';
  }, [loading, data.leaderboard, searchParams]);

  const postShareRef = useRef<HTMLDivElement>(null);
  const storyShareRef = useRef<HTMLDivElement>(null);
  const shareCardRef = useRef<HTMLDivElement>(null);
  const shareCardInView = useInView(shareCardRef, { once: true, amount: 0.1 });
  const [shareCardAnimated, setShareCardAnimated] = useState(false);
  const toastPortalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (shareCardInView) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShareCardAnimated(true);
      return;
    }
    const fallback = setTimeout(() => setShareCardAnimated(true), 300);
    return () => clearTimeout(fallback);
  }, [shareCardInView]);

  const handleTeamClick = (teamName: string) => {
    if (activeDivision) {
        navigate(`/matches?division=${encodeURIComponent(activeDivision)}&team=${encodeURIComponent(teamName)}`);
    }
  };

  if (loading || !activeDivision) {
    return <LoadingState />;
  }

  const stats = data.leaderboard[activeDivision] || [];

  const divisionMatches = data.matches[activeDivision] || [];
  const latestMatchDate = divisionMatches.length > 0 
    ? divisionMatches.reduce((latest, current) => {
        return new Date(current.date) > new Date(latest) ? current.date : latest;
      }, divisionMatches[0].date)
    : null;

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const day = d.getUTCDate();
    const suffix = (day % 10 === 1 && day !== 11) ? 'ST' : 
                   (day % 10 === 2 && day !== 12) ? 'ND' :
                   (day % 10 === 3 && day !== 13) ? 'RD' : 'TH';
    return `${months[d.getUTCMonth()]} ${day}${suffix}`;
  };

  return (
    <div className="space-y-0 relative">
      {/* Portal target for Share Toasts */}
      <div ref={toastPortalRef} className="fixed bottom-0 left-0 right-0 z-[300] pointer-events-none flex justify-center pb-6" />

      {/* Meta Banner - New Design */}
      <div className="meta flex items-center justify-center flex-wrap gap-7 pt-[var(--header-gap-sm)] pb-[var(--header-gap-md)] px-0 text-navy-soft">
        <AnimatePresence>
          {showTip && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="meta-tip inline-flex items-center gap-3 py-2 px-3.5 bg-card border border-rule rounded-full text-[11px] shadow-sm"
            >
              <Info size={14} className="text-navy-faint" />
              <span className="mono font-bold uppercase">Tip: <span className="font-medium lowercase">Click team name to see all matches</span></span>
              <button 
                onClick={handleDismissTip}
                className="ml-1 p-0.5 hover:bg-rule rounded-full transition-colors group"
                aria-label="Dismiss tip"
              >
                <X size={12} className="text-navy-faint group-hover:text-navy" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="meta-asof inline-flex items-center gap-3 text-navy-soft mono text-[11px]">
          <span className="meta-dot w-1.5 h-1.5 bg-yellow rounded-sm" />
          <span>DATA CURRENT THROUGH {latestMatchDate ? formatDate(latestMatchDate) : 'MAY 2026'}</span>
          <span className="meta-dot w-1.5 h-1.5 bg-yellow rounded-sm" />
        </div>
      </div>

      <div className="pb-[var(--header-gap-lg)]">
        <LeaderboardTable stats={stats} onTeamClick={handleTeamClick} />
          
        {/* Share Section - New Design */}
        <div className="flex items-center justify-center py-16">
          <motion.div 
            ref={shareCardRef}
            initial={{ y: 20, opacity: 0 }}
            animate={shareCardAnimated ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="w-full relative overflow-hidden p-8 md:p-12 text-center space-y-10"
          >
            <div className="space-y-3 max-w-2xl mx-auto">
              <p className="mono text-yellow font-black tracking-[0.2em] text-[12px]">
                EDITORIAL EXCLUSIVE
              </p>
              <h4 className="font-display font-black text-[clamp(32px,4vw,48px)] text-navy uppercase leading-none tracking-tight">
                SHARE THE GLORY
              </h4>
              <p className="font-display font-medium text-navy-faint text-[16px] max-w-lg mx-auto leading-relaxed">
                Export high-fidelity standings cards optimized for your favorite social platforms.
              </p>
            </div>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              <div className="w-full md:w-auto space-y-3">
                <ShareButton 
                  targetRef={storyShareRef} 
                  portalTarget={toastPortalRef}
                  buttonLabel="STORY FORMAT"
                  fileName={`Pickleball-Leaderboard-Story-${activeDivision}.jpg`}
                  shareText={`Check out the latest standings for ${activeDivision} in the Corporate Pickleball League! 🥒🏆`}
                  className="!w-full md:!w-64 !bg-navy !text-white !font-display !font-extrabold !text-[13px] !tracking-widest !rounded-full !py-4 !shadow-lg"
                />
                <p className="mono text-[10px] opacity-40">PORTRAIT 9:16</p>
              </div>

              <div className="w-full md:w-auto space-y-3">
                <ShareButton 
                  targetRef={postShareRef} 
                  portalTarget={toastPortalRef}
                  buttonLabel="POST FORMAT"
                  fileName={`Pickleball-Leaderboard-Post-${activeDivision}.jpg`}
                  shareText={`We're climbing the leaderboard in the Corporate Pickleball League! 🔥`}
                  className="!w-full md:!w-64 !bg-yellow !text-navy !font-display !font-extrabold !text-[13px] !tracking-widest !rounded-full !py-4 !shadow-lg"
                />
                <p className="mono text-[10px] opacity-40">LANDSCAPE 1.91:1</p>
              </div>

              <div className="w-full md:w-auto space-y-3">
                <ShareButton 
                  targetRef={storyShareRef} 
                  portalTarget={toastPortalRef}
                  buttonLabel="WHATSAPP"
                  fileName={`Pickleball-Leaderboard-WA-${activeDivision}.jpg`}
                  shareText={`Check out the ${activeDivision} standings! 🥒🏆\n\nSee more at: pickleball.ky`}
                  className="!w-full md:!w-64 !bg-[#25D366] !text-white !font-display !font-extrabold !text-[13px] !tracking-widest !rounded-full !py-4 !shadow-lg"
                />
                <p className="mono text-[10px] opacity-40">PORTRAIT 9:16</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Hidden containers for generation */}
      <div className="absolute left-[-9999px] top-[-9999px] w-max">
        <div ref={storyShareRef} className="w-fit">
            <ShareableLeaderboard layout="story" division={activeDivision} entries={stats} />
        </div>
        <div ref={postShareRef} className="w-fit">
            <ShareableLeaderboard layout="post" division={activeDivision} entries={stats} />
        </div>
      </div>
    </div>
  );
};
