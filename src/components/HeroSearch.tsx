import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  MapPin, 
  ArrowRight,
  ChevronDown,
  Building2,
  ShieldCheck,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { Business, Category, FilterState } from '../types';
import { GHANA_REGIONS } from '../utils/geolocationService';
import { isDeletedBusiness, isBusinessPermanentlyApproved } from '../utils/storage';

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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Typography, Search Bar, Popular Tags, Platform Highlights */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">

            {/* Official Nationwide Directory Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800/80 text-blue-800 dark:text-blue-300 text-xs font-bold w-fit shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-[#155DFC] dark:text-[#38BDF8] shrink-0" />
              <span>Ghana's Official Verified Directory</span>
              <span className="text-blue-300 dark:text-blue-700">•</span>
              <span className="text-blue-700 dark:text-blue-300 font-semibold">All 16 Regions</span>
            </div>

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

          {/* Right Column: Clean Ghanaian Business Showcase on plain background */}
          <div className="lg:col-span-5 relative">
            <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              
              {/* Top Showcase Header */}
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white flex items-center justify-center font-bold text-sm border border-slate-200 dark:border-slate-700">
                    🇬🇭
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">Featured Enterprise Hub</h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Vetted & Licensed Ghanaian Providers</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-[10px] font-black">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Live Verified
                </span>
              </div>

              {/* Dynamic Showcase for Verified Businesses */}
              {(() => {
                const featuredBiz = 
                  businesses.find((b) => !isDeletedBusiness(b) && (isBusinessPermanentlyApproved(b.id) || b.isApproved === true) && b.listingStatus === 'active') ||
                  businesses.find((b) => !isDeletedBusiness(b) && b.verificationStatus === 'verified' && b.listingStatus === 'active');
                if (!featuredBiz) {
                  return (
                    <div className="py-10 px-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-center space-y-2.5">
                      <div className="w-11 h-11 rounded-2xl bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                          Verified Enterprises
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                          Verified businesses approved by administrators will be highlighted here.
                        </p>
                      </div>
                    </div>
                  );
                }

                return (
                  <div 
                    onClick={() => onSelectBusiness(featuredBiz)}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer group space-y-3 shadow-xs hover:border-[#155DFC] dark:hover:border-blue-500"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-white dark:bg-slate-900 shrink-0 border border-slate-200 dark:border-slate-700 relative p-1 z-10">
                        <img 
                          src={featuredBiz.logo || featuredBiz.coverImage || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=200&q=80'} 
                          alt={featuredBiz.name}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-[#155DFC] dark:group-hover:text-[#38BDF8] transition-colors truncate">
                            {featuredBiz.name}
                          </h4>
                          {featuredBiz.verificationStatus === 'verified' && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-[#155DFC] text-white">
                              VERIFIED
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-[#155DFC] dark:text-[#38BDF8] shrink-0" />
                          <span className="truncate">{featuredBiz.city}, {featuredBiz.region}</span>
                          <span>•</span>
                          <span className="text-slate-700 dark:text-slate-300 font-semibold">{featuredBiz.category}</span>
                        </div>
                        <div className="text-xs font-bold flex items-center gap-1 mt-1">
                          {featuredBiz.reviewCount > 0 && featuredBiz.rating > 0 ? (
                            <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
                              ★ {featuredBiz.rating.toFixed(1)} <span className="text-slate-500 font-normal">({featuredBiz.reviewCount} {featuredBiz.reviewCount === 1 ? 'review' : 'reviews'})</span>
                            </span>
                          ) : (
                            <span className="text-slate-500 font-normal">
                              ★ Unrated (0 reviews)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Bottom Quick Summary Bar */}
              <div className="pt-2 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
                <span className="flex items-center gap-1">
                  <span className="text-slate-900 dark:text-white font-bold">16</span> Ghana Regions
                </span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="flex items-center gap-1">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">100%</span> Vetted Contacts
                </span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <button
                  type="button"
                  onClick={() => {
                    const directoryEl = document.getElementById('discover-businesses-section') || document.getElementById('main-directory-section');
                    directoryEl?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-[#155DFC] dark:text-[#38BDF8] hover:underline font-bold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>Explore All</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
