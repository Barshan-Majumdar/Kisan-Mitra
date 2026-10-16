import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import { Sprout } from 'lucide-react';

export const SignInPage: React.FC = () => {
  return (
    <div className="min-h-screen flex bg-[#F8F9F6]">
      {/* Left Side - Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-[#0c261b] via-[#133c2a] to-[#1c543c] overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1740&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay" />

        <div className="relative z-10 flex flex-col justify-between p-10 lg:p-14 text-white h-full">
          <div className="flex items-center gap-2.5">
            <div className="bg-white/10 p-2.5 rounded-2xl backdrop-blur-md border border-white/15 shadow-soft">
              <Sprout className="h-6 w-6 text-emerald-300" />
            </div>
            <span className="text-xl font-extrabold tracking-tight">Kisan Mitra</span>
          </div>

          <div className="space-y-6 max-w-lg">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              AI-Powered Agricultural Intelligence
            </div>
            <h1 className="text-3xl lg:text-5xl font-extrabold leading-tight tracking-tight text-white">
              Data-Driven Agronomy for Indian Farmers
            </h1>
            <p className="text-emerald-100/90 text-base lg:text-lg leading-relaxed">
              Precision nutrient management, seasonal harvest predictions, and automated mandi rates in a unified, professional workspace.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-9 w-9 rounded-full border-2 border-[#133c2a] bg-emerald-800 flex items-center justify-center text-xs font-bold text-white shadow-soft">
                    F{i}
                  </div>
                ))}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-emerald-200">
                Empowering farmers across regional belts
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-emerald-200/60">
            <p>© 2026 Kisan Mitra Agronomy</p>
            <p className="hidden sm:block">Privacy Standards • Secure Portal</p>
          </div>
        </div>
      </div>

      {/* Right Side - Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 lg:p-14 xl:p-20 bg-[#F8F9F6]">
        <div className="w-full max-w-md space-y-6 sm:space-y-8">
          <div className="text-center lg:text-left space-y-2">
            <div className="lg:hidden mx-auto h-12 w-12 bg-emerald-700 rounded-2xl flex items-center justify-center shadow-soft mb-5">
              <Sprout className="h-7 w-7 text-white" />
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-stone-900">
              Farmer Sign In
            </h2>
            <p className="text-sm text-stone-600">
              Authenticate your identity to review personalized advisories.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 shadow-card rounded-3xl border border-stone-200/80">
            <SignIn
              routing="path"
              path="/login"
              signUpUrl="/signup"
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "shadow-none p-0 w-full bg-transparent",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  formButtonPrimary: "bg-emerald-700 hover:bg-emerald-800 text-sm font-bold py-3 rounded-2xl shadow-soft",
                  formFieldInput: "rounded-2xl border-stone-200/90 bg-[#FAF9F5] focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10",
                  footerActionLink: "text-emerald-700 hover:text-emerald-800 font-semibold"
                }
              }}
            />
          </div>

          <div className="text-center">
            <p className="text-xs text-stone-500">
              By accessing the portal, you consent to standard agricultural diagnostic terms.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
