import React, { useState } from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Mail, 
  ExternalLink, 
  Sparkles, 
  Heart,
  CheckCircle2,
  Send
} from 'lucide-react';
import { Category } from '../types';
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
      'Subscribed!',
      'You will receive weekly Ghana business updates and tender alerts.',
      'success'
    );
    setNewsletterEmail('');
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <footer className="bg-[#070b14] text-slate-400 border-t border-slate-800/90 pt-12 sm:pt-16 pb-28 sm:pb-14 px-4 sm:px-6 lg:px-8 mt-16 sm:mt-24 relative z-10" id="auracentra-footer">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Main 5-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Col 1 & 2: Brand, Tagline, Tony's Hub & Socials */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="md" showTagline={false} />
            
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm font-medium">
              Ghana's premier verified business discovery, trust verification, and commerce growth network.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a 
                href="https://wa.me/233508203673" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors text-xs font-bold"
                aria-label="WhatsApp Support"
              >
                WA
              </a>
              <a 
                href="mailto:tonysdigitalmarketing@gmail.com" 
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors text-xs font-bold"
                aria-label="Email Support"
              >
                @
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors text-xs font-bold"
                aria-label="LinkedIn"
              >
                in
              </a>
            </div>
          </div>

          {/* Col 3: Platform Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Platform
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('discover-businesses-section') || document.getElementById('main-directory-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Explore Businesses
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenNews}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Ghana Business News
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenNews}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Bank of Ghana FX Rates
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenAboutUs}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  About AuraCentra
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: For Businesses Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              For Businesses
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  type="button"
                  onClick={onOpenRegister}
                  className="hover:text-white transition-colors text-left font-bold text-blue-400 cursor-pointer"
                >
                  List Your Business
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenPricing}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Verification & Badges
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenPricing}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Pricing & Marketing
                </button>
              </li>
              <li>
                <a
                  href="https://wa.me/233508203673"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors text-left block"
                >
                  Advertise with Tony&apos;s Hub
                </a>
              </li>
            </ul>
          </div>

          {/* Col 5: Newsletter Subscribe Form */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Stay Updated
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Get weekly business news, grants, and market insights straight to your inbox.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 px-3 rounded-xl bg-[#155DFC] hover:bg-blue-600 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{subscribed ? 'Subscribed ✓' : 'Subscribe'}</span>
              </button>
            </form>
          </div>

        </div>

        {/* Elevated Information Block (Elevated so it comes up cleanly above bottom bars) */}
        <div className="pt-6 border-t border-slate-800/80 space-y-4">
          
          {/* Main Copyright & Legal Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-300">
            <div className="flex items-center gap-2 font-semibold">
              <span>© 2026 AuraCentra. All rights reserved.</span>
              <span className="text-slate-600 hidden sm:inline">•</span>
              <span className="text-blue-400 hidden sm:inline">Verified Ghana Business Directory</span>
            </div>

            <div className="flex items-center gap-5 text-xs">
              <button
                type="button"
                onClick={onOpenAboutUs}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Privacy Policy
              </button>
              <button
                type="button"
                onClick={onOpenAboutUs}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Terms of Service
              </button>
              <button
                type="button"
                onClick={onOpenAboutUs}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Security
              </button>
              <span className="flex items-center gap-1 text-slate-200 font-bold bg-slate-800/80 px-2 py-0.5 rounded-md">
                <span>Made in Ghana</span>
                <span>🇬🇭</span>
              </span>
            </div>
          </div>

        </div>

      </div>
    </footer>
  );
};
