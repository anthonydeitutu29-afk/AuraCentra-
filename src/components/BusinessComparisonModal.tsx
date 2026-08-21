import React from 'react';
import { 
  X, 
  CheckCircle2, 
  Star, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Trash2, 
  ShieldCheck, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { Business } from '../types';

interface BusinessComparisonModalProps {
  comparedBusinesses: Business[];
  isOpen: boolean;
  onClose: () => void;
  onRemove: (businessId: string) => void;
  onSelect: (business: Business) => void;
}

export const BusinessComparisonModal: React.FC<BusinessComparisonModalProps> = ({
  comparedBusinesses,
  isOpen,
  onClose,
  onRemove,
  onSelect,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] my-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 sticky top-0 z-20">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Compare Businesses</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-semibold">
                {comparedBusinesses.length} selected
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Evaluate credentials, ratings, services, and location before making your decision.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Matrix */}
        <div className="p-6 overflow-x-auto overflow-y-auto">
          {comparedBusinesses.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              No businesses selected for comparison. Click the layers icon on any business card to compare up to 4 businesses.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-w-[700px]">
              {comparedBusinesses.map((b) => (
                <div
                  key={b.id}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-4 space-y-4 flex flex-col justify-between"
                >
                  <div>
                    {/* Top image & remove */}
                    <div className="relative aspect-video rounded-xl overflow-hidden mb-3">
                      <img src={b.coverImage || b.gallery[0]} alt={b.name} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => onRemove(b.id)}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 hover:bg-rose-600 text-white transition-colors"
                        title="Remove from comparison"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Logo & Name */}
                    <div className="flex items-center gap-2.5 mb-2">
                      <img src={b.logo} alt="" className="w-8 h-8 rounded-lg object-cover border" />
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">{b.name}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{b.category}</p>
                      </div>
                    </div>

                    {/* Verification Status */}
                    <div className="py-2 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs">
                      <span className="text-slate-500">Verification</span>
                      {b.verificationStatus === 'verified' ? (
                        <span className="inline-flex items-center gap-1 font-bold text-blue-600 dark:text-blue-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Verified ({b.verificationDetails?.badgeType || 'Gold'})</span>
                        </span>
                      ) : (
                        <span className="text-amber-500 font-medium">Pending Review</span>
                      )}
                    </div>

                    {/* Rating & Reviews */}
                    <div className="py-2 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs">
                      <span className="text-slate-500">Rating & Reviews</span>
                      <div className="flex items-center gap-1 font-bold text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{b.rating.toFixed(1)}</span>
                        <span className="text-slate-400 font-normal">({b.reviewCount})</span>
                      </div>
                    </div>

                    {/* Price Level */}
                    <div className="py-2 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs">
                      <span className="text-slate-500">Price Tier</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{b.priceLevel}</span>
                    </div>

                    {/* City & Address */}
                    <div className="py-2 border-t border-slate-200 dark:border-slate-700/60 text-xs space-y-1">
                      <div className="text-slate-500">Location</div>
                      <div className="font-medium text-slate-800 dark:text-slate-200 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        <span>{b.city}, {b.region}</span>
                      </div>
                      {b.digitalAddress && (
                        <div className="text-[11px] font-mono text-slate-500">GPS: {b.digitalAddress}</div>
                      )}
                    </div>

                    {/* Top Services */}
                    <div className="py-2 border-t border-slate-200 dark:border-slate-700/60 text-xs space-y-1.5">
                      <div className="text-slate-500">Services Offered</div>
                      <div className="space-y-1">
                        {b.services.slice(0, 4).map((s, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                            <span className="w-1 h-1 rounded-full bg-blue-500"></span>
                            <span className="truncate">{s}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-200 dark:border-slate-700/60 space-y-2">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onSelect(b);
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
                    >
                      View Full Profile
                    </button>
                    <a
                      href={`https://wa.me/${b.whatsapp || b.phone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 text-white text-xs font-semibold"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp Direct</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
