import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { LeaderboardTable } from '../components/LeaderboardTable';
import { Navigation } from '../components/Navigation';
import { ShareButton } from '../components/ShareButton';
import { ShareableLeaderboard } from '../components/ShareableLeaderboard';
import { TeamFilterHint } from '../components/TeamFilterHint';
import { LoadingState } from '../components/LoadingState';
import { useLeagueData } from '../context/LeagueContext';

export const Leaderboard: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { data, loading } = useLeagueData();
  const [activeDivision, setActiveDivision] = useState<string>('');
  const postShareRef = useRef<HTMLDivElement>(null);
  const storyShareRef = useRef<HTMLDivElement>(null);
  const shareCardRef = useRef<HTMLDivElement>(null);
  const shareCardInView = useInView(shareCardRef, { once: true, amount: 0.1 });
  const [shareCardAnimated, setShareCardAnimated] = useState(false);
  const toastPortalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (shareCardInView) {
      setShareCardAnimated(true);
      return;
    }
    const fallback = setTimeout(() => setShareCardAnimated(true), 300);
    return () => clearTimeout(fallback);
  }, [shareCardInView]);

  useEffect(() => {
    if (!loading && data.leaderboard) {
        // Initial division selection logic
        const divisions = Object.keys(data.leaderboard);
        const paramDiv = searchParams.get('division');
        const defaultDiv = paramDiv && divisions.includes(paramDiv) 
          ? paramDiv 
          : (divisions.includes('Division A') ? 'Division A' : divisions[0] || '');
        
        if (activeDivision === '' || (paramDiv && activeDivision !== paramDiv)) {
             setActiveDivision(defaultDiv);
        }
    }
  }, [loading, data, searchParams]);

  const handleDivisionChange = (div: string) => {
    setActiveDivision(div);
    setSearchParams({ division: div });
  };

  const handlePageChange = (path: string) => {
    // Navigate while preserving division param if possible, or just append it
    const currentDiv = searchParams.get('division') || activeDivision;
    if (currentDiv) {
        navigate(`${path}?division=${encodeURIComponent(currentDiv)}`);
    } else {
        navigate(path);
    }
  };

  const handleTeamClick = (teamName: string) => {
    const currentDiv = searchParams.get('division') || activeDivision;
    navigate(`/matches?division=${encodeURIComponent(currentDiv)}&team=${encodeURIComponent(teamName)}`);
  };

  if (loading || !activeDivision) {
    return <LoadingState />;
  }

  const divisions = Object.keys(data.leaderboard);
  const stats = data.leaderboard[activeDivision] || [];

  const pageTabs = [
    { name: 'Leaderboard', path: '/leaderboard' },
    { name: 'Matches', path: '/matches' },
  ];

  // Logic to find the most recent match date for the current division
  const divisionMatches = data.matches[activeDivision] || [];
  const latestMatchDate = divisionMatches.length > 0 
    ? divisionMatches.reduce((latest, current) => {
        return new Date(current.date) > new Date(latest) ? current.date : latest;
      }, divisionMatches[0].date)
    : null;

  const formatDate = (dateString: string) => {
    // Use UTC methods to avoid timezone shifts (data is YYYY-MM-DD)
    const d = new Date(dateString);
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const day = d.getUTCDate();
    
    // Add ordinal suffix (st, nd, rd, th)
    const suffix = (day % 10 === 1 && day !== 11) ? 'ST' : 
                   (day % 10 === 2 && day !== 12) ? 'ND' :
                   (day % 10 === 3 && day !== 13) ? 'RD' : 'TH';
    
    return `${months[d.getUTCMonth()]} ${day}${suffix}`;
  };

  return (
    <div className="space-y-2 relative">
      {/* Portal target for Share Toasts - centered at the bottom of the viewport */}
      <div ref={toastPortalRef} className="fixed bottom-0 left-0 right-0 z-[300] pointer-events-none flex justify-center pb-6" />

      <Navigation 
        pageTabs={pageTabs} 
        activePage="/leaderboard" 
        divisions={divisions} 
        activeDivision={activeDivision} 
        onPageChange={handlePageChange} 
        onDivisionChange={handleDivisionChange} 
      />

      <div className="mt-4">
        {/* Style B: The Mechanical Ticker */}
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          key={`ticker-${activeDivision}-${latestMatchDate}`}
          className="w-full py-2.5 bg-brand-gray/50 shadow-[inset_0_2px_10px_rgba(0,0,0,0.05)] border-y border-black/5 flex items-center justify-center relative overflow-hidden"
        >
          {/* Subtle texture overlay */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />

          <p className="relative z-10 text-[9px] md:text-xs font-mono font-black tracking-[0.3em] text-brand-blue/80 uppercase text-center flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow shadow-[0_0_8px_rgba(255,199,44,0.8)] animate-pulse" />
            <span className="drop-shadow-[1px_1px_0px_rgba(255,255,255,1)]">
              {latestMatchDate ? `Matches through ${formatDate(latestMatchDate)} included` : 'No matches recorded'}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow shadow-[0_0_8px_rgba(255,199,44,0.8)] animate-pulse" />
          </p>
        </motion.div>
        
        <TeamFilterHint />
      </div>

      <div className="space-y-2 px-2 md:px-4 mt-4">
        <LeaderboardTable stats={stats} onTeamClick={handleTeamClick} />
        
        {/* Share Section */}
        <div className="flex items-center justify-center">
        <motion.div 
          ref={shareCardRef}
          initial={{ y: 20, opacity: 0 }}
          animate={shareCardAnimated ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-4xl w-full relative overflow-hidden"
        >
            <div className="px-5 py-4 text-center space-y-4 md:space-y-6">
              <div className="space-y-1">
                <p className="text-[10px] md:text-xs font-heading font-black italic uppercase tracking-[0.18em] text-brand-blue">
                  Download the Leaderboard
                </p>
                <h4 className="text-lg md:text-3xl font-heading font-black uppercase text-brand-blue tracking-tight">
                  Share with your team and on social media
                </h4>
              </div>
              
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
                {/* Story Option */}
                <div className="w-full md:w-auto space-y-2">
                  <ShareButton 
                    targetRef={storyShareRef} 
                    portalTarget={toastPortalRef}
                    buttonLabel="Story Format"
                    fileName={`LRP-Pickleball-Leaderboard-Story-${activeDivision}.jpg`}
                    shareText={`Check out the latest standings for ${activeDivision} in the La Roche Posay Corporate Pickleball League! 🥒🏆`}
                    className="!w-full md:!w-48 !h-[52px] !justify-center !rounded-xl !bg-brand-blue !text-white !shadow-sm hover:!bg-brand-blue/90 !transition-colors !text-sm"
                  />
                  <p className="text-[9px] font-mono font-bold text-gray-400 uppercase tracking-widest">Portrait 9:16</p>
                </div>

                {/* Post Option */}
                <div className="w-full md:w-auto space-y-2">
                  <ShareButton 
                    targetRef={postShareRef} 
                    portalTarget={toastPortalRef}
                    buttonLabel="Post Format"
                    fileName={`LRP-Pickleball-Leaderboard-Post-${activeDivision}.jpg`}
                    shareText={`We're climbing the leaderboard in the La Roche Posay Corporate Pickleball League! 🔥`}
                    className="!w-full md:!w-48 !h-[52px] !justify-center !rounded-xl !bg-[rgb(142,209,252)] !text-brand-blue !shadow-sm hover:!bg-[rgb(122,189,232)] !transition-colors !text-sm"
                  />
                  <p className="text-[9px] font-mono font-bold text-gray-400 uppercase tracking-widest">Landscape 1.91:1</p>
                </div>

                {/* WhatsApp Option */}
                <div className="w-full md:w-auto space-y-2">
                  <ShareButton 
                    targetRef={storyShareRef} 
                    portalTarget={toastPortalRef}
                    buttonLabel="WhatsApp"
                    fileName={`LRP-Pickleball-Leaderboard-WA-${activeDivision}.jpg`}
                    shareText={`Check out the ${activeDivision} standings! 🥒🏆\n\nSee more at: pickleball.ky`}
                    className="!w-full md:!w-48 !h-[52px] !justify-center !rounded-xl !bg-[#25D366] !text-white !shadow-sm hover:!bg-[#20ba5a] !transition-colors !text-sm"
                  />
                  <p className="text-[9px] font-mono font-bold text-gray-400 uppercase tracking-widest">Portrait 9:16</p>
                </div>
              </div>

              <p className="text-gray-400 font-mono text-[10px] md:text-xs uppercase font-bold tracking-[0.18em] leading-tight">
                Optimized for WhatsApp, Instagram, and Facebook.
              </p>
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