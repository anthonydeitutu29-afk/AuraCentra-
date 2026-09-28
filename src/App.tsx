import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  RotateCcw, 
  Loader2, 
  Sparkles, 
  CheckCircle2, 
  Flame, 
  Star,
  Search,
  X,
  Plus
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { HeroSearch } from './components/HeroSearch';
import { BusinessCard } from './components/BusinessCard';
import { Footer } from './components/Footer';
import { HomeFxWidget } from './components/HomeFxWidget';
import { AccountDrawer } from './components/AccountDrawer';
import { NavbarDrawer } from './components/NavbarDrawer';
import { SavedView } from './components/SavedView';
import { ArticleDetailModal } from './components/ArticleDetailModal';
import { NewsArticle, VERIFIED_9_NEWS_ARTICLES } from './data/newsData';
import { SectorsView } from './components/SectorsView';
import { NewsView } from './components/NewsView';
import { PricingView } from './components/PricingView';
import { VerificationView } from './components/VerificationView';
import { StaticPages } from './components/StaticPages';
import { EnlistBusinessModal } from './components/EnlistBusinessModal';
import { BusinessDetailModal } from './components/BusinessDetailModal';
import { AuthModal, UserAccount } from './components/AuthModal';
import { DraggableChatButton } from './components/DraggableChatButton';
import { AdminDashboardView } from './components/AdminDashboardView';
import { BusinessOwnerDashboard } from './components/BusinessOwnerDashboard';
import { fetchBusinessListings } from './lib/supabase';
import { Business } from './types';

const SAVED_STORAGE_KEY = 'auracentra_saved_businesses';
const USER_STORAGE_KEY = 'auracentra_user_account';
const THEME_STORAGE_KEY = 'auracentra_theme';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('explore');
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters & Search state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState<string>('All 16 Ghana Regions');
  const [selectedCity, setSelectedCity] = useState<string>('All Major Cities');
  const [selectedSector, setSelectedSector] = useState<string>('All Business Sectors');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [subTab, setSubTab] = useState<'trending' | 'popular' | 'newly_verified'>('trending');

  // Owner dashboard active business
  const [ownerBusinessId, setOwnerBusinessId] = useState<string>('biz-seed-1');

  // Bookmarks / Saved listings state
  const [savedBusinessIds, setSavedBusinessIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const stored = localStorage.getItem(SAVED_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  // User account state
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const stored = localStorage.getItem(USER_STORAGE_KEY);
        return stored ? JSON.parse(stored) : null;
      } catch {
        return null;
      }
    }
    return null;
  });

  // Drawers and Modals
  const [accountDrawerOpen, setAccountDrawerOpen] = useState(false);
  const [navbarDrawerOpen, setNavbarDrawerOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [articleModalOpen, setArticleModalOpen] = useState(false);

  // Navigate to dedicated Enlist page laying on the background
  const handleOpenEnlist = () => {
    setActiveTab('enlist');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Theme toggle
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(THEME_STORAGE_KEY);
        if (stored === 'dark') return true;
        if (stored === 'light') return false;
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      } catch {
        return false;
      }
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
    try {
      localStorage.setItem(THEME_STORAGE_KEY, isDarkMode ? 'dark' : 'light');
    } catch {}
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Bookmark toggle
  const toggleSaveBusiness = (id: string) => {
    setSavedBusinessIds((prev) => {
      const exists = prev.includes(id);
      const updated = exists ? prev.filter((i) => i !== id) : [...prev, id];
      if (typeof window !== 'undefined' && window.localStorage) {
        try {
          localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(updated));
        } catch {}
      }
      return updated;
    });
  };

  const handleClearAllSaved = () => {
    setSavedBusinessIds([]);
    try {
      localStorage.removeItem(SAVED_STORAGE_KEY);
    } catch {}
  };

  // Auth actions
  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  };

  // Data fetching
  const loadBusinesses = async () => {
    setLoading(true);
    try {
      const res = await fetchBusinessListings();
      setBusinesses(res.businesses);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBusinesses();
    const handleUpdate = () => {
      loadBusinesses();
    };
    window.addEventListener('auracentra_listings_updated', handleUpdate);
    return () => window.removeEventListener('auracentra_listings_updated', handleUpdate);
  }, []);

  // Filter listings
  const filteredBusinesses = businesses
    .filter((b) => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !query ||
        b.name.toLowerCase().includes(query) ||
        (b.description && b.description.toLowerCase().includes(query)) ||
        (b.city && b.city.toLowerCase().includes(query)) ||
        b.category.toLowerCase().includes(query);

      const matchesRegion = 
        selectedRegion === 'All 16 Ghana Regions' || 
        selectedRegion === 'All Regions' ||
        b.region === selectedRegion;

      const matchesCity = 
        selectedCity === 'All Major Cities' || 
        (b.city && b.city.toLowerCase().includes(selectedCity.toLowerCase()));

      const matchesSector = 
        selectedSector === 'All Business Sectors' || 
        b.category.toLowerCase().includes(selectedSector.toLowerCase().split(' ')[0]);

      const matchesVerified = !verifiedOnly || b.verified;

      return matchesSearch && matchesRegion && matchesCity && matchesSector && matchesVerified;
    })
    .sort((a, b) => {
      const timeA = new Date(a.created_at || '').getTime() || 0;
      const timeB = new Date(b.created_at || '').getTime() || 0;

      // Newly enlisted businesses always show at top
      if (subTab === 'newly_verified') {
        return timeB - timeA;
      }

      // Prioritize recently enlisted items within the last 48 hours
      const isRecentA = Date.now() - timeA < 172800000;
      const isRecentB = Date.now() - timeB < 172800000;
      if (isRecentA && !isRecentB) return -1;
      if (!isRecentA && isRecentB) return 1;

      if (subTab === 'popular' || sortBy === 'popular') {
        const scoreA = (a.verified ? 2 : 0) + (a.whatsapp ? 1 : 0);
        const scoreB = (b.verified ? 2 : 0) + (b.whatsapp ? 1 : 0);
        return scoreB - scoreA;
      }

      if (a.verified && !b.verified) return -1;
      if (!a.verified && b.verified) return 1;
      return a.name.localeCompare(b.name);
    });

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedRegion('All 16 Ghana Regions');
    setSelectedCity('All Major Cities');
    setSelectedSector('All Business Sectors');
    setSortBy('featured');
    setVerifiedOnly(false);
  };

  // If on Admin Tab, render isolated full-screen Admin Console
  if (activeTab === 'admin') {
    return (
      <AdminDashboardView
        onBackToSite={() => setActiveTab('explore')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex flex-col transition-colors">
      
      {/* Top Header Navigation Bar with Logo, Navigation Links, News & FX, Theme Toggle & Sign In */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenEnlist={handleOpenEnlist}
        onOpenMenu={() => setNavbarDrawerOpen(true)}
        onOpenAuth={() => setAuthModalOpen(true)}
        currentUser={currentUser}
        savedCount={savedBusinessIds.length}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-10">
        
        {/* VIEW 1: EXPLORE / FRONT PAGE
            Clean landing page: HeroSearch + Discover Businesses
            (No card beneath the information; News & FX Hub has its own page)
        */}
        {activeTab === 'explore' && (
          <div className="w-full space-y-10">
            
            {/* 1. HERO BANNER + TRUST STRIP + BROWSE BY CATEGORY */}
            <HeroSearch
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedRegion={selectedRegion}
              setSelectedRegion={setSelectedRegion}
              selectedCity={selectedCity}
              setSelectedCity={setSelectedCity}
              selectedSector={selectedSector}
              setSelectedSector={setSelectedSector}
              sortBy={sortBy}
              setSortBy={setSortBy}
              verifiedOnly={verifiedOnly}
              setVerifiedOnly={setVerifiedOnly}
              onClearAll={clearAllFilters}
              onSearch={() => {
                const el = document.getElementById('discover-businesses');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onViewAllCategories={() => setActiveTab('sectors')}
            />

            {/* 2. DISCOVER BUSINESSES SECTION */}
            <section id="discover-businesses" className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6 w-full">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    Discover businesses
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                    Showing {filteredBusinesses.length} verified {filteredBusinesses.length === 1 ? 'business' : 'businesses'} across Ghana
                  </p>
                </div>

                {/* SubTabs: Trending, Popular, Newly Verified */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                  <button
                    onClick={() => setSubTab('trending')}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                      subTab === 'trending'
                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                        : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <Flame className={`w-3.5 h-3.5 ${subTab === 'trending' ? 'text-amber-300' : 'text-slate-400'}`} />
                    <span>Trending</span>
                  </button>

                  <button
                    onClick={() => setSubTab('popular')}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                      subTab === 'popular'
                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                        : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <Star className={`w-3.5 h-3.5 ${subTab === 'popular' ? 'text-amber-300 fill-amber-300' : 'text-slate-400'}`} />
                    <span>Popular</span>
                  </button>

                  <button
                    onClick={() => setSubTab('newly_verified')}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                      subTab === 'newly_verified'
                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                        : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <CheckCircle2 className={`w-3.5 h-3.5 ${subTab === 'newly_verified' ? 'text-white' : 'text-slate-400'}`} />
                    <span>Newly Verified</span>
                  </button>
                </div>
              </div>

              {/* Active Search & Filter Indicator */}
              {(searchQuery.trim() || selectedRegion !== 'All 16 Ghana Regions' || selectedSector !== 'All Business Sectors') && (
                <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-blue-50/80 dark:bg-slate-800/80 rounded-2xl border border-blue-200/60 dark:border-slate-700 text-xs text-blue-900 dark:text-blue-200">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold">Active filters:</span>
                    {searchQuery.trim() && (
                      <span className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-700 font-medium border border-blue-200/50 flex items-center gap-1">
                        <Search className="w-3 h-3 text-blue-500" />
                        "{searchQuery}"
                      </span>
                    )}
                    {selectedRegion !== 'All 16 Ghana Regions' && (
                      <span className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-700 font-medium border border-blue-200/50">
                        {selectedRegion}
                      </span>
                    )}
                    {selectedSector !== 'All Business Sectors' && (
                      <span className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-700 font-medium border border-blue-200/50">
                        {selectedSector}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={clearAllFilters}
                    className="font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Clear all</span>
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Listings State */}
              {loading ? (
                <div className="py-20 text-center space-y-3">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Loading verified Ghanaian enterprises...
                  </p>
                </div>
              ) : filteredBusinesses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {filteredBusinesses.map((biz) => (
                    <BusinessCard
                      key={biz.id}
                      business={biz}
                      isSaved={savedBusinessIds.includes(biz.id)}
                      onToggleSave={toggleSaveBusiness}
                      onSelect={(b) => {
                        setSelectedBusiness(b);
                        setDetailModalOpen(true);
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-12 border border-slate-200/90 dark:border-slate-700 text-center space-y-4 shadow-xs max-w-xl mx-auto">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
                    <Building2 className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                      {businesses.length === 0 ? 'No businesses enlisted yet' : 'No businesses found'}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                      {businesses.length === 0 
                        ? 'Be the first Ghanaian enterprise to join AuraCentra and get discovered by thousands of customers nationwide.'
                        : "We couldn't find any enterprises matching your current search or filters. Try resetting your filters to see all available businesses."}
                    </p>
                  </div>
                  <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                    <button
                      onClick={handleOpenEnlist}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Enlist Your Business</span>
                    </button>
                    {(searchQuery.trim() || selectedRegion !== 'All 16 Ghana Regions' || selectedSector !== 'All Business Sectors') && (
                      <button
                        onClick={clearAllFilters}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold text-xs transition-all cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset all filters</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </section>

            {/* 3. GHANA BUSINESS NEWS & LIVE FX EXCHANGE WIDGET (Image 2) */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 w-full pt-2">
              <HomeFxWidget onOpenNewsTab={() => setActiveTab('news')} />
            </section>

          </div>
        )}

        {/* VIEW 2: SECTORS */}
        {activeTab === 'sectors' && (
          <SectorsView
            onSelectSector={(sector) => {
              setSelectedSector(sector);
              setActiveTab('explore');
            }}
            onBackToExplore={() => setActiveTab('explore')}
            onOpenEnlist={handleOpenEnlist}
            businesses={businesses}
          />
        )}

        {/* VIEW 3: SAVED BUSINESSES DEDICATED PAGE */}
        {activeTab === 'saved' && (
          <SavedView
            businesses={businesses}
            savedBusinessIds={savedBusinessIds}
            onToggleSave={toggleSaveBusiness}
            onSelectBusiness={(b) => {
              setSelectedBusiness(b);
              setDetailModalOpen(true);
            }}
            onBackToExplore={() => setActiveTab('explore')}
            onClearAllSaved={handleClearAllSaved}
          />
        )}

        {/* VIEW 4: NEWS & FX (with Dedicated Reading Page lying on background) */}
        {activeTab === 'news' && (
          <NewsView onBackToExplore={() => setActiveTab('explore')} />
        )}

        {/* VIEW 5: PRICING */}
        {activeTab === 'pricing' && (
          <PricingView onEnlist={handleOpenEnlist} />
        )}

        {/* VIEW 6: VERIFICATION */}
        {activeTab === 'verification' && (
          <VerificationView onEnlist={handleOpenEnlist} />
        )}

        {/* VIEW 7: BUSINESS OWNER DASHBOARD (Step 11) */}
        {activeTab === 'owner_dashboard' && (
          <BusinessOwnerDashboard
            businessId={ownerBusinessId}
            onBackToDirectory={() => setActiveTab('explore')}
            onEditBusiness={handleOpenEnlist}
          />
        )}

        {/* VIEW 8: BUSINESS ENLISTMENT (Dedicated Full Page laying on background) */}
        {activeTab === 'enlist' && (
          <EnlistBusinessModal
            isOpen={true}
            asPage={true}
            onClose={() => setActiveTab('explore')}
            onSuccess={(bizId) => {
              loadBusinesses();
              if (bizId) {
                setOwnerBusinessId(bizId);
                setActiveTab('owner_dashboard');
              } else {
                setActiveTab('explore');
              }
            }}
            onOpenDashboard={(bizId) => {
              setOwnerBusinessId(bizId);
              setActiveTab('owner_dashboard');
            }}
          />
        )}

        {/* STATIC PAGES */}
        {(activeTab === 'about' || activeTab === 'support' || activeTab === 'terms') && (
          <StaticPages tab={activeTab as 'about' | 'support' | 'terms'} />
        )}

      </main>

      {/* Global Footer */}
      <Footer
        onOpenEnlist={handleOpenEnlist}
        setActiveTab={setActiveTab}
      />

      {/* Draggable & Moveable Floating Chat Button */}
      <DraggableChatButton
        onClick={() => setActiveTab('support')}
        isBottomNavVisible={false}
      />

      {/* AuraCentra Account Drawer */}
      <AccountDrawer
        isOpen={accountDrawerOpen}
        onClose={() => setAccountDrawerOpen(false)}
        onOpenAuth={() => setAuthModalOpen(true)}
        onNavigateTab={(tab) => setActiveTab(tab)}
        currentUser={currentUser}
        onLogout={handleLogout}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
      />

      {/* Top Navbar Drawer */}
      <NavbarDrawer
        isOpen={navbarDrawerOpen}
        onClose={() => setNavbarDrawerOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenEnlist={handleOpenEnlist}
        onOpenAuth={() => setAuthModalOpen(true)}
        currentUser={currentUser}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
      />

      {/* Auth Screen (Sign In & Sign Up) */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        currentUser={currentUser}
        onLoginSuccess={handleLoginSuccess}
        onLogout={handleLogout}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
      />

      {/* Business Details Modal */}
      <BusinessDetailModal
        business={selectedBusiness}
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        isSaved={selectedBusiness ? savedBusinessIds.includes(selectedBusiness.id) : false}
        onToggleSave={toggleSaveBusiness}
      />

      {/* Article Detail Modal for reading full news from front page */}
      <ArticleDetailModal
        article={selectedArticle}
        isOpen={articleModalOpen}
        onClose={() => setArticleModalOpen(false)}
        onOpenNewsTab={() => {
          setArticleModalOpen(false);
          setActiveTab('news');
        }}
      />

    </div>
  );
}

export default App;
