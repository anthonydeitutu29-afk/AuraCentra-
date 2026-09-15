import React from 'react';
import { 
  ArrowLeft,
  CheckCircle2, 
  Sparkles, 
  Gift, 
  Tag, 
  Award, 
  Building2, 
  ShieldCheck, 
  Phone, 
  HelpCircle,
  TrendingUp,
  MapPin,
  Check
} from 'lucide-react';
import { Logo } from './Logo';

interface PricingPageProps {
  onBackToHome: () => void;
  onOpenRegister: () => void;
  onShowToast?: (title: string, message?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({
  onBackToHome,
  onOpenRegister,
  onShowToast,
}) => {
  return (
    <main 
      className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 animate-in fade-in duration-200"
      id="auracentra-pricing-page"
    >
      {/* Top Navigation & Breadcrumbs */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <button
            type="button"
            onClick={onBackToHome}
            className="hover:text-blue-600 dark:hover:text-[#38BDF8] transition-colors font-medium cursor-pointer"
          >
            Home
          </button>
          <span>/</span>
          <span className="font-semibold text-slate-900 dark:text-white">
            Pricing & Enlistment Packages
          </span>
        </div>

        <button
          type="button"
          onClick={onBackToHome}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer shadow-2xs"
          id="pricing-back-home-btn"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Directory</span>
        </button>
      </div>

      {/* Hero Showcase Container */}
      <div className="w-full rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-blue-50/80 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-850 border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-xs border border-slate-200/80 dark:border-slate-700 shrink-0 inline-flex">
              <Logo size="lg" showTagline={true} textColorMode="auto" showRuleLines={true} />
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  Pricing & Business Enlistment
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-[#155DFC] text-white text-[11px] font-bold">
                  Free Forever Basic
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold border border-emerald-200 dark:border-emerald-800">
                  Ghana Card Verified
                </span>
              </div>

              <p className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 max-w-2xl leading-relaxed">
                Empowering Ghanaian entrepreneurs across all 16 regions with transparent, zero-surprise listing plans. Start 100% free forever, or upgrade for certified credibility and search dominance.
              </p>
            </div>
          </div>

          <div className="shrink-0 flex sm:flex-col gap-2">
            <button
              type="button"
              onClick={onOpenRegister}
              className="px-6 py-3.5 rounded-2xl bg-[#155DFC] hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Enlist Your Business</span>
            </button>
            <a
              href="https://wa.me/233508203673?text=Hello%20Tony%27s%20Hub%2C%20I%20have%20a%20question%20about%20AuraCentra%20enlistment%20pricing."
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>Talk to Desk</span>
            </a>
          </div>
        </div>
      </div>

      {/* 3 Main Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        
        {/* Tier 1: Standard Free */}
        <div className="p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-6 flex flex-col justify-between shadow-sm">
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-500 tracking-wider uppercase">STANDARD ENTRY</span>
              <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">Free</div>
              <p className="text-xs text-slate-500 font-medium">Forever directory indexation • Zero recurring fees</p>
            </div>

            {/* Launch Offer Callout */}
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-start gap-2.5">
              <Gift className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                  <span>Special Launch Bonus</span>
                  <span className="px-1.5 py-0.2 rounded-md bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 text-[10px] font-black uppercase">Bonus</span>
                </div>
                <p className="text-[11px] text-emerald-800/90 dark:text-emerald-300 leading-snug">
                  First 100 businesses receive <strong>30 days of free priority search indexing</strong> & WhatsApp setup assistance.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <ul className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Full Business profile & contact info</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Opening hours, services & catalog</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Customer reviews, ratings & photos</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Standard directory search indexing</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Direct WhatsApp inquiry button</span>
                </li>
              </ul>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenRegister}
            className="w-full py-3.5 rounded-2xl border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            List Your Business Free
          </button>
        </div>

        {/* Tier 2: Gold Verified (Recommended) */}
        <div className="p-6 sm:p-7 rounded-3xl border-2 border-[#155DFC] bg-blue-50/40 dark:bg-blue-950/40 space-y-6 relative shadow-xl flex flex-col justify-between">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#155DFC] text-white text-[10px] font-black uppercase tracking-wider shadow-sm">
            Recommended for Credibility
          </div>

          <div className="space-y-4 pt-2">
            <div className="space-y-1">
              <span className="text-xs font-bold text-[#155DFC] dark:text-[#38BDF8] tracking-wider uppercase">GOLD VERIFIED</span>
              <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                GHS 100 <span className="text-xs font-normal text-slate-500">/ month</span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Identity & Location Verified Trust</p>
            </div>

            {/* Special 3+1 Offer */}
            <div className="p-3.5 rounded-2xl bg-blue-100/80 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/80 flex items-start gap-2.5">
              <Tag className="w-4 h-4 text-[#155DFC] dark:text-[#38BDF8] shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
                  <span>Special Offer: Pay 3, Get 1 Free</span>
                  <span className="px-1.5 py-0.2 rounded-md bg-[#155DFC] text-white text-[10px] font-black uppercase">Save GHS 100</span>
                </div>
                <p className="text-[11px] text-blue-800/90 dark:text-blue-300 leading-snug">
                  Pay for 3 months (GHS 300) and get the <strong>4th month 100% FREE</strong> + printable official QR window decal.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-blue-200 dark:border-blue-900/60">
              <ul className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
                <li className="flex items-center gap-2.5 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-[#155DFC] shrink-0" />
                  <span>Ghana Card Gold Verified Badge</span>
                </li>
                <li className="flex items-center gap-2.5 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-[#155DFC] shrink-0" />
                  <span>Priority placement in search rankings</span>
                </li>
                <li className="flex items-center gap-2.5 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-[#155DFC] shrink-0" />
                  <span>Physical GPS location certificate</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#155DFC] shrink-0" />
                  <span>Instant WhatsApp direct quote trigger</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#155DFC] shrink-0" />
                  <span>Downloadable QR Code Window Decal</span>
                </li>
              </ul>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenRegister}
            className="w-full py-3.5 rounded-2xl bg-[#155DFC] hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/30 cursor-pointer"
          >
            Upgrade to Gold Verified
          </button>
        </div>

        {/* Tier 3: Enterprise Elite */}
        <div className="p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-6 flex flex-col justify-between shadow-sm">
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-500 tracking-wider uppercase">ENTERPRISE ELITE</span>
              <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                GHS 350 <span className="text-xs font-normal text-slate-500">/ month</span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Maximum Market Dominance & Advertising</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-start gap-2.5">
              <Award className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-amber-900 dark:text-amber-200">
                  Full Digital Marketing Bundle
                </div>
                <p className="text-[11px] text-amber-800/90 dark:text-amber-300 leading-snug">
                  Managed directly by Tony&apos;s Digital Marketing Hub team with monthly performance reports.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <ul className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Everything in Gold Verified</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Top-row featured listing on Home page</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Featured spot in Business News sidebar</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Quarterly social media shoutout spotlight</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Dedicated account manager on WhatsApp</span>
                </li>
              </ul>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenRegister}
            className="w-full py-3.5 rounded-2xl border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            Apply for Enterprise
          </button>
        </div>

      </div>

      {/* Feature Comparison Matrix */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-[#155DFC]" />
          <span>Feature Matrix & Plan Comparison</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                <th className="py-3 pr-4 font-semibold">Capability</th>
                <th className="py-3 px-4 font-semibold text-center">Standard Free</th>
                <th className="py-3 px-4 font-semibold text-center text-[#155DFC]">Gold Verified</th>
                <th className="py-3 pl-4 font-semibold text-center text-amber-600">Enterprise Elite</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              <tr>
                <td className="py-3 pr-4 font-medium">Business Profile & Catalog</td>
                <td className="py-3 px-4 text-center">✓ Full</td>
                <td className="py-3 px-4 text-center font-bold text-[#155DFC]">✓ Full</td>
                <td className="py-3 pl-4 text-center font-bold text-amber-600">✓ Unlimited</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-medium">Ghana Card Verified Badge</td>
                <td className="py-3 px-4 text-center text-slate-400">—</td>
                <td className="py-3 px-4 text-center font-bold text-[#155DFC]">✓ Gold Badge</td>
                <td className="py-3 pl-4 text-center font-bold text-amber-600">✓ Elite Badge</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-medium">Search Priority Boost</td>
                <td className="py-3 px-4 text-center text-slate-400">Standard</td>
                <td className="py-3 px-4 text-center font-bold text-[#155DFC]">Top 3 Category</td>
                <td className="py-3 pl-4 text-center font-bold text-amber-600">#1 Featured Spot</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-medium">Printable QR Decal for Shop</td>
                <td className="py-3 px-4 text-center text-slate-400">—</td>
                <td className="py-3 px-4 text-center font-bold text-[#155DFC]">✓ High-Res PDF</td>
                <td className="py-3 pl-4 text-center font-bold text-amber-600">✓ Physical Decal Pack</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-medium">Dedicated Marketing Manager</td>
                <td className="py-3 px-4 text-center text-slate-400">—</td>
                <td className="py-3 px-4 text-center text-slate-400">—</td>
                <td className="py-3 pl-4 text-center font-bold text-amber-600">✓ Assigned Desk</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Enlistment FAQ */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-[#155DFC]" />
          <span>Enlistment & Pricing FAQ</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-750 space-y-1">
            <h4 className="font-bold text-slate-900 dark:text-white">Are there hidden fees?</h4>
            <p className="text-slate-600 dark:text-slate-300">
              None. Standard listing is free forever. Paid tiers are strictly optional and billed with zero automatic deductions.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-750 space-y-1">
            <h4 className="font-bold text-slate-900 dark:text-white">How do I pay for upgrades?</h4>
            <p className="text-slate-600 dark:text-slate-300">
              We accept MTN Mobile Money, Telecel Cash, AT Money, and Ghana Interbank instant transfer via Paystack or direct desk settlement.
            </p>
          </div>
        </div>
      </div>

    </main>
  );
};
