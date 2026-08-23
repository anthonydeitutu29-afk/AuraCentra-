import { GhanaNewsArticle, ForexRate, GhanaMarketSummary } from '../types';

export const TODAY_FOREX_RATES: ForexRate[] = [
  {
    currencyCode: 'USD',
    currencyName: 'US Dollar',
    flag: '🇺🇸',
    interbankBuy: 15.42,
    interbankSell: 15.44,
    bureauBuy: 15.65,
    bureauSell: 15.85,
    change24h: -0.08,
    trend: 'stable',
    lastUpdated: 'Today at 09:30 GMT (Bank of Ghana Bulletin)',
  },
  {
    currencyCode: 'GBP',
    currencyName: 'British Pound Sterling',
    flag: '🇬🇧',
    interbankBuy: 19.85,
    interbankSell: 19.88,
    bureauBuy: 20.10,
    bureauSell: 20.35,
    change24h: +0.14,
    trend: 'up',
    lastUpdated: 'Today at 09:30 GMT (Bank of Ghana Bulletin)',
  },
  {
    currencyCode: 'EUR',
    currencyName: 'Euro',
    flag: '🇪🇺',
    interbankBuy: 16.70,
    interbankSell: 16.73,
    bureauBuy: 16.95,
    bureauSell: 17.15,
    change24h: -0.04,
    trend: 'stable',
    lastUpdated: 'Today at 09:30 GMT (Bank of Ghana Bulletin)',
  },
  {
    currencyCode: 'NGN',
    currencyName: 'Nigerian Naira (100 NGN)',
    flag: '🇳🇬',
    interbankBuy: 1.02,
    interbankSell: 1.05,
    bureauBuy: 0.98,
    bureauSell: 1.08,
    change24h: -0.15,
    trend: 'down',
    lastUpdated: 'Today at 09:30 GMT (Forex Bureaux Average)',
  },
  {
    currencyCode: 'CNY',
    currencyName: 'Chinese Yuan Renminbi',
    flag: '🇨🇳',
    interbankBuy: 2.14,
    interbankSell: 2.16,
    bureauBuy: 2.20,
    bureauSell: 2.28,
    change24h: +0.02,
    trend: 'stable',
    lastUpdated: 'Today at 09:30 GMT (Bank of Ghana Bulletin)',
  },
  {
    currencyCode: 'CAD',
    currencyName: 'Canadian Dollar',
    flag: '🇨🇦',
    interbankBuy: 11.25,
    interbankSell: 11.28,
    bureauBuy: 11.45,
    bureauSell: 11.65,
    change24h: +0.06,
    trend: 'up',
    lastUpdated: 'Today at 09:30 GMT (Forex Bureaux Average)',
  },
];

export const TODAY_MARKET_SUMMARY: GhanaMarketSummary = {
  bogPolicyRate: 27.0,
  headlineInflation: 20.4,
  gseCompositeIndex: 4328.45,
  gseChange: +1.28,
  crudeOilBrent: 78.60,
  cocoaPerTonne: 8420.0,
  goldPerOunce: 2510.5,
  lastRefreshed: 'August 2026 Live Market Feed',
};

export const GHANA_BUSINESS_NEWS_ARTICLES: GhanaNewsArticle[] = [
  {
    id: 'gh-news-01',
    title: 'Bank of Ghana FX Auction: Cedi Holds Resilient at Interbank GHS 15.42/$ Amid Fresh Remittance Inflows',
    slug: 'bog-fx-auction-cedi-holds-resilient-interbank-market',
    excerpt: 'The Bank of Ghana (BoG) has concluded its bi-weekly forward foreign exchange auction, injecting fresh liquidity to meet commercial demand from bulk oil distributors and FMCG importers.',
    content: `The Bank of Ghana (BoG) has reported that the Ghana Cedi demonstrated steady stability across both interbank and licensed forex bureau markets this week, anchored by robust gold export receipts and increased diaspora remittance transfers processed through certified digital payment channels.

According to the central bank's Financial Markets Department, the interbank benchmark midpoint pegged the US Dollar at GHS 15.43, while the British Pound traded around GHS 19.86 and the Euro held at GHS 16.71.

Financial analysts at Databank and IC Securities noted that the foreign exchange market is benefiting from the BoG’s Domestic Gold Purchase Programme (DGPP), which has substantially boosted gross international reserves to exceed 3.2 months of import cover. Importers in Accra and Kumasi are reporting smoother foreign currency allocations for raw materials and industrial inputs, reducing volatility in consumer goods pricing.`,
    keyTakeaways: [
      'Interbank USD/GHS rate holding firmly near GHS 15.42 - GHS 15.44.',
      'Bank of Ghana Domestic Gold Purchase Programme strengthens national FX reserves.',
      'Smooth forex pipeline easing input cost pressures for Ghanaian manufacturing SMEs.',
      'Diaspora remittance inflows hit new quarterly high via mobile money settlement rails.'
    ],
    category: 'forex_fx',
    categoryLabel: 'Foreign Exchange & FX',
    source: 'Bank of Ghana',
    sourceUrl: 'https://www.bog.gov.gh',
    author: 'BoG Financial Markets Department / Joy Business',
    publishedAt: 'Today, 08:45 GMT',
    readTime: '3 min read',
    coverImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
    isBreaking: true,
    isTrending: true,
    fxHighlight: 'USD/GHS 15.42 • BoG FX Auction Injects Liquidity',
    views: 4820,
    likes: 312,
    tags: ['Bank of Ghana', 'Forex', 'Cedi Exchange Rate', 'Monetary Policy', 'Economy'],
  },
  {
    id: 'gh-news-02',
    title: 'Ghana Stock Exchange Composite Index Rallies 1.28% Driven by Strong Banking & Energy Earnings',
    slug: 'gse-composite-index-rallies-banking-energy-earnings',
    excerpt: 'The Ghana Stock Exchange (GSE) Composite Index posted another day of positive gains, with GCB Bank, Ecobank Ghana, and GOIL leading trading volume on the Accra bourse.',
    content: `Trading activity on the Ghana Stock Exchange (GSE) ended on a buoyant note as investor confidence in listed financial institutions and downstream energy distributors surged following stellar mid-year financial disclosures.

The GSE Composite Index climbed by 1.28% to close at 4,328.45 points, generating a year-to-date return that ranks among the top performers on the African continent. Market capitalization surpassed GHS 85.4 billion.

Market analysts from Stanbic Investment Management Services highlighted that institutional pension funds and offshore portfolio investors are actively re-entering the Ghanaian equity market, attracted by attractive dividend yields and resilient corporate balance sheets in the post-debt restructuring era.`,
    keyTakeaways: [
      'GSE Composite Index gains 1.28% to reach 4,328.45 points.',
      'Total market capitalization crosses GHS 85.4 Billion milestone.',
      'Banking equities (GCB, ETI, Standard Chartered) witness double-digit capital appreciation.',
      'Local pension funds accelerate portfolio allocation into Ghanaian listed equities.'
    ],
    category: 'banking_economy',
    categoryLabel: 'Banking & Capital Markets',
    source: 'Joy Business',
    sourceUrl: 'https://www.myjoyonline.com/business',
    author: 'George Wiafe, Joy Business Lead',
    publishedAt: 'Today, 10:15 GMT',
    readTime: '4 min read',
    coverImage: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=80',
    isTrending: true,
    views: 3410,
    likes: 198,
    tags: ['GSE', 'Stocks', 'Accra Bourse', 'Banking', 'Capital Markets'],
  },
  {
    id: 'gh-news-03',
    title: 'AfCFTA Secretariat in Accra Expands PAPSS Settlement to 1,200 Ghanaian Small Exporters',
    slug: 'afcfta-secretariat-accra-expands-papss-ghanaian-exporters',
    excerpt: 'The Pan-African Payment and Settlement System (PAPSS) headquartered in Accra has integrated 14 Ghanaian commercial banks to allow direct local currency trade with Nigeria, Kenya, and Côte d’Ivoire.',
    content: `Ghanaian cross-border merchants, agribusiness exporters, and light manufacturers can now conclude intra-African export sales in Ghana Cedis without requiring third-party international currency conversions, as the African Continental Free Trade Area (AfCFTA) Secretariat accelerated the rollout of PAPSS.

Speaking at the Accra International Conference Centre, the AfCFTA Secretary-General noted that the system eliminates transaction fees estimated at over $5 billion annually across the continent. 

Ghanaian enterprises producing shea butter, processed cocoa, garments, and plastic products in Greater Accra, Ashanti, and Western regions are already executing rapid same-day trade settlements directly with buyers in Lagos, Abidjan, and Kigali.`,
    keyTakeaways: [
      'Ghanaian traders can now pay and receive funds in Ghana Cedis across 14 African nations.',
      'Zero USD intermediation required for certified intra-African commodity exports.',
      '14 Ghanaian commercial banks fully onboarded onto the real-time PAPSS network.',
      'Significant cost savings and faster clearing for local manufacturers.'
    ],
    category: 'trade_afcfta',
    categoryLabel: 'AfCFTA & International Trade',
    source: 'Citi Business News',
    sourceUrl: 'https://citibusinessnews.com',
    author: 'Norvan Acquah-Hayford, Citi Business',
    publishedAt: 'Today, 07:30 GMT',
    readTime: '5 min read',
    coverImage: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80',
    isBreaking: false,
    isTrending: true,
    views: 2950,
    likes: 245,
    tags: ['AfCFTA', 'PAPSS', 'Export Trade', 'Made in Ghana', 'West Africa'],
  },
  {
    id: 'gh-news-04',
    title: 'Bank of Ghana Reports Mobile Money Transactions Reached GHS 1.9 Trillion in Milestone Quarter',
    slug: 'bog-momo-transactions-ghs-1-9-trillion-fintech-milestone',
    excerpt: 'Ghana’s digital payments revolution continues rapid expansion as mobile money interoperability transactions cross record highs, cementing Ghana’s status as Africa’s cash-lite leader.',
    content: `Ghana has solidified its position as one of the fastest-growing mobile payments ecosystems globally, with the Bank of Ghana’s Summary of Economic and Financial Data revealing that total mobile money transaction values surpassed GHS 1.9 trillion over the latest tracked period.

Mobile money interoperability (MMI), managed by the Ghana Interbank Payment and Settlement Systems (GhIPSS), recorded massive uptake in business-to-business (B2B) supplier payments and QR-code retail collections across urban and rural markets.

The expansion is driving formal financial inclusion for over 21 million active registered accounts, creating new credit scoring opportunities for micro, small, and medium enterprises (MSMEs) through automated lending algorithms.`,
    keyTakeaways: [
      'Total MoMo transaction volume hits unprecedented GHS 1.9 Trillion mark.',
      'Over 21 Million active registered mobile money accounts in Ghana.',
      'B2B merchant collections through interoperable QR codes grew by 38% year-on-year.',
      'Fintechs and micro-lenders leveraging digital transaction footprints to offer SME loans.'
    ],
    category: 'tech_telecoms',
    categoryLabel: 'Fintech & Telecoms',
    source: 'B&FT',
    sourceUrl: 'https://thebftonline.com',
    author: 'Ebenezer Chike Adjei, Business & Financial Times',
    publishedAt: 'Today, 06:15 GMT',
    readTime: '4 min read',
    coverImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
    views: 4120,
    likes: 388,
    tags: ['Mobile Money', 'Fintech', 'GhIPSS', 'Bank of Ghana', 'Digital Economy'],
  },
  {
    id: 'gh-news-05',
    title: 'GRA Digital E-Invoicing & Tax Incentive Portal Launched to Support Ghanaian Small Businesses',
    slug: 'gra-digital-e-invoicing-tax-incentive-sme-portal',
    excerpt: 'The Ghana Revenue Authority (GRA) has introduced an upgraded electronic invoicing system featuring streamlined VAT withholding exemptions for registered Ghanaian enterprises.',
    content: `In a bid to broaden the formal tax base while reducing administrative compliance burdens on emerging businesses, the Ghana Revenue Authority (GRA) has rolled out the next phase of its digital E-VAT and E-Invoicing platform.

The system allows registered business owners to generate verifiable digital tax invoices with QR verification codes instantly from their smartphones or point-of-sale terminals.

GRA officials confirmed that verified businesses operating with compliant digital records will access fast-track tax clearance certificates (TCCs), qualifying them for government procurement contracts and subsidized development bank credit facilities.`,
    keyTakeaways: [
      'Streamlined E-VAT invoice generation via mobile app and browser portal.',
      'Instant issuance of Tax Clearance Certificates for verified registered businesses.',
      'Exemption from manual audit delays for businesses adopting digital accounting.',
      'Direct linkage with government procurement tender eligibility criteria.'
    ],
    category: 'smes_startups',
    categoryLabel: 'SMEs & Enterprise Growth',
    source: 'Graphic Business',
    sourceUrl: 'https://www.graphic.com.gh/business',
    author: 'Kofi Yeboah, Graphic Business',
    publishedAt: 'Yesterday, 16:40 GMT',
    readTime: '3 min read',
    coverImage: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80',
    views: 2180,
    likes: 154,
    tags: ['GRA', 'Taxes', 'SMEs', 'Business Registration', 'Compliance'],
  },
  {
    id: 'gh-news-06',
    title: 'COCOBOD & Ministry of Food and Agriculture Unveil $200M Agro-Processing Support Fund',
    slug: 'cocobod-mofa-200m-agro-processing-fund-cocoa-export',
    excerpt: 'A new multi-stakeholder facility has been finalized to finance domestic cocoa and cashew value-addition factories across the Western North, Ashanti, and Bono regions.',
    content: `Ghana Cocoa Board (COCOBOD) in conjunction with the Ministry of Food and Agriculture has announced a landmark $200 million financing program to accelerate local cocoa processing and confectionery manufacturing.

The initiative aims to transition Ghana from exporting raw cocoa beans to capturing higher margins in the global $140 billion finished chocolate and cocoa butter value chain.

Under the program, local indigenous food processing companies can access concessionary capital at single-digit interest rates for modern industrial drying, grinding, packaging, and export logistics equipment.`,
    keyTakeaways: [
      '$200 Million facility designated exclusively for indigenous agro-processors.',
      'Focus on value addition for cocoa, cashew, palm oil, and shea butter.',
      'Single-digit concessionary loan rates underwritten by development partners.',
      'Projected to generate over 12,000 direct manufacturing jobs across Ghana.'
    ],
    category: 'energy_commodities',
    categoryLabel: 'Agriculture & Commodities',
    source: 'GhanaWeb Business',
    sourceUrl: 'https://www.ghanaweb.com/GhanaHomePage/business',
    author: 'Isaac Kwame, GhanaWeb Business Desk',
    publishedAt: 'Yesterday, 14:10 GMT',
    readTime: '4 min read',
    coverImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
    views: 2640,
    likes: 187,
    tags: ['COCOBOD', 'Cocoa', 'Agribusiness', 'Manufacturing', 'Exports'],
  },
];
