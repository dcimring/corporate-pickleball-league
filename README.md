# 🏓 Corporate Pickleball League

A professional, responsive, and iframe-optimized website for the Corporate Pickleball League, featuring a distinct **"Editorial Athlete"** aesthetic and seamless high-performance data integration.

## ✨ Key Features

-   **"Editorial Athlete" Aesthetic:** A high-contrast, professional sports-editorial UI featuring **Ocean Blue (#005a87)**, **Volt Yellow (#ffc72c)**, and a clean, modern surface background.
-   **Editorial Navigation:** A refined navigation system with glassmorphism and clear visual focus for active states, optimized for both standalone and iframe viewing.
-   **Dynamic Typography Scale:** High-impact editorial typography using **Epilogue**, **Public Sans**, and **Lexend** for data-heavy views.
-   **Dynamic Social Sharing:** Generate professional, branded PNG images for any leaderboard or match result. Supports specialized **Story (9:16)** and **Post ( landscape)** layouts.
-   **Consolidated Stats UI:** A refined leaderboard featuring semantic color-coded "DIFF" pills, unified brand-blue primary data, and consistent hierarchy.
-   **Iframe Optimization:** Advanced iframe support including auto-resizing via `ResizeObserver` and fluid, adaptive navigation to prevent clipping on narrow devices.
-   **Automated Data Ingestion:** A Google Apps Script watches Gmail for the weekly results CSV and posts it to the Convex backend, which validates it and publishes the new standings live to every open page.
-   **Robust Error Handling:** Graceful connection timeout screens and silent background failure handling to preserve user experience.

## 🚀 Tech Stack

-   **Framework:** [React 19+](https://reactjs.org/)
-   **Build Tool:** [Vite](https://vitejs.dev/)
-   **Backend:** [Convex](https://convex.dev/) (live queries; one document per results sheet)
-   **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
-   **Animation:** [Framer Motion](https://www.framer.com/motion/)
-   **Icons:** [Lucide React](https://lucide.dev/)
-   **Image Generation:** [modern-screenshot](https://github.com/qq15725/modern-screenshot)

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
    Open http://127.0.0.1:5173. Load data by posting a results CSV to the ingest endpoint (see `app/docs/DOCS_INGESTION.md`).

## 🧩 Iframe Integration

To use this site inside an iframe, add the following script to your parent site to handle automatic height adjustments and scroll synchronization:

```javascript
window.addEventListener('message', function(e) {
    // Height Adjustment
    if (e.data.height) {
        document.getElementById('pickleball-iframe').style.height = e.data.height + 'px';
    }
}, false);
```

Ensure your iframe has the ID `pickleball-iframe` and the `allow="web-share"` attribute enabled.

## ⚙️ Data & Ingestion

-   **`GoogleAppsScript.js`:** Gmail watcher that posts each results CSV to Convex (`POST /ingest`).
-   **`app/convex/`:** Backend — schema (`imports` table), CSV parser, standings aggregation, diff, ingest mutation, HTTP endpoint.
-   **Backups:** `npm run backup` (from `app/`) exports the production deployment; `npx convex run ingest:rollback --prod` undoes the latest import.

## 📄 Documentation

Detailed architectural and feature documentation can be found in the `app/docs/` folder:
-   `ARCHITECTURE.md`: Technical system overview.
-   `DOCS_INGESTION.md`: Data pipeline and automation details.
-   `update-frequency-strategy.md`: Strategy for app updates and versioning.

## 🇰🇾 Made in Cayman

Made with ❤️ in the Cayman Islands.

## 📄 License

This project is licensed under the MIT License.
