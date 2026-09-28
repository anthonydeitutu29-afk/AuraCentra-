import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  ArrowRight, 
  Layers,
  UtensilsCrossed,
  Car,
  Hammer,
  TrendingUp,
  Shirt,
  Laptop,
  Building,
  Heart,
  Briefcase,
  Sprout,
  Hotel,
  GraduationCap,
  Sparkles,
  Truck,
  Landmark
} from 'lucide-react';
import { Business } from '../types';

interface SectorsViewProps {
  onSelectSector: (sector: string) => void;
  onBackToExplore: () => void;
  onOpenEnlist: () => void;
  businesses?: Business[];
}

export const SectorsView: React.FC<SectorsViewProps> = ({ 
  onSelectSector, 
  onBackToExplore, 
  onOpenEnlist, 
  businesses = [] 
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const sectors = [
    {
      id: 'restaurants',
      title: 'Restaurants & Eateries',
      desc: 'Authentic Ghanaian cuisines, continental restaurants, executive chop bars, and rooftop lounges.',
      icon: UtensilsCrossed,
      bgColor: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400',
    },
    {
      id: 'automotive',
      title: 'Automotive & Repairs',
      desc: 'Computerized OBD diagnostics, genuine OEM auto spare parts importers, air conditioning servicing, and car rentals.',
      icon: Car,
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400',
    },
    {
      id: 'building',
      title: 'Building Materials & Civil Hardware',
      desc: 'Civil engineering contractors, aluminum glazing fabricators, cement suppliers, steel rods, and electrical hardware.',
      icon: Hammer,
      bgColor: 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400',
    },
    {
      id: 'marketing',
      title: 'Digital Marketing & Growth',
      desc: 'Digital growth, SEO optimization, social performance ads, custom web development, and business intelligence.',
      icon: TrendingUp,
      bgColor: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400',
    },
    {
      id: 'fashion',
      title: 'Fashion & Bespoke Tailoring',
      desc: 'Bespoke Bonwire Kente weaving, Northern smock tailoring, modern Afrocentric couture, and ready-to-wear lines.',
      icon: Shirt,
      bgColor: 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400',
    },
    {
      id: 'tech',
      title: 'Technology & Cloud Solutions',
      desc: 'IT consulting, Mobile Money fintech integration, cloud engineering, cybersecurity, and hardware repair centres.',
      icon: Laptop,
      bgColor: 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400',
    },
    {
      id: 'realestate',
      title: 'Real Estate & Housing',
      desc: 'Luxury apartments for rent, commercial offices, verified titled land sales, and facility management.',
      icon: Building,
      bgColor: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400',
    },
    {
      id: 'healthcare',
      title: 'Healthcare & Diagnostics',
      desc: 'Specialist hospitals, diagnostic ultrasound labs, dental clinics, 24/7 licensed pharmacies, and wellness centers.',
      icon: Heart,
      bgColor: 'bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400',
    },
    {
      id: 'professional',
      title: 'Professional & Legal Hub',
      desc: 'Chartered accountants, corporate legal consultants, immigration specialists, and translation agencies.',
      icon: Briefcase,
      bgColor: 'bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400',
    },
    {
      id: 'agriculture',
      title: 'Agriculture & Agribusiness',
      desc: 'Commercial farms, cocoa & cashew aggregators, poultry feed suppliers, tractors, and agricultural exports.',
      icon: Sprout,
      bgColor: 'bg-fuchsia-50 dark:bg-fuchsia-950/40 text-fuchsia-600 dark:text-fuchsia-400',
    },
    {
      id: 'hospitality',
      title: 'Hospitality, Hotels & Tourism',
      desc: 'Luxury safari resorts, beachfront boutique hotels, eco-lodges, event venues, and tour operators.',
      icon: Hotel,
      bgColor: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400',
    },
    {
      id: 'education',
      title: 'Education, Academies & Training',
      desc: 'Accredited universities, international STEM schools, coding academies, and executive corporate training.',
      icon: GraduationCap,
      bgColor: 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400',
    },
    {
      id: 'beauty',
      title: 'Beauty, Hair & Spa Wellness',
      desc: 'Executive barbering, luxury bridal makeup, organic shea skincare, dermatological spas, and cosmetics.',
      icon: Sparkles,
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/40 text-teal-600 dark:text-teal-400',
    },
    {
      id: 'logistics',
      title: 'Logistics, Freight & Delivery',
      desc: 'Tema port clearing and forwarding agents, intercity cold-chain haulage, motorbike dispatch, and cargo transit.',
      icon: Truck,
      bgColor: 'bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400',
    },
    {
      id: 'financial',
      title: 'Financial Services & Microfinance',
      desc: 'Licensed savings & loans, insurance underwriters, Mobile Money merchant aggregators, and audit firms.',
      icon: Landmark,
      bgColor: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300',
    },
  ];

  const filtered = sectors.filter(
    (s) =>
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.desc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 transition-colors">
      
      {/* Header Tag matching Image 4 */}
      <div>
        <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-wider mb-1.5">
          <Layers className="w-4 h-4" />
          <span>OFFICIAL GHANAIAN COMMERCIAL REGISTRY</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Business Sectors & Categories
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Explore verified enterprises across all 16 Ghanaian regions organized by official industrial and service sectors.
        </p>

        {/* Buttons Row */}
        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={onBackToExplore}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Explore</span>
          </button>

          <button
            onClick={onOpenEnlist}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Enlist Business</span>
          </button>
        </div>
      </div>

      {/* Search Input matching Image 4 */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search sector (e.g. Restaurants, Digital Marketing, Auto, Health...)"
          className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-hidden focus:border-blue-600 shadow-2xs"
        />
      </div>

      {/* Count tag */}
      <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
        <span className="font-black text-slate-900 dark:text-white">{filtered.length}</span> Sectors Available
      </div>

      {/* Vertical list of 15 sector cards matching Image 4 */}
      <div className="space-y-3.5">
        {filtered.map((item) => {
          const Icon = item.icon;
          const count = businesses.filter(
            (b) => b.category && (
              b.category.toLowerCase().includes(item.title.toLowerCase().split(' ')[0]) ||
              item.title.toLowerCase().includes(b.category.toLowerCase())
            )
          ).length;

          return (
            <div
              key={item.id}
              onClick={() => onSelectSector(item.title)}
              className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${item.bgColor}`}>
                    <Icon className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full">
                    {count} businesses
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  {item.title}
                </h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-4 pt-2 flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700">
                <span>Explore sector</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer matching Image 4 with tightened spacing */}
      <div className="pt-4 pb-2 text-center text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200/80 dark:border-slate-700">
        <p>© 2026 AuraCentra • Tony's Digital Marketing & Business Hub</p>
        <div className="mt-1 flex justify-center">
          <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs">
            Ghana 🇬🇭
          </span>
        </div>
      </div>

    </div>
  );
};
