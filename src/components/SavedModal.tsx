import React from 'react';
import { X, Bookmark, Phone, MessageSquare, ChevronRight, Trash2 } from 'lucide-react';
import { Business } from '../types';

interface SavedModalProps {
  isOpen: boolean;
  onClose: () => void;
  businesses: Business[];
  savedBusinessIds: string[];
  onToggleSave: (id: string) => void;
  onSelectBusiness: (business: Business) => void;
}

export const SavedModal: React.FC<SavedModalProps> = ({
  isOpen,
  onClose,
  businesses,
  savedBusinessIds,
  onToggleSave,
  onSelectBusiness,
}) => {
  if (!isOpen) return null;

  const savedBusinesses = businesses.filter((b) => savedBusinessIds.includes(b.id));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white dark:bg-slate-800 rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header matching Image 3 */}
        <div className="p-5 flex items-start justify-between border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center shrink-0">
              <Bookmark className="w-5 h-5 fill-rose-500" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                Saved Businesses ({savedBusinesses.length})
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                Your personal bookmarked enterprises for instant access.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content matching Image 3 */}
        <div className="p-5 sm:p-6">
          {savedBusinesses.length === 0 ? (
            <div className="py-12 px-4 text-center">
              <div className="flex justify-center mb-3">
                <Bookmark className="w-12 h-12 text-slate-300 dark:text-slate-600 stroke-[1.2]" />
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                You haven't saved any businesses yet. Click the bookmark icon on any business card to save it here.
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {savedBusinesses.map((biz) => {
                const cleanPhone = biz.phone ? biz.phone.replace(/[^0-9+]/g, '') : '';
                const whatsappNum = biz.whatsapp 
                  ? biz.whatsapp.replace(/[^0-9]/g, '') 
                  : cleanPhone.replace(/[^0-9]/g, '');

                return (
                  <div 
                    key={biz.id}
                    className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 bg-slate-50/50 dark:bg-slate-750 hover:bg-white dark:hover:bg-slate-700 transition-all flex flex-col justify-between gap-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div 
                        className="cursor-pointer flex-1"
                        onClick={() => {
                          onClose();
                          onSelectBusiness(biz);
                        }}
                      >
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                          {biz.name}
                        </h4>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          {biz.category} • {biz.region}
                        </span>
                      </div>

                      <button
                        onClick={() => onToggleSave(biz.id)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                        title="Remove bookmark"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-700">
                      <a
                        href={`tel:${cleanPhone}`}
                        className="flex-1 py-1.5 px-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-[11px] font-bold rounded-lg text-center flex items-center justify-center gap-1"
                      >
                        <Phone className="w-3 h-3" />
                        <span>Call</span>
                      </a>
                      {whatsappNum && (
                        <a
                          href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent(`Hello ${biz.name}, I found your listing on AuraCentra.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-1.5 px-2.5 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold rounded-lg text-center flex items-center justify-center gap-1"
                        >
                          <MessageSquare className="w-3 h-3" />
                          <span>WhatsApp</span>
                        </a>
                      )}
                      <button
                        onClick={() => {
                          onClose();
                          onSelectBusiness(biz);
                        }}
                        className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors cursor-pointer"
                        title="View details"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
