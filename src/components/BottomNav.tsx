import React, { useState, useEffect } from 'react';
import { 
  Home, 
  LayoutGrid, 
  Plus, 
  Bookmark, 
  User 
} from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenEnlist: () => void;
  onOpenAccountMenu: () => void;
  onOpenSavedModal?: () => void;
  savedCount?: number;
  isVisible?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenEnlist,
  onOpenAccountMenu,
  savedCount = 0,
  isVisible: externalIsVisible,
}) => {
  const [internalVisible, setInternalVisible] = useState(true);

  // Intelligent auto-hiding scroll detector optimized for mobile touch scrolling
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const diff = currentScrollY - lastScrollY;

          // User requirements:
          // USER SCROLLS UP -> Bottom navigation smoothly slides DOWN and disappears.
          // USER SCROLLS DOWN -> Bottom navigation smoothly slides UP and appears.
          // Small threshold/debounce prevents accidental triggers from tiny touch movements.
          if (diff > 8) {
            // User is scrolling DOWN toward lower sections -> slides UP & becomes visible
            setInternalVisible(true);
          } else if (diff < -8) {
            // User is scrolling UP toward top -> slides DOWN & completely hides
            setInternalVisible(false);
          }

          lastScrollY = Math.max(0, currentScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const visible = externalIsVisible !== undefined ? externalIsVisible : internalVisible;

  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 z-40 bg-white/98 dark:bg-slate-900/98 backdrop-blur-md border-t border-slate-200/90 dark:border-slate-800 shadow-lg safe-area-pb will-change-transform ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
      style={{
        transition: 'transform 300ms ease-out',
        WebkitTransition: '-webkit-transform 300ms ease-out',
      }}
    >
      <div className="grid grid-cols-5 h-16 max-w-lg mx-auto px-1 items-center relative select-none">
        
        {/* 1. Explore (House outline icon) */}
        <button
          onClick={() => setActiveTab('explore')}
          className={`flex flex-col items-center justify-center py-1 transition-all relative cursor-pointer ${
            activeTab === 'explore'
              ? 'text-slate-900 dark:text-white font-bold scale-105'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Home className={`w-6 h-6 ${activeTab === 'explore' ? 'stroke-[2.3] text-slate-900 dark:text-white' : 'stroke-[1.8]'}`} />
          <span className="text-[11px] mt-1 tracking-tight leading-none font-semibold">
            Explore
          </span>
        </button>

        {/* 2. Sectors (3x3 grid icon) */}
        <button
          onClick={() => setActiveTab('sectors')}
          className={`flex flex-col items-center justify-center py-1 transition-all relative cursor-pointer ${
            activeTab === 'sectors'
              ? 'text-slate-900 dark:text-white font-bold scale-105'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <LayoutGrid className={`w-6 h-6 ${activeTab === 'sectors' ? 'stroke-[2.3] text-slate-900 dark:text-white' : 'stroke-[1.8]'}`} />
          <span className="text-[11px] mt-1 tracking-tight leading-none font-semibold">
            Sectors
          </span>
        </button>

        {/* 3. Enlist (Elevated Blue Circular Button) */}
        <div className="flex flex-col items-center justify-center -mt-6">
          <button
            onClick={onOpenEnlist}
            className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-lg shadow-blue-500/40 active:scale-95 transition-all cursor-pointer border-[3px] border-white dark:border-slate-900"
            aria-label="Enlist Business"
          >
            <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center">
              <Plus className="w-5 h-5 stroke-[3]" />
            </div>
          </button>
          <span className="text-[11px] mt-1 tracking-tight leading-none font-bold text-blue-600 dark:text-blue-400">
            Enlist
          </span>
        </div>

        {/* 4. Saved (Dedicated Page Tab) */}
        <button
          onClick={() => setActiveTab('saved')}
          className={`flex flex-col items-center justify-center py-1 transition-all relative cursor-pointer ${
            activeTab === 'saved'
              ? 'text-slate-900 dark:text-white font-bold scale-105'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <Bookmark className={`w-6 h-6 ${activeTab === 'saved' ? 'stroke-[2.3] text-slate-900 dark:text-white fill-slate-900/10 dark:fill-white/10' : 'stroke-[1.8]'}`} />
            {savedCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-blue-600 text-white text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center border border-white dark:border-slate-900">
                {savedCount > 9 ? '9+' : savedCount}
              </span>
            )}
          </div>
          <span className="text-[11px] mt-1 tracking-tight leading-none font-semibold">
            Saved
          </span>
        </button>

        {/* 5. Menu (User / Profile outline icon) */}
        <button
          onClick={onOpenAccountMenu}
          className="flex flex-col items-center justify-center py-1 transition-all relative cursor-pointer text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
        >
          <User className="w-6 h-6 stroke-[1.8]" />
          <span className="text-[11px] mt-1 tracking-tight leading-none font-semibold">
            Menu
          </span>
        </button>

      </div>
    </div>
  );
};
