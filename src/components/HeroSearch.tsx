import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  MapPin, 
  ArrowRight,
  ChevronDown,
  Building2
} from 'lucide-react';
import { Business, Category, FilterState } from '../types';
import { GHANA_REGIONS } from '../utils/geolocationService';

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
    <div className="relative w-full bg-gradient-to-b from-[#0a183d] via-[#0d2254] to-[#081534] text-white border-b border-blue-950/80 overflow-hidden">
      {/* Ambient royal blue and indigo background glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#155DFC]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[450px] h-[450px] bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Typography, Search Bar, Popular Tags */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">

            {/* Main Headline */}
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-white">
                Discover more.<br />
                <span className="text-[#3b82f6] dark:text-[#60a5fa]">Get discovered.</span>
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-blue-100/90 max-w-xl font-normal leading-relaxed">
              Find verified businesses, vetted service providers, and authentic suppliers across all 16 regions of Ghana.
            </p>

            {/* Integrated Search Bar with clean Blue & White Branding */}
            <div ref={searchContainerRef} className="relative z-30 max-w-2xl pt-1">
              <form
                onSubmit={handleSearchSubmit}
                className="bg-white dark:bg-[#0c1c42] rounded-2xl sm:rounded-full p-1.5 sm:p-2 shadow-2xl flex flex-col sm:flex-row items-stretch sm:items-center gap-2 border border-blue-200/50 dark:border-blue-800/60 focus-within:border-[#155DFC] focus-within:ring-2 focus-within:ring-blue-500/20 transition-all"
              >
                {/* Search Text Input */}
                <div className="flex-1 flex items-center gap-2.5 px-3.5 py-2 min-w-0">
                  <Search className="w-4 h-4 text-slate-400 dark:text-blue-300 shrink-0" />
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
                    className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-blue-200/60 focus:outline-hidden"
                  />
                  {inputValue && (
                    <button
                      type="button"
                      onClick={() => {
                        setInputValue('');
                        onFilterChange({ searchQuery: '' });
                      }}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs p-1"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="hidden sm:block w-px h-6 bg-slate-200 dark:bg-blue-800/80" />

                {/* Region Dropdown */}
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-blue-950/60 sm:bg-transparent rounded-xl sm:rounded-none">
                  <MapPin className="w-4 h-4 text-[#155DFC] dark:text-blue-400 shrink-0" />
                  <select
                    id="hero-region-select"
                    value={selectedRegion}
                    onChange={(e) => {
                      setSelectedRegion(e.target.value);
                      onFilterChange({ region: e.target.value === 'All Regions' ? '' : e.target.value });
                    }}
                    className="bg-transparent text-xs sm:text-sm text-slate-800 dark:text-white font-medium focus:outline-hidden cursor-pointer"
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
                  className="px-6 py-2.5 rounded-xl sm:rounded-full bg-[#155DFC] hover:bg-blue-700 text-white text-sm font-bold shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Search</span>
                </button>
              </form>

              {/* Autocomplete Dropdown */}
              {isFocused && trimmed && matchedBusinesses.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#0c1c42] border border-blue-200 dark:border-blue-800/80 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in duration-100">
                  <div className="p-2 space-y-1">
                    <div className="text-[11px] font-bold text-slate-500 dark:text-blue-300 uppercase tracking-wider px-3 py-1.5">
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
                        className="w-full px-3 py-2 rounded-xl flex items-center justify-between hover:bg-blue-50 dark:hover:bg-blue-900/50 transition-colors text-left"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={biz.logo || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=100&q=80'}
                            alt={biz.name}
                            className="w-8 h-8 rounded-lg object-cover"
                          />
                          <div>
                            <div className="text-xs font-bold text-slate-900 dark:text-white">{biz.name}</div>
                            <div className="text-[11px] text-slate-500 dark:text-blue-200">{biz.city}, {biz.region} • {biz.category}</div>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-[#155DFC]" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Popular Searches Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="text-blue-200/80 font-medium">Popular searches:</span>
              <button
                type="button"
                onClick={() => handleQuickTagClick('Restaurants')}
                className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 font-medium backdrop-blur-xs transition-all cursor-pointer"
              >
                Restaurants
              </button>
              <button
                type="button"
                onClick={() => handleQuickTagClick('Building Materials')}
                className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 font-medium backdrop-blur-xs transition-all cursor-pointer"
              >
                Building Materials
              </button>
              <button
                type="button"
                onClick={() => handleQuickTagClick('Fashion')}
                className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 font-medium backdrop-blur-xs transition-all cursor-pointer"
              >
                Fashion
              </button>
              <button
                type="button"
                onClick={() => handleQuickTagClick('Automotive')}
                className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 font-medium backdrop-blur-xs transition-all cursor-pointer"
              >
                Automotive
              </button>

              <div className="relative inline-block">
                <button
                  type="button"
                  onClick={() => setShowMorePills(!showMorePills)}
                  className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-blue-200 border border-white/20 font-medium backdrop-blur-xs transition-all inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>More</span>
                  <ChevronDown className="w-3 h-3" />
                </button>

                {showMorePills && (
                  <div className="absolute left-0 mt-1.5 w-44 bg-white dark:bg-[#0c1c42] border border-blue-200 dark:border-blue-800 rounded-xl shadow-xl p-1.5 z-40 space-y-1">
                    {['Technology', 'Real Estate', 'Healthcare', 'Legal Services'].map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => {
                          handleQuickTagClick(item);
                          setShowMorePills(false);
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-slate-800 dark:text-white hover:bg-blue-50 dark:hover:bg-blue-900/40 transition-colors cursor-pointer"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Right Column: Clean, seamless Ghanaian Business Showcase without grey ash card container */}
          <div className="lg:col-span-5 relative">
            <div className="space-y-4">
              
              {/* Top Showcase Header directly on the canvas */}
              <div className="flex items-center justify-between pb-3 border-b border-white/15 dark:border-blue-900/60">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-200 flex items-center justify-center font-bold text-xs border border-blue-400/30">
                    🇬🇭
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Featured Enterprise Hub</h3>
                    <p className="text-[11px] text-blue-200/80">Vetted & Licensed Ghanaian Providers</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-200 text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] animate-pulse" />
                  Live Verified
                </span>
              </div>

              {/* Dynamic Showcase for Verified Businesses */}
              {(() => {
                const featuredBiz = businesses.find((b) => b.verificationStatus === 'verified' && b.listingStatus === 'active') || businesses.find((b) => b.listingStatus === 'active' && b.verificationStatus !== 'rejected');
                if (!featuredBiz) {
                  return (
                    <div className="py-10 px-4 rounded-2xl bg-white/5 border border-dashed border-white/20 flex flex-col items-center justify-center text-center space-y-2.5">
                      <div className="w-11 h-11 rounded-2xl bg-blue-500/20 text-blue-300 flex items-center justify-center">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs sm:text-sm font-bold text-white">
                          Verified Enterprises
                        </h4>
                        <p className="text-[11px] text-blue-200/80 max-w-xs mx-auto">
                          Verified businesses approved by AuraCentra moderators appear here live.
                        </p>
                      </div>
                    </div>
                  );
                }

                return (
                  <div 
                    onClick={() => onSelectBusiness(featuredBiz)}
                    className="p-4 rounded-2xl bg-white/10 dark:bg-white/5 border border-white/20 dark:border-blue-800/40 hover:border-white/40 hover:bg-white/15 backdrop-blur-md transition-all cursor-pointer group space-y-3 shadow-xl"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-white/20 relative shadow-md">
                        <img 
                          src={featuredBiz.coverImage || featuredBiz.logo || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=200&q=80'} 
                          alt={featuredBiz.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors truncate">
                            {featuredBiz.name}
                          </h4>
                          {featuredBiz.verificationStatus === 'verified' && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-[#155DFC] text-white">
                              VERIFIED
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-blue-100/90 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-[#38bdf8] shrink-0" />
                          <span className="truncate">{featuredBiz.city}, {featuredBiz.region}</span>
                          <span>•</span>
                          <span className="text-blue-200 font-semibold">{featuredBiz.category}</span>
                        </div>
                        <div className="text-xs text-amber-300 font-bold flex items-center gap-1 mt-1">
                          ★ {featuredBiz.rating.toFixed(1)} <span className="text-blue-200/70 font-normal">({featuredBiz.reviewCount} reviews)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Bottom Quick Summary Bar */}
              <div className="pt-2 flex items-center justify-between text-xs text-blue-200/80 border-t border-white/15 dark:border-blue-900/60">
                <span className="flex items-center gap-1">
                  <span className="text-white font-bold">16</span> Ghana Regions
                </span>
                <span className="text-blue-300/40">•</span>
                <span className="flex items-center gap-1">
                  <span className="text-emerald-400 font-bold">100%</span> Vetted Contacts
                </span>
                <span className="text-blue-300/40">•</span>
                <button
                  type="button"
                  onClick={() => {
                    const directoryEl = document.getElementById('discover-businesses-section') || document.getElementById('main-directory-section');
                    directoryEl?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-white hover:text-blue-300 font-bold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>Explore</span>
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
