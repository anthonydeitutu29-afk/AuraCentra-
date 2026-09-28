import React from 'react';
import { 
  X, 
  MessageSquare, 
  Moon, 
  Sun, 
  Share2, 
  Building2, 
  ShieldCheck, 
  Shield, 
  User, 
  LogOut, 
  Sparkles, 
  ChevronRight, 
  ExternalLink, 
  Bookmark,
  Newspaper
} from 'lucide-react';
import { UserAccount } from './AuthModal';

interface AccountDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuth: () => void;
  onNavigateTab: (tab: string) => void;
  currentUser?: UserAccount | null;
  onLogout?: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const AccountDrawer: React.FC<AccountDrawerProps> = ({
  isOpen,
  onClose,
  onOpenAuth,
  onNavigateTab,
  currentUser,
  onLogout,
  isDarkMode,
  onToggleTheme,
}) => {
  if (!isOpen) return null;

  const [copied, setCopied] = React.useState(false);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'AuraCentra Ghana Directory',
        text: 'Explore verified businesses across all 16 regions of Ghana:',
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Slide-over sheet */}
      <div className="fixed inset-x-0 bottom-0 max-h-[92vh] bg-white dark:bg-slate-900 rounded-t-3xl shadow-2xl overflow-y-auto flex flex-col z-10 animate-in slide-in-from-bottom duration-200 safe-area-pb transition-colors">
        
        {/* Drag pill handle */}
        <div className="pt-3 pb-1 flex justify-center">
          <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-5 pt-2.5 pb-3 flex items-start justify-between border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white leading-snug">
              AuraCentra Account
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {currentUser ? `Signed in as ${currentUser.name}` : 'Sign in to manage listings, inquiries & verification'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options List matching Image 2 */}
        <div className="p-4 space-y-2 pb-5">
          
          {/* User Profile Card if logged in */}
          {currentUser && (
            <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-slate-800 border border-blue-100 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-black flex items-center justify-center text-sm shadow-xs">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white text-sm">{currentUser.name}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{currentUser.email}</div>
                  <span className="inline-block mt-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                    {currentUser.accountType === 'business_owner' ? 'Business Owner' : 'Verified Member'}
                  </span>
                </div>
              </div>

              {onLogout && (
                <button
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                  className="p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors cursor-pointer"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {/* 1. Client Quotes & Inquiries */}
          <button
            onClick={() => {
              onClose();
              onNavigateTab('support');
            }}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Client Quotes & Inquiries
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          {/* 2. Listings */}
          <button
            onClick={() => {
              onClose();
              onNavigateTab('explore');
            }}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Browse Commercial Listings
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          {/* 3. Saved Shortlist */}
          <button
            onClick={() => {
              onClose();
              onNavigateTab('saved');
            }}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Bookmark className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Saved Businesses Shortlist
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          {/* 4. Business News & Live Forex */}
          <button
            onClick={() => {
              onClose();
              onNavigateTab('news');
            }}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Newspaper className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Business News & Live Forex
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white">Live FX</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          </button>

          {/* 3. Ghana Card Verification */}
          <button
            onClick={() => {
              onClose();
              onNavigateTab('verification');
            }}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Ghana Card Verification Portal
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          {/* 4. Pricing & Plans */}
          <button
            onClick={() => {
              onClose();
              onNavigateTab('pricing');
            }}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Pricing & Tier Plans
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          {/* 5. Trust & Verification Policy */}
          <button
            onClick={() => {
              onClose();
              onNavigateTab('terms');
            }}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Trust & Verification Policy
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          {/* 6. Business Owner Dashboard */}
          <button
            onClick={() => {
              onClose();
              onNavigateTab('owner_dashboard');
            }}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-blue-50/70 dark:bg-slate-800 border border-blue-200/60 dark:border-slate-700 hover:bg-blue-100/70 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-bold text-blue-900 dark:text-blue-200">
                Business Owner Dashboard
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-blue-500" />
          </button>

          {/* 7. Administrator Console */}
          <button
            onClick={() => {
              onClose();
              onNavigateTab('admin');
            }}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-900 text-white border border-slate-700 hover:bg-slate-800 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-bold text-white">
                Administrator Portal
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          {/* 6. Appearance Theme Toggle matching Image 2 */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isDarkMode ? (
                <Moon className="w-5 h-5 text-blue-400" />
              ) : (
                <Sun className="w-5 h-5 text-amber-500" />
              )}
              <div>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200 block">
                  Appearance Theme
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {isDarkMode ? 'Night / Dark Mode active' : 'Day / Light Mode active'}
                </span>
              </div>
            </div>

            <button
              onClick={onToggleTheme}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              {isDarkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              <span>{isDarkMode ? 'Switch to Light' : 'Switch to Dark'}</span>
            </button>
          </div>

          {/* 7. Share Platform */}
          <button
            onClick={handleShare}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Share2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {copied ? 'Link Copied to Clipboard!' : 'Share AuraCentra'}
              </span>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400" />
          </button>

          {/* Action Button at bottom */}
          <div className="pt-2">
            {!currentUser ? (
              <button
                onClick={() => {
                  onClose();
                  onOpenAuth();
                }}
                className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <User className="w-4 h-4" />
                <span>Sign in to Account</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  if (onLogout) onLogout();
                  onClose();
                }}
                className="w-full py-3.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 hover:text-rose-600 text-slate-700 dark:text-slate-200 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
