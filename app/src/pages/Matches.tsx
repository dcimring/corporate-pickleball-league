import React, { useState, useEffect, useRef } from 'react';
import { Info, X } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [activeToastTarget, setActiveToastTarget] = useState<React.RefObject<HTMLDivElement | null> | null>(null);
  
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

  const handleShare = (match: Match, type: 'story' | 'post' | 'wa', toastRef: React.RefObject<HTMLDivElement | null>) => {
    setSharingMatch(match);
    setSharingType(type);
    setActiveToastTarget(toastRef);
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
    // Keep machinery alive for toast
    setTimeout(() => {
        setSharingMatch(null);
        setSharingType(null);
        setActiveToastTarget(null);
    }, 5000);
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
    <div className="relative">
      <Navigation 
        pageTabs={pageTabs} 
        activePage="/matches" 
        divisions={divisions} 
        activeDivision={activeDivision} 
        onPageChange={handlePageChange} 
        onDivisionChange={handleDivisionChange} 
      />

      <div className="mt-4">
        {/* Active Filter Ribbon */}
        <AnimatePresence mode="wait">
          {selectedTeam && (
            <motion.div 
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
              className="px-0 flex justify-center overflow-hidden"
            >
              <button 
                onClick={handleClearFilter}
                className="w-full py-4 bg-secondary text-white flex items-center justify-center gap-6 group hover:bg-secondary/95 transition-colors relative"
              >
                <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-primary to-primary-container" />
                <span className="flex items-center gap-3">
                  <span className="font-display font-bold text-white/30 uppercase tracking-[0.25em] text-[10px]">Filtering</span>
                  <span className="headline-md !text-lg md:!text-xl tracking-tight leading-none italic">{selectedTeam}</span>
                </span>
                <div className="bg-white/10 rounded-full p-1.5 group-hover:bg-primary group-hover:text-on-primary transition-all">
                  <X className="w-3.5 h-3.5" />
                </div>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <TeamFilterHint />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 pb-4 mt-6">
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
                portalTarget={activeToastTarget || undefined}
                hidden
                toastPosition="fixed"
                onShareEnd={handleShareEnd}
                fileName={`LRP-Match-${sharingMatch.team1}-vs-${sharingMatch.team2}-story.jpg`}
              />
              <ShareButton
                ref={desktopStoryBtnRef}
                targetRef={storyShareRef}
                portalTarget={activeToastTarget || undefined}
                hidden
                preferDownload
                toastPosition="fixed"
                onShareEnd={handleShareEnd}
                fileName={`LRP-Match-${sharingMatch.team1}-vs-${sharingMatch.team2}-story.jpg`}
              />
              <ShareButton
                ref={mobilePostBtnRef}
                targetRef={postShareRef}
                portalTarget={activeToastTarget || undefined}
                hidden
                toastPosition="fixed"
                onShareEnd={handleShareEnd}
                fileName={`LRP-Match-${sharingMatch.team1}-vs-${sharingMatch.team2}-post.jpg`}
              />
              <ShareButton
                ref={desktopPostBtnRef}
                targetRef={postShareRef}
                portalTarget={activeToastTarget || undefined}
                hidden
                preferDownload
                toastPosition="fixed"
                onShareEnd={handleShareEnd}
                fileName={`LRP-Match-${sharingMatch.team1}-vs-${sharingMatch.team2}-post.jpg`}
              />
              <ShareButton
                ref={mobileWABtnRef}
                targetRef={storyShareRef}
                portalTarget={activeToastTarget || undefined}
                hidden
                toastPosition="fixed"
                onShareEnd={handleShareEnd}
                fileName={`LRP-Match-WA-${sharingMatch.team1}-vs-${sharingMatch.team2}.jpg`}
              />
              <ShareButton
                ref={desktopWABtnRef}
                targetRef={storyShareRef}
                portalTarget={activeToastTarget || undefined}
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