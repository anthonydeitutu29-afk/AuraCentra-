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
  MessageSquare,
  Share2,
  Check,
  Sun,
  Moon,
  Newspaper,
  DollarSign,
  Info,
  Settings
} from 'lucide-react';
import { UserProfile } from '../types';
import { Logo } from './Logo';

interface NavbarProps {
  currentSection: 'home' | 'news' | 'sectors';
  onNavigateSection: (section: 'home' | 'news' | 'sectors') => void;
  onOpenSectors?: () => void;
  onOpenAboutUs: () => void;
  onOpenPricing: () => void;
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
  onOpenBusinessDashboard?: () => void;
  onOpenPersonalDashboard?: () => void;
  onOpenAccountSettings?: () => void;
  onSignOut: () => void;
  onSharePlatform?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentSection,
  onNavigateSection,
  onOpenSectors,
  onOpenAboutUs,
  onOpenPricing,
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
  onOpenBusinessDashboard,
  onOpenPersonalDashboard,
  onOpenAccountSettings,
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
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-6">
        
        {/* Brand Logo & Desktop Navigation */}
        <div className="flex items-center gap-4 lg:gap-10 shrink-0">
          <div 
            className="cursor-pointer shrink-0 flex items-center select-none" 
            onClick={() => {
              onNavigateSection('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setMobileMenuOpen(false);
            }}
          >
            <Logo size="md" showTagline={false} className="shrink-0" />
          </div>

          {/* Desktop Navigation Links matching Image 1 */}
          <nav className="hidden lg:flex items-center gap-7 text-xs sm:text-sm font-bold">
            
            {/* Explore (Home) */}
            <button 
              type="button" 
              onClick={() => {
                onNavigateSection('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`transition-colors cursor-pointer py-1 ${
                currentSection === 'home'
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              Explore
            </button>

            {/* Sectors / Business Categories Section */}
            <button
              type="button"
              id="desktop-nav-sectors-btn"
              onClick={() => {
                onNavigateSection('sectors');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`transition-colors cursor-pointer py-1 flex items-center gap-1.5 font-bold ${
                currentSection === 'sectors'
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 font-extrabold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              <span>Sectors</span>
              <span className="px-1.5 py-0.2 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-[10px] font-black">
                All Categories
              </span>
            </button>

            {/* Business News (Dedicated Section) */}
            <button 
              type="button" 
              onClick={() => {
                onNavigateSection('news');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`transition-colors cursor-pointer py-1 flex items-center gap-1.5 ${
                currentSection === 'news'
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 font-extrabold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              <span>Business News</span>
              <span className="px-1.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-bold">
                Live FX
              </span>
            </button>

            {/* Pricing / Resources */}
            <button 
              type="button" 
              onClick={onOpenPricing}
              className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer py-1"
            >
              Pricing
            </button>

            {/* About Us */}
            <button 
              type="button" 
              onClick={onOpenAboutUs}
              className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer py-1"
            >
              About Us
            </button>

          </nav>
        </div>

        {/* Action Controls: List Your Business & Sign In */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0 ml-auto">
          
          {/* Compare Shortcut Pill */}
          {comparedCount > 0 && (
            <button
              type="button"
              id="nav-compare-btn"
              onClick={onOpenCompareModal}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-cyan-300 text-xs font-bold border border-blue-200 dark:border-blue-800 hover:bg-blue-100 transition-colors cursor-pointer shrink-0"
              title="Compare selected businesses"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Compare</span>
              <span className="px-1.5 py-0.2 rounded-full bg-blue-600 text-white text-[10px] font-bold">
                {comparedCount}
              </span>
            </button>
          )}

          {/* Saved Shortcut Pill */}
          {savedCount > 0 && (
            <button
              type="button"
              id="nav-saved-btn"
              onClick={onOpenSavedModal}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-colors cursor-pointer shrink-0"
              title="Saved businesses"
            >
              <Bookmark className="w-3.5 h-3.5 text-blue-600" />
              <span>Saved</span>
              <span className="px-1.5 py-0.2 rounded-full bg-blue-600 text-white text-[10px] font-bold">
                {savedCount}
              </span>
            </button>
          )}


          {/* Button: List Your Business */}
          <button
            type="button"
            id="nav-list-business-btn"
            onClick={onOpenRegister}
            className="hidden sm:inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 transition-all cursor-pointer shadow-2xs"
          >
            <Plus className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>List Your Business</span>
          </button>

          {/* Button: Sign In / User Profile */}
          {currentUser ? (
            <div className="flex items-center gap-1 sm:gap-1.5 pl-1 sm:pl-1.5 border-l border-slate-200 dark:border-slate-800 shrink-0">
              {currentUser.role === 'admin' ? (
                <button
                  type="button"
                  id="nav-admin-dashboard-btn"
                  onClick={onOpenAdminDashboard}
                  className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-[11px] sm:text-xs font-bold shadow-xs transition-all cursor-pointer shrink-0"
                  title="Open Admin Dashboard"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="hidden xs:inline">Admin</span>
                </button>
              ) : (currentUser.role === 'business_owner' || currentUser.role === 'verified_owner' || (currentUser.ownedBusinessIds && currentUser.ownedBusinessIds.length > 0)) ? (
                <button
                  type="button"
                  id="nav-owner-dashboard-btn"
                  onClick={onOpenBusinessDashboard}
                  className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white text-[11px] sm:text-xs font-bold shadow-md shadow-amber-600/20 transition-all cursor-pointer shrink-0"
                  title="Open Business Owner Dashboard"
                >
                  <Building2 className="w-3.5 h-3.5 text-amber-100 shrink-0" />
                  {/* Shortened on mobile to ensure logo is never covered */}
                  <span className="hidden sm:inline">My Business</span>
                  <span className="inline sm:hidden font-semibold">Business</span>
                </button>
              ) : (
                <button 
                  type="button"
                  id="nav-personal-dashboard-btn"
                  onClick={onOpenPersonalDashboard}
                  className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-slate-800 text-xs font-bold text-blue-900 dark:text-blue-100 border border-blue-200/70 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 transition-all cursor-pointer shrink-0"
                  title={`Signed in as ${currentUser.name} - Open Personal Dashboard`}
                >
                  <div className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center justify-center shrink-0 shadow-xs">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  {/* Text hidden on small screens to guarantee full logo clearance */}
                  <span className="hidden sm:inline max-w-[90px] truncate text-xs font-semibold">
                    {currentUser.name.split(' ')[0]}
                  </span>
                </button>
              )}

              {/* Desktop-only individual settings and logout (mobile users access via hamburger drawer) */}
              <button
                type="button"
                id="nav-account-settings-btn"
                onClick={onOpenAccountSettings}
                className="hidden md:inline-flex p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Account & Security Settings / Delete Account"
              >
                <Settings className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onSignOut}
                className="hidden md:inline-flex p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              id="nav-signin-btn"
              onClick={onOpenAuth}
              className="inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-sm shadow-blue-600/20 transition-all cursor-pointer shrink-0"
            >
              <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Sign In</span>
            </button>
          )}

          {/* Mobile Menu Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-4 shadow-xl animate-in slide-in-from-top-2 duration-150">
          <nav className="flex flex-col space-y-2 text-sm font-bold">
            <button 
              type="button" 
              onClick={() => {
                onNavigateSection('home');
                setMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-xl text-left transition-colors ${
                currentSection === 'home'
                  ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50'
              }`}
            >
              Explore (Home)
            </button>

            <button
              type="button"
              onClick={() => {
                onNavigateSection('sectors');
                setMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-xl text-left flex items-center justify-between font-bold transition-colors ${
                currentSection === 'sectors'
                  ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>Sectors & Business Categories</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-[10px]">
                All Categories
              </span>
            </button>

            <button 
              type="button" 
              onClick={() => {
                onNavigateSection('news');
                setMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-xl text-left flex items-center justify-between transition-colors ${
                currentSection === 'news'
                  ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>Business News & Live Forex</span>
              <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px]">Live FX</span>
            </button>

            <button 
              type="button" 
              onClick={() => {
                onOpenPricing();
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl text-left text-slate-700 dark:text-slate-200 hover:bg-slate-50"
            >
              Pricing & Enlistment
            </button>

            <button 
              type="button" 
              onClick={() => {
                onOpenAboutUs();
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl text-left text-slate-700 dark:text-slate-200 hover:bg-slate-50"
            >
              About AuraCentra
            </button>

            {/* Mobile Drawer Theme Switcher */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/70">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200">
                {theme === 'dark' ? <Moon className="w-4 h-4 text-cyan-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
                <span>Appearance Theme</span>
              </div>
              <button
                type="button"
                onClick={onToggleTheme}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-300" /> : <Moon className="w-3.5 h-3.5" />}
                <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
            </div>
          </nav>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
            {currentUser && (currentUser.role === 'business_owner' || currentUser.role === 'verified_owner' || (currentUser.ownedBusinessIds && currentUser.ownedBusinessIds.length > 0)) && (
              <button
                type="button"
                onClick={() => {
                  onOpenBusinessDashboard?.();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Building2 className="w-4 h-4 text-cyan-200" />
                <span>My Business Dashboard</span>
              </button>
            )}

            {currentUser && currentUser.role === 'customer' && (
              <button
                type="button"
                onClick={() => {
                  onOpenPersonalDashboard?.();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs"
              >
                <User className="w-4 h-4 text-cyan-200" />
                <span>My Personal Dashboard</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                onOpenRegister();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 px-4 rounded-xl border border-blue-600 text-blue-600 dark:text-blue-400 font-bold text-xs flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>List Your Business</span>
            </button>

            {currentUser && (
              <button
                type="button"
                onClick={() => {
                  onOpenAccountSettings?.();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <Settings className="w-4 h-4 text-blue-600" />
                <span>Account & Security Settings</span>
              </button>
            )}

            {currentUser && (
              <button
                type="button"
                onClick={() => {
                  onSignOut();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-4 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            )}

            {!currentUser && (
              <button
                type="button"
                onClick={() => {
                  onOpenAuth();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs"
              >
                <User className="w-4 h-4" />
                <span>Sign In to Account</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
