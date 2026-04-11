import React from 'react';
import { clsx } from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'primary' | 'highlight';
  title?: string;
}

export const Card: React.FC<CardProps> = ({ children, className, variant = 'default', title, ...props }) => {
  return (
    <div
      className={clsx(
        'editorial-card relative overflow-hidden',
        variant === 'default' && 'bg-surface-container-lowest',
        variant === 'primary' && 'bg-linear-to-br from-primary to-primary-container text-on-primary',
        variant === 'highlight' && 'bg-surface-container-high',
        className
      )}
      {...props}
    >
      {title && (
        <div className={clsx(
          "px-8 py-6",
          variant === 'primary' ? "bg-white/5" : "bg-surface-container-high/50"
        )}>
          <h3 className={clsx(
            "headline-md uppercase tracking-tight",
             variant === 'primary' ? "text-on-primary" : "text-primary"
          )}>
            {title}
          </h3>
        </div>
      )}
      <div className="p-6 md:p-8 h-full flex flex-col relative z-10">{children}</div>
      
      {/* Magazine Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply z-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
    </div>
  );
};
