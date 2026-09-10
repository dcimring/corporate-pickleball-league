import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ConvexProvider, ConvexReactClient } from 'convex/react'

console.log('App Build ID:', __BUILD_ID__);

const convexUrl = import.meta.env.VITE_CONVEX_URL;
if (!convexUrl) {
  throw new Error('Missing VITE_CONVEX_URL environment variable');
}
const convex = new ConvexReactClient(convexUrl);

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

// Data is a live Convex subscription (see LeagueContext); the client reconnects
// on its own after Safari back-forward cache restores, so no reload is needed.

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConvexProvider client={convex}>
      <App />
    </ConvexProvider>
  </StrictMode>,
)
