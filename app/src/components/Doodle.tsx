import React from 'react';

export const Squiggle: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 20" className={className} preserveAspectRatio="none">
    <path
      d="M0,10 Q25,0 50,10 T100,10"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
      className="opacity-20"
    />
  </svg>
);

export const CircleHighlight: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 200 100" className={className} preserveAspectRatio="none">
    {/* Refined Bracket / Corner Focus */}
    <path
      d="M40,10 L10,10 L10,90 L40,90 M160,10 L190,10 L190,90 L160,90"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="opacity-30"
    />
  </svg>
);

export const Underline: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 200 20" className={className} preserveAspectRatio="none">
    <rect
      x="0" y="5" width="200" height="10"
      fill="currentColor"
      className="opacity-10"
    />
  </svg>
);