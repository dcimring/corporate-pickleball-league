# Corporate Pickleball League - Application Architecture

## Tech Stack
- **Framework**: React 19+ (via Vite)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS v4 (using CSS variables and `@theme`)
- **Routing**: React Router 7
- **Icons**: Lucide React

## Project Structure
```
src/
├── components/     # Reusable UI components (Layout, Card, etc.)
├── lib/            # Utilities and Data access
│   ├── supabase.ts # Supabase client initialization
│   └── data.ts     # Data fetching and aggregation logic
├── pages/          # Page components (Home, Leaderboard, Matches, Stats)
├── types.ts        # TypeScript interfaces and Database row types
├── App.tsx         # Main Routing configuration
└── index.css       # Global styles & Tailwind Config
```

## Data Management & Flow
The application has transitioned from static JSON to a **Supabase (Postgres)** backend.

### Source of Truth
- The `matches` table is the primary source of truth for all standings and statistics.
- `src/lib/data.ts` fetches raw data from `divisions`, `teams`, and `matches` tables.
- It then **aggregates** this data on-the-fly to calculate:
  - **Leaderboard Standings**: Based on Game Win% and points.
  - **Team Statistics**: Detailed metrics like Games Won, Games Lost, and Matches Played.

### Persistence
- The selected **Division** is persisted in the URL query parameters (`?division=...`).
- This state is maintained across page transitions in the `Layout` component and page-level hooks.

## Styling System
We utilize **Tailwind CSS v4** with a **"Night Court Electric"** theme.
- **Colors**:
  - `brand-blue`: #0F172A (Deep Navy)
  - `brand-yellow`: #CCFF00 (Electric Volt)
- **Typography**:
  - Headings: 'Bebas Neue' (Uppercase, Athletic)
  - Body: 'Outfit' (Geometric Sans-serif)

## Routing
- `/`: **Home** - Division overview.
- `/leaderboard`: **Leaderboard** - Standings sorted by Game Win%.
- `/matches`: **Matches** - Historical match results and individual game scores.
- `/stats`: **Stats** - Deep dive into team performance metrics.