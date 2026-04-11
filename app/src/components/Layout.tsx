import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLeagueData } from '../context/LeagueContext';
import { ConnectionError } from './ConnectionError';
import { UpdateBanner } from './UpdateBanner';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { error, refresh, loading } = useLeagueData();

  // RESIZER LOGIC
  useEffect(() => {
    const sendHeight = () => {
      // Get the height of the root content wrapper, not the document/body which might be stretched
      const appContainer = document.getElementById('app-container');
      if (appContainer) {
        const height = appContainer.offsetHeight;
        // Add a small buffer to prevent scrollbar flickering
        window.parent.postMessage({ 'height': height + 20 }, '*');
      }
    };

    // 1. Initial send
    setTimeout(sendHeight, 100);

    // 2. ResizeObserver detects content size changes
    const observer = new ResizeObserver(sendHeight);
    const appContainer = document.getElementById('app-container');
    if (appContainer) {
      observer.observe(appContainer);
    }

    // 3. Window resize fallback
    window.addEventListener('resize', sendHeight);

    return () => {
        window.removeEventListener('resize', sendHeight);
        observer.disconnect();
    };
  }, [location.pathname, error]); // Add error to dependency array to trigger resize on error screen

  return (
    <div id="app-container" className="selection:bg-secondary-container selection:text-on-secondary-container bg-transparent pt-4 inline-block w-full relative">
      {/* Update Notification Banner */}
      <UpdateBanner />

      {/* Scroll Anchor for iframe navigation - Allows forcing parent scroll via focus */}
      <div 
        id="nav-top-anchor" 
        className="absolute top-0 left-0 w-px h-px opacity-0 pointer-events-none" 
        tabIndex={-1} 
        aria-hidden="true"
      />
      {/* Main Content - No padding, full width */}
      <main className="w-full">
        {error ? (
          <ConnectionError onRetry={refresh} isRetrying={loading} />
        ) : (
          children
        )}
      </main>

      <footer className="mt-8 pb-4 text-center px-4">
        <div className="flex flex-col items-center gap-2">
          <div className="text-[10px] md:text-xs font-stat font-bold uppercase tracking-[0.2em] text-primary/60 flex items-center gap-1.5">
            Leaderboard module built with <span className="normal-case text-sm">❤️</span> in Cayman by <a href="https://danielcimring.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-secondary transition-colors underline decoration-secondary/30 underline-offset-4 decoration-2">Daniel Cimring</a>
          </div>
          <p className="text-[7px] font-mono uppercase text-gray-400 tracking-widest opacity-30 mt-1">
            Build: {new Date(__BUILD_TIME__).toLocaleString('en-US', { timeZone: 'America/Cayman', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).replace(/, /g, '.').replace(/[/:]/g, '.')}
          </p>
        </div>
      </footer>
    </div>
  );
};
