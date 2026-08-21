import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  Star, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Mail, 
  Globe, 
  Clock, 
  Share2, 
  Bookmark, 
  BookmarkCheck, 
  ChevronLeft, 
  ChevronRight, 
  Navigation, 
  ShieldCheck, 
  Sparkles, 
  ThumbsUp, 
  Send, 
  Layers, 
  Calendar,
  Building,
  Image as ImageIcon,
  Check,
  QrCode,
  Award,
  FileText,
  Copy,
  ExternalLink as ExtLink
} from 'lucide-react';
import { Business, BusinessReview } from '../types';

interface BusinessDetailsModalProps {
  business: Business | null;
  isOpen: boolean;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (businessId: string) => void;
  isCompared: boolean;
  onToggleCompare: (business: Business) => void;
  reviews: BusinessReview[];
  onAddReview: (review: Omit<BusinessReview, 'id' | 'date' | 'helpfulCount'>) => void;
  onHelpfulVote: (reviewId: string) => void;
  onOpenMap: (business: Business) => void;
  onOpenQuote?: (business: Business) => void;
  onOpenQR?: (business: Business) => void;
  onOpenCertificate?: (business: Business) => void;
}

export const BusinessDetailsModal: React.FC<BusinessDetailsModalProps> = ({
  business,
  isOpen,
  onClose,
  isSaved,
  onToggleSave,
  isCompared,
  onToggleCompare,
  reviews,
  onAddReview,
  onHelpfulVote,
  onOpenMap,
  onOpenQuote,
  onOpenQR,
  onOpenCertificate,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedGps, setCopiedGps] = useState(false);

  // Reset image index when business changes
  useEffect(() => {
    setActiveImageIndex(0);
    setShowReviewForm(false);
  }, [business?.id]);

  if (!isOpen || !business) return null;

  const galleryImages = business.gallery && business.gallery.length > 0 
    ? business.gallery 
    : [business.coverImage || business.logo];

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };

  // Touch Swipe handlers for mobile gallery
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && galleryImages.length > 1) {
      handleNextImage();
    }
    if (isRightSwipe && galleryImages.length > 1) {
      handlePrevImage();
    }
    setTouchStartX(null);
    setTouchEndX(null);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${business.name} on AuraCentra`,
        text: business.tagline || business.description,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !newUserName.trim()) return;

    onAddReview({
      businessId: business.id,
      userName: newUserName.trim(),
      rating: newRating,
      comment: newComment.trim(),
    });

    setNewComment('');
    setNewUserName('');
    setShowReviewForm(false);
  };

  const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
  const currentDayIndex = new Date().getDay();
  const currentDayName = daysOfWeek[currentDayIndex];
  const businessReviews = reviews.filter((r) => r.businessId === business.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh] my-auto"
        id={`business-details-modal-${business.id}`}
      >
        {/* Sticky Header Bar */}
        <div className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 sm:px-6 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={business.logo}
              alt={business.name}
              className="w-9 h-9 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
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
              className={`p-2 rounded-xl text-xs font-medium transition-all ${
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
              className={`p-2 rounded-xl text-xs font-medium transition-all ${
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
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-all"
                title="View QR Code & Share"
              >
                <QrCode className="w-4 h-4" />
              </button>
            )}

            {/* Share */}
            <button
              type="button"
              onClick={handleShare}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-all"
              title="Share listing"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>

            {/* Close Modal */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-all"
              title="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Container */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* 1. Swipeable / Interactive Gallery */}
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
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition-transform active:scale-90"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleNextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition-transform active:scale-90"
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
                      className={`h-1.5 rounded-full transition-all ${
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
                  className={`relative w-16 sm:w-20 aspect-video rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
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
                      {business.verificationDetails?.badgeType || 'Gold Enterprise'}
                    </span>
                  </div>
                  <p className="text-xs text-blue-800/80 dark:text-blue-300/80">
                    Identity, Ghana business registration & physical location verified on{' '}
                    {business.verificationDetails?.verifiedAt || '2025'}.
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
                    <span>View Certificate & Badge</span>
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

          {/* 3. Main Business Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left 2 Cols: Description, Services, Features */}
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
                    Highlights & Amenities
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
            </div>

            {/* Right Col: Quick Contact & Opening Hours */}
            <div className="space-y-5">
              {/* Contact Actions Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Direct Contact Options
                </h4>

                {/* Request a Quote / Service Inquiry Button */}
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

                {/* WhatsApp Direct */}
                <a
                  href={`https://wa.me/${business.whatsapp || business.phone}?text=Hello%20${encodeURIComponent(business.name)},%20I%20found%20your%20business%20on%20AuraCentra%20and%20would%20like%20to%20inquire.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-3 px-4 rounded-xl shadow-md transition-all active:scale-[0.98]"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat on WhatsApp</span>
                </a>

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
                    href={business.website}
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
                  <span>Physical Address</span>
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
                    href={`https://www.google.com/maps/dir/?api=1&destination=${business.latitude},${business.longitude}`}
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

          {/* 4. Customer Reviews & Ratings Section */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Customer Reviews & Ratings</span>
                  <span className="text-xs font-normal text-slate-400">
                    ({businessReviews.length} reviews)
                  </span>
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center text-amber-500">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= Math.round(business.rating) ? 'fill-amber-400' : 'text-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {business.rating.toFixed(1)} / 5.0
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-sm transition-all"
              >
                <Star className="w-3.5 h-3.5 fill-white" />
                <span>{showReviewForm ? 'Cancel Review' : 'Write a Review'}</span>
              </button>
            </div>

            {/* Interactive Write Review Form */}
            {showReviewForm && (
              <form
                onSubmit={handleSubmitReview}
                className="p-4 rounded-2xl bg-blue-50/50 dark:bg-slate-800/80 border border-blue-200 dark:border-slate-700 space-y-3 animate-in fade-in duration-200"
              >
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Share Your Experience With {business.name}
                </h4>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-600 dark:text-slate-400">Rating:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewRating(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= newRating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-xs font-bold text-amber-600">({newRating} Star{newRating > 1 ? 's' : ''})</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kwame Mensah"
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Your Review
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Tell other customers about your experience, customer service, quality, or speed..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Review</span>
                  </button>
                </div>
              </form>
            )}

            {/* Reviews List */}
            <div className="space-y-3 pt-2">
              {businessReviews.length > 0 ? (
                businessReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={rev.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                          alt={rev.userName}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                        />
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white">
                            {rev.userName}
                          </div>
                          <div className="text-[11px] text-slate-400">{rev.date}</div>
                        </div>
                      </div>

                      <div className="flex items-center text-amber-400">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${s <= rev.rating ? 'fill-amber-400' : 'text-slate-300'}`}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      {rev.comment}
                    </p>

                    {/* Owner reply if available */}
                    {rev.ownerReply && (
                      <div className="mt-2 p-3 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border-l-4 border-blue-600 text-xs">
                        <div className="font-bold text-blue-900 dark:text-blue-300 mb-0.5">
                          Response from {business.name}:
                        </div>
                        <p className="text-slate-700 dark:text-slate-300">{rev.ownerReply.text}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-end pt-1">
                      <button
                        type="button"
                        onClick={() => onHelpfulVote(rev.id)}
                        className="inline-flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>Helpful ({rev.helpfulCount})</span>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-xs text-slate-400">
                  No reviews yet for {business.name}. Be the first verified customer to leave a review!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
