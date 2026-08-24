import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  MapPin, 
  Sparkles, 
  Building2, 
  Users, 
  Compass, 
  ShieldCheck, 
  ArrowRight,
  Loader2,
  X
} from 'lucide-react';
import { Business, Category, FilterState } from '../types';
import { GHANA_REGIONS, getClosestGhanaRegion } from '../utils/geolocationService';

interface HeroSearchProps {
  categories: Category[];
  businesses: Business[];
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  searchHistory: string[];
  onAddSearchHistory: (query: string) => void;
  onClearSearchHistory: () => void;
  onSelectBusiness: (business: Business) => void;
  onShowToast?: (title: string, message?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  isAutoDetectedRegion?: boolean;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({
  categories,
  businesses,
  filters,
  onFilterChange,
  onResetFilters,
  searchHistory,
  onAddSearchHistory,
  onSelectBusiness,
  onShowToast,
  isAutoDetectedRegion = false,
}) => {
  const [inputValue, setInputValue] = useState(filters.searchQuery);
  const [selectedRegion, setSelectedRegion] = useState(filters.region || '');
  const [isFocused, setIsFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputValue(filters.searchQuery);
  }, [filters.searchQuery]);

  useEffect(() => {
    setSelectedRegion(filters.region || '');
  }, [filters.region]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (inputValue.trim()) {
      onAddSearchHistory(inputValue.trim());
    }
    onFilterChange({ 
      searchQuery: inputValue,
      region: selectedRegion === 'All Regions' ? '' : selectedRegion
    });
    setIsFocused(false);

    // Smooth scroll to directory section if needed
    const directoryEl = document.getElementById('discover-businesses-section') || document.getElementById('main-directory-section');
    if (directoryEl) {
      directoryEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleQuickTagClick = (tag: string) => {
    setInputValue(tag);
    onFilterChange({ searchQuery: tag });
    onAddSearchHistory(tag);
    const directoryEl = document.getElementById('discover-businesses-section') || document.getElementById('main-directory-section');
    if (directoryEl) {
      directoryEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Popular quick searches matching Image 1
  const popularSearches = [
    'Restaurants',
    'Building Materials',
    'Laptop Repair',
    'Salons',
    'Real Estate',
    'Event Services'
  ];

  // Autocomplete matches
  const trimmed = inputValue.trim().toLowerCase();
  const matchedBusinesses = trimmed
    ? businesses
        .filter(
          (b) =>
            b.name.toLowerCase().includes(trimmed) ||
            b.services?.some((s) => s.toLowerCase().includes(trimmed)) ||
            b.city.toLowerCase().includes(trimmed)
        )
        .slice(0, 4)
    : [];

  return (
    <div className="relative w-full bg-[#0a0f1d] text-white border-b border-slate-800 overflow-hidden">
      {/* Background illuminated night bridge/skyline aesthetic */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-luminosity scale-105 pointer-events-none"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=2000&q=80')`
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0f1d] via-[#0a0f1d]/90 to-[#0a0f1d]/75 pointer-events-none" />

      {/* Subtle glowing ambient lights */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-24 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Heading, Subtitle, Unified Search Bar, Popular Searches */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            <div className="space-y-3 sm:space-y-4">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white">
                Ghana has a business for almost everything.{' '}
                <span className="text-blue-500 block sm:inline">Find yours.</span>
              </h1>
              
              <p className="text-sm sm:text-base lg:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed">
                Discover trusted businesses, services and opportunities across Ghana — all in one place.
              </p>
            </div>

            {/* Unified Search Bar matching Image 1 layout */}
            <div ref={searchContainerRef} className="relative z-30 max-w-2xl">
              <form
                onSubmit={handleSearchSubmit}
                className="bg-white rounded-2xl sm:rounded-full p-1.5 sm:p-2 shadow-2xl flex flex-col sm:flex-row items-stretch sm:items-center gap-2 border border-slate-200"
              >
                {/* Search Text Input */}
                <div className="flex-1 flex items-center gap-2.5 px-3.5 py-2 min-w-0">
                  <Search className="w-5 h-5 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    id="hero-main-search-input"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    placeholder="Search businesses, services or locations..."
                    className="w-full bg-transparent text-slate-900 placeholder:text-slate-400 text-sm sm:text-base font-medium focus:outline-none min-w-0"
                    autoComplete="off"
                  />
                  {inputValue && (
                    <button
                      type="button"
                      onClick={() => {
                        setInputValue('');
                        onFilterChange({ searchQuery: '' });
                      }}
                      className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Region Dropdown Segment */}
                <div className="flex items-center gap-1.5 px-3 py-2 border-t sm:border-t-0 sm:border-l border-slate-200 bg-slate-50 sm:bg-transparent rounded-xl sm:rounded-none">
                  <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                  <select
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="bg-transparent text-slate-700 text-xs sm:text-sm font-semibold focus:outline-none cursor-pointer pr-2"
                    aria-label="Filter region"
                  >
                    <option value="" className="text-slate-900">All Regions</option>
                    {GHANA_REGIONS.map((r) => (
                      <option key={r.id} value={r.name} className="text-slate-900">
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Search Action Button */}
                <button
                  type="submit"
                  id="hero-search-action-btn"
                  className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-bold px-6 py-3 rounded-xl sm:rounded-full transition-all shrink-0 shadow-md shadow-blue-600/30 cursor-pointer"
                >
                  <span>Search</span>
                </button>
              </form>

              {/* Autocomplete Dropdown */}
              {isFocused && matchedBusinesses.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 text-slate-900">
                  <div className="p-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider px-4 border-b border-slate-100">
                    Suggested Ghanaian Businesses
                  </div>
                  {matchedBusinesses.map((biz) => (
                    <button
                      key={biz.id}
                      type="button"
                      onClick={() => {
                        onSelectBusiness(biz);
                        setIsFocused(false);
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-blue-50 flex items-center justify-between transition-colors text-xs font-semibold"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
                        <span className="truncate text-slate-800">{biz.name}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 shrink-0 ml-2">{biz.city}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Popular Searches Row matching Image 1 */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 pt-1">
              <span className="font-semibold text-slate-300">Popular searches:</span>
              {popularSearches.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleQuickTagClick(tag)}
                  className="px-3 py-1 rounded-full bg-slate-800/80 hover:bg-blue-600 hover:text-white text-slate-300 font-medium transition-all text-xs border border-slate-700 cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Proudly Ghanaian Stats Card matching Image 1 */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-md rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl">
              
              {/* Card Header */}
              <div className="space-y-2 border-b border-slate-800 pb-5">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🇬🇭</span>
                  <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                    Proudly Ghanaian
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Empowering local businesses. Connecting communities. Growing together.
                </p>
              </div>

              {/* 4 Stats Grid matching Image 1 */}
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                
                {/* Metric 1 */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-950/80 border border-blue-800/60 text-blue-400 flex items-center justify-center shrink-0">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-base sm:text-lg font-black text-white">10K+</div>
                    <div className="text-[11px] text-slate-400 font-medium">Verified Businesses</div>
                  </div>
                </div>

                {/* Metric 2 */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-950/80 border border-blue-800/60 text-cyan-400 flex items-center justify-center shrink-0">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-base sm:text-lg font-black text-white">16</div>
                    <div className="text-[11px] text-slate-400 font-medium">Regions Covered</div>
                  </div>
                </div>

                {/* Metric 3 */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-950/80 border border-blue-800/60 text-emerald-400 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-base sm:text-lg font-black text-white">50+</div>
                    <div className="text-[11px] text-slate-400 font-medium">Business Categories</div>
                  </div>
                </div>

                {/* Metric 4 */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-950/80 border border-blue-800/60 text-amber-400 flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-base sm:text-lg font-black text-white">100K+</div>
                    <div className="text-[11px] text-slate-400 font-medium">Active Users</div>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
