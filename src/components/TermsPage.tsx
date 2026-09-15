import React from 'react';
import { 
  ArrowLeft,
  ShieldCheck, 
  ShieldAlert, 
  MessageSquareX, 
  Building2, 
  Scale, 
  Phone, 
  Mail
} from 'lucide-react';

interface TermsPageProps {
  onBackToHome: () => void;
  onOpenRegister?: () => void;
  onShowToast?: (title: string, message?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({
  onBackToHome,
}) => {

  return (
    <main 
      className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8 animate-in fade-in duration-200"
      id="auracentra-terms-page"
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
            Terms of Service & Trust Standards
          </span>
        </div>

        <button
          type="button"
          onClick={onBackToHome}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer shadow-2xs"
          id="terms-back-home-btn"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Directory</span>
        </button>
      </div>

      {/* Hero Header matching Screenshot */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 shadow-xs">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-lg sm:text-2xl font-black tracking-tight text-white">
                  Terms of Service & Trust Standards
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-bold border border-emerald-500/30">
                  Verified Trust
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400">
                AuraCentra Ghana • Anti-Scam, Fair Marketplace & Privacy Policy (Rev. September 2026)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Highlights Strip */}
      <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs flex flex-wrap items-center justify-between gap-3 text-slate-700 dark:text-slate-300">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span className="font-bold text-slate-900 dark:text-white">Strict Anti-Scam Mandate:</span>
          <span>Zero tolerance for fraud, advance-fee schemes, or spam.</span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-slate-600 dark:text-slate-400">
          <span className="font-semibold text-blue-600 dark:text-cyan-400">Act 843 Compliant</span>
          <span>•</span>
          <span>All 16 Regions of Ghana</span>
        </div>
      </div>

      {/* Full Terms Content lying directly on the page background */}
      <div className="space-y-8 text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed pt-2">
        
        {/* Section 1 matching Screenshot */}
        <section className="space-y-3">
          <div className="flex items-center gap-2.5 text-slate-900 dark:text-white font-bold text-base sm:text-lg">
            <Building2 className="w-5 h-5 text-[#155DFC] dark:text-[#38BDF8] shrink-0" />
            <h2>1. Platform Purpose & Strategic Alliance</h2>
          </div>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            <strong>AuraCentra</strong> is Ghana’s dedicated business directory and market discovery platform. Our primary mission is to bridge the trust deficit in the Ghanaian commercial ecosystem by facilitating transparent connections between authentic consumers and vetted Ghanaian businesses across all 16 regions.
          </p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            The platform is operated in strategic technology and digital marketing alliance with <strong>Tony&apos;s Digital Marketing & Business Hub</strong> (Ho Commercial District, Volta Region & Greater Accra, Ghana). By creating an account or enlisting a business, you agree to uphold our community standards of authenticity, professional courtesy, and honest commerce.
          </p>
        </section>

        {/* Section 2: Zero-Tolerance Anti-Scam Policy */}
        <section className="p-5 sm:p-6 rounded-3xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 space-y-3.5">
          <div className="flex items-center gap-2.5 text-rose-900 dark:text-rose-200 font-bold text-base sm:text-lg">
            <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
            <h2>2. Zero-Tolerance Anti-Scam & Anti-Fraud Policy</h2>
          </div>
          <p className="text-rose-900/90 dark:text-rose-200/90 leading-relaxed">
            AuraCentra operates under an uncompromising anti-fraud regime. We strictly prohibit any activity designed to deceive, extort, or misrepresent products or services to members of the public:
          </p>
          <ul className="space-y-2 text-xs sm:text-sm list-disc pl-5 text-rose-900 dark:text-rose-200">
            <li><strong>No Advance-Fee or Delivery Scams:</strong> Soliciting unverified upfront payments for goods not possessed or services not rendered is grounds for immediate termination and permanent blacklisting.</li>
            <li><strong>No Impersonation or Ghost Entities:</strong> Registering under corporate names, government agencies, or trademarked brands without legal authority is strictly banned.</li>
            <li><strong>No Counterfeit or Illegal Commodities:</strong> Unlicensed pharmaceutical products, counterfeit electronics, unregulated financial investments, or contraband are strictly forbidden.</li>
            <li><strong>Legal Referral:</strong> Any fraudulent activity detected or reported will be documented and forwarded directly to the <strong>Cyber Security Authority (CSA)</strong> and the <strong>Ghana Police Service (CID)</strong>.</li>
          </ul>
        </section>

        {/* Section 3: Anti-Spam & Communication Protocol */}
        <section className="space-y-3">
          <div className="flex items-center gap-2.5 text-slate-900 dark:text-white font-bold text-base sm:text-lg">
            <MessageSquareX className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <h2>3. Anti-Spam & Communication Protocol</h2>
          </div>
          <p>
            AuraCentra integrates direct communication channels including WhatsApp quotes, direct messaging, and verified telephone lines to facilitate legitimate transactions:
          </p>
          <ul className="space-y-2 list-disc pl-5">
            <li><strong>Prohibition of Unsolicited Bulk Messaging:</strong> Scraping telephone numbers or emails from business profiles for automated marketing, spam blasts, unsolicited robo-calls, or chain messaging is strictly forbidden.</li>
            <li><strong>Respectful Interaction:</strong> Inquiries submitted through our platform must pertain directly to the listed enterprise&apos;s trade, catalog, or quoted services.</li>
            <li><strong>Commercial Solicitation:</strong> Business owners may not use customer inquiry details for unrelated advertising without explicit customer consent.</li>
          </ul>
        </section>

        {/* Section 4: Ghana Card & Verification Integrity */}
        <section className="space-y-3">
          <div className="flex items-center gap-2.5 text-slate-900 dark:text-white font-bold text-base sm:text-lg">
            <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
            <h2>4. Ghana Card & Verification Integrity</h2>
          </div>
          <p>
            Businesses applying for the <strong>Gold Verified</strong> badge must supply authentic Ghana Card (National Identification Authority - NIA) documentation and confirm their physical GPS address.
          </p>
          <ul className="space-y-2 list-disc pl-5">
            <li>Submitting forged or third-party national identity cards will lead to immediate account freezing.</li>
            <li>All verified data is handled under strict encryption in conformity with the <strong>Ghana Data Protection Act (Act 843)</strong>.</li>
            <li>AuraCentra never sells, rents, or makes unredacted Ghana Card serial numbers accessible to any public party.</li>
          </ul>
        </section>

        {/* Section 5: Transparent Pricing & Enlistment */}
        <section className="space-y-3">
          <div className="flex items-center gap-2.5 text-slate-900 dark:text-white font-bold text-base sm:text-lg">
            <Scale className="w-5 h-5 text-[#155DFC] dark:text-[#38BDF8] shrink-0" />
            <h2>5. Transparent Pricing, Enlistment & Refunds</h2>
          </div>
          <p>
            Basic business directory listing on AuraCentra is permanently free of charge. Optional premium upgrades (Gold Verified, Priority Search Placement, Enterprise Elite) are clearly displayed with transparent fees in Ghana Cedis (GHS). Fees are paid strictly for verification review, identity badges, and high-visibility indexing.
          </p>
        </section>

        {/* Section 6: Governance & Contact Desk */}
        <section className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#155DFC]" />
            <span>Compliance & Legal Inquiry Desk</span>
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Questions regarding these Terms or reporting violations should be addressed to Tony&apos;s Support Hub:
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
            <a href="mailto:tonysdigitalmarketing@gmail.com" className="text-[#155DFC] hover:underline flex items-center gap-1">
              <Mail className="w-3.5 h-3.5" />
              <span>tonysdigitalmarketing@gmail.com</span>
            </a>
            <a href="https://wa.me/233508203673" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline flex items-center gap-1">
              <Phone className="w-3.5 h-3.5" />
              <span>WhatsApp Desk: +233 50 820 3673</span>
            </a>
          </div>
        </section>

      </div>
    </main>
  );
};
