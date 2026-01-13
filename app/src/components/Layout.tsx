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
    <div className="min-h-screen bg-brand-cream flex flex-col font-body selection:bg-brand-acid selection:text-brand-cream">
      
      {/* Decorative Top Bar */}
      <div className="h-1 bg-gradient-to-r from-brand-acid via-white to-brand-acid w-full"></div>

      {/* Floating Navbar */}
      <header className="sticky top-4 z-50 px-4 mb-8">
        <div className="max-w-6xl mx-auto bg-brand-soft-blue/90 backdrop-blur-md border border-white/10 flex items-center justify-between px-6 py-3 relative shadow-glow">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-brand-acid text-brand-cream p-1 skew-x-[-10deg] group-hover:skew-x-0 transition-transform">
              <Trophy className="h-6 w-6" />
            </div>
            <span className="font-heading text-2xl tracking-wide text-white italic">
              LOCALE <span className="text-brand-acid">LEAGUE</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={clsx(
                    'text-lg font-heading tracking-wider transition-all duration-200 border-b-2 uppercase italic',
                    isActive
                      ? 'text-brand-acid border-brand-acid'
                      : 'text-gray-400 border-transparent hover:text-white hover:border-white/50'
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
            className="md:hidden p-2 text-brand-acid hover:bg-white/10"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 px-4 md:hidden">
            <div className="bg-brand-soft-blue border border-brand-acid p-2 flex flex-col gap-1 shadow-glow">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={clsx(
                    'flex items-center gap-3 px-4 py-3 font-heading text-xl italic tracking-wide transition-colors',
                    location.pathname === item.path
                      ? 'bg-brand-acid text-brand-cream'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
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
      <footer className="mt-auto border-t border-white/10 bg-brand-soft-blue py-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h3 className="font-heading text-3xl text-white italic tracking-wide">
              GAME ON <span className="text-brand-acid">///</span>
            </h3>
            <p className="font-body text-gray-400 mt-2">See you on the court.</p>
          </div>
          <div className="text-center md:text-right flex flex-col items-center md:items-end gap-2">
            <div className="text-sm text-gray-500 font-mono">
              © 2026 Corporate Pickleball League
            </div>
            <div className="flex items-center gap-1.5 text-sm text-gray-400">
              Made in Cayman with 
              <Heart className="w-4 h-4 text-brand-acid fill-brand-acid animate-pulse" /> 
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};