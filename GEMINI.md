# Corporate Pickleball League

## Project Overview

The **Corporate Pickleball League** is a responsive web application built to manage and display league information, including standings, scores, and statistics. It features a distinct **"Night Court Electric"** aesthetic with a high-contrast UI, designed for mobile-first performance.

### Tech Stack
-   **Framework:** React 18+ (via Vite)
-   **Language:** TypeScript
-   **Styling:** Tailwind CSS v4
-   **Routing:** React Router DOM v6+
-   **Icons:** Lucide React
-   **Data:** Static JSON (`league-data.json`) managed via `src/lib/data.ts`

## Key Directories & Files

-   `app/`: Main application source code.
    -   `src/components/`: Reusable UI components (e.g., `Card.tsx`, `Layout.tsx`).
    -   `src/pages/`: Main application views (`Home`, `Leaderboard`, `Scores`, `Stats`).
    -   `src/lib/`: Data access utilities.
    -   `src/types.ts`: TypeScript definitions for league data entities.
    -   `src/index.css`: Global styles and Tailwind CSS v4 configuration (`@theme`).
    -   `league-data.json`: Mock database containing teams, matches, and standings.
    -   `ARCHITECTURE.md`: Detailed architectural documentation.

## Building and Running

All commands should be run from the `app/` directory.

### Development Server
Start the development server with Hot Module Replacement (HMR):
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
    -   `brand-cream`: #0F172A (Deep Navy Background)
    -   `brand-ink`: #FFFFFF (Text)
    -   `brand-acid`: #CCFF00 (Electric Volt Accents)
    -   `brand-soft-blue`: #1E293B (Card Backgrounds)
-   **Typography:**
    -   Headings: 'Bebas Neue' (Uppercase, Italic)
    -   Body: 'Outfit' (Geometric sans-serif)
    -   Accents: 'Patrick Hand' (Handwritten style)

### Data Management
-   Data is read from `league-data.json`.
-   Access data using the typed utility functions in `src/lib/data.ts` to ensure type safety across the application.

### Components
-   **Functional Components:** Use React functional components with TypeScript interfaces for props.
-   **Mobile-First:** Ensure all UI elements are responsive and optimized for mobile devices (e.g., touch-friendly targets, horizontal scrolling wrappers).
