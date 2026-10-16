import React from 'react';
import { SignUp } from '@clerk/clerk-react';
import { Sprout } from 'lucide-react';

export const SignUpPage: React.FC = () => {
  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side - Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-primary-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-800 to-primary-950" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1932&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay" />

        <div className="relative z-10 flex flex-col justify-between p-12 text-white h-full">
          <div className="flex items-center gap-2">
            <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
              <Sprout className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold tracking-tight">Kisan Mitra</span>
          </div>

          <div className="space-y-6 max-w-lg">
            <h1 className="text-4xl font-bold leading-tight">
              Join the Future of Smart Farming
            </h1>
            <p className="text-primary-100 text-lg leading-relaxed">
              "I was skeptical at first, but the market price predictions helped me sell my crop at the perfect time. Highly recommended!"
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
                Join 10,000+ farmers today
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-primary-200/60">
            <p>© 2024 Kisan Mitra</p>
            <p>Privacy Policy • Terms of Service</p>
          </div>
        </div>
      </div>

      {/* Right Side - Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16 bg-gray-50">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <div className="lg:hidden mx-auto h-12 w-12 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg mb-6">
              <Sprout className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Create an account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Start your journey towards smarter agriculture.
            </p>
          </div>

          <div className="bg-white p-8 shadow-sm rounded-2xl border border-gray-100">
            <SignUp
              routing="path"
              path="/signup"
              signInUrl="/login"
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
        </div>
      </div>
    </div>
  );
};
