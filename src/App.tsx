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
import { motion, AnimatePresence } from 'motion/react';
import { 
  Business, 
  Category, 
  BusinessReview, 
  UserProfile, 
  FilterState,
  BusinessInquiry,
  ToastNotification,
  BusinessReport,
  CategorySuggestion,
  PlatformFeedback,
  GhanaNewsArticle
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
  getStoredInquiries,
  saveInquiries,
  getStoredReports,
  saveReports,
  getStoredCategorySuggestions,
  saveCategorySuggestions,
  getStoredFeedback,
  saveFeedback,
  validateAndClearSession
} from './utils/storage';
import { autoDetectUserLocation, GHANA_REGIONS, calculateDistanceKm } from './utils/geolocationService';

// Subcomponents
import { Navbar } from './components/Navbar';
import { HeroSearch } from './components/HeroSearch';
import { CategoryExploreRow } from './components/CategoryExploreRow';
import { DiscoverBusinessesSection } from './components/DiscoverBusinessesSection';
import { DualCtaBanner } from './components/DualCtaBanner';
import { AboutUsModal } from './components/AboutUsModal';
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
import { PromotionalBanner } from './components/PromotionalBanner';
import { ScrollProgressBar } from './components/ScrollProgressBar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { SuggestCategoryModal } from './components/SuggestCategoryModal';
import { CustomerFeedbackModal } from './components/CustomerFeedbackModal';
import { GhanaBusinessNewsSection } from './components/GhanaBusinessNewsSection';
import { NewsArticleModal } from './components/NewsArticleModal';
import { dispatchApprovalNotification, dispatchRejectionNotification } from './utils/notificationService';

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
  const [reports, setReports] = useState<BusinessReport[]>(getStoredReports);
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

  // Suggestions & Feedback State
  const [suggestions, setSuggestions] = useState<CategorySuggestion[]>(getStoredCategorySuggestions);
  const [feedback, setFeedback] = useState<PlatformFeedback[]>(getStoredFeedback);

  // Navigation section state: 'home' | 'news'
  const [currentNavTab, setCurrentNavTab] = useState<'home' | 'news'>('home');

  // Modals state
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [selectedNewsArticle, setSelectedNewsArticle] = useState<GhanaNewsArticle | null>(null);
  const [isAboutUsModalOpen, setIsAboutUsModalOpen] = useState(false);
  const [aboutUsInitialTab, setAboutUsInitialTab] = useState<'about' | 'pricing' | 'verification'>('about');
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
  const [selectedBusinessForReview, setSelectedBusinessForReview] = useState<Business | null>(null);

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
        setFilters((prev) => {
          // If no specific region has been selected yet by the user, default to closest region
          if (!prev.region) {
            return {
              ...prev,
              region: loc.regionName,
              userLat: loc.coords.lat,
              userLng: loc.coords.lng,
            };
          }
          return {
            ...prev,
            userLat: loc.coords.lat,
            userLng: loc.coords.lng,
          };
        });
        showToast(
          'Location Personalized',
          `Defaulted to closest region: ${loc.regionName} (${loc.cityName}) businesses based on your location.`,
          'info'
        );
      }
    });
  }, [showToast]);

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

  const handleOpenRegisterModal = useCallback(() => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      showToast('Account Required', 'Please sign in or create a verified account to enlist a business on AuraCentra.', 'info');
      return;
    }
    setIsRegisterModalOpen(true);
  }, [currentUser, showToast]);

  const handleOpenSuggestCategoryModal = useCallback(() => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      showToast('Account Required', 'Please sign in or create an account to suggest categories.', 'info');
      return;
    }
    setIsSuggestCategoryOpen(true);
  }, [currentUser, showToast]);

  const handleOpenCustomerFeedbackModal = useCallback((biz?: Business) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      showToast('Account Required', 'Please sign in or create an account to rate businesses or leave platform feedback.', 'info');
      return;
    }
    setSelectedBusinessForReview(biz || null);
    setIsCustomerFeedbackOpen(true);
  }, [currentUser, showToast]);

  const handleToggleSave = (businessId: string) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
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
    // Record business with pending_approval status
    setBusinesses((prev) => [newBusiness, ...prev]);
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

  const handleApproveVerification = (businessId: string, badgeType: string = 'Gold Enterprise', verifiedCoords?: { lat: number; lng: number }) => {
    let approvedBiz: Business | undefined;
    setBusinesses((prev) =>
      prev.map((b) => {
        if (b.id === businessId) {
          approvedBiz = {
            ...b,
            listingStatus: 'active', // Enlist officially upon admin approval
            verificationStatus: 'verified',
            coordinates: verifiedCoords || b.coordinates,
            verificationDetails: {
              ...(b.verificationDetails || {
                verifiedAt: new Date().toISOString(),
                tinNumber: 'TIN-GH-882194',
                businessRegNumber: 'BN-GH-2024-9128',
                verifiedByAdmin: 'Executive Desk',
              }),
              badgeType: (badgeType as any) || 'Gold Enterprise',
              gpsVerified: true,
            },
            verificationDocuments: b.verificationDocuments?.map((d) => ({
              ...d,
              status: 'verified',
              reviewedAt: new Date().toISOString(),
            })),
          };
          return approvedBiz;
        }
        return b;
      })
    );

    if (approvedBiz) {
      dispatchApprovalNotification(approvedBiz, badgeType);
    }

    showToast(
      'Business Approved & Enlisted',
      `The business has been verified with ${badgeType} badge and published on AuraCentra Ghana. Automated notification dispatched.`,
      'success'
    );
  };

  const handleRejectVerification = (
    businessId: string,
    reason: string,
    resolutionGuide?: string,
    adminNotes?: string
  ) => {
    let rejectedBiz: Business | undefined;
    setBusinesses((prev) =>
      prev.map((b) => {
        if (b.id === businessId) {
          rejectedBiz = {
            ...b,
            listingStatus: 'rejected',
            verificationStatus: 'rejected',
            verificationDocuments: b.verificationDocuments?.map((d) => ({
              ...d,
              status: 'rejected',
              rejectionReason: reason,
              reviewedAt: new Date().toISOString(),
            })),
          };
          return rejectedBiz;
        }
        return b;
      })
    );

    if (rejectedBiz) {
      dispatchRejectionNotification(rejectedBiz, reason, resolutionGuide, adminNotes);
    }

    showToast(
      'Business Rejected & User Notified',
      'The listing was rejected and automated corrective feedback was sent to the owner.',
      'warning'
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

  const handleSignOut = async () => {
    try {
      await validateAndClearSession();
    } catch {
      // Ignore
    }
    setCurrentUser(null);
    setCurrentView('portal');
    showToast('Signed Out Safely', 'Your local session was invalidated and state flushed.', 'info');
  };

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
      setIsAuthModalOpen(true);
      showToast('Sign In Required', 'Please sign in or create an account to request quotes from businesses.', 'info');
      return;
    }
    setQuoteBusiness(business);
  }, [currentUser, showToast]);

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
      // 0. Only show officially enlisted/approved businesses to public users
      if (b.listingStatus === 'pending_approval' || b.listingStatus === 'rejected') {
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
      if (filters.category && b.category !== filters.category) {
        return false;
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
      // default: featured first, then verified, then newest
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      if (a.verificationStatus === 'verified' && b.verificationStatus !== 'verified') return -1;
      if (a.verificationStatus !== 'verified' && b.verificationStatus === 'verified') return 1;
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
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
          reports={reports}
          suggestions={suggestions}
          feedback={feedback}
          showExecutiveSection={showExecutiveSection}
          onToggleExecutiveSection={handleToggleExecutiveSection}
          onUpdateBusiness={handleUpdateBusiness}
          onAddBusiness={handleAddBusinessDirect}
          onDeleteBusiness={handleDeleteBusiness}
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
          onSignOut={handleSignOut}
          onBackToPortal={() => setCurrentView('portal')}
        />
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
        onNavigateSection={(sec) => setCurrentNavTab(sec)}
        onOpenAboutUs={() => {
          setAboutUsInitialTab('about');
          setIsAboutUsModalOpen(true);
        }}
        onOpenPricing={() => {
          setAboutUsInitialTab('pricing');
          setIsAboutUsModalOpen(true);
        }}
        currentUser={currentUser}
        savedCount={savedBusinessIds.length}
        comparedCount={comparedBusinessIds.length}
        inquiriesCount={inquiries.filter((i) => i.status === 'new').length}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenRegister={handleOpenRegisterModal}
        onOpenSavedModal={() => setIsSavedModalOpen(true)}
        onOpenCompareModal={() => setIsCompareModalOpen(true)}
        onOpenInquiriesModal={() => setIsInquiriesModalOpen(true)}
        onOpenAdminDashboard={() => setCurrentView('admin')}
        onSignOut={handleSignOut}
        onSharePlatform={handleSharePlatform}
      />

      {/* Conditional Rendering: Dedicated Business News View OR Home Discovery Flow */}
      {currentNavTab === 'news' ? (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-blue-600 dark:text-cyan-400 text-xs font-bold uppercase tracking-wider">
                <span>Ghana Economic & Business Desk</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Ghana Business News & Live Forex Hub
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Real-time Cedi (GHS) exchange rates, BoG monetary policy updates, trade tenders, and market reports.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setCurrentNavTab('home')}
              className="px-4 py-2 rounded-xl bg-blue-50 dark:bg-slate-850 text-blue-600 dark:text-cyan-400 text-xs font-bold hover:bg-blue-100 transition-colors cursor-pointer"
            >
              ← Back to Discovery
            </button>
          </div>

          <GhanaBusinessNewsSection
            onSelectArticle={(article) => setSelectedNewsArticle(article)}
            onShowToast={showToast}
          />
        </main>
      ) : (
        <>
          {/* 2. Hero & Unified Search Section matching Image 1 & Image 2 */}
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
            onShowToast={showToast}
            isAutoDetectedRegion={isAutoDetectedRegion}
          />

          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-12 sm:space-y-16">
            
            {/* 1. TOP: Explore by Category (Technology, Restaurants, Healthcare, Real Estate, Education, etc.) */}
            <CategoryExploreRow
              categories={categories}
              selectedCategory={filters.category}
              onSelectCategory={(categoryId) => {
                handleFilterChange({ category: categoryId });
                const el = document.getElementById('main-directory-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onViewAllCategories={handleOpenSuggestCategoryModal}
            />

            {/* 2. Dual Action Growth Banner (Discover more. Get discovered.) */}
            <DualCtaBanner
              onExploreBusinesses={() => {
                const el = document.getElementById('main-directory-section') || document.getElementById('discover-businesses-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onListBusiness={handleOpenRegisterModal}
            />

            {/* 3. Full Business Directory Listings & Search Results / Filters */}
            <section className="space-y-6 pt-2" id="main-directory-section">
              <div className="flex flex-col gap-3 p-4 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shadow-2xs">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                      {filteredBusinesses.length} {filteredBusinesses.length === 1 ? 'Business Matching Query' : 'Businesses Matching Query'}
                    </h3>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Verified enterprises, verified suppliers, and local service providers across Ghana
                    </span>
                  </div>

                  {(filters.searchQuery || filters.category || filters.city || filters.region || filters.verificationOnly) && (
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline cursor-pointer"
                    >
                      Clear Search & Filters
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2.5 text-xs pt-1 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-slate-500 font-medium hidden sm:inline flex items-center gap-1">
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                      <span>Sort:</span>
                    </span>

                    <select
                      value={filters.sortBy}
                      onChange={(e) => handleFilterChange({ sortBy: e.target.value as any })}
                      className="px-2.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 font-bold text-slate-800 dark:text-slate-200 border-0 focus:ring-2 focus:ring-blue-500 cursor-pointer text-xs"
                      aria-label="Sort businesses"
                    >
                      <option value="featured">Featured & Verified First</option>
                      <option value="nearest">📍 Nearest to Me (GPS)</option>
                      <option value="leads">Most Inquired</option>
                      <option value="name">Alphabetical (A-Z)</option>
                    </select>

                    <select
                      value={filters.region}
                      onChange={(e) => handleFilterChange({ region: e.target.value, city: '' })}
                      className="px-2.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 font-bold text-slate-800 dark:text-slate-200 border-0 focus:ring-2 focus:ring-blue-500 cursor-pointer text-xs"
                      aria-label="Filter by Ghana Region"
                    >
                      <option value="">All 16 Ghana Regions</option>
                      {GHANA_REGIONS.map((reg) => (
                        <option key={reg.id} value={reg.name}>
                          {reg.name} ({reg.capital})
                        </option>
                      ))}
                    </select>

                    <select
                      value={filters.city}
                      onChange={(e) => handleFilterChange({ city: e.target.value })}
                      className="px-2.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 font-bold text-slate-800 dark:text-slate-200 border-0 focus:ring-2 focus:ring-blue-500 cursor-pointer text-xs"
                      aria-label="Filter by City"
                    >
                      <option value="">All Major Cities</option>
                      <option value="Accra">Accra</option>
                      <option value="Kumasi">Kumasi</option>
                      <option value="Tema">Tema</option>
                      <option value="Takoradi">Takoradi</option>
                      <option value="Tamale">Tamale</option>
                      <option value="Cape Coast">Cape Coast</option>
                      <option value="Sunyani">Sunyani</option>
                      <option value="Koforidua">Koforidua</option>
                      <option value="Ho">Ho</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleFilterChange({ verificationOnly: !filters.verificationOnly })}
                    className={`px-3 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 border ${
                      filters.verificationOnly
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-transparent hover:bg-slate-200'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verified Only</span>
                  </button>
                </div>
              </div>

              {filteredBusinesses.length > 0 ? (
                <motion.div 
                  layout 
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <AnimatePresence mode="popLayout">
                    {filteredBusinesses.map((biz) => (
                      <motion.div
                        key={biz.id}
                        layout
                        initial={{ opacity: 0, scale: 0.94, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -10 }}
                        transition={{
                          layout: { type: "spring", stiffness: 350, damping: 30 },
                          opacity: { duration: 0.25 },
                          scale: { duration: 0.25 }
                        }}
                        className="flex flex-col h-full"
                      >
                        <BusinessCard
                          business={biz}
                          distanceKm={getBusinessDistance(biz)}
                          isSaved={savedBusinessIds.includes(biz.id)}
                          isCompared={comparedBusinessIds.includes(biz.id)}
                          onToggleSave={handleToggleSave}
                          onToggleCompare={handleToggleCompare}
                          onSelect={(b) => setSelectedBusiness(b)}
                          onOpenQuote={handleOpenQuote}
                          onOpenQR={handleOpenQR}
                          onShare={handleShareBusiness}
                          onRate={(b) => {
                            setSelectedBusinessForReview(b);
                            setIsCustomerFeedbackOpen(true);
                          }}
                          onQuickContactWhatsApp={(b) => {
                            window.open(`https://wa.me/${b.whatsapp || b.phone}`, '_blank');
                          }}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <div className="p-8 text-center rounded-3xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-3">
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    No listed businesses match "{filters.searchQuery || filters.category || filters.region}"
                  </p>
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </section>

            {/* 4. Curated & Verified Business Discovery Grid */}
            <DiscoverBusinessesSection
              businesses={businesses}
              onSelectBusiness={(b) => setSelectedBusiness(b)}
              onViewAllBusinesses={() => {
                const el = document.getElementById('main-directory-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenQuote={handleOpenQuote}
              onQuickContactWhatsApp={(b) => {
                window.open(`https://wa.me/${b.whatsapp || b.phone}`, '_blank');
              }}
            />

            {/* 5. Ghana Business News & Live Forex Updates */}
            <section className="space-y-6 pt-6 border-t border-slate-200 dark:border-slate-800" id="ghana-news-updates-section">
              <GhanaBusinessNewsSection
                onSelectArticle={(article) => setSelectedNewsArticle(article)}
                onShowToast={showToast}
              />
            </section>

          </main>
        </>
      )}

      {/* 8. Modals Ecosystem */}
      <AboutUsModal
        isOpen={isAboutUsModalOpen}
        onClose={() => setIsAboutUsModalOpen(false)}
        initialTab={aboutUsInitialTab}
        onOpenRegister={handleOpenRegisterModal}
      />

      <BusinessDetailsModal
        business={selectedBusiness}
        isOpen={!!selectedBusiness}
        onClose={() => setSelectedBusiness(null)}
        isSaved={selectedBusiness ? savedBusinessIds.includes(selectedBusiness.id) : false}
        onToggleSave={handleToggleSave}
        isCompared={selectedBusiness ? comparedBusinessIds.includes(selectedBusiness.id) : false}
        onToggleCompare={handleToggleCompare}
        onOpenMap={(b) => setMapBusiness(b)}
        onOpenQuote={handleOpenQuote}
        onOpenQR={handleOpenQR}
        onOpenCertificate={handleOpenCert}
        onReportBusiness={handleReportBusiness}
        currentUser={currentUser}
        onShowToast={showToast}
      />

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
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
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

      <NewsArticleModal
        article={selectedNewsArticle}
        isOpen={!!selectedNewsArticle}
        onClose={() => setSelectedNewsArticle(null)}
        onShowToast={showToast}
      />

      {/* 9. Toast Notification Portal */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* 10. Floating Contact Hub */}
      <FloatingContactHub />

      {/* 11. Global Platform Footer */}
      <Footer
        onOpenRegister={handleOpenRegisterModal}
        onOpenNews={() => {
          setCurrentNavTab('news');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAboutUs={() => {
          setAboutUsInitialTab('about');
          setIsAboutUsModalOpen(true);
        }}
        onOpenPricing={() => {
          setAboutUsInitialTab('pricing');
          setIsAboutUsModalOpen(true);
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
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onScrollToCategories={() => {
          setCurrentNavTab('home');
          const el = document.getElementById('category-explore-row');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onScrollToDirectory={() => {
          setCurrentNavTab('home');
          const el = document.getElementById('discover-businesses-section') || document.getElementById('main-directory-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenRegister={handleOpenRegisterModal}
        onOpenSaved={() => setIsSavedModalOpen(true)}
        onOpenInquiries={() => setIsInquiriesModalOpen(true)}
        onOpenCompare={() => setIsCompareModalOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onSignOut={handleSignOut}
        onOpenAdminDashboard={() => setCurrentView('admin')}
        onSharePlatform={handleSharePlatform}
      />
    </div>
  );
}
