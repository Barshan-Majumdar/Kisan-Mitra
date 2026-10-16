import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar,
  Info,
  Search,
  Landmark,
  ShieldCheck,
  Banknote,
  Sparkles,
  Filter,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import api from '../services/api';
import type { Scheme } from '../types';

const CATEGORIES = [
  'All',
  'Direct Income Support',
  'Crop Insurance',
  'Credit & Loans',
  'Irrigation & Solar',
  'Machinery & Equipment',
  'Soil & Fertilizer',
  'Organic Farming',
];

export const Schemes: React.FC = () => {
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        setLoading(true);
        // Fetches directly from backend which connects to data.gov.in resource c8942b03-5182-4bf5-85df-a040b2f5cf12
        const response = await api.get('/schemes');
        setSchemes(response.data);
      } catch (error) {
        console.error('Failed to fetch schemes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchemes();
  }, []);

  const filteredSchemes = useMemo(() => {
    return schemes.filter((scheme) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        (scheme.category && scheme.category.toLowerCase().includes(selectedCategory.toLowerCase())) ||
        (scheme.name && scheme.name.toLowerCase().includes(selectedCategory.toLowerCase()));

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        scheme.name.toLowerCase().includes(query) ||
        scheme.description.toLowerCase().includes(query) ||
        (scheme.eligibilityCriteria && scheme.eligibilityCriteria.toLowerCase().includes(query)) ||
        (scheme.funding && scheme.funding.toLowerCase().includes(query)) ||
        (scheme.category && scheme.category.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [schemes, selectedCategory, searchQuery]);

  const handleApplyClick = (link?: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const url = link && link.startsWith('http') ? link : 'https://www.myscheme.gov.in';
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6 animate-fade-in px-1 pb-10">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200/60 inline-flex">
              <Landmark className="h-5 w-5 text-emerald-700" />
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Agricultural Subsidies & Schemes
            </h2>
          </div>
          <p className="text-sm text-stone-600">
            Live official central and state government agricultural financial aid, subsidies, and direct benefit transfer (DBT) portals.
          </p>
        </div>

        {/* Live Gov Sync Indicator */}
        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-emerald-800 self-start md:self-auto shrink-0 shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
          </span>
          <span>Official Portals Direct Link</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-3.5">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by scheme name, keyword, crop insurance, or subsidy details..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-stone-200/80 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 text-stone-900 placeholder:text-stone-400 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400 hover:text-stone-700"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <Filter className="h-4 w-4 text-stone-400 shrink-0 ml-1 hidden sm:block" />
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs font-bold px-3.5 py-1.5 rounded-2xl whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-stone-900 text-white shadow-sm ring-2 ring-stone-900/10'
                    : 'bg-white text-stone-600 border border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 py-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-card animate-pulse space-y-4"
            >
              <div className="h-6 bg-stone-200/70 rounded-xl w-3/4"></div>
              <div className="h-4 bg-stone-200/50 rounded-lg w-full"></div>
              <div className="h-4 bg-stone-200/50 rounded-lg w-5/6"></div>
              <div className="h-10 bg-stone-200/60 rounded-2xl w-full mt-6"></div>
            </div>
          ))}
        </div>
      ) : filteredSchemes.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white rounded-3xl border border-stone-200/80 shadow-card">
          <div className="inline-flex p-3 rounded-2xl bg-amber-50 text-amber-700 mb-3">
            <Info className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-stone-900">No schemes found matching your filter</h3>
          <p className="text-sm text-stone-500 max-w-md mx-auto mt-1 mb-4">
            Try adjusting your search query or selecting "All" categories to view all active government initiatives.
          </p>
          <Button
            variant="outline"
            className="rounded-2xl"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
          >
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {filteredSchemes.map((scheme) => (
            <Card
              key={scheme.id}
              className="group flex flex-col p-6 rounded-3xl border border-stone-200/80 bg-white shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
            >
              {/* Top Row: Category + Status Badge */}
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200/70">
                    {scheme.category || 'Agricultural Aid'}
                  </span>
                  {scheme.state && scheme.state !== 'National' && (
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/70">
                      {scheme.state}
                    </span>
                  )}
                </div>
                <Badge variant="success" size="sm">
                  Active DBT
                </Badge>
              </div>

              {/* Scheme Name */}
              <h3 className="text-lg font-black text-stone-900 tracking-tight line-clamp-2 mb-2 group-hover:text-emerald-800 transition-colors">
                {scheme.name}
              </h3>

              {/* Funding / Subsidy Tag */}
              {scheme.funding && (
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50/80 px-2.5 py-1 rounded-xl border border-emerald-200/60 mb-3 self-start">
                  <Banknote className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
                  <span>{scheme.funding}</span>
                </div>
              )}

              {/* Description */}
              <p className="text-stone-600 text-sm mb-5 line-clamp-3 leading-relaxed flex-1">
                {scheme.description}
              </p>

              {/* Details & Info Boxes */}
              <div className="space-y-2 mt-auto">
                <div className="flex items-center text-xs text-stone-600 p-2.5 rounded-2xl bg-[#FAF9F5] border border-stone-200/70">
                  <Info className="h-4 w-4 mr-2 text-emerald-700 shrink-0" />
                  <span className="font-bold mr-1 text-stone-800">Eligibility:</span>
                  <span className="truncate">
                    {scheme.eligibilityCriteria || scheme.eligibility || 'All active farmers'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-stone-600 p-2.5 rounded-2xl bg-[#FAF9F5] border border-stone-200/70">
                  <div className="flex items-center min-w-0">
                    <Calendar className="h-4 w-4 mr-2 text-emerald-700 shrink-0" />
                    <span className="font-bold mr-1 text-stone-800">Deadline:</span>
                    <span className="truncate">
                      {scheme.deadline ? new Date(scheme.deadline).toLocaleDateString() : 'Ongoing / Open Year-Round'}
                    </span>
                  </div>
                  {scheme.source && (
                    <span className="text-[10px] text-stone-500 font-medium truncate ml-2 hidden sm:inline">
                      {scheme.source.split('(')[0]}
                    </span>
                  )}
                </div>

                {/* Primary Action Buttons: Apply Now & Inspect Guidelines */}
                <div className="pt-2 flex items-center gap-2.5">
                  <button
                    className="flex-1 py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-emerald-800 hover:bg-emerald-700 active:bg-emerald-900 transition-colors shadow-xs flex items-center justify-center cursor-pointer text-center"
                    onClick={(e) => handleApplyClick(scheme.applicationLink, e)}
                  >
                    Apply Now
                  </button>
                  <Button
                    variant="outline"
                    className="flex-1 rounded-xl font-bold text-xs py-2.5 text-stone-700 hover:text-stone-900 border-stone-300"
                    onClick={() => setSelectedScheme(scheme)}
                  >
                    Guidelines
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Inspection Modal */}
      <Modal
        isOpen={!!selectedScheme}
        onClose={() => setSelectedScheme(null)}
        title={selectedScheme?.name}
      >
        <div className="space-y-4">
          {/* Category & Status pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              {selectedScheme?.category || 'Agricultural Initiative'}
            </span>
            {selectedScheme?.funding && (
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                <Banknote className="h-3.5 w-3.5" />
                {selectedScheme?.funding}
              </span>
            )}
            <Badge variant="success" size="sm">
              Official Gov Portal
            </Badge>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-stone-200/80">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-emerald-700" />
              Scheme Overview & Benefits
            </h4>
            <p className="text-stone-700 text-sm leading-relaxed">{selectedScheme?.description}</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-stone-200/80">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5 flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" />
              Beneficiary Eligibility Criteria
            </h4>
            <p className="text-stone-700 text-sm leading-relaxed">
              {selectedScheme?.eligibilityCriteria || selectedScheme?.eligibility || 'All active agricultural landholders, tenant farmers, and cultivators.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-[#FAF9F5] border border-stone-200/80">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">Target Window / Deadline</h4>
              <p className="text-stone-800 text-sm font-semibold">
                {selectedScheme?.deadline ? new Date(selectedScheme.deadline).toLocaleDateString() : 'Ongoing / Open Enrollment'}
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#FAF9F5] border border-stone-200/80">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">Source & Jurisdiction</h4>
              <p className="text-stone-800 text-sm font-semibold truncate">
                {selectedScheme?.source || 'data.gov.in Official Portal'}
              </p>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-stone-200/70 flex flex-col-reverse sm:flex-row items-center justify-end gap-3 w-full">
            <button
              type="button"
              className="w-full sm:w-auto px-6 py-3 rounded-full font-bold text-sm text-stone-600 hover:text-stone-900 border border-stone-200 hover:bg-stone-100 transition-colors cursor-pointer shrink-0 text-center"
              onClick={() => setSelectedScheme(null)}
            >
              Close
            </button>
            <button
              onClick={() => handleApplyClick(selectedScheme?.applicationLink)}
              className="w-full sm:flex-1 py-3 px-6 rounded-full font-bold text-sm sm:text-base text-white bg-emerald-800 hover:bg-emerald-700 active:bg-emerald-900 transition-colors shadow-sm flex items-center justify-center cursor-pointer whitespace-nowrap text-center"
            >
              Apply on Official Portal
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
