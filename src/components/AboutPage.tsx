import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft,
  ShieldCheck, 
  ShieldAlert,
  TrendingUp, 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  CheckCircle2, 
  Zap,
  Lock,
  Scale,
  MessageSquareX,
  Award,
  Sparkles,
  ExternalLink,
  HelpCircle,
  Clock,
  Check,
  FileText,
  Gift,
  Tag
} from 'lucide-react';
import { Logo } from './Logo';

export type AboutPageTab = 'about' | 'pricing' | 'verification' | 'terms';

interface AboutPageProps {
  initialTab?: AboutPageTab;
  onBackToHome: () => void;
  onOpenRegister: () => void;
  onShowToast?: (title: string, message?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  initialTab = 'about',
  onBackToHome,
  onOpenRegister,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<AboutPageTab>(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  return (
    <main 
      className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8 animate-in fade-in duration-200"
      id="auracentra-about-page"
    >
      {/* Top Navigation & Breadcrumbs */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <button
            type="button"
            onClick={onBackToHome}
            className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors font-medium cursor-pointer"
          >
            Home
          </button>
          <span>/</span>
          <span className="font-semibold text-slate-900 dark:text-white">
            {activeTab === 'about' && 'About AuraCentra'}
            {activeTab === 'pricing' && 'Listing Packages & Pricing'}
            {activeTab === 'verification' && 'Ghana Card Verification'}
            {activeTab === 'terms' && 'Terms of Service & Trust Standards'}
          </span>
        </div>

        <button
          type="button"
          onClick={onBackToHome}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer shadow-2xs"
          id="about-back-home-btn"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Directory</span>
        </button>
      </div>

      {/* Header Container (Circled section updated with high-contrast, readable light background) */}
      <div 
        className="w-full rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-blue-50/90 via-slate-50 to-indigo-50/80 dark:from-slate-850 dark:via-slate-900 dark:to-slate-850 border border-blue-100/90 dark:border-slate-750 shadow-xs relative overflow-hidden"
        id="about-page-header"
      >
        {/* Subtle decorative background accent */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Logo & Brand Identity with crystal-clear visibility */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-xs border border-slate-200/80 dark:border-slate-700 shrink-0 inline-flex">
              <Logo size="lg" showTagline={true} textColorMode="auto" showRuleLines={true} />
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  AuraCentra Ghana
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-[11px] font-bold shadow-2xs">
                  Official Platform
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold border border-emerald-200 dark:border-emerald-800">
                  Verified Directory
                </span>
              </div>

              <p className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 max-w-2xl leading-relaxed">
                Ghana&apos;s Premier Verified Business Directory & Commercial Discovery Network. Bridging the trust deficit with genuine government-backed identity and physical GPS verification across all 16 regions.
              </p>

              <div className="pt-1 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1 font-semibold text-blue-700 dark:text-cyan-400">
                  <Building2 className="w-3.5 h-3.5" />
                  Strategic Alliance: Tony&apos;s Digital Marketing & Business Hub
                </span>
                <span className="hidden sm:inline text-slate-300 dark:text-slate-600">•</span>
                <span>Ho & Greater Accra, Ghana</span>
              </div>
            </div>
          </div>

          {/* Quick Enlistment CTA */}
          <div className="shrink-0 flex sm:flex-col gap-2">
            <button
              type="button"
              onClick={onOpenRegister}
              className="flex-1 sm:flex-none px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Enlist Your Business</span>
            </button>
            <a
              href="https://wa.me/233508203673"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp Support</span>
            </a>
          </div>
        </div>

        {/* Feature Highlights Ribbon */}
        <div className="mt-6 pt-5 border-t border-slate-200/80 dark:border-slate-750/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="font-semibold">Ghana Card Vetted</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <span className="font-semibold">All 16 Regions</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <ShieldAlert className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
            <span className="font-semibold">Zero Scam Tolerance</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <Lock className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span className="font-semibold">Act 843 Compliant</span>
          </div>
        </div>
      </div>

      {/* Main Tab Navigation Strip */}
      <div className="p-1.5 bg-slate-100 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-1.5">
        <button
          type="button"
          onClick={() => setActiveTab('about')}
          className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'about'
              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-cyan-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Mission & Vision</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('pricing')}
          className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'pricing'
              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-cyan-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Listing Packages & Pricing</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('verification')}
          className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'verification'
              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-cyan-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Ghana Card Verification</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('terms')}
          className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'terms'
              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-cyan-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>Terms & Community Trust</span>
        </button>
      </div>

      {/* TAB 1: Mission & Vision */}
      {activeTab === 'about' && (
        <div className="space-y-8 animate-in fade-in duration-150">
          {/* Main Story & Purpose */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Connecting People to Trusted Businesses Across All 16 Regions of Ghana
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-4xl">
                AuraCentra is Ghana’s dedicated business directory and market discovery platform. We solve the pervasive trust gap in the Ghanaian marketplace by validating physical shop and office locations, verifying National ID credentials (Ghana Card), and integrating real-time commercial opportunities and economic insights.
              </p>
            </div>

            {/* Three Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4">
              <div className="p-5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">100% Vetted Trust</h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Identity-backed Ghana Card verification and physical GPS location audits protect Ghanaian consumers while spotlighting genuine, law-abiding enterprises.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/60 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Direct Lead Generation</h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Instant WhatsApp quotes, direct phone calls, GPS map directions, and downloadable QR badges connect businesses to paying customers with zero middlemen.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/60 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Digital Marketing Hub</h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Operated in strategic alliance with Tony&apos;s Digital Marketing & Business Hub to provide tailored SEO, local search dominance, and digital growth campaigns.
                </p>
              </div>
            </div>
          </div>

          {/* Strategic Alliance Section */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-bold">
                Strategic Alliance & Operations
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                Powered by Tony&apos;s Digital Marketing & Business Hub
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Headquartered in the Ho Commercial District (Volta Region) with active operations spanning Greater Accra, Kumasi, and nationwide. We provide corporate directory moderation, verification compliance, and enterprise digital marketing solutions.
              </p>
            </div>

            <div className="shrink-0 space-y-2.5 w-full md:w-auto">
              <a
                href="https://wa.me/233508203673"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>Contact Management on WhatsApp</span>
              </a>
              <div className="text-center md:text-left text-[11px] text-slate-500 dark:text-slate-400">
                Official Desk: +233 50 820 3673
              </div>
            </div>
          </div>

          {/* Official Head Office & Support Coordinates */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Official Head Office & Support Directory
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span>Physical Presence</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300">
                  Ho Commercial District, Volta Region & Greater Accra, Ghana. Covering all 16 administrative regions.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                  <Phone className="w-4 h-4 text-emerald-600" />
                  <span>WhatsApp Desk</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300">
                  +233 50 820 3673 (Live compliance, listing inquiries, & business verification).
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <span>Official Email</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 font-mono text-xs break-all">
                  tonysdigitalmarketing@gmail.com
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Packages & Pricing */}
      {activeTab === 'pricing' && (
        <div className="space-y-8 animate-in fade-in duration-150">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Transparent, Value-Driven Enlistment Packages
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Free forever basic directory registration with optional trust badges and high-visibility growth upgrades.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Standard Free */}
            <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-500 tracking-wider uppercase">STANDARD ENTRY</span>
                  <div className="text-3xl font-black text-slate-900 dark:text-white">Free</div>
                  <p className="text-xs text-slate-500">Forever directory indexation</p>
                </div>

                {/* Special Offer Callout */}
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-start gap-2.5">
                  <Gift className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                      <span>Special Launch Offer</span>
                      <span className="px-1.5 py-0.2 rounded-md bg-emerald-200/80 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 text-[10px] font-black uppercase">Bonus</span>
                    </div>
                    <p className="text-[11px] text-emerald-800/90 dark:text-emerald-300 leading-snug">
                      First 100 businesses receive <strong>30 days of free priority search indexing</strong> & complimentary WhatsApp business setup.
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Full Business profile & contact info</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Opening hours, services & pricing</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Customer reviews, ratings & photos</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Standard directory search indexing</span>
                    </li>
                  </ul>
                </div>
              </div>

              <button
                type="button"
                onClick={onOpenRegister}
                className="w-full py-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-all cursor-pointer"
              >
                List Your Business Free
              </button>
            </div>

            {/* Gold Verified */}
            <div className="p-6 rounded-3xl border-2 border-blue-600 bg-blue-50/40 dark:bg-blue-950/40 space-y-5 relative shadow-lg shadow-blue-600/10 flex flex-col justify-between">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider shadow-sm">
                Recommended for Credibility
              </div>

              <div className="space-y-4 pt-2">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 tracking-wider uppercase">GOLD VERIFIED</span>
                  <div className="text-3xl font-black text-slate-900 dark:text-white">
                    GHS 100 <span className="text-xs font-normal text-slate-500">/ month</span>
                  </div>
                  <p className="text-xs text-slate-500">Identity & Location Verified Trust</p>
                </div>

                {/* Special Offer Callout */}
                <div className="p-3 rounded-2xl bg-blue-100/70 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/80 flex items-start gap-2.5">
                  <Tag className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
                      <span>Special Offer: Pay 3, Get 1 Free</span>
                      <span className="px-1.5 py-0.2 rounded-md bg-blue-200 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-[10px] font-black uppercase">Save GHS 100</span>
                    </div>
                    <p className="text-[11px] text-blue-800/90 dark:text-blue-300 leading-snug">
                      Pay for 3 months (GHS 300) and get the <strong>4th month 100% FREE</strong> + complimentary printable official QR shop window decal.
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-blue-200 dark:border-blue-900/60">
                  <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
                    <li className="flex items-center gap-2 font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>Ghana Card Gold Verified Badge</span>
                    </li>
                    <li className="flex items-center gap-2 font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>Priority placement in search rankings</span>
                    </li>
                    <li className="flex items-center gap-2 font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>Direct WhatsApp Quote Lead Generation</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>Downloadable QR Code Marketing Kit</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>Official Verification Certificate</span>
                    </li>
                  </ul>
                </div>
              </div>

              <button
                type="button"
                onClick={onOpenRegister}
                className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/30 transition-all cursor-pointer"
              >
                Apply for Gold Verification
              </button>
            </div>

            {/* Enterprise Growth */}
            <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-400 tracking-wider uppercase">ENTERPRISE PARTNER</span>
                  <div className="flex items-baseline gap-2">
                    <span className="line-through text-slate-400 text-base font-semibold">GHS 249</span>
                    <div className="text-3xl font-black text-slate-900 dark:text-white">
                      GHS 150 <span className="text-xs font-normal text-slate-500">/ month</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500">Active Digital Marketing by Tony&apos;s Hub</p>
                </div>

                {/* Special Offer Callout */}
                <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800/70 flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-purple-900 dark:text-purple-200 flex items-center gap-1.5">
                      <span>Special Promo: Save GHS 99/mo</span>
                      <span className="px-1.5 py-0.2 rounded-md bg-purple-200 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-[10px] font-black uppercase">40% Off</span>
                    </div>
                    <p className="text-[11px] text-purple-800/90 dark:text-purple-300 leading-snug">
                      Includes <strong>free 1-on-1 Social Media ad campaign setup</strong> & custom Google Business sync by Tony&apos;s Digital Marketing Hub.
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                      <span>All Gold Verified Badge Benefits</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                      <span>Homepage Featured Spotlight Carousel</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                      <span>Social Media Campaigns by Tony&apos;s Hub</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                      <span>Dedicated Account Support Manager</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                      <span>Custom SEO & Google Business Sync</span>
                    </li>
                  </ul>
                </div>
              </div>

              <button
                type="button"
                onClick={onOpenRegister}
                className="w-full py-3 rounded-2xl border border-purple-300 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/50 text-xs font-bold transition-all cursor-pointer"
              >
                Choose Enterprise Partner
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Ghana Card Verification */}
      {activeTab === 'verification' && (
        <div className="space-y-8 animate-in fade-in duration-150">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="space-y-2 max-w-3xl">
              <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
                National Identity Auditing
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Why Verification Matters in the Ghanaian Commercial Ecosystem
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Online scams, impersonation, and untrusted intermediaries hurt both consumers and legitimate Ghanaian business owners. AuraCentra’s Gold Verification program audits national identity credentials (Ghana Card) alongside physical shop/office coordinates before awarding the official Gold badge.
              </p>
            </div>

            {/* 3-Step Process */}
            <div className="p-6 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 space-y-4 mt-6">
              <div className="flex items-center gap-2 text-sm font-bold text-emerald-900 dark:text-emerald-200">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>The 3-Step Rigorous Verification Protocol</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-emerald-100 dark:border-emerald-900/60 space-y-2">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center">
                    1
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Profile & GPS Registry</h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">
                    Submit your enterprise profile, valid GhanaPost digital GPS address, and operational phone numbers.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-emerald-100 dark:border-emerald-900/60 space-y-2">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center">
                    2
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Credential Verification</h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">
                    Upload an unmanipulated photo of your Ghana Card and optional Registrar General (ORC) certificates.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-emerald-100 dark:border-emerald-900/60 space-y-2">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center">
                    3
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Audit & Gold Badge Activation</h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">
                    Our compliance team audits your documents within 24–48 hours, activates the Gold Badge, and issues your certificate.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onOpenRegister}
                className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Submit Your Verification Application</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Terms & Community Trust Standards */}
      {activeTab === 'terms' && (
        <div className="space-y-8 animate-in fade-in duration-150">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  AuraCentra Terms of Service & Community Trust Standards
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-bold">
                  Effective September 2026
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-4xl">
                Operated in strategic alliance with <strong>Tony&apos;s Digital Marketing & Business Hub</strong> (Ho & Greater Accra, Ghana). By utilizing AuraCentra as a business owner or consumer, you agree to uphold our community standards of authenticity, professional courtesy, and honest commerce.
              </p>
            </div>

            {/* Zero-Tolerance Anti-Scam Callout */}
            <div className="p-5 sm:p-6 rounded-2xl bg-red-50/80 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 space-y-3">
              <div className="flex items-center gap-2 font-bold text-red-900 dark:text-red-300 text-sm sm:text-base">
                <ShieldAlert className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />
                <span>Zero-Tolerance Anti-Scam & Anti-Fraud Guarantee</span>
              </div>
              <p className="text-xs sm:text-sm text-red-900/90 dark:text-red-200 leading-relaxed">
                AuraCentra operates an uncompromising anti-fraud regime across all 16 regions of Ghana. We strictly prohibit advance-fee fraud, deceptive listings, fake delivery upfront payment schemes, counterfeit merchandise, or ghost entities. Fraudulent actors face immediate permanent expulsion and direct referral to Ghana&apos;s <strong>Cyber Security Authority (CSA)</strong> and the <strong>Ghana Police Service (CID)</strong>.
              </p>
            </div>

            {/* 4 Core Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850/50 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
                  <MessageSquareX className="w-4 h-4 text-emerald-600" />
                  <span>Anti-Spam & Direct Contact Protocol</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Automated scraping of phone numbers, robotic telemarketing, unsolicited SMS blasts, or chain messaging is strictly banned. Direct inquiries via WhatsApp or phone must pertain exclusively to the listed enterprise&apos;s goods or services.
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850/50 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span>National ID Verification Integrity</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Submitting forged Ghana Card documentation, stolen identities, or fake GPS coordinates is a criminal offense under Ghanaian law and triggers an immediate public blacklisting on the AuraCentra registry.
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850/50 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
                  <Scale className="w-4 h-4 text-purple-600" />
                  <span>Honest Reviews & Fair Competition</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Reviews must stem from authentic consumer transactions. Astroturfing, fake testimonials, incentivized ratings, or coordinated attacks against competitors will result in forfeiture of reviews and possible profile delisting.
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850/50 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
                  <Lock className="w-4 h-4 text-indigo-600" />
                  <span>Ghana Data Protection Act (Act 843)</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  In strict compliance with Act 843, user contact credentials and verification records are securely managed. AuraCentra does not sell user phone numbers or emails to third-party marketing brokers.
                </p>
              </div>
            </div>

            {/* Direct Fraud Hotline Desk */}
            <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs sm:text-sm">
              <div>
                <div className="font-bold text-slate-900 dark:text-white">Suspicious Listing or Fraud Reporting?</div>
                <div className="text-slate-500 dark:text-slate-400">Direct escalation line to AuraCentra Trust Officers</div>
              </div>
              <a
                href="https://wa.me/233508203673"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shrink-0 shadow-xs"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Report to Trust Desk on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
