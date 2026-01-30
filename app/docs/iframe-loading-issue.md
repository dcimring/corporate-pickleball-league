# Documentation: Mobile Iframe Loading Stability

## Issue Overview
**Symptoms:** When viewing the application inside an iframe on mobile devices (primarily iOS Safari), returning to a previously opened browser tab sometimes causes the iframe to reload in a "broken" state—displaying raw HTML without CSS styling. A manual page refresh is usually required to fix the layout.

**Root Cause Analysis:** Mobile browsers aggressively suspend inactive tabs. Upon "wake-up," the browser attempts to restore the iframe content. If the `index.html` is fetched from cache but the linked CSS assets (which might be in a different cache bucket or require re-validation) fail to load or race against the render, an unstyled flash or broken state occurs.

---

## Attempts & Fixes

### 1. Initial Cache-Control (Aggressive)
- **Change:** Added `Cache-Control: no-cache, no-store, must-revalidate` to `vercel.json` for `index.html`.
- **Goal:** Prevent "stale content" where users saw old versions of the site after returning.
- **Outcome:** Resolved the stale content issue, but potentially exacerbated the "unstyled" issue because `no-store` forced the browser to discard the HTML entirely upon suspension, making wake-up dependent on immediate network availability for *everything*.

### 2. Relaxed Cache-Control
- **Change:** Updated `vercel.json` to `Cache-Control: no-cache`.
- **Goal:** Allow the browser to store the file locally (disk/memory) but force a validation check (304) with the server.
- **Rationale:** This allows for a "fast restore" from local memory if the network hasn't changed, while still ensuring the latest code is used.

### 3. Explicit Base URL
- **Change:** Added `<base href="/" />` to the `<head>` of `app/index.html`.
- **Goal:** Ensure all relative paths (CSS, JS, assets) are resolved correctly from the root, regardless of the iframe's internal history state or tab restoration context.

### 4. Single CSS Chunking
- **Change:** Modified `app/vite.config.ts` to set `build.cssCodeSplit: false`.
- **Goal:** Force Vite to bundle all CSS into a single file instead of multiple small chunks.
- **Rationale:** Reduces the number of network requests required for a "styled" render. If the browser only has to fetch (or validate) one CSS file instead of three or four, the chance of a "partial failure" (HTML loads, some CSS fails) is significantly reduced.

---

## Status
**Last Updated:** Friday, January 23, 2026
**Current Monitoring:** Observing if the combination of `no-cache` (validation-only) and `single-chunk CSS` provides enough stability for mobile Safari tab-restoration.
