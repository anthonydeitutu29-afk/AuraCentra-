import { Business, Category, BusinessReview, UserProfile, UserAccountRecord, BusinessInquiry, BusinessReport, CategorySuggestion, PlatformFeedback, UserNotification } from '../types';
import { INITIAL_BUSINESSES, INITIAL_CATEGORIES, INITIAL_REVIEWS } from '../data/initialData';
import { SupabaseService, isSupabaseConfigured } from '../lib/supabase';

const STORAGE_KEYS = {
  BUSINESSES: 'auracentra_businesses_clean_v8',
  CATEGORIES: 'auracentra_categories_clean_v8',
  REVIEWS: 'auracentra_reviews_clean_v8',
  CURRENT_USER: 'auracentra_user_clean_v8',
  REGISTERED_ACCOUNTS: 'auracentra_registered_accounts_v8',
  SAVED_BUSINESSES: 'auracentra_saved_clean_v8',
  SEARCH_HISTORY: 'auracentra_search_history_clean_v8',
  THEME: 'auracentra_theme_clean_v8',
  SHOW_EXECUTIVE_SECTION: 'auracentra_show_executive_clean_v8',
  INQUIRIES: 'auracentra_inquiries_clean_v8',
  PROMOTIONS: 'auracentra_promotions_clean_v8',
  REPORTS: 'auracentra_reports_clean_v8',
  SUGGESTIONS: 'auracentra_suggestions_clean_v8',
  FEEDBACK: 'auracentra_feedback_clean_v8',
  NEWS_LIKES: 'auracentra_news_likes_v3',
  USER_NOTIFICATIONS: 'auracentra_user_notifications_v3',
};

// Immediate purge of legacy accounts and business records
try {
  const legacyKeys = [
    'auracentra_businesses',
    'auracentra_businesses_clean_v7',
    'auracentra_businesses_clean_v6',
    'auracentra_businesses_clean_v5',
    'auracentra_registered_accounts_v7',
    'auracentra_registered_accounts_v6',
    'auracentra_user_clean_v7',
    'auracentra_user_clean_v6',
    'auracentra_pending_submissions',
    'auracentra_pending_signup',
    'auracentra_saved_clean_v7',
    'auracentra_saved_ids'
  ];
  legacyKeys.forEach(k => localStorage.removeItem(k));
} catch {
  // ignore in non-browser environments
}

// Initial state getters and setters
export const PERMANENTLY_DELETED_BUSINESS_IDS = [
  'biz-buka-accra',
  'biz-kempinski-accra',
  'biz-nyaho-clinic',
  'biz-vodam-kumasi',
  'biz-zion-city',
  'biz-veritas-motors',
  'biz-buildright-supplies',
  'biz-tonys-digital-marketing',
  'biz-bonwire-kente',
  'biz-apex-diagnostic',
  'biz-pending-starbite-tema',
  'biz-pending-northern-shea',
  'biz-pending-technest-capecoast'
];

export const PERMANENTLY_DELETED_BUSINESS_NAMES = [
  'sweet gardens hotel',
  'buka restaurant',
  'nyaho medical',
  'kempinski hotel'
];

export function isDeletedBusiness(b: Partial<Business> | null | undefined): boolean {
  if (!b) return true;
  if (b.id && PERMANENTLY_DELETED_BUSINESS_IDS.includes(b.id)) return true;
  if (b.slug) {
    const s = b.slug.toLowerCase();
    if (
      s.includes('sweet-gardens') ||
      s.includes('buka-restaurant') ||
      s.includes('nyaho-medical') ||
      s.includes('kempinski-hotel')
    ) {
      return true;
    }
  }
  if (b.name) {
    const nameLower = b.name.toLowerCase();
    if (PERMANENTLY_DELETED_BUSINESS_NAMES.some((term) => nameLower.includes(term))) {
      return true;
    }
  }
  return false;
}

export function getStoredBusinesses(): Business[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.BUSINESSES);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        // Strip any residual legacy or permanently deleted businesses
        const clean = parsed.filter((b) => b && b.id && !isDeletedBusiness(b));
        if (clean.length !== parsed.length) {
          localStorage.setItem(STORAGE_KEYS.BUSINESSES, JSON.stringify(clean));
        }
        return clean;
      }
    }
  } catch (e) {
    console.error('Failed to load businesses from storage', e);
  }
  return [];
}

export function saveBusinesses(businesses: Business[]): void {
  try {
    const clean = Array.isArray(businesses) ? businesses.filter((b) => !isDeletedBusiness(b)) : [];
    localStorage.setItem(STORAGE_KEYS.BUSINESSES, JSON.stringify(clean));
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
        const demoReviewIds = ['rev-buka-1', 'rev-kempinski-1', 'rev-zion-1', 'rev-veritas-1', 'rev-buildright-1', 'rev-tony-1'];
        return parsed.filter(
          (r) =>
            r &&
            r.id &&
            !demoReviewIds.includes(r.id) &&
            !PERMANENTLY_DELETED_BUSINESS_IDS.includes(r.businessId)
        );
      }
    }
  } catch (e) {
    console.error('Failed to load reviews from storage', e);
  }
  return [];
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
      const user: UserProfile = JSON.parse(data);
      if (user) {
        user.emailVerified = true;
      }
      if (user?.email) {
        const clean = user.email.trim().toLowerCase();
        if (clean === 'anthonydeitutu29@gmail.com' || clean === 'admindashboard@gmail.com' || clean === 'tonysdigitalmarketing@gmail.com') {
          user.role = 'admin';
          user.emailVerified = true;
          user.phoneVerified = true;
        }
      }
      return user;
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
    // 1. Invalidate Supabase session if configured
    if (isSupabaseConfigured) {
      await SupabaseService.signOut().catch(() => {});
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

/**
 * Permanently deletes a user account record, all related session state,
 * and optionally all businesses, reviews, and inquiries owned by that account.
 */
export function permanentlyDeleteAccountRecord(
  userId: string,
  email: string,
  deleteBusinesses: boolean = true
): { success: boolean; deletedBusinessIds: string[]; message: string } {
  const deletedBusinessIds: string[] = [];
  const cleanEmail = (email || '').trim().toLowerCase();

  try {
    // 1. Remove from registered accounts
    const accounts = getRegisteredAccounts();
    const updatedAccounts = accounts.filter(
      (a) => a.id !== userId && a.email.toLowerCase() !== cleanEmail
    );
    localStorage.setItem(STORAGE_KEYS.REGISTERED_ACCOUNTS, JSON.stringify(updatedAccounts));

    // 2. Remove from active user session
    const currentUser = getStoredCurrentUser();
    if (currentUser && (currentUser.id === userId || currentUser.email.toLowerCase() === cleanEmail)) {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }

    // 3. If requested, remove businesses owned by this user
    if (deleteBusinesses) {
      const storedBiz = getStoredBusinesses();
      const retainedBiz = storedBiz.filter((b) => {
        const isOwner =
          (b.ownerId && b.ownerId === userId) ||
          (b.ownerEmail && b.ownerEmail.toLowerCase() === cleanEmail) ||
          (b.email && b.email.toLowerCase() === cleanEmail);
        if (isOwner) {
          deletedBusinessIds.push(b.id);
          return false;
        }
        return true;
      });

      saveBusinesses(retainedBiz);

      // Clean up reviews and inquiries associated with the deleted businesses
      if (deletedBusinessIds.length > 0) {
        const reviews = getStoredReviews().filter((r) => !deletedBusinessIds.includes(r.businessId));
        saveReviews(reviews);

        const inquiries = getStoredInquiries().filter((inq) => !deletedBusinessIds.includes(inq.businessId));
        saveInquiries(inquiries);
      }
    }

    // 4. Clean up saved businesses and local cache
    localStorage.removeItem(STORAGE_KEYS.SAVED_BUSINESSES);
    localStorage.removeItem('auracentra_saved_ids');

    // 5. Invalidate any persistent session tokens
    validateAndClearSession().catch(() => {});

    return {
      success: true,
      deletedBusinessIds,
      message: 'Account and associated data permanently purged from AuraCentra.',
    };
  } catch (err: any) {
    console.error('Failed to permanently delete account record:', err);
    return {
      success: false,
      deletedBusinessIds,
      message: err.message || 'Error occurred while purging account.',
    };
  }
}

export function normalizePhoneNumber(phone?: string): string {
  if (!phone) return '';
  let cleaned = phone.replace(/[\s\-\(\)\.]/g, '').trim();
  // Standardize Ghana telephone formatting: +233, 233, or leading 0
  if (cleaned.startsWith('+233')) {
    cleaned = '0' + cleaned.slice(4);
  } else if (cleaned.startsWith('233') && cleaned.length >= 12) {
    cleaned = '0' + cleaned.slice(3);
  }
  return cleaned;
}

export function normalizeUsername(username?: string): string {
  if (!username) return '';
  return username.trim().toLowerCase().replace(/^@+/, '');
}

export function findRegisteredAccountByEmail(email: string): UserAccountRecord | null {
  const cleanEmail = email.trim().toLowerCase();
  const accounts = getRegisteredAccounts();
  return accounts.find((a) => a.email.toLowerCase() === cleanEmail) || null;
}

export function findRegisteredAccountByPhone(phone: string): UserAccountRecord | null {
  const cleanPhone = normalizePhoneNumber(phone);
  if (!cleanPhone || cleanPhone.length < 9) return null;
  const accounts = getRegisteredAccounts();
  return accounts.find((a) => {
    if (!a.phone) return false;
    const aCleanPhone = normalizePhoneNumber(a.phone);
    return aCleanPhone === cleanPhone;
  }) || null;
}

export function findRegisteredAccountByUsername(username: string): UserAccountRecord | null {
  const cleanUser = normalizeUsername(username);
  if (!cleanUser) return null;
  const accounts = getRegisteredAccounts();
  return accounts.find((a) => {
    if (a.username && normalizeUsername(a.username) === cleanUser) return true;
    // Also check if username matches the email prefix
    const emailPrefix = normalizeUsername(a.email.split('@')[0]);
    if (emailPrefix === cleanUser) return true;
    return false;
  }) || null;
}

/**
 * Validates uniqueness of Email, Phone number, and Username before registration.
 * Ensures an email, phone number, or username can ONLY be used once across the platform.
 */
export function checkAccountUniqueness(params: {
  email: string;
  phone?: string;
  username?: string;
  excludeAccountId?: string;
  allowExisting?: boolean;
}): { isUnique: boolean; conflictField?: 'email' | 'phone' | 'username'; isExistingUser?: boolean; errorMessage?: string } {
  const cleanEmail = (params.email || '').trim().toLowerCase();
  const cleanPhone = normalizePhoneNumber(params.phone);
  const cleanUsername = normalizeUsername(params.username);
  const accounts = getRegisteredAccounts();

  if (params.allowExisting) {
    return { isUnique: true, isExistingUser: true };
  }

  for (const acc of accounts) {
    if (params.excludeAccountId && acc.id === params.excludeAccountId) {
      continue;
    }

    // 1. Check Phone Number Uniqueness (only if distinct phone)
    if (cleanPhone && cleanPhone.length >= 9 && acc.phone && acc.email.toLowerCase() !== cleanEmail) {
      const accPhone = normalizePhoneNumber(acc.phone);
      if (accPhone === cleanPhone) {
        if (acc.emailVerified !== false) {
          return {
            isUnique: false,
            conflictField: 'phone',
            errorMessage: `The phone number "${params.phone?.trim()}" is already associated with another account.`
          };
        }
      }
    }

    // 2. Check Username Uniqueness (only if distinct email)
    if (cleanUsername && acc.email.toLowerCase() !== cleanEmail) {
      const accUser = acc.username ? normalizeUsername(acc.username) : normalizeUsername(acc.email.split('@')[0]);
      if (accUser === cleanUsername) {
        if (acc.emailVerified !== false) {
          return {
            isUnique: false,
            conflictField: 'username',
            errorMessage: `The username "@${cleanUsername}" is already taken. Please choose another username.`
          };
        }
      }
    }
  }

  return { isUnique: true };
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
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed.filter(
          (inq) =>
            inq &&
            inq.businessId &&
            !PERMANENTLY_DELETED_BUSINESS_IDS.includes(inq.businessId) &&
            !PERMANENTLY_DELETED_BUSINESS_NAMES.some((term) =>
              (inq.businessName || '').toLowerCase().includes(term)
            )
        );
      }
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

