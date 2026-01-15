# 🏓 Corporate Pickleball League

A high-energy, responsive website for the Corporate Pickleball League, featuring a striking **"Night Court Electric"** aesthetic. Built for speed, style, and mobile-first performance using **Vite**, **React**, **TypeScript**, and **Tailwind CSS v4**.

## ✨ Key Features

-   **Night Court Aesthetic:** A high-contrast UI with Deep Navy backgrounds, Electric Volt accents, neon glows, and aggressive, athletic typography ('Bebas Neue').
-   **Mobile-Optimized UX:**
    *   **Fade Mask Horizontal Scroll:** Division selectors use a soft-fade gradient to indicate more content on mobile.
    *   **Compact Data Views:** Leaderboards use reduced padding and optimized font sizes for maximum readability on small screens.
    *   **Auto-Scroll Tabs:** Navigating to a specific division automatically scrolls the selector to the active item.
-   **Interactive Leaderboards:** Real-time standings sorted by win percentage with detailed point tracking.
-   **Visual Match Results:** Dedicated "Matches" page showing recent and upcoming games with real-time data from Supabase.
-   **Persistent Division Context:** Your selected division follows you as you navigate between Leaderboard, Matches, and Stats.
-   **Data-Driven Analytics:** Detailed team statistics calculated directly from match results, including Game Win% and individual game tracking.
-   **Supabase Backend:** Real-time database integration for managing teams, divisions, and match schedules.
-   **Deep Linking:** Click any division card on the Home page to jump directly to its filtered leaderboard.

## 🚀 Tech Stack

-   **Framework:** [React 19+](https://reactjs.org/)
-   **Build Tool:** [Vite](https://vitejs.dev/)
-   **Database:** [Supabase](https://supabase.com/) (PostgreSQL)
-   **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
-   **Typography:** 'Bebas Neue' (Athletic Display), 'Outfit' (Geometric Body)
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
│   ├── components/     # UI Components (Layout, Card, ScrollToTop)
│   ├── pages/          # Views (Home, Leaderboard, Matches, Stats)
│   ├── lib/            # Data access (Supabase & local logic)
│   ├── types.ts        # TypeScript interfaces & DB schemas
│   └── index.css       # Tailwind v4 theme & global styles
├── league-data.json    # Legacy mock data (for reference)
├── vercel.json         # Deployment rewrites
└── ...
```

## 🎨 Theme Versions

-   **Main Branch:** The current "Night Court Electric" theme.
-   **[old-theme](https://github.com/dcimring/corporate-pickleball-league/tree/old-theme) Branch:** Preserves the original "Organic Clubhouse" design (Cream & Ink).

## 🇰🇾 Made in Cayman

Made with ❤️ in the Cayman Islands.

## 📄 License

This project is licensed under the MIT License.
