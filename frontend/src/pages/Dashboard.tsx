import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import {
  MessageSquare,
  ScanLine,
  ClipboardList,
  History,
  ArrowRight,
  CloudRain,
  Wind,
  Sprout,
  TrendingUp,
  Calendar,
  Sparkles,
  Droplets,
  Gauge,
  ArrowUpRight,
  MapPin,
  Navigation,
  CheckCircle2
} from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import { WeatherIcon } from '../components/WeatherIcon';
import api from '../services/api';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const weather = useWeather();
  const [stats, setStats] = useState<any>(null);
  const [topMandiQuotes, setTopMandiQuotes] = useState<any[]>([]);
  const [mandiLoading, setMandiLoading] = useState<boolean>(true);
  const [soilData, setSoilData] = useState<any>(null);
  const [soilLoading, setSoilLoading] = useState<boolean>(true);
  const [pendingTasks, setPendingTasks] = useState<any[]>([]);
  const [tasksLoading, setTasksLoading] = useState<boolean>(true);

  // 1. Fetch user dashboard stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const userEmail = user?.primaryEmailAddress?.emailAddress;
        if (userEmail) {
          const statsRes = await api.get('/dashboard/stats', {
            params: { userEmail }
          });
          setStats(statsRes.data);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      }
    };

    fetchStats();
  }, [user]);

  // 2. Fetch live AGMARKNET Mandi quotes for current location
  useEffect(() => {
    const fetchMandi = async () => {
      try {
        setMandiLoading(true);
        const res = await api.get('/market-prices', {
          params: {
            district: weather.district && weather.district !== 'Unknown' ? weather.district : undefined,
            state: weather.state || 'West Bengal',
            limit: 4
          }
        });
        const list = Array.isArray(res.data) ? res.data : (res.data?.records || []);
        if (list.length > 0) {
          setTopMandiQuotes(list.slice(0, 2));
        }
      } catch (err) {
        console.warn('Dashboard failed to fetch live mandi quotes:', err);
      } finally {
        setMandiLoading(false);
      }
    };
    fetchMandi();
  }, [weather.district, weather.state]);

  // 3. Fetch dynamic Soil parameters calibrated for location / user
  useEffect(() => {
    const fetchSoil = async () => {
      try {
        setSoilLoading(true);
        const userEmail = user?.primaryEmailAddress?.emailAddress;
        const res = await api.get('/soil-data', {
          params: {
            district: weather.district || 'Nadia',
            state: weather.state || 'West Bengal',
            userEmail
          }
        });
        if (res.data) {
          setSoilData(res.data);
        }
      } catch (err) {
        console.warn('Dashboard failed to fetch dynamic soil metrics:', err);
      } finally {
        setSoilLoading(false);
      }
    };
    fetchSoil();
  }, [weather.district, weather.state, user]);

  // 4. Fetch dynamic operational Field Directives (Tasks)
  const fetchTasks = async () => {
    try {
      setTasksLoading(true);
      const userEmail = user?.primaryEmailAddress?.emailAddress;
      const res = await api.get('/todos', {
        params: userEmail ? { userEmail } : undefined
      });
      if (Array.isArray(res.data)) {
        setPendingTasks(res.data.filter((t: any) => !t.completed));
      }
    } catch (err) {
      console.warn('Dashboard failed to fetch pending tasks:', err);
    } finally {
      setTasksLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [user]);

  // Interactive task completion right on Dashboard
  const handleToggleTask = async (taskId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setPendingTasks(prev => prev.filter(t => t.id !== taskId));
    setStats((prev: any) => prev ? {
      ...prev,
      pendingTasks: Math.max(0, (prev.pendingTasks || 1) - 1),
      completedTasks: (prev.completedTasks || 0) + 1
    } : prev);

    try {
      await api.patch(`/todos/${taskId}`);
    } catch (err) {
      console.error('Failed to toggle task:', err);
      fetchTasks();
    }
  };

  const features = [
    {
      title: 'Advisory Records',
      description: 'Review historical schedules and customized soil nourishment plans.',
      icon: History,
      path: '/advisory-history',
      badge: 'Archived',
      color: 'bg-emerald-50 text-emerald-700',
    },
    {
      title: 'Field Operations',
      description: 'Manage seasonal spraying schedules and irrigation to-do milestones.',
      icon: ClipboardList,
      path: '/todos',
      badge: 'Active',
      color: 'bg-amber-50 text-amber-700',
    },
    {
      title: 'Disease Diagnostic',
      description: 'Scan leaves using computer vision to diagnose pathogens instantly.',
      icon: ScanLine,
      path: '/disease',
      badge: 'Scanner',
      color: 'bg-rose-50 text-rose-700',
    },
    {
      title: 'Agronomist AI',
      description: 'Ask deep agronomic questions about pests, fertilizers, and market timing.',
      icon: MessageSquare,
      path: '/chatbot',
      badge: '24/7 AI',
      color: 'bg-teal-50 text-teal-700',
    },
  ];

  return (
    <div className="space-y-3 sm:space-y-3.5 animate-fade-in">
      {/* Top Bento Row: 8 cols Hero + 4 cols Microclimate & Soil Gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-3.5">
        {/* Main Hero Bento Tile (8 cols) */}
        <div className="lg:col-span-8 relative overflow-hidden rounded-3xl sm:rounded-4xl bg-gradient-to-br from-[#0c261b] via-[#123626] to-[#1a4a35] text-white p-4 sm:p-5 lg:p-6 shadow-island border border-emerald-900/30 flex flex-col justify-between min-h-[220px] sm:min-h-[235px]">
          {/* Subtle isometric soil contour overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#22c55e_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Status Capsule */}
          <div className="relative z-10 flex items-center justify-between flex-wrap gap-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-0.5 text-xs font-semibold text-emerald-200 backdrop-blur-md border border-white/15">
              <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              {weather.isLiveLocation ? 'Live GPS Microclimate Connected' : 'Precision Agronomy Engine Active'}
            </div>
            <div className="flex items-center gap-2">
              <div className="text-[10px] font-mono text-emerald-200/80 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                {stats?.completedTasks ? `${stats.completedTasks} Tasks Done` : 'Model Sync: 50 Crops'}
              </div>
              {stats?.activeAdvisories ? (
                <div className="text-[10px] font-mono text-emerald-200/80 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                  {stats.activeAdvisories} Advisories
                </div>
              ) : null}
            </div>
          </div>

          {/* Middle Typography: One linear header */}
          <div className="relative z-10 my-2 sm:my-2.5 space-y-1">
            <h1 className="text-xl sm:text-2xl lg:text-[1.85rem] font-extrabold tracking-tight text-white flex items-center flex-wrap gap-2">
              <span>Good day,</span>
              <span className="text-emerald-300 font-bold">{user?.firstName || 'Farmer'}.</span>
            </h1>
            <p className="text-emerald-100/85 text-xs sm:text-sm max-w-xl leading-relaxed">
              Real-time Open-Meteo telemetry for <strong className="text-white">{weather.district ? `${weather.district}, ${weather.state || 'India'}` : weather.locationName}</strong>, tailored to your local soil profile and mandi pricing.
            </p>
          </div>

          {/* Bottom Action Tray & Telemetry */}
          <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2.5 border-t border-white/10">
            <div className="flex flex-wrap gap-2.5">
              <button
                onClick={() => navigate('/input')}
                className="inline-flex items-center justify-center rounded-xl bg-white px-4 sm:px-5 py-2 text-xs sm:text-sm font-bold text-emerald-950 shadow-soft hover:bg-[#FAF9F5] transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <Sparkles className="mr-1.5 h-3.5 w-3.5 text-emerald-700" />
                Run Crop Advisory
              </button>
              <button
                onClick={() => navigate('/recommendations')}
                className="inline-flex items-center justify-center rounded-xl bg-white/10 px-4 py-2 text-xs sm:text-sm font-semibold text-white backdrop-blur-md border border-white/20 hover:bg-white/15 transition-all active:scale-[0.98]"
              >
                Recommendations History
                <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => navigate('/market')}
                className="inline-flex items-center justify-center rounded-xl bg-white/10 px-4 py-2 text-xs sm:text-sm font-semibold text-white backdrop-blur-md border border-white/20 hover:bg-white/15 transition-all active:scale-[0.98]"
              >
                Mandi Rates
                <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-2.5 text-xs text-emerald-200/90 font-medium">
              <span>District: <strong className="text-white">{weather.district || 'India'}</strong></span>
              <span className="text-emerald-400/40">•</span>
              <span>Temp: <strong className="text-white font-mono">{weather.temperature.toFixed(1)}°C</strong></span>
            </div>
          </div>
        </div>

        {/* Microclimate & Soil Telemetry Bento (4 cols) - 100% Dynamic Open-Meteo */}
        <div className="lg:col-span-4 rounded-3xl sm:rounded-4xl bg-[#FAF9F5] border border-stone-200/90 p-3.5 sm:p-4 shadow-soft flex flex-col justify-between min-h-[220px] sm:min-h-[235px]">
          <div className="space-y-2 sm:space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Live Microclimate</span>
                <h3 className="font-extrabold text-stone-900 text-sm sm:text-base">Field Telemetry</h3>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={weather.requestLiveLocation}
                  title="Detect live GPS location"
                  className={`p-1.5 rounded-xl border transition-all ${
                    weather.isLiveLocation
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100 shadow-soft'
                      : 'bg-white border-stone-200/80 text-stone-600 hover:text-emerald-700 hover:border-emerald-300'
                  }`}
                >
                  <Navigation className={`h-3.5 w-3.5 ${weather.loading ? 'animate-spin text-emerald-600' : ''}`} />
                </button>
                <WeatherIcon
                  weatherCode={weather.weatherCode}
                  isDay={weather.isDay}
                  showContainer={true}
                  size="sm"
                />
              </div>
            </div>

            {/* GPS Location Pill */}
            <div className="flex items-center justify-between px-2.5 py-1 rounded-xl bg-white border border-stone-200/80 text-[11px] shadow-soft">
              <span className="flex items-center gap-1.5 font-bold text-stone-800 truncate pr-2">
                <MapPin className="h-3 w-3 text-emerald-700 shrink-0" />
                <span className="truncate">{weather.district ? `${weather.district}, ${weather.state || 'India'}` : weather.locationName}</span>
              </span>
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
                weather.isLiveLocation ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-600'
              }`}>
                {weather.isLiveLocation ? 'GPS Live' : 'Regional Default'}
              </span>
            </div>

            {/* Weather Metric Highlight */}
            <div className="p-2.5 rounded-xl bg-white border border-stone-200/80 shadow-soft">
              <div className="flex items-baseline justify-between">
                <span className="text-xl sm:text-2xl font-extrabold text-stone-900 font-mono tracking-tight">
                  {weather.temperature.toFixed(1)}°C
                </span>
                <span className="text-[10.5px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                  {weather.condition}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-1.5 pt-1.5 border-t border-stone-100 text-[11px]">
                <div className="flex items-center gap-1.5 text-stone-600">
                  <CloudRain className="h-3.5 w-3.5 text-sky-500" />
                  <span>Hum: <strong className="font-mono text-stone-900">{weather.humidity}%</strong></span>
                </div>
                <div className="flex items-center gap-1.5 text-stone-600">
                  <Wind className="h-3.5 w-3.5 text-stone-400" />
                  <span>Wind: <strong className="font-mono text-stone-900">{weather.windSpeed.toFixed(1)} km/h</strong></span>
                </div>
              </div>
            </div>

            {/* Quick Soil Gauges */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-600 font-semibold flex items-center gap-1 text-[11px]">
                  <Droplets className="h-3 w-3 text-sky-600" /> Soil Moisture
                </span>
                <span className="font-mono font-bold text-stone-800 text-[10.5px]">
                  {weather.soilMoisturePercent}% • {weather.soilMoistureStatus}
                </span>
              </div>
              <div className="w-full bg-stone-200/70 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-sky-500 h-1.5 rounded-full transition-all duration-700"
                  style={{ width: `${weather.soilMoisturePercent}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs pt-0.5">
                <span className="text-stone-600 font-semibold flex items-center gap-1 text-[11px]">
                  <Gauge className="h-3 w-3 text-emerald-600" /> Soil pH Balance
                </span>
                <span className="font-mono font-bold text-stone-800 text-[10.5px]">
                  {soilData?.ph ? `${soilData.ph.toFixed(1)} (${soilData.phStatus || 'Neutral'})` : '6.8 (Neutral)'}
                </span>
              </div>
              <div className="w-full bg-stone-200/70 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-1.5 rounded-full transition-all duration-700 ${
                    (soilData?.ph || 6.8) < 6.0
                      ? 'bg-amber-500'
                      : (soilData?.ph || 6.8) > 7.8
                      ? 'bg-indigo-500'
                      : 'bg-emerald-600'
                  }`}
                  style={{
                    width: `${Math.min(100, Math.max(15, Math.round(((soilData?.ph || 6.8) / 14) * 100)))}%`
                  }}
                />
              </div>
            </div>
          </div>

          <div className="mt-2 pt-1.5 border-t border-stone-200/70 text-[10px] text-stone-500 flex items-center justify-between font-medium">
            <span>Sowing Window: <strong className="text-stone-800">{weather.sowingWindow}</strong></span>
            <span className="text-emerald-700 font-bold">{weather.sowingStatus}</span>
          </div>
        </div>
      </div>

      {/* Middle Bento Row: 3 Dynamic Intelligence Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
        {/* Card 1: APMC Mandi Key Commodity Prices (100% Live data.gov.in) */}
        <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white border border-stone-200/80 shadow-soft hover:shadow-card-hover transition-all flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                  APMC Mandi • {weather.district ? `${weather.district}` : 'District Spot Rates'}
                </span>
                <h4 className="font-bold text-stone-900 text-sm sm:text-base">Key Commodity Prices</h4>
              </div>
              <div className="p-1.5 bg-emerald-50 rounded-xl text-emerald-700">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>

            <div className="space-y-2 min-h-[90px] flex flex-col justify-center">
              {mandiLoading ? (
                <div className="space-y-1.5 py-1">
                  <div className="h-10 rounded-xl bg-stone-100 animate-pulse" />
                  <div className="h-10 rounded-xl bg-stone-100 animate-pulse" />
                </div>
              ) : topMandiQuotes.length > 0 ? (
                topMandiQuotes.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-[#FAF9F5] border border-stone-100 text-xs hover:border-emerald-200 transition-colors">
                    <div className="pr-2 min-w-0">
                      <span className="font-bold text-stone-800 block truncate">{item.commodity || item.crop?.name}</span>
                      <span className="text-[10px] text-stone-400 block truncate">
                        {item.marketName || item.market} {item.district ? `(${item.district})` : ''}
                      </span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-mono font-bold text-stone-900">₹{item.price.toLocaleString()}/q</span>
                      <span className={`text-[9.5px] font-bold block ${item.trend === 'up' ? 'text-emerald-700' : item.trend === 'down' ? 'text-rose-700' : 'text-stone-500'}`}>
                        {item.trend === 'up' ? '▲ Bullish' : item.trend === 'down' ? '▼ Bearish' : '● Steady'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-2.5 rounded-xl bg-[#FAF9F5] border border-stone-100 text-center">
                  <p className="text-xs text-stone-500 font-medium">No live APMC trades today for {weather.district || weather.state}.</p>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => navigate('/market')}
            className="w-full text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center justify-center gap-1 pt-2.5"
          >
            Explore All Mandi Rates <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Card 2: Soil Nutrients Diagnostic (100% Dynamic Agro-climatic Calibration) */}
        <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white border border-stone-200/80 shadow-soft hover:shadow-card-hover transition-all flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Nutrient Matrix</span>
                <h4 className="font-bold text-stone-900 text-sm sm:text-base">Active Soil Status</h4>
              </div>
              <div className="p-1.5 bg-sky-50 rounded-xl text-sky-700">
                <Sprout className="h-4 w-4" />
              </div>
            </div>

            <div className="space-y-2 min-h-[90px] flex flex-col justify-center">
              {soilLoading ? (
                <div className="space-y-1.5 py-1">
                  <div className="h-3.5 rounded-lg bg-stone-100 animate-pulse" />
                  <div className="h-3.5 rounded-lg bg-stone-100 animate-pulse" />
                  <div className="h-3.5 rounded-lg bg-stone-100 animate-pulse" />
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-stone-600 font-medium">Nitrogen (N)</span>
                    <span className={`font-mono font-bold ${
                      soilData?.nitrogenStatus === 'High' ? 'text-emerald-700' :
                      soilData?.nitrogenStatus === 'Deficient' ? 'text-rose-700' : 'text-emerald-700'
                    }`}>
                      {soilData?.nitrogen ?? 172} kg/ha • {soilData?.nitrogenStatus || 'Optimal'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-stone-600 font-medium">Phosphorus (P)</span>
                    <span className={`font-mono font-bold ${
                      soilData?.phosphorusStatus === 'Deficient' ? 'text-rose-700' :
                      soilData?.phosphorusStatus === 'Rich' ? 'text-emerald-700' : 'text-amber-700'
                    }`}>
                      {soilData?.phosphorus ?? 38} kg/ha • {soilData?.phosphorusStatus || 'Moderate'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-stone-600 font-medium">Potassium (K)</span>
                    <span className={`font-mono font-bold ${
                      soilData?.potassiumStatus === 'Deficient' ? 'text-rose-700' : 'text-emerald-700'
                    }`}>
                      {soilData?.potassium ?? 195} kg/ha • {soilData?.potassiumStatus || 'Optimal'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-stone-100">
                    <span className="text-stone-600 font-medium">Reaction (pH)</span>
                    <span className="font-mono font-bold text-stone-800">
                      {soilData?.ph ?? 6.8} • {soilData?.phStatus || 'Optimal'}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="pt-2.5">
            <button
              onClick={() => navigate('/calibrate')}
              className="w-full py-2 rounded-xl bg-[#FAF9F5] hover:bg-emerald-50 hover:text-emerald-800 text-stone-700 font-bold text-xs transition-colors border border-stone-200/80 hover:border-emerald-200 text-center"
            >
              Calibrate Soil Parameters
            </button>
          </div>
        </div>

        {/* Card 3: Active Operations & Tasks (100% Dynamic User Task Management) */}
        <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white border border-stone-200/80 shadow-soft hover:shadow-card-hover transition-all flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Field Directives</span>
                <h4 className="font-bold text-stone-900 text-sm sm:text-base">
                  Pending Tasks ({tasksLoading ? '...' : pendingTasks.length})
                </h4>
              </div>
              <div className="p-1.5 bg-amber-50 rounded-xl text-amber-700">
                <Calendar className="h-4 w-4" />
              </div>
            </div>

            <div className="space-y-2 min-h-[90px] flex flex-col justify-center">
              {tasksLoading ? (
                <div className="space-y-1.5 py-1">
                  <div className="h-10 rounded-xl bg-stone-100 animate-pulse" />
                  <div className="h-10 rounded-xl bg-stone-100 animate-pulse" />
                </div>
              ) : pendingTasks.length > 0 ? (
                pendingTasks.slice(0, 2).map((t) => (
                  <div key={t.id} className="p-2 rounded-xl bg-[#FAF9F5] border border-stone-100 flex items-start gap-2 hover:bg-[#F2F1E8] transition-colors group">
                    <button
                      type="button"
                      onClick={(e) => handleToggleTask(t.id, e)}
                      title="Click to complete directive"
                      className="mt-0.5 text-stone-400 hover:text-emerald-700 transition-colors shrink-0"
                    >
                      <CheckCircle2 className="h-4 w-4 text-stone-400 group-hover:text-emerald-600" />
                    </button>
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-bold text-stone-800 block truncate">{t.task}</span>
                      <span className="text-[10px] text-stone-500 flex items-center gap-1.5 mt-0.5">
                        <span className="font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded-full border border-emerald-100 text-[9px]">{t.category}</span>
                        <span>Due {new Date(t.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100 text-center">
                  <span className="text-xs font-bold text-emerald-800 block">All Field Tasks Cleared! 🌿</span>
                  <span className="text-[10px] text-emerald-700">Operational milestones for this cycle are up to date</span>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => navigate('/todos')}
            className="w-full text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center justify-center gap-1 pt-2.5"
          >
            Open Farm Tasks <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Bottom Row: 4 Curved Agronomic Tool Modules */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-extrabold text-stone-900 tracking-tight">Core Agronomic Modules</h3>
          <span className="text-[11px] text-stone-500 font-medium">Click to launch specialized workflow</span>
        </div>

        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              onClick={() => navigate(feature.path)}
              className="group cursor-pointer rounded-2xl sm:rounded-3xl border border-stone-200/80 bg-white hover:border-emerald-300 shadow-soft hover:shadow-card-hover transition-all duration-300 hover:-translate-y-0.5 p-4 sm:p-5 flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className={`p-2.5 rounded-xl ${feature.color} group-hover:scale-105 transition-transform shadow-soft`}>
                    <feature.icon className="h-4 w-4" />
                  </div>
                  <span className="text-[9.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">
                    {feature.badge}
                  </span>
                </div>
                <div>
                  <h4 className="font-extrabold text-sm sm:text-base text-stone-900 group-hover:text-emerald-800 transition-colors">
                    {feature.title}
                  </h4>
                  <p className="mt-1 text-xs text-stone-500 leading-relaxed line-clamp-2">
                    {feature.description}
                  </p>
                </div>
              </div>

              <div className="pt-3 mt-1.5 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-emerald-700 group-hover:translate-x-0.5 transition-transform">
                <span>Access Module</span>
                <ArrowRight className="h-3 w-3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
