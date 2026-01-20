# 🏓 Corporate Pickleball League - Iframe Edition

This version of the application is optimized for embedding inside a WordPress site via an `<iframe>`.

## 🚀 Key Features
- **Widget-Ready Layout:** All external branding (header/footer) has been removed to allow the parent site to control the outer UI.
- **Dynamic Resizing:** Uses a `ResizeObserver` and `postMessage` to communicate content height changes to the parent window instantly.
- **Embedded Navigation:** Custom tab-based navigation allows users to switch views (Leaderboard/Matches) entirely within the iframe.
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
The app uses a simplified routing structure where `Leaderboard` is the entry point. The `Layout` component handles the height notification logic globally.
