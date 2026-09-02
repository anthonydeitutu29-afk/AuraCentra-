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
  }
];

// Completely empty list of businesses - NO demo or sample businesses.
// Only real registered businesses from Supabase / database will appear.
export const INITIAL_BUSINESSES: Business[] = [];

// Empty initial reviews - reviews will come only from verified users.
export const INITIAL_REVIEWS: BusinessReview[] = [];
