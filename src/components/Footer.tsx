import React, { useState } from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Mail, 
  ExternalLink, 
  CheckCircle2,
  Send,
  Building2,
  TrendingUp,
  MessageCircle,
  Globe,
  Layers,
  Award,
  Lock,
  ArrowRight
} from 'lucide-react';
import { Logo } from './Logo';

interface FooterProps {
  onSelectCategory?: (categoryId: string) => void;
  onOpenRegister: () => void;
  onOpenNews?: () => void;
  onOpenAboutUs?: () => void;
  onOpenPricing?: () => void;
  onShowToast?: (title: string, message?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenRegister,
  onOpenNews,
  onOpenAboutUs,
  onOpenPricing,
  onShowToast,
}) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      onShowToast?.('Invalid Email', 'Please provide a valid email address.', 'warning');
      return;
    }
    setSubscribed(true);
    onShowToast?.(
      'Subscribed Successfully!',
      'You will receive weekly Ghana business updates and market insights.',
      'success'
    );
    setNewsletterEmail('');
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <footer 
      className="relative w-full bg-gradient-to-b from-[#0a183d] via-[#0d2254] to-[#071436] text-white border-t border-blue-900/60 pt-8 sm:pt-10 pb-24 sm:pb-8 mt-10 sm:mt-14 overflow-hidden z-10"
      id="auracentra-footer"
    >
      {/* Ambient Royal Blue Glow */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[200px] bg-[#155DFC]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        
        {/* Main Streamlined Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-8">
          
          {/* Brand & Direct Contact (lg: 4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <Logo size="md" textColorMode="light" showTagline={true} />
            <p className="text-xs text-blue-100/80 leading-relaxed max-w-sm">
              Ghana&apos;s verified business network connecting enterprises with customers across all 16 regions without stress.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-blue-200/90">
              <a 
                href="https://wa.me/233508203673" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>+233 50 820 3673</span>
              </a>
              <span>•</span>
              <a 
                href="mailto:tonysdigitalmarketing@gmail.com" 
                className="hover:text-cyan-300 transition-colors flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5 text-blue-300" />
                <span>tonysdigitalmarketing@gmail.com</span>
              </a>
            </div>
          </div>

          {/* Quick Platform Links (lg: 2.5 cols) */}
          <div className="lg:col-span-3 space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-white/10 pb-1 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-[#38bdf8]" />
              <span>Platform</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-blue-100/90">
              <li>
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('category-explore-row') || document.getElementById('discover-businesses-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors text-left flex items-center gap-1 cursor-pointer"
                >
                  <ArrowRight className="w-2.5 h-2.5 text-[#38bdf8]" />
                  <span>Browse Categories</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenNews}
                  className="hover:text-white transition-colors text-left flex items-center gap-1 cursor-pointer"
                >
                  <ArrowRight className="w-2.5 h-2.5 text-[#38bdf8]" />
                  <span>Ghana Business News & FX</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenAboutUs}
                  className="hover:text-white transition-colors text-left flex items-center gap-1 cursor-pointer"
                >
                  <ArrowRight className="w-2.5 h-2.5 text-[#38bdf8]" />
                  <span>About AuraCentra</span>
                </button>
              </li>
            </ul>
          </div>

          {/* For Businesses (lg: 2.5 cols) */}
          <div className="lg:col-span-2 space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-white/10 pb-1 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-[#38bdf8]" />
              <span>Businesses</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-blue-100/90">
              <li>
                <button
                  type="button"
                  onClick={onOpenRegister}
                  className="hover:text-cyan-300 font-bold text-[#38bdf8] transition-colors text-left flex items-center gap-1 cursor-pointer"
                >
                  <ArrowRight className="w-2.5 h-2.5 text-cyan-300" />
                  <span>List Your Business</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenPricing}
                  className="hover:text-white transition-colors text-left flex items-center gap-1 cursor-pointer"
                >
                  <ArrowRight className="w-2.5 h-2.5 text-[#38bdf8]" />
                  <span>Pricing & Verification</span>
                </button>
              </li>
              <li>
                <a
                  href="https://wa.me/233508203673"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors text-left flex items-center gap-1"
                >
                  <ArrowRight className="w-2.5 h-2.5 text-[#38bdf8]" />
                  <span>Advertise with Tony</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Compact (lg: 3 cols) */}
          <div className="lg:col-span-3 space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-white/10 pb-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#38bdf8]" />
              <span>Stay Updated</span>
            </h4>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-1.5">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-xs text-white placeholder:text-blue-200/50 focus:outline-hidden focus:border-[#155DFC]"
                required
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-[#155DFC] hover:bg-blue-600 text-white text-xs font-bold transition-all shrink-0 cursor-pointer"
              >
                {subscribed ? '✓' : 'Join'}
              </button>
            </form>
            <p className="text-[10px] text-blue-200/60">Weekly verified Ghana market updates.</p>
          </div>

        </div>

        {/* Bottom Legal & Recognition Strip */}
        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-blue-200/80">
          <div className="flex flex-wrap items-center gap-2 text-center sm:text-left">
            <span>© 2026 AuraCentra • Tony&apos;s Digital Marketing Hub</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button
              type="button"
              onClick={onOpenAboutUs}
              className="hover:text-white transition-colors cursor-pointer text-[11px]"
            >
              Privacy & Terms
            </button>
            <span className="text-white/20">•</span>
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/10 text-white font-bold text-[10px]">
              <span>Ghana</span>
              <span>🇬🇭</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};
