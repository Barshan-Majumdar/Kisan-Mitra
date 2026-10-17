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
    <header className="sticky top-0 z-30 shrink-0 flex h-16 items-center justify-between border border-stone-200/80 bg-white/95 backdrop-blur-md px-3 sm:px-4 lg:px-5 transition-all duration-300 shadow-soft mx-2.5 mt-2.5 mb-2 sm:mx-3 sm:mt-3 sm:mb-2.5 lg:mx-0 lg:mt-0 lg:mb-3 min-w-0" style={{ borderRadius: 'clamp(14px, 1.25vw, 20px)' }}>
      {/* Left Area: Mobile Menu Toggle & Brand / Desktop Breadcrumb */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 min-w-0">
        {/* Mobile Hamburger */}
        <button
          type="button"
          className="p-2 text-stone-700 lg:hidden hover:text-emerald-700 transition-colors rounded-2xl bg-stone-100 hover:bg-stone-200/60 shrink-0"
          onClick={onMenuClick}
        >
          <span className="sr-only">Open sidebar</span>
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>

        {/* Mobile Brand Title */}
        <div className="flex lg:hidden items-center gap-2 shrink-0">
          <div className="bg-emerald-700 p-1.5 rounded-xl text-white shadow-soft shrink-0">
            <Sprout className="h-4 w-4" />
          </div>
          <span className="text-sm sm:text-base font-extrabold text-stone-900 tracking-tight whitespace-nowrap">Kisan Mitra</span>
        </div>

        {/* Desktop Breadcrumb & Season Status */}
        <div className="hidden lg:flex items-center gap-2 min-w-0">
          <div className="inline-flex items-center gap-1.5 xl:gap-2 px-2.5 xl:px-3 py-1.5 rounded-full bg-[#FAF9F5] border border-stone-200/80 text-xs font-semibold text-stone-700 shadow-soft min-w-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
            <span className="shrink-0 hidden 2xl:inline text-stone-600">Agronomic Workspace</span>
            <span className="text-stone-300 hidden 2xl:inline">•</span>
            <span className="text-emerald-800 font-bold truncate max-w-[160px] xl:max-w-[260px] 2xl:max-w-none">
              {weather.isLiveLocation ? (weather.district ? `${weather.district}, ${weather.state || 'India'}` : weather.locationName) : 'Kharif 2026'}
            </span>
          </div>
        </div>
      </div>

      {/* Center Area: Modern Command Search Pill (Linear / Raycast Style) */}
      <div className="flex-1 min-w-[110px] max-w-md mx-2 sm:mx-3 xl:mx-4 hidden md:block">
        <button
          type="button"
          onClick={onOpenCommandPalette}
          className="w-full h-9 flex items-center justify-between px-3 sm:px-3.5 rounded-2xl bg-[#FAF9F5] hover:bg-white border border-stone-200/80 hover:border-emerald-300 text-stone-400 hover:text-stone-700 text-xs font-medium shadow-soft transition-all group min-w-0"
        >
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Search className="h-4 w-4 shrink-0 text-stone-400 group-hover:text-emerald-700 transition-colors" />
            <span className="truncate whitespace-nowrap text-left text-xs">
              <span className="hidden 2xl:inline">Search 50 crops, mandi rates, disease diagnostic...</span>
              <span className="hidden lg:inline 2xl:hidden">Search crops, mandi rates, disease...</span>
              <span className="inline lg:hidden">Search crops, mandi...</span>
            </span>
          </div>
          <kbd className="hidden sm:inline-flex shrink-0 items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-bold text-stone-500 bg-white border border-stone-200 rounded-md shadow-sm ml-1.5">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Area: Telemetry, Notifications & User Pill */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 lg:gap-2.5 xl:gap-3 shrink-0">
        {/* Mobile Search Button */}
        <button
          type="button"
          onClick={onOpenCommandPalette}
          className="md:hidden p-2 text-stone-600 hover:text-emerald-800 bg-[#FAF9F5] border border-stone-200/80 rounded-2xl shadow-soft shrink-0"
        >
          <Search className="h-4 w-4" />
        </button>

        {/* Live Weather Capsule (Open-Meteo Dynamic Telemetry) */}
        <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-full bg-[#FAF9F5] border border-stone-200/80 text-xs font-semibold text-stone-700 shadow-soft shrink-0">
          <WeatherIcon
            weatherCode={weather.weatherCode}
            isDay={weather.isDay}
            size="sm"
            showContainer={false}
          />
          <span className="font-mono text-xs whitespace-nowrap">{weather.temperature.toFixed(1)}°C</span>
          <span className="text-stone-300 hidden sm:inline">•</span>
          <span className="text-stone-500 font-mono text-[11px] hidden sm:inline whitespace-nowrap">{weather.humidity}% Hum</span>
          {weather.isLiveLocation && weather.district && (
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 whitespace-nowrap hidden md:inline">
              {weather.district}
            </span>
          )}
        </div>

        {/* Notification Bell */}
        <button
          type="button"
          className="p-2 sm:p-2.5 text-stone-600 hover:text-emerald-800 bg-white hover:bg-[#FAF9F5] border border-stone-200/80 rounded-2xl shadow-soft transition-all active:scale-95 relative shrink-0"
        >
          <span className="sr-only">View notifications</span>
          <Bell className="h-4 w-4" aria-hidden="true" />
          <span className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 h-2 w-2 rounded-full bg-emerald-600 ring-2 ring-white"></span>
        </button>

        {/* Farmer Profile Pill */}
        <div className="flex items-center gap-1.5 sm:gap-2 pl-1.5 sm:pl-2 pr-2.5 sm:pr-3 py-1 sm:py-1.5 rounded-full bg-[#FAF9F5] border border-stone-200/90 shadow-soft hover:border-stone-300 transition-all shrink-0">
          <UserButton afterSignOutUrl="/login" />
          <div className="hidden sm:flex flex-col text-left pr-0.5 min-w-0">
            <span className="text-xs font-bold text-stone-800 leading-tight truncate max-w-[70px] sm:max-w-[90px] xl:max-w-[110px]">
              {user?.firstName || 'Farmer'}
            </span>
            <span className="text-[10px] text-emerald-800 font-semibold leading-none whitespace-nowrap">Verified Field</span>
          </div>
        </div>
      </div>
    </header>
  );
};
