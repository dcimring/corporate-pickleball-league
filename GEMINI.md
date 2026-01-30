# Corporate Pickleball League

## Project Overview

The **Corporate Pickleball League** is a responsive web application built to manage and display league information, including standings, scores, and statistics. It features a distinct **"Roost Kinetic"** aesthetic with a high-contrast, "Warm Paper" UI texture, designed for mobile-first performance and seamless iframe integration.

### Tech Stack
-   **Framework:** React 19+ (via Vite)
-   **Language:** TypeScript
-   **Styling:** Tailwind CSS v4
-   **Routing:** React Router 7
-   **Icons:** Lucide React
-   **Backend:** Supabase (PostgreSQL)
-   **Ingestion:** Python & Google Apps Script automation

## Key Directories & Files

-   `app/`: Main application source code.
    -   `src/components/`: Reusable UI components (e.g., `MatchCard.tsx`, `Layout.tsx`, `LeaderboardTable.tsx`).
    -   `src/pages/`: Main application views (`Leaderboard`, `Matches`).
    -   `src/lib/`: Data access utilities (Supabase client).
    -   `src/types.ts`: TypeScript definitions for league data entities.
    -   `src/index.css`: Global styles and Tailwind CSS v4 configuration (`@theme`).
    -   `ARCHITECTURE.md`: Detailed architectural documentation.
-   `ingest_matches.py`: CLI tool for CSV ingestion.
-   `run_ingest_service.py`: Automated ingestion service.
-   `GoogleAppsScript.js`: Gmail monitoring script.

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
-   **Theme Colors:**
    -   `brand-blue`: #005596 (Cayman Navy)
    -   `brand-yellow`: #FFC72C (Electric Volt Accents)
    -   `brand-gray`: #F8FAFC (Subtle Backgrounds)
    -   `brand-cream`: #FFFEFC (Warm Paper Texture Base)
-   **Typography:**
    -   Family: 'Raleway' (Variable weights 300-800)
    -   Styles: ExtraBold Italic for headings, Monospace for data.

### Data Management
-   Data is fetched from Supabase via `src/context/LeagueContext.tsx`.
-   Front-loaded data pattern ensures instant navigation between tabs.

### Components
-   **Functional Components:** Use React functional components with TypeScript interfaces for props.
-   **Mobile-First:** Ensure all UI elements are responsive and optimized for mobile devices (e.g., touch-friendly targets, horizontal scrolling wrappers).
-   **Match Cards:** Use "Roost Kinetic" design with grainy paper texture and hard shadows.
