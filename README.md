# 🏓 Corporate Pickleball League

A high-energy, responsive website for the Corporate Pickleball League, featuring a striking **"Night Court Electric"** aesthetic. Built for speed, style, and mobile-first performance using **Vite**, **React**, **TypeScript**, and **Tailwind CSS v4**.

## ✨ Key Features

-   **Night Court Aesthetic:** A high-contrast UI with Deep Navy backgrounds, Electric Volt accents, neon glows, and aggressive, athletic typography ('Bebas Neue').
-   **Mobile-Optimized UX:**
    *   **Fade Mask Horizontal Scroll:** Division selectors use a soft-fade gradient to indicate more content on mobile.
    *   **Compact Data Views:** Leaderboards use reduced padding and optimized font sizes for maximum readability on small screens.
    *   **Auto-Scroll Tabs:** Navigating to a specific division automatically scrolls the selector to the active item.
-   **Interactive Leaderboards:** Real-time standings sorted by win percentage with detailed point tracking.
-   **Visual Match Results:** Scorecard view of recent games styled as digital court scoreboards.
-   **Deep Linking:** Click any division card on the Home page to jump directly to its filtered leaderboard.
-   **Global Scroll Management:** Automatic "Scroll to Top" behavior on all route transitions.
-   **Robust Deployment:** Fully configured for SPA routing and seamless refreshes on Vercel.

## 🚀 Tech Stack

-   **Framework:** [React 18+](https://reactjs.org/)
-   **Build Tool:** [Vite](https://vitejs.dev/)
-   **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
-   **Typography:** 'Bebas Neue' (Athletic Display), 'Outfit' (Geometric Body)
-   **Icons:** [Lucide React](https://lucide.dev/)
-   **Routing:** [React Router 6](https://reactrouter.com/)

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

3.  **Run in Development:**
    ```bash
    npm run dev
    ```

## 📦 Project Structure

```text
app/
├── src/
│   ├── components/     # UI Components (Layout, Card, ScrollToTop)
│   ├── pages/          # Views (Home, Leaderboard, Scores, Stats)
│   ├── lib/            # Data access (league-data.json source)
│   ├── types.ts        # TypeScript interfaces
│   └── index.css       # Tailwind v4 theme & global styles
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
