# Version Update Strategy

This document outlines the plan for detecting and handling newer versions of the Corporate Pickleball League web application without relying on complex Service Workers.

## Core Mechanism: Build-ID Comparison

The strategy uses a "Manifest" check pattern:
1.  **Build ID Generation:** Generate a unique timestamp-based ID during the build process.
2.  **Code Injection:** Inject this ID into the application bundle via Vite's `define` feature.
3.  **Remote Manifest:** Save the same ID into a static `version.json` file in the `public` directory.
4.  **Verification Loop:** The client periodically fetches `version.json` and compares it to its internal ID.

## Implementation Details (Internal Strategy)

### 1. Build Process Integration
Modify `package.json` to generate the `version.json` file automatically after the build completes.
```bash
"build": "vite build && echo '{\"version\": \"'$(date +%s)'\"}' > dist/version.json"
```

### 2. Vite Configuration
Expose the version to the React app:
```typescript
define: {
  __APP_VERSION__: JSON.stringify(Date.now()),
}
```

### 3. Detection Logic
Add a `checkVersion` function to `LeagueContext.tsx` that runs during the existing 60-second background refresh.

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
