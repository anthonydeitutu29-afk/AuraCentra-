import React, { useState, useRef, useEffect } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  MessageSquare, 
  Bookmark, 
  BookmarkCheck, 
  Layers, 
  Navigation, 
  Share2, 
  Check, 
  ExternalLink as ExtLink,
  ChevronLeft,
  ChevronRight,
  Megaphone,
  QrCode,
  Award,
  FileText,
  Copy,
  Flag,
  Send,
  Star,
  ThumbsUp,
  ArrowLeft,
  Sun,
  Moon,
  Home
} from 'lucide-react';
import { Business, BusinessReview, UserProfile, BusinessReport } from '../types';
import confetti from 'canvas-confetti';
import { useWhatsAppContact } from '../hooks/useWhatsAppContact';

export interface BusinessPageProps {
  business: Business;
  onBack: () => void;
  isSaved: boolean;
  isCompared: boolean;
  onToggleSave: (businessId: string) => void;
  onToggleCompare: (business: Business) => void;
  onOpenMap: (business: Business) => void;
  onOpenQuote?: (business: Business) => void;
  onOpenQR?: (business: Business) => void;
  onOpenCertificate?: (business: Business) => void;
  onReportBusiness?: (reportData: {
    businessId: string;
    businessName: string;
    reporterName?: string;
    reporterEmail?: string;
    reporterPhone?: string;
    reason: BusinessReport['reason'];
    reasonLabel: string;
    details: string;
  }) => void;
  currentUser: UserProfile | null;
  onShowToast?: (title: string, message?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  reviews?: BusinessReview[];
  onAddReview?: (review: BusinessReview) => void;
  onHelpfulVote?: (reviewId: string) => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
  onOpenAuth?: () => void;
  onOpenRegister?: () => void;
  onOpenAdminDashboard?: () => void;
  onOpenBusinessDashboard?: () => void;
  onOpenPersonalDashboard?: () => void;
}

export const BusinessPage: React.FC<BusinessPageProps> = ({
  business,
  onBack,
  isSaved,
  isCompared,
  onToggleSave,
  onToggleCompare,
  onOpenMap,
  onOpenQuote,
  onOpenQR,
  onOpenCertificate,
  onReportBusiness,
  currentUser,
  onShowToast,
  reviews = [],
  onAddReview,
  onHelpfulVote,
  theme,
  onToggleTheme,
}) => {
  // Gallery Carousel State
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedGps, setCopiedGps] = useState(false);

  // Quick In-Page Inquiry Form State
  const [inquiryName, setInquiryName] = useState(currentUser?.name || '');
  const [inquiryPhone, setInquiryPhone] = useState(currentUser?.phone || '');
  const [inquiryEmail, setInquiryEmail] = useState(currentUser?.email || '');
  const [inquiryService, setInquiryService] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [isSubmittingInquiry, setIsSubmittingInquiry] = useState(false);

  // Report Modal State
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState<BusinessReport['reason']>('incorrect_information');
  const [reportDetails, setReportDetails] = useState('');
  const [reporterName, setReporterName] = useState(currentUser?.name || '');
  const [reporterContact, setReporterContact] = useState(currentUser?.email || currentUser?.phone || '');

  // Review & Rating State
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [ratingInput, setRatingInput] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [reviewerName, setReviewerName] = useState(currentUser?.name || '');
  const [reviewerRole, setReviewerRole] = useState<'customer' | 'business'>('customer');
  const [reviewerCompany, setReviewerCompany] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Touch Swipe for Gallery
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // WhatsApp Contact Hook
  const { contactBusinessOnWhatsApp, copyPreFilledMessage } = useWhatsAppContact();
  const [copiedTemplate, setCopiedTemplate] = useState(false);

  // Keyboard navigation & scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isReportModalOpen) {
        onBack();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onBack, isReportModalOpen]);

  // Real Reviews for this business
  const businessReviews = reviews.filter((r) => r.businessId === business.id);
  const totalReviews = businessReviews.length;
  const calculatedRating = totalReviews > 0
    ? Number((businessReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1))
    : (business.reviewCount > 0 && business.rating > 0 ? business.rating : 0);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ratingInput || !reviewComment.trim()) {
      alert('Please select a star rating and enter a review comment.');
      return;
    }

    setIsSubmittingReview(true);

    const displayName = reviewerRole === 'business' && reviewerCompany.trim()
      ? `${reviewerName.trim() || 'Representative'} (${reviewerCompany.trim()})`
      : (reviewerName.trim() || currentUser?.name || 'Verified Customer');

    const createdReview: BusinessReview = {
      id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      businessId: business.id,
      userName: displayName,
      userEmail: currentUser?.email,
      rating: ratingInput,
      date: new Date().toISOString().split('T')[0],
      comment: reviewComment.trim(),
      helpfulCount: 0,
    };

    if (onAddReview) {
      onAddReview(createdReview);
    }

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });

    if (onShowToast) {
      onShowToast(
        'Review & Rating Submitted',
        `Thank you for rating ${business.name} with ${ratingInput} stars! The business rating has been updated.`,
        'success'
      );
    }

    setReviewComment('');
    setIsReviewFormOpen(false);
    setIsSubmittingReview(false);
  };

  const galleryImages = business.gallery && business.gallery.length > 0 
    ? business.gallery 
    : [business.coverImage || business.logo || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80'];

  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;
  const currentDayName = daysOfWeek[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 50) handleNextImage();
    else if (distance < -50) handlePrevImage();
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const handleShare = () => {
    const shareData = {
      title: `${business.name} - AuraCentra Ghana`,
      text: `Check out ${business.name} on AuraCentra Ghana: ${business.tagline || business.description}`,
      url: `${window.location.origin}/#business-${business.slug || business.id}`,
    };

    if (navigator.share) {
      navigator.share(shareData).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareData.url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
      if (onShowToast) onShowToast('Link Copied!', 'Business profile link copied to clipboard.', 'success');
    }
  };

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName.trim() || !inquiryPhone.trim()) {
      alert('Please provide your name and phone number so the business can contact you.');
      return;
    }

    setIsSubmittingInquiry(true);
    setTimeout(() => {
      setIsSubmittingInquiry(false);
      setInquiryMessage('');
      setInquiryService('');
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
      if (onShowToast) {
        onShowToast(
          'Inquiry Sent Successfully!',
          `Your message was forwarded to ${business.name}. They will reach you shortly at ${inquiryPhone}.`,
          'success'
        );
      }
    }, 400);
  };

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportDetails.trim()) {
      alert('Please provide specific details regarding your report.');
      return;
    }

    const reasonLabels: Record<BusinessReport['reason'], string> = {
      incorrect_information: 'Incorrect or Outdated Information',
      fraud_or_scam: 'Potential Scam or Suspicious Operations',
      fake_verification: 'Counterfeit or Fake Verification',
      inappropriate_content: 'Inappropriate Content or Imagery',
      closed_or_non_existent: 'Business is Permanently Closed or Non-Existent',
      harassment_or_abuse: 'Harassment or Abusive Behavior',
      other: 'Other Violation',
    };

    if (onReportBusiness) {
      onReportBusiness({
        businessId: business.id,
        businessName: business.name,
        reporterName: reporterName || undefined,
        reporterEmail: reporterContact.includes('@') ? reporterContact : undefined,
        reporterPhone: !reporterContact.includes('@') ? reporterContact : undefined,
        reason: reportReason,
        reasonLabel: reasonLabels[reportReason],
        details: reportDetails.trim(),
      });
    }

    setIsReportModalOpen(false);
    setReportDetails('');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200" id={`business-page-${business.id}`}>
      
      {/* 1. Sleek Navigation & Actions Bar directly on page top */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Back Navigation & Breadcrumb */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer shrink-0 active:scale-95"
              title="Return to Business Directory"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Directory</span>
              <span className="sm:hidden">Back</span>
            </button>

            {/* Breadcrumbs */}
            <nav aria-label="Breadcrumb" className="hidden md:flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 truncate">
              <span className="hover:text-blue-600 cursor-pointer flex items-center gap-1" onClick={onBack}>
                <Home className="w-3.5 h-3.5" />
                <span>Home</span>
              </span>
              <span>/</span>
              <span>{business.region}</span>
              <span>/</span>
              <span className="capitalize">{business.category.replace(/-/g, ' ')}</span>
              <span>/</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[200px]">
                {business.name}
              </span>
            </nav>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Compare Toggle */}
            <button
              type="button"
              onClick={() => onToggleCompare(business)}
              className={`p-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                isCompared
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
              title={isCompared ? 'Remove from Comparison' : 'Add to Compare'}
            >
              <Layers className="w-4 h-4" />
            </button>

            {/* Save Bookmark */}
            <button
              type="button"
              onClick={() => onToggleSave(business.id)}
              className={`p-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                isSaved
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
              title={isSaved ? 'Remove from Saved' : 'Save Business'}
            >
              {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            </button>

            {/* QR Code */}
            {onOpenQR && (
              <button
                type="button"
                onClick={() => onOpenQR(business)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-all cursor-pointer"
                title="View QR Code & Digital Card"
              >
                <QrCode className="w-4 h-4" />
              </button>
            )}

            {/* Share */}
            <button
              type="button"
              onClick={handleShare}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-all cursor-pointer"
              title="Share profile link"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>

            {/* Report */}
            <button
              type="button"
              onClick={() => setIsReportModalOpen(true)}
              className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-all cursor-pointer"
              title="Flag or report listing"
            >
              <Flag className="w-4 h-4" />
            </button>

            {/* Theme Toggle */}
            {onToggleTheme && (
              <button
                type="button"
                onClick={onToggleTheme}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-all cursor-pointer"
                title="Toggle Theme"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 2. Main Page Content - Lying Directly on the Background (No Outer Card) */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 animate-in fade-in duration-200">
        
        {/* Cover Photo / Interactive Gallery directly on background */}
        <section className="space-y-3">
          <div className="relative w-full rounded-2xl overflow-hidden bg-slate-950 aspect-[16/9] md:aspect-[21/9] max-h-[460px] flex items-center justify-center select-none shadow-sm group">
            <div
              className="w-full h-full touch-pan-y"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <img
                src={galleryImages[activeImageIndex]}
                alt={`${business.name} banner ${activeImageIndex + 1}`}
                className="w-full h-full object-cover transition-opacity duration-300"
              />
            </div>

            {/* Gallery Controls */}
            {galleryImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition-transform active:scale-90 cursor-pointer"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleNextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition-transform active:scale-90 cursor-pointer"
                  aria-label="Next photo"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-bold">
                  {activeImageIndex + 1} / {galleryImages.length}
                </div>
              </>
            )}
          </div>

          {/* Thumbnail Strip */}
          {galleryImages.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-16 sm:w-20 aspect-video rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                    idx === activeImageIndex ? 'border-blue-600 scale-105 shadow-xs' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </section>

        {/* 3. Business Title & Core Metadata directly on background */}
        <section className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-start gap-4 sm:gap-5 min-w-0">
            <img
              src={business.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80'}
              alt={business.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-contain bg-white p-2 border border-slate-200 dark:border-slate-800 shadow-xs shrink-0"
            />
            <div className="min-w-0 space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                  {business.name}
                </h1>
                {business.verificationStatus === 'verified' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-bold border border-blue-200 dark:border-blue-800">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verified</span>
                  </span>
                )}
                {business.verificationStatus === 'pending' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 text-xs font-bold border border-amber-200 dark:border-amber-800">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Pending Verification</span>
                  </span>
                )}
              </div>

              {business.tagline && (
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium">
                  {business.tagline}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400 pt-1">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span>{business.city}, {business.region}</span>
                </div>
                <span>•</span>
                <span className="capitalize font-medium text-slate-700 dark:text-slate-300">
                  {business.category.replace(/-/g, ' ')}
                </span>
                <span>•</span>
                <span className="font-mono text-slate-600 dark:text-slate-400 font-semibold">
                  Price: {business.priceLevel}
                </span>

                {/* Rating Display */}
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  {totalReviews > 0 && calculatedRating > 0 ? (
                    <div className="flex items-center gap-1 font-bold text-amber-500 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-900/50 text-xs">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{calculatedRating.toFixed(1)}</span>
                      <span className="text-slate-500 dark:text-slate-400 font-normal text-[11px]">
                        ({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
                      <span>Unrated</span>
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setIsReviewFormOpen(true);
                      const el = document.getElementById(`reviews-section-${business.id}`);
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                  >
                    ★ Rate & Review
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Action CTAs */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() =>
                contactBusinessOnWhatsApp(business, {
                  senderName: currentUser?.name,
                  inquiryType: 'general',
                })
              }
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold py-2.5 px-4 rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </button>

            <a
              href={`tel:${business.phone}`}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold py-2.5 px-4 rounded-xl shadow-xs transition-all active:scale-95"
            >
              <Phone className="w-4 h-4" />
              <span>Call Now</span>
            </a>

            {onOpenQuote && (
              <button
                type="button"
                onClick={() => onOpenQuote(business)}
                className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-bold py-2.5 px-4 rounded-xl transition-all active:scale-95 cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>Request Quote</span>
              </button>
            )}
          </div>
        </section>

        {/* 4. Official AuraCentra Verified Enterprise Section - DIRECTLY ON BACKGROUND (NOT A CARD) */}
        {business.verificationStatus === 'verified' && (
          <section className="py-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Official AuraCentra Verified Enterprise</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-600 text-white font-bold">
                    {business.verificationDetails?.badgeType || 'Gold Enterprise'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                  Ghana business identification, operational premises & contact information verified on AuraCentra.
                </p>
              </div>
            </div>

            {onOpenCertificate && (
              <button
                type="button"
                onClick={() => onOpenCertificate(business)}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-blue-600 dark:text-blue-400 text-xs font-bold transition-all cursor-pointer shrink-0"
              >
                <Award className="w-4 h-4 text-amber-500" />
                <span>View Certificate</span>
              </button>
            )}
          </section>
        )}

        {business.verificationStatus === 'pending' && (
          <section className="py-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3 text-xs sm:text-sm text-amber-800 dark:text-amber-300">
            <Clock className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <strong>Verification In Progress:</strong> Operational premises & business identification documents have been submitted and are under active review.
            </div>
          </section>
        )}

        {/* Active Promos / Announcements if present */}
        {business.updates && business.updates.filter((u) => u.isActive).length > 0 && (
          <section className="space-y-3 pb-6 border-b border-slate-200 dark:border-slate-800">
            {business.updates.filter((u) => u.isActive).map((upd) => (
              <div
                key={upd.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 py-3"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                    <Megaphone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-600 text-white">
                        {upd.badgeLabel || upd.type.replace('_', ' ').toUpperCase()}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {upd.title}
                      </h4>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                      {upd.content}
                    </p>
                  </div>
                </div>
                {upd.validUntil && (
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 shrink-0">
                    Valid until {new Date(upd.validUntil).toLocaleDateString()}
                  </span>
                )}
              </div>
            ))}
          </section>
        )}

        {/* 5. Main Information Grid Directly on Background (No Cards) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Left 2 Columns: About, Services, Highlights, Inquiries */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* About Section */}
            <section className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                About {business.name}
              </h2>
              <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed max-w-3xl whitespace-pre-line">
                {business.description}
              </p>
            </section>

            {/* Services & Products Offered */}
            {business.services && business.services.length > 0 && (
              <section className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  Services & Products Offered
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {business.services.map((service, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 py-2 text-sm font-medium text-slate-800 dark:text-slate-200"
                    >
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>{service}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Key Highlights & Credentials */}
            {business.features && business.features.length > 0 && (
              <section className="space-y-3 pt-6 border-t border-slate-200 dark:border-slate-800">
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                  Highlights & Credentials
                </h3>
                <div className="flex flex-wrap gap-2">
                  {business.features.map((feat, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                      <span>{feat}</span>
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Direct Inquiry & Message Section */}
            <section className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span>Send Direct Inquiry to {business.name}</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Need a price quote, appointment booking, or product availability? Submit your message below.
                </p>
              </div>

              <form onSubmit={handleSendInquiry} className="space-y-4 max-w-2xl">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ama Mensah"
                      value={inquiryName}
                      onChange={(e) => setInquiryName(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="0508203673"
                      value={inquiryPhone}
                      onChange={(e) => setInquiryPhone(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Service Needed
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Quotation or Booking"
                      value={inquiryService}
                      onChange={(e) => setInquiryService(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Message / Details
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Please specify what you need..."
                    value={inquiryMessage}
                    onChange={(e) => setInquiryMessage(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingInquiry}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-xs cursor-pointer transition-all active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmittingInquiry ? 'Sending Inquiry...' : 'Submit Inquiry'}</span>
                </button>
              </form>
            </section>

            {/* Ratings & Verified Reviews Section directly on background */}
            <section id={`reviews-section-${business.id}`} className="space-y-6 pt-6 border-t border-slate-200 dark:border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                    <span>Ratings & Verified Reviews</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                    Directory ratings are computed transparently from authentic customer feedback.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsReviewFormOpen(!isReviewFormOpen)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all cursor-pointer shrink-0"
                >
                  <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
                  <span>{isReviewFormOpen ? 'Close Review Form' : 'Rate & Leave Review'}</span>
                </button>
              </div>

              {/* Review Form Drawer */}
              {isReviewFormOpen && (
                <form onSubmit={handleReviewSubmit} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Submit Your Review for {business.name}
                  </h4>

                  {/* Star Rating Select */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Your Rating *
                    </label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRatingInput(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(null)}
                          className="p-1 text-slate-300 hover:scale-110 transition-transform cursor-pointer"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= (hoverRating || ratingInput)
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-300 dark:text-slate-600'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-2">
                        {ratingInput} / 5 Stars
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Kwabena Mensah"
                        value={reviewerName}
                        onChange={(e) => setReviewerName(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Role
                      </label>
                      <select
                        value={reviewerRole}
                        onChange={(e) => setReviewerRole(e.target.value as any)}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                      >
                        <option value="customer">Verified Customer / Client</option>
                        <option value="business">Corporate / B2B Partner</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Your Feedback & Experience *
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Share details about the quality of service, response time, and value..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingReview}
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    {isSubmittingReview ? 'Submitting...' : 'Post Review'}
                  </button>
                </form>
              )}

              {/* Reviews List directly on background */}
              {businessReviews.length > 0 ? (
                <div className="space-y-4">
                  {businessReviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="py-4 border-b border-slate-200 dark:border-slate-800 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-600 font-bold text-xs flex items-center justify-center">
                            {rev.userName.charAt(0)}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-900 dark:text-white">
                              {rev.userName}
                            </span>
                            <span className="text-[11px] text-slate-400 ml-2">
                              {rev.date}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-3.5 h-3.5 ${
                                s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200 dark:text-slate-700'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                        {rev.comment}
                      </p>
                      {onHelpfulVote && (
                        <div className="pt-1">
                          <button
                            type="button"
                            onClick={() => onHelpfulVote(rev.id)}
                            className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-blue-600 cursor-pointer"
                          >
                            <ThumbsUp className="w-3 h-3" />
                            <span>Helpful ({rev.helpfulCount || 0})</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 py-2">
                  No written reviews submitted yet. Be the first to rate and review {business.name}!
                </p>
              )}
            </section>
          </div>

          {/* Right Column: Contact, Location, & Hours directly on background */}
          <div className="space-y-8">
            
            {/* Direct Contact Options */}
            <section className="space-y-4">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-wider">
                Direct Contact
              </h3>

              <div className="space-y-2">
                {/* WhatsApp button */}
                <button
                  type="button"
                  onClick={() =>
                    contactBusinessOnWhatsApp(business, {
                      senderName: currentUser?.name,
                      inquiryType: 'general',
                    })
                  }
                  className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-3 px-4 rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp: {business.whatsapp || business.phone}</span>
                </button>

                {/* Pre-filled WhatsApp templates */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      contactBusinessOnWhatsApp(business, {
                        senderName: currentUser?.name,
                        inquiryType: 'quote',
                      })
                    }
                    className="flex-1 py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-semibold text-center transition-colors cursor-pointer"
                  >
                    💬 Quote Template
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      contactBusinessOnWhatsApp(business, {
                        senderName: currentUser?.name,
                        inquiryType: 'availability',
                      })
                    }
                    className="flex-1 py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-semibold text-center transition-colors cursor-pointer"
                  >
                    🕒 Availability
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      const success = await copyPreFilledMessage(business, { senderName: currentUser?.name });
                      if (success) {
                        setCopiedTemplate(true);
                        setTimeout(() => setCopiedTemplate(false), 2000);
                        if (onShowToast) onShowToast('Template Copied', 'WhatsApp message copied to clipboard.', 'success');
                      }
                    }}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer shrink-0"
                    title="Copy inquiry message"
                  >
                    {copiedTemplate ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Phone Call */}
                <a
                  href={`tel:${business.phone}`}
                  className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-3 px-4 rounded-xl shadow-xs transition-all"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call {business.phone}</span>
                </a>

                {/* Email */}
                {business.email && (
                  <a
                    href={`mailto:${business.email}?subject=Inquiry%20via%20AuraCentra`}
                    className="w-full inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold py-2.5 px-4 rounded-xl transition-all"
                  >
                    <Mail className="w-4 h-4" />
                    <span>{business.email}</span>
                  </a>
                )}

                {/* Website */}
                {business.website && (
                  <a
                    href={business.website.startsWith('http') ? business.website : `https://${business.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold py-2.5 px-4 rounded-xl transition-all"
                  >
                    <Globe className="w-4 h-4" />
                    <span>Visit Official Website</span>
                  </a>
                )}
              </div>
            </section>

            {/* Location & GPS */}
            <section className="space-y-3 pt-6 border-t border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Location & Address</span>
                <MapPin className="w-4 h-4 text-blue-600" />
              </h3>

              <p className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                {business.address}, {business.city}, {business.region}
              </p>

              {business.digitalAddress && (
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-xs font-mono font-bold flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-600 text-white uppercase font-sans">GPS</span>
                    <span>{business.digitalAddress}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(business.digitalAddress || '');
                      setCopiedGps(true);
                      setTimeout(() => setCopiedGps(false), 2000);
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-sans font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    {copiedGps ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedGps ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => onOpenMap(business)}
                  className="inline-flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold py-2 px-3 rounded-xl transition-colors cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>In-App Map</span>
                </button>

                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${business.coordinates?.lat ?? 5.6037},${business.coordinates?.lng ?? -0.1870}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2 px-3 rounded-xl transition-colors"
                >
                  <ExtLink className="w-3.5 h-3.5" />
                  <span>Directions</span>
                </a>
              </div>
            </section>

            {/* Opening Hours */}
            <section className="space-y-3 pt-6 border-t border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Opening Hours</span>
                <Clock className="w-4 h-4 text-slate-500" />
              </h3>

              <div className="space-y-1.5 text-xs">
                {daysOfWeek.map((day) => {
                  const isToday = day === currentDayName;
                  const hours = business.openingHours ? business.openingHours[day] : '08:00 - 18:00';
                  return (
                    <div
                      key={day}
                      className={`flex items-center justify-between py-1 px-2 rounded-lg ${
                        isToday
                          ? 'bg-blue-100/80 dark:bg-blue-950/60 font-bold text-blue-900 dark:text-blue-200'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <span className="capitalize">{day} {isToday && '(Today)'}</span>
                      <span>{hours}</span>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Report Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-600">
                <Flag className="w-5 h-5" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Report Listing
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsReportModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Submit a report for {business.name}. AuraCentra compliance officers investigate all submissions.
            </p>

            <form onSubmit={handleSubmitReport} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Reason for Report *
                </label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="incorrect_information">Incorrect or Outdated Information</option>
                  <option value="fraud_or_scam">Potential Scam or Suspicious Operations</option>
                  <option value="fake_verification">Counterfeit or Fake Verification</option>
                  <option value="inappropriate_content">Inappropriate Content or Imagery</option>
                  <option value="closed_or_non_existent">Business is Permanently Closed or Non-Existent</option>
                  <option value="harassment_or_abuse">Harassment or Abusive Behavior</option>
                  <option value="other">Other Violation</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Specific Details *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Explain the issue in detail..."
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
