import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import {
  CheckCircle,
  ArrowRight,
  Star,
  TrendingUp,
  Sparkles,
  MapPin,
  Calendar,
  Layers,
  ShieldCheck,
  Plus,
  Trash2,
  Search,
  ChevronLeft,
  Ruler,
  Droplets,
  Sprout
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import api from '../services/api';
import type {
  Crop,
  Stage1DomainResult,
  Stage2CropRecommendation,
  FarmSummary,
  RecommendationHistoryItem
} from '../types';

export const CropRecommendation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoaded } = useUser();

  const userEmail = user?.primaryEmailAddress?.emailAddress || 'demo@agriculture.com';

  // Navigation state passed from previous wizard steps (/predict)
  const incomingDistrict = location.state?.district;
  const incomingState = location.state?.state;
  const incomingSeason = location.state?.season;
  const incomingIrrigation = location.state?.irrigation;
  const incomingArea = location.state?.area;
  const incomingSoilType = location.state?.soilType;
  const envData = location.state?.envData;

  // View state: 'detail' (showing the 5 crops) or 'history' (showing cards of past recommendation sessions)
  const [activeTab, setActiveTab] = useState<'detail' | 'history'>(envData ? 'detail' : 'history');

  // Active Session Detail State
  const [crops, setCrops] = useState<Crop[]>([]);
  const [stage1Domains, setStage1Domains] = useState<Stage1DomainResult[]>([]);
  const [farmSummary, setFarmSummary] = useState<FarmSummary | null>(null);
  const [selectedCropId, setSelectedCropId] = useState<number | null>(null);
  const [selectedCropName, setSelectedCropName] = useState<string>('');
  const [currentContext, setCurrentContext] = useState({
    state: incomingState || 'West Bengal',
    district: incomingDistrict || 'Nadia',
    season: incomingSeason || 'Kharif',
    area: incomingArea || 2.0,
    soil: incomingSoilType || 'Alluvial Plains',
    irrigation: incomingIrrigation || 'Borewell'
  });

  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedBadge, setSavedBadge] = useState<string | null>(null);

  // History State
  const [historyList, setHistoryList] = useState<RecommendationHistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [seasonFilter, setSeasonFilter] = useState('All');
  const [selectedHistoryId, setSelectedHistoryId] = useState<number | null>(null);

  // Helper to fetch user's recommendation history
  const fetchHistory = async () => {
    try {
      setLoadingHistory(true);
      const res = await api.get('/crops/recommendation-history', {
        params: { userEmail }
      });
      if (res.data.success) {
        setHistoryList(res.data.history || []);
      }
    } catch (err) {
      console.warn('Could not fetch recommendation history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  // Fetch history on initial load or when user is ready
  useEffect(() => {
    if (isLoaded) {
      fetchHistory();
    }
  }, [isLoaded, userEmail]);

  // Guard to prevent duplicate executions from React StrictMode / async userEmail updates
  const hasPredictedRef = useRef<boolean>(false);

  // Compute new prediction if fresh envData is present
  useEffect(() => {
    const runPrediction = async () => {
      if (!envData || hasPredictedRef.current) return;
      hasPredictedRef.current = true;

      try {
        setLoading(true);
        setError(null);

        const payload = {
          ...envData,
          State: incomingState || envData.State || 'West Bengal',
          District: incomingDistrict || envData.District || 'Nadia',
          Crop_Season: incomingSeason || envData.Crop_Season || 'Kharif',
          Cultivated_Area_ha: Number(incomingArea || envData.Cultivated_Area_ha || 2.0),
          areaUnit: location.state?.areaUnit || 'Hectares',
          top_k: 5,
          userEmail
        };

        const response = await api.post('/crops/predict-crop', payload);

        if (response.data.success) {
          const resData = response.data;

          if (resData.farm_summary) {
            setFarmSummary(resData.farm_summary);
          }

          if (resData.stage1_domain && resData.stage1_domain.length > 0) {
            setStage1Domains(resData.stage1_domain);
          }

          const stage2List: Stage2CropRecommendation[] = resData.stage2_recommendations || [];
          const mappedCrops: Crop[] = stage2List.map((rec) => {
            const details = rec.cropDetails;
            const img = rec.imageUrl || details?.imageUrl || 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&auto=format&fit=crop&q=80';

            return {
              id: details?.id || (Math.floor(Math.random() * 1000000) + 1000000),
              name: rec.crop_name,
              popularIndianName: rec.popular_indian_name || rec.crop_name,
              imageUrl: img,
              suitabilityScore: Math.round(rec.confidence_pct),
              reason: `Rank #${rec.rank} Recommended Crop. Expected harvest: ${rec.expected_total_harvest_tonnes} Tonnes for your field.`,
              cropType: 'Recommended',
              durationDays: details?.durationDays || 120,
              expectedYieldTonnesPerHa: rec.expected_yield_tonnes_per_ha,
              expectedTotalHarvestTonnes: rec.expected_total_harvest_tonnes
            };
          });

          if (mappedCrops.length === 0 && resData.crop) {
            mappedCrops.push({
              ...resData.crop,
              id: resData.crop.id || 1,
              name: resData.prediction || 'Rice',
              suitabilityScore: 95
            });
          }

          setCrops(mappedCrops);
          if (mappedCrops.length > 0) {
            setSelectedCropId(mappedCrops[0].id);
            setSelectedCropName(mappedCrops[0].name);
          }

          setCurrentContext({
            state: payload.State,
            district: payload.District,
            season: payload.Crop_Season,
            area: payload.Cultivated_Area_ha,
            soil: payload.Soil_Type || 'Alluvial Plains',
            irrigation: payload.Irrigation_Availability || 'Borewell'
          });

          setSavedBadge('Saved to History');
          setActiveTab('detail');
          fetchHistory();
          // Clear envData from browser navigation history so refreshes don't re-run prediction
          window.history.replaceState({}, document.title);
        } else {
          setError(response.data.message || 'Failed to generate recommendations.');
        }
      } catch (err: any) {
        console.error('Failed to fetch crops:', err);
        setError(err.response?.data?.message || err.message || 'An unexpected error occurred while communicating with AI service.');
      } finally {
        setLoading(false);
      }
    };

    runPrediction();
  }, [envData]);

  // Load a saved recommendation session from history
  const handleSelectHistoryItem = (item: RecommendationHistoryItem) => {
    setSelectedHistoryId(item.id);

    // Map saved stage2 crops
    const savedStage2: Stage2CropRecommendation[] = (item.recommendedCrops as any) || [];
    const mappedCrops: Crop[] = savedStage2.map((rec, idx) => {
      const details = rec.cropDetails;
      const img = rec.imageUrl || details?.imageUrl || 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&auto=format&fit=crop&q=80';

      return {
        id: details?.id || (item.id * 10 + idx + 1),
        name: rec.crop_name,
        popularIndianName: rec.popular_indian_name || rec.crop_name,
        imageUrl: img,
        suitabilityScore: Math.round(rec.confidence_pct),
        reason: `Rank #${rec.rank || idx + 1} Recommended Crop. Expected harvest: ${rec.expected_total_harvest_tonnes} Tonnes for your field.`,
        cropType: 'Recommended',
        durationDays: details?.durationDays || 120,
        expectedYieldTonnesPerHa: rec.expected_yield_tonnes_per_ha,
        expectedTotalHarvestTonnes: rec.expected_total_harvest_tonnes
      };
    });

    setCrops(mappedCrops);
    if (mappedCrops.length > 0) {
      setSelectedCropId(mappedCrops[0].id);
      setSelectedCropName(mappedCrops[0].name);
    }

    setFarmSummary(item.farmSummary || {
      location: `${item.district}, ${item.state}`,
      season: item.season,
      cultivated_area_ha: item.cultivatedArea,
      soil_type: item.soilType || 'Regional Baseline'
    });

    setStage1Domains(item.stage1Domains || []);

    setCurrentContext({
      state: item.state,
      district: item.district,
      season: item.season,
      area: item.cultivatedArea,
      soil: item.soilType || 'Regional Baseline',
      irrigation: item.irrigationType || 'Standard'
    });

    setSavedBadge(`Saved Session #${item.id}`);
    setActiveTab('detail');
  };

  // Delete a history record
  const handleDeleteHistory = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this recommendation record?')) return;

    try {
      await api.delete(`/crops/recommendation-history/${id}`);
      setHistoryList(prev => prev.filter(item => item.id !== id));
      if (selectedHistoryId === id) {
        setSelectedHistoryId(null);
        setActiveTab('history');
      }
    } catch (err) {
      console.error('Failed to delete history record:', err);
      alert('Failed to delete record. Please try again.');
    }
  };

  // Generate Farming Plan via Gemini AI and save to CropAdvisory
  const handleProceed = async () => {
    if (!selectedCropId) return;

    setIsSaving(true);
    try {
      await api.post('/advisories', {
        cropId: selectedCropId,
        cropName: selectedCropName,
        location: `${currentContext.district}, ${currentContext.state}`,
        stage: 'Preparation',
        status: 'active',
        message: `Comprehensive AI advisory for ${selectedCropName}.`,
        userEmail,
        area: `${currentContext.area} Hectares`,
        soil: currentContext.soil,
        irrigation: currentContext.irrigation
      });

      navigate('/advisory-history');
    } catch (err) {
      console.error('Failed to create advisory:', err);
      navigate('/advisory-history');
    } finally {
      setIsSaving(false);
    }
  };

  // Filtered History List
  const filteredHistory = useMemo(() => {
    return historyList.filter(item => {
      const matchesSeason = seasonFilter === 'All' || item.season.toLowerCase() === seasonFilter.toLowerCase();
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        item.district.toLowerCase().includes(q) ||
        item.state.toLowerCase().includes(q) ||
        item.topPrediction.toLowerCase().includes(q) ||
        ((item.recommendedCrops as any[]) || []).some(
          c => (c.crop_name && c.crop_name.toLowerCase().includes(q)) ||
               (c.popular_indian_name && c.popular_indian_name.toLowerCase().includes(q))
        );
      return matchesSeason && matchesSearch;
    });
  }, [historyList, searchQuery, seasonFilter]);

  // Loading indicator for ML predictions
  if (loading) {
    return (
      <div className="text-center py-20 space-y-4 max-w-lg mx-auto">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent"></div>
        <h3 className="text-xl font-extrabold text-stone-900 tracking-tight">Evaluating Two-Stage AI Models...</h3>
        <p className="text-sm text-stone-600 leading-relaxed">
          Analyzing regional soil archetypes, climatic parameters, and historical district harvest yields...
        </p>
      </div>
    );
  }

  // Error State for ML evaluation
  if (error && activeTab === 'detail' && crops.length === 0) {
    return (
      <div className="text-center py-12 max-w-lg mx-auto bg-amber-50/70 border border-amber-200 rounded-3xl p-8 space-y-4">
        <h2 className="text-xl font-bold text-amber-900">Recommendation Service Notice</h2>
        <p className="text-stone-700 text-sm">{error}</p>
        <div className="flex justify-center gap-3 pt-2">
          <Button variant="outline" onClick={() => setActiveTab('history')}>
            View Saved History
          </Button>
          <Button onClick={() => navigate('/input')}>
            Adjust Farm Inputs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24 sm:pb-8 animate-fade-in">
      {/* Top Header & View Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5 sm:gap-4">
        <div className="space-y-1 min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-emerald-100 text-emerald-800 shrink-0">
              <Sparkles className="h-5 w-5" />
            </span>
            <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold text-stone-900 tracking-tight leading-snug">
              Crop Recommendations & Evaluation History
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            {activeTab === 'history'
              ? 'Browse previous agro-climatic submissions, inspect recommended 5-crop baskets, and generate custom farming plans.'
              : 'Ranked crop recommendations tailored to your exact landholding, soil nutrients, and climatic conditions.'}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 shrink-0 self-start md:self-center">
          {activeTab === 'detail' ? (
            <Button
              variant="outline"
              className="rounded-2xl text-xs sm:text-sm font-bold border-stone-200 hover:bg-stone-100 min-h-[42px]"
              onClick={() => setActiveTab('history')}
            >
              <ChevronLeft className="h-4 w-4 mr-1 shrink-0" />
              <span>All Saved Recommendations ({historyList.length})</span>
            </Button>
          ) : (
            <Button
              className="rounded-2xl text-xs sm:text-sm font-bold bg-emerald-800 hover:bg-emerald-700 shadow-sm min-h-[42px] w-full min-[400px]:w-auto"
              onClick={() => navigate('/input')}
            >
              <Plus className="h-4 w-4 mr-1.5 shrink-0" />
              <span>New Recommendation</span>
            </Button>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* MODE 1: HISTORY VIEW (Cards of past recommendation queries)    */}
      {/* ============================================================== */}
      {activeTab === 'history' && (
        <div className="space-y-4 sm:space-y-5">
          {/* Filter & Search Bar */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 p-3 sm:p-3.5 bg-white rounded-3xl border border-stone-200/80 shadow-soft">
            <div className="relative flex-1 min-w-0 w-full lg:w-auto">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 shrink-0" />
              <input
                type="text"
                placeholder="Search by district, state, or crop..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 min-h-[42px]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5 pt-0.5 lg:pt-0">
              <span className="text-xs font-semibold text-stone-500 mr-1 shrink-0">Season:</span>
              {['All', 'Kharif', 'Rabi', 'Summer', 'Whole Year'].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSeasonFilter(s)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer min-h-[36px] flex items-center justify-center ${
                    seasonFilter === s
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200 active:scale-95'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* History Cards Grid */}
          {loadingHistory ? (
            <div className="text-center py-16 space-y-3">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-3 border-emerald-700 border-t-transparent"></div>
              <p className="text-xs text-stone-500 font-semibold">Loading recommendation history...</p>
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="text-center py-10 sm:py-14 md:py-16 px-4 sm:px-6 bg-white rounded-3xl border border-dashed border-stone-300 space-y-4 max-w-2xl mx-auto w-full min-w-0 shadow-soft">
              <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto shrink-0">
                <Sprout className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h3 className="text-base sm:text-lg font-extrabold text-stone-900 tracking-tight leading-snug">
                  No Recommendation Records Found
                </h3>
                <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
                  {searchQuery || seasonFilter !== 'All'
                    ? 'No queries matched your search criteria. Try resetting the filters.'
                    : 'Start your first farm diagnostics to evaluate crop suitability, view harvest projections, and generate farming plans.'}
                </p>
              </div>
              <Button
                onClick={() => navigate('/input')}
                className="rounded-2xl font-bold bg-emerald-800 hover:bg-emerald-700 shadow-sm text-xs sm:text-sm px-5 py-3 min-h-[44px] w-full sm:w-auto inline-flex items-center justify-center"
              >
                <Plus className="h-4 w-4 mr-1.5 shrink-0" />
                <span>Run First Crop Recommendation</span>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
              {filteredHistory.map((item) => {
                const recCrops: Stage2CropRecommendation[] = (item.recommendedCrops as any) || [];

                return (
                  <Card
                    key={item.id}
                    padding="none"
                    className="overflow-hidden bg-white border border-stone-200/90 rounded-3xl shadow-card hover:shadow-card-hover hover:border-emerald-400 transition-all cursor-pointer group flex flex-col justify-between min-w-0"
                    onClick={() => handleSelectHistoryItem(item)}
                  >
                    <div className="p-4 sm:p-5 lg:p-6 space-y-3.5 sm:space-y-4 min-w-0">
                      {/* Card Header: Timestamp & Season */}
                      <div className="flex items-center justify-between gap-2 border-b border-stone-100 pb-3 flex-wrap">
                        <div className="flex items-center gap-1.5 sm:gap-2 text-stone-500 text-xs flex-wrap">
                          <Calendar className="h-3.5 w-3.5 text-emerald-800 shrink-0" />
                          <span className="font-semibold text-stone-700">
                            {new Date(item.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                          <span>•</span>
                          <span className="text-[11px] text-stone-400">
                            {new Date(item.createdAt).toLocaleTimeString('en-IN', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                            {item.season}
                          </span>
                          <button
                            onClick={(e) => handleDeleteHistory(item.id, e)}
                            className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-1 focus:outline-none focus:ring-2 focus:ring-red-400"
                            title="Delete this record"
                            aria-label="Delete this record"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Submitted Conditions Grid */}
                      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 text-xs min-w-0">
                        <div className="space-y-0.5 min-w-0">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-emerald-700 shrink-0" /> Location
                          </span>
                          <p className="font-bold text-stone-900 truncate">
                            {item.district}, {item.state}
                          </p>
                        </div>

                        <div className="space-y-0.5 min-w-0">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1">
                            <Ruler className="h-3 w-3 text-emerald-700 shrink-0" /> Farm Area
                          </span>
                          <p className="font-bold text-stone-900 truncate">
                            {item.cultivatedArea} {item.areaUnit || 'Hectares'}
                          </p>
                        </div>

                        <div className="space-y-0.5 min-w-0">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1">
                            <Layers className="h-3 w-3 text-emerald-700 shrink-0" /> Soil Archetype
                          </span>
                          <p className="font-semibold text-stone-700 truncate">
                            {item.soilType?.replace(' (proxy)', '') || 'Regional Soil'}
                          </p>
                        </div>

                        <div className="space-y-0.5 min-w-0">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1">
                            <Droplets className="h-3 w-3 text-emerald-700 shrink-0" /> Irrigation
                          </span>
                          <p className="font-semibold text-stone-700 truncate">
                            {item.irrigationType?.replace(' (proxy)', '') || 'Standard'}
                          </p>
                        </div>
                      </div>

                      {/* Soil Nutrient Badges (if calibrated) */}
                      {(item.nitrogen || item.phosphorus || item.potassium || item.ph) && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {item.nitrogen && (
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#FAF9F5] border border-stone-200 text-stone-600 font-semibold">
                              N: {item.nitrogen}
                            </span>
                          )}
                          {item.phosphorus && (
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#FAF9F5] border border-stone-200 text-stone-600 font-semibold">
                              P: {item.phosphorus}
                            </span>
                          )}
                          {item.potassium && (
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#FAF9F5] border border-stone-200 text-stone-600 font-semibold">
                              K: {item.potassium}
                            </span>
                          )}
                          {item.ph && (
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#FAF9F5] border border-stone-200 text-stone-600 font-semibold">
                              pH: {item.ph}
                            </span>
                          )}
                        </div>
                      )}

                      {/* 5 Recommended Crops Basket Preview */}
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400 block">
                          5 Recommended Crops Evaluated:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {recCrops.slice(0, 5).map((c, cIdx) => (
                            <span
                              key={cIdx}
                              className={`text-[11px] font-bold px-2.5 py-1 rounded-xl flex items-center gap-1 ${
                                cIdx === 0
                                  ? 'bg-emerald-800 text-white shadow-xs'
                                  : 'bg-stone-100 text-stone-700 border border-stone-200/80'
                              }`}
                            >
                              <span>{c.popular_indian_name || c.crop_name}</span>
                              <span className="text-[10px] opacity-80">({Math.round(c.confidence_pct)}%)</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Card Action Footer */}
                    <div className="px-4 sm:px-5 py-3 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-emerald-800 group-hover:bg-emerald-50/50 transition-colors gap-2">
                      <span className="flex items-center gap-1.5 truncate">
                        <Sparkles className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
                        <span className="truncate">Inspect 5 Crops & Generate Plan</span>
                      </span>
                      <ArrowRight className="h-4 w-4 shrink-0 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* MODE 2: DETAIL VIEW (5 Crops Basket & Plan Generation)         */}
      {/* ============================================================== */}
      {activeTab === 'detail' && (
        <div className="space-y-6">
          {/* Farm & Soil Summary Card */}
          {farmSummary && (
            <Card padding="md" className="bg-white border border-stone-200/80 rounded-3xl shadow-card">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                  <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                    Evaluated Environmental Parameters
                  </span>
                </div>
                {savedBadge && (
                  <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {savedBadge}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 min-[380px]:grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-xs sm:text-sm">
                <div className="min-w-0">
                  <span className="text-stone-500 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-emerald-700 shrink-0" /> Location
                  </span>
                  <p className="font-bold text-stone-900 mt-1 truncate">{farmSummary.location}</p>
                </div>
                <div className="min-w-0">
                  <span className="text-stone-500 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-emerald-700 shrink-0" /> Season & Area
                  </span>
                  <p className="font-bold text-stone-900 mt-1 truncate">
                    {farmSummary.season} • {farmSummary.cultivated_area_ha} ha ({farmSummary.cultivated_area_acres || (farmSummary.cultivated_area_ha * 2.47).toFixed(1)} ac)
                  </p>
                </div>
                <div className="min-w-0">
                  <span className="text-stone-500 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="h-3.5 w-3.5 text-emerald-700 shrink-0" /> Soil Archetype
                  </span>
                  <p className="font-bold text-stone-900 mt-1 truncate">{farmSummary.soil_type.replace(' (proxy)', '')}</p>
                </div>
                <div className="min-w-0">
                  <span className="text-stone-500 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-700 shrink-0" /> Data Source
                  </span>
                  <p className="font-bold text-stone-900 mt-1 truncate">
                    {farmSummary.npk_used?.source || 'Regional Baseline'}
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Stage 1: Agricultural Domain / Category Overview */}
          {stage1Domains.length > 0 && (
            <Card padding="sm" className="bg-[#FAF9F5] border border-stone-200/80 rounded-2xl shadow-soft">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 px-2 py-1">
                <div className="flex items-center gap-2">
                  <span className="text-stone-700 font-bold text-xs uppercase tracking-wider">
                    Stage 1 Agronomic Taxonomy:
                  </span>
                  <span className="text-xs text-stone-500">ML Category Fit</span>
                </div>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {stage1Domains.map((dom, idx) => (
                    <span
                      key={dom.category}
                      className={`text-xs px-2.5 sm:px-3 py-1 rounded-full font-semibold transition-all ${
                        idx === 0
                          ? 'bg-emerald-800 text-white shadow-soft'
                          : 'bg-white text-stone-700 border border-stone-200/90'
                      }`}
                    >
                      {dom.category}: <strong>{dom.confidence_pct}%</strong>
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {/* Stage 2: Ranked Recommendations List */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <h3 className="text-lg sm:text-xl font-extrabold text-stone-900 tracking-tight">
                Ranked Recommendations for Your Land
              </h3>
              <span className="text-xs text-stone-500 font-medium">Select a crop to generate farming plan</span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {crops.map((crop, idx) => {
                const isSelected = selectedCropId === crop.id;
                const rank = idx + 1;

                return (
                  <Card
                    key={crop.id}
                    padding="none"
                    className={`overflow-hidden transition-all duration-300 cursor-pointer rounded-3xl border min-w-0 ${
                      isSelected
                        ? 'ring-2 ring-emerald-600/40 shadow-card-hover border-emerald-600 bg-emerald-50/15'
                        : 'hover:shadow-card-hover hover:border-stone-300 bg-white border-stone-200/80 shadow-card'
                    }`}
                    onClick={() => {
                      setSelectedCropId(crop.id);
                      setSelectedCropName(crop.name);
                    }}
                  >
                    <div className="flex flex-col sm:flex-row min-w-0">
                      {/* Crop Image */}
                      <div className="h-44 sm:h-auto sm:w-48 md:w-52 lg:w-60 shrink-0 relative bg-stone-100 overflow-hidden">
                        <img
                          src={crop.imageUrl || 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&auto=format&fit=crop&q=80'}
                          alt={crop.name}
                          className="h-full w-full object-cover transform hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&auto=format&fit=crop&q=80';
                          }}
                        />
                        <div className="absolute top-3 left-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold tracking-wide shadow-soft backdrop-blur-md ${
                            rank === 1 ? 'bg-amber-500 text-white' : 'bg-stone-900/80 text-white'
                          }`}>
                            #{rank} Recommendation
                          </span>
                        </div>
                      </div>

                      {/* Crop Content */}
                      <div className="p-4 sm:p-5 lg:p-6 flex flex-col flex-1 justify-between gap-3 min-w-0">
                        <div>
                          {/* Name & Confidence Badge */}
                          <div className="flex justify-between items-start gap-2 mb-1.5 flex-wrap sm:flex-nowrap">
                            <div>
                              <h4 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight leading-snug">
                                {crop.popularIndianName || crop.name}
                              </h4>
                              {crop.popularIndianName && crop.popularIndianName !== crop.name && (
                                <span className="text-xs text-stone-500 font-medium">Dataset Reference: {crop.name}</span>
                              )}
                            </div>

                            <Badge
                              variant={(crop.suitabilityScore || 0) >= 70 ? 'success' : (crop.suitabilityScore || 0) >= 30 ? 'info' : 'neutral'}
                              size="md"
                            >
                              {crop.suitabilityScore}% Match
                            </Badge>
                          </div>

                          {/* Harvest Production Metrics Box */}
                          {(crop.expectedYieldTonnesPerHa !== undefined || crop.expectedTotalHarvestTonnes !== undefined) && (
                            <div className="grid grid-cols-1 min-[360px]:grid-cols-2 gap-2.5 sm:gap-3 my-2.5 sm:my-3 p-2.5 sm:p-3 rounded-2xl bg-[#FAF9F5] border border-stone-200/80">
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className="p-1.5 bg-emerald-100/70 rounded-xl text-emerald-800 shrink-0">
                                  <TrendingUp className="h-4 w-4" />
                                </div>
                                <div className="min-w-0">
                                  <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block truncate">Expected Yield</span>
                                  <span className="font-bold text-stone-900 text-xs sm:text-sm">
                                    {crop.expectedYieldTonnesPerHa || 2.5} T / ha
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className="p-1.5 bg-emerald-100/70 rounded-xl text-emerald-800 shrink-0">
                                  <Sparkles className="h-4 w-4" />
                                </div>
                                <div className="min-w-0">
                                  <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block truncate">Total Projected</span>
                                  <span className="font-extrabold text-emerald-800 text-xs sm:text-sm">
                                    {crop.expectedTotalHarvestTonnes || (Number(currentContext.area || 2.0) * 2.5).toFixed(1)} Tonnes
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}

                          <p className="text-stone-600 text-xs sm:text-sm leading-relaxed line-clamp-2">
                            {crop.reason}
                          </p>
                        </div>

                        {/* Bottom Status & Selection Check */}
                        <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                          <div className="flex items-center text-amber-500">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3.5 w-3.5 ${i < 4 ? 'fill-current' : 'fill-current opacity-30 text-stone-300'}`}
                              />
                            ))}
                            <span className="ml-1.5 text-xs text-stone-500 font-medium">Optimal Agro-ecological Fit</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-stone-600 hidden sm:inline">
                              {isSelected ? 'Ready for Plan' : 'Select Crop'}
                            </span>
                            <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all ${
                              isSelected ? 'border-emerald-600 bg-emerald-600 text-white shadow-soft' : 'border-stone-300 text-transparent'
                            }`}>
                              <CheckCircle className="h-4 w-4" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Sticky Mobile Proceed Button */}
          <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-stone-200 p-4 sm:hidden z-20 shadow-card">
            <Button
              className="w-full rounded-2xl font-bold py-3.5 bg-emerald-800 hover:bg-emerald-700"
              disabled={!selectedCropId || isSaving}
              onClick={handleProceed}
            >
              {isSaving ? 'Synthesizing Advisory...' : `Generate Plan for ${selectedCropName || 'Crop'}`}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Desktop Proceed Button */}
          <div className="hidden sm:flex justify-between items-center pt-3">
            <Button
              variant="outline"
              className="rounded-2xl font-bold px-6 py-3.5 text-sm border-stone-200"
              onClick={() => setActiveTab('history')}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Recommendations History
            </Button>

            <Button
              size="lg"
              className="rounded-2xl font-bold px-8 py-4 text-base bg-emerald-800 hover:bg-emerald-700 shadow-md"
              disabled={!selectedCropId || isSaving}
              onClick={handleProceed}
            >
              {isSaving ? 'Synthesizing Advisory...' : `Generate Precision Plan for ${selectedCropName || 'Crop'}`}
              <ArrowRight className="ml-2.5 h-5 w-5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
