import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Droplets, Ruler, ArrowRight, Calendar, Layers } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import api from '../services/api';

// Fallback West Bengal districts in case offline
const DEFAULT_WB_DISTRICTS = [
  'Alipurduar', 'Bankura', 'Birbhum', 'Cooch Behar', 'Dakshin Dinajpur',
  'Darjeeling', 'Hooghly', 'Howrah', 'Jalpaiguri', 'Jhargram',
  'Kalimpong', 'Kolkata', 'Malda', 'Murshidabad', 'Nadia',
  'North 24 Parganas', 'Paschim Bardhaman', 'Paschim Medinipur',
  'Purba Bardhaman', 'Purba Medinipur', 'Purulia',
  'South 24 Parganas', 'Uttar Dinajpur'
];

const DEFAULT_SEASONS = ['Kharif', 'Rabi', 'Summer', 'Whole Year', 'Autumn', 'Winter'];

const DATASET_SOILS = [
  'Alluvial plains (proxy)',
  'Black cotton/regur (proxy)',
  'Red/red-yellow soil (proxy)',
  'Coastal/lateritic mix (proxy)',
  'Deltaic/alluvial (proxy)',
  'Mountain/forest soil (proxy)',
  'Arid/desert soil (proxy)'
];

const IRRIGATION_TYPES = [
  { id: 'borewell', label: 'Borewell / Tube well', sub: 'High Availability', proxyVal: 'High (proxy)' },
  { id: 'canal', label: 'Canal Irrigation', sub: 'Moderate–High', proxyVal: 'Moderate–high (proxy)' },
  { id: 'drip', label: 'Drip / Sprinkler', sub: 'Water Efficient', proxyVal: 'Moderate (proxy)' },
  { id: 'rainfed', label: 'Rainfed / Natural', sub: 'Low / Variable', proxyVal: 'Low/variable; likely rain-fed (proxy)' },
];

export const FarmerInput: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Dynamic Options from AI Microservice / Backend
  const [statesList, setStatesList] = useState<string[]>(['West Bengal', 'Punjab', 'Maharashtra', 'Uttar Pradesh', 'Haryana', 'Karnataka']);
  const [stateDistrictMap, setStateDistrictMap] = useState<Record<string, string[]>>({
    'West Bengal': DEFAULT_WB_DISTRICTS
  });
  const [seasonsList, setSeasonsList] = useState<string[]>(DEFAULT_SEASONS);
  const [soilTypesList, setSoilTypesList] = useState<string[]>(DATASET_SOILS);

  const [formData, setFormData] = useState({
    state: 'West Bengal',
    district: 'Nadia',
    season: 'Kharif',
    area: '2.5',
    areaUnit: 'Acres', // 'Acres' or 'Hectares'
    irrigationType: 'borewell',
    soilType: 'Alluvial plains (proxy)',
  });

  // Fetch dynamic options from backend
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const response = await api.get('/crops/options');
        if (response.data) {
          if (response.data.states) setStatesList(response.data.states);
          if (response.data.state_district_map) setStateDistrictMap(response.data.state_district_map);
          if (response.data.crop_seasons) setSeasonsList(response.data.crop_seasons);
          if (response.data.soil_types) setSoilTypesList(response.data.soil_types);
        }
      } catch (err) {
        console.warn('Using default options schema (offline fallback):', err);
      }
    };
    loadOptions();
  }, []);

  // Update districts when state changes
  const availableDistricts = stateDistrictMap[formData.state] || DEFAULT_WB_DISTRICTS;

  const handleStateChange = (newState: string) => {
    const newDistricts = stateDistrictMap[newState] || [];
    setFormData(prev => ({
      ...prev,
      state: newState,
      district: newDistricts.length > 0 ? newDistricts[0] : '',
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Convert area to Hectares for ML models (1 Hectare = 2.471 Acres)
    const rawArea = parseFloat(formData.area) || 2.5;
    const areaInHa = formData.areaUnit === 'Acres' ? +(rawArea / 2.47105).toFixed(2) : rawArea;
    const selectedIrrigation = IRRIGATION_TYPES.find(i => i.id === formData.irrigationType) || IRRIGATION_TYPES[0];

    setTimeout(() => {
      setIsLoading(false);
      navigate('/predict', {
        state: {
          state: formData.state,
          district: formData.district,
          area: areaInHa,
          areaAcres: formData.areaUnit === 'Acres' ? rawArea : +(rawArea * 2.47105).toFixed(2),
          season: formData.season,
          irrigation: selectedIrrigation.proxyVal,
          soilType: formData.soilType,
        }
      });
    }, 600);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6 animate-fade-in px-1">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">🌾 Start New Crop Advisory</h2>
        <p className="text-sm sm:text-base text-gray-600 mt-1">
          Enter your location and farm parameters to get AI-powered crop recommendations and expected harvest yields.
        </p>
      </div>

      <Card padding="lg">
        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">

          {/* State and District Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* State Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Select State</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none z-10" />
                <select
                  value={formData.state}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="w-full pl-9 pr-8 py-2.5 text-sm sm:text-base rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white appearance-none truncate"
                  required
                >
                  {statesList.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* District Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Select District</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none z-10" />
                <select
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full pl-9 pr-8 py-2.5 text-sm sm:text-base rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white appearance-none truncate"
                  required
                >
                  <option value="">-- Choose District --</option>
                  {availableDistricts.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Crop Season & Soil Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Season Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Crop Season</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none z-10" />
                <select
                  value={formData.season}
                  onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                  className="w-full pl-9 pr-8 py-2.5 text-sm sm:text-base rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white appearance-none truncate"
                  required
                >
                  {seasonsList.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Soil Type Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Soil Type</label>
              <div className="relative">
                <Layers className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none z-10" />
                <select
                  value={formData.soilType}
                  onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
                  className="w-full pl-9 pr-8 py-2.5 text-sm sm:text-base rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white appearance-none truncate"
                  required
                >
                  {soilTypesList.map((s) => (
                    <option key={s} value={s}>{s.replace(' (proxy)', '')}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Farm Landholding Area */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Landholding Size
            </label>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  type="number"
                  step="0.1"
                  min="0.1"
                  placeholder="e.g. 2.5"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  icon={<Ruler className="h-5 w-5" />}
                  required
                />
              </div>
              <div className="w-32">
                <select
                  value={formData.areaUnit}
                  onChange={(e) => setFormData({ ...formData, areaUnit: e.target.value })}
                  className="w-full h-[42px] px-3 py-2 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white"
                >
                  <option value="Acres">Acres</option>
                  <option value="Hectares">Hectares</option>
                </select>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {formData.areaUnit === 'Acres'
                ? `≈ ${(parseFloat(formData.area || '0') / 2.47105).toFixed(2)} Hectares (used to calculate total harvest yield)`
                : `≈ ${(parseFloat(formData.area || '0') * 2.47105).toFixed(2)} Acres`}
            </p>
          </div>

          {/* Irrigation Availability */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">
              Irrigation Availability
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {IRRIGATION_TYPES.map((item) => {
                const isSelected = formData.irrigationType === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setFormData({ ...formData, irrigationType: item.id })}
                    className={`
                      cursor-pointer rounded-xl border p-3 sm:p-4 text-center transition-all touch-target
                      ${isSelected
                        ? 'border-primary-500 bg-primary-50 text-primary-700 ring-2 ring-primary-500 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }
                    `}
                  >
                    <Droplets className={`mx-auto h-5 w-5 sm:h-6 sm:w-6 mb-1.5 sm:mb-2 ${isSelected ? 'text-primary-600' : 'text-gray-400'}`} />
                    <span className="text-xs sm:text-sm font-medium block">{item.label}</span>
                    <span className="text-[10px] sm:text-xs text-gray-500 block mt-0.5">{item.sub}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2 sm:pt-4">
            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={isLoading}
            >
              Analyze Environmental Data <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
