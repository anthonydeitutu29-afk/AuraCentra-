import React, { useState } from 'react';
import { 
  Plus, 
  Layers, 
  Bookmark, 
  User, 
  Sun, 
  Moon, 
  ShieldCheck, 
  LogOut, 
  Building2, 
  LayoutDashboard,
  Search,
  Menu,
  X,
  MapPin,
  Sparkles,
  Phone,
  MessageSquare
} from 'lucide-react';
import { UserProfile, Business } from '../types';
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
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-blue-100/80 dark:border-blue-950 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo & Desktop Navigation */}
        <div className="flex items-center gap-6 lg:gap-8">
          <div 
            className="cursor-pointer shrink-0" 
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setMobileMenuOpen(false);
            }}
          >
            <Logo size="md" />
          </div>

          <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-slate-700 dark:text-slate-200">
            <button 
              type="button" 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-blue-600 dark:text-cyan-400 border-b-2 border-blue-600 dark:border-cyan-400 pb-1"
            >
              Discover
            </button>
            <button 
              type="button" 
              onClick={() => {
                const el = document.getElementById('browse-categories-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors"
            >
              Categories
            </button>
            <button 
              type="button" 
              onClick={() => {
                const el = document.getElementById('main-directory-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors"
            >
              Directory
            </button>
            <button 
              type="button" 
              onClick={onOpenRegister}
              className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verify Business</span>
            </button>
          </nav>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Compare Pill / Button */}
          {comparedCount > 0 && (
            <button
              type="button"
              id="nav-compare-btn"
              onClick={onOpenCompareModal}
              className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-cyan-300 text-xs font-bold border border-blue-200 dark:border-blue-800 hover:bg-blue-100 transition-colors"
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
          {onOpenInquiriesModal && (
            <button
              type="button"
              id="nav-inquiries-btn"
              onClick={onOpenInquiriesModal}
              className="p-2 sm:px-3 sm:py-1.5 rounded-full text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 text-xs font-bold transition-colors relative border border-transparent hover:border-blue-100 dark:hover:border-slate-700"
              title="Client Inquiries & Quote Leads"
            >
              <div className="flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="hidden sm:inline">Inquiries</span>
                {inquiriesCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold">
                    {inquiriesCount}
                  </span>
                )}
              </div>
            </button>
          )}

          {/* Saved / Bookmarks Button */}
          <button
            type="button"
            id="nav-saved-btn"
            onClick={onOpenSavedModal}
            className="p-2 sm:px-3 sm:py-1.5 rounded-full text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 text-xs font-bold transition-colors relative border border-transparent hover:border-blue-100 dark:hover:border-slate-700"
            title="Saved businesses"
          >
            <div className="flex items-center gap-1.5">
              <Bookmark className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
              <span className="hidden sm:inline">Saved</span>
              {savedCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold">
                  {savedCount}
                </span>
              )}
            </div>
          </button>

          {/* Theme Toggle Button */}
          <button
            type="button"
            id="nav-theme-toggle-btn"
            onClick={onToggleTheme}
            className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label="Toggle visual theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-600" />}
          </button>

          {/* Enlist Business Button */}
          <button
            type="button"
            id="nav-enlist-business-btn"
            onClick={onOpenRegister}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Enlist Business</span>
          </button>

          {/* User Auth / Admin Access Pill */}
          {currentUser ? (
            <div className="flex items-center gap-1.5 sm:gap-2 pl-1 sm:pl-2 border-l border-blue-100 dark:border-slate-800">
              {currentUser.role === 'admin' ? (
                <button
                  type="button"
                  id="nav-admin-dashboard-btn"
                  onClick={onOpenAdminDashboard}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold shadow-sm ring-1 ring-blue-400/40 transition-all"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="hidden sm:inline">Admin</span>
                </button>
              ) : (
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-blue-50 dark:bg-slate-800 text-xs font-bold text-blue-900 dark:text-blue-100">
                  <User className="w-3.5 h-3.5 text-blue-600" />
                  <span className="hidden sm:inline max-w-[90px] truncate">{currentUser.name}</span>
                </div>
              )}

              <button
                type="button"
                onClick={onSignOut}
                className="p-1.5 sm:p-2 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              id="nav-signin-btn"
              onClick={onOpenAuth}
              className="inline-flex items-center gap-1 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold shadow-sm transition-all"
            >
              <User className="w-3.5 h-3.5 text-blue-200" />
              <span>Sign In</span>
            </button>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors"
            aria-label="Open navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-blue-600" /> : <Menu className="w-5 h-5 text-slate-700 dark:text-slate-200" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Down Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-blue-100 dark:border-slate-800 px-4 py-4 space-y-3 animate-in fade-in slide-in-from-top-2 shadow-xl">
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
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => {
                onOpenRegister();
                setMobileMenuOpen(false);
              }}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-600/20 text-sm"
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
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-sm"
              >
                <LayoutDashboard className="w-4 h-4 text-cyan-400" />
                <span>Open Admin Console</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
