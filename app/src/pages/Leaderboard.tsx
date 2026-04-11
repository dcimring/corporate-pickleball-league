import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { LeaderboardTable } from '../components/LeaderboardTable';
import { ShareButton } from '../components/ShareButton';
import { ShareableLeaderboard } from '../components/ShareableLeaderboard';
import { LoadingState } from '../components/LoadingState';
import { useLeagueData } from '../context/LeagueContext';

export const Leaderboard: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { data, loading } = useLeagueData();

  // Unified Active Division Logic - Derive directly from URL to prevent dual-render flicker
  const activeDivision = useMemo(() => {
    if (loading || !data.leaderboard) return '';
    const divisions = Object.keys(data.leaderboard);
    const paramDiv = searchParams.get('division');
    
    if (paramDiv && divisions.includes(paramDiv)) return paramDiv;
    
    return divisions.includes('Division A') ? 'Division A' : divisions[0] || '';
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

  const handleDivisionChange = (div: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('division', div);
    newParams.delete('team');
    setSearchParams(newParams);
  };

  const handlePageChange = (path: string) => {
    if (activeDivision) {
        navigate(`${path}?division=${encodeURIComponent(activeDivision)}`);
    } else {
        navigate(path);
    }
  };

  const handleTeamClick = (teamName: string) => {
    if (activeDivision) {
        navigate(`/matches?division=${encodeURIComponent(activeDivision)}&team=${encodeURIComponent(teamName)}`);
    }
  };

  if (loading || !activeDivision) {
    return <LoadingState />;
  }

  const divisions = Object.keys(data.leaderboard);
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
    <div className="space-y-0 relative overflow-hidden">
      {/* Portal target for Share Toasts */}
      <div ref={toastPortalRef} className="fixed bottom-0 left-0 right-0 z-[300] pointer-events-none flex justify-center pb-6" />

      {/* Page-Specific Content below Layout Header */}
      <div className="pt-0 pb-4 px-6 md:px-12">
        {/* Editorial Ticker - No Background */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          key={`ticker-${activeDivision}-${latestMatchDate}`}
          className="w-full py-1 flex items-center justify-center relative overflow-hidden"
        >
          <p className="relative z-10 label-sm text-primary/60 text-center flex items-center gap-4">
            <span className="w-1.5 h-1.5 bg-secondary shadow-[0_0_8px_rgba(255,199,44,0.8)] animate-pulse" />
            <span>
              {latestMatchDate ? `DATA CURRENT THROUGH ${formatDate(latestMatchDate)}` : 'AWAITING MATCH DATA'}
            </span>
            <span className="w-1.5 h-1.5 bg-secondary shadow-[0_0_8px_rgba(255,199,44,0.8)] animate-pulse" />
          </p>
        </motion.div>
      </div>

      <div className="px-0 md:px-12 pt-6 pb-12 space-y-8">
        <LeaderboardTable stats={stats} onTeamClick={handleTeamClick} />
          
          {/* Share Section - Editorial Layout */}
          <div className="flex items-center justify-center py-12">
            <motion.div 
              ref={shareCardRef}
              initial={{ y: 20, opacity: 0 }}
              animate={shareCardAnimated ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="w-full relative overflow-hidden p-8 md:p-12 text-center space-y-8"
            >
              <div className="space-y-2 max-w-2xl mx-auto">
                <p className="label-md text-secondary font-black tracking-[0.2em]">
                  EDITORIAL EXCLUSIVE
                </p>
                <h4 className="display-sm text-primary uppercase">
                  SHARE THE GLORY
                </h4>
                <p className="body-lg text-on-surface-variant opacity-60">
                  Export high-fidelity standings cards optimized for your favorite social platforms.
                </p>
              </div>
              
              <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                <div className="w-full md:w-auto space-y-2">
                  <ShareButton 
                    targetRef={storyShareRef} 
                    portalTarget={toastPortalRef}
                    buttonLabel="STORY FORMAT"
                    fileName={`LRP-Pickleball-Leaderboard-Story-${activeDivision}.jpg`}
                    shareText={`Check out the latest standings for ${activeDivision} in the La Roche Posay Corporate Pickleball League! 🥒🏆`}
                    className="!w-full md:!w-64 !btn-primary"
                  />
                  <p className="label-sm opacity-40">PORTRAIT 9:16</p>
                </div>

                <div className="w-full md:w-auto space-y-2">
                  <ShareButton 
                    targetRef={postShareRef} 
                    portalTarget={toastPortalRef}
                    buttonLabel="POST FORMAT"
                    fileName={`LRP-Pickleball-Leaderboard-Post-${activeDivision}.jpg`}
                    shareText={`We're climbing the leaderboard in the La Roche Posay Corporate Pickleball League! 🔥`}
                    className="!w-full md:!w-64 !btn-secondary"
                  />
                  <p className="label-sm opacity-40">LANDSCAPE 1.91:1</p>
                </div>

                <div className="w-full md:w-auto space-y-2">
                  <ShareButton 
                    targetRef={storyShareRef} 
                    portalTarget={toastPortalRef}
                    buttonLabel="WHATSAPP"
                    fileName={`LRP-Pickleball-Leaderboard-WA-${activeDivision}.jpg`}
                    shareText={`Check out the ${activeDivision} standings! 🥒🏆\n\nSee more at: pickleball.ky`}
                    className="!w-full md:!w-64 !inline-flex !items-center !justify-center !px-6 !py-3 !bg-[#25D366] !text-white !font-heading !font-bold !rounded-[4px] !hover:opacity-90 !transition-all !shadow-ambient"
                  />
                  <p className="label-sm opacity-40">PORTRAIT 9:16</p>
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
