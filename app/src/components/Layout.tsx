import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Trophy, Activity, Calendar, Users, Menu, X, Heart } from 'lucide-react';
import { clsx } from 'clsx';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems = [
    { name: 'Teams', path: '/', icon: Users },
    { name: 'Leaderboard', path: '/leaderboard', icon: Trophy },
    { name: 'Scores', path: '/scores', icon: Calendar },
    { name: 'Stats', path: '/stats', icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-brand-cream flex flex-col font-body selection:bg-brand-acid selection:text-brand-ink">
      
      {/* Decorative Top Bar */}
      <div className="h-2 bg-brand-ink w-full"></div>

      {/* Floating Navbar */}
      <header className="sticky top-4 z-50 px-4 mb-8">
        <div className="max-w-4xl mx-auto bg-white border-2 border-brand-ink rounded-full shadow-hard flex items-center justify-between px-6 py-3 relative">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-brand-acid border-2 border-brand-ink p-1.5 rounded-lg transform -rotate-6 group-hover:rotate-0 transition-transform">
              <Trophy className="h-5 w-5 text-brand-ink" />
            </div>
            <span className="font-heading font-bold text-xl tracking-tight text-brand-ink">
              CORP<span className="text-brand-orange">LEAGUE</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={clsx(
                    'px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 border-2 border-transparent',
                    isActive
                      ? 'bg-brand-soft-blue text-brand-ink border-brand-ink'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-brand-ink'
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-brand-ink hover:bg-gray-100 rounded-full"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 px-4 md:hidden">
            <div className="bg-white border-2 border-brand-ink rounded-2xl shadow-hard p-2 flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={clsx(
                    'flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors',
                    location.pathname === item.path
                      ? 'bg-brand-soft-blue text-brand-ink border-2 border-brand-ink'
                      : 'text-gray-600 hover:bg-gray-50'
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow w-full max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t-2 border-brand-ink bg-white py-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h3 className="font-heading text-2xl font-bold text-brand-ink">GET YOUR GAME ON.</h3>
            <p className="font-hand text-xl text-gray-500 rotate-1 mt-2">Don't forget to hydrate!</p>
          </div>
          <div className="text-center md:text-right flex flex-col items-center md:items-end gap-2">
            <div className="text-sm font-bold text-gray-400">
              © 2026 Corporate Pickleball League
            </div>
            <div className="flex items-center gap-1.5 text-sm font-bold text-brand-ink/60 font-hand text-lg">
              Made in Cayman with 
              <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" /> 
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};