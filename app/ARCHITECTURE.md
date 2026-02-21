# Corporate Pickleball League - Iframe Architecture

## Embedded Logic
This branch is specifically designed for integration as a WordPress widget. 

### 1. Stripped Layout
- **Removed Header/Footer:** The `Layout.tsx` component no longer renders a site-wide navigation bar or footer.
- **Removed Branding:** No logos or external links are rendered within the application to avoid visual conflict with the parent site.

### 2. Data Flow (Front-Load Pattern)
To ensure instant navigation:
- **`LeagueContext`:** Fetches all data (Divisions, Matches, Teams) once when the app mounts from Supabase.
- **Background Refresh:** Silently re-fetches data every 60 seconds to keep the UI live without spinners.
- **Consumption:** `Leaderboard` and `Matches` pages read directly from this context, rendering immediately.

### 3. Parent-Child Communication (Resizer)
To prevent the "Iframe Scrollbar" issue, the app implements a height-matching protocol:
- **`notifyParentOfHeight`:** A utility within `Layout.tsx` that calculates the height of the `#app-container` and sends a `postMessage` to the parent window.
- **`ResizeObserver`:** Monitors the DOM for changes (like expanding dropdowns or switching tabs) and triggers a height update immediately.
- **Buffer:** Adds a small `20px` buffer to the reported height to prevent sub-pixel rounding errors from triggering scrollbars.

### 4. Navigation & Filtering
Since the primary site navigation is gone, the app uses a nested navigation system:
- **Level 1 (PageTabs):** Switches between the main views (`/leaderboard` and `/matches`).
- **Level 2 (DivisionTabs):** Filters the data by division. On mobile, this transforms into a styled dropdown for better space efficiency.
- **Team Filtering:** Users can click a team name on the Leaderboard or Match Cards to filter the `/matches` view to show only games involving that team. This state is managed via URL search parameters (`?team=Name`).

### 5. Routing
- `/`: Redirects to `/leaderboard`.
- `/leaderboard`: Shows the standings table.
- `/matches`: Shows the match schedule.
- *(Note: Stats and Home pages have been removed to keep the widget focused).*

### 6. Error Handling
- **Connection Timeout:** The initial data fetch has a strict 5-second timeout. If the connection fails or hangs, the `ConnectionError` component replaces the main layout, offering a "Retry" button.
- **Background Persistence:** If a background refresh (polling) fails while valid data is already loaded, the error is suppressed to prevent interrupting the user experience. The app continues to display the stale data until a successful refresh occurs.

### 7. Social Sharing
- **Edge Function Generation:** To ensure performance and consistency across devices, the app uses Vercel Edge Functions (`@vercel/og`) for image generation. Capture logic is moved from the client to the `/api/og` endpoint.
- **Dynamic Data:** The Edge Function fetches real-time data from Supabase directly to generate branded PNGs for leaderboards and match results.
- **Branded Design:** Images are rendered using Satori with the "Roost Kinetic" aesthetic, including custom fonts (Montserrat, Open Sans) and the "Warm Paper" texture, optimized for social media aspect ratios.
- **Native Sharing:** The `ShareButton` constructs a request to the `/api/og` endpoint, fetches the resulting image as a blob, and utilizes the `navigator.share` API to invoke the native mobile sharing sheet. On unsupported platforms, it falls back to a file download.
- **Iframe Permissions:** For this feature to function within an embedded context, the parent `<iframe>` tag **must** include `allow="web-share"`. Without this attribute, the browser blocks the API, and the app defaults to the file download fallback.

## Data Ingestion
- **Source:** CSV files emailed to a specific address.
- **Automation:** `run_ingest_service.py` or Google Apps Script (`GoogleAppsScript.js`) polls for new emails every 15 mins.
- **Validation:** Scripts validate total game count (must equal 6) before ingestion.
- **Database:** Parsed results are upserted into Supabase.

## Tech Stack
- **Framework**: React 19+
- **Routing**: React Router 7
- **Database**: Supabase
- **Styling**: Tailwind CSS v4 (Roost Kinetic Theme)
- **Animation**: Framer Motion (for tab transitions)
