import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Megaphone, 
  Flame, 
  Calendar, 
  AlertTriangle, 
  ChevronLeft, 
  ChevronRight, 
  Copy, 
  Check, 
  X, 
  ArrowRight, 
  Clock, 
  Tag, 
  ShieldCheck, 
  BellRing,
  Gift,
  ExternalLink,
  RotateCcw
} from 'lucide-react';
import { PromotionalAnnouncement } from '../types';

export const DEFAULT_PROMOTIONS: PromotionalAnnouncement[] = [
  {
    id: 'promo-independence-boost',
    type: 'offer',
    badge: 'Ghana Independence Special',
    title: '🇬🇭 Free Verified Enterprise Spotlight & 0% Listing Fee',
    subtitle: 'Enlist your business today to receive instant Gold Verification, VIP discovery ranking, and a free digital QR showcase kit across all 16 regions.',
    highlightText: 'Save 100% On Verification',
    promoCode: 'GHGROWTH26',
    countdownTarget: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000).toISOString(),
    ctaText: 'Claim Free Spotlight',
    ctaAction: 'register',
    active: true,
  },
  {
    id: 'promo-urgent-update',
    type: 'urgent',
    badge: 'Urgent Platform Notice',
    title: '⚡ Fast-Track GhanaPost GPS Verification Active',
    subtitle: 'Official digital address syncing is now live. Verified listings receive 3x higher quote requests and instant Google Maps route navigation.',
    highlightText: 'Fast-Track in 2 Hours',
    ctaText: 'Verify Your Listing',
    ctaAction: 'verify',
    isUrgent: true,
    active: true,
  },
  {
    id: 'promo-sme-summit',
    type: 'event',
    badge: 'Upcoming Special Event',
    title: '🎉 Ghana Tech & SME Commerce Summit 2026',
    subtitle: 'Accra International Conference Centre • Connect with 5,000+ corporate buyers, investors, and certified Ghanaian enterprises.',
    highlightText: 'Registration Open',
    promoCode: 'SUMMITVIP',
    countdownTarget: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString(),
    ctaText: 'Explore Directory Leaders',
    ctaAction: 'explore',
    active: true,
  },
  {
    id: 'promo-whatsapp-hub',
    type: 'offer',
    badge: 'New Feature Release',
    title: '📲 Direct WhatsApp Quote Engine & Lead Generator',
    subtitle: 'Customers can now send direct quotes and service inquiries straight to your phone. Enable Quote Requests on your profile today.',
    highlightText: 'Zero Commission Leads',
    ctaText: 'Enlist Your Business',
    ctaAction: 'register',
    active: true,
  }
];

interface PromotionalBannerProps {
  promotions?: PromotionalAnnouncement[];
  onOpenRegister: () => void;
  onSelectCategory?: (categoryId: string) => void;
  onShowToast: (title: string, message?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const PromotionalBanner: React.FC<PromotionalBannerProps> = ({
  promotions = DEFAULT_PROMOTIONS,
  onOpenRegister,
  onSelectCategory,
  onShowToast,
}) => {
  const activePromos = promotions.filter((p) => p.active);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  const currentPromo = activePromos[currentIndex] || activePromos[0];

  // Auto rotate carousel every 8 seconds when not paused
  useEffect(() => {
    if (activePromos.length <= 1 || isPaused || isDismissed) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activePromos.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [activePromos.length, isPaused, isDismissed]);

  // Countdown calculation for active promotion
  useEffect(() => {
    if (!currentPromo?.countdownTarget) {
      setTimeLeft(null);
      return;
    }

    const calculateTime = () => {
      const target = new Date(currentPromo.countdownTarget!).getTime();
      const now = Date.now();
      const diff = Math.max(0, target - now);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [currentPromo]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % activePromos.length);
  }, [activePromos.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + activePromos.length) % activePromos.length);
  }, [activePromos.length]);

  const handleCopyCode = (code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    onShowToast(
      'Voucher Code Copied!',
      `Code "${code}" copied to clipboard. Apply when enlisting your business for free benefits!`,
      'success'
    );
    setTimeout(() => setCopiedCode(null), 3000);
  };

  const handleCtaClick = () => {
    if (!currentPromo) return;

    switch (currentPromo.ctaAction) {
      case 'register':
      case 'verify':
        onOpenRegister();
        break;
      case 'category':
        if (currentPromo.ctaTarget && onSelectCategory) {
          onSelectCategory(currentPromo.ctaTarget);
        } else {
          const el = document.getElementById('browse-categories-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }
        break;
      case 'explore':
      default: {
        const el = document.getElementById('main-directory-section');
        el?.scrollIntoView({ behavior: 'smooth' });
        break;
      }
    }
  };

  if (!activePromos.length) return null;

  // If user dismissed the banner, show an unobtrusive pill so they can restore it anytime
  if (isDismissed) {
    return (
      <div className="w-full flex justify-center py-2 animate-in fade-in duration-300">
        <button
          type="button"
          onClick={() => setIsDismissed(false)}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50/90 dark:bg-slate-900/90 hover:bg-blue-100 text-blue-700 dark:text-cyan-300 text-xs font-bold border border-blue-200/80 dark:border-blue-900/80 shadow-xs transition-all cursor-pointer"
          title="View special offers and announcements"
        >
          <BellRing className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400 animate-bounce" />
          <span>Active Announcements & Offers ({activePromos.length})</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-600 text-white font-extrabold">Show</span>
        </button>
      </div>
    );
  }

  // Theme styling based on promotion type
  const isUrgent = currentPromo.type === 'urgent';
  const isOffer = currentPromo.type === 'offer';
  const isEvent = currentPromo.type === 'event';

  let containerBg = 'bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white border-blue-700/60 shadow-blue-950/20';
  let badgeStyle = 'bg-blue-500/30 text-cyan-300 border-blue-400/30';
  let accentButton = 'bg-cyan-400 hover:bg-cyan-300 text-blue-950';
  let iconComponent = <Megaphone className="w-5 h-5 text-cyan-300" />;

  if (isUrgent) {
    containerBg = 'bg-gradient-to-r from-amber-950 via-rose-950 to-slate-950 text-white border-amber-600/40 shadow-amber-950/20';
    badgeStyle = 'bg-amber-500/25 text-amber-300 border-amber-500/40';
    accentButton = 'bg-amber-400 hover:bg-amber-300 text-slate-950';
    iconComponent = <AlertTriangle className="w-5 h-5 text-amber-400 animate-pulse" />;
  } else if (isOffer) {
    containerBg = 'bg-gradient-to-r from-blue-950 via-blue-900 to-cyan-950 text-white border-cyan-500/30 shadow-cyan-950/20';
    badgeStyle = 'bg-cyan-500/20 text-cyan-200 border-cyan-400/40';
    accentButton = 'bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 text-slate-950';
    iconComponent = <Gift className="w-5 h-5 text-cyan-300" />;
  } else if (isEvent) {
    containerBg = 'bg-gradient-to-r from-indigo-950 via-slate-900 to-blue-950 text-white border-indigo-500/40 shadow-indigo-950/20';
    badgeStyle = 'bg-indigo-500/30 text-indigo-200 border-indigo-400/40';
    accentButton = 'bg-indigo-400 hover:bg-indigo-300 text-slate-950';
    iconComponent = <Calendar className="w-5 h-5 text-indigo-300" />;
  }

  return (
    <div 
      className="relative w-full overflow-hidden transition-all duration-300 select-none group/banner"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
      id="promotional-announcement-banner"
    >
      <div className={`relative w-full rounded-2xl sm:rounded-3xl border shadow-lg backdrop-blur-md p-3.5 sm:p-5 transition-all ${containerBg}`}>
        {/* Subtle Decorative Ambient Background Glow */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-cyan-400/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

        {/* Top Bar for Small Mobile: Badge + Controls */}
        <div className="flex items-center justify-between gap-2 mb-2 sm:mb-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border backdrop-blur-sm shadow-xs ${badgeStyle}`}>
              {iconComponent}
              <span>{currentPromo.badge}</span>
            </span>

            {currentPromo.highlightText && (
              <span className="hidden xs:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white/10 text-white border border-white/15">
                <Flame className="w-3 h-3 text-amber-400" />
                <span>{currentPromo.highlightText}</span>
              </span>
            )}
          </div>

          {/* Controls: Pagination Dots, Next/Prev, Dismiss */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            {activePromos.length > 1 && (
              <div className="flex items-center gap-1 bg-black/20 p-1 rounded-full border border-white/10">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-all cursor-pointer"
                  title="Previous promotion"
                  aria-label="Previous announcement"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-center gap-1 px-1">
                  {activePromos.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        idx === currentIndex ? 'w-4 bg-cyan-400' : 'w-1.5 bg-white/40 hover:bg-white/70'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleNext}
                  className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-all cursor-pointer"
                  title="Next promotion"
                  aria-label="Next announcement"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Dismiss Button */}
            <button
              type="button"
              onClick={() => setIsDismissed(true)}
              className="p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/20 transition-all cursor-pointer"
              title="Dismiss announcement"
              aria-label="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body: Responsive Grid on tablet/desktop, Clean Stack on Mobile */}
        <div className="mt-2.5 sm:mt-3 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Main Copy Area */}
          <div className="space-y-1.5 flex-1 min-w-0">
            <h3 className="text-sm sm:text-base md:text-lg font-black tracking-tight text-white flex items-center gap-2">
              <span>{currentPromo.title}</span>
            </h3>
            
            <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed max-w-3xl line-clamp-2 sm:line-clamp-3">
              {currentPromo.subtitle}
            </p>
          </div>

          {/* Right Action Hub: Countdown, Voucher Code, & CTA Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 shrink-0 pt-1 lg:pt-0">
            {/* Live Countdown Timer (if target provided) */}
            {timeLeft && (
              <div className="flex items-center justify-center gap-1.5 bg-black/30 border border-white/10 px-3 py-1.5 rounded-xl text-center">
                <Clock className="w-3.5 h-3.5 text-cyan-300 shrink-0" />
                <div className="flex items-center gap-1 text-[11px] sm:text-xs font-mono font-bold text-slate-100">
                  {timeLeft.days > 0 && (
                    <span>
                      <strong className="text-cyan-300 font-extrabold">{timeLeft.days}</strong>d
                    </span>
                  )}
                  <span>
                    <strong className="text-cyan-300 font-extrabold">{String(timeLeft.hours).padStart(2, '0')}</strong>h
                  </span>
                  <span>
                    <strong className="text-cyan-300 font-extrabold">{String(timeLeft.minutes).padStart(2, '0')}</strong>m
                  </span>
                  <span>
                    <strong className="text-cyan-300 font-extrabold">{String(timeLeft.seconds).padStart(2, '0')}</strong>s
                  </span>
                </div>
              </div>
            )}

            {/* Promo Code Copy Button (if present) */}
            {currentPromo.promoCode && (
              <button
                type="button"
                onClick={(e) => handleCopyCode(currentPromo.promoCode!, e)}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs font-bold transition-all active:scale-[0.98] cursor-pointer min-h-[40px]"
                title="Click to copy voucher code"
              >
                <Tag className="w-3.5 h-3.5 text-amber-300" />
                <span className="font-mono tracking-wider">{currentPromo.promoCode}</span>
                {copiedCode === currentPromo.promoCode ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-white/70" />
                )}
              </button>
            )}

            {/* Primary Action Button */}
            <button
              type="button"
              onClick={handleCtaClick}
              className={`inline-flex items-center justify-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm shadow-md transition-all active:scale-[0.98] cursor-pointer min-h-[42px] ${accentButton}`}
            >
              <span>{currentPromo.ctaText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
