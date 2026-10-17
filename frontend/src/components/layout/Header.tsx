import { Menu, Bell, Sprout, Search } from 'lucide-react';
import { UserButton, useUser } from '@clerk/clerk-react';
import { useWeather } from '../../context/WeatherContext';
import { WeatherIcon } from '../WeatherIcon';

interface HeaderProps {
  onMenuClick: () => void;
  onOpenCommandPalette?: () => void;
}

export const Header = ({ onMenuClick, onOpenCommandPalette }: HeaderProps) => {
  const { user } = useUser();
  const weather = useWeather();

  return (
    <header className="sticky top-0 z-30 shrink-0 flex h-16 items-center justify-between border border-stone-200/80 bg-white/95 backdrop-blur-md px-4 sm:px-6 transition-all duration-300 shadow-soft mx-2.5 mt-2.5 mb-2 sm:mx-3 sm:mt-3 sm:mb-2.5 lg:mx-0 lg:mt-0 lg:mb-3" style={{ borderRadius: 'clamp(14px, 1.25vw, 20px)' }}>
      {/* Left Area: Mobile Menu Toggle & Brand / Desktop Breadcrumb */}
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger */}
        <button
          type="button"
          className="p-2 text-stone-700 lg:hidden hover:text-emerald-700 transition-colors rounded-2xl bg-stone-100 hover:bg-stone-200/60"
          onClick={onMenuClick}
        >
          <span className="sr-only">Open sidebar</span>
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>

        {/* Mobile Brand Title */}
        <div className="flex lg:hidden items-center gap-2">
          <div className="bg-emerald-700 p-1.5 rounded-xl text-white shadow-soft">
            <Sprout className="h-4 w-4" />
          </div>
          <span className="text-base font-extrabold text-stone-900 tracking-tight">Kisan Mitra</span>
        </div>

        {/* Desktop Breadcrumb & Season Status */}
        <div className="hidden lg:flex items-center gap-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FAF9F5] border border-stone-200/80 text-xs font-semibold text-stone-700 shadow-soft">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Agronomic Workspace</span>
            <span className="text-stone-300">•</span>
            <span className="text-emerald-800 font-bold">
              {weather.isLiveLocation ? (weather.district ? `${weather.district}, ${weather.state || 'India'}` : weather.locationName) : 'Kharif 2026'}
            </span>
          </div>
        </div>
      </div>

      {/* Center Area: Modern Command Search Pill (Linear / Raycast Style) */}
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <button
          type="button"
          onClick={onOpenCommandPalette}
          className="w-full flex items-center justify-between px-4 py-2 rounded-2xl bg-[#FAF9F5] hover:bg-white border border-stone-200/80 hover:border-emerald-300 text-stone-400 hover:text-stone-700 text-xs font-medium shadow-soft transition-all group"
        >
          <div className="flex items-center gap-2.5">
            <Search className="h-4 w-4 text-stone-400 group-hover:text-emerald-700 transition-colors" />
            <span>Search 50 crops, mandi rates, disease diagnostic...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono font-bold text-stone-500 bg-white border border-stone-200 rounded-md shadow-sm">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Area: Telemetry, Notifications & User Pill */}
      <div className="flex items-center gap-3">
        {/* Mobile Search Button */}
        <button
          type="button"
          onClick={onOpenCommandPalette}
          className="md:hidden p-2 text-stone-600 hover:text-emerald-800 bg-[#FAF9F5] border border-stone-200/80 rounded-2xl shadow-soft"
        >
          <Search className="h-4 w-4" />
        </button>

        {/* Live Weather Capsule (Open-Meteo Dynamic Telemetry) */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FAF9F5] border border-stone-200/80 text-xs font-semibold text-stone-700 shadow-soft">
          <WeatherIcon
            weatherCode={weather.weatherCode}
            isDay={weather.isDay}
            size="sm"
            showContainer={false}
          />
          <span className="font-mono">{weather.temperature.toFixed(1)}°C</span>
          <span className="text-stone-300">•</span>
          <span className="text-stone-500 font-mono text-[11px]">{weather.humidity}% Hum</span>
          {weather.isLiveLocation && (
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200/60">
              {weather.district}
            </span>
          )}
        </div>

        {/* Notification Bell */}
        <button
          type="button"
          className="p-2.5 text-stone-600 hover:text-emerald-800 bg-white hover:bg-[#FAF9F5] border border-stone-200/80 rounded-2xl shadow-soft transition-all active:scale-95 relative"
        >
          <span className="sr-only">View notifications</span>
          <Bell className="h-4 w-4" aria-hidden="true" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-emerald-600 ring-2 ring-white"></span>
        </button>

        {/* Farmer Profile Pill */}
        <div className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-[#FAF9F5] border border-stone-200/90 shadow-soft hover:border-stone-300 transition-all">
          <UserButton afterSignOutUrl="/login" />
          <div className="hidden sm:flex flex-col text-left pr-1">
            <span className="text-xs font-bold text-stone-800 leading-tight">
              {user?.firstName || 'Farmer'}
            </span>
            <span className="text-[10px] text-emerald-800 font-semibold">Verified Field</span>
          </div>
        </div>
      </div>
    </header>
  );
};
