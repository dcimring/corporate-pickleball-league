import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

export const PageTabs: React.FC = () => {
  const location = useLocation();
  
  // Use URLSearchParams to preserve the division param
  const searchParams = new URLSearchParams(location.search);
  const divisionParam = searchParams.get('division');
  const queryStr = divisionParam ? `?division=${encodeURIComponent(divisionParam)}` : '';

  const tabs = [
    { name: 'Leaderboard', path: '/leaderboard' },
    { name: 'Matches', path: '/matches' },
  ];

  return (
    <div className="flex gap-4 md:gap-6 mb-4">
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.path;
        return (
          <Link
            key={tab.name}
            to={`${tab.path}${queryStr}`}
            className={clsx(
              "relative pb-2 text-xl md:text-2xl font-heading font-bold uppercase tracking-wide transition-colors",
              isActive ? "text-brand-blue" : "text-gray-400 hover:text-gray-600"
            )}
          >
            {tab.name}
            {isActive && (
              <motion.div
                layoutId="page-tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-[3px] bg-brand-blue rounded-full"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </Link>
        );
      })}
    </div>
  );
};
