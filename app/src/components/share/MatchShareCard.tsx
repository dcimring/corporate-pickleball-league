import React from 'react';
import type { Match } from '../../types';
import { formatMatchDateLong } from '../../lib/format';
import { ShareCard, MONO, NAVY, YELLOW, WHITE, TILE } from './ShareCard';

interface MatchShareCardProps {
  match: Match;
  division: string;
  season: string;
}

const LONG_NAME_CHARS = 18;

const TeamTile: React.FC<{ name: string; games: number; points: number; state: 'win' | 'lose' | 'draw' }> = ({ name, games, points, state }) => {
  const win = state === 'win';
  const ink = win ? NAVY : WHITE;
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 260px',
        alignItems: 'center',
        gap: 24,
        padding: '32px 48px',
        borderRadius: 16,
        background: win ? YELLOW : TILE,
        color: ink,
        opacity: state === 'lose' ? 0.85 : 1,
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontWeight: 900,
            fontSize: name.length > LONG_NAME_CHARS ? 48 : 72,
            lineHeight: 0.95,
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
            overflowWrap: 'anywhere',
          }}
        >
          {name}
        </div>
        <div style={{ fontFamily: MONO, fontWeight: 600, fontSize: 22, lineHeight: 1, letterSpacing: '0.25em', marginTop: 18, opacity: 0.65 }}>
          {points} PTS
        </div>
      </div>
      <div style={{ fontWeight: 900, fontSize: 220, lineHeight: 0.8, letterSpacing: '-0.06em', textAlign: 'right' }}>{games}</div>
    </div>
  );
};

export const MatchShareCard: React.FC<MatchShareCardProps> = ({ match, division, season }) => {
  const winsEqual = match.team1Wins === match.team2Wins;
  const pointsEqual = match.team1Points === match.team2Points;
  const isTie = winsEqual && pointsEqual;
  const win1 = !isTie && (match.team1Wins > match.team2Wins || (winsEqual && match.team1Points > match.team2Points));
  const win2 = !isTie && !win1;
  const total = match.team1Wins + match.team2Wins || 1;
  const winner = win1 ? match.team1 : win2 ? match.team2 : null;

  const barSegment = (share: number, highlight: boolean): React.CSSProperties => ({
    width: `${share * 100}%`,
    height: '100%',
    background: highlight ? YELLOW : 'rgba(255,255,255,0.35)',
  });

  return (
    <ShareCard title={['Match', 'Result']} titleSize={130} division={division} meta={`${formatMatchDateLong(match.date)} · ${season}`}>
      {/* Centred block: tiles, margin bar and winner line share one vertical budget so nothing can push into the footer. */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', marginTop: 24, minHeight: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <TeamTile name={match.team1} games={match.team1Wins} points={match.team1Points} state={win1 ? 'win' : isTie ? 'draw' : 'lose'} />
          <TeamTile name={match.team2} games={match.team2Wins} points={match.team2Points} state={win2 ? 'win' : isTie ? 'draw' : 'lose'} />
        </div>

        <div style={{ height: 16, borderRadius: 3, overflow: 'hidden', display: 'flex', gap: 4, background: 'rgba(255,255,255,0.15)', margin: '36px 0 22px' }}>
          <div style={barSegment(match.team1Wins / total, win1)} />
          <div style={barSegment(match.team2Wins / total, win2)} />
        </div>

        <div style={{ fontFamily: MONO, fontWeight: 600, fontSize: 20, lineHeight: 1, letterSpacing: '0.25em', textTransform: 'uppercase', opacity: 0.75, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {winner ? (
            <>
              Winner: <span style={{ color: YELLOW }}>{winner}</span>
            </>
          ) : (
            'Draw'
          )}
          {' · '}
          {match.team1Wins + match.team2Wins} games played
        </div>
      </div>
      <div style={{ height: 32 }} />
    </ShareCard>
  );
};
