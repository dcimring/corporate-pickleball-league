import React, { useEffect, useMemo } from 'react';
import { useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import { useLeagueData } from '../context/LeagueContext';
import { ConnectionError } from './ConnectionError';
import { UpdateBanner } from './UpdateBanner';
import { TopFrame } from './TopFrame';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { error, refresh, loading, data } = useLeagueData();
  const [isDivMenuOpen, setIsDivMenuOpen] = React.useState(false);

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

  const shortenDivisionName = (name: string) => {
    if (name.toLowerCase() === 'cayman premier league') return 'CPL';
    return name.toUpperCase().replace('DIVISION ', 'DIV ');
  };

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
      <TopFrame />
      <UpdateBanner />

      {/* Top Bar - New Design */}
      <header className="topbar grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-4 py-4 px-6 md:px-[clamp(20px,4vw,56px)]">
        <div className="topbar-side flex items-center">
          <div className="brand inline-flex items-center gap-3 py-1.5 px-3 rounded-full">
            <span className="brand-name mono text-[11px] text-navy-soft">Corporate Pickleball League</span>
          </div>
        </div>

        <div className="topbar-tabs inline-flex gap-1.5 bg-card border border-rule rounded-full p-2 shadow-[0_8px_24px_-16px_rgba(20,58,120,0.25)] justify-center overflow-hidden">
          {pageTabs.map((tab) => {
            const isActive = activePage === tab.path;
            return (
              <button
                key={tab.path}
                onClick={() => handlePageChange(tab.path)}
                className={`tab px-6 sm:px-7 py-2.5 font-display font-extrabold text-[13px] tracking-[0.14em] uppercase rounded-full transition-all duration-140 ${
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

      <main className="main flex-1 w-full max-w-[1480px] mx-auto pb-4 main-container-padding">
        {error ? (
          <ConnectionError onRetry={refresh} isRetrying={loading} />
        ) : (
          <>
            {!loading && activeDivision && (
              <div className="page-head pt-[var(--header-gap-md)]">
                <div className="page-head-row flex flex-col md:flex-row md:items-end justify-between gap-4 pb-[var(--header-gap-md)]">
                  <h1 className="page-title font-display font-black text-[clamp(40px,5.4vw,68px)] leading-[0.95] tracking-[-0.02em] uppercase text-navy relative after:content-[''] after:block after:w-14 after:h-1.5 after:bg-yellow after:mt-4 after:rounded-sm">
                    {activePage === '/leaderboard' ? 'Standings' : 'Matches'}
                  </h1>
                  <span className="page-season mono text-navy-faint pb-1">Summer 2026</span>
                </div>
                
                <div className="div-tabs relative border-b border-rule">
                  {/* Desktop Tabs */}
                  <div className="hidden md:flex div-tabs-inner gap-0 overflow-x-auto no-scrollbar">
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
                            {shortenDivisionName(div)}
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

                  {/* Mobile Dropdown */}
                  <div className="md:hidden w-full relative">
                    <button 
                      onClick={() => setIsDivMenuOpen(!isDivMenuOpen)}
                      className="w-full flex items-center justify-between px-1 py-4 text-left group"
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="mono text-[10px] text-navy-faint font-bold tracking-widest">Select Division</span>
                        <span className="mono text-[14px] text-navy font-extrabold flex items-center gap-2">
                          {shortenDivisionName(activeDivision)}
                          <span className="w-1.5 h-1.5 bg-yellow rounded-sm" />
                        </span>
                      </div>
                      <div className={`p-2 rounded-full bg-navy/5 transition-transform duration-300 ${isDivMenuOpen ? 'rotate-180' : ''}`}>
                        <ChevronDown size={18} className="text-navy" />
                      </div>
                    </button>

                    <AnimatePresence>
                      {isDivMenuOpen && (
                        <>
                          {/* Backdrop */}
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsDivMenuOpen(false)}
                            className="fixed inset-0 z-[400] bg-navy/20 backdrop-blur-[2px]"
                          />
                          
                          {/* Menu */}
                          <motion.div 
                            initial={{ opacity: 0, y: -10, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.98 }}
                            className="absolute top-full left-0 right-0 z-[500] bg-card border border-rule shadow-2xl rounded-xl mt-1 overflow-hidden"
                          >
                            <div className="p-1.5 flex flex-col gap-1">
                              {divisions.map((div) => {
                                const isActive = activeDivision === div;
                                return (
                                  <button
                                    key={div}
                                    onClick={() => {
                                      handleDivisionChange(div);
                                      setIsDivMenuOpen(false);
                                    }}
                                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-lg transition-all ${
                                      isActive 
                                        ? 'bg-navy text-white shadow-lg' 
                                        : 'text-navy-soft hover:bg-navy/5 active:scale-[0.99]'
                                    }`}
                                  >
                                    <span className={`mono text-[13px] ${isActive ? 'font-bold tracking-wider' : 'font-medium'}`}>
                                      {shortenDivisionName(div)}
                                    </span>
                                    {isActive && <div className="w-1.5 h-1.5 bg-yellow rounded-sm" />}
                                  </button>
                                );
                              })}
                            </div>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
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
          <div className="mono font-bold tracking-[0.2em] flex items-center gap-1.5 uppercase">
            Leaderboard module built with <span className="normal-case text-[14px]">❤️</span> in Cayman by <a href="https://danielcimring.com" target="_blank" rel="noopener noreferrer" className="text-navy-soft hover:text-yellow transition-colors underline decoration-yellow/30 underline-offset-4 decoration-2">Daniel Cimring</a>
          </div>
        </div>
        <p className="mono uppercase tracking-widest opacity-40">
          Build: {new Date(__BUILD_TIME__).toLocaleString('en-US', { timeZone: 'America/Cayman', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).replace(/, /g, '.').replace(/[/:]/g, '.')}
        </p>
      </footer>
    </div>
  );
};
