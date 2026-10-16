import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  useEffect(() => {
    if (!isOpen) return;

    // Prevent background scrolling when popup is open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Handle Escape key to dismiss
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Full-screen backdrop covering and blurring ENTIRE window including sidebar and header */}
      <div 
        className="fixed inset-0 bg-stone-900/50 backdrop-blur-md transition-opacity duration-300 animate-fade-in" 
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Centered Modal Card */}
      <div className={cn(
        "relative w-full max-w-lg transform rounded-3xl bg-white p-6 sm:p-8 shadow-dock border border-stone-200/90 transition-all animate-scale-in z-10 my-auto",
        className
      )}>
        <div className="flex items-center justify-between mb-5">
          {title && <h3 className="text-xl font-bold text-stone-900 tracking-tight">{title}</h3>}
          <button
            onClick={onClose}
            className="rounded-full p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-600/20 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
};
