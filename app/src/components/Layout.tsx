import React, { useEffect, useMemo } from 'react';
import { useLocation, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useLeagueData } from '../context/LeagueContext';
import { ConnectionError } from './ConnectionError';
import { UpdateBanner } from './UpdateBanner';
import { motion } from 'framer-motion';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { error, refresh, loading, data } = useLeagueData();

  const divisions = useMemo(() => {
    if (loading || !data.leaderboard) return [];
    return Object.keys(data.leaderboard);
  }, [loading, data.leaderboard]);

  const activeDivision = useMemo(() => {
    if (loading || divisions.length === 0) return '';
    const paramDiv = searchParams.get('division');
    if (paramDiv && divisions.includes(paramDiv)) return paramDiv;
    
    // Default to Cayman Premier League or first available
    return divisions.includes('Cayman Premier League') ? 'Cayman Premier League' : divisions[0] || '';
  }, [loading, divisions, searchParams]);

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
    { name: 'Leaderboard', path: '/leaderboard' },
    { name: 'Matches', path: '/matches' },
  ];

  // RESIZER LOGIC
  useEffect(() => {
    const sendHeight = () => {
      const appContainer = document.getElementById('app-container');
      if (appContainer) {
        const height = appContainer.offsetHeight;
        window.parent.postMessage({ 'height': height + 20 }, '*');
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
  }, [location.pathname, error, loading]);

  return (
    <div id="app-container" className="app min-h-screen flex flex-col">
      <UpdateBanner />

      {/* Top Bar - New Design */}
      <header className="topbar grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-4 py-4 px-6 md:px-[clamp(20px,4vw,56px)]">
        <div className="topbar-side flex items-center">
          <div className="brand inline-flex items-center gap-3 py-1.5 px-3 rounded-full">
            <span className="brand-name mono text-[11px] text-navy-soft">Corporate Pickleball League</span>
          </div>
        </div>

        <div className="topbar-tabs inline-flex gap-1.5 bg-card border border-rule rounded-full p-1.5 shadow-[0_8px_24px_-16px_rgba(20,58,120,0.25)] justify-center">
          {pageTabs.map((tab) => {
            const isActive = activePage === tab.path;
            return (
              <button
                key={tab.path}
                onClick={() => handlePageChange(tab.path)}
                className={`tab px-7 py-2.5 font-display font-extrabold text-[13px] tracking-[0.14em] uppercase rounded-full transition-all duration-140 ${
                  isActive 
                    ? 'tab-active bg-yellow text-navy shadow-[0_4px_14px_-6px_rgba(255,201,60,0.6)]' 
                    : 'text-navy-faint hover:text-navy'
                }`}
              >
                {tab.name}
              </button>
            );
          })}
        </div>

        <div className="topbar-side topbar-right flex items-center justify-end">
          {/* Theme icons could go here */}
        </div>
      </header>

      <main className="main flex-1 w-full max-w-[1480px] mx-auto px-5 md:px-[clamp(20px,4vw,56px)] pb-14">
        {error ? (
          <ConnectionError onRetry={refresh} isRetrying={loading} />
        ) : (
          <>
            {!loading && activeDivision && (
              <div className="page-head pt-3.5">
                <div className="page-head-row flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4.5">
                  <h1 className="page-title font-display font-black text-[clamp(40px,5.4vw,68px)] leading-[0.95] tracking-[-0.02em] uppercase text-navy relative after:content-[''] after:block after:w-14 after:h-1.5 after:bg-yellow after:mt-3.5 after:rounded-sm">
                    {activePage === '/leaderboard' ? 'Leaderboard' : 'Matches'}
                  </h1>
                  <span className="page-season mono text-navy-faint pb-2">Summer 2026</span>
                </div>
                
                <div className="div-tabs relative border-b border-rule">
                  <div className="div-tabs-inner flex gap-0 overflow-x-auto no-scrollbar">
                    {divisions.map((div) => {
                      const isActive = activeDivision === div;
                      return (
                        <button
                          key={div}
                          onClick={() => handleDivisionChange(div)}
                          className={`div-tab relative px-5.5 pt-3.5 pb-4 transition-colors flex-shrink-0 ${
                            isActive ? 'div-tab-active text-navy' : 'text-navy-faint hover:text-navy-soft'
                          }`}
                        >
                          <span className={`div-tab-label mono text-[12px] ${isActive ? 'font-bold' : ''}`}>
                            {div}
                          </span>
                          {isActive && (
                            <motion.div 
                              layoutId="dt-underline" 
                              className="div-tab-underline absolute left-3 right-3 bottom-[-1px] h-[3px] bg-yellow rounded-t-sm" 
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
            <div className="mt-6">
              {children}
            </div>
          </>
        )}
      </main>

      <footer className="page-foot flex flex-col md:flex-row items-center justify-between gap-4 py-6 md:py-8 px-5 md:px-[clamp(20px,4vw,56px)] max-w-[1480px] mx-auto w-full text-navy-faint text-[11px]">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="mono font-bold tracking-[0.2em] flex items-center gap-1.5">
            Built with ❤️ in Cayman by <a href="https://danielcimring.com" target="_blank" rel="noopener noreferrer" className="text-navy-soft hover:text-yellow transition-colors underline decoration-yellow/30 underline-offset-4 decoration-2">Daniel Cimring</a>
          </div>
        </div>
        <p className="mono uppercase tracking-widest opacity-40">
          Build: {new Date(__BUILD_TIME__).toLocaleString('en-US', { timeZone: 'America/Cayman', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).replace(/, /g, '.').replace(/[/:]/g, '.')}
        </p>
      </footer>
    </div>
  );
};
