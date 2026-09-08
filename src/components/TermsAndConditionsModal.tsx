import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  Lock, 
  AlertTriangle, 
  MessageSquareX, 
  FileText, 
  Building2, 
  Scale, 
  Phone, 
  Mail, 
  ExternalLink 
} from 'lucide-react';
import { Logo } from './Logo';

interface TermsAndConditionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept?: () => void;
}

export const TermsAndConditionsModal: React.FC<TermsAndConditionsModalProps> = ({
  isOpen,
  onClose,
  onAccept,
}) => {
  const [activeSection, setActiveSection] = useState<string>('all');

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      id="terms-conditions-modal-backdrop"
    >
      <div 
        className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-4 sm:my-8 flex flex-col max-h-[90vh]"
        id="terms-conditions-modal"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold tracking-tight text-white">
                  Terms of Service & Trust Standards
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                  Verified Trust
                </span>
              </div>
              <p className="text-xs text-slate-400">
                AuraCentra Ghana • Anti-Scam, Fair Marketplace & Privacy Policy (Rev. September 2026)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close terms modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Highlights Strip */}
        <div className="bg-slate-50 dark:bg-slate-850 px-5 py-3 border-b border-slate-200 dark:border-slate-800 text-xs flex flex-wrap items-center justify-between gap-3 text-slate-600 dark:text-slate-300 shrink-0">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
            <span className="font-semibold text-slate-900 dark:text-white">Strict Anti-Scam Mandate:</span>
            <span>Zero tolerance for fraud, advance-fee schemes, or spam.</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
            <span>Act 843 Compliant</span>
            <span>•</span>
            <span>All 16 Regions of Ghana</span>
          </div>
        </div>

        {/* Scrollable Terms Content */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
          
          {/* Section 1 */}
          <section className="space-y-2.5">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm sm:text-base">
              <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <h3>1. Platform Purpose & Strategic Alliance</h3>
            </div>
            <p>
              <strong>AuraCentra</strong> is Ghana’s dedicated business directory and market discovery platform. Our primary mission is to bridge the trust deficit in the Ghanaian commercial ecosystem by facilitating transparent connections between authentic consumers and vetted Ghanaian businesses across all 16 regions.
            </p>
            <p>
              The platform is operated in strategic technology and digital marketing alliance with <strong>Tony&apos;s Digital Marketing & Business Hub</strong> (Ho Commercial District, Volta Region & Greater Accra, Ghana). By creating an account or enlisting a business, you agree to uphold our community standards of authenticity, professional courtesy, and honest commerce.
            </p>
          </section>

          {/* Section 2: Strict Anti-Scam & Fraud */}
          <section className="p-4 sm:p-5 rounded-2xl bg-red-50/70 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 space-y-3">
            <div className="flex items-center gap-2 text-red-900 dark:text-red-300 font-bold text-sm sm:text-base">
              <ShieldAlert className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />
              <h3>2. Zero-Tolerance Anti-Scam & Anti-Fraud Policy</h3>
            </div>
            <p className="text-red-800 dark:text-red-200">
              AuraCentra operates under an uncompromising anti-fraud regime. We strictly prohibit any activity designed to deceive, extort, or misrepresent products or services to members of the public.
            </p>
            <ul className="space-y-1.5 text-xs sm:text-sm list-disc pl-5 text-red-900/90 dark:text-red-200/90">
              <li><strong>No Advance-Fee or Delivery Scams:</strong> Soliciting unverified upfront payments for goods not possessed or services not rendered is grounds for immediate termination.</li>
              <li><strong>No Impersonation or Ghost Entities:</strong> Registering under corporate names, government agencies, or trademarked brands without legal authority is strictly banned.</li>
              <li><strong>No Counterfeit or Illegal Commodities:</strong> Unlicensed pharmaceutical products, counterfeit electronics, unregulated financial investments, or contraband are strictly forbidden.</li>
              <li><strong>Legal Referral:</strong> Any fraudulent activity detected or reported will be documented and forwarded directly to the <strong>Cyber Security Authority (CSA)</strong> and the <strong>Ghana Police Service (CID)</strong>.</li>
            </ul>
          </section>

          {/* Section 3: Anti-Spam & Contact Etiquette */}
          <section className="space-y-2.5">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm sm:text-base">
              <MessageSquareX className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <h3>3. Anti-Spam & Communication Protocol</h3>
            </div>
            <p>
              AuraCentra integrates direct communication channels including WhatsApp quotes, direct messaging, and verified telephone lines to facilitate legitimate transactions.
            </p>
            <ul className="space-y-1.5 list-disc pl-5">
              <li><strong>Prohibition of Unsolicited Bulk Messaging:</strong> Scraping telephone numbers or emails from business profiles for automated marketing, spam blasts, unsolicited robo-calls, or chain messaging is strictly forbidden.</li>
              <li><strong>Respectful Interaction:</strong> Inquiries submitted through our platform must pertain directly to the listed enterprise&apos;s trade, catalog, or quoted services.</li>
              <li><strong>Commercial Solicitation:</strong> Business owners may not use customer inquiry details for unrelated advertising without explicit customer consent.</li>
            </ul>
          </section>

          {/* Section 4: Ghana Card & Verification Integrity */}
          <section className="space-y-2.5">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm sm:text-base">
              <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <h3>4. Ghana Card & Enterprise Verification Integrity</h3>
            </div>
            <p>
              Businesses applying for the <strong>Ghana Card Gold Verified</strong> badge or official AuraCentra verification agree to provide truthful, unmanipulated government documentation (Ghana Card, Registrar General / ORC registration, and valid GhanaPost Digital GPS Address).
            </p>
            <p>
              Falsifying identity records, using synthetic identities, or submitting forged documentation constitutes a criminal offense under Ghanaian law and will result in immediate permanent expulsion and public blacklisting on AuraCentra.
            </p>
          </section>

          {/* Section 5: Truth in Advertising & Honest Reviews */}
          <section className="space-y-2.5">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm sm:text-base">
              <Scale className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
              <h3>5. Truth in Advertising & Community Reviews</h3>
            </div>
            <p>
              <strong>Accurate Information:</strong> Listed businesses must maintain accurate opening hours, truthful price categories, real physical locations, and authentic photographs of their operations.
            </p>
            <p>
              <strong>Review Authenticity:</strong> Customer reviews must reflect authentic, firsthand consumer experiences. Astroturfing, posting self-reviews, paying third parties for positive feedback, or weaponizing negative reviews against competitors will result in forfeiture of reviews and possible profile delisting.
            </p>
          </section>

          {/* Section 6: Consumer Protection Guidelines */}
          <section className="space-y-2.5">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm sm:text-base">
              <ShieldCheck className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
              <h3>6. Safe Commerce Recommendations for Consumers</h3>
            </div>
            <p>
              While AuraCentra audits credentials and verifies physical locations, buyers are encouraged to exercise reasonable commercial due diligence:
            </p>
            <ul className="space-y-1.5 list-disc pl-5">
              <li>Inspect goods and services prior to final cash or Mobile Money transfers when possible.</li>
              <li>Always verify that the contact number matches the verified business line displayed on the official AuraCentra profile.</li>
              <li>Report suspicious behavior immediately using the built-in <strong>&quot;Report Business&quot;</strong> button located on each listing page.</li>
            </ul>
          </section>

          {/* Section 7: Data Protection & Privacy */}
          <section className="space-y-2.5">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm sm:text-base">
              <Lock className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <h3>7. Privacy & Ghana Data Protection Act (Act 843) Compliance</h3>
            </div>
            <p>
              We treat your personal and enterprise data with the utmost confidentiality. In compliance with the <strong>Data Protection Act, 2012 (Act 843) of the Republic of Ghana</strong>:
            </p>
            <ul className="space-y-1.5 list-disc pl-5">
              <li>We collect only necessary information needed to operate directory profiles, secure accounts, and protect community safety.</li>
              <li>National ID documents submitted for verification are securely audited by authorized compliance officers and are never made publicly downloadable or indexed.</li>
              <li>AuraCentra does <strong>not</strong> sell user email addresses, telephone numbers, or behavioral data to third-party ad brokers or marketing syndicates.</li>
            </ul>
          </section>

          {/* Section 8: Account Security & Suspension */}
          <section className="space-y-2.5">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm sm:text-base">
              <FileText className="w-4 h-4 text-slate-600 dark:text-slate-400 shrink-0" />
              <h3>8. Account Governance & Modifications</h3>
            </div>
            <p>
              Users are responsible for safeguarding their login credentials. AuraCentra reserves the right to suspend or remove any profile, listing, or account that contravenes these terms or impairs the trust of the community. We may update these terms periodically to reflect legislative updates or new safety mechanisms; continued use of AuraCentra constitutes acceptance of any revised terms.
            </p>
          </section>

          {/* Contact / Helpdesk box */}
          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div>
              <div className="font-bold text-slate-900 dark:text-white">Questions or Compliance Reporting?</div>
              <div className="text-slate-500 dark:text-slate-400">Contact the AuraCentra Trust & Verification Office</div>
            </div>
            <div className="flex items-center gap-3">
              <a 
                href="mailto:tonysdigitalmarketing@gmail.com"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-semibold hover:bg-slate-50"
              >
                <Mail className="w-3.5 h-3.5 text-blue-600" />
                <span>tonysdigitalmarketing@gmail.com</span>
              </a>
              <a 
                href="https://wa.me/233508203673"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>+233 50 820 3673</span>
              </a>
            </div>
          </div>

        </div>

        {/* Footer actions */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500 dark:text-slate-400 text-center sm:text-left">
            By creating an account, you affirm that you have read and agree to uphold these standards.
          </div>
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-colors cursor-pointer"
            >
              Close
            </button>
            {onAccept && (
              <button
                type="button"
                onClick={() => {
                  onAccept();
                  onClose();
                }}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>I Understand & Accept</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
