import { Business, Category, BusinessReview } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'restaurants',
    name: 'Restaurants & Eateries',
    slug: 'restaurants',
    iconName: 'UtensilsCrossed',
    description: 'Traditional Ghanaian cuisines, continental restaurants, chops bars, and rooftop lounges.',
    itemCount: 0,
    featuredImageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'digital-marketing',
    name: 'Digital Marketing & Business Hub',
    slug: 'digital-marketing',
    iconName: 'Sparkles',
    description: "Tony's Digital Marketing, SEO, social media growth, web development, and business acceleration.",
    itemCount: 0,
    featuredImageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'technology',
    name: 'Technology & Software',
    slug: 'technology',
    iconName: 'Laptop',
    description: 'IT consulting, fintech innovators, cloud engineering, and hardware repair centres.',
    itemCount: 0,
    featuredImageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'fashion',
    name: 'Fashion & Tailoring',
    slug: 'fashion',
    iconName: 'Shirt',
    description: 'Bespoke Kente weaving, Northern smock tailoring, modern Afrocentric couture, and ready-to-wear.',
    itemCount: 0,
    featuredImageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'salons',
    name: 'Salons, Spas & Grooming',
    slug: 'salons',
    iconName: 'Scissors',
    description: 'Barbershops, natural hair salons, wellness spas, nail bars, and cosmetic clinics.',
    itemCount: 0,
    featuredImageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'real-estate',
    name: 'Real Estate & Housing',
    slug: 'real-estate',
    iconName: 'Building2',
    description: 'Apartments for rent, commercial offices, verified land sales, and facility management.',
    itemCount: 0,
    featuredImageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'healthcare',
    name: 'Healthcare & Pharmacies',
    slug: 'healthcare',
    iconName: 'HeartPulse',
    description: 'Hospitals, diagnostic labs, dental clinics, 24/7 licensed pharmacies, and wellness centers.',
    itemCount: 0,
    featuredImageUrl: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'education',
    name: 'Schools & Training',
    slug: 'education',
    iconName: 'GraduationCap',
    description: 'Private schools, vocational academies, coding bootcamps, and universities.',
    itemCount: 0,
    featuredImageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'events-photography',
    name: 'Events & Photography',
    slug: 'events-photography',
    iconName: 'Camera',
    description: 'Wedding planners, event decorators, studio photographers, and sound engineers.',
    itemCount: 0,
    featuredImageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'auto-mechanics',
    name: 'Automotive & Mechanics',
    slug: 'auto-mechanics',
    iconName: 'Car',
    description: 'Auto diagnosis, spare parts dealerships, mobile mechanics, and car detailing.',
    itemCount: 0,
    featuredImageUrl: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'construction',
    name: 'Construction & Artisans',
    slug: 'construction',
    iconName: 'Hammer',
    description: 'Civil engineering, certified electricians, plumbers, interior painters, and steel fabrication.',
    itemCount: 0,
    featuredImageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'professional-services',
    name: 'Legal & Accounting Services',
    slug: 'professional-services',
    iconName: 'Briefcase',
    description: 'Chartered accountants, tax consultants, legal practitioners, and notary publics.',
    itemCount: 0,
    featuredImageUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80'
  }
];

// Completely clean of demo businesses
export const INITIAL_BUSINESSES: Business[] = [];

// Completely clean of demo reviews
export const INITIAL_REVIEWS: BusinessReview[] = [];
