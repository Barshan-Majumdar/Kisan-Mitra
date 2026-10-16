import React, { useState, useRef } from 'react';
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
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import api from '../services/api';
import type { DiseaseResult } from '../types';

// Preset sample foliage images for instant 1-click testing
const PRESET_SAMPLES = [
  {
    name: 'Potato Late Blight',
    crop: 'Potato',
    hint: 'Foliar blight test',
    color: 'from-amber-700 to-stone-800',
    // Small realistic potato leaf with late blight necrotic spots (JPEG data URI)
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
        {/* Concentric rings target spot */}
        <circle cx="45" cy="48" r="16" fill="#7a6229" opacity="0.7" />
        <circle cx="45" cy="48" r="12" fill="#523e16" />
        <circle cx="45" cy="48" r="8" fill="#362509" />
        <circle cx="45" cy="48" r="4" fill="#1f1403" />
        <circle cx="62" cy="68" r="9" fill="#523e16" opacity="0.8" />
      </svg>
    )
  },
  {
    name: 'Healthy Crop Leaf',
    crop: 'Corn/Apple',
    hint: 'Pathogen-free test',
    color: 'from-emerald-700 to-green-900',
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <path d="M50 5 C25 20 18 55 28 85 C42 88 50 98 50 98 C50 98 58 88 72 85 C82 55 75 20 50 5 Z" fill="#2e7d32" />
        <path d="M50 10 L50 95" stroke="#1b5e20" strokeWidth="2.5" />
        <path d="M50 30 Q35 25 25 35 M50 45 Q35 40 22 55 M50 60 Q35 55 24 72" stroke="#4caf50" strokeWidth="1.2" fill="none" opacity="0.7" />
        <path d="M50 30 Q65 25 75 35 M50 45 Q65 40 78 55 M50 60 Q65 55 76 72" stroke="#4caf50" strokeWidth="1.2" fill="none" opacity="0.7" />
      </svg>
    )
  }
];

export const DiseaseDetect: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [diagnosis, setDiagnosis] = useState<DiseaseResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCatalogModal, setShowCatalogModal] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

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

    // Fill background
    ctx.fillStyle = '#FAF9F5';
    ctx.fillRect(0, 0, 224, 224);

    if (sampleIndex === 0) {
      // Potato Late Blight Pattern
      ctx.fillStyle = '#4a7c38';
      ctx.beginPath();
      ctx.ellipse(112, 112, 80, 100, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#2d1e12';
      ctx.beginPath();
      ctx.ellipse(90, 95, 35, 25, 0.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#150d08';
      ctx.beginPath();
      ctx.ellipse(92, 97, 25, 18, 0.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#3a281a';
      ctx.beginPath();
      ctx.ellipse(140, 150, 25, 20, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (sampleIndex === 1) {
      // Tomato Target Spots Pattern
      ctx.fillStyle = '#588b39';
      ctx.beginPath();
      ctx.ellipse(112, 112, 75, 95, 0, 0, Math.PI * 2);
      ctx.fill();

      // Concentric rings
      ctx.fillStyle = '#7a6229';
      ctx.beginPath();
      ctx.arc(100, 100, 40, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#523e16';
      ctx.beginPath();
      ctx.arc(100, 100, 28, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#362509';
      ctx.beginPath();
      ctx.arc(100, 100, 16, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Healthy Green Leaf
      ctx.fillStyle = '#2e7d32';
      ctx.beginPath();
      ctx.ellipse(112, 112, 80, 105, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#1b5e20';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(112, 20);
      ctx.lineTo(112, 210);
      ctx.stroke();
    }

    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    setSelectedImage(dataUrl);
    runDiagnosis(dataUrl);
  };

  // Run prediction with model_v1.pt via backend API
  const runDiagnosis = async (base64Img: string) => {
    setAnalyzing(true);
    setError(null);
    setDiagnosis(null);

    try {
      const response = await api.post('/disease/predict', { image: base64Img });
      if (response.data && response.data.success) {
        setDiagnosis(response.data);
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

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in px-1 pb-12">
      {/* Header section */}
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

      {/* Main Upload & Scanning Zone */}
      {!diagnosis ? (
        <div className="space-y-6">
          <Card padding="lg" className="rounded-3xl border border-stone-200/80 bg-white shadow-card overflow-hidden">
            <div className="py-8 sm:py-10 flex flex-col items-center text-center">
              {/* Camera Icon Glow */}
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
              <p className="text-stone-600 text-sm max-w-md mb-6 leading-relaxed">
                Take a close-up photo of infected leaves, stems, or lesions in good natural lighting for instant deep learning analysis.
              </p>

              {/* Upload Drag & Drop Box */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full max-w-lg p-6 sm:p-8 rounded-3xl border-2 border-dashed border-stone-300 hover:border-emerald-600 bg-[#FAF9F5] hover:bg-emerald-50/30 transition-all cursor-pointer group mb-6"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <UploadCloud className="h-10 w-10 mx-auto mb-3 text-stone-400 group-hover:text-emerald-700 group-hover:scale-110 transition-all" />
                <p className="text-sm font-bold text-stone-800">
                  Click to Browse or Drag & Drop Foliar Image
                </p>
                <p className="text-xs text-stone-500 mt-1">
                  Supports High-Res JPG, PNG, WEBP (Leaves, Stems, Fruit Spots)
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                <Button
                  variant="primary"
                  className="flex-1 rounded-2xl font-bold py-3 flex items-center justify-center gap-2 shadow-sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={analyzing}
                >
                  <UploadCloud className="h-4 w-4" />
                  <span>Upload Leaf Photo</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 rounded-2xl font-bold py-3 flex items-center justify-center gap-2 text-stone-800 border-stone-300"
                  onClick={() => cameraInputRef.current?.click()}
                  disabled={analyzing}
                >
                  <Camera className="h-4 w-4 text-emerald-700" />
                  <span>Take Live Picture</span>
                </Button>
              </div>

              {/* Analyzing Loader State */}
              {analyzing && (
                <div className="mt-8 p-5 rounded-2xl bg-emerald-50 border border-emerald-200/80 w-full max-w-md animate-pulse text-center space-y-2">
                  <div className="flex items-center justify-center gap-2 text-emerald-800 font-bold text-sm">
                    <Activity className="h-4 w-4 animate-spin text-emerald-600" />
                    <span>Inference in Progress via model_v1.pt...</span>
                  </div>
                  <p className="text-xs text-stone-600">
                    Extracting foliar vein morphology, lesion necrosis, and comparing with 38 PlantVillage pathogen profiles.
                  </p>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mt-6 p-4 rounded-2xl bg-rose-50 border border-rose-200/80 text-rose-800 text-xs font-semibold max-w-md flex items-center gap-2 text-left">
                  <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>
          </Card>

          {/* Quick Demo Leaf Samples */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-emerald-700" />
                1-Click Foliar Test Samples
              </h4>
              <button
                onClick={() => setShowCatalogModal(true)}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
              >
                <span>View All 38 Detectable Diseases</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {PRESET_SAMPLES.map((sample, idx) => (
                <button
                  key={sample.name}
                  onClick={() => handleSampleClick(idx)}
                  disabled={analyzing}
                  className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white border border-stone-200/80 hover:border-emerald-600 shadow-sm hover:shadow-card hover:-translate-y-0.5 transition-all text-left cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-xl bg-stone-100 border border-stone-200/60 p-1 shrink-0 flex items-center justify-center overflow-hidden">
                    {sample.svg}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-stone-900 group-hover:text-emerald-800 transition-colors truncate">
                      {sample.name}
                    </p>
                    <p className="text-[11px] text-stone-500 truncate">
                      {sample.crop} • {sample.hint}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Diagnosis Results View */
        <div className="space-y-6 animate-fade-in">
          {/* Top Result Banner */}
          <Card
            padding="lg"
            className={`rounded-3xl border shadow-card overflow-hidden ${
              diagnosis.isHealthy
                ? 'bg-gradient-to-br from-emerald-50/70 via-white to-emerald-50/30 border-emerald-200/80'
                : 'bg-gradient-to-br from-rose-50/70 via-white to-amber-50/30 border-rose-200/80'
            }`}
          >
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Image Preview Thumbnail */}
              {selectedImage && (
                <div className="w-full md:w-44 h-44 rounded-2xl border border-stone-200/80 overflow-hidden shadow-soft shrink-0 relative bg-stone-900">
                  <img
                    src={selectedImage}
                    alt="Analyzed Crop Leaf"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm text-[10px] font-bold text-white px-2 py-0.5 rounded-md">
                    224 × 224 Scanned
                  </div>
                </div>
              )}

              {/* Pathology Verdict */}
              <div className="space-y-3 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant={diagnosis.isHealthy ? 'success' : 'error'}
                    size="sm"
                    className="font-extrabold uppercase tracking-wider"
                  >
                    {diagnosis.isHealthy ? 'Healthy Tissue' : `${diagnosis.severity} Severity`}
                  </Badge>

                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200/70">
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
                <p className="text-stone-700 text-sm leading-relaxed bg-white/80 p-3.5 rounded-2xl border border-stone-200/70">
                  <span className="font-bold text-stone-900">Key Visual Symptoms: </span>
                  {diagnosis.symptoms}
                </p>

                {/* Model Attribution */}
                <div className="flex items-center gap-2 text-[11px] text-stone-500 font-medium">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Validated by <span className="font-semibold text-stone-700">model_v1.pt</span> (Trained on 38-Class PlantVillage foliar dataset)</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Curative Treatment Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Chemical Treatment Prescription */}
            <Card padding="md" className="rounded-3xl border border-stone-200/80 bg-white shadow-card space-y-3">
              <div className="flex items-center gap-2 text-rose-800 font-extrabold text-sm">
                <div className="p-1.5 rounded-xl bg-rose-50 border border-rose-200/60 text-rose-700">
                  <Pill className="h-4 w-4" />
                </div>
                <h4>Curative Chemical Prescription</h4>
              </div>
              <p className="text-stone-700 text-xs sm:text-sm leading-relaxed p-3.5 rounded-2xl bg-[#FAF9F5] border border-stone-200/70 font-medium">
                {diagnosis.chemicalTreatment}
              </p>
            </Card>

            {/* Organic & Biological Remedy */}
            <Card padding="md" className="rounded-3xl border border-stone-200/80 bg-white shadow-card space-y-3">
              <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-sm">
                <div className="p-1.5 rounded-xl bg-emerald-50 border border-emerald-200/60 text-emerald-700">
                  <Leaf className="h-4 w-4" />
                </div>
                <h4>Organic & Biological Remedy</h4>
              </div>
              <p className="text-stone-700 text-xs sm:text-sm leading-relaxed p-3.5 rounded-2xl bg-[#FAF9F5] border border-stone-200/70 font-medium">
                {diagnosis.organicTreatment}
              </p>
            </Card>
          </div>

          {/* Preventive Cultural Practices Card */}
          <Card padding="md" className="rounded-3xl border border-stone-200/80 bg-white shadow-card space-y-2.5">
            <div className="flex items-center gap-2 text-amber-800 font-extrabold text-sm">
              <div className="p-1.5 rounded-xl bg-amber-50 border border-amber-200/60 text-amber-700">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <h4>Preventive & Cultural Agronomy Guidelines</h4>
            </div>
            <p className="text-stone-700 text-xs sm:text-sm leading-relaxed p-3.5 rounded-2xl bg-[#FAF9F5] border border-stone-200/70 font-medium">
              {diagnosis.prevention}
            </p>
          </Card>

          {/* Differential Diagnosis (Top-3 Probability Spectrum) */}
          {diagnosis.differentialDiagnosis && diagnosis.differentialDiagnosis.length > 1 && (
            <Card padding="md" className="rounded-3xl border border-stone-200/80 bg-white shadow-card space-y-3">
              <div className="flex items-center gap-2 text-stone-800 font-extrabold text-sm">
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
                        style={{ width: `${Math.min(alt.confidence, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Bottom Action Footer */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              variant="primary"
              className="flex-1 rounded-2xl font-bold py-3 flex items-center justify-center gap-2 shadow-sm"
              onClick={handleReset}
            >
              <RotateCcw className="h-4 w-4" />
              <span>Scan Another Leaf / Plant</span>
            </Button>
            <Button
              variant="outline"
              className="rounded-2xl font-bold py-3 text-stone-700 hover:text-stone-900 border-stone-300"
              onClick={() => setShowCatalogModal(true)}
            >
              <HelpCircle className="h-4 w-4 text-emerald-700 mr-2" />
              <span>Supported Disease Library</span>
            </Button>
          </div>
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
