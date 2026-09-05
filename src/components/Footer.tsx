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
  onOpenSectors?: () => void;
  onShowToast?: (title: string, message?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenRegister,
  onOpenNews,
  onOpenAboutUs,
  onOpenPricing,
  onOpenSectors,
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
      className="relative w-full bg-[#030712] text-white border-t border-slate-800 pt-8 sm:pt-10 pb-24 sm:pb-8 mt-10 sm:mt-14 overflow-hidden z-10"
      id="auracentra-footer"
    >
      {/* Subtle Midnight Accent */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[200px] bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        
        {/* Main Streamlined Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-8">
          
          {/* Brand & Direct Contact (lg: 4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <Logo size="md" textColorMode="light" showTagline={true} />
            <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
              Ghana&apos;s verified business network connecting enterprises with customers across all 16 regions without stress.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-300">
              <a 
                href="https://wa.me/233508203673" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-white transition-colors flex items-center gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5 text-slate-400" />
                <span>+233 50 820 3673</span>
              </a>
              <span className="text-slate-600">•</span>
              <a 
                href="mailto:tonysdigitalmarketing@gmail.com" 
                className="hover:text-white transition-colors flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>tonysdigitalmarketing@gmail.com</span>
              </a>
            </div>
          </div>

          {/* Quick Platform Links (lg: 2.5 cols) */}
          <div className="lg:col-span-3 space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-1 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Platform</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li>
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenSectors) {
                      onOpenSectors();
                    } else {
                      const el = document.getElementById('category-explore-row') || document.getElementById('discover-businesses-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="hover:text-white transition-colors text-left flex items-center gap-1 cursor-pointer"
                >
                  <ArrowRight className="w-2.5 h-2.5 text-slate-500" />
                  <span>Business Sectors & Categories</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenNews}
                  className="hover:text-white transition-colors text-left flex items-center gap-1 cursor-pointer"
                >
                  <ArrowRight className="w-2.5 h-2.5 text-slate-500" />
                  <span>Ghana Business News & FX</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenAboutUs}
                  className="hover:text-white transition-colors text-left flex items-center gap-1 cursor-pointer"
                >
                  <ArrowRight className="w-2.5 h-2.5 text-slate-500" />
                  <span>About AuraCentra</span>
                </button>
              </li>
            </ul>
          </div>

          {/* For Businesses (lg: 2.5 cols) */}
          <div className="lg:col-span-2 space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-1 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-slate-400" />
              <span>Businesses</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li>
                <button
                  type="button"
                  onClick={onOpenRegister}
                  className="hover:text-white font-medium transition-colors text-left flex items-center gap-1 cursor-pointer"
                >
                  <ArrowRight className="w-2.5 h-2.5 text-slate-500" />
                  <span>List Your Business</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenPricing}
                  className="hover:text-white transition-colors text-left flex items-center gap-1 cursor-pointer"
                >
                  <ArrowRight className="w-2.5 h-2.5 text-slate-500" />
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
                  <ArrowRight className="w-2.5 h-2.5 text-slate-500" />
                  <span>Advertise with Tony</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Compact (lg: 3 cols) */}
          <div className="lg:col-span-3 space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>Stay Updated</span>
            </h4>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-1.5">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-slate-500"
                required
              />
              <button
                type="submit"
                className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shrink-0 cursor-pointer"
              >
                {subscribed ? '✓' : 'Join'}
              </button>
            </form>
            <p className="text-[10px] text-slate-400">Weekly verified Ghana market updates.</p>
          </div>

        </div>

        {/* Bottom Legal & Recognition Strip (Midnight Black section matching Image 2) */}
        <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
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
            <span className="text-slate-700">•</span>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-200 font-bold text-[10px]">
              <span>Ghana</span>
              <span>🇬🇭</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};
