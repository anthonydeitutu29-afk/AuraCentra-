import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface FooterProps {
  onOpenEnlist: () => void;
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenEnlist,
  setActiveTab,
}) => {
  return (
    <footer className="mt-16 sm:mt-20 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 sm:pt-12 pb-6 sm:pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="white" fillOpacity="0.25"/>
                  <circle cx="12" cy="9" r="2.5" fill="white"/>
                </svg>
              </div>
              <span className="font-bold text-slate-900 text-lg">AuraCentra</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Ghana's premier verified digital enterprise ecosystem connecting reputable local businesses with national and diaspora customers.
            </p>
            <div className="flex items-center gap-2 pt-1 text-xs text-emerald-700 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Ghana Card & GPS Verified Directory</span>
            </div>
          </div>

          {/* Directory navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Directory</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><button onClick={() => setActiveTab('explore')} className="hover:text-blue-600">Explore Listings</button></li>
              <li><button onClick={() => setActiveTab('sectors')} className="hover:text-blue-600">Browse Sectors</button></li>
              <li><button onClick={() => setActiveTab('news')} className="hover:text-blue-600">Ghana Business News</button></li>
              <li><button onClick={() => setActiveTab('pricing')} className="hover:text-blue-600">Listing Plans</button></li>
              <li><button onClick={() => setActiveTab('verification')} className="hover:text-blue-600">Verification Guide</button></li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Company & Trust</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><button onClick={() => setActiveTab('about')} className="hover:text-blue-600 cursor-pointer">About AuraCentra</button></li>
              <li><button onClick={() => setActiveTab('support')} className="hover:text-blue-600 cursor-pointer">Support Hub</button></li>
              <li><button onClick={() => setActiveTab('terms')} className="hover:text-blue-600 cursor-pointer">Terms & Trust Standard</button></li>
              <li><button onClick={() => setActiveTab('admin')} className="hover:text-blue-600 text-slate-500 font-medium cursor-pointer">Administrator Portal</button></li>
            </ul>
          </div>

          {/* Quick Enlist */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">For Business Owners</h4>
            <p className="text-xs text-slate-500 mb-3 leading-relaxed">
              Get discovered by thousands of customers daily. Enlist your company on AuraCentra today.
            </p>
            <button
              onClick={onOpenEnlist}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              Enlist Your Business Now
            </button>
          </div>

        </div>

        <div className="mt-10 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center gap-3 text-xs text-slate-500 dark:text-slate-400 text-center">
          <p>© 2026 AuraCentra • Tony's Digital Marketing & Business Hub</p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold border border-slate-200/80 dark:border-slate-700 shadow-2xs">
            <span>Ghana</span>
            <span>🇬🇭</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
