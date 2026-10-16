import React from 'react';
import { Construction, Sparkles } from 'lucide-react';
import { Card } from '../components/ui/Card';

export const DiseaseDetect: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Disease Detection</h2>
        <p className="text-sm sm:text-base text-gray-600 mt-1">AI-powered crop disease identification.</p>
      </div>

      <Card padding="lg" className="text-center">
        <div className="py-8 sm:py-12 flex flex-col items-center">
          <div className="relative mb-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
              <Construction className="h-10 w-10 sm:h-12 sm:w-12 text-amber-600" />
            </div>
            <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center animate-pulse">
              <Sparkles className="h-4 w-4 text-primary-600" />
            </div>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            Coming Soon!
          </h3>

          <p className="text-gray-600 text-sm sm:text-base max-w-md mb-6">
            We're currently working hard on this feature. Soon you'll be able to upload photos of your crops and get instant AI-powered disease detection with remedies.
          </p>

          <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 px-4 py-2 rounded-full">
            <Construction className="h-4 w-4" />
            <span className="font-medium">Under Development</span>
          </div>

          <p className="text-xs sm:text-sm text-gray-500 mt-6">
            Stay tuned for updates! 🌱
          </p>
        </div>
      </Card>
    </div>
  );
};

