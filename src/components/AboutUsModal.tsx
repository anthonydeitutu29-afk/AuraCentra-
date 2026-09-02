import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  TrendingUp, 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  CheckCircle2, 
  Users, 
  Award,
  Zap
} from 'lucide-react';
import { Logo } from './Logo';

interface AboutUsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'about' | 'pricing' | 'verification';
  onOpenRegister: () => void;
}

export const AboutUsModal: React.FC<AboutUsModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'about',
  onOpenRegister,
}) => {
  const [activeTab, setActiveTab] = useState<'about' | 'pricing' | 'verification'>(initialTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8"
        id="about-us-modal"
      >
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <div>
              <h2 className="text-lg font-bold tracking-tight">About AuraCentra Ghana</h2>
              <p className="text-xs text-slate-400">Ghana's Premier Verified Business Directory & Market Platform</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="p-2 bg-slate-100 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('about')}
            className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'about'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-cyan-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Our Mission & Vision
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('pricing')}
            className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'pricing'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-cyan-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Listing Packages & Pricing
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('verification')}
            className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'verification'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-cyan-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Ghana Card Verification
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6">
          {activeTab === 'about' && (
            <div className="space-y-5">
              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Connecting People to Trusted Businesses Across Ghana
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  AuraCentra is Ghana’s dedicated business directory and market discovery platform. We solve the trust gap in the Ghanaian marketplace by validating physical locations, verifying National ID credentials (Ghana Card), and integrating real-time business opportunities and economic insights.
                </p>
              </div>

              {/* Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">100% Vetted Trust</h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    Identity-backed verification protects buyers and elevates genuine Ghanaian service providers.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/60 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                    <Zap className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Direct Lead Generation</h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    Instant WhatsApp quotes, phone calls, and QR discovery connect businesses to real clients.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/60 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Digital Marketing Hub</h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    Partnered with Tony's Digital Marketing & Business Hub to drive high-conversion visibility.
                  </p>
                </div>
              </div>

              {/* Contact info */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                <div className="font-bold text-slate-800 dark:text-slate-200">Official Head Office & Support</div>
                <div className="flex flex-wrap items-center gap-4 text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    <span>Accra, Greater Accra Region, Ghana</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>+233 50 820 3673 (WhatsApp Support)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-blue-600" />
                    <span>tonysdigitalmarketing@gmail.com</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'pricing' && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Transparent Plans to Grow Your Enterprise
                </h3>
                <p className="text-xs text-slate-500">
                  Free forever basic listing with optional growth upgrades.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Standard Free */}
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 space-y-3">
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-slate-500">STANDARD</div>
                    <div className="text-xl font-black text-slate-900 dark:text-white">Free</div>
                    <div className="text-[10px] text-slate-400">Forever directory listing</div>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>Business profile & contacts</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>Opening hours & services</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>Customer reviews & ratings</span>
                    </li>
                  </ul>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenRegister();
                    }}
                    className="w-full py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100 text-xs font-bold"
                  >
                    List Free
                  </button>
                </div>

                {/* Gold Verified */}
                <div className="p-4 rounded-2xl border-2 border-blue-600 bg-blue-50/30 dark:bg-blue-950/40 space-y-3 relative shadow-md">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-black uppercase">
                    Most Popular
                  </div>
                  <div className="space-y-1 pt-1">
                    <div className="text-xs font-bold text-blue-600 dark:text-blue-400">GOLD VERIFIED</div>
                    <div className="text-xl font-black text-slate-900 dark:text-white">GHS 99 <span className="text-xs font-normal text-slate-500">/mo</span></div>
                    <div className="text-[10px] text-slate-400">Identity-verified credibility</div>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>Ghana Card Gold Verified Badge</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>Priority in search results</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>Direct WhatsApp Quote leads</span>
                    </li>
                  </ul>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenRegister();
                    }}
                    className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/30"
                  >
                    Get Verified
                  </button>
                </div>

                {/* Enterprise Growth */}
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 space-y-3">
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-purple-600 dark:text-purple-400">ENTERPRISE</div>
                    <div className="text-xl font-black text-slate-900 dark:text-white">GHS 249 <span className="text-xs font-normal text-slate-500">/mo</span></div>
                    <div className="text-[10px] text-slate-400">Dedicated digital marketing</div>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                      <span>Homepage Featured Spotlight</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                      <span>Social Media Promotion by Tony's Hub</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                      <span>Dedicated Account Manager</span>
                    </li>
                  </ul>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenRegister();
                    }}
                    className="w-full py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100 text-xs font-bold"
                  >
                    Choose Enterprise
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'verification' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Why Verification Matters in Ghana
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Fraudulent accounts and untrusted intermediaries hurt legitimate businesses. Our Gold Verification program audits national identity credentials (Ghana Card) and physical shop/office coordinates before awarding the official Gold badge.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  <ShieldCheck className="w-4 h-4" />
                  <span>3-Step Simple Verification Process</span>
                </div>
                <ol className="list-decimal list-inside text-xs text-emerald-900 dark:text-emerald-200 space-y-1">
                  <li>Register your business profile and location details.</li>
                  <li>Upload a clear photo of your Ghana Card and business registration.</li>
                  <li>Our verification team audits your submission within 24 hours.</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-500">AuraCentra Ghana • Powering local commerce</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
