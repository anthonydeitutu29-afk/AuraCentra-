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
  Info
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
}

export const GhanaBusinessNewsSection: React.FC<GhanaBusinessNewsSectionProps> = ({
  onSelectArticle,
  onShowToast,
}) => {
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

  // Conversion Inputs (Minimized Compact Layout)
  const [converterAmount, setConverterAmount] = useState<number>(100);
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('GHS');
  const [rateBenchmark, setRateBenchmark] = useState<'interbank' | 'bureau' | 'commercial'>('interbank');

  // Automatic news and forex synchronization on initial mount & periodic polling
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
    <section 
      id="ghana-business-news-section"
      className="py-8 sm:py-10 bg-slate-50/60 dark:bg-slate-900/50 border-y border-slate-200/80 dark:border-slate-800 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* HEADER: Title, Live Sync Status, and Manual Refresh */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                LIVE UPDATES & FX
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Synced: <strong className="text-slate-700 dark:text-slate-300">{lastSyncTime}</strong>
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Ghana Business News & Live FX Exchange
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => syncFeeds(true)}
              disabled={isSyncingNews}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncingNews ? 'animate-spin' : ''}`} />
              <span>{isSyncingNews ? 'Syncing...' : 'Sync News Now'}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowFullFxTable(!showFullFxTable)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <span>{showFullFxTable ? 'Hide Rates Table' : 'View Full FX Table'}</span>
              {showFullFxTable ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* COMPACT & STREAMLINED CURRENCY CONVERTER WIDGET (Minimal Size) */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/90 dark:border-slate-700 p-3 sm:p-4 shadow-sm space-y-3">
          
          {/* 1-Row Compact Responsive Converter Form */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 shrink-0">
              <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden sm:inline">Currency Converter:</span>
            </div>

            {/* Amount input */}
            <div className="relative w-28 sm:w-32 shrink-0">
              <input
                type="number"
                min={0.01}
                step="any"
                value={converterAmount}
                onChange={(e) => setConverterAmount(Math.max(0.01, Number(e.target.value) || 0))}
                className="w-full pl-2.5 pr-2 py-1.5 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Amount"
                aria-label="Amount to convert"
              />
            </div>

            {/* From Currency Selector */}
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="px-2 py-1.5 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none cursor-pointer"
              aria-label="From Currency"
            >
              {SUPPORTED_CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.code}
                </option>
              ))}
            </select>

            {/* Swap Button */}
            <button
              type="button"
              onClick={handleSwapCurrencies}
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-200 transition-transform active:scale-95 cursor-pointer"
              title="Swap Currencies"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>

            {/* To Currency Selector */}
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="px-2 py-1.5 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none cursor-pointer"
              aria-label="To Currency"
            >
              {SUPPORTED_CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.code}
                </option>
              ))}
            </select>

            {/* Benchmark Micro-Toggle */}
            <div className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 text-[11px] font-semibold">
              <button
                type="button"
                onClick={() => setRateBenchmark('interbank')}
                className={`px-2 py-0.5 rounded-md transition-colors ${
                  rateBenchmark === 'interbank' 
                    ? 'bg-blue-600 text-white font-bold' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                BoG Interbank
              </button>
              <button
                type="button"
                onClick={() => setRateBenchmark('bureau')}
                className={`px-2 py-0.5 rounded-md transition-colors ${
                  rateBenchmark === 'bureau' 
                    ? 'bg-blue-600 text-white font-bold' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Bureau
              </button>
            </div>

            {/* Computed Converted Badge */}
            <div className="ml-auto flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-3 py-1 rounded-xl">
              <span className="text-xs text-emerald-800 dark:text-emerald-300 font-medium">
                =
              </span>
              <strong className="text-sm sm:text-base font-black text-emerald-700 dark:text-emerald-300 tracking-tight">
                {conversionData.toSymbol} {conversionData.resultAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </strong>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono hidden sm:inline">
                (1 {fromCurrency} = {conversionData.exchangeRate} {toCurrency})
              </span>
            </div>
          </div>

          {/* Mini Popular FX Rate Strip with Instant Quick-Fill */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 text-[11px]">
            <span className="text-slate-400 font-medium shrink-0">Popular Pairs:</span>
            {forexRates.slice(0, 5).map((fx) => (
              <button
                key={fx.currencyCode}
                type="button"
                onClick={() => {
                  setFromCurrency(fx.currencyCode);
                  setToCurrency('GHS');
                }}
                className={`shrink-0 px-2 py-0.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1 ${
                  fromCurrency === fx.currencyCode && toCurrency === 'GHS'
                    ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 font-bold'
                    : 'bg-slate-50 dark:bg-slate-900/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
                title={`Convert ${fx.currencyCode} to GHS`}
              >
                <span>{fx.flag}</span>
                <span>{fx.currencyCode}/GHS</span>
                <strong className="font-mono">GH₵ {fx.interbankBuy.toFixed(2)}</strong>
                <span className={`text-[10px] ${fx.change24h >= 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                  {fx.change24h >= 0 ? `+${fx.change24h}%` : `${fx.change24h}%`}
                </span>
              </button>
            ))}
          </div>

          {/* Expandable Comprehensive FX & Macro Indicators Panel */}
          {showFullFxTable && (
            <div className="pt-3 border-t border-slate-200 dark:border-slate-700 grid grid-cols-1 lg:grid-cols-12 gap-4">
              
              {/* Detailed FX Table (8 cols) */}
              <div className="lg:col-span-8 overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-700 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                      <th className="pb-2">Currency</th>
                      <th className="pb-2">BoG Interbank</th>
                      <th className="pb-2">Forex Bureau</th>
                      <th className="pb-2 text-right">24h Movement</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {forexRates.map((fx) => (
                      <tr 
                        key={fx.currencyCode} 
                        onClick={() => {
                          setFromCurrency(fx.currencyCode);
                          setToCurrency('GHS');
                        }}
                        className="hover:bg-blue-50/60 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
                      >
                        <td className="py-2 font-medium text-slate-900 dark:text-white flex items-center gap-2">
                          <span>{fx.flag}</span>
                          <span className="font-bold">{fx.currencyCode}</span>
                          <span className="text-[11px] text-slate-400 hidden sm:inline">({fx.currencyName})</span>
                        </td>
                        <td className="py-2 font-semibold text-slate-800 dark:text-slate-200">
                          GHS {fx.interbankBuy.toFixed(2)} / {fx.interbankSell.toFixed(2)}
                        </td>
                        <td className="py-2 font-semibold text-slate-800 dark:text-slate-200">
                          GHS {fx.bureauBuy.toFixed(2)} / {fx.bureauSell.toFixed(2)}
                        </td>
                        <td className="py-2 text-right">
                          <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            fx.change24h > 0 
                              ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400' 
                              : fx.change24h < 0 
                              ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'
                              : 'bg-slate-100 text-slate-600 dark:bg-slate-700'
                          }`}>
                            {fx.change24h > 0 ? <TrendingUp className="w-3 h-3" /> : fx.change24h < 0 ? <TrendingDown className="w-3 h-3" /> : null}
                            {fx.change24h > 0 ? `+${fx.change24h}%` : `${fx.change24h}%`}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Macro Indicators (4 cols) */}
              <div className="lg:col-span-4 grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80">
                  <span className="text-slate-500 dark:text-slate-400 block text-[10px]">BoG Policy Rate</span>
                  <span className="font-black text-slate-900 dark:text-white text-sm">{marketSummary.bogPolicyRate}%</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80">
                  <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Headline Inflation</span>
                  <span className="font-black text-slate-900 dark:text-white text-sm">{marketSummary.headlineInflation}%</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80">
                  <span className="text-slate-500 dark:text-slate-400 block text-[10px]">GSE Composite</span>
                  <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">{marketSummary.gseCompositeIndex.toLocaleString()}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80">
                  <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Gold Spot (oz)</span>
                  <span className="font-black text-amber-600 dark:text-amber-400 text-sm">${marketSummary.goldPerOunce}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CATEGORY TABS & REAL-TIME SEARCH */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 no-scrollbar">
            {[
              { id: 'all', label: 'All Updates' },
              { id: 'forex_fx', label: 'Forex & FX' },
              { id: 'banking_economy', label: 'Banking & GSE' },
              { id: 'trade_afcfta', label: 'AfCFTA Trade' },
              { id: 'tech_telecoms', label: 'Fintech & MoMo' },
              { id: 'smes_startups', label: 'SME Incentives' },
              { id: 'energy_commodities', label: 'Agri & Cocoa' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedCategory(tab.id as GhanaNewsCategory)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === tab.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search news topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* NEWS ARTICLES GRID */}
        {filteredArticles.length === 0 ? (
          <div className="text-center py-8 bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
            <Newspaper className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">No Matching News Found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Try adjusting your search query or sync the latest updates.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredArticles.map((article) => {
              const isLiked = likedArticles.includes(article.id);
              return (
                <article
                  key={article.id}
                  id={`news-card-${article.id}`}
                  onClick={() => onSelectArticle?.(article)}
                  className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200/90 dark:border-slate-700/80 hover:border-blue-500 dark:hover:border-blue-500 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between cursor-pointer"
                >
                  <div>
                    <div className="relative aspect-video overflow-hidden bg-slate-100 dark:bg-slate-900">
                      <img 
                        src={article.coverImage} 
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      
                      <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1">
                        {article.isBreaking && (
                          <span className="px-2 py-0.5 rounded-md bg-rose-600 text-white text-[10px] font-extrabold uppercase shadow">
                            BREAKING
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded-md bg-black/75 backdrop-blur text-white text-[10px] font-semibold">
                          {article.source}
                        </span>
                      </div>

                      <div className="absolute bottom-2.5 left-2.5">
                        <span className="px-2 py-0.5 rounded-md bg-blue-600 text-white text-[10px] font-medium shadow">
                          {article.categoryLabel}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 space-y-2">
                      {article.fxHighlight && (
                        <div className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-[10px] font-semibold flex items-center gap-1 border border-amber-200/60 dark:border-amber-800/60">
                          <Zap className="w-3 h-3 text-amber-500 shrink-0" />
                          <span className="truncate">{article.fxHighlight}</span>
                        </div>
                      )}

                      <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                        {article.title}
                      </h3>

                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                        {article.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="px-4 pb-3 pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
                    <span>{article.publishedAt}</span>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={(e) => handleToggleLike(e, article.id)}
                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                          isLiked 
                            ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/40' 
                            : 'bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-500 hover:text-rose-500'
                        }`}
                        title={isLiked ? 'Saved' : 'Save article'}
                      >
                        <Heart className={`w-3 h-3 ${isLiked ? 'fill-current' : ''}`} />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleShareArticle(e, article)}
                        className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-500 hover:text-blue-500 transition-colors cursor-pointer"
                        title="Share story"
                      >
                        <Share2 className="w-3 h-3" />
                      </button>

                      <span className="ml-1 inline-flex items-center text-blue-600 dark:text-blue-400 font-bold group-hover:translate-x-0.5 transition-transform">
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
    </section>
  );
};
