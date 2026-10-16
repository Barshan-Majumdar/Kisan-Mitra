import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { CheckCircle, ArrowRight, Star, TrendingUp, Sparkles, MapPin, Calendar, Layers, ShieldCheck } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import api from '../services/api';
import type { Crop, Stage1DomainResult, Stage2CropRecommendation, FarmSummary } from '../types';

export const CropRecommendation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const district = location.state?.district;
  const state = location.state?.state;
  const season = location.state?.season;
  const irrigation = location.state?.irrigation;
  const area = location.state?.area;
  const envData = location.state?.envData;

  const [crops, setCrops] = useState<Crop[]>([]);
  const [stage1Domains, setStage1Domains] = useState<Stage1DomainResult[]>([]);
  const [farmSummary, setFarmSummary] = useState<FarmSummary | null>(null);

  const [selectedCropId, setSelectedCropId] = useState<number | null>(null);
  const [selectedCropName, setSelectedCropName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCrops = async () => {
      try {
        if (!envData) {
          console.warn('No environment data found, cannot predict.');
          setError('Missing environmental data. Please go back and input your farm details.');
          setLoading(false);
          return;
        }

        const payload = {
          ...envData,
          State: state || envData.State || 'West Bengal',
          District: district || envData.District || 'Nadia',
          Crop_Season: season || envData.Crop_Season || 'Kharif',
          Cultivated_Area_ha: Number(area || envData.Cultivated_Area_ha || 2.0),
          top_k: 5
        };

        const response = await api.post('/crops/predict-crop', payload);

        if (response.data.success) {
          const resData = response.data;

          // 1. Store Farm Summary
          if (resData.farm_summary) {
            setFarmSummary(resData.farm_summary);
          }

          // 2. Store Stage 1 Domain Results
          if (resData.stage1_domain && resData.stage1_domain.length > 0) {
            setStage1Domains(resData.stage1_domain);
          }

          // 3. Process Stage 2 Basket of Recommendations
          const stage2List: Stage2CropRecommendation[] = resData.stage2_recommendations || [];

          // Build Crops array for backward compatibility & selection
          const mappedCrops: Crop[] = stage2List.map((rec) => {
            const details = rec.cropDetails;
            const aiImageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(rec.popular_indian_name || rec.crop_name)}%20crop%20field?width=800&height=600&nologo=true`;

            return {
              id: details?.id || (Math.floor(Math.random() * 1000000) + 1000000),
              name: rec.crop_name,
              popularIndianName: rec.popular_indian_name || rec.crop_name,
              imageUrl: details?.imageUrl || aiImageUrl,
              suitabilityScore: Math.round(rec.confidence_pct),
              reason: `Rank #${rec.rank} Recommended Crop. Expected harvest: ${rec.expected_total_harvest_tonnes} Tonnes for your field.`,
              cropType: 'Recommended',
              durationDays: details?.durationDays || 120,
              expectedYieldTonnesPerHa: rec.expected_yield_tonnes_per_ha,
              expectedTotalHarvestTonnes: rec.expected_total_harvest_tonnes
            };
          });

          // Fallback if stage2 is empty
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

    fetchCrops();
  }, [district, state, season]);

  const { user } = useUser();
  const [isSaving, setIsSaving] = useState(false);

  const handleProceed = async () => {
    if (selectedCropId) {
      setIsSaving(true);
      try {
        const userEmail = user?.primaryEmailAddress?.emailAddress;
        if (userEmail) {
          await api.post('/advisories', {
            cropId: selectedCropId,
            location: `${district || 'Nadia'}, ${state || 'West Bengal'}`,
            stage: 'Preparation',
            status: 'active',
            message: `Comprehensive AI advisory for ${selectedCropName}.`,
            userEmail,
            area: area ? `${area} Hectares` : '2.0 Hectares',
            soil: envData?.Soil || 'Alluvial Plains',
            irrigation: irrigation || 'High'
          });
        }
        navigate('/advisory-history');
      } catch (err) {
        console.error('Failed to create advisory:', err);
        navigate('/advisory-history');
      } finally {
        setIsSaving(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center py-16 space-y-4">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
        <h3 className="text-lg font-semibold text-gray-800">Evaluating Two-Stage AI Models...</h3>
        <p className="text-sm text-gray-500 max-w-md mx-auto">
          Analyzing regional soil archetypes, climatic parameters, and historical district harvest yields...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 max-w-lg mx-auto bg-red-50 border border-red-200 rounded-xl p-6">
        <h2 className="text-xl font-bold text-red-600 mb-2">Recommendation Service Notice</h2>
        <p className="text-gray-700 text-sm mb-4">{error}</p>
        <Button onClick={() => navigate(-1)}>Adjust Farm Inputs</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24 sm:pb-8 animate-fade-in">
      {/* Page Title */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1.5 rounded-lg bg-primary-100 text-primary-700">
            <Sparkles className="h-5 w-5" />
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
            Two-Stage Crop Advisory & Harvest Prediction
          </h2>
        </div>
        <p className="text-sm sm:text-base text-gray-600">
          Ranked recommendations tailored to your exact landholding, soil nutrients, and climatic conditions.
        </p>
      </div>

      {/* Farm & Soil Summary Card */}
      {farmSummary && (
        <Card padding="md" className="bg-white border border-stone-200/80 rounded-3xl shadow-card">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-stone-500 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-emerald-700" /> Location
              </span>
              <p className="font-bold text-stone-900 mt-1 truncate">{farmSummary.location}</p>
            </div>
            <div>
              <span className="text-stone-500 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-emerald-700" /> Season & Area
              </span>
              <p className="font-bold text-stone-900 mt-1">
                {farmSummary.season} • {farmSummary.cultivated_area_ha} ha ({farmSummary.cultivated_area_acres || (farmSummary.cultivated_area_ha * 2.47).toFixed(1)} ac)
              </p>
            </div>
            <div>
              <span className="text-stone-500 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-emerald-700" /> Soil Archetype
              </span>
              <p className="font-bold text-stone-900 mt-1 truncate">{farmSummary.soil_type.replace(' (proxy)', '')}</p>
            </div>
            <div>
              <span className="text-stone-500 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" /> Data Source
              </span>
              <p className="font-bold text-stone-900 mt-1">
                {farmSummary.npk_used?.source || 'Regional Baseline'}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Stage 1: Agricultural Domain / Category Overview */}
      {stage1Domains.length > 0 && (
        <Card padding="sm" className="bg-[#FAF9F5] border border-stone-200/80 rounded-2xl shadow-soft">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-2 py-1">
            <div className="flex items-center gap-2">
              <span className="text-stone-700 font-bold text-xs uppercase tracking-wider">
                Stage 1 Agronomic Taxonomy:
              </span>
              <span className="text-xs text-stone-500">ML Category Fit</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {stage1Domains.map((dom, idx) => (
                <span
                  key={dom.category}
                  className={`text-xs px-3 py-1 rounded-full font-semibold transition-all ${
                    idx === 0
                      ? 'bg-emerald-700 text-white shadow-soft'
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
        <div className="flex items-center justify-between">
          <h3 className="text-lg sm:text-xl font-extrabold text-stone-900 tracking-tight">
            Ranked Recommendations for Your Land
          </h3>
          <span className="text-xs text-stone-500 font-medium">Select a crop to proceed</span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {crops.map((crop, idx) => {
            const isSelected = selectedCropId === crop.id;
            const rank = idx + 1;

            return (
              <Card
                key={crop.id}
                padding="none"
                className={`overflow-hidden transition-all duration-300 cursor-pointer rounded-3xl border ${
                  isSelected
                    ? 'ring-2 ring-emerald-600/40 shadow-card-hover border-emerald-600 bg-emerald-50/15'
                    : 'hover:shadow-card-hover hover:border-stone-300 bg-white border-stone-200/80 shadow-card'
                }`}
                onClick={() => {
                  setSelectedCropId(crop.id);
                  setSelectedCropName(crop.name);
                }}
              >
                <div className="flex flex-col sm:flex-row">
                  {/* Crop Image */}
                  <div className="h-48 sm:h-auto sm:w-52 lg:w-60 shrink-0 relative bg-stone-100 overflow-hidden">
                    <img
                      src={crop.imageUrl}
                      alt={crop.name}
                      className="h-full w-full object-cover transform hover:scale-105 transition-transform duration-500"
                      loading="lazy"
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
                  <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between gap-3">
                    <div>
                      {/* Name & Confidence Badge */}
                      <div className="flex justify-between items-start gap-2 mb-1.5">
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
                        <div className="grid grid-cols-2 gap-3 my-3 p-3 rounded-2xl bg-[#FAF9F5] border border-stone-200/80">
                          <div className="flex items-center gap-2.5">
                            <div className="p-1.5 bg-emerald-100/70 rounded-xl text-emerald-800">
                              <TrendingUp className="h-4 w-4 shrink-0" />
                            </div>
                            <div>
                              <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">Expected Yield</span>
                              <span className="font-bold text-stone-900 text-xs sm:text-sm">
                                {crop.expectedYieldTonnesPerHa || 2.5} T / ha
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2.5">
                            <div className="p-1.5 bg-emerald-100/70 rounded-xl text-emerald-800">
                              <Sparkles className="h-4 w-4 shrink-0" />
                            </div>
                            <div>
                              <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">Total Projected</span>
                              <span className="font-extrabold text-emerald-800 text-xs sm:text-sm">
                                {crop.expectedTotalHarvestTonnes || (Number(area || 2.0) * 2.5).toFixed(1)} Tonnes
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      <p className="text-stone-600 text-xs sm:text-sm leading-relaxed line-clamp-2">
                        {crop.reason}
                      </p>
                    </div>

                    {/* Bottom Status & Check Selection */}
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
          className="w-full rounded-2xl font-bold py-3.5"
          disabled={!selectedCropId || isSaving}
          onClick={handleProceed}
        >
          {isSaving ? 'Synthesizing Advisory...' : `Generate Plan for ${selectedCropName || 'Crop'}`}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {/* Desktop Proceed Button */}
      <div className="hidden sm:flex justify-end pt-3">
        <Button
          size="lg"
          className="rounded-2xl font-bold px-8 py-4 text-base"
          disabled={!selectedCropId || isSaving}
          onClick={handleProceed}
        >
          {isSaving ? 'Synthesizing Advisory...' : `Generate Precision Plan for ${selectedCropName || 'Crop'}`}
          <ArrowRight className="ml-2.5 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
