import React, { useState, useMemo } from 'react';
import { 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  CheckCircle2, 
  MapPin, 
  Building2,
  Phone,
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Business, FilterState } from '../types';

interface DiscoverBusinessesSectionProps {
  businesses: Business[];
  onSelectBusiness: (business: Business) => void;
  onViewAllBusinesses: () => void;
  onOpenQuote?: (business: Business) => void;
  onQuickContactWhatsApp?: (business: Business) => void;
  onOpenRegister?: () => void;
}

export const DiscoverBusinessesSection: React.FC<DiscoverBusinessesSectionProps> = ({
  businesses,
  onSelectBusiness,
  onViewAllBusinesses,
  onOpenQuote,
  onQuickContactWhatsApp,
  onOpenRegister,
}) => {
  const [activeTab, setActiveTab] = useState<'trending' | 'near_you' | 'newly_verified' | 'top_rated'>('trending');
  const [pageIndex, setPageIndex] = useState(0);

  const tabs = [
    { id: 'trending', label: 'Trending' },
    { id: 'near_you', label: 'Popular Near You' },
    { id: 'newly_verified', label: 'Newly Verified' },
    { id: 'top_rated', label: 'Top Rated' },
  ] as const;

  // Filter and sort businesses based on the active tab
  const displayedBusinesses = useMemo(() => {
    let list = businesses.filter((b) => b.listingStatus !== 'pending_approval' && b.listingStatus !== 'rejected');
    
    if (activeTab === 'trending') {
      list = [...list].sort((a, b) => (b.views || 0) + (b.leadsCount || 0) * 3 - ((a.views || 0) + (a.leadsCount || 0) * 3));
    } else if (activeTab === 'near_you') {
      list = [...list].sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0) || (b.rating || 0) - (a.rating || 0));
    } else if (activeTab === 'newly_verified') {
      list = [...list].sort((a, b) => {
        const isVerA = a.verificationStatus === 'verified' ? 1 : 0;
        const isVerB = b.verificationStatus === 'verified' ? 1 : 0;
        if (isVerB !== isVerA) return isVerB - isVerA;

        const timeA = new Date(a.verificationDetails?.verifiedAt || a.updatedAt || a.createdAt || 0).getTime();
        const timeB = new Date(b.verificationDetails?.verifiedAt || b.updatedAt || b.createdAt || 0).getTime();
        return timeB - timeA;
      });
    } else if (activeTab === 'top_rated') {
      list = [...list].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return list;
  }, [businesses, activeTab]);

  const itemsPerPage = 5;
  const totalPages = Math.ceil(displayedBusinesses.length / itemsPerPage) || 1;
  const paginatedBusinesses = displayedBusinesses.slice(pageIndex * itemsPerPage, (pageIndex + 1) * itemsPerPage);

  const handlePrev = () => {
    setPageIndex((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
  };

  const handleNext = () => {
    setPageIndex((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
  };

  return (
    <section className="space-y-5" id="discover-businesses-section">
      {/* Header with Title, View All & Navigation Arrows */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Discover businesses
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onViewAllBusinesses}
            className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1 group cursor-pointer"
          >
            <span>View all businesses</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Carousel Buttons */}
          <div className="hidden sm:flex items-center gap-1">
            <button
              type="button"
              onClick={handlePrev}
              className="p-1.5 rounded-full border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Previous businesses"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="p-1.5 rounded-full border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Next businesses"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-slate-200 dark:border-slate-800 pb-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id);
                setPageIndex(0);
              }}
              className={`px-3 py-1.5 text-xs sm:text-sm font-bold rounded-lg transition-colors shrink-0 cursor-pointer ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 5-Column Responsive Cards Grid or Empty State */}
      {paginatedBusinesses.length === 0 ? (
        <div className="py-12 px-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-dashed border-slate-200 dark:border-slate-800 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
            <Building2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Fresh Portal Directory
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            No businesses are currently listed. New businesses appear here only after completing due-process registration and GhanaPost GPS verification.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {paginatedBusinesses.map((biz, idx) => {
            const badgeText = idx === 0 ? 'TRENDING' : idx === 1 ? 'NEW' : idx === 2 ? 'POPULAR' : 'TRENDING';
            const badgeBg = idx === 0 ? 'bg-blue-600' : idx === 1 ? 'bg-emerald-600' : idx === 2 ? 'bg-amber-500' : 'bg-blue-600';

            return (
              <div
                key={biz.id}
                onClick={() => onSelectBusiness(biz)}
                className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-md hover:border-blue-400 dark:hover:border-blue-500 transition-all flex flex-col cursor-pointer"
              >
                {/* Image Container */}
                <div className="relative aspect-[4/3] w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <img
                    src={biz.coverImage || (biz.gallery && biz.gallery[0]) || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80'}
                    alt={biz.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />

                  {/* Badge matching Image 1 */}
                  <div className="absolute top-2.5 left-2.5">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-black text-white ${badgeBg} uppercase tracking-wider shadow-xs`}>
                      {badgeText}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
                  <div className="space-y-1">
                    <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider truncate">
                      {biz.category}
                    </div>
                    <div className="flex items-center gap-1.5 min-w-0">
                      {biz.logo && (
                        <img
                          src={biz.logo}
                          alt=""
                          className="w-5 h-5 rounded-md object-contain bg-white p-0.5 border border-slate-200 dark:border-slate-800 shrink-0 relative z-10 shadow-2xs"
                          loading="lazy"
                        />
                      )}
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-600 transition-colors">
                        {biz.name}
                      </h3>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 truncate">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{biz.city || biz.region}</span>
                    </div>
                  </div>

                  {/* Footer of Card: Rating & Verified Badge */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    {biz.reviewCount > 0 && biz.rating > 0 ? (
                      <div className="flex items-center gap-1 font-bold text-slate-700 dark:text-slate-300">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{biz.rating.toFixed(1)}</span>
                        <span className="text-slate-400 font-normal text-[11px]">({biz.reviewCount} {biz.reviewCount === 1 ? 'review' : 'reviews'})</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-slate-400 text-[11px] font-medium">
                        <Star className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
                        <span>Unrated (0 reviews)</span>
                      </div>
                    )}

                    {biz.verificationStatus === 'verified' && (
                      <div className="flex items-center gap-1 text-blue-600 dark:text-cyan-400 text-[11px] font-bold">
                        <span>Verified</span>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
