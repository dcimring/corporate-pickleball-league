# 🏓 Corporate Pickleball League

A professional, responsive, and iframe-optimized website for the Corporate Pickleball League, featuring a distinct **"Editorial Athlete"** aesthetic and seamless high-performance data integration.

## ✨ Key Features

-   **"Editorial Athlete" Aesthetic:** A high-contrast, professional sports-editorial UI featuring **Ocean Blue (#005a87)**, **Volt Yellow (#ffc72c)**, and a clean, modern surface background.
-   **Editorial Navigation:** A refined navigation system with glassmorphism and clear visual focus for active states, optimized for both standalone and iframe viewing.
-   **Dynamic Typography Scale:** High-impact editorial typography using **Epilogue**, **Public Sans**, and **Lexend** for data-heavy views.
-   **Dynamic Social Sharing:** Generate professional, branded PNG images for any leaderboard or match result. Supports specialized **Story (9:16)** and **Post ( landscape)** layouts.
-   **Consolidated Stats UI:** A refined leaderboard featuring semantic color-coded "DIFF" pills, unified brand-blue primary data, and consistent hierarchy.
-   **Iframe Optimization:** Advanced iframe support including auto-resizing via `ResizeObserver` and fluid, adaptive navigation to prevent clipping on narrow devices.
-   **Automated Data Ingestion:** Background service (`run_ingest_service.py`) and Google Apps Script that monitors Gmail for match results and syncs them automatically to Supabase.
-   **Robust Error Handling:** Graceful connection timeout screens and silent background failure handling to preserve user experience.

## 🚀 Tech Stack

-   **Framework:** [React 19+](https://reactjs.org/)
-   **Build Tool:** [Vite](https://vitejs.dev/)
-   **Database:** [Supabase](https://supabase.com/) (PostgreSQL)
-   **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
-   **Animation:** [Framer Motion](https://www.framer.com/motion/)
-   **Icons:** [Lucide React](https://lucide.dev/)
-   **Image Generation:** [html-to-image](https://github.com/bubkoo/html-to-image)

## 🛠️ Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or higher)
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

3.  **Setup Environment Variables:**
    Create a `.env` file in the `app` directory with your Supabase credentials (see `.env.example`).

4.  **Run in Development:**
    ```bash
    npm run dev
    ```

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

## ⚙️ Ingestion Tools

-   **`run_ingest_service.py`:** Automation service running every 15 minutes to sync Gmail results to Supabase with smart division mapping.
-   **`ingest_matches.py`:** Manual CLI tool for CSV ingestion with validation safety checks.
-   **`db_backup.py`:** Snapshot tool for database protection.

## 📄 Documentation

Detailed architectural and feature documentation can be found in the `app/docs/` folder:
-   `ARCHITECTURE.md`: Technical system overview.
-   `DOCS_INGESTION.md`: Data pipeline and automation details.
-   `update-frequency-strategy.md`: Strategy for app updates and versioning.

## 🇰🇾 Made in Cayman

Made with ❤️ in the Cayman Islands.

## 📄 License

This project is licensed under the MIT License.
