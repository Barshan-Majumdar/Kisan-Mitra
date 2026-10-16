import React from 'react';
import {
  Sun,
  Moon,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudRain,
  CloudDrizzle,
  CloudLightning,
  CloudFog
} from 'lucide-react';

interface WeatherIconProps {
  weatherCode?: number;
  isDay?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showContainer?: boolean;
  className?: string;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({
  weatherCode = 0,
  isDay = true,
  size = 'md',
  showContainer = false,
  className = ''
}) => {
  const iconSizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  }[size];

  // 1. Severe Weather: Thunderstorm
  if (weatherCode >= 95) {
    const icon = <CloudLightning className={`${iconSizeClasses} text-amber-600 animate-pulse`} />;
    if (!showContainer) return icon;
    return (
      <div
        title="Thunderstorm Warning"
        className={`p-2.5 rounded-2xl bg-amber-100/80 border border-amber-300 text-amber-700 shadow-soft ${className}`}
      >
        {icon}
      </div>
    );
  }

  // 2. Heavy Rain / Showers
  if (weatherCode >= 61 && weatherCode <= 82) {
    const icon = <CloudRain className={`${iconSizeClasses} text-sky-600`} />;
    if (!showContainer) return icon;
    return (
      <div
        title="Rainfall Detected"
        className={`p-2.5 rounded-2xl bg-sky-50 border border-sky-200/80 text-sky-600 shadow-soft ${className}`}
      >
        {icon}
      </div>
    );
  }

  // 3. Drizzle / Light Rain
  if (weatherCode >= 51 && weatherCode <= 57) {
    const icon = <CloudDrizzle className={`${iconSizeClasses} text-cyan-600`} />;
    if (!showContainer) return icon;
    return (
      <div
        title="Light Drizzle"
        className={`p-2.5 rounded-2xl bg-cyan-50 border border-cyan-200/80 text-cyan-600 shadow-soft ${className}`}
      >
        {icon}
      </div>
    );
  }

  // 4. Fog / Mist / Haze
  if (weatherCode >= 45 && weatherCode <= 48) {
    const icon = <CloudFog className={`${iconSizeClasses} text-stone-500`} />;
    if (!showContainer) return icon;
    return (
      <div
        title="Foggy / Hazy Mist"
        className={`p-2.5 rounded-2xl bg-stone-100 border border-stone-200 text-stone-600 shadow-soft ${className}`}
      >
        {icon}
      </div>
    );
  }

  // 5. Heavy Overcast (Cloudy)
  if (weatherCode === 3) {
    const icon = (
      <Cloud className={`${iconSizeClasses} ${isDay ? 'text-stone-500' : 'text-slate-400'}`} />
    );
    if (!showContainer) return icon;
    return (
      <div
        title="Overcast Skies"
        className={`p-2.5 rounded-2xl ${
          isDay
            ? 'bg-stone-100 border border-stone-200/80 text-stone-600'
            : 'bg-slate-900/10 border border-slate-300/60 text-slate-700'
        } shadow-soft ${className}`}
      >
        {icon}
      </div>
    );
  }

  // 6. Partly Cloudy (Day vs Night)
  if (weatherCode === 1 || weatherCode === 2) {
    if (isDay) {
      const icon = <CloudSun className={`${iconSizeClasses} text-amber-500`} />;
      if (!showContainer) return icon;
      return (
        <div
          title="Partly Cloudy Day"
          className={`p-2.5 rounded-2xl bg-amber-50 border border-amber-200/60 text-amber-600 shadow-soft ${className}`}
        >
          {icon}
        </div>
      );
    } else {
      const icon = <CloudMoon className={`${iconSizeClasses} text-indigo-500`} />;
      if (!showContainer) return icon;
      return (
        <div
          title="Partly Cloudy Night"
          className={`p-2.5 rounded-2xl bg-indigo-50 border border-indigo-200/70 text-indigo-600 shadow-soft ${className}`}
        >
          {icon}
        </div>
      );
    }
  }

  // 7. Clear Sky (Day = Sun vs Night = Moon)
  if (isDay) {
    const icon = <Sun className={`${iconSizeClasses} text-amber-500 animate-[spin_20s_linear_infinite]`} />;
    if (!showContainer) return icon;
    return (
      <div
        title="Clear Sunny Day"
        className={`p-2.5 rounded-2xl bg-amber-50 border border-amber-200/60 text-amber-600 shadow-soft ${className}`}
      >
        {icon}
      </div>
    );
  } else {
    const icon = <Moon className={`${iconSizeClasses} text-indigo-500`} />;
    if (!showContainer) return icon;
    return (
      <div
        title="Clear Night Sky"
        className={`p-2.5 rounded-2xl bg-indigo-50 border border-indigo-200/80 text-indigo-600 shadow-soft ${className}`}
      >
        {icon}
      </div>
    );
  }
};
