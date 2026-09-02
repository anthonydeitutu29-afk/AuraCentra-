import React, { useState, useEffect } from 'react';
import { 
  Cookie, 
  ShieldCheck, 
  Settings2, 
  Check, 
  X, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Info,
  Activity,
  Lock
} from 'lucide-react';
import { CookieConsentPreferences } from '../types';
import { getCookieConsent, saveCookieConsent, getAllCookies } from '../utils/cookieManager';

interface CookieConsentBannerProps {
  onAccept?: (preferences: CookieConsentPreferences) => void;
}

export const CookieConsentBanner: React.FC<CookieConsentBannerProps> = ({ onAccept }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  
  // Customizable preferences
  const [analytics, setAnalytics] = useState(true);
  const [preferences, setPreferences] = useState(true);
  const [marketing, setMarketing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Check if consent has already been given
    const existingConsent = getCookieConsent();
    if (!existingConsent) {
      // Delay slightly for smooth page entry
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    const pref: CookieConsentPreferences = {
      essential: true,
      analytics: true,
      preferences: true,
      marketing: true,
      timestamp: new Date().toISOString(),
      status: 'accepted_all',
    };
    saveCookieConsent(pref);
    setIsVisible(false);
    setShowPreferencesModal(false);
    onAccept?.(pref);
  };

  const handleEssentialOnly = () => {
    const pref: CookieConsentPreferences = {
      essential: true,
      analytics: false,
      preferences: false,
      marketing: false,
      timestamp: new Date().toISOString(),
      status: 'essential_only',
    };
    saveCookieConsent(pref);
    setIsVisible(false);
    setShowPreferencesModal(false);
    onAccept?.(pref);
  };

  const handleSaveCustom = () => {
    const pref: CookieConsentPreferences = {
      essential: true,
      analytics,
      preferences,
      marketing,
      timestamp: new Date().toISOString(),
      status: 'custom',
    };
    saveCookieConsent(pref);
    setIsVisible(false);
    setShowPreferencesModal(false);
    onAccept?.(pref);
  };

  if (!isVisible && !showPreferencesModal) return null;

  return (
    <>
      {/* Floating Bottom Cookie Consent Banner */}
      {isVisible && !showPreferencesModal && (
        <div 
          id="auracentra-cookie-banner"
          className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-xl z-50 animate-in slide-in-from-bottom-6 duration-300"
        >
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl p-5 sm:p-6 shadow-2xl border border-slate-200/90 dark:border-slate-800 ring-1 ring-black/5 text-slate-900 dark:text-slate-100">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-2xl bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
                <Cookie className="w-6 h-6" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-tight">
                    Cookie & Visitor Experience
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-black uppercase tracking-wider">
                    Ghana DPA Compliant
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  We use cookies and secure browser storage to recognize your device, remember regional preferences across Ghana, and deliver faster verified business discovery.
                </p>

                {/* Actions */}
                <div className="mt-4 flex flex-wrap items-center gap-2 sm:gap-2.5">
                  <button
                    type="button"
                    onClick={handleAcceptAll}
                    className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm shadow-blue-500/20 transition-all cursor-pointer text-center"
                  >
                    Accept All
                  </button>

                  <button
                    type="button"
                    onClick={handleEssentialOnly}
                    className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer text-center"
                  >
                    Essential Only
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowPreferencesModal(true)}
                    className="px-3 py-2.5 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white text-xs font-bold transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Settings2 className="w-3.5 h-3.5" />
                    <span>Customize</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preferences & Detail Modal */}
      {showPreferencesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8">
            
            {/* Header */}
            <div className="p-6 bg-slate-50 dark:bg-slate-850/70 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                  <Cookie className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                    Cookie & Visitor Preferences
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Control how AuraCentra records session info and visitor data.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowPreferencesModal(false)}
                className="p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cookie Categories */}
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto text-xs">
              {/* Category 1: Strictly Necessary */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span className="font-bold text-slate-900 dark:text-white text-sm">Strictly Essential Cookies</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-bold">
                    Always Active
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                  Necessary for website core functionality, authentication sessions, security CSRF guards, and saving verification state.
                </p>
              </div>

              {/* Category 2: Visitor Intelligence & Analytics */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-500" />
                    <span className="font-bold text-slate-900 dark:text-white text-sm">Visitor Analytics & Intelligence</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={analytics}
                      onChange={(e) => setAnalytics(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                  Tracks visitor counters, unique device IDs, browser fingerprints, and popular directories to measure listing performance for business owners.
                </p>
              </div>

              {/* Category 3: Regional Preferences & Personalization */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-amber-500" />
                    <span className="font-bold text-slate-900 dark:text-white text-sm">Regional Preferences</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences}
                      onChange={(e) => setPreferences(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                  Remembers your selected city, Ghanaian region filter, and dark/light theme mode across visits.
                </p>
              </div>

              {/* Technical Cookie Details Dropdown */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Info className="w-3.5 h-3.5" />
                  <span>{showDetails ? 'Hide Cookie Key Table' : 'View Stored Cookie Keys on this Device'}</span>
                  {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {showDetails && (
                  <div className="mt-3 p-3 rounded-xl bg-slate-100 dark:bg-slate-950 font-mono text-[11px] text-slate-700 dark:text-slate-300 space-y-1.5 border border-slate-200 dark:border-slate-800">
                    <div className="font-bold text-slate-900 dark:text-white mb-1">Active AuraCentra Cookie Keys:</div>
                    <div>• <span className="text-blue-600 dark:text-cyan-300 font-semibold">auracentra_visitor_id</span>: Persistent visitor identifier</div>
                    <div>• <span className="text-blue-600 dark:text-cyan-300 font-semibold">auracentra_session_id</span>: Active browsing session</div>
                    <div>• <span className="text-blue-600 dark:text-cyan-300 font-semibold">auracentra_visit_count</span>: Total visits from this client</div>
                    <div>• <span className="text-blue-600 dark:text-cyan-300 font-semibold">auracentra_pref_region</span>: Saved exploration region</div>
                    <div>• <span className="text-blue-600 dark:text-cyan-300 font-semibold">auracentra_cookie_consent</span>: Selected privacy level</div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-850/70 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={handleEssentialOnly}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                Reject Non-Essential
              </button>
              <button
                type="button"
                onClick={handleSaveCustom}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all"
              >
                Save My Preferences
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
