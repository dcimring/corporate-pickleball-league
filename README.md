# 🏓 Corporate Pickleball League

Standings and match results for the Cayman Corporate Pickleball League. A React + Convex site deployed on Vercel and embedded as an iframe at [pickleball.ky/corporate-league](https://pickleball.ky/corporate-league/).

## ✨ Key Features

-   **Live data:** One Convex query returns the whole league. New results appear in every open browser the moment an import lands, with no polling.
-   **Automated ingestion:** A Google Apps Script watches Gmail for the weekly results CSV and posts it to the Convex backend, which validates it and stores it as a new version. Rollback is one command.
-   **"Editorial Athlete" design:** High-contrast sports-editorial UI on a pure-white ground so the iframe blends into the parent page. Navy `#005596`, Yellow `#ffc93c`, **Archivo** for text and **JetBrains Mono** for stats. Details in `app/docs/design.md`.
-   **Social sharing:** Branded image exports of any leaderboard or match card in **Story (9:16)**, **Post (landscape)** and **WhatsApp** formats, captured from the live DOM with `modern-screenshot` and shared via the native share sheet or downloaded.
-   **Iframe-aware:** Detects embedding, hides outer branding, and reports its height to the parent via `postMessage` so the host page never shows an inner scrollbar.
-   **Resilient loading:** A deliberate 500 ms loading floor, a 12 s connection timeout with retry, and the last good data kept on screen if the socket drops.

## 🚀 Tech Stack

-   **Framework:** [React 19](https://react.dev/) + [React Router 7](https://reactrouter.com/)
-   **Build Tool:** [Vite](https://vitejs.dev/)
-   **Backend:** [Convex](https://convex.dev/) (live queries; one document per results sheet)
-   **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
-   **Animation:** [Framer Motion](https://www.framer.com/motion/)
-   **Icons:** [Lucide React](https://lucide.dev/)
-   **Image Generation:** [modern-screenshot](https://github.com/qq15725/modern-screenshot)
-   **Tests:** [Vitest](https://vitest.dev/)

## 🛠️ Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/) (v20 or higher)
-   npm

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/dcimring/corporate-pickleball-league.git
    cd corporate-pickleball-league
    ```

2.  **Install dependencies:**
    ```bash
    cd app
    npm install
    ```

3.  **Connect a Convex deployment:**
    ```bash
    npx convex dev
    ```
    The first run logs you in, creates/selects the project, and writes `VITE_CONVEX_URL` to `.env.local`. Keep it running: it pushes changes under `convex/` as you edit.

4.  **Run in Development** (in a second terminal):
    ```bash
    npm run dev
    ```
    Open http://127.0.0.1:5173 (not `localhost`, which another project may hold on IPv6). Load data by posting a results CSV to the ingest endpoint (see `app/docs/DOCS_INGESTION.md`).

### Other commands (from `app/`)

| Command | What it does |
| :--- | :--- |
| `npm test` | Vitest suites for the CSV parser, standings aggregation and import diff |
| `npm run lint` | ESLint |
| `npm run build` | Type-check and production build (also regenerates `public/version.json`; don't commit that churn) |
| `npm run backup` | Export the production Convex deployment to `backups/` |

## 📊 Standings Rules

Within a division, teams are ranked by:

1.  **Win %** (games won ÷ games played), highest first
2.  **Points for**, highest first
3.  **Points against**, lowest first
4.  Team name, alphabetically

The leaderboard's "W-L" column shows *games* won and lost, not match record. The sort lives in `app/convex/lib/aggregate.ts`.

## 🧩 Iframe Integration

To use this site inside an iframe, add the following script to your parent site to handle automatic height adjustments:

```javascript
window.addEventListener('message', function(e) {
    // Height Adjustment
    if (e.data.height) {
        document.getElementById('pickleball-iframe').style.height = e.data.height + 'px';
    }
}, false);
```

Ensure your iframe has the ID `pickleball-iframe` and the `allow="web-share"` attribute enabled. The deployment's Content-Security-Policy only permits embedding on `pickleball.ky`; see `app/docs/iframe-integration.md` to add another host.

## ⚙️ Data & Ingestion

-   **`GoogleAppsScript.js`:** Gmail watcher that posts each results CSV to Convex (`POST /ingest`).
-   **`app/convex/`:** Backend — schema (`imports` table), CSV parser, standings aggregation, diff, ingest mutation, HTTP endpoint.
-   **Backups:** `npm run backup` (from `app/`) exports the production deployment; `npx convex run ingest:rollback --prod` undoes the latest import.

## 🚢 Deployment

-   Hosted on Vercel (project `corporate-pickleball-league`, root directory `app/`). There is no staging branch: **every push to `main` is a production deploy.**
-   The build command in `app/vercel.json` runs `npx convex deploy` first when `CONVEX_DEPLOY_KEY` is present (Production environment only, scoped to `deployment:deploy`), so backend and frontend ship together. Preview builds compile the frontend only against the Preview `VITE_CONVEX_URL`.

## 📄 Documentation

Detailed documentation lives in `app/docs/`:

-   `ARCHITECTURE.md`: Technical system overview.
-   `DOCS_INGESTION.md`: Data pipeline, ingest endpoint contract and manual operations.
-   `design.md`: Design tokens, typography and layout rules.
-   `iframe-integration.md`: Embedding behaviour and allowed origins.
-   `update-frequency-strategy.md`: How clients detect a new build.
-   `service-worker-removal-plan.md`: Historical record of the PWA removal and why the kill-switch stubs remain.

Agent instructions for AI coding tools are in `CLAUDE.md`, `GEMINI.md` and `codex.md` at the repo root.

## 🇰🇾 Made in Cayman

Made with ❤️ in the Cayman Islands.

## 📄 License

This project is licensed under the MIT License — see [LICENSE](LICENSE).
