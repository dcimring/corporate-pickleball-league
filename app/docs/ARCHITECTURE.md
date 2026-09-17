# Corporate Pickleball League - Architecture

The app is built to be embedded as an iframe on pickleball.ky (a WordPress site) and also runs standalone. This document covers the frontend structure, the data flow from Convex, and the iframe protocol. Ingestion has its own document (`DOCS_INGESTION.md`) and the visual system is in `design.md`.

## Embedded Logic

### 1. Stripped Layout
- **Outer chrome is conditional:** When embedded, `Layout.tsx` hides the top frame, global branding and page headings so the host site provides that context. Standalone, they render. See `iframe-integration.md` for the detection logic and the full list.
- **No external links or logos** are rendered inside the widget to avoid visual conflict with the parent site.

### 2. Data Flow (Live Subscription)
- **`LeagueProvider`** (`src/context/LeagueContext.tsx`) subscribes once (`useQuery(api.league.get)`) to a single Convex query that returns everything the UI needs — divisions, standings, match lists, upcoming fixtures — computed server-side from the most recent results import.
- **`useLeagueData`** (`src/hooks/useLeagueData.ts`) is how pages and components read it; `useActiveDivision` layers the URL-driven division selection on top.
- **Live Updates:** Convex pushes a new value the moment an import lands; there is no polling and no manual refresh.
- **Shape:** `LeagueData` is defined once in `convex/lib/aggregate.ts` and re-exported from `src/types.ts`, so the query and the UI cannot drift.

### 3. Parent-Child Communication (Resizer)
To prevent the "iframe scrollbar" issue, the app implements a height-matching protocol:
- **`notifyParentOfHeight`:** A utility within `Layout.tsx` that measures `#app-container` and sends a `postMessage` to the parent window.
- **`ResizeObserver`:** Monitors the DOM for changes (expanding dropdowns, switching tabs) and triggers a height update immediately.
- **Buffer:** Adds a `20px` buffer to the reported height so sub-pixel rounding never produces a scrollbar.

### 4. Navigation & Filtering
- **Level 1 (page tabs):** Switches between `/leaderboard` and `/matches`.
- **Level 2 (division tabs):** Filters by division. On mobile this becomes a dropdown.
- **Team filtering:** Clicking a team name on the leaderboard or a match card filters `/matches` to that team's games. The state lives in the URL (`?team=Name`), so it survives reloads and is shareable.

### 5. Routing
- `/`: Redirects to `/leaderboard`.
- `/leaderboard`: Standings table for the active division.
- `/matches`: Results and upcoming fixtures for the active division.

### 6. Error Handling
- **Loading floor:** The loading screen is shown for at least 500ms so the retry state never flickers (deliberate — keep it).
- **Connection timeout:** If no data has arrived 12 seconds after mount, `ConnectionError` replaces the layout with a "Retry" button. Retry clears the error and restarts the window; the Convex client reconnects on its own.
- **Stale data persistence:** Once data has loaded, a dropped connection never interrupts the user: the last value stays on screen and updates resume when the socket reconnects.
- **Server errors:** A query that throws surfaces through `useQuery` during render and is caught by `ErrorBoundary` (`App.tsx`), which shows the same error screen.
- **bfcache:** Restoring from the back/forward cache triggers a background refetch rather than a hard reload.

### 7. Social Sharing
- **Capture from the live DOM:** `ShareButton` takes a `targetRef` to the on-screen leaderboard table or match card and rasterises that node with `modern-screenshot` (`domToBlob`) at 3× pixel ratio. There are no hidden off-screen share components: restyling the leaderboard or match cards changes the exported images too, so re-test exports after visual changes.
- **Formats:** Story (9:16), Post (landscape) and WhatsApp variants differ in dimensions and file name; the leaderboard page renders one button per format.
- **Native sharing:** On mobile and tablet the button uses `navigator.share` with the generated file so users can post straight to Instagram, WhatsApp or Facebook. Elsewhere, or if sharing is unsupported, it downloads the file.
- **Iframe permission:** Inside an iframe the parent `<iframe>` tag **must** include `allow="web-share"`; without it the browser blocks the API and the app falls back to download.

### 8. UI Style (Editorial Athlete)
The full token set is in `design.md` and lives in `src/index.css` (the `@theme` block **and** a duplicated `:root` block — keep both in sync).
- **Palette:** Navy `#005596`, Yellow `#ffc93c`, on a **pure-white ground** so the embed blends into the parent page. Do not reintroduce tints or gradients.
- **Typography:** **Archivo** for display, headings and body; **JetBrains Mono** for stats, labels and rank numbers.
- **Shape:** 14px radius on cards and containers, 8px on small elements, soft ambient shadows, light rules for separation.
- **Leaderboard:** Mono rank numbers, an accent bar on the top row, colour-coded point-differential chips (green positive, red negative). Team names are real buttons; sort headers carry `aria-sort`.

## Standings Rules
`buildLeagueData` in `convex/lib/aggregate.ts` ranks the teams in each division by:
1. **Win %** (games won ÷ games played, 3 decimals), highest first
2. **Points for**, highest first
3. **Points against**, lowest first
4. Team name alphabetically (the input is pre-sorted and the sort is stable)

The "W-L" column shows *games* won and lost, not match record — a known ambiguity, deliberately left as is.

## Data Ingestion
- **Source:** A CSV of the complete season, emailed weekly. It is the single source of truth: divisions and teams are derived from it, nothing is stored separately.
- **Automation:** Google Apps Script (`GoogleAppsScript.js`) polls Gmail and posts the raw CSV to the Convex HTTP endpoint `POST /ingest`.
- **Storage:** One `imports` document per received sheet (season, email metadata, parsed rows, warnings). The site always shows the latest; older imports are history and instant rollback points (`npx convex run ingest:rollback --prod`).
- **Validation:** Server-side (`convex/lib/csv.ts`): fixtures are kept as upcoming matches, missing points become 0 with a warning, bad numbers/dates are errors, total game count is checked (8 or 9 for CPL, 6 otherwise; CPL matches tied 4-4 go to a 9th game). A sheet with fewer played matches than the current one (same season) is refused unless forced.
- **Manual import:** `curl` the same endpoint (see `DOCS_INGESTION.md`).

## Client Updates
Service workers were removed in March 2026 (`service-worker-removal-plan.md`). Clients detect a new build by fetching `version.json` on load and on tab resume, throttled to once per two minutes (`update-frequency-strategy.md`). `index.html` and `version.json` are served with `no-store`; hashed assets are immutable.

## Deployment
Vercel, project `corporate-pickleball-league`, root directory `app/`. Every push to `main` is a production deploy; the build command runs `npx convex deploy` first when `CONVEX_DEPLOY_KEY` is set (Production only), so the backend and frontend ship together. There is no staging branch.

## Tech Stack
- **Framework**: React 19, React Router 7, TypeScript
- **Backend**: Convex (`app/convex/`)
- **Styling**: Tailwind CSS v4 with CSS-variable tokens
- **Typography**: Archivo (display/body), JetBrains Mono (stats)
- **Animation**: Framer Motion (tab transitions)
- **Images**: modern-screenshot
- **Tests**: Vitest
