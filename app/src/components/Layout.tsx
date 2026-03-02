import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLeagueData } from '../context/LeagueContext';
import { ConnectionError } from './ConnectionError';

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
    <div id="app-container" className="font-body selection:bg-brand-yellow selection:text-brand-blue bg-transparent pt-4 inline-block w-full relative">
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
    </div>
  );
};
