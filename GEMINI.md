# Corporate Pickleball League

## Project Overview

The **Corporate Pickleball League** is a responsive web application built to manage and display league information, including standings, scores, and statistics. It features a distinct **"Editorial Athlete"** aesthetic with a high-contrast, professional sports-editorial UI, designed for mobile-first performance and seamless iframe integration.

### Tech Stack
-   **Framework:** React 19+ (via Vite)
-   **Language:** TypeScript
-   **Styling:** Tailwind CSS v4
-   **Routing:** React Router 7
-   **Icons:** Lucide React
-   **Backend:** Supabase (PostgreSQL)
-   **Ingestion:** Python & Google Apps Script automation

## Development Workflow Rules
- Always perform work and code changes on the `staging` branch.
- After merging changes into `main` and pushing to GitHub, always switch back to the `staging` branch immediately.

## Key Directories & Files

-   `app/`: Main application source code.
    -   `src/components/`: Reusable UI components (e.g., `MatchCard.tsx`, `Layout.tsx`, `LeaderboardTable.tsx`, `ConnectionError.tsx`, `ShareButton.tsx`).
    -   `src/pages/`: Main application views (`Leaderboard`, `Matches`).
    -   `app/docs/`: Detailed project documentation, feature strategies, and architectural plans (e.g., `ARCHITECTURE.md`, `DOCS_INGESTION.md`, `update-frequency-strategy.md`).
-   `ingest_matches.py`: CLI tool for CSV ingestion.
-   `run_ingest_service.py`: Automated ingestion service.
-   `GoogleAppsScript.js`: Gmail monitoring script (see `DOCS_INGESTION.md` for more details).

## Building and Running

All commands should be run from the `app/` directory.

### Development Server
Start the development server with Hot Module Replacement (HMR) and network access:
```bash
cd app
npm run dev
```
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
-   **Theme Colors (Editorial Athlete):**
    -   `primary`: #005a87 (Ocean Blue)
    -   `secondary`: #ffc72c (Volt Yellow)
    -   `surface`: #f7f9fb (Cool Grayish White)
    -   `on-surface`: #0f172a (Main Text)
-   **Typography:**
    -   Display/Headings: 'Epilogue' (Bold/Extra Bold tracking tight).
    -   Body: 'Public Sans' (Clean, readable sans-serif).
    -   Stats/Labels: 'Lexend' (Clear numeric/label font).
    -   Styles: High-contrast editorial look with large, bold data points and sharp edges.

### Data Management
- **Fetching:** Data is fetched from Supabase via `src/context/LeagueContext.tsx` with a 5-second timeout.
- **Error Handling:** Initial connection failures trigger a dedicated error screen. Background refreshes fail silently to preserve the user experience.
- **Updates:** The application checks for new versions on initial load and whenever the tab becomes visible (visibilitychange), with a 2-minute throttle.
- **Performance:** Front-loaded data pattern ensures instant navigation between tabs.

### Components
-   **Functional Components:** Use React functional components with TypeScript interfaces for props.
-   **Mobile-First:** Ensure all UI elements are responsive and optimized for mobile devices (e.g., touch-friendly targets, horizontal scrolling wrappers).
-   **Leaderboard:** Features a 2px horizontal padding on mobile view (`px-2`) and semantic coloring for the DIFF column (positive values are green on light green).
-   **Match Cards:** Use "Editorial Athlete" design with sharp corners (`rounded-none`) and ambient depth (`shadow-ambient`).

### Social Sharing
-   **Mechanism:** Client-side image generation using `html-to-image` creates branded PNGs for the leaderboard and match results.
-   **Components:** `ShareButton`, `ShareableLeaderboard`, and `ShareableMatch` handle the rendering and sharing process via the native Web Share API.
-   **Layouts:** Supports "Story" (portrait) and "Post" (landscape) formats with optimized typography and layouts.
