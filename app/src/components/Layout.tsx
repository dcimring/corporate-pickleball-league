import React, { useEffect } from 'react';
import { useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import { useLeagueData } from '../hooks/useLeagueData';
import { useActiveDivision } from '../hooks/useActiveDivision';
import { SEASON_LABEL } from '../lib/config';
import { ConnectionError } from './ConnectionError';
import { UpdateBanner } from './UpdateBanner';
import { TopFrame } from './TopFrame';
import { divisionShortLabel, formatMatchDay, getLatestMatchDate } from '../lib/format';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { data, error, refresh, loading } = useLeagueData();
  const { divisions, activeDivision } = useActiveDivision();

  const activePage = location.pathname === '/' ? '/leaderboard' : location.pathname;

  const handleDivisionChange = (div: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('division', div);
    newParams.delete('team');
    setSearchParams(newParams);
  };

  const handlePageChange = (path: string) => {
    if (activeDivision) {
        navigate(`${path}?division=${encodeURIComponent(activeDivision)}`);
    } else {
        navigate(path);
    }
  };

  const pageTabs = [
    { name: 'Standings', path: '/leaderboard' },
    { name: 'Matches', path: '/matches' },
  ];

  const latestMatchDate = activeDivision ? getLatestMatchDate(data.matches[activeDivision] || []) : null;

  const isIframe = React.useMemo(() => {
    try {
      return window.self !== window.top;
    } catch {
      return true;
    }
  }, []);

  // RESIZER LOGIC
  useEffect(() => {
    const sendHeight = () => {
      const appContainer = document.getElementById('app-container');
      if (appContainer) {
        const height = appContainer.offsetHeight;
        // Only post if we're actually in an iframe
        if (isIframe) {
            window.parent.postMessage({ 'height': height + 20 }, '*');
        }
      }
    };

    setTimeout(sendHeight, 100);
    const observer = new ResizeObserver(sendHeight);
    const appContainer = document.getElementById('app-container');
    if (appContainer) {
      observer.observe(appContainer);
    }
    window.addEventListener('resize', sendHeight);
    return () => {
        window.removeEventListener('resize', sendHeight);
        observer.disconnect();
    };
  }, [location.pathname, error, loading, isIframe]);

  return (
    <div 
      id="app-container" 
      className={`app flex flex-col ${!isIframe ? 'min-h-screen' : ''}`}
      data-is-iframe={isIframe ? "true" : "false"}
    >
      {!isIframe && <TopFrame />}
      <UpdateBanner isIframe={isIframe} />

      <header className="topbar w-full max-w-[1180px] mx-auto flex flex-wrap items-center justify-between gap-3 pt-4 pb-1 px-4 md:px-[clamp(20px,4vw,40px)]">
        {!isIframe && (
          <div className="brand flex items-center justify-center gap-2.5 w-full md:w-auto">
            <span aria-hidden="true" className="block w-3 h-3 md:w-3.5 md:h-3.5 bg-yellow rounded-[3px]" />
            <span className="mono text-[11px] md:text-[12px] font-bold tracking-[0.08em] uppercase text-navy">Corporate Pickleball League</span>
          </div>
        )}

        <nav aria-label="Pages" className={`grid grid-cols-2 md:flex gap-1 p-1 border border-rule-2 rounded-full w-full md:w-auto ${isIframe ? 'md:mx-auto' : ''}`}>
          {pageTabs.map((tab) => {
            const isActive = activePage === tab.path;
            return (
              <button
                key={tab.path}
                type="button"
                onClick={() => handlePageChange(tab.path)}
                aria-current={isActive ? 'page' : undefined}
                className={`min-h-11 md:min-h-10 px-5 rounded-full font-display text-[15px] md:text-[14px] transition-colors ${
                  isActive ? 'bg-navy text-white font-extrabold' : 'text-navy font-bold hover:bg-navy/5'
                }`}
              >
                {tab.name}
              </button>
            );
          })}
        </nav>
      </header>

      <main className="main flex-1 w-full max-w-[1180px] mx-auto pb-4 px-4 md:px-[clamp(20px,4vw,40px)]">
        {error ? (
          <ConnectionError onRetry={refresh} isRetrying={loading} />
        ) : (
          <>
            {!loading && activeDivision && (
              <div className="page-head pt-5 md:pt-6 flex flex-col gap-[18px] md:gap-6">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  {!isIframe && (
                    <div className="flex flex-col gap-2 md:gap-2.5">
                      <span className="mono text-[11px] md:text-[12px] font-bold tracking-[0.12em] uppercase text-navy-faint">{data.season || SEASON_LABEL}</span>
                      <h1 className="m-0 font-display font-black text-[40px] md:text-[clamp(44px,6vw,64px)] leading-[0.95] tracking-[-0.02em] uppercase text-navy">
                        {activePage === '/leaderboard' ? 'Standings' : 'Matches'}
                      </h1>
                      <span aria-hidden="true" className="block w-12 md:w-16 h-[5px] md:h-1.5 bg-yellow rounded-sm" />
                    </div>
                  )}
                  {latestMatchDate && (
                    <p className="m-0 mono text-[11px] md:text-[12px] font-semibold text-navy-faint">
                      Results through {formatMatchDay(latestMatchDate)}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <span id="division-label" className="md:hidden mono text-[10px] font-bold tracking-[0.08em] uppercase text-navy-faint">Division</span>
                  <div role="group" aria-labelledby="division-label" className="grid grid-cols-4 gap-2 md:flex md:flex-wrap">
                    {divisions.map((div) => {
                      const isActive = activeDivision === div;
                      return (
                        <button
                          key={div}
                          type="button"
                          onClick={() => handleDivisionChange(div)}
                          aria-pressed={isActive}
                          title={div}
                          className={`min-h-11 px-0 md:px-[18px] rounded-[10px] md:rounded-full border font-display text-[14px] font-extrabold transition-colors ${
                            isActive
                              ? 'bg-navy text-white border-navy'
                              : 'bg-white text-navy border-rule-3 hover:border-navy'
                          }`}
                        >
                          <span className="md:hidden">{divisionShortLabel(div, true)}</span>
                          <span className="hidden md:inline">{divisionShortLabel(div)}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
            <div className="mt-5 md:mt-6">
              {children}
            </div>
          </>
        )}
      </main>

      <footer className="page-foot flex flex-col items-center justify-center gap-2 pt-4 pb-6 md:py-8 px-5 md:px-[clamp(20px,4vw,56px)] max-w-[1180px] mx-auto w-full text-navy-faint text-center">
        <div className="mono font-medium tracking-[0.1em] text-[11px] uppercase">
          Leaderboard module built with <span className="normal-case text-[13px]">❤️</span> in Cayman by <a href="https://danielcimring.com" target="_blank" rel="noopener noreferrer" className="text-navy-soft hover:text-yellow transition-colors underline decoration-yellow/30 underline-offset-4 decoration-2">Daniel Cimring</a>
        </div>
        <p className="mono uppercase tracking-widest text-[10px] opacity-40">
          Build: {new Date(__BUILD_TIME__).toLocaleString('en-US', { timeZone: 'America/Cayman', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).replace(/, /g, '.').replace(/[/:]/g, '.')}
        </p>
      </footer>
    </div>
  );
};
