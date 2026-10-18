import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  Sprout,
  ScanLine,
  LineChart,
  BookOpen,
  ClipboardList,
  X,
  ScrollText,
  MessageCircle,
  Command,
  Sparkles
} from 'lucide-react';
import { LanguageToggle } from '../LanguageToggle';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onOpenCommandPalette?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen, onOpenCommandPalette }) => {
  const { t } = useTranslation();

  // Escape key to close mobile drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, setIsOpen]);

  // Lock body scroll when mobile drawer is open to prevent page shifting
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Clean up drawer state if window is resized to desktop (>= 1024px)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen, setIsOpen]);
  
  const menuItems = [
    { icon: LayoutDashboard, label: t('dashboard'), path: '/dashboard', badge: 'Live' },
    { icon: Sprout, label: t('crops'), path: '/input', badge: '50 Crops' },
    { icon: Sparkles, label: t('recommendations'), path: '/recommendations', badge: 'History' },
    { icon: ScrollText, label: t('advisory'), path: '/advisory-history' },
    { icon: ScanLine, label: t('disease_detect'), path: '/disease' },
    { icon: LineChart, label: t('market'), path: '/market', badge: 'APMC' },
    { icon: BookOpen, label: t('schemes'), path: '/schemes' },
    { icon: ClipboardList, label: t('tasks'), path: '/todos' },
    { icon: MessageCircle, label: t('chatbot'), path: '/chatbot', badge: 'AI' },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Floating Curved Navigation Island / Mobile Drawer */}
      <aside
        id="main-sidebar"
        role="dialog"
        aria-modal={isOpen ? "true" : undefined}
        aria-label="Main Navigation"
        className={`
          fixed top-3.5 left-3.5 bottom-3.5 w-72 max-w-[calc(100vw-1.75rem)] bg-[#FAF9F5] border border-stone-200/90 shadow-island rounded-[1.25rem] z-50 flex flex-col justify-between p-3.5 sm:p-4 transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-[calc(100%+2rem)] lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col space-y-3 sm:space-y-4 flex-1 min-h-0 overflow-hidden">
          {/* Brand Card Header */}
          <div className="p-3 sm:p-3.5 rounded-3xl bg-white border border-stone-200/80 shadow-soft flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <Sprout className="h-6 w-6 sm:h-7 sm:w-7 text-emerald-700 shrink-0" />
              <div className="flex items-center gap-1.5">
                <span className="text-sm sm:text-base font-extrabold text-stone-900 tracking-tight whitespace-nowrap">Kisan Mitra</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-2 hover:bg-stone-100 rounded-xl transition-colors text-stone-500 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 cursor-pointer"
              aria-label="Close navigation"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          {/* Quick Command Bar Trigger */}
          {onOpenCommandPalette && (
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onOpenCommandPalette();
              }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-white/70 hover:bg-white border border-stone-200/80 hover:border-emerald-300 text-stone-500 hover:text-stone-800 text-xs font-semibold shadow-soft transition-all active:scale-[0.98] group shrink-0"
            >
              <div className="flex items-center gap-2">
                <Command className="h-3.5 w-3.5 text-stone-400 group-hover:text-emerald-700 transition-colors" />
                <span>Command Menu</span>
              </div>
              <kbd className="px-1.5 py-0.5 rounded-md bg-stone-100 text-[10px] font-mono border border-stone-200 text-stone-600">
                ⌘K
              </kbd>
            </button>
          )}

          {/* Navigation Links */}
          <nav className="space-y-1 overflow-y-auto flex-1 min-h-0 custom-scrollbar pr-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => `
                  flex items-center justify-between px-3.5 py-2.5 rounded-2xl transition-all duration-200 group text-xs font-semibold
                  ${isActive
                    ? 'bg-emerald-800 text-white shadow-soft font-bold'
                    : 'text-stone-600 hover:bg-white hover:text-stone-900 border border-transparent hover:border-stone-200/60'
                  }
                `}
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <item.icon
                        className={`h-4 w-4 transition-transform duration-200 group-hover:scale-110 ${
                          isActive ? 'text-emerald-300' : 'text-stone-500 group-hover:text-stone-800'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider transition-colors ${
                          isActive
                            ? 'bg-emerald-950/60 text-emerald-200 border border-emerald-700/50'
                            : 'bg-stone-200/60 text-stone-600 group-hover:bg-emerald-50 group-hover:text-emerald-800'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom Micro-Dock */}
        <div className="pt-3 border-t border-stone-200/70 shrink-0">
          {/* Language Switcher */}
          <div className="flex justify-center">
            <LanguageToggle />
          </div>
        </div>
      </aside>
    </>
  );
};
