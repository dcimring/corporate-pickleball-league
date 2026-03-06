# Iframe Wake Version Strategy

## Goal
When a mobile browser tab wakes up, ensure the **iframe** refreshes to the latest app build without reloading the parent site or showing a jarring UX.

## Core Approach
1. Detect wake/restore events inside the iframe.
2. Fetch `version.json` with cache-busting.
3. Compare with the app’s build ID.
4. If mismatch, reload **only the iframe**.

## Lifecycle Events to Listen For
Use a small handler that runs when the iframe becomes visible again:
- `visibilitychange`: fires when a tab is hidden/visible.
- `pageshow`: fires on bfcache restore (especially iOS Safari).
- `focus`: fires when the tab becomes active.

Only run checks when:
- `document.visibilityState === 'visible'` (for visibilitychange)
- `event.persisted === true` (pageshow)

## Where to Place It (LeagueContext)
You already have a 60-second background refresh in `LeagueContext.tsx`. The version check can be wired in the same module:

### 1) Reuse existing `checkVersion` function
If you already have or plan to add `checkVersion`, use it here too so there’s a single source of truth.

### 2) Add a wake handler alongside the refresh interval
In `LeagueContext.tsx`, inside the effect that manages polling/refresh (the same place you set up the 60s interval), add:

- A `handleWake` function that:
  - waits 300–500ms
  - calls `checkVersion()`
- Event listeners for:
  - `visibilitychange`
  - `pageshow`
  - `focus`
- Cleanup in the effect return.

### 3) Add a reload guard
Inside `checkVersion()` or the wake handler:
- Use `sessionStorage` to prevent repeated reloads during a single session.
- Example key: `version-reloaded` with value of the new build ID.

### 4) Failure handling
If `fetch(version.json)` fails (offline or server error), do nothing and silently exit.

## Example Wake Flow
1. User returns to tab.
2. `visibilitychange` or `pageshow` triggers.
3. Wait 300–500ms.
4. Fetch `version.json?t=${Date.now()}`.
5. If version mismatch and guard not set → `window.location.reload()`.

## Notes
- This reload only affects the iframe document, not the parent site.
- Avoid reload loops by setting a session guard after a reload.
- Keep the delay short to prevent visible flash.
