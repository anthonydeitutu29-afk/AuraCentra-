import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ArrowLeft, 
  MapPin, 
  Star, 
  CheckCircle2, 
  Phone, 
  MessageSquare, 
  Eye, 
  ExternalLink,
  UtensilsCrossed,
  TrendingUp,
  Laptop,
  Heart,
  Car,
  Hammer,
  Shirt,
  Building,
  Briefcase,
  Sprout,
  Hotel,
  GraduationCap,
  Sparkles,
  Truck,
  Landmark,
  Layers,
  ArrowRight,
  ShieldCheck,
  PlusCircle,
  Building2,
  Filter
} from 'lucide-react';
import { Business, Category } from '../types';

interface SectorsPageProps {
  categories: Category[];
  businesses: Business[];
  onSelectBusiness: (business: Business) => void;
  onFilterByCategoryOnHome?: (categoryId: string) => void;
  onOpenRegister?: () => void;
  onOpenRate?: (business: Business) => void;
  initialCategoryId?: string | null;
  onBackToHome: () => void;
}

// Icon mapper for all categories & sectors
const getCategoryIcon = (catIdOrName: string) => {
  const lower = catIdOrName.toLowerCase();
  if (lower.includes('restaurant') || lower.includes('food') || lower.includes('eater')) return UtensilsCrossed;
  if (lower.includes('digital') || lower.includes('marketing') || lower.includes('growth') || lower.includes('seo')) return TrendingUp;
  if (lower.includes('tech') || lower.includes('cloud') || lower.includes('software') || lower.includes('it')) return Laptop;
  if (lower.includes('health') || lower.includes('medic') || lower.includes('clinic') || lower.includes('pharm')) return Heart;
  if (lower.includes('auto') || lower.includes('car') || lower.includes('repair') || lower.includes('vehicle')) return Car;
  if (lower.includes('construct') || lower.includes('build') || lower.includes('hardware') || lower.includes('civil')) return Hammer;
  if (lower.includes('fashion') || lower.includes('tailor') || lower.includes('cloth') || lower.includes('kente')) return Shirt;
  if (lower.includes('real estate') || lower.includes('estate') || lower.includes('hous') || lower.includes('property')) return Building;
  if (lower.includes('legal') || lower.includes('profession') || lower.includes('consult') || lower.includes('account')) return Briefcase;
  if (lower.includes('agri') || lower.includes('farm') || lower.includes('crop') || lower.includes('agro')) return Sprout;
  if (lower.includes('hotel') || lower.includes('hospitality') || lower.includes('resort') || lower.includes('guest')) return Hotel;
  if (lower.includes('educat') || lower.includes('school') || lower.includes('train') || lower.includes('acad')) return GraduationCap;
  if (lower.includes('art') || lower.includes('craft') || lower.includes('creativ') || lower.includes('media')) return Sparkles;
  if (lower.includes('logist') || lower.includes('transport') || lower.includes('haul') || lower.includes('deliver')) return Truck;
  if (lower.includes('financ') || lower.includes('bank') || lower.includes('insur') || lower.includes('susu')) return Landmark;
  return Layers;
};

// Subtle color accents for category cards
const getCategoryAccent = (index: number) => {
  const accents = [
    { bg: 'bg-blue-50 dark:bg-blue-950/40', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-900/60' },
    { bg: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-900/60' },
    { bg: 'bg-violet-50 dark:bg-violet-950/40', text: 'text-violet-600 dark:text-violet-400', border: 'border-violet-200 dark:border-violet-900/60' },
    { bg: 'bg-amber-50 dark:bg-amber-950/40', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-900/60' },
    { bg: 'bg-rose-50 dark:bg-rose-950/40', text: 'text-rose-600 dark:text-rose-400', border: 'border-rose-200 dark:border-rose-900/60' },
    { bg: 'bg-cyan-50 dark:bg-cyan-950/40', text: 'text-cyan-600 dark:text-cyan-400', border: 'border-cyan-200 dark:border-cyan-900/60' },
    { bg: 'bg-indigo-50 dark:bg-indigo-950/40', text: 'text-indigo-600 dark:text-indigo-400', border: 'border-indigo-200 dark:border-indigo-900/60' },
  ];
  return accents[index % accents.length];
};

export const SectorsPage: React.FC<SectorsPageProps> = ({
  categories,
  businesses,
  onSelectBusiness,
  onFilterByCategoryOnHome,
  onOpenRegister,
  onOpenRate,
  initialCategoryId,
  onBackToHome,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(() => {
    if (initialCategoryId) {
      return categories.find((c) => c.id === initialCategoryId || c.slug === initialCategoryId) || null;
    }
    return null;
  });

  React.useEffect(() => {
    if (initialCategoryId) {
      const match = categories.find((c) => c.id === initialCategoryId || c.slug === initialCategoryId);
      if (match) setSelectedCategory(match);
    }
  }, [initialCategoryId, categories]);

  // Filtered categories based on search input
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    const q = searchQuery.toLowerCase().trim();
    return categories.filter((cat) => 
      cat.name.toLowerCase().includes(q) ||
      cat.id.toLowerCase().includes(q) ||
      (cat.description && cat.description.toLowerCase().includes(q))
    );
  }, [categories, searchQuery]);

  // Businesses matching selected category
  const categoryBusinesses = useMemo(() => {
    if (!selectedCategory) return [];
    const catId = selectedCategory.id.toLowerCase();
    const catName = selectedCategory.name.toLowerCase();
    const catSlug = (selectedCategory.slug || '').toLowerCase();

    return businesses.filter((b) => {
      // Must be approved / active
      if (b.listingStatus === 'pending_approval' || b.listingStatus === 'rejected') return false;
      
      const bCat = (b.category || '').toLowerCase();
      const bSub = (b.subCategory || '').toLowerCase();

      return (
        bCat === catId ||
        bCat === catName ||
        bCat === catSlug ||
        catName.includes(bCat) ||
        bCat.includes(catId) ||
        bSub.includes(catId) ||
        bSub.includes(catName)
      );
    });
  }, [businesses, selectedCategory]);

  // Helper to count businesses per category
  const getCategoryBusinessCount = (cat: Category) => {
    const catId = cat.id.toLowerCase();
    const catName = cat.name.toLowerCase();
    const catSlug = (cat.slug || '').toLowerCase();

    return businesses.filter((b) => {
      if (b.listingStatus === 'pending_approval' || b.listingStatus === 'rejected') return false;
      const bCat = (b.category || '').toLowerCase();
      const bSub = (b.subCategory || '').toLowerCase();
      return (
        bCat === catId ||
        bCat === catName ||
        bCat === catSlug ||
        catName.includes(bCat) ||
        bCat.includes(catId) ||
        bSub.includes(catId) ||
        bSub.includes(catName)
      );
    }).length;
  };

  const handleCategoryClick = (cat: Category) => {
    setSelectedCategory(cat);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
  };

  const handleApplyFilterToDirectory = (catId: string) => {
    if (onFilterByCategoryOnHome) {
      onFilterByCategoryOnHome(catId);
    }
  };

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 animate-in fade-in duration-200">
      
      {/* Top Page Header (Directly on main page background) */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-blue-600 dark:text-cyan-400 text-xs font-extrabold uppercase tracking-wider mb-1">
            <Layers className="w-4 h-4" />
            <span>Official Ghanaian Commercial Registry</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {selectedCategory ? selectedCategory.name : 'Business Sectors & Categories'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            {selectedCategory 
              ? `Browse verified Ghanaian businesses, service providers, and certified enterprises in ${selectedCategory.name}.`
              : 'Explore verified enterprises across all 16 Ghanaian regions organized by official industrial and service sectors.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {selectedCategory ? (
            <>
              <button
                type="button"
                onClick={handleBackToCategories}
                className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>All Sectors</span>
              </button>

              <button
                type="button"
                onClick={() => handleApplyFilterToDirectory(selectedCategory.id)}
                className="px-4 py-2.5 rounded-xl bg-[#155DFC] hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <span>Explore in Directory</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onBackToHome}
              className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>← Back to Explore</span>
            </button>
          )}

          {onOpenRegister && (
            <button
              type="button"
              onClick={onOpenRegister}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Enlist Business</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area - Cleanly lying on the page background */}
      {!selectedCategory ? (
        /* =================== VIEW 1: ALL SECTORS / CATEGORIES =================== */
        <div className="space-y-6">
          
          {/* Search bar & Category Counter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search sector (e.g. Restaurants, Digital Marketing, Automotive, Healthcare, Real Estate...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm placeholder:text-slate-400 focus:outline-hidden focus:border-[#155DFC] shadow-xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-bold text-slate-800 dark:text-slate-200">{filteredCategories.length}</span>
              <span>Sectors Available</span>
            </div>
          </div>

          {/* Grid of Sector Cards (No card-in-card wrapping, natural layout on main page) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {filteredCategories.map((cat, idx) => {
              const Icon = getCategoryIcon(cat.id || cat.name);
              const accent = getCategoryAccent(idx);
              const count = getCategoryBusinessCount(cat);

              return (
                <div
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat)}
                  className="group relative p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 hover:border-[#155DFC] dark:hover:border-[#155DFC] bg-white dark:bg-slate-900 hover:bg-blue-50/30 dark:hover:bg-blue-950/20 transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-2xl ${accent.bg} ${accent.text} border ${accent.border} flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform`}>
                        <Icon className="w-6 h-6" />
                      </div>

                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:bg-[#155DFC] group-hover:text-white transition-colors">
                        {count} {count === 1 ? 'business' : 'businesses'}
                      </span>
                    </div>

                    <h2 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-[#155DFC] transition-colors mb-1.5 line-clamp-1">
                      {cat.name}
                    </h2>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {cat.description || 'Verified commercial enterprises, licensed providers, and active businesses.'}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-[#155DFC] group-hover:translate-x-0.5 transition-transform">
                    <span>Explore sector</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })}
          </div>

          {filteredCategories.length === 0 && (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
              <Layers className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No sector matches "{searchQuery}"</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Try searching for another industry such as restaurants, digital marketing, technology, healthcare, or automotive.
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="px-4 py-2 rounded-xl bg-blue-50 dark:bg-slate-800 text-[#155DFC] dark:text-blue-400 text-xs font-bold hover:bg-blue-100 transition-colors cursor-pointer"
              >
                Reset Search
              </button>
            </div>
          )}
        </div>
      ) : (
        /* =================== VIEW 2: BUSINESSES UNDER CHOSEN SECTOR =================== */
        <div className="space-y-6">
          
          {/* Sector Highlight Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-50 via-indigo-50/40 to-slate-50 dark:from-blue-950/40 dark:via-indigo-950/30 dark:to-slate-900 border border-blue-200/80 dark:border-blue-900/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {(() => {
                const CatIcon = getCategoryIcon(selectedCategory.id || selectedCategory.name);
                return (
                  <div className="w-14 h-14 rounded-2xl bg-[#155DFC] text-white flex items-center justify-center shadow-md shrink-0">
                    <CatIcon className="w-7 h-7" />
                  </div>
                );
              })()}
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">
                    {selectedCategory.name}
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                    Ghana Verified
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-0.5">
                  {categoryBusinesses.length} verified {categoryBusinesses.length === 1 ? 'business' : 'businesses'} currently enlisted in this sector
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
              <button
                type="button"
                onClick={() => handleApplyFilterToDirectory(selectedCategory.id)}
                className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-[#155DFC] hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <span>Filter Main Directory</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              {onOpenRegister && (
                <button
                  type="button"
                  onClick={onOpenRegister}
                  className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <PlusCircle className="w-4 h-4 text-blue-600" />
                  <span>Enlist in {selectedCategory.name}</span>
                </button>
              )}
            </div>
          </div>

          {/* Businesses List */}
          {categoryBusinesses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categoryBusinesses.map((biz) => {
                const hasReviews = biz.reviewCount > 0 && biz.rating > 0;

                return (
                  <div
                    key={biz.id}
                    className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-[#155DFC] bg-white dark:bg-slate-900 transition-all duration-200 flex flex-col sm:flex-row items-start gap-4 group shadow-xs hover:shadow-md"
                  >
                    {/* Image */}
                    <div 
                      className="w-full sm:w-28 h-32 sm:h-28 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700 relative cursor-pointer"
                      onClick={() => onSelectBusiness(biz)}
                    >
                      <img
                        src={biz.coverImage || biz.logo || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80'}
                        alt={biz.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      {biz.isFeatured && (
                        <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-amber-400 text-slate-900 text-[10px] font-black shadow-xs">
                          Featured
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between h-full space-y-2">
                      <div 
                        className="cursor-pointer"
                        onClick={() => onSelectBusiness(biz)}
                      >
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-[#155DFC] transition-colors truncate">
                            {biz.name}
                          </h3>
                          {biz.verificationStatus === 'verified' && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded-md">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Verified</span>
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                          {biz.description}
                        </p>
                      </div>

                      {/* Location & Rating */}
                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-1 truncate">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{biz.city || 'Accra'}, {biz.region || 'Greater Accra'}</span>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          {hasReviews ? (
                            <>
                              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                              <span className="font-bold text-slate-800 dark:text-slate-200">{biz.rating.toFixed(1)}</span>
                              <span className="text-slate-400">({biz.reviewCount})</span>
                            </>
                          ) : (
                            <span className="text-[11px] text-slate-400 font-medium">Unrated (0 reviews)</span>
                          )}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => onSelectBusiness(biz)}
                          className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#155DFC] dark:text-cyan-400 hover:bg-blue-100 text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Profile</span>
                        </button>

                        {biz.phone && (
                          <a
                            href={`tel:${biz.phone}`}
                            className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs transition-colors cursor-pointer"
                            title="Call enterprise"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                        )}

                        {onOpenRate && (
                          <button
                            type="button"
                            onClick={() => onOpenRate(biz)}
                            className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors cursor-pointer inline-flex items-center gap-1"
                            title="Rate & Review"
                          >
                            <Star className="w-3.5 h-3.5 text-amber-500" />
                            <span>Rate</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-10 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
                <Building2 className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                  No verified businesses in {selectedCategory.name} yet
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                  Be the premier registered enterprise featured in this Ghanaian sector on AuraCentra.
                </p>
              </div>
              {onOpenRegister && (
                <button
                  type="button"
                  onClick={onOpenRegister}
                  className="px-5 py-2.5 rounded-xl bg-[#155DFC] hover:bg-blue-700 text-white text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Enlist Your {selectedCategory.name} Business</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </main>
  );
};
