import React, { useState, useEffect, useRef } from 'react';
import { Info, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MatchCard } from '../components/MatchCard';
import { LoadingState } from '../components/LoadingState';
import { useLeagueData } from '../context/LeagueContext';
import { ShareButton, type ShareButtonHandle } from '../components/ShareButton';
import { useActiveDivision } from '../hooks/useActiveDivision';
import { formatMatchDate, getLatestMatchDate } from '../lib/format';
import { SEASON_LABEL } from '../lib/config';
import type { Match } from '../types';

const SHARE_TYPES = ['story', 'post', 'wa'] as const;
const SHARE_DEVICES = ['mobile', 'desktop'] as const;

export const Matches: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data, loading } = useLeagueData();
  const { activeDivision } = useActiveDivision();
  const [showTip, setShowTip] = useState(() => {
    return sessionStorage.getItem('leaderboard_tip_dismissed') !== 'true';
  });

  const handleDismissTip = () => {
    setShowTip(false);
    sessionStorage.setItem('leaderboard_tip_dismissed', 'true');
  };

  // Global Sharing State
  const [sharingMatch, setSharingMatch] = useState<Match | null>(null);
  const [sharingType, setSharingType] = useState<'story' | 'post' | 'wa' | null>(null);
  const [activeToastTarget, setActiveToastTarget] = useState<React.RefObject<HTMLDivElement | null> | null>(null);
  const [activeCardRef, setActiveCardRef] = useState<React.RefObject<HTMLDivElement | null> | null>(null);

  // One hidden ShareButton per (type, device) pair, keyed "story-mobile", "post-desktop", etc.
  const shareBtnRefs = useRef<Record<string, ShareButtonHandle | null>>({});

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

  const handleShare = (match: Match, type: 'story' | 'post' | 'wa', toastRef: React.RefObject<HTMLDivElement | null>, cardRef: React.RefObject<HTMLDivElement | null>) => {
    setSharingMatch(match);
    setSharingType(type);
    setActiveToastTarget(toastRef);
    setActiveCardRef(cardRef);
  };

  useEffect(() => {
    if (sharingMatch && sharingType && activeCardRef) {
      const timer = setTimeout(() => {
        const isDesktop = typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches;
        shareBtnRefs.current[`${sharingType}-${isDesktop ? 'desktop' : 'mobile'}`]?.triggerShare();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [sharingMatch, sharingType, activeCardRef]);

  const handleShareEnd = () => {
    // Immediately stop the spin animation in the card by clearing the type
    setSharingType(null);
    
    // Keep the sharing match (and thus the portal/toast) active for 6 seconds
    setTimeout(() => {
        setSharingMatch(null);
        setActiveToastTarget(null);
        setActiveCardRef(null);
    }, 6000);
  };

  if (loading || !activeDivision) {
    return <LoadingState />;
  }

  const selectedTeam = searchParams.get('team');
  
  let matches = data.matches[activeDivision] || [];

  const latestMatchDate = getLatestMatchDate(matches);


  if (selectedTeam) {
    matches = matches.filter(m => m.team1 === selectedTeam || m.team2 === selectedTeam);
  }

  return (
    <div className="space-y-0 relative">
      {/* Meta Banner - Shared with Leaderboard */}
      <div className="meta flex items-center justify-center flex-wrap gap-4 md:gap-7 pt-3 pb-4 md:pt-[var(--header-gap-sm)] md:pb-5 px-0 text-navy-soft">
        <AnimatePresence>
          {showTip && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="meta-tip inline-flex items-center gap-3 py-2 px-3.5 bg-card border border-rule rounded-full text-[11px] shadow-sm"
            >
              <Info size={14} className="text-navy-faint" />
              <span className="mono font-bold uppercase">Tip: <span className="font-medium uppercase">Click team name to filter their matches</span></span>
              <button 
                onClick={handleDismissTip}
                className="ml-1 p-0.5 hover:bg-rule rounded-full transition-colors group"
                aria-label="Dismiss tip"
              >
                <X size={12} className="text-navy-faint group-hover:text-navy" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="meta-asof inline-flex items-center gap-3 text-navy-soft mono text-[11px]">
          <span className="meta-dot w-1.5 h-1.5 bg-yellow rounded-sm" />
          <span>DATA CURRENT THROUGH {latestMatchDate ? formatMatchDate(latestMatchDate) : SEASON_LABEL.toUpperCase()}</span>
          <span className="meta-dot w-1.5 h-1.5 bg-yellow rounded-sm" />
        </div>
      </div>

      <div className="pb-[var(--header-gap-lg)]">
        <div className="space-y-2">
          {/* Active Filter Ribbon - New Design Style */}
          <AnimatePresence mode="wait">
            {selectedTeam && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="overflow-hidden mb-[var(--header-gap-md)]"
              >
                <div 
                  className="w-full py-3 bg-navy text-white flex items-center justify-center gap-6 relative shadow-lg"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-2 bg-yellow" />
                  <span className="mono text-[11px] font-black tracking-[0.3em] flex items-center gap-4">
                    <span className="opacity-40">FILTERED BY</span>
                    <span className="text-yellow">{selectedTeam}</span>
                  </span>
                  <button 
                    onClick={handleClearFilter}
                    className="p-1.5 hover:bg-yellow hover:text-navy transition-all rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Match Group Header Style */}
        <div className="match-group">
           <div className="match-group-head flex items-center gap-4 pb-4">
              <div className="match-group-mark w-2 h-[22px] bg-yellow rounded-sm" />
              <h3 className="match-group-title m-0 font-display text-[14px] font-bold text-navy tracking-[0.1em] uppercase">
                {selectedTeam ? `Matches for ${selectedTeam}` : 'All Match Results'}
              </h3>
              <span className="match-group-count mono text-navy-faint text-[12px]">{matches.length}</span>
              <div className="match-group-rule flex-1 h-px bg-rule" />
           </div>

           <div className="match-grid mt-4">
            {matches.length > 0 ? (
              matches.map((match) => (
                <MatchCard 
                  key={match.id} 
                  match={match} 
                  onTeamClick={handleTeamClick} 
                  onShare={handleShare}
                  isSharing={sharingMatch?.id === match.id && sharingType !== null}
                />
              ))
            ) : (
              <div className="col-span-full py-32 text-center flex flex-col items-center justify-center gap-8 bg-card border border-dashed border-rule-2 rounded-lg">
                <div className="bg-navy/5 p-8 rounded-full">
                  <Info className="w-12 h-12 text-navy opacity-20" />
                </div>
                <div className="space-y-4">
                  <h3 className="font-display font-black text-navy uppercase text-2xl">No matches found</h3>
                  <p className="font-display font-medium text-navy-faint opacity-60 max-w-md mx-auto">
                      {selectedTeam ? `We couldn't find any match records for ${selectedTeam} in this division.` : 'The schedule is being finalized. Check back soon for upcoming fixtures.'}
                  </p>
                </div>
                {selectedTeam && (
                   <button onClick={handleClearFilter} className="btn-secondary px-8 py-3 bg-yellow text-navy font-display font-extrabold rounded-full shadow-md hover:shadow-lg transition-all">
                     RESET ALL FILTERS
                   </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* GLOBAL SHARE PORTAL (Hidden from view) */}
      <div className="absolute left-[-9999px] top-[-9999px] pointer-events-none">
          {sharingMatch && activeCardRef && SHARE_TYPES.map((type) =>
            SHARE_DEVICES.map((device) => (
              <ShareButton
                key={`${type}-${device}`}
                ref={(el) => { shareBtnRefs.current[`${type}-${device}`] = el; }}
                targetRef={activeCardRef}
                portalTarget={activeToastTarget || undefined}
                hidden
                pixelRatio={2}
                imageQuality={0.8}
                preferDownload={device === 'desktop'}
                toastPosition="fixed"
                onShareEnd={handleShareEnd}
                fileName={type === 'wa'
                  ? `Match-WA-${sharingMatch.team1}-vs-${sharingMatch.team2}.jpg`
                  : `Match-${sharingMatch.team1}-vs-${sharingMatch.team2}-${type}.jpg`}
              />
            ))
          )}
      </div>
    </div>
  );
};
