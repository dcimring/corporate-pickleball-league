import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Info, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MatchCard } from '../components/MatchCard';
import { LoadingState } from '../components/LoadingState';
import { useLeagueData } from '../context/LeagueContext';
import { ShareButton, type ShareButtonHandle } from '../components/ShareButton';
import { ShareableMatch } from '../components/ShareableMatch';
import type { Match } from '../types';

export const Matches: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data, loading } = useLeagueData();

  // Unified Active Division Logic - Derive directly from URL to prevent dual-render flicker
  const activeDivision = useMemo(() => {
    if (loading || !data.matches) return '';
    const divisions = Object.keys(data.matches);
    const paramDiv = searchParams.get('division');
    
    if (paramDiv && divisions.includes(paramDiv)) return paramDiv;
    
    // Default to Division A or first available
    return divisions.includes('Division A') ? 'Division A' : divisions[0] || '';
  }, [loading, data.matches, searchParams]);

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

  useEffect(() => {
    if (sharingMatch && sharingType) {
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
    setTimeout(() => {
        setSharingMatch(null);
        setSharingType(null);
        setActiveToastTarget(null);
    }, 5000);
  };

  if (loading || !activeDivision) {
    return <LoadingState />;
  }

  const selectedTeam = searchParams.get('team');
  
  let matches = data.matches[activeDivision] || [];
  
  if (selectedTeam) {
    matches = matches.filter(m => m.team1 === selectedTeam || m.team2 === selectedTeam);
  }

  return (
    <div className="space-y-0 relative overflow-hidden">
      {/* Page-Specific Content below Layout Header */}
      <div className="pt-0 pb-4 px-6 md:px-12">
        <div className="space-y-2">
          {/* Active Filter Ribbon - Editorial Style */}
          <AnimatePresence mode="wait">
            {selectedTeam && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="overflow-hidden"
              >
                <div 
                  className="w-full py-2 bg-primary text-on-primary flex items-center justify-center gap-6 relative"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-2 bg-secondary" />
                  <span className="label-sm font-black tracking-[0.3em] flex items-center gap-4">
                    <span className="opacity-40 font-stat">FILTERED BY</span>
                    <span className="text-secondary">{selectedTeam}</span>
                  </span>
                  <button 
                    onClick={handleClearFilter}
                    className="p-1 hover:bg-secondary hover:text-primary transition-all rounded-none"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="px-6 md:px-12 pt-6 pb-12 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
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
            <div className="col-span-full py-32 text-center flex flex-col items-center justify-center gap-8 bg-surface-container-low">
              <div className="bg-primary/5 p-8 rounded-none">
                <Info className="w-12 h-12 text-primary opacity-20" />
              </div>
              <div className="space-y-4">
                <h3 className="display-sm text-primary uppercase">No matches found</h3>
                <p className="body-lg text-on-surface-variant opacity-60 max-w-md mx-auto">
                    {selectedTeam ? `We couldn't find any match records for ${selectedTeam} in this division.` : 'The schedule is being finalized. Check back soon for upcoming fixtures.'}
                </p>
              </div>
              {selectedTeam && (
                 <button onClick={handleClearFilter} className="btn-secondary">
                   RESET ALL FILTERS
                 </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* GLOBAL SHARE PORTAL (Hidden from view) */}
      <div className="absolute left-[-9999px] top-[-9999px] pointer-events-none">
          {sharingMatch && (
            <>
              <div ref={storyShareRef} className="w-fit">
                  <ShareableMatch match={sharingMatch} layout="story" />
              </div>
              <div ref={postShareRef} className="w-fit">
                  <ShareableMatch match={sharingMatch} layout="post" />
              </div>

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
