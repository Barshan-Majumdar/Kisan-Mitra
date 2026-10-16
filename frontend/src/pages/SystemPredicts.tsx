import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Edit2, Check, ArrowRight, Layers } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { useWeather } from '../context/WeatherContext';
import { WeatherIcon } from '../components/WeatherIcon';
import api from '../services/api';

export const SystemPredicts: React.FC = () => {
  const navigate = useNavigate();
  // Retrieve passed state with resilient fallbacks
  const location = useLocation();
  const weatherContext = useWeather();
  const state = location.state?.state || weatherContext.state || 'West Bengal';
  const district = location.state?.district || weatherContext.district || 'North 24 Parganas';
  const season = location.state?.season || 'Kharif';
  const irrigation = location.state?.irrigation;
  const manualSoilType = location.state?.soilType;
  const area = location.state?.area;

  const [isEditing, setIsEditing] = useState(false);
  const [rawData, setRawData] = useState({
    N_Ratio: 0,
    P_Ratio: 0,
    K_Ratio: 0,
    Temp: 0,
    Humidity: 0,
    pH: 0,
    Rainfall: 0,
  });

  const [data, setData] = useState({
    soilType: manualSoilType || 'Loading...',
    nitrogen: '--',
    phosphorus: '--',
    potassium: '--',
    ph: '--',
    temp: '--',
    humidity: '--',
    rainfall: '--',
  });

  useEffect(() => {
    const fetchEnvironmentData = async () => {
      try {
        // Use live Open-Meteo telemetry if available, else fetch backend
        let weatherData = {
          Temp: weatherContext.temperature || 28,
          Humidity: weatherContext.humidity || 68,
          Rainfall: weatherContext.precipitation > 0 ? weatherContext.precipitation * 30 : 1200
        };

        try {
          const weatherRes = await api.get('/weather', { params: { district } });
          if (weatherRes.data && !weatherContext.isLiveLocation) {
            weatherData = {
              Temp: weatherRes.data.temperature || weatherData.Temp,
              Humidity: weatherRes.data.humidity || weatherData.Humidity,
              Rainfall: weatherRes.data.rainfall || weatherData.Rainfall
            };
          }
        } catch (wErr) {
          console.warn('Backend weather fallback failed, using live Open-Meteo telemetry:', wErr);
        }

        setData(prev => ({
          ...prev,
          temp: weatherData.Temp + '°C',
          humidity: weatherData.Humidity + '%',
          rainfall: weatherData.Rainfall + ' mm',
        }));

        // Fetch Soil (New Endpoint Logic)
        const soilRes = await api.get('/soil-data', { params: { district, state } });
        if (soilRes.data && soilRes.data.soilType) {
          const fetchedSoil = soilRes.data;

          setData(prev => ({
            ...prev,
            // Use manual if available, else fetched
            soilType: manualSoilType || fetchedSoil.soilType,
            ph: String(fetchedSoil.ph),
            nitrogen: String(fetchedSoil.nitrogen),
            phosphorus: String(fetchedSoil.phosphorus),
            potassium: String(fetchedSoil.potassium)
          }));

          // Update rawData with both soil and weather
          setRawData({
            ...weatherData,
            N_Ratio: Number(fetchedSoil.nitrogen) || 0,
            P_Ratio: Number(fetchedSoil.phosphorus) || 0,
            K_Ratio: Number(fetchedSoil.potassium) || 0,
            pH: Number(fetchedSoil.ph) || 0,
          });
        }
      } catch (error) {
        console.error('Failed to fetch environment data:', error);
      }
    };

    fetchEnvironmentData();
  }, [district, state, manualSoilType, weatherContext.district, weatherContext.temperature]);

  const handleSave = () => {
    // Parse numeric values from display strings
    const parseNum = (str: string) => {
      const num = parseFloat(str.replace(/[^\d.-]/g, ''));
      return isNaN(num) ? 0 : num;
    };

    setRawData(prev => ({
      ...prev,
      Temp: parseNum(data.temp),
      Humidity: parseNum(data.humidity),
      Rainfall: parseNum(data.rainfall),
      pH: parseNum(data.ph),
      N_Ratio: parseNum(data.nitrogen),
      P_Ratio: parseNum(data.phosphorus),
      K_Ratio: parseNum(data.potassium),
    }));

    setIsEditing(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in px-1">
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-xs font-semibold text-emerald-800">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
          Step 2 of 3: Environmental Calibration
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          Field Microclimate & Soil Profile
        </h2>
        <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
          Geo-referenced agro-climatic readings detected for <span className="font-semibold text-stone-900">{district || 'your district'}, {state}</span>.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Weather Card */}
        <Card className="p-6 bg-white border border-stone-200/80 rounded-3xl shadow-card hover:shadow-card-hover transition-all">
          <div className="flex items-center justify-between mb-5">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-sky-700">Atmospheric</span>
              <h3 className="text-lg font-bold text-stone-900 tracking-tight">Weather Forecast</h3>
            </div>
            <div className="p-2.5 bg-sky-50 rounded-2xl border border-sky-100/80 text-sky-700">
              <WeatherIcon
                weatherCode={weatherContext.weatherCode ?? 0}
                isDay={weatherContext.isDay ?? true}
                className="h-5 w-5"
              />
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2.5 border-b border-stone-100">
              <span className="text-xs font-medium text-stone-500">Surface Temperature</span>
              <span className="text-base font-bold text-stone-900">{data.temp}</span>
            </div>
            <div className="flex justify-between items-center py-2.5 border-b border-stone-100">
              <span className="text-xs font-medium text-stone-500">Relative Humidity</span>
              <span className="text-base font-bold text-stone-900">{data.humidity}</span>
            </div>
            <div className="flex justify-between items-center pt-2.5">
              <span className="text-xs font-medium text-stone-500">Cumulative Precipitation</span>
              <span className="text-base font-bold text-stone-900">{data.rainfall}</span>
            </div>
          </div>
        </Card>

        {/* Soil Card */}
        <Card className="p-6 bg-white border border-stone-200/80 rounded-3xl shadow-card hover:shadow-card-hover transition-all">
          <div className="flex items-center justify-between mb-5">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-700">Edaphic</span>
              <h3 className="text-lg font-bold text-stone-900 tracking-tight">Soil Chemistry</h3>
            </div>
            <div className="p-2.5 bg-amber-50 rounded-2xl border border-amber-100/80 text-amber-700">
              <Layers className="h-5 w-5" />
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2.5 border-b border-stone-100">
              <span className="text-xs font-medium text-stone-500">Soil Texture Group</span>
              <span className="text-sm font-bold text-stone-900 max-w-[180px] text-right truncate">{data.soilType}</span>
            </div>
            <div className="flex justify-between items-center py-2.5 border-b border-stone-100">
              <span className="text-xs font-medium text-stone-500">Soil Reaction (pH)</span>
              <span className="text-base font-bold text-stone-900">{data.ph}</span>
            </div>
            <div className="flex justify-between items-center pt-2.5">
              <span className="text-xs font-medium text-stone-500">NPK Baseline Ratio</span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60 font-mono">
                {data.nitrogen}-{data.phosphorus}-{data.potassium}
              </span>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button
          variant="outline"
          className="flex-1 rounded-2xl font-semibold"
          onClick={() => setIsEditing(true)}
        >
          <Edit2 className="h-4 w-4 mr-2 text-stone-500" />
          Manually Adjust Parameters
        </Button>
        <Button
          className="flex-1 rounded-2xl font-bold py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white"
          onClick={() => navigate('/recommendations', {
            state: {
              state,
              district,
              season,
              irrigation,
              area,
              envData: {
                ...rawData,
                State: state,
                District: district,
                Crop_Season: season,
                Soil: data.soilType,
                Soil_Type: data.soilType,
                Cultivated_Area_ha: Number(area || 2.0),
                Rainfall_mm: rawData.Rainfall,
                Average_Temperature_C: rawData.Temp,
                Irrigation_Availability: irrigation,
                Soil_Moisture_pct: rawData.Humidity > 0 ? rawData.Humidity : 25.0,
                Soil_pH: rawData.pH > 0 ? rawData.pH : 7.0,
                Nitrogen_N: rawData.N_Ratio > 0 ? rawData.N_Ratio : null,
                Phosphorus_P: rawData.P_Ratio > 0 ? rawData.P_Ratio : null,
                Potassium_K: rawData.K_Ratio > 0 ? rawData.K_Ratio : null,
              }
            }
          })}
        >
          Generate Crop Recommendations <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>

      <Modal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        title="Calibrate Environmental & Soil Values"
      >
        <div className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
          <Input
            label="Soil Texture Archetype"
            value={data.soilType}
            onChange={(e) => setData({ ...data, soilType: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Soil Reaction (pH)"
              value={data.ph}
              onChange={(e) => setData({ ...data, ph: e.target.value })}
            />
            <Input
              label="Temperature (°C)"
              value={data.temp}
              onChange={(e) => setData({ ...data, temp: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Input
              label="Nitrogen (N)"
              value={data.nitrogen}
              onChange={(e) => setData({ ...data, nitrogen: e.target.value })}
            />
            <Input
              label="Phosphorus (P)"
              value={data.phosphorus}
              onChange={(e) => setData({ ...data, phosphorus: e.target.value })}
            />
            <Input
              label="Potassium (K)"
              value={data.potassium}
              onChange={(e) => setData({ ...data, potassium: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Relative Humidity (%)"
              value={data.humidity}
              onChange={(e) => setData({ ...data, humidity: e.target.value })}
            />
            <Input
              label="Rainfall (mm)"
              value={data.rainfall}
              onChange={(e) => setData({ ...data, rainfall: e.target.value })}
            />
          </div>

          <div className="p-3 bg-[#FAF9F5] rounded-2xl border border-stone-200/80 text-[11px] text-stone-600 flex items-center justify-between">
            <span>Want to save permanent telemetry to your farm profile?</span>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                navigate('/calibrate');
              }}
              className="text-emerald-700 font-bold hover:underline shrink-0 ml-2"
            >
              Open Calibration Lab
            </button>
          </div>

          <Button className="w-full rounded-2xl font-bold mt-2 bg-emerald-700 hover:bg-emerald-800" onClick={handleSave}>
            <Check className="h-4 w-4 mr-2" />
            Apply Changes to Crop Model
          </Button>
        </div>
      </Modal>
    </div>
  );
};
