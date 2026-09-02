import React, { useState, useMemo } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Heart, 
  Compass, 
  Building2, 
  TrendingUp, 
  Activity, 
  Clock, 
  Settings, 
  LogOut, 
  ExternalLink, 
  ChevronRight, 
  CheckCircle2, 
  Star, 
  ArrowLeft,
  Search,
  Eye,
  SlidersHorizontal,
  Bookmark,
  Share2,
  Calendar,
  Lock,
  Globe,
  Bell,
  HelpCircle,
  Award
} from 'lucide-react';
import { UserProfile, Business, Category } from '../types';
import { AuraCentraLogoSVG } from './AuraCentraLogo';

interface PersonalAccountDashboardProps {
  currentUser: UserProfile;
  businesses: Business[];
  categories: Category[];
  savedBusinessIds: string[];
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onToggleSaveBusiness: (businessId: string) => void;
  onOpenBusinessDetails: (business: Business) => void;
  onOpenBusinessDashboard: () => void;
  onOpenAccountSettings: () => void;
  onBackToPortal: () => void;
  onSignOut: () => void;
  onShowToast: (title: string, message?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const PersonalAccountDashboard: React.FC<PersonalAccountDashboardProps> = ({
  currentUser,
  businesses,
  categories,
  savedBusinessIds,
  onUpdateProfile,
  onToggleSaveBusiness,
  onOpenBusinessDetails,
  onOpenBusinessDashboard,
  onOpenAccountSettings,
  onBackToPortal,
  onSignOut,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'saved' | 'discover' | 'activity' | 'profile'>('overview');
  
  // Profile editing state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(currentUser.name || '');
  const [editPhone, setEditPhone] = useState(currentUser.phone || '');
  const [editBio, setEditBio] = useState(currentUser.bio || '');
  const [editRegion, setEditRegion] = useState(currentUser.region || 'Greater Accra');
  const [isSaving, setIsSaving] = useState(false);

  // Search & Filter in Dashboard
  const [nearbySearch, setNearbySearch] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('');

  // Saved businesses
  const savedBusinesses = useMemo(() => {
    return businesses.filter(b => savedBusinessIds.includes(b.id) && b.listingStatus === 'active');
  }, [businesses, savedBusinessIds]);

  // Owned businesses
  const ownedBusinesses = useMemo(() => {
    return businesses.filter(b => 
      b.ownerEmail?.toLowerCase() === currentUser.email.toLowerCase() ||
      b.ownerId === currentUser.id ||
      (currentUser.ownedBusinessIds && currentUser.ownedBusinessIds.includes(b.id))
    );
  }, [businesses, currentUser]);

  // Personalized Recommended Businesses
  const recommendedBusinesses = useMemo(() => {
    return businesses
      .filter(b => b.listingStatus === 'active' && b.verificationStatus === 'verified')
      .slice(0, 6);
  }, [businesses]);

  // Nearby discovery filter
  const discoverBusinesses = useMemo(() => {
    return businesses.filter(b => {
      if (b.listingStatus !== 'active') return false;
      if (selectedCategoryFilter && b.category !== selectedCategoryFilter) return false;
      if (nearbySearch.trim()) {
        const q = nearbySearch.toLowerCase();
        return (
          b.name.toLowerCase().includes(q) ||
          b.category.toLowerCase().includes(q) ||
          b.city.toLowerCase().includes(q) ||
          b.region.toLowerCase().includes(q)
        );
      }
      return true;
    }).slice(0, 8);
  }, [businesses, selectedCategoryFilter, nearbySearch]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      onUpdateProfile({
        name: editName.trim() || currentUser.name,
        phone: editPhone.trim(),
        bio: editBio.trim(),
        region: editRegion,
      });
      setIsSaving(false);
      setIsEditingProfile(false);
      onShowToast('Profile Updated', 'Your AuraCentra personal profile has been saved successfully.', 'success');
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onBackToPortal}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-xl transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Directory</span>
            </button>
            <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-700 hidden sm:block" />
            <div className="flex items-center gap-2">
              <AuraCentraLogoSVG size={36} />
              <div className="hidden sm:block">
                <span className="text-base font-black text-slate-900 dark:text-white tracking-tight">AuraCentra</span>
                <span className="text-xs text-blue-600 dark:text-blue-400 font-bold ml-1.5 px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800">
                  Account Dashboard
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onOpenAccountSettings}
              className="p-2.5 text-slate-600 dark:text-slate-300 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              title="Security & Account Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
            
            <button
              type="button"
              onClick={onSignOut}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors border border-rose-200 dark:border-rose-900/50 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>

            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
              <img
                src={currentUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=155DFC&color=fff&bold=true`}
                alt={currentUser.name}
                referrerPolicy="no-referrer"
                className="w-9 h-9 rounded-full object-cover border-2 border-blue-500 shadow-sm"
              />
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight truncate max-w-[120px]">{currentUser.name}</p>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  {currentUser.authProvider === 'google' ? 'Google Account' : 'Verified'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner Card */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-blue-600/15 mb-8">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold uppercase tracking-wider mb-3">
                <Compass className="w-3.5 h-3.5 text-blue-200" />
                <span>Personal Portal</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
                Welcome back, {currentUser.name}!
              </h1>
              <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
                Connect with verified enterprises, discover nearby opportunities, and manage your personal AuraCentra experience.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('discover')}
                className="px-5 py-2.5 bg-white text-blue-700 hover:bg-blue-50 font-bold text-sm rounded-xl shadow-lg transition-all cursor-pointer flex items-center gap-2"
              >
                <Compass className="w-4 h-4" />
                <span>Explore Nearby</span>
              </button>
              
              {ownedBusinesses.length > 0 ? (
                <button
                  type="button"
                  onClick={onOpenBusinessDashboard}
                  className="px-5 py-2.5 bg-blue-500/30 hover:bg-blue-500/40 border border-white/30 text-white font-bold text-sm rounded-xl backdrop-blur-md transition-all cursor-pointer flex items-center gap-2"
                >
                  <Building2 className="w-4 h-4" />
                  <span>Business Hub ({ownedBusinesses.length})</span>
                </button>
              ) : null}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 mb-8 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Overview</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('saved')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'saved'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Saved Businesses ({savedBusinesses.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('discover')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'discover'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Nearby Discovery</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('activity')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'activity'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Security & Sessions</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'profile'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <User className="w-4 h-4" />
            <span>My Profile</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Account Status</span>
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                </div>
                <p className="text-lg font-black text-slate-900 dark:text-white">Active & Verified</p>
                <p className="text-xs text-slate-500 mt-1">Google OAuth 2.0 Secure</p>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Saved Favorites</span>
                  <Bookmark className="w-5 h-5 text-blue-500" />
                </div>
                <p className="text-2xl font-black text-slate-900 dark:text-white">{savedBusinesses.length}</p>
                <p className="text-xs text-slate-500 mt-1">Bookmarked enterprises</p>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Primary Region</span>
                  <MapPin className="w-5 h-5 text-indigo-500" />
                </div>
                <p className="text-lg font-black text-slate-900 dark:text-white truncate">{currentUser.region || 'Greater Accra'}</p>
                <p className="text-xs text-slate-500 mt-1">Ghana Discovery Grid</p>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Authentication</span>
                  <Globe className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-lg font-black text-slate-900 dark:text-white truncate">
                  {currentUser.authProvider === 'google' ? 'Google Sign-In' : 'Secure Email'}
                </p>
                <p className="text-xs text-slate-500 mt-1">{currentUser.email}</p>
              </div>
            </div>

            {/* Personalized Recommendations Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                    <Award className="w-5 h-5 text-blue-600" />
                    Recommended For You
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">Top-rated verified enterprises matching your region and interests</p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('discover')}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1 cursor-pointer"
                >
                  <span>View All</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {recommendedBusinesses.map((biz) => {
                  const isSaved = savedBusinessIds.includes(biz.id);
                  return (
                    <div
                      key={biz.id}
                      onClick={() => onOpenBusinessDetails(biz)}
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={biz.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(biz.name)}&background=155DFC&color=fff`}
                              alt={biz.name}
                              referrerPolicy="no-referrer"
                              className="w-12 h-12 rounded-xl object-cover border border-slate-100 dark:border-slate-800 shadow-sm"
                            />
                            <div>
                              <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors line-clamp-1">
                                {biz.name}
                              </h3>
                              <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">{biz.category}</span>
                            </div>
                          </div>
                          
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleSaveBusiness(biz.id);
                            }}
                            className={`p-2 rounded-xl transition-colors cursor-pointer ${
                              isSaved
                                ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600'
                                : 'text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                          >
                            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-rose-500' : ''}`} />
                          </button>
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-4">
                          {biz.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                        <span className="flex items-center gap-1 text-slate-500">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {biz.city}, {biz.region}
                        </span>
                        <span className="flex items-center gap-1 font-bold text-amber-500">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          {biz.rating?.toFixed(1) || '5.0'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SAVED BUSINESSES */}
        {activeTab === 'saved' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Saved Favorites</h2>
                <p className="text-xs text-slate-500">Enterprises you have bookmarked for quick contact and review</p>
              </div>
              <span className="text-xs font-bold text-slate-500 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800">
                {savedBusinesses.length} Saved
              </span>
            </div>

            {savedBusinesses.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-8">
                <Bookmark className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">No Saved Businesses Yet</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mb-5">
                  Browse through the AuraCentra directory and click the bookmark icon on any business to save it here.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('discover')}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Discover Businesses Now
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {savedBusinesses.map((biz) => (
                  <div
                    key={biz.id}
                    onClick={() => onOpenBusinessDetails(biz)}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 rounded-2xl p-5 shadow-sm transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={biz.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(biz.name)}&background=155DFC&color=fff`}
                            alt={biz.name}
                            referrerPolicy="no-referrer"
                            className="w-12 h-12 rounded-xl object-cover border border-slate-100 dark:border-slate-800"
                          />
                          <div>
                            <h3 className="font-bold text-slate-900 dark:text-white line-clamp-1">{biz.name}</h3>
                            <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">{biz.category}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleSaveBusiness(biz.id);
                          }}
                          className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
                          title="Remove bookmark"
                        >
                          <Bookmark className="w-4 h-4 fill-rose-500" />
                        </button>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-4">{biz.description}</p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                      <span className="text-slate-500 flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5" />
                        {biz.phone || 'Available'}
                      </span>
                      <span className="font-bold text-blue-600 flex items-center gap-1">
                        View Details <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: NEARBY DISCOVERY */}
        {activeTab === 'discover' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Discover Nearby</h2>
                <p className="text-xs text-slate-500">Explore verified businesses across your region in Ghana</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={nearbySearch}
                    onChange={(e) => setNearbySearch(e.target.value)}
                    placeholder="Search businesses, services..."
                    className="pl-9 pr-4 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Category Quick Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
              <button
                type="button"
                onClick={() => setSelectedCategoryFilter('')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategoryFilter === ''
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                All Categories
              </button>
              {categories.slice(0, 8).map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategoryFilter(cat.name)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCategoryFilter === cat.name
                      ? 'bg-blue-600 text-white'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-blue-300'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {discoverBusinesses.map((biz) => (
                <div
                  key={biz.id}
                  onClick={() => onOpenBusinessDetails(biz)}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <img
                      src={biz.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(biz.name)}&background=155DFC&color=fff`}
                      alt={biz.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-28 rounded-xl object-cover mb-3"
                    />
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">{biz.name}</h3>
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold mb-2">{biz.category}</p>
                    <p className="text-xs text-slate-500 line-clamp-2">{biz.description}</p>
                  </div>

                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <span className="text-slate-500 truncate">{biz.city}</span>
                    <span className="font-bold text-blue-600">Open &rarr;</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: SECURITY & SESSIONS */}
        {activeTab === 'activity' && (
          <div className="max-w-3xl space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Security & Activity</h2>
              <p className="text-xs text-slate-500">Details regarding your Google authentication session and account protection</p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Active Google OAuth 2.0 Protection</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Your session is securely verified with Google Identity Services. Passwords are never stored on AuraCentra servers.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Authenticated Email</span>
                  <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{currentUser.email}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Provider Status</span>
                  <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {currentUser.authProvider === 'google' ? 'Google OAuth 2.0 Connected' : 'Email Verified'}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Member Since</span>
                  <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                    {currentUser.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : 'Active Member'}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Role Permission</span>
                  <p className="text-sm font-bold text-blue-600 dark:text-blue-400 mt-0.5 capitalize">
                    {currentUser.role === 'admin' ? 'Platform Administrator' : currentUser.role === 'business_owner' ? 'Business Owner' : 'Personal Customer'}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button
                  type="button"
                  onClick={onOpenAccountSettings}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                >
                  Manage Security & Danger Zone
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: MY PROFILE */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Personal Profile</h2>
                <p className="text-xs text-slate-500">Manage your contact information and preferences</p>
              </div>
              {!isEditingProfile && (
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
                >
                  Edit Profile
                </button>
              )}
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
              {isEditingProfile ? (
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      placeholder="+233 24 000 0000"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Region</label>
                    <select
                      value={editRegion}
                      onChange={(e) => setEditRegion(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Greater Accra">Greater Accra Region</option>
                      <option value="Ashanti">Ashanti Region</option>
                      <option value="Western">Western Region</option>
                      <option value="Central">Central Region</option>
                      <option value="Eastern">Eastern Region</option>
                      <option value="Volta">Volta Region</option>
                      <option value="Northern">Northern Region</option>
                      <option value="Upper East">Upper East Region</option>
                      <option value="Upper West">Upper West Region</option>
                      <option value="Bono">Bono Region</option>
                      <option value="Bono East">Bono East Region</option>
                      <option value="Ahafo">Ahafo Region</option>
                      <option value="Oti">Oti Region</option>
                      <option value="Savannah">Savannah Region</option>
                      <option value="North East">North East Region</option>
                      <option value="Western North">Western North Region</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Bio / About Me</label>
                    <textarea
                      value={editBio}
                      onChange={(e) => setEditBio(e.target.value)}
                      rows={3}
                      placeholder="Share a short note about yourself or your business interests..."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md cursor-pointer flex items-center gap-2"
                    >
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={currentUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=155DFC&color=fff`}
                      alt={currentUser.name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-500 shadow-md"
                    />
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">{currentUser.name}</h3>
                      <p className="text-xs text-slate-500">{currentUser.email}</p>
                      <span className="inline-block mt-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                        {currentUser.authProvider === 'google' ? 'Google Account' : 'Standard Member'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div>
                      <span className="text-xs font-semibold text-slate-400">Phone</span>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{currentUser.phone || 'Not provided'}</p>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-slate-400">Region</span>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{currentUser.region || 'Greater Accra'}</p>
                    </div>
                  </div>

                  {currentUser.bio && (
                    <div className="pt-2">
                      <span className="text-xs font-semibold text-slate-400">Bio</span>
                      <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">{currentUser.bio}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
