// App shell: tab routing between Leaderboard / Matches + Tweaks panel.

const { useState: useAppState, useEffect: useAppEffect } = React;
const DATA = window.CPL_DATA;

function App() {
  const [tab, setTab]           = useAppState("leaderboard"); // leaderboard | matches
  const [division, setDivision] = useAppState("CPL");
  const [t, setTweak]           = useTweaks(window.TWEAK_DEFAULTS);

  // Apply theme + density tokens to <html> so CSS variables cascade.
  useAppEffect(() => {
    const html = document.documentElement;
    html.dataset.theme   = t.theme;
    html.dataset.density = t.density;
    html.dataset.viz     = String(t.showViz);
  }, [t.theme, t.density, t.showViz]);

  return (
    <div className="app">
      <TopBar tab={tab} onTab={setTab} />

      <main className="main">
        <div className="page-head">
          <div className="page-head-row">
            <h1 className="page-title">
              {tab === "leaderboard" ? "Standings" : "Match Results"}
            </h1>
            <span className="page-season mono">2026 Spring · Through May 6</span>
          </div>
          <DivisionTabs
            value={division}
            onChange={setDivision}
            divisions={DATA.divisions}
          />
        </div>

        <MetaBanner asOf={DATA.asOf} tip={true} />

        <div className="page-body">
          {tab === "leaderboard"
            ? <Leaderboard data={DATA} division={division} showViz={t.showViz} />
            : <Matches    data={DATA} division={division} />}
        </div>
      </main>

      <footer className="page-foot">
        <span className="mono">/// Corporate Pickleball League</span>
        <span className="mono dim">Internal · Confidential</span>
      </footer>

      <TweaksPanel>
        <TweakSection label="Theme" />
        <TweakRadio
          label="Surface"
          value={t.theme}
          options={["light", "court", "dark"]}
          onChange={(v) => setTweak("theme", v)}
        />
        <TweakSection label="Layout" />
        <TweakRadio
          label="Density"
          value={t.density}
          options={["comfortable", "compact"]}
          onChange={(v) => setTweak("density", v)}
        />
        <TweakToggle
          label="Show data viz"
          value={t.showViz}
          onChange={(v) => setTweak("showViz", v)}
        />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
