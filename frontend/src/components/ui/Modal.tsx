import React from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils/helpers';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, className }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-stone-900/40 backdrop-blur-md transition-opacity" 
        onClick={onClose}
      />
      <div className={cn(
        "relative w-full max-w-lg transform rounded-3xl bg-white p-6 sm:p-8 shadow-card-hover border border-stone-200/90 transition-all animate-scale-in",
        className
      )}>
        <div className="flex items-center justify-between mb-5">
          {title && <h3 className="text-xl font-bold text-stone-900 tracking-tight">{title}</h3>}
          <button
            onClick={onClose}
            className="rounded-full p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};
