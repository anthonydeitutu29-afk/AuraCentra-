import React, { useState } from 'react';
import { 
  Check, 
  ShieldCheck, 
  Zap, 
  Sparkles, 
  HelpCircle, 
  ChevronDown, 
  CreditCard, 
  Smartphone, 
  Building2,
  PhoneCall
} from 'lucide-react';

interface PricingViewProps {
  onEnlist: () => void;
}

export const PricingView: React.FC<PricingViewProps> = ({ onEnlist }) => {
  const [billingCycle, setBillingCycle] = useState<'yearly' | 'monthly'>('yearly');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: 'Can I pay for my listing with Mobile Money (MTN MoMo or Telecel Cash)?',
      a: 'Yes, absolutely. We support seamless Ghanaian local payments via MTN MoMo, Telecel Cash, AT Money, alongside Visa, Mastercard, and direct bank invoices for corporate accounts.'
    },
    {
      q: 'How long does Ghana Card verification vetting take?',
      a: 'Once you submit your business details and Ghana Card PIN (NIA), our local verification compliance team validates the enterprise credentials within 24 to 48 business hours.'
    },
    {
      q: 'What is the advantage of the Verified Checkmark on AuraCentra?',
      a: 'Verified enterprises receive up to 5x more customer phone calls and WhatsApp inquiries. Listings with the verified checkmark appear at the top of regional search results and build immediate trust with both local and diaspora clients.'
    },
    {
      q: 'Can I enlist multiple branches or retail outlets across different regions?',
      a: 'Yes! The Corporate & Multi-Branch plan allows unlimited geographic branch locations, allowing customers in Kumasi, Takoradi, Tamale, and Accra to reach their nearest store directly.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12 transition-colors">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold mb-3 border border-blue-200/60 dark:border-blue-800">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Fair & Transparent Ghanaian Enterprise Plans</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Pricing Built for Ghana's Economy
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
          Enlist your business for free today, or upgrade to Verified Pro for Ghana Card accreditation, search dominance, and direct WhatsApp buyer leads.
        </p>

        {/* Billing cycle toggle */}
        <div className="mt-6 inline-flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              billingCycle === 'yearly'
                ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Annual Billing (Save 25%)
          </button>
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              billingCycle === 'monthly'
                ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Monthly Billing
          </button>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto items-stretch">
        
        {/* Tier 1: Standard Free */}
        <div className="bg-white dark:bg-slate-800/90 rounded-3xl border border-slate-200/90 dark:border-slate-700 p-6 sm:p-7 flex flex-col justify-between shadow-xs hover:border-slate-300 dark:hover:border-slate-600 transition-all">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Standard</span>
              <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-md">
                Starter
              </span>
            </div>
            
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">GH₵ 0</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">/ forever free</span>
            </div>
            
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Essential digital footprint for budding artisans, freelance technicians, and local shops.
            </p>

            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-700">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-3">
                Features included:
              </span>
              <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Public directory entry</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Direct phone & WhatsApp call links</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Regional & category search listing</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Standard search appearance</span>
                </li>
              </ul>
            </div>
          </div>

          <button
            onClick={onEnlist}
            className="mt-8 w-full py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Enlist For Free
          </button>
        </div>

        {/* Tier 2: Verified Pro (Featured) */}
        <div className="bg-gradient-to-b from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-xl relative scale-102 border-2 border-blue-400">
          <div className="absolute -top-3.5 right-6 bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 text-[10px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md">
            Most Popular
          </div>
          
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-300">Verified Pro</span>
              <span className="text-[10px] font-bold bg-blue-500/20 text-blue-200 border border-blue-400/30 px-2 py-0.5 rounded-md">
                Accredited
              </span>
            </div>

            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-3xl sm:text-4xl font-black text-white">
                {billingCycle === 'yearly' ? 'GH₵ 120' : 'GH₵ 15'}
              </span>
              <span className="text-xs text-blue-200">
                {billingCycle === 'yearly' ? '/ year' : '/ month'}
              </span>
            </div>

            <p className="mt-2 text-xs text-blue-200 leading-relaxed">
              Full Ghana Card identity vetting, official verified checkmark, and top priority in search.
            </p>

            <div className="mt-6 pt-6 border-t border-blue-800/80">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-300 block mb-3">
                Everything in Standard, plus:
              </span>
              <ul className="space-y-3 text-xs text-blue-100">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="font-semibold text-white">Official AuraCentra Verified Checkmark</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Ghana Card & GRA TIN credential badges</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Rank above unverified listings in searches</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Up to 5x higher customer WhatsApp inquiries</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Direct phone support via Tony's Hub desk</span>
                </li>
              </ul>
            </div>
          </div>

          <button
            onClick={onEnlist}
            className="mt-8 w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-xs font-bold text-white shadow-md shadow-blue-500/30 transition-all cursor-pointer"
          >
            Get Verified Pro
          </button>
        </div>

        {/* Tier 3: Corporate & Multi-Branch */}
        <div className="bg-white dark:bg-slate-800/90 rounded-3xl border border-slate-200/90 dark:border-slate-700 p-6 sm:p-7 flex flex-col justify-between shadow-xs hover:border-slate-300 dark:hover:border-slate-600 transition-all">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Enterprise</span>
              <span className="text-[10px] font-bold bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800">
                Custom
              </span>
            </div>

            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">GH₵ 350</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">/ annual</span>
            </div>

            <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Designed for companies, multi-branch franchises, and registered manufacturing brands.
            </p>

            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-700">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-3">
                Everything in Pro, plus:
              </span>
              <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Unlimited branches across Ghana</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Dedicated corporate landing page link</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Featured spot in Business News & FX</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Dedicated account manager at Tony's Hub</span>
                </li>
              </ul>
            </div>
          </div>

          <button
            onClick={onEnlist}
            className="mt-8 w-full py-3 px-4 rounded-xl border border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-xs font-bold transition-colors cursor-pointer"
          >
            Contact Enterprise Sales
          </button>
        </div>

      </div>

      {/* Payment methods banner */}
      <div className="max-w-4xl mx-auto p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Accepted Ghanaian Payment Channels</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Instant activation with MoMo or corporate bank transfer</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-bold">
          <span className="px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-200">MTN MoMo</span>
          <span className="px-2.5 py-1 rounded-lg bg-red-100 dark:bg-red-900/40 text-red-900 dark:text-red-200">Telecel Cash</span>
          <span className="px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-900 dark:text-blue-200">AT Money</span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200">Visa / Mastercard</span>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="max-w-3xl mx-auto pt-4 space-y-4">
        <div className="text-center mb-6">
          <h3 className="text-xl font-black text-slate-900 dark:text-white">Frequently Asked Questions</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Everything you need to know about enlisting on AuraCentra</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div 
              key={i}
              className="bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 rounded-2xl overflow-hidden transition-all shadow-2xs"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full p-4 text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === i ? 'rotate-180 text-blue-600' : ''}`} />
              </button>
              {openFaq === i && (
                <div className="px-4 pb-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-700 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
