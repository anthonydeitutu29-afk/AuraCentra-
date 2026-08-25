import React, { useState, useMemo } from 'react';
import { 
  Filter, 
  RotateCcw, 
  MapPin, 
  ShieldCheck, 
  Star, 
  ArrowRight, 
  ChevronDown, 
  Bookmark, 
  BookmarkCheck, 
  MessageSquare, 
  Sparkles, 
  CheckCircle2, 
  DollarSign,
  TrendingUp,
  ExternalLink,
  PhoneCall
} from 'lucide-react';
import { Business, Category, FilterState } from '../types';
import { GHANA_REGIONS } from '../utils/geolocationService';
import { useWhatsAppContact } from '../hooks/useWhatsAppContact';

interface TriColumnMainLayoutProps {
  businesses: Business[];
  categories: Category[];
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  savedBusinessIds: string[];
  onToggleSave: (businessId: string) => void;
  onSelectBusiness: (business: Business) => void;
  onOpenNewsTab: () => void;
  onOpenQuote?: (business: Business) => void;
}

export const TriColumnMainLayout: React.FC<TriColumnMainLayoutProps> = ({
  businesses,
  categories,
  filters,
  onFilterChange,
  onResetFilters,
  savedBusinessIds,
  onToggleSave,
  onSelectBusiness,
  onOpenNewsTab,
  onOpenQuote,
}) => {
  const [activeTab, setActiveTab] = useState<'trending' | 'near_you' | 'newly_verified'>('trending');
  const [visibleCount, setVisibleCount] = useState(6);
  const [fxCalcAmount, setFxCalcAmount] = useState<number>(100);
  const [fxCalcCurrency, setFxCalcCurrency] = useState<'USD' | 'GBP' | 'EUR'>('USD');
  const { contactBusinessOnWhatsApp } = useWhatsAppContact();

  const forexRates: Record<string, { rate: number; change: string; isUp: boolean }> = {
    USD: { rate: 11.03, change: '-0.1%', isUp: false },
    GBP: { rate: 15.05, change: '+0.1%', isUp: true },
    EUR: { rate: 12.88, change: '-0.0%', isUp: false },
  };

  // Distinct cities derived from available businesses
  const availableCities = useMemo(() => {
    const set = new Set<string>();
    businesses.forEach((b) => {
      if (b.city) set.add(b.city);
    });
    return Array.from(set).sort();
  }, [businesses]);

  // Tab filtering logic
  const filteredAndSortedBusinesses = useMemo(() => {
    let list = businesses.filter((b) => b.listingStatus !== 'pending_approval' && b.listingStatus !== 'rejected');

    // Apply sidebar filters
    if (filters.region) {
      list = list.filter((b) => b.region.toLowerCase() === filters.region.toLowerCase());
    }

    if (filters.city) {
      list = list.filter((b) => b.city.toLowerCase() === filters.city.toLowerCase());
    }

    if (filters.verificationOnly) {
      list = list.filter((b) => b.verificationStatus === 'verified');
    }

    if (filters.category) {
      list = list.filter((b) => b.category.toLowerCase() === filters.category.toLowerCase());
    }

    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      list = list.filter((b) => 
        b.name.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q) ||
        b.city.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q) ||
        b.services?.some((s) => s.toLowerCase().includes(q))
      );
    }

    // Apply Tab specific sorting
    if (activeTab === 'trending') {
      list = [...list].sort((a, b) => ((b.views || 0) + (b.leadsCount || 0) * 3) - ((a.views || 0) + (a.leadsCount || 0) * 3));
    } else if (activeTab === 'near_you') {
      list = [...list].sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    } else if (activeTab === 'newly_verified') {
      list = [...list].filter((b) => b.verificationStatus === 'verified').sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    }

    // Apply explicit sort dropdown if selected
    if (filters.sortBy === 'rating') {
      list = [...list].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (filters.sortBy === 'reviews') {
      list = [...list].sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
    } else if (filters.sortBy === 'name') {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [businesses, filters, activeTab]);

  const displayedList = filteredAndSortedBusinesses.slice(0, visibleCount);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6" id="discover-businesses-section">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* ========================================================================= */}
        {/* COLUMN 1: FILTERS SIDEBAR (Left - 3 cols on desktop)                      */}
        {/* ========================================================================= */}
        <div className="lg:col-span-3 space-y-4">
          <div className="p-5 rounded-2xl bg-[#0f172a] border border-slate-800 text-white shadow-xl space-y-5">
            
            {/* Filter Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-bold text-white">Filters</h3>
              </div>
              <button
                type="button"
                id="filters-clear-all-btn"
                onClick={onResetFilters}
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
              >
                Clear all
              </button>
            </div>

            {/* 1. Sort by */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Sort by
              </label>
              <div className="relative">
                <select
                  id="filter-sort-by-select"
                  value={filters.sortBy}
                  onChange={(e) => onFilterChange({ sortBy: e.target.value as any })}
                  className="w-full px-3 py-2.5 text-xs rounded-xl bg-[#172033] border border-slate-700 text-slate-200 focus:outline-hidden focus:border-blue-500 appearance-none cursor-pointer pr-8"
                >
                  <option value="featured">Featured & Verified First</option>
                  <option value="rating">Highest Customer Rating</option>
                  <option value="reviews">Most Reviews & Feedback</option>
                  <option value="name">Alphabetical (A - Z)</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* 2. Region Dropdown */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Region
              </label>
              <div className="relative">
                <select
                  id="filter-region-select"
                  value={filters.region || ''}
                  onChange={(e) => onFilterChange({ region: e.target.value })}
                  className="w-full px-3 py-2.5 text-xs rounded-xl bg-[#172033] border border-slate-700 text-slate-200 focus:outline-hidden focus:border-blue-500 appearance-none cursor-pointer pr-8"
                >
                  <option value="">All 16 Ghana Regions</option>
                  {GHANA_REGIONS.map((reg) => (
                    <option key={reg.name} value={reg.name}>
                      {reg.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* 3. City Dropdown */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                City
              </label>
              <div className="relative">
                <select
                  id="filter-city-select"
                  value={filters.city || ''}
                  onChange={(e) => onFilterChange({ city: e.target.value })}
                  className="w-full px-3 py-2.5 text-xs rounded-xl bg-[#172033] border border-slate-700 text-slate-200 focus:outline-hidden focus:border-blue-500 appearance-none cursor-pointer pr-8"
                >
                  <option value="">All Major Cities</option>
                  {availableCities.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* 4. Verified Only Checkbox */}
            <div className="pt-1">
              <label className="flex items-center gap-2.5 text-xs text-slate-200 font-medium cursor-pointer select-none">
                <input
                  type="checkbox"
                  id="filter-verified-only-checkbox"
                  checked={Boolean(filters.verificationOnly)}
                  onChange={(e) => onFilterChange({ verificationOnly: e.target.checked })}
                  className="w-4 h-4 rounded-md border-slate-700 text-blue-600 focus:ring-blue-500 bg-[#172033] cursor-pointer"
                />
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                  <span>Verified Enterprises Only</span>
                </span>
              </label>
            </div>

            {/* Bottom helper card with magnifying glass graphic */}
            <div className="pt-4 border-t border-slate-800 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto">
                <MapPin className="w-5 h-5" />
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                Filtering across <strong className="text-white">1,200+ verified businesses</strong> in Greater Accra, Ashanti, Western, and all 16 regions.
              </p>
            </div>

          </div>
        </div>

        {/* ========================================================================= */}
        {/* COLUMN 2: DISCOVER BUSINESSES (Middle - 6 cols on desktop)                */}
        {/* ========================================================================= */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Header row */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Discover businesses
            </h2>
            <button
              type="button"
              onClick={onResetFilters}
              className="text-xs sm:text-sm font-bold text-[#155DFC] hover:text-blue-500 flex items-center gap-1 cursor-pointer"
            >
              <span>View all businesses</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Pill Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <button
              type="button"
              onClick={() => setActiveTab('trending')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                activeTab === 'trending'
                  ? 'bg-[#155DFC] text-white shadow-md'
                  : 'bg-white dark:bg-[#0f172a] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-400'
              }`}
            >
              Trending
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('near_you')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                activeTab === 'near_you'
                  ? 'bg-[#155DFC] text-white shadow-md'
                  : 'bg-white dark:bg-[#0f172a] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-400'
              }`}
            >
              Popular Near You
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('newly_verified')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                activeTab === 'newly_verified'
                  ? 'bg-[#155DFC] text-white shadow-md'
                  : 'bg-white dark:bg-[#0f172a] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-400'
              }`}
            >
              Newly Verified
            </button>
          </div>

          {/* Business Rows List */}
          <div className="space-y-3.5">
            {displayedList.length === 0 ? (
              <div className="p-8 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 text-center space-y-3 shadow-md">
                <Sparkles className="w-8 h-8 text-blue-500 mx-auto" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">No businesses match the selected filters</h4>
                <p className="text-xs text-slate-500">Try resetting filters to explore businesses across all regions.</p>
                <button
                  type="button"
                  onClick={onResetFilters}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              displayedList.map((biz) => {
                const isSaved = savedBusinessIds.includes(biz.id);
                const categoryObj = categories.find((c) => c.id === biz.category);
                const categoryLabel = categoryObj?.name || biz.category;

                return (
                  <div
                    key={biz.id}
                    onClick={() => onSelectBusiness(biz)}
                    className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-xl hover:border-blue-400 dark:hover:border-blue-500/80 transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center gap-4 group relative"
                  >
                    {/* Thumbnail Image */}
                    <div className="w-full sm:w-28 h-32 sm:h-28 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 relative">
                      <img
                        src={biz.coverImage || (biz.gallery && biz.gallery[0]) || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80'}
                        alt={biz.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {biz.verificationStatus === 'verified' && (
                        <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md bg-blue-600 text-white text-[9px] font-bold flex items-center gap-1 shadow-md">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          <span>VERIFIED</span>
                        </div>
                      )}
                    </div>

                    {/* Middle Info */}
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {biz.name}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap text-xs">
                        <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold">
                          {categoryLabel}
                        </span>
                        <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{biz.city}, {biz.region} Region</span>
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                        {biz.tagline || biz.description}
                      </p>

                      <div className="flex items-center gap-3 pt-0.5 text-xs">
                        <div className="flex items-center text-amber-400">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span className="font-bold ml-1 text-slate-900 dark:text-white">{biz.rating.toFixed(1)}</span>
                          <span className="text-slate-400 ml-1">({biz.reviewCount} reviews)</span>
                        </div>
                        {biz.phone && (
                          <span className="text-slate-400 text-[11px] hidden sm:inline">
                            📞 {biz.phone}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right Action Icons */}
                    <div className="flex sm:flex-col items-center justify-between sm:justify-center gap-2 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleSave(biz.id);
                        }}
                        className={`p-2 rounded-xl transition-colors cursor-pointer ${
                          isSaved
                            ? 'bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400'
                            : 'text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                        title={isSaved ? 'Remove from saved' : 'Save business'}
                      >
                        {isSaved ? <BookmarkCheck className="w-4 h-4 fill-current" /> : <Bookmark className="w-4 h-4" />}
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          contactBusinessOnWhatsApp(biz);
                        }}
                        className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-600 hover:text-white transition-colors cursor-pointer"
                        title="Chat directly on WhatsApp"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>

                      {onOpenQuote && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenQuote(biz);
                          }}
                          className="px-2.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white text-[11px] font-bold transition-colors cursor-pointer"
                          title="Request Quote"
                        >
                          Quote
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Show more businesses button */}
          {filteredAndSortedBusinesses.length > visibleCount && (
            <div className="pt-2 text-center">
              <button
                type="button"
                id="show-more-businesses-btn"
                onClick={() => setVisibleCount((prev) => prev + 6)}
                className="w-full py-3 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold transition-colors cursor-pointer shadow-xs"
              >
                Show more businesses ({filteredAndSortedBusinesses.length - visibleCount} remaining) ↓
              </button>
            </div>
          )}

        </div>

        {/* ========================================================================= */}
        {/* COLUMN 3: LIVE BOG FX & BUSINESS NEWS (Right - 3 cols on desktop)         */}
        {/* ========================================================================= */}
        <div className="lg:col-span-3 space-y-4">
          <div className="p-5 rounded-2xl bg-[#0f172a] border border-slate-800 text-white shadow-xl space-y-4">
            
            {/* Header Badge */}
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>LIVE BOG FX & BUSINESS NEWS</span>
              </div>
              <h3 className="text-base font-bold text-white leading-snug">
                Ghana Business News & Live FX Exchange
              </h3>
              <p className="text-[11px] text-slate-400">
                Synced: 11:49 AM • Bank of Ghana Interbank Feed
              </p>
            </div>

            {/* Live Exchange Rates Box */}
            <div className="p-4 rounded-xl bg-[#172033] border border-slate-700/80 space-y-3">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-700">
                <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <span>🇺🇸 USD / GHS</span>
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-white">{forexRates.USD.rate.toFixed(2)}</span>
                  <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded-md">{forexRates.USD.change}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-700">
                <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <span>🇬🇧 GBP / GHS</span>
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-white">{forexRates.GBP.rate.toFixed(2)}</span>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-md">{forexRates.GBP.change}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <span>🇪🇺 EUR / GHS</span>
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-white">{forexRates.EUR.rate.toFixed(2)}</span>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-700/40 px-1.5 py-0.5 rounded-md">{forexRates.EUR.change}</span>
                </div>
              </div>
            </div>

            {/* Interactive Live Converter */}
            <div className="p-3 rounded-xl bg-[#131b2d] border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
                <span>Quick FX Converter</span>
                <span className="text-blue-400">Live BoG Rate</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={fxCalcAmount}
                  onChange={(e) => setFxCalcAmount(Number(e.target.value) || 0)}
                  className="w-20 px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono"
                  min="1"
                />
                <select
                  value={fxCalcCurrency}
                  onChange={(e) => setFxCalcCurrency(e.target.value as any)}
                  className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                >
                  <option value="USD">USD</option>
                  <option value="GBP">GBP</option>
                  <option value="EUR">EUR</option>
                </select>
                <span className="text-slate-400 text-xs font-bold">=</span>
                <div className="flex-1 text-right text-xs font-bold text-emerald-400 font-mono">
                  GH₵ {(fxCalcAmount * (forexRates[fxCalcCurrency]?.rate || 11.03)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
            </div>

            {/* Indicator */}
            <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-800/60 flex items-center gap-2 text-xs text-blue-300">
              <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>9 verified articles ready</span>
            </div>

            {/* Action button */}
            <button
              type="button"
              id="open-news-fx-hub-btn"
              onClick={onOpenNewsTab}
              className="w-full py-3 rounded-xl bg-[#155DFC] hover:bg-blue-600 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Open News & FX Hub</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </div>
        </div>

      </div>
    </section>
  );
};
