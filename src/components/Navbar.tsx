import React, { useState } from 'react';
import { 
  Plus, 
  Layers, 
  Bookmark, 
  User, 
  ShieldCheck, 
  LogOut, 
  Building2, 
  LayoutDashboard,
  Search,
  Menu,
  X,
  Sparkles,
  MessageSquare,
  Share2,
  Check,
  Sun,
  Moon
} from 'lucide-react';
import { UserProfile } from '../types';
import { Logo } from './Logo';

interface NavbarProps {
  currentUser: UserProfile | null;
  savedCount: number;
  comparedCount: number;
  inquiriesCount?: number;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenAuth: () => void;
  onOpenRegister: () => void;
  onOpenSavedModal: () => void;
  onOpenCompareModal: () => void;
  onOpenInquiriesModal?: () => void;
  onOpenAdminDashboard: () => void;
  onSignOut: () => void;
  onSharePlatform?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  savedCount,
  comparedCount,
  inquiriesCount = 0,
  theme,
  onToggleTheme,
  onOpenAuth,
  onOpenRegister,
  onOpenSavedModal,
  onOpenCompareModal,
  onOpenInquiriesModal,
  onOpenAdminDashboard,
  onSignOut,
  onSharePlatform,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sharedPlatform, setSharedPlatform] = useState(false);

  const handleShareApp = () => {
    if (onSharePlatform) {
      onSharePlatform();
    } else if (navigator.share) {
      navigator.share({
        title: 'AuraCentra Ghana - Connect • Discover • Grow',
        text: 'A digital platform where businesses enlist and customers get access to what they need, without stress.',
        url: window.location.origin,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.origin);
      setSharedPlatform(true);
      setTimeout(() => setSharedPlatform(false), 2000);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-blue-100/80 dark:border-blue-950 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo & Desktop Navigation */}
        <div className="flex items-center gap-3 lg:gap-8 min-w-0">
          <div 
            className="cursor-pointer shrink-0" 
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setMobileMenuOpen(false);
            }}
          >
            <div className="hidden sm:block">
              <Logo size="md" />
            </div>
            <div className="block sm:hidden">
              <Logo size="sm" />
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-slate-700 dark:text-slate-200">
            <button 
              type="button" 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-blue-600 dark:text-cyan-400 border-b-2 border-blue-600 dark:border-cyan-400 pb-1 cursor-pointer"
            >
              Discover
            </button>
            <button 
              type="button" 
              onClick={() => {
                const el = document.getElementById('browse-categories-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors cursor-pointer"
            >
              Categories
            </button>
            <button 
              type="button" 
              onClick={() => {
                const el = document.getElementById('main-directory-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors cursor-pointer"
            >
              Directory
            </button>
            <button 
              type="button" 
              onClick={onOpenRegister}
              className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verify Business</span>
            </button>
          </nav>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2.5">
          {/* Share AuraCentra Button (Hidden on small mobile portrait to give room for Enlist + Account) */}
          <button
            type="button"
            onClick={handleShareApp}
            className={`hidden md:inline-flex p-2 sm:px-3 sm:py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
              sharedPlatform
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                : 'text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 border-transparent hover:border-blue-100 dark:hover:border-slate-700'
            }`}
            title="Share AuraCentra Platform"
            aria-label="Share platform"
          >
            <div className="flex items-center gap-1.5">
              {sharedPlatform ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4 text-blue-600 dark:text-cyan-400" />}
              <span className="hidden xl:inline">{sharedPlatform ? 'Copied Link' : 'Share'}</span>
            </div>
          </button>

          {/* Compare Pill / Button */}
          {comparedCount > 0 && (
            <button
              type="button"
              id="nav-compare-btn"
              onClick={onOpenCompareModal}
              className="inline-flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-cyan-300 text-xs font-bold border border-blue-200 dark:border-blue-800 hover:bg-blue-100 transition-colors cursor-pointer shrink-0"
              title="Compare selected businesses"
            >
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">Compare</span>
              <span className="px-1.5 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold">
                {comparedCount}
              </span>
            </button>
          )}

          {/* Inquiries Leads Button */}
          {onOpenInquiriesModal && inquiriesCount > 0 && (
            <button
              type="button"
              id="nav-inquiries-btn"
              onClick={onOpenInquiriesModal}
              className="hidden sm:inline-flex p-2 sm:px-3 sm:py-1.5 rounded-full text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 text-xs font-bold transition-colors relative border border-transparent hover:border-blue-100 dark:hover:border-slate-700 cursor-pointer shrink-0"
              title="Client Inquiries & Quote Leads"
            >
              <div className="flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="hidden sm:inline">Inquiries</span>
                <span className="px-1.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold">
                  {inquiriesCount}
                </span>
              </div>
            </button>
          )}

          {/* Saved / Bookmarks Button */}
          {savedCount > 0 && (
            <button
              type="button"
              id="nav-saved-btn"
              onClick={onOpenSavedModal}
              className="hidden sm:inline-flex p-2 sm:px-3 sm:py-1.5 rounded-full text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 text-xs font-bold transition-colors relative border border-transparent hover:border-blue-100 dark:hover:border-slate-700 cursor-pointer shrink-0"
              title="Saved businesses"
            >
              <div className="flex items-center gap-1.5">
                <Bookmark className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                <span className="hidden sm:inline">Saved</span>
                <span className="px-1.5 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold">
                  {savedCount}
                </span>
              </div>
            </button>
          )}

          {/* Theme Toggle Button */}
          <button
            type="button"
            id="nav-theme-toggle-btn"
            onClick={onToggleTheme}
            className="p-1.5 sm:p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label="Toggle visual theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-600" />}
          </button>

          {/* User Auth / Account Profile / Admin Access / Logout Pill - Visible on Mobile Portrait */}
          {currentUser ? (
            <div className="flex items-center gap-1 sm:gap-1.5 pl-1 sm:pl-2 border-l border-blue-100 dark:border-slate-800 shrink-0">
              {currentUser.role === 'admin' ? (
                <button
                  type="button"
                  id="nav-admin-dashboard-btn"
                  onClick={onOpenAdminDashboard}
                  className="inline-flex items-center gap-1 px-2 py-1.5 sm:px-3 sm:py-2 rounded-full bg-blue-950 hover:bg-blue-900 text-white text-[11px] sm:text-xs font-bold shadow-sm ring-1 ring-blue-400/40 transition-all cursor-pointer shrink-0"
                  title="Open Admin Dashboard"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="hidden xs:inline sm:inline">Admin</span>
                </button>
              ) : (
                <div 
                  className="flex items-center gap-1 sm:gap-1.5 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-full bg-blue-50 dark:bg-slate-800 text-xs font-bold text-blue-900 dark:text-blue-100 border border-blue-200/70 dark:border-slate-700 shrink-0"
                  title={`Signed in as ${currentUser.name}`}
                >
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 text-white text-[9px] sm:text-[10px] font-black flex items-center justify-center shrink-0 shadow-xs">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[50px] xs:max-w-[70px] sm:max-w-[100px] truncate text-[11px] sm:text-xs font-semibold">
                    {currentUser.name.split(' ')[0]}
                  </span>
                </div>
              )}

              {/* Dedicated Logout Button */}
              <button
                type="button"
                id="nav-logout-btn"
                onClick={onSignOut}
                className="inline-flex items-center p-1.5 sm:px-2 sm:py-1.5 rounded-full text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors text-xs font-bold cursor-pointer shrink-0"
                title="Log out from account"
                aria-label="Log out"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-500" />
                <span className="hidden md:inline text-rose-600 dark:text-rose-400">Logout</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              id="nav-signin-btn"
              onClick={onOpenAuth}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-slate-900 dark:bg-blue-950 hover:bg-slate-800 text-white text-[11px] sm:text-xs font-bold shadow-sm border border-slate-700/60 dark:border-blue-800 transition-all cursor-pointer shrink-0"
              title="Sign in to your account"
              aria-label="Sign in"
            >
              <User className="w-3.5 h-3.5 text-cyan-300 shrink-0" />
              <span>Sign In</span>
            </button>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 sm:p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
            aria-label="Open navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-blue-600" /> : <Menu className="w-5 h-5 text-slate-700 dark:text-slate-200" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Down Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-blue-100 dark:border-slate-800 px-4 py-4 space-y-3 animate-in fade-in slide-in-from-top-2 shadow-xl">
          {/* User Account Info on Mobile */}
          {currentUser && (
            <div className="p-3 rounded-2xl bg-blue-50 dark:bg-slate-800/80 border border-blue-100 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{currentUser.name}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 capitalize">{currentUser.role} Account</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  onSignOut();
                  setMobileMenuOpen(false);
                }}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 text-xs font-bold border border-rose-200/80 dark:border-rose-900/60 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          )}

          <div className="flex flex-col gap-2 font-bold text-sm text-slate-800 dark:text-slate-100">
            <button 
              type="button" 
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-between p-2.5 rounded-xl bg-blue-50 dark:bg-slate-800 text-blue-700 dark:text-cyan-400 text-left"
            >
              <span>Discover Hub</span>
              <Sparkles className="w-4 h-4 text-blue-600" />
            </button>

            <button 
              type="button" 
              onClick={() => {
                const el = document.getElementById('browse-categories-section');
                el?.scrollIntoView({ behavior: 'smooth' });
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-left"
            >
              <span className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                <span>Browse Categories</span>
              </span>
            </button>

            <button 
              type="button" 
              onClick={() => {
                const el = document.getElementById('main-directory-section');
                el?.scrollIntoView({ behavior: 'smooth' });
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-left"
            >
              <span className="flex items-center gap-2">
                <Search className="w-4 h-4 text-blue-600" />
                <span>Business Directory</span>
              </span>
            </button>

            {onOpenInquiriesModal && (
              <button 
                type="button" 
                onClick={() => {
                  onOpenInquiriesModal();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-left text-emerald-600 dark:text-emerald-400"
              >
                <span className="flex items-center gap-2 font-bold">
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  <span>Client Inquiries & Quotes</span>
                </span>
                {inquiriesCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-xs font-bold">
                    {inquiriesCount}
                  </span>
                )}
              </button>
            )}

            {/* Mobile Share AuraCentra Button */}
            <button 
              type="button" 
              onClick={() => {
                handleShareApp();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-left text-blue-600 dark:text-cyan-400"
            >
              <span className="flex items-center gap-2 font-bold">
                <Share2 className="w-4 h-4 text-blue-600" />
                <span>Share AuraCentra Platform</span>
              </span>
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => {
                onOpenRegister();
                setMobileMenuOpen(false);
              }}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-600/20 text-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Enlist Your Business</span>
            </button>

            {currentUser?.role === 'admin' && (
              <button
                type="button"
                onClick={() => {
                  onOpenAdminDashboard();
                  setMobileMenuOpen(false);
                }}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-sm cursor-pointer"
              >
                <LayoutDashboard className="w-4 h-4 text-cyan-400" />
                <span>Open Admin Console</span>
              </button>
            )}

            {!currentUser && (
              <button
                type="button"
                onClick={() => {
                  onOpenAuth();
                  setMobileMenuOpen(false);
                }}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold text-sm cursor-pointer"
              >
                <User className="w-4 h-4 text-blue-600" />
                <span>Sign In to Account</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
