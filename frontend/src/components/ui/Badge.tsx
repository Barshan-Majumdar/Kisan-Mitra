import React from 'react';
import { cn } from '../../utils/helpers.ts';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
}

export const Badge: React.FC<BadgeProps> = ({ 
  className, 
  variant = 'neutral',
  size = 'md',
  children, 
  ...props 
}) => {
  const variants = {
    success: 'bg-emerald-50 text-emerald-800 ring-emerald-600/25 border border-emerald-200/60',
    warning: 'bg-amber-50 text-amber-800 ring-amber-600/25 border border-amber-200/60',
    error: 'bg-rose-50 text-rose-800 ring-rose-600/25 border border-rose-200/60',
    info: 'bg-sky-50 text-sky-800 ring-sky-600/25 border border-sky-200/60',
    neutral: 'bg-[#F5F5F0] text-stone-700 ring-stone-400/20 border border-stone-200',
  };

  const sizes = {
    sm: 'px-2.5 py-0.5 text-xs font-semibold',
    md: 'px-3 py-1 text-xs sm:text-sm font-semibold',
    lg: 'px-3.5 py-1.5 text-sm font-semibold',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium tracking-tight transition-all',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
