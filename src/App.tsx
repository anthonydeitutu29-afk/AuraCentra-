import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Building2, 
  Sparkles, 
  ShieldCheck, 
  MapPin, 
  Star, 
  SlidersHorizontal, 
  CheckCircle2, 
  TrendingUp, 
  ExternalLink, 
  ArrowRight, 
  RefreshCw, 
  Search, 
  Filter,
  PlusCircle
} from 'lucide-react';
import { 
  Business, 
  Category, 
  BusinessReview, 
  UserProfile, 
  FilterState,
  BusinessInquiry,
  ToastNotification
} from './types';
import { 
  getStoredBusinesses, 
  saveBusinesses, 
  getStoredCategories, 
  saveCategories, 
  getStoredReviews, 
  saveReviews, 
  getStoredCurrentUser, 
  saveCurrentUser, 
  getStoredSearchHistory, 
  saveSearchHistory, 
  clearStoredSearchHistory,
  getExecutiveSectionVisibility,
  saveExecutiveSectionVisibility,
  calculateDistanceKm,
  getStoredInquiries,
  saveInquiries
} from './utils/storage';

// Subcomponents
import { Navbar } from './components/Navbar';
import { HeroSearch } from './components/HeroSearch';
import { BusinessCard } from './components/BusinessCard';
import { BusinessDetailsModal } from './components/BusinessDetailsModal';
import { BusinessComparisonModal } from './components/BusinessComparisonModal';
import { LocationMapModal } from './components/LocationMapModal';
import { AuthModal } from './components/AuthModal';
import { BusinessRegistrationModal } from './components/BusinessRegistrationModal';
import { SavedBusinessesModal } from './components/SavedBusinessesModal';
import { AdminDashboard } from './components/AdminDashboard';
import { FloatingContactHub } from './components/FloatingContactHub';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/Toast';
import { QuoteInquiryModal } from './components/QuoteInquiryModal';
import { QRCodeShareModal } from './components/QRCodeShareModal';
import { VerificationCertificateModal } from './components/VerificationCertificateModal';
import { InquiriesManagerModal } from './components/InquiriesManagerModal';

export default function App() {
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('auracentra_theme') as 'light' | 'dark') || 'light';
  });

  // Core Data state
  const [businesses, setBusinesses] = useState<Business[]>(getStoredBusinesses);
  const [categories, setCategories] = useState<Category[]>(getStoredCategories);
  const [reviews, setReviews] = useState<BusinessReview[]>(getStoredReviews);
  const [inquiries, setInquiries] = useState<BusinessInquiry[]>(getStoredInquiries);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(getStoredCurrentUser);
  const [savedBusinessIds, setSavedBusinessIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('auracentra_saved_ids');
    return saved ? JSON.parse(saved) : [];
  });
  const [comparedBusinessIds, setComparedBusinessIds] = useState<string[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>(getStoredSearchHistory);
  const [showExecutiveSection, setShowExecutiveSection] = useState<boolean>(getExecutiveSectionVisibility);

  // Toast Notifications
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const showToast = useCallback((
    title: string, 
    message?: string, 
    type: 'success' | 'error' | 'info' | 'warning' = 'success'
  ) => {
    const newToast: ToastNotification = {
      id: 'toast_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      type,
      title,
      message,
      duration: 4000,
    };
    setToasts((prev) => [...prev, newToast]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // View state: 'portal' or 'admin'
  const [currentView, setCurrentView] = useState<'portal' | 'admin'>('portal');

  // Modals state
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [mapBusiness, setMapBusiness] = useState<Business | null>(null);
  const [quoteBusiness, setQuoteBusiness] = useState<Business | null>(null);
  const [qrBusiness, setQrBusiness] = useState<Business | null>(null);
  const [certBusiness, setCertBusiness] = useState<Business | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isInquiriesModalOpen, setIsInquiriesModalOpen] = useState(false);

  // Filters State
  const initialFilters: FilterState = {
    searchQuery: '',
    category: '',
    city: 'All Cities',
    region: '',
    verificationOnly: false,
    minRating: 0,
    priceLevel: '',
    openNowOnly: false,
    sortBy: 'featured',
  };
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  // Sync theme with document class
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('auracentra_theme', theme);
  }, [theme]);

  // Persist state changes
  useEffect(() => {
    saveBusinesses(businesses);
  }, [businesses]);

  useEffect(() => {
    saveCategories(categories);
  }, [categories]);

  useEffect(() => {
    saveReviews(reviews);
  }, [reviews]);

  useEffect(() => {
    saveInquiries(inquiries);
  }, [inquiries]);

  useEffect(() => {
    saveCurrentUser(currentUser);
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('auracentra_saved_ids', JSON.stringify(savedBusinessIds));
  }, [savedBusinessIds]);

  useEffect(() => {
    saveSearchHistory(searchHistory);
  }, [searchHistory]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
  };

  const handleAddSearchHistory = (query: string) => {
    if (!query) return;
    setSearchHistory((prev) => {
      const filtered = prev.filter((item) => item.toLowerCase() !== query.toLowerCase());
      return [query, ...filtered].slice(0, 10);
    });
  };

  const handleClearSearchHistory = () => {
    setSearchHistory([]);
    clearStoredSearchHistory();
  };

  const handleToggleSave = (businessId: string) => {
    setSavedBusinessIds((prev) => {
      if (prev.includes(businessId)) {
        return prev.filter((id) => id !== businessId);
      } else {
        return [...prev, businessId];
      }
    });
  };

  const handleToggleCompare = (businessId: string) => {
    setComparedBusinessIds((prev) => {
      if (prev.includes(businessId)) {
        return prev.filter((id) => id !== businessId);
      } else {
        if (prev.length >= 3) {
          alert('You can compare up to 3 businesses at a time.');
          return prev;
        }
        return [...prev, businessId];
      }
    });
  };

  const handleRemoveCompare = (businessId: string) => {
    setComparedBusinessIds((prev) => prev.filter((id) => id !== businessId));
  };

  const handleRegisterBusiness = (newBusiness: Business) => {
    setBusinesses((prev) => [newBusiness, ...prev]);
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id === newBusiness.category) {
          return { ...c, itemCount: c.itemCount + 1 };
        }
        return c;
      })
    );
  };

  const handleAddReview = (newReview: BusinessReview) => {
    setReviews((prev) => [newReview, ...prev]);
    setBusinesses((prev) =>
      prev.map((b) => {
        if (b.id === newReview.businessId) {
          const newCount = b.reviewCount + 1;
          const newRating = Number(((b.rating * b.reviewCount + newReview.rating) / newCount).toFixed(1));
          return { ...b, reviewCount: newCount, rating: newRating };
        }
        return b;
      })
    );
  };

  const handleHelpfulVote = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id === reviewId) {
          return { ...r, helpfulCount: (r.helpfulCount || 0) + 1 };
        }
        return r;
      })
    );
  };

  const handleUpdateBusiness = (updated: Business) => {
    setBusinesses((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
    if (selectedBusiness && selectedBusiness.id === updated.id) {
      setSelectedBusiness(updated);
    }
  };

  const handleAddBusinessDirect = (newBiz: Business) => {
    setBusinesses((prev) => [newBiz, ...prev]);
  };

  const handleDeleteBusiness = (businessId: string) => {
    setBusinesses((prev) => prev.filter((b) => b.id !== businessId));
    if (selectedBusiness && selectedBusiness.id === businessId) {
      setSelectedBusiness(null);
    }
  };

  const handleApproveVerification = (businessId: string) => {
    setBusinesses((prev) =>
      prev.map((b) => {
        if (b.id === businessId) {
          return {
            ...b,
            verificationStatus: 'verified',
            verificationBadge: {
              type: 'national_id',
              verifiedAt: new Date().toISOString(),
              expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
              docNumberHash: 'VERIFIED-GH',
              level: 'gold',
            },
            verificationDocuments: b.verificationDocuments?.map((d) => ({
              ...d,
              status: 'verified',
              reviewedAt: new Date().toISOString(),
            })),
          };
        }
        return b;
      })
    );
  };

  const handleRejectVerification = (businessId: string, reason: string) => {
    setBusinesses((prev) =>
      prev.map((b) => {
        if (b.id === businessId) {
          return {
            ...b,
            verificationStatus: 'rejected',
            verificationDocuments: b.verificationDocuments?.map((d) => ({
              ...d,
              status: 'rejected',
              rejectionReason: reason,
              reviewedAt: new Date().toISOString(),
            })),
          };
        }
        return b;
      })
    );
  };

  const handleAddCategory = (newCat: Category) => {
    setCategories((prev) => [...prev, newCat]);
  };

  const handleDeleteCategory = (categoryId: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== categoryId));
  };

  const handleToggleExecutiveSection = (visible: boolean) => {
    setShowExecutiveSection(visible);
    saveExecutiveSectionVisibility(visible);
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    setCurrentView('portal');
    showToast('Signed Out', 'You have been signed out successfully.', 'info');
  };

  // Feature Handlers
  const handleOpenQuote = useCallback((business: Business) => {
    setQuoteBusiness(business);
  }, []);

  const handleSubmitInquiry = useCallback((newInquiry: BusinessInquiry) => {
    setInquiries((prev) => [newInquiry, ...prev]);
    showToast(
      'Quote Request Dispatched!',
      `Your inquiry for ${newInquiry.businessName} has been routed. The business has been notified.`,
      'success'
    );
  }, [showToast]);

  const handleOpenQR = useCallback((business: Business) => {
    setQrBusiness(business);
  }, []);

  const handleOpenCert = useCallback((business: Business) => {
    setCertBusiness(business);
  }, []);

  const handleUpdateInquiryStatus = useCallback((id: string, status: 'new' | 'contacted' | 'completed') => {
    setInquiries((prev) =>
      prev.map((inq) => (inq.id === id ? { ...inq, status } : inq))
    );
    showToast('Inquiry Status Updated', `Lead status marked as ${status}.`, 'info');
  }, [showToast]);

  const handleDeleteInquiry = useCallback((id: string) => {
    setInquiries((prev) => prev.filter((inq) => inq.id !== id));
    showToast('Inquiry Removed', 'The quote record has been deleted.', 'info');
  }, [showToast]);

  // Compute filtered & sorted businesses
  const filteredBusinesses = useMemo(() => {
    return businesses.filter((b) => {
      // Keyword search
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        const matchesName = b.name.toLowerCase().includes(q);
        const matchesCat = b.category.toLowerCase().includes(q);
        const matchesDesc = b.description.toLowerCase().includes(q);
        const matchesCity = b.city.toLowerCase().includes(q);
        const matchesServices = b.services?.some((s) => s.toLowerCase().includes(q));
        if (!matchesName && !matchesCat && !matchesDesc && !matchesCity && !matchesServices) {
          return false;
        }
      }

      // Category filter
      if (filters.category && b.category !== filters.category) {
        return false;
      }

      // City filter
      if (filters.city && filters.city !== 'All Cities' && b.city !== filters.city) {
        return false;
      }

      // Verified only
      if (filters.verificationOnly && b.verificationStatus !== 'verified') {
        return false;
      }

      // Min rating
      if (filters.minRating > 0 && b.rating < filters.minRating) {
        return false;
      }

      // Price level
      if (filters.priceLevel && b.priceLevel !== filters.priceLevel) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'rating') {
        return b.rating - a.rating;
      }
      if (filters.sortBy === 'reviews') {
        return b.reviewCount - a.reviewCount;
      }
      if (filters.sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      // default: featured first, then verified, then reviews
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      if (a.verificationStatus === 'verified' && b.verificationStatus !== 'verified') return -1;
      if (a.verificationStatus !== 'verified' && b.verificationStatus === 'verified') return 1;
      return b.reviewCount - a.reviewCount;
    });
  }, [businesses, filters]);

  const comparedBusinesses = useMemo(() => {
    return businesses.filter((b) => comparedBusinessIds.includes(b.id));
  }, [businesses, comparedBusinessIds]);

  const savedBusinesses = useMemo(() => {
    return businesses.filter((b) => savedBusinessIds.includes(b.id));
  }, [businesses, savedBusinessIds]);

  // Executive Spotlight businesses
  const executiveBusinesses = useMemo(() => {
    return businesses.filter((b) => b.isFeatured);
  }, [businesses]);

  // If in Admin Dashboard view
  if (currentView === 'admin' && currentUser?.role === 'admin') {
    return (
      <div className={theme === 'dark' ? 'dark' : ''}>
        <AdminDashboard
          currentUser={currentUser}
          businesses={businesses}
          categories={categories}
          showExecutiveSection={showExecutiveSection}
          onToggleExecutiveSection={handleToggleExecutiveSection}
          onUpdateBusiness={handleUpdateBusiness}
          onAddBusiness={handleAddBusinessDirect}
          onDeleteBusiness={handleDeleteBusiness}
          onApproveVerification={handleApproveVerification}
          onRejectVerification={handleRejectVerification}
          onAddCategory={handleAddCategory}
          onDeleteCategory={handleDeleteCategory}
          onSignOut={handleSignOut}
          onBackToPortal={() => setCurrentView('portal')}
        />
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 ${theme === 'dark' ? 'dark' : ''}`} id="auracentra-app-root">
      {/* 1. Global Navigation Bar */}
      <Navbar
        currentUser={currentUser}
        savedCount={savedBusinessIds.length}
        comparedCount={comparedBusinessIds.length}
        inquiriesCount={inquiries.filter((i) => i.status === 'new').length}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenRegister={() => setIsRegisterModalOpen(true)}
        onOpenSavedModal={() => setIsSavedModalOpen(true)}
        onOpenCompareModal={() => setIsCompareModalOpen(true)}
        onOpenInquiriesModal={() => setIsInquiriesModalOpen(true)}
        onOpenAdminDashboard={() => setCurrentView('admin')}
        onSignOut={handleSignOut}
      />

      {/* 2. Hero & Focused Search Component */}
      <HeroSearch
        categories={categories}
        businesses={businesses}
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        searchHistory={searchHistory}
        onAddSearchHistory={handleAddSearchHistory}
        onClearSearchHistory={handleClearSearchHistory}
        onSelectBusiness={(b) => setSelectedBusiness(b)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* 3. Executive Featured Spotlight Section (if any featured businesses exist) */}
        {showExecutiveSection && executiveBusinesses.length > 0 && (
          <section className="space-y-4" id="executive-spotlight-section">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>AuraCentra Featured Showcase</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Verified Industry Leaders & Highlights
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {executiveBusinesses.slice(0, 3).map((biz) => (
                <BusinessCard
                  key={biz.id}
                  business={biz}
                  isSaved={savedBusinessIds.includes(biz.id)}
                  isCompared={comparedBusinessIds.includes(biz.id)}
                  onToggleSave={handleToggleSave}
                  onToggleCompare={handleToggleCompare}
                  onSelect={(b) => setSelectedBusiness(b)}
                  onOpenQuote={handleOpenQuote}
                  onOpenQR={handleOpenQR}
                  onQuickContactWhatsApp={(b) => {
                    window.open(`https://wa.me/${b.whatsapp || b.phone}`, '_blank');
                  }}
                />
              ))}
            </div>
          </section>
        )}

        {/* 4. Browse by Category Grid */}
        <section className="space-y-4" id="browse-categories-section">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Explore Ghanaian Business Categories
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Discover verified professionals, artisans, tech hubs, and healthcare providers in Ghana.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {categories.map((cat) => {
              const isSelected = filters.category === cat.id;
              const count = businesses.filter((b) => b.category === cat.id).length;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    handleFilterChange({ category: isSelected ? '' : cat.id });
                  }}
                  className={`group p-3.5 sm:p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/20 scale-[1.02]'
                      : 'bg-white dark:bg-slate-800/80 border-slate-200/80 dark:border-slate-700/70 text-slate-800 dark:text-slate-200 hover:border-blue-500 hover:shadow-md'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl mb-3 flex items-center justify-center bg-blue-50 dark:bg-slate-700 group-hover:scale-110 transition-transform">
                    <Building2 className={`w-5 h-5 ${isSelected ? 'text-blue-600' : 'text-blue-600 dark:text-blue-400'}`} />
                  </div>
                  <div>
                    <h3 className={`text-xs sm:text-sm font-bold truncate ${isSelected ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                      {cat.name}
                    </h3>
                    <p className={`text-[11px] mt-0.5 ${isSelected ? 'text-blue-100' : 'text-slate-400 dark:text-slate-500'}`}>
                      {count} {count === 1 ? 'business' : 'businesses'}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* 5. Main Directory Listings Grid & Controls */}
        <section className="space-y-6 pt-4" id="main-directory-section">
          {/* Controls Bar: Sort, Price, Rating, Count */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/70 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                {filteredBusinesses.length} {filteredBusinesses.length === 1 ? 'Business Found' : 'Businesses Found'}
              </span>
              {filters.category && (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-semibold">
                  Category: {categories.find((c) => c.id === filters.category)?.name || filters.category}
                </span>
              )}
            </div>

            {/* Sort & Quick Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <div className="flex items-center gap-1.5 text-slate-500">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Sort by:</span>
              </div>

              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange({ sortBy: e.target.value as any })}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 font-semibold text-slate-800 dark:text-slate-200 border-0 focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="featured">Featured & Verified First</option>
                <option value="rating">Highest Rated (★ 5.0)</option>
                <option value="reviews">Most Reviewed</option>
                <option value="name">Alphabetical (A-Z)</option>
              </select>

              {/* Min Rating Filter */}
              <select
                value={filters.minRating}
                onChange={(e) => handleFilterChange({ minRating: Number(e.target.value) })}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 font-semibold text-slate-800 dark:text-slate-200 border-0 focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value={0}>All Ratings</option>
                <option value={4.5}>★ 4.5+ Stars</option>
                <option value={4.0}>★ 4.0+ Stars</option>
              </select>

              {/* Price Tier Filter */}
              <select
                value={filters.priceLevel}
                onChange={(e) => handleFilterChange({ priceLevel: e.target.value })}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 font-semibold text-slate-800 dark:text-slate-200 border-0 focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="">All Prices</option>
                <option value="$">$ (Budget Friendly)</option>
                <option value="$$">$$ (Moderate)</option>
                <option value="$$$">$$$ (Premium / Luxury)</option>
              </select>
            </div>
          </div>

          {/* Business Cards Grid or Clean Empty State */}
          {filteredBusinesses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBusinesses.map((biz) => (
                <BusinessCard
                  key={biz.id}
                  business={biz}
                  isSaved={savedBusinessIds.includes(biz.id)}
                  isCompared={comparedBusinessIds.includes(biz.id)}
                  onToggleSave={handleToggleSave}
                  onToggleCompare={handleToggleCompare}
                  onSelect={(b) => setSelectedBusiness(b)}
                  onOpenQuote={handleOpenQuote}
                  onOpenQR={handleOpenQR}
                  onQuickContactWhatsApp={(b) => {
                    window.open(`https://wa.me/${b.whatsapp || b.phone}`, '_blank');
                  }}
                />
              ))}
            </div>
          ) : businesses.length === 0 ? (
            /* Clean Empty State when No Demo Businesses Exist */
            <div className="p-8 sm:p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-blue-100 dark:border-slate-800 shadow-sm space-y-4 max-w-2xl mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-cyan-400 flex items-center justify-center mx-auto shadow-inner">
                <Building2 className="w-8 h-8" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  Welcome to AuraCentra Ghana
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                  No businesses have been enlisted yet. Enlist your business now to connect with ready customers across Ghana!
                </p>
              </div>
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  id="empty-state-register-btn"
                  onClick={() => setIsRegisterModalOpen(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-600/20 transition-all cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Enlist Your Business</span>
                </button>
              </div>
            </div>
          ) : (
            /* Empty State when filters yield no result */
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
              <Search className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                No businesses matched your search
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                Try typing a different keyword or resetting your filters.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Search</span>
              </button>
            </div>
          )}
        </section>
      </main>

      {/* 6. Modals Ecosystem */}
      <BusinessDetailsModal
        business={selectedBusiness}
        isOpen={!!selectedBusiness}
        onClose={() => setSelectedBusiness(null)}
        isSaved={selectedBusiness ? savedBusinessIds.includes(selectedBusiness.id) : false}
        onToggleSave={handleToggleSave}
        isCompared={selectedBusiness ? comparedBusinessIds.includes(selectedBusiness.id) : false}
        onToggleCompare={handleToggleCompare}
        reviews={reviews}
        onAddReview={handleAddReview}
        onHelpfulVote={handleHelpfulVote}
        onOpenMap={(b) => setMapBusiness(b)}
        onOpenQuote={handleOpenQuote}
        onOpenQR={handleOpenQR}
        onOpenCertificate={handleOpenCert}
      />

      <QuoteInquiryModal
        business={quoteBusiness}
        isOpen={!!quoteBusiness}
        onClose={() => setQuoteBusiness(null)}
        onSubmitInquiry={handleSubmitInquiry}
      />

      <QRCodeShareModal
        business={qrBusiness}
        isOpen={!!qrBusiness}
        onClose={() => setQrBusiness(null)}
        onShowToast={showToast}
      />

      <VerificationCertificateModal
        business={certBusiness}
        isOpen={!!certBusiness}
        onClose={() => setCertBusiness(null)}
      />

      <InquiriesManagerModal
        inquiries={inquiries}
        isOpen={isInquiriesModalOpen}
        onClose={() => setIsInquiriesModalOpen(false)}
        onUpdateStatus={handleUpdateInquiryStatus}
        onDeleteInquiry={handleDeleteInquiry}
      />

      <BusinessComparisonModal
        comparedBusinesses={comparedBusinesses}
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        onRemove={handleRemoveCompare}
        onSelect={(b) => setSelectedBusiness(b)}
      />

      <LocationMapModal
        business={mapBusiness}
        allBusinesses={businesses}
        isOpen={!!mapBusiness}
        onClose={() => setMapBusiness(null)}
        onSelectBusiness={(b) => setSelectedBusiness(b)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          showToast('Welcome Back!', `Signed in as ${user.name}`, 'success');
        }}
      />

      <BusinessRegistrationModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        categories={categories}
        onRegisterBusiness={(newBiz) => {
          handleRegisterBusiness(newBiz);
          showToast('Business Registered Successfully!', `${newBiz.name} is now listed on AuraCentra Ghana.`, 'success');
        }}
      />

      <SavedBusinessesModal
        savedBusinesses={savedBusinesses}
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        onRemoveSaved={handleToggleSave}
        onSelectBusiness={(b) => setSelectedBusiness(b)}
      />

      {/* 7. Toast Notification Portal */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* 8. Floating Contact Hub */}
      <FloatingContactHub />

      {/* 9. Global Platform Footer */}
      <Footer
        categories={categories}
        onSelectCategory={(catId) => {
          handleFilterChange({ category: catId });
          window.scrollTo({ top: 400, behavior: 'smooth' });
        }}
        onOpenRegister={() => setIsRegisterModalOpen(true)}
      />
    </div>
  );
}
