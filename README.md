# 🏓 Corporate Pickleball League

A professional, responsive, and iframe-optimized website for the Corporate Pickleball League, featuring a distinct **"Roost Kinetic"** aesthetic and seamless high-performance data integration.

## ✨ Key Features

-   **"Roost Kinetic" Aesthetic:** A high-contrast, bold UI featuring **Cayman Blue (#005596)**, **Pickle Yellow (#FFC72C)**, and a warm paper-textured background.
-   **Dynamic Social Sharing:** Generate professional, branded JPEG images for any leaderboard or match result. Supports specialized **Story (9:16)**, **Post (1.91:1)**, and **WhatsApp** optimized layouts.
-   **Kinetic Loading Experience:** A custom-themed "Bouncing Dimple" loading state with squash-and-stretch ball physics and cycling match-intel messaging.
-   **Card-Based Leaderboard:** A refined, mobile-first standings display featuring skewed rank badges, high-contrast typography, and "Text Shift" interaction feedback.
-   **Instant Navigation:** "Front-loaded" data architecture ensures zero-latency switching between Leaderboard and Matches with automatic background refreshing.
-   **Iframe Optimization:** Advanced iframe support including auto-resizing via `ResizeObserver` and "Focus Anchor" techniques to force parent-page scroll adjustments during navigation.
-   **Versus Split Cards:** Dramatic match result cards that highlight winners and scores with visual impact.
-   **Team Match Filtering:** Interactive filtering to view specific team histories directly from the leaderboard or match cards.
-   **Automated Data Ingestion:** Background service (`run_ingest_service.py`) that monitors Gmail for match results and syncs them automatically to Supabase.
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
    Create a `.env` file in the `app` directory with your Supabase credentials:
    ```env
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

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
    // Optional: Listen for scroll signals
    if (e.data.type === 'LRP_SCROLL_TOP') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}, false);
```

Ensure your iframe has the ID `pickleball-iframe` and the `allow="web-share"` attribute enabled.

## ⚙️ Ingestion Tools

-   **`run_ingest_service.py`:** Automation service running every 15 minutes to sync Gmail results to Supabase with smart division mapping.
-   **`ingest_matches.py`:** Manual CLI tool for CSV ingestion with validation safety checks.
-   **`db_backup.py`:** Snapshot tool for database protection.

## 🎨 Theme Versions

-   **Main Branch:** The primary production version (pickleball.ky).
-   **night-court-theme Branch:** "Night Court Electric" high-contrast dark variant.
-   **old-theme Branch:** Preserves the original "Organic Clubhouse" design.

## 🇰🇾 Made in Cayman

Made with ❤️ in the Cayman Islands.

## 📄 License

This project is licensed under the MIT License.
