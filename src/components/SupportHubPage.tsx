import React, { useState } from 'react';
import { 
  ArrowLeft,
  Headphones,
  CheckCircle2,
  MessageSquare,
  Mail,
  Phone,
  Send,
  ArrowUpRight,
  ShieldCheck,
  Building2,
  MapPin,
  Clock,
  Sparkles,
  HelpCircle,
  ExternalLink,
  Zap,
  Check
} from 'lucide-react';
import { Logo } from './Logo';

interface SupportHubPageProps {
  onBackToHome: () => void;
  onOpenRegister: () => void;
  onShowToast?: (title: string, message?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const SupportHubPage: React.FC<SupportHubPageProps> = ({
  onBackToHome,
  onOpenRegister,
  onShowToast,
}) => {
  const [quickMsg, setQuickMsg] = useState('');
  const [inquiryType, setInquiryType] = useState<'general' | 'listing' | 'verification' | 'growth'>('general');
  const [senderName, setSenderName] = useState('');
  const [senderPhone, setSenderPhone] = useState('');

  const adminPhone = "0508203673";
  const adminWhatsAppGhana = "233508203673";
  const adminEmail = "tonysdigitalmarketing@gmail.com";

  const handleSendWhatsAppQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickMsg.trim()) return;

    let textPrefix = "Hello Tony's Support Hub on AuraCentra Ghana:\n";
    if (senderName.trim()) {
      textPrefix += `From: ${senderName.trim()}${senderPhone.trim() ? ` (${senderPhone.trim()})` : ''}\n`;
    }
    textPrefix += `Topic: ${inquiryType.toUpperCase()}\n\n`;

    const fullMsg = `${textPrefix}${quickMsg.trim()}`;
    const url = `https://wa.me/${adminWhatsAppGhana}?text=${encodeURIComponent(fullMsg)}`;
    
    if (onShowToast) {
      onShowToast("Opening WhatsApp Desk", "Connecting to Tony's Support Hub executive team...", "success");
    }
    
    window.open(url, '_blank', 'noopener,noreferrer');
    setQuickMsg('');
  };

  return (
    <main 
      className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 animate-in fade-in duration-200"
      id="auracentra-support-hub-page"
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
            Tony&apos;s Support Hub & Direct Assistance
          </span>
        </div>

        <button
          type="button"
          onClick={onBackToHome}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer shadow-2xs"
          id="support-back-home-btn"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Directory</span>
        </button>
      </div>

      {/* Main Support Showcase Header */}
      <div className="w-full rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-blue-50/80 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-850 border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-xs border border-slate-200/80 dark:border-slate-700 shrink-0 inline-flex">
              <Logo size="lg" showTagline={true} textColorMode="auto" showRuleLines={true} />
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  Tony&apos;s Support Hub
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold border border-emerald-200 dark:border-emerald-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Online • Direct Assistance
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-[11px] font-bold">
                  All 16 Regions
                </span>
              </div>

              <p className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 max-w-2xl leading-relaxed">
                Need help listing a business, verifying your Ghana Card, or accelerating digital growth? Connect directly with Tony&apos;s Business Hub team.
              </p>

              <div className="pt-1 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1 font-semibold text-[#155DFC] dark:text-[#38BDF8]">
                  <Building2 className="w-3.5 h-3.5" />
                  Official Management & Moderation Desk
                </span>
                <span className="hidden sm:inline text-slate-300 dark:text-slate-600">•</span>
                <span>Ho Commercial District & Greater Accra, Ghana</span>
              </div>
            </div>
          </div>

          <div className="shrink-0 flex sm:flex-col gap-2">
            <button
              type="button"
              onClick={onOpenRegister}
              className="px-5 py-3 rounded-2xl bg-[#155DFC] hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Enlist Your Business</span>
            </button>
            <a
              href={`https://wa.me/${adminWhatsAppGhana}?text=${encodeURIComponent("Hello Tony's Support Hub, I need quick assistance on AuraCentra.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Phone className="w-3.5 h-3.5 text-white" />
              <span>WhatsApp Helpline</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Grid: Direct Contact Center (Matching Image 1) + Assistance Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* Left Column: The Exact Direct Assistance Card from Image 1 (Expanded for Full Page) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-lg space-y-6">
            
            {/* Card Header matching Screenshot 1 */}
            <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-[#155DFC] border border-blue-400/30 flex items-center justify-center text-white shadow-md shadow-blue-500/25">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>Tony&apos;s Support Hub</span>
                  <CheckCircle2 className="w-4 h-4 text-[#155DFC] fill-blue-50 dark:fill-transparent" />
                </h2>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                  Online • Direct Assistance
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Need help listing a business, verifying your Ghana Card, or accelerating digital growth? Connect directly with Tony&apos;s Business Hub team.
            </p>

            {/* Direct Channel Buttons matching Screenshot 1 */}
            <div className="space-y-3">
              {/* Channel 1: Direct WhatsApp */}
              <a
                href={`https://wa.me/${adminWhatsAppGhana}?text=${encodeURIComponent("Hello Tony's Support Hub, I need direct assistance with AuraCentra.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-between p-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-semibold border border-emerald-600/40 shadow-sm transition-transform active:scale-[0.99] cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 shrink-0" />
                  <span>Direct WhatsApp ({adminPhone})</span>
                </div>
                <ArrowUpRight className="w-4 h-4 shrink-0" />
              </a>

              {/* Channel 2: Direct Email */}
              <a
                href={`mailto:${adminEmail}?subject=AuraCentra%20Support%20and%20Business%20Inquiry`}
                className="w-full inline-flex items-center justify-between p-4 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-900 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3 truncate">
                  <Mail className="w-5 h-5 text-slate-600 dark:text-slate-400 shrink-0" />
                  <span className="truncate">{adminEmail}</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-500 shrink-0 ml-2" />
              </a>

              {/* Channel 3: Direct Phone Call */}
              <a
                href={`tel:${adminPhone}`}
                className="w-full inline-flex items-center justify-between p-3.5 rounded-2xl bg-slate-100/90 dark:bg-slate-800/90 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-medium border border-slate-200/70 dark:border-slate-700/70 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-slate-600 dark:text-slate-400 shrink-0" />
                  <span>Call Helpline: {adminPhone}</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 shrink-0" />
              </a>
            </div>

            {/* Quick Message Box matching Screenshot 1 */}
            <form onSubmit={handleSendWhatsAppQuery} className="pt-2 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="font-bold text-slate-800 dark:text-slate-200">Send a Quick Message to Desk:</span>
                <span>Direct WhatsApp Route</span>
              </div>

              {/* Optional Name & Category for better context */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <input
                  type="text"
                  placeholder="Your Name (Optional)"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#155DFC]"
                />
                <select
                  value={inquiryType}
                  onChange={(e) => setInquiryType(e.target.value as any)}
                  className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#155DFC]"
                >
                  <option value="general">General Support</option>
                  <option value="listing">List / Edit Business</option>
                  <option value="verification">Ghana Card Verification</option>
                  <option value="growth">Digital Marketing & SEO</option>
                </select>
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Type a quick message..."
                  value={quickMsg}
                  onChange={(e) => setQuickMsg(e.target.value)}
                  className="w-full pl-3 pr-11 py-3 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#155DFC]"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-[#155DFC] hover:bg-blue-700 text-white transition-colors cursor-pointer"
                  title="Send on WhatsApp"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#155DFC]" />
                <span>Operating Hours: Mon - Sat 7:30 AM - 8:00 PM GMT</span>
              </span>
              <span>Fast Response (&lt; 15 mins)</span>
            </div>

          </div>
        </div>

        {/* Right Column: Support Topics, Office Presence & FAQs */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Support Modules Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-[#155DFC] dark:text-[#38BDF8] flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Ghana Card Verification
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Assistance with NIA document scanning, location verification, and earning the Gold Verified badge.
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Free Business Enlistment
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Step-by-step help creating your enterprise profile, uploading logos, catalog items, and contact channels.
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Digital Growth & SEO
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Boost your local search ranking, Google Maps setup, and high-conversion social marketing campaigns.
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
                <Headphones className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Scam & Fraud Reporting
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Strict Zero-Tolerance anti-fraud desk. Report impersonators, advance fee solicitations, or spam.
              </p>
            </div>

          </div>

          {/* Physical Presence & Regional Network */}
          <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#155DFC]" />
              <span>Head Office & Strategic Alliance Coordinates</span>
            </h3>
            <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1 leading-relaxed">
              <p><strong>Operated by:</strong> Tony&apos;s Digital Marketing & Business Hub</p>
              <p><strong>Locations:</strong> Ho Commercial District (Volta Region) & Greater Accra, Ghana</p>
              <p><strong>Coverage:</strong> All 16 Administrative Regions (Greater Accra, Ashanti, Western, Eastern, Central, Northern, Volta, etc.)</p>
              <p><strong>Official Email:</strong> {adminEmail}</p>
              <p><strong>Official Support Desk:</strong> +233 50 820 3673</p>
            </div>
          </div>

          {/* Common Support FAQs */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3.5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#155DFC]" />
              <span>Frequently Asked Support Questions</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                <div className="font-bold text-slate-900 dark:text-white">How fast are business listings reviewed?</div>
                <div className="text-slate-600 dark:text-slate-400 mt-1">
                  Our compliance desk reviews standard and verified submissions within 2 to 24 hours.
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                <div className="font-bold text-slate-900 dark:text-white">Is basic directory listing really free?</div>
                <div className="text-slate-600 dark:text-slate-400 mt-1">
                  Yes, standard listing is 100% free forever for all legitimate Ghanaian businesses.
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </main>
  );
};
