import React, { useState, useMemo } from 'react';
import { 
  X, 
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
  PlusCircle
} from 'lucide-react';
import { Business, Category } from '../types';

interface SectorsModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  businesses: Business[];
  onSelectBusiness: (business: Business) => void;
  onSelectCategory?: (categoryId: string) => void;
  onFilterByCategoryOnHome?: (categoryId: string) => void;
  onOpenRegister?: () => void;
  onOpenRate?: (business: Business) => void;
  initialCategoryId?: string | null;
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
  if (lower.includes('hotel') || lower.includes('hospit') || lower.includes('tour') || lower.includes('resort')) return Hotel;
  if (lower.includes('educat') || lower.includes('school') || lower.includes('train') || lower.includes('academ')) return GraduationCap;
  if (lower.includes('beauty') || lower.includes('salon') || lower.includes('spa') || lower.includes('cosmet')) return Sparkles;
  if (lower.includes('logist') || lower.includes('transport') || lower.includes('courier') || lower.includes('deliver') || lower.includes('haul')) return Truck;
  if (lower.includes('financ') || lower.includes('bank') || lower.includes('money') || lower.includes('loan')) return Landmark;
  return Layers;
};

// Vibrant theme colors for category icons
const getCategoryAccent = (index: number) => {
  const accents = [
    { bg: 'bg-orange-50 dark:bg-orange-950/40', text: 'text-orange-600 dark:text-orange-400', border: 'border-orange-200 dark:border-orange-900/50', badge: 'bg-orange-500' },
    { bg: 'bg-blue-50 dark:bg-blue-950/40', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-900/50', badge: 'bg-blue-600' },
    { bg: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-900/50', badge: 'bg-emerald-600' },
    { bg: 'bg-rose-50 dark:bg-rose-950/40', text: 'text-rose-600 dark:text-rose-400', border: 'border-rose-200 dark:border-rose-900/50', badge: 'bg-rose-600' },
    { bg: 'bg-purple-50 dark:bg-purple-950/40', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-200 dark:border-purple-900/50', badge: 'bg-purple-600' },
    { bg: 'bg-amber-50 dark:bg-amber-950/40', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-900/50', badge: 'bg-amber-600' },
    { bg: 'bg-cyan-50 dark:bg-cyan-950/40', text: 'text-cyan-600 dark:text-cyan-400', border: 'border-cyan-200 dark:border-cyan-900/50', badge: 'bg-cyan-600' },
    { bg: 'bg-indigo-50 dark:bg-indigo-950/40', text: 'text-indigo-600 dark:text-indigo-400', border: 'border-indigo-200 dark:border-indigo-900/50', badge: 'bg-indigo-600' },
    { bg: 'bg-teal-50 dark:bg-teal-950/40', text: 'text-teal-600 dark:text-teal-400', border: 'border-teal-200 dark:border-teal-900/50', badge: 'bg-teal-600' }
  ];
  return accents[index % accents.length];
};

export const SectorsModal: React.FC<SectorsModalProps> = ({
  isOpen,
  onClose,
  categories,
  businesses,
  onSelectBusiness,
  onSelectCategory,
  onFilterByCategoryOnHome,
  onOpenRegister,
  onOpenRate,
  initialCategoryId,
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
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
  };

  const handleApplyFilterToDirectory = (catId: string) => {
    if (onSelectCategory) {
      onSelectCategory(catId);
    } else if (onFilterByCategoryOnHome) {
      onFilterByCategoryOnHome(catId);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden text-slate-900 dark:text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/80 dark:bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            {selectedCategory ? (
              <button
                type="button"
                onClick={handleBackToCategories}
                className="p-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold shrink-0"
                title="Back to all sectors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">All Sectors</span>
              </button>
            ) : (
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md">
                <Layers className="w-5 h-5" />
              </div>
            )}

            <div className="min-w-0">
              <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight truncate">
                {selectedCategory ? selectedCategory.name : 'Business Sectors & Categories'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {selectedCategory 
                  ? `Browse verified businesses in ${selectedCategory.name}`
                  : 'Select any sector to instantly view verified Ghanaian businesses'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {selectedCategory && (
              <button
                type="button"
                onClick={() => handleApplyFilterToDirectory(selectedCategory.id)}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#155DFC] hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
              >
                <span>View in Main Directory</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {!selectedCategory ? (
            /* =================== VIEW 1: ALL SECTORS / CATEGORIES =================== */
            <div className="space-y-4">
              {/* Search input for sectors */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search sector (e.g. Restaurants, Digital Marketing, Automotive, Healthcare...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm placeholder:text-slate-400 focus:outline-hidden focus:border-[#155DFC]"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Grid of Sector Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                {filteredCategories.map((cat, idx) => {
                  const Icon = getCategoryIcon(cat.id || cat.name);
                  const accent = getCategoryAccent(idx);
                  const count = getCategoryBusinessCount(cat);

                  return (
                    <div
                      key={cat.id}
                      onClick={() => handleCategoryClick(cat)}
                      className="group relative p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-[#155DFC] dark:hover:border-[#155DFC] bg-white dark:bg-slate-950/40 hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className={`w-11 h-11 rounded-xl ${accent.bg} ${accent.text} border ${accent.border} flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform`}>
                            <Icon className="w-5 h-5" />
                          </div>

                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:bg-[#155DFC] group-hover:text-white transition-colors">
                            {count} {count === 1 ? 'business' : 'businesses'}
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#155DFC] transition-colors mb-1 line-clamp-1">
                          {cat.name}
                        </h4>

                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {cat.description || 'Verified commercial enterprises, licensed providers, and active businesses.'}
                        </p>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-[#155DFC] group-hover:translate-x-0.5 transition-transform">
                        <span>Explore businesses</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredCategories.length === 0 && (
                <div className="p-8 text-center bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <Layers className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No sector matched "{searchQuery}"</p>
                  <p className="text-xs text-slate-500 mt-1">Try searching for restaurants, digital marketing, technology, or healthcare.</p>
                </div>
              )}
            </div>
          ) : (
            /* =================== VIEW 2: BUSINESSES UNDER CHOSEN SECTOR =================== */
            <div className="space-y-4">
              {/* Category summary banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50/50 to-slate-50 dark:from-blue-950/40 dark:via-indigo-950/30 dark:to-slate-900 border border-blue-200/80 dark:border-blue-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {(() => {
                    const CatIcon = getCategoryIcon(selectedCategory.id || selectedCategory.name);
                    return (
                      <div className="w-12 h-12 rounded-2xl bg-[#155DFC] text-white flex items-center justify-center shadow-md shrink-0">
                        <CatIcon className="w-6 h-6" />
                      </div>
                    );
                  })()}
                  <div>
                    <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                      {selectedCategory.name}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      {categoryBusinesses.length} verified {categoryBusinesses.length === 1 ? 'business' : 'businesses'} listed in Ghana
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => handleApplyFilterToDirectory(selectedCategory.id)}
                    className="flex-1 sm:flex-initial px-3 py-2 rounded-xl bg-[#155DFC] hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <span>View in Main Directory</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  {onOpenRegister && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenRegister();
                      }}
                      className="px-3 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <PlusCircle className="w-3.5 h-3.5 text-blue-600" />
                      <span>Enlist Here</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Businesses List */}
              {categoryBusinesses.length > 0 ? (
                <div className="space-y-3">
                  {categoryBusinesses.map((biz) => {
                    const hasReviews = biz.reviewCount > 0 && biz.rating > 0;

                    return (
                      <div
                        key={biz.id}
                        className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-[#155DFC] bg-white dark:bg-slate-950/40 transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
                      >
                        {/* Left: Image & Info */}
                        <div 
                          className="flex items-start gap-3.5 flex-1 min-w-0 cursor-pointer"
                          onClick={() => {
                            onSelectBusiness(biz);
                            onClose();
                          }}
                        >
                          <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700 relative">
                            <img
                              src={biz.coverImage || biz.logo || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80'}
                              alt={biz.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                            {biz.isFeatured && (
                              <div className="absolute top-1 left-1 px-1.5 py-0.2 rounded-md bg-amber-500 text-white text-[8px] font-black">
                                FEATURED
                              </div>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-[#155DFC] transition-colors truncate">
                                {biz.name}
                              </h4>
                              {biz.verificationStatus === 'verified' && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#155DFC] dark:text-blue-400 border border-blue-200 dark:border-blue-900 text-[10px] font-extrabold">
                                  <CheckCircle2 className="w-3 h-3" />
                                  <span>Verified</span>
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400 mb-1.5 flex-wrap">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span>{biz.city}, {biz.region}</span>
                              </span>

                              {/* Authentic Rating representation - NO fake 5-stars! */}
                              {hasReviews ? (
                                <div className="flex items-center gap-1 text-amber-500 font-bold">
                                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                  <span>{biz.rating.toFixed(1)}</span>
                                  <span className="text-slate-400 font-normal">({biz.reviewCount} {biz.reviewCount === 1 ? 'review' : 'reviews'})</span>
                                </div>
                              ) : (
                                <span className="text-slate-400 text-[11px] font-medium flex items-center gap-1">
                                  <Star className="w-3 h-3 text-slate-300 dark:text-slate-600" />
                                  <span>Unrated (No reviews yet)</span>
                                </span>
                              )}
                            </div>

                            <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1 leading-relaxed">
                              {biz.tagline || biz.description}
                            </p>
                          </div>
                        </div>

                        {/* Right: Quick Action Buttons */}
                        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                          {biz.phone && (
                            <a
                              href={`tel:${biz.phone}`}
                              onClick={(e) => e.stopPropagation()}
                              className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-600 hover:text-white transition-colors cursor-pointer border border-emerald-200 dark:border-emerald-800"
                              title={`Call ${biz.name}`}
                            >
                              <Phone className="w-4 h-4" />
                            </a>
                          )}

                          {biz.whatsapp && (
                            <a
                              href={`https://wa.me/${biz.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${biz.name}, I found your verified business on AuraCentra Ghana!`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white transition-colors cursor-pointer shadow-xs"
                              title="Chat on WhatsApp"
                            >
                              <MessageSquare className="w-4 h-4" />
                            </a>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              onSelectBusiness(biz);
                              onClose();
                            }}
                            className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl bg-[#155DFC] hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View Profile & Reviews</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-[#155DFC] flex items-center justify-center mx-auto">
                    <Layers className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      No verified businesses in {selectedCategory.name} yet
                    </h4>
                    <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                      Be the pioneering business to represent this sector on AuraCentra Ghana! Submit your enterprise for GPS & registrar verification today.
                    </p>
                  </div>
                  {onOpenRegister && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenRegister();
                      }}
                      className="px-4 py-2 rounded-xl bg-[#155DFC] hover:bg-blue-700 text-white text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>Enlist Your {selectedCategory.name} Business</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 shrink-0">
          <span>{categories.length} Official Ghanaian Business Sectors</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
