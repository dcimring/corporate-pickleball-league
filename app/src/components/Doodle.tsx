import React from 'react';

export const Squiggle: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 20" className={className} preserveAspectRatio="none">
    <path
      d="M0,20 L20,0 L40,20 L60,0 L80,20 L100,0"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinejoin="round"
    />
  </svg>
);

export const CircleHighlight: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 200 100" className={className} preserveAspectRatio="none">
    {/* Sharp Brackets */}
    <path
      d="M20,20 L0,20 L0,80 L20,80 M180,20 L200,20 L200,80 L180,80"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      className="opacity-80"
    />
  </svg>
);

export const Underline: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 200 20" className={className} preserveAspectRatio="none">
    <rect
      x="0" y="0" width="200" height="20"
      fill="currentColor"
      className="opacity-30 skew-x-[-20deg]"
    />
  </svg>
);