# Codex Notes: Corporate Pickleball League

## Project Summary
Responsive iframe-friendly web app for a corporate league pickleball tournament. The UI focuses on divisions (e.g., Cayman Premier League (CPL), Division A/B/C, etc.), each with its own leaderboard and match list. Users can:
- Switch divisions to view that division's leaderboard.
- View match results per division.
- Click a team name to filter matches for that team.

Backend data is stored in Supabase (Postgres). Match ingestion is automated via Gmail + CSV parsing using Python and/or Google Apps Script.

## Tech Stack
- React 19 + Vite + TypeScript
- Tailwind CSS v4
- React Router 7
- Supabase (PostgreSQL)
- Python ingestion scripts

## Key Locations
- `app/`: React app (iframe edition)
- `app/src/pages/`: Leaderboard and Matches pages
- `app/src/components/`: UI components (match cards, tables, tabs, layout, sharing)
- `app/src/context/LeagueContext.tsx`: Front-loaded data fetching + polling
- `app/src/lib/`: Supabase client/helpers
- `app/src/types.ts`: Shared data types
- `ingest_matches.py`, `run_ingest_service.py`: CSV/Gmail ingestion
- `GoogleAppsScript.js`: Apps Script ingestion

## Runbook (from app/)
- Dev server: `npm run dev`
- Build: `npm run build`
- Preview: `npm run preview`
- Lint: `npm run lint`

## Style
- Theme colors:
- `brand-blue`: #005596 (Cayman Navy)
- `brand-yellow`: #FFC72C (Electric Volt Accents)
- `brand-gray`: #F8FAFC (Subtle Backgrounds)
- `brand-cream`: #FFFEFC (Warm Paper Texture Base)
- `brand-light-blue`: #9CCCFF (Hover/outline accents)

## Behavior Notes
- Data is fetched once on app mount; background refresh runs silently.
- Iframe auto-resizes via `postMessage` and `ResizeObserver` in `Layout.tsx`.
- Team name clicks route to matches filtered via URL search params.
- Share images are generated server-side via `/api/og` edge function.

## Ingestion Notes
- Python service polls Gmail every 15 minutes, validates game counts, and upserts into Supabase.
- Apps Script can ingest CSV attachments from a specific sender.

## Working Agreement for Changes
- Commands should be run from `app/` unless a script is in the repo root.
- Keep iframe constraints intact (no global header/footer; height sync required).
- Preserve division-based filtering and team-based match filtering behavior.
