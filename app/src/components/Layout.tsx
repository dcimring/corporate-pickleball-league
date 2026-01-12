import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Trophy, Activity, Calendar, Users, Menu, X } from 'lucide-react';
import { clsx } from 'clsx';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems = [
    { name: 'Teams', path: '/', icon: Users },
    { name: 'Leaderboard', path: '/leaderboard', icon: Trophy },
    { name: 'Scores', path: '/scores', icon: Calendar },
    { name: 'Statistics', path: '/stats', icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-body">
      {/* Header */}
      <header className="bg-brand-blue text-white shadow-lg sticky top-0 z-50 border-b-4 border-brand-orange">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center gap-3">
              <div className="bg-brand-orange p-2 rounded-lg transform -rotate-3">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <Link to="/" className="font-heading text-2xl tracking-wider uppercase font-bold">
                Corporate <span className="text-brand-orange">League</span>
              </Link>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-8">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={clsx(
                      'flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors duration-200 uppercase tracking-wide',
                      isActive
                        ? 'text-brand-orange'
                        : 'text-slate-300 hover:text-white'
                    )}
                  >
                    <item.icon className={clsx("w-4 h-4", isActive ? "text-brand-orange" : "text-slate-400 group-hover:text-white")} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-slate-300 hover:text-white p-2"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-brand-dark border-t border-slate-700">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={clsx(
                    'flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium',
                    location.pathname === item.path
                      ? 'bg-slate-800 text-brand-orange'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
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
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-brand-blue text-slate-400 py-8 border-t border-slate-700">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="font-heading tracking-wide text-sm">© 2026 Corporate Pickleball League. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};