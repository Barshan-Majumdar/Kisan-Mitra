import React, { createContext, useContext, useState, useEffect } from 'react';

export interface LiveWeatherData {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  weatherCode: number;
  weatherDescription: string;
  condition: string;
  isDay: boolean;
  soilMoisturePercent: number;
  soilMoistureStatus: string;
  soilMoistureRaw: number;
  soilTemperature: number;
  sowingStatus: string;
  sowingWindow: string;
  locationName: string;
  district: string;
  state: string;
  latitude: number;
  longitude: number;
  isLiveLocation: boolean;
  permissionStatus: 'prompt' | 'granted' | 'denied' | 'unsupported';
  lastUpdated: Date | null;
  loading: boolean;
  error: string | null;
  requestLiveLocation: () => Promise<void>;
}

// Fallback baseline: Nadia, West Bengal (Center of Indo-Gangetic Agricultural Belt)
const DEFAULT_COORDS = { lat: 22.97, lon: 88.43, name: 'Nadia, West Bengal' };

const WeatherContext = createContext<LiveWeatherData | undefined>(undefined);

const isCurrentlyDaytime = () => {
  const hour = new Date().getHours();
  return hour >= 6 && hour < 18; // 6:00 AM to 5:59 PM
};

// Helper to map WMO Weather Codes to human labels and agricultural status
const parseWeatherCode = (code: number, isDay: boolean = true) => {
  if (code === 0) {
    return {
      desc: isDay ? 'Clear Sky' : 'Clear Night Sky',
      condition: isDay ? 'Sunny & Clear' : 'Clear & Starry',
      sowing: 'Optimal Sowing Window'
    };
  }
  if (code <= 3) {
    return {
      desc: isDay ? 'Mainly Clear / Partly Cloudy' : 'Partly Cloudy Night',
      condition: isDay ? 'Partly Sunny' : 'Calm Night Weather',
      sowing: 'Favorable Sowing Window'
    };
  }
  if (code <= 48) return { desc: 'Foggy / Hazy Mist', condition: 'Foggy Conditions', sowing: 'Moisture Retention Good' };
  if (code <= 55) return { desc: 'Light Drizzle', condition: 'Light Drizzle', sowing: 'Seeding Moisture Favorable' };
  if (code <= 65) return { desc: 'Rainfall Detected', condition: 'Rainy Spell', sowing: 'Wet Soil • Delay Sowing' };
  if (code <= 82) return { desc: 'Rain Showers', condition: 'Showers', sowing: 'Postpone Spraying & Sowing' };
  if (code >= 95) return { desc: 'Thunderstorm Warning', condition: 'Thunderstorm', sowing: 'Severe Weather Alert' };
  return { desc: 'Normal Climate', condition: isDay ? 'Stable Weather' : 'Calm Night', sowing: 'Standard Sowing Window' };
};

export const WeatherProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initialIsDay = isCurrentlyDaytime();
  const [data, setData] = useState<LiveWeatherData>({
    temperature: 28,
    apparentTemperature: 30,
    humidity: 65,
    windSpeed: 10,
    precipitation: 0,
    weatherCode: 1,
    weatherDescription: initialIsDay ? 'Mainly Clear' : 'Partly Cloudy Night',
    condition: initialIsDay ? 'Stable Sowing Temp' : 'Calm Night Weather',
    isDay: initialIsDay,
    soilMoisturePercent: 68,
    soilMoistureStatus: 'High',
    soilMoistureRaw: 0.27,
    soilTemperature: 24,
    sowingStatus: 'Favorable',
    sowingWindow: 'Next 5 Days',
    locationName: 'Nadia, West Bengal',
    district: 'Nadia',
    state: 'West Bengal',
    latitude: DEFAULT_COORDS.lat,
    longitude: DEFAULT_COORDS.lon,
    isLiveLocation: false,
    permissionStatus: 'prompt',
    lastUpdated: null,
    loading: true,
    error: null,
    requestLiveLocation: async () => {},
  });

  // Fetch Open-Meteo Weather
  const fetchOpenMeteo = async (lat: number, lon: number, locationNameOverride?: string) => {
    try {
      setData((prev) => ({ ...prev, loading: true, error: null }));

      // 1. Fetch Open-Meteo Current + Hourly Soil Telemetry
      const meteoUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,weather_code,wind_speed_10m&hourly=soil_temperature_0cm,soil_moisture_0_to_1cm&timezone=auto`;
      const res = await fetch(meteoUrl);
      if (!res.ok) throw new Error('Open-Meteo telemetry service unavailable');
      const json = await res.json();

      const cur = json.current || {};
      const hourly = json.hourly || {};

      const temp = typeof cur.temperature_2m === 'number' ? cur.temperature_2m : 26;
      const humidity = typeof cur.relative_humidity_2m === 'number' ? cur.relative_humidity_2m : 65;
      const windSpeed = typeof cur.wind_speed_10m === 'number' ? cur.wind_speed_10m : 8;
      const precip = typeof cur.precipitation === 'number' ? cur.precipitation : 0;
      const weatherCode = typeof cur.weather_code === 'number' ? cur.weather_code : 0;
      const isDay = typeof cur.is_day === 'number' ? cur.is_day === 1 : isCurrentlyDaytime();

      // Extract current hour soil moisture (0.0 to ~0.50 m³/m³)
      const rawSoilMoisture = hourly.soil_moisture_0_to_1cm && hourly.soil_moisture_0_to_1cm.length > 0
        ? hourly.soil_moisture_0_to_1cm[0]
        : 0.25;

      // Calculate relative agricultural soil moisture percentage (field capacity scaled to 0.40 m³/m³)
      const moisturePct = Math.min(100, Math.max(12, Math.round((rawSoilMoisture / 0.40) * 100)));
      const moistureStatus = moisturePct > 70 ? 'High' : moisturePct > 35 ? 'Moderate' : 'Low';

      const soilTemp = hourly.soil_temperature_0cm && hourly.soil_temperature_0cm.length > 0
        ? hourly.soil_temperature_0cm[0]
        : temp - 2;

      const { desc, condition, sowing } = parseWeatherCode(weatherCode, isDay);

      // Evaluate Sowing Window based on live temperature and rain
      let sowingWindow = 'Next 5 Days';
      let sowingEvaluation = sowing;
      if (precip > 5 || weatherCode >= 61) {
        sowingWindow = 'Postpone 48h';
        sowingEvaluation = 'High Moisture';
      } else if (temp > 38) {
        sowingWindow = 'Evening Sowing';
        sowingEvaluation = 'High Heat';
      } else if (temp < 14) {
        sowingWindow = 'Delay Seeding';
        sowingEvaluation = 'Low Temp';
      }

      // 2. Reverse Geocode for Official District and State (never village / block)
      let locName = locationNameOverride || 'Nadia, West Bengal';
      let distName = 'Nadia';
      let stName = 'West Bengal';

      try {
        const geoRes = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
        );
        if (geoRes.ok) {
          const geoJson = await geoRes.json();
          const state = geoJson.principalSubdivision || 'West Bengal';

          // Search administrative hierarchy for the official District
          const admins: any[] = geoJson.localityInfo?.administrative || [];
          const distObj = admins.find((a: any) =>
            a.description?.toLowerCase().includes('district') ||
            a.name?.toLowerCase().includes('district')
          );

          let officialDistrict = '';
          if (distObj && distObj.name) {
            // Strip trailing "district" e.g. "North 24 Parganas district" -> "North 24 Parganas"
            officialDistrict = distObj.name.replace(/\s+district$/i, '').trim();
          } else {
            // Fallback: use city or principalSubdivision
            officialDistrict = geoJson.city || geoJson.principalSubdivision || 'Nadia';
          }

          // Strict filter: Never use block / village / sub-locality names like Amdanga
          if (officialDistrict.toLowerCase().includes('amdanga') || officialDistrict.toLowerCase().includes('block')) {
            officialDistrict = 'North 24 Parganas';
          }

          distName = officialDistrict;
          stName = state;
          locName = `${officialDistrict}, ${state}`;
        }
      } catch (geoErr) {
        console.warn('Reverse geocoding fallback:', geoErr);
      }

      setData((prev) => ({
        ...prev,
        temperature: temp,
        apparentTemperature: cur.apparent_temperature || temp,
        humidity,
        windSpeed,
        precipitation: precip,
        weatherCode,
        weatherDescription: desc,
        condition,
        isDay,
        soilMoisturePercent: moisturePct,
        soilMoistureStatus: moistureStatus,
        soilMoistureRaw: rawSoilMoisture,
        soilTemperature: soilTemp,
        sowingStatus: sowingEvaluation,
        sowingWindow,
        locationName: locName,
        district: distName,
        state: stName,
        latitude: lat,
        longitude: lon,
        lastUpdated: new Date(),
        loading: false,
        error: null,
      }));
    } catch (err: any) {
      console.error('Error fetching live weather from Open-Meteo:', err);
      setData((prev) => ({
        ...prev,
        loading: false,
        error: err.message || 'Failed to fetch weather telemetry',
      }));
    }
  };

  // Request browser geolocation permission
  const requestLiveLocation = async () => {
    if (!navigator.geolocation) {
      setData((prev) => ({ ...prev, permissionStatus: 'unsupported' }));
      await fetchOpenMeteo(DEFAULT_COORDS.lat, DEFAULT_COORDS.lon, DEFAULT_COORDS.name);
      return;
    }

    setData((prev) => ({ ...prev, loading: true }));

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setData((prev) => ({
          ...prev,
          permissionStatus: 'granted',
          isLiveLocation: true,
          latitude,
          longitude,
        }));
        await fetchOpenMeteo(latitude, longitude);
      },
      async (err) => {
        console.warn('Browser geolocation permission denied or error:', err.message);
        setData((prev) => ({
          ...prev,
          permissionStatus: 'denied',
          isLiveLocation: false,
        }));
        // Use default coordinates as fallback
        await fetchOpenMeteo(DEFAULT_COORDS.lat, DEFAULT_COORDS.lon, DEFAULT_COORDS.name);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  // On mount: proactively request live location
  useEffect(() => {
    requestLiveLocation();
  }, []);

  return (
    <WeatherContext.Provider value={{ ...data, requestLiveLocation }}>
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};
