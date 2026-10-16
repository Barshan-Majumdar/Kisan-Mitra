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
  MessageCircle
} from 'lucide-react';
import { LanguageToggle } from '../LanguageToggle';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const { t } = useTranslation();
  const menuItems = [
    { icon: LayoutDashboard, label: t('dashboard'), path: '/dashboard' },
    { icon: Sprout, label: t('crops'), path: '/input' },
    { icon: ScrollText, label: t('advisory'), path: '/advisory-history' },
    { icon: ScanLine, label: t('disease_detect'), path: '/disease' },
    { icon: LineChart, label: t('market'), path: '/market' },
    { icon: BookOpen, label: t('schemes'), path: '/schemes' },
    { icon: ClipboardList, label: t('tasks'), path: '/todos' },
    { icon: MessageCircle, label: t('chatbot'), path: '/chatbot' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 z-50 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Sprout className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary-700 to-primary-500 bg-clip-text text-transparent">Kisan Mitra</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1 custom-scrollbar">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                  ${isActive
                    ? 'bg-primary-50 text-primary-700 font-medium shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100/80 hover:text-gray-900'
                  }
                `}
              >
                <item.icon className="h-5 w-5 transition-colors group-hover:text-primary-600" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-100 space-y-4">
            <div className="flex justify-center">
              <LanguageToggle />
            </div>

          </div>
        </div>
      </aside>
    </>
  );
};
