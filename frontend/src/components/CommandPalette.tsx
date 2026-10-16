import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  LayoutDashboard,
  Sprout,
  ScrollText,
  ScanLine,
  LineChart,
  BookOpen,
  ClipboardList,
  MessageCircle,
  X,
  ArrowRight,
  SlidersHorizontal
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const commands = [
    {
      category: 'Agronomy Workflows',
      items: [
        { title: 'Recommend Crops for My Soil', desc: 'Run multi-stage AI model calibrated for 50 crops', path: '/input', icon: Sprout },
        { title: 'Calibrate Soil & Microclimate', desc: 'Directly modify N-P-K, pH, and environmental telemetry', path: '/calibrate', icon: SlidersHorizontal },
        { title: 'Advisory Records & Timelines', desc: 'Inspect past seasonal schedules and fertilizer plans', path: '/advisory-history', icon: ScrollText },
        { title: 'Crop Health & Disease Diagnostics', desc: 'Scan visual symptoms and receive treatment plans', path: '/disease', icon: ScanLine },
      ]
    },
    {
      category: 'Market & Governance',
      items: [
        { title: 'Mandi Live Commodity Prices', desc: 'Real-time APMC market arrivals and state rates', path: '/market', icon: LineChart },
        { title: 'Government Schemes & Subsidies', desc: 'Explore PM-Kisan, PMFBY, and solar irrigation aids', path: '/schemes', icon: BookOpen },
      ]
    },
    {
      category: 'Field Operations & AI',
      items: [
        { title: 'Farm Task Checklist', desc: 'Manage seasonal spraying and harvest to-dos', path: '/todos', icon: ClipboardList },
        { title: 'Ask Kisan AI Agronomist', desc: 'Conversational localized agronomic advice', path: '/chatbot', icon: MessageCircle },
        { title: 'Agronomy Dashboard', desc: 'Return to operational summary and field telemetry', path: '/dashboard', icon: LayoutDashboard },
      ]
    }
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // handled by parent or state
        }
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredCategories = commands.map(cat => ({
    ...cat,
    items: cat.items.filter(item =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.desc.toLowerCase().includes(query.toLowerCase())
    )
  })).filter(cat => cat.items.length > 0);

  const handleSelect = (path: string) => {
    onClose();
    navigate(path);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-900/40 backdrop-blur-md transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Palette Card */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-dock border border-stone-200/90 overflow-hidden z-10 animate-slide-up">
        {/* Search Input Bar */}
        <div className="flex items-center px-5 py-4 border-b border-stone-100 bg-[#FAF9F5]">
          <Search className="h-5 w-5 text-stone-400 mr-3 flex-shrink-0" />
          <input
            type="text"
            placeholder="Type a command or search crops, mandi rates, advisory... (ESC to exit)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-stone-900 placeholder:text-stone-400 focus:outline-none text-base font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-stone-400 hover:text-stone-600 rounded-lg"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold text-stone-500 bg-white border border-stone-200 rounded-lg shadow-sm ml-2">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-3.5 space-y-4 custom-scrollbar">
          {filteredCategories.length === 0 ? (
            <div className="py-12 text-center text-stone-500">
              <Sprout className="h-8 w-8 mx-auto text-stone-300 mb-2" />
              <p className="text-sm font-medium">No matching agronomic workflows found.</p>
              <p className="text-xs text-stone-400 mt-1">Try searching for "Wheat", "Mandi", "Advisory", or "Soil".</p>
            </div>
          ) : (
            filteredCategories.map((cat, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400 px-3 pt-1">
                  {cat.category}
                </div>
                <div className="space-y-1">
                  {cat.items.map((item, itemIdx) => (
                    <button
                      key={itemIdx}
                      onClick={() => handleSelect(item.path)}
                      className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-[#FAF9F5] border border-transparent hover:border-stone-200/80 transition-all text-left group active:scale-[0.99]"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="p-2.5 rounded-xl bg-stone-100 group-hover:bg-emerald-700 group-hover:text-white text-stone-600 transition-colors shadow-soft">
                          <item.icon className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-stone-800 group-hover:text-emerald-900 transition-colors">
                            {item.title}
                          </div>
                          <div className="text-xs text-stone-500 font-medium">
                            {item.desc}
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-stone-300 group-hover:text-emerald-700 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info strip */}
        <div className="px-5 py-3 border-t border-stone-100 bg-[#FAF9F5] flex items-center justify-between text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>AI Model Stage: 50 Validated Crops</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Navigation: Click or Enter</span>
          </div>
        </div>
      </div>
    </div>
  );
};
