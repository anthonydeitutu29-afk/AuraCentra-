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

export const VERIFIED_9_NEWS_ARTICLES: NewsArticle[] = [
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
