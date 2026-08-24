import React from 'react';
import { ArrowRight, Building2, Search, Sparkles } from 'lucide-react';

interface DualCtaBannerProps {
  onExploreBusinesses: () => void;
  onListBusiness: () => void;
}

export const DualCtaBanner: React.FC<DualCtaBannerProps> = ({
  onExploreBusinesses,
  onListBusiness,
}) => {
  return (
    <section 
      className="relative rounded-3xl overflow-hidden bg-[#0d1424] text-white border border-slate-800 shadow-xl"
      id="dual-cta-banner-section"
    >
      {/* Background with warm entrepreneur photography */}
      <div 
        className="absolute inset-0 bg-cover bg-right-center opacity-30 mix-blend-luminosity scale-105 pointer-events-none"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1600&q=80')`
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0d1424] via-[#0d1424]/90 to-[#0d1424]/40 pointer-events-none" />

      <div className="relative p-6 sm:p-10 lg:p-12 space-y-8">
        
        {/* Title */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-900/60 border border-blue-700/60 text-blue-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ghana's Business Growth Network</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Discover more. Get discovered.
          </h2>
        </div>

        {/* 2 Action Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl">
          
          {/* Card 1: Looking for a business? */}
          <div className="p-6 rounded-2xl bg-slate-900/80 backdrop-blur-sm border border-slate-800 space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Search className="w-5 h-5 text-blue-400" />
                <span>Looking for a business?</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Find verified businesses, vetted service providers, and authentic suppliers across all 16 regions of Ghana.
              </p>
            </div>
            <button
              type="button"
              onClick={onExploreBusinesses}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs sm:text-sm font-bold transition-all border border-slate-700 cursor-pointer shadow-xs"
            >
              <span>Explore Businesses</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 2: Own a business? */}
          <div className="p-6 rounded-2xl bg-blue-950/70 backdrop-blur-sm border border-blue-800/80 space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-cyan-400" />
                <span>Own a business in Ghana?</span>
              </h3>
              <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
                List your enterprise today and connect with thousands of local customers, corporate buyers, and investors.
              </p>
            </div>
            <button
              type="button"
              onClick={onListBusiness}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold transition-all shadow-md shadow-blue-600/30 cursor-pointer"
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
