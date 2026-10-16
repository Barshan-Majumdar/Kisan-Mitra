import React from 'react';
import { cn } from '../../utils/helpers';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  className,
  variant = 'primary',
  size = 'md',
  isLoading,
  children,
  ...props
}) => {
  const variants = {
    primary: 'bg-emerald-700 text-white hover:bg-emerald-800 shadow-soft hover:shadow-card active:bg-emerald-900 border border-emerald-800/40',
    secondary: 'bg-[#F5F5F0] text-stone-800 hover:bg-[#EBEBE3] border border-stone-200/90 active:bg-stone-200',
    outline: 'border border-stone-300/90 bg-white text-stone-700 hover:bg-[#FAF9F5] hover:border-stone-400 active:bg-stone-100 shadow-sm',
    ghost: 'text-stone-600 hover:bg-stone-100/80 hover:text-stone-900 active:bg-stone-200',
    danger: 'bg-rose-600 text-white hover:bg-rose-700 shadow-soft active:bg-rose-800 border border-rose-700',
  };

  const sizes = {
    sm: 'h-9 px-3.5 text-xs sm:text-sm rounded-xl',
    md: 'h-11 px-5 text-sm sm:text-base rounded-2xl',
    lg: 'h-12 px-6 text-base rounded-2xl',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] select-none',
        'min-h-[44px]',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : null}
      {children}
    </button>
  );
};
