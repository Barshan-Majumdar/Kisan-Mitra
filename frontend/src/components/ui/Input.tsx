import React from 'react';
import { cn } from '../../utils/helpers';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ className, label, error, icon, ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          className={cn(
            'block w-full rounded-2xl border border-stone-200/90 bg-[#FAF9F5] px-4 py-3 text-stone-900 placeholder:text-stone-400 focus:border-emerald-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-600/10 sm:text-sm transition-all duration-200',
            'min-h-[44px]',
            icon && 'pl-11',
            error && 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/10',
            className
          )}
          {...props}
        />
        {icon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 pointer-events-none">
            {icon}
          </div>
        )}
      </div>
      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>
  );
};
