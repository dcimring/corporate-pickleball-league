import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { LeaderboardTable } from '../components/LeaderboardTable';
import { ShareButton } from '../components/ShareButton';
import { ShareToast } from '../components/ShareToast';
import { ShareStage } from '../components/share/ShareStage';
import { LeaderboardShareCard } from '../components/share/LeaderboardShareCard';
import { LoadingState } from '../components/LoadingState';
import { useLeagueData } from '../hooks/useLeagueData';
import { useActiveDivision } from '../hooks/useActiveDivision';
import { useShareCard } from '../hooks/useShareCard';
import { getLatestMatchDate } from '../lib/format';
import { SEASON_LABEL } from '../lib/config';
import { slugify } from '../lib/share';

export const Leaderboard: React.FC = () => {
  const navigate = useNavigate();
  const { data, loading } = useLeagueData();
  const { activeDivision } = useActiveDivision();
  const shareCardRef = useRef<HTMLDivElement>(null);
  const shareCardInView = useInView(shareCardRef, { once: true, amount: 0.1 });
  const [shareCardAnimated, setShareCardAnimated] = useState(false);
  const toastPortalRef = useRef<HTMLDivElement>(null);

  // One share per division: the payload is the division name.
  const { pending: sharePending, mountStage, request: requestShare, busy: shareBusy, mode: shareMode, toast: shareToast, toastTarget: shareToastTarget, dismissToast } = useShareCard<string>({
    fileName: (division) => `pickleball-standings-${slugify(division)}.jpg`,
    shareText: (division) => `${division} standings — Corporate Pickleball League 🥒🏆`,
  });

  useEffect(() => {
    if (shareCardInView) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShareCardAnimated(true);
      return;
    }
    const fallback = setTimeout(() => setShareCardAnimated(true), 300);
    return () => clearTimeout(fallback);
  }, [shareCardInView]);

  const handleTeamClick = (teamName: string) => {
    if (activeDivision) {
        navigate(`/matches?division=${encodeURIComponent(activeDivision)}&team=${encodeURIComponent(teamName)}`);
    }
  };

  if (loading || !activeDivision) {
    return <LoadingState />;
  }

  const stats = data.leaderboard[activeDivision] || [];
  const season = data.season || SEASON_LABEL;

  const latestMatchDate = getLatestMatchDate(data.matches[activeDivision] || []);

  return (
    <div className="space-y-0 relative">
      {/* Portal target for Share Toasts */}
      <div ref={toastPortalRef} className="fixed bottom-0 left-0 right-0 z-[300] pointer-events-none flex justify-center pb-6" />

      <div className="pb-0">
        <LeaderboardTable stats={stats} matches={data.matches[activeDivision] || []} onTeamClick={handleTeamClick} />

        {/* Share Section */}
        {stats.length > 0 && (
          <div className="flex items-center justify-center mt-5 md:mt-7 border-t border-rule-2">
            <motion.div
              ref={shareCardRef}
              initial={{ y: 20, opacity: 0 }}
              animate={shareCardAnimated ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="w-full relative overflow-hidden px-4 md:px-12 pt-5 md:pt-7 pb-0 text-center space-y-7"
            >
              <div className="space-y-3 max-w-2xl mx-auto">
                <p className="mono text-yellow-deep font-black tracking-[0.2em] text-[12px]">
                  SOCIAL CARD
                </p>
                <h4 className="font-display font-black text-[clamp(32px,4vw,48px)] text-navy uppercase leading-none tracking-tight">
                  SHARE THE GLORY
                </h4>
                <p className="font-display font-medium text-navy-faint text-[16px] max-w-lg mx-auto leading-relaxed">
                  {shareMode === 'share'
                    ? `Share the ${activeDivision} standings straight to Instagram, WhatsApp or Facebook.`
                    : `Download the ${activeDivision} standings as an image for Instagram, WhatsApp or Facebook.`}
                </p>
              </div>

              <div className="flex flex-col items-center justify-center gap-3">
                <ShareButton
                  onClick={() => requestShare(activeDivision, toastPortalRef.current)}
                  mode={shareMode}
                  busy={shareBusy}
                  labels={{ share: 'Share standings', download: 'Download standings' }}
                  className="w-full md:w-auto md:min-w-64"
                />
                <p className="mono text-[10px] opacity-40">PORTRAIT 4:5 · 1080 × 1350</p>
              </div>
            </motion.div>
          </div>
        )}
      </div>

      {sharePending && (
        <ShareStage ref={mountStage}>
          <LeaderboardShareCard
            division={sharePending}
            entries={data.leaderboard[sharePending] || []}
            season={season}
            asOf={latestMatchDate}
          />
        </ShareStage>
      )}
      <ShareToast state={shareToast} onClose={dismissToast} portalTarget={shareToastTarget} />
    </div>
  );
};
