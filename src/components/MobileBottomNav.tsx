import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, 
  Grid, 
  Bookmark, 
  PlusCircle, 
  MessageSquare,
  User,
  LogOut,
  LayoutDashboard,
  Layers,
  Share2,
  X,
  Sparkles,
  ShieldCheck,
  Check,
  Sun,
  Moon
} from 'lucide-react';
import { UserProfile } from '../types';

interface MobileBottomNavProps {
  currentUser: UserProfile | null;
  savedCount: number;
  inquiriesCount: number;
  comparedCount: number;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
  onScrollToTop: () => void;
  onScrollToCategories: () => void;
  onScrollToDirectory: () => void;
  onOpenRegister: () => void;
  onOpenSaved: () => void;
  onOpenInquiries: () => void;
  onOpenCompare: () => void;
  onOpenAuth: () => void;
  onSignOut: () => void;
  onOpenAdminDashboard?: () => void;
  onOpenBusinessDashboard?: () => void;
  onSharePlatform?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentUser,
  savedCount,
  inquiriesCount,
  comparedCount,
  theme,
  onToggleTheme,
  onScrollToTop,
  onScrollToCategories,
  onScrollToDirectory,
  onOpenRegister,
  onOpenSaved,
  onOpenInquiries,
  onOpenCompare,
  onOpenAuth,
  onSignOut,
  onOpenAdminDashboard,
  onOpenBusinessDashboard,
  onSharePlatform,
}) => {
  const [isAccountSheetOpen, setIsAccountSheetOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          // If close to top or near page boundary, keep visible
          if (currentScrollY <= 20) {
            setIsVisible(true);
          } else {
            const diff = currentScrollY - lastScrollY.current;
            // Scrolling down by more than 6px hides bottom bar
            if (diff > 6 && currentScrollY > 70) {
              setIsVisible(false);
            } 
            // Scrolling up by more than 6px reveals bottom bar
            else if (diff < -6) {
              setIsVisible(true);
            }
          }
          lastScrollY.current = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleShare = () => {
    if (onSharePlatform) {
      onSharePlatform();
    } else if (navigator.share) {
      navigator.share({
        title: 'AuraCentra Ghana',
        text: 'Discover and enlist top verified Ghanaian businesses.',
        url: window.location.origin,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.origin);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <>
      {/* 1. Mobile Bottom Action Dock (Visible only on screens < 640px) */}
      <nav 
        className={`sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200/90 dark:border-slate-800/90 px-2 py-1.5 shadow-[0_-4px_25px_rgba(0,0,0,0.08)] dark:shadow-[0_-4px_25px_rgba(0,0,0,0.5)] select-none safe-area-pb transition-transform duration-300 ease-in-out ${
          isVisible ? 'translate-y-0' : 'translate-y-full pointer-events-none'
        }`}
        id="mobile-bottom-navigation-bar"
        aria-label="Mobile Navigation"
      >
        <div className="grid grid-cols-5 items-center justify-between max-w-md mx-auto">
          {/* Tab 1: Explore */}
          <button
            type="button"
            onClick={onScrollToTop}
            className="flex flex-col items-center justify-center py-1 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-cyan-400 active:scale-95 transition-all cursor-pointer"
            aria-label="Explore Home"
          >
            <Home className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-bold tracking-tight">Explore</span>
          </button>

          {/* Tab 2: Sectors / Categories */}
          <button
            type="button"
            onClick={onScrollToCategories}
            className="flex flex-col items-center justify-center py-1 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-cyan-400 active:scale-95 transition-all cursor-pointer"
            aria-label="Browse Sectors"
          >
            <Grid className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-bold tracking-tight">Sectors</span>
          </button>

          {/* Tab 3: Enlist Center Action Button */}
          <div className="flex flex-col items-center justify-center">
            <button
              type="button"
              onClick={onOpenRegister}
              className="w-11 h-11 -mt-5 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-lg shadow-blue-600/30 border-2 border-white dark:border-slate-900 active:scale-90 transition-all cursor-pointer hover:shadow-cyan-500/40"
              title="Enlist Your Business"
              aria-label="Enlist Business"
            >
              <PlusCircle className="w-6 h-6" />
            </button>
            <span className="text-[10px] font-extrabold text-blue-600 dark:text-cyan-400 mt-0.5 tracking-tight">Enlist</span>
          </div>

          {/* Tab 4: Saved Bookmarks */}
          <button
            type="button"
            onClick={onOpenSaved}
            className="flex flex-col items-center justify-center py-1 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-cyan-400 active:scale-95 transition-all relative cursor-pointer"
            aria-label="Saved Businesses"
          >
            <div className="relative">
              <Bookmark className="w-5 h-5 mb-0.5" />
              {savedCount > 0 && (
                <span className="absolute -top-1 -right-2 px-1.5 py-0.2 rounded-full bg-blue-600 text-white text-[9px] font-black shadow-xs">
                  {savedCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-bold tracking-tight">Saved</span>
          </button>

          {/* Tab 5: Account / Menu */}
          <button
            type="button"
            onClick={() => setIsAccountSheetOpen(true)}
            className="flex flex-col items-center justify-center py-1 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-cyan-400 active:scale-95 transition-all relative cursor-pointer"
            aria-label="Account and Settings Menu"
          >
            <div className="relative">
              {currentUser ? (
                <div className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center justify-center mb-0.5">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
              ) : (
                <User className="w-5 h-5 mb-0.5" />
              )}
              {(inquiriesCount > 0 || comparedCount > 0) && (
                <span className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
              )}
            </div>
            <span className="text-[10px] font-bold tracking-tight">
              {currentUser ? 'Account' : 'Menu'}
            </span>
          </button>
        </div>
      </nav>

      {/* 2. Mobile Quick Account & Tools Sheet Drawer */}
      {isAccountSheetOpen && (
        <div className="sm:hidden fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div 
            className="fixed inset-0"
            onClick={() => setIsAccountSheetOpen(false)}
            aria-hidden="true"
          />

          <div className="relative w-full max-h-[85vh] bg-white dark:bg-slate-900 rounded-t-3xl border-t border-slate-200 dark:border-slate-800 p-5 shadow-2xl space-y-4 overflow-y-auto safe-area-pb z-10 animate-in slide-in-from-bottom duration-300">
            {/* Sheet Handle */}
            <div className="w-12 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 mx-auto" />

            {/* Header: User Profile Card or Sign In Banner */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              {currentUser ? (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 text-white font-bold flex items-center justify-center text-sm shadow-md">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white leading-tight">
                      {currentUser.name}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                      {currentUser.role} Account • {currentUser.email}
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    AuraCentra Account
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Sign in to manage listings, inquiries & verification
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={() => setIsAccountSheetOpen(false)}
                className="p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Actions List */}
            <div className="space-y-1.5 text-xs font-bold">
              {/* Inquiries / Quotes Action */}
              <button
                type="button"
                onClick={() => {
                  setIsAccountSheetOpen(false);
                  onOpenInquiries();
                }}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2.5">
                  <MessageSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Client Quotes & Inquiries</span>
                </span>
                {inquiriesCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white font-extrabold text-[10px]">
                    {inquiriesCount} New
                  </span>
                )}
              </button>

              {/* Compare Businesses Action */}
              {comparedCount > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setIsAccountSheetOpen(false);
                    onOpenCompare();
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2.5">
                    <Layers className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                    <span>Compare Businesses</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white font-extrabold text-[10px]">
                    {comparedCount} Selected
                  </span>
                </button>
              )}

              {/* Business Owner Console (if Owner) */}
              {currentUser && (currentUser.role === 'business_owner' || currentUser.role === 'verified_owner' || (currentUser.ownedBusinessIds && currentUser.ownedBusinessIds.length > 0)) && onOpenBusinessDashboard && (
                <button
                  type="button"
                  onClick={() => {
                    setIsAccountSheetOpen(false);
                    onOpenBusinessDashboard();
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-2xl bg-blue-600 text-white font-bold transition-all shadow-sm shadow-blue-500/20 cursor-pointer"
                >
                  <span className="flex items-center gap-2.5">
                    <LayoutDashboard className="w-4 h-4 text-cyan-200" />
                    <span>My Business Admin Desk</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white uppercase tracking-wider">
                    Owner Desk
                  </span>
                </button>
              )}

              {/* Admin Console (if Admin) */}
              {currentUser?.role === 'admin' && onOpenAdminDashboard && (
                <button
                  type="button"
                  onClick={() => {
                    setIsAccountSheetOpen(false);
                    onOpenAdminDashboard();
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-2xl bg-blue-950 text-white font-bold transition-all shadow-sm ring-1 ring-blue-500/40 cursor-pointer"
                >
                  <span className="flex items-center gap-2.5">
                    <LayoutDashboard className="w-4 h-4 text-cyan-400" />
                    <span>Open Admin Console</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-600 text-white uppercase tracking-wider">
                    Executive
                  </span>
                </button>
              )}

              {/* Share Platform Link */}
              <button
                type="button"
                onClick={handleShare}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2.5">
                  <Share2 className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                  <span>Share AuraCentra Platform</span>
                </span>
                {copiedLink && (
                  <span className="text-emerald-600 font-bold flex items-center gap-1 text-[11px]">
                    <Check className="w-3 h-3" /> Copied
                  </span>
                )}
              </button>
            </div>

            {/* Bottom Auth Buttons: Sign In / Log Out */}
            <div className="pt-2">
              {currentUser ? (
                <button
                  type="button"
                  id="mobile-sheet-logout-btn"
                  onClick={() => {
                    setIsAccountSheetOpen(false);
                    onSignOut();
                  }}
                  className="w-full flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200/80 dark:border-rose-900/60 font-bold text-xs hover:bg-rose-100 transition-colors cursor-pointer shadow-xs"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out of AuraCentra</span>
                </button>
              ) : (
                <button
                  type="button"
                  id="mobile-sheet-signin-btn"
                  onClick={() => {
                    setIsAccountSheetOpen(false);
                    onOpenAuth();
                  }}
                  className="w-full flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/25 transition-all cursor-pointer"
                >
                  <User className="w-4 h-4" />
                  <span>Sign In / Create Account</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
