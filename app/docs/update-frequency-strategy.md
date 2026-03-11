# Application Update Frequency Strategy

This document outlines the strategy for ensuring users always have the latest version of the application code, even if they keep the browser tab open for extended periods.

## Current Behavior
- **Service Workers Removed**: Service workers have been completely removed and replaced with a "Kill Switch" to prevent sticky cache issues.
- **Event-Driven Checks**: Updates are no longer checked on a 10-minute heartbeat. Instead, the app checks for updates at key "natural" moments.

## Update Strategy: Event-Driven Lifecycle
To ensure users are notified of new versions without unnecessary background polling, the `UpdateBanner` uses specific lifecycle triggers.

### 1. Version Source of Truth
- **File**: `public/version.json`
- **Mechanism**: A Vite plugin generates this file on every build, containing a unique `buildId` (timestamp) and `builtAt` ISO string.
- **Cache Busting**: Every fetch to `version.json` appends a unique timestamp (`?t=...`) to bypass browser and CDN caching.

### 2. Triggering the Check
The check is performed in the following scenarios:
- **On Mount (Page Load)**: When the application first initializes in the browser.
- **On Visibility Change (Tab Resume)**: When the user switches back to the browser tab after it has been in the background or the device wakes from sleep.

### 3. Throttling
- **Interval**: 2 Minutes (120,000ms)
- **Reason**: To prevent redundant network requests if a user rapidly toggles between tabs or apps, the check is throttled so it won't fire more than once every 2 minutes.

### 4. User Experience
- **Notification**: When a version mismatch is detected between the running app and the server's `version.json`, the `UpdateBanner` slides down from the top.
- **Action**: Clicking the banner performs a `window.location.reload()`, which, combined with the `Clear-Site-Data: "cache"` header in `vercel.json`, ensures the new version is fetched immediately.

## Configuration Details
- **Primary Signal**: `version.json` fetch.
- **Local Dev**: In development mode, `version.json` is set to `"version": "DEV"` to suppress the update banner.
- **Server Headers**: `vercel.json` is configured to serve `index.html` and `version.json` with `no-cache, no-store, must-revalidate`.
