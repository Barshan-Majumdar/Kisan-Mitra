import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import { Sprout } from 'lucide-react';

export const SignInPage: React.FC = () => {
  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side - Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-primary-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-800 to-primary-950" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1740&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay" />

        <div className="relative z-10 flex flex-col justify-between p-8 lg:p-12 text-white h-full">
          <div className="flex items-center gap-2">
            <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
              <Sprout className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold tracking-tight">Kisan Mitra</span>
          </div>

          <div className="space-y-6 max-w-lg">
            <h1 className="text-3xl lg:text-4xl font-bold leading-tight">
              Farming Intelligence for a Better Harvest
            </h1>
            <p className="text-primary-100 text-base lg:text-lg leading-relaxed">
              "Fasal Mitrahas completely transformed how I manage my crops. The disease detection feature alone saved my tomato harvest last season."
            </p>
            <div className="flex items-center gap-4 pt-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-10 w-10 rounded-full border-2 border-primary-900 bg-primary-800 flex items-center justify-center text-xs font-medium">
                    U{i}
                  </div>
                ))}
              </div>
              <div className="text-sm font-medium text-primary-100">
                Trusted by 10,000+ farmers
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs sm:text-sm text-primary-200/60">
            <p>© 2024 Kisan Mitra</p>
            <p className="hidden sm:block">Privacy Policy • Terms of Service</p>
          </div>
        </div>
      </div>

      {/* Right Side - Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-12 xl:p-16 bg-gray-50">
        <div className="w-full max-w-md space-y-6 sm:space-y-8">
          <div className="text-center lg:text-left">
            <div className="lg:hidden mx-auto h-12 w-12 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg mb-6">
              <Sprout className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Please enter your details to sign in.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 shadow-sm rounded-2xl border border-gray-100">
            <SignIn
              routing="path"
              path="/login"
              signUpUrl="/signup"
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "shadow-none p-6 w-full",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  formButtonPrimary: "bg-primary-600 hover:bg-primary-700 text-sm normal-case py-2.5 rounded-xl",
                  formFieldInput: "rounded-xl border-gray-200 focus:border-primary-500 focus:ring-primary-500",
                  footerActionLink: "text-primary-600 hover:text-primary-700 font-medium"
                }
              }}
            />
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
