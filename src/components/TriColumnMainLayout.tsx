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
  CheckCircle2, 
  DollarSign,
  TrendingUp,
  ExternalLink,
  PhoneCall,
  Navigation,
  Compass,
  Loader2,
  Sparkles
} from 'lucide-react';
import { Business, Category, FilterState } from '../types';
import { GHANA_REGIONS, calculateDistanceKm, requestPreciseLocation } from '../utils/geolocationService';
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
  onOpenRegister?: () => void;
  onRequestLocation?: () => void;
  isLocating?: boolean;
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
  onOpenRegister,
  onRequestLocation,
  isLocating = false,
}) => {
  const [activeTab, setActiveTab] = useState<'trending' | 'near_you' | 'newly_verified' | 'featured'>('trending');
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

  // Dynamic helper to resolve category name cleanly
  const getCategoryDisplayName = (catSlugOrId: string) => {
    const found = categories.find(
      (c) => c.id.toLowerCase() === catSlugOrId.toLowerCase() || 
             c.slug.toLowerCase() === catSlugOrId.toLowerCase() || 
             c.name.toLowerCase() === catSlugOrId.toLowerCase()
    );
    return found ? found.name : catSlugOrId;
  };

  // Robust category & tab filtering logic
  const filteredAndSortedBusinesses = useMemo(() => {
    // 0. Only show active / approved businesses to directory users
    let list = businesses.filter((b) => b.listingStatus !== 'pending_approval' && b.listingStatus !== 'rejected');

    // 1. Region filter
    if (filters.region && filters.region !== 'All Regions' && filters.region !== 'all' && filters.region.trim() !== '') {
      list = list.filter((b) => b.region?.toLowerCase() === filters.region.toLowerCase());
    }

    // 2. City filter (safely handle 'All Cities' default)
    if (filters.city && filters.city !== 'All Cities' && filters.city !== 'all' && filters.city.trim() !== '') {
      list = list.filter((b) => b.city?.toLowerCase() === filters.city.toLowerCase());
    }

    // 3. Verification filter
    if (filters.verificationOnly) {
      list = list.filter((b) => b.verificationStatus === 'verified');
    }

    // 4. Flexible Category filter matching by ID, Name, or Slug
    if (filters.category && filters.category !== 'All Categories' && filters.category !== 'all' && filters.category.trim() !== '') {
      const target = filters.category.trim().toLowerCase();
      list = list.filter((b) => {
        const bCat = (b.category || '').trim().toLowerCase();
        if (bCat === target) return true;

        const targetCatObj = categories.find(
          (c) => c.id.toLowerCase() === target || c.name.toLowerCase() === target || c.slug.toLowerCase() === target
        );
        const bCatObj = categories.find(
          (c) => c.id.toLowerCase() === bCat || c.name.toLowerCase() === bCat || c.slug.toLowerCase() === bCat
        );

        if (targetCatObj && bCatObj && targetCatObj.id === bCatObj.id) return true;
        if (targetCatObj && (bCat === targetCatObj.id.toLowerCase() || bCat === targetCatObj.name.toLowerCase() || bCat === targetCatObj.slug.toLowerCase())) return true;
        if (bCatObj && (target === bCatObj.id.toLowerCase() || target === bCatObj.name.toLowerCase() || target === bCatObj.slug.toLowerCase())) return true;

        return false;
      });
    }

    // 5. Search Query matching
    if (filters.searchQuery && filters.searchQuery.trim() !== '') {
      const q = filters.searchQuery.trim().toLowerCase();
      list = list.filter((b) => {
        if (b.name.toLowerCase().includes(q)) return true;
        if (b.description.toLowerCase().includes(q)) return true;
        if (b.city?.toLowerCase().includes(q)) return true;
        if (b.region?.toLowerCase().includes(q)) return true;
        if (b.category?.toLowerCase().includes(q)) return true;
        if (b.services?.some((s) => s.toLowerCase().includes(q))) return true;
        if (b.features?.some((f) => f.toLowerCase().includes(q))) return true;
        if (b.digitalAddress?.toLowerCase().includes(q)) return true;

        // Check if query matches category name for this business
        const catObj = categories.find(
          (c) => c.id.toLowerCase() === b.category.toLowerCase() || c.slug.toLowerCase() === b.category.toLowerCase()
        );
        if (catObj && catObj.name.toLowerCase().includes(q)) return true;

        return false;
      });
    }

    // Apply Tab specific sorting - all enlisted/approved businesses are displayed
    if (activeTab === 'trending') {
      list = [...list].sort((a, b) => {
        const scoreB = (b.views || 0) + (b.leadsCount || 0) * 3 + (b.isFeatured ? 50 : 0);
        const scoreA = (a.views || 0) + (a.leadsCount || 0) * 3 + (a.isFeatured ? 50 : 0);
        return scoreB - scoreA;
      });
    } else if (activeTab === 'featured') {
      // Dedicated tab for businesses approved under Featured Business Categories
      list = list.filter((b) => b.isFeatured);
    } else if (activeTab === 'near_you') {
      // Proximity-based distance sorting using user location
      const userLat = filters.userLat || 5.6037;
      const userLng = filters.userLng || -0.1870;
      list = [...list].sort((a, b) => {
        const distA = calculateDistanceKm(userLat, userLng, a.coordinates?.lat ?? 5.6037, a.coordinates?.lng ?? -0.1870);
        const distB = calculateDistanceKm(userLat, userLng, b.coordinates?.lat ?? 5.6037, b.coordinates?.lng ?? -0.1870);
        if (Math.abs(distA - distB) > 0.5) {
          return distA - distB;
        }
        if (b.isFeatured !== a.isFeatured) return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
        return (b.rating || 0) - (a.rating || 0);
      });
    } else if (activeTab === 'newly_verified') {
      list = [...list].sort((a, b) => {
        // Verified businesses first
        const isVerA = a.verificationStatus === 'verified' ? 1 : 0;
        const isVerB = b.verificationStatus === 'verified' ? 1 : 0;
        if (isVerB !== isVerA) return isVerB - isVerA;

        // Then sorted by newest verification date or update/creation date
        const timeA = new Date(a.verificationDetails?.verifiedAt || a.updatedAt || a.createdAt || 0).getTime();
        const timeB = new Date(b.verificationDetails?.verifiedAt || b.updatedAt || b.createdAt || 0).getTime();
        return timeB - timeA;
      });
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
  }, [businesses, categories, filters, activeTab]);

  const displayedList = filteredAndSortedBusinesses.slice(0, visibleCount);

  // View All Businesses handler (resets filters, sets tab to trending, expands list and scrolls smoothly)
  const handleViewAllBusinessesClick = () => {
    onResetFilters();
    setActiveTab('trending');
    setVisibleCount(Math.max(filteredAndSortedBusinesses.length, 50));
    const el = document.getElementById('discover-businesses-section') || document.getElementById('main-directory-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6" id="discover-businesses-section">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* ========================================================================= */}
        {/* COLUMN 1: FILTERS SIDEBAR (Left - 3 cols on desktop)                      */}
        {/* ========================================================================= */}
        <div className="lg:col-span-3 space-y-4">
          <div className="space-y-5 text-slate-900 dark:text-white">
            
            {/* Filter Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#155DFC]" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Filters</h3>
              </div>
              <button
                type="button"
                id="filters-clear-all-btn"
                onClick={onResetFilters}
                className="text-xs font-semibold text-[#155DFC] hover:text-blue-700 dark:hover:text-blue-400 transition-colors cursor-pointer"
              >
                Clear all
              </button>
            </div>

            {/* 1. Sort by */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Sort by
              </label>
              <div className="relative">
                <select
                  id="filter-sort-by-select"
                  value={filters.sortBy}
                  onChange={(e) => onFilterChange({ sortBy: e.target.value as any })}
                  className="w-full px-3 py-2.5 text-xs rounded-xl bg-white dark:bg-black/40 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-[#155DFC] appearance-none cursor-pointer pr-8 shadow-xs"
                >
                  <option value="featured" className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white">Featured & Verified First</option>
                  <option value="rating" className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white">Highest Customer Rating</option>
                  <option value="reviews" className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white">Most Reviews & Feedback</option>
                  <option value="name" className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white">Alphabetical (A - Z)</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* 2. Region Dropdown */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Region
              </label>
              <div className="relative">
                <select
                  id="filter-region-select"
                  value={filters.region === 'All Regions' ? '' : (filters.region || '')}
                  onChange={(e) => onFilterChange({ region: e.target.value })}
                  className="w-full px-3 py-2.5 text-xs rounded-xl bg-white dark:bg-black/40 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-[#155DFC] appearance-none cursor-pointer pr-8 shadow-xs"
                >
                  <option value="" className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white">All 16 Ghana Regions</option>
                  {GHANA_REGIONS.map((reg) => (
                    <option key={reg.name} value={reg.name} className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white">
                      {reg.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* 3. City Dropdown */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                City
              </label>
              <div className="relative">
                <select
                  id="filter-city-select"
                  value={filters.city === 'All Cities' ? '' : (filters.city || '')}
                  onChange={(e) => onFilterChange({ city: e.target.value })}
                  className="w-full px-3 py-2.5 text-xs rounded-xl bg-white dark:bg-black/40 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-[#155DFC] appearance-none cursor-pointer pr-8 shadow-xs"
                >
                  <option value="" className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white">All Major Cities</option>
                  {availableCities.map((c) => (
                    <option key={c} value={c} className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white">
                      {c}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* 4. Sector / Category Dropdown */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Business Sector
              </label>
              <div className="relative">
                <select
                  id="filter-category-select"
                  value={filters.category === 'All Categories' ? '' : (filters.category || '')}
                  onChange={(e) => onFilterChange({ category: e.target.value })}
                  className="w-full px-3 py-2.5 text-xs rounded-xl bg-white dark:bg-black/40 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-[#155DFC] appearance-none cursor-pointer pr-8 shadow-xs"
                >
                  <option value="" className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white">All Business Sectors</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id} className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white">
                      {cat.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* 5. Verified Only Checkbox */}
            <div className="pt-1">
              <label className="flex items-center gap-2.5 text-xs text-slate-800 dark:text-slate-200 font-medium cursor-pointer select-none">
                <input
                  type="checkbox"
                  id="filter-verified-only-checkbox"
                  checked={Boolean(filters.verificationOnly)}
                  onChange={(e) => onFilterChange({ verificationOnly: e.target.checked })}
                  className="w-4 h-4 rounded-md border-slate-300 dark:border-slate-700 text-[#155DFC] focus:ring-[#155DFC] bg-white dark:bg-black/60 cursor-pointer"
                />
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#155DFC]" />
                  <span>Verified Enterprises Only</span>
                </span>
              </label>
            </div>

            {/* Bottom helper directly on background */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-center space-y-2">
              <div className="w-9 h-9 rounded-full bg-blue-500/10 text-[#155DFC] flex items-center justify-center mx-auto">
                <MapPin className="w-4 h-4" />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                Filtering across <strong className="text-slate-900 dark:text-white">1,200+ verified businesses</strong> in Greater Accra, Ashanti, Western, and all 16 regions.
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
              id="view-all-businesses-main-link"
              onClick={handleViewAllBusinessesClick}
              className="text-xs sm:text-sm font-bold text-[#155DFC] hover:text-blue-700 dark:hover:text-blue-400 flex items-center gap-1.5 cursor-pointer group"
            >
              <span>View all businesses</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Pill Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <button
              type="button"
              onClick={() => setActiveTab('trending')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                activeTab === 'trending'
                  ? 'bg-[#155DFC] text-white shadow-sm'
                  : 'bg-white dark:bg-black/40 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-[#155DFC]'
              }`}
            >
              Trending
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('near_you')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'near_you'
                  ? 'bg-[#155DFC] text-white shadow-sm'
                  : 'bg-white dark:bg-black/40 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-[#155DFC]'
              }`}
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Popular Near You</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('featured')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'featured'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-white dark:bg-black/40 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-amber-500'
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>Featured Categories</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('newly_verified')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                activeTab === 'newly_verified'
                  ? 'bg-[#155DFC] text-white shadow-sm'
                  : 'bg-white dark:bg-black/40 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-[#155DFC]'
              }`}
            >
              Newly Verified
            </button>
          </div>

          {/* Near You Location Access Bar */}
          {activeTab === 'near_you' && (
            <div className="p-3 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Compass className="w-4 h-4 text-[#155DFC] shrink-0" />
                <span>
                  Showing businesses closest to <strong>{filters.region || 'your current location'}</strong>
                  {filters.userLat && filters.userLng ? ' (GPS active)' : ''}
                </span>
              </div>
              <button
                type="button"
                onClick={onRequestLocation}
                disabled={isLocating}
                className="px-3 py-1.5 rounded-xl bg-[#155DFC] hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 transition-colors shadow-xs cursor-pointer"
              >
                {isLocating ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Navigation className="w-3.5 h-3.5" />
                )}
                <span>{isLocating ? 'Accessing GPS...' : 'Access My GPS Location'}</span>
              </button>
            </div>
          )}

          {/* Business Rows List */}
          <div className="space-y-3.5">
            {displayedList.length === 0 ? (
              <div className="py-10 px-4 text-center space-y-3 bg-white dark:bg-black/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {businesses.length === 0 ? 'No Listed Businesses Yet' : 'No businesses match the selected filters'}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  {businesses.length === 0
                    ? 'The directory is fresh. Once businesses complete the due process registration and GhanaPost GPS verification, they will be listed here.'
                    : 'Try resetting your filter parameters or search term to discover all enterprises.'}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                  {businesses.length > 0 && (
                    <button
                      type="button"
                      onClick={handleViewAllBusinessesClick}
                      className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
                    >
                      Reset Filters
                    </button>
                  )}
                </div>
              </div>
            ) : (
              displayedList.map((biz) => {
                const isSaved = savedBusinessIds.includes(biz.id);
                const categoryObj = categories.find((c) => c.id === biz.category);
                const categoryLabel = categoryObj?.name || biz.category;
                const distKm = (filters.userLat && filters.userLng && biz.coordinates)
                  ? calculateDistanceKm(filters.userLat, filters.userLng, biz.coordinates.lat, biz.coordinates.lng)
                  : null;

                return (
                  <div
                    key={biz.id}
                    onClick={() => onSelectBusiness(biz)}
                    className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-black/40 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-lg hover:border-[#155DFC] dark:hover:border-[#155DFC] transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center gap-4 group relative"
                  >
                    {/* Thumbnail Image */}
                    <div className="w-full sm:w-28 h-32 sm:h-28 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 shrink-0 relative">
                      <img
                        src={biz.coverImage || (biz.gallery && biz.gallery[0]) || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80'}
                        alt={biz.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {biz.isFeatured ? (
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-amber-500 text-white text-[9px] font-extrabold flex items-center gap-1 shadow-md">
                          <Star className="w-2.5 h-2.5 fill-white" />
                          <span>FEATURED</span>
                        </div>
                      ) : biz.verificationStatus === 'verified' && (
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#155DFC] text-white text-[9px] font-extrabold flex items-center gap-1 shadow-md">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          <span>VERIFIED</span>
                        </div>
                      )}
                    </div>

                    {/* Middle Info */}
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        {biz.logo && (
                          <img
                            src={biz.logo}
                            alt=""
                            className="w-6 h-6 rounded-lg object-contain bg-white p-0.5 border border-slate-200 dark:border-slate-800 shrink-0 relative z-10 shadow-2xs"
                            loading="lazy"
                          />
                        )}
                        <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-[#155DFC] transition-colors">
                          {biz.name}
                        </h4>
                        {biz.isFeatured && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700 text-[10px] font-bold flex items-center gap-1">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span>Featured Category</span>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 flex-wrap text-xs">
                        <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-[#155DFC] dark:text-blue-400 font-semibold">
                          {categoryLabel}
                        </span>
                        <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{biz.city}, {biz.region} Region</span>
                          {distKm !== null && (
                            <span className="ml-1 px-1.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">
                              {distKm < 1 ? '< 1 km away' : `${distKm.toFixed(1)} km away`}
                            </span>
                          )}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                        {biz.tagline || biz.description}
                      </p>

                      <div className="flex items-center gap-3 pt-0.5 text-xs">
                        {biz.reviewCount > 0 && biz.rating > 0 ? (
                          <div className="flex items-center text-amber-500">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span className="font-bold ml-1 text-slate-900 dark:text-white">{biz.rating.toFixed(1)}</span>
                            <span className="text-slate-400 ml-1">({biz.reviewCount} {biz.reviewCount === 1 ? 'review' : 'reviews'})</span>
                          </div>
                        ) : (
                          <div className="flex items-center text-slate-400 text-[11px] font-medium">
                            <Star className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
                            <span className="ml-1 text-slate-500 dark:text-slate-400">Unrated (No reviews yet)</span>
                          </div>
                        )}
                        {biz.phone && (
                          <span className="text-slate-500 dark:text-slate-400 text-[11px] hidden sm:inline">
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
                            ? 'bg-blue-50 dark:bg-blue-950/80 text-[#155DFC]'
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
                          className="px-2.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-[#155DFC] dark:text-blue-400 hover:bg-[#155DFC] hover:text-white text-[11px] font-bold transition-colors cursor-pointer"
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
                className="w-full py-3 rounded-2xl bg-white dark:bg-black/40 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 text-xs font-bold transition-colors cursor-pointer shadow-xs"
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
          <div className="space-y-4 text-slate-900 dark:text-white">
            
            {/* Header Badge */}
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#155DFC] text-white text-[10px] font-black shadow-xs tracking-wider">
                <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="2.5" fill="white" />
                  <path d="M7.8 7.8C5.5 10.1 5.5 13.9 7.8 16.2" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <path d="M16.2 7.8C18.5 10.1 18.5 13.9 16.2 16.2" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <span>LIVE BoG FX & BUSINESS NEWS</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                Ghana Business News & Live FX Exchange
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Synced: 11:49 AM • Bank of Ghana Interbank Feed
              </p>
            </div>

            {/* Live Exchange Rates */}
            <div className="divide-y divide-slate-200 dark:divide-slate-800 border-y border-slate-200 dark:border-slate-800 py-1">
              <div className="flex items-center justify-between text-xs py-2.5">
                <span className="text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1.5">
                  <span>🇺🇸 USD / GHS</span>
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{forexRates.USD.rate.toFixed(2)}</span>
                  <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded-md">{forexRates.USD.change}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs py-2.5">
                <span className="text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1.5">
                  <span>🇬🇧 GBP / GHS</span>
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{forexRates.GBP.rate.toFixed(2)}</span>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-md">{forexRates.GBP.change}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs py-2.5">
                <span className="text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1.5">
                  <span>🇪🇺 EUR / GHS</span>
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{forexRates.EUR.rate.toFixed(2)}</span>
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded-md">{forexRates.EUR.change}</span>
                </div>
              </div>
            </div>

            {/* Interactive Live Converter */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 dark:text-slate-300">
                <span>Quick FX Converter</span>
                <span className="text-[#155DFC]">Live BoG Rate</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={fxCalcAmount}
                  onChange={(e) => setFxCalcAmount(Number(e.target.value) || 0)}
                  className="w-20 px-2.5 py-1.5 rounded-xl bg-white dark:bg-black/50 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-mono shadow-xs focus:outline-hidden focus:border-[#155DFC]"
                  min="1"
                />
                <select
                  value={fxCalcCurrency}
                  onChange={(e) => setFxCalcCurrency(e.target.value as any)}
                  className="px-2 py-1.5 rounded-xl bg-white dark:bg-black/50 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white cursor-pointer shadow-xs focus:outline-hidden focus:border-[#155DFC]"
                >
                  <option value="USD" className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white">USD</option>
                  <option value="GBP" className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white">GBP</option>
                  <option value="EUR" className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white">EUR</option>
                </select>
                <span className="text-slate-400 text-xs font-bold">=</span>
                <div className="flex-1 text-right text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                  GH₵ {(fxCalcAmount * (forexRates[fxCalcCurrency]?.rate || 11.03)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
            </div>

            {/* Indicator */}
            <div className="flex items-center gap-2 text-xs text-[#155DFC] dark:text-blue-400 pt-1">
              <ShieldCheck className="w-4 h-4 text-[#155DFC] shrink-0" />
              <span>9 verified business articles ready</span>
            </div>

            {/* Action button */}
            <button
              type="button"
              id="open-news-fx-hub-btn"
              onClick={onOpenNewsTab}
              className="w-full py-3 rounded-xl bg-[#155DFC] hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
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
