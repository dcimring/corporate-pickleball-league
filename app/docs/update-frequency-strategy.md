# Application Update Frequency Strategy

This document outlines the strategy for ensuring users always have the latest version of the application code, even if they keep the browser tab open for extended periods.

## Current Behavior
- Code updates are handled by a Service Worker (PWA).
- Checks currently only occur on initial load or browser-triggered background events.
- There is no scheduled "heartbeat" to check for new code while the app is active.

## Planned Strategy: Dual-Mode Heartbeat
To proactively notify users of new versions, we are implementing a scheduled background check that adapts to its environment (Standalone vs. Iframe).

### 1. Mode Shift: 'autoUpdate' to 'prompt'
- **File**: `app/vite.config.ts`
- **Change**: Set `registerType: 'prompt'`.
- **Reason**: This allows the `UpdateBanner` component to intercept the update signal and display a user-friendly notification.

### 2. Implementation of the Heartbeat
- **File**: `app/src/components/UpdateBanner.tsx`
- **Standalone Mode**: Uses the Service Worker's `update()` method (Most efficient).
- **Iframe Fallback Mode**: 
    - Service Workers are often blocked in cross-origin iframes.
    - The app generates a `public/version.json` file on every build (configured in `package.json`).
    - The heartbeat polls this JSON file every 10 minutes and compares the build timestamp.
    - If a mismatch is detected, the banner is shown.

### 3. User Experience
- When an update is found, the `UpdateBanner` slides down from the top of the screen.
- Clicking the banner triggers a swap (Standalone) or a hard reload (Iframe).
- This ensures users are aware of improvements and fixes without interrupting their current session.

## Configuration Details
- **Interval**: 10 Minutes (600,000ms)
- **Primary Signal**: Service Worker `update()`
- **Fallback Signal**: `version.json` fetch with cache-busting timestamp.
