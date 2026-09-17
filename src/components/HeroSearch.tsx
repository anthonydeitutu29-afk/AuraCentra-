import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  MapPin, 
  ArrowRight,
  ChevronDown,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { Business, Category, FilterState } from '../types';
import { GHANA_REGIONS } from '../utils/geolocationService';
import { isDeletedBusiness } from '../utils/storage';

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
  onOpenSectors?: () => void;
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
  onOpenSectors,
}) => {
  const [inputValue, setInputValue] = useState(filters.searchQuery);
  const [selectedRegion, setSelectedRegion] = useState(filters.region || '');
  const [isFocused, setIsFocused] = useState(false);
  const [showMorePills, setShowMorePills] = useState(false);
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

  // Autocomplete matches
  const trimmed = inputValue.trim().toLowerCase();
  const matchedBusinesses = trimmed
    ? businesses
        .filter(
          (b) =>
            b.listingStatus === 'active' &&
            b.verificationStatus !== 'rejected' &&
            (b.name.toLowerCase().includes(trimmed) ||
              b.services?.some((s) => s.toLowerCase().includes(trimmed)) ||
              b.city.toLowerCase().includes(trimmed))
        )
        .slice(0, 4)
    : [];

  return (
    <div className="relative w-full bg-white dark:bg-slate-950 text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 transition-colors" id="hero-search-section">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="max-w-3xl space-y-5 sm:space-y-6">

          {/* Main Headline - High contrast on plain background */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.12] text-slate-950 dark:text-white">
              Discover more.<br />
              <span className="text-[#155DFC] dark:text-[#38BDF8]">Get discovered.</span>
            </h1>
          </div>

          {/* Subtitle - Sharp & readable */}
          <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 max-w-xl font-medium leading-relaxed">
            Find verified businesses, vetted service providers, and authentic suppliers across all 16 regions of Ghana.
          </p>

          {/* Integrated Search Bar with clean High-Contrast Borders */}
          <div ref={searchContainerRef} className="relative z-30 max-w-2xl pt-1">
            <form
              onSubmit={handleSearchSubmit}
                className="bg-white dark:bg-slate-900 rounded-2xl p-2 sm:p-2.5 shadow-md flex flex-col sm:flex-row items-stretch sm:items-center gap-2 border border-slate-300 dark:border-slate-700 focus-within:border-[#155DFC] dark:focus-within:border-[#38BDF8] transition-all"
              >
                {/* Search Text Input */}
                <div className="flex-1 flex items-center gap-2.5 px-3 py-2 min-w-0">
                  <Search className="w-4 h-4 text-slate-500 dark:text-blue-400 shrink-0" />
                  <input
                    type="text"
                    id="hero-main-search-input"
                    value={inputValue}
                    onChange={(e) => {
                      setInputValue(e.target.value);
                      setIsFocused(true);
                    }}
                    onFocus={() => setIsFocused(true)}
                    placeholder="Search businesses, services or locations"
                    className="w-full bg-transparent text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder-slate-400 focus:outline-hidden"
                  />
                  {inputValue && (
                    <button
                      type="button"
                      onClick={() => {
                        setInputValue('');
                        onFilterChange({ searchQuery: '' });
                      }}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs p-1 cursor-pointer"
                      title="Clear search input"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="hidden sm:block w-px h-7 bg-slate-200 dark:bg-slate-700" />

                {/* Region Dropdown */}
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800/80 sm:bg-transparent rounded-xl sm:rounded-none border border-slate-200 dark:border-slate-700 sm:border-0">
                  <MapPin className="w-4 h-4 text-[#155DFC] dark:text-[#38BDF8] shrink-0" />
                  <select
                    id="hero-region-select"
                    value={selectedRegion}
                    onChange={(e) => {
                      setSelectedRegion(e.target.value);
                      onFilterChange({ region: e.target.value === 'All Regions' ? '' : e.target.value });
                    }}
                    className="bg-transparent text-xs sm:text-sm font-bold text-slate-800 dark:text-white focus:outline-hidden cursor-pointer"
                  >
                    <option value="" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">All Regions</option>
                    {GHANA_REGIONS.map((reg) => (
                      <option key={reg.name} value={reg.name} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                        {reg.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Blue Search Button */}
                <button
                  type="submit"
                  id="hero-submit-search-btn"
                  className="px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-full bg-[#155DFC] hover:bg-blue-700 active:scale-[0.98] text-white text-sm font-black shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Search className="w-4 h-4 shrink-0" />
                  <span>Search</span>
                </button>
              </form>

              {/* Autocomplete Dropdown */}
              {isFocused && trimmed && matchedBusinesses.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl overflow-hidden z-50 animate-in fade-in duration-100">
                  <div className="p-2 space-y-1">
                    <div className="text-[11px] font-bold text-slate-600 dark:text-cyan-300 uppercase tracking-wider px-3 py-1.5">
                      Matching Verified Businesses
                    </div>
                    {matchedBusinesses.map((biz) => (
                      <button
                        key={biz.id}
                        type="button"
                        onClick={() => {
                          onSelectBusiness(biz);
                          setIsFocused(false);
                        }}
                        className="w-full px-3 py-2 rounded-xl flex items-center justify-between hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors text-left cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={biz.logo || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=100&q=80'}
                            alt={biz.name}
                            className="w-8 h-8 rounded-lg object-cover"
                          />
                          <div>
                            <div className="text-xs font-bold text-slate-900 dark:text-white">{biz.name}</div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400">{biz.city}, {biz.region} • {biz.category}</div>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-[#155DFC] dark:text-[#38BDF8]" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Popular Searches Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="text-slate-700 dark:text-slate-300 font-bold">Popular searches:</span>
              {['Restaurants', 'Building Materials', 'Fashion', 'Automotive'].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleQuickTagClick(item)}
                  className="px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-semibold transition-all cursor-pointer shadow-2xs"
                >
                  {item}
                </button>
              ))}

              <div className="relative inline-block">
                <button
                  type="button"
                  onClick={() => setShowMorePills(!showMorePills)}
                  className="px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-semibold transition-all inline-flex items-center gap-1 cursor-pointer shadow-2xs"
                >
                  <span>More</span>
                  <ChevronDown className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                </button>

                {showMorePills && (
                  <div className="absolute left-0 mt-1.5 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl p-1.5 z-40 space-y-1">
                    {['Technology', 'Real Estate', 'Healthcare', 'Legal Services', 'Digital Marketing', 'Agriculture', 'Hospitality'].map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => {
                          handleQuickTagClick(item);
                          setShowMorePills(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Value Guarantees Row */}
            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-bold text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/80 px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>100% Verified Listings</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/80 px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-[#155DFC] dark:text-[#38BDF8] shrink-0" />
                <span>Direct WhatsApp & Call</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/80 px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>Zero Broker Fees</span>
              </div>
            </div>

        </div>
      </div>
    </div>
  );
};
