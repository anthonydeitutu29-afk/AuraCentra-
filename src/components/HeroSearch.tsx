import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Sparkles, 
  Clock, 
  X, 
  ArrowRight,
  TrendingUp,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { Business, Category, FilterState } from '../types';

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
}) => {
  const [inputValue, setInputValue] = useState(filters.searchQuery);
  const [isFocused, setIsFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Sync input value with external filters
  useEffect(() => {
    setInputValue(filters.searchQuery);
  }, [filters.searchQuery]);

  // Click outside listener to dismiss autocomplete suggestions
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
            b.city.toLowerCase().includes(trimmed)
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
    <div className="relative w-full bg-gradient-to-b from-blue-50/90 via-white to-blue-50/30 dark:from-slate-900 dark:via-slate-950 dark:to-slate-950 border-b border-blue-100/80 dark:border-blue-950 py-6 sm:py-12 px-3 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Main Headline */}
        <div className="text-center mb-4 sm:mb-7">
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

          {/* Quick Popular Tap Filters for Mobile */}
          <div className="mt-3 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 px-0.5 text-[11px] sm:text-xs">
            <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-blue-600 dark:text-cyan-400" />
              <span className="hidden sm:inline">Popular:</span>
            </span>
            {['Accra', 'Kumasi', 'Technology', 'Healthcare', 'Restaurants', 'Verified Only'].map((tag) => {
              const isVerifiedTag = tag === 'Verified Only';
              const isSelected = isVerifiedTag ? filters.verificationOnly : (filters.city === tag || filters.searchQuery === tag);

              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    if (isVerifiedTag) {
                      onFilterChange({ verificationOnly: !filters.verificationOnly });
                    } else if (tag === 'Accra' || tag === 'Kumasi') {
                      onFilterChange({ city: filters.city === tag ? '' : tag });
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
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-blue-50/70 dark:hover:bg-slate-800/80 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={b.logo}
                            alt={b.name}
                            className="w-8 h-8 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                          />
                          <div>
                            <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 flex items-center gap-1.5">
                              <span>{b.name}</span>
                              {b.verificationStatus === 'verified' && (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 fill-emerald-50 shrink-0" />
                              )}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                              {b.city} • {b.category}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs text-blue-600 dark:text-cyan-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                          View →
                        </span>
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
                  <div className="flex flex-wrap gap-2 px-1">
                    {matchedCategories.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          onFilterChange({ category: c.id, searchQuery: '' });
                          setIsFocused(false);
                        }}
                        className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-slate-800 text-blue-700 dark:text-slate-300 hover:bg-blue-100 transition-colors"
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Search History */}
              {searchHistory.length > 0 && (
                <div className="p-3 bg-slate-50/70 dark:bg-slate-900/90">
                  <div className="flex items-center justify-between px-2 mb-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Recent Searches</span>
                    </span>
                    <button
                      type="button"
                      onClick={onClearSearchHistory}
                      className="text-xs text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 font-bold"
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
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-blue-400 hover:text-blue-600 transition-all"
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
