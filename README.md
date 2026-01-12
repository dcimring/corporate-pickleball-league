# Corporate Pickleball League Website

A modern, responsive website for the Corporate Pickleball League, built with React, TypeScript, and Tailwind CSS.

## Features

*   **Division Schedules:** View playing times and team rosters for all divisions.
*   **Leaderboards:** Up-to-date standings with win percentages and point differentials.
*   **Match Scores:** Recent game results with visual scorecards.
*   **Statistics:** Advanced analytics for teams and players (e.g., win streaks, aces).
*   **Responsive Design:** Optimized for desktop and mobile viewing.

## Technology Stack

*   **Framework:** [Vite](https://vitejs.dev/) + [React](https://reactjs.org/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
*   **Routing:** [React Router](https://reactrouter.com/)
*   **Icons:** [Lucide React](https://lucide.dev/)

## Getting Started

### Prerequisites

*   Node.js (v18 or higher)
*   npm

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/YOUR_USERNAME/corporate-pickleball-league.git
    cd corporate-pickleball-league/app
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Start the development server:
    ```bash
    npm run dev
    ```

4.  Open `http://localhost:5173` (or the port shown in your terminal) to view the app.

## Project Structure

```
app/
├── src/
│   ├── components/     # Reusable UI components
│   ├── lib/            # Utilities and Data access
│   ├── pages/          # Page components
│   ├── types.ts        # TypeScript interfaces
│   ├── league-data.json# Mock database
│   ├── App.tsx         # Main Routing
│   └── index.css       # Global styles & Tailwind Config
├── public/
└── ...
```

## License

This project is licensed under the MIT License.
