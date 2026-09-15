import React from 'react';
import { 
  ArrowLeft,
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  Lock, 
  Building2, 
  FileCheck, 
  MapPin, 
  Sparkles, 
  Phone, 
  ArrowRight,
  Zap,
  HelpCircle
} from 'lucide-react';
import { Logo } from './Logo';

interface VerificationPageProps {
  onBackToHome: () => void;
  onOpenRegister: () => void;
  onShowToast?: (title: string, message?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const VerificationPage: React.FC<VerificationPageProps> = ({
  onBackToHome,
  onOpenRegister,
  onShowToast,
}) => {
  return (
    <main 
      className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 animate-in fade-in duration-200"
      id="auracentra-verification-page"
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
            Ghana Card Verification & Trust Protocol
          </span>
        </div>

        <button
          type="button"
          onClick={onBackToHome}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer shadow-2xs"
          id="verification-back-home-btn"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Directory</span>
        </button>
      </div>

      {/* Hero Header */}
      <div className="w-full rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-emerald-50/80 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/20 border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <div className="p-3.5 bg-emerald-600 text-white rounded-2xl shadow-md shrink-0 inline-flex items-center justify-center">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
                  National Identity Auditing
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-bold">
                  Act 843 Encrypted
                </span>
              </div>
              <h1 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Ghana Card Verification & Integrity Protocol
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                Empowering legitimate Ghanaian businesses with official Gold Verification. We combine National Identification Authority (NIA) credential vetting with GPS physical shop validation to eliminate marketplace fraud.
              </p>
            </div>
          </div>

          <div className="shrink-0 flex sm:flex-col gap-2.5">
            <button
              type="button"
              onClick={onOpenRegister}
              className="px-5 py-3 rounded-2xl bg-[#155DFC] hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Apply for Gold Badge</span>
            </button>
            <a
              href="https://wa.me/233508203673"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verification Desk</span>
            </a>
          </div>
        </div>
      </div>

      {/* Why Verification Matters Section */}
      <div className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Why Verification Matters in Ghana&apos;s Commercial Ecosystem
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
            Online scams, social media impersonation, and untrusted intermediaries hurt both consumers and legitimate Ghanaian business owners. AuraCentra&apos;s Gold Verification audits national identity credentials alongside physical location coordinates before awarding the official Gold badge.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">Scam Immunity</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Vetting identity through Ghana Card credentials eliminates fly-by-night operators and ghost sellers, ensuring genuine customer peace of mind.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-[#155DFC] dark:text-[#38BDF8] flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">3x Lead Conversion</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Consumers prefer contacting Gold Verified sellers via WhatsApp and direct calls because their physical presence and legitimacy are verified.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-400 flex items-center justify-center font-bold">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">Act 843 Encrypted</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              All identity documents are encrypted under the Ghana Data Protection Act (Act 843). Identification serial numbers are never shared or made public.
            </p>
          </div>
        </div>
      </div>

      {/* 3-Step Rigorous Protocol */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white space-y-6">
        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
            Step-by-Step Protocol
          </span>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            The 3-Step Rigorous Verification Workflow
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
            Our compliance desk audits submissions within 24 to 48 hours to ensure zero fake or ghost listings on AuraCentra.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-black text-sm flex items-center justify-center">
                1
              </span>
              <Building2 className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="font-bold text-white text-sm sm:text-base">Profile & GhanaPost GPS</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Submit your enterprise profile, official business contact numbers, and valid GhanaPost digital GPS address (e.g. GA-183-9024).
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-full bg-emerald-600 text-white font-black text-sm flex items-center justify-center">
                2
              </span>
              <FileCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="font-bold text-white text-sm sm:text-base">Ghana Card Submission</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Provide your official National Identification Authority (NIA) Ghana Card credentials and optional Registrar General (ORC) certificates.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-full bg-purple-600 text-white font-black text-sm flex items-center justify-center">
                3
              </span>
              <ShieldCheck className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="font-bold text-white text-sm sm:text-base">Audit & Badge Activation</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Our vetting team cross-checks credentials, publishes the Gold Verified Shield badge on your profile, and unlocks direct WhatsApp buyer inquiries.
            </p>
          </div>
        </div>
      </div>

      {/* Gold Badge Benefits Checklist */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
              Privileges Unlocked with Gold Verification
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Verified enterprises outperform unvetted listings across discovery, click-through rates, and consumer trust.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenRegister}
            className="px-5 py-2.5 rounded-xl bg-[#155DFC] hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
          >
            <span>Start Verification (GHS 50)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
          {[
            'Official Gold Verified Shield Badge on Profile',
            'Priority Placement in Sector & Regional Search',
            'Direct One-Click WhatsApp Quote Integration',
            'Verified GhanaPost GPS Physical Map Pin',
            'Inclusion in AuraCentra Verified Business Directory',
            'Downloadable High-Res QR Code Storefront Plaque',
            'Zero Advance-Fee Fraud Protection Guarantee',
            'Dedicated WhatsApp Support Desk Assistance',
            'Eligible for Tony\'s Hub Digital Marketing Campaigns'
          ].map((benefit, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span className="font-medium">{benefit}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-[#155DFC]" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Frequently Asked Questions About Verification
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
              How much is the Ghana Card verification fee?
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Ghana Card verification has a one-time vetting audit fee of <strong>GHS 50</strong>. This fee supports manual identity auditing, physical GPS address checks, and Gold badge issuance.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
              Is my Ghana Card information safe and private?
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Yes. AuraCentra operates strictly under the <strong>Ghana Data Protection Act (Act 843)</strong>. Your identification numbers are fully encrypted and never sold, leased, or visible to the public.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
              How long does verification take?
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Standard auditing takes <strong>24 to 48 hours</strong>. You receive an instant confirmation on WhatsApp as soon as your Gold badge is activated.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
              Can I list without Ghana Card verification?
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Yes, basic listing on AuraCentra is permanently free. However, unverified listings display an &quot;Unverified&quot; label and do not receive the Gold badge or top-tier search priority.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};
