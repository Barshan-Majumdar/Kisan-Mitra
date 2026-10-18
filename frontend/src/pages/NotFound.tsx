import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, ArrowLeft, LayoutDashboard, TrendingUp, Home } from 'lucide-react';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F4F3EE] text-stone-900 font-sans flex flex-col justify-between selection:bg-emerald-100 selection:text-emerald-900 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-80px] left-[20%] w-[380px] h-[380px] rounded-full bg-emerald-300/20 blur-[100px]" />
        <div className="absolute top-[60px] right-[15%] w-[420px] h-[420px] rounded-full bg-amber-200/20 blur-[110px]" />
      </div>

      {/* Mini Brand Bar */}
      <header className="pt-6 sm:pt-8 px-6 max-w-6xl mx-auto w-full flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group cursor-pointer">
          <Sprout className="h-6 w-6 text-emerald-700 group-hover:scale-110 transition-transform duration-200" />
          <span className="font-display text-lg font-medium tracking-tight text-stone-900">
            Kisan Mitra
          </span>
        </Link>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-emerald-800 transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </button>
      </header>

      {/* Main 404 Hero Card */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12">
        <div className="max-w-lg w-full text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-stone-200/90 shadow-soft text-xs font-mono font-bold text-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span>ERROR 404 • ROUTE UNREACHABLE</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl font-normal tracking-tight text-stone-950 text-balance leading-tight">
            Field Boundary <br />
            <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-emerald-800 via-emerald-700 to-lime-700">
              Not Found.
            </span>
          </h1>

          <p className="text-stone-600 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
            The agronomic page you are seeking does not exist or has been rotated to another furrow in our telemetry network.
          </p>

          {/* Quick Action Navigation Pills */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs font-bold text-white bg-gradient-to-r from-emerald-800 to-emerald-900 hover:from-emerald-700 hover:to-emerald-800 shadow-[0_4px_14px_rgba(22,101,52,0.3)] transition-all active:scale-95"
            >
              <Home className="h-3.5 w-3.5" />
              <span>Return Home</span>
            </Link>
            <Link
              to="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs font-bold text-stone-700 hover:text-stone-900 bg-white hover:bg-stone-50 border border-stone-200/90 shadow-soft transition-all active:scale-95"
            >
              <LayoutDashboard className="h-3.5 w-3.5 text-emerald-700" />
              <span>Workspace</span>
            </Link>
            <Link
              to="/market"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs font-bold text-stone-700 hover:text-stone-900 bg-white hover:bg-stone-50 border border-stone-200/90 shadow-soft transition-all active:scale-95"
            >
              <TrendingUp className="h-3.5 w-3.5 text-emerald-700" />
              <span>Mandi Rates</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-stone-500">
        © 2026 Kisan Mitra Agronomy Intelligence
      </footer>
    </div>
  );
};
