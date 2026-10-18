import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { SignIn, SignUp } from '@clerk/clerk-react';
import { Sprout, ArrowLeft, LogIn, UserPlus, Sparkles, CheckCircle2 } from 'lucide-react';
import { LanguageToggle } from '../components/LanguageToggle';

interface AuthPageProps {
  initialMode?: 'signin' | 'signup';
}

const clerkAppearance = {
  variables: {
    colorPrimary: '#166534',
    colorText: '#1c1917',
    colorTextSecondary: '#78716c',
    colorBackground: '#ffffff',
    colorInputBackground: '#FAF9F5',
    colorInputBorder: '#E7E5E4',
    borderRadius: '1rem',
    fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
  },
  elements: {
    rootBox: 'w-full flex justify-center items-center',
    card: 'w-full shadow-card rounded-3xl border border-stone-200/90 px-5 py-4 sm:px-7 sm:py-5 bg-white',
    headerTitle: 'text-lg sm:text-xl font-extrabold text-stone-900 tracking-tight text-center sm:text-left',
    headerSubtitle: 'text-xs text-stone-500 font-medium text-center sm:text-left mt-0.5',
    socialButtonsBlockButton:
      'rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-800 font-bold text-xs py-2.5 transition-all duration-200 shadow-xs flex items-center justify-center gap-2',
    socialButtonsBlockButtonText: 'font-bold text-stone-800 text-xs',
    dividerRow: 'my-2 sm:my-2.5',
    dividerText: 'text-[11px] text-stone-400 font-bold uppercase tracking-wider',
    formFieldLabel: 'text-[11px] font-bold text-stone-700 mb-1',
    formFieldInput:
      'rounded-xl border border-stone-200 bg-[#FAF9F5] focus:bg-white focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/10 text-stone-900 text-xs sm:text-sm py-2 px-3 transition-all',
    formButtonPrimary:
      'bg-emerald-800 hover:bg-emerald-700 active:bg-emerald-900 text-white font-bold text-xs sm:text-sm py-2.5 rounded-xl shadow-soft hover:shadow-card transition-all cursor-pointer mt-1',
    footerActionLink: 'text-emerald-800 hover:text-emerald-700 font-bold text-xs transition-colors',
    footer: 'pt-2 mt-1 border-t border-stone-100',
    identityPreviewText: 'text-stone-800 font-semibold text-xs',
  },
};

export const AuthPage: React.FC<AuthPageProps> = ({ initialMode }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine mode based on prop or current URL path
  const getDerivedMode = (): 'signin' | 'signup' => {
    if (initialMode) return initialMode;
    if (location.pathname.startsWith('/signup')) return 'signup';
    const params = new URLSearchParams(location.search);
    if (params.get('mode') === 'signup') return 'signup';
    return 'signin';
  };

  const [mode, setMode] = useState<'signin' | 'signup'>(getDerivedMode);

  useEffect(() => {
    setMode(getDerivedMode());
  }, [location.pathname, location.search, initialMode]);

  const handleTabChange = (newMode: 'signin' | 'signup') => {
    setMode(newMode);
    if (newMode === 'signin') {
      navigate('/login', { replace: true });
    } else {
      navigate('/signup', { replace: true });
    }
  };

  return (
    <div className="min-h-screen lg:h-screen flex bg-[#F4F3EE] selection:bg-emerald-100 selection:text-emerald-900 overflow-hidden">
      {/* Left Side: Rich Agronomy Showcase (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 h-full relative bg-gradient-to-br from-[#0c261b] via-[#133c2a] to-[#1c543c] overflow-hidden p-8 xl:p-12 flex-col justify-between text-white shrink-0">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1740&auto=format&fit=crop')`,
          }}
        />
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-emerald-500/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-lime-500/15 rounded-full blur-[120px] pointer-events-none" />

        {/* Top Header inside Left Hero */}
        <div className="relative z-10 flex items-center justify-between shrink-0">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 backdrop-blur-md text-xs font-semibold text-emerald-200 hover:text-white transition-all group"
          >
            <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Kisan Mitra</span>
          </Link>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-bold text-emerald-200">Secure Agronomy Gateway</span>
          </div>
        </div>

        {/* Center: Hero Value Proposition */}
        <div className="relative z-10 max-w-lg space-y-4 my-auto py-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-emerald-200">
            <Sparkles className="h-3.5 w-3.5 text-emerald-300" />
            <span>AI-Powered Agricultural Intelligence</span>
          </div>

          <h1 className="text-2xl xl:text-4xl font-black leading-tight tracking-tight text-white">
            {mode === 'signin'
              ? 'Welcome Back to Your Agronomy Command Center'
              : 'Empower Your Harvest with Data-Driven Decisions'}
          </h1>

          <p className="text-emerald-100/90 text-xs xl:text-sm leading-relaxed">
            {mode === 'signin'
              ? 'Log in to review updated mandi prices from data.gov.in, active government subsidies via API Mitra, and customized 120-day farming action tasks.'
              : 'Join progressive farmers across India leveraging soil chemistry models, computer vision disease diagnostics, and live APMC market intelligence.'}
          </p>

          <div className="space-y-2 pt-1 text-xs sm:text-sm font-medium text-emerald-100/90">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Multi-crop ranking calibrated for Indian climatic belts</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Real-time AGMARKNET APMC mandi commodity wholesale rates</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Direct benefit transfer (DBT) scheme application links</span>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="relative z-10 flex items-center justify-between text-[11px] text-emerald-200/60 pt-3 border-t border-white/10 shrink-0">
          <p>© 2026 Kisan Mitra Agronomy</p>
          <p>Verified Agricultural Standard</p>
        </div>
      </div>

      {/* Right Side: Authentication Panel (Smoothly scrollable when needed) */}
      <div className="w-full lg:w-1/2 h-full flex flex-col justify-between p-4 sm:p-6 lg:px-8 lg:py-6 overflow-y-auto custom-scrollbar">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between pb-2 shrink-0">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-stone-900 group transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Home</span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Sprout className="h-5 w-5 text-emerald-700 shrink-0" />
              <span className="text-sm font-black tracking-tight text-stone-900">Kisan Mitra</span>
            </div>
            <LanguageToggle />
          </div>
        </div>

        {/* Central Auth Container */}
        <div className="w-full max-w-[440px] mx-auto my-auto py-4 space-y-4">
          {/* Interactive Segmented Tab Switcher */}
          <div className="p-1 rounded-2xl bg-stone-200/70 border border-stone-300/80 flex items-center shadow-inner">
            <button
              type="button"
              onClick={() => handleTabChange('signin')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === 'signin'
                  ? 'bg-stone-900 text-white shadow-card'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-300/40'
              }`}
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('signup')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === 'signup'
                  ? 'bg-stone-900 text-white shadow-card'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-300/40'
              }`}
            >
              <UserPlus className="h-3.5 w-3.5" />
              <span>Create Account</span>
            </button>
          </div>

          {/* Clean Clerk Component Container with proper breathing room */}
          <div className="w-full flex justify-center pb-4">
            {mode === 'signin' ? (
              <div key="clerk-signin" className="w-full">
                <SignIn
                  routing="path"
                  path="/login"
                  signUpUrl="/signup"
                  fallbackRedirectUrl="/dashboard"
                  forceRedirectUrl="/dashboard"
                  signUpFallbackRedirectUrl="/dashboard"
                  signUpForceRedirectUrl="/dashboard"
                  appearance={clerkAppearance}
                />
              </div>
            ) : (
              <div key="clerk-signup" className="w-full">
                <SignUp
                  routing="path"
                  path="/signup"
                  signInUrl="/login"
                  fallbackRedirectUrl="/dashboard"
                  forceRedirectUrl="/dashboard"
                  signInFallbackRedirectUrl="/dashboard"
                  signInForceRedirectUrl="/dashboard"
                  appearance={clerkAppearance}
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center pt-2 pb-4 text-[11px] text-stone-500 shrink-0">
          Protected by encrypted agronomic identity protocols • 100% Free for Indian Farmers
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
