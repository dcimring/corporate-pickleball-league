import React, { useState, useEffect, useRef } from 'react';
import { Loader2, Trophy } from 'lucide-react';
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
        
        {/* Share Section: THE STICKER SLAP */}
        <div className="py-6 md:py-10 mt-8 relative overflow-hidden flex items-center justify-center">
            {/* Decorative Splatter */}
            <div className="absolute top-0 left-10 w-32 h-32 bg-brand-yellow/10 rounded-full blur-3xl animate-pulse" />
            
            <motion.div 
                whileHover={{ rotate: -2, scale: 1.02 }}
                className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border-4 border-dashed border-gray-100 relative transform rotate-1 max-w-lg w-full"
            >
                {/* Trophy Sticker Badge */}
                <div className="absolute -top-6 -right-6 bg-brand-yellow text-brand-blue w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-full border-4 border-white shadow-lg transform rotate-12">
                    <Trophy className="w-7 h-7 md:w-8 md:h-8" />
                </div>
                
                <div className="space-y-6 text-center">
                    <div className="space-y-3">
                        <h4 className="text-2xl md:text-3xl font-heading font-black uppercase text-brand-blue tracking-tight">
                            Share the Action!
                        </h4>
                        <p className="text-gray-400 font-mono text-[10px] md:text-xs uppercase font-bold tracking-widest leading-tight">
                            Post the leaderboard to social media or send it to your team.
                        </p>
                    </div>
                    
                    <ShareButton 
                        targetRef={shareRef} 
                        className="!w-full !justify-center !rounded-full !bg-brand-blue !text-white !border-4 !border-white !shadow-2xl hover:!bg-brand-yellow hover:!text-brand-blue !transition-colors !py-4"
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
