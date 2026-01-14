import React from 'react';
import { clsx } from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'blue' | 'highlight';
  title?: string;
}

export const Card: React.FC<CardProps> = ({ children, className, variant = 'default', title, ...props }) => {
  return (
    <div
      className={clsx(
        'card-modern relative overflow-hidden',
        variant === 'default' && 'bg-white border-gray-100',
        variant === 'blue' && 'bg-brand-blue text-white border-transparent',
        variant === 'highlight' && 'bg-brand-light-blue border-brand-blue/10',
        className
      )}
      {...props}
    >
      {title && (
        <div className={clsx(
          "px-6 py-5 border-b",
          variant === 'blue' ? "border-white/10" : "border-gray-100",
          variant === 'highlight' && "border-blue-200"
        )}>
          <h3 className={clsx(
            "font-heading text-lg font-bold uppercase tracking-wide",
             variant === 'blue' ? "text-white" : "text-brand-blue"
          )}>
            {title}
          </h3>
        </div>
      )}
      <div className="p-6 h-full flex flex-col">{children}</div>
    </div>
  );
};
