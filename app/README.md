# 🏓 Corporate Pickleball League - Iframe Edition

This version of the application is optimized for embedding inside a WordPress site via an `<iframe>`.

## 🚀 Key Features
- **Widget-Ready Layout:** All external branding (header/footer) has been removed to allow the parent site to control the outer UI.
- **Dynamic Resizing:** Uses a `ResizeObserver` and `postMessage` to communicate content height changes to the parent window instantly.
- **Embedded Navigation:** Custom tab-based navigation allows users to switch views (Leaderboard/Matches) entirely within the iframe.
- **Automated Ingestion:** Dedicated Python services handle automatic data synchronization from Gmail attachments.
- **Supabase Backend:** Real-time data processing for standings and schedules.

## 🛠️ Development

### Local Iframe Testing
To test the iframe behavior locally:
1. Run `npm run dev` in this directory.
2. Open the `index.html` file in the **root** of the repository (it contains a test harness with the necessary `postMessage` listener).

### Commands
- `npm run dev`: Start Vite dev server.
- `npm run build`: Build for production.
- `npm run lint`: Run ESLint.

## 📦 Architecture
The app uses a **Context-driven** architecture:
- `LeagueContext` lifts data fetching to the root level.
- Pages (`Leaderboard`, `Matches`) consume data instantly from the context.
- Automatic background polling keeps data fresh without page reloads.
- `Layout` handles the global iframe resizing logic.
For a deep dive, see [ARCHITECTURE.md](./ARCHITECTURE.md).
