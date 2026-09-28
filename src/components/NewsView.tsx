import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  RotateCw, 
  ArrowUpDown, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  Heart, 
  Share2, 
  ArrowRight,
  ExternalLink,
  Clock,
  Radio,
  FileText,
  X,
  Sparkles,
  Flame,
  Globe2,
  Tv,
  Coins,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Bookmark
} from 'lucide-react';

interface NewsViewProps {
  onBackToExplore?: () => void;
  isFrontPage?: boolean;
}

export interface NewsArticle {
  id: string;
  sourceBadge: string;
  sourceUrl: string;
  category: 'current_affairs' | 'ghana_business' | 'intl_business' | 'entertainment';
  categoryBadge: string;
  tag?: string;
  title: string;
  snippet: string;
  fullContent: string[];
  keyTakeaways: string[];
  time: string;
  image: string;
  publishTimestamp: number;
}

export const NewsView: React.FC<NewsViewProps> = ({ onBackToExplore, isFrontPage = false }) => {
  // Live Second-by-Second Synchronization Ticker
  const [secondsAgo, setSecondsAgo] = useState(0);
  const [currentGmtTime, setCurrentGmtTime] = useState('');
  const [tickerIndex, setTickerIndex] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // FX Converter State
  const [benchmark, setBenchmark] = useState('Interbank (BoG)');
  const [amount, setAmount] = useState(100);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('GHS');
  const [quickAmount, setQuickAmount] = useState<number>(100);
  const [tableExpanded, setTableExpanded] = useState(false);

  // News Filtering & Reading (Dedicated Page Mode)
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeReadingArticle, setActiveReadingArticle] = useState<NewsArticle | null>(null);
  const [copiedShare, setCopiedShare] = useState(false);
  const [likedArticles, setLikedArticles] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('auracentra_liked_news');
        return stored ? JSON.parse(stored) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  // Live breaking alerts ticker
  const breakingAlerts = [
    '🔴 Citi Newsroom: Electoral Commission confirms nationwide digital exhibition for voter verification.',
    '⚡ Bank of Ghana: Bi-weekly FX auction satisfies commercial import requirements; Cedi mid-rate stands at 15.42 GHS/$.',
    '🌍 Reuters: Spot gold surpasses $2,650/oz boosting Ghana sovereign mineral export receipts.',
    '🎵 Pulse Ghana: Ghanaian Afro-creative streams generate over $150M in worldwide royalties for 2026.',
    '📊 GSE Composite Index advances +1.28% YTD driven by telecom and banking equities in Accra.',
  ];

  // Second-by-second auto-sync timer
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = String(now.getUTCHours()).padStart(2, '0');
      const minutes = String(now.getUTCMinutes()).padStart(2, '0');
      const seconds = String(now.getUTCSeconds()).padStart(2, '0');
      setCurrentGmtTime(`${hours}:${minutes}:${seconds} GMT`);
    };
    updateClock();

    const interval = setInterval(() => {
      setSecondsAgo((prev) => (prev >= 60 ? 0 : prev + 1));
      updateClock();
    }, 1000);

    const tickerInterval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % breakingAlerts.length);
    }, 4500);

    return () => {
      clearInterval(interval);
      clearInterval(tickerInterval);
    };
  }, [breakingAlerts.length]);

  const handleManualSync = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setSecondsAgo(0);
      setIsRefreshing(false);
    }, 600);
  };

  const toggleLike = (id: string) => {
    setLikedArticles(prev => {
      const updated = prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id];
      try {
        localStorage.setItem('auracentra_liked_news', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleShareArticle = (art: NewsArticle) => {
    if (navigator.share) {
      navigator.share({
        title: art.title,
        text: `${art.title} - Read on AuraCentra Ghana News:`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(art.sourceUrl || window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  const handleSwap = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  const calculateTotal = () => {
    const rate = 15.42;
    if (fromCurrency === 'USD' && toCurrency === 'GHS') return (amount * rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (fromCurrency === 'GHS' && toCurrency === 'USD') return (amount / rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (fromCurrency === 'GBP' && toCurrency === 'GHS') return (amount * 19.87).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (fromCurrency === 'EUR' && toCurrency === 'GHS') return (amount * 16.71).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (fromCurrency === 'GHS' && toCurrency === 'GBP') return (amount / 19.87).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (fromCurrency === 'GHS' && toCurrency === 'EUR') return (amount / 16.71).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return (amount * 1).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const cediPairs = [
    { flag: '🇺🇸', pair: 'USD / GHS', name: 'US Dollar', rate: '15.42 GHS', change: '-0.1% (24h)', color: 'text-rose-500' },
    { flag: '🇬🇧', pair: 'GBP / GHS', name: 'British Pound Sterling', rate: '19.87 GHS', change: '+0.1% (24h)', color: 'text-emerald-600' },
    { flag: '🇪🇺', pair: 'EUR / GHS', name: 'Euro', rate: '16.71 GHS', change: '-0.0% (24h)', color: 'text-slate-500' },
    { flag: '🇳🇬', pair: 'NGN / GHS', name: 'Nigerian Naira (100 NGN)', rate: '1.04 GHS', change: '-0.1% (24h)', color: 'text-rose-500' },
    { flag: '🇨🇳', pair: 'CNY / GHS', name: 'Chinese Yuan Renminbi', rate: '2.15 GHS', change: '+0.0% (24h)', color: 'text-slate-500' },
    { flag: '🇨🇦', pair: 'CAD / GHS', name: 'Canadian Dollar', rate: '11.32 GHS', change: '+0.0% (24h)', color: 'text-slate-500' },
    { flag: '🇿🇦', pair: 'ZAR / GHS', name: 'South African Rand', rate: '0.86 GHS', change: '-0.2% (24h)', color: 'text-rose-500' },
  ];

  const displayedPairs = tableExpanded ? cediPairs : cediPairs.slice(0, 5);

  // Multi-genre Trusted Feed: Current Affairs, Ghana Business, International Business & Entertainment
  const articles: NewsArticle[] = [
    {
      id: 'art-pol-1',
      sourceBadge: 'Citi Newsroom',
      sourceUrl: 'https://citinewsroom.com',
      category: 'current_affairs',
      categoryBadge: 'Current Affairs & Governance',
      tag: '🔴 Live Civic Policy Watch',
      title: 'Electoral Commission Releases Final Decentralized Voter Verification Schedule Across 16 Regions',
      snippet: 'The Electoral Commission of Ghana has announced dates for nationwide voter registry exhibition across all 275 parliamentary constituencies, leveraging NIA biometric identity validation.',
      fullContent: [
        'The Electoral Commission of Ghana has officially gazetted the complete operational timetable for the nationwide voter identity exhibition across all district offices and designated civic centers.',
        'According to the Commission, registered Ghanaian citizens can confirm their polling station details via automated USSD codes, web portals, or physical center visits. The Commission emphasized enhanced synchronization with National Identification Authority (NIA) Ghana Card records to eliminate duplicated entries.',
        'Civil society organizations and regional peace councils have commended the transparent release of the timetable, calling for broad civic participation.'
      ],
      keyTakeaways: [
        'Exhibition centers will operate concurrently in all 16 regions of Ghana.',
        'Voters can verify accreditation through official digital and SMS channels.',
        'NIA Ghana Card remains the bedrock biometric identity standard.'
      ],
      time: 'Live • 4 mins ago',
      image: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80',
      publishTimestamp: Date.now() - 4 * 60 * 1000,
    },
    {
      id: 'art-biz-1',
      sourceBadge: 'Bank of Ghana',
      sourceUrl: 'https://www.bog.gov.gh',
      category: 'ghana_business',
      categoryBadge: 'Ghana Business & Economy',
      tag: '⚡ USD/GHS 15.42 • BoG FX Auction Injects Liquidity',
      title: 'Bank of Ghana FX Auction: Cedi Holds Resilient at Interbank GHS 15.42/$ Amid Forward Injections',
      snippet: 'The Bank of Ghana has concluded its bi-weekly forward foreign exchange auction, injecting fresh commercial liquidity to support licensed importers and corporate inventory orders.',
      fullContent: [
        'The Bank of Ghana (BoG) successfully completed its bi-weekly foreign exchange forward auction with licensed commercial banks and authorized forex dealers.',
        'The intervention satisfied cumulative bids from oil marketing companies, pharmaceutical importers, and industrial manufacturing concerns, stabilizing the interbank bid-ask spread around GHS 15.42 per US dollar.',
        'The Central Bank reaffirmed that strong inflows from gold purchases and non-traditional exports continue to fortify sovereign gross international reserves.'
      ],
      keyTakeaways: [
        'Stable two-way quote liquidity for Ghanaian enterprise importers.',
        'Reduced volatility on bulk food and petroleum import settlements.',
        'Gross international reserves exceed $7.2 billion threshold.'
      ],
      time: 'Live • 12 mins ago',
      image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80',
      publishTimestamp: Date.now() - 12 * 60 * 1000,
    },
    {
      id: 'art-intl-1',
      sourceBadge: 'Reuters Africa',
      sourceUrl: 'https://www.reuters.com/world/africa/',
      category: 'intl_business',
      categoryBadge: 'International Business & Trade',
      tag: '🌍 Global Commodities & AfCFTA',
      title: 'Global Gold Surges Above $2,650/oz: Ghana Export Revenues Projected to Hit Record High in 2026',
      snippet: 'Bullion prices on international exchanges extended record rallies as central banks accelerate asset diversification, providing substantial foreign exchange windfalls for major African producers led by Ghana.',
      fullContent: [
        'Spot gold traded near historic peaks in London and New York trading sessions as global institutional investors and central banks continued aggressive reserve accumulations.',
        'For Ghana, Africa’s leading gold producer, the sustained valuation above $2,650 per ounce represents a major fiscal windfall. Small-scale and commercial deliveries channeled into the Bank of Ghana Domestic Gold Purchase Scheme have broken previous annualized records.',
        'Economists project the elevated export receipts will further narrow the sovereign balance-of-payments gap and stabilize the domestic Cedi.'
      ],
      keyTakeaways: [
        'Gold export earnings provide direct cushioning for national foreign reserves.',
        'Accelerated expansion of value-addition refinery hubs in Accra and Tarkwa.',
        'Boost to smallholder miner formalization under community mining schemes.'
      ],
      time: 'Live • 24 mins ago',
      image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80',
      publishTimestamp: Date.now() - 24 * 60 * 1000,
    },
    {
      id: 'art-ent-1',
      sourceBadge: 'Pulse Ghana',
      sourceUrl: 'https://www.pulse.com.gh/entertainment',
      category: 'entertainment',
      categoryBadge: 'Entertainment & Culture',
      tag: '🎵 Afrobeats & Creative Economy',
      title: 'Global Afrobeats Boom: Ghanaian Creative Artists Generate Over $150M in Worldwide Digital Streams',
      snippet: 'A comprehensive report on West African music royalties highlights how Ghanaian musicians, record producers, and festival curators are scaling global streaming charts on Spotify, Apple Music, and YouTube.',
      fullContent: [
        'Ghana’s vibrant creative arts and entertainment industry has achieved an unprecedented economic milestone, with digital streaming revenues and global touring receipts topping $150 million.',
        'Spearheaded by genre-blending Afrobeats, Highlife revivals, and Asakaa drill, artists from Accra and Kumasi are consistently headlining international festival stages across Europe, North America, and the Caribbean.',
        'The Ministry of Tourism, Arts and Culture noted that December in GH tourism initiatives will welcome over 180,000 diaspora visitors, generating significant consumer spending for local hospitality, fashion designers, and restaurants.'
      ],
      keyTakeaways: [
        'Afrobeats and Highlife streaming royalties expand by 38% year-on-year.',
        'December in GH festivals stimulate hotel, boutique, and culinary bookings.',
        'Creative industry formalization accelerates through digital copyright tracking.'
      ],
      time: 'Live • 35 mins ago',
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
      publishTimestamp: Date.now() - 35 * 60 * 1000,
    },
    {
      id: 'art-biz-2',
      sourceBadge: 'B&FT Online',
      sourceUrl: 'https://thebftonline.com',
      category: 'ghana_business',
      categoryBadge: 'Ghana Business & Economy',
      tag: '📱 Mobile Money & Digital Economy',
      title: 'Mobile Money Interoperability Crosses GHS 1.9 Trillion Benchmark in Ghana',
      snippet: 'GhIPSS releases national quarterly payment infrastructure data demonstrating exponential adoption of wallet-to-bank settlements and merchant QR payments by Ghanaian MSMEs.',
      fullContent: [
        'The Ghana Interbank Payment and Settlement Systems (GhIPSS) has revealed that domestic mobile money interoperability (MMI) transaction value reached an all-time peak of GHS 1.9 trillion.',
        'The rapid migration from physical cash to instant digital settlement has empowered hundreds of thousands of market vendors, transport operators, and artisans across Kumasi, Takoradi, Tamale, and Accra.',
        'Commercial banks and fintech aggregators are increasingly integrating with local merchant directories to offer micro-credit underwriting based on verified cash flows.'
      ],
      keyTakeaways: [
        '92% of adult Ghanaians now utilize active mobile money accounts.',
        'Merchant universal QR code transactions grew by 54% over 12 months.',
        'Accelerates formalization and tax tracking without burdensome bureaucracy.'
      ],
      time: 'Live • 1 hour ago',
      image: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=800&q=80',
      publishTimestamp: Date.now() - 60 * 60 * 1000,
    },
    {
      id: 'art-pol-2',
      sourceBadge: 'Graphic Online',
      sourceUrl: 'https://www.graphic.com.gh',
      category: 'current_affairs',
      categoryBadge: 'Current Affairs & Governance',
      tag: '🏗️ Transport & Urban Corridor',
      title: 'Ministry of Roads Commissions Accra-Tema Motorway Dualization Expansion Project Phase 1',
      snippet: 'Heavy civil engineering equipment mobilized as government commences ten-lane expansion of the vital commercial corridor connecting the port city of Tema to the capital.',
      fullContent: [
        'The Ministry of Roads and Highways has formally flagged off active construction on Phase 1 of the comprehensive Accra-Tema Motorway expansion and rehabilitation project.',
        'The modernized ten-lane highway will feature dedicated transit lanes, grade-separated flyovers at key roundabouts, and pedestrian footbridges designed to alleviate daily industrial bottlenecks between the Tema industrial harbor and central commercial districts.',
        'Local haulage and logistics associations have lauded the development as a transformative boon for freight delivery efficiency.'
      ],
      keyTakeaways: [
        'Critical relief for daily port freight traffic and commuter congestion.',
        'Incorporates modern drainage and solar-powered smart highway lighting.',
        'Generates over 2,500 direct engineering and construction jobs.'
      ],
      time: 'Live • 2 hours ago',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
      publishTimestamp: Date.now() - 120 * 60 * 1000,
    },
    {
      id: 'art-ent-2',
      sourceBadge: 'GhanaWeb',
      sourceUrl: 'https://www.ghanaweb.com/GhanaHomePage/entertainment',
      category: 'entertainment',
      categoryBadge: 'Entertainment & Culture',
      tag: '🎭 National Arts & Tourism',
      title: 'National Theatre and UNESCO Partner on Digital Archiving of Classical Ghanaian Folklore and Highlife Masterpieces',
      snippet: 'A multi-million cedi cultural preservation initiative is digitizing rare audio recordings, theatre plays, and historical highlife vinyls from the 1950s to modern times.',
      fullContent: [
        'The National Theatre of Ghana, in partnership with UNESCO’s cultural division, has inaugurated a digital heritage laboratory in Accra dedicated to preserving the nation’s rich performing arts history.',
        'Scholars and sound engineers are remastering original master tapes from iconic highlife legends, folklore theatre dramas, and traditional dance ensembles from across all Ghanaian regions.',
        'The public digital archive will be accessible to schools, university researchers, and worldwide cultural historians.'
      ],
      keyTakeaways: [
        'Over 10,000 historical musical works and plays digitized in high fidelity.',
        'Free educational access for schools and universities nationwide.',
        'Protects indigenous intellectual property and artistic legacies.'
      ],
      time: 'Live • 3 hours ago',
      image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
      publishTimestamp: Date.now() - 180 * 60 * 1000,
    },
    {
      id: 'art-intl-2',
      sourceBadge: 'Bloomberg Africa',
      sourceUrl: 'https://www.bloomberg.com/africa',
      category: 'intl_business',
      categoryBadge: 'International Business & Trade',
      tag: '📊 African Capital Markets',
      title: 'West African Sovereign Debt Yields Tighten as Fiscal Consolidation and AfCFTA Trade Gain Momentum',
      snippet: 'International institutional investors return to West African sovereign and corporate debt instruments, drawn by improved fiscal balances and expanding cross-border commercial trade.',
      fullContent: [
        'Sovereign Eurobond yields across key West African economies recorded marked compression this week, reflecting renewed international risk appetite for African debt instruments.',
        'Investors cited ongoing fiscal discipline, improved non-oil tax mobilization, and the operational rollout of the Pan-African Payment and Settlement System (PAPSS) as strong stabilizing factors.',
        'Portfolio managers note that West African corporate issuers are poised to tap regional capital markets at increasingly competitive interest coupons.'
      ],
      keyTakeaways: [
        'Yield spread narrowing reduces long-term commercial borrowing costs.',
        'Strengthening of African regional trade settlement corridors.',
        'Renewed international appetite for domestic currency bonds.'
      ],
      time: 'Live • 4 hours ago',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
      publishTimestamp: Date.now() - 240 * 60 * 1000,
    },
    {
      id: 'art-gse-1',
      sourceBadge: 'GSE Market Watch',
      sourceUrl: 'https://gse.com.gh',
      category: 'ghana_business',
      categoryBadge: 'Ghana Business & Economy',
      tag: '📈 Equities & Capital Formation',
      title: 'Ghana Stock Exchange Composite Index Advances +1.28% Driven by Telecom & Banking Blue-Chip Equities',
      snippet: 'Strong corporate earnings and steady retail trading volumes propelled the Ghana Stock Exchange (GSE-CI) higher, cementing Accra as one of Africa’s top performing equity exchanges.',
      fullContent: [
        'The Ghana Stock Exchange (GSE) composite benchmark index sustained positive momentum, closing higher on heavy institutional buy orders for banking and telecommunication leaders.',
        'Brokers attributed the bull run to resilient dividend yields, prudent treasury yield management by the Central Bank, and growing retail participation via mobile trading apps.',
        'The GSE Council highlighted ongoing plans to facilitate cross-border listings and dual-trading corridors under the AfCFTA capital markets framework.'
      ],
      keyTakeaways: [
        'GSE Composite Index posts solid year-to-date capital growth.',
        'Banking equities lead dividend announcements and transaction volume.',
        'Fintech integrations broaden everyday retail investor onboarding.'
      ],
      time: 'Live • 5 hours ago',
      image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80',
      publishTimestamp: Date.now() - 300 * 60 * 1000,
    }
  ];

  const filterTabs = [
    { id: 'all', label: 'All Updates', icon: Sparkles },
    { id: 'current_affairs', label: 'Current Affairs', icon: Flame },
    { id: 'ghana_business', label: 'Ghana Business', icon: Coins },
    { id: 'intl_business', label: 'International Business', icon: Globe2 },
    { id: 'entertainment', label: 'Entertainment & Arts', icon: Tv },
  ];

  const filteredArticles = articles.filter((a) => {
    if (selectedFilter !== 'all' && a.category !== selectedFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        a.title.toLowerCase().includes(q) ||
        a.snippet.toLowerCase().includes(q) ||
        a.sourceBadge.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // ========================================================
  // VIEW 1: DEDICATED ARTICLE READING PAGE LAYOUT (Image 4)
  // Laying directly on background (No card beneath, no modal)
  // ========================================================
  if (activeReadingArticle) {
    const isLiked = likedArticles.includes(activeReadingArticle.id);

    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 transition-colors">
        
        {/* Navigation & Header directly on background */}
        <div className="space-y-4">
          <button
            onClick={() => setActiveReadingArticle(null)}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to News & FX Desk</span>
          </button>

          {/* Source and Category Badges */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-600 text-white">
              {activeReadingArticle.categoryBadge}
            </span>
            <a
              href={activeReadingArticle.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 flex items-center gap-1 transition-colors"
            >
              <span>{activeReadingArticle.sourceBadge}</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>
            <span className="text-xs text-slate-400 dark:text-slate-500">
              • {activeReadingArticle.time}
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            {activeReadingArticle.title}
          </h1>

          {/* Hero Image */}
          <div className="w-full h-64 sm:h-80 rounded-3xl overflow-hidden shadow-sm">
            <img 
              src={activeReadingArticle.image} 
              alt={activeReadingArticle.title} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Article Full Narrative Content laying on the background */}
        <div className="space-y-4 text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed pt-2">
          {activeReadingArticle.fullContent.map((paragraph, idx) => (
            <p key={idx} className="leading-relaxed">
              {paragraph}
            </p>
          ))}

          {/* Key Points & Takeaways Block */}
          <div className="p-5 rounded-2xl bg-blue-50/80 dark:bg-slate-800/80 border border-blue-100 dark:border-slate-700 my-6 space-y-3">
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-bold text-xs uppercase tracking-wider">
              <FileText className="w-4 h-4" />
              <span>KEY POINTS & TAKEAWAYS</span>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              {activeReadingArticle.keyTakeaways.map((point, kIdx) => (
                <li key={kIdx} className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Outbound Verified Actions */}
        <div className="pt-4 border-t border-slate-200/80 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <a
              href={activeReadingArticle.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <span>Read Original on {activeReadingArticle.sourceBadge}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={() => toggleLike(activeReadingArticle.id)}
              className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                isLiked
                  ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-500 border-rose-200 dark:border-rose-900'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
              title={isLiked ? 'Remove saved' : 'Save story'}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={() => handleShareArticle(activeReadingArticle)}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
              title="Share article link"
            >
              <Share2 className="w-4 h-4" />
            </button>
            {copiedShare && (
              <span className="text-xs font-bold text-emerald-600">Copied!</span>
            )}
          </div>

          <button
            onClick={() => setActiveReadingArticle(null)}
            className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            Return to News Desk
          </button>
        </div>

        {/* Footer with tightened spacing (Image 2 fix) */}
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
  }

  // ========================================================
  // VIEW 2: MAIN NEWS & FX DESK
  // ========================================================
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 transition-colors">
      
      {/* Real-time Ticker & Header */}
      <div>
        {/* Live Second-by-Second Pulse Banner */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-2xl bg-blue-50/80 dark:bg-slate-800/90 border border-blue-100 dark:border-slate-700/60 mb-3 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="font-bold text-slate-800 dark:text-slate-100">
              Live Feed: Updated {secondsAgo}s ago
            </span>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <span className="text-[11px] font-mono text-blue-700 dark:text-blue-300 font-bold px-2 py-0.5 rounded-md bg-white dark:bg-slate-700">
              {currentGmtTime || 'Syncing...'}
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:inline">
              (Auto-sync active every 1s)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleManualSync}
              disabled={isRefreshing}
              className="px-2 py-1 rounded-lg bg-white dark:bg-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-200 text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              title="Force sync now"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
              <span>Sync Now</span>
            </button>
          </div>
        </div>

        {/* Live Rotating Headline Wire */}
        <div className="px-3.5 py-2 rounded-xl bg-slate-100/90 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center gap-2 text-xs mb-3 overflow-hidden">
          <span className="px-2 py-0.5 rounded-md bg-blue-600 text-white font-black text-[9px] uppercase tracking-wider shrink-0">
            FLASH WIRE
          </span>
          <span className="font-medium text-slate-700 dark:text-slate-300 truncate text-[11px] sm:text-xs">
            {breakingAlerts[tickerIndex]}
          </span>
        </div>

        <div className="text-blue-600 dark:text-blue-400 text-[11px] font-black uppercase tracking-wider mb-1">
          GHANA COMMERCIAL & MULTI-GENRE INTELLIGENCE DESK
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          News, Current Affairs & Live FX Hub
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Real-time Bank of Ghana benchmarks, currency calculator, Ghanaian current affairs, international business, and entertainment news synced to trusted news organizations.
        </p>

        {/* Action Buttons Row */}
        <div className="mt-4 flex items-center gap-3">
          {onBackToExplore && !isFrontPage && (
            <button
              onClick={onBackToExplore}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Discovery</span>
            </button>
          )}

          <button
            onClick={handleManualSync}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <RotateCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh Feeds</span>
          </button>
        </div>
      </div>

      {/* CARD 1: LIVE GHANA CEDI (GHS) CURRENCY CONVERTER */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700 p-5 sm:p-6 shadow-xs space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black text-base">
              GH₵
            </span>
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
              Live Ghana Cedi (GHS) Currency Converter
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Calculate conversions using official Bank of Ghana mid-rates updated second-by-second.
          </p>
        </div>

        {/* Rate Benchmark */}
        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
            Rate Benchmark:
          </label>
          <select
            value={benchmark}
            onChange={(e) => setBenchmark(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-hidden"
          >
            <option value="Interbank (BoG)">Interbank (BoG) Official Mid-Rate</option>
            <option value="Commercial Bank Average">Commercial Bank Average</option>
            <option value="Forex Bureau Index">Forex Bureau Index</option>
          </select>
        </div>

        {/* Amount to Convert */}
        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
            Amount to Convert
          </label>
          <input
            type="number"
            min="1"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full px-4 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl text-sm font-bold text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-600"
          />
        </div>

        {/* Currency selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 items-center">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              From Currency
            </label>
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-hidden"
            >
              <option value="USD">🇺🇸 USD (US Dollar)</option>
              <option value="GBP">🇬🇧 GBP (British Pound)</option>
              <option value="EUR">🇪🇺 EUR (Euro)</option>
              <option value="GHS">🇬🇭 GHS (Ghana Cedi)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              To Currency
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSwap}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-blue-600 cursor-pointer"
                title="Swap currencies"
              >
                <ArrowUpDown className="w-4 h-4" />
              </button>
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="flex-1 px-3.5 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-hidden"
              >
                <option value="GHS">🇬🇭 GHS (Ghana Cedi)</option>
                <option value="USD">🇺🇸 USD (US Dollar)</option>
                <option value="GBP">🇬🇧 GBP (British Pound)</option>
                <option value="EUR">🇪🇺 EUR (Euro)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Quick amounts row */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-xs font-bold text-slate-500 mr-1">Quick:</span>
          {[50, 100, 500, 1000, 5000].map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => {
                setQuickAmount(val);
                setAmount(val);
              }}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                quickAmount === val
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              +{val}
            </button>
          ))}
        </div>

        {/* Computed Result Box */}
        <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-slate-750/50 border border-blue-100 dark:border-slate-700">
          <span className="text-xs text-slate-600 dark:text-slate-400 font-medium block">
            {amount} {fromCurrency} equals
          </span>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400 tracking-tight mt-0.5">
            {calculateTotal()} {toCurrency}
          </div>
          <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-0.5">
            1 {fromCurrency} = 15.4200 {toCurrency} (Live Mid Rate)
          </div>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-0.5">
            Calculated via official Bank of Ghana reference feed • Synced every second
          </span>
        </div>

        {/* Major Cedi Pairs table */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-700 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                MAJOR CEDI PAIRS
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
              Live Mid Rate
            </span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {displayedPairs.map((p) => (
              <div key={p.pair} className="py-2 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-base">{p.flag}</span>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">{p.pair}</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 block">{p.name}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-bold text-slate-900 dark:text-white block">{p.rate}</span>
                  <span className={`text-[10px] font-semibold ${p.color}`}>{p.change}</span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setTableExpanded(!tableExpanded)}
            className="w-full py-2 rounded-xl bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
          >
            <span>{tableExpanded ? 'Collapse Table' : 'Expand All Currencies Table'}</span>
            {tableExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* CARD 2: MACROECONOMIC BENCHMARKS */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700 p-5 sm:p-6 shadow-xs space-y-3">
        <div>
          <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
            Ghana Macroeconomic Benchmarks
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Bank of Ghana monetary policy anchors, inflation indicators, and sovereign financial metrics.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-700/60 border border-slate-200/80 dark:border-slate-700">
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block">BoG Policy Rate</span>
            <div className="text-xl font-black text-slate-900 dark:text-white mt-0.5">27.0%</div>
            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 mt-0.5 block">Central Anchor</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-700/60 border border-slate-200/80 dark:border-slate-700">
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block">Headline Inflation</span>
            <div className="text-xl font-black text-slate-900 dark:text-white mt-0.5">20.4%</div>
            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 mt-0.5 block">GSS CPI</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-700/60 border border-slate-200/80 dark:border-slate-700">
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block">GSE Composite</span>
            <div className="text-xl font-black text-slate-900 dark:text-white mt-0.5">4,328.5</div>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block">+1.28% YTD</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-700/60 border border-slate-200/80 dark:border-slate-700">
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block">Gold Spot (USD)</span>
            <div className="text-xl font-black text-slate-900 dark:text-white mt-0.5">$2,654</div>
            <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 mt-0.5 block">Record High</span>
          </div>
        </div>
      </div>

      {/* CARD 3: CURATED MULTI-GENRE INTELLIGENCE FEED */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700 p-5 sm:p-6 shadow-xs space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-blue-600 animate-pulse" />
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
              Live National & Global News Desk
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Updated every second across Current Affairs, Ghana Business, International Markets, and Entertainment. Synced to verified publishers.
          </p>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search news, topics, keywords (e.g. Cedi, Gold, Motorway, Afrobeats)..."
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-hidden focus:border-blue-600"
          />
        </div>

        {/* 5 Genre Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {filterTabs.map((t) => {
            const Icon = t.icon;
            const isActive = selectedFilter === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setSelectedFilter(t.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Article Feed Cards */}
        <div className="space-y-4 pt-1">
          {filteredArticles.map((art) => (
            <div 
              key={art.id}
              className="rounded-3xl border border-slate-200/80 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-800/90 hover:border-blue-400 dark:hover:border-blue-500 transition-all shadow-2xs group"
            >
              {/* Image banner with overlay badges */}
              <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                <img 
                  src={art.image} 
                  alt={art.title} 
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300 opacity-90"
                />
                <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2">
                  <a
                    href={art.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="px-2.5 py-1 rounded-md text-[10px] font-black bg-black/80 hover:bg-black text-white backdrop-blur-xs flex items-center gap-1 transition-colors"
                  >
                    <span>{art.sourceBadge}</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-black bg-blue-600 text-white backdrop-blur-xs">
                    {art.categoryBadge}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 sm:p-5 space-y-2">
                {art.tag && (
                  <span className="inline-block text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2.5 py-0.5 rounded-md">
                    {art.tag}
                  </span>
                )}

                <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {art.title}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                  {art.snippet}
                </p>

                {/* Footer action bar */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-blue-500" />
                    <span>{art.time}</span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <button 
                      onClick={() => toggleLike(art.id)}
                      className={`p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-colors ${
                        likedArticles.includes(art.id) ? 'text-rose-500 fill-rose-500' : 'text-slate-400'
                      }`}
                      title={likedArticles.includes(art.id) ? 'Remove saved story' : 'Bookmark story'}
                    >
                      <Heart className={`w-4 h-4 ${likedArticles.includes(art.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>

                    {/* Direct verified link to trusted news source */}
                    <a
                      href={art.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold text-[11px] flex items-center gap-1 transition-colors"
                      title={`Visit official article on ${art.sourceBadge}`}
                    >
                      <span>{art.sourceBadge.split(' ')[0]}</span>
                      <ExternalLink className="w-3 h-3 text-slate-500" />
                    </a>

                    {/* Open full article reader page */}
                    <button 
                      onClick={() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        setActiveReadingArticle(art);
                      }}
                      className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>Read Story</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer with tightened spacing (Image 2 fix) */}
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
