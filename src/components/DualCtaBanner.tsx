import React from 'react';
import { ArrowRight, Building2, Search, Sparkles, CheckCircle2 } from 'lucide-react';

interface DualCtaBannerProps {
  onExploreBusinesses: () => void;
  onListBusiness: () => void;
}

export const DualCtaBanner: React.FC<DualCtaBannerProps> = ({
  onExploreBusinesses,
  onListBusiness,
}) => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6" id="dual-cta-banner-section">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        
        {/* Card 1: Looking for a business? */}
        <div className="p-6 sm:p-7 rounded-3xl bg-[#0f172a] border border-slate-800 text-white shadow-xl flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors group relative overflow-hidden">
          <div className="space-y-2.5 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] font-bold uppercase tracking-wider">
              <span>EXPLORE DIRECTORY</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2.5">
              <span className="p-2 rounded-2xl bg-blue-500/10 text-blue-400">
                <Search className="w-5 h-5" />
              </span>
              <span>Looking for a business?</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md">
              Discover vetted suppliers, certified service professionals, and authentic shops across Ghana with verified reviews and direct WhatsApp chats.
            </p>
          </div>
          <div className="pt-2 relative z-10">
            <button
              type="button"
              id="cta-explore-businesses-btn"
              onClick={onExploreBusinesses}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#155DFC] hover:bg-blue-600 text-white text-xs sm:text-sm font-bold transition-all shadow-md cursor-pointer group-hover:gap-3"
            >
              <span>Explore Businesses</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Card 2: Own a business in Ghana? */}
        <div className="p-6 sm:p-7 rounded-3xl bg-[#0f172a] border border-slate-800 text-white shadow-xl flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors group relative overflow-hidden">
          <div className="space-y-2.5 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
              <span>MERCHANT ONBOARDING</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2.5">
              <span className="p-2 rounded-2xl bg-emerald-500/10 text-emerald-400">
                <Building2 className="w-5 h-5" />
              </span>
              <span>Own a business in Ghana?</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md">
              Get officially listed, earn a trust badge, and connect directly with thousands of retail customers and corporate buyers looking for suppliers.
            </p>
          </div>
          <div className="pt-2 relative z-10">
            <button
              type="button"
              id="cta-list-business-btn"
              onClick={onListBusiness}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#155DFC] hover:bg-blue-600 text-white text-xs sm:text-sm font-bold transition-all shadow-md cursor-pointer group-hover:gap-3"
            >
              <span>List Your Business</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
