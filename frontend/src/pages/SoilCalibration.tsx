import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import {
  Sprout,
  Droplets,
  CloudSun,
  Gauge,
  Check,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Layers,
  Thermometer,
  Wind
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useWeather } from '../context/WeatherContext';
import api from '../services/api';

const SOIL_TEXTURE_OPTIONS = [
  'Gangetic Alluvial Plains (Loam)',
  'Deltaic Alluvial Silt & Clay',
  'Black Cotton / Regur Soil',
  'Red & Yellow Crystalline Loam',
  'Coastal / Laterite Clay',
  'Arid Sandy Desert Loam',
  'Mountain & Forest Humus Soil'
];

export const SoilCalibration: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const weather = useWeather();

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State for Soil Values (Edaphic)
  const [nitrogen, setNitrogen] = useState<number>(172);
  const [phosphorus, setPhosphorus] = useState<number>(38);
  const [potassium, setPotassium] = useState<number>(195);
  const [ph, setPh] = useState<number>(6.8);
  const [soilType, setSoilType] = useState<string>('Gangetic Alluvial Plains (Loam)');

  // Form State for Atmospheric Values
  const [temperature, setTemperature] = useState<number>(28);
  const [humidity, setHumidity] = useState<number>(65);
  const [rainfall, setRainfall] = useState<number>(120);

  // Load existing soil data on mount
  useEffect(() => {
    const loadCurrentValues = async () => {
      try {
        const userEmail = user?.primaryEmailAddress?.emailAddress;
        const res = await api.get('/soil-data', {
          params: {
            district: weather.district || 'North 24 Parganas',
            state: weather.state || 'West Bengal',
            userEmail
          }
        });

        if (res.data) {
          if (typeof res.data.nitrogen === 'number') setNitrogen(res.data.nitrogen);
          if (typeof res.data.phosphorus === 'number') setPhosphorus(res.data.phosphorus);
          if (typeof res.data.potassium === 'number') setPotassium(res.data.potassium);
          if (typeof res.data.ph === 'number') setPh(res.data.ph);
          if (res.data.soilType) setSoilType(res.data.soilType);
        }
      } catch (err) {
        console.warn('Could not load existing soil data, using defaults:', err);
      }

      // Sync weather defaults from live context
      if (typeof weather.temperature === 'number') setTemperature(Math.round(weather.temperature));
      if (typeof weather.humidity === 'number') setHumidity(Math.round(weather.humidity));
      if (typeof weather.precipitation === 'number') setRainfall(Math.round(weather.precipitation * 30) || 120);
    };

    loadCurrentValues();
  }, [user, weather.district, weather.state]);

  // Derived Agronomic Ratings
  const getNitrogenRating = (n: number) => {
    if (n < 120) return { label: 'Deficient', color: 'text-rose-700 bg-rose-50 border-rose-200' };
    if (n <= 180) return { label: 'Optimal / Balanced', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    return { label: 'Rich / High', color: 'text-emerald-800 bg-emerald-100 border-emerald-300' };
  };

  const getPhosphorusRating = (p: number) => {
    if (p < 20) return { label: 'Deficient', color: 'text-rose-700 bg-rose-50 border-rose-200' };
    if (p <= 40) return { label: 'Moderate', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    return { label: 'Rich / High', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
  };

  const getPotassiumRating = (k: number) => {
    if (k < 140) return { label: 'Deficient', color: 'text-rose-700 bg-rose-50 border-rose-200' };
    if (k <= 200) return { label: 'Optimal / Balanced', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    return { label: 'Rich / High', color: 'text-emerald-800 bg-emerald-100 border-emerald-300' };
  };

  const getPhRating = (val: number) => {
    if (val < 6.0) return { label: 'Acidic', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    if (val <= 6.5) return { label: 'Slightly Acidic', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (val <= 7.3) return { label: 'Neutral / Optimal', color: 'text-emerald-800 bg-emerald-100 border-emerald-300' };
    if (val <= 8.0) return { label: 'Slightly Alkaline', color: 'text-sky-700 bg-sky-50 border-sky-200' };
    return { label: 'Alkaline', color: 'text-indigo-700 bg-indigo-50 border-indigo-200' };
  };

  // Reset to live telemetry
  const handleResetTelemetry = () => {
    if (typeof weather.temperature === 'number') setTemperature(Math.round(weather.temperature));
    if (typeof weather.humidity === 'number') setHumidity(Math.round(weather.humidity));
    if (typeof weather.precipitation === 'number') setRainfall(Math.round(weather.precipitation * 30) || 120);
    setNitrogen(172);
    setPhosphorus(38);
    setPotassium(195);
    setPh(6.8);
  };

  // Save Calibrated Parameters to Backend
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    setSaveSuccess(false);

    try {
      const userEmail = user?.primaryEmailAddress?.emailAddress;
      const district = weather.district || 'North 24 Parganas';
      const state = weather.state || 'West Bengal';

      await api.post('/soil-data', {
        userEmail,
        nitrogen: Number(nitrogen),
        phosphorus: Number(phosphorus),
        potassium: Number(potassium),
        ph: Number(ph),
        soilType,
        location: `${district}, ${state}`,
      });

      setSaveSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1200);
    } catch (err: any) {
      console.error('Failed to save calibrated soil profile:', err);
      setErrorMsg(err.response?.data?.error || 'Failed to save calibrated soil parameters. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const nRating = getNitrogenRating(nitrogen);
  const pRating = getPhosphorusRating(phosphorus);
  const kRating = getPotassiumRating(potassium);
  const phRating = getPhRating(ph);

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 animate-fade-in px-2 sm:px-4 py-2">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/80 pb-5">
        <div>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-emerald-700 transition-colors mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Farm Dashboard
          </button>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200/60 shadow-soft">
              <Sprout className="h-5 w-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Calibrate Soil & Microclimate
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl">
            Isolated agronomic parameter laboratory. Adjust your laboratory soil test readings (NPK, pH) and microclimate without running a full crop recommendation cycle.
          </p>
        </div>

        <button
          type="button"
          onClick={handleResetTelemetry}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white hover:bg-[#FAF9F5] border border-stone-200/90 text-stone-700 text-xs font-bold shadow-soft transition-all"
        >
          <RotateCcw className="h-3.5 w-3.5 text-stone-500" />
          Reset Telemetry Defaults
        </button>
      </div>

      {/* Success Notification Alert */}
      {saveSuccess && (
        <div className="p-4 rounded-3xl bg-emerald-50 border border-emerald-200/80 text-emerald-900 flex items-center gap-3 shadow-soft animate-fade-in">
          <div className="p-1.5 bg-emerald-600 text-white rounded-full">
            <Check className="h-4 w-4" />
          </div>
          <div className="text-xs sm:text-sm font-semibold">
            Soil parameters successfully calibrated and saved to your farm database! Redirecting to Dashboard...
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMsg && (
        <div className="p-4 rounded-3xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-semibold shadow-soft">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Two Asymmetric Calibration Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
          {/* Card 1: Soil Chemistry & Edaphic Parameters (7 cols) */}
          <div className="lg:col-span-7 rounded-3xl bg-white border border-stone-200/80 p-6 sm:p-7 shadow-soft space-y-6">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Edaphic Layer</span>
                <h3 className="text-lg font-extrabold text-stone-900">Soil Chemistry & Nutrients</h3>
              </div>
              <div className="p-2.5 bg-emerald-50 rounded-2xl text-emerald-700 border border-emerald-100">
                <Layers className="h-5 w-5" />
              </div>
            </div>

            {/* Soil Texture Selection */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                Soil Texture Archetype
              </label>
              <select
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                className="w-full rounded-2xl border border-stone-200/90 bg-[#FAF9F5] px-4 py-3 text-stone-900 text-xs sm:text-sm font-medium focus:border-emerald-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-600/10 transition-all cursor-pointer"
              >
                {SOIL_TEXTURE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* pH Balance Gauge & Slider */}
            <div className="p-4 rounded-3xl bg-[#FAF9F5] border border-stone-200/80 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-stone-800 flex items-center gap-1.5">
                  <Gauge className="h-4 w-4 text-emerald-700" />
                  Soil Reaction (pH Balance)
                </span>
                <span className={`px-2.5 py-0.5 rounded-full font-bold border text-[11px] ${phRating.color}`}>
                  {ph.toFixed(1)} • {phRating.label}
                </span>
              </div>

              <input
                type="range"
                min="4.0"
                max="9.5"
                step="0.1"
                value={ph}
                onChange={(e) => setPh(parseFloat(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer h-2 bg-stone-200 rounded-lg appearance-none"
              />

              <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                <span>4.0 (Acidic)</span>
                <span>6.8 (Neutral)</span>
                <span>9.5 (Alkaline)</span>
              </div>
            </div>

            {/* N-P-K Mineral Triad */}
            <div className="space-y-4 pt-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Primary Nutrient Baseline (kg/ha)
              </h4>

              {/* Nitrogen */}
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <Input
                    label="Nitrogen (N) Content (kg/ha)"
                    type="number"
                    min="0"
                    max="500"
                    value={nitrogen}
                    onChange={(e) => setNitrogen(Number(e.target.value) || 0)}
                  />
                </div>
                <div className="mt-7 shrink-0">
                  <span className={`inline-block px-3 py-1.5 rounded-xl font-bold border text-xs ${nRating.color}`}>
                    {nRating.label}
                  </span>
                </div>
              </div>

              {/* Phosphorus */}
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <Input
                    label="Phosphorus (P) Content (kg/ha)"
                    type="number"
                    min="0"
                    max="200"
                    value={phosphorus}
                    onChange={(e) => setPhosphorus(Number(e.target.value) || 0)}
                  />
                </div>
                <div className="mt-7 shrink-0">
                  <span className={`inline-block px-3 py-1.5 rounded-xl font-bold border text-xs ${pRating.color}`}>
                    {pRating.label}
                  </span>
                </div>
              </div>

              {/* Potassium */}
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <Input
                    label="Potassium (K) Content (kg/ha)"
                    type="number"
                    min="0"
                    max="600"
                    value={potassium}
                    onChange={(e) => setPotassium(Number(e.target.value) || 0)}
                  />
                </div>
                <div className="mt-7 shrink-0">
                  <span className={`inline-block px-3 py-1.5 rounded-xl font-bold border text-xs ${kRating.color}`}>
                    {kRating.label}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Microclimate & Atmospheric Readings (5 cols) */}
          <div className="lg:col-span-5 rounded-3xl bg-white border border-stone-200/80 p-6 sm:p-7 shadow-soft flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Atmospheric Layer</span>
                  <h3 className="text-lg font-extrabold text-stone-900">Local Microclimate</h3>
                </div>
                <div className="p-2.5 bg-sky-50 rounded-2xl text-sky-700 border border-sky-100">
                  <CloudSun className="h-5 w-5" />
                </div>
              </div>

              {/* Temperature */}
              <div className="space-y-1">
                <Input
                  label="Surface Temperature (°C)"
                  type="number"
                  min="-10"
                  max="55"
                  icon={<Thermometer className="h-4 w-4" />}
                  value={temperature}
                  onChange={(e) => setTemperature(Number(e.target.value) || 0)}
                />
                <span className="text-[10px] text-stone-400 block px-1">
                  Baseline thermal index for growing degree days calculation.
                </span>
              </div>

              {/* Humidity */}
              <div className="space-y-1">
                <Input
                  label="Relative Humidity (%)"
                  type="number"
                  min="5"
                  max="100"
                  icon={<Wind className="h-4 w-4" />}
                  value={humidity}
                  onChange={(e) => setHumidity(Number(e.target.value) || 0)}
                />
                <span className="text-[10px] text-stone-400 block px-1">
                  Ambient humidity driving evapotranspiration rates.
                </span>
              </div>

              {/* Rainfall / Moisture */}
              <div className="space-y-1">
                <Input
                  label="Cumulative Precipitation / Soil Moisture (mm)"
                  type="number"
                  min="0"
                  max="3000"
                  icon={<Droplets className="h-4 w-4" />}
                  value={rainfall}
                  onChange={(e) => setRainfall(Number(e.target.value) || 0)}
                />
                <span className="text-[10px] text-stone-400 block px-1">
                  Seasonal precipitation total or effective irrigation volume.
                </span>
              </div>

              {/* Location Badge */}
              <div className="p-4 rounded-3xl bg-[#FAF9F5] border border-stone-200/80 text-xs space-y-1">
                <span className="font-bold text-stone-800 block">
                  Active Farm District: {weather.district || 'North 24 Parganas'}, {weather.state || 'West Bengal'}
                </span>
                <p className="text-[11px] text-stone-500">
                  Calibrated values will directly bind to your registered farmer profile and synchronize with your Dashboard nutrient diagnostics.
                </p>
              </div>
            </div>

            {/* Quick Helper Note */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-[11px] text-emerald-900 font-medium flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-700 shrink-0" />
              <span>
                Saving here only updates your soil & microclimate telemetry. It will not generate crop recommendations.
              </span>
            </div>
          </div>
        </div>

        {/* Action Tray */}
        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3.5 border-t border-stone-200/80">
          <Button
            type="button"
            variant="outline"
            className="rounded-2xl font-bold py-3 px-6 text-stone-700 hover:bg-stone-100"
            onClick={() => navigate('/dashboard')}
          >
            Cancel & Return to Dashboard
          </Button>

          <Button
            type="submit"
            disabled={saving}
            className="rounded-2xl font-bold py-3 px-8 bg-emerald-700 hover:bg-emerald-800 text-white shadow-soft"
          >
            <Check className="h-4 w-4 mr-2" />
            {saving ? 'Saving Calibration...' : 'Save Calibrated Soil Profile'}
          </Button>
        </div>
      </form>
    </div>
  );
};
