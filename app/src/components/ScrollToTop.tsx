import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const ScrollToTop = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    // Smooth scroll internal iframe to top
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });

    // Send signal to parent page to scroll to the top of the iframe embed
    try {
      window.parent.postMessage({ type: 'LRP_SCROLL_TOP' }, '*');
    } catch (e) {
      console.warn('Could not postMessage to parent:', e);
    }
  }, [pathname, search]);

  return null;
};