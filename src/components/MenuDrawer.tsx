import React from 'react';
import { 
  X, 
  Compass, 
  Layers, 
  TrendingUp, 
  BadgeCheck, 
  Tag, 
  Info, 
  HelpCircle, 
  FileText, 
  PlusCircle, 
  Moon, 
  Sun, 
  ChevronRight,
  ShieldCheck,
  PhoneCall,
  Bookmark,
  User,
  LogIn,
  LogOut
} from 'lucide-react';
import { UserAccount } from './AuthModal';

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenEnlist: () => void;
  onOpenAuth: () => void;
  currentUser: UserAccount | null;
  onLogout: () => void;
  savedCount?: number;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const MenuDrawer: React.FC<MenuDrawerProps> = ({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  onOpenEnlist,
  onOpenAuth,
  currentUser,
  onLogout,
  savedCount = 0,
  isDarkMode,
  onToggleTheme,
}) => {
  if (!isOpen) return null;

  const menuItems = [
    { id: 'explore', label: 'Explore Directory', icon: Compass, badge: null },
    { id: 'sectors', label: 'Business Sectors', icon: Layers, badge: 'All Categories', badgeColor: 'bg-amber-100 text-amber-800' },
    { id: 'news', label: 'Business News & Live FX', icon: TrendingUp, badge: 'Live FX', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'verification', label: 'Ghana Verification & Badges', icon: BadgeCheck, badge: 'Ghana Card', badgeColor: 'bg-blue-100 text-blue-800' },
    { id: 'pricing', label: 'Pricing & Plans', icon: Tag, badge: null },
    { id: 'saved', label: 'Saved Listings', icon: Bookmark, badge: savedCount > 0 ? `${savedCount} saved` : null, badgeColor: 'bg-blue-600 text-white' },
    { id: 'about', label: 'About AuraCentra', icon: Info, badge: null },
    { id: 'support', label: 'Support & Help Hub', icon: HelpCircle, badge: 'Online', badgeColor: 'bg-teal-100 text-teal-800' },
    { id: 'terms', label: 'Terms of Service & Trust', icon: FileText, badge: null },
  ];

  const handleSelectTab = (id: string) => {
    setActiveTab(id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Slide-over / Bottom sheet panel */}
      <div className="fixed inset-x-0 bottom-0 max-h-[90vh] bg-white rounded-t-3xl shadow-2xl overflow-y-auto flex flex-col z-10 animate-in slide-in-from-bottom duration-200 safe-area-pb">
        {/* Drag pill handle */}
        <div className="pt-3 pb-1 flex justify-center">
          <div className="w-12 h-1.5 bg-slate-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-5 py-3 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-sm shadow-sm">
              AC
            </div>
            <div>
              <div className="text-base font-bold text-slate-900 leading-tight">
                Aura<span className="text-blue-600">Centra</span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">Ghana Business Ecosystem</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Toggle Theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* User Account Bar */}
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          {currentUser ? (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">{currentUser.name}</h4>
                  <p className="text-[10px] text-slate-500">{currentUser.email}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  onLogout();
                }}
                className="text-[11px] font-semibold text-rose-600 hover:underline flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">AuraCentra Account</h4>
                  <p className="text-[10px] text-slate-500">Sign in to sync your listings & bookmarks</p>
                </div>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onOpenAuth();
                }}
                className="px-3 py-1.5 bg-white border border-slate-200 text-blue-600 text-xs font-bold rounded-lg shadow-2xs hover:bg-blue-50 transition-colors cursor-pointer flex items-center gap-1"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            </div>
          )}
        </div>

        {/* Enlist Business Call-to-action */}
        <div className="p-4 bg-slate-50 border-b border-slate-100">
          <button
            onClick={() => {
              onClose();
              onOpenEnlist();
            }}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 stroke-[2.5]" />
            <span>Enlist A Business Now</span>
          </button>
          <div className="flex items-center justify-center gap-4 mt-2.5 text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Ghana Card Vetting
            </span>
            <span className="flex items-center gap-1">
              <PhoneCall className="w-3.5 h-3.5 text-blue-600" />
              WhatsApp Direct
            </span>
          </div>
        </div>

        {/* Navigation list */}
        <div className="px-3 py-2 divide-y divide-slate-100">
          <div className="py-1">
            {menuItems.map((item) => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                    isActive 
                      ? 'bg-blue-50 text-blue-700 font-bold' 
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-lg ${isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span>{item.label}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.badge && (
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${item.badgeColor || 'bg-slate-100 text-slate-600'}`}>
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer info in menu */}
        <div className="mt-auto p-4 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500 font-medium">
            AuraCentra Ghana © 2026. All rights reserved.
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Verified National Business Directory & Intelligence Portal
          </p>
        </div>
      </div>
    </div>
  );
};
