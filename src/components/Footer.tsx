import React from 'react';

interface FooterProps {
  onSelectCategory?: (categoryId: string) => void;
  onOpenRegister?: () => void;
  onOpenNews?: () => void;
  onOpenAboutUs?: () => void;
  onOpenTerms?: () => void;
  onOpenPricing?: () => void;
  onOpenSectors?: () => void;
  onShowToast?: (title: string, message?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenAboutUs,
  onOpenTerms,
}) => {
  return (
    <footer 
      className="relative w-full bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 py-3 sm:py-3.5 mt-8 sm:mt-10 z-10 transition-colors duration-200"
      id="auracentra-footer"
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Bottom Legal & Recognition Strip */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-4 text-[11px] text-slate-600 dark:text-slate-400 font-medium">
          <div className="flex flex-wrap items-center gap-2 text-center sm:text-left">
            <span>© 2026 AuraCentra • Tony&apos;s Digital Marketing Hub</span>
          </div>

          <div className="flex items-center gap-3.5 text-xs">
            <button
              type="button"
              onClick={onOpenTerms || onOpenAboutUs}
              className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer text-[11px] font-medium"
            >
              Privacy & Terms
            </button>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[10px]">
              <span>Ghana</span>
              <span>🇬🇭</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

