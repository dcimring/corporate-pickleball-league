import React from 'react';
import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'blue' | 'acid';
  title?: string;
}

export const Card: React.FC<CardProps> = ({ children, className, variant = 'default', title }) => {
  return (
    <div
      className={clsx(
        'relative rounded-2xl border-2 border-brand-ink transition-transform hover:-translate-y-1 hover:shadow-hard-sm duration-200',
        variant === 'default' && 'bg-white shadow-hard',
        variant === 'blue' && 'bg-brand-soft-blue shadow-hard',
        variant === 'acid' && 'bg-brand-acid shadow-hard',
        className
      )}
    >
      {title && (
        <div className="border-b-2 border-brand-ink px-6 py-4 bg-white/50 rounded-t-xl backdrop-blur-sm">
          <h3 className="font-heading text-xl font-bold uppercase tracking-tight">{title}</h3>
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
};