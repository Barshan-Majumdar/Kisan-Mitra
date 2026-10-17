import React from 'react';
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
  Activity,
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
          className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Floating Curved Navigation Island */}
      <aside
        className={`
          fixed top-3.5 left-3.5 bottom-3.5 w-72 bg-[#FAF9F5] border border-stone-200/90 shadow-island rounded-[2.5rem] z-30 flex flex-col justify-between p-4 transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-[calc(100%+1.5rem)] lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col space-y-4">
          {/* Brand Card Header */}
          <div className="p-3.5 rounded-3xl bg-white border border-stone-200/80 shadow-soft flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-[#0c261b] to-emerald-700 flex items-center justify-center text-white shadow-soft">
                <Sprout className="h-5 w-5 text-emerald-300" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-extrabold text-stone-900 tracking-tight">Kisan Mitra</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                </div>
                <div className="text-[10px] font-semibold tracking-wider text-emerald-800 uppercase">
                  Enterprise AI v2.6
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-2 hover:bg-stone-100 rounded-xl transition-colors text-stone-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Quick Command Bar Trigger */}
          {onOpenCommandPalette && (
            <button
              onClick={() => {
                setIsOpen(false);
                onOpenCommandPalette();
              }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-white/70 hover:bg-white border border-stone-200/80 hover:border-emerald-300 text-stone-500 hover:text-stone-800 text-xs font-semibold shadow-soft transition-all active:scale-[0.98] group"
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
          <nav className="space-y-1 overflow-y-auto max-h-[calc(100vh-320px)] custom-scrollbar pr-1">
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
        <div className="space-y-3 pt-3 border-t border-stone-200/70">
          {/* Telemetry Status Capsule */}
          <div className="p-3 rounded-2xl bg-white border border-stone-200/80 shadow-soft space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-bold text-stone-700">
              <span className="flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5 text-emerald-600" />
                Agronomy Sensors
              </span>
              <span className="text-emerald-700 font-mono text-[10px] bg-emerald-50 px-1.5 py-0.5 rounded-full">
                ONLINE
              </span>
            </div>
            <div className="text-[10px] text-stone-500 font-medium">
              50 Models Synchronized • Kharif 2026
            </div>
          </div>

          {/* Language Switcher */}
          <div className="flex justify-center">
            <LanguageToggle />
          </div>
        </div>
      </aside>
    </>
  );
};
