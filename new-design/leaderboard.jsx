// Improved Leaderboard view.
// Same data as the source page — preserved exactly. Adds:
//   • A featured "Top of the table" hero strip for rank #1
//   • Inline W/L proportion bars, win% rings, and points-margin bars
//   • Sortable header row (visual only — current sort is by rank)
//   • A subtle court-line decorative motif

const { useMemo: useLBMemo } = React;

function Pip({ filled }) {
  return <span className={`pip ${filled ? "pip-on" : ""}`} />;
}

// Win/Loss proportion bar — yellow for wins, faint navy for losses.
function WLBar({ w, l }) {
  const total = w + l;
  const pct = total ? (w / total) * 100 : 0;
  return (
    <div className="wlbar" title={`${w} wins, ${l} losses`}>
      <div className="wlbar-track">
        <div className="wlbar-w" style={{ width: `${pct}%` }} />
      </div>
      <div className="wlbar-labels mono">
        <span className="wlbar-w-label">{w}<span className="dim">w</span></span>
        <span className="wlbar-l-label">{l}<span className="dim">l</span></span>
      </div>
    </div>
  );
}

// Win % ring — thin circular progress (yellow on near-transparent navy).
function WinRing({ pct, size = 46, stroke = 5 }) {
  const r = (size - stroke) / 2;
  const C = 2 * Math.PI * r;
  const dash = (pct / 100) * C;
  return (
    <div className="ring" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--rule-2)" strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--yellow)"
                strokeWidth={stroke} strokeLinecap="round"
                strokeDasharray={`${dash} ${C}`}
                transform={`rotate(-90 ${size/2} ${size/2})`} />
      </svg>
      <span className="ring-label">
        <strong>{pct}</strong><span className="ring-pct">%</span>
      </span>
    </div>
  );
}

// Points for/against — center-anchored bar showing diff magnitude relative
// to the largest |diff| in the division.
function DiffBar({ pf, pa, diff, max }) {
  const pct = max > 0 ? Math.min(100, Math.abs(diff) / max * 100) : 0;
  const positive = diff >= 0;
  return (
    <div className="diffbar">
      <div className="diffbar-track">
        <div className="diffbar-mid" />
        <div
          className={`diffbar-fill ${positive ? "pos" : "neg"}`}
          style={{
            width: `${pct / 2}%`,
            left: positive ? "50%" : `${50 - pct/2}%`,
          }}
        />
      </div>
      <div className="diffbar-labels mono">
        <span>{pf}</span>
        <span className="dim">/</span>
        <span>{pa}</span>
      </div>
    </div>
  );
}

function TableHeader({ sort, dir, onSort, showViz }) {
  const head = (key, label, cls = "") => (
    <button
      className={`th ${cls} ${sort === key ? "th-active" : ""}`}
      onClick={() => onSort(key)}
    >
      <span className="th-label mono">{label}</span>
      {sort === key && (
        <span className="th-arrow">{dir === "asc" ? "↑" : "↓"}</span>
      )}
    </button>
  );
  return (
    <div className={`lb-row lb-head ${showViz ? "with-viz" : "no-viz"}`}>
      {head("rank", "Rank", "col-rank")}
      {head("team", "Team", "col-team")}
      {head("wl", "W — L", "col-wl")}
      {head("winPct", "Win %", "col-pct")}
      {head("pts", "Pts for / against", "col-pts")}
      {head("diff", "Diff", "col-diff")}
    </div>
  );
}

function LeaderboardRow({ row, max, featured, showViz }) {
  const positive = row.diff >= 0;
  return (
    <div className={`lb-row lb-data ${featured ? "lb-featured" : ""} ${showViz ? "with-viz" : "no-viz"}`}
         data-screen-label={`row-${row.rank}`}>
      {featured && <span className="lb-accent" />}

      <div className="col-rank">
        <span className="rank-num">{String(row.rank).padStart(2, "0")}</span>
        {featured && <CrownIcon size={18} />}
      </div>

      <div className="col-team">
        <a className="team-name" href="#">{row.team}</a>
        {featured && (
          <span className="lb-pill mono">Top of the table</span>
        )}
      </div>

      <div className="col-wl">
        {showViz ? (
          <WLBar w={row.w} l={row.l} />
        ) : (
          <span className="num-pair mono">
            <strong>{row.w}</strong><span className="dim"> — {row.l}</span>
          </span>
        )}
      </div>

      <div className="col-pct">
        {showViz ? (
          <WinRing pct={row.winPct} />
        ) : (
          <span className="num-pair mono"><strong>{row.winPct}</strong><span className="dim">%</span></span>
        )}
      </div>

      <div className="col-pts">
        {showViz ? (
          <DiffBar pf={row.pf} pa={row.pa} diff={row.diff} max={max} />
        ) : (
          <span className="num-pair mono">
            <strong>{row.pf}</strong><span className="dim"> / {row.pa}</span>
          </span>
        )}
      </div>

      <div className="col-diff">
        <span className={`diff-chip mono ${positive ? "diff-pos" : "diff-neg"}`}>
          {positive ? <ArrowUp /> : <ArrowDown />}
          {positive ? "+" : ""}{row.diff}
        </span>
      </div>
    </div>
  );
}

function Leaderboard({ data, division, showViz }) {
  const rows = data.standings[division] || [];
  const maxDiff = useLBMemo(
    () => rows.reduce((m, r) => Math.max(m, Math.abs(r.diff)), 1),
    [rows]
  );
  const [sort, setSort] = React.useState({ key: "rank", dir: "asc" });
  const sorted = useLBMemo(() => {
    const arr = [...rows];
    const k = sort.key;
    const dirMul = sort.dir === "asc" ? 1 : -1;
    arr.sort((a, b) => {
      const av = k === "wl" ? a.w : k === "pts" ? a.pf : a[k] ?? 0;
      const bv = k === "wl" ? b.w : k === "pts" ? b.pf : b[k] ?? 0;
      if (typeof av === "string") return av.localeCompare(bv) * dirMul;
      return (av - bv) * dirMul;
    });
    return arr;
  }, [rows, sort]);

  function handleSort(key) {
    setSort((s) => s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: key === "team" ? "asc" : "desc" });
  }

  if (rows.length === 0) {
    return (
      <div className="empty-state">
        <p className="mono">No standings yet for {division}.</p>
        <p className="empty-sub mono">Check back after week 1.</p>
      </div>
    );
  }

  return (
    <section className="leaderboard" data-screen-label="leaderboard">
      <TableHeader sort={sort.key} dir={sort.dir} onSort={handleSort} showViz={showViz} />
      <div className="lb-body">
        {sorted.map((r) => (
          <LeaderboardRow
            key={r.team}
            row={r}
            max={maxDiff}
            featured={r.rank === 1 && sort.key === "rank" && sort.dir === "asc"}
            showViz={showViz}
          />
        ))}
      </div>

      <footer className="lb-foot">
        <span className="mono">{rows.length} teams · {division}</span>
        <span className="mono">Sorted by {sort.key} ({sort.dir})</span>
      </footer>
    </section>
  );
}

window.Leaderboard = Leaderboard;
