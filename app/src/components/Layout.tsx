import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Trophy, Activity, Calendar, Users, Menu, X } from 'lucide-react';
import { clsx } from 'clsx';
import logo from '../assets/pickball_cayman_logo.png';

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
    <div className="min-h-screen flex flex-col font-body selection:bg-brand-yellow selection:text-brand-blue">
      
      {/* Navbar */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img className="h-12 w-auto md:h-16" src={logo} alt="Pickleball Cayman" />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              <nav className="flex space-x-6">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={clsx(
                        'text-sm font-heading font-bold uppercase tracking-wide transition-colors duration-200',
                        isActive
                          ? 'text-brand-blue'
                          : 'text-gray-500 hover:text-brand-blue'
                      )}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
              
              <button className="btn-primary py-2 px-6 text-xs md:text-sm shadow-none hover:shadow-md">
                Login / Sign Up
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-gray-500 hover:text-brand-blue focus:outline-none"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={clsx(
                    'flex items-center gap-3 px-3 py-4 text-base font-heading font-bold uppercase tracking-wide',
                    location.pathname === item.path
                      ? 'text-brand-blue bg-blue-50'
                      : 'text-gray-600 hover:text-brand-blue hover:bg-gray-50'
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              ))}
              <div className="px-3 py-4">
                 <button className="w-full btn-primary py-3">
                  Login / Sign Up
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-brand-blue text-white pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
             {/* Address */}
             <div className="text-center md:text-left">
                <h4 className="font-heading font-bold text-lg mb-4 text-white uppercase tracking-wider">Address</h4>
                <p className="text-blue-100 text-sm leading-relaxed">
                  312 Smith Rd, George Town<br/>
                  Cayman Islands
                </p>
             </div>

             {/* Contact */}
             <div className="text-center">
                <h4 className="font-heading font-bold text-lg mb-4 text-white uppercase tracking-wider">Contact</h4>
                <p className="text-blue-100 text-sm leading-relaxed">
                  +1 (345) 927-7511<br/>
                  info@pickleball.ky
                </p>
             </div>
             
             {/* Social/Weather Placeholder */}
             <div className="text-center md:text-right">
                <h4 className="font-heading font-bold text-lg mb-4 text-white uppercase tracking-wider">Weather</h4>
                <div className="flex items-center justify-center md:justify-end gap-2 text-brand-yellow">
                   <span className="text-3xl font-light">28°C</span>
                   <span className="text-sm uppercase tracking-widest text-white">Sunny</span>
                </div>
             </div>
          </div>
          
          <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-blue-200">
            <p>© 2026 Pickleball Cayman Ltd - All Rights Reserved</p>
            <div className="flex gap-4">
               <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
               <a href="#" className="hover:text-white transition-colors">Liability Waiver</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
