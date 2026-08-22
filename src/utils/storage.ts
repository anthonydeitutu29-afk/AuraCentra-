import { Business, Category, BusinessReview, UserProfile, BusinessInquiry, BusinessReport, CategorySuggestion, PlatformFeedback, BlogPost } from '../types';
import { INITIAL_BUSINESSES, INITIAL_CATEGORIES, INITIAL_REVIEWS } from '../data/initialData';
import { INITIAL_BLOG_POSTS } from '../data/blogData';

const STORAGE_KEYS = {
  BUSINESSES: 'auracentra_businesses_clean_v6',
  CATEGORIES: 'auracentra_categories_clean_v6',
  REVIEWS: 'auracentra_reviews_clean_v6',
  CURRENT_USER: 'auracentra_user_clean_v6',
  SAVED_BUSINESSES: 'auracentra_saved_clean_v6',
  SEARCH_HISTORY: 'auracentra_search_history_clean_v6',
  THEME: 'auracentra_theme_clean_v6',
  SHOW_EXECUTIVE_SECTION: 'auracentra_show_executive_clean_v6',
  INQUIRIES: 'auracentra_inquiries_clean_v6',
  PROMOTIONS: 'auracentra_promotions_clean_v6',
  REPORTS: 'auracentra_reports_clean_v6',
  SUGGESTIONS: 'auracentra_suggestions_clean_v6',
  FEEDBACK: 'auracentra_feedback_clean_v6',
  BLOG_POSTS: 'auracentra_blog_posts_clean_v6',
};

// Initial state getters and setters
export function getStoredBusinesses(): Business[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.BUSINESSES);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed;
      }
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
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
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
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed;
      }
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
  return [];
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
  return [];
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
  return [];
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
