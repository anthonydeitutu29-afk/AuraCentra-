import { Business, Category, BusinessReview } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'restaurants',
    name: 'Restaurants & Eateries',
    slug: 'restaurants',
    iconName: 'UtensilsCrossed',
    description: 'Authentic Ghanaian cuisines, continental restaurants, executive chops bars, and rooftop lounges.',
    itemCount: 18,
    featuredImageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'automotive',
    name: 'Automotive & Repairs',
    slug: 'automotive',
    iconName: 'Car',
    description: 'Computerized OBD diagnostics, genuine OEM auto spare parts importers, air conditioning servicing, and car rentals.',
    itemCount: 14,
    featuredImageUrl: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'construction',
    name: 'Building Materials & Civil Hardware',
    slug: 'construction',
    iconName: 'Hammer',
    description: 'Civil engineering contractors, aluminum glazing fabricators, cement suppliers, steel rods, and electrical rewiring experts.',
    itemCount: 16,
    featuredImageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'digital-marketing',
    name: 'Digital Marketing & Growth',
    slug: 'digital-marketing',
    iconName: 'Sparkles',
    description: 'Digital marketing, SEO optimization, social media advertising, custom web development, and business acceleration.',
    itemCount: 12,
    featuredImageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'fashion',
    name: 'Fashion & Bespoke Tailoring',
    slug: 'fashion',
    iconName: 'Shirt',
    description: 'Bespoke Bonwire Kente weaving, Northern smock tailoring, modern Afrocentric couture, and ready-to-wear styling.',
    itemCount: 15,
    featuredImageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'technology',
    name: 'Technology & Cloud Solutions',
    slug: 'technology',
    iconName: 'Laptop',
    description: 'IT consulting, Mobile Money fintech integration, cloud engineering, cybersecurity, and hardware repair centres.',
    itemCount: 20,
    featuredImageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'real-estate',
    name: 'Real Estate & Housing',
    slug: 'real-estate',
    iconName: 'Building2',
    description: 'Luxury apartments for rent, commercial offices, verified titled land sales, and facility management.',
    itemCount: 11,
    featuredImageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'healthcare',
    name: 'Healthcare & Diagnostics',
    slug: 'healthcare',
    iconName: 'HeartPulse',
    description: 'Specialist hospitals, diagnostic ultrasound labs, dental clinics, 24/7 licensed pharmacies, and wellness centers.',
    itemCount: 9,
    featuredImageUrl: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'professional-services',
    name: 'Professional & Legal Hub',
    slug: 'professional-services',
    iconName: 'Briefcase',
    description: 'Chartered accountants, corporate legal consultants, immigration specialists, and translation agencies.',
    itemCount: 8,
    featuredImageUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80'
  }
];

export const INITIAL_BUSINESSES: Business[] = [
  // 1. Zion City Restaurant (from user design screenshot)
  {
    id: 'biz-zion-city',
    name: 'Zion City Restaurant',
    tagline: 'Authentic Ghanaian Dishes & Continental Gourmet Dining in Osu',
    slug: 'zion-city-restaurant',
    category: 'restaurants',
    description: 'Zion City Restaurant is an iconic culinary destination located in the heart of Osu, Accra. We specialize in authentic Ghanaian classics including fragrant smoky party jollof rice, tender grilled tilapia with banku, groundnut soup, alongside continental pastas and chef specials. Our open garden patio and executive indoor lounge provide the perfect atmosphere for corporate lunches, romantic dinners, and family gatherings.',
    logo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=300&q=80',
    coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80'
    ],
    phone: '0302789123',
    whatsapp: '233302789123',
    email: 'reservations@zioncityrestaurant.com',
    website: 'https://zioncityrestaurant.com',
    city: 'Accra',
    region: 'Greater Accra',
    address: 'Oxford Street, Osu, Accra, Ghana',
    digitalAddress: 'GA-082-9102',
    coordinates: { lat: 5.5560, lng: -0.1834 },
    priceLevel: '$$',
    rating: 4.9,
    reviewCount: 34,
    verificationStatus: 'verified',
    listingStatus: 'active',
    verificationDetails: {
      verifiedAt: '2025-01-15T10:00:00.000Z',
      tinNumber: 'TIN-GH-778210',
      businessRegNumber: 'BN-GH-2023-8812',
      badgeType: 'Gold Enterprise',
      verifiedByAdmin: 'Executive Desk',
      gpsVerified: true
    },
    openingHours: {
      monday: '09:00 - 23:00',
      tuesday: '09:00 - 23:00',
      wednesday: '09:00 - 23:00',
      thursday: '09:00 - 23:00',
      friday: '09:00 - 01:00',
      saturday: '10:00 - 01:00',
      sunday: '11:00 - 22:00'
    },
    services: ['Continental Dining', 'Authentic Local Dishes', 'Cocktail Lounge', 'Executive Catering', 'Private Events'],
    features: ['Air Conditioned', 'Free WiFi', 'GhanaPost GPS Verified', 'Outdoor Seating', 'MoMo & Card Accepted'],
    views: 1420,
    leadsCount: 88,
    createdAt: '2025-01-10T08:00:00.000Z',
    updatedAt: '2025-02-20T12:00:00.000Z'
  },

  // 2. Veritas Motors Ltd. (from user design screenshot)
  {
    id: 'biz-veritas-motors',
    name: 'Veritas Motors Ltd.',
    tagline: 'Computerized Auto Diagnostics, OEM Spare Parts & Fleet Servicing',
    slug: 'veritas-motors-ltd',
    category: 'automotive',
    description: 'Veritas Motors Ltd. is Kumasi’s premier certified automotive engineering and diagnostic center. Located at Harper Road in Suame, we provide dealership-grade computerized OBD-II scanning, engine overhauls, gearbox servicing, laser wheel alignment, and import genuine OEM Japanese and German spare parts with full warranties.',
    logo: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=300&q=80',
    coverImage: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1000&q=80'
    ],
    phone: '0322045612',
    whatsapp: '233322045612',
    email: 'service@veritasmotors.com.gh',
    website: 'https://veritasmotors.com.gh',
    city: 'Kumasi',
    region: 'Ashanti',
    address: 'Harper Road, Suame Magazine, Kumasi',
    digitalAddress: 'AK-039-4412',
    coordinates: { lat: 6.7120, lng: -1.6380 },
    priceLevel: '$$$',
    rating: 4.8,
    reviewCount: 29,
    verificationStatus: 'verified',
    listingStatus: 'active',
    verificationDetails: {
      verifiedAt: '2025-01-18T14:30:00.000Z',
      tinNumber: 'TIN-GH-901844',
      businessRegNumber: 'CS-GH-2022-4912',
      badgeType: 'Platinum Corporate',
      verifiedByAdmin: 'Executive Desk',
      gpsVerified: true
    },
    openingHours: {
      monday: '07:30 - 18:00',
      tuesday: '07:30 - 18:00',
      wednesday: '07:30 - 18:00',
      thursday: '07:30 - 18:00',
      friday: '07:30 - 18:00',
      saturday: '08:00 - 16:00',
      sunday: 'Closed'
    },
    services: ['Computer Diagnostics', 'Engine & Transmission Overhauls', 'OEM Spare Parts', 'Laser Wheel Alignment', 'Fleet Maintenance'],
    features: ['Certified Technicians', 'Warranty on Parts', 'Spacious Customer Lounge', 'Corporate Invoicing'],
    views: 980,
    leadsCount: 64,
    createdAt: '2025-01-12T09:00:00.000Z',
    updatedAt: '2025-02-18T15:00:00.000Z'
  },

  // 3. BuildRight Supplies & Civil Hardware (from user design screenshot)
  {
    id: 'biz-buildright-supplies',
    name: 'BuildRight Supplies',
    tagline: 'High-Grade Cement, High-Tensile Steel, Timber & Civil Hardware Supplies',
    slug: 'buildright-supplies',
    category: 'construction',
    description: 'BuildRight Supplies is the leading civil building materials distributor across the Northern Region of Ghana. From certified 42.5R Grade Dangote & Ghacem cement to high-tensile iron rods, commercial PVC piping, durable aluminum roofing sheets, and imported tile ceramics, we deliver bulk project supplies across Tamale, Yendi, and Walewale.',
    logo: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=300&q=80',
    coverImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1000&q=80'
    ],
    phone: '0372091240',
    whatsapp: '233372091240',
    email: 'orders@buildrightgh.com',
    website: 'https://buildrightgh.com',
    city: 'Tamale',
    region: 'Northern',
    address: 'Bolgatanga Road, Tamale Central, Northern Region',
    digitalAddress: 'NT-028-7719',
    coordinates: { lat: 9.4042, lng: -0.8393 },
    priceLevel: '$$',
    rating: 4.9,
    reviewCount: 22,
    verificationStatus: 'verified',
    listingStatus: 'active',
    verificationDetails: {
      verifiedAt: '2025-01-20T11:15:00.000Z',
      tinNumber: 'TIN-GH-419208',
      businessRegNumber: 'BN-GH-2021-3829',
      badgeType: 'Gold Enterprise',
      verifiedByAdmin: 'Executive Desk',
      gpsVerified: true
    },
    openingHours: {
      monday: '07:00 - 18:00',
      tuesday: '07:00 - 18:00',
      wednesday: '07:00 - 18:00',
      thursday: '07:00 - 18:00',
      friday: '07:00 - 18:00',
      saturday: '07:30 - 17:00',
      sunday: '12:00 - 16:00'
    },
    services: ['Bulk Cement Distribution', 'High-Tensile Iron Rods', 'Aluminum Roofing Sheets', 'Plumbing & Electricals', 'Site Delivery Fleet'],
    features: ['Same-Day Site Delivery', 'Wholesale Pricing', 'Standard Quality Certified', 'Direct WhatsApp Quotes'],
    views: 1150,
    leadsCount: 73,
    createdAt: '2025-01-14T11:00:00.000Z',
    updatedAt: '2025-02-21T10:00:00.000Z'
  },

  // 4. Tony's Digital Marketing Hub (Executive Partner)
  {
    id: 'biz-tonys-digital-marketing',
    name: "Tony's Digital Marketing Hub",
    tagline: 'High-Impact Digital Marketing, SEO, Web Development & Business Acceleration in Ghana',
    slug: 'tonys-digital-marketing-hub',
    category: 'digital-marketing',
    description: "Tony's Digital Marketing Hub is Ghana's top-tier digital strategy and business acceleration consultancy. We empower SMEs, enterprises, and startups across Accra, Kumasi, and all 16 regions of Ghana with verified Google Ads management, SEO ranking mastery, viral social media ad campaigns, bespoke web engineering, and direct customer lead generation that turns online clicks into real profit.",
    logo: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=300&q=80',
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80'
    ],
    phone: '0508203673',
    whatsapp: '233508203673',
    email: 'tonysdigitalmarketing@gmail.com',
    website: 'https://auracentra.com',
    city: 'Accra',
    region: 'Greater Accra',
    address: 'Airport Residential Area, Accra, Ghana',
    digitalAddress: 'GA-109-8421',
    coordinates: { lat: 5.6037, lng: -0.1870 },
    priceLevel: '$$',
    rating: 5.0,
    reviewCount: 42,
    verificationStatus: 'verified',
    listingStatus: 'active',
    verificationDetails: {
      verifiedAt: '2025-01-01T08:00:00.000Z',
      tinNumber: 'TIN-GH-882194',
      businessRegNumber: 'BN-GH-2024-9128',
      badgeType: 'Platinum Corporate',
      verifiedByAdmin: 'Executive Desk',
      gpsVerified: true
    },
    openingHours: {
      monday: '08:00 - 18:00',
      tuesday: '08:00 - 18:00',
      wednesday: '08:00 - 18:00',
      thursday: '08:00 - 18:00',
      friday: '08:00 - 18:00',
      saturday: '09:00 - 15:00',
      sunday: 'Closed'
    },
    services: [
      'Search Engine Optimization (SEO)',
      'Social Media Ads & Management',
      'Custom Web & App Development',
      'Google My Business & Map Setup',
      'Corporate Brand Acceleration'
    ],
    features: ['Direct WhatsApp Consultation', 'Guaranteed ROI Strategy', 'Ghana & Diaspora Reach', 'Executive Partner'],
    views: 2890,
    leadsCount: 194,
    createdAt: '2025-01-01T08:00:00.000Z',
    updatedAt: '2025-02-24T18:00:00.000Z'
  },

  // 5. Bonwire Heritage Kente Weaving
  {
    id: 'biz-bonwire-kente',
    name: 'Bonwire Heritage Kente Weaving',
    tagline: 'Authentic Hand-Woven Royal Kente Cloth from Ashanti Heritage Masters',
    slug: 'bonwire-heritage-kente-weaving',
    category: 'fashion',
    description: 'Bonwire Heritage Kente Weaving is an internationally acclaimed master artisan guild situated in Bonwire, Ashanti Region. We preserve authentic ancestral weaving traditions, handcrafting custom bespoke royal Kente cloths for traditional weddings, chieftaincy regalia, state banquets, and diaspora fashion events with 100% pure silk and cotton threads.',
    logo: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=300&q=80',
    coverImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=1000&q=80'
    ],
    phone: '0244198230',
    whatsapp: '233244198230',
    email: 'heritage@bonwirekente.com.gh',
    website: 'https://bonwirekente.com.gh',
    city: 'Kumasi',
    region: 'Ashanti',
    address: 'Royal Loom Avenue, Bonwire, Ashanti Region',
    digitalAddress: 'AE-019-3821',
    coordinates: { lat: 6.7667, lng: -1.4833 },
    priceLevel: '$$$',
    rating: 4.9,
    reviewCount: 31,
    verificationStatus: 'verified',
    listingStatus: 'active',
    verificationDetails: {
      verifiedAt: '2025-01-22T09:00:00.000Z',
      tinNumber: 'TIN-GH-551920',
      businessRegNumber: 'BN-GH-2020-1928',
      badgeType: 'Gold Enterprise',
      verifiedByAdmin: 'Executive Desk',
      gpsVerified: true
    },
    openingHours: {
      monday: '08:00 - 18:00',
      tuesday: '08:00 - 18:00',
      wednesday: '08:00 - 18:00',
      thursday: '08:00 - 18:00',
      friday: '08:00 - 18:00',
      saturday: '08:00 - 17:00',
      sunday: '10:00 - 15:00'
    },
    services: ['Bridal Kente Weaving', 'Custom Pattern Design', 'Worldwide DHL Courier', 'Traditional Regalia Consultation'],
    features: ['100% Pure Silk', 'Custom Looming', 'International Delivery', 'Certificate of Authenticity'],
    views: 890,
    leadsCount: 52,
    createdAt: '2025-01-16T10:00:00.000Z',
    updatedAt: '2025-02-19T14:00:00.000Z'
  },

  // 6. Apex Diagnostic Laboratories
  {
    id: 'biz-apex-diagnostic',
    name: 'Apex Diagnostic & Ultrasound Labs',
    tagline: '24/7 Precision Medical Diagnostics, Digital Imaging & Pathology Center',
    slug: 'apex-diagnostic-ultrasound-labs',
    category: 'healthcare',
    description: 'Apex Diagnostic & Ultrasound Labs is a modern computerized diagnostic and clinical testing facility located near the Market Circle in Takoradi. Equipped with 4D ultrasound scanners, full automated hematology analyzers, and digital X-ray machines, our licensed pathologists provide fast, confidential, and accurate diagnostic results.',
    logo: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=300&q=80',
    coverImage: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=1000&q=80'
    ],
    phone: '0312028841',
    whatsapp: '233312028841',
    email: 'info@apexdiagnosticgh.com',
    website: 'https://apexdiagnosticgh.com',
    city: 'Takoradi',
    region: 'Western',
    address: 'Commercial Avenue, Near Market Circle, Takoradi',
    digitalAddress: 'WS-041-8820',
    coordinates: { lat: 4.8872, lng: -1.7554 },
    priceLevel: '$$',
    rating: 4.8,
    reviewCount: 19,
    verificationStatus: 'verified',
    listingStatus: 'active',
    verificationDetails: {
      verifiedAt: '2025-01-25T11:00:00.000Z',
      tinNumber: 'TIN-GH-662910',
      businessRegNumber: 'CS-GH-2023-7721',
      badgeType: 'Gold Enterprise',
      verifiedByAdmin: 'Executive Desk',
      gpsVerified: true
    },
    openingHours: {
      monday: '00:00 - 24:00',
      tuesday: '00:00 - 24:00',
      wednesday: '00:00 - 24:00',
      thursday: '00:00 - 24:00',
      friday: '00:00 - 24:00',
      saturday: '00:00 - 24:00',
      sunday: '00:00 - 24:00'
    },
    services: ['4D Obstetric Ultrasound', 'Digital X-Ray', 'Comprehensive Blood Biochemistry', 'Corporate Medical Screening'],
    features: ['24/7 Operating Hours', 'Online Result Portal', 'NHIS & Private Insurance', 'Licensed Pathologists'],
    views: 740,
    leadsCount: 45,
    createdAt: '2025-01-18T12:00:00.000Z',
    updatedAt: '2025-02-22T08:00:00.000Z'
  },

  // -------------------------------------------------------------------------------------------------
  // PENDING BUSINESS APPLICATIONS (So Admin immediately sees and can approve/reject in the admin queue!)
  // -------------------------------------------------------------------------------------------------
  {
    id: 'biz-pending-starbite-tema',
    name: 'StarBite Executive Bakery & Cafe',
    tagline: 'Artisanal Fresh Breads, Pastries & Catering in Tema Community 1',
    slug: 'starbite-executive-bakery',
    category: 'restaurants',
    description: 'StarBite Executive Bakery is a newly constructed modern bakery and espresso cafe in Tema Community 1. We specialize in oven-fresh butter bread, croissants, custom birthday cakes, and executive corporate breakfast platters. We have submitted our Ghana Card and GhanaPost GPS for listing approval.',
    logo: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=300&q=80',
    coverImage: 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&w=1000&q=80'
    ],
    phone: '0208119042',
    whatsapp: '233208119042',
    email: 'orders@starbitetema.com',
    city: 'Tema',
    region: 'Greater Accra',
    address: 'Market Street, Community 1, Tema, Ghana',
    digitalAddress: 'GT-018-9921',
    coordinates: { lat: 5.6698, lng: -0.0166 },
    priceLevel: '$$',
    rating: 5.0,
    reviewCount: 0,
    verificationStatus: 'pending',
    listingStatus: 'pending_approval',
    verificationDocuments: [
      {
        id: 'doc-starbite-ghcard',
        type: 'ghana_card',
        documentNumber: 'GHA-718294012-4',
        holderName: 'Emmanuel Ofori Boateng',
        expiryDate: '2034-08-12',
        frontImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
        submittedAt: '2025-02-23T14:20:00.000Z',
        status: 'pending'
      }
    ],
    openingHours: {
      monday: '06:30 - 20:00',
      tuesday: '06:30 - 20:00',
      wednesday: '06:30 - 20:00',
      thursday: '06:30 - 20:00',
      friday: '06:30 - 20:00',
      saturday: '07:00 - 21:00',
      sunday: '08:00 - 18:00'
    },
    services: ['Artisanal Bread Baking', 'Custom Celebration Cakes', 'Espresso Coffee Bar', 'Event Pastry Catering'],
    features: ['GhanaPost GPS Verified', 'Outdoor Patio', 'Direct MoMo Payment'],
    views: 12,
    leadsCount: 2,
    createdAt: '2025-02-23T14:00:00.000Z',
    updatedAt: '2025-02-23T14:20:00.000Z'
  },

  {
    id: 'biz-pending-northern-shea',
    name: 'Northern Shea Naturals Export',
    tagline: 'Grade-A Pure Unrefined Organic Shea Butter & Black Soap Export',
    slug: 'northern-shea-naturals-export',
    category: 'fashion',
    description: 'Northern Shea Naturals Export works with women cooperatives across the Northern and Savannah regions of Ghana to produce ethically harvested, Grade-A 100% unrefined shea butter, organic black soap, and pure baobab oil for cosmetic brands and wholesale buyers worldwide.',
    logo: 'https://images.unsplash.com/photo-1608248597359-00913988ca13?auto=format&fit=crop&w=300&q=80',
    coverImage: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1000&q=80'
    ],
    phone: '0559041289',
    whatsapp: '233559041289',
    email: 'export@northernsheagh.com',
    city: 'Tamale',
    region: 'Northern',
    address: 'Hospital Road, Tamale Industrial Area',
    digitalAddress: 'NT-109-3829',
    coordinates: { lat: 9.4075, lng: -0.8533 },
    priceLevel: '$$',
    rating: 5.0,
    reviewCount: 0,
    verificationStatus: 'pending',
    listingStatus: 'pending_approval',
    verificationDocuments: [
      {
        id: 'doc-shea-cert',
        type: 'business_registration',
        documentNumber: 'BN-GH-2024-44182',
        holderName: 'Amina Alhassan',
        expiryDate: '2030-11-20',
        frontImageUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80',
        submittedAt: '2025-02-24T09:15:00.000Z',
        status: 'pending'
      }
    ],
    openingHours: {
      monday: '08:00 - 17:00',
      tuesday: '08:00 - 17:00',
      wednesday: '08:00 - 17:00',
      thursday: '08:00 - 17:00',
      friday: '08:00 - 17:00',
      saturday: '09:00 - 14:00',
      sunday: 'Closed'
    },
    services: ['Bulk Raw Shea Butter', 'Ghana Black Soap Wholesale', 'Custom Private Labelling', 'International Ocean Freight'],
    features: ['Fair Trade Certified', '100% Organic', 'Direct Producer Pricing'],
    views: 8,
    leadsCount: 1,
    createdAt: '2025-02-24T09:00:00.000Z',
    updatedAt: '2025-02-24T09:15:00.000Z'
  },

  {
    id: 'biz-pending-technest-capecoast',
    name: 'TechNest Cloud & Software Labs',
    tagline: 'Custom Web Apps, MoMo API Integration & Digital Transformation in Central Region',
    slug: 'technest-cloud-software-labs',
    category: 'technology',
    description: 'TechNest Cloud Labs is a software engineering company based near University of Cape Coast (UCC). We build fast web applications, Mobile Money payment gateways (MTN, Telecel, AT), inventory point-of-sale software, and student portal infrastructure.',
    logo: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=300&q=80',
    coverImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1000&q=80'
    ],
    phone: '0240993184',
    whatsapp: '233240993184',
    email: 'support@technestgh.com',
    city: 'Cape Coast',
    region: 'Central',
    address: 'University Road, Cape Coast, Central Region',
    digitalAddress: 'CC-029-4102',
    coordinates: { lat: 5.1053, lng: -1.2466 },
    priceLevel: '$$',
    rating: 5.0,
    reviewCount: 0,
    verificationStatus: 'pending',
    listingStatus: 'pending_approval',
    verificationDocuments: [
      {
        id: 'doc-technest-id',
        type: 'ghana_card',
        documentNumber: 'GHA-892100412-8',
        holderName: 'Kojo Asante Mensah',
        expiryDate: '2033-05-19',
        frontImageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
        submittedAt: '2025-02-24T11:45:00.000Z',
        status: 'pending'
      }
    ],
    openingHours: {
      monday: '08:30 - 18:30',
      tuesday: '08:30 - 18:30',
      wednesday: '08:30 - 18:30',
      thursday: '08:30 - 18:30',
      friday: '08:30 - 18:30',
      saturday: '10:00 - 16:00',
      sunday: 'Closed'
    },
    services: ['Web & Mobile App Engineering', 'Mobile Money Payment Gateway', 'Cloud Infrastructure', 'Cybersecurity Audit'],
    features: ['API Specialists', 'Ghana Fintech Certified', 'Student Tech Incubator'],
    views: 15,
    leadsCount: 3,
    createdAt: '2025-02-24T11:30:00.000Z',
    updatedAt: '2025-02-24T11:45:00.000Z'
  }
];

export const INITIAL_REVIEWS: BusinessReview[] = [
  {
    id: 'rev-zion-1',
    businessId: 'biz-zion-city',
    userName: 'Kofi Kwakye',
    rating: 5,
    comment: 'Best grilled tilapia and spicy jollof in Osu! The ambiance in the evening is unmatched and customer service was swift.',
    date: '2025-02-14T19:30:00.000Z',
    helpfulCount: 8
  },
  {
    id: 'rev-veritas-1',
    businessId: 'biz-veritas-motors',
    userName: 'Dr. Mensah Osei',
    rating: 5,
    comment: 'Honest automotive diagnostics in Kumasi. They scanned my Mercedes E350 and solved an electrical issue that three other garages failed to diagnose.',
    date: '2025-02-10T14:15:00.000Z',
    helpfulCount: 12
  },
  {
    id: 'rev-buildright-1',
    businessId: 'biz-buildright-supplies',
    userName: 'Alhassan Mohammed',
    rating: 5,
    comment: 'Supplied high-tensile steel and 200 bags of cement to our site in Tamale without delay. Excellent business to partner with.',
    date: '2025-02-18T10:00:00.000Z',
    helpfulCount: 6
  },
  {
    id: 'rev-tony-1',
    businessId: 'biz-tonys-digital-marketing',
    userName: 'Nana Ama Serwaa',
    rating: 5,
    comment: "Tony's Digital Marketing Hub helped scale our business in Accra. In less than 3 weeks our direct customer inquiries surged by 400%. Highly recommended!",
    date: '2025-02-20T16:40:00.000Z',
    helpfulCount: 15
  }
];
