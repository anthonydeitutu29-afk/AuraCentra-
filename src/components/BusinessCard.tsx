import React from 'react';
import { 
  CheckCircle2, 
  Star, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Bookmark, 
  BookmarkCheck, 
  Layers, 
  Clock, 
  ExternalLink,
  ShieldCheck,
  Eye,
  ArrowUpRight,
  QrCode,
  FileText
} from 'lucide-react';
import { Business } from '../types';

interface BusinessCardProps {
  business: Business;
  isSaved: boolean;
  isCompared: boolean;
  onToggleSave: (businessId: string) => void;
  onToggleCompare: (business: Business) => void;
  onSelect: (business: Business) => void;
  onQuickContactWhatsApp: (business: Business) => void;
  onOpenQuote?: (business: Business) => void;
  onOpenQR?: (business: Business) => void;
}

export const BusinessCard: React.FC<BusinessCardProps> = ({
  business,
  isSaved,
  isCompared,
  onToggleSave,
  onToggleCompare,
  onSelect,
  onQuickContactWhatsApp,
  onOpenQuote,
  onOpenQR,
}) => {
  // Check if open now based on today's day
  const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
  const currentDay = daysOfWeek[new Date().getDay()];
  const todayHours = business.openingHours ? business.openingHours[currentDay] : 'Open';
  const isOpen = todayHours && todayHours.toLowerCase() !== 'closed';

  return (
    <div 
      className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-blue-100/90 dark:border-slate-800 shadow-sm hover:shadow-lg hover:shadow-blue-600/10 hover:border-blue-400/80 dark:hover:border-blue-500/50 transition-all duration-300 flex flex-col overflow-hidden"
      id={`business-card-${business.id}`}
    >
      {/* Cover Image & Quick Badges */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-800 cursor-pointer" onClick={() => onSelect(business)}>
        <img
          src={business.coverImage || business.gallery[0] || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'}
          alt={business.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-black/10 to-black/20" />

        {/* Top Badges: Category & Actions */}
        <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3 right-2.5 sm:right-3 flex items-center justify-between">
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-white/95 dark:bg-slate-900/95 text-blue-900 dark:text-blue-200 backdrop-blur-md shadow-xs border border-blue-50 dark:border-slate-800">
            {business.category}
          </span>

          <div className="flex items-center gap-1.5">
            {/* Compare Toggle Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleCompare(business);
              }}
              className={`p-2 rounded-full backdrop-blur-md transition-all ${
                isCompared
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white/90 dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 hover:bg-white'
              }`}
              title={isCompared ? 'Remove from compare' : 'Compare with other businesses'}
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
                className="p-2 rounded-full backdrop-blur-md bg-white/90 dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 hover:bg-white transition-all"
                title="View QR Code & Share"
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
              className={`p-2 rounded-full backdrop-blur-md transition-all ${
                isSaved
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'bg-white/90 dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 hover:bg-white'
              }`}
              title={isSaved ? 'Remove from saved' : 'Save business'}
            >
              {isSaved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Bottom Badge inside Cover: Verification & Open Status */}
        <div className="absolute bottom-2.5 sm:bottom-3 left-2.5 sm:left-3 right-2.5 sm:right-3 flex items-center justify-between text-white text-xs">
          <div className="flex items-center gap-1.5">
            {business.verificationStatus === 'verified' ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-600/95 backdrop-blur-sm font-bold text-[11px] shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                <span>Verified</span>
              </span>
            ) : business.verificationStatus === 'pending' ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/95 backdrop-blur-sm font-bold text-[11px]">
                <Clock className="w-3.5 h-3.5" />
                <span>Pending</span>
              </span>
            ) : null}
          </div>

          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-md ${
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
              src={business.logo}
              alt={`${business.name} logo`}
              className="w-11 h-11 rounded-xl object-cover border border-blue-100 dark:border-slate-700 shrink-0 bg-white p-0.5 shadow-xs"
              loading="lazy"
            />
            <div className="flex-1 min-w-0">
              <h3 
                onClick={() => onSelect(business)}
                className="text-base font-bold text-slate-900 dark:text-white truncate cursor-pointer hover:text-blue-600 dark:hover:text-cyan-400 transition-colors"
                title={business.name}
              >
                {business.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate font-semibold">
                {business.subCategory || business.category} • {business.priceLevel}
              </p>
            </div>
          </div>

          {/* Rating, Reviews & Location */}
          <div className="flex items-center gap-2.5 text-xs mb-2.5">
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{business.rating.toFixed(1)}</span>
              <span className="text-slate-400 font-normal">({business.reviewCount})</span>
            </div>

            <span className="text-slate-300 dark:text-slate-700">•</span>

            <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300 truncate font-medium">
              <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span className="truncate">{business.city}, {business.region}</span>
            </div>
          </div>

          {/* Tagline / Brief Description */}
          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-3 leading-relaxed">
            {business.tagline || business.description}
          </p>

          {/* Highlighted Services Tags */}
          <div className="flex flex-wrap gap-1.5 mb-3.5">
            {business.services.slice(0, 3).map((service, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50/70 dark:bg-slate-800 text-blue-800 dark:text-slate-300 border border-blue-100 dark:border-slate-700/60"
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
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5">
          {/* Primary View Profile Button */}
          <button
            type="button"
            onClick={() => onSelect(business)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs font-bold py-2 px-3 rounded-full transition-all shadow-xs"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Profile</span>
          </button>

          {/* Quick Quote / Inquiry Button */}
          {onOpenQuote && (
            <button
              type="button"
              onClick={() => onOpenQuote(business)}
              className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-600 hover:text-white transition-all text-xs font-semibold border border-blue-200/80 dark:border-blue-800/60"
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
            className="inline-flex items-center justify-center p-2 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-600 hover:text-white transition-all shadow-xs border border-emerald-200/80 dark:border-emerald-800/60"
            title="Chat directly on WhatsApp"
          >
            <MessageSquare className="w-4 h-4" />
          </button>

          {/* Direct Phone Call */}
          <a
            href={`tel:${business.phone}`}
            className="inline-flex items-center justify-center p-2 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-600 hover:text-white transition-all border border-slate-200 dark:border-slate-700"
            title={`Call ${business.phone}`}
          >
            <Phone className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
