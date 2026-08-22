import { Business, Category, BusinessReview, UserProfile, BusinessInquiry, BusinessReport, CategorySuggestion, PlatformFeedback, BlogPost } from '../types';
import { INITIAL_BUSINESSES, INITIAL_CATEGORIES, INITIAL_REVIEWS } from '../data/initialData';
import { INITIAL_BLOG_POSTS } from '../data/blogData';

const STORAGE_KEYS = {
  BUSINESSES: 'auracentra_businesses_live_v2',
  CATEGORIES: 'auracentra_categories_live_v2',
  REVIEWS: 'auracentra_reviews_live_v2',
  CURRENT_USER: 'auracentra_user_live_v2',
  SAVED_BUSINESSES: 'auracentra_saved_live_v2',
  SEARCH_HISTORY: 'auracentra_search_history_live_v2',
  THEME: 'auracentra_theme_live_v2',
  SHOW_EXECUTIVE_SECTION: 'auracentra_show_executive_live_v2',
  INQUIRIES: 'auracentra_inquiries_live_v2',
  PROMOTIONS: 'auracentra_promotions_live_v2',
  REPORTS: 'auracentra_reports_live_v2',
  SUGGESTIONS: 'auracentra_suggestions_live_v2',
  FEEDBACK: 'auracentra_feedback_live_v2',
  BLOG_POSTS: 'auracentra_blog_posts_live_v2',
};

// Initial state getters and setters
export function getStoredBusinesses(): Business[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.BUSINESSES);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load businesses from storage', e);
  }
  return INITIAL_BUSINESSES;
}

export function saveBusinesses(businesses: Business[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.BUSINESSES, JSON.stringify(businesses));
  } catch (e) {
    console.error('Failed to save businesses to storage', e);
  }
}

export function getStoredCategories(): Category[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load categories from storage', e);
  }
  return INITIAL_CATEGORIES;
}

export function saveCategories(categories: Category[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  } catch (e) {
    console.error('Failed to save categories to storage', e);
  }
}

export function getStoredReviews(): BusinessReview[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load reviews from storage', e);
  }
  return INITIAL_REVIEWS;
}

export function saveReviews(reviews: BusinessReview[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  } catch (e) {
    console.error('Failed to save reviews to storage', e);
  }
}

export function getStoredCurrentUser(): UserProfile | null {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load current user', e);
  }
  return null;
}

export function saveCurrentUser(user: UserProfile | null): void {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  } catch (e) {
    console.error('Failed to save current user', e);
  }
}

export function getStoredSearchHistory(): string[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load search history', e);
  }
  return [];
}

export function saveSearchHistory(history: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(history.slice(0, 10)));
  } catch (e) {
    console.error('Failed to save search history', e);
  }
}

export function clearStoredSearchHistory(): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify([]));
  } catch (e) {
    console.error('Failed to clear search history', e);
  }
}

export function getExecutiveSectionVisibility(): boolean {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SHOW_EXECUTIVE_SECTION);
    if (data !== null) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load executive section visibility', e);
  }
  return false;
}

export function saveExecutiveSectionVisibility(visible: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SHOW_EXECUTIVE_SECTION, JSON.stringify(visible));
  } catch (e) {
    console.error('Failed to save executive section visibility', e);
  }
}

// Distance calculation using Haversine formula (in km)
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(1));
}

export function getStoredInquiries(): BusinessInquiry[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.INQUIRIES);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load inquiries from storage', e);
  }
  return [];
}

export function saveInquiries(inquiries: BusinessInquiry[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(inquiries));
  } catch (e) {
    console.error('Failed to save inquiries to storage', e);
  }
}

export function getStoredPromotions(): any[] | null {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PROMOTIONS);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load promotions from storage', e);
  }
  return null;
}

export function savePromotions(promotions: any[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PROMOTIONS, JSON.stringify(promotions));
  } catch (e) {
    console.error('Failed to save promotions to storage', e);
  }
}

export function getStoredReports(): BusinessReport[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.REPORTS);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load reports from storage', e);
  }
  return [
    {
      id: 'rep-101',
      businessId: 'biz-3',
      businessName: 'Osu Cyber & Software Solutions',
      reporterName: 'Kofi Mensah',
      reporterEmail: 'kofi.m@gmail.com',
      reporterPhone: '+233 24 111 2233',
      reason: 'incorrect_information',
      reasonLabel: 'Incorrect Contact / Location Details',
      details: 'The stated office suite number on 4th Oxford St was relocated to 8th Lane last month.',
      reportedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      status: 'pending',
    },
  ];
}

export function saveReports(reports: BusinessReport[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
  } catch (e) {
    console.error('Failed to save reports to storage', e);
  }
}

export function getStoredCategorySuggestions(): CategorySuggestion[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SUGGESTIONS);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load category suggestions', e);
  }
  return [
    {
      id: 'sug-1',
      categoryName: 'Renewable Energy & Solar Installations',
      suggestedBy: 'Kojo Antwi',
      userEmail: 'kojo.solar@gmail.com',
      userPhone: '+233 24 555 9012',
      industry: 'Energy & Power',
      description: 'Solar panel installers, inverter technicians, and lithium battery storage providers in Ghana.',
      exampleBusinesses: 'SunPower Ghana, West Coast Solar, Volta Inverters',
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      status: 'pending',
    },
    {
      id: 'sug-2',
      categoryName: 'Agro-Processing & Cold Chain Logistics',
      suggestedBy: 'Esi Frimpong',
      userEmail: 'esi.agro@yahoo.com',
      userPhone: '+233 20 444 8811',
      industry: 'Agriculture',
      description: 'Cassava flour mills, cashew processors, mango dehydrators, and refrigerated transport.',
      exampleBusinesses: 'FarmFresh Logistics, GoldCoast Agro Processors',
      createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      status: 'approved',
      adminNotes: 'Great sector expansion, scheduled for upcoming release.',
    }
  ];
}

export function saveCategorySuggestions(suggestions: CategorySuggestion[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SUGGESTIONS, JSON.stringify(suggestions));
  } catch (e) {
    console.error('Failed to save category suggestions', e);
  }
}

export function getStoredFeedback(): PlatformFeedback[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.FEEDBACK);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load platform feedback', e);
  }
  return [
    {
      id: 'fb-1',
      type: 'business_review',
      name: 'Abena Darko',
      email: 'abena.darko@gmail.com',
      rating: 5,
      subject: 'Exceptional Directory Experience',
      message: 'Found a certified IT hardware specialist in East Legon within 5 minutes. The WhatsApp integration worked seamlessly.',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      status: 'reviewed',
    }
  ];
}

export function saveFeedback(feedbackList: PlatformFeedback[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.FEEDBACK, JSON.stringify(feedbackList));
  } catch (e) {
    console.error('Failed to save platform feedback', e);
  }
}

export function getStoredBlogPosts(): BlogPost[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.BLOG_POSTS);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load blog posts', e);
  }
  return INITIAL_BLOG_POSTS;
}

export function saveBlogPosts(posts: BlogPost[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.BLOG_POSTS, JSON.stringify(posts));
  } catch (e) {
    console.error('Failed to save blog posts', e);
  }
}

