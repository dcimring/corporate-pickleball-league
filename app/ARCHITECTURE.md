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
