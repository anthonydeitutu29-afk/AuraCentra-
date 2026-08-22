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
  BlogPost
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
  saveInquiries,
  getStoredReports,
  saveReports,
  getStoredCategorySuggestions,
  saveCategorySuggestions,
  getStoredFeedback,
  saveFeedback,
  getStoredBlogPosts,
  saveBlogPosts
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
import { PromotionalBanner } from './components/PromotionalBanner';
import { ScrollProgressBar } from './components/ScrollProgressBar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { PopularityTrendsChart } from './components/PopularityTrendsChart';
import { SuggestCategoryModal } from './components/SuggestCategoryModal';
import { CustomerFeedbackModal } from './components/CustomerFeedbackModal';
import { BlogSection } from './components/BlogSection';
import { BlogArticleModal } from './components/BlogArticleModal';

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

  // Suggestions, Feedback & Blog State
  const [suggestions, setSuggestions] = useState<CategorySuggestion[]>(getStoredCategorySuggestions);
  const [feedback, setFeedback] = useState<PlatformFeedback[]>(getStoredFeedback);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(getStoredBlogPosts);
  const [likedBlogPostIds, setLikedBlogPostIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('auracentra_liked_blogs');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedBlogPost, setSelectedBlogPost] = useState<BlogPost | null>(null);

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
  const [isSuggestCategoryOpen, setIsSuggestCategoryOpen] = useState(false);
  const [isCustomerFeedbackOpen, setIsCustomerFeedbackOpen] = useState(false);
  const [selectedBusinessForReview, setSelectedBusinessForReview] = useState<Business | null>(null);

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
    saveReports(reports);
  }, [reports]);

  useEffect(() => {
    saveCategorySuggestions(suggestions);
  }, [suggestions]);

  useEffect(() => {
    saveFeedback(feedback);
  }, [feedback]);

  useEffect(() => {
    saveBlogPosts(blogPosts);
  }, [blogPosts]);

  useEffect(() => {
    localStorage.setItem('auracentra_liked_blogs', JSON.stringify(likedBlogPostIds));
  }, [likedBlogPostIds]);

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

  const handleLikeBlogPost = useCallback((postId: string) => {
    setLikedBlogPostIds((prev) => {
      const isLiked = prev.includes(postId);
      const updated = isLiked ? prev.filter((id) => id !== postId) : [...prev, postId];
      
      setBlogPosts((posts) =>
        posts.map((p) =>
          p.id === postId
            ? { ...p, likes: Math.max(0, (p.likes || 0) + (isLiked ? -1 : 1)) }
            : p
        )
      );
      
      showToast(isLiked ? 'Article Unliked' : 'Article Liked', isLiked ? 'Removed from saved articles.' : 'Thanks for supporting local business insights!', 'info');
      return updated;
    });
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
      if (filters.sortBy === 'nearest') {
        const userLat = filters.userLat || 5.6037;
        const userLng = filters.userLng || -0.1870;
        const distA = calculateDistanceKm(userLat, userLng, a.coordinates?.lat ?? 5.6037, a.coordinates?.lng ?? -0.1870);
        const distB = calculateDistanceKm(userLat, userLng, b.coordinates?.lat ?? 5.6037, b.coordinates?.lng ?? -0.1870);
        return distA - distB;
      }
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
        onSharePlatform={handleSharePlatform}
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
        onShowToast={showToast}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 pb-28 sm:pb-12 space-y-6 sm:space-y-12">
        {/* Promotional & Urgent Announcements Ribbon */}
        <PromotionalBanner
          onOpenRegister={() => setIsRegisterModalOpen(true)}
          onSelectCategory={(categoryId) => handleFilterChange({ category: categoryId })}
          onShowToast={showToast}
        />

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

            <motion.div 
              layout 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <AnimatePresence mode="popLayout">
                {executiveBusinesses.slice(0, 3).map((biz) => (
                  <motion.div
                    key={biz.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
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
            
            <button
              type="button"
              onClick={() => setIsSuggestCategoryOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-cyan-300 text-xs font-bold transition-all cursor-pointer border border-blue-200/60 dark:border-blue-800/60"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Suggest Category</span>
            </button>
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
          <div className="flex flex-col gap-3 p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/70 shadow-sm">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                {filteredBusinesses.length} {filteredBusinesses.length === 1 ? 'Business Listed' : 'Businesses Listed'}
              </span>
              {filters.category && (
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-semibold truncate max-w-[200px]">
                  {categories.find((c) => c.id === filters.category)?.name || filters.category}
                </span>
              )}
            </div>

            {/* Sort & Quick Filter Dropdowns */}
            <div className="grid grid-cols-1 xs:grid-cols-3 sm:flex sm:flex-wrap items-center gap-2 text-xs">
              <div className="hidden sm:flex items-center gap-1.5 text-slate-500 font-medium shrink-0">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Sort & Filter:</span>
              </div>

              {/* Sort selector */}
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange({ sortBy: e.target.value as any })}
                className="w-full sm:w-auto px-2.5 py-2 sm:py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 font-bold text-slate-800 dark:text-slate-200 border-0 focus:ring-2 focus:ring-blue-500 cursor-pointer text-xs"
                aria-label="Sort businesses"
              >
                <option value="featured">Featured & Verified First</option>
                <option value="nearest">📍 Nearest to Me (GPS)</option>
                <option value="rating">Highest Rated (★ 5.0)</option>
                <option value="reviews">Most Reviewed</option>
                <option value="name">Alphabetical (A-Z)</option>
              </select>

              {/* Min Rating Filter */}
              <select
                value={filters.minRating}
                onChange={(e) => handleFilterChange({ minRating: Number(e.target.value) })}
                className="w-full sm:w-auto px-2.5 py-2 sm:py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 font-bold text-slate-800 dark:text-slate-200 border-0 focus:ring-2 focus:ring-blue-500 cursor-pointer text-xs"
                aria-label="Filter by rating"
              >
                <option value={0}>All Ratings</option>
                <option value={4.5}>★ 4.5+ Stars</option>
                <option value={4.0}>★ 4.0+ Stars</option>
              </select>

              {/* Price Tier Filter */}
              <select
                value={filters.priceLevel}
                onChange={(e) => handleFilterChange({ priceLevel: e.target.value })}
                className="w-full sm:w-auto px-2.5 py-2 sm:py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 font-bold text-slate-800 dark:text-slate-200 border-0 focus:ring-2 focus:ring-blue-500 cursor-pointer text-xs"
                aria-label="Filter by price"
              >
                <option value="">All Prices</option>
                <option value="$">$ (Budget)</option>
                <option value="$$">$$ (Moderate)</option>
                <option value="$$$">$$$ (Premium)</option>
              </select>
            </div>
          </div>

          {/* Business Cards Grid with Framer Motion Layout Animation */}
          {filteredBusinesses.length > 0 ? (
            <motion.div 
              layout 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
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
                  No businesses have been enlisted yet. Enlist your business now, or suggest a new category to get started!
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
                <button
                  type="button"
                  id="empty-state-suggest-btn"
                  onClick={() => setIsSuggestCategoryOpen(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 hover:bg-cyan-100 dark:hover:bg-cyan-900/60 text-cyan-800 dark:text-cyan-300 text-xs sm:text-sm font-bold border border-cyan-200 dark:border-cyan-800/60 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  <span>Suggest a Category</span>
                </button>
              </div>
            </div>
          ) : (
            /* Empty State when filters yield no result */
            <div className="p-10 sm:p-14 text-center rounded-3xl bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-4 max-w-2xl mx-auto shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-700/60 text-slate-500 dark:text-slate-400 flex items-center justify-center mx-auto">
                <Search className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  No businesses matched "{filters.searchQuery || filters.category || filters.city}"
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  Can't find the trade or business you're looking for? Suggest a category or send direct feedback so our admin team can enlist local providers in your region.
                </p>
              </div>

              <div className="pt-3 flex flex-wrap items-center justify-center gap-2.5">
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md cursor-pointer transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset All Filters</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsSuggestCategoryOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 hover:bg-cyan-100 dark:hover:bg-cyan-900/60 text-cyan-800 dark:text-cyan-300 text-xs font-bold border border-cyan-200 dark:border-cyan-800/60 transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                  <span>Suggest a Category</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsCustomerFeedbackOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-300 dark:border-slate-600 transition-all cursor-pointer"
                >
                  <Star className="w-3.5 h-3.5 text-amber-500" />
                  <span>Leave Site Feedback</span>
                </button>
              </div>
            </div>
          )}
        </section>

        {/* 6. Popularity Trends Analytics Line Chart (Recharts) */}
        <PopularityTrendsChart
          onSelectCategory={(categoryName) => {
            const matched = categories.find((c) => c.name.toLowerCase() === categoryName.toLowerCase());
            if (matched) {
              handleFilterChange({ category: matched.id });
              const el = document.getElementById('main-directory-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            } else {
              handleFilterChange({ searchQuery: categoryName });
              const el = document.getElementById('main-directory-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        />

        {/* 7. Ghana Business Growth & Insights Blog Section */}
        <BlogSection
          onSelectPost={(post) => setSelectedBlogPost(post)}
          onLikePost={handleLikeBlogPost}
          likedPostIds={likedBlogPostIds}
        />
      </main>

      {/* 8. Modals Ecosystem */}
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
        onReportBusiness={handleReportBusiness}
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
        onSubmitFeedback={handleSubmitCustomerFeedback}
        targetBusiness={selectedBusinessForReview}
      />

      <BlogArticleModal
        post={selectedBlogPost}
        isOpen={!!selectedBlogPost}
        onClose={() => setSelectedBlogPost(null)}
        onLikePost={handleLikeBlogPost}
        isLiked={selectedBlogPost ? likedBlogPostIds.includes(selectedBlogPost.id) : false}
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

      {/* 10. Smartphone Bottom Navigation Bar */}
      <MobileBottomNav
        currentUser={currentUser}
        savedCount={savedBusinessIds.length}
        inquiriesCount={inquiries.filter((i) => i.status === 'new').length}
        comparedCount={comparedBusinessIds.length}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onScrollToTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onScrollToCategories={() => {
          const el = document.getElementById('browse-categories-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onScrollToDirectory={() => {
          const el = document.getElementById('main-directory-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenRegister={() => setIsRegisterModalOpen(true)}
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
