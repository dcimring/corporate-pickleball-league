# 🏓 Corporate Pickleball League - App Source

This directory contains the main React application source code.

## 🚀 Key Features
- **Supabase Integration:** Real-time data for teams, matches, and standings.
- **Dynamic Stats:** Performance metrics calculated on-the-fly from match history.
- **Mobile-First Design:** Optimized for court-side viewing with high-contrast themes.
- **Division Persistence:** Seamless navigation across leaderboard, matches, and stats pages while maintaining your selected division.

## 🛠️ Development

### Setup
1. Install dependencies: `npm install`
2. Configure `.env`:
   ```env
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_ANON_KEY=...
   ```
3. Start development server: `npm run dev`

### Commands
- `npm run dev`: Start Vite dev server.
- `npm run build`: Build for production.
- `npm run lint`: Run ESLint.
- `npm run preview`: Preview the production build.

## 📦 Architecture
For a deep dive into how the data and components are structured, see [ARCHITECTURE.md](./ARCHITECTURE.md).