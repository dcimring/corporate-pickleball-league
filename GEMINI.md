# Corporate Pickleball League

## Project Overview

The **Corporate Pickleball League** is a responsive web application that shows league standings and match results for the Cayman Corporate Pickleball League. It has a distinct **"Editorial Athlete"** aesthetic — a high-contrast, sports-editorial UI on a pure-white ground — and is designed mobile-first for seamless iframe embedding on pickleball.ky.

### Tech Stack
-   **Framework:** React 19 (via Vite), TypeScript
-   **Styling:** Tailwind CSS v4 with CSS-variable design tokens
-   **Routing:** React Router 7
-   **Icons:** Lucide React
-   **Backend:** Convex (`app/convex/`, live queries)
-   **Ingestion:** Google Apps Script posts the results CSV to a Convex HTTP endpoint
-   **Tests:** Vitest (`app/tests/`)

## Development Workflow Rules
- Work directly on the `main` branch; there is no `staging` branch. Every push to `main` is a production deploy.
- Pushing to `main` triggers the Vercel Production build, which also deploys the Convex backend (`app/convex/`) via `CONVEX_DEPLOY_KEY`.
- Never put test files under `app/convex/` — every file there is bundled as a Convex function. Tests live in `app/tests/`.
- `app/convex/_generated/` is committed; `npx convex dev` regenerates it.
- `npm run build` regenerates `app/public/version.json`; do not commit that churn.

## Key Directories & Files

-   `app/`: Main application source code.
    -   `src/components/`: UI components (`Layout.tsx`, `LeaderboardTable.tsx`, `MatchCard.tsx`, `ShareButton.tsx`, `ConnectionError.tsx`, `UpdateBanner.tsx`, `TopFrame.tsx`, …).
    -   `src/pages/`: Main views (`Leaderboard`, `Matches`).
    -   `src/context/LeagueContext.tsx`: `LeagueProvider`, the live Convex subscription with loading/error state. Consumers use `src/hooks/useLeagueData.ts`; `src/hooks/useActiveDivision.ts` adds the URL-driven division selection.
    -   `src/lib/config.ts`, `src/lib/format.ts`: season fallback label and shared formatters.
    -   `src/types.ts`: Re-exports the data types defined in `convex/lib/aggregate.ts`.
    -   `docs/`: `ARCHITECTURE.md`, `DOCS_INGESTION.md`, `design.md`, `iframe-integration.md`, `update-frequency-strategy.md`, `service-worker-removal-plan.md` (historical).
-   `app/convex/`: Backend — schema, CSV parser, standings aggregation, diff, ingest endpoint.
-   `app/tests/`: Vitest suites for the parser, aggregation, and diff (`npm test`).
-   `GoogleAppsScript.js`: Gmail monitoring script (see `DOCS_INGESTION.md`).

## Building and Running

All commands should be run from the `app/` directory.

### Development Server
Run the Convex dev process (pushes `convex/` changes, writes `.env.local`) and the Vite server:
```bash
cd app
npx convex dev
npm run dev
```
Open http://127.0.0.1:5173 (not `localhost`, which another project may hold on IPv6).
*Note: When running via Gemini CLI, append `&` to run in the background if blocking.*

### Tests
```bash
cd app
npm test
```

### Production Build
```bash
cd app
npm run build
```

### Preview Build
```bash
cd app
npm run preview
```

### Linting
```bash
cd app
npm run lint
```

## Development Conventions

### Styling
-   **Tailwind CSS v4:** Theme tokens are CSS variables in `src/index.css`, defined in the `@theme` block **and** duplicated in `:root` — keep both in sync. `[data-theme="court"|"dark"]` variants exist but no switcher UI is wired up.
-   **Design System (Editorial Athlete):** Documented in [`app/docs/design.md`](app/docs/design.md).
    -   **Core Palette:** Navy `#005596`, Yellow `#ffc93c`, ground and cards pure white `#ffffff`. Keep the ground white — no tints or gradients — so the iframe blends into the parent page.
    -   **Typography:** Archivo (display, headings, body), JetBrains Mono (stats, labels).
    -   **Shape:** 14px border radius on cards, 8px on small elements, soft ambient shadows, light rules.

### Data Management
- **Fetching:** `LeagueProvider` subscribes to the Convex query `league.get`, which computes everything from the latest results import; updates are pushed live.
- **Error Handling:** No data within 12 seconds triggers a dedicated error screen (after a deliberate 500ms loading floor — keep it). Once loaded, connection drops never interrupt the user.
- **Standings order:** win % desc, then points for desc, then points against asc, then team name. The "W-L" column shows games, not matches (known, deliberate).
- **Updates:** The app checks `version.json` on initial load and whenever the tab becomes visible, throttled to once per 2 minutes.
- **Performance:** One query returns the whole league, so navigation between tabs is instant.

### Components
-   **Functional Components:** React functional components with TypeScript interfaces for props.
-   **Mobile-First:** All UI must be responsive (touch-friendly targets, horizontal scrolling wrappers where needed).
-   **Accessibility:** Team names are real buttons; sortable headers carry `aria-sort`; colours meet AA contrast.
-   **Leaderboard:** Semantic colouring for the point-differential chip (green positive, red negative).

### Social Sharing
-   **Mechanism:** `ShareButton` captures the live on-screen leaderboard or match card node with `modern-screenshot` and produces a branded image. Restyling those components changes the exports — re-test Story/Post/WhatsApp after visual changes.
-   **Sharing:** Native Web Share API on mobile/tablet (requires `allow="web-share"` on the iframe), download fallback elsewhere.
