# Codex Notes: Corporate Pickleball League

## Project Summary
Responsive iframe-friendly web app for the Cayman Corporate Pickleball League. The UI focuses on divisions (Cayman Premier League (CPL), Division A, B1–B4, etc.), each with its own leaderboard and match list. Users can:
- Switch divisions to view that division's leaderboard.
- View match results and upcoming fixtures per division.
- Click a team name to filter matches for that team.
- Export a leaderboard or match card as a branded image.

Backend is Convex: every emailed results CSV is stored as one `imports` document and the site is computed live from the latest one. A Google Apps Script forwards the CSV from Gmail to the Convex ingest endpoint.

## Tech Stack
- React 19 + Vite + TypeScript
- Tailwind CSS v4
- React Router 7
- Convex (`app/convex/`)
- Vitest (`app/tests/`)

## Key Locations
- `app/`: React app
- `app/src/pages/`: Leaderboard and Matches pages
- `app/src/components/`: UI components (match cards, tables, tabs, layout, sharing)
- `app/src/context/LeagueContext.tsx`: `LeagueProvider` — live Convex subscription + loading/error state
- `app/src/hooks/useLeagueData.ts`, `useActiveDivision.ts`: how components read league data and the active division
- `app/convex/`: schema, CSV parser, aggregation (standings sort), diff, ingest HTTP endpoint
- `app/src/types.ts`: Re-exports the data types defined in `convex/lib/aggregate.ts`
- `app/docs/`: architecture, ingestion, design, iframe, update-strategy docs
- `GoogleAppsScript.js`: Apps Script ingestion

## Runbook (from app/)
- Backend: `npx convex dev` (keep running)
- Dev server: `npm run dev` → http://127.0.0.1:5173 (not `localhost`)
- Tests: `npm test`
- Build: `npm run build` (regenerates `public/version.json` — don't commit that churn)
- Preview: `npm run preview`
- Lint: `npm run lint`

## Branching & Deploy
- Work directly on `main`; there is no staging branch. Every push to `main` is a production deploy on Vercel.
- The Vercel build runs `npx convex deploy` first (via `CONVEX_DEPLOY_KEY` in the Production env), so backend and frontend ship together.

## Style
- **Aesthetic:** "Editorial Athlete" — high-contrast sports-editorial UI on a pure-white ground (keep it white; no tints or gradients, so the iframe blends into pickleball.ky). Full spec: `app/docs/design.md`.
- **Typography:** Archivo (display, headings, body), JetBrains Mono (stats, labels).
- **Theme colors:** navy `#005596`, yellow `#ffc93c`, bg/card `#ffffff`, muted `#a3b3d0`.
- **Shape:** 14px radius on cards, 8px on small elements, soft ambient shadows.
- Tokens live in `app/src/index.css` in the `@theme` block **and** `:root` — keep both in sync.

## Behavior Notes
- Data is a live Convex subscription; new imports appear without reload.
- Standings sort: win % desc → points for desc → points against asc → team name. "W-L" shows games, not matches.
- Iframe auto-resizes via `postMessage` and `ResizeObserver` in `Layout.tsx`; outer branding is hidden when embedded.
- Team name clicks route to matches filtered via URL search params (`?team=`).
- Share images are captured from the live on-screen leaderboard/match card nodes with `modern-screenshot` — restyling those components changes the exports.
- 500ms loading floor and 12s connection timeout in `LeagueContext` are deliberate; keep them.
- `public/sw.js` and `service-worker.js` are intentional service-worker kill-switch stubs; do not delete.

## Ingestion Notes
- Apps Script polls Gmail and POSTs the CSV to `https://<deployment>.convex.site/ingest`; the server validates game counts, diffs against the previous import of the same season, and stores a new version.
- Season rollover = change the `SEASON` Script Property before the first sheet of the new season.
- Rollback: `npx convex run ingest:rollback --prod`. See `app/docs/DOCS_INGESTION.md`.

## Working Agreement for Changes
- Commands should be run from `app/` unless a script is in the repo root.
- Never put test files under `app/convex/` (every file there is bundled as a function).
- Keep iframe constraints intact (no global header/footer when embedded; height sync required).
- Preserve division-based filtering and team-based match filtering behavior.
