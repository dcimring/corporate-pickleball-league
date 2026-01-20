# 🏓 Corporate Pickleball League

A professional, responsive, and iframe-optimized website for the Corporate Pickleball League, seamlessly integrated with the main Pickleball Cayman brand.

## ✨ Key Features

-   **Brand-Aligned Aesthetic:** A professional, clean UI styled to match the main Pickleball Cayman site, featuring **Cayman Blue**, **Pickle Yellow**, and vibrant action colors.
-   **Iframe Integration:** Optimized for embedding as a WordPress widget with zero external layout (no header/footer).
-   **Auto-Resizing:** Real-time height synchronization with the parent window using `postMessage` and `ResizeObserver`.
-   **Simplified Navigation:** Custom pill-shaped page tabs and a mobile-friendly division dropdown for a clean, widget-like experience.
-   **Full-Width UI:** Edge-to-edge layout designed to fit perfectly within any parent container.
-   **Supabase Backend:** Real-time database integration for managing teams, divisions, and match schedules.

## 🚀 Tech Stack

-   **Framework:** [React 19+](https://reactjs.org/)
-   **Build Tool:** [Vite](https://vitejs.dev/)
-   **Database:** [Supabase](https://supabase.com/) (PostgreSQL)
-   **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
-   **Typography:** 'Montserrat' (Heading), 'Open Sans' (Body)
-   **Icons:** [Lucide React](https://lucide.dev/)
-   **Routing:** [React Router 7](https://reactrouter.com/)

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

## 📦 Project Structure

```text
app/
├── src/
│   ├── components/     # UI Components (DivisionTabs, PageTabs, Layout)
│   ├── pages/          # Views (Leaderboard, Matches)
│   ├── lib/            # Data access (Supabase & local logic)
│   ├── types.ts        # TypeScript interfaces & DB schemas
│   └── index.css       # Tailwind v4 theme & global styles
├── index.html          # Local iframe testing harness
├── vercel.json         # Deployment rewrites
└── ...
```

## 🧩 Iframe Integration

To use this site inside an iframe, add the following script to your WordPress (parent) site to handle automatic height adjustments:

```javascript
window.addEventListener('message', function(e) {
    if (e.data.height) {
        document.getElementById('pickleball-iframe').style.height = e.data.height + 'px';
    }
}, false);
```

Ensure your iframe has the ID `pickleball-iframe`.


## 🎨 Theme Versions

-   **Main Branch:** The current "Night Court Electric" theme.
-   **[old-theme](https://github.com/dcimring/corporate-pickleball-league/tree/old-theme) Branch:** Preserves the original "Organic Clubhouse" design (Cream & Ink).

## 🇰🇾 Made in Cayman

Made with ❤️ in the Cayman Islands.

## 📄 License

This project is licensed under the MIT License.
