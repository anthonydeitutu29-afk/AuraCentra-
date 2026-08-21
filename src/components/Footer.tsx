import React from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Mail, 
  ExternalLink, 
  Sparkles, 
  Heart,
  CheckCircle2
} from 'lucide-react';
import { Category } from '../types';
import { Logo } from './Logo';

interface FooterProps {
  categories: Category[];
  onSelectCategory: (categoryId: string) => void;
  onSelectCity?: (city: string) => void;
  onOpenRegister: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  categories,
  onSelectCategory,
  onOpenRegister,
}) => {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 pt-10 sm:pt-12 pb-24 sm:pb-8 px-3 sm:px-6 lg:px-8 mt-12 sm:mt-16" id="auracentra-footer">
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1 & 2: Brand & Tony's Hub */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="md" showTagline={true} />

            <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-800/60 space-y-2 mt-4">
              <div className="flex items-center gap-2 text-blue-400 text-xs font-bold">
                <Sparkles className="w-4 h-4" />
                <span>Connected with Tony's Digital Marketing & Business Hub</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Empowering Ghanaian businesses, SMEs, startups, and enterprises with high-conversion verified digital listings, marketing acceleration, and market expansion.
              </p>
              <div className="pt-1 flex flex-wrap items-center gap-3 text-xs">
                <a
                  href="https://wa.me/233508203673"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 font-semibold hover:underline flex items-center gap-1"
                >
                  <span>WhatsApp: 0508203673</span>
                </a>
                <a
                  href="mailto:tonysdigitalmarketing@gmail.com"
                  className="text-blue-400 font-semibold hover:underline flex items-center gap-1"
                >
                  <span>tonysdigitalmarketing@gmail.com</span>
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>National ID (Ghana Card) & Physical Location Verified Standards</span>
            </div>
          </div>

          {/* Col 3: Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Top Categories
            </h4>
            <ul className="space-y-2 text-xs">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <button
                    type="button"
                    onClick={() => onSelectCategory(cat.id)}
                    className="hover:text-blue-400 transition-colors text-left"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Business Growth & Enlistment */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              For Business Owners
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Reach customers looking for your services in Ghana and earn the Gold Verified badge.
            </p>
            <button
              type="button"
              onClick={onOpenRegister}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition-all text-center"
            >
              Enlist Your Business Free
            </button>
          </div>
        </div>

        {/* Bottom copyright & legal */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} AuraCentra & Tony's Digital Marketing & Business Hub. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Privacy & Ghana Card Protection</span>
            <span className="hover:text-slate-400 cursor-pointer">Security Protocol</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
