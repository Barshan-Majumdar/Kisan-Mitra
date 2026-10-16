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
    success: 'bg-green-50 text-green-700 ring-green-600/20',
    warning: 'bg-yellow-50 text-yellow-800 ring-yellow-600/20',
    error: 'bg-red-50 text-red-700 ring-red-600/20',
    info: 'bg-blue-50 text-blue-700 ring-blue-700/10',
    neutral: 'bg-gray-50 text-gray-600 ring-gray-500/10',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs sm:text-sm',
    lg: 'px-3 py-1.5 text-sm sm:text-base',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md font-medium ring-1 ring-inset transition-all',
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
