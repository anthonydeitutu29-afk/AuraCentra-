import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  MapPin, 
  Sparkles, 
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
            b.name.toLowerCase().includes(trimmed) ||
            b.services?.some((s) => s.toLowerCase().includes(trimmed)) ||
            b.city.toLowerCase().includes(trimmed)
        )
        .slice(0, 4)
    : [];

  return (
    <div className="relative w-full bg-[#070b14] text-white border-b border-slate-800/80 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[450px] h-[450px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Badge, Typography, Search Bar, Popular Tags */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>GHANA&apos;S BUSINESS GROWTH NETWORK</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-white">
                Discover more.<br />
                <span className="text-[#155DFC]">Get discovered.</span>
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-300 max-w-xl font-normal leading-relaxed">
              Find verified businesses, vetted service providers, and authentic suppliers across all 16 regions of Ghana.
            </p>

            {/* Integrated Search Bar matching exact visual layout */}
            <div ref={searchContainerRef} className="relative z-30 max-w-2xl pt-1">
              <form
                onSubmit={handleSearchSubmit}
                className="bg-[#101726] rounded-2xl sm:rounded-full p-1.5 sm:p-2 shadow-2xl flex flex-col sm:flex-row items-stretch sm:items-center gap-2 border border-slate-700/80 focus-within:border-blue-500 transition-colors"
              >
                {/* Search Text Input */}
                <div className="flex-1 flex items-center gap-2.5 px-3.5 py-2 min-w-0">
                  <Search className="w-4 h-4 text-slate-400 shrink-0" />
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
                    className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-hidden"
                  />
                  {inputValue && (
                    <button
                      type="button"
                      onClick={() => {
                        setInputValue('');
                        onFilterChange({ searchQuery: '' });
                      }}
                      className="text-slate-400 hover:text-white text-xs p-1"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="hidden sm:block w-px h-6 bg-slate-700" />

                {/* Region Dropdown */}
                <div className="flex items-center gap-2 px-3 py-2 bg-[#172033] sm:bg-transparent rounded-xl sm:rounded-none">
                  <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                  <select
                    id="hero-region-select"
                    value={selectedRegion}
                    onChange={(e) => {
                      setSelectedRegion(e.target.value);
                      onFilterChange({ region: e.target.value === 'All Regions' ? '' : e.target.value });
                    }}
                    className="bg-transparent text-xs sm:text-sm text-slate-200 font-medium focus:outline-hidden cursor-pointer"
                  >
                    <option value="" className="bg-slate-900 text-white">All Regions</option>
                    {GHANA_REGIONS.map((reg) => (
                      <option key={reg.name} value={reg.name} className="bg-slate-900 text-white">
                        {reg.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Blue Search Button */}
                <button
                  type="submit"
                  id="hero-submit-search-btn"
                  className="px-6 py-2.5 rounded-xl sm:rounded-full bg-[#155DFC] hover:bg-blue-600 text-white text-sm font-bold shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Search</span>
                </button>
              </form>

              {/* Autocomplete Dropdown */}
              {isFocused && trimmed && matchedBusinesses.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#101726] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in duration-100">
                  <div className="p-2 space-y-1">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1.5">
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
                        className="w-full px-3 py-2 rounded-xl flex items-center justify-between hover:bg-slate-800 transition-colors text-left"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={biz.logo || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=100&q=80'}
                            alt={biz.name}
                            className="w-8 h-8 rounded-lg object-cover"
                          />
                          <div>
                            <div className="text-xs font-bold text-white">{biz.name}</div>
                            <div className="text-[11px] text-slate-400">{biz.city}, {biz.region} • {biz.category}</div>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Popular Searches Pills matching screenshot */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="text-slate-400 font-medium">Popular searches:</span>
              <button
                type="button"
                onClick={() => handleQuickTagClick('Restaurants')}
                className="px-3 py-1 rounded-full bg-[#131d31] hover:bg-[#1a2844] text-slate-200 border border-slate-700/80 font-medium transition-all"
              >
                Restaurants
              </button>
              <button
                type="button"
                onClick={() => handleQuickTagClick('Building Materials')}
                className="px-3 py-1 rounded-full bg-[#131d31] hover:bg-[#1a2844] text-slate-200 border border-slate-700/80 font-medium transition-all"
              >
                Building Materials
              </button>
              <button
                type="button"
                onClick={() => handleQuickTagClick('Fashion')}
                className="px-3 py-1 rounded-full bg-[#131d31] hover:bg-[#1a2844] text-slate-200 border border-slate-700/80 font-medium transition-all"
              >
                Fashion
              </button>
              <button
                type="button"
                onClick={() => handleQuickTagClick('Automotive')}
                className="px-3 py-1 rounded-full bg-[#131d31] hover:bg-[#1a2844] text-slate-200 border border-slate-700/80 font-medium transition-all"
              >
                Automotive
              </button>

              <div className="relative inline-block">
                <button
                  type="button"
                  onClick={() => setShowMorePills(!showMorePills)}
                  className="px-2.5 py-1 rounded-full bg-[#131d31] hover:bg-[#1a2844] text-blue-400 border border-slate-700/80 font-medium transition-all inline-flex items-center gap-1"
                >
                  <span>More</span>
                  <ChevronDown className="w-3 h-3" />
                </button>

                {showMorePills && (
                  <div className="absolute left-0 mt-1.5 w-44 bg-[#101726] border border-slate-700 rounded-xl shadow-xl p-1.5 z-40 space-y-1">
                    {['Technology', 'Real Estate', 'Healthcare', 'Legal Services'].map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => {
                          handleQuickTagClick(item);
                          setShowMorePills(false);
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-slate-200 hover:bg-slate-800 transition-colors"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Right Column: Natural, Premium, Human-Made Ghanaian Business Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl bg-[#0f172a]/95 border border-slate-700/80 p-5 sm:p-6 shadow-2xl space-y-4">
              
              {/* Top Showcase Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-xs">
                    🇬🇭
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Featured Enterprise Hub</h3>
                    <p className="text-[11px] text-slate-400">Vetted & Licensed Ghanaian Providers</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Verified
                </span>
              </div>

              {/* Empty Sector for Verified Businesses */}
              <div className="py-10 px-4 rounded-2xl bg-[#172033]/40 border border-dashed border-slate-700/80 flex flex-col items-center justify-center text-center space-y-2.5">
                <div className="w-11 h-11 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs sm:text-sm font-bold text-white">
                    Featured Sector Empty
                  </h4>
                  <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                    Verified businesses approved by AuraCentra moderators will appear in this sector.
                  </p>
                </div>
              </div>

              {/* Bottom Quick Summary Bar */}
              <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800">
                <span className="flex items-center gap-1">
                  <span className="text-blue-400 font-bold">16</span> Ghana Regions
                </span>
                <span className="text-slate-600">•</span>
                <span className="flex items-center gap-1">
                  <span className="text-emerald-400 font-bold">100%</span> Vetted Direct Contacts
                </span>
                <span className="text-slate-600">•</span>
                <button
                  type="button"
                  onClick={() => {
                    const directoryEl = document.getElementById('discover-businesses-section') || document.getElementById('main-directory-section');
                    directoryEl?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-blue-400 hover:text-white font-semibold flex items-center gap-1 cursor-pointer"
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
