import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

console.log('App Build ID:', __BUILD_ID__);

// Emergency Service Worker Reset / Kill Switch
// This actively unregisters any Service Worker to prevent "sticky cache" issues
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      registration.unregister();
      console.log('SW Kill Switch: Unregistered worker at', registration.active?.scriptURL);
    }
    // Also clear all caches for maximum cleanliness
    if (registrations.length > 0) {
      window.caches.keys().then((names) => {
        for (const name of names) {
          window.caches.delete(name);
        }
      });
      console.log('SW Kill Switch: All caches cleared.');
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
