# Social Share Refactor Plan: Client-Side to Edge Functions

## Goal
Replace the current client-side image generation (using `html-to-image`) with server-side generation using Vercel Edge Functions (`@vercel/og`). This improves performance, consistency, and reliability across devices.

## Current Status (Feb 19, 2026)
- **Implementation:** `api/og.tsx` is at `app/api/og.tsx`.
- **Runtime:** Node.js.
- **Configuration:**
  - Added `"type": "module"` to root `package.json`.
  - Updated `vercel.json` rewrites to prevent SPA fallback (HTML) for `/api/` routes.
- **Previous Attempts:**
  - **Resolution 1 (CommonJS):** Failed with `ERR_REQUIRE_ESM`.
  - **Resolution 2 (Root API):** Moving `api` to the repo root failed because Vercel was building from `app/`.
  - **Resolution 3 (App API):** Moved `api` folder into `app/`.
  - **Resolution 4 (Client Error Handling):** Improved `ShareButton` logic.
  - **Resolution 5 (Debugging):** Added extensive server-side logging.
  - **Resolution 6 (Edge Runtime):** Failed with `CompileError: WebAssembly.instantiate(): Wasm code generation disallowed by embedder`.
  - **Resolution 7 (ESM Fix):** Added `"type": "module"` to root `package.json`.
  - **Resolution 8 (SPA Fallback):** `vercel.json` rewrites were allowing API requests to fall back to `index.html` (React app), resulting in "broken images" (HTML content) and no server logs. Fixed with negative lookahead regex.

## Strategy

### Step 1: Setup & Configuration
1.  **Install Dependencies:**
    *   `npm install @vercel/og` (Managed in root `package.json`).
2.  **Configure Vercel Routing:**
    *   Ensure Vercel project settings point to the root or correctly handle the `api/` directory.

### Step 2: Create the Edge Function (`api/og.tsx`)
1.  **File Creation:** `api/og.tsx` (Moved from `app/api/og.tsx`).
2.  **Data Fetching:**
    *   Fetches from Supabase using `fetch` API.
3.  **Image Generation:**
    *   Uses `ImageResponse`.

### Step 3: Frontend Refactor (`ShareButton.tsx`)
1.  **Update Logic:**
    *   Construct the API URL: `/api/og?division=${division}`.
    *   Fetch the image blob.
    *   Share/Download.

### Step 4: Cleanup & Optimization
1.  **Remove Legacy Code:**
    *   `ShareableLeaderboard.tsx` deleted.
    *   `html-to-image` uninstalled.

## Resolution Plan (Next Steps)

If Resolution 2/3 fails (e.g., 404s or build errors):

1.  **Check Vercel Root Directory:** Ensure Vercel is looking at the repo root, not `app/`.
2.  **Standalone Bundle:** Use `ncc` to bundle the function if dependency resolution fails.