# Social Share Refactor Plan: Client-Side to Edge Functions

## Goal
Replace the current client-side image generation (using `html-to-image`) with server-side generation using Vercel Edge Functions (`@vercel/og`). This improves performance, consistency, and reliability across devices.

## Strategy

### Step 1: Configuration & Setup
1.  **Install Dependencies:**
    *   `npm install @vercel/og` in `app/`.
2.  **Update `vercel.json`:**
    *   Add a rewrite rule to ensure `/api/(.*)` is NOT redirected to `index.html` (the SPA fallback).
    *   Ensure the `api/` directory is correctly handled by Vercel.

### Step 2: Create the Edge Function (`app/api/og.tsx`)
1.  **Define Endpoint:** `/api/og`
2.  **Handle Parameters:**
    *   `type`: `leaderboard` | `match`
    *   `division`: (for leaderboard)
    *   `id`: (for match)
3.  **Data Fetching:**
    *   Fetch real-time data from Supabase directly within the Edge Function using the standard `fetch` API and Supabase REST API (or lightweight client).
4.  **Layout & Design:**
    *   Recreate the "Roost Kinetic" aesthetic using Satori-compatible React/CSS.
    *   Include "Warm Paper" texture and branded typography.

### Step 3: Frontend Integration (`ShareButton.tsx`)
1.  **Update Logic:**
    *   Remove `html-to-image` and `targetRef` usage.
    *   Construct the API URL based on props (e.g., `/api/og?type=leaderboard&division=Division+A`).
    *   Fetch the generated image as a blob.
    *   Use the existing `navigator.share` or download fallback logic.

### Step 4: Cleanup
1.  **Remove Obsolete Components:**
    *   `app/src/components/ShareableLeaderboard.tsx`
    *   `app/src/components/ShareableMatch.tsx`
2.  **Remove Dependencies:**
    *   `npm uninstall html-to-image`
3.  **Refactor Pages:**
    *   Remove hidden renderers from `Leaderboard.tsx` and `Matches.tsx`.

## Verification
-   Test the `/api/og` endpoint directly in the browser.
-   Test the "Share" button on mobile and desktop.
-   Verify image quality and layout consistency.
