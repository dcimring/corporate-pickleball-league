import React, { useState, useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LeaderboardTable } from '../components/LeaderboardTable';
import { Navigation } from '../components/Navigation';
import { ShareButton } from '../components/ShareButton';
import { ShareableLeaderboard } from '../components/ShareableLeaderboard';
import { useLeagueData } from '../context/LeagueContext';

export const Leaderboard: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { data, loading } = useLeagueData();
  const [activeDivision, setActiveDivision] = useState<string>('');
  const shareRef = useRef<HTMLDivElement>(null);

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
        <LeaderboardTable stats={stats} onTeamClick={handleTeamClick} />
        
        {/* Share Section */}
        <div className="pt-4 md:pt-5 pb-2 md:pb-3 mt-6 flex items-center justify-center">
          <motion.div 
            whileHover={{ y: -2 }}
            className="bg-white rounded-[2rem] border-4 border-brand-yellow max-w-lg w-full relative overflow-hidden"
          >
            <div className="px-6 md:px-8 py-6 md:py-7 text-center space-y-4">
              <div className="space-y-2">
                <p className="text-[11px] md:text-xs font-heading font-black italic uppercase tracking-[0.18em] text-brand-blue">
                  Spread the Word
                </p>
                <h4 className="text-xl md:text-2xl font-heading font-black uppercase text-brand-blue tracking-tight">
                  Share the leaderboard with your team
                </h4>
                <p className="text-gray-400 font-mono text-[10px] md:text-xs uppercase font-bold tracking-[0.18em] leading-tight">
                  Post the leaderboard to social media or send it to your team.
                </p>
              </div>
              
              <ShareButton 
                targetRef={shareRef} 
                className="!w-full !justify-center !rounded-xl !bg-brand-blue !text-white !shadow-md hover:!bg-brand-blue/90 !transition-colors !py-3 !text-sm"
              />
            </div>
          </motion.div>
        </div>

      </div>

      {/* Hidden container for generation */}
      <div className="absolute left-[-9999px] top-[-9999px]">
        <div ref={shareRef}>
            <ShareableLeaderboard division={activeDivision} entries={stats} />
        </div>
      </div>
    </div>
  );
};
