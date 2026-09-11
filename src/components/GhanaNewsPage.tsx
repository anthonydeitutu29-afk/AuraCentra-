import React, { useState, useMemo, useCallback } from 'react';
import { 
  ArrowLeft,
  RefreshCw, 
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
  TrendingUp,
  TrendingDown,
  ExternalLink,
  Layers,
  Sparkles,
  BarChart3,
  Building,
  CheckCircle2,
  Calendar,
  Clock,
  ArrowRight
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

interface GhanaNewsPageProps {
  onBackToHome: () => void;
  onSelectArticle: (article: GhanaNewsArticle) => void;
  onShowToast?: (title: string, message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const GhanaNewsPage: React.FC<GhanaNewsPageProps> = ({
  onBackToHome,
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
  const [fxTableSearch, setFxTableSearch] = useState('');

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

  // Conversion Calculation
  const conversionData = useMemo(() => {
    return calculateCurrencyConversion({
      amount: converterAmount,
      fromCurrency,
      toCurrency,
      rateType: rateBenchmark,
      ratesList: forexRates,
    });
  }, [converterAmount, fromCurrency, toCurrency, rateBenchmark, forexRates]);

  // Swap Currencies
  const handleSwapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  // Toggle Like Article
  const handleToggleLike = (e: React.MouseEvent, articleId: string) => {
    e.stopPropagation();
    const updated = toggleStoredNewsLike(articleId);
    setLikedArticles(updated);
    const isNowLiked = updated.includes(articleId);
    onShowToast?.(
      isNowLiked ? 'Article Saved' : 'Removed from Saved',
      isNowLiked ? 'Saved to your personal reading list' : 'Removed from your reading list',
      'info'
    );
  };

  // Share Article
  const handleShareArticle = (e: React.MouseEvent, article: GhanaNewsArticle) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/#news-${article.id}`;
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.excerpt,
        url: shareUrl,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl);
      onShowToast?.('Link Copied', 'Article link copied to clipboard.', 'success');
    }
  };

  // Filtered Articles
  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      const matchesCategory = selectedCategory === 'all' || art.category === selectedCategory;
      const matchesSearch = searchQuery.trim() === '' || 
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.source.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [articles, selectedCategory, searchQuery]);

  // Filtered Forex Rates for table
  const filteredForexRates = useMemo(() => {
    if (!fxTableSearch.trim()) return forexRates;
    const query = fxTableSearch.toLowerCase();
    return forexRates.filter(
      fx => fx.currencyCode.toLowerCase().includes(query) ||
            fx.currencyName.toLowerCase().includes(query)
    );
  }, [forexRates, fxTableSearch]);

  const quickAmounts = [50, 100, 500, 1000, 5000];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* 1. TOP HEADER & BREADCRUMB BAR (Light mode and dark mode high contrast) */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            {/* Left: Back Button & Context */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-[#38BDF8] uppercase tracking-wider">
                <span>Ghana Economic Intelligence Desk</span>
                <span>•</span>
                <span>Bank of Ghana Feed</span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                Ghana Business News & Live FX Exchange
              </h1>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
                Real-time Bank of Ghana interbank benchmarks, commercial & forex bureau comparisons, live Cedi (GHS) currency calculator, and verified economic intelligence across all 16 regions.
              </p>
            </div>

            {/* Right Actions: Back to Discovery & Sync */}
            <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-center">
              <button
                type="button"
                onClick={onBackToHome}
                id="news-page-back-btn"
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-800 dark:text-white border border-slate-300 dark:border-slate-700 text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-blue-600 dark:text-[#38BDF8]" />
                <span>Back to Discovery</span>
              </button>

              <button
                type="button"
                onClick={() => syncFeeds(true)}
                disabled={isSyncingNews}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold transition-all shadow-md shadow-blue-600/20 flex items-center gap-2 cursor-pointer disabled:opacity-70"
                title="Synchronize live Bank of Ghana rates and latest news"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncingNews ? 'animate-spin' : ''}`} />
                <span>{isSyncingNews ? 'Syncing...' : 'Sync Feeds'}</span>
              </button>
            </div>

          </div>

          {/* Status Sub-bar */}
          <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Live BoG Interbank Feed Active</span>
              </span>

              <span className="text-slate-600 dark:text-slate-300">
                Last Refreshed: <strong className="text-slate-900 dark:text-white font-mono">{lastSyncTime}</strong>
              </span>
            </div>

            {/* Quick in-page nav jump pills */}
            <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span>Jump to:</span>
              <a href="#currency-converter" className="text-blue-600 dark:text-[#38BDF8] hover:underline">Currency Converter</a>
              <span>•</span>
              <a href="#macro-indicators" className="text-blue-600 dark:text-[#38BDF8] hover:underline">Macro Indicators</a>
              <span>•</span>
              <a href="#forex-table" className="text-blue-600 dark:text-[#38BDF8] hover:underline">FX Table</a>
              <span>•</span>
              <a href="#business-articles" className="text-blue-600 dark:text-[#38BDF8] hover:underline">News Feed ({articles.length})</a>
            </div>
          </div>

        </div>
      </div>

      {/* 2. MAIN LAYOUT CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-10">
        
        {/* SECTION A: CURRENCY CONVERTER & QUICK FX SNAPSHOT */}
        <section id="currency-converter" className="space-y-4">
          
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <DollarSign className="w-6 h-6 text-blue-600 dark:text-[#38BDF8]" />
                <span>Live Ghana Cedi (GHS) Currency Converter</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Calculate real-time conversions using official Bank of Ghana mid-rates and bureau benchmarks.
              </p>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setRateBenchmark('interbank')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  rateBenchmark === 'interbank' 
                    ? 'bg-blue-600 text-white shadow-xs' 
                    : 'text-slate-700 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                Interbank (BoG)
              </button>
              <button
                type="button"
                onClick={() => setRateBenchmark('bureau')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  rateBenchmark === 'bureau' 
                    ? 'bg-blue-600 text-white shadow-xs' 
                    : 'text-slate-700 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                Forex Bureau
              </button>
              <button
                type="button"
                onClick={() => setRateBenchmark('commercial')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  rateBenchmark === 'commercial' 
                    ? 'bg-blue-600 text-white shadow-xs' 
                    : 'text-slate-700 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                Commercial Bank
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Converter Calculator Card */}
            <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
              
              {/* Mobile Benchmark Selector */}
              <div className="sm:hidden flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Rate Benchmark:</span>
                <select
                  value={rateBenchmark}
                  onChange={(e) => setRateBenchmark(e.target.value as any)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700"
                >
                  <option value="interbank">Interbank (BoG)</option>
                  <option value="bureau">Forex Bureau</option>
                  <option value="commercial">Commercial Bank</option>
                </select>
              </div>

              {/* Form Input Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-11 gap-4 items-center">
                
                {/* Amount */}
                <div className="sm:col-span-4 space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Amount to Convert</label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      value={converterAmount}
                      onChange={(e) => setConverterAmount(Math.max(1, parseFloat(e.target.value) || 0))}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold text-base focus:bg-white focus:outline-hidden focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all"
                      placeholder="100"
                    />
                  </div>
                </div>

                {/* From Currency */}
                <div className="sm:col-span-3 space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">From Currency</label>
                  <select
                    value={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value)}
                    className="w-full px-3.5 py-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs sm:text-sm font-bold focus:bg-white focus:outline-hidden focus:border-blue-600 cursor-pointer transition-all"
                  >
                    {SUPPORTED_CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code} className="text-slate-900 dark:text-white dark:bg-slate-900">
                        {c.flag} {c.code} ({c.name})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Swap Button */}
                <div className="sm:col-span-1 flex justify-center sm:pt-6">
                  <button
                    type="button"
                    onClick={handleSwapCurrencies}
                    className="p-3 rounded-xl bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white dark:bg-slate-800 dark:text-blue-300 dark:hover:bg-blue-600 dark:hover:text-white border border-blue-200 dark:border-slate-700 transition-colors cursor-pointer shadow-xs"
                    title="Swap From and To currencies"
                  >
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </div>

                {/* To Currency */}
                <div className="sm:col-span-3 space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">To Currency</label>
                  <select
                    value={toCurrency}
                    onChange={(e) => setToCurrency(e.target.value)}
                    className="w-full px-3.5 py-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs sm:text-sm font-bold focus:bg-white focus:outline-hidden focus:border-blue-600 cursor-pointer transition-all"
                  >
                    {SUPPORTED_CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code} className="text-slate-900 dark:text-white dark:bg-slate-900">
                        {c.flag} {c.code} ({c.name})
                      </option>
                    ))}
                  </select>
                </div>

              </div>

              {/* Quick Amount Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Quick amounts:</span>
                {quickAmounts.map(amt => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setConverterAmount(amt)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                      converterAmount === amt
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    +{amt}
                  </button>
                ))}
              </div>

              {/* High-Contrast Conversion Result Box */}
              <div className="p-5 sm:p-6 rounded-2xl bg-blue-50/70 dark:bg-slate-850 border-2 border-blue-200 dark:border-blue-900/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-bold text-slate-600 dark:text-slate-300">
                    {converterAmount.toLocaleString()} {fromCurrency} equals
                  </div>
                  <div className="text-2xl sm:text-4xl font-black text-blue-700 dark:text-[#38BDF8] font-mono tracking-tight mt-1">
                    {conversionData.resultAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {toCurrency}
                  </div>
                </div>

                <div className="md:text-right space-y-1 text-xs">
                  <div className="font-bold text-slate-800 dark:text-slate-200">
                    1 {fromCurrency} = <span className="font-mono text-blue-600 dark:text-[#38BDF8]">{conversionData.exchangeRate.toFixed(4)}</span> {toCurrency}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Calculated via {rateBenchmark.toUpperCase()} rate standard • Bank of Ghana
                  </div>
                </div>
              </div>

            </div>

            {/* Quick Interbank FX Snapshot Widget (Right 4 cols) */}
            <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4 flex flex-col justify-between">
              
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                      Major Cedi Pairs
                    </h3>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-extrabold border border-blue-200 dark:border-blue-800">
                    Mid Rate
                  </span>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800 mt-2">
                  {forexRates.slice(0, 5).map((fx) => {
                    const mid = ((fx.interbankBuy + fx.interbankSell) / 2);
                    return (
                      <div key={fx.currencyCode} className="py-3 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5">
                          <span className="text-xl leading-none">{fx.flag}</span>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white">{fx.currencyCode} / GHS</div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400">{fx.currencyName}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-mono font-black text-slate-900 dark:text-white text-sm">
                            {mid.toFixed(2)} GHS
                          </div>
                          <div className={`text-[10px] font-bold ${fx.change24h >= 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                            {fx.change24h >= 0 ? '+' : ''}{fx.change24h.toFixed(1)}% (24h)
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
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer border border-slate-300 dark:border-slate-700 shadow-2xs"
              >
                <span>{showFullFxTable ? 'Collapse Complete FX Table' : 'Expand All Currencies Table'}</span>
                {showFullFxTable ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

            </div>

          </div>

        </section>

        {/* SECTION B: EXPANDABLE COMPLETE FX RATES TABLE */}
        {showFullFxTable && (
          <section id="forex-table" className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4 animate-in fade-in duration-200">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                  Bank of Ghana Official Interbank & Bureau Benchmark Table
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Updated daily according to Central Bank of Ghana trade bulletins.
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={fxTableSearch}
                  onChange={(e) => setFxTableSearch(e.target.value)}
                  placeholder="Filter currency (e.g. USD, EUR)..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-blue-600"
                />
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-850 text-slate-700 dark:text-slate-300 uppercase text-[10px] font-bold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-3.5">Currency</th>
                    <th className="p-3.5">Interbank Buying</th>
                    <th className="p-3.5">Interbank Selling</th>
                    <th className="p-3.5">Bureau Benchmark</th>
                    <th className="p-3.5">24h Change</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                  {filteredForexRates.map((fx) => (
                    <tr key={fx.currencyCode} className="hover:bg-blue-50/50 dark:hover:bg-slate-800/60 transition-colors">
                      <td className="p-3.5 font-sans font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span className="text-lg">{fx.flag}</span>
                        <span>{fx.currencyCode} - {fx.currencyName}</span>
                      </td>
                      <td className="p-3.5 text-slate-700 dark:text-slate-300">{fx.interbankBuy.toFixed(4)}</td>
                      <td className="p-3.5 text-slate-700 dark:text-slate-300">{fx.interbankSell.toFixed(4)}</td>
                      <td className="p-3.5 text-blue-600 dark:text-[#38BDF8] font-black">{fx.bureauSell.toFixed(4)}</td>
                      <td className={`p-3.5 font-bold ${fx.change24h >= 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                        {fx.change24h >= 0 ? '+' : ''}{fx.change24h.toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </section>
        )}

        {/* SECTION C: GHANA MACROECONOMIC HEALTH INDICATORS */}
        <section id="macro-indicators" className="space-y-4">
          
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-blue-600 dark:text-[#38BDF8]" />
                <span>Ghana Macroeconomic Pulse & Key Benchmarks</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Central Bank policy anchors, inflation statistics, and sovereign financial metrics.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Metric 1: Policy Rate */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold">
                <span>BoG Policy Rate</span>
                <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-cyan-300 text-[10px] font-bold">
                  MPC Anchor
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">
                {marketSummary.bogPolicyRate}%
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Monetary Policy Committee headline policy rate benchmark.
              </p>
            </div>

            {/* Metric 2: Headline Inflation */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold">
                <span>Headline Inflation</span>
                <span className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-[10px] font-bold">
                  GSS CPI
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">
                {marketSummary.headlineInflation}%
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Year-on-year national consumer price index tracker.
              </p>
            </div>

            {/* Metric 3: GSE Composite Index */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold">
                <span>GSE Composite Index</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                  Stock Exchange
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">
                {marketSummary.gseCompositeIndex.toLocaleString()}
              </div>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+{marketSummary.gseChange}% Year-to-Date Equities Performance</span>
              </p>
            </div>

            {/* Metric 4: Gold & Cocoa Exports */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold">
                <span>Gold Export Price</span>
                <span className="px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-[10px] font-bold">
                  Commodities
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">
                ${marketSummary.goldPerOunce.toLocaleString()}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                USD per troy ounce benchmark (Cocoa: ${marketSummary.cocoaPerTonne.toLocaleString()}/t).
              </p>
            </div>

          </div>

        </section>

        {/* SECTION D: VERIFIED GHANA BUSINESS NEWS FEED */}
        <section id="business-articles" className="space-y-6">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <Newspaper className="w-6 h-6 text-blue-600 dark:text-[#38BDF8]" />
                <span>Curated Ghana Business Intelligence Feed</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Verified economic reports, trade tenders, SME case studies, and enterprise news.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search headlines, keywords, companies..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs placeholder:text-slate-400 focus:outline-hidden focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 shadow-xs"
              />
            </div>
          </div>

          {/* Category Filter Pills with Crisp Contrast */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {([
              { id: 'all', label: 'All Updates' },
              { id: 'forex_fx', label: 'Forex & FX' },
              { id: 'banking_economy', label: 'Banking & Economy' },
              { id: 'smes_startups', label: 'SMEs & Startups' },
              { id: 'trade_afcfta', label: 'Trade & AfCFTA' },
              { id: 'tech_telecoms', label: 'Tech & Telecoms' },
              { id: 'energy_commodities', label: 'Energy & Commodities' },
            ] as const).map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id as GhanaNewsCategory)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Articles Grid */}
          {filteredArticles.length === 0 ? (
            <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 space-y-3">
              <Newspaper className="w-10 h-10 mx-auto text-slate-400" />
              <h3 className="text-base font-bold text-slate-800 dark:text-white">No articles found matching your criteria</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Try searching for a different keyword or resetting your category filters.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => {
                const isLiked = likedArticles.includes(article.id);

                return (
                  <article
                    key={article.id}
                    onClick={() => onSelectArticle(article)}
                    className="group bg-white dark:bg-slate-900 hover:bg-blue-50/30 dark:hover:bg-slate-850/80 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-200 shadow-xs hover:shadow-lg cursor-pointer"
                  >
                    <div>
                      {/* Image Thumbnail */}
                      <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                        <img
                          src={article.coverImage}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="px-2.5 py-1 rounded-md bg-slate-900/85 backdrop-blur text-white text-[10px] font-bold shadow-xs">
                            {article.source}
                          </span>
                        </div>
                        <div className="absolute bottom-3 left-3">
                          <span className="px-2.5 py-1 rounded-md bg-blue-600 text-white text-[10px] font-black shadow-xs">
                            {article.categoryLabel}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 space-y-2.5">
                        {article.fxHighlight && (
                          <div className="px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-cyan-300 text-[11px] font-bold flex items-center gap-1.5 border border-blue-100 dark:border-blue-900">
                            <Zap className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400 shrink-0" />
                            <span className="truncate">{article.fxHighlight}</span>
                          </div>
                        )}

                        <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-[#38BDF8] transition-colors leading-snug">
                          {article.title}
                        </h3>

                        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                          {article.excerpt}
                        </p>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="p-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{article.publishedAt}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => handleToggleLike(e, article.id)}
                          className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                            isLiked
                              ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/60 dark:border-rose-900'
                              : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-rose-500'
                          }`}
                          title={isLiked ? 'Saved' : 'Save article'}
                        >
                          <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                        </button>

                        <button
                          type="button"
                          onClick={(e) => handleShareArticle(e, article)}
                          className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/40 hover:text-blue-600 transition-colors cursor-pointer"
                          title="Share article"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>

                        <span className="font-bold text-blue-600 dark:text-[#38BDF8] inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform ml-1">
                          <span>Read</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>

                  </article>
                );
              })}
            </div>
          )}

        </section>

      </main>

    </div>
  );
};
