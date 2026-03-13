import React, { useState, useEffect, useRef } from 'react';
import { Info, X } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Navigation } from '../components/Navigation';
import { MatchCard } from '../components/MatchCard';
import { TeamFilterHint } from '../components/TeamFilterHint';
import { LoadingState } from '../components/LoadingState';
import { useLeagueData } from '../context/LeagueContext';
import { ShareButton, type ShareButtonHandle } from '../components/ShareButton';
import { ShareableMatch } from '../components/ShareableMatch';
import type { Match } from '../types';

export const Matches: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { data, loading } = useLeagueData();
  const [activeDivision, setActiveDivision] = useState<string>('');

  // Global Sharing State
  const [sharingMatch, setSharingMatch] = useState<Match | null>(null);
  const [sharingType, setSharingType] = useState<'story' | 'post' | 'wa' | null>(null);
  
  const storyShareRef = useRef<HTMLDivElement>(null);
  const postShareRef = useRef<HTMLDivElement>(null);
  
  const mobileStoryBtnRef = useRef<ShareButtonHandle>(null);
  const desktopStoryBtnRef = useRef<ShareButtonHandle>(null);
  const mobilePostBtnRef = useRef<ShareButtonHandle>(null);
  const desktopPostBtnRef = useRef<ShareButtonHandle>(null);
  const mobileWABtnRef = useRef<ShareButtonHandle>(null);
  const desktopWABtnRef = useRef<ShareButtonHandle>(null);

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

  const handleShare = (match: Match, type: 'story' | 'post' | 'wa') => {
    setSharingMatch(match);
    setSharingType(type);
  };

  // Trigger share once the match is rendered in the hidden container
  useEffect(() => {
    if (sharingMatch && sharingType) {
      // Small delay to ensure React has finished rendering the hidden content
      const timer = setTimeout(() => {
        const isDesktop = typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches;
        
        if (sharingType === 'story') {
          if (isDesktop) desktopStoryBtnRef.current?.triggerShare();
          else mobileStoryBtnRef.current?.triggerShare();
        } else if (sharingType === 'post') {
          if (isDesktop) desktopPostBtnRef.current?.triggerShare();
          else mobilePostBtnRef.current?.triggerShare();
        } else if (sharingType === 'wa') {
          if (isDesktop) desktopWABtnRef.current?.triggerShare();
          else mobileWABtnRef.current?.triggerShare();
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [sharingMatch, sharingType]);

  const handleShareEnd = () => {
    // We delay clearing the match so the toast (which is inside ShareButton) 
    // has time to be seen before the component is unmounted.
    setTimeout(() => {
        setSharingMatch(null);
        setSharingType(null);
    }, 5000); // Wait 5s before cleaning up the sharing machinery
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
    <div className="space-y-2">
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

      <TeamFilterHint className="mx-4 mt-5" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 pb-4 mt-5">
        {matches.length > 0 ? (
          matches.map((match) => (
            <MatchCard 
              key={match.id} 
              match={match} 
              onTeamClick={handleTeamClick} 
              onShare={handleShare}
              isSharing={sharingMatch?.id === match.id}
            />
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
      </div>

      {/* GLOBAL SHARE PORTAL (Hidden from view) */}
      <div className="absolute left-[-9999px] top-[-9999px] pointer-events-none">
          {sharingMatch && (
            <>
              {/* Target Containers for html-to-image */}
              <div ref={storyShareRef} className="w-fit">
                  <ShareableMatch match={sharingMatch} layout="story" />
              </div>
              <div ref={postShareRef} className="w-fit">
                  <ShareableMatch match={sharingMatch} layout="post" />
              </div>

              {/* Machinery */}
              <ShareButton
                ref={mobileStoryBtnRef}
                targetRef={storyShareRef}
                hidden
                toastPosition="fixed"
                onShareEnd={handleShareEnd}
                fileName={`LRP-Match-${sharingMatch.team1}-vs-${sharingMatch.team2}-story.jpg`}
              />
              <ShareButton
                ref={desktopStoryBtnRef}
                targetRef={storyShareRef}
                hidden
                preferDownload
                toastPosition="fixed"
                onShareEnd={handleShareEnd}
                fileName={`LRP-Match-${sharingMatch.team1}-vs-${sharingMatch.team2}-story.jpg`}
              />
              <ShareButton
                ref={mobilePostBtnRef}
                targetRef={postShareRef}
                hidden
                toastPosition="fixed"
                onShareEnd={handleShareEnd}
                fileName={`LRP-Match-${sharingMatch.team1}-vs-${sharingMatch.team2}-post.jpg`}
              />
              <ShareButton
                ref={desktopPostBtnRef}
                targetRef={postShareRef}
                hidden
                preferDownload
                toastPosition="fixed"
                onShareEnd={handleShareEnd}
                fileName={`LRP-Match-${sharingMatch.team1}-vs-${sharingMatch.team2}-post.jpg`}
              />
              <ShareButton
                ref={mobileWABtnRef}
                targetRef={storyShareRef}
                hidden
                toastPosition="fixed"
                onShareEnd={handleShareEnd}
                fileName={`LRP-Match-WA-${sharingMatch.team1}-vs-${sharingMatch.team2}.jpg`}
              />
              <ShareButton
                ref={desktopWABtnRef}
                targetRef={storyShareRef}
                hidden
                preferDownload
                toastPosition="fixed"
                onShareEnd={handleShareEnd}
                fileName={`LRP-Match-WA-${sharingMatch.team1}-vs-${sharingMatch.team2}.jpg`}
              />
            </>
          )}
      </div>
    </div>
  );
};