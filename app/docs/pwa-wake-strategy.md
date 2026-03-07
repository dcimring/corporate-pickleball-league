# PWA & Safari Wake Strategy Plan

This document outlines the implementation plan to resolve "zombie version" issues, particularly on iOS Safari, where the app may appear frozen or outdated when resumed from the background or bfcache.

## 1. Dependency Updates
Install `vite-plugin-pwa` as a development dependency.
```bash
cd app
npm install -D vite-plugin-pwa
```

## 2. Vite Configuration (`vite.config.ts`)
Configure the PWA plugin to handle updates aggressively.
- **`registerType: 'autoUpdate'`**: Ensures the new Service Worker takes over immediately without waiting for a manual refresh.
- **`workbox` settings**:
  - `cleanupOutdatedCaches: true`: Removes old caches to free space and prevent conflicts.
  - `clientsClaim: true`: Forces the Service Worker to take control of all open clients immediately.
  - `skipWaiting: true`: Bypasses the waiting period for the new SW to activate.

## 3. Handle Safari "Back-Forward Cache" (bfcache)
Modify `app/src/main.tsx` to detect when the page is restored from Safari's memory cache.
```typescript
window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    // Page was restored from the bfcache (common on iOS Safari)
    // Trigger a reload to ensure the latest Service Worker and state are active
    window.location.reload();
  }
});
```

## 4. Vercel Cache-Control Headers (`vercel.json`)
Ensure the entry point (`index.html`) and the Service Worker (`sw.js`) are never served from a stale server-side cache.
- Set `index.html` to `no-cache`.
- Set `sw.js` (or `service-worker.js`) to `max-age=0, must-revalidate`.

## 5. UI: Update Notification Component
Create a `UpdateBanner` component using `framer-motion` to notify the user if a background update has occurred and a refresh is recommended (optional, if `autoUpdate` is not sufficient or if we want to give the user a choice).

## 6. Manifest Generation
Define a standard PWA manifest (icons, theme colors, display mode) within the `VitePWA` config to ensure the "Add to Home Screen" experience is consistent with the Corporate League branding.

## Next Steps
1. Install `vite-plugin-pwa`.
2. Update `vite.config.ts`.
3. Update `main.tsx`.
4. Update `vercel.json`.
5. Verify behavior on iOS Safari.
