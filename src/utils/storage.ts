import { Business, Category, BusinessReview, UserProfile, UserAccountRecord, BusinessInquiry, BusinessReport, CategorySuggestion, PlatformFeedback, UserNotification } from '../types';
import { INITIAL_BUSINESSES, INITIAL_CATEGORIES, INITIAL_REVIEWS } from '../data/initialData';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';

const STORAGE_KEYS = {
  BUSINESSES: 'auracentra_businesses_clean_v6',
  CATEGORIES: 'auracentra_categories_clean_v6',
  REVIEWS: 'auracentra_reviews_clean_v6',
  CURRENT_USER: 'auracentra_user_clean_v6',
  REGISTERED_ACCOUNTS: 'auracentra_registered_accounts_v6',
  SAVED_BUSINESSES: 'auracentra_saved_clean_v6',
  SEARCH_HISTORY: 'auracentra_search_history_clean_v6',
  THEME: 'auracentra_theme_clean_v6',
  SHOW_EXECUTIVE_SECTION: 'auracentra_show_executive_clean_v6',
  INQUIRIES: 'auracentra_inquiries_clean_v6',
  PROMOTIONS: 'auracentra_promotions_clean_v6',
  REPORTS: 'auracentra_reports_clean_v6',
  SUGGESTIONS: 'auracentra_suggestions_clean_v6',
  FEEDBACK: 'auracentra_feedback_clean_v6',
  NEWS_LIKES: 'auracentra_news_likes_v1',
  USER_NOTIFICATIONS: 'auracentra_user_notifications_v1',
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

/**
 * Explicit Account Validation Check
 * Validates if the given user profile is active, well-formed, and exists in registered records.
 */
export function validateCurrentSession(user: UserProfile | null): { isValid: boolean; reason?: string } {
  if (!user) {
    return { isValid: false, reason: 'No active session token found.' };
  }
  if (!user.id || !user.email) {
    return { isValid: false, reason: 'Session token is corrupted or missing essential credentials.' };
  }
  
  try {
    const accounts = getRegisteredAccounts();
    const accountExists = accounts.some(
      (a) => a.email.toLowerCase() === user.email.toLowerCase() || a.id === user.id
    );
    if (!accountExists && user.role !== 'visitor') {
      return { isValid: false, reason: 'Account record not recognized or has been invalidated.' };
    }
  } catch (e) {
    console.error('Session validation error:', e);
  }
  
  return { isValid: true };
}

/**
 * Clears all local application state, invalidates persistent session tokens,
 * flushes sensitive caches and signs out of Firebase Auth.
 */
export async function validateAndClearSession(): Promise<{ success: boolean; message: string }> {
  try {
    // 1. Invalidate Firebase Auth session
    try {
      if (auth) {
        await signOut(auth);
      }
    } catch (firebaseErr) {
      console.warn('Firebase sign-out notification:', firebaseErr);
    }

    // 2. Remove primary user session token
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);

    // 3. Clear sensitive or user-specific transient caches
    localStorage.removeItem(STORAGE_KEYS.SAVED_BUSINESSES);
    localStorage.removeItem(STORAGE_KEYS.SEARCH_HISTORY);

    // 4. Invalidate any lingering firebase token keys in local/session storage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('firebase:') || key.startsWith('authUser:') || key.includes('auth_token'))) {
        localStorage.removeItem(key);
      }
    }
    
    // Also check sessionStorage
    try {
      sessionStorage.clear();
    } catch {
      // ignore
    }

    return { success: true, message: 'All local session tokens and application state cleared securely.' };
  } catch (err: any) {
    console.error('Error clearing session:', err);
    return { success: false, message: err?.message || 'Error occurred while clearing session.' };
  }
}

export function getStoredNewsLikes(): string[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.NEWS_LIKES);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load news likes', e);
  }
  return [];
}

export function toggleStoredNewsLike(articleId: string): string[] {
  try {
    const current = getStoredNewsLikes();
    const updated = current.includes(articleId)
      ? current.filter((id) => id !== articleId)
      : [...current, articleId];
    localStorage.setItem(STORAGE_KEYS.NEWS_LIKES, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to toggle news like', e);
    return [];
  }
}

// Built-in executive system administrator credentials
export const DEFAULT_ADMIN_ACCOUNT: UserAccountRecord = {
  id: 'admin-super-01',
  name: 'AuraCentra Executive Admin',
  email: 'admindashboard@gmail.com',
  phone: '+233 50 820 3673',
  role: 'admin',
  password: 'Admin12$',
  createdAt: '2026-01-01T00:00:00.000Z',
};

export function getRegisteredAccounts(): UserAccountRecord[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.REGISTERED_ACCOUNTS);
    if (data) {
      const parsed: UserAccountRecord[] = JSON.parse(data);
      if (Array.isArray(parsed)) {
        // Ensure admin account is present
        if (!parsed.some((a) => a.email.toLowerCase() === DEFAULT_ADMIN_ACCOUNT.email.toLowerCase())) {
          return [DEFAULT_ADMIN_ACCOUNT, ...parsed];
        }
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load registered accounts from storage', e);
  }
  return [DEFAULT_ADMIN_ACCOUNT];
}

export function saveRegisteredAccount(account: UserAccountRecord): void {
  try {
    const accounts = getRegisteredAccounts();
    const existingIndex = accounts.findIndex(
      (a) => a.email.toLowerCase() === account.email.toLowerCase() || a.id === account.id
    );
    let updated: UserAccountRecord[];
    if (existingIndex >= 0) {
      updated = [...accounts];
      updated[existingIndex] = { ...updated[existingIndex], ...account, lastLoginAt: new Date().toISOString() };
    } else {
      updated = [...accounts, { ...account, lastLoginAt: new Date().toISOString() }];
    }
    localStorage.setItem(STORAGE_KEYS.REGISTERED_ACCOUNTS, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save registered account to storage', e);
  }
}

export function findRegisteredAccountByEmail(email: string): UserAccountRecord | null {
  const cleanEmail = email.trim().toLowerCase();
  const accounts = getRegisteredAccounts();
  return accounts.find((a) => a.email.toLowerCase() === cleanEmail) || null;
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

export function getStoredUserNotifications(): UserNotification[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USER_NOTIFICATIONS);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load user notifications', e);
  }
  return [];
}

export function saveUserNotification(notification: UserNotification): void {
  try {
    const current = getStoredUserNotifications();
    const updated = [notification, ...current.filter((n) => n.id !== notification.id)];
    localStorage.setItem(STORAGE_KEYS.USER_NOTIFICATIONS, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save user notification', e);
  }
}

export function markNotificationAsRead(notificationId: string): void {
  try {
    const current = getStoredUserNotifications();
    const updated = current.map((n) => (n.id === notificationId ? { ...n, read: true } : n));
    localStorage.setItem(STORAGE_KEYS.USER_NOTIFICATIONS, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to mark notification as read', e);
  }
}

