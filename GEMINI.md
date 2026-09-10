# Corporate Pickleball League

## Project Overview

The **Corporate Pickleball League** is a responsive web application built to manage and display league information, including standings, scores, and statistics. It features a distinct **"Editorial Athlete"** aesthetic with a high-contrast, professional sports-editorial UI, designed for mobile-first performance and seamless iframe integration.

### Tech Stack
-   **Framework:** React 19+ (via Vite)
-   **Language:** TypeScript
-   **Styling:** Tailwind CSS v4
-   **Routing:** React Router 7
-   **Icons:** Lucide React
-   **Backend:** Convex (`app/convex/`, live queries)
-   **Ingestion:** Google Apps Script posts the results CSV to a Convex HTTP endpoint

## Development Workflow Rules
- Always perform work and code changes on the `staging` branch.
- After merging changes into `main` and pushing to GitHub, always switch back to the `staging` branch immediately.

## Key Directories & Files

-   `app/`: Main application source code.
    -   `src/components/`: Reusable UI components (e.g., `MatchCard.tsx`, `Layout.tsx`, `LeaderboardTable.tsx`, `ConnectionError.tsx`, `ShareButton.tsx`).
    -   `src/pages/`: Main application views (`Leaderboard`, `Matches`).
    -   `app/docs/`: Detailed project documentation, feature strategies, and architectural plans (e.g., `ARCHITECTURE.md`, `DOCS_INGESTION.md`, `design.md`, `iframe-integration.md`, `update-frequency-strategy.md`).
-   `app/convex/`: Backend — schema, CSV parser, standings aggregation, ingest endpoint.
-   `app/tests/`: Vitest suites for the parser, aggregation, and diff (`npm test`).
-   `GoogleAppsScript.js`: Gmail monitoring script (see `DOCS_INGESTION.md` for more details).

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

### Production Build
Build the application for production:
```bash
cd app
npm run build
```

### Preview Build
Preview the production build locally:
```bash
cd app
npm run preview
```

### Linting
Run ESLint to check for code quality issues:
```bash
cd app
npm run lint
```

## Development Conventions

### Styling
-   **Tailwind CSS v4:** The project uses the latest Tailwind CSS features, including CSS variables for theming defined in `src/index.css`.
-   **Design System (Editorial Athlete):**
    -   Detailed design tokens, colors, and typography are documented in [`app/docs/design.md`](app/docs/design.md).
    -   **Core Palette:** Navy (#005596), Yellow (#ffc93c), Surface (#eef2f7).
    -   **Typography:** Archivo (Display/Body), JetBrains Mono (Stats/Labels).
    -   **Styles:** High-contrast editorial look with large data points, 14px border radius, and soft ambient shadows.

### Data Management
- **Fetching:** `src/context/LeagueContext.tsx` subscribes to the Convex query `league.get`, which computes everything from the latest results import; updates are pushed live.
- **Error Handling:** No data within 12 seconds triggers a dedicated error screen (after a deliberate 500ms loading floor). Once loaded, connection drops never interrupt the user.
- **Updates:** The application checks for new versions on initial load and whenever the tab becomes visible (visibilitychange), with a 2-minute throttle.
- **Performance:** One query returns the whole league, so navigation between tabs is instant.

### Components
-   **Functional Components:** Use React functional components with TypeScript interfaces for props.
-   **Mobile-First:** Ensure all UI elements are responsive and optimized for mobile devices (e.g., touch-friendly targets, horizontal scrolling wrappers).
-   **Leaderboard:** Features a 2px horizontal padding on mobile view (`px-2`) and semantic coloring for the DIFF column (positive values are green on light green).
-   **Match Cards:** Use "Editorial Athlete" design with sharp corners (`rounded-none`) and ambient depth (`shadow-ambient`).

### Social Sharing
-   **Mechanism:** Client-side image generation using `html-to-image` creates branded PNGs for the leaderboard and match results.
-   **Components:** `ShareButton`, `ShareableLeaderboard`, and `ShareableMatch` handle the rendering and sharing process via the native Web Share API.
-   **Layouts:** Supports "Story" (portrait) and "Post" (landscape) formats with optimized typography and layouts.
