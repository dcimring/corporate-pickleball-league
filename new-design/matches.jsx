// Improved Matches view.
// Same data as the source — preserves every team name, game count,
// point total, and winner indicator. Adds:
//   • Date-grouped sections (one date in the source: 06 May 26)
//   • Win badge + point-margin bar on each card
//   • Clearer score layout (game wins vs point totals split visually)

function MatchTeamRow({ team, opponent }) {
  const win = team.win;
  return (
    <div className={`mt-row ${win ? "mt-row-win" : "mt-row-lose"}`}>
      <div className="mt-name-wrap">
        <span className={`mt-dot ${win ? "on" : ""}`} />
        <span className="mt-name">{team.team}</span>
      </div>
      <div className="mt-score">
        <span className="mt-games">{team.games}</span>
      </div>
    </div>
  );
}

function MarginBar({ aPts, bPts, aWin, bWin }) {
  // Visualizes the split of total points between the two teams.
  // Winner side renders in yellow; the other in faint navy.
  const total = aPts + bPts || 1;
  const aPct = (aPts / total) * 100;
  const aColor = aWin ? "var(--yellow)" : "var(--rule-2)";
  const bColor = bWin ? "var(--yellow)" : "var(--rule-2)";
  return (
    <div className="margin-bar" aria-hidden="true">
      <div style={{ width: `${aPct}%`, background: aColor }} />
      <div style={{ width: `${100 - aPct}%`, background: bColor }} />
    </div>
  );
}

function MatchCard({ match }) {
  const { a, b, date } = match;
  const totalGames = a.games + b.games;
  const margin = Math.abs(a.pts - b.pts);
  return (
    <article className="match-card" data-screen-label={`match-${a.team}-vs-${b.team}`}>
      <header className="match-head">
        <span className="match-date mono">{date}</span>
        <div className="match-head-right">
          <span className={`match-pts mono ${a.win ? "lead-a" : ""} ${b.win ? "lead-b" : ""}`}>
            <strong className={a.win ? "on" : ""}>{a.pts}</strong>
            <span className="dim"> / </span>
            <strong className={b.win ? "on" : ""}>{b.pts}</strong>
            <span className="dim"> pts</span>
          </span>
          <button className="match-share" aria-label="Share match">
            <ShareIcon size={13} color="var(--navy-faint)" />
          </button>
        </div>
      </header>

      <div className="match-body">
        <MatchTeamRow team={a} opponent={b} />
        <MatchTeamRow team={b} opponent={a} />
      </div>

      <footer className="match-foot">
        <MarginBar aPts={a.pts} bPts={b.pts} aWin={!!a.win} bWin={!!b.win} />
        <div className="match-foot-meta">
          <span className="mono">{totalGames} games</span>
          <span className="match-foot-sep">·</span>
          <span className="mono">
            <strong className={margin === 0 ? "" : (a.pts > b.pts ? "on-a" : "on-b")}>
              {margin === 0 ? "Tied on pts" : `+${margin} pt ${margin === 1 ? "" : "s"} ${a.pts > b.pts ? a.team : b.team}`}
            </strong>
          </span>
        </div>
      </footer>
    </article>
  );
}

function MatchGroup({ date, matches }) {
  return (
    <section className="match-group" data-screen-label={`group-${date}`}>
      <header className="match-group-head">
        <span className="match-group-mark" />
        <h2 className="match-group-title mono">{date}</h2>
        <span className="match-group-count mono">{matches.length} matches</span>
        <div className="match-group-rule" />
      </header>
      <div className="match-grid">
        {matches.map((m, i) => (
          <MatchCard key={`${m.a.team}-${m.b.team}-${i}`} match={m} />
        ))}
      </div>
    </section>
  );
}

function Matches({ data, division }) {
  const list = data.matches[division] || [];
  // Group by date.
  const groups = React.useMemo(() => {
    const map = new Map();
    for (const m of list) {
      const key = m.date;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(m);
    }
    return Array.from(map.entries()).map(([date, ms]) => ({ date, matches: ms }));
  }, [list]);

  if (list.length === 0) {
    return (
      <div className="empty-state">
        <p className="mono">No matches recorded yet for {division}.</p>
        <p className="empty-sub mono">First serve is around the corner.</p>
      </div>
    );
  }

  return (
    <section className="matches" data-screen-label="matches">
      {groups.map((g) => (
        <MatchGroup key={g.date} date={g.date} matches={g.matches} />
      ))}
    </section>
  );
}

window.Matches = Matches;
