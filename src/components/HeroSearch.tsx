import React from 'react';
import { 
  Search, 
  MapPin, 
  ShieldCheck, 
  ChevronDown, 
  ArrowRight
} from 'lucide-react';
import heroBackground from '../assets/images/accra_hero_skyline_1790465763128.jpg';

interface HeroSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedRegion: string;
  setSelectedRegion: (region: string) => void;
  selectedCity?: string;
  setSelectedCity?: (city: string) => void;
  selectedSector?: string;
  setSelectedSector?: (sector: string) => void;
  sortBy?: string;
  setSortBy?: (sort: string) => void;
  verifiedOnly?: boolean;
  setVerifiedOnly?: (verified: boolean) => void;
  onClearAll?: () => void;
  onSearch: () => void;
  onViewAllCategories?: () => void;
}

const GHANA_REGIONS = [
  'All Regions',
  'All 16 Ghana Regions',
  'Greater Accra',
  'Ashanti',
  'Western',
  'Western North',
  'Central',
  'Eastern',
  'Volta',
  'Oti',
  'Northern',
  'Savannah',
  'North East',
  'Upper East',
  'Upper West',
  'Bono',
  'Bono East',
  'Ahafo',
];

export const HeroSearch: React.FC<HeroSearchProps> = ({
  searchQuery,
  setSearchQuery,
  selectedRegion,
  setSelectedRegion,
  onSearch,
}) => {
  return (
    <div className="w-full">
      {/* 1. HERO BANNER - Full-width main background of the header section */}
      <section className="relative w-full overflow-hidden min-h-[380px] sm:min-h-[440px] md:min-h-[480px] flex flex-col justify-between text-white shadow-md">
        
        {/* Background photo */}
        <img 
          src={heroBackground} 
          alt="Accra Independence Arch and Skyline - Ghana" 
          className="absolute inset-0 w-full h-full object-cover object-center"
          loading="eager"
        />

        {/* Sophisticated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-900/85 to-slate-900/40" />
        <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/40" />

        {/* Floating Handwriting Cursive Text in Upper Right near the Arch */}
        <div className="absolute right-4 sm:right-10 md:right-16 top-8 sm:top-12 md:top-14 hidden md:block select-none pointer-events-none transform -rotate-6 z-10">
          <span className="font-serif italic text-lg sm:text-2xl text-white/90 drop-shadow-md font-medium tracking-wide">
            Local Businesses <br />
            <span className="text-amber-200">Bigger Opportunities</span>
          </span>
        </div>

        {/* Hero Content Container centered at max-w-7xl with fully responsive padding */}
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 md:py-16 relative z-10 flex flex-col justify-between h-full">
          
          {/* Hero Top Content */}
          <div className="max-w-xl space-y-2 sm:space-y-3 pt-1 text-left">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-bold border border-white/20 shadow-xs max-w-full">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span className="truncate">Ghana's Trusted Business Directory</span>
            </div>

            {/* Responsive Big Headline */}
            <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08] drop-shadow-sm">
              Discover more. <br />
              <span className="text-sky-400 dark:text-sky-300 drop-shadow-[0_2px_10px_rgba(56,189,248,0.4)]">
                Get discovered.
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium max-w-md pt-1">
              Find verified businesses, vetted service providers, and authentic suppliers across all 16 regions of Ghana.
            </p>
          </div>

          {/* Fully Responsive Search Bar Card */}
          <div className="mt-6 sm:mt-8 md:mt-10 w-full max-w-2xl">
            <div className="bg-white rounded-2xl sm:rounded-full p-2 sm:p-2.5 shadow-2xl border border-white/40 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 transition-all">
              
              {/* Region selector dropdown */}
              <div className="relative w-full sm:w-44 shrink-0 border-b sm:border-b-0 sm:border-r border-slate-200 pb-2 sm:pb-0 sm:pr-2 text-left">
                <MapPin className="w-4 h-4 text-blue-600 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full pl-9 pr-6 py-2 bg-transparent text-xs sm:text-sm font-bold text-slate-800 appearance-none focus:outline-hidden cursor-pointer"
                  aria-label="Filter by Ghana Region"
                >
                  {GHANA_REGIONS.map((r) => (
                    <option key={r} value={r} className="text-slate-900 bg-white">
                      {r}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Keyword search input */}
              <div className="relative flex-1 w-full text-left">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && onSearch()}
                  placeholder="Search businesses, services or locations..."
                  className="w-full pl-9 pr-3 py-2 bg-transparent text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden"
                  aria-label="Search query"
                />
              </div>

              {/* Blue pill button: Search -> */}
              <button
                onClick={onSearch}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl sm:rounded-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/30 transition-all cursor-pointer shrink-0"
              >
                <Search className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Search</span>
                <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
              </button>

            </div>
          </div>

        </div>

      </section>
    </div>
  );
};
