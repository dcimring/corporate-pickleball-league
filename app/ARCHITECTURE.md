# Corporate Pickleball League - Application Architecture

## Tech Stack
- **Framework**: React 18+ (via Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 (using CSS variables and `@theme`)
- **Routing**: React Router DOM v6+
- **Icons**: Lucide React

## Project Structure
```
src/
├── components/     # Reusable UI components (Layout, etc.)
├── lib/            # Utilities and Data access
│   └── data.ts     # Typed data accessor
├── pages/          # Page components (Home, Leaderboard, Scores, Stats)
├── types.ts        # TypeScript interfaces for League Data
├── league-data.json# Mock database (JSON)
├── App.tsx         # Main Routing configuration
└── index.css       # Global styles & Tailwind Config
```

## Data Management
The application uses a static JSON file (`league-data.json`) as a mock database.
- Data is imported and typed in `src/lib/data.ts`.
- `LeagueData` interface in `src/types.ts` defines the shape of:
  - Divisions (Teams, Times)
  - Leaderboard (Standings)
  - Scores (Match history)
  - Statistics (Team & Player analytics)

## Styling System
We utilize **Tailwind CSS v4**.
- Configuration is handled in `src/index.css` via the `@theme` block.
- **Colors**:
  - `brand-orange`: #EF7D00
  - `brand-blue`: #1E293B
  - `brand-green`: #C3F53C
- **Typography**:
  - Headings: 'Oswald' (Condensed, Impactful)
  - Body: 'Inter' (Clean, Legible)

## Routing
- `/`: **Home** - Division overview and team lists.
- `/leaderboard`: **Leaderboard** - Standings with sorting and win %.
- `/scores`: **Scores** - Recent match results.
- `/stats`: **Statistics** - detailed analytics for teams and players.
