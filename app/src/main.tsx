import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

console.log('App Build ID:', __BUILD_ID__);

// Emergency Service Worker Reset / Kill Switch
// This actively unregisters any Service Worker to prevent "sticky cache" issues
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    if (registrations.length > 0) {
      const promises = registrations.map(registration => {
        console.log('SW Kill Switch: Unregistering worker at', registration.active?.scriptURL);
        return registration.unregister();
      });
      
      Promise.all(promises).then(() => {
        // Also clear all caches for maximum cleanliness
        return window.caches.keys().then((names) => {
          return Promise.all(names.map(name => window.caches.delete(name)));
        });
      }).then(() => {
        console.log('SW Kill Switch: All workers unregistered and caches cleared. Reloading...');
        window.location.reload();
      });
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
