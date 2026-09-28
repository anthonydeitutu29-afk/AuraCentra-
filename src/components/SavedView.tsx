import React, { useState } from 'react';
import { 
  Bookmark, 
  Search, 
  Trash2, 
  Compass, 
  ArrowLeft,
  BadgeCheck,
  Building2
} from 'lucide-react';
import { Business } from '../types';
import { BusinessCard } from './BusinessCard';

interface SavedViewProps {
  businesses: Business[];
  savedBusinessIds: string[];
  onToggleSave: (id: string) => void;
  onSelectBusiness: (business: Business) => void;
  onBackToExplore: () => void;
  onClearAllSaved?: () => void;
}

export const SavedView: React.FC<SavedViewProps> = ({
  businesses,
  savedBusinessIds,
  onToggleSave,
  onSelectBusiness,
  onBackToExplore,
  onClearAllSaved,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const savedBusinesses = businesses.filter((b) => savedBusinessIds.includes(b.id));

  const filteredSaved = savedBusinesses.filter((b) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      b.name.toLowerCase().includes(q) ||
      b.category.toLowerCase().includes(q) ||
      b.region.toLowerCase().includes(q) ||
      (b.city && b.city.toLowerCase().includes(q))
    );
  });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 transition-colors">
      
      {/* Header laying directly on background */}
      <div>
        <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-wider mb-1.5">
          <Bookmark className="w-4 h-4 fill-current" />
          <span>PERSONAL ENTERPRISE SHORTLIST</span>
        </div>
        
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Saved Businesses ({savedBusinesses.length})
        </h1>
        
        <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Your bookmarked Ghanaian suppliers, vetted service providers, and craftspeople saved for fast direct access.
        </p>

        {/* Buttons Row */}
        <div className="mt-4 flex items-center justify-between gap-3">
          <button
            onClick={onBackToExplore}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Discovery</span>
          </button>

          {savedBusinesses.length > 0 && onClearAllSaved && (
            <button
              onClick={onClearAllSaved}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl transition-colors cursor-pointer"
              title="Clear all saved bookmarks"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          )}
        </div>
      </div>

      {/* Search Input when items exist */}
      {savedBusinesses.length > 0 && (
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search within your saved listings..."
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-hidden focus:border-blue-600 shadow-2xs"
          />
        </div>
      )}

      {/* Main Content Area laying directly on page background */}
      {savedBusinesses.length === 0 ? (
        <div className="py-12 px-4 text-center max-w-md mx-auto space-y-3">
          <div className="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto shadow-2xs">
            <Bookmark className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            No Saved Businesses Yet
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Click the bookmark icon on any business card while browsing the Ghana directory to save it here for instant reference.
          </p>

          <div className="pt-2">
            <button
              onClick={onBackToExplore}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Ghana Directory</span>
            </button>
          </div>
        </div>
      ) : filteredSaved.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
            No saved listings match "{searchQuery}".
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="mt-2 text-xs text-blue-600 dark:text-blue-400 hover:underline font-bold cursor-pointer"
          >
            Clear search filter
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSaved.map((biz) => (
            <BusinessCard
              key={biz.id}
              business={biz}
              isSaved={true}
              onToggleSave={onToggleSave}
              onSelect={onSelectBusiness}
            />
          ))}
        </div>
      )}

      {/* Footer matching Image 2 with tightened spacing */}
      <div className="pt-4 pb-2 text-center text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200/80 dark:border-slate-700">
        <p>© 2026 AuraCentra • Tony's Digital Marketing & Business Hub</p>
        <div className="mt-1 flex justify-center">
          <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs">
            Ghana 🇬🇭
          </span>
        </div>
      </div>

    </div>
  );
};
