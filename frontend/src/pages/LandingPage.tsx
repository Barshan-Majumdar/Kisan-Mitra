import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sprout,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Landmark,
  MessageSquareCode,
  ScanEye,
  Activity,
  Layers,
  ChevronDown,
  LineChart,
  Check,
  ShieldCheck,
  CreditCard,
  MapPin,
  Cpu,
  Database,
  BarChart3,
  Zap,
} from 'lucide-react';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { LanguageToggle } from '../components/LanguageToggle';

// 4-Step Interactive Agronomy Pipeline Stepper matching reference layout
const PIPELINE_STEPS = [
  {
    step: '01',
    title: 'Calibrate Soil',
    description: 'N-P-K, pH & edaphic moisture telemetry',
    icon: Layers,
    metric: 'Optimal N: 90kg/ha • pH 6.8',
    route: '/calibrate',
  },
  {
    step: '02',
    title: 'Neural Pathology',
    description: 'PyTorch vision scan across 50+ crop diseases',
    icon: ScanEye,
    metric: 'YOLO11m • 120ms leaf inference',
    route: '/disease',
  },
  {
    step: '03',
    title: 'Crop Recommendation',
    description: 'Dual-stage agronomic climate match',
    icon: Sprout,
    metric: 'Rice (Oryza sativa) • 96.8% Match',
    route: '/recommendations',
  },
  {
    step: '04',
    title: 'Market & DBT Schemes',
    description: 'Live APMC rates & verified welfare portal',
    icon: TrendingUp,
    metric: 'AGMARKNET Mandi • ₹3,850/Qtl',
    route: '/market',
  },
];

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Auto-cycle through the 4-step pipeline when not hovered
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % PIPELINE_STEPS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused]);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#F4F3EE] text-stone-900 font-sans selection:bg-emerald-100 selection:text-emerald-900 relative overflow-x-hidden">
      {/* Subtle Engineering Grid Backdrop with Radial Mask */}
      <div className="absolute inset-0 engineering-grid pointer-events-none -z-10" />

      {/* Physical Archival Paper / Film-Grain Noise Texture */}
      <div className="absolute inset-0 noise-overlay pointer-events-none -z-10 opacity-65" />

      {/* Ambient Radial Mesh Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[780px] pointer-events-none overflow-hidden -z-20">
        <div className="absolute top-[-80px] left-[15%] w-[520px] h-[520px] rounded-full bg-emerald-400/20 blur-[130px]" />
        <div className="absolute top-[80px] right-[8%] w-[580px] h-[580px] rounded-full bg-gradient-to-br from-emerald-300/25 via-teal-200/20 to-lime-200/20 blur-[140px]" />
        <div className="absolute top-[340px] left-[30%] w-[420px] h-[420px] rounded-full bg-amber-100/20 blur-[140px]" />
      </div>

      {/* Floating Decorative Elements (Dashed Radar Orbits, Twinkling Stars, Crosses, Dot Matrix) */}
      <div className="absolute inset-0 max-w-7xl mx-auto pointer-events-none -z-10 overflow-hidden">
        {/* Top-Left Dashed Radar Circle with Center Crosshair */}
        <div className="absolute top-20 left-4 sm:left-8 opacity-45">
          <svg className="w-28 h-28 sm:w-36 sm:h-36 text-emerald-800 animate-spin-slow" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="1.2" strokeDasharray="4 6" fill="none" />
            <circle cx="50" cy="50" r="28" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 4" fill="none" opacity="0.6" />
            <line x1="50" y1="42" x2="50" y2="58" stroke="currentColor" strokeWidth="1" opacity="0.5" />
            <line x1="42" y1="50" x2="58" y2="50" stroke="currentColor" strokeWidth="1" opacity="0.5" />
          </svg>
        </div>

        {/* Twinkling Star Sparkle (Top-Center) */}
        <div className="absolute top-28 left-[38%] animate-twinkle text-emerald-600/50">
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
          </svg>
        </div>

        {/* Twinkling Star Sparkle (Mid-Right) */}
        <div className="absolute top-[380px] right-[48%] animate-twinkle text-emerald-500/40" style={{ animationDelay: '1.5s' }}>
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
          </svg>
        </div>

        {/* Top-Right Dot Matrix (4x4) */}
        <div className="absolute top-16 right-6 sm:right-12 grid grid-cols-4 gap-2.5 opacity-30">
          {Array.from({ length: 16 }).map((_, i) => (
            <span key={i} className="h-1.5 w-1.5 rounded-full bg-emerald-800" />
          ))}
        </div>

        {/* Mid-Left Floating Plus Mark */}
        <div className="absolute top-52 left-6 sm:left-12 animate-float-slow text-emerald-800/40 font-mono text-xl select-none">
          +
        </div>

        {/* Mid-Right Floating Plus Mark */}
        <div className="absolute top-[480px] right-8 sm:right-20 animate-float-reverse text-emerald-800/40 font-mono text-2xl select-none">
          +
        </div>

        {/* Mid-Right 3x3 Dot Matrix */}
        <div className="absolute top-[420px] right-4 sm:right-8 grid grid-cols-3 gap-2.5 opacity-25">
          {Array.from({ length: 9 }).map((_, i) => (
            <span key={i} className="h-1.5 w-1.5 rounded-full bg-emerald-800" />
          ))}
        </div>

        {/* Bottom-Left 4x4 Dot Matrix */}
        <div className="absolute top-[680px] left-6 sm:left-16 grid grid-cols-4 gap-2.5 opacity-25">
          {Array.from({ length: 16 }).map((_, i) => (
            <span key={i} className="h-1.5 w-1.5 rounded-full bg-emerald-800" />
          ))}
        </div>

        {/* Bottom-Right Dashed Radar Circle */}
        <div className="absolute top-[600px] right-6 sm:right-16 opacity-35">
          <svg className="w-32 h-32 sm:w-44 sm:h-44 text-emerald-800 animate-spin-slow" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="1.2" strokeDasharray="5 7" fill="none" />
            <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 5" fill="none" opacity="0.5" />
            <circle cx="50" cy="50" r="16" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 3" fill="none" opacity="0.3" />
          </svg>
        </div>
      </div>

      {/* Floating Pill Navbar (Always stuck at top with frosted glass island pill) */}
      <header className="fixed top-2 sm:top-4 left-0 right-0 z-50 px-2 sm:px-4 md:px-6 pointer-events-none">
        <nav className="mx-auto max-w-6xl rounded-full bg-white/90 backdrop-blur-xl border border-white/80 px-2.5 min-[360px]:px-3.5 sm:px-5 md:px-6 py-1.5 sm:py-2.5 flex items-center justify-between shadow-[0_12px_36px_rgba(0,0,0,0.05),inset_0_1px_1.5px_rgba(255,255,255,1),inset_0_-1px_1px_rgba(0,0,0,0.02)] ring-1 ring-black/[0.04] hover:border-emerald-200/90 transition-all duration-300 pointer-events-auto">
          {/* Left Brand Identity */}
          <Link to="/" className="flex items-center gap-1 sm:gap-2 group cursor-pointer shrink-0 min-w-0">
            <Sprout className="h-4.5 w-4.5 sm:h-6 sm:w-6 text-emerald-700 group-hover:text-emerald-800 group-hover:scale-110 transition-transform duration-200 shrink-0" />
            <span className="font-display text-sm min-[360px]:text-base sm:text-lg md:text-xl font-medium tracking-tight text-stone-900 truncate">
              Kisan Mitra
            </span>
          </Link>

          {/* Center Navigation Links (Desktop) */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8 text-xs font-semibold text-stone-600">
            <a href="#platform" className="hover:text-emerald-800 transition-colors">
              Platform
            </a>
            <a href="#features" className="hover:text-emerald-800 transition-colors">
              Features
            </a>
            <a href="#schemes" className="hover:text-emerald-800 transition-colors">
              Govt Schemes
            </a>
            <a href="#mandi" className="hover:text-emerald-800 transition-colors">
              APMC Mandi
            </a>
            <a href="#technology" className="hover:text-emerald-800 transition-colors">
              Architecture
            </a>
            <a href="#faq" className="hover:text-emerald-800 transition-colors">
              FAQ
            </a>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-1 min-[360px]:gap-1.5 sm:gap-2.5 shrink-0">
            <LanguageToggle />

            <SignedOut>
              <Link
                to="/login"
                className="hidden md:inline-flex items-center px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-bold text-stone-700 hover:text-stone-950 bg-white/90 hover:bg-white border border-stone-300/90 hover:border-stone-400 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all active:scale-95"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="relative overflow-hidden inline-flex items-center gap-1 sm:gap-1.5 px-2.5 min-[360px]:px-3.5 sm:px-4.5 md:px-5 py-1 min-[360px]:py-1.5 sm:py-2 rounded-full text-[10.5px] min-[360px]:text-[11px] sm:text-xs font-bold text-white bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-900 hover:from-emerald-700 hover:to-emerald-800 border border-emerald-600/70 shadow-[0_4px_14px_rgba(22,101,52,0.32),inset_0_1px_1px_rgba(255,255,255,0.3)] transition-all active:scale-95 group shrink-0 whitespace-nowrap"
              >
                <span className="absolute inset-0 noise-overlay opacity-25 pointer-events-none rounded-full" />
                <span className="relative z-10">Get Started</span>
                <ArrowRight className="relative z-10 h-3 w-3 text-emerald-200 group-hover:translate-x-0.5 transition-transform hidden min-[400px]:inline-block" />
              </Link>
            </SignedOut>

            <SignedIn>
              <button
                onClick={() => navigate('/dashboard')}
                className="inline-flex items-center gap-1 px-2.5 min-[360px]:px-3.5 sm:px-5 py-1 min-[360px]:py-1.5 sm:py-2 rounded-full text-[10.5px] min-[360px]:text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-700 shadow-soft transition-all shrink-0"
              >
                <span>Workspace</span>
                <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              </button>
              <div className="ml-0.5 sm:ml-1 shrink-0">
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>
          </div>
        </nav>
      </header>

      {/* Hero Section: 2-Column Split Layout matching the reference image */}
      <section className="pt-20 sm:pt-28 pb-14 sm:pb-20 px-3.5 sm:px-6 relative">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">

            {/* Left Column: Typography, Tag, Underline, Three Radiant Sparks, CTAs */}
            <div className="lg:col-span-7 space-y-5 sm:space-y-7">
              {/* Announcement Pill Tag */}
              <div className="inline-flex items-center gap-1.5 sm:gap-2 p-1 pr-3 rounded-full bg-white/90 backdrop-blur-md border border-stone-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,1)] ring-1 ring-black/[0.03] text-xs text-stone-700 group hover:border-emerald-300 transition-all cursor-default max-w-full overflow-hidden">
                <span className="font-mono bg-gradient-to-r from-emerald-800 to-emerald-950 text-white font-bold text-[9.5px] sm:text-[11px] px-2 sm:px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm shrink-0">
                  <Sparkles className="h-3 w-3 text-emerald-300" />
                  Autonomous
                </span>
                <span className="text-stone-600 font-medium text-[11px] sm:text-sm flex items-center gap-1 truncate">
                  <span className="truncate">Watch the AI diagnose crops in real-time</span>
                  {/* <ArrowRight className="h-3.5 w-3.5 text-stone-400 group-hover:text-emerald-700 group-hover:translate-x-1 transition-all shrink-0" /> */}
                </span>
              </div>

              {/* Main Headline with Fraunces Display Serif, Organic Brush Underline and Three Radiant Lines */}
              <h1 className="font-display text-3xl min-[380px]:text-4xl sm:text-6xl md:text-7xl lg:text-[5.25rem] font-normal tracking-tight text-stone-900 leading-[1.08] sm:leading-[1.02] select-none text-balance">
                <span className="block text-stone-950 font-normal">Understand</span>
                <span className="relative inline-block text-emerald-800 my-1 font-semibold italic">
                  any harvest

                  {/* Three Slanted Radiant Sparks - Positioned at upper-right shoulder of the word */}
                  <span className="absolute -top-1 sm:-top-2 md:-top-3 left-[calc(100%+6px)] sm:left-[calc(100%+10px)] md:left-[calc(100%+12px)] pointer-events-none select-none not-italic">
                    <svg
                      className="w-5 h-5 sm:w-7 sm:h-7 md:w-8 md:h-8 text-emerald-500 animate-spark-radiant overflow-visible filter drop-shadow-[0_0_6px_rgba(34,197,94,0.45)]"
                      viewBox="0 0 32 28"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {/* 3 radiant sparks fanning outward from lower-left to upper-right */}
                      <line x1="5" y1="22" x2="10" y2="8" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" className="text-emerald-600" />
                      <line x1="13" y1="21" x2="21" y2="9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-emerald-500" />
                      <line x1="20" y1="22" x2="29" y2="16" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" className="text-emerald-400" />
                    </svg>
                  </span>

                  {/* Organic Curved Hand-Drawn Brush Underline (matching reference) */}
                  <svg
                    className="absolute -bottom-2 sm:-bottom-3.5 left-0 w-full h-3.5 sm:h-6 text-emerald-500 overflow-visible pointer-events-none filter drop-shadow-[0_1.5px_2px_rgba(22,101,52,0.18)] not-italic"
                    viewBox="0 0 320 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M 4 16 Q 80 22 160 17 Q 240 12 316 15 Q 245 20 160 21 Q 75 22 6 17"
                      fill="currentColor"
                      opacity="0.95"
                    />
                    <path
                      d="M 10 18 C 90 22 195 18 310 16"
                      stroke="currentColor"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      className="animate-draw-underline"
                    />
                  </svg>
                </span>
                <span className="block text-stone-950 font-normal">in seconds.</span>
              </h1>

              {/* Refined Agronomy Subtitle */}
              <p className="max-w-xl text-stone-600 text-xs min-[400px]:text-sm sm:text-base md:text-lg leading-relaxed font-normal text-pretty">
                A refined, intelligent agronomy layer over Indian agriculture. Diagnose plant pathologies, calibrate edaphic soil chemistry, and discover live APMC mandi prices seamlessly in real time.
              </p>

              {/* Action Buttons (Pill shaped with Button-in-Button trailing arrow) */}
              <div className="pt-2 flex flex-col min-[440px]:flex-row items-stretch min-[440px]:items-center gap-3 sm:gap-3.5">
                <SignedOut>
                  <Link
                    to="/signup"
                    className="relative overflow-hidden w-full min-[440px]:w-auto px-6 sm:px-7 py-3.5 rounded-full font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-[#0d3b24] via-[#14532d] to-[#0a2e1c] hover:from-[#14532d] hover:via-[#15803d] hover:to-[#14532d] border border-emerald-500/40 hover:border-emerald-400/80 shadow-[0_10px_25px_-4px_rgba(20,83,45,0.45),inset_0_1px_1.5px_rgba(255,255,255,0.35)] hover:shadow-[0_14px_34px_-4px_rgba(22,101,52,0.6),inset_0_1px_2px_rgba(255,255,255,0.5)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 group"
                  >
                    <span className="absolute inset-0 noise-overlay opacity-30 pointer-events-none rounded-full" />
                    <span className="relative z-10 tracking-tight">Deploy Advisor</span>
                    <span className="relative z-10 w-6 h-6 rounded-full bg-white/15 border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:translate-x-1 transition-all duration-300 shadow-xs">
                      <ArrowRight className="h-3.5 w-3.5 text-emerald-100 group-hover:text-emerald-950 transition-colors duration-300" />
                    </span>
                  </Link>
                  <a
                    href="#technology"
                    className="w-full min-[440px]:w-auto px-6 py-3.5 rounded-full font-bold text-xs sm:text-sm text-stone-700 bg-white/95 hover:bg-white border border-stone-200/90 hover:border-emerald-300/80 shadow-[0_2px_8px_rgba(0,0,0,0.03),inset_0_1px_1px_rgba(255,255,255,1)] hover:shadow-card hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <span>View Architecture</span>
                  </a>
                </SignedOut>

                <SignedIn>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="relative overflow-hidden w-full min-[440px]:w-auto px-6 sm:px-7 py-3.5 rounded-full font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-[#0d3b24] via-[#14532d] to-[#0a2e1c] hover:from-[#14532d] hover:via-[#15803d] hover:to-[#14532d] border border-emerald-500/40 hover:border-emerald-400/80 shadow-[0_10px_25px_-4px_rgba(20,83,45,0.45),inset_0_1px_1.5px_rgba(255,255,255,0.35)] hover:shadow-[0_14px_34px_-4px_rgba(22,101,52,0.6),inset_0_1px_2px_rgba(255,255,255,0.5)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 group"
                  >
                    <span className="absolute inset-0 noise-overlay opacity-30 pointer-events-none rounded-full" />
                    <span className="relative z-10 tracking-tight">Enter Farmer Workspace</span>
                    <span className="relative z-10 w-6 h-6 rounded-full bg-white/15 border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:translate-x-1 transition-all duration-300 shadow-xs">
                      <ArrowRight className="h-3.5 w-3.5 text-emerald-100 group-hover:text-emerald-950 transition-colors duration-300" />
                    </span>
                  </button>
                  <a
                    href="#platform"
                    className="w-full min-[440px]:w-auto px-6 py-3.5 rounded-full font-bold text-xs sm:text-sm text-stone-700 bg-white/95 hover:bg-white border border-stone-200/90 hover:border-emerald-300/80 shadow-[0_2px_8px_rgba(0,0,0,0.03),inset_0_1px_1px_rgba(255,255,255,1)] hover:shadow-card hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-300 text-center"
                  >
                    Explore Features
                  </a>
                </SignedIn>
              </div>

              {/* Trust Metric Micro-Badges */}
              <div className="pt-3 flex flex-wrap items-center gap-3 sm:gap-5 text-[11px] sm:text-xs font-semibold text-stone-500">
                <span className="flex items-center gap-1.5">
                  <span className="h-4 w-4 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </span>
                  <span>Higher Prediction Accuracy</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-4 w-4 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </span>
                  <span>50+ Indian Crops</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-4 w-4 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </span>
                  <span>100% Free for Farmers</span>
                </span>
              </div>
            </div>

            {/* Right Column: 4-Step Interactive Workflow Pipeline Stepper */}
            <div
              className="lg:col-span-5 relative"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {/* Dedicated Luminous Ambient Glow Halo behind the Stepper Stack */}
              <div className="absolute -inset-4 sm:-inset-6 bg-gradient-to-br from-emerald-400/20 via-teal-300/15 to-lime-200/20 rounded-[2.5rem] blur-3xl pointer-events-none -z-10" />

              {/* Stepper Card Stack with strictly bounded connecting line */}
              <div className="relative space-y-3 sm:space-y-3.5">
                {/* Vertical Connecting Line strictly bounded behind cards between Card 01 and Card 04 */}
                <div className="absolute left-[33px] sm:left-[43px] top-[40px] sm:top-[44px] bottom-[40px] sm:bottom-[44px] w-[2px] bg-stone-200/90 z-0 overflow-hidden rounded-full pointer-events-none">
                  {/* Progress Fill */}
                  <div
                    className="w-full bg-emerald-600 transition-all duration-500 rounded-full"
                    style={{ height: `${((activeStep + 1) / PIPELINE_STEPS.length) * 100}%` }}
                  />
                  {/* Glowing light pulse particle strictly clipped within the line */}
                  <div className="absolute w-2 h-6 -left-[3px] rounded-full bg-gradient-to-b from-emerald-300 via-emerald-400 to-emerald-600 shadow-[0_0_8px_rgba(34,197,94,0.9)] animate-line-pulse pointer-events-none" />
                </div>

                {PIPELINE_STEPS.map((item, idx) => {
                  const isActive = activeStep === idx;
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.step}
                      onClick={() => setActiveStep(idx)}
                      className={`relative z-10 group p-3.5 sm:p-4.5 rounded-[1.5rem] sm:rounded-[1.75rem] border transition-all duration-300 cursor-pointer flex flex-col gap-2 sm:gap-2.5 overflow-hidden ${isActive
                          ? 'bg-gradient-to-br from-[#EDF9F1] via-[#F7FCF9] to-[#E3F4EA] border-emerald-500/70 active-bezel-card ring-2 ring-emerald-500/25 -translate-x-0.5 sm:-translate-x-1 scale-[1.01]'
                          : 'bg-gradient-to-b from-white/95 via-[#FCFBF8]/95 to-[#FAF8F3]/90 backdrop-blur-md border-stone-200/80 double-bezel-card ring-1 ring-black/[0.03] hover:-translate-x-0.5 hover:border-emerald-300/80 hover:shadow-[0_14px_32px_rgba(22,101,52,0.07),inset_0_1px_1.5px_rgba(255,255,255,1)]'
                        }`}
                    >
                      {/* Micro Texture Pattern Overlay for Active Card */}
                      {isActive && (
                        <>
                          <div className="absolute inset-0 topo-pattern opacity-70 pointer-events-none rounded-[1.5rem] sm:rounded-[1.75rem]" />
                          <div className="absolute inset-0 noise-overlay opacity-30 pointer-events-none rounded-[1.5rem] sm:rounded-[1.75rem]" />
                        </>
                      )}

                      <div className="relative z-10 flex items-center justify-between gap-2.5 sm:gap-3">
                        {/* Left Icon Badge & Text Content */}
                        <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
                          {/* Standalone Step Icon */}
                          <div className="relative z-20 shrink-0 flex items-center justify-center w-7 h-7 sm:w-10 sm:h-10">
                            <Icon
                              className={`transition-all duration-300 ${isActive
                                  ? 'h-5 w-5 sm:h-7 sm:w-7 text-emerald-800 scale-105'
                                  : 'h-4.5 w-4.5 sm:h-6 sm:w-6 text-stone-400 group-hover:text-emerald-700'
                                }`}
                            />
                          </div>

                          {/* Step Counter & Text */}
                          <div className="min-w-0 space-y-0.5">
                            <div className="flex items-center gap-1.5 sm:gap-2">
                              <span
                                className={`text-[9.5px] sm:text-[11px] font-mono font-bold tracking-wider px-1.5 sm:px-2 py-0.5 rounded-md ${isActive
                                    ? 'bg-emerald-100/90 text-emerald-950 border border-emerald-200/80 shadow-xs'
                                    : 'bg-[#F2EFEA] text-stone-600 border border-stone-200/60'
                                  }`}
                              >
                                {item.step}
                              </span>
                              <span className={isActive ? 'text-emerald-400 font-bold' : 'text-stone-300'}>•</span>
                              <h3 className={`text-xs sm:text-sm font-display font-medium truncate tracking-tight ${isActive ? 'text-stone-950' : 'text-stone-900'}`}>
                                {item.title}
                              </h3>
                            </div>
                            <p className={`text-[10.5px] sm:text-xs truncate font-medium ${isActive ? 'text-emerald-900/80' : 'text-stone-500'}`}>
                              {item.description}
                            </p>
                          </div>
                        </div>

                        {/* Right Status Indicator Dot */}
                        <div className="shrink-0 pl-1">
                          {isActive ? (
                            <span className="relative flex h-3 w-3 sm:h-3.5 sm:w-3.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 sm:h-3.5 sm:w-3.5 bg-emerald-600 ring-2 ring-white shadow-xs"></span>
                            </span>
                          ) : (
                            <span className="block h-2 w-2 rounded-full bg-stone-300 group-hover:bg-emerald-400 transition-colors shadow-xs" />
                          )}
                        </div>
                      </div>

                      {/* Expanded Interactive Telemetry Row for Active Step */}
                      {isActive && (
                        <div className="relative z-10 pt-2 sm:pt-2.5 flex items-center justify-between gap-1.5 sm:gap-2 border-t border-emerald-200/60 mt-1">
                          <span className="font-mono inline-flex items-center gap-1 sm:gap-1.5 text-[9px] min-[380px]:text-[10px] sm:text-[11px] font-semibold text-emerald-950 bg-white/90 backdrop-blur-xs border border-emerald-300/80 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-[inset_0_1px_1px_rgba(255,255,255,1),0_1px_3px_rgba(0,0,0,0.04)] whitespace-nowrap min-w-0 max-w-[58%] min-[380px]:max-w-none">
                            <Sparkles className="h-3 w-3 text-emerald-600 shrink-0" />
                            <span className="truncate">{item.metric}</span>
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(item.route);
                            }}
                            className="inline-flex items-center gap-1 sm:gap-1.5 text-[9.5px] min-[380px]:text-[10px] sm:text-[11px] font-bold text-white bg-gradient-to-r from-emerald-800 to-emerald-900 hover:from-emerald-700 hover:to-emerald-800 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full shadow-[0_4px_14px_rgba(22,101,52,0.3),inset_0_1px_1px_rgba(255,255,255,0.25)] transition-all active:scale-95 group/btn whitespace-nowrap shrink-0"
                          >
                            <span>Open Tool</span>
                            <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-white/20 flex items-center justify-center group-hover/btn:translate-x-0.5 transition-transform shrink-0">
                              <ArrowRight className="h-2 w-2 sm:h-2.5 sm:w-2.5 text-white" />
                            </span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Stepper Helper Footer */}
              <div className="mt-3.5 flex flex-wrap items-center justify-between gap-1.5 px-2 text-[11px] font-medium text-stone-500">
                <span className="font-mono flex items-center gap-1.5 text-[9px] sm:text-[10px] uppercase tracking-wider truncate">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_6px_rgba(34,197,94,0.8)] shrink-0"></span>
                  <span className="truncate">Autonomous Agronomic Pipeline</span>
                </span>
                <span className="text-emerald-900 font-mono font-bold bg-emerald-50/90 border border-emerald-200/80 px-2 sm:px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] shadow-xs shrink-0">
                  Stage {activeStep + 1} of 4
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Interactive Workspace Preview Showcase Card */}
        <div id="platform" className="scroll-mt-28 mt-12 sm:mt-24 mx-auto max-w-6xl">
          <div className="relative rounded-2xl sm:rounded-[1.5rem] bg-white p-3.5 sm:p-7 lg:p-9 border border-stone-200/90 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.07)] overflow-hidden">
            {/* Top Workspace Header Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 sm:pb-6 border-b border-stone-100 gap-2.5 sm:gap-3">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className="flex items-center gap-1.5 shrink-0">
                  <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-rose-400/90" />
                  <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-amber-400/90" />
                  <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-emerald-400/90" />
                </div>
                <span className="text-[11px] sm:text-xs font-mono font-bold text-stone-400 ml-1 sm:ml-2 truncate">
                  kisan-mitra.workspace / live-preview
                </span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-[11px] font-mono font-bold text-stone-500 bg-stone-100 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full shrink-0">
                  <MapPin className="h-3 w-3 text-emerald-700" /> Nadia, WB
                </span>
                <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-emerald-50 text-emerald-800 text-[10px] sm:text-xs font-bold border border-emerald-200/60 min-w-0 max-w-full">
                  <Activity className="h-3.5 w-3.5 text-emerald-600 animate-pulse shrink-0" />
                  <span className="truncate">Real-time Agro-Sensor Telemetry Active</span>
                </span>
              </div>
            </div>

            {/* Micro Dashboard Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 pt-4 sm:pt-6">
              {/* Card 1: Crop Recommendation Match */}
              <div
                onClick={() => navigate('/recommendations')}
                className="group p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-[#FAF9F5] border border-stone-200/70 hover:border-emerald-300 hover:shadow-card transition-all cursor-pointer flex flex-col justify-between space-y-3 sm:space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider text-stone-500">
                      Dual-Stage AI Output
                    </span>
                    <span className="text-[11px] sm:text-xs font-mono font-bold text-emerald-800 bg-emerald-100/90 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                      96.8% Match
                    </span>
                  </div>
                  <div className="mt-2.5 sm:mt-3">
                    <h4 className="font-display text-lg sm:text-xl font-medium text-stone-900 group-hover:text-emerald-800 transition-colors">
                      Rice (Oryza sativa)
                    </h4>
                    <p className="text-xs text-stone-500 mt-1">Recommended for Alluvial Loam • Monsoon Cycle</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-stone-600">
                      <span>Soil Nitrogen (N: 90 kg/ha)</span>
                      <span className="font-mono text-emerald-800 font-bold">Optimal</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-stone-200 overflow-hidden">
                      <div className="h-full bg-emerald-600 rounded-full w-[94%]" />
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs text-stone-600 border-t border-stone-200/60">
                    <span className="font-medium">Harvest Window:</span>
                    <span className="font-mono font-bold text-stone-900">110-120 Days</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-emerald-800 group-hover:translate-x-0.5 transition-transform">
                    <span>Launch Recommender</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </div>

              {/* Card 2: Plant Disease Diagnostic */}
              <div
                onClick={() => navigate('/disease')}
                className="group p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-[#FAF9F5] border border-stone-200/70 hover:border-emerald-300 hover:shadow-card transition-all cursor-pointer flex flex-col justify-between space-y-3 sm:space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider text-stone-500">
                      PyTorch Computer Vision
                    </span>
                    <span className="text-[11px] sm:text-xs font-mono font-bold text-amber-800 bg-amber-100/90 px-2.5 py-0.5 rounded-full border border-amber-200/60">
                      Detected
                    </span>
                  </div>
                  <div className="mt-2.5 sm:mt-3">
                    <h4 className="font-display text-lg sm:text-xl font-medium text-stone-900 group-hover:text-emerald-800 transition-colors">
                      Rice Leaf Blast
                    </h4>
                    <p className="text-xs text-stone-500 mt-1">Magnaporthe oryzae • Moderate Severity</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white border border-stone-200/80 text-xs text-stone-700 space-y-1">
                    <div className="font-bold text-emerald-800 flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      Recommended Remedy:
                    </div>
                    <p className="text-[11px] leading-relaxed text-stone-600">
                      Foliar spray of Tricyclazole 75% WP @ 0.6g/L + Neem oil 2ml/L.
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs text-stone-600 border-t border-stone-200/60">
                    <span className="font-medium">Scan Time:</span>
                    <span className="font-mono font-bold text-emerald-800">120ms (YOLO11m)</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-emerald-800 group-hover:translate-x-0.5 transition-transform">
                    <span>Launch Leaf Scanner</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </div>

              {/* Card 3: Mandi Rates & Govt Welfare */}
              <div
                onClick={() => navigate('/market')}
                className="group p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-[#FAF9F5] border border-stone-200/70 hover:border-emerald-300 hover:shadow-card transition-all cursor-pointer flex flex-col justify-between space-y-3 sm:space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider text-stone-500">
                      APMC & Welfare Aid
                    </span>
                    <span className="text-[11px] sm:text-xs font-mono font-bold text-blue-800 bg-blue-100/90 px-2.5 py-0.5 rounded-full border border-blue-200/60">
                      Live Rates
                    </span>
                  </div>
                  <div className="mt-2.5 sm:mt-3">
                    <div className="flex items-baseline justify-between gap-2">
                      <h4 className="font-display text-xl sm:text-2xl font-medium text-stone-900 group-hover:text-emerald-800 transition-colors">
                        ₹3,850 / Qtl
                      </h4>
                      <span className="text-xs font-mono font-bold text-emerald-600 flex items-center shrink-0">
                        <TrendingUp className="h-3 w-3 mr-0.5" /> +4.2%
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 mt-1">Ranaghat Mandi (AGMARKNET data.gov.in)</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white border border-stone-200/80 space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-stone-800">
                      <span className="font-display font-medium">PM-KISAN DBT Scheme</span>
                      <span className="font-mono text-emerald-800 font-bold">Active</span>
                    </div>
                    <p className="text-[11px] text-stone-500">₹6,000 / yr income support via API Mitra</p>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs text-stone-600 border-t border-stone-200/60">
                    <span className="font-medium">Direct Portal:</span>
                    <span className="font-bold text-emerald-800 underline">Official Gateway</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-emerald-800 group-hover:translate-x-0.5 transition-transform">
                    <span>Explore Mandi & Grants</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Platform Pillars (Bento Grid) */}
      <section id="features" className="scroll-mt-28 py-12 sm:py-20 px-4 sm:px-6 bg-white border-y border-stone-200/80">
        <div className="mx-auto max-w-6xl space-y-8 sm:space-y-12">
          <div className="text-center space-y-2.5 sm:space-y-3 max-w-2xl mx-auto">
            <h2 className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider sm:tracking-widest text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-3 py-0.5 sm:px-3.5 sm:py-1 rounded-full inline-block">
              Comprehensive Agronomic Workspace
            </h2>
            <h3 className="font-display text-2xl min-[400px]:text-3xl sm:text-4xl md:text-5xl font-normal text-stone-900 tracking-tight leading-tight text-balance">
              Six Specialized Engines Built for Bharat's Farmers
            </h3>
            <p className="text-stone-600 text-xs sm:text-base leading-relaxed">
              Everything required to plan, diagnose, harvest, and sell—powered by AI models tailored to Indian geography.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6">
            {/* Feature 1 */}
            <div
              onClick={() => navigate('/recommendations')}
              className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#FAF9F5] border border-stone-200/90 shadow-soft hover:shadow-card hover:border-emerald-300 transition-all flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-3.5 sm:mb-4 gap-2">
                  <div className="h-9 w-9 sm:h-11 sm:w-11 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform shrink-0">
                    <Sparkles className="h-4.5 w-4.5 sm:h-5.5 sm:w-5.5" />
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-850 bg-white/90 px-2.5 py-0.5 rounded-full border border-emerald-200/80 shadow-xs shrink-0">
                    Dual-Stage ML
                  </span>
                </div>
                <h4 className="font-display text-lg sm:text-xl font-medium text-stone-900 mb-1.5 group-hover:text-emerald-800 transition-colors leading-snug">
                  Dual-Stage Crop Recommendation
                </h4>
                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4">
                  Analyzes soil chemistry (N-P-K, pH) alongside localized rainfall and temperatures to rank the top 5 highest-yielding crops.
                </p>
              </div>
              <div className="pt-3 sm:pt-3.5 border-t border-stone-200/70 flex items-center justify-between text-xs font-bold gap-2">
                <span className="font-mono text-[10px] sm:text-[11px] text-stone-600 bg-white/90 border border-stone-200/80 px-2 sm:px-2.5 py-0.5 rounded-md shadow-xs truncate">
                  50+ Crops Supported
                </span>
                <span className="flex items-center gap-1 text-[11px] sm:text-xs text-emerald-800 group-hover:translate-x-0.5 transition-transform shrink-0 font-bold">
                  <span>Launch</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>

            {/* Feature 2 */}
            <div
              onClick={() => navigate('/disease')}
              className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#FAF9F5] border border-stone-200/90 shadow-soft hover:shadow-card hover:border-amber-300 transition-all flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-3.5 sm:mb-4 gap-2">
                  <div className="h-9 w-9 sm:h-11 sm:w-11 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform shrink-0">
                    <ScanEye className="h-4.5 w-4.5 sm:h-5.5 sm:w-5.5" />
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider text-amber-900 bg-white/90 px-2.5 py-0.5 rounded-full border border-amber-200/80 shadow-xs shrink-0">
                    YOLO11m • 120ms
                  </span>
                </div>
                <h4 className="font-display text-lg sm:text-xl font-medium text-stone-900 mb-1.5 group-hover:text-amber-900 transition-colors leading-snug">
                  Leaf Pathology Vision Scanner
                </h4>
                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4">
                  Instant PyTorch classifier identifies 75+ crop afflictions from leaf photos with organic and chemical treatment advice.
                </p>
              </div>
              <div className="pt-3 sm:pt-3.5 border-t border-stone-200/70 flex items-center justify-between text-xs font-bold gap-2">
                <span className="font-mono text-[10px] sm:text-[11px] text-stone-600 bg-white/90 border border-stone-200/80 px-2 sm:px-2.5 py-0.5 rounded-md shadow-xs truncate">
                  75+ Afflictions
                </span>
                <span className="flex items-center gap-1 text-[11px] sm:text-xs text-amber-900 group-hover:translate-x-0.5 transition-transform shrink-0 font-bold">
                  <span>Launch</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>

            {/* Feature 3 */}
            <div
              onClick={() => navigate('/calibrate')}
              className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#FAF9F5] border border-stone-200/90 shadow-soft hover:shadow-card hover:border-teal-300 transition-all flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-3.5 sm:mb-4 gap-2">
                  <div className="h-9 w-9 sm:h-11 sm:w-11 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform shrink-0">
                    <Layers className="h-4.5 w-4.5 sm:h-5.5 sm:w-5.5" />
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider text-teal-900 bg-white/90 px-2.5 py-0.5 rounded-full border border-teal-200/80 shadow-xs shrink-0">
                    Edaphic NPK
                  </span>
                </div>
                <h4 className="font-display text-lg sm:text-xl font-medium text-stone-900 mb-1.5 group-hover:text-teal-900 transition-colors leading-snug">
                  Edaphic Soil Chemistry Calibrator
                </h4>
                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4">
                  Condition field soil with macro & micronutrient corrections tailored to your field's soil texture and crop targets.
                </p>
              </div>
              <div className="pt-3 sm:pt-3.5 border-t border-stone-200/70 flex items-center justify-between text-xs font-bold gap-2">
                <span className="font-mono text-[10px] sm:text-[11px] text-stone-600 bg-white/90 border border-stone-200/80 px-2 sm:px-2.5 py-0.5 rounded-md shadow-xs truncate">
                  Soil Conditioning
                </span>
                <span className="flex items-center gap-1 text-[11px] sm:text-xs text-teal-900 group-hover:translate-x-0.5 transition-transform shrink-0 font-bold">
                  <span>Launch</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>

            {/* Feature 4 */}
            <div
              onClick={() => navigate('/market')}
              className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#FAF9F5] border border-stone-200/90 shadow-soft hover:shadow-card hover:border-blue-300 transition-all flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-3.5 sm:mb-4 gap-2">
                  <div className="h-9 w-9 sm:h-11 sm:w-11 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform shrink-0">
                    <LineChart className="h-4.5 w-4.5 sm:h-5.5 sm:w-5.5" />
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider text-blue-900 bg-white/90 px-2.5 py-0.5 rounded-full border border-blue-200/80 shadow-xs shrink-0">
                    AGMARKNET
                  </span>
                </div>
                <h4 className="font-display text-lg sm:text-xl font-medium text-stone-900 mb-1.5 group-hover:text-blue-900 transition-colors leading-snug">
                  Live APMC Mandi Rates
                </h4>
                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4">
                  Direct integration with official <span className="font-semibold text-stone-800">data.gov.in</span> wholesale rates across 3,000+ Indian mandis.
                </p>
              </div>
              <div className="pt-3 sm:pt-3.5 border-t border-stone-200/70 flex items-center justify-between text-xs font-bold gap-2">
                <span className="font-mono text-[10px] sm:text-[11px] text-stone-600 bg-white/90 border border-stone-200/80 px-2 sm:px-2.5 py-0.5 rounded-md shadow-xs truncate">
                  3,000+ Mandis
                </span>
                <span className="flex items-center gap-1 text-[11px] sm:text-xs text-blue-900 group-hover:translate-x-0.5 transition-transform shrink-0 font-bold">
                  <span>Launch</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>

            {/* Feature 5 */}
            <div
              onClick={() => navigate('/schemes')}
              className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#FAF9F5] border border-stone-200/90 shadow-soft hover:shadow-card hover:border-purple-300 transition-all flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-3.5 sm:mb-4 gap-2">
                  <div className="h-9 w-9 sm:h-11 sm:w-11 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform shrink-0">
                    <Landmark className="h-4.5 w-4.5 sm:h-5.5 sm:w-5.5" />
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider text-purple-900 bg-white/90 px-2.5 py-0.5 rounded-full border border-purple-200/80 shadow-xs shrink-0">
                    API Mitra
                  </span>
                </div>
                <h4 className="font-display text-lg sm:text-xl font-medium text-stone-900 mb-1.5 group-hover:text-purple-900 transition-colors leading-snug">
                  Govt Subsidies & Welfare Aid
                </h4>
                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4">
                  Powered by API Mitra & myScheme. Explore PM-KISAN, PMFBY, KCC, and state grants with direct official application links.
                </p>
              </div>
              <div className="pt-3 sm:pt-3.5 border-t border-stone-200/70 flex items-center justify-between text-xs font-bold gap-2">
                <span className="font-mono text-[10px] sm:text-[11px] text-stone-600 bg-white/90 border border-stone-200/80 px-2 sm:px-2.5 py-0.5 rounded-md shadow-xs truncate">
                  4,700+ Schemes
                </span>
                <span className="flex items-center gap-1 text-[11px] sm:text-xs text-purple-900 group-hover:translate-x-0.5 transition-transform shrink-0 font-bold">
                  <span>Launch</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>

            {/* Feature 6 */}
            <div
              onClick={() => navigate('/chatbot')}
              className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#FAF9F5] border border-stone-200/90 shadow-soft hover:shadow-card hover:border-emerald-300 transition-all flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-3.5 sm:mb-4 gap-2">
                  <div className="h-9 w-9 sm:h-11 sm:w-11 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform shrink-0">
                    <MessageSquareCode className="h-4.5 w-4.5 sm:h-5.5 sm:w-5.5" />
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-850 bg-white/90 px-2.5 py-0.5 rounded-full border border-emerald-200/80 shadow-xs shrink-0">
                    Gemini AI
                  </span>
                </div>
                <h4 className="font-display text-lg sm:text-xl font-medium text-stone-900 mb-1.5 group-hover:text-emerald-800 transition-colors leading-snug">
                  Multilingual AI Agronomist
                </h4>
                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4">
                  Ask questions in English, Hindi, or Bengali. Powered by Google Gemini for fertilizer dosages, soil conditioning, and pest remediation.
                </p>
              </div>
              <div className="pt-3 sm:pt-3.5 border-t border-stone-200/70 flex items-center justify-between text-xs font-bold gap-2">
                <span className="font-mono text-[10px] sm:text-[11px] text-stone-600 bg-white/90 border border-stone-200/80 px-2 sm:px-2.5 py-0.5 rounded-md shadow-xs truncate">
                  24/7 Advisory
                </span>
                <span className="flex items-center gap-1 text-[11px] sm:text-xs text-emerald-800 group-hover:translate-x-0.5 transition-transform shrink-0 font-bold">
                  <span>Launch</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dedicated Government Subsidies & Welfare Schemes Section */}
      <section id="schemes" className="scroll-mt-28 py-12 sm:py-20 px-4 sm:px-6 bg-[#FAF9F5] border-b border-stone-200/80">
        <div className="mx-auto max-w-6xl space-y-8 sm:space-y-12">
          <div className="text-center space-y-2.5 sm:space-y-3 max-w-2xl mx-auto">
            <h2 className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider sm:tracking-widest text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-3 py-0.5 sm:px-3.5 sm:py-1 rounded-full inline-block">
              Verified Welfare & Subsidy Portal
            </h2>
            <h3 className="font-display text-2xl min-[400px]:text-3xl sm:text-4xl md:text-5xl font-normal text-stone-900 tracking-tight leading-tight text-balance">
              Direct Government Welfare Without Middlemen
            </h3>
            <p className="text-stone-600 text-xs sm:text-base leading-relaxed">
              Powered by official API Mitra & myScheme. Direct DBT transfers, crop insurance coverage, and subsidized agricultural credit.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-6">
            {/* Scheme Card 1 */}
            <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#FAF9F5] border border-stone-200/90 shadow-soft hover:shadow-card hover:border-emerald-300 transition-all flex flex-col justify-between group">
              <div className="space-y-3 sm:space-y-3.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="h-8 w-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 shadow-xs">
                      <Landmark className="h-4 w-4" />
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/50 truncate">
                      Direct DBT
                    </span>
                  </div>
                  <span className="font-mono text-[11px] sm:text-xs font-bold text-emerald-950 bg-white/90 border border-emerald-200/80 px-2.5 py-0.5 rounded-full shrink-0 shadow-xs">
                    ₹6,000 / yr
                  </span>
                </div>

                <div>
                  <h4 className="font-display text-lg sm:text-xl font-medium text-stone-900 group-hover:text-emerald-800 transition-colors">
                    PM-KISAN Samman Nidhi
                  </h4>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mt-1">
                    Direct income support of ₹6,000 annually deposited in three equal installments of ₹2,000 into verified bank accounts.
                  </p>
                </div>

                <div className="space-y-1.5 pt-0.5">
                  <div className="flex items-center gap-2 text-[11px] sm:text-xs text-stone-600">
                    <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>100% Central Government Funded</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] sm:text-xs text-stone-600">
                    <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Direct Beneficiary Transfer (DBT)</span>
                  </div>
                </div>
              </div>

              <div className="pt-3.5 sm:pt-5 border-t border-stone-200/60 mt-3.5 sm:mt-5">
                <button
                  onClick={() => navigate('/schemes')}
                  className="w-full py-2.5 px-3.5 rounded-xl font-bold text-xs text-emerald-900 bg-white hover:bg-emerald-50 border border-emerald-300/80 shadow-xs transition-all flex items-center justify-center gap-1.5 group-hover:border-emerald-400"
                >
                  <span>Check Eligibility & Apply</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>

            {/* Scheme Card 2 */}
            <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#FAF9F5] border border-stone-200/90 shadow-soft hover:shadow-card hover:border-blue-300 transition-all flex flex-col justify-between group">
              <div className="space-y-3 sm:space-y-3.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="h-8 w-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0 shadow-xs">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider text-blue-800 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200/50 truncate">
                      Crop Insurance
                    </span>
                  </div>
                  <span className="font-mono text-[11px] sm:text-xs font-bold text-blue-950 bg-white/90 border border-blue-200/80 px-2.5 py-0.5 rounded-full shrink-0 shadow-xs">
                    1.5% – 2% Rate
                  </span>
                </div>

                <div>
                  <h4 className="font-display text-lg sm:text-xl font-medium text-stone-900 group-hover:text-blue-900 transition-colors">
                    PM Fasal Bima (PMFBY)
                  </h4>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mt-1">
                    Comprehensive non-preventable risk insurance covering drought, flood, hailstorms, pests, and post-harvest crop loss.
                  </p>
                </div>

                <div className="space-y-1.5 pt-0.5">
                  <div className="flex items-center gap-2 text-[11px] sm:text-xs text-stone-600">
                    <Check className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                    <span>Affordable subsidized farmer premium</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] sm:text-xs text-stone-600">
                    <Check className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                    <span>Fast localized claim settlements</span>
                  </div>
                </div>
              </div>

              <div className="pt-3.5 sm:pt-5 border-t border-stone-200/60 mt-3.5 sm:mt-5">
                <button
                  onClick={() => navigate('/schemes')}
                  className="w-full py-2.5 px-3.5 rounded-xl font-bold text-xs text-blue-900 bg-white hover:bg-blue-50 border border-blue-300/80 shadow-xs transition-all flex items-center justify-center gap-1.5 group-hover:border-blue-400"
                >
                  <span>Explore Insurance Coverage</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>

            {/* Scheme Card 3 */}
            <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#FAF9F5] border border-stone-200/90 shadow-soft hover:shadow-card hover:border-purple-300 transition-all flex flex-col justify-between group">
              <div className="space-y-3 sm:space-y-3.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="h-8 w-8 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center shrink-0 shadow-xs">
                      <CreditCard className="h-4 w-4" />
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider text-purple-800 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200/50 truncate">
                      Credit Facility
                    </span>
                  </div>
                  <span className="font-mono text-[11px] sm:text-xs font-bold text-purple-950 bg-white/90 border border-purple-200/80 px-2.5 py-0.5 rounded-full shrink-0 shadow-xs">
                    4% Interest
                  </span>
                </div>

                <div>
                  <h4 className="font-display text-lg sm:text-xl font-medium text-stone-900 group-hover:text-purple-900 transition-colors">
                    Kisan Credit Card (KCC)
                  </h4>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mt-1">
                    Low-interest institutional working capital up to ₹3,00,000 for purchasing certified seeds, organic fertilizers, and farm equipment.
                  </p>
                </div>

                <div className="space-y-1.5 pt-0.5">
                  <div className="flex items-center gap-2 text-[11px] sm:text-xs text-stone-600">
                    <Check className="h-3.5 w-3.5 text-purple-600 shrink-0" />
                    <span>3% Prompt Repayment Incentive</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] sm:text-xs text-stone-600">
                    <Check className="h-3.5 w-3.5 text-purple-600 shrink-0" />
                    <span>Zero collateral requirement up to ₹1.6L</span>
                  </div>
                </div>
              </div>

              <div className="pt-3.5 sm:pt-5 border-t border-stone-200/60 mt-3.5 sm:mt-5">
                <button
                  onClick={() => navigate('/schemes')}
                  className="w-full py-2.5 px-3.5 rounded-xl font-bold text-xs text-purple-900 bg-white hover:bg-purple-50 border border-purple-300/80 shadow-xs transition-all flex items-center justify-center gap-1.5 group-hover:border-purple-400"
                >
                  <span>Apply for Kisan Card</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* Scheme Banner Bar */}
          <div className="rounded-2xl bg-white p-4 sm:p-5 border border-stone-200/90 shadow-soft flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5 sm:gap-4">
            <div className="flex items-start sm:items-center gap-3">
              <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="space-y-0.5">
                <h5 className="font-display text-sm sm:text-base font-medium text-stone-900">
                  Over 4,700 Verified Schemes Integrated via API Mitra
                </h5>
                <p className="text-[11px] sm:text-xs text-stone-500">
                  Find solar pumps (PM-KUSUM), drip irrigation subsidies, and state-specific welfare grants.
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/schemes')}
              className="w-full sm:w-auto px-4 sm:px-5 py-2.5 rounded-full font-bold text-xs text-white bg-emerald-800 hover:bg-emerald-700 shadow-soft transition-all shrink-0 flex items-center justify-center gap-1.5"
            >
              <span>Search All 4,700+ Schemes</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Dedicated Real-Time APMC Mandi Discovery Section */}
      <section id="mandi" className="scroll-mt-28 py-12 sm:py-20 px-4 sm:px-6 bg-white border-b border-stone-200/80">
        <div className="mx-auto max-w-6xl space-y-8 sm:space-y-12">
          <div className="text-center space-y-2.5 sm:space-y-3 max-w-2xl mx-auto">
            <h2 className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider sm:tracking-widest text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-3 py-0.5 sm:px-3.5 sm:py-1 rounded-full inline-block">
              Real-Time Wholesale Market Discovery
            </h2>
            <h3 className="font-display text-2xl min-[400px]:text-3xl sm:text-4xl md:text-5xl font-normal text-stone-900 tracking-tight leading-tight text-balance">
              Official AGMARKNET Mandi Commodity Rates
            </h3>
            <p className="text-stone-600 text-xs sm:text-base leading-relaxed">
              Synced directly with data.gov.in. Compare real-time modal prices across nearby markets to get maximum value for your harvest.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
            {/* Commodity 1 */}
            <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-[#FAF9F5] border border-stone-200/80 hover:border-emerald-300 hover:shadow-card transition-all space-y-2.5 sm:space-y-3">
              <div className="flex items-center justify-between gap-1.5">
                <span className="text-[10px] sm:text-[11px] font-mono font-bold text-stone-500 uppercase truncate">Paddy (Rice)</span>
                <span className="inline-flex items-center text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100/90 px-1.5 sm:px-2 py-0.5 rounded-full shrink-0">
                  <TrendingUp className="h-3 w-3 mr-0.5" /> +4.2%
                </span>
              </div>
              <div>
                <div className="font-display text-2xl sm:text-3xl font-medium text-stone-900">₹3,850</div>
                <div className="text-[11px] sm:text-xs text-stone-500 font-medium">per Quintal (Modal)</div>
              </div>
              <div className="pt-2 border-t border-stone-200/60 text-xs text-stone-600 space-y-1">
                <div className="flex items-center gap-1 font-semibold text-stone-800">
                  <MapPin className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
                  <span className="truncate">Burdwan APMC, WB</span>
                </div>
                <div className="font-mono text-[10px] sm:text-[11px] text-stone-500">Daily Arrival: 140 Qtl</div>
              </div>
            </div>

            {/* Commodity 2 */}
            <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-[#FAF9F5] border border-stone-200/80 hover:border-emerald-300 hover:shadow-card transition-all space-y-2.5 sm:space-y-3">
              <div className="flex items-center justify-between gap-1.5">
                <span className="text-[10px] sm:text-[11px] font-mono font-bold text-stone-500 uppercase truncate">Wheat (Gehun)</span>
                <span className="inline-flex items-center text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100/90 px-1.5 sm:px-2 py-0.5 rounded-full shrink-0">
                  <TrendingUp className="h-3 w-3 mr-0.5" /> +1.8%
                </span>
              </div>
              <div>
                <div className="font-display text-2xl sm:text-3xl font-medium text-stone-900">₹2,420</div>
                <div className="text-[11px] sm:text-xs text-stone-500 font-medium">per Quintal (Modal)</div>
              </div>
              <div className="pt-2 border-t border-stone-200/60 text-xs text-stone-600 space-y-1">
                <div className="flex items-center gap-1 font-semibold text-stone-800">
                  <MapPin className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
                  <span className="truncate">Indore APMC, MP</span>
                </div>
                <div className="font-mono text-[10px] sm:text-[11px] text-stone-500">Daily Arrival: 320 Qtl</div>
              </div>
            </div>

            {/* Commodity 3 */}
            <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-[#FAF9F5] border border-stone-200/80 hover:border-emerald-300 hover:shadow-card transition-all space-y-2.5 sm:space-y-3">
              <div className="flex items-center justify-between gap-1.5">
                <span className="text-[10px] sm:text-[11px] font-mono font-bold text-stone-500 uppercase truncate">Mustard (Sarson)</span>
                <span className="inline-flex items-center text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100/90 px-1.5 sm:px-2 py-0.5 rounded-full shrink-0">
                  <TrendingUp className="h-3 w-3 mr-0.5" /> +2.6%
                </span>
              </div>
              <div>
                <div className="font-display text-2xl sm:text-3xl font-medium text-stone-900">₹5,480</div>
                <div className="text-[11px] sm:text-xs text-stone-500 font-medium">per Quintal (Modal)</div>
              </div>
              <div className="pt-2 border-t border-stone-200/60 text-xs text-stone-600 space-y-1">
                <div className="flex items-center gap-1 font-semibold text-stone-800">
                  <MapPin className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
                  <span className="truncate">Karnal APMC, HR</span>
                </div>
                <div className="font-mono text-[10px] sm:text-[11px] text-stone-500">Daily Arrival: 85 Qtl</div>
              </div>
            </div>

            {/* Commodity 4 */}
            <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-[#FAF9F5] border border-stone-200/80 hover:border-emerald-300 hover:shadow-card transition-all space-y-2.5 sm:space-y-3">
              <div className="flex items-center justify-between gap-1.5">
                <span className="text-[10px] sm:text-[11px] font-mono font-bold text-stone-500 uppercase truncate">Potato (Jyoti)</span>
                <span className="inline-flex items-center text-[10px] font-mono font-bold text-stone-600 bg-stone-200/80 px-1.5 sm:px-2 py-0.5 rounded-full shrink-0">
                  -0.8%
                </span>
              </div>
              <div>
                <div className="font-display text-2xl sm:text-3xl font-medium text-stone-900">₹1,180</div>
                <div className="text-[11px] sm:text-xs text-stone-500 font-medium">per Quintal (Modal)</div>
              </div>
              <div className="pt-2 border-t border-stone-200/60 text-xs text-stone-600 space-y-1">
                <div className="flex items-center gap-1 font-semibold text-stone-800">
                  <MapPin className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
                  <span className="truncate">Ranaghat APMC, WB</span>
                </div>
                <div className="font-mono text-[10px] sm:text-[11px] text-stone-500">Daily Arrival: 260 Qtl</div>
              </div>
            </div>
          </div>

          {/* Mandi Helper Bar */}
          <div className="p-3.5 sm:p-5 rounded-2xl bg-[#FAF9F5] border border-stone-200/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2 text-[11px] sm:text-xs font-semibold text-stone-600">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span>Official AGMARKNET wholesale rates updated every 2 hours from data.gov.in</span>
            </div>
            <button
              onClick={() => navigate('/market')}
              className="w-full sm:w-auto px-4 sm:px-5 py-2.5 rounded-full font-bold text-xs text-emerald-900 bg-white hover:bg-emerald-50 border border-stone-300 shadow-soft transition-all flex items-center justify-center gap-1.5"
            >
              <span>Explore 3,000+ Mandis Live</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Technology & Architecture Section */}
      <section id="technology" className="scroll-mt-28 py-12 sm:py-20 px-3.5 sm:px-6 bg-[#F4F3EE]">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-2xl sm:rounded-[1.75rem] bg-gradient-to-br from-[#0c261b] via-[#123827] to-[#1a4a35] p-5 sm:p-12 lg:p-16 text-white relative overflow-hidden shadow-island">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/15 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-2xl space-y-3 sm:space-y-4">
              <div className="font-mono inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1 rounded-full bg-white/10 border border-white/15 text-[10px] sm:text-xs font-bold uppercase tracking-wider sm:tracking-widest text-emerald-200 max-w-full truncate">
                <Layers className="h-3.5 w-3.5 text-emerald-300 shrink-0" />
                <span className="truncate">Modern Open Agronomic Engineering</span>
              </div>
              <h3 className="font-display text-2xl min-[400px]:text-3xl sm:text-5xl font-normal tracking-tight leading-tight text-white text-balance">
                Architected for High Precision in Rural Realities
              </h3>
              <p className="text-emerald-100/90 text-xs sm:text-base leading-relaxed">
                Kisan Mitra utilizes dual-stage machine learning trained on official Area-Production-Yield (APY) datasets, PyTorch convolutional vision models, and official government APIs.
              </p>
            </div>

            {/* Architecture Stack Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-6 sm:pt-10 mt-6 sm:mt-10 border-t border-white/15">
              <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-1.5 text-emerald-300 font-bold text-[11px] sm:text-xs font-mono uppercase mb-1.5 sm:mb-2">
                  <Cpu className="h-4 w-4 shrink-0" /> Vision CNN
                </div>
                <h5 className="font-display font-medium text-white text-sm sm:text-base">PyTorch YOLO11m</h5>
                <p className="text-[11px] sm:text-xs text-emerald-100/70 mt-1 leading-snug">120ms leaf affliction inference on edge</p>
              </div>

              <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-1.5 text-emerald-300 font-bold text-[11px] sm:text-xs font-mono uppercase mb-1.5 sm:mb-2">
                  <BarChart3 className="h-4 w-4 shrink-0" /> Dual-Stage ML
                </div>
                <h5 className="font-display font-medium text-white text-sm sm:text-base">Random Forest APY</h5>
                <p className="text-[11px] sm:text-xs text-emerald-100/70 mt-1 leading-snug">Multi-crop ranking calibrated to soil N-P-K</p>
              </div>

              <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-1.5 text-emerald-300 font-bold text-[11px] sm:text-xs font-mono uppercase mb-1.5 sm:mb-2">
                  <Database className="h-4 w-4 shrink-0" /> Live Pipelines
                </div>
                <h5 className="font-display font-medium text-white text-sm sm:text-base">AGMARKNET & API Mitra</h5>
                <p className="text-[11px] sm:text-xs text-emerald-100/70 mt-1 leading-snug">Direct sync with data.gov.in & myScheme</p>
              </div>

              <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-1.5 text-emerald-300 font-bold text-[11px] sm:text-xs font-mono uppercase mb-1.5 sm:mb-2">
                  <Zap className="h-4 w-4 shrink-0" /> AI Advisory
                </div>
                <h5 className="font-display font-medium text-white text-sm sm:text-base">Google Gemini Flash</h5>
                <p className="text-[11px] sm:text-xs text-emerald-100/70 mt-1 leading-snug">Trilingual agronomic reasoning 24/7</p>
              </div>
            </div>

            {/* Live Metrics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 pt-6 sm:pt-10 border-t border-white/15 mt-6 sm:mt-8">
              <div>
                <div className="font-display text-2xl min-[360px]:text-3xl sm:text-4xl lg:text-5xl font-normal text-emerald-300">75+</div>
                <div className="text-[11px] sm:text-sm text-emerald-100/80 mt-0.5 sm:mt-1 leading-tight">Disease Classes Detected</div>
              </div>
              <div>
                <div className="font-display text-2xl min-[360px]:text-3xl sm:text-4xl lg:text-5xl font-normal text-emerald-300">3,000+</div>
                <div className="text-[11px] sm:text-sm text-emerald-100/80 mt-0.5 sm:mt-1 leading-tight">Live APMC Mandis</div>
              </div>
              <div>
                <div className="font-display text-2xl min-[360px]:text-3xl sm:text-4xl lg:text-5xl font-normal text-emerald-300">4,700+</div>
                <div className="text-[11px] sm:text-sm text-emerald-100/80 mt-0.5 sm:mt-1 leading-tight">Welfare Schemes</div>
              </div>
              <div>
                <div className="font-display text-2xl min-[360px]:text-3xl sm:text-4xl lg:text-5xl font-normal text-emerald-300">&lt; 1.2s</div>
                <div className="text-[11px] sm:text-sm text-emerald-100/80 mt-0.5 sm:mt-1 leading-tight">Global Model Inference</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section id="faq" className="scroll-mt-28 py-12 sm:py-20 px-3.5 sm:px-6 bg-white border-t border-stone-200/80">
        <div className="mx-auto max-w-4xl space-y-8 sm:space-y-10">
          <div className="text-center space-y-2">
            <h2 className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider sm:tracking-widest text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-3 py-0.5 sm:px-3.5 sm:py-1 rounded-full inline-block">
              Answers & Transparency
            </h2>
            <h3 className="font-display text-2xl min-[400px]:text-3xl sm:text-4xl font-normal text-stone-900 tracking-tight text-balance">
              Frequently Asked Questions
            </h3>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {[
              {
                q: 'How does Kisan Mitra recommend the best crops for my field?',
                a: 'Kisan Mitra evaluates your soil nitrogen (N), phosphorus (P), potassium (K), soil pH, and your geographic climate (temperature, humidity, seasonal rainfall). Our dual-stage model cross-references these with regional historical yield data to output the top 5 optimal crops with confidence scores.',
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
                  className="rounded-2xl sm:rounded-3xl border border-stone-200/80 bg-[#FAF9F5] p-3.5 sm:p-6 transition-all"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between text-left gap-3 cursor-pointer"
                  >
                    <span className="font-display font-medium text-sm sm:text-base md:text-lg text-stone-900 leading-snug">{faq.q}</span>
                    <ChevronDown
                      className={`h-4 w-4 sm:h-5 sm:w-5 text-stone-500 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-emerald-800' : ''
                        }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="pt-2.5 sm:pt-3 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-200/60 mt-2.5 sm:mt-3 font-body">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action Banner (Double-Bezel Hardware Card with Atmospheric Depth & Mesh Gradients) */}
      <section className="py-12 sm:py-20 px-3.5 sm:px-6">
        <div className="mx-auto max-w-5xl p-1.5 sm:p-2 rounded-2xl sm:rounded-[2.25rem] bg-stone-200/50 border border-stone-200/80 shadow-[0_30px_70px_-20px_rgba(12,38,27,0.25)]">
          <div className="relative rounded-[calc(1rem-0.125rem)] sm:rounded-[calc(2.25rem-0.5rem)] overflow-hidden bg-gradient-to-br from-[#0c261b] via-[#123827] to-[#1a4a35] p-5 sm:p-14 lg:p-16 text-center text-white space-y-5 sm:space-y-7 border border-emerald-500/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">

            {/* Engineering Grid Texture Inside Card */}
            <div className="absolute inset-0 engineering-grid pointer-events-none opacity-20" />

            {/* Ambient Radial Mesh Glows Inside Card */}
            <div className="absolute top-[-50px] right-[-50px] w-[450px] h-[450px] bg-emerald-400/20 rounded-full blur-[110px] pointer-events-none" />
            <div className="absolute bottom-[-60px] left-[-60px] w-[380px] h-[380px] bg-lime-300/15 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] bg-emerald-500/10 rounded-full blur-[90px] pointer-events-none" />

            {/* Subtle Floating Decorative Background Accents */}
            <div className="absolute top-6 left-8 opacity-25 pointer-events-none hidden sm:block">
              <svg className="w-20 h-20 text-emerald-300 animate-spin-slow" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="1.2" strokeDasharray="4 6" fill="none" />
                <circle cx="50" cy="50" r="24" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 4" fill="none" opacity="0.6" />
              </svg>
            </div>
            <div className="absolute bottom-8 right-10 opacity-30 text-emerald-300 font-mono text-xl pointer-events-none select-none hidden sm:block animate-float-slow">
              +
            </div>

            {/* Eyebrow Chip */}
            <div className="relative z-10 flex justify-center">
              <span className="font-mono inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1 rounded-full bg-white/10 border border-white/15 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider sm:tracking-widest text-emerald-300 shadow-sm backdrop-blur-sm max-w-full truncate">
                <Sparkles className="h-3.5 w-3.5 text-emerald-300 shrink-0" />
                <span>Autonomous Indian Agronomy</span>
              </span>
            </div>

            {/* Headline */}
            <div className="relative z-10 space-y-2.5 sm:space-y-3">
              <h3 className="font-display text-2xl min-[400px]:text-3xl sm:text-5xl md:text-6xl font-normal tracking-tight text-white leading-[1.12] sm:leading-[1.08] text-balance">
                Ready to Cultivate{' '}
                <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-emerald-100 to-lime-200">
                  Smarter Yields?
                </span>
              </h3>
              <p className="max-w-2xl mx-auto text-emerald-100/90 text-xs sm:text-base md:text-lg leading-relaxed font-normal">
                Join thousands of progressive agriculturalists across India utilizing AI agronomy to optimize seasonal fertilizer inputs, detect pathologies, and sell at optimal mandi rates.
              </p>
            </div>

            {/* Action Buttons (Button-in-Button Architecture) */}
            <div className="relative z-10 pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full">
              <SignedOut>
                <Link
                  to="/signup"
                  className="w-full sm:w-auto px-5 sm:px-8 py-3.5 sm:py-4 rounded-full font-extrabold text-xs sm:text-base text-emerald-950 bg-white hover:bg-emerald-50 shadow-[0_12px_32px_rgba(0,0,0,0.25)] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 sm:gap-3 group"
                >
                  <span>Create Free Farmer Account</span>
                  <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-emerald-900/10 flex items-center justify-center group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform shrink-0">
                    <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-900" />
                  </span>
                </Link>
                <Link
                  to="/login"
                  className="w-full sm:w-auto px-5 sm:px-7 py-3.5 sm:py-4 rounded-full font-bold text-xs sm:text-base text-white bg-white/10 hover:bg-white/15 border border-white/20 hover:border-white/30 backdrop-blur-sm active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <span>Sign In to Portal</span>
                </Link>
              </SignedOut>
              <SignedIn>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full sm:w-auto px-5 sm:px-8 py-3.5 sm:py-4 rounded-full font-extrabold text-xs sm:text-base text-emerald-950 bg-white hover:bg-emerald-50 shadow-[0_12px_32px_rgba(0,0,0,0.25)] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 sm:gap-3 group"
                >
                  <span>Open Farmer Workspace</span>
                  <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-emerald-900/10 flex items-center justify-center group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform shrink-0">
                    <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-900" />
                  </span>
                </button>
              </SignedIn>
            </div>

            {/* Trust Proof Micro-Row */}
            <div className="relative z-10 pt-3.5 sm:pt-4 border-t border-white/10 flex flex-col min-[480px]:flex-row flex-wrap items-center justify-center gap-2 sm:gap-6 text-[11px] sm:text-xs text-emerald-200/80 font-medium">
              <span className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-emerald-300 shrink-0" /> 100% Free Forever for Farmers
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-emerald-300 shrink-0" /> English & Bengali Bilingual
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-emerald-300 shrink-0" /> Official AGMARKNET & API Mitra
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Footer */}
      <footer className="border-t border-stone-200/80 bg-white py-8 sm:py-12 px-3.5 sm:px-6">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6 text-xs text-stone-500 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <Sprout className="h-5 w-5 text-emerald-700 shrink-0" />
            <span className="font-display font-medium text-stone-900 text-sm sm:text-base">Kisan Mitra Agronomy</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 font-semibold text-stone-600 text-[11px] sm:text-xs">
            <a href="#platform" className="hover:text-emerald-800 transition-colors">
              Platform
            </a>
            <a href="#features" className="hover:text-emerald-800 transition-colors">
              Features
            </a>
            <a href="#schemes" className="hover:text-emerald-800 transition-colors">
              Govt Schemes
            </a>
            <a href="#mandi" className="hover:text-emerald-800 transition-colors">
              APMC Mandi
            </a>
            <a href="#technology" className="hover:text-emerald-800 transition-colors">
              Architecture
            </a>
            <a href="#faq" className="hover:text-emerald-800 transition-colors">
              FAQ
            </a>
          </div>

          <p className="text-[11px] sm:text-xs">© 2026 Kisan Mitra. Data-driven agronomy for Indian agriculture.</p>
        </div>
      </footer>
    </div>
  );
};
