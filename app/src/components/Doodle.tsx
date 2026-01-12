import React from 'react';

export const Squiggle: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 20" className={className} preserveAspectRatio="none">
    <path
      d="M0,10 Q25,20 50,10 T100,10"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
    />
  </svg>
);

export const CircleHighlight: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 200 100" className={className} preserveAspectRatio="none">
    <path
      d="M10,50 Q50,5 100,10 Q150,15 190,50 Q180,90 100,90 Q20,90 10,50"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      className="opacity-60"
    />
  </svg>
);

export const Underline: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 200 20" className={className} preserveAspectRatio="none">
    <path
      d="M5,15 Q50,5 100,10 T195,10"
      fill="none"
      stroke="currentColor"
      strokeWidth="6"
      strokeLinecap="round"
      className="opacity-40"
    />
  </svg>
);