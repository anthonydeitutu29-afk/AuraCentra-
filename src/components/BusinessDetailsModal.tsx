import React, { useState, useRef } from 'react';
import { 
  X, 
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
  Sparkles,
  QrCode,
  Award,
  FileText,
  Copy,
  Flag,
  Send,
  AlertCircle
} from 'lucide-react';
import { Business, BusinessReview, UserProfile, BusinessReport } from '../types';
import confetti from 'canvas-confetti';
import { useWhatsAppContact } from '../hooks/useWhatsAppContact';

interface BusinessDetailsModalProps {
  business: Business | null;
  isOpen: boolean;
  onClose: () => void;
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
}

export const BusinessDetailsModal: React.FC<BusinessDetailsModalProps> = ({
  business,
  isOpen,
  onClose,
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
}) => {
  // Gallery Carousel State
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedGps, setCopiedGps] = useState(false);

  // Quick In-Modal Quote / Inquiry Form State
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

  // Touch Swipe for Gallery
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // WhatsApp Contact Hook
  const { contactBusinessOnWhatsApp, getPreFilledMessage, copyPreFilledMessage } = useWhatsAppContact();
  const [copiedTemplate, setCopiedTemplate] = useState(false);

  if (!isOpen || !business) return null;

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
      url: `${window.location.origin}/#business-${business.id}`,
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
      alert('Please describe your concern or reason for reporting.');
      return;
    }

    const reasonLabels: Record<BusinessReport['reason'], string> = {
      closed_or_non_existent: 'Business permanently closed or does not exist',
      incorrect_information: 'Incorrect location or contact information',
      fraud_or_scam: 'Suspected fraudulent activity or scam',
      fake_verification: 'Unverified or misleading claims',
      inappropriate_content: 'Inappropriate or offensive media',
      harassment_or_abuse: 'Harassment or abusive behavior',
      other: 'Other compliance issue'
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh] my-auto"
        id={`business-details-modal-${business.id}`}
      >
        {/* Modal Sticky Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 sticky top-0 z-20">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={business.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80'}
              alt={business.name}
              className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
            />
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate flex items-center gap-2">
                <span>{business.name}</span>
                {business.verificationStatus === 'verified' && (
                  <CheckCircle2 className="w-4 h-4 text-blue-600 fill-blue-50 shrink-0" />
                )}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {business.city}, {business.region} • {business.category}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Compare Toggle */}
            <button
              type="button"
              onClick={() => onToggleCompare(business)}
              className={`p-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                isCompared
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
              title="Compare"
            >
              <Layers className="w-4 h-4" />
            </button>

            {/* Save Bookmark */}
            <button
              type="button"
              onClick={() => onToggleSave(business.id)}
              className={`p-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                isSaved
                  ? 'bg-rose-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
              title="Save"
            >
              {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            </button>

            {/* QR Code */}
            {onOpenQR && (
              <button
                type="button"
                onClick={() => onOpenQR(business)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-all cursor-pointer"
                title="View QR Code & Share"
              >
                <QrCode className="w-4 h-4" />
              </button>
            )}

            {/* Share */}
            <button
              type="button"
              onClick={handleShare}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-all cursor-pointer"
              title="Share listing"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>

            {/* Report Business Button */}
            <button
              type="button"
              id={`report-btn-${business.id}`}
              onClick={() => setIsReportModalOpen(true)}
              className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200/60 dark:border-rose-900/60 transition-all cursor-pointer"
              title="Report or flag this business"
              aria-label="Report business"
            >
              <Flag className="w-4 h-4" />
            </button>

            {/* Close Modal */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-all cursor-pointer"
              title="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Container */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* 1. Interactive Photo Gallery */}
          <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-[16/9] sm:aspect-[21/9] flex items-center justify-center select-none group">
            <div
              className="w-full h-full touch-pan-y"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <img
                src={galleryImages[activeImageIndex]}
                alt={`${business.name} photo ${activeImageIndex + 1}`}
                className="w-full h-full object-cover transition-opacity duration-300"
              />
            </div>

            {/* Navigation Arrows for multi-image gallery */}
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

                {/* Counter Pill */}
                <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-xs font-semibold">
                  {activeImageIndex + 1} / {galleryImages.length}
                </div>

                {/* Dot Indicators */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full">
                  {galleryImages.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        idx === activeImageIndex ? 'w-5 bg-blue-500' : 'w-1.5 bg-white/60'
                      }`}
                      aria-label={`View photo ${idx + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Thumbnail Ribbon if multi-image */}
          {galleryImages.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-16 sm:w-20 aspect-video rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                    idx === activeImageIndex ? 'border-blue-600 scale-105 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* 2. Verification Trust Banner */}
          {business.verificationStatus === 'verified' ? (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 via-sky-50 to-indigo-50 dark:from-blue-950/40 dark:via-sky-950/30 dark:to-indigo-950/40 border border-blue-200 dark:border-blue-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm font-bold text-blue-950 dark:text-blue-200 flex items-center gap-1.5">
                    <span>Official AuraCentra Verified Enterprise</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-600 text-white font-bold">
                      {business.verificationDetails?.badgeType || 'Verified'}
                    </span>
                  </div>
                  <p className="text-xs text-blue-800/80 dark:text-blue-300/80">
                    Ghana business identification, operational premises & contact information verified on AuraCentra.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {onOpenCertificate && (
                  <button
                    type="button"
                    onClick={() => onOpenCertificate(business)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-slate-700 text-xs font-bold shadow-xs hover:bg-blue-50 transition-all cursor-pointer"
                  >
                    <Award className="w-3.5 h-3.5 text-amber-500" />
                    <span>View Certificate</span>
                  </button>
                )}
              </div>
            </div>
          ) : business.verificationStatus === 'pending' ? (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center gap-3 text-amber-900 dark:text-amber-200 text-xs">
              <Clock className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <strong>Verification In Progress:</strong> Documents have been submitted and are under active review by AuraCentra compliance officers.
              </div>
            </div>
          ) : null}

          {/* Active Business Announcements & Promos (Published by Business Owner) */}
          {business.updates && business.updates.filter((u) => u.isActive).length > 0 && (
            <div className="space-y-3">
              {business.updates.filter((u) => u.isActive).map((upd) => (
                <div
                  key={upd.id}
                  className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 via-yellow-50/70 to-amber-100/50 dark:from-amber-950/40 dark:via-yellow-950/20 dark:to-amber-900/30 border border-amber-300/80 dark:border-amber-700/60 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-amber-500/20">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-600 text-white">
                          {upd.badgeLabel || upd.type.replace('_', ' ').toUpperCase()}
                        </span>
                        <h4 className="text-sm font-black text-slate-900 dark:text-white">
                          {upd.title}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
                        {upd.content}
                      </p>
                    </div>
                  </div>
                  {upd.validUntil && (
                    <div className="text-[11px] font-bold text-amber-800 dark:text-amber-300 bg-amber-200/60 dark:bg-amber-900/60 px-2.5 py-1 rounded-xl shrink-0">
                      Valid until: {new Date(upd.validUntil).toLocaleDateString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* 3. Main Business Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left 2 Cols: Description, Services, Highlights */}
            <div className="md:col-span-2 space-y-6">
              {/* Overview */}
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                  About {business.name}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {business.description}
                </p>
              </div>

              {/* Services Offered */}
              {business.services && business.services.length > 0 && (
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">
                    Services & Products Offered
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {business.services.map((service, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 text-xs font-medium text-slate-800 dark:text-slate-200"
                      >
                        <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                        <span>{service}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Features & Amenities */}
              {business.features && business.features.length > 0 && (
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">
                    Highlights & Credentials
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {business.features.map((feat, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium border border-blue-100 dark:border-blue-800/40"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                        <span>{feat}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Direct Inquiry / Contact Dispatcher */}
              <div className="p-5 rounded-2xl bg-blue-50/50 dark:bg-slate-800/80 border border-blue-100 dark:border-slate-700 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span>Send Direct Inquiry to {business.name}</span>
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Need a price estimate, booking, or product availability? Submit your request below.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSendInquiry} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ama Mensah"
                        value={inquiryName}
                        onChange={(e) => setInquiryName(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="0508203673"
                        value={inquiryPhone}
                        onChange={(e) => setInquiryPhone(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Service Needed
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Quotation or Booking"
                        value={inquiryService}
                        onChange={(e) => setInquiryService(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Message / Inquiry Details
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Please let us know how we can help you..."
                      value={inquiryMessage}
                      onChange={(e) => setInquiryMessage(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingInquiry}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md cursor-pointer transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmittingInquiry ? 'Sending Inquiry...' : 'Submit Inquiry'}</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Right Col: Quick Contact & Location */}
            <div className="space-y-5">
              {/* Contact Actions Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Direct Contact Options
                </h4>

                {/* Request a Quote Button */}
                {onOpenQuote && (
                  <button
                    type="button"
                    onClick={() => onOpenQuote(business)}
                    className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold py-3 px-4 rounded-xl shadow-md shadow-blue-600/20 transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Request a Quote / Inquire</span>
                  </button>
                )}

                {/* WhatsApp Direct with Pre-filled Template Hook */}
                <div className="space-y-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      contactBusinessOnWhatsApp(business, {
                        senderName: currentUser?.name,
                        inquiryType: 'general',
                      })
                    }
                    className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-xs font-bold py-3 px-4 rounded-xl shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                    id={`whatsapp-contact-btn-${business.id}`}
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Chat on WhatsApp (Pre-filled Inquiry)</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        contactBusinessOnWhatsApp(business, {
                          senderName: currentUser?.name,
                          inquiryType: 'quote',
                        })
                      }
                      className="flex-1 py-1.5 px-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-[11px] font-semibold text-center border border-emerald-200/60 dark:border-emerald-800/60 transition-colors cursor-pointer"
                      title="Send price quote inquiry template on WhatsApp"
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
                      className="flex-1 py-1.5 px-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-[11px] font-semibold text-center border border-emerald-200/60 dark:border-emerald-800/60 transition-colors cursor-pointer"
                      title="Send availability inquiry template on WhatsApp"
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
                          if (onShowToast) {
                            onShowToast('WhatsApp Template Copied', 'Paste it directly into any chat.', 'success');
                          }
                        }
                      }}
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-[11px] font-semibold border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer shrink-0"
                      title="Copy inquiry template text"
                    >
                      {copiedTemplate ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Direct Phone Call */}
                <a
                  href={`tel:${business.phone}`}
                  className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-3 px-4 rounded-xl shadow-md transition-all active:scale-[0.98]"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call {business.phone}</span>
                </a>

                {/* Email */}
                {business.email && (
                  <a
                    href={`mailto:${business.email}?subject=Inquiry%20via%20AuraCentra`}
                    className="w-full inline-flex items-center justify-center gap-2 bg-white dark:bg-slate-700 hover:bg-slate-100 text-slate-800 dark:text-slate-200 text-xs font-semibold py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-600 transition-all"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Email Business</span>
                  </a>
                )}

                {/* Website */}
                {business.website && (
                  <a
                    href={business.website.startsWith('http') ? business.website : `https://${business.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 bg-white dark:bg-slate-700 hover:bg-slate-100 text-slate-800 dark:text-slate-200 text-xs font-semibold py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-600 transition-all"
                  >
                    <Globe className="w-4 h-4" />
                    <span>Visit Official Website</span>
                  </a>
                )}
              </div>

              {/* Physical Location & Directions */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Physical Location</span>
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                </h4>

                <p className="text-xs font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                  {business.address}, {business.city}, {business.region}
                </p>

                {business.digitalAddress && (
                  <div className="p-2.5 rounded-xl bg-blue-100/70 dark:bg-blue-950/60 text-blue-900 dark:text-blue-300 text-xs font-mono font-bold flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
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
                      className="inline-flex items-center gap-1 text-[11px] font-sans font-semibold text-blue-700 dark:text-cyan-400 hover:underline cursor-pointer"
                    >
                      {copiedGps ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedGps ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => onOpenMap(business)}
                    className="inline-flex items-center justify-center gap-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-blue-600 hover:text-white text-slate-800 dark:text-slate-200 text-xs font-semibold py-2 px-3 rounded-xl transition-colors cursor-pointer"
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
                    <span>Route (GPS)</span>
                  </a>
                </div>
              </div>

              {/* Opening Hours Schedule */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-2.5">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Opening Hours</span>
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                </h4>

                <div className="space-y-1.5 text-xs">
                  {daysOfWeek.map((day) => {
                    const isToday = day === currentDayName;
                    const hours = business.openingHours ? business.openingHours[day] : '08:00 - 18:00';
                    return (
                      <div
                        key={day}
                        className={`flex items-center justify-between py-1 px-2 rounded-lg ${
                          isToday
                            ? 'bg-blue-100/80 dark:bg-blue-900/40 font-bold text-blue-900 dark:text-blue-200'
                            : 'text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <span className="capitalize">{day} {isToday && '(Today)'}</span>
                        <span>{hours}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Report Business Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-600">
                <AlertCircle className="w-5 h-5" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Report {business.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsReportModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Help us maintain directory authenticity. All reports are immediately reviewed by AuraCentra moderators.
            </p>

            <form onSubmit={handleSubmitReport} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Reason for Reporting *
                </label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="incorrect_information">Incorrect location or contact information</option>
                  <option value="closed_or_non_existent">Business is permanently closed or does not exist</option>
                  <option value="fraud_or_scam">Suspected fraudulent activity or scam</option>
                  <option value="fake_verification">Unverified or misleading claims</option>
                  <option value="inappropriate_content">Inappropriate photo or content</option>
                  <option value="harassment_or_abuse">Harassment or abusive behavior</option>
                  <option value="other">Other issue</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Detailed Explanation *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Please describe specifically what is inaccurate or suspicious..."
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Your Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={reporterName}
                    onChange={(e) => setReporterName(e.target.value)}
                    placeholder="Kwame"
                    className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Your Phone/Email (Optional)
                  </label>
                  <input
                    type="text"
                    value={reporterContact}
                    onChange={(e) => setReporterContact(e.target.value)}
                    placeholder="0508203673"
                    className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md cursor-pointer"
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
