import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { useTranslation } from 'react-i18next';
import {
  MessageSquare,
  ScanLine,
  ClipboardList,
  History,
  ArrowRight,
  Sun,
  CloudRain,
  Wind,
  CloudSun,
  Sprout,
  TrendingUp,
  AlertCircle,
  Calendar
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import api from '../services/api';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { t } = useTranslation();
  const [weather, setWeather] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const weatherRes = await api.get('/weather');
        setWeather(weatherRes.data);

        const userEmail = user?.primaryEmailAddress?.emailAddress;
        if (userEmail) {
          const statsRes = await api.get('/dashboard/stats', {
            params: { userEmail }
          });
          setStats(statsRes.data);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      }
    };

    fetchData();
  }, [user]);

  const features = [
    {
      title: 'All Advisory',
      description: 'View your past and current crop advisories.',
      icon: History,
      path: '/advisory-history',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'My Tasks',
      description: 'Track your farming activities and to-do lists.',
      icon: ClipboardList,
      path: '/todos',
      color: 'bg-purple-50 text-purple-600',
    },
    {
      title: 'Disease Detect',
      description: 'Upload plant photos to detect diseases and get remedies.',
      icon: ScanLine,
      path: '/disease',
      color: 'bg-red-50 text-red-600',
    },
    {
      title: 'Chatbot',
      description: 'Ask our AI assistant anything about farming.',
      icon: MessageSquare,
      path: '/chatbot',
      color: 'bg-teal-50 text-teal-600',
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-primary-900 text-white shadow-xl min-h-[350px] sm:min-h-[400px] lg:min-h-[400px] flex items-center animate-slide-up">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1740&auto=format&fit=crop"
            alt="Farm field"
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900/95 via-primary-900/80 sm:via-primary-900/70 to-primary-900/60 sm:to-transparent" />
        </div>

        <div className="relative z-10 grid gap-6 sm:gap-8 lg:grid-cols-3 lg:gap-12 p-6 sm:p-8 lg:p-12 w-full">
          <div className="lg:col-span-2 space-y-4 sm:space-y-6 animate-slide-up delay-100">
            <div className="inline-flex items-center rounded-full bg-primary-800/50 px-2.5 sm:px-3 py-1 text-xs sm:text-sm font-medium text-primary-100 backdrop-blur-sm border border-primary-700/50">
              <span className="flex h-2 w-2 rounded-full bg-green-400 mr-1.5 sm:mr-2 animate-pulse"></span>
              Optimal Sowing Conditions
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
              {t('welcome')}, <br className="hidden sm:block" />
              <span className="text-primary-200">{user?.firstName || 'Farmer'}!</span> 🌾
            </h2>
            <p className="text-primary-100 text-base sm:text-lg lg:text-xl max-w-xl leading-relaxed">
              {t('today_overview')}
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 pt-2">
              <button
                onClick={() => navigate('/input')}
                className="inline-flex items-center justify-center rounded-xl bg-white px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-bold text-primary-900 shadow-lg hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-900 transition-all transform hover:scale-105 active:scale-95 touch-target"
              >
                Start New Advisory
              </button>
              <button
                onClick={() => navigate('/todos')}
                className="inline-flex items-center justify-center rounded-xl bg-white/10 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold text-white backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all hover:scale-105 active:scale-95 touch-target"
              >
                View Tasks
              </button>
            </div>
          </div>

          <div className="hidden lg:flex flex-col justify-center animate-slide-up delay-200">
            <div className="rounded-2xl bg-white/10 p-6 backdrop-blur-md border border-white/20 shadow-2xl hover:bg-white/15 transition-colors">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-white text-lg">Weather Today</h3>
                <Sun className="h-8 w-8 text-yellow-300 animate-[spin_10s_linear_infinite]" />
              </div>
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="text-primary-100">Temperature</span>
                  <span className="font-bold text-2xl">23°C</span>
                  {/* <span className="font-bold text-2xl">{weather?.temperature || '--'}°C</span> */}
                  
                </div>
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="text-primary-100">Humidity</span>
                  <div className="flex items-center gap-2">
                    <CloudRain className="h-5 w-5 text-blue-300" />
                    <span className="font-bold text-lg">{weather?.humidity || '--'}%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-primary-100">Wind Speed</span>
                  <div className="flex items-center gap-2">
                    <Wind className="h-5 w-5 text-gray-300" />
                    <span className="font-bold text-lg">{weather?.windSpeed || '--'} km/h</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">{t('weather')}</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">23°C</h3>
              <p className="text-xs text-blue-600 mt-1 flex items-center">
                <CloudSun className="h-3 w-3 mr-1" />
                Sunny
              </p>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg">
              <CloudSun className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-green-500 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">{t('active_advisories')}</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats?.activeAdvisories || 0}</h3>
              <p className="text-xs text-green-600 mt-1 flex items-center">
                <Sprout className="h-3 w-3 mr-1" />
                {t('crops')}
              </p>
            </div>
            <div className="p-2 bg-green-50 rounded-lg">
              <AlertCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-amber-500 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">{t('pending_tasks')}</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats?.pendingTasks || 0}</h3>
              <p className="text-xs text-amber-600 mt-1 flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                Due Today
              </p>
            </div>
            <div className="p-2 bg-amber-50 rounded-lg">
              <ClipboardList className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-purple-500 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">{t('market_trends')}</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">↑ 5%</h3>
              <p className="text-xs text-purple-600 mt-1 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                Rice Price
              </p>
            </div>
            <div className="p-2 bg-purple-50 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Features Grid */}
      <div className="animate-slide-up delay-300">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Quick Actions</h3>
        <div className="grid gap-4 sm:gap-6 grid-cols-1 xs:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Card
              key={feature.title}
              className={`group cursor-pointer hover:border-primary-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-scale-in p-0`}
              style={{ animationDelay: `${(index + 3) * 100}ms` }}
              onClick={() => navigate(feature.path)}
              padding="none"
            >
              <div className="p-5 sm:p-6 space-y-3 sm:space-y-4">
                <div className={`inline-flex rounded-xl p-2.5 sm:p-3 ring-4 ring-white ${feature.color} bg-opacity-20 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-base sm:text-lg text-gray-900 group-hover:text-primary-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm text-gray-500 line-clamp-2">
                    {feature.description}
                  </p>
                </div>
                <div className="flex items-center text-xs sm:text-sm font-medium text-primary-600 group-hover:translate-x-1 transition-transform">
                  Open <ArrowRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
