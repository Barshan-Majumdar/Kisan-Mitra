import React, { useState, useEffect } from 'react';
import {
  ArrowUp,
  ArrowDown,
  Minus,
  Search,
  ArrowUpDown,
  MapPin,
  RefreshCw,
  ShieldCheck,
  Building2,
  Calendar
} from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useWeather } from '../context/WeatherContext';
import api from '../services/api';
import type { MarketPrice } from '../types';

const INDIAN_STATES = [
  'West Bengal',
  'Punjab',
  'Uttar Pradesh',
  'Maharashtra',
  'Madhya Pradesh',
  'Rajasthan',
  'Gujarat',
  'Haryana',
  'Bihar',
  'Karnataka',
  'Andhra Pradesh',
  'Tamil Nadu',
  'Odisha',
  'Telangana',
  'Assam',
  'Kerala',
  'Himachal Pradesh',
  'Uttarakhand',
  'Chhattisgarh',
  'Jharkhand'
];

export const MarketPrices: React.FC = () => {
  const weather = useWeather();
  const [selectedState, setSelectedState] = useState<string>('West Bengal');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [marketPrices, setMarketPrices] = useState<MarketPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [isLiveGovFeed, setIsLiveGovFeed] = useState<boolean>(false);

  // Automatically sync state from live browser location if available
  useEffect(() => {
    if (weather.state && INDIAN_STATES.includes(weather.state)) {
      setSelectedState(weather.state);
    }
  }, [weather.state]);

  const fetchPrices = async () => {
    setLoading(true);
    try {
      const response = await api.get('/market-prices', {
        params: {
          state: selectedState,
          ...(selectedDistrict ? { district: selectedDistrict } : {})
        }
      });

      const rawList = Array.isArray(response.data) ? response.data : (response.data?.records || []);
      const mappedData: MarketPrice[] = rawList.map((item: any) => ({
        ...item,
        market: item.marketName || item.market,
        commodity: item.commodity || item.crop?.name || 'Produce',
        trend: item.trend || 'stable',
      }));

      if (mappedData.length > 0) {
        setMarketPrices(mappedData);
        setIsLiveGovFeed(mappedData.some(m => m.isLiveGovData));
      }
    } catch (error) {
      console.error('Failed to fetch market prices:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, [selectedState, selectedDistrict]);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredData = marketPrices.filter((item) => {
    const cropName = item.commodity || item.crop?.name || '';
    const marketName = item.marketName || item.market || '';
    const districtName = item.district || '';
    const varietyName = item.variety || '';
    const query = searchTerm.toLowerCase();

    return (
      cropName.toLowerCase().includes(query) ||
      marketName.toLowerCase().includes(query) ||
      districtName.toLowerCase().includes(query) ||
      varietyName.toLowerCase().includes(query)
    );
  });

  const sortedData = React.useMemo(() => {
    if (!sortConfig) return filteredData;
    return [...filteredData].sort((a, b) => {
      // @ts-expect-error - Dynamic key access
      const aValue = a[sortConfig.key] || a.commodity || a.crop?.name || '';
      // @ts-expect-error - Dynamic key access
      const bValue = b[sortConfig.key] || b.commodity || b.crop?.name || '';

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }
      if (String(aValue) < String(bValue)) return sortConfig.direction === 'asc' ? -1 : 1;
      if (String(aValue) > String(bValue)) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  return (
    <div className="space-y-6 animate-fade-in w-full max-w-full">
      {/* Header & Live Status Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-xs font-semibold text-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Real-time Mandi Intelligence</span>
            {weather.isLiveLocation && (
              <>
                <span className="text-emerald-300">•</span>
                <span className="flex items-center gap-1 text-[11px] font-bold">
                  <MapPin className="h-3 w-3" /> {weather.district ? `${weather.district}, ${weather.state || 'India'}` : weather.locationName}
                </span>
              </>
            )}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Agricultural Mandi & APMC Rates
          </h2>
          <p className="text-sm text-stone-600">
            Real-time spot market commodity prices fetched directly via Government of India's{' '}
            <strong className="text-stone-800">data.gov.in (AGMARKNET)</strong> portal.
          </p>
        </div>

        {/* Live Feed Status Pill */}
        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          {isLiveGovFeed ? (
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 shadow-soft">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>AGMARKNET Live</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-800 shadow-soft">
              <Building2 className="h-4 w-4 text-amber-600" />
              <span>Local Mandi Database</span>
            </div>
          )}
          <button
            onClick={fetchPrices}
            disabled={loading}
            className="p-2.5 rounded-2xl bg-white border border-stone-200/80 hover:bg-[#FAF9F5] text-stone-600 shadow-soft transition-all active:scale-95"
            title="Refresh prices"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-emerald-700' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <Card padding="none" className="overflow-hidden rounded-3xl border border-stone-200/80 bg-white shadow-card animate-slide-up w-full">
        {/* Filters Tray */}
        <div className="p-4 sm:p-5 border-b border-stone-200/80 bg-[#FAF9F5] flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full">
            {/* State Selector */}
            <div className="w-full sm:w-52 shrink-0">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">State / Province</label>
              <select
                value={selectedState}
                onChange={(e) => {
                  setSelectedState(e.target.value);
                  setSelectedDistrict('');
                }}
                className="w-full px-3.5 py-2.5 border border-stone-200/90 rounded-2xl text-xs sm:text-sm font-semibold text-stone-800 focus:outline-none focus:ring-4 focus:ring-emerald-600/10 focus:border-emerald-600 bg-white shadow-soft"
              >
                {INDIAN_STATES.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            {/* District Filter Input */}
            <div className="w-full sm:w-44 shrink-0">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">District (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Nadia, Indore"
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-stone-200/90 rounded-2xl text-xs sm:text-sm font-medium text-stone-800 focus:outline-none focus:ring-4 focus:ring-emerald-600/10 focus:border-emerald-600 bg-white shadow-soft placeholder:text-stone-400"
              />
            </div>

            {/* Keyword Search Input */}
            <div className="w-full sm:flex-1">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">Search Commodity / Mandi</label>
              <Input
                placeholder="Search Wheat, Mustard, Rice, APMC..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search className="h-4 w-4 text-stone-400" />}
                className="bg-white rounded-2xl text-xs sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* Market Rates Data Table - 100% Fit, Zero Horizontal Scroll on Desktop */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#FAF9F5] border-b border-stone-200/80">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-3.5 text-xs font-bold text-stone-700 uppercase tracking-wider cursor-pointer hover:bg-stone-200/50 transition-colors w-[28%]"
                  onClick={() => handleSort('commodity')}
                >
                  <div className="flex items-center gap-1.5">
                    <span>Commodity & Variety</span>
                    <ArrowUpDown className="h-3 w-3 text-stone-400 shrink-0" />
                  </div>
                </th>

                <th
                  scope="col"
                  className="px-4 py-3.5 text-xs font-bold text-stone-700 uppercase tracking-wider cursor-pointer hover:bg-stone-200/50 transition-colors w-[28%]"
                  onClick={() => handleSort('market')}
                >
                  <div className="flex items-center gap-1.5">
                    <span>APMC Mandi & District</span>
                    <ArrowUpDown className="h-3 w-3 text-stone-400 shrink-0" />
                  </div>
                </th>

                <th
                  scope="col"
                  className="px-4 py-3.5 text-xs font-bold text-stone-700 uppercase tracking-wider cursor-pointer hover:bg-stone-200/50 transition-colors w-[22%]"
                  onClick={() => handleSort('price')}
                >
                  <div className="flex items-center gap-1.5">
                    <span>Modal Price & Range</span>
                    <ArrowUpDown className="h-3 w-3 text-stone-400 shrink-0" />
                  </div>
                </th>

                <th
                  scope="col"
                  className="px-4 py-3.5 text-xs font-bold text-stone-700 uppercase tracking-wider cursor-pointer hover:bg-stone-200/50 transition-colors w-[11%]"
                  onClick={() => handleSort('date')}
                >
                  <div className="flex items-center gap-1.5">
                    <span>Arrival Date</span>
                    <ArrowUpDown className="h-3 w-3 text-stone-400 shrink-0" />
                  </div>
                </th>

                <th
                  scope="col"
                  className="px-4 py-3.5 text-xs font-bold text-stone-700 uppercase tracking-wider cursor-pointer hover:bg-stone-200/50 transition-colors w-[11%] text-right pr-6"
                  onClick={() => handleSort('trend')}
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Day Trend</span>
                    <ArrowUpDown className="h-3 w-3 text-stone-400 shrink-0" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-stone-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-stone-500">
                    <RefreshCw className="h-6 w-6 animate-spin mx-auto text-emerald-700 mb-2" />
                    <span className="text-sm font-semibold">Querying Mandi data for {selectedState}...</span>
                  </td>
                </tr>
              ) : sortedData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-stone-500">
                    <p className="text-sm font-semibold text-stone-700">No mandi records found for {selectedState}.</p>
                    <p className="text-xs text-stone-400 mt-1">Try clearing the district filter or selecting a different state.</p>
                  </td>
                </tr>
              ) : (
                sortedData.map((item) => (
                  <tr key={item.id} className="hover:bg-[#FAF9F5]/70 transition-colors">
                    {/* Commodity & Variety */}
                    <td className="px-4 py-3.5 align-middle">
                      <div className="text-sm font-extrabold text-stone-900 leading-tight">
                        {item.commodity || item.crop?.name || 'Produce'}
                      </div>
                      {item.variety && item.variety !== 'Standard' && (
                        <span className="inline-block text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full mt-1 border border-emerald-200/50">
                          {item.variety}
                        </span>
                      )}
                    </td>

                    {/* Mandi & District */}
                    <td className="px-4 py-3.5 align-middle">
                      <div className="text-xs sm:text-sm font-bold text-stone-800 leading-tight">
                        {item.marketName || item.market}
                      </div>
                      <div className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3 text-stone-400 shrink-0" />
                        <span className="truncate">{item.district || selectedState}</span>
                      </div>
                    </td>

                    {/* Modal Price & Range Combined */}
                    <td className="px-4 py-3.5 align-middle">
                      <div className="text-sm sm:text-base font-extrabold text-stone-900 font-mono leading-tight">
                        ₹{item.price.toLocaleString()} <span className="text-[11px] font-normal text-stone-400">/qtl</span>
                      </div>
                      <div className="text-[11px] font-mono text-stone-500 mt-0.5">
                        {item.minPrice && item.maxPrice && item.minPrice !== item.maxPrice ? (
                          <span>₹{item.minPrice.toLocaleString()} – ₹{item.maxPrice.toLocaleString()}</span>
                        ) : (
                          <span>Spot modal rate</span>
                        )}
                      </div>
                    </td>

                    {/* Arrival Date */}
                    <td className="px-4 py-3.5 align-middle text-xs text-stone-600 font-medium">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-stone-400 shrink-0" />
                        <span>{item.date || 'Today'}</span>
                      </div>
                    </td>

                    {/* Trend */}
                    <td className="px-4 py-3.5 align-middle text-right pr-6">
                      <div className="flex justify-end">
                        {item.trend === 'up' && (
                          <Badge variant="success" size="sm" className="gap-1 font-bold whitespace-nowrap">
                            <ArrowUp className="h-3 w-3 text-emerald-700" /> +Bullish
                          </Badge>
                        )}
                        {item.trend === 'down' && (
                          <Badge variant="error" size="sm" className="gap-1 font-bold whitespace-nowrap">
                            <ArrowDown className="h-3 w-3 text-rose-700" /> -Bearish
                          </Badge>
                        )}
                        {item.trend === 'stable' && (
                          <Badge variant="neutral" size="sm" className="gap-1 font-semibold whitespace-nowrap">
                            <Minus className="h-3 w-3 text-stone-500" /> Steady
                          </Badge>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Info Strip */}
        <div className="p-4 border-t border-stone-200/80 bg-[#FAF9F5] flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-2">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>
              Showing <strong>{sortedData.length}</strong> mandi market quotes for <strong>{selectedState}</strong>
            </span>
          </div>
          <div className="text-[11px] text-stone-400">
            Source: data.gov.in Ministry of Agriculture & Farmers Welfare (AGMARKNET)
          </div>
        </div>
      </Card>
    </div>
  );
};
