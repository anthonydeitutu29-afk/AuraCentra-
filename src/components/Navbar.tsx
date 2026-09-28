import React from 'react';
import { User, Menu, Moon, Sun } from 'lucide-react';
import { UserAccount } from './AuthModal';
import { AuraCentraLogo } from './AuraCentraLogo';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenEnlist?: () => void;
  onOpenMenu: () => void;
  onOpenAuth: () => void;
  currentUser: UserAccount | null;
  savedCount?: number;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenMenu,
  onOpenAuth,
  currentUser,
  isDarkMode = false,
  onToggleTheme,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/98 dark:bg-slate-900/98 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800 shadow-2xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-18 gap-3 sm:gap-6">
          
          {/* Brand Logo matching exact logo */}
          <div 
            onClick={() => {
              setActiveTab('explore');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="cursor-pointer select-none group shrink-0"
          >
            <AuraCentraLogo size="sm" />
          </div>

          {/* Desktop Center Links: Home, Businesses, Categories, About, Contact */}
          <nav className="hidden lg:flex items-center gap-6 shrink-0">
            <button
              onClick={() => {
                setActiveTab('explore');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`text-sm font-bold transition-all relative py-2 cursor-pointer ${
                activeTab === 'explore'
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              <span>Home</span>
              {activeTab === 'explore' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
              )}
            </button>

            <button
              onClick={() => {
                setActiveTab('explore');
                setTimeout(() => {
                  const el = document.getElementById('discover-businesses');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 50);
              }}
              className="text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
            >
              Businesses
            </button>

            <button
              onClick={() => setActiveTab('sectors')}
              className={`text-sm font-bold transition-all relative py-2 cursor-pointer ${
                activeTab === 'sectors'
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              <span>Categories</span>
              {activeTab === 'sectors' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('news')}
              className={`text-sm font-bold transition-all relative py-2 cursor-pointer ${
                activeTab === 'news'
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              <span>News & FX</span>
              {activeTab === 'news' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('about')}
              className={`text-sm font-bold transition-all relative py-2 cursor-pointer ${
                activeTab === 'about'
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              <span>About</span>
              {activeTab === 'about' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('support')}
              className={`text-sm font-bold transition-all relative py-2 cursor-pointer ${
                activeTab === 'support'
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              <span>Contact</span>
              {activeTab === 'support' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
              )}
            </button>
          </nav>

          {/* Right Action Section: [Theme toggle] [Sign In pill] [Hamburger] */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Quick theme toggle */}
            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Toggle Theme"
                aria-label="Toggle Theme"
              >
                {isDarkMode ? <Sun className="w-4.5 h-4.5 text-amber-500" /> : <Moon className="w-4.5 h-4.5" />}
              </button>
            )}

            {/* Sign In Button Pill */}
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 sm:gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs sm:text-sm px-3.5 sm:px-5 py-2 rounded-xl sm:rounded-full shadow-sm shadow-blue-500/30 transition-all cursor-pointer"
            >
              <User className="w-4 h-4" />
              <span>{currentUser ? currentUser.name.split(' ')[0] : 'Sign In'}</span>
            </button>

            {/* Mobile Menu Hamburger Button */}
            <button
              onClick={onOpenMenu}
              className="p-2 text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer lg:hidden"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-6 h-6 stroke-[2.3]" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
