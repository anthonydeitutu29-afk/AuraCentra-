import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  RefreshCw, 
  ArrowRight, 
  Search, 
  Share2, 
  Heart, 
  ArrowUpDown, 
  Newspaper, 
  ShieldCheck, 
  Zap, 
  ChevronDown,
  ChevronUp,
  DollarSign,
  Info,
  Maximize2,
  X,
  Sparkles,
  ExternalLink,
  Layers
} from 'lucide-react';
import { GhanaNewsArticle, ForexRate, GhanaMarketSummary, GhanaNewsCategory } from '../types';
import { TODAY_FOREX_RATES, TODAY_MARKET_SUMMARY } from '../data/ghanaNewsData';
import { getStoredNewsLikes, toggleStoredNewsLike } from '../utils/storage';
import { 
  fetchLiveGhanaForexRates, 
  calculateCurrencyConversion, 
  syncGhanaBusinessNewsFeeds, 
  getStoredGhanaNewsArticles, 
  getLastNewsSyncTime, 
  SUPPORTED_CURRENCIES 
} from '../utils/ghanaNewsAndForexService';

interface GhanaBusinessNewsSectionProps {
  onSelectArticle?: (article: GhanaNewsArticle) => void;
  onShowToast?: (title: string, message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  isOpenAsModalInitially?: boolean;
}

export const GhanaBusinessNewsSection: React.FC<GhanaBusinessNewsSectionProps> = ({
  onSelectArticle,
  onShowToast,
  isOpenAsModalInitially = false,
}) => {
  // Pop-up Modal State
  const [isPopUpOpen, setIsPopUpOpen] = useState(isOpenAsModalInitially);

  // Articles & Sync State
  const [articles, setArticles] = useState<GhanaNewsArticle[]>(() => getStoredGhanaNewsArticles());
  const [selectedCategory, setSelectedCategory] = useState<GhanaNewsCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [likedArticles, setLikedArticles] = useState<string[]>(() => getStoredNewsLikes());
  const [isSyncingNews, setIsSyncingNews] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>(() => getLastNewsSyncTime());

  // Forex & Live Currency Converter State
  const [forexRates, setForexRates] = useState<ForexRate[]>(TODAY_FOREX_RATES);
  const [marketSummary, setMarketSummary] = useState<GhanaMarketSummary>(TODAY_MARKET_SUMMARY);
  const [isLiveForex, setIsLiveForex] = useState(false);
  const [showFullFxTable, setShowFullFxTable] = useState(false);

  // Conversion Inputs
  const [converterAmount, setConverterAmount] = useState<number>(100);
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('GHS');
  const [rateBenchmark, setRateBenchmark] = useState<'interbank' | 'bureau' | 'commercial'>('interbank');

  // Sync Feeds
  const syncFeeds = useCallback(async (isManual = false) => {
    if (isManual) setIsSyncingNews(true);
    try {
      const [forexRes, newsRes] = await Promise.allSettled([
        fetchLiveGhanaForexRates(),
        syncGhanaBusinessNewsFeeds(),
      ]);

      if (forexRes.status === 'fulfilled' && forexRes.value) {
        setForexRates(forexRes.value.rates);
        setMarketSummary(forexRes.value.marketSummary);
        setIsLiveForex(forexRes.value.isLive);
      }

      if (newsRes.status === 'fulfilled' && newsRes.value) {
        setArticles(newsRes.value.articles);
        setLastSyncTime(newsRes.value.lastSyncedAt);
        if (isManual) {
          onShowToast?.(
            'News & Rates Synchronized',
            `Fetched ${newsRes.value.articles.length} verified Ghana business updates.`,
            'success'
          );
        }
      }
    } catch {
      if (isManual) {
        onShowToast?.('Sync Complete', 'Displaying latest verified market data.', 'info');
      }
    } finally {
      if (isManual) setIsSyncingNews(false);
    }
  }, [onShowToast]);

  useEffect(() => {
    syncFeeds(false);
    const interval = setInterval(() => {
      syncFeeds(false);
    }, 180000);
    return () => clearInterval(interval);
  }, [syncFeeds]);

  // Currency Conversion Calculation
  const conversionData = useMemo(() => {
    return calculateCurrencyConversion({
      amount: converterAmount,
      fromCurrency,
      toCurrency,
      rateType: rateBenchmark,
      ratesList: forexRates,
    });
  }, [converterAmount, fromCurrency, toCurrency, rateBenchmark, forexRates]);

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  // Filtered Articles
  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      const matchCategory = selectedCategory === 'all' || art.category === selectedCategory;
      const matchSearch = 
        !searchQuery || 
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        art.source.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [articles, selectedCategory, searchQuery]);

  const handleToggleLike = (e: React.MouseEvent, articleId: string) => {
    e.stopPropagation();
    const updated = toggleStoredNewsLike(articleId);
    setLikedArticles(updated);
    const isNowLiked = updated.includes(articleId);
    onShowToast?.(
      isNowLiked ? 'Article Saved' : 'Article Removed',
      isNowLiked ? 'Added to your favorites.' : 'Removed from your favorites.',
      'info'
    );
  };

  const handleShareArticle = (e: React.MouseEvent, article: GhanaNewsArticle) => {
    e.stopPropagation();
    const shareText = `📰 *${article.title}*\n\n${article.excerpt}\n\nRead on AuraCentra: ${window.location.origin}/#news-${article.id}`;
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.excerpt,
        url: `${window.location.origin}/#news-${article.id}`,
      }).catch(() => {});
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
    }
  };

  return (
    <>
      {/* 1. GROUPED SECTION IN PAGE: Compact interactive card that pops up on click */}
      <section 
        id="ghana-business-news-section"
        className="py-4"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div 
            onClick={() => setIsPopUpOpen(true)}
            className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 p-6 sm:p-8 shadow-xl hover:shadow-2xl hover:border-indigo-400/50 transition-all duration-300 cursor-pointer"
          >
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all"></div>
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all"></div>

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              
              {/* Left Column: Title & Market Context */}
              <div className="space-y-3 max-w-2xl">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#155DFC] text-white text-xs font-black shadow-md tracking-wider">
                    {/* Live Broadcast Signal Wave Icon matching Image 1 */}
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="2.5" fill="white" />
                      <path d="M7.8 7.8C5.5 10.1 5.5 13.9 7.8 16.2" stroke="white" strokeWidth="2" strokeLinecap="round" />
                      <path d="M16.2 7.8C18.5 10.1 18.5 13.9 16.2 16.2" stroke="white" strokeWidth="2" strokeLinecap="round" />
                      <path d="M4.9 4.9C1.1 8.8 1.1 15.2 4.9 19.1" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
                      <path d="M19.1 4.9C22.9 8.8 22.9 15.2 19.1 19.1" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
                    </svg>
                    <span>LIVE BoG FX & BUSINESS NEWS</span>
                  </div>

                  <span className="text-xs text-indigo-200/70">
                    Synced: <strong className="text-white">{lastSyncTime}</strong>
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Ghana Business News & Live FX Exchange
                </h2>

                <p className="text-sm text-slate-300 leading-relaxed">
                  Real-time Bank of Ghana interbank exchange rates, forex bureau benchmarks, currency calculator, and curated business intelligence across all 16 regions.
                </p>

                {/* Quick FX Rates Ticker Snippet */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {forexRates.slice(0, 3).map((fx) => {
                    const midRate = ((fx.interbankBuy + fx.interbankSell) / 2);
                    return (
                      <div 
                        key={fx.currencyCode} 
                        className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center gap-2 text-xs"
                      >
                        <span className="font-bold text-white">{fx.currencyCode}/GHS</span>
                        <span className="font-mono text-cyan-300 font-bold">{midRate.toFixed(2)}</span>
                        <span className={`text-[10px] font-bold ${fx.change24h >= 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {fx.change24h >= 0 ? '+' : ''}{fx.change24h.toFixed(1)}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Pop Up Action Trigger */}
              <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-3 shrink-0">
                <div className="p-4 rounded-2xl bg-slate-800/60 border border-indigo-500/20 text-xs text-slate-300 space-y-1 sm:text-right">
                  <div className="text-indigo-300 font-bold flex items-center sm:justify-end gap-1">
                    <Newspaper className="w-4 h-4 text-cyan-400" />
                    <span>{articles.length} Verified Articles Ready</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Click anywhere on this section to open full hub
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsPopUpOpen(true);
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-black shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 group-hover:scale-105 transition-all cursor-pointer"
                >
                  <Maximize2 className="w-4 h-4" />
                  <span>Open News & Live FX Hub</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 2. THE POP-UP MODAL: Opens when clicked */}
      {isPopUpOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setIsPopUpOpen(false)}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-100 animate-in zoom-in-95 duration-200"
          >
            
            {/* MODAL HEADER */}
            <div className="p-4 sm:p-6 border-b border-slate-800 bg-slate-850 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                  <Newspaper className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                      Ghana Business News & Live FX Exchange
                    </h2>
                    <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 text-[10px] font-bold">
                      Active
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Bank of Ghana interbank rates, bureau benchmark comparison, and verified enterprise stories.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => syncFeeds(true)}
                  disabled={isSyncingNews}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600/30 hover:bg-blue-600 border border-blue-500/40 text-blue-200 hover:text-white text-xs font-bold transition-all cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncingNews ? 'animate-spin' : ''}`} />
                  <span>{isSyncingNews ? 'Syncing...' : 'Sync Feeds'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsPopUpOpen(false)}
                  className="p-2 rounded-2xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* MODAL BODY (SCROLLABLE) */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              
              {/* LIVE CURRENCY CONVERTER & MARKET SUMMARY WIDGET */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                
                {/* 1. Fast Currency Calculator */}
                <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-emerald-400" />
                      <span className="font-bold text-sm text-white">Live Ghana Cedi Currency Converter</span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Rate Type: <strong className="text-cyan-400 uppercase">{rateBenchmark}</strong>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                    {/* Amount Input */}
                    <div className="sm:col-span-4 space-y-1">
                      <label className="text-[11px] font-semibold text-slate-400">Amount</label>
                      <input
                        type="number"
                        min="1"
                        value={converterAmount}
                        onChange={(e) => setConverterAmount(Math.max(1, parseFloat(e.target.value) || 0))}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono font-bold text-sm focus:outline-hidden focus:border-blue-500"
                      />
                    </div>

                    {/* From Currency */}
                    <div className="sm:col-span-3 space-y-1">
                      <label className="text-[11px] font-semibold text-slate-400">From</label>
                      <select
                        value={fromCurrency}
                        onChange={(e) => setFromCurrency(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold focus:outline-hidden focus:border-blue-500 cursor-pointer"
                      >
                        {SUPPORTED_CURRENCIES.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.flag} {c.code}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Swap Button */}
                    <div className="sm:col-span-2 flex justify-center sm:pt-4">
                      <button
                        type="button"
                        onClick={handleSwapCurrencies}
                        className="p-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 hover:text-white transition-colors cursor-pointer"
                        title="Swap currencies"
                      >
                        <ArrowUpDown className="w-4 h-4" />
                      </button>
                    </div>

                    {/* To Currency */}
                    <div className="sm:col-span-3 space-y-1">
                      <label className="text-[11px] font-semibold text-slate-400">To</label>
                      <select
                        value={toCurrency}
                        onChange={(e) => setToCurrency(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold focus:outline-hidden focus:border-blue-500 cursor-pointer"
                      >
                        {SUPPORTED_CURRENCIES.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.flag} {c.code}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Calculated Result Display */}
                  <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="text-[11px] text-slate-400">
                        {converterAmount.toLocaleString()} {fromCurrency} =
                      </div>
                      <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
                        {conversionData.resultAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {toCurrency}
                      </div>
                    </div>
                    <div className="text-xs text-slate-400 sm:text-right">
                      <div>1 {fromCurrency} = {conversionData.exchangeRate.toFixed(4)} {toCurrency}</div>
                      <div className="text-[10px] text-slate-500">Source: Bank of Ghana Daily Feed</div>
                    </div>
                  </div>
                </div>

                {/* 2. Bank of Ghana FX Quick Summary */}
                <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-slate-700/80">
                      <span className="font-bold text-xs text-white uppercase tracking-wider">Interbank FX Snapshot</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-950 border border-blue-800 text-blue-300 font-bold">
                        BOG Daily
                      </span>
                    </div>

                    <div className="divide-y divide-slate-700/50 mt-2">
                      {forexRates.slice(0, 4).map((rate) => {
                        const mid = ((rate.interbankBuy + rate.interbankSell) / 2);
                        return (
                          <div key={rate.currencyCode} className="py-2 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <span className="text-base">{rate.flag}</span>
                              <div>
                                <span className="font-bold text-white">{rate.currencyCode}</span>
                                <span className="text-[10px] text-slate-400 block">{rate.currencyName}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-mono font-bold text-cyan-300">{mid.toFixed(2)} GHS</div>
                              <div className={`text-[10px] font-bold ${rate.change24h >= 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                                {rate.change24h >= 0 ? '+' : ''}{rate.change24h.toFixed(1)}%
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowFullFxTable(!showFullFxTable)}
                    className="w-full py-2 rounded-xl bg-slate-700/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>{showFullFxTable ? 'Hide Complete FX Table' : 'View Full FX Table'}</span>
                    {showFullFxTable ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

              </div>

              {/* EXPANDABLE COMPLETE FX TABLE */}
              {showFullFxTable && (
                <div className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Complete Foreign Currency vs. Ghana Cedi (GHS) Rates
                    </h3>
                    <span className="text-[11px] text-slate-400">Values updated continuously</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] font-semibold border-b border-slate-700">
                        <tr>
                          <th className="p-2.5">Currency</th>
                          <th className="p-2.5">Interbank Buy</th>
                          <th className="p-2.5">Interbank Sell</th>
                          <th className="p-2.5">Bureau Benchmark</th>
                          <th className="p-2.5">24h Change</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700/60 font-mono">
                        {forexRates.map((fx) => (
                          <tr key={fx.currencyCode} className="hover:bg-slate-750">
                            <td className="p-2.5 font-sans font-semibold text-white flex items-center gap-2">
                              <span>{fx.flag}</span>
                              <span>{fx.currencyCode} ({fx.currencyName})</span>
                            </td>
                            <td className="p-2.5 text-slate-300">{fx.interbankBuy.toFixed(4)}</td>
                            <td className="p-2.5 text-slate-300">{fx.interbankSell.toFixed(4)}</td>
                            <td className="p-2.5 text-cyan-300 font-bold">{fx.bureauSell.toFixed(4)}</td>
                            <td className={`p-2.5 font-bold ${fx.change24h >= 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                              {fx.change24h >= 0 ? '+' : ''}{fx.change24h.toFixed(2)}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* SEARCH & CATEGORY FILTER BAR */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
                
                {/* Search Input */}
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Ghana business news, keywords, FX..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-hidden focus:border-blue-500"
                  />
                </div>

                {/* Category Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  {(['all', 'forex_fx', 'banking_economy', 'smes_startups', 'trade_afcfta', 'tech_telecoms', 'energy_commodities'] as const).map((cat) => {
                    const labelMap: Record<string, string> = {
                      all: 'All News',
                      forex_fx: 'Forex & FX',
                      banking_economy: 'Economy & Banking',
                      smes_startups: 'SMEs & Startups',
                      trade_afcfta: 'Trade & AfCFTA',
                      tech_telecoms: 'Tech & Telecoms',
                      energy_commodities: 'Energy & Mining',
                    };

                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                          selectedCategory === cat
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-750'
                        }`}
                      >
                        {labelMap[cat] || cat}
                      </button>
                    );
                  })}
                </div>

              </div>

              {/* NEWS ARTICLES GRID */}
              {filteredArticles.length === 0 ? (
                <div className="py-12 text-center text-slate-400 space-y-2">
                  <Newspaper className="w-8 h-8 mx-auto text-slate-500" />
                  <p className="text-sm font-semibold">No news articles match your search or filter.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory('all');
                      setSearchQuery('');
                    }}
                    className="text-xs text-blue-400 hover:underline cursor-pointer"
                  >
                    Clear search and show all articles
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredArticles.map((article) => {
                    const isLiked = likedArticles.includes(article.id);

                    return (
                      <article
                        key={article.id}
                        onClick={() => {
                          onSelectArticle?.(article);
                          setIsPopUpOpen(false);
                        }}
                        className="group bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-200 cursor-pointer"
                      >
                        <div>
                          {/* Image Container */}
                          <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                            <img
                              src={article.coverImage}
                              alt={article.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                            <div className="absolute top-2.5 left-2.5">
                              <span className="px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur text-white text-[10px] font-bold">
                                {article.source}
                              </span>
                            </div>
                            <div className="absolute bottom-2.5 left-2.5">
                              <span className="px-2 py-0.5 rounded-md bg-blue-600 text-white text-[10px] font-bold">
                                {article.categoryLabel}
                              </span>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="p-4 space-y-2">
                            {article.fxHighlight && (
                              <div className="px-2 py-0.5 rounded-md bg-amber-950/60 border border-amber-800/80 text-amber-300 text-[10px] font-bold flex items-center gap-1">
                                <Zap className="w-3 h-3 text-amber-400 shrink-0" />
                                <span className="truncate">{article.fxHighlight}</span>
                              </div>
                            )}

                            <h3 className="text-sm font-bold text-white line-clamp-2 group-hover:text-blue-400 transition-colors leading-snug">
                              {article.title}
                            </h3>

                            <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                              {article.excerpt}
                            </p>
                          </div>
                        </div>

                        {/* Card Footer */}
                        <div className="p-4 pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
                          <span>{article.publishedAt}</span>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={(e) => handleToggleLike(e, article.id)}
                              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                                isLiked 
                                  ? 'bg-rose-950/60 border-rose-800 text-rose-400' 
                                  : 'bg-slate-700 border-slate-600 text-slate-300 hover:text-rose-400'
                              }`}
                              title={isLiked ? 'Saved' : 'Save article'}
                            >
                              <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                            </button>

                            <button
                              type="button"
                              onClick={(e) => handleShareArticle(e, article)}
                              className="p-1.5 rounded-lg bg-slate-700 border border-slate-600 text-slate-300 hover:text-blue-400 transition-colors cursor-pointer"
                              title="Share to WhatsApp"
                            >
                              <Share2 className="w-3.5 h-3.5" />
                            </button>

                            <span className="ml-1 font-bold text-blue-400 inline-flex items-center group-hover:translate-x-0.5 transition-transform">
                              Read <ArrowRight className="w-3 h-3 ml-0.5" />
                            </span>
                          </div>
                        </div>

                      </article>
                    );
                  })}
                </div>
              )}

            </div>

            {/* MODAL FOOTER */}
            <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-850 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>AuraCentra Ghana Financial Intelligence Feed</span>
              </div>
              <button
                type="button"
                onClick={() => setIsPopUpOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors cursor-pointer"
              >
                Close Hub
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
