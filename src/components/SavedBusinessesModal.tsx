import React from 'react';
import { X, Bookmark, Trash2, Eye, MapPin, CheckCircle2, MessageSquare } from 'lucide-react';
import { Business } from '../types';

interface SavedBusinessesModalProps {
  savedBusinesses: Business[];
  isOpen: boolean;
  onClose: () => void;
  onRemoveSaved: (businessId: string) => void;
  onSelectBusiness: (business: Business) => void;
}

export const SavedBusinessesModal: React.FC<SavedBusinessesModalProps> = ({
  savedBusinesses,
  isOpen,
  onClose,
  onRemoveSaved,
  onSelectBusiness,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh] my-auto">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-950/50 text-rose-600">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Saved Businesses ({savedBusinesses.length})
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Your personal bookmarked services for quick re-access.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-3">
          {savedBusinesses.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs space-y-2">
              <Bookmark className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600" />
              <p>You haven't saved any businesses yet. Click the bookmark icon on any business card to save it here.</p>
            </div>
          ) : (
            savedBusinesses.map((b) => (
              <div
                key={b.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-blue-400 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={b.logo}
                    alt={b.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                  />
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate flex items-center gap-1.5">
                      <span>{b.name}</span>
                      {b.verificationStatus === 'verified' && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 fill-blue-50" />
                      )}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {b.category} • {b.city}, {b.region}
                    </p>
                    <div className="text-xs text-amber-500 font-bold mt-0.5">
                      ★ {b.rating.toFixed(1)} ({b.reviewCount} reviews)
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onSelectBusiness(b);
                    }}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View</span>
                  </button>

                  <a
                    href={`https://wa.me/${b.whatsapp || b.phone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
                    title="WhatsApp"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </a>

                  <button
                    type="button"
                    onClick={() => onRemoveSaved(b.id)}
                    className="p-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-rose-100 hover:text-rose-600 transition-colors"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
