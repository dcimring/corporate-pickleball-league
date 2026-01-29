import React, { useState, useEffect } from 'react';
import { Loader2, Info, X } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Navigation } from '../components/Navigation';
import { MatchCard } from '../components/MatchCard';
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="w-10 h-10 text-brand-blue animate-spin" />
      </div>
    );
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
    <div className="space-y-8">
      <Navigation 
        pageTabs={pageTabs} 
        activePage="/matches" 
        divisions={divisions} 
        activeDivision={activeDivision} 
        onPageChange={handlePageChange} 
        onDivisionChange={handleDivisionChange} 
      />

      {/* Active Filter Banner */}
      {selectedTeam && (
        <div className="px-4 flex justify-center">
          <button 
            onClick={handleClearFilter}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-blue text-white rounded-full shadow-md hover:bg-brand-blue/90 hover:-translate-y-0.5 transition-all group"
          >
            <span className="font-heading font-black italic uppercase text-sm tracking-widest">
              {selectedTeam}
            </span>
            <div className="bg-white/20 rounded-full p-0.5 group-hover:bg-white/30">
              <X className="w-4 h-4" />
            </div>
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        {matches.length > 0 ? (
          matches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))
        ) : (
          <div className="col-span-full p-16 text-center flex flex-col items-center justify-center gap-4 text-gray-400 bg-white rounded-2xl border border-gray-100">
            <div className="bg-blue-50 p-4 rounded-full">
              <Info className="w-8 h-8 text-brand-blue" />
            </div>
            <p className="font-heading font-bold text-xl text-brand-blue">
              {selectedTeam ? `No matches found for ${selectedTeam}` : 'No matches found'}
            </p>
            <p className="font-body text-gray-500">
              {selectedTeam ? 'Try clearing the filter or check back later.' : 'Check back later for the schedule!'}
            </p>
            {selectedTeam && (
               <button onClick={handleClearFilter} className="mt-2 text-brand-blue font-bold hover:underline">
                 Clear Filter
               </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
