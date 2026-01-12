# 🏓 Corporate Pickleball League

A stunning, responsive website for the Corporate Pickleball League, featuring a unique "Organic Clubhouse" aesthetic. Built with speed and style using **Vite**, **React**, **TypeScript**, and **Tailwind CSS v4**.

![Design Preview](inspiration.png) *(Reference Inspiration)*

## ✨ Key Features

-   **Organic Clubhouse Design:** A warm, tactile UI with hand-drawn doodles, hard shadows, and distinctive typography.
-   **Division Overviews:** Quick access to schedules and team rosters for all league levels.
-   **Interactive Leaderboards:** Real-time standings sorted by win percentage with point differential tracking.
-   **Visual Match Results:** Detailed scorecard view of recent games with winner highlights.
-   **Performance Analytics:** Deep-dive statistics for teams and individual players.
-   **Deep Linking:** Click a division card on the home page to jump straight to its leaderboard.
-   **Responsive & Robust:** Optimized for all devices and configured for seamless SPA routing on Vercel.

## 🚀 Tech Stack

-   **Framework:** [React 18+](https://reactjs.org/)
-   **Build Tool:** [Vite](https://vitejs.dev/)
-   **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) (using the new `@theme` configuration)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
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

4.  **Build for Production:**
    ```bash
    npm run build
    ```

## 📦 Project Structure

```text
app/
├── src/
│   ├── components/     # Reusable UI (Layout, Card, Doodle)
│   ├── pages/          # Page views (Home, Leaderboard, Scores, Stats)
│   ├── lib/            # Data access & utilities
│   ├── types.ts        # TypeScript interfaces
│   ├── league-data.json# Mock database (Source of truth)
│   └── index.css       # Tailwind v4 configuration & Global styles
├── vercel.json         # SPA routing configuration
└── ...
```

## 🌐 Deployment

The site is configured for deployment on [Vercel](https://vercel.com).
-   **Root Directory:** `app`
-   **Build Command:** `npm run build`
-   **Output Directory:** `dist`

## 🇰🇾 Made in Cayman

Made with ❤️ in the Cayman Islands.

## 📄 License

This project is licensed under the MIT License.