import React, { useState, useEffect, useRef } from 'react';
import { Loader2, Share2 } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
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
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm mt-8 flex flex-col items-center text-center">
            <h3 className="text-2xl font-heading font-bold text-brand-blue mb-2">Share the Action!</h3>
            <p className="text-gray-500 font-body mb-6 max-w-md">
                Post the leaderboard to social media or send it to your team.
            </p>
            <ShareButton targetRef={shareRef} />
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
