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
            'block w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500 sm:text-sm transition-all duration-200',
            'min-h-[44px]', // Touch-friendly minimum height
            icon && 'pl-11',
            error && 'border-red-300 focus:border-red-500 focus:ring-red-500',
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
