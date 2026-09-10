# Codex Notes: Corporate Pickleball League

## Project Summary
Responsive iframe-friendly web app for a corporate league pickleball tournament. The UI focuses on divisions (e.g., Cayman Premier League (CPL), Division A/B/C, etc.), each with its own leaderboard and match list. Users can:
- Switch divisions to view that division's leaderboard.
- View match results per division.
- Click a team name to filter matches for that team.

Backend is Convex: every emailed results CSV is stored as one `imports` document and the site is computed live from the latest one. A Google Apps Script forwards the CSV from Gmail to the Convex ingest endpoint.

## Tech Stack
- React 19 + Vite + TypeScript
- Tailwind CSS v4
- React Router 7
- Convex (`app/convex/`)
- Vitest (`app/tests/`)

## Key Locations
- `app/`: React app (iframe edition)
- `app/src/pages/`: Leaderboard and Matches pages
- `app/src/components/`: UI components (match cards, tables, tabs, layout, sharing)
- `app/src/context/LeagueContext.tsx`: Live Convex subscription + loading/error state
- `app/convex/`: schema, CSV parser, aggregation, diff, ingest HTTP endpoint
- `app/src/types.ts`: Re-exports the data types defined in `convex/lib/aggregate.ts`
- `GoogleAppsScript.js`: Apps Script ingestion

## Runbook (from app/)
- Backend: `npx convex dev` (keep running)
- Dev server: `npm run dev` → http://127.0.0.1:5173
- Tests: `npm test`
- Build: `npm run build`
- Preview: `npm run preview`
- Lint: `npm run lint`

## Style
- **Aesthetic:** "Editorial Athlete" with high-contrast, professional sports-editorial typography and clean visual language.
- **Typography:** Epilogue (Display/Headings), Public Sans (Body), Lexend (Stats).
- **Theme colors:**
  - `primary`: #005a87 (Ocean Blue)
  - `secondary`: #ffc72c (Volt Yellow)
  - `surface`: #f7f9fb (Cool Grayish White)
  - `on-surface`: #0f172a (Main Text)
- **UI Patterns:** Sharp edges (`rounded-none`), ambient depth (`shadow-ambient`), and dynamic typography scales (`display-lg`, `label-md`, etc.).

## Behavior Notes
- Data is a live Convex subscription; new imports appear without reload.
- Iframe auto-resizes via `postMessage` and `ResizeObserver` in `Layout.tsx`.
- Team name clicks route to matches filtered via URL search params.
- Share images are generated client-side using `html-to-image` capturing hidden, styled DOM containers (`ShareableLeaderboard`, `ShareableMatch`).

## Ingestion Notes
- Apps Script polls Gmail and POSTs the CSV to `https://<deployment>.convex.site/ingest`; the server validates game counts, diffs against the previous import, and stores a new version.
- Rollback: `npx convex run ingest:rollback --prod`. See `app/docs/DOCS_INGESTION.md`.

## Working Agreement for Changes
- Commands should be run from `app/` unless a script is in the repo root.
- Keep iframe constraints intact (no global header/footer; height sync required).
- Preserve division-based filtering and team-based match filtering behavior.
