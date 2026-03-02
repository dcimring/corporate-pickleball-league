import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const ScrollToTop = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    // 1. Smooth scroll internal iframe to top
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });

    // 2. Force parent page scroll adjustment via Focus Anchor
    // Browser will try to bring the focused element into view
    const anchor = document.getElementById('nav-top-anchor');
    if (anchor) {
      anchor.focus({ preventScroll: false }); // We WANT the browser to scroll the parent to see this
    }

    // 3. Keep messaging signal as backup for advanced parent sites
    try {
      window.parent.postMessage({ type: 'LRP_SCROLL_TOP' }, '*');
    } catch (e) {
      console.warn('Could not postMessage to parent:', e);
    }
  }, [pathname, search]);

  return null;
};