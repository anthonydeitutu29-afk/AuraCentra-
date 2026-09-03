import React, { useState } from 'react';
import { 
  CheckCircle2, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Bookmark, 
  BookmarkCheck, 
  Layers, 
  Clock, 
  Eye, 
  QrCode, 
  FileText,
  Share2,
  Check,
  Globe,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { Business } from '../types';

interface BusinessCardProps {
  business: Business;
  isSaved: boolean;
  isCompared: boolean;
  distanceKm?: number;
  onToggleSave: (businessId: string) => void;
  onToggleCompare: (business: Business) => void;
  onSelect: (business: Business) => void;
  onQuickContactWhatsApp: (business: Business) => void;
  onOpenQuote?: (business: Business) => void;
  onOpenQR?: (business: Business) => void;
  onShare?: (business: Business) => void;
  onRate?: (business: Business) => void;
}

export const BusinessCard: React.FC<BusinessCardProps> = ({
  business,
  isSaved,
  isCompared,
  distanceKm,
  onToggleSave,
  onToggleCompare,
  onSelect,
  onQuickContactWhatsApp,
  onOpenQuote,
  onOpenQR,
  onShare,
}) => {
  const [justShared, setJustShared] = useState(false);

  // Format distance
  const formattedDistance = distanceKm !== undefined 
    ? (distanceKm < 1 ? `${Math.round(distanceKm * 1000)}m away` : `${distanceKm.toFixed(1)} km away`)
    : null;

  // Check if open now based on today's day
  const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
  const currentDay = daysOfWeek[new Date().getDay()];
  const todayHours = business.openingHours ? business.openingHours[currentDay] : 'Open';
  const isOpen = todayHours && todayHours.toLowerCase() !== 'closed';

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onShare) {
      onShare(business);
    } else if (navigator.share) {
      navigator.share({
        title: `${business.name} - AuraCentra Ghana`,
        text: `Discover ${business.name} on AuraCentra Ghana: ${business.tagline || business.description}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/#business-${business.id}`);
      setJustShared(true);
      setTimeout(() => setJustShared(false), 2000);
    }
  };

  return (
    <div 
      className="group relative bg-white dark:bg-black/50 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-xl hover:shadow-blue-600/10 hover:border-[#155DFC] dark:hover:border-[#155DFC] transition-all duration-300 hover:-translate-y-1 transform-gpu flex flex-col overflow-hidden will-change-transform"
      id={`business-card-${business.id}`}
    >
      {/* Cover Image & Action Badges */}
      <div 
        className="relative aspect-[16/10] sm:aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-900 cursor-pointer select-none" 
        onClick={() => onSelect(business)}
      >
        <img
          src={business.coverImage || (business.gallery && business.gallery[0]) || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'}
          alt={business.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Subtle Bottom Ambient Gradient so nothing covers the image */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

        {/* Top Badges: Category, Distance & Quick Utility Actions */}
        <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3 right-2.5 sm:right-3 flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-white/95 dark:bg-black/80 text-slate-900 dark:text-blue-200 backdrop-blur-md shadow-xs border border-slate-200/80 dark:border-slate-800">
              {business.category}
            </span>

            {formattedDistance && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold bg-[#155DFC] text-white backdrop-blur-md shadow-md border border-blue-400/40 animate-in fade-in duration-150">
                <MapPin className="w-3 h-3 text-cyan-300 fill-cyan-300" />
                <span>{formattedDistance}</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {/* Share Button */}
            <button
              type="button"
              onClick={handleShareClick}
              className={`p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                justShared
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white/90 dark:bg-black/70 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-800'
              }`}
              title="Share business profile"
              aria-label="Share business"
            >
              {justShared ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
            </button>

            {/* Compare Toggle Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleCompare(business);
              }}
              className={`p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                isCompared
                  ? 'bg-[#155DFC] text-white shadow-xs'
                  : 'bg-white/90 dark:bg-black/70 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-800'
              }`}
              title={isCompared ? 'Remove from compare' : 'Compare with other businesses'}
              aria-label="Compare business"
            >
              <Layers className="w-3.5 h-3.5" />
            </button>

            {/* QR Code Share Button */}
            {onOpenQR && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenQR(business);
                }}
                className="p-2 rounded-full backdrop-blur-md bg-white/90 dark:bg-black/70 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-800 transition-all cursor-pointer"
                title="View QR Code & Share"
                aria-label="View QR Code"
              >
                <QrCode className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Bookmark / Save Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleSave(business.id);
              }}
              className={`p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                isSaved
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'bg-white/90 dark:bg-black/70 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-800'
              }`}
              title={isSaved ? 'Remove from saved' : 'Save business'}
              aria-label="Save business"
            >
              {isSaved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Bottom Badge inside Cover: Verification & Open Status */}
        <div className="absolute bottom-2.5 sm:bottom-3 left-2.5 sm:left-3 right-2.5 sm:right-3 flex items-center justify-between text-white text-xs">
          <div className="flex items-center gap-1.5">
            {business.verificationStatus === 'verified' ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#155DFC] backdrop-blur-sm font-bold text-[11px] shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                <span>Verified Enterprise</span>
              </span>
            ) : business.verificationStatus === 'pending' ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/95 backdrop-blur-sm font-bold text-[11px]">
                <Clock className="w-3.5 h-3.5" />
                <span>Pending Review</span>
              </span>
            ) : null}
          </div>

          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-md shadow-xs ${
            isOpen ? 'bg-emerald-500/90 text-white' : 'bg-slate-700/90 text-white'
          }`}>
            {isOpen ? 'Open Now' : 'Closed'}
          </span>
        </div>
      </div>

      {/* Main Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Business Title & Logo */}
          <div className="flex items-start gap-3 mb-2.5">
            <img
              src={business.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80'}
              alt={`${business.name} logo`}
              className="w-11 h-11 rounded-xl object-contain border border-slate-200 dark:border-slate-800 shrink-0 bg-white p-1 shadow-xs relative z-10"
              loading="lazy"
            />
            <div className="flex-1 min-w-0">
              <h3 
                onClick={() => onSelect(business)}
                className="text-base font-bold text-slate-900 dark:text-white truncate cursor-pointer hover:text-[#155DFC] transition-colors"
                title={business.name}
              >
                {business.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate font-semibold">
                {business.subCategory || business.category}
              </p>
            </div>
          </div>

          {/* Location & GPS Info */}
          <div className="flex items-center gap-2 text-xs mb-2.5">
            <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300 truncate font-medium">
              <MapPin className="w-3.5 h-3.5 text-[#155DFC] shrink-0" />
              <span className="truncate">{business.city}, {business.region}</span>
            </div>
            {business.digitalAddress && (
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-black/60 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
                {business.digitalAddress}
              </span>
            )}
          </div>

          {/* Tagline / Brief Description */}
          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-3 leading-relaxed">
            {business.tagline || business.description}
          </p>

          {/* Highlighted Services Tags */}
          {business.services && business.services.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3.5">
              {business.services.slice(0, 3).map((service, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 dark:bg-blue-950/60 text-[#155DFC] dark:text-blue-400 border border-blue-100 dark:border-blue-900/40"
                >
                  {service}
                </span>
              ))}
              {business.services.length > 3 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                  +{business.services.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons: One-Tap Contact & Engagement */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
          {/* Top Row: Direct One-Tap Contact Channels (Website & Call) */}
          {(business.website || business.phone) && (
            <div className="grid grid-cols-2 gap-2">
              {business.website ? (
                <a
                  href={business.website.startsWith('http') ? business.website : `https://${business.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 dark:bg-black/50 hover:bg-blue-50 dark:hover:bg-blue-950/60 text-slate-700 dark:text-slate-200 hover:text-[#155DFC] dark:hover:text-cyan-300 transition-all text-xs font-bold border border-slate-200/80 dark:border-slate-800 shadow-2xs group/web cursor-pointer min-h-[36px]"
                  title={`Visit ${business.name} Website`}
                >
                  <Globe className="w-3.5 h-3.5 text-[#155DFC] group-hover/web:rotate-12 transition-transform shrink-0" />
                  <span className="truncate">Website</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60 ml-0.5 shrink-0" />
                </a>
              ) : (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onOpenQuote) onOpenQuote(business);
                    else onSelect(business);
                  }}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 dark:bg-black/50 hover:bg-blue-50 dark:hover:bg-blue-950/60 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200/80 dark:border-slate-800 min-h-[36px]"
                >
                  <FileText className="w-3.5 h-3.5 text-[#155DFC]" />
                  <span>Inquire</span>
                </button>
              )}

              {business.phone ? (
                <a
                  href={`tel:${business.phone}`}
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 hover:bg-emerald-600 hover:text-white text-emerald-800 dark:text-emerald-300 transition-all text-xs font-bold border border-emerald-200/80 dark:border-emerald-800/60 shadow-2xs group/call cursor-pointer min-h-[36px]"
                  title={`Call ${business.name}: ${business.phone}`}
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 group-hover/call:text-white group-hover/call:scale-110 transition-transform shrink-0" />
                  <span className="truncate">Call</span>
                </a>
              ) : (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(business);
                  }}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 dark:bg-black/50 text-slate-700 dark:text-slate-300 text-xs font-semibold border border-slate-200 dark:border-slate-800 min-h-[36px]"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-400" />
                  <span>Details</span>
                </button>
              )}
            </div>
          )}

          {/* Bottom Row: Profile Modal, Quote, and WhatsApp */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Primary View Profile Button */}
            <button
              type="button"
              onClick={() => onSelect(business)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#155DFC] hover:bg-blue-700 active:scale-[0.98] text-white text-xs font-bold py-2.5 px-3 rounded-xl transition-all shadow-xs cursor-pointer min-h-[38px]"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Full Profile</span>
            </button>

            {/* Quick Quote / Inquiry Button */}
            {onOpenQuote && (
              <button
                type="button"
                onClick={() => onOpenQuote(business)}
                className="inline-flex items-center justify-center gap-1 px-3 py-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-[#155DFC] dark:text-blue-300 hover:bg-[#155DFC] hover:text-white transition-all text-xs font-semibold border border-blue-200/80 dark:border-blue-800/60 cursor-pointer min-h-[38px]"
                title="Request Quote"
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Quote</span>
              </button>
            )}

            {/* Quick WhatsApp Contact */}
            <button
              type="button"
              onClick={() => onQuickContactWhatsApp(business)}
              className="inline-flex items-center justify-center p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-600 hover:text-white transition-all shadow-xs border border-emerald-200/80 dark:border-emerald-800/60 cursor-pointer min-h-[38px] min-w-[38px]"
              title="Chat directly on WhatsApp"
              aria-label="WhatsApp chat"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
