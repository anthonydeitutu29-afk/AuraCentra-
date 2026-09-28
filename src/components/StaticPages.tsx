import React from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  HeartHandshake, 
  HelpCircle, 
  FileText, 
  Sparkles,
  Building2,
  CheckCircle2,
  ExternalLink,
  Award
} from 'lucide-react';

interface StaticPagesProps {
  tab: 'about' | 'support' | 'terms';
}

export const StaticPages: React.FC<StaticPagesProps> = ({ tab }) => {
  // ==========================================
  // ABOUT AURACENTRA (Laying directly on background)
  // ==========================================
  if (tab === 'about') {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-10 transition-colors">
        
        {/* Page Tag & Main Title */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Digital Business Discovery & Promotion</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            About AuraCentra
          </h1>
        </div>

        {/* Narrative Paragraphs laying directly on background */}
        <div className="space-y-5 text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
          <p>
            AuraCentra is a digital business discovery and promotion platform created to make it easier for people to discover trusted businesses, service providers, products, and opportunities across Ghana. The platform connects customers with businesses in their communities and beyond, while giving businesses a simple and accessible way to increase their visibility, reach new customers, and grow.
          </p>

          <p>
            AuraCentra operates under its core agency, <strong className="text-slate-900 dark:text-white font-bold">Tony’s Digital Marketing and Business Hub</strong>, a Ghanaian digital solutions and business development agency focused on technology, digital marketing, business management, creative solutions, and other technology-driven services.
          </p>

          <p>
            The vision behind AuraCentra is to build a trusted digital business ecosystem for Ghana—one where businesses can be discovered more easily, customers can find reliable services, and local entrepreneurs have greater opportunities to grow through digital visibility.
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-200/80 dark:border-slate-800" />

        {/* Leadership Section without image */}
        <div className="space-y-6 text-left">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Founding & Governance
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
              Our Leadership
            </h2>
          </div>

          <div className="space-y-3.5 max-w-2xl">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Anthony Dei-Tutu
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400">
                CEO & Founder • Tony’s Digital Marketing and Business Hub
              </p>
            </div>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              AuraCentra was founded under the leadership of Anthony Dei-Tutu, CEO of Tony’s Digital Marketing and Business Hub. His vision is to use technology and digital solutions to create practical opportunities for businesses, entrepreneurs, and customers while contributing to the growth of Ghana’s digital economy.
            </p>

            {/* Tagline Badge */}
            <div className="pt-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-black text-xs tracking-wide">
                <Award className="w-4 h-4 text-amber-500" />
                <span>AuraCentra — Connect. Discover. Grow.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ecosystem Pillars laying on background */}
        <div className="border-t border-slate-200/80 dark:border-slate-800 pt-8 space-y-6">
          <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            Key Pillars of the AuraCentra Ecosystem
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            <div className="space-y-1.5">
              <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm">
                01
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-base">Connect</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Direct phone and WhatsApp links connect buyers directly with verified vendors with zero middleman commissions.
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm">
                02
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-base">Discover</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Search verified services and craftspeople across all 16 Ghanaian regions with precise GPS addresses.
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-sm">
                03
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-base">Grow</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Empowering Ghanaian micro and medium enterprises through permanent search indexing and digital exposure.
              </p>
            </div>
          </div>
        </div>

        {/* Footer info laying on background */}
        <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
          <p>© 2026 AuraCentra • An initiative of Tony’s Digital Marketing and Business Hub</p>
        </div>

      </div>
    );
  }

  // ==========================================
  // SUPPORT HUB (Laying directly on background)
  // ==========================================
  if (tab === 'support') {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8 transition-colors">
        
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
            Tony's Support & Help Hub
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
            How can we help your business today?
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Our verification and directory assistance team at Tony’s Digital Marketing and Business Hub is ready to assist you with listings, Ghana Card badge approvals, and technical support.
          </p>
        </div>

        {/* Contact Channels laying on background */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
          
          <div className="space-y-2 text-left">
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Email Desk</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">tonysdigitalmarketing@gmail.com</p>
            <p className="text-[11px] font-semibold text-teal-600 dark:text-teal-400">Average response: 4 hours</p>
          </div>

          <div className="space-y-2 text-left">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Phone & WhatsApp</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">+233 (0) 55 000 0000</p>
            <p className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">Mon - Sat: 8:00 AM - 6:00 PM GMT</p>
          </div>

          <div className="space-y-2 text-left">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Agency Headquarters</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">Tony’s Digital Marketing & Business Hub</p>
            <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">Greater Accra, Ghana</p>
          </div>

        </div>

        {/* Frequently Asked Inquiries laying on background */}
        <div className="border-t border-slate-200/80 dark:border-slate-800 pt-8 space-y-4">
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4 text-left">
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                How long does business verification take?
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                Verification requests submitted with valid Ghana Card details and physical GPS locations are typically reviewed within 24 to 48 business hours.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                Is enlisting my business on AuraCentra free?
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                Yes, our Standard Free Listing plan gives every genuine Ghanaian enterprise full visibility in regional search directories and direct customer contact.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                How do customers contact my business?
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                Directly via your verified telephone numbers and WhatsApp instant messaging without any intermediary commissions.
              </p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
          <p>© 2026 AuraCentra • Tony’s Digital Marketing and Business Hub</p>
        </div>

      </div>
    );
  }

  // ==========================================
  // TERMS & TRUST POLICY (Laying directly on background)
  // ==========================================
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8 transition-colors">
      
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
          Governance & Standards
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
          Terms of Service & Trust Standards
        </h1>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Operated by Tony’s Digital Marketing and Business Hub • Last updated September 2026
        </p>
      </div>

      {/* Information laying directly on background */}
      <div className="space-y-6 text-left text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        
        <div className="space-y-2">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            1. Authenticity and Listing Accuracy
          </h3>
          <p className="text-xs sm:text-sm">
            By enlisting an enterprise on AuraCentra, the registrant warrants that all business descriptions, contact phone numbers, and physical addresses correspond to genuine commercial or professional operations within Ghana.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            2. Ghana Card Verification Standards
          </h3>
          <p className="text-xs sm:text-sm">
            Identity information submitted for the verified checkmark is processed in compliance with the Data Protection Act of Ghana. National identity codes are used strictly for legitimacy auditing to protect buyers and sellers alike.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            3. Zero Tolerance for Fraudulent Trade
          </h3>
          <p className="text-xs sm:text-sm">
            Any listing reported for fraudulent customer engagement or counterfeit representation will undergo immediate suspension and revocation of verified badges. AuraCentra preserves an authoritative standard of trust.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            4. Ecosystem Vision
          </h3>
          <p className="text-xs sm:text-sm">
            AuraCentra operates under Tony’s Digital Marketing and Business Hub with the dedicated vision of advancing Ghana’s digital economy through transparent, accessible business visibility.
          </p>
        </div>

      </div>

      {/* Footer info */}
      <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
        <p>© 2026 AuraCentra • Tony’s Digital Marketing and Business Hub</p>
      </div>

    </div>
  );
};
