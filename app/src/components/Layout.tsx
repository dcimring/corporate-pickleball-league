import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  // RESIZER LOGIC
  useEffect(() => {
    function notifyParentOfHeight() {
        setTimeout(() => {
            const height = document.documentElement.scrollHeight;
            window.parent.postMessage({ 'height': height }, '*');
        }, 100);
    }

    // Call on mount and route change
    notifyParentOfHeight();

    // Call on resize
    window.addEventListener('resize', notifyParentOfHeight);
    
    // Call on DOM changes (e.g. expanding dropdowns)
    const observer = new ResizeObserver(notifyParentOfHeight);
    observer.observe(document.body);

    return () => {
        window.removeEventListener('resize', notifyParentOfHeight);
        observer.disconnect();
    };
  }, [location.pathname]); // Re-run on route change

  return (
    <div className="min-h-screen font-body selection:bg-brand-yellow selection:text-brand-blue bg-transparent pt-4">
      {/* Main Content - No padding, full width */}
      <main className="w-full">
        {children}
      </main>
    </div>
  );
};
