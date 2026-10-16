import React from 'react';
import { Camera, Sparkles, UploadCloud, ShieldAlert } from 'lucide-react';
import { Card } from '../components/ui/Card';

export const DiseaseDetect: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in px-1">
      <div className="space-y-1">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">Vision Pathology Diagnostic</h2>
        <p className="text-sm text-stone-600">Computer vision leaf and stem disease detection with precision fungicide prescriptions.</p>
      </div>

      <Card padding="lg" className="rounded-3xl border border-stone-200/80 bg-white shadow-card text-center overflow-hidden">
        <div className="py-8 sm:py-12 flex flex-col items-center">
          <div className="relative mb-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-[#FAF9F5] border border-stone-200/90 flex items-center justify-center shadow-soft">
              <Camera className="h-10 w-10 text-emerald-700" />
            </div>
            <div className="absolute -top-1.5 -right-1.5 w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center shadow-soft">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-200/70 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
            Computer Vision Module
          </span>

          <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900 mb-2 tracking-tight">
            Next-Gen Crop Diagnostics in Training
          </h3>

          <p className="text-stone-600 text-sm sm:text-base max-w-md mb-6 leading-relaxed">
            Our deep learning model is being fine-tuned on 40,000+ local Indian foliar blight, rust, and viral infection samples for automated diagnosis.
          </p>

          <div className="w-full max-w-md p-6 rounded-2xl border-2 border-dashed border-stone-200 bg-[#FAF9F5] text-stone-500 mb-6">
            <UploadCloud className="h-8 w-8 mx-auto mb-2 text-stone-400" />
            <p className="text-xs font-semibold text-stone-700">Camera / File Upload Pipeline</p>
            <p className="text-[11px] text-stone-500 mt-0.5">High-resolution JPEG/PNG leaf capture integration arriving in v2.1</p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-stone-600 bg-stone-100/80 px-4 py-2 rounded-full border border-stone-200">
            <ShieldAlert className="h-3.5 w-3.5 text-stone-500" />
            <span>Currently validating diagnostic accuracy with university agronomy labs</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

