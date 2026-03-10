import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

console.log('App Build ID:', __BUILD_ID__);

// Emergency Service Worker Reset / Cache Busting
// If we suspect a "poisoned" worker, we can force an unregister here.
// This runs before the PWA-register logic.
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      // If we see an old registration that might be poisoned, we could unregister it.
      // For now, let's log the active workers for debugging.
      console.log('Active Service Worker:', registration.active?.scriptURL);
    }
  });
}

// Handle Safari Back-Forward Cache (bfcache)
// If the page is restored from memory, trigger a hard reload to pick up the latest state
window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    window.location.reload();
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
