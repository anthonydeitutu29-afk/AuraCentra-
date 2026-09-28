import React from 'react';
import { 
  X, 
  User, 
  Sun, 
  Moon, 
  Plus, 
  LogIn,
  ChevronRight,
  Compass,
  Layers,
  Newspaper,
  Tag,
  ShieldCheck,
  Info,
  HelpCircle,
  FileText,
  Bookmark
} from 'lucide-react';
import { UserAccount } from './AuthModal';
import { AuraCentraLogo } from './AuraCentraLogo';

interface NavbarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenEnlist: () => void;
  onOpenAuth: () => void;
  currentUser: UserAccount | null;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const NavbarDrawer: React.FC<NavbarDrawerProps> = ({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  onOpenEnlist,
  onOpenAuth,
  currentUser,
  isDarkMode,
  onToggleTheme,
}) => {
  if (!isOpen) return null;

  const links = [
    { id: 'explore', label: 'Explore (Home)', icon: Compass, badge: null },
    { id: 'sectors', label: 'Sectors & Business Categories', icon: Layers, badge: 'All Categories', badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' },
    { id: 'saved', label: 'Saved Shortlist', icon: Bookmark, badge: null },
    { id: 'news', label: 'Business News & Live Forex', icon: Newspaper, badge: 'Live FX', badgeColor: 'bg-blue-600 text-white' },
    { id: 'pricing', label: 'Pricing & Enlistment', icon: Tag, badge: null },
    { id: 'verification', label: 'Ghana Card Verification', icon: ShieldCheck, badge: 'Gold Badge', badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' },
    { id: 'about', label: 'About AuraCentra', icon: Info, badge: null },
    { id: 'support', label: "Tony's Support Hub", icon: HelpCircle, badge: 'Online', badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' },
    { id: 'terms', label: 'Terms of Service & Trust', icon: FileText, badge: 'Verified Trust', badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300' },
  ];

  const handleNavigate = (id: string) => {
    setActiveTab(id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="fixed inset-x-0 top-0 max-h-[96vh] bg-white dark:bg-slate-900 rounded-b-3xl shadow-2xl overflow-y-auto flex flex-col z-10 animate-in slide-in-from-top duration-200 safe-area-pb transition-colors">
        
        {/* Top Header matching Image 7 */}
        <div className="px-5 py-3.5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
          <div 
            onClick={() => handleNavigate('explore')}
            className="cursor-pointer"
          >
            <AuraCentraLogo size="sm" />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenAuth();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              <User className="w-3.5 h-3.5" />
              <span>{currentUser ? currentUser.name.split(' ')[0] : 'Sign In'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Links List matching Image 7 */}
        <div className="p-4 sm:p-6 space-y-1.5">
          {links.map((link) => {
            const isCurrent = activeTab === link.id;
            const Icon = link.icon;
            return (
              <button
                key={link.id}
                onClick={() => handleNavigate(link.id)}
                className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-bold'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isCurrent ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`} />
                  <span className="text-xs sm:text-sm font-semibold">{link.label}</span>
                </div>

                <div className="flex items-center gap-2">
                  {link.badge && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${link.badgeColor}`}>
                      {link.badge}
                    </span>
                  )}
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom Action Group matching Image 7 */}
        <div className="p-4 sm:p-6 pt-0 space-y-3">
          
          {/* Appearance Theme Card matching Image 7 */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {isDarkMode ? <Moon className="w-4 h-4 text-blue-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Appearance Theme: {isDarkMode ? 'Night' : 'Day'}
              </span>
            </div>
            <button
              onClick={onToggleTheme}
              className="px-3 py-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer"
            >
              Toggle
            </button>
          </div>

          {/* List Your Business Button */}
          <button
            onClick={() => {
              onClose();
              onOpenEnlist();
            }}
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>List Your Business</span>
          </button>

          {/* Sign In to Account Button */}
          <button
            onClick={() => {
              onClose();
              onOpenAuth();
            }}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>{currentUser ? 'Manage Your Account' : 'Sign in to Account'}</span>
          </button>

        </div>

      </div>
    </div>
  );
};
