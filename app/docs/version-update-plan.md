# Version Update Strategy

This document outlines the plan for detecting and handling newer versions of the Corporate Pickleball League web application without relying on complex Service Workers.

## Core Mechanism: Build-ID Comparison

The strategy uses a "Manifest" check pattern:
1.  **Build ID Generation:** Generate a unique timestamp-based ID during the build process in `vite.config.ts`.
2.  **Code Injection:** Inject this ID into the application bundle via Vite's `define` feature as `__BUILD_ID__`.
3.  **Remote Manifest:** Save the same ID into a static `version.json` file in the `dist` directory using a Vite plugin.
4.  **Verification Loop:** The `UpdateBanner` component periodically fetches `version.json` and compares it to its internal `__BUILD_ID__`.

## Implementation Details (Internal Strategy)

### 1. Vite Configuration
Expose the version and build time to the React app:
```typescript
define: {
  __BUILD_TIME__: JSON.stringify(buildTime),
  __BUILD_ID__: JSON.stringify(buildId),
}
```

### 2. Version JSON Generation
A custom Vite plugin `generate-version-json` runs on `closeBundle` to create `dist/version.json`.
A placeholder `public/version.json` exists for development mode.

### 3. Detection Logic
The `UpdateBanner.tsx` component handles the logic:
-   **Priority 1:** Uses `vite-plugin-pwa`'s `useRegisterSW` for service worker updates.
-   **Priority 2:** 10-minute heartbeat fetch of `/version.json?t=...` as a fallback for iframes/browsers where SW is blocked.

## Update Handling Options

### Option A: Non-Intrusive Banner (User-Initiated)
Show a "Roost Kinetic" styled toast at the bottom:
> "New version available! [Refresh]"
*   **When to use:** Default choice. It respects user intent and prevents jarring reloads.

### Option B: Seamless Navigation Reload
Set a "pending update" flag when a mismatch is detected. When the user clicks a navigation tab (Matches/Leaderboard), perform a `window.location.reload()` instead of a standard React Router transition.
*   **When to use:** If we want the app to always feel fresh without showing technical "update" messages.

### Option C: Forced Reload
Immediately call `window.location.reload()` the moment a mismatch is detected.
*   **When to use:** Only for critical data-breaking changes where the old UI is incompatible with new Supabase data structures.

## Verification
-   The check should ignore errors (e.g., if the user is offline, don't nag them about versions).
-   Cache-busting must be used for the `version.json` fetch (e.g., `version.json?t=12345`).
