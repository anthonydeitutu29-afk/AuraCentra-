import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Sparkles, 
  Clock, 
  X, 
  ArrowRight, 
  TrendingUp, 
  RotateCcw, 
  CheckCircle2, 
  MapPin, 
  Navigation, 
  Loader2,
  Globe2,
  ChevronDown
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
  onClearSearchHistory,
  onSelectBusiness,
  onShowToast,
  isAutoDetectedRegion = false,
}) => {
  const [inputValue, setInputValue] = useState(filters.searchQuery);
  const [isFocused, setIsFocused] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Near me geolocation handler
  const handleFindNearMe = () => {
    if (filters.sortBy === 'nearest' && filters.userLat) {
      onFilterChange({
        sortBy: 'featured',
        userLat: undefined,
        userLng: undefined,
      });
      if (onShowToast) {
        onShowToast('Proximity Sort Cleared', 'Showing standard business ranking.', 'info');
      }
      return;
    }

    setIsLocating(true);

    if (!navigator.geolocation) {
      onFilterChange({
        userLat: 5.6037,
        userLng: -0.1870,
        region: 'Greater Accra',
        sortBy: 'nearest',
      });
      setIsLocating(false);
      if (onShowToast) {
        onShowToast('Geolocation Not Supported', 'Defaulted to Central Accra (Greater Accra) proximity.', 'warning');
      }
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const closest = getClosestGhanaRegion(latitude, longitude);
        
        onFilterChange({
          userLat: latitude,
          userLng: longitude,
          region: closest.region.name,
          sortBy: 'nearest',
        });
        setIsLocating(false);
        if (onShowToast) {
          onShowToast(
            'Proximity & Region Activated!',
            `Location pinpointed to ${closest.region.name} (${latitude.toFixed(3)}, ${longitude.toFixed(3)}). Sorting closest businesses.`,
            'success'
          );
        }
      },
      (error) => {
        console.warn('Geolocation error:', error);
        onFilterChange({
          userLat: 5.6037,
          userLng: -0.1870,
          region: 'Greater Accra',
          sortBy: 'nearest',
        });
        setIsLocating(false);
        if (onShowToast) {
          onShowToast(
            'Location Access Fallback',
            'Using Accra Central commercial coordinates to sort nearest businesses.',
            'info'
          );
        }
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  useEffect(() => {
    setInputValue(filters.searchQuery);
  }, [filters.searchQuery]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute live autocomplete suggestions
  const trimmed = inputValue.trim().toLowerCase();
  const matchedBusinesses = trimmed
    ? businesses
        .filter(
          (b) =>
            b.name.toLowerCase().includes(trimmed) ||
            b.services.some((s) => s.toLowerCase().includes(trimmed)) ||
            b.city.toLowerCase().includes(trimmed) ||
            (b.region && b.region.toLowerCase().includes(trimmed))
        )
        .slice(0, 5)
    : [];

  const matchedCategories = trimmed
    ? categories
        .filter((c) => c.name.toLowerCase().includes(trimmed))
        .slice(0, 3)
    : [];

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (inputValue.trim()) {
      onAddSearchHistory(inputValue.trim());
    }
    onFilterChange({ searchQuery: inputValue });
    setIsFocused(false);
  };

  const handleSelectHistoryItem = (term: string) => {
    setInputValue(term);
    onFilterChange({ searchQuery: term });
    setIsFocused(false);
  };

  return (
    <div className="relative w-full bg-gradient-to-b from-blue-50/90 via-white to-blue-50/30 dark:from-slate-900 dark:via-slate-950 dark:to-slate-950 border-b border-blue-100/80 dark:border-blue-950 py-6 sm:py-10 px-3 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Main Headline */}
        <div className="text-center mb-4 sm:mb-6">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-blue-100/80 dark:bg-blue-950/80 text-blue-800 dark:text-cyan-300 text-[11px] sm:text-xs font-bold mb-2.5 sm:mb-3 border border-blue-200/80 dark:border-blue-800/80 shadow-xs">
            <Sparkles className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-blue-600 dark:text-cyan-400" />
            <span>Official Ghana Business Discovery Platform</span>
          </div>
          
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Find Businesses. Discover Opportunities.{' '}
            <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-500 bg-clip-text text-transparent">
              Grow Together.
            </span>
          </h1>
          
          <p className="mt-2 text-xs sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
            A digital platform where businesses enlist and customers get access to what they need, <strong className="text-blue-600 dark:text-cyan-400">without stress</strong>.
          </p>
        </div>

        {/* Focused Search Bar */}
        <div ref={searchContainerRef} className="relative z-30 max-w-3xl mx-auto">
          <form
            onSubmit={handleSearchSubmit}
            className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-full shadow-lg shadow-blue-600/5 hover:shadow-xl hover:shadow-blue-600/10 border border-blue-200 dark:border-blue-900/60 p-1.5 sm:p-2.5 transition-all focus-within:ring-2 focus-within:ring-blue-500/40 focus-within:border-blue-500"
          >
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Keyword Search Input */}
              <div className="flex-1 flex items-center gap-2 px-2.5 sm:px-3 py-1 sm:py-2 min-w-0">
                <Search className="w-4 sm:w-5 h-4 sm:h-5 text-blue-600 dark:text-cyan-400 shrink-0" />
                <input
                  type="text"
                  id="main-search-input"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  placeholder="Search businesses, services, or locations..."
                  className="w-full bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs sm:text-base font-medium focus:outline-none min-w-0"
                  autoComplete="off"
                />
                {inputValue && (
                  <button
                    type="button"
                    onClick={() => {
                      setInputValue('');
                      onFilterChange({ searchQuery: '' });
                    }}
                    className="p-1 sm:p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full shrink-0"
                    title="Clear search"
                  >
                    <X className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                  </button>
                )}
              </div>

              {/* Proximity "Near Me" Button */}
              <button
                type="button"
                id="hero-near-me-btn"
                onClick={handleFindNearMe}
                disabled={isLocating}
                className={`inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm font-bold px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-full transition-all shrink-0 cursor-pointer ${
                  filters.sortBy === 'nearest' && filters.userLat
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-400/40'
                    : 'bg-blue-50 dark:bg-slate-800 text-blue-700 dark:text-cyan-300 hover:bg-blue-100 dark:hover:bg-slate-700 border border-blue-200 dark:border-slate-700'
                }`}
                title="Find businesses near my location"
              >
                {isLocating ? (
                  <Loader2 className="w-3.5 sm:w-4 h-3.5 sm:h-4 animate-spin text-blue-600 dark:text-cyan-400" />
                ) : (
                  <MapPin className={`w-3.5 sm:w-4 h-3.5 sm:h-4 ${filters.sortBy === 'nearest' && filters.userLat ? 'fill-current' : ''}`} />
                )}
                <span className="hidden sm:inline">
                  {filters.sortBy === 'nearest' && filters.userLat ? 'Near Me (Active)' : 'Near Me'}
                </span>
              </button>

              {/* Search Trigger Button */}
              <button
                type="submit"
                id="hero-search-submit-btn"
                className="inline-flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs sm:text-sm font-bold px-3.5 sm:px-7 py-2.5 sm:py-3 rounded-xl sm:rounded-full shadow-md shadow-blue-600/25 transition-all shrink-0 cursor-pointer"
              >
                <span>Search</span>
                <ArrowRight className="w-3.5 sm:w-4 h-3.5 sm:h-4 hidden xs:inline" />
              </button>
            </div>
          </form>

          {/* Regional Auto-Detection & Quick Filter Pills */}
          <div className="mt-3 flex items-center justify-between gap-2 flex-wrap text-[11px] sm:text-xs">
            
            {/* Auto-detected / Selected Region Pill with Direct Switcher */}
            <div className="flex items-center gap-1.5 bg-white/90 dark:bg-slate-800/90 border border-blue-200 dark:border-blue-900/60 px-2.5 py-1 rounded-full shadow-xs">
              <MapPin className="w-3 h-3 text-blue-600 dark:text-cyan-400 shrink-0" />
              <span className="text-slate-500 dark:text-slate-400 font-medium">Region:</span>
              <select
                value={filters.region || ''}
                onChange={(e) => onFilterChange({ region: e.target.value, city: '' })}
                className="bg-transparent font-bold text-blue-700 dark:text-cyan-300 focus:outline-none cursor-pointer pr-1"
                aria-label="Filter by Ghana Region"
              >
                <option value="" className="text-slate-900 dark:text-white">All 16 Regions (National)</option>
                {GHANA_REGIONS.map((r) => (
                  <option key={r.id} value={r.name} className="text-slate-900 dark:text-white">
                    {r.name} ({r.capital})
                  </option>
                ))}
              </select>
              {isAutoDetectedRegion && filters.region && (
                <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-extrabold">
                  GPS Auto
                </span>
              )}
            </div>

            {/* Quick Popular Tap Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 text-[11px] sm:text-xs">
              {['Technology', 'Restaurants', 'Healthcare', 'Real Estate', 'Verified Only'].map((tag) => {
                const isVerifiedTag = tag === 'Verified Only';
                const isSelected = isVerifiedTag ? filters.verificationOnly : filters.searchQuery === tag;

                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      if (isVerifiedTag) {
                        onFilterChange({ verificationOnly: !filters.verificationOnly });
                      } else {
                        const matchedCat = categories.find((c) => c.name.toLowerCase().includes(tag.toLowerCase()));
                        if (matchedCat) {
                          onFilterChange({ category: filters.category === matchedCat.id ? '' : matchedCat.id });
                        } else {
                          onFilterChange({ searchQuery: tag });
                        }
                      }
                    }}
                    className={`shrink-0 px-2.5 py-1 rounded-full font-bold transition-all border cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-slate-200/80 dark:border-slate-700/80 hover:border-blue-400 hover:text-blue-600'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Autocomplete & Search History Dropdown */}
          {isFocused && (matchedBusinesses.length > 0 || matchedCategories.length > 0 || searchHistory.length > 0) && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-blue-100 dark:border-slate-800 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              {/* Matched Businesses */}
              {matchedBusinesses.length > 0 && (
                <div className="p-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="text-[11px] font-bold text-blue-600 dark:text-cyan-400 uppercase tracking-wider px-2 mb-1.5 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                    <span>Matching Businesses</span>
                  </div>
                  <div className="space-y-1">
                    {matchedBusinesses.map((b) => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => {
                          onSelectBusiness(b);
                          setIsFocused(false);
                        }}
                        className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-800 text-left transition-colors group cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <img
                            src={b.logo || b.coverImage}
                            alt={b.name}
                            className="w-8 h-8 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                          />
                          <div>
                            <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 flex items-center gap-1">
                              <span>{b.name}</span>
                              {b.verificationStatus === 'verified' && (
                                <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400">
                              {b.city}{b.region ? `, ${b.region}` : ''} • {b.category}
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Matched Categories */}
              {matchedCategories.length > 0 && (
                <div className="p-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5">
                    Categories
                  </div>
                  <div className="space-y-1">
                    {matchedCategories.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          onFilterChange({ category: c.id, searchQuery: '' });
                          setIsFocused(false);
                        }}
                        className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
                      >
                        <span>{c.name}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Search History */}
              {searchHistory.length > 0 && (
                <div className="p-3 bg-slate-50/70 dark:bg-slate-900/70">
                  <div className="flex items-center justify-between px-2 mb-1.5">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Recent Searches</span>
                    </span>
                    <button
                      type="button"
                      onClick={onClearSearchHistory}
                      className="text-xs text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 font-bold cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Clear history</span>
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5 px-1">
                    {searchHistory.map((item, idx) => (
                      <button
                        key={`${item}-${idx}`}
                        type="button"
                        onClick={() => handleSelectHistoryItem(item)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-blue-400 hover:text-blue-600 transition-all cursor-pointer"
                      >
                        <span>{item}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
