import React from 'react';
import { ChevronDown, Info, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { MatchCard } from '../components/MatchCard';
import { LoadingState } from '../components/LoadingState';
import { ShareToast } from '../components/ShareToast';
import { ShareStage } from '../components/share/ShareStage';
import { MatchShareCard } from '../components/share/MatchShareCard';
import { useLeagueData } from '../hooks/useLeagueData';
import { useActiveDivision } from '../hooks/useActiveDivision';
import { useShareCard } from '../hooks/useShareCard';
import { formatMatchDay } from '../lib/format';
import { SEASON_LABEL } from '../lib/config';
import { slugify } from '../lib/share';
import type { Match } from '../types';

export const Matches: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data, loading } = useLeagueData();
  const { activeDivision } = useActiveDivision();
  // One share at a time; the payload is the match being exported.
  const { pending: sharePending, mountStage, request: requestShare, toast: shareToast, toastTarget: shareToastTarget, dismissToast } = useShareCard<Match>({
    fileName: (m) => `pickleball-result-${slugify(m.team1)}-vs-${slugify(m.team2)}-${m.date}.jpg`,
    shareText: (m) => `${m.team1} ${m.team1Wins}–${m.team2Wins} ${m.team2} · ${activeDivision ?? ''} · Corporate Pickleball League 🥒🏆`,
  });

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

  const teams = data.divisions.find((d) => d.name === activeDivision)?.teams ?? [];
  // A `?team=` from an old link or another division is ignored, so the
  // picker, its active styling and the list always agree.
  const teamParam = searchParams.get('team');
  const selectedTeam = teamParam && teams.includes(teamParam) ? teamParam : null;
  const season = data.season || SEASON_LABEL;

  let matches = data.matches[activeDivision] || [];


  if (selectedTeam) {
    matches = matches.filter(m => m.team1 === selectedTeam || m.team2 === selectedTeam);
  }

  // Newest date first (the order league.get returns), one group per date.
  const days: { date: string; matches: Match[] }[] = [];
  for (const match of matches) {
    const last = days[days.length - 1];
    if (last && last.date === match.date) last.matches.push(match);
    else days.push({ date: match.date, matches: [match] });
  }

  const handleTeamSelect = (team: string) => {
    if (team) handleTeamClick(team);
    else handleClearFilter();
  };

  return (
    <div className="relative flex flex-col gap-6 pb-[var(--header-gap-lg)]">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-4">
        <div className="relative w-full md:w-[320px]">
          <label
            htmlFor="team-filter"
            className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none mono text-[11px] font-bold tracking-[0.08em] uppercase text-navy-faint"
          >
            Team
          </label>
          <select
            id="team-filter"
            value={selectedTeam ?? ''}
            onChange={(e) => handleTeamSelect(e.target.value)}
            className={`appearance-none w-full h-[52px] pl-[68px] ${selectedTeam ? 'pr-[88px]' : 'pr-12'} border-[1.5px] border-navy rounded-xl text-navy font-display text-[16px] font-bold truncate cursor-pointer focus-visible:outline-2 focus-visible:outline-yellow focus-visible:outline-offset-2 ${
              selectedTeam ? 'bg-[#fff8e4]' : 'bg-white'
            }`}
          >
            <option value="">All teams</option>
            {teams.map((team) => (
              <option key={team} value={team}>{team}</option>
            ))}
          </select>
          {selectedTeam && (
            <button
              type="button"
              onClick={handleClearFilter}
              aria-label="Show all teams"
              title="Show all teams"
              className="absolute right-10 top-1/2 -translate-y-1/2 w-9 h-9 inline-flex items-center justify-center rounded-lg text-navy hover:bg-navy/10 transition-colors"
            >
              <X className="w-4 h-4" strokeWidth={2.5} />
            </button>
          )}
          <ChevronDown
            aria-hidden="true"
            className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navy pointer-events-none"
            strokeWidth={2.5}
          />
        </div>
        <p className="m-0 mono text-[11px] md:text-[12px] font-semibold text-navy-faint">
          {matches.length} {matches.length === 1 ? 'match' : 'matches'}
          {selectedTeam ? ` for ${selectedTeam}` : ` on ${days.length} ${days.length === 1 ? 'date' : 'dates'}`}
        </p>
      </div>

      {days.length > 0 ? (
        days.map((day) => (
          <section key={day.date} className="flex flex-col gap-2.5 md:gap-3.5">
            <h2 className="m-0 flex items-center gap-2.5 md:gap-3 mono text-[12px] md:text-[13px] font-bold tracking-[0.1em] uppercase text-navy">
              <span>{formatMatchDay(day.date)}</span>
              <span aria-hidden="true" className="flex-1 h-px bg-rule-2" />
              <span className="font-semibold text-navy-faint">
                {day.matches.length} {day.matches.length === 1 ? 'match' : 'matches'}
              </span>
            </h2>
            <div className="match-grid">
              {day.matches.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  onTeamClick={handleTeamClick}
                  onShare={requestShare}
                  isSharing={sharePending?.id === match.id}
                />
              ))}
            </div>
          </section>
        ))
      ) : (
        <div className="py-32 text-center flex flex-col items-center justify-center gap-8 bg-card border border-dashed border-rule-2 rounded-lg">
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
              Show all teams
            </button>
          )}
        </div>
      )}

      {sharePending && (
        <ShareStage ref={mountStage}>
          <MatchShareCard match={sharePending} division={activeDivision} season={season} />
        </ShareStage>
      )}
      <ShareToast state={shareToast} onClose={dismissToast} portalTarget={shareToastTarget} />
    </div>
  );
};
