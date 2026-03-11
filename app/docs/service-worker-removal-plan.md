# Service Worker Removal & Manual Update Plan

This document outlines the strategy for completely removing the Service Worker (PWA) functionality and transitioning the Corporate Pickleball League application to a pure, polling-based update mechanism using `version.json`.

## Goal
To eliminate the "sticky cache" and "poisoned worker" issues (especially in Safari and iframes) by removing the Service Worker layer and relying on a standard HTTP-based build ID check.

---

## Phase 1: Disable the PWA Plugin
*   **Action:** Modify `app/vite.config.ts` to remove the `VitePWA` plugin and its configuration.
*   **Reason:** This stops the build process from generating `sw.js` and `workbox-*.js` files.
*   **Note:** We may choose to keep a simple `manifest.webmanifest` linked manually in `index.html` if "Add to Home Screen" functionality is still desired without the offline/caching features.

## Phase 2: Active Kill Switch (The "Unregister" Script)
Simply removing the files is insufficient, as browsers (notably Safari) will continue to run previously installed workers.
*   **Action:** Add an "Unregistration" script to `app/src/main.tsx`.
*   **Code Implementation:**
    ```javascript
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        for (let registration of registrations) {
          registration.unregister();
          console.log('Service Worker unregistered successfully.');
        }
      });
    }
    ```
*   **Result:** On the next visit, the browser will actively delete the existing Service Worker and its associated caches.

## Phase 3: Refactor UpdateBanner Component
The `UpdateBanner.tsx` currently relies on `vite-plugin-pwa` hooks.
*   **Action:** Remove `useRegisterSW` and all PWA-related logic.
*   **Action:** Simplify the component to be a pure "Manifest Poller."
*   **Logic:**
    1.  On mount, store the injected `__BUILD_ID__` (the version of the code currently running).
    2.  Set a `setInterval` (e.g., every 10 minutes) to fetch `/version.json?t=Date.now()`.
    3.  Compare the fetched `version` with the internal `__BUILD_ID__`.
    4.  If they differ, show the "New Version Available" banner.
*   **Result:** Updates are detected via a standard, easily debuggable network request.

## Phase 4: Server-Side Cache Control (Vercel)
Without a Service Worker to manage the cache, we must ensure the browser doesn't cache the version manifest or the main entry point too aggressively.
*   **Action:** Ensure `app/vercel.json` maintains strict `Cache-Control` headers:
    *   `/version.json`: `no-cache, no-store, must-revalidate` (Always fresh).
    *   `/index.html`: `no-cache, no-store, must-revalidate` (Check server on every refresh).
*   **Result:** Users will always receive the latest `index.html` and version manifest from the server.

---

## Benefits of this Approach
1.  **Iframe Reliability:** Eliminates 3rd-party partitioning issues where Safari blocks SWs in iframes.
2.  **Debugging Transparency:** Every update check is visible as a standard GET request in the Network tab.
3.  **Simplicity:** Removes the complex "Stale-While-Revalidate" and "Prompt-to-Update" logic, replacing it with a predictable file comparison.
