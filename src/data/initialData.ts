import { Business, Category, BusinessReview } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'restaurants',
    name: 'Restaurants & Eateries',
    slug: 'restaurants',
    iconName: 'UtensilsCrossed',
    description: 'Authentic Ghanaian cuisines, continental restaurants, executive chops bars, and rooftop lounges.',
    itemCount: 0,
    featuredImageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'automotive',
    name: 'Automotive & Repairs',
    slug: 'automotive',
    iconName: 'Car',
    description: 'Computerized OBD diagnostics, genuine OEM auto spare parts importers, air conditioning servicing, and car rentals.',
    itemCount: 0,
    featuredImageUrl: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'construction',
    name: 'Building Materials & Civil Hardware',
    slug: 'construction',
    iconName: 'Hammer',
    description: 'Civil engineering contractors, aluminum glazing fabricators, cement suppliers, steel rods, and electrical rewiring experts.',
    itemCount: 0,
    featuredImageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'digital-marketing',
    name: 'Digital Marketing & Growth',
    slug: 'digital-marketing',
    iconName: 'TrendingUp',
    description: 'Digital marketing, SEO optimization, social media advertising, custom web development, and business acceleration.',
    itemCount: 0,
    featuredImageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'fashion',
    name: 'Fashion & Bespoke Tailoring',
    slug: 'fashion',
    iconName: 'Shirt',
    description: 'Bespoke Bonwire Kente weaving, Northern smock tailoring, modern Afrocentric couture, and ready-to-wear styling.',
    itemCount: 0,
    featuredImageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'technology',
    name: 'Technology & Cloud Solutions',
    slug: 'technology',
    iconName: 'Laptop',
    description: 'IT consulting, Mobile Money fintech integration, cloud engineering, cybersecurity, and hardware repair centres.',
    itemCount: 0,
    featuredImageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'real-estate',
    name: 'Real Estate & Housing',
    slug: 'real-estate',
    iconName: 'Building2',
    description: 'Luxury apartments for rent, commercial offices, verified titled land sales, and facility management.',
    itemCount: 0,
    featuredImageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'healthcare',
    name: 'Healthcare & Diagnostics',
    slug: 'healthcare',
    iconName: 'HeartPulse',
    description: 'Specialist hospitals, diagnostic ultrasound labs, dental clinics, 24/7 licensed pharmacies, and wellness centers.',
    itemCount: 0,
    featuredImageUrl: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'professional-services',
    name: 'Professional & Legal Hub',
    slug: 'professional-services',
    iconName: 'Briefcase',
    description: 'Chartered accountants, corporate legal consultants, immigration specialists, and translation agencies.',
    itemCount: 0,
    featuredImageUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'agriculture',
    name: 'Agriculture & Agribusiness',
    slug: 'agriculture',
    iconName: 'Sprout',
    description: 'Commercial farms, cocoa & cashew aggregators, poultry feed suppliers, tractors, and agricultural exports.',
    itemCount: 0,
    featuredImageUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'hospitality',
    name: 'Hospitality, Hotels & Tourism',
    slug: 'hospitality',
    iconName: 'Hotel',
    description: 'Luxury safari resorts, beachfront boutique hotels, eco-lodges, event venues, and tour operators.',
    itemCount: 0,
    featuredImageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'education',
    name: 'Education, Academies & Training',
    slug: 'education',
    iconName: 'GraduationCap',
    description: 'Accredited universities, international STEM schools, coding academies, and executive corporate training.',
    itemCount: 0,
    featuredImageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'beauty',
    name: 'Beauty, Hair & Spa Wellness',
    slug: 'beauty',
    iconName: 'Sparkles',
    description: 'Executive barbering, luxury bridal makeup, organic shea skincare, dermatological spas, and cosmetics.',
    itemCount: 0,
    featuredImageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'logistics',
    name: 'Logistics, Freight & Delivery',
    slug: 'logistics',
    iconName: 'Truck',
    description: 'Tema port clearing and forwarding agents, intercity cold-chain haulage, motorbike dispatch, and cargo warehousing.',
    itemCount: 0,
    featuredImageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'financial-services',
    name: 'Financial Services & Microfinance',
    slug: 'financial-services',
    iconName: 'Landmark',
    description: 'Licensed savings & loans, insurance underwriters, Mobile Money merchant aggregators, and audit firms.',
    itemCount: 0,
    featuredImageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80'
  }
];

// Pre-enlisted and verified business directory
export const INITIAL_BUSINESSES: Business[] = [
  {
    id: 'biz-1788360528413',
    name: "Tony's Digital Marketing and Business Hub",
    tagline: 'We offer quality digital and tech services',
    slug: 'tony-s-digital-marketing-and-business-hub',
    category: 'digital-marketing',
    description: 'We aim at solving problems with simple techniques but perfectly well. Some of our services include: digital marketing, social media management, graphic designing, web development, video editing and animation, SEO optimization.',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80',
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80'],
    phone: '0508203673',
    whatsapp: '233508203673',
    email: 'tonysdigitalmarketing@gmail.com',
    city: 'Accra',
    region: 'Greater Accra',
    address: 'Accra Commercial District',
    digitalAddress: 'GA-183-9021',
    coordinates: { lat: 5.6037, lng: -0.1870 },
    priceLevel: '$$',
    rating: 5.0,
    reviewCount: 0,
    verificationStatus: 'verified',
    listingStatus: 'active',
    isApproved: true,
    permanentlyEnlisted: true,
    underInvestigation: false,
    isFeatured: true,
    openingHours: {
      monday: '08:00 - 18:00',
      tuesday: '08:00 - 18:00',
      wednesday: '08:00 - 18:00',
      thursday: '08:00 - 18:00',
      friday: '08:00 - 18:00',
      saturday: '09:00 - 16:00',
      sunday: 'Closed',
    },
    services: ['Digital Marketing', 'Social Media Management', 'Graphic Designing', 'Web Development', 'Video Editing & Animation', 'SEO Optimization'],
    features: ['Official AuraCentra Member', 'Direct Contact Verified'],
    views: 120,
    leadsCount: 14,
    ownerId: '4a62d860-f4f2-400e-b18f-d8a4d39b3d09',
    ownerEmail: 'tonysdigitalmarketing@gmail.com',
    createdAt: '2026-09-02T14:41:49.960Z',
    updatedAt: '2026-09-21T12:00:00.000Z',
  }
];

// Empty initial reviews - reviews will come only from verified users.
export const INITIAL_REVIEWS: BusinessReview[] = [];

