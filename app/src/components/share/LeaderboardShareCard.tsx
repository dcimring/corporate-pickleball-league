import React from 'react';
import type { LeaderboardEntry } from '../../types';
import { formatMatchDateLong } from '../../lib/format';
import { ShareCard, MONO, NAVY, YELLOW, WHITE, RULE, RULE_SOFT, POSITIVE, NEGATIVE } from './ShareCard';
import { pickRowTier, nameFontSize } from './leaderboardTiers';

interface LeaderboardShareCardProps {
  division: string;
  entries: LeaderboardEntry[];
  season: string;
  /** ISO date of the latest match, shown as "As of …" in the footer. */
  asOf?: string | null;
}

// Column template shared by the header and every row so the leader tile
// (which is padded and filled) stays aligned with the plain rows.
const COLUMNS = '90px 1fr 120px 100px 110px';
const ROW_PADDING = '0 20px';

const formatDiff = (diff: number) => `${diff >= 0 ? '+' : '−'}${Math.abs(diff)}`;

export const LeaderboardShareCard: React.FC<LeaderboardShareCardProps> = ({ division, entries, season, asOf }) => {
  const tier = pickRowTier(entries.length);
  const shown = entries.slice(0, tier.maxRows);
  const hidden = entries.length - shown.length;

  const headerCell: React.CSSProperties = {
    fontFamily: MONO,
    fontWeight: 600,
    fontSize: 17,
    lineHeight: 1,
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    opacity: 0.5,
    whiteSpace: 'nowrap',
  };

  return (
    <ShareCard
      title={['Standings']}
      division={division}
      meta={season}
      footerLines={asOf ? [`As of ${formatMatchDateLong(asOf)}`] : []}
    >
      <div style={{ display: 'grid', gridTemplateColumns: COLUMNS, alignItems: 'center', padding: ROW_PADDING, marginTop: 44, paddingBottom: 18, borderBottom: `2px solid ${RULE}` }}>
        <span style={headerCell}>#</span>
        <span style={headerCell}>Team</span>
        <span style={{ ...headerCell, textAlign: 'right' }}>W–L</span>
        <span style={{ ...headerCell, textAlign: 'right' }}>Win %</span>
        <span style={{ ...headerCell, textAlign: 'right' }}>Diff</span>
      </div>

      {shown.map((entry, idx) => {
        const rank = idx + 1;
        const diff = entry.pointsFor - entry.pointsAgainst;
        const lead = rank === 1;
        const ink = lead ? NAVY : WHITE;
        const diffColor = lead ? NAVY : diff >= 0 ? POSITIVE : NEGATIVE;
        const stat: React.CSSProperties = {
          fontFamily: MONO,
          fontWeight: 700,
          fontSize: tier.statSize,
          lineHeight: 1,
          color: ink,
          textAlign: 'right',
          whiteSpace: 'nowrap',
        };

        return (
          <div
            key={entry.team}
            style={{
              display: 'grid',
              gridTemplateColumns: COLUMNS,
              alignItems: 'center',
              height: tier.rowHeight,
              padding: ROW_PADDING,
              boxSizing: 'border-box',
              background: lead ? YELLOW : 'transparent',
              borderRadius: lead ? 10 : 0,
              borderBottom: lead ? 'none' : `1px solid ${RULE_SOFT}`,
              color: ink,
            }}
          >
            <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: tier.rankSize, lineHeight: 1, color: lead ? NAVY : YELLOW }}>
              {String(rank).padStart(2, '0')}
            </span>
            <span
              style={{
                fontWeight: 800,
                fontSize: nameFontSize(entry.team, tier),
                lineHeight: 1,
                letterSpacing: '0.01em',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                paddingRight: 16,
                minWidth: 0,
              }}
            >
              {entry.team}
            </span>
            <span style={stat}>
              {entry.wins}
              <span style={{ opacity: lead ? 0.6 : 0.45 }}>–{entry.losses}</span>
            </span>
            <span style={stat}>{Math.round(entry.winPct * 100)}%</span>
            <span style={{ ...stat, color: diffColor }}>{formatDiff(diff)}</span>
          </div>
        );
      })}

      {hidden > 0 && (
        <div style={{ fontFamily: MONO, fontWeight: 600, fontSize: 18, letterSpacing: '0.25em', textTransform: 'uppercase', opacity: 0.5, textAlign: 'center', padding: '20px 0 0' }}>
          + {hidden} more {hidden === 1 ? 'team' : 'teams'}
        </div>
      )}
    </ShareCard>
  );
};
