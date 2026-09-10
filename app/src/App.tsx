import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Leaderboard } from './pages/Leaderboard';
import { Matches } from './pages/Matches';
import { ScrollToTop } from './components/ScrollToTop';
import { LeagueProvider } from './context/LeagueContext';
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <ErrorBoundary>
        <LeagueProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Navigate to="/leaderboard" replace />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/matches" element={<Matches />} />
            </Routes>
          </Layout>
        </LeagueProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;