import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { CommandPalette } from '../components/CommandPalette';

export const MainLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // Global keyboard shortcut (⌘K / Ctrl+K) to toggle the Command Palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="h-screen w-full bg-[#F4F3EE] text-stone-800 selection:bg-emerald-100 selection:text-emerald-900 p-0 lg:p-3.5 flex flex-col lg:flex-row overflow-hidden transition-all duration-300">
      {/* Floating Curved Navigation Island */}
      <Sidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
      />

      {/* Detached Workspace Column */}
      <div className="flex-1 lg:ml-[19.25rem] h-full lg:h-[calc(100vh-1.75rem)] flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Navigation Bar Section */}
        <Header
          onMenuClick={() => setSidebarOpen((prev) => !prev)}
          isSidebarOpen={sidebarOpen}
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        />

        {/* Modern Curved Stage Canvas (Detached Floating Workspace) */}
        <div className="flex-1 min-h-0 bg-white rounded-none lg:rounded-[1.375rem] border-0 lg:border border-stone-200/90 shadow-none lg:shadow-island flex flex-col overflow-hidden relative transition-all duration-300">
          <main className="flex-1 overflow-y-auto p-2.5 sm:p-3.5 lg:p-4 custom-scrollbar">
            <div className="mx-auto max-w-7xl pb-4">
              <Outlet />
            </div>
          </main>
        </div>
      </div>

      {/* Interactive Global Command Palette (⌘K) */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />
    </div>
  );
};
