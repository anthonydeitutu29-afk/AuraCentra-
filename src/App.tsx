import React, { useState, useEffect, useMemo, useCallback, Suspense, lazy } from 'react';
import { 
  Building2, 
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
import { motion, AnimatePresence } from 'motion/react';
import { 
  Business, 
  Category, 
  BusinessReview, 
  UserProfile, 
  UserRole,
  FilterState,
  BusinessInquiry,
  ToastNotification,
  BusinessReport,
  CategorySuggestion,
  PlatformFeedback,
  GhanaNewsArticle
} from './types';
import { INITIAL_BUSINESSES } from './data/initialData';
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
  getStoredInquiries,
  saveInquiries,
  getStoredReports,
  saveReports,
  getStoredCategorySuggestions,
  saveCategorySuggestions,
  getStoredFeedback,
  saveFeedback,
  validateAndClearSession,
  saveRegisteredAccount,
  findRegisteredAccountByEmail,
  isDeletedBusiness,
  markBusinessPermanentlyApproved,
  unmarkBusinessPermanentlyApproved,
  markBusinessPermanentlyDeleted,
  unmarkBusinessPermanentlyDeleted,
  isBusinessPermanentlyApproved,
  getApprovedBusinessIds,
  isLegacyDeletedEmail,
  safeSetItem
} from './utils/storage';
import { autoDetectUserLocation, requestPreciseLocation, GHANA_REGIONS, calculateDistanceKm } from './utils/geolocationService';

// Subcomponents
import { Navbar } from './components/Navbar';
import { HeroSearch } from './components/HeroSearch';
import { CategoryExploreRow } from './components/CategoryExploreRow';
import { DiscoverBusinessesSection } from './components/DiscoverBusinessesSection';
import { TriColumnMainLayout } from './components/TriColumnMainLayout';
import { DualCtaBanner } from './components/DualCtaBanner';
import { AboutUsModal } from './components/AboutUsModal';
import { BusinessCard } from './components/BusinessCard';
import { BusinessDetailsModal } from './components/BusinessDetailsModal';
import { BusinessPage } from './components/BusinessPage';
import { BusinessComparisonModal } from './components/BusinessComparisonModal';
import { LocationMapModal } from './components/LocationMapModal';
import { AuthModal } from './components/AuthModal';
import { AuthPage } from './components/AuthPage';
import { EnlistBusinessPage } from './components/EnlistBusinessPage';
import { BusinessRegistrationModal } from './components/BusinessRegistrationModal';
import { SavedBusinessesModal } from './components/SavedBusinessesModal';
import { FloatingContactHub } from './components/FloatingContactHub';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/Toast';
import { QuoteInquiryModal } from './components/QuoteInquiryModal';
import { QRCodeShareModal } from './components/QRCodeShareModal';
import { VerificationCertificateModal } from './components/VerificationCertificateModal';
import { InquiriesManagerModal } from './components/InquiriesManagerModal';
import { PromotionalBanner } from './components/PromotionalBanner';
import { ScrollProgressBar } from './components/ScrollProgressBar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { SuggestCategoryModal } from './components/SuggestCategoryModal';
import { CustomerFeedbackModal } from './components/CustomerFeedbackModal';
import { GhanaBusinessNewsSection } from './components/GhanaBusinessNewsSection';
import { NewsArticleModal } from './components/NewsArticleModal';
import { SecureLogoutModal } from './components/SecureLogoutModal';
import { AccountSettingsModal } from './components/AccountSettingsModal';
import type { AboutPageTab } from './components/AboutPage';

// Code-split heavy views to load instantly on home view
const AdminDashboard = lazy(() => import('./components/AdminDashboard').then((m) => ({ default: m.AdminDashboard })));
const BusinessOwnerDashboard = lazy(() => import('./components/BusinessOwnerDashboard').then((m) => ({ default: m.BusinessOwnerDashboard })));
const PersonalAccountDashboard = lazy(() => import('./components/PersonalAccountDashboard').then((m) => ({ default: m.PersonalAccountDashboard })));
const GhanaNewsPage = lazy(() => import('./components/GhanaNewsPage').then((m) => ({ default: m.GhanaNewsPage })));
const SectorsPage = lazy(() => import('./components/SectorsPage').then((m) => ({ default: m.SectorsPage })));
const AboutPage = lazy(() => import('./components/AboutPage').then((m) => ({ default: m.AboutPage })));
const PricingPage = lazy(() => import('./components/PricingPage').then((m) => ({ default: m.PricingPage })));
const SupportHubPage = lazy(() => import('./components/SupportHubPage').then((m) => ({ default: m.SupportHubPage })));
const TermsPage = lazy(() => import('./components/TermsPage').then((m) => ({ default: m.TermsPage })));
const VerificationPage = lazy(() => import('./components/VerificationPage').then((m) => ({ default: m.VerificationPage })));
import { dispatchApprovalNotification, dispatchRejectionNotification } from './utils/notificationService';
import { generateRejectionEmailTemplate } from './utils/rejectionEmailGenerator';
import { useWhatsAppContact } from './hooks/useWhatsAppContact';
import { FirestoreSync } from './services/dbSync';
import { ApiClient } from './services/apiClient';
import { SupabaseService } from './lib/supabase';

export default function App() {
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('auracentra_theme') as 'light' | 'dark') || 'light';
  });

  // Core Data state
  const [businesses, setBusinesses] = useState<Business[]>(() => getStoredBusinesses().filter((b) => !isDeletedBusiness(b)));
  const [categories, setCategories] = useState<Category[]>(getStoredCategories);
  const [reviews, setReviews] = useState<BusinessReview[]>(getStoredReviews);
  const [inquiries, setInquiries] = useState<BusinessInquiry[]>(getStoredInquiries);
  const [reports, setReports] = useState<BusinessReport[]>(getStoredReports);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const user = getStoredCurrentUser();
    if (!user) return null;
    if (user.email?.toLowerCase() === 'admindashboard@gmail.com') return user;
    if (isLegacyDeletedEmail(user.email)) {
      saveCurrentUser(null);
      return null;
    }
    return user;
  });
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

  // View state: 'portal', 'admin', 'business_dashboard', 'personal_dashboard', 'auth', or 'enlist'
  const [currentView, setCurrentView] = useState<'portal' | 'admin' | 'business_dashboard' | 'personal_dashboard' | 'auth' | 'enlist'>('portal');
  const [authInitialMode, setAuthInitialMode] = useState<'signin' | 'signup'>('signin');
  const [targetDashboardBusinessId, setTargetDashboardBusinessId] = useState<string | null>(null);

  // Suggestions & Feedback State
  const [suggestions, setSuggestions] = useState<CategorySuggestion[]>(getStoredCategorySuggestions);
  const [feedback, setFeedback] = useState<PlatformFeedback[]>(getStoredFeedback);

  // Navigation section state: 'home' | 'news' | 'sectors' | 'pricing' | 'about' | 'support' | 'terms' | 'verification'
  const [currentNavTab, setCurrentNavTab] = useState<'home' | 'news' | 'sectors' | 'pricing' | 'about' | 'support' | 'terms' | 'verification'>('home');
  const [aboutPageTab, setAboutPageTab] = useState<AboutPageTab>('about');

  const handleOpenAboutPage = (tab: AboutPageTab = 'about') => {
    if (tab === 'pricing') {
      setCurrentNavTab('pricing');
      window.location.hash = '#pricing';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (tab === 'terms') {
      setCurrentNavTab('terms');
      window.location.hash = '#terms';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (tab === 'verification') {
      setCurrentNavTab('verification');
      window.location.hash = '#verification';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setAboutPageTab(tab);
    setAboutUsInitialTab(tab);
    setCurrentNavTab('about');
    window.location.hash = '#about';
    setIsAboutUsModalOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Modals state
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [selectedNewsArticle, setSelectedNewsArticle] = useState<GhanaNewsArticle | null>(null);
  const [isAboutUsModalOpen, setIsAboutUsModalOpen] = useState(false);
  const [aboutUsInitialTab, setAboutUsInitialTab] = useState<'about' | 'pricing' | 'verification' | 'terms'>('about');
  const [mapBusiness, setMapBusiness] = useState<Business | null>(null);
  const [quoteBusiness, setQuoteBusiness] = useState<Business | null>(null);
  const [qrBusiness, setQrBusiness] = useState<Business | null>(null);
  const [certBusiness, setCertBusiness] = useState<Business | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isInquiriesModalOpen, setIsInquiriesModalOpen] = useState(false);
  const [isSuggestCategoryOpen, setIsSuggestCategoryOpen] = useState(false);
  const [isCustomerFeedbackOpen, setIsCustomerFeedbackOpen] = useState(false);
  const [isSecureLogoutModalOpen, setIsSecureLogoutModalOpen] = useState(false);
  const [isAccountSettingsModalOpen, setIsAccountSettingsModalOpen] = useState(false);
  const [selectedBusinessForReview, setSelectedBusinessForReview] = useState<Business | null>(null);
  const [isSectorsModalOpen, setIsSectorsModalOpen] = useState(false);
  const [initialCategoryForSectors, setInitialCategoryForSectors] = useState<string | null>(null);
  const [newlyApprovedBizId, setNewlyApprovedBizId] = useState<string | null>(null);

  // Filters & Location Auto-Detection State
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
  const [isAutoDetectedRegion, setIsAutoDetectedRegion] = useState(false);
  const [userDetectedLocation, setUserDetectedLocation] = useState<{
    regionName: string;
    cityName: string;
    coords: { lat: number; lng: number };
  } | null>(null);

  // Auto-detect user's region via Browser Geolocation API on load
  useEffect(() => {
    autoDetectUserLocation().then((loc) => {
      setUserDetectedLocation({
        regionName: loc.regionName,
        cityName: loc.cityName,
        coords: loc.coords,
      });
      if (loc.isAutomatic) {
        setIsAutoDetectedRegion(true);
        setFilters((prev) => ({
          ...prev,
          userLat: loc.coords.lat,
          userLng: loc.coords.lng,
          // Keep prev.region so all regions across Ghana are displayed by default unless explicitly chosen
        }));
      }
    });
  }, [showToast]);

  const [isLocatingUser, setIsLocatingUser] = useState(false);

  // Explicit user GPS location request handler
  const handleRequestUserLocation = useCallback(async (notify: boolean = true) => {
    setIsLocatingUser(true);
    try {
      const loc = await requestPreciseLocation();
      setUserDetectedLocation({
        regionName: loc.regionName,
        cityName: loc.cityName,
        coords: loc.coords,
      });
      setIsAutoDetectedRegion(true);
      setFilters((prev) => ({
        ...prev,
        region: loc.regionName,
        userLat: loc.coords.lat,
        userLng: loc.coords.lng,
        sortBy: 'nearest',
      }));

      if (notify) {
        showToast(
          'Location Accessed Successfully',
          `GPS active: Displaying businesses and verified professionals near ${loc.cityName}, ${loc.regionName}!`,
          'success'
        );
      }
    } catch (err) {
      console.warn('Location detection warning:', err);
    } finally {
      setIsLocatingUser(false);
    }
  }, [showToast]);

  // Real-time Firestore sync & backend health check
  useEffect(() => {
    ApiClient.checkHealth().then((health) => {
      console.log('[AuraCentra Backend Connected]', health);
    });

    const unsubscribe = FirestoreSync.subscribeBusinesses((liveBusinesses) => {
      if (Array.isArray(liveBusinesses) && liveBusinesses.length > 0) {
        const cleanLive = liveBusinesses.filter((b) => !isDeletedBusiness(b));
        if (cleanLive.length === 0) {
          return;
        }

        setBusinesses((prev) => {
          const approvedIds = getApprovedBusinessIds();
          const map = new Map<string, Business>();
          // Only preserve fresh local businesses that aren't deleted
          prev.filter((b) => !isDeletedBusiness(b)).forEach((b) => map.set(b.id, b));
          
          cleanLive.forEach((b) => {
            const isApprovedGlobally = 
              approvedIds.has(b.id) || 
              b.isApproved === true || 
              b.permanentlyEnlisted === true || 
              b.listingStatus === 'active' || 
              b.verificationStatus === 'verified';

            const existing = map.get(b.id);
            if (existing) {
              const isLocalApproved = 
                isApprovedGlobally || 
                existing.listingStatus === 'active' || 
                existing.verificationStatus === 'verified' || 
                existing.isApproved === true || 
                existing.permanentlyEnlisted === true;

              map.set(b.id, {
                ...existing,
                ...b,
                listingStatus: isLocalApproved ? 'active' : b.listingStatus,
                isApproved: isLocalApproved ? true : b.isApproved,
                permanentlyEnlisted: true,
                verificationDetails: b.verificationDetails || existing.verificationDetails,
                coordinates: b.coordinates || existing.coordinates,
              });
              if (isLocalApproved) {
                markBusinessPermanentlyApproved(b.id);
              }
            } else {
              map.set(b.id, {
                ...b,
                listingStatus: isApprovedGlobally ? 'active' : (b.listingStatus || 'active'),
                isApproved: isApprovedGlobally ? true : (b.isApproved ?? true),
                permanentlyEnlisted: true
              });
              if (isApprovedGlobally) {
                markBusinessPermanentlyApproved(b.id);
              }
            }
          });

          const clean = Array.from(map.values()).filter((b) => !isDeletedBusiness(b));
          
          // Avoid triggering unnecessary React re-renders and storage thrash if data hasn't changed
          if (
            clean.length === prev.length &&
            clean.every((c, i) => 
              c.id === prev[i]?.id && 
              c.updatedAt === prev[i]?.updatedAt && 
              c.listingStatus === prev[i]?.listingStatus && 
              c.verificationStatus === prev[i]?.verificationStatus
            )
          ) {
            return prev;
          }

          saveBusinesses(clean);
          return clean;
        });
      }
    });

    return () => unsubscribe();
  }, []);

  // Sync theme with document class and color scheme
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      document.body.classList.add('dark');
      document.body.classList.remove('light');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      document.body.classList.remove('dark');
      document.body.classList.add('light');
      document.documentElement.style.colorScheme = 'light';
    }
    safeSetItem('auracentra_theme', theme);
  }, [theme]);

  // Handle URL hash navigation for business profile (e.g. #business-tonys-digital-marketing) and dashboard deep-links
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      
      // Authentication deep link (#login, #signup, #auth, #register)
      if (hash === '#auth' || hash === '#login' || hash === '#signin') {
        setSelectedBusiness(null);
        setAuthInitialMode('signin');
        setCurrentView('auth');
        document.title = 'Log In | AuraCentra Ghana';
        return;
      } else if (hash === '#signup' || hash === '#register') {
        setSelectedBusiness(null);
        setAuthInitialMode('signup');
        setCurrentView('auth');
        document.title = 'Sign Up | AuraCentra Ghana';
        return;
      } else if (hash === '#enlist' || hash === '#enlist-business' || hash === '#register-business' || hash === '#add-business') {
        setSelectedBusiness(null);
        setCurrentView('enlist');
        document.title = 'Enlist Your Business | AuraCentra Ghana';
        return;
      } else if (hash === '#news' || hash === '#business-news' || hash === '#forex' || hash === '#rates') {
        setSelectedBusiness(null);
        setCurrentNavTab('news');
        document.title = 'Ghana Business News & Live FX Exchange | AuraCentra';
        return;
      } else if (hash === '#sectors' || hash === '#categories') {
        setSelectedBusiness(null);
        setCurrentNavTab('sectors');
        document.title = 'Explore Ghana Business Sectors | AuraCentra';
        return;
      } else if (hash === '#pricing' || hash === '#packages' || hash === '#enlist-pricing') {
        setSelectedBusiness(null);
        setCurrentNavTab('pricing');
        document.title = 'Pricing & Enlistment Packages | AuraCentra Ghana';
        return;
      } else if (hash === '#verification' || hash === '#verify' || hash === '#ghana-card' || hash === '#integrity') {
        setSelectedBusiness(null);
        setCurrentNavTab('verification');
        document.title = 'Ghana Card Business Verification | AuraCentra Ghana';
        return;
      } else if (hash === '#about' || hash === '#about-us' || hash === '#mission') {
        setSelectedBusiness(null);
        setCurrentNavTab('about');
        document.title = 'About Us & National Mission | AuraCentra Ghana';
        return;
      } else if (hash === '#support' || hash === '#contact' || hash === '#help' || hash === '#tonys-hub') {
        setSelectedBusiness(null);
        setCurrentNavTab('support');
        document.title = "Tony's Support Hub & Direct Assistance | AuraCentra Ghana";
        return;
      } else if (hash === '#terms' || hash === '#privacy' || hash === '#trust' || hash === '#policy') {
        setSelectedBusiness(null);
        setCurrentNavTab('terms');
        document.title = 'Terms of Service & Trust Standards | AuraCentra Ghana';
        return;
      } else if (hash === '#home' || hash === '#explore' || hash === '') {
        setSelectedBusiness(null);
        if (currentView === 'enlist' || currentView === 'auth') {
          setCurrentView('portal');
        }
        setCurrentNavTab('home');
        document.title = 'AuraCentra Ghana • Verified Business Directory';
        return;
      }

      // Direct Link back to Business Dashboard to Edit and Resubmit (e.g. #dashboard-biz-123 or #edit-business-biz-123)
      if (hash.startsWith('#dashboard-') || hash.startsWith('#edit-business-')) {
        const idOrSlug = hash.replace('#dashboard-', '').replace('#edit-business-', '');
        const found = businesses.find((b) => b.id === idOrSlug || b.slug === idOrSlug) ||
                      getStoredBusinesses().find((b) => b.id === idOrSlug || b.slug === idOrSlug);
        if (found) {
          setTargetDashboardBusinessId(found.id);
          setSelectedBusiness(null);
          
          // Ensure the user has active session authority to edit this business
          setCurrentUser((prev) => {
            if (!prev) {
              const newOwner: UserProfile = {
                id: found.ownerId || `owner-${found.id}`,
                name: found.name,
                email: found.ownerEmail || found.email || 'business@auracentra.com',
                role: 'business_owner',
                accountType: 'business_owner',
                savedBusinessIds: [],
                ownedBusinessIds: [found.id],
                createdAt: new Date().toISOString()
              };
              saveCurrentUser(newOwner);
              return newOwner;
            } else if (!prev.ownedBusinessIds?.includes(found.id)) {
              const updated = {
                ...prev,
                ownedBusinessIds: [...(prev.ownedBusinessIds || []), found.id]
              };
              saveCurrentUser(updated);
              return updated;
            }
            return prev;
          });

          setCurrentView('business_dashboard');
          document.title = `Dashboard: ${found.name} | AuraCentra Ghana`;
        }
      } else if (hash.startsWith('#business-')) {
        const idOrSlug = hash.replace('#business-', '');
        const found = businesses.find((b) => b.id === idOrSlug || b.slug === idOrSlug);
        if (found) {
          setSelectedBusiness(found);
          document.title = `${found.name} | AuraCentra Ghana`;
        }
      } else if (!hash.includes('business-') && selectedBusiness) {
        setSelectedBusiness(null);
        document.title = 'AuraCentra | Verified Ghana Business Directory & Economic Hub';
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [businesses]);

  const handleSelectBusiness = (b: Business) => {
    setSelectedBusiness(b);
    window.location.hash = `business-${b.slug || b.id}`;
    document.title = `${b.name} | AuraCentra Ghana`;
  };

  const handleCloseBusinessPage = () => {
    setSelectedBusiness(null);
    if (window.location.hash.startsWith('#business-')) {
      window.history.pushState(null, '', window.location.pathname + window.location.search);
    }
    document.title = 'AuraCentra | Verified Ghana Business Directory & Economic Hub';
  };

  // Synchronize Live Profile and Admin Role from Supabase + Subscribe to Supabase Auth State
  useEffect(() => {
    // 1. Listen to Supabase Auth State Changes (OAuth logins, Session refreshes, Signouts)
    const { unsubscribe } = SupabaseService.onAuthStateChange(async (event, session) => {
      console.log('[Supabase Auth Event]', event, session?.user?.email);
      if (session?.user?.email) {
        const email = session.user.email.toLowerCase();
        const liveProfile = await SupabaseService.getProfile(email);
        const isAdmin = email === 'admindashboard@gmail.com';

        const updated: UserProfile = {
          id: session.user.id || liveProfile?.id || `usr-${Date.now()}`,
          name: liveProfile?.name || session.user.user_metadata?.name || email.split('@')[0],
          username: liveProfile?.username || session.user.user_metadata?.username || email.split('@')[0],
          email: email,
          emailVerified: true,
          phone: liveProfile?.phone || session.user.phone || '+233 24 000 0000',
          phoneVerified: true,
          role: isAdmin ? 'admin' : (liveProfile?.role || 'customer'),
          accountType: (liveProfile?.role === 'business_owner' || liveProfile?.role === 'verified_owner') ? 'business_owner' : 'customer',
          savedBusinessIds: liveProfile?.savedBusinessIds || [],
          avatar: liveProfile?.avatar || session.user.user_metadata?.avatar_url,
          authProvider: session.user.app_metadata?.provider || 'supabase',
          createdAt: liveProfile?.createdAt || session.user.created_at || new Date().toISOString(),
        };
        saveCurrentUser(updated);
        setCurrentUser(updated);
      } else if (event === 'SIGNED_OUT') {
        // Only clear if auth was strictly via Supabase
      }
    });

    // 2. Fetch live profile for current user
    if (currentUser?.email) {
      SupabaseService.getProfile(currentUser.email)
        .then((live) => {
          if (live) {
            const isAdmin = currentUser.email.toLowerCase() === 'admindashboard@gmail.com';
            const targetRole = isAdmin ? 'admin' : (live.role || 'customer');

            if (currentUser.role !== targetRole) {
              setCurrentUser((prev) => {
                if (!prev) return null;
                const updated: UserProfile = {
                  ...prev,
                  role: targetRole,
                  name: live.name || prev.name,
                  emailVerified: live.emailVerified ?? prev.emailVerified,
                  phoneVerified: live.phoneVerified ?? prev.phoneVerified,
                };
                saveCurrentUser(updated);
                return updated;
              });
            }
          }
        })
        .catch(() => {});
    }

    return () => {
      unsubscribe();
    };
  }, [currentUser?.email, currentUser?.role]);

  // Strict RBAC Guard: If non-admin attempts to access admin view, redirect immediately to portal
  useEffect(() => {
    if (currentView === 'admin' && currentUser?.role !== 'admin') {
      setCurrentView('portal');
    }
  }, [currentView, currentUser?.role]);

  // Check URL query parameters for email verification link landing
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const emailVerified = urlParams.get('email_verified');
      const verifiedEmail = urlParams.get('email');
      if (emailVerified === 'true') {
        showToast(
          'Email Verified Successfully!',
          verifiedEmail 
            ? `Your email address (${verifiedEmail}) is verified and your AuraCentra account is fully active.` 
            : 'Your email address is verified and active.',
          'success'
        );
        // If email verified, update account and automatically log user in
        if (verifiedEmail) {
          const cleanEmail = verifiedEmail.trim().toLowerCase();
          let acc = findRegisteredAccountByEmail(cleanEmail);
          
          if (!acc) {
            try {
              const pendingRaw = localStorage.getItem('auracentra_pending_signup');
              if (pendingRaw) {
                const pending = JSON.parse(pendingRaw);
                if (pending.email && pending.email.toLowerCase() === cleanEmail) {
                  acc = {
                    id: pending.id || `usr-${Date.now()}`,
                    name: pending.name || cleanEmail.split('@')[0],
                    username: pending.username || cleanEmail.split('@')[0],
                    email: cleanEmail,
                    password: pending.password,
                    role: pending.role || 'customer',
                    phone: pending.phone || '+233 24 000 0000',
                    phoneVerified: true,
                    emailVerified: true,
                    authProvider: 'email',
                    businessName: pending.businessName,
                    createdAt: new Date().toISOString(),
                  };
                  saveRegisteredAccount(acc);
                }
              }
            } catch {
              // ignore
            }
          }

          if (acc) {
            const verifiedAcc = { ...acc, emailVerified: true };
            saveRegisteredAccount(verifiedAcc);
            
            const userProfile: UserProfile = {
              id: verifiedAcc.id,
              name: verifiedAcc.name,
              username: verifiedAcc.username,
              email: verifiedAcc.email,
              emailVerified: true,
              phone: verifiedAcc.phone || '+233 24 000 0000',
              phoneVerified: true,
              role: verifiedAcc.role as UserRole,
              accountType: (verifiedAcc.role === 'business_owner' || verifiedAcc.role === 'verified_owner') ? 'business_owner' : 'customer',
              savedBusinessIds: [],
              createdAt: verifiedAcc.createdAt || new Date().toISOString(),
            };
            setCurrentUser(userProfile);
            saveCurrentUser(userProfile);
          } else {
            setCurrentUser((prev) => {
              if (prev && prev.email.toLowerCase() === cleanEmail) {
                const updated = { ...prev, emailVerified: true };
                saveCurrentUser(updated);
                return updated;
              }
              return prev;
            });
          }
        }
        // Clean URL query parameter without page reload
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
      }
    } catch (e) {
      console.warn('[URL verification param handler]', e);
    }
  }, [showToast]);

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
    saveReports(reports);
  }, [reports]);

  useEffect(() => {
    saveCategorySuggestions(suggestions);
  }, [suggestions]);

  useEffect(() => {
    saveFeedback(feedback);
  }, [feedback]);

  useEffect(() => {
    saveCurrentUser(currentUser);
  }, [currentUser]);

  useEffect(() => {
    safeSetItem('auracentra_saved_ids', JSON.stringify(savedBusinessIds));
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
    if (!query || !query.trim()) return;
    const clean = query.trim();
    setSearchHistory((prev) => {
      const filtered = prev.filter((item) => item.toLowerCase() !== clean.toLowerCase());
      const next = [clean, ...filtered].slice(0, 10);
      saveSearchHistory(next);
      return next;
    });
  };

  const handleRemoveSearchHistoryItem = (query: string) => {
    if (!query) return;
    setSearchHistory((prev) => {
      const next = prev.filter((item) => item.toLowerCase() !== query.toLowerCase());
      saveSearchHistory(next);
      return next;
    });
  };

  const handleClearSearchHistory = () => {
    setSearchHistory([]);
    clearStoredSearchHistory();
  };

  const handleOpenAuth = useCallback((mode: 'signin' | 'signup' = 'signin') => {
    setSelectedBusiness(null);
    setAuthInitialMode(mode);
    setCurrentView('auth');
    setIsAuthModalOpen(false);
    window.location.hash = mode === 'signup' ? '#signup' : '#login';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleOpenRegisterModal = useCallback(() => {
    setSelectedBusiness(null);
    setCurrentView('enlist');
    window.location.hash = '#enlist';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = 'Enlist Your Business | AuraCentra Ghana';
  }, []);

  const handleOpenSuggestCategoryModal = useCallback(() => {
    if (!currentUser) {
      handleOpenAuth('signin');
      showToast('Account Required', 'Please sign in or create an account to suggest categories.', 'info');
      return;
    }
    setIsSuggestCategoryOpen(true);
  }, [currentUser, handleOpenAuth, showToast]);

  const handleOpenCustomerFeedbackModal = useCallback((biz?: Business) => {
    if (!currentUser) {
      handleOpenAuth('signin');
      showToast('Account Required', 'Please sign in or create an account to rate businesses or leave platform feedback.', 'info');
      return;
    }
    setSelectedBusinessForReview(biz || null);
    setIsCustomerFeedbackOpen(true);
  }, [currentUser, handleOpenAuth, showToast]);

  const handleToggleSave = (businessId: string) => {
    if (!currentUser) {
      handleOpenAuth('signin');
      showToast('Sign In Required', 'Please sign in or create an account to save businesses to your profile.', 'info');
      return;
    }
    setSavedBusinessIds((prev) => {
      if (prev.includes(businessId)) {
        return prev.filter((id) => id !== businessId);
      } else {
        return [...prev, businessId];
      }
    });
  };

  const handleToggleCompare = (business: Business) => {
    const businessId = business.id;
    setComparedBusinessIds((prev) => {
      if (prev.includes(businessId)) {
        return prev.filter((id) => id !== businessId);
      } else {
        if (prev.length >= 3) {
          showToast('Comparison Limit', 'You can compare up to 3 businesses at a time.', 'warning');
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
    const nowIso = new Date().toISOString();
    const enlistedBusiness: Business = {
      ...newBusiness,
      // Auto-enlist on website immediately upon registration without admin pre-approval
      listingStatus: 'active',
      verificationStatus: newBusiness.verificationStatus || 'unverified',
      isApproved: true,
      permanentlyEnlisted: true,
      underInvestigation: false,
      enlistedAt: newBusiness.enlistedAt || nowIso,
      approvedAt: newBusiness.approvedAt || nowIso,
      updatedAt: nowIso
    };

    unmarkBusinessPermanentlyDeleted(enlistedBusiness.id);
    markBusinessPermanentlyApproved(enlistedBusiness.id);
    setNewlyApprovedBizId(enlistedBusiness.id);

    // Reset filters so the business is immediately visible on the home directory
    setFilters(initialFilters);

    setCurrentNavTab('home');
    setSelectedBusiness(null);
    setCurrentView('portal');

    setBusinesses((prev) => {
      const updated = [enlistedBusiness, ...prev.filter((b) => b.id !== enlistedBusiness.id)];
      saveBusinesses(updated);
      return updated;
    });

    FirestoreSync.saveBusiness(enlistedBusiness);
    ApiClient.createBusiness(enlistedBusiness).catch(() => {});

    showToast(
      'Business Enlisted & Live on Website',
      `"${enlistedBusiness.name}" is now automatically enlisted and live on AuraCentra Ghana.`,
      'success'
    );
  };

  const handleAddReview = (newReview: BusinessReview) => {
    setReviews((prevReviews) => {
      const updatedReviews = [newReview, ...prevReviews];
      saveReviews(updatedReviews);
      FirestoreSync.saveReview(newReview);

      // Recalculate business rating based exclusively on authentic user/business reviews
      setBusinesses((prev) => {
        const updated = prev.map((b) => {
          if (b.id === newReview.businessId) {
            const bizReviews = updatedReviews.filter((r) => r.businessId === b.id);
            const totalReviews = bizReviews.length;
            const sumRating = bizReviews.reduce((acc, curr) => acc + curr.rating, 0);
            const newAvgRating = totalReviews > 0 ? Number((sumRating / totalReviews).toFixed(1)) : 0;
            
            const updatedBiz: Business = {
              ...b,
              rating: newAvgRating,
              reviewCount: totalReviews,
              updatedAt: new Date().toISOString()
            };

            setSelectedBusiness((currentSelected) => {
              if (currentSelected && currentSelected.id === b.id) {
                return updatedBiz;
              }
              return currentSelected;
            });

            FirestoreSync.saveBusiness(updatedBiz);
            return updatedBiz;
          }
          return b;
        });
        saveBusinesses(updated);
        return updated;
      });

      return updatedReviews;
    });

    showToast(
      'Rating & Review Submitted!',
      `Your verified rating (${newReview.rating}★) for this business has been recorded.`,
      'success'
    );
  };

  const handleHelpfulVote = (reviewId: string) => {
    setReviews((prev) => {
      const updated = prev.map((r) => {
        if (r.id === reviewId) {
          return { ...r, helpfulCount: (r.helpfulCount || 0) + 1 };
        }
        return r;
      });
      saveReviews(updated);
      return updated;
    });
    showToast('Feedback Noted', 'Thank you for your vote on this review.', 'info');
  };

  const handleUpdateBusiness = (updated: Business) => {
    setBusinesses((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
    FirestoreSync.saveBusiness(updated);
    if (selectedBusiness && selectedBusiness.id === updated.id) {
      setSelectedBusiness(updated);
    }
  };

  const handleAddBusinessDirect = (newBiz: Business) => {
    const nowIso = new Date().toISOString();
    const enlistedBusiness: Business = {
      ...newBiz,
      listingStatus: 'active',
      isApproved: true,
      permanentlyEnlisted: true,
      underInvestigation: false,
      enlistedAt: newBiz.enlistedAt || nowIso,
      approvedAt: newBiz.approvedAt || nowIso,
      updatedAt: nowIso
    };
    unmarkBusinessPermanentlyDeleted(enlistedBusiness.id);
    markBusinessPermanentlyApproved(enlistedBusiness.id);
    setNewlyApprovedBizId(enlistedBusiness.id);
    setBusinesses((prev) => {
      const updated = [enlistedBusiness, ...prev.filter((b) => b.id !== enlistedBusiness.id)];
      saveBusinesses(updated);
      return updated;
    });
    FirestoreSync.saveBusiness(enlistedBusiness);
    ApiClient.createBusiness(enlistedBusiness).catch(() => {});
  };

  const handleDeleteBusiness = (businessId: string) => {
    unmarkBusinessPermanentlyApproved(businessId);
    markBusinessPermanentlyDeleted(businessId);
    setBusinesses((prev) => {
      const updated = prev.filter((b) => b.id !== businessId);
      saveBusinesses(updated);
      return updated;
    });
    if (selectedBusiness && selectedBusiness.id === businessId) {
      setSelectedBusiness(null);
    }
    // Delete from Firestore & Backend API
    FirestoreSync.deleteBusiness(businessId);
    ApiClient.deleteBusiness(businessId).catch(() => {});
    showToast(
      'Business Permanently Deleted',
      'The business listing has been permanently removed from the website and database.',
      'info'
    );
  };

  const handlePutOnInvestigation = (
    businessId: string, 
    reason: string = 'Under administrative investigation / probation', 
    adminNotes?: string
  ) => {
    unmarkBusinessPermanentlyApproved(businessId);
    const nowIso = new Date().toISOString();
    let updatedBiz: Business | null = null;

    setBusinesses((prev) => {
      const updated = prev.map((b) => {
        if (b.id === businessId) {
          updatedBiz = {
            ...b,
            listingStatus: 'probation',
            verificationStatus: 'investigation',
            underInvestigation: true,
            investigationReason: reason,
            investigationStartedAt: nowIso,
            isApproved: false,
            moderationNotes: adminNotes || reason,
            updatedAt: nowIso,
          };
          return updatedBiz;
        }
        return b;
      });
      saveBusinesses(updated);
      return updated;
    });

    if (updatedBiz) {
      FirestoreSync.saveBusiness(updatedBiz);
      ApiClient.moderateBusiness(businessId, 'investigate', adminNotes || reason, { business: updatedBiz }).catch(() => {});
      showToast(
        'Placed on Investigation / Probation',
        `"${(updatedBiz as Business).name}" has been placed on investigation/probation and taken down from the live website until verified.`,
        'warning'
      );
    }
  };

  const handleApproveVerification = (
    businessId: string, 
    badgeType: string = 'Gold Enterprise', 
    verifiedCoords?: { lat: number; lng: number },
    isFeatured?: boolean,
    businessObj?: Business
  ) => {
    // 1. Immediately mark permanently approved in storage
    markBusinessPermanentlyApproved(businessId);
    setNewlyApprovedBizId(businessId);

    const nowIso = new Date().toISOString();
    const shouldBeFeatured = isFeatured !== undefined ? isFeatured : true;

    // 2. Synchronously find current business from passed object, state or local storage
    const currentBiz: Business | undefined = 
      businessObj || 
      businesses.find((b) => b.id === businessId) || 
      getStoredBusinesses().find((b) => b.id === businessId);
    if (!currentBiz) return;

    const wasUnderInvestigation = Boolean(currentBiz.underInvestigation || currentBiz.listingStatus === 'probation');

    const approvedBiz: Business = {
      ...currentBiz,
      listingStatus: 'active', // Restored / Officially live on the site
      verificationStatus: 'verified',
      isApproved: true,
      permanentlyEnlisted: true,
      underInvestigation: false,
      investigationConcludedAt: wasUnderInvestigation ? nowIso : currentBiz.investigationConcludedAt,
      isFeatured: shouldBeFeatured, // Configured by admin (Featured vs Standard)
      enlistedAt: currentBiz.enlistedAt || nowIso,
      approvedAt: nowIso,
      updatedAt: nowIso,
      coordinates: verifiedCoords || currentBiz.coordinates,
      verificationDetails: {
        ...(currentBiz.verificationDetails || {
          tinNumber: 'TIN-GH-882194',
          businessRegNumber: 'BN-GH-2024-9128',
          verifiedByAdmin: 'Executive Desk',
        }),
        verifiedAt: nowIso,
        badgeType: (badgeType as any) || 'Gold Enterprise',
        gpsVerified: true,
      },
      verificationDocuments: currentBiz.verificationDocuments?.map((d) => ({
        ...d,
        status: 'verified',
        reviewedAt: nowIso,
      })) || [],
    };


    // 3. Update React state and immediate permanent storage
    setBusinesses((prev) => {
      const exists = prev.some((b) => b.id === businessId);
      const updated = exists
        ? prev.map((b) => (b.id === businessId ? approvedBiz : b))
        : [approvedBiz, ...prev];
      saveBusinesses(updated);
      return updated;
    });

    // Also synchronously update selectedBusiness if active
    setSelectedBusiness((prev) => (prev?.id === businessId ? approvedBiz : prev));

    // 4. Guarantee persistent Supabase and Express backend sync with full business payload
    FirestoreSync.saveBusiness(approvedBiz);
    ApiClient.moderateBusiness(businessId, 'approve', undefined, {
      badgeType,
      isFeatured: shouldBeFeatured,
      coordinates: verifiedCoords || approvedBiz.coordinates,
      business: approvedBiz
    }).catch((err) => console.warn('[ApiClient Moderate Error]', err));

    dispatchApprovalNotification(approvedBiz, badgeType);

    showToast(
      'Business Approved & Live on Website',
      `"${approvedBiz.name}" is now permanently published in its category (${approvedBiz.category || 'General'}) and all general categories (Trending, Popular Near You, Newly Verified).`,
      'success'
    );
  };

  const handleRejectVerification = (
    businessId: string,
    reason: string,
    resolutionGuide?: string,
    adminNotes?: string
  ) => {
    const currentBiz: Business | undefined = businesses.find((b) => b.id === businessId) || 
                                 getStoredBusinesses().find((b) => b.id === businessId);
    if (!currentBiz) return;

    const nowIso = new Date().toISOString();

    // 1. Direct Link back to their business dashboard to edit and resubmit
    const origin = typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : 'https://auracentra.com';
    const directDashboardUrl = `${origin}/#dashboard-${currentBiz.id}`;

    // 2. Automated Email Template Generator that pulls rejection reason, resolution guide & direct link
    const emailTemplate = generateRejectionEmailTemplate({
      business: currentBiz,
      reason,
      resolutionGuide,
      adminNotes,
      directDashboardUrl,
    });

    const rejectedBiz: Business = {
      ...currentBiz,
      listingStatus: 'rejected',
      verificationStatus: 'rejected',
      isApproved: false,
      permanentlyEnlisted: false,
      rejectionReason: reason,
      rejectionResolutionGuide: resolutionGuide,
      rejectionAdminNotes: adminNotes,
      lastRejectionEmail: emailTemplate,
      updatedAt: nowIso,
      verificationDocuments: currentBiz.verificationDocuments?.map((d) => ({
        ...d,
        status: 'rejected',
        rejectionReason: reason,
        reviewedAt: nowIso,
      })) || [],
    };

    setBusinesses((prev) => {
      const updated = prev.map((b) => (b.id === businessId ? rejectedBiz : b));
      saveBusinesses(updated);
      return updated;
    });

    FirestoreSync.saveBusiness(rejectedBiz);
    ApiClient.moderateBusiness(businessId, 'reject', reason, { 
      business: rejectedBiz,
      emailTemplate,
      directDashboardUrl,
    }).catch(() => {});
    
    dispatchRejectionNotification(rejectedBiz, reason, resolutionGuide, adminNotes, emailTemplate);

    showToast(
      'Listing Rejected & Email Template Generated',
      `Automated email notice with direct edit link generated for "${currentBiz.name}". Owner can edit and resubmit via their dashboard.`,
      'warning'
    );

    return emailTemplate;
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
    if (!currentUser) return;
    setIsSecureLogoutModalOpen(true);
  };

  const handleConfirmLogout = async () => {
    try {
      await validateAndClearSession();
      await SupabaseService.signOut();
    } catch {
      // Ignore
    }
    setCurrentUser(null);
    setCurrentView('portal');
    setIsSecureLogoutModalOpen(false);
    showToast('Signed Out Safely', 'Your account session has been verified and securely terminated.', 'info');
  };

  const handleAccountDeleted = useCallback(() => {
    setCurrentUser(null);
    setCurrentView('portal');
    setIsAccountSettingsModalOpen(false);
    // Reload local data stores to reflect deleted entities
    setBusinesses(getStoredBusinesses());
    setReviews(getStoredReviews());
    setInquiries(getStoredInquiries());
    setSavedBusinessIds([]);
  }, []);

  // Feature Handlers
  const handleShareBusiness = useCallback((business: Business) => {
    const shareData = {
      title: `${business.name} - AuraCentra Ghana`,
      text: `Discover ${business.name} on AuraCentra Ghana: ${business.tagline || business.description}`,
      url: `${window.location.origin}/#business-${business.id}`,
    };

    if (navigator.share) {
      navigator.share(shareData).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareData.url);
      showToast('Link Copied!', `Direct profile link for ${business.name} copied to clipboard.`, 'success');
    }
  }, [showToast]);

  const handleSharePlatform = useCallback(() => {
    const shareData = {
      title: 'AuraCentra Ghana - Connect • Discover • Grow',
      text: 'A digital platform where businesses enlist and customers get access to what they need, without stress.',
      url: window.location.origin,
    };

    if (navigator.share) {
      navigator.share(shareData).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareData.url);
      showToast('Platform Link Copied!', 'AuraCentra link copied to clipboard. Share with friends and entrepreneurs!', 'success');
    }
  }, [showToast]);

  const handleOpenQuote = useCallback((business: Business) => {
    if (!currentUser) {
      handleOpenAuth('signin');
      showToast('Sign In Required', 'Please sign in or create an account to request quotes from businesses.', 'info');
      return;
    }
    setQuoteBusiness(business);
  }, [currentUser, handleOpenAuth, showToast]);

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

  const handleReportBusiness = useCallback((reportData: {
    businessId: string;
    businessName: string;
    reporterName?: string;
    reporterEmail?: string;
    reporterPhone?: string;
    reason: any;
    reasonLabel: string;
    details: string;
  }) => {
    const newReport: BusinessReport = {
      id: `rep-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      ...reportData,
      reportedAt: new Date().toISOString(),
      status: 'pending',
    };
    setReports((prev) => [newReport, ...prev]);
    showToast(
      'Report Submitted Successfully',
      `Your report for ${reportData.businessName} has been logged and queued for admin review.`,
      'success'
    );
  }, [showToast]);

  const handleUpdateReportStatus = useCallback((
    reportId: string, 
    status: BusinessReport['status'], 
    adminNotes?: string
  ) => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === reportId
          ? {
              ...r,
              status,
              adminNotes: adminNotes !== undefined ? adminNotes : r.adminNotes,
              resolvedAt: new Date().toISOString(),
            }
          : r
      )
    );
    showToast('Report Updated', `Report flagged status marked as ${status.replace('_', ' ')}.`, 'info');
  }, [showToast]);

  const handleDeleteReport = useCallback((reportId: string) => {
    setReports((prev) => prev.filter((r) => r.id !== reportId));
    showToast('Report Deleted', 'The report record has been removed.', 'info');
  }, [showToast]);

  // Suggestion & Feedback Handlers
  const handleSubmitCategorySuggestion = useCallback((suggestionData: {
    categoryName: string;
    industry: string;
    description: string;
    exampleBusinesses?: string;
    suggestedBy: string;
    userEmail?: string;
  }) => {
    const newSuggestion: CategorySuggestion = {
      id: `sug-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      ...suggestionData,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setSuggestions((prev) => [newSuggestion, ...prev]);
    showToast('Suggestion Submitted!', `Thank you! "${suggestionData.categoryName}" has been submitted for review.`, 'success');
  }, [showToast]);

  const handleSubmitCustomerFeedback = useCallback((feedbackData: {
    type: 'general' | 'business_review' | 'bug_report' | 'feature_request';
    rating?: number;
    targetBusinessId?: string;
    targetBusinessName?: string;
    name: string;
    email?: string;
    subject: string;
    message: string;
  }) => {
    const newFeedback: PlatformFeedback = {
      id: `fb-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      ...feedbackData,
      status: 'new',
      createdAt: new Date().toISOString(),
    };
    setFeedback((prev) => [newFeedback, ...prev]);
    showToast('Feedback Received!', 'Thank you! Your review has been recorded to help the Ghanaian community.', 'success');
  }, [showToast]);

  const handleApproveAndCreateCategory = useCallback((suggestion: CategorySuggestion) => {
    const newCatId = suggestion.categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newCategory: Category = {
      id: newCatId,
      name: suggestion.categoryName,
      slug: newCatId,
      iconName: 'Building2',
      itemCount: 0,
      description: suggestion.description,
    };
    setCategories((prev) => [...prev, newCategory]);
    setSuggestions((prev) =>
      prev.map((s) => (s.id === suggestion.id ? { ...s, status: 'approved' } : s))
    );
    showToast('Category Approved & Live', `"${suggestion.categoryName}" is now active in the directory!`, 'success');
  }, [showToast]);

  const handleUpdateSuggestionStatus = useCallback((suggestionId: string, status: CategorySuggestion['status'], adminNotes?: string) => {
    setSuggestions((prev) =>
      prev.map((s) => (s.id === suggestionId ? { ...s, status, adminNotes } : s))
    );
    showToast('Suggestion Status Updated', `Status marked as ${status}.`, 'info');
  }, [showToast]);

  const handleDeleteSuggestion = useCallback((suggestionId: string) => {
    setSuggestions((prev) => prev.filter((s) => s.id !== suggestionId));
    showToast('Suggestion Deleted', 'Suggestion record removed.', 'info');
  }, [showToast]);

  const handleUpdateFeedbackStatus = useCallback((feedbackId: string, status: PlatformFeedback['status'], adminReply?: string) => {
    setFeedback((prev) =>
      prev.map((f) => (f.id === feedbackId ? { ...f, status, adminReply } : f))
    );
    showToast('Feedback Updated', `Status marked as ${status}.`, 'info');
  }, [showToast]);

  const handleDeleteFeedback = useCallback((feedbackId: string) => {
    setFeedback((prev) => prev.filter((f) => f.id !== feedbackId));
    showToast('Feedback Deleted', 'Feedback record removed.', 'info');
  }, [showToast]);

  const getBusinessDistance = useCallback((biz: Business) => {
    const lat = biz.coordinates?.lat ?? 5.6037;
    const lng = biz.coordinates?.lng ?? -0.1870;
    if (filters.userLat && filters.userLng) {
      return calculateDistanceKm(filters.userLat, filters.userLng, lat, lng);
    }
    if (filters.sortBy === 'nearest') {
      return calculateDistanceKm(5.6037, -0.1870, lat, lng);
    }
    return undefined;
  }, [filters.userLat, filters.userLng, filters.sortBy]);

  // Compute filtered & sorted businesses
  const filteredBusinesses = useMemo(() => {
    return businesses.filter((b) => {
      if (!b || isDeletedBusiness(b)) return false;
      
      // Strict rule: businesses on investigation / probation or rejected are NOT on the live website
      const isUnderInvestigation = 
        b.listingStatus === 'probation' || 
        b.listingStatus === 'under_investigation' || 
        b.verificationStatus === 'investigation' || 
        Boolean(b.underInvestigation);

      if (isUnderInvestigation || b.listingStatus === 'rejected' || b.verificationStatus === 'rejected' || b.listingStatus !== 'active') {
        return false;
      }

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
      if (filters.category && filters.category !== 'All Categories' && filters.category !== 'all' && filters.category.trim() !== '') {
        const target = filters.category.trim().toLowerCase();
        const bCat = (b.category || '').trim().toLowerCase();
        const isExactMatch = bCat === target;
        const isMarketingMatch = 
          (target.includes('market') || target.includes('digital')) &&
          (bCat.includes('market') || bCat.includes('digital'));
        if (!isExactMatch && !isMarketingMatch) {
          const targetCatObj = categories.find(
            (c) => c.id.toLowerCase() === target || c.name.toLowerCase() === target || c.slug.toLowerCase() === target
          );
          const bCatObj = categories.find(
            (c) => c.id.toLowerCase() === bCat || c.name.toLowerCase() === bCat || c.slug.toLowerCase() === bCat
          );
          if (!(targetCatObj && bCatObj && targetCatObj.id === bCatObj.id)) {
            return false;
          }
        }
      }

      // Region filter
      if (filters.region && filters.region !== 'All Regions' && filters.region !== '') {
        const targetRegion = filters.region.toLowerCase();
        const matchesRegionField = b.region && b.region.toLowerCase().includes(targetRegion);
        const regInfo = GHANA_REGIONS.find((r) => r.name.toLowerCase() === targetRegion);
        const matchesCityInRegion = regInfo?.cities.some((c) => 
          (b.city && b.city.toLowerCase().includes(c.toLowerCase())) || 
          (b.address && b.address.toLowerCase().includes(c.toLowerCase()))
        );
        if (!matchesRegionField && !matchesCityInRegion) {
          return false;
        }
      }

      // City filter
      if (filters.city && filters.city !== 'All Cities' && filters.city !== '' && b.city !== filters.city) {
        return false;
      }

      // Verified only
      if (filters.verificationOnly && b.verificationStatus !== 'verified') {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'nearest') {
        const userLat = filters.userLat || 5.6037;
        const userLng = filters.userLng || -0.1870;
        const distA = calculateDistanceKm(userLat, userLng, a.coordinates?.lat ?? 5.6037, a.coordinates?.lng ?? -0.1870);
        const distB = calculateDistanceKm(userLat, userLng, b.coordinates?.lat ?? 5.6037, b.coordinates?.lng ?? -0.1870);
        return distA - distB;
      }
      if (filters.sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      if (filters.sortBy === 'leads') {
        return (b.leadsCount || 0) - (a.leadsCount || 0);
      }
      // default: verified first, then newest
      if (a.verificationStatus === 'verified' && b.verificationStatus !== 'verified') return -1;
      if (a.verificationStatus !== 'verified' && b.verificationStatus === 'verified') return 1;
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });
  }, [businesses, filters]);

  const comparedBusinesses = useMemo(() => {
    return businesses.filter((b) => 
      comparedBusinessIds.includes(b.id) && 
      b.listingStatus === 'active' && 
      !b.underInvestigation && 
      b.verificationStatus !== 'rejected'
    );
  }, [businesses, comparedBusinessIds]);

  const savedBusinesses = useMemo(() => {
    return businesses.filter((b) => 
      savedBusinessIds.includes(b.id) && 
      b.listingStatus === 'active' && 
      !b.underInvestigation && 
      b.verificationStatus !== 'rejected'
    );
  }, [businesses, savedBusinessIds]);

  // Executive Spotlight businesses
  const executiveBusinesses = useMemo(() => {
    return businesses.filter((b) => 
      b.isFeatured && 
      b.listingStatus === 'active' && 
      !b.underInvestigation && 
      b.verificationStatus !== 'rejected'
    );
  }, [businesses]);

  // If in Admin Dashboard view
  if (currentView === 'admin') {
    if (!currentUser || currentUser.role !== 'admin' || currentUser.email.toLowerCase() !== 'admindashboard@gmail.com') {
      setCurrentView('portal');
      return null;
    }
    return (
      <div className={theme === 'dark' ? 'dark' : ''}>
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950"><div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>}>
          <AdminDashboard
            currentUser={currentUser}
            businesses={businesses}
            categories={categories}
            reports={reports}
            suggestions={suggestions}
            feedback={feedback}
            showExecutiveSection={showExecutiveSection}
            onToggleExecutiveSection={handleToggleExecutiveSection}
            onUpdateBusiness={handleUpdateBusiness}
            onAddBusiness={handleAddBusinessDirect}
            onDeleteBusiness={handleDeleteBusiness}
            onPutOnInvestigation={handlePutOnInvestigation}
            onApproveVerification={handleApproveVerification}
            onRejectVerification={handleRejectVerification}
            onAddCategory={handleAddCategory}
            onDeleteCategory={handleDeleteCategory}
            onUpdateReportStatus={handleUpdateReportStatus}
            onDeleteReport={handleDeleteReport}
            onUpdateSuggestionStatus={handleUpdateSuggestionStatus}
            onDeleteSuggestion={handleDeleteSuggestion}
            onApproveAndCreateCategory={handleApproveAndCreateCategory}
            onUpdateFeedbackStatus={handleUpdateFeedbackStatus}
            onDeleteFeedback={handleDeleteFeedback}
            onShowToast={showToast}
            onOpenRegisterModal={handleOpenRegisterModal}
            onSelectBusiness={handleSelectBusiness}
            onSignOut={handleSignOut}
            onBackToPortal={() => setCurrentView('portal')}
          />
        </Suspense>
      </div>
    );
  }


  // If in Business Owner Dashboard view
  if (currentView === 'business_dashboard' && currentUser) {
    return (
      <div className={theme === 'dark' ? 'dark' : ''}>
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950"><div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>}>
          <BusinessOwnerDashboard
            currentUser={currentUser}
            businesses={businesses}
            categories={categories}
            inquiries={inquiries}
            reviews={reviews}
            initialBusinessId={targetDashboardBusinessId || undefined}
            onUpdateBusiness={handleUpdateBusiness}
            onAddBusiness={handleAddBusinessDirect}
            onDeleteBusiness={handleDeleteBusiness}
            onOpenAccountSettings={() => setIsAccountSettingsModalOpen(true)}
            onShowToast={showToast}
            onBackToPortal={() => setCurrentView('portal')}
            onSignOut={handleSignOut}
            onOpenLivePreview={(b) => {
              handleSelectBusiness(b);
              setCurrentView('portal');
            }}
            onOpenCertificateModal={(b) => {
              setCertBusiness(b);
            }}
          />
        </Suspense>
        <AccountSettingsModal
          isOpen={isAccountSettingsModalOpen}
          currentUser={currentUser}
          businesses={businesses}
          onClose={() => setIsAccountSettingsModalOpen(false)}
          onAccountDeleted={handleAccountDeleted}
          onShowToast={showToast}
          onOpenBusiness={(b) => {
            handleSelectBusiness(b);
            setCurrentView('portal');
          }}
        />
        <VerificationCertificateModal
          business={certBusiness}
          isOpen={!!certBusiness}
          onClose={() => setCertBusiness(null)}
          onShowToast={showToast}
        />
        <SecureLogoutModal
          isOpen={isSecureLogoutModalOpen}
          currentUser={currentUser}
          onClose={() => setIsSecureLogoutModalOpen(false)}
          onConfirmLogout={handleConfirmLogout}
        />
        <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      </div>
    );
  }

  // If in Personal Account Dashboard view
  if (currentView === 'personal_dashboard' && currentUser) {
    return (
      <div className={theme === 'dark' ? 'dark' : ''}>
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950"><div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>}>
          <PersonalAccountDashboard
            currentUser={currentUser}
            businesses={businesses}
            categories={categories}
            savedBusinessIds={savedBusinessIds}
            onUpdateProfile={(updated) => {
              const next = { ...currentUser, ...updated };
              setCurrentUser(next);
              saveCurrentUser(next);
              showToast('Profile Updated', 'Your profile details have been saved.', 'success');
            }}
            onToggleSaveBusiness={handleToggleSave}
            onOpenBusinessDetails={(biz) => {
              handleSelectBusiness(biz);
            }}
            onOpenBusinessDashboard={() => setCurrentView('business_dashboard')}
            onOpenAccountSettings={() => setIsAccountSettingsModalOpen(true)}
            onBackToPortal={() => setCurrentView('portal')}
            onSignOut={handleSignOut}
            onShowToast={showToast}
          />
        </Suspense>
        {selectedBusiness && (
          <BusinessDetailsModal
            business={selectedBusiness}
            isOpen={!!selectedBusiness}
            onClose={handleCloseBusinessPage}
            isSaved={savedBusinessIds.includes(selectedBusiness.id)}
            onToggleSave={handleToggleSave}
            isCompared={comparedBusinessIds.includes(selectedBusiness.id)}
            onToggleCompare={handleToggleCompare}
            onOpenMap={(b) => setMapBusiness(b)}
            onOpenQuote={handleOpenQuote}
            onOpenQR={handleOpenQR}
            onOpenCertificate={handleOpenCert}
            onReportBusiness={handleReportBusiness}
            currentUser={currentUser}
            onShowToast={showToast}
            reviews={reviews}
            onAddReview={handleAddReview}
            onHelpfulVote={handleHelpfulVote}
          />
        )}
        <AccountSettingsModal
          isOpen={isAccountSettingsModalOpen}
          currentUser={currentUser}
          businesses={businesses}
          onClose={() => setIsAccountSettingsModalOpen(false)}
          onAccountDeleted={handleAccountDeleted}
          onShowToast={showToast}
          onOpenBusiness={(b) => {
            setSelectedBusiness(b);
            setCurrentView('portal');
          }}
        />
        <SecureLogoutModal
          isOpen={isSecureLogoutModalOpen}
          currentUser={currentUser}
          onClose={() => setIsSecureLogoutModalOpen(false)}
          onConfirmLogout={handleConfirmLogout}
        />
        <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      </div>
    );
  }

  // Dedicated Full-Page View for Authentication (Lies Directly on Background - No Floating Card)
  if (currentView === 'auth') {
    return (
      <div className={theme === 'dark' ? 'dark' : ''}>
        <AuthPage
          initialMode={authInitialMode}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          onBackToPortal={() => {
            setCurrentView('portal');
            if (window.location.hash === '#auth' || window.location.hash === '#login' || window.location.hash === '#signup' || window.location.hash === '#register') {
              window.history.pushState(null, '', window.location.pathname + window.location.search);
            }
          }}
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            if (window.location.hash === '#auth' || window.location.hash === '#login' || window.location.hash === '#signup' || window.location.hash === '#register') {
              window.history.pushState(null, '', window.location.pathname + window.location.search);
            }
            if (user.role === 'business_owner' || user.role === 'verified_owner' || (user.ownedBusinessIds && user.ownedBusinessIds.length > 0)) {
              setCurrentView('business_dashboard');
              showToast('Welcome to your Business Dashboard!', `Managing your business listings as ${user.name}`, 'success');
            } else if (user.role === 'admin') {
              setCurrentView('admin');
              showToast('Admin Console Active', `Signed in as Platform Administrator ${user.name}`, 'info');
            } else {
              setCurrentView('personal_dashboard');
              showToast('Welcome Back!', `Signed in as ${user.name}`, 'success');
            }
          }}
        />
        <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      </div>
    );
  }

  // Dedicated Full-Page View for Enlisting a Business (Lies Directly on Background - No Floating Card)
  if (currentView === 'enlist') {
    return (
      <div className={theme === 'dark' ? 'dark' : ''}>
        <EnlistBusinessPage
          categories={categories}
          currentUser={currentUser}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          onBackToPortal={() => {
            setCurrentView('portal');
            if (window.location.hash === '#enlist' || window.location.hash === '#register-business' || window.location.hash === '#enlist-business' || window.location.hash === '#add-business') {
              window.history.pushState(null, '', window.location.pathname + window.location.search);
            }
          }}
          onRegisterBusiness={(newBiz) => {
            handleRegisterBusiness(newBiz);
            showToast('Business Enlisted Successfully!', `${newBiz.name} is now listed on AuraCentra Ghana.`, 'success');
          }}
          onOpenAuth={(mode) => handleOpenAuth(mode)}
          onOpenBusinessDashboard={() => {
            setCurrentView('business_dashboard');
          }}
          onSelectBusiness={(biz) => {
            setCurrentView('portal');
            handleSelectBusiness(biz);
          }}
        />
        <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 overflow-x-hidden ${theme === 'dark' ? 'dark' : ''}`} id="auracentra-app-root">
      {/* 0. Subtle Exploration Progress Bar at the Very Top of Screen */}
      <ScrollProgressBar />

      {/* 1. Global Navigation Bar matching Image 1 */}
      <Navbar
        currentSection={currentNavTab}
        onNavigateSection={(sec) => {
          setCurrentNavTab(sec);
          window.location.hash = sec === 'home' ? '' : `#${sec}`;
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSectors={() => {
          setCurrentNavTab('sectors');
          window.location.hash = '#sectors';
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAboutUs={() => {
          setCurrentNavTab('about');
          window.location.hash = '#about';
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenPricing={() => {
          setCurrentNavTab('pricing');
          window.location.hash = '#pricing';
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSupport={() => {
          setCurrentNavTab('support');
          window.location.hash = '#support';
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenTerms={() => {
          setCurrentNavTab('terms');
          window.location.hash = '#terms';
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenVerification={() => {
          setCurrentNavTab('verification');
          window.location.hash = '#verification';
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        currentUser={currentUser}
        savedCount={savedBusinessIds.length}
        comparedCount={comparedBusinessIds.length}
        inquiriesCount={inquiries.filter((i) => i.status === 'new').length}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenAuth={() => handleOpenAuth('signin')}
        onOpenRegister={handleOpenRegisterModal}
        onOpenSavedModal={() => setIsSavedModalOpen(true)}
        onOpenCompareModal={() => setIsCompareModalOpen(true)}
        onOpenInquiriesModal={() => setIsInquiriesModalOpen(true)}
        onOpenAdminDashboard={() => setCurrentView('admin')}
        onOpenBusinessDashboard={() => setCurrentView('business_dashboard')}
        onOpenPersonalDashboard={() => setCurrentView('personal_dashboard')}
        onOpenAccountSettings={() => setIsAccountSettingsModalOpen(true)}
        onSignOut={handleSignOut}
        onSharePlatform={handleSharePlatform}
      />

      {/* Conditional Rendering: Dedicated Business Profile Page (Directly on Background) OR News View OR Sectors Page OR Home Discovery Flow */}
      {selectedBusiness ? (
        <BusinessPage
          business={selectedBusiness}
          onBack={handleCloseBusinessPage}
          isSaved={savedBusinessIds.includes(selectedBusiness.id)}
          onToggleSave={handleToggleSave}
          isCompared={comparedBusinessIds.includes(selectedBusiness.id)}
          onToggleCompare={handleToggleCompare}
          onOpenMap={(b) => setMapBusiness(b)}
          onOpenQuote={handleOpenQuote}
          onOpenQR={handleOpenQR}
          onOpenCertificate={handleOpenCert}
          onReportBusiness={handleReportBusiness}
          currentUser={currentUser}
          onShowToast={showToast}
          reviews={reviews}
          onAddReview={handleAddReview}
          onHelpfulVote={handleHelpfulVote}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          onOpenAuth={() => handleOpenAuth('signin')}
          onOpenRegister={handleOpenRegisterModal}
          onOpenAdminDashboard={() => {
            setSelectedBusiness(null);
            setCurrentView('admin');
          }}
          onOpenBusinessDashboard={() => {
            setSelectedBusiness(null);
            setCurrentView('business_dashboard');
          }}
          onOpenPersonalDashboard={() => {
            setSelectedBusiness(null);
            setCurrentView('personal_dashboard');
          }}
        />
      ) : currentNavTab === 'pricing' ? (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950"><div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>}>
          <PricingPage
            onBackToHome={() => {
              setCurrentNavTab('home');
              window.location.hash = '';
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenRegister={handleOpenRegisterModal}
            onShowToast={showToast}
          />
        </Suspense>
      ) : currentNavTab === 'verification' ? (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950"><div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>}>
          <VerificationPage
            onBackToHome={() => {
              setCurrentNavTab('home');
              window.location.hash = '';
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenRegister={handleOpenRegisterModal}
            onShowToast={showToast}
          />
        </Suspense>
      ) : currentNavTab === 'support' ? (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950"><div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>}>
          <SupportHubPage
            onBackToHome={() => {
              setCurrentNavTab('home');
              window.location.hash = '';
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenRegister={handleOpenRegisterModal}
            onShowToast={showToast}
          />
        </Suspense>
      ) : currentNavTab === 'terms' ? (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950"><div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>}>
          <TermsPage
            onBackToHome={() => {
              setCurrentNavTab('home');
              window.location.hash = '';
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenRegister={handleOpenRegisterModal}
            onShowToast={showToast}
          />
        </Suspense>
      ) : currentNavTab === 'about' ? (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950"><div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>}>
          <AboutPage
            initialTab={aboutPageTab}
            onBackToHome={() => {
              setCurrentNavTab('home');
              window.location.hash = '';
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenRegister={handleOpenRegisterModal}
            onShowToast={showToast}
            onNavigateSection={(section) => {
              if (section === 'pricing') {
                setCurrentNavTab('pricing');
                window.location.hash = '#pricing';
              } else if (section === 'verification') {
                setCurrentNavTab('verification');
                window.location.hash = '#verification';
              } else if (section === 'terms') {
                setCurrentNavTab('terms');
                window.location.hash = '#terms';
              } else if (section === 'support') {
                setCurrentNavTab('support');
                window.location.hash = '#support';
              } else if (section === 'home') {
                setCurrentNavTab('home');
                window.location.hash = '';
              } else {
                setCurrentNavTab('about');
                setAboutPageTab('about');
                window.location.hash = '#about';
              }
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </Suspense>
      ) : currentNavTab === 'news' ? (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950"><div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>}>
          <GhanaNewsPage
            onBackToHome={() => {
              setCurrentNavTab('home');
              window.location.hash = '';
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectArticle={(article) => setSelectedNewsArticle(article)}
            onShowToast={showToast}
          />
        </Suspense>
      ) : currentNavTab === 'sectors' ? (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950"><div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>}>
          <SectorsPage
            categories={categories}
            businesses={businesses}
            initialCategoryId={initialCategoryForSectors}
            onSelectBusiness={(b) => handleSelectBusiness(b)}
            onFilterByCategoryOnHome={(catId) => {
              handleFilterChange({ category: catId });
              setCurrentNavTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenRegister={handleOpenRegisterModal}
            onBackToHome={() => {
              setCurrentNavTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </Suspense>
      ) : (
        <>
          {/* 2. Hero & Unified Search Section matching Image 2 */}
          <HeroSearch
            categories={categories}
            businesses={businesses}
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            searchHistory={searchHistory}
            onAddSearchHistory={handleAddSearchHistory}
            onRemoveSearchHistoryItem={handleRemoveSearchHistoryItem}
            onClearSearchHistory={handleClearSearchHistory}
            onSelectBusiness={(b) => handleSelectBusiness(b)}
            onShowToast={showToast}
            onOpenSectors={() => setCurrentNavTab('sectors')}
            isAutoDetectedRegion={isAutoDetectedRegion}
          />

          <main className="flex-1 w-full py-4 sm:py-6 space-y-6">
            
            {/* Tri-Column Main Section (Filters Sidebar + Discover Businesses rows + Live BOG FX/News) */}
            <TriColumnMainLayout
              businesses={businesses}
              categories={categories}
              filters={filters}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
              savedBusinessIds={savedBusinessIds}
              onToggleSave={handleToggleSave}
              onSelectBusiness={(b) => handleSelectBusiness(b)}
              onOpenNewsTab={() => setCurrentNavTab('news')}
              onOpenQuote={handleOpenQuote}
              onOpenRegister={handleOpenRegisterModal}
              onRequestLocation={() => handleRequestUserLocation(true)}
              isLocating={isLocatingUser}
              newlyApprovedBizId={newlyApprovedBizId}
            />

          </main>
        </>
      )}

      {/* 8. Modals Ecosystem */}
      <AboutUsModal
        isOpen={isAboutUsModalOpen}
        onClose={() => setIsAboutUsModalOpen(false)}
        initialTab={aboutUsInitialTab}
        onOpenRegister={handleOpenRegisterModal}
        onOpenFullPage={() => handleOpenAboutPage(aboutUsInitialTab)}
      />

      {/* Suggest Category Modal */}
      <SuggestCategoryModal
        isOpen={isSuggestCategoryOpen}
        onClose={() => setIsSuggestCategoryOpen(false)}
        onSubmitSuggestion={handleSubmitCategorySuggestion}
        initialCategoryName={filters.searchQuery}
      />

      <CustomerFeedbackModal
        isOpen={isCustomerFeedbackOpen}
        onClose={() => {
          setIsCustomerFeedbackOpen(false);
          setSelectedBusinessForReview(null);
        }}
        businesses={businesses}
        preSelectedBusiness={selectedBusinessForReview}
        onSubmitFeedback={handleSubmitCustomerFeedback}
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
        onShowToast={showToast}
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
        onSelect={(b) => handleSelectBusiness(b)}
      />

      <LocationMapModal
        business={mapBusiness}
        allBusinesses={businesses}
        isOpen={!!mapBusiness}
        onClose={() => setMapBusiness(null)}
        onSelectBusiness={(b) => handleSelectBusiness(b)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          if (user.role === 'business_owner' || user.role === 'verified_owner' || (user.ownedBusinessIds && user.ownedBusinessIds.length > 0)) {
            setCurrentView('business_dashboard');
            showToast('Welcome to your Business Dashboard!', `Managing your business listings as ${user.name}`, 'success');
          } else if (user.role === 'admin') {
            setCurrentView('admin');
            showToast('Admin Console Active', `Signed in as Platform Administrator ${user.name}`, 'info');
          } else {
            setCurrentView('personal_dashboard');
            showToast('Welcome Back!', `Signed in as ${user.name}`, 'success');
          }
        }}
      />

      {/* Modals and Dialogs */}
      <SavedBusinessesModal
        savedBusinesses={savedBusinesses}
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        onRemoveSaved={handleToggleSave}
        onSelectBusiness={(b) => handleSelectBusiness(b)}
      />

      <NewsArticleModal
        article={selectedNewsArticle}
        isOpen={!!selectedNewsArticle}
        onClose={() => setSelectedNewsArticle(null)}
        onShowToast={showToast}
      />

      <SecureLogoutModal
        isOpen={isSecureLogoutModalOpen}
        currentUser={currentUser}
        onClose={() => setIsSecureLogoutModalOpen(false)}
        onConfirmLogout={handleConfirmLogout}
      />

      <AccountSettingsModal
        isOpen={isAccountSettingsModalOpen}
        currentUser={currentUser}
        businesses={businesses}
        onClose={() => setIsAccountSettingsModalOpen(false)}
        onAccountDeleted={handleAccountDeleted}
        onShowToast={showToast}
        onOpenBusiness={(b) => {
          setSelectedBusiness(b);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* 9. Toast Notification Portal */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* 10. Floating Contact Hub */}
      <FloatingContactHub
        onOpenSupportPage={() => {
          setCurrentNavTab('support');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* 11. Global Platform Footer */}
      <Footer
        onOpenRegister={handleOpenRegisterModal}
        onOpenNews={() => {
          setCurrentNavTab('news');
          window.location.hash = '#news';
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAboutUs={() => {
          setCurrentNavTab('about');
          window.location.hash = '#about';
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenTerms={() => {
          setCurrentNavTab('terms');
          window.location.hash = '#terms';
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenPricing={() => {
          setCurrentNavTab('pricing');
          window.location.hash = '#pricing';
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenVerification={() => {
          setCurrentNavTab('verification');
          window.location.hash = '#verification';
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSupport={() => {
          setCurrentNavTab('support');
          window.location.hash = '#support';
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSectors={() => {
          setCurrentNavTab('sectors');
          window.location.hash = '#sectors';
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onShowToast={showToast}
      />

      {/* 12. Smartphone Bottom Navigation Bar */}
      <MobileBottomNav
        currentUser={currentUser}
        savedCount={savedBusinessIds.length}
        inquiriesCount={inquiries.filter((i) => i.status === 'new').length}
        comparedCount={comparedBusinessIds.length}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onScrollToTop={() => {
          setCurrentNavTab('home');
          window.location.hash = '';
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onScrollToCategories={() => {
          setCurrentNavTab('sectors');
          window.location.hash = '#sectors';
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSectors={() => {
          setCurrentNavTab('sectors');
          window.location.hash = '#sectors';
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onScrollToDirectory={() => {
          setCurrentNavTab('home');
          window.location.hash = '';
          const el = document.getElementById('discover-businesses-section') || document.getElementById('main-directory-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenNews={() => {
          setCurrentNavTab('news');
          window.location.hash = '#news';
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenPricing={() => {
          setCurrentNavTab('pricing');
          window.location.hash = '#pricing';
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenVerification={() => {
          setCurrentNavTab('verification');
          window.location.hash = '#verification';
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAboutUs={() => {
          setCurrentNavTab('about');
          window.location.hash = '#about';
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSupport={() => {
          setCurrentNavTab('support');
          window.location.hash = '#support';
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenTerms={() => {
          setCurrentNavTab('terms');
          window.location.hash = '#terms';
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenRegister={handleOpenRegisterModal}
        onOpenSaved={() => setIsSavedModalOpen(true)}
        onOpenInquiries={() => setIsInquiriesModalOpen(true)}
        onOpenCompare={() => setIsCompareModalOpen(true)}
        onOpenAuth={() => handleOpenAuth('signin')}
        onSignOut={handleSignOut}
        onOpenAdminDashboard={() => setCurrentView('admin')}
        onOpenBusinessDashboard={() => setCurrentView('business_dashboard')}
        onOpenPersonalDashboard={() => setCurrentView('personal_dashboard')}
        onOpenAccountSettings={() => setIsAccountSettingsModalOpen(true)}
        onSharePlatform={handleSharePlatform}
      />
    </div>
  );
}
