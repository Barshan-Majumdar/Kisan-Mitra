import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useUser } from '@clerk/clerk-react';
import {
  Camera,
  UploadCloud,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Microscope,
  Pill,
  Leaf,
  Layers,
  Activity,
  ChevronRight,
  ShieldCheck,
  HelpCircle,
  History,
  Trash2,
  Search,
  Calendar,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import api from '../services/api';
import type { DiseaseResult, DiseaseHistoryItem } from '../types';
import { cleanSuggestionText, parsePrescriptionItems } from '../utils/diseaseFormatters';

// Preset sample foliage images for instant 1-click testing
const PRESET_SAMPLES = [
  {
    name: 'Potato Late Blight',
    crop: 'Potato',
    hint: 'Foliar blight test',
    color: 'from-amber-700 to-stone-800',
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <path d="M50 10 C30 25 15 50 25 80 C40 85 50 95 50 95 C50 95 60 85 75 80 C85 50 70 25 50 10 Z" fill="#4a7c38" />
        <path d="M50 15 L50 90" stroke="#2d521e" strokeWidth="2" />
        <ellipse cx="40" cy="45" rx="14" ry="9" fill="#2d1e12" opacity="0.85" />
        <ellipse cx="42" cy="46" rx="10" ry="6" fill="#150d08" />
        <ellipse cx="60" cy="65" rx="10" ry="7" fill="#3a281a" opacity="0.8" />
        <circle cx="35" cy="70" r="5" fill="#25170d" />
      </svg>
    )
  },
  {
    name: 'Tomato Early Blight',
    crop: 'Tomato',
    hint: 'Target board spots',
    color: 'from-orange-700 to-amber-900',
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <path d="M50 8 C25 25 20 60 30 85 C45 88 50 95 50 95 C50 95 55 88 70 85 C80 60 75 25 50 8 Z" fill="#588b39" />
        <path d="M50 12 L50 92" stroke="#365820" strokeWidth="2" />
        <circle cx="45" cy="48" r="16" fill="#7a6229" opacity="0.7" />
        <circle cx="45" cy="48" r="12" fill="#523e16" />
        <circle cx="45" cy="48" r="8" fill="#362509" />
        <circle cx="45" cy="48" r="4" fill="#1f1403" />
        <circle cx="62" cy="68" r="9" fill="#523e16" opacity="0.8" />
      </svg>
    )
  },
  {
    name: 'Corn Common Rust',
    crop: 'Corn (Maize)',
    hint: 'Rust pustules',
    color: 'from-red-800 to-amber-800',
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <path d="M20 90 Q40 50 50 10 Q60 50 80 90 Z" fill="#5c8a32" />
        <path d="M50 15 L50 90" stroke="#3d601d" strokeWidth="2" />
        <ellipse cx="43" cy="38" rx="6" ry="3" fill="#b44214" />
        <ellipse cx="55" cy="48" rx="7" ry="4" fill="#a03408" />
        <ellipse cx="40" cy="58" rx="8" ry="3.5" fill="#b44214" />
        <ellipse cx="57" cy="68" rx="6" ry="3" fill="#882a04" />
        <ellipse cx="45" cy="78" rx="7" ry="3.5" fill="#a03408" />
      </svg>
    )
  },
  {
    name: 'Healthy Foliage',
    crop: 'Tomato',
    hint: 'Zero blights',
    color: 'from-emerald-700 to-green-900',
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <path d="M50 8 C25 25 18 55 28 85 C42 88 50 95 50 95 C50 95 58 88 72 85 C82 55 75 25 50 8 Z" fill="#2e7d32" />
        <path d="M50 10 L50 95" stroke="#1b5e20" strokeWidth="2.5" />
        <path d="M50 30 Q35 25 25 35 M50 45 Q35 40 22 55 M50 60 Q35 55 24 72" stroke="#4caf50" strokeWidth="1.2" fill="none" opacity="0.7" />
        <path d="M50 30 Q65 25 75 35 M50 45 Q65 40 78 55 M50 60 Q65 55 76 72" stroke="#4caf50" strokeWidth="1.2" fill="none" opacity="0.7" />
      </svg>
    )
  }
];

export const DiseaseDetect: React.FC = () => {
  const { user } = useUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress || 'demo@agriculture.com';

  const [activeTab, setActiveTab] = useState<'detect' | 'history'>('detect');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [diagnosis, setDiagnosis] = useState<DiseaseResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCatalogModal, setShowCatalogModal] = useState(false);

  // History state
  const [history, setHistory] = useState<DiseaseHistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historySearch, setHistorySearch] = useState('');
  const [historyFilter, setHistoryFilter] = useState<'all' | 'diseased' | 'healthy'>('all');
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Load history from backend & local storage
  const loadHistory = async () => {
    setHistoryLoading(true);
    try {
      const res = await api.get('/disease/history', {
        params: { userEmail }
      });
      if (res.data?.success && Array.isArray(res.data.history)) {
        setHistory(res.data.history);
        try {
          localStorage.setItem(`km_disease_history_${userEmail}`, JSON.stringify(res.data.history));
        } catch {}
      }
    } catch (err: any) {
      console.warn('Could not fetch disease history from server, checking local backup:', err.message);
      try {
        const cached = localStorage.getItem(`km_disease_history_${userEmail}`);
        if (cached) {
          setHistory(JSON.parse(cached));
        }
      } catch {}
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [userEmail]);

  // Convert uploaded file to base64 and trigger diagnosis
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPEG, PNG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setSelectedImage(base64);
      runDiagnosis(base64);
    };
    reader.readAsDataURL(file);
  };

  // Convert SVG sample to Canvas and predict
  const handleSampleClick = (sampleIndex: number) => {
    setError(null);
    const canvas = document.createElement('canvas');
    canvas.width = 224;
    canvas.height = 224;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#FAF9F5';
    ctx.fillRect(0, 0, 224, 224);

    if (sampleIndex === 0) {
      // Potato Late Blight
      ctx.fillStyle = '#4a7c38';
      ctx.beginPath();
      ctx.ellipse(112, 112, 85, 60, Math.PI / 4, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = '#1c1208';
      ctx.beginPath();
      ctx.arc(90, 95, 26, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = '#2d1e12';
      ctx.beginPath();
      ctx.arc(135, 140, 22, 0, 2 * Math.PI);
      ctx.fill();
    } else if (sampleIndex === 1) {
      // Tomato Early Blight
      ctx.fillStyle = '#588b39';
      ctx.beginPath();
      ctx.ellipse(112, 112, 80, 55, -Math.PI / 6, 0, 2 * Math.PI);
      ctx.fill();
      ctx.strokeStyle = '#2b1d0a';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(110, 110, 32, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(110, 110, 22, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(110, 110, 12, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fillStyle = '#1f1403';
      ctx.beginPath();
      ctx.arc(110, 110, 5, 0, 2 * Math.PI);
      ctx.fill();
    } else if (sampleIndex === 2) {
      // Corn Rust
      ctx.fillStyle = '#5c8a32';
      ctx.fillRect(70, 20, 84, 184);
      ctx.fillStyle = '#b44214';
      for (let i = 0; i < 8; i++) {
        ctx.beginPath();
        ctx.ellipse(100 + (i % 2 === 0 ? -12 : 12), 40 + i * 18, 10, 5, 0, 0, 2 * Math.PI);
        ctx.fill();
      }
    } else {
      // Healthy Foliage
      ctx.fillStyle = '#2e7d32';
      ctx.beginPath();
      ctx.ellipse(112, 112, 85, 55, 0, 0, 2 * Math.PI);
      ctx.fill();
      ctx.strokeStyle = '#1b5e20';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(112, 20);
      ctx.lineTo(112, 204);
      ctx.stroke();
    }

    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setSelectedImage(dataUrl);
    runDiagnosis(dataUrl);
  };

  // Run prediction with model_v1.pt via backend API
  const runDiagnosis = async (base64Img: string) => {
    setAnalyzing(true);
    setError(null);
    setDiagnosis(null);

    try {
      const response = await api.post('/disease/predict', {
        image: base64Img,
        userEmail
      });

      if (response.data && response.data.success) {
        const result = response.data;
        // Clean suggestion texts
        result.chemicalTreatment = cleanSuggestionText(result.chemicalTreatment);
        result.organicTreatment = cleanSuggestionText(result.organicTreatment);
        result.prevention = cleanSuggestionText(result.prevention);
        result.symptoms = cleanSuggestionText(result.symptoms);

        setDiagnosis(result);
        setActiveTab('detect');

        // Prepend new diagnosis to local history immediately
        const newHistoryItem: DiseaseHistoryItem = {
          id: result.historyId || Date.now(),
          userEmail,
          crop: result.crop,
          disease: result.disease,
          isHealthy: result.isHealthy,
          confidence: result.confidence,
          pathogen: result.pathogen,
          severity: result.severity,
          symptoms: result.symptoms,
          chemicalTreatment: result.chemicalTreatment,
          organicTreatment: result.organicTreatment,
          prevention: result.prevention,
          imageUrl: base64Img.length > 500000 ? base64Img.substring(0, 500000) : base64Img,
          differentialDiagnosis: result.differentialDiagnosis,
          createdAt: result.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        setHistory(prev => [newHistoryItem, ...prev]);
        try {
          const cached = localStorage.getItem(`km_disease_history_${userEmail}`);
          const list = cached ? JSON.parse(cached) : [];
          localStorage.setItem(`km_disease_history_${userEmail}`, JSON.stringify([newHistoryItem, ...list]));
        } catch {}
      } else {
        setError(response.data?.error || 'Pathology vision analysis could not detect symptoms clearly.');
      }
    } catch (err: any) {
      console.error('Vision prediction error:', err);
      setError(
        err.response?.data?.error ||
        err.message ||
        'Failed to connect to crop vision engine (model_v1.pt). Ensure Python PyTorch service is accessible.'
      );
    } finally {
      setAnalyzing(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setDiagnosis(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  // Load a record from history into the diagnostic viewer
  const handleSelectHistoryItem = (item: DiseaseHistoryItem) => {
    setDiagnosis({
      crop: item.crop,
      disease: item.disease,
      isHealthy: item.isHealthy,
      confidence: item.confidence,
      pathogen: item.pathogen || 'Foliar pathology',
      severity: item.severity || (item.isHealthy ? 'None' : 'Moderate'),
      symptoms: cleanSuggestionText(item.symptoms || ''),
      chemicalTreatment: cleanSuggestionText(item.chemicalTreatment || ''),
      organicTreatment: cleanSuggestionText(item.organicTreatment || ''),
      prevention: cleanSuggestionText(item.prevention || ''),
      differentialDiagnosis: (item.differentialDiagnosis as any) || undefined,
      historyId: item.id,
      createdAt: item.createdAt
    });
    setSelectedImage(item.imageUrl || null);
    setActiveTab('detect');
  };

  // Delete a history record
  const handleDeleteHistoryItem = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this pathology diagnostic record?')) {
      return;
    }

    setDeletingId(id);
    try {
      await api.delete(`/disease/history/${id}`);
      setHistory(prev => prev.filter(item => item.id !== id));
      try {
        const cached = localStorage.getItem(`km_disease_history_${userEmail}`);
        if (cached) {
          const list = JSON.parse(cached).filter((item: any) => item.id !== id);
          localStorage.setItem(`km_disease_history_${userEmail}`, JSON.stringify(list));
        }
      } catch {}
    } catch (err: any) {
      console.error('Failed to delete history item:', err.message);
      setHistory(prev => prev.filter(item => item.id !== id));
    } finally {
      setDeletingId(null);
    }
  };

  // Filter history records
  const filteredHistory = useMemo(() => {
    return history.filter(item => {
      const matchSearch =
        item.crop.toLowerCase().includes(historySearch.toLowerCase()) ||
        item.disease.toLowerCase().includes(historySearch.toLowerCase()) ||
        (item.pathogen && item.pathogen.toLowerCase().includes(historySearch.toLowerCase()));

      if (!matchSearch) return false;

      if (historyFilter === 'diseased') return !item.isHealthy;
      if (historyFilter === 'healthy') return item.isHealthy;
      return true;
    });
  }, [history, historySearch, historyFilter]);

  // Format date helper
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Recent scan';
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in px-1 pb-12">
      {/* Top Header section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200/60 inline-flex">
              <Microscope className="h-5 w-5 text-emerald-700" />
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              AI Foliar Pathology Diagnostic
            </h2>
          </div>
          <p className="text-sm text-stone-600">
            Computer vision leaf & stem diagnostic powered by fine-tuned <span className="font-semibold text-stone-800">model_v1.pt (EfficientNet-B0)</span> with precision curative fungicide prescriptions.
          </p>
        </div>

        {/* Model Specs Pill */}
        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-emerald-800 self-start sm:self-auto shrink-0 shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
          </span>
          <span>model_v1.pt (98.3% Val Acc)</span>
        </div>
      </div>

      {/* Primary Navigation Tabs: Diagnostic Scanner vs History */}
      <div className="flex items-center justify-between border-b border-stone-200/80 pb-1">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('detect')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-sm transition-all ${
              activeTab === 'detect'
                ? 'bg-emerald-800 text-white shadow-soft'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Camera className="h-4 w-4" />
            <span>Leaf Scanner</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-sm transition-all ${
              activeTab === 'history'
                ? 'bg-emerald-800 text-white shadow-soft'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <History className="h-4 w-4" />
            <span>Diagnostic History</span>
            {history.length > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-xs font-extrabold ${
                activeTab === 'history' ? 'bg-white/20 text-white' : 'bg-stone-200 text-stone-700'
              }`}>
                {history.length}
              </span>
            )}
          </button>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="rounded-2xl text-xs font-semibold text-stone-700 hidden sm:flex items-center gap-1.5"
          onClick={() => setShowCatalogModal(true)}
        >
          <HelpCircle className="h-3.5 w-3.5 text-emerald-700" />
          <span>38 Supported Diseases</span>
        </Button>
      </div>

      {/* TAB 1: DIAGNOSTIC SCANNER & RESULT VIEW */}
      {activeTab === 'detect' && (
        <>
          {/* Main Upload & Scanning Zone (shown when no active diagnosis) */}
          {!diagnosis ? (
            <div className="space-y-6">
              <Card padding="lg" className="rounded-3xl border border-stone-200/80 bg-white shadow-card overflow-hidden">
                <div className="py-8 sm:py-10 flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-[#FAF9F5] border border-stone-200/90 flex items-center justify-center shadow-soft">
                      <Camera className="h-10 w-10 text-emerald-700" />
                    </div>
                    <div className="absolute -top-1.5 -right-1.5 w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center shadow-soft">
                      <Sparkles className="h-3.5 w-3.5" />
                    </div>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-stone-900 mb-2 tracking-tight">
                    Scan Crop Foliage for Symptoms
                  </h3>
                  <p className="text-stone-500 text-xs sm:text-sm max-w-md mb-8">
                    Upload or snap a sharp photo of an affected leaf, lesion, or shoot. The neural classifier isolates necrosis, mildew, chlorosis, and viral mosaics.
                  </p>

                  {/* Hidden native file inputs */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={handleFileUpload}
                  />

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md justify-center">
                    <Button
                      size="lg"
                      className="rounded-2xl font-bold py-4 text-sm bg-emerald-800 hover:bg-emerald-700 shadow-md flex-1"
                      onClick={() => cameraInputRef.current?.click()}
                    >
                      <Camera className="mr-2 h-4 w-4" />
                      Take Photo with Camera
                    </Button>

                    <Button
                      size="lg"
                      variant="outline"
                      className="rounded-2xl font-bold py-4 text-sm border-stone-300 hover:bg-stone-50 flex-1"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <UploadCloud className="mr-2 h-4 w-4 text-emerald-700" />
                      Upload Leaf Image
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Instant 1-Click Interactive Foliage Samples */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                    <span>Instant Foliage Demos (1-Click Test)</span>
                  </h4>
                  <span className="text-[11px] text-stone-400">Click any card to analyze</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {PRESET_SAMPLES.map((sample, idx) => (
                    <button
                      key={sample.name}
                      type="button"
                      onClick={() => handleSampleClick(idx)}
                      disabled={analyzing}
                      className="group p-3 rounded-2xl border border-stone-200/80 bg-white hover:border-emerald-500/80 hover:shadow-card transition-all text-left flex flex-col items-center disabled:opacity-50"
                    >
                      <div className="w-16 h-16 rounded-xl bg-[#FAF9F5] p-1 mb-2 border border-stone-100 group-hover:scale-105 transition-transform flex items-center justify-center">
                        {sample.svg}
                      </div>
                      <span className="font-extrabold text-stone-900 text-xs text-center line-clamp-1">
                        {sample.name}
                      </span>
                      <span className="text-[10px] text-stone-500 font-medium">
                        {sample.hint}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {/* Analyzing Loading Spinner */}
          {analyzing && (
            <Card padding="lg" className="rounded-3xl border border-stone-200/80 bg-white text-center py-14 shadow-card space-y-4">
              <div className="relative inline-flex items-center justify-center">
                <div className="w-16 h-16 rounded-full border-4 border-emerald-200 border-t-emerald-800 animate-spin" />
                <Microscope className="h-7 w-7 text-emerald-800 absolute" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-stone-900">
                  Processing Foliar Visual Pathogens...
                </h4>
                <p className="text-xs text-stone-500">
                  Running EfficientNet-B0 feature extractor across 38 class probability spectrum.
                </p>
              </div>
            </Card>
          )}

          {/* Error Message */}
          {error && (
            <Card padding="md" className="rounded-2xl border border-red-200 bg-red-50 text-red-800 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm">
                <p className="font-bold">Pathology Analysis Notice</p>
                <p className="text-red-700 mt-0.5">{error}</p>
              </div>
            </Card>
          )}

          {/* DIAGNOSIS REPORT VIEW */}
          {diagnosis && (
            <div className="space-y-6 animate-fade-in">
              {/* Preserved Confirmation Pill */}
              <div className="flex items-center justify-between bg-emerald-50/90 border border-emerald-200/70 p-3 rounded-2xl">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                  <CheckCircle className="h-4 w-4 text-emerald-700" />
                  <span>Preserved to your Diagnostic History</span>
                  {diagnosis.createdAt && (
                    <span className="text-emerald-700/80 font-normal">({formatDate(diagnosis.createdAt)})</span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('history')}
                  className="text-xs font-extrabold text-emerald-800 hover:text-emerald-950 underline flex items-center gap-1"
                >
                  View All History <ArrowRight className="h-3 w-3" />
                </button>
              </div>

              {/* Primary Pathology Card */}
              <Card padding="lg" className="rounded-3xl border border-stone-200/80 bg-white shadow-card overflow-hidden">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  {/* Leaf Thumbnail */}
                  {selectedImage && (
                    <div className="w-full md:w-56 h-56 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0 relative shadow-soft">
                      <img
                        src={selectedImage}
                        alt="Crop leaf sample"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-black shadow-soft backdrop-blur-md ${
                          diagnosis.isHealthy ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                        }`}>
                          {diagnosis.isHealthy ? 'Healthy Foliage' : (diagnosis.severity || 'Infected')}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Details column */}
                  <div className="flex-1 space-y-3 w-full">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                        {diagnosis.crop}
                      </span>

                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200/70 flex items-center gap-1">
                        <Activity className="h-3 w-3" />
                        {diagnosis.confidence}% Confidence
                      </span>
                    </div>

                    <div>
                      <h3 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                        {diagnosis.disease}
                      </h3>
                      <p className="text-xs font-semibold text-stone-500 mt-0.5">
                        Pathogen Etiology: <span className="text-stone-800">{diagnosis.pathogen}</span>
                      </p>
                    </div>

                    {/* Symptoms Description */}
                    <div className="text-stone-700 text-xs sm:text-sm leading-relaxed bg-[#FAF9F5] p-3.5 rounded-2xl border border-stone-200/70">
                      <span className="font-bold text-stone-900 block mb-1">Key Visual Symptoms:</span>
                      <p className="text-stone-600">{cleanSuggestionText(diagnosis.symptoms)}</p>
                    </div>

                    {/* Model Attribution */}
                    <div className="flex items-center gap-2 text-[11px] text-stone-500 font-medium">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Validated by <span className="font-semibold text-stone-700">model_v1.pt</span> (Trained on 38-Class PlantVillage foliar dataset)</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* CURATIVE TREATMENT PLANS GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* 1. Chemical Treatment Prescription */}
                <Card padding="md" className="rounded-3xl border border-stone-200/80 bg-white shadow-card space-y-3.5">
                  <div className="flex items-center justify-between border-b border-rose-100 pb-2.5">
                    <div className="flex items-center gap-2 text-rose-800 font-extrabold text-sm">
                      <div className="p-1.5 rounded-xl bg-rose-50 border border-rose-200/60 text-rose-700">
                        <Pill className="h-4 w-4" />
                      </div>
                      <h4>Curative Chemical Prescription</h4>
                    </div>
                    <Badge variant="error" size="sm">Fungicide</Badge>
                  </div>

                  {/* Formatted individual dosage pills */}
                  {(() => {
                    const parsedItems = parsePrescriptionItems(diagnosis.chemicalTreatment);
                    if (parsedItems.length > 0) {
                      return (
                        <div className="space-y-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                            Recommended Dosage Formulations:
                          </span>
                          <div className="space-y-2">
                            {parsedItems.map((item) => (
                              <div
                                key={item.id}
                                className="p-2.5 rounded-xl bg-rose-50/50 border border-rose-100 flex items-center justify-between gap-2 text-xs"
                              >
                                <div className="flex items-center gap-2">
                                  <span className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold ${
                                    item.type === 'curative' ? 'bg-rose-200 text-rose-900' : 'bg-stone-200 text-stone-800'
                                  }`}>
                                    {item.label}
                                  </span>
                                  <span className="font-bold text-stone-900">{item.remedy}</span>
                                </div>
                                {item.dosage && (
                                  <span className="px-2 py-0.5 rounded-lg bg-white border border-rose-200/80 font-extrabold text-rose-800 text-[11px] shrink-0 shadow-soft">
                                    {item.dosage}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })()}

                  {/* Clean text description (with zero @ or special characters) */}
                  <div className="p-3.5 rounded-2xl bg-[#FAF9F5] border border-stone-200/70">
                    <span className="text-[11px] font-semibold text-stone-500 block mb-1">Prescription Details:</span>
                    <p className="text-stone-700 text-xs sm:text-sm leading-relaxed font-medium">
                      {cleanSuggestionText(diagnosis.chemicalTreatment)}
                    </p>
                  </div>
                </Card>

                {/* 2. Organic & Biological Remedy */}
                <Card padding="md" className="rounded-3xl border border-stone-200/80 bg-white shadow-card space-y-3.5">
                  <div className="flex items-center justify-between border-b border-emerald-100 pb-2.5">
                    <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-sm">
                      <div className="p-1.5 rounded-xl bg-emerald-50 border border-emerald-200/60 text-emerald-700">
                        <Leaf className="h-4 w-4" />
                      </div>
                      <h4>Organic & Biological Remedy</h4>
                    </div>
                    <Badge variant="success" size="sm">Eco-Safe</Badge>
                  </div>

                  {/* Formatted biological dosage pills */}
                  {(() => {
                    const parsedItems = parsePrescriptionItems(diagnosis.organicTreatment);
                    if (parsedItems.length > 0) {
                      return (
                        <div className="space-y-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                            Bio-Control Agents:
                          </span>
                          <div className="space-y-2">
                            {parsedItems.map((item) => (
                              <div
                                key={item.id}
                                className="p-2.5 rounded-xl bg-emerald-50/50 border border-emerald-100 flex items-center justify-between gap-2 text-xs"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="px-2 py-0.5 rounded-lg text-[10px] font-extrabold bg-emerald-200 text-emerald-900">
                                    {item.label}
                                  </span>
                                  <span className="font-bold text-stone-900">{item.remedy}</span>
                                </div>
                                {item.dosage && (
                                  <span className="px-2 py-0.5 rounded-lg bg-white border border-emerald-200/80 font-extrabold text-emerald-800 text-[11px] shrink-0 shadow-soft">
                                    {item.dosage}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })()}

                  {/* Clean text description (with zero @ or special characters) */}
                  <div className="p-3.5 rounded-2xl bg-[#FAF9F5] border border-stone-200/70">
                    <span className="text-[11px] font-semibold text-stone-500 block mb-1">Biological Guidelines:</span>
                    <p className="text-stone-700 text-xs sm:text-sm leading-relaxed font-medium">
                      {cleanSuggestionText(diagnosis.organicTreatment)}
                    </p>
                  </div>
                </Card>
              </div>

              {/* 3. Preventive Cultural Practices Card */}
              <Card padding="md" className="rounded-3xl border border-stone-200/80 bg-white shadow-card space-y-2.5">
                <div className="flex items-center gap-2 text-amber-800 font-extrabold text-sm border-b border-amber-100 pb-2">
                  <div className="p-1.5 rounded-xl bg-amber-50 border border-amber-200/60 text-amber-700">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <h4>Preventive & Cultural Agronomy Guidelines</h4>
                </div>
                <p className="text-stone-700 text-xs sm:text-sm leading-relaxed p-3.5 rounded-2xl bg-[#FAF9F5] border border-stone-200/70 font-medium">
                  {cleanSuggestionText(diagnosis.prevention)}
                </p>
              </Card>

              {/* Differential Diagnosis (Top-3 Probability Spectrum) */}
              {diagnosis.differentialDiagnosis && diagnosis.differentialDiagnosis.length > 1 && (
                <Card padding="md" className="rounded-3xl border border-stone-200/80 bg-white shadow-card space-y-3">
                  <div className="flex items-center gap-2 text-stone-800 font-extrabold text-sm border-b border-stone-100 pb-2">
                    <div className="p-1.5 rounded-xl bg-stone-100 border border-stone-200 text-stone-700">
                      <Layers className="h-4 w-4" />
                    </div>
                    <h4>Top Differential Diagnoses</h4>
                  </div>

                  <div className="space-y-2.5">
                    {diagnosis.differentialDiagnosis.map((alt, idx) => (
                      <div key={alt.className} className="p-3 rounded-2xl bg-[#FAF9F5] border border-stone-200/70 space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-stone-900">
                            #{idx + 1} {alt.crop} — {alt.disease}
                          </span>
                          <span className="font-extrabold text-stone-700">
                            {alt.confidence}%
                          </span>
                        </div>
                        {/* Progress Bar */}
                        <div className="w-full bg-stone-200/70 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              idx === 0 ? 'bg-emerald-600' : 'bg-stone-400'
                            }`}
                            style={{ width: `${Math.min(100, Math.max(0, alt.confidence))}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Bottom Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                  size="lg"
                  className="rounded-2xl font-bold py-3.5 bg-emerald-800 hover:bg-emerald-700 flex-1 shadow-md"
                  onClick={handleReset}
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Diagnose Another Foliar Sample
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-2xl font-bold py-3.5 border-stone-300 text-stone-700 hover:text-stone-900"
                  onClick={() => setActiveTab('history')}
                >
                  <History className="mr-2 h-4 w-4 text-emerald-700" />
                  View All Diagnostic History
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* TAB 2: DIAGNOSTIC HISTORY VIEW */}
      {activeTab === 'history' && (
        <div className="space-y-5 animate-fade-in">
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-stone-200/80 shadow-soft">
            <div className="relative flex-1">
              <Search className="h-4 w-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search history by crop or disease (e.g. Tomato, Early Blight)..."
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#FAF9F5] border border-stone-200 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="flex bg-[#FAF9F5] p-1 rounded-2xl border border-stone-200">
                <button
                  type="button"
                  onClick={() => setHistoryFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    historyFilter === 'all' ? 'bg-white text-stone-900 shadow-soft' : 'text-stone-600'
                  }`}
                >
                  All ({history.length})
                </button>
                <button
                  type="button"
                  onClick={() => setHistoryFilter('diseased')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    historyFilter === 'diseased' ? 'bg-white text-rose-700 shadow-soft' : 'text-stone-600'
                  }`}
                >
                  Infected
                </button>
                <button
                  type="button"
                  onClick={() => setHistoryFilter('healthy')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    historyFilter === 'healthy' ? 'bg-white text-emerald-800 shadow-soft' : 'text-stone-600'
                  }`}
                >
                  Healthy
                </button>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="rounded-2xl text-xs font-bold"
                onClick={() => {
                  handleReset();
                  setActiveTab('detect');
                }}
              >
                <Camera className="h-3.5 w-3.5 mr-1.5 text-emerald-700" />
                New Scan
              </Button>
            </div>
          </div>

          {/* History List or Empty State */}
          {historyLoading ? (
            <Card padding="lg" className="rounded-3xl border border-stone-200/80 bg-white text-center py-12">
              <div className="w-10 h-10 rounded-full border-4 border-emerald-200 border-t-emerald-800 animate-spin mx-auto mb-3" />
              <p className="text-xs text-stone-500 font-semibold">Loading your pathology history records...</p>
            </Card>
          ) : filteredHistory.length === 0 ? (
            <Card padding="lg" className="rounded-3xl border border-stone-200/80 bg-white text-center py-16 shadow-card space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
                <Microscope className="h-8 w-8 text-stone-400" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-stone-800">No Diagnostic Records Found</h4>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  {historySearch ? 'No pathology results match your search keywords.' : 'You have not diagnosed any foliar crop leaves yet. Upload or scan a photo to build your diagnostic history.'}
                </p>
              </div>
              <Button
                size="md"
                className="rounded-2xl font-bold bg-emerald-800 hover:bg-emerald-700 text-xs px-6 py-2.5"
                onClick={() => {
                  handleReset();
                  setActiveTab('detect');
                }}
              >
                <Camera className="h-3.5 w-3.5 mr-1.5" />
                Scan First Foliar Sample
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredHistory.map((item) => (
                <Card
                  key={item.id}
                  padding="md"
                  className="rounded-3xl border border-stone-200/80 bg-white hover:border-emerald-600/60 transition-all shadow-card hover:shadow-md cursor-pointer overflow-hidden group"
                  onClick={() => handleSelectHistoryItem(item)}
                >
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    {/* Thumbnail */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0 relative">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.crop}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-400">
                          <Microscope className="h-8 w-8 text-stone-300" />
                        </div>
                      )}
                      <div className="absolute top-1 left-1">
                        <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-black ${
                          item.isHealthy ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                        }`}>
                          {item.isHealthy ? 'Healthy' : (item.severity || 'Infected')}
                        </span>
                      </div>
                    </div>

                    {/* Metadata & Diagnosis */}
                    <div className="flex-1 space-y-1.5 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-stone-900 uppercase tracking-wide">
                            {item.crop}
                          </span>
                          <span className="text-stone-300">•</span>
                          <span className="text-xs text-stone-500 font-medium flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(item.createdAt)}
                          </span>
                        </div>

                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/70">
                          {item.confidence}% Match
                        </span>
                      </div>

                      <h4 className="text-base sm:text-lg font-black text-stone-900 tracking-tight group-hover:text-emerald-800 transition-colors">
                        {item.disease}
                      </h4>

                      {/* Brief remedy snippet */}
                      <p className="text-xs text-stone-600 line-clamp-1">
                        <span className="font-semibold text-stone-700">Prescription: </span>
                        {cleanSuggestionText(item.chemicalTreatment || item.organicTreatment || item.symptoms || 'Diagnostic report saved')}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <Button
                        size="sm"
                        className="rounded-2xl font-bold text-xs bg-emerald-800 hover:bg-emerald-700 text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectHistoryItem(item);
                        }}
                      >
                        <span>View Plan</span>
                        <ChevronRight className="h-3.5 w-3.5 ml-1" />
                      </Button>

                      <button
                        type="button"
                        onClick={(e) => handleDeleteHistoryItem(e, item.id)}
                        disabled={deletingId === item.id}
                        className="p-2 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-50"
                        title="Delete record"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Supported 38 Classes Catalog Modal */}
      <Modal
        isOpen={showCatalogModal}
        onClose={() => setShowCatalogModal(false)}
        title="PlantVillage 38 Pathology Classes in model_v1.pt"
      >
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          <p className="text-xs text-stone-600">
            The fine-tuned <span className="font-bold text-stone-900">EfficientNet-B0</span> model recognizes 38 foliar conditions across 14 major agricultural crops:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {[
              { crop: 'Apple', diseases: ['Apple Scab', 'Black Rot', 'Cedar Apple Rust', 'Healthy'] },
              { crop: 'Corn (Maize)', diseases: ['Gray Leaf Spot', 'Common Rust', 'Northern Leaf Blight', 'Healthy'] },
              { crop: 'Grape', diseases: ['Black Rot', 'Esca (Black Measles)', 'Leaf Blight (Isariopsis)', 'Healthy'] },
              { crop: 'Potato', diseases: ['Early Blight', 'Late Blight', 'Healthy'] },
              { crop: 'Tomato', diseases: ['Bacterial Spot', 'Early Blight', 'Late Blight', 'Leaf Mold', 'Septoria Spot', 'Spider Mites', 'Target Spot', 'Yellow Leaf Curl Virus', 'Mosaic Virus', 'Healthy'] },
              { crop: 'Citrus (Orange)', diseases: ['Citrus Greening (HLB)'] },
              { crop: 'Bell Pepper', diseases: ['Bacterial Spot', 'Healthy'] },
              { crop: 'Cherry', diseases: ['Powdery Mildew', 'Healthy'] },
              { crop: 'Peach', diseases: ['Bacterial Spot', 'Healthy'] },
              { crop: 'Squash', diseases: ['Powdery Mildew'] },
              { crop: 'Strawberry', diseases: ['Leaf Scorch', 'Healthy'] },
              { crop: 'Soybean', diseases: ['Healthy Foliage'] },
              { crop: 'Blueberry', diseases: ['Healthy Foliage'] },
              { crop: 'Raspberry', diseases: ['Healthy Foliage'] },
            ].map((item) => (
              <div key={item.crop} className="p-3 rounded-2xl bg-[#FAF9F5] border border-stone-200/80 space-y-1">
                <span className="font-extrabold text-stone-900 text-xs block">{item.crop}</span>
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  {item.diseases.join(' • ')}
                </p>
              </div>
            ))}
          </div>

          <Button
            variant="outline"
            className="w-full rounded-2xl font-bold mt-2"
            onClick={() => setShowCatalogModal(false)}
          >
            Close Library
          </Button>
        </div>
      </Modal>
    </div>
  );
};
