import React, { useState, useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { LeaderboardTable } from '../components/LeaderboardTable';
import { Navigation } from '../components/Navigation';
import { ShareButton } from '../components/ShareButton';
import { ShareableLeaderboard } from '../components/ShareableLeaderboard';
import { TeamFilterHint } from '../components/TeamFilterHint';
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="w-10 h-10 text-brand-blue animate-spin" />
      </div>
    );
  }

  const divisions = Object.keys(data.leaderboard);
  const stats = data.leaderboard[activeDivision] || [];

  const pageTabs = [
    { name: 'Leaderboard', path: '/leaderboard' },
    { name: 'Matches', path: '/matches' },
  ];

  return (
    <div className="space-y-8">
      <Navigation 
        pageTabs={pageTabs} 
        activePage="/leaderboard" 
        divisions={divisions} 
        activeDivision={activeDivision} 
        onPageChange={handlePageChange} 
        onDivisionChange={handleDivisionChange} 
      />

      <div className="space-y-4 px-0 md:px-4">
        <TeamFilterHint />
        <LeaderboardTable stats={stats} onTeamClick={handleTeamClick} />
        
        {/* Share Section */}
        <div className="pt-3 md:pt-4 pb-0 mt-4 md:mt-5 -mb-2 md:-mb-3 flex items-center justify-center">
        <motion.div 
          ref={shareCardRef}
          whileHover={{ y: -2 }}
          initial={{ x: 80, opacity: 0 }}
          animate={shareCardAnimated ? { x: 0, opacity: 1 } : { x: 80, opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="bg-white rounded-[2rem] border-4 border-brand-yellow shadow-[0_0_15px_#FFC72C] max-w-[340px] md:max-w-xl w-full relative overflow-hidden"
        >
            <div className="px-5 md:px-8 py-5 md:py-7 text-center space-y-4 md:space-y-6">
              <div className="space-y-2">
                <p className="text-[11px] md:text-xs font-heading font-black italic uppercase tracking-[0.18em] text-brand-blue">
                  Spread the Word
                </p>
                <h4 className="text-lg md:text-2xl font-heading font-black uppercase text-brand-blue tracking-tight">
                  Share the leaderboard with your team
                </h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                {/* Story Option */}
                <div className="space-y-2">
                  <ShareButton 
                    targetRef={storyShareRef} 
                    buttonLabel="Share Story"
                    fileName={`LRP-Pickleball-Leaderboard-Story-${activeDivision}.jpg`}
                    shareText={`Check out the latest standings for ${activeDivision} in the La Roche Posay Corporate Pickleball League! 🥒🏆`}
                    className="!w-full !justify-center !rounded-xl !bg-brand-blue !text-white !shadow-md hover:!bg-brand-blue/90 !transition-colors !py-3 !text-sm"
                  />
                  <p className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest">Portrait 9:16</p>
                </div>

                {/* Post Option */}
                <div className="space-y-2">
                  <ShareButton 
                    targetRef={postShareRef} 
                    buttonLabel="Share Post"
                    fileName={`LRP-Pickleball-Leaderboard-Post-${activeDivision}.jpg`}
                    shareText={`We're climbing the leaderboard in the La Roche Posay Corporate Pickleball League! 🔥`}
                    className="!w-full !justify-center !rounded-xl !bg-[rgb(142,209,252)] !text-brand-blue !shadow-md hover:!bg-[rgb(122,189,232)] !transition-colors !py-3 !text-sm"
                  />
                  <p className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest">Landscape 1.91:1</p>
                </div>
              </div>

              {/* WhatsApp Option (Always Story Layout) */}
              <div className="pt-2">
                  <ShareButton 
                    targetRef={storyShareRef} 
                    buttonLabel="Share to WhatsApp"
                    fileName={`LRP-Pickleball-Leaderboard-WA-${activeDivision}.jpg`}
                    shareText={`Check out the ${activeDivision} standings! 🥒🏆\n\nSee more at: pickleball.ky`}
                    className="!w-full !justify-center !rounded-xl !bg-[#25D366] !text-white !shadow-md hover:!bg-[#20ba5a] !transition-colors !py-3 !text-sm"
                  />
              </div>

              <p className="text-gray-400 font-mono text-[10px] md:text-xs uppercase font-bold tracking-[0.18em] leading-tight">
                Optimized for WhatsApp, Instagram, and Facebook.
              </p>
            </div>
        </motion.div>
        </div>

      </div>

      {/* Hidden containers for generation */}
      <div className="absolute left-[-9999px] top-[-9999px]">
        <div ref={storyShareRef}>
            <ShareableLeaderboard layout="story" division={activeDivision} entries={stats} />
        </div>
        <div ref={postShareRef}>
            <ShareableLeaderboard layout="post" division={activeDivision} entries={stats} />
        </div>
      </div>
    </div>
  );
};
