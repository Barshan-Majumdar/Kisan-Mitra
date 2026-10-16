import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Droplets, Ruler, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';

export const FarmerInput: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    district: '',
    area: '',
    irrigation: 'Rainfed',
    soilType: '',
  });

  const districts = [
    'Alipurduar', 'Bankura', 'Birbhum', 'Cooch Behar', 'Dakshin Dinajpur',
    'Darjeeling', 'Hooghly', 'Howrah', 'Jalpaiguri', 'Jhargram',
    'Kalimpong', 'Kolkata', 'Malda', 'Murshidabad', 'Nadia',
    'North 24 Parganas', 'Paschim Bardhaman', 'Paschim Medinipur',
    'Purba Bardhaman', 'Purba Medinipur', 'Purulia',
    'South 24 Parganas', 'Uttar Dinajpur'
  ];

  // District to soil type mapping
  const districtSoilTypes: Record<string, string[]> = {
    'Alipurduar': ['Terai Soil', 'Forest Loam', 'Sandy Loam'],
    'Bankura': ['Red Laterite', 'Red Soil', 'Sandy Loam', 'Loam'],
    'Birbhum': ['Lateritic Loam', 'Red Soil', 'Clay Loam', 'Sandy Loam'],
    'Cooch Behar': ['Terai Alluvial', 'Alluvial', 'Sandy Loam'],
    'Dakshin Dinajpur': ['Old Alluvial (Barind)', 'Acidic Alluvial', 'Clay'],
    'Darjeeling': ['Mountain Loam', 'Forest Loam', 'Sandy Loam'],
    'Hooghly': ['Gangetic Loam', 'Gangetic Alluvial', 'Clay Loam'],
    'Howrah': ['Clay Loam', 'Alluvial'],
    'Jalpaiguri': ['Terai Soil', 'Sandy Loam', 'Forest Loam'],
    'Jhargram': ['Red Laterite', 'Red Sandy Loam', 'Red Soil'],
    'Kalimpong': ['Mountain Loam', 'Forest Loam', 'Red Sandy Loam'],
    'Kolkata': ['Alluvial', 'Clay Loam'],
    'Malda': ['Old Alluvial (Barind)', 'Gangetic Alluvial', 'Gangetic Loam', 'Sandy Loam'],
    'Murshidabad': ['Gangetic Loam', 'Gangetic Alluvial', 'Clay Loam', 'Alluvial'],
    'Nadia': ['Gangetic Alluvial', 'Sandy Loam', 'Loam', 'Clay Loam'],
    'North 24 Parganas': ['Alluvial', 'Gangetic Alluvial', 'Coastal Saline', 'Clay Loam'],
    'Paschim Bardhaman': ['Red Laterite', 'Red Sandy Loam', 'Lateritic Loam'],
    'Paschim Medinipur': ['Lateritic Loam', 'Red Sandy Loam', 'Alluvial', 'Clay Loam'],
    'Purba Bardhaman': ['Gangetic Alluvial', 'Clay Loam', 'Alluvial'],
    'Purba Medinipur': ['Coastal Alluvial', 'Coastal Saline', 'Alluvial'],
    'Purulia': ['Red Soil', 'Red Laterite', 'Sandy Loam'],
    'South 24 Parganas': ['Coastal Saline', 'Coastal Loam', 'Clay', 'Alluvial'],
    'Uttar Dinajpur': ['Acidic Alluvial', 'Old Alluvial (Barind)', 'Sandy Loam'],
  };

  // Get available soil types based on selected district
  const availableSoilTypes = formData.district
    ? districtSoilTypes[formData.district] || []
    : [];

  // Handle district change - reset soil type if not available in new district
  const handleDistrictChange = (newDistrict: string) => {
    const newSoilTypes = districtSoilTypes[newDistrict] || [];
    const shouldResetSoil = !newSoilTypes.includes(formData.soilType);
    setFormData({
      ...formData,
      district: newDistrict,
      soilType: shouldResetSoil ? '' : formData.soilType,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate processing
    setTimeout(() => {
      setIsLoading(false);
      navigate('/predict', { state: formData });
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6 animate-fade-in px-1">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Start New Advisory</h2>
        <p className="text-sm sm:text-base text-gray-600 mt-1">Select your district and farm details to get personalized recommendations.</p>
      </div>

      <Card padding="lg">
        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">

          {/* District Selection */}
          <div className="space-y-2 sm:space-y-3">
            <label className="block text-sm font-medium text-gray-700">Select District</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400 pointer-events-none z-10" />
              <select
                value={formData.district}
                onChange={(e) => handleDistrictChange(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-8 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white appearance-none truncate"
                required
              >
                <option value="">-- Choose District --</option>
                {districts.map((d) => (
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

          {/* Soil Type Selection */}
          <div className="space-y-2 sm:space-y-3">
            <label className="block text-sm font-medium text-gray-700">Select Soil Type</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                <span className="text-gray-400 text-sm sm:text-base">🌱</span>
              </div>
              <select
                value={formData.soilType}
                onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
                className={`w-full pl-9 sm:pl-10 pr-8 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white appearance-none truncate ${!formData.district ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}`}
                required
                disabled={!formData.district}
              >
                <option value="">{formData.district ? '-- Choose Soil Type --' : '-- Select District First --'}</option>
                {availableSoilTypes.sort().map((s) => (
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

          <Input
            label="Farm Area (in Acres)"
            type="number"
            step="0.1"
            placeholder="e.g. 2.5"
            value={formData.area}
            onChange={(e) => setFormData({ ...formData, area: e.target.value })}
            icon={<Ruler className="h-5 w-5" />}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">
              Irrigation Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {['Borewell', 'Canal', 'Rainfed', 'Drip'].map((type) => (
                <div
                  key={type}
                  onClick={() => setFormData({ ...formData, irrigation: type })}
                  className={`
                    cursor-pointer rounded-xl border p-3 sm:p-4 text-center transition-all touch-target
                    ${formData.irrigation === type
                      ? 'border-primary-500 bg-primary-50 text-primary-700 ring-2 ring-primary-500 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }
                  `}
                >
                  <Droplets className={`mx-auto h-5 w-5 sm:h-6 sm:w-6 mb-1.5 sm:mb-2 ${formData.irrigation === type ? 'text-primary-600' : 'text-gray-400'
                    }`} />
                  <span className="text-xs sm:text-sm font-medium">{type}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 sm:pt-4">
            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={isLoading}
            >
              Analyze Farm Data <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
