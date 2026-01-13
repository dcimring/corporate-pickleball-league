import React from 'react';
import { clsx } from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'blue' | 'acid';
  title?: string;
}

export const Card: React.FC<CardProps> = ({ children, className, variant = 'default', title, ...props }) => {
  return (
    <div
      className={clsx(
        'relative border-2 transition-transform hover:-translate-y-1 hover:shadow-glow duration-200',
        variant === 'default' && 'bg-brand-soft-blue border-white/20 hover:border-brand-acid text-white',
        variant === 'blue' && 'bg-slate-800 border-brand-acid text-white shadow-hard-sm',
        variant === 'acid' && 'bg-brand-acid border-white text-brand-cream',
        className
      )}
      {...props}
    >
      {title && (
        <div className={clsx(
          "border-b-2 px-6 py-4 backdrop-blur-sm",
          variant === 'acid' ? "border-brand-cream/20 bg-brand-acid" : "border-white/10 bg-black/20"
        )}>
          <h3 className="font-heading text-2xl font-normal uppercase italic tracking-wider">{title}</h3>
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
};