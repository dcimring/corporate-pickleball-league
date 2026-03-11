import React, { useState, useEffect } from 'react';
import { Info, X } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Navigation } from '../components/Navigation';
import { MatchCard } from '../components/MatchCard';
import { TeamFilterHint } from '../components/TeamFilterHint';
import { LoadingState } from '../components/LoadingState';
import { useLeagueData } from '../context/LeagueContext';

export const Matches: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { data, loading } = useLeagueData();
  const [activeDivision, setActiveDivision] = useState<string>('');

  useEffect(() => {
    if (!loading && data.matches) {
        // Initial division selection logic
        const divisions = Object.keys(data.matches);
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
    const currentDiv = searchParams.get('division') || activeDivision;
    if (currentDiv) {
        navigate(`${path}?division=${encodeURIComponent(currentDiv)}`);
    } else {
        navigate(path);
    }
  };

  const handleClearFilter = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('team');
    setSearchParams(newParams);
  };

  const handleTeamClick = (teamName: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('team', teamName);
    setSearchParams(newParams);
  };

  if (loading || !activeDivision) {
    return <LoadingState />;
  }

  const divisions = Object.keys(data.matches);
  const selectedTeam = searchParams.get('team');
  
  let matches = data.matches[activeDivision] || [];
  
  if (selectedTeam) {
    matches = matches.filter(m => m.team1 === selectedTeam || m.team2 === selectedTeam);
  }

  const pageTabs = [
    { name: 'Leaderboard', path: '/leaderboard' },
    { name: 'Matches', path: '/matches' },
  ];

  return (
    <div className="space-y-4">
      <Navigation 
        pageTabs={pageTabs} 
        activePage="/matches" 
        divisions={divisions} 
        activeDivision={activeDivision} 
        onPageChange={handlePageChange} 
        onDivisionChange={handleDivisionChange} 
      />

      {/* Active Filter Banner with Filter Pop animation */}
      <AnimatePresence mode="wait">
        {selectedTeam && (
          <motion.div 
            key="filter-banner"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="px-4 flex justify-center"
          >
            <button 
              onClick={handleClearFilter}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-blue text-white rounded-full shadow-md hover:bg-brand-blue/90 hover:-translate-y-0.5 transition-all group relative overflow-hidden"
            >
              {/* Subtle background flash effect on entrance */}
              <motion.div 
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="absolute inset-0 bg-white/20 skew-x-12 pointer-events-none"
              />
              <span className="font-heading font-black italic uppercase text-sm tracking-widest relative z-10">
                {selectedTeam}
              </span>
              <div className="bg-white/20 rounded-full p-0.5 group-hover:bg-white/30 relative z-10">
                <X className="w-4 h-4" />
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <TeamFilterHint className="mx-4" />

      {/* Kinetic Entrance for match list */}
      <motion.div 
        key={`${activeDivision}-${selectedTeam}`}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 pb-4"
      >
        {matches.length > 0 ? (
          matches.map((match) => (
            <MatchCard key={match.id} match={match} onTeamClick={handleTeamClick} />
          ))
        ) : (
          <div className="col-span-full p-12 text-center flex flex-col items-center justify-center gap-4 text-gray-400 bg-white rounded-2xl border border-gray-100">
            <div className="bg-blue-50 p-3 rounded-full">
              <Info className="w-6 h-6 text-brand-blue" />
            </div>
            <p className="font-heading font-bold text-lg text-brand-blue">
              {selectedTeam ? `No matches found for ${selectedTeam}` : 'No matches found'}
            </p>
            <p className="font-body text-xs text-gray-500">
              {selectedTeam ? 'Try clearing the filter or check back later.' : 'Check back later for the schedule!'}
            </p>
            {selectedTeam && (
               <button onClick={handleClearFilter} className="mt-1 text-brand-blue text-sm font-bold hover:underline">
                 Clear Filter
               </button>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};
