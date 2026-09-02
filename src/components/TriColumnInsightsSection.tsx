import React from 'react';
import { 
  ArrowRight, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  Building2, 
  Calendar, 
  Award, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { GhanaNewsArticle } from '../types';

interface TriColumnInsightsSectionProps {
  onViewAllOpportunities: () => void;
  onViewAllNews: () => void;
  onViewMarkets: () => void;
  onSelectArticle: (articleId: string) => void;
  onSelectOpportunity: (opportunityId: string) => void;
}

export const TriColumnInsightsSection: React.FC<TriColumnInsightsSectionProps> = ({
  onViewAllOpportunities,
  onViewAllNews,
  onViewMarkets,
  onSelectArticle,
  onSelectOpportunity,
}) => {
  // Opportunities data matching Image 1
  const opportunities = [
    {
      id: 'opp-1',
      title: 'Ghana Climate Innovation Centre (GCIC) Scale-Up Funding',
      type: 'Funding',
      deadline: '3 days left',
      isUrgent: true,
      sponsor: 'GCIC / World Bank',
    },
    {
      id: 'opp-2',
      title: 'National Digital Transformation SME Grant 2026',
      type: 'Grant',
      deadline: '5 days left',
      isUrgent: true,
      sponsor: 'Ministry of Communications',
    },
    {
      id: 'opp-3',
      title: 'Ghana Tech Summit & Investor Matchmaking 2026',
      type: 'Event',
      deadline: '12 Sep, 2026',
      isUrgent: false,
      sponsor: 'Accra Tech Hub',
    },
    {
      id: 'opp-4',
      title: 'Public Procurement Authority Supplier Register Open Tender',
      type: 'Tender',
      deadline: 'Ongoing',
      isUrgent: false,
      sponsor: 'PPA Ghana',
    },
  ];

  // News matching Image 1
  const featuredNews = {
    id: 'gh-news-01',
    category: 'BUSINESS',
    title: "VALCO rolling mill opens new frontier for Ghana's aluminium industry",
    date: '23 Aug 2026',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
  };

  const compactNews = [
    {
      id: 'gh-news-02',
      title: 'BoG holds policy rate, signals cautious outlook on commercial inflation',
      date: '22 Aug 2026',
      image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'gh-news-04',
      title: "Ghana's startup ecosystem attracts $56M in venture capital in Q2",
      date: '21 Aug 2026',
      image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=400&q=80',
    },
  ];

  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="tri-column-insights-section">
      
      {/* Column 1: Opportunities for you */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 flex flex-col justify-between space-y-4 shadow-xs">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Opportunities for you
            </h3>
            <button
              type="button"
              onClick={onViewAllOpportunities}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1 group cursor-pointer"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="space-y-3">
            {opportunities.map((opp) => (
              <div
                key={opp.id}
                onClick={() => onSelectOpportunity(opp.id)}
                className="group p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800 transition-all cursor-pointer flex items-start justify-between gap-3"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 uppercase">
                      {opp.type}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">{opp.sponsor}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                    {opp.title}
                  </h4>
                </div>

                <div className="text-right shrink-0">
                  <span className={`inline-flex items-center gap-1 text-[11px] font-bold ${
                    opp.isUrgent ? 'text-amber-600 dark:text-amber-400' : 'text-slate-500 dark:text-slate-400'
                  }`}>
                    <Clock className="w-3 h-3" />
                    <span>{opp.deadline}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={onViewAllOpportunities}
          className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-700 dark:text-slate-300 hover:text-blue-600 text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span>Explore All Grants & Tenders</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Column 2: Business news & insights */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 flex flex-col justify-between space-y-4 shadow-xs">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Business news & insights
            </h3>
            <button
              type="button"
              onClick={onViewAllNews}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1 group cursor-pointer"
            >
              <span>View all news</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Featured Large News Story */}
          <div
            onClick={() => onSelectArticle(featuredNews.id)}
            className="group cursor-pointer rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:shadow-md transition-all"
          >
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-200 dark:bg-slate-800">
              <img
                src={featuredNews.image}
                alt={featuredNews.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <div className="absolute top-2.5 left-2.5">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-blue-600 text-white uppercase tracking-wider">
                  {featuredNews.category}
                </span>
              </div>
            </div>
            <div className="p-3 space-y-1">
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                {featuredNews.title}
              </h4>
              <div className="text-[11px] text-slate-400 font-medium">{featuredNews.date}</div>
            </div>
          </div>

          {/* 2 Compact News Stories Below */}
          <div className="space-y-2.5">
            {compactNews.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectArticle(item.id)}
                className="group p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors flex items-center gap-3 cursor-pointer"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-12 h-12 rounded-lg object-cover shrink-0 bg-slate-200 dark:bg-slate-800"
                  loading="lazy"
                />
                <div className="min-w-0 flex-1 space-y-0.5">
                  <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                    {item.title}
                  </h5>
                  <div className="text-[10px] text-slate-400 font-medium">{item.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={onViewAllNews}
          className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-700 dark:text-slate-300 hover:text-blue-600 text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span>Open Full Ghana News Section</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Column 3: Market snapshot matching Image 1 */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 flex flex-col justify-between space-y-4 shadow-xs">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Market snapshot
            </h3>
            <button
              type="button"
              onClick={onViewMarkets}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1 group cursor-pointer"
            >
              <span>View markets</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Currency Rates with Sparkline */}
          <div className="grid grid-cols-3 gap-2">
            
            {/* USD / GHS */}
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
              <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">USD / GHS</div>
              <div className="text-sm sm:text-base font-black text-slate-900 dark:text-white">10.96</div>
              <div className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" />
                <span>+0.05 (0.46%)</span>
              </div>
            </div>

            {/* GBP / GHS */}
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
              <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">GBP / GHS</div>
              <div className="text-sm sm:text-base font-black text-slate-900 dark:text-white">14.95</div>
              <div className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" />
                <span>+0.12 (0.81%)</span>
              </div>
            </div>

            {/* EUR / GHS */}
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
              <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">EUR / GHS</div>
              <div className="text-sm sm:text-base font-black text-slate-900 dark:text-white">12.80</div>
              <div className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" />
                <span>+0.03 (0.23%)</span>
              </div>
            </div>

          </div>

          {/* Popular Banks Table matching Image 1 */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Popular Banks (USD Selling Rate)
            </div>
            <div className="rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              <div className="p-2.5 bg-slate-50/70 dark:bg-slate-800/40 flex items-center justify-between">
                <span className="font-semibold text-slate-700 dark:text-slate-300">GCB Bank</span>
                <span className="font-black text-slate-900 dark:text-white">10.95</span>
              </div>
              <div className="p-2.5 bg-white dark:bg-slate-900 flex items-center justify-between">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Ecobank Ghana</span>
                <span className="font-black text-slate-900 dark:text-white">10.96</span>
              </div>
              <div className="p-2.5 bg-slate-50/70 dark:bg-slate-800/40 flex items-center justify-between">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Zenith Bank</span>
                <span className="font-black text-slate-900 dark:text-white">10.97</span>
              </div>
              <div className="p-2.5 bg-white dark:bg-slate-900 flex items-center justify-between">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Absa Bank</span>
                <span className="font-black text-slate-900 dark:text-white">10.94</span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 font-medium text-center">
            Rates as of 23 Aug 2026, 10:00 AM GMT
          </div>
        </div>

        <button
          type="button"
          onClick={onViewMarkets}
          className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-700 dark:text-slate-300 hover:text-blue-600 text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span>Open Full Currency Converter & Rates</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </section>
  );
};
