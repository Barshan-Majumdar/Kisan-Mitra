import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sprout,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Landmark,
  CheckCircle2,
  CalendarCheck,
  MessageSquareCode,
  ScanEye,
  Activity,
  Layers,
  ChevronDown,
  ChevronRight,
  LineChart,
} from 'lucide-react';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { LanguageToggle } from '../components/LanguageToggle';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#F4F3EE] text-stone-900 font-sans selection:bg-emerald-100 selection:text-emerald-900 relative overflow-x-hidden">
      {/* Background Decorative Mesh Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[650px] pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-100px] left-[15%] w-[450px] h-[450px] rounded-full bg-emerald-300/20 blur-[120px]" />
        <div className="absolute top-[80px] right-[10%] w-[500px] h-[500px] rounded-full bg-lime-300/15 blur-[140px]" />
        <div className="absolute top-[280px] left-[40%] w-[350px] h-[350px] rounded-full bg-amber-200/20 blur-[130px]" />
      </div>

      {/* Floating Modern Header / Navbar */}
      <header className="sticky top-3.5 z-50 px-4 sm:px-6">
        <nav className="mx-auto max-w-7xl rounded-full bg-white/85 backdrop-blur-md border border-stone-200/80 px-4 sm:px-6 py-2.5 flex items-center justify-between shadow-card transition-all duration-300">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2.5 group cursor-pointer">
            <div className="bg-emerald-800 p-2 rounded-2xl text-white shadow-soft group-hover:scale-105 transition-transform">
              <Sprout className="h-5 w-5 text-emerald-300" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-lg font-extrabold tracking-tight text-stone-900">
                  Kisan Mitra
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  AI 2.0
                </span>
              </div>
            </div>
          </Link>

          {/* Nav Center Links (Desktop) */}
          <div className="hidden lg:flex items-center gap-6 text-xs font-bold text-stone-600">
            <a href="#features" className="hover:text-emerald-800 transition-colors">
              Platform Features
            </a>
            <a href="#technology" className="hover:text-emerald-800 transition-colors">
              AI Technology
            </a>
            <a href="#schemes" className="hover:text-emerald-800 transition-colors">
              Govt Schemes
            </a>
            <a href="#mandi" className="hover:text-emerald-800 transition-colors">
              APMC Mandi
            </a>
            <a href="#faq" className="hover:text-emerald-800 transition-colors">
              FAQ
            </a>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <LanguageToggle />

            <SignedOut>
              <Link
                to="/login"
                className="hidden sm:inline-flex px-4 py-2 rounded-full text-xs font-bold text-stone-700 hover:text-stone-900 hover:bg-stone-100 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold text-white bg-emerald-800 hover:bg-emerald-700 active:bg-emerald-900 shadow-soft transition-all hover:shadow-card hover:-translate-y-0.5"
              >
                <span>Get Started</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </SignedOut>

            <SignedIn>
              <button
                onClick={() => navigate('/dashboard')}
                className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold text-white bg-emerald-800 hover:bg-emerald-700 shadow-soft transition-all"
              >
                <span>Dashboard</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
              <div className="ml-1">
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-12 sm:pt-16 pb-16 px-4 sm:px-6 relative">
        <div className="mx-auto max-w-5xl text-center space-y-6">
          {/* Status Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-stone-200/90 shadow-soft text-xs font-bold text-stone-800">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
            </span>
            <span className="text-stone-600">Dual-Stage AI Agronomy</span>
            <span className="text-stone-300">•</span>
            <span className="text-emerald-800 font-extrabold">Govt Data Integrated</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-stone-900 leading-[1.08]">
            Intelligent Farming for <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-emerald-800 via-emerald-600 to-lime-600 bg-clip-text text-transparent">
              Higher Yields & Profitability
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-3xl mx-auto text-base sm:text-lg md:text-xl text-stone-600 leading-relaxed font-normal">
            Precision soil chemistry analysis, PyTorch leaf disease diagnostics, live APMC mandi rates from{' '}
            <span className="font-semibold text-stone-800">data.gov.in</span>, and direct welfare subsidies via{' '}
            <span className="font-semibold text-stone-800">API Mitra</span>—unified into a single, farmer-first workspace.
          </p>

          {/* CTA Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <SignedOut>
              <Link
                to="/signup"
                className="w-full sm:w-auto px-7 py-3.5 rounded-full font-bold text-sm sm:text-base text-white bg-emerald-800 hover:bg-emerald-700 active:bg-emerald-900 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
              >
                <span>Get Started Free</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-7 py-3.5 rounded-full font-bold text-sm sm:text-base text-stone-800 bg-white hover:bg-stone-50 border border-stone-200/90 shadow-soft hover:shadow-card transition-all flex items-center justify-center gap-2"
              >
                <span>Sign In to Portal</span>
                <ChevronRight className="h-4 w-4 text-stone-400" />
              </Link>
            </SignedOut>

            <SignedIn>
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-sm sm:text-base text-white bg-emerald-800 hover:bg-emerald-700 shadow-card hover:shadow-card-hover transition-all flex items-center justify-center gap-2"
              >
                <span>Enter Farmer Workspace</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </SignedIn>
          </div>

          {/* Trust Metrics Bar */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm font-semibold text-stone-600">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Higher Prediction Accuracy</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>50+ Supported Indian Crops</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>100% Free for Farmers</span>
            </div>
          </div>
        </div>

        {/* Live Interactive Workspace Preview Showcase Card */}
        <div className="mt-12 sm:mt-16 mx-auto max-w-6xl">
          <div className="relative rounded-[1.375rem] bg-white p-4 sm:p-6 lg:p-8 border border-stone-200/90 shadow-island overflow-hidden">
            {/* Top Workspace Header Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-100 gap-3">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-rose-400" />
                <div className="h-3 w-3 rounded-full bg-amber-400" />
                <div className="h-3 w-3 rounded-full bg-emerald-400" />
                <span className="text-xs font-bold text-stone-400 ml-2">kisan-mitra.workspace / live-preview</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200/60 self-start sm:self-auto">
                <Activity className="h-3.5 w-3.5 text-emerald-600 animate-pulse" />
                <span>Live Agro-Sensor & Yield Engine</span>
              </div>
            </div>

            {/* Micro Dashboard Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-6">
              {/* Card 1: Crop Recommendation Match */}
              <div className="p-5 rounded-3xl bg-[#FAF9F5] border border-stone-200/70 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    Dual-Stage AI Output
                  </span>
                  <span className="text-xs font-black text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                    96.8% Match
                  </span>
                </div>
                <div>
                  <h4 className="text-xl font-extrabold text-stone-900">Rice (Oryza sativa)</h4>
                  <p className="text-xs text-stone-500 mt-1">Recommended for Alluvial Loam • Nadia, WB</p>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-stone-600">
                    <span>Soil Nitrogen (N: 90 kg/ha)</span>
                    <span className="text-emerald-700 font-bold">Optimal</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-stone-200 overflow-hidden">
                    <div className="h-full bg-emerald-600 rounded-full w-[94%]" />
                  </div>
                </div>
                <div className="pt-2 flex items-center justify-between text-xs text-stone-600">
                  <span>Harvest Window:</span>
                  <span className="font-bold text-stone-900">110-120 Days</span>
                </div>
              </div>

              {/* Card 2: Plant Disease Diagnostic */}
              <div className="p-5 rounded-3xl bg-[#FAF9F5] border border-stone-200/70 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    PyTorch Computer Vision
                  </span>
                  <span className="text-xs font-black text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-full">
                    Detected
                  </span>
                </div>
                <div>
                  <h4 className="text-xl font-extrabold text-stone-900">Rice Leaf Blast</h4>
                  <p className="text-xs text-stone-500 mt-1">Magnaporthe oryzae • Moderate Severity</p>
                </div>
                <div className="p-3 rounded-2xl bg-white border border-stone-200/80 text-xs text-stone-700 space-y-1">
                  <div className="font-bold text-emerald-800 flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    Recommended Prescription:
                  </div>
                  <p className="text-[11px] leading-relaxed text-stone-600">
                    Foliar spray of Tricyclazole 75% WP @ 0.6g/L + Neem oil 2ml/L.
                  </p>
                </div>
                <div className="pt-1 flex items-center justify-between text-xs text-stone-600">
                  <span>Scan Time:</span>
                  <span className="font-bold text-emerald-700">120ms (YOLO11m)</span>
                </div>
              </div>

              {/* Card 3: Mandi Rates & Govt Welfare */}
              <div className="p-5 rounded-3xl bg-[#FAF9F5] border border-stone-200/70 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    APMC & Welfare Aid
                  </span>
                  <span className="text-xs font-black text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded-full">
                    Live Rates
                  </span>
                </div>
                <div>
                  <div className="flex items-baseline justify-between">
                    <h4 className="text-xl font-extrabold text-stone-900">₹3,850 / Qtl</h4>
                    <span className="text-xs font-bold text-emerald-600 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-0.5" /> +4.2%
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-1">Ranaghat Mandi (AGMARKNET data.gov.in)</p>
                </div>

                <div className="p-3 rounded-2xl bg-white border border-stone-200/80 space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-stone-800">
                    <span>PM-KISAN DBT Scheme</span>
                    <span className="text-emerald-700">Active</span>
                  </div>
                  <p className="text-[11px] text-stone-500">₹6,000 / yr income support via API Mitra</p>
                </div>

                <div className="pt-1 flex items-center justify-between text-xs text-stone-600">
                  <span>Official Application:</span>
                  <span className="font-bold text-emerald-700 underline">1-Click Portal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Pillars (Bento Grid) */}
      <section id="features" className="py-20 px-4 sm:px-6 bg-white border-y border-stone-200/80">
        <div className="mx-auto max-w-6xl space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-800">
              End-to-End Agronomy Platform
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
              Six Specialized Tools Built for Bharat's Farmers
            </h3>
            <p className="text-stone-600 text-sm sm:text-base">
              Everything required to plan, diagnose, harvest, and sell—powered by AI models tailored to Indian geography.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-7 rounded-3xl bg-[#FAF9F5] border border-stone-200/80 hover:border-emerald-300 hover:shadow-card transition-all group">
              <div className="h-12 w-12 rounded-2xl bg-emerald-100/80 text-emerald-800 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <Sparkles className="h-6 w-6" />
              </div>
              <h4 className="text-xl font-bold text-stone-900 mb-2">Dual-Stage AI Crop Matching</h4>
              <p className="text-stone-600 text-sm leading-relaxed mb-4">
                Analyzes soil chemistry (N-P-K, pH) alongside localized rainfall and temperatures to rank the top 5 highest-yielding crops.
              </p>
              <div className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                <span>Multi-Crop Decision Trees</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </div>

            {/* Feature 2 */}
            <div className="p-7 rounded-3xl bg-[#FAF9F5] border border-stone-200/80 hover:border-emerald-300 hover:shadow-card transition-all group">
              <div className="h-12 w-12 rounded-2xl bg-amber-100/80 text-amber-800 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <ScanEye className="h-6 w-6" />
              </div>
              <h4 className="text-xl font-bold text-stone-900 mb-2">Leaf Disease Vision Diagnostics</h4>
              <p className="text-stone-600 text-sm leading-relaxed mb-4">
                Instant PyTorch & YOLO11m classifier identifies 75+ crop afflictions from leaf photos with organic and chemical treatment advice.
              </p>
              <div className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                <span>Computer Vision Inference</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </div>

            {/* Feature 3 */}
            <div className="p-7 rounded-3xl bg-[#FAF9F5] border border-stone-200/80 hover:border-emerald-300 hover:shadow-card transition-all group">
              <div className="h-12 w-12 rounded-2xl bg-blue-100/80 text-blue-800 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <LineChart className="h-6 w-6" />
              </div>
              <h4 className="text-xl font-bold text-stone-900 mb-2">Live APMC Mandi Rates</h4>
              <p className="text-stone-600 text-sm leading-relaxed mb-4">
                Direct integration with official <span className="font-semibold text-stone-800">data.gov.in</span> AGMARKNET wholesale rates across 3,000+ Indian mandis.
              </p>
              <div className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                <span>Real-Time Market Discovery</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </div>

            {/* Feature 4 */}
            <div className="p-7 rounded-3xl bg-[#FAF9F5] border border-stone-200/80 hover:border-emerald-300 hover:shadow-card transition-all group">
              <div className="h-12 w-12 rounded-2xl bg-purple-100/80 text-purple-800 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <Landmark className="h-6 w-6" />
              </div>
              <h4 className="text-xl font-bold text-stone-900 mb-2">Govt Subsidies & Schemes</h4>
              <p className="text-stone-600 text-sm leading-relaxed mb-4">
                Powered by <span className="font-semibold text-stone-800">API Mitra</span> & myScheme. Explore PM-KISAN, PMFBY, KCC, and state grants with direct official application links.
              </p>
              <div className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                <span>4,700+ Verified Schemes</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </div>

            {/* Feature 5 */}
            <div className="p-7 rounded-3xl bg-[#FAF9F5] border border-stone-200/80 hover:border-emerald-300 hover:shadow-card transition-all group">
              <div className="h-12 w-12 rounded-2xl bg-emerald-100/80 text-emerald-800 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <CalendarCheck className="h-6 w-6" />
              </div>
              <h4 className="text-xl font-bold text-stone-900 mb-2">120-Day Farming Action Schedule</h4>
              <p className="text-stone-600 text-sm leading-relaxed mb-4">
                Converts your recommended crop into an automated stage-by-stage action plan with checklist tracking from sowing to harvest.
              </p>
              <div className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                <span>Seasonal Task Automation</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </div>

            {/* Feature 6 */}
            <div className="p-7 rounded-3xl bg-[#FAF9F5] border border-stone-200/80 hover:border-emerald-300 hover:shadow-card transition-all group">
              <div className="h-12 w-12 rounded-2xl bg-stone-200/80 text-stone-800 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <MessageSquareCode className="h-6 w-6" />
              </div>
              <h4 className="text-xl font-bold text-stone-900 mb-2">Multilingual AI Agronomist</h4>
              <p className="text-stone-600 text-sm leading-relaxed mb-4">
                Ask questions in English, Hindi, or Bengali. Powered by Google Gemini 2.5 Flash for fertilizer dosages, soil conditioning, and pest remediation.
              </p>
              <div className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                <span>24/7 Agro Advisory</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology & Architecture Section */}
      <section id="technology" className="py-20 px-4 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-[1.5rem] bg-gradient-to-br from-[#0c261b] via-[#133c2a] to-[#1c543c] p-8 sm:p-12 lg:p-16 text-white relative overflow-hidden shadow-island">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-emerald-200">
                <Layers className="h-3.5 w-3.5 text-emerald-300" />
                <span>Modern Open Engineering</span>
              </div>
              <h3 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                Architected for High Precision in Rural Realities
              </h3>
              <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed">
                Kisan Mitra utilizes dual-stage machine learning trained on official Area-Production-Yield (APY) datasets, PyTorch convolutional vision models, and official government APIs.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-10 border-t border-white/15 mt-10">
              <div>
                <div className="text-3xl sm:text-4xl font-black text-emerald-300">75+</div>
                <div className="text-xs sm:text-sm text-emerald-100/80 mt-1">Disease Classes Detected</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-black text-emerald-300">3,000+</div>
                <div className="text-xs sm:text-sm text-emerald-100/80 mt-1">Live APMC Mandis</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-black text-emerald-300">4,700+</div>
                <div className="text-xs sm:text-sm text-emerald-100/80 mt-1">Welfare Schemes</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-black text-emerald-300">&lt; 1.2s</div>
                <div className="text-xs sm:text-sm text-emerald-100/80 mt-1">Model Inference Speed</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section id="faq" className="py-20 px-4 sm:px-6 bg-white border-t border-stone-200/80">
        <div className="mx-auto max-w-4xl space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-800">
              Answers & Transparency
            </h2>
            <h3 className="text-3xl font-extrabold text-stone-900 tracking-tight">
              Frequently Asked Questions
            </h3>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'How does Kisan Mitra recommend the best crops for my field?',
                a: 'Kisan Mitra evaluates your soil nitrogen (N), phosphorus (P), potassium (K), soil pH, and your geographic climate (temperature, humidity, seasonal rainfall). Our dual-stage Random Forest model cross-references these with regional historical yield data to output the top 5 optimal crops with confidence scores.',
              },
              {
                q: 'Where do the live Mandi prices and Government Schemes come from?',
                a: 'Mandi commodity prices are fetched live from data.gov.in (AGMARKNET Daily Commodity Prices). Government welfare schemes are integrated via API Mitra (mirrored from the official myScheme.gov.in portal) with verified direct links to central and state application gateways.',
              },
              {
                q: 'How does the plant disease detection work?',
                a: 'Our plant pathology diagnostic uses a custom-trained YOLO11m classifier and PyTorch neural runtime trained on thousands of crop disease leaf samples. Simply upload or take a photo of an affected leaf to receive an immediate diagnosis, severity estimate, and chemical/organic remedies.',
              },
              {
                q: 'Is Kisan Mitra accessible in regional languages like Bengali?',
                a: 'Yes! The entire interface supports English and Bengali (বাংলা) out of the box with one-click toggling. In addition, our AI Agronomist Chatbot understands and responds fluently in Hindi and Bengali.',
              },
              {
                q: 'Is there any fee or subscription required to use Kisan Mitra?',
                a: 'No. Kisan Mitra is 100% free for Indian farmers, students, agricultural researchers, and extension workers.',
              },
            ].map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-3xl border border-stone-200/80 bg-[#FAF9F5] p-5 sm:p-6 transition-all"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between text-left gap-4 cursor-pointer"
                  >
                    <span className="font-bold text-base sm:text-lg text-stone-900">{faq.q}</span>
                    <ChevronDown
                      className={`h-5 w-5 text-stone-500 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-emerald-700' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="pt-3 text-sm text-stone-600 leading-relaxed border-t border-stone-200/60 mt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-16 px-4 sm:px-6">
        <div className="mx-auto max-w-5xl rounded-[1.375rem] bg-emerald-800 p-8 sm:p-14 text-center text-white space-y-6 shadow-island relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-600/30 rounded-full blur-[90px] pointer-events-none" />
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
            Ready to Cultivate Smarter Yields?
          </h3>
          <p className="max-w-2xl mx-auto text-emerald-100 text-sm sm:text-base leading-relaxed">
            Join thousands of progressive agriculturalists across India utilizing AI agronomy to maximize seasonal profitability.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <SignedOut>
              <Link
                to="/signup"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-sm sm:text-base text-emerald-900 bg-white hover:bg-emerald-50 active:bg-stone-100 shadow-soft transition-all"
              >
                Create Free Farmer Account
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-sm sm:text-base text-white border border-white/30 hover:bg-white/10 transition-all"
              >
                Sign In
              </Link>
            </SignedOut>
            <SignedIn>
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-sm sm:text-base text-emerald-900 bg-white hover:bg-emerald-50 shadow-soft transition-all"
              >
                Open Farmer Dashboard →
              </button>
            </SignedIn>
          </div>
        </div>
      </section>

      {/* Modern Footer */}
      <footer className="border-t border-stone-200/80 bg-white py-12 px-4 sm:px-6">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-stone-500">
          <div className="flex items-center gap-2.5">
            <div className="bg-emerald-800 p-1.5 rounded-xl text-white shadow-soft">
              <Sprout className="h-4 w-4 text-emerald-300" />
            </div>
            <span className="font-extrabold text-stone-900 text-sm">Kisan Mitra Agronomy</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 font-semibold text-stone-600">
            <a href="#features" className="hover:text-emerald-800 transition-colors">
              Features
            </a>
            <a href="#technology" className="hover:text-emerald-800 transition-colors">
              Technology
            </a>
            <a href="#schemes" className="hover:text-emerald-800 transition-colors">
              Government Subsidies
            </a>
            <a href="#mandi" className="hover:text-emerald-800 transition-colors">
              APMC Mandi Prices
            </a>
          </div>

          <p>© 2026 Kisan Mitra. Data-driven agronomy for Indian agriculture.</p>
        </div>
      </footer>
    </div>
  );
};
