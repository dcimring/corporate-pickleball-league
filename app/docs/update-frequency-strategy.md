# Application Update Frequency Strategy

This document outlines the strategy for ensuring users always have the latest version of the application code, even if they keep the browser tab open for extended periods.

## Current Behavior
- Code updates are handled by a Service Worker (PWA).
- Checks currently only occur on initial load or browser-triggered background events.
- There is no scheduled "heartbeat" to check for new code while the app is active.

## Planned Strategy: 10-Minute Heartbeat
To proactively notify users of new versions, we are implementing a scheduled background check.

### 1. Mode Shift: 'autoUpdate' to 'prompt'
- **File**: `app/vite.config.ts`
- **Change**: Set `registerType: 'prompt'`.
- **Reason**: This allows the `UpdateBanner` component to intercept the update signal and display a user-friendly notification rather than force-reloading the page silently.

### 2. Implementation of the Heartbeat
- **File**: `app/src/components/UpdateBanner.tsx`
- **Logic**: 
    - A `setInterval` will run every 10 minutes (600,000ms).
    - It will call the Service Worker's `update()` method.
    - If a new version is detected, the `needRefresh` state is triggered.

### 3. User Experience
- When an update is found, the `UpdateBanner` slides down from the top of the screen.
- The banner remains visible until the user clicks "Refresh" or closes it.
- This ensures users are aware of improvements and fixes without interrupting their current session.

## Configuration Details
- **Interval**: 10 Minutes (600,000ms)
- **Primary Signal**: `update()` call to the browser's Service Worker Registration.
