import React from 'react';

export interface SectionHeadingProps {
  children: React.ReactNode;
  accent?: 'blue' | 'rose';
  className?: string;
}

const ACCENT_CLASSES = {
  blue: 'border-blue-600',
  rose: 'border-rose-600',
};

export default function SectionHeading({ children, accent = 'blue', className = '' }: SectionHeadingProps) {
  return (
    <h3 className={`text-xs font-bold uppercase tracking-wide text-slate-800 dark:text-slate-200 mb-3 border-l-2 pl-2 ${ACCENT_CLASSES[accent]} ${className}`}>
      {children}
    </h3>
  );
}
