import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

interface PageTabsProps {
  variant?: 'neon-pill' | 'minimal-glow' | 'floating-card';
}

export const PageTabs: React.FC<PageTabsProps> = ({ variant = 'neon-pill' }) => {
  const location = useLocation();
  
  // Use URLSearchParams to preserve the division param
  const searchParams = new URLSearchParams(location.search);
  const divisionParam = searchParams.get('division');
  const queryStr = divisionParam ? `?division=${encodeURIComponent(divisionParam)}` : '';

  const tabs = [
    { name: 'Leaderboard', path: '/leaderboard' },
    { name: 'Matches', path: '/matches' },
  ];

  // Variant 1: Neon Pill (High energy, contained)
  if (variant === 'neon-pill') {
    return (
      <div className="flex items-center gap-2 mb-4 px-6">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          return (
            <Link
              key={tab.name}
              to={`${tab.path}${queryStr}`}
              className="relative group"
            >
              <div className={clsx(
                "relative z-10 px-6 py-2.5 rounded-full font-heading font-bold uppercase tracking-wider text-sm transition-all duration-300 border",
                isActive 
                  ? "text-brand-blue border-transparent" 
                  : "text-gray-400 border-gray-100 group-hover:text-brand-blue group-hover:border-gray-200"
              )}>
                {tab.name}
              </div>
              {isActive && (
                <motion.div
                  layoutId="neon-pill-bg"
                  className="absolute inset-0 bg-brand-yellow rounded-full shadow-[0_0_15px_rgba(204,255,0,0.4)] z-0"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    );
  }

  // Variant 2: Minimal Glow (Clean, text-focused, subtle alignment)
  if (variant === 'minimal-glow') {
    return (
      <div className="flex items-end gap-8 mb-6 px-4 md:px-6 border-b border-gray-100">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          return (
            <Link
              key={tab.name}
              to={`${tab.path}${queryStr}`}
              className={clsx(
                "relative pb-3 text-2xl md:text-3xl font-heading font-black italic uppercase tracking-tight transition-colors duration-300",
                isActive ? "text-brand-blue" : "text-gray-300 hover:text-gray-400"
              )}
            >
              <span className={isActive ? "text-shadow-sm" : ""}>{tab.name}</span>
              {isActive && (
                <motion.div
                  layoutId="minimal-glow-line"
                  className="absolute bottom-0 left-0 right-0 h-[4px] bg-brand-blue shadow-[0_0_10px_rgba(15,23,42,0.3)] rounded-t-sm"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    );
  }

  // Variant 3: Floating Card (Distinct, button-like, separated)
  if (variant === 'floating-card') {
    return (
      <div className="flex gap-3 mb-6 px-2">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          return (
            <Link
              key={tab.name}
              to={`${tab.path}${queryStr}`}
              className={clsx(
                "relative overflow-hidden px-6 py-3 rounded-xl border font-heading font-bold uppercase tracking-wider text-sm transition-all duration-200",
                isActive 
                  ? "bg-brand-blue border-brand-blue text-white shadow-lg translate-y-[-2px]" 
                  : "bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:text-brand-blue hover:shadow-sm"
              )}
            >
              <span className="relative z-10">{tab.name}</span>
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
              )}
            </Link>
          );
        })}
      </div>
    );
  }

  return null;
};