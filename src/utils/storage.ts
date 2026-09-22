import { Business, Category, BusinessReview, UserProfile, UserAccountRecord, BusinessInquiry, BusinessReport, CategorySuggestion, PlatformFeedback, UserNotification } from '../types';
import { INITIAL_BUSINESSES, INITIAL_CATEGORIES, INITIAL_REVIEWS } from '../data/initialData';
import { SupabaseService, isSupabaseConfigured } from '../lib/supabase';

const STORAGE_KEYS = {
  BUSINESSES: 'auracentra_businesses_clean_v28',
  CATEGORIES: 'auracentra_categories_clean_v28',
  REVIEWS: 'auracentra_reviews_clean_v28',
  CURRENT_USER: 'auracentra_user_clean_v28',
  REGISTERED_ACCOUNTS: 'auracentra_registered_accounts_v28',
  SAVED_BUSINESSES: 'auracentra_saved_clean_v28',
  SEARCH_HISTORY: 'auracentra_search_history_clean_v28',
  THEME: 'auracentra_theme_clean_v28',
  SHOW_EXECUTIVE_SECTION: 'auracentra_show_executive_clean_v28',
  INQUIRIES: 'auracentra_inquiries_clean_v28',
  PROMOTIONS: 'auracentra_promotions_clean_v28',
  REPORTS: 'auracentra_reports_clean_v28',
  SUGGESTIONS: 'auracentra_suggestions_clean_v28',
  FEEDBACK: 'auracentra_feedback_clean_v28',
  NEWS_LIKES: 'auracentra_news_likes_v28',
  USER_NOTIFICATIONS: 'auracentra_user_notifications_v28',
};

const APPROVED_STORAGE_KEY = 'auracentra_approved_business_ids_v28';
const DYNAMIC_DELETED_KEY = 'auracentra_permanently_deleted_ids_v28';

// Immediate complete purge of legacy accounts, mock data, and business records
try {
  const currentV28Keys = [...Object.values(STORAGE_KEYS), APPROVED_STORAGE_KEY, DYNAMIC_DELETED_KEY];
  const allKeys = Object.keys(localStorage);
  for (const key of allKeys) {
    if (key.startsWith('auracentra_') && !currentV28Keys.includes(key)) {
      localStorage.removeItem(key);
    }
  }
} catch {
  // ignore in non-browser environments
}

// ============================================================================
// INDEXED-DB PERSISTENCE (High capacity client-side storage for rich data & media)
// ============================================================================
const IDB_NAME = 'auracentra_idb_v28';
const IDB_STORE = 'keyval';
let idbDatabasePromise: Promise<IDBDatabase> | null = null;

function getIDB(): Promise<IDBDatabase> {
  if (idbDatabasePromise) return idbDatabasePromise;
  idbDatabasePromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported in current environment'));
      return;
    }
    const req = window.indexedDB.open(IDB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(IDB_STORE)) {
        db.createObjectStore(IDB_STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return idbDatabasePromise;
}

export async function idbSet<T>(key: string, value: T): Promise<void> {
  try {
    const db = await getIDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      const store = tx.objectStore(IDB_STORE);
      const putReq = store.put(value, key);
      putReq.onsuccess = () => resolve();
      putReq.onerror = () => reject(putReq.error);
    });
  } catch {
    // Non-fatal background storage error
  }
}

export async function idbGet<T>(key: string): Promise<T | null> {
  try {
    const db = await getIDB();
    return new Promise((resolve) => {
      const tx = db.transaction(IDB_STORE, 'readonly');
      const store = tx.objectStore(IDB_STORE);
      const getReq = store.get(key);
      getReq.onsuccess = () => resolve(getReq.result !== undefined ? getReq.result : null);
      getReq.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

// ============================================================================
// SAFE LOCALSTORAGE ENGINE (Quota auto-eviction & silent failover)
// ============================================================================
export function purgeNonEssentialStorage(): void {
  try {
    const nonEssentialKeys = [
      STORAGE_KEYS.SEARCH_HISTORY,
      STORAGE_KEYS.FEEDBACK,
      STORAGE_KEYS.REPORTS,
      STORAGE_KEYS.SUGGESTIONS,
      'auracentra_visitor_summary',
      'auracentra_user_locations_v2',
      'auracentra_telemetry_events_v2',
      'auracentra_news_likes_v26',
    ];
    for (const k of nonEssentialKeys) {
      localStorage.removeItem(k);
    }
    const allKeys = Object.keys(localStorage);
    for (const key of allKeys) {
      if (key.startsWith('auracentra_') && !key.includes('_v26')) {
        localStorage.removeItem(key);
      }
    }
  } catch {}
}

export function safeSetItem(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (err: any) {
    if (
      err?.name === 'QuotaExceededError' ||
      err?.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
      err?.code === 22 ||
      err?.code === 1014 ||
      (typeof err?.message === 'string' &&
        (err.message.toLowerCase().includes('quota') || err.message.toLowerCase().includes('exceeded')))
    ) {
      purgeNonEssentialStorage();
      try {
        localStorage.setItem(key, value);
        return true;
      } catch {
        // Quota still exceeded after purge. Safely handled by in-memory cache and IndexedDB.
        return false;
      }
    }
    return false;
  }
}

export function isHeavyDataUrl(val?: string | null): boolean {
  return typeof val === 'string' && val.startsWith('data:') && val.length > 2000;
}

export function sanitizeBusinessForLocalStorage(b: Business): Business {
  const cleanGallery = Array.isArray(b.gallery)
    ? b.gallery.map((img) => (isHeavyDataUrl(img) ? '' : img)).filter(Boolean)
    : [];

  const cleanVerificationDocs = Array.isArray(b.verificationDocuments)
    ? b.verificationDocuments.map((doc) => ({
        ...doc,
        frontImageUrl: isHeavyDataUrl(doc.frontImageUrl) ? '' : doc.frontImageUrl,
        backImageUrl: isHeavyDataUrl(doc.backImageUrl) ? '' : doc.backImageUrl,
        selfieUrl: isHeavyDataUrl(doc.selfieUrl) ? '' : doc.selfieUrl,
      }))
    : undefined;

  let cleanVerificationDetails = b.verificationDetails;
  if (cleanVerificationDetails) {
    const vd = { ...cleanVerificationDetails } as any;
    if (isHeavyDataUrl(vd.businessCertificateBase64)) vd.businessCertificateBase64 = '';
    if (isHeavyDataUrl(vd.taxCertificateBase64)) vd.taxCertificateBase64 = '';
    if (isHeavyDataUrl(vd.idFrontBase64)) vd.idFrontBase64 = '';
    if (isHeavyDataUrl(vd.idBackBase64)) vd.idBackBase64 = '';
    cleanVerificationDetails = vd;
  }

  return {
    ...b,
    logo: isHeavyDataUrl(b.logo) ? '' : b.logo,
    coverImage: isHeavyDataUrl(b.coverImage) ? '' : b.coverImage,
    gallery: cleanGallery,
    verificationDocuments: cleanVerificationDocs,
    verificationDetails: cleanVerificationDetails,
  };
}

// Initial state getters and setters
export const PERMANENTLY_DELETED_BUSINESS_IDS: string[] = [
  'biz-kempinski-accra',
  'biz-nyaho-clinic',
  'biz-buka-accra',
  'biz-vodam-kumasi',
  'biz-1788360528413',
  'biz-1789479904226',
  'biz-test-sync-1',
  'biz-1789998929571',
  'biz-tonys-digital-marketing-hub',
  'biz-1790069272618',
  'biz-ghana-fresh-organics-101',
];

export const PERMANENTLY_DELETED_BUSINESS_NAMES: string[] = [
  'Kempinski Hotel Gold Coast City',
  'Nyaho Medical Centre',
  'Buka Restaurant Osu',
  'Sweet Gardens Hotel Kumasi',
  "Tony's Digital Marketing and Business Hub",
  "Tony’s Digital Marketing and Business Hub",
  'Test Persistence Listing',
  'Accra Tech Solutions Hub',
  'Accra Express Logistics',
  'Ghana Fresh Organics Ltd',
];

// Permanently approved & verified enterprise listings across all sessions
export const PERMANENTLY_APPROVED_BUSINESS_IDS: string[] = [];

export function getDynamicallyDeletedBusinessIds(): Set<string> {
  const set = new Set<string>();
  try {
    const raw = localStorage.getItem(DYNAMIC_DELETED_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        parsed.forEach((id) => set.add(id));
      }
    }
  } catch (e) {}
  return set;
}

export function markBusinessPermanentlyDeleted(businessId: string): void {
  if (!businessId) return;
  try {
    const ids = getDynamicallyDeletedBusinessIds();
    ids.add(businessId);
    safeSetItem(DYNAMIC_DELETED_KEY, JSON.stringify(Array.from(ids)));
  } catch (e) {}
}

export function unmarkBusinessPermanentlyDeleted(businessId: string): void {
  if (!businessId) return;
  try {
    const ids = getDynamicallyDeletedBusinessIds();
    ids.delete(businessId);
    safeSetItem(DYNAMIC_DELETED_KEY, JSON.stringify(Array.from(ids)));
  } catch (e) {}
}

export function getApprovedBusinessIds(): Set<string> {
  const set = new Set<string>(PERMANENTLY_APPROVED_BUSINESS_IDS);
  try {
    const raw = localStorage.getItem(APPROVED_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        parsed.forEach((id) => set.add(id));
      }
    }
  } catch (e) {
    // Ignore error
  }
  return set;
}

export function markBusinessPermanentlyApproved(businessId: string): void {
  if (!businessId) return;
  try {
    unmarkBusinessPermanentlyDeleted(businessId);
    const ids = getApprovedBusinessIds();
    ids.add(businessId);
    safeSetItem(APPROVED_STORAGE_KEY, JSON.stringify(Array.from(ids)));
  } catch (e) {
    // Ignore error
  }
}

export function unmarkBusinessPermanentlyApproved(businessId: string): void {
  if (!businessId) return;
  try {
    const ids = getApprovedBusinessIds();
    ids.delete(businessId);
    safeSetItem(APPROVED_STORAGE_KEY, JSON.stringify(Array.from(ids)));
  } catch (e) {
    // Ignore error
  }
}

export function isBusinessPermanentlyApproved(businessId?: string | null): boolean {
  if (!businessId) return false;
  return getApprovedBusinessIds().has(businessId);
}

export function isTonysDigitalMarketingHub(b: Partial<Business> | null | undefined): boolean {
  return false;
}

export function isDeletedBusiness(b: Partial<Business> | null | undefined): boolean {
  if (!b) return true;
  const id = b.id || '';
  const name = (b.name || '').trim().toLowerCase();

  // Check explicit delete markers by id
  if (id && (PERMANENTLY_DELETED_BUSINESS_IDS.includes(id) || getDynamicallyDeletedBusinessIds().has(id))) {
    return true;
  }
  // Check delete markers by name
  if (name && PERMANENTLY_DELETED_BUSINESS_NAMES.some((dn) => dn.toLowerCase() === name || name.includes(dn.toLowerCase()))) {
    return true;
  }
  return false;
}

let runtimeBusinessesCache: Business[] | null = null;

export function getStoredBusinesses(): Business[] {
  if (runtimeBusinessesCache && runtimeBusinessesCache.length > 0) {
    return runtimeBusinessesCache.filter((b) => b && b.id && !isDeletedBusiness(b));
  }

  try {
    const data = localStorage.getItem(STORAGE_KEYS.BUSINESSES);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Strip any residual legacy or permanently deleted businesses
        let clean = parsed.filter((b) => b && b.id && !isDeletedBusiness(b));

        // Preserve probation / investigation status; default newly registered businesses to active
        clean.forEach((b) => {
          if (b.listingStatus === 'probation' || b.listingStatus === 'under_investigation' || b.underInvestigation) {
            b.listingStatus = 'probation';
            b.underInvestigation = true;
          } else if (b.listingStatus === 'rejected') {
            b.listingStatus = 'rejected';
          } else {
            // Auto-enlisted and active by default
            b.listingStatus = 'active';
            b.isApproved = true;
            b.permanentlyEnlisted = true;
            b.underInvestigation = false;
          }
        });

        runtimeBusinessesCache = clean;
        return clean;
      }
    }
  } catch (e) {
    console.error('Failed to load businesses from storage', e);
  }

  if (INITIAL_BUSINESSES.length > 0) {
    safeSetItem(STORAGE_KEYS.BUSINESSES, JSON.stringify(INITIAL_BUSINESSES));
  }

  runtimeBusinessesCache = [];
  return [];
}

// Background hydration from IndexedDB to restore rich media if localStorage had sanitized versions
if (typeof window !== 'undefined') {
  idbGet<Business[]>(STORAGE_KEYS.BUSINESSES).then((idbBiz) => {
    if (Array.isArray(idbBiz) && idbBiz.length > 0) {
      const current = runtimeBusinessesCache || [];
      const map = new Map<string, Business>();
      current.forEach((b) => map.set(b.id, b));

      let changed = false;
      idbBiz.forEach((idbB) => {
        if (isDeletedBusiness(idbB)) return;
        const cur = map.get(idbB.id);
        if (cur) {
          if (!cur.logo && idbB.logo) { cur.logo = idbB.logo; changed = true; }
          if (!cur.coverImage && idbB.coverImage) { cur.coverImage = idbB.coverImage; changed = true; }
          if ((!cur.gallery || cur.gallery.length === 0) && idbB.gallery && idbB.gallery.length > 0) {
            cur.gallery = idbB.gallery;
            changed = true;
          }
          if (!cur.verificationDetails && idbB.verificationDetails) {
            cur.verificationDetails = idbB.verificationDetails;
            changed = true;
          }
          if (!cur.verificationDocuments && idbB.verificationDocuments) {
            cur.verificationDocuments = idbB.verificationDocuments;
            changed = true;
          }
        } else {
          map.set(idbB.id, idbB);
          changed = true;
        }
      });

      if (changed) {
        runtimeBusinessesCache = Array.from(map.values());
        window.dispatchEvent(new CustomEvent('auracentra_storage_updated', { detail: { key: STORAGE_KEYS.BUSINESSES } }));
      }
    }
  }).catch(() => {});
}

export function saveBusinesses(businesses: Business[]): void {
  try {
    const clean = Array.isArray(businesses) ? businesses.filter((b) => !isDeletedBusiness(b)) : [];
    clean.forEach((b) => {
      if (b.listingStatus === 'probation' || b.listingStatus === 'under_investigation' || b.underInvestigation) {
        b.listingStatus = 'probation';
        b.underInvestigation = true;
        unmarkBusinessPermanentlyApproved(b.id);
      } else if (b.listingStatus === 'rejected') {
        b.listingStatus = 'rejected';
        unmarkBusinessPermanentlyApproved(b.id);
      } else {
        b.listingStatus = 'active';
        b.isApproved = true;
        b.permanentlyEnlisted = true;
        b.underInvestigation = false;
        markBusinessPermanentlyApproved(b.id);
      }
    });

    // 1. Maintain complete pristine data in runtime cache
    runtimeBusinessesCache = clean;

    // 2. Persist full data asynchronously to IndexedDB (virtually unlimited quota capacity)
    idbSet(STORAGE_KEYS.BUSINESSES, clean).catch(() => {});

    // 3. For localStorage, check if clean contains heavy base64 data URLs
    const hasHeavyData = clean.some(
      (b) =>
        isHeavyDataUrl(b.logo) ||
        isHeavyDataUrl(b.coverImage) ||
        (Array.isArray(b.gallery) && b.gallery.some(isHeavyDataUrl)) ||
        (Array.isArray(b.verificationDocuments) &&
          b.verificationDocuments.some(
            (d) => isHeavyDataUrl(d.frontImageUrl) || isHeavyDataUrl(d.backImageUrl) || isHeavyDataUrl(d.selfieUrl)
          ))
    );

    const payload = hasHeavyData ? clean.map(sanitizeBusinessForLocalStorage) : clean;
    let ok = safeSetItem(STORAGE_KEYS.BUSINESSES, JSON.stringify(payload));

    if (!ok && !hasHeavyData) {
      // If saving full clean failed on quota, retry with sanitized images
      const sanitized = clean.map(sanitizeBusinessForLocalStorage);
      ok = safeSetItem(STORAGE_KEYS.BUSINESSES, JSON.stringify(sanitized));
    }

    if (!ok) {
      // If still exceeding quota, write compact directory records to localStorage
      const compact = clean.map((b) => ({
        id: b.id,
        name: b.name,
        slug: b.slug,
        category: b.category,
        subCategory: b.subCategory,
        city: b.city,
        region: b.region,
        address: b.address,
        phone: b.phone,
        whatsapp: b.whatsapp,
        email: b.email,
        listingStatus: b.listingStatus,
        verificationStatus: b.verificationStatus,
        isApproved: b.isApproved,
        permanentlyEnlisted: true,
        rating: b.rating,
        reviewCount: b.reviewCount,
        tagline: b.tagline,
        priceLevel: b.priceLevel,
        views: b.views,
        leadsCount: b.leadsCount,
        createdAt: b.createdAt,
        updatedAt: b.updatedAt,
      }));
      safeSetItem(STORAGE_KEYS.BUSINESSES, JSON.stringify(compact));
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('auracentra_storage_updated', { detail: { key: STORAGE_KEYS.BUSINESSES } }));
    }
  } catch (e) {
    console.warn('[Storage] Managed warning saving businesses to storage:', e);
  }
}

export function getStoredCategories(): Category[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Merge with INITIAL_CATEGORIES to ensure all standard sectors exist
        const existingIds = new Set(parsed.map((c) => c.id));
        const missingDefaults = INITIAL_CATEGORIES.filter((c) => !existingIds.has(c.id));
        return [...parsed, ...missingDefaults];
      }
    }
  } catch (e) {
    console.error('Failed to load categories from storage', e);
  }
  return INITIAL_CATEGORIES;
}

export function saveCategories(categories: Category[]): void {
  try {
    safeSetItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  } catch (e) {
    console.warn('[Storage] Notice saving categories:', e);
  }
}

export function getStoredReviews(): BusinessReview[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed.filter(
          (r) =>
            r &&
            r.id &&
            !getDynamicallyDeletedBusinessIds().has(r.businessId)
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
    safeSetItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  } catch (e) {
    console.warn('[Storage] Notice saving reviews:', e);
  }
}

export function getStoredCurrentUser(): UserProfile | null {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (data) {
      const user: UserProfile = JSON.parse(data);
      if (user?.email) {
        const clean = user.email.trim().toLowerCase();
        if (clean === 'admindashboard@gmail.com') {
          user.role = 'admin';
          user.emailVerified = true;
          user.phoneVerified = true;
          return user;
        }
        if (isLegacyDeletedEmail(clean)) {
          localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
          return null;
        }
        // Verify against active registered accounts list
        const registered = getRegisteredAccounts();
        const exists = registered.some((a) => a.email.toLowerCase() === clean);
        if (!exists) {
          localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
          return null;
        }
        user.emailVerified = true;
        return user;
      }
    }
  } catch (e) {
    console.error('Failed to load current user', e);
  }
  return null;
}

export function saveCurrentUser(user: UserProfile | null): void {
  try {
    if (user) {
      safeSetItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  } catch (e) {
    console.warn('[Storage] Notice saving current user:', e);
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
    safeSetItem(STORAGE_KEYS.NEWS_LIKES, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.warn('[Storage] Notice updating news like:', e);
    return [];
  }
}

// Built-in executive system administrator credentials
export const DEFAULT_ADMIN_ACCOUNT: UserAccountRecord = {
  id: 'admin-super-01',
  name: 'AuraCentra Executive Admin',
  username: 'admin',
  email: 'admindashboard@gmail.com',
  phone: '+233 50 820 3673',
  role: 'admin',
  password: 'Admin12$',
  createdAt: '2026-01-01T00:00:00.000Z',
};

export const LEGACY_TEST_EMAILS: string[] = [
  'tonysdigitalmarketing@gmail.com',
  'anthonydeitutu29@gmail.com',
  'anthonydeitutu61@gmail.com',
  'anthonydeitutu0@gmail.com',
  'cleanupcleaner9988@gmail.com',
  'tempadmin_cleanup@gmail.com',
];

export function isLegacyDeletedEmail(email?: string | null): boolean {
  if (!email) return false;
  return LEGACY_TEST_EMAILS.includes(email.trim().toLowerCase());
}

export function getRegisteredAccounts(): UserAccountRecord[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.REGISTERED_ACCOUNTS);
    if (data) {
      const parsed: UserAccountRecord[] = JSON.parse(data);
      if (Array.isArray(parsed)) {
        const result = parsed.filter((a) => {
          if (!a || !a.email) return false;
          const em = a.email.toLowerCase().trim();
          if (isLegacyDeletedEmail(em)) return false;
          return true;
        });
        return result;
      }
    }
  } catch (e) {
    console.error('Failed to load registered accounts from storage', e);
  }
  return [];
}

export function saveRegisteredAccount(account: UserAccountRecord): void {
  try {
    const cleanEmail = account.email.toLowerCase().trim();
    const accounts = getRegisteredAccounts();
    const existingIndex = accounts.findIndex(
      (a) => a.email.toLowerCase() === cleanEmail || a.id === account.id
    );
    let updated: UserAccountRecord[];
    if (existingIndex >= 0) {
      updated = [...accounts];
      updated[existingIndex] = { ...updated[existingIndex], ...account, lastLoginAt: new Date().toISOString() };
    } else {
      updated = [...accounts, { ...account, lastLoginAt: new Date().toISOString() }];
    }
    safeSetItem(STORAGE_KEYS.REGISTERED_ACCOUNTS, JSON.stringify(updated));

    // Also sync to server background registry
    try {
      fetch('/api/auth/sync-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: account.id,
          name: account.name,
          username: account.username,
          email: cleanEmail,
          password: account.password,
          role: account.role,
          phone: account.phone,
          businessName: account.businessName,
        }),
      }).catch(() => {});
    } catch {
      // ignore
    }
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
    safeSetItem(STORAGE_KEYS.REGISTERED_ACCOUNTS, JSON.stringify(updatedAccounts));

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
 * Universal account finder: resolves email, phone, username, full name, or business name.
 */
export function findRegisteredAccountByIdentifier(identifier?: string): UserAccountRecord | null {
  if (!identifier) return null;
  const clean = identifier.trim();
  const cleanLower = clean.toLowerCase();
  const cleanNoPunct = cleanLower.replace(/[^a-z0-9]/g, '');

  // 1. By email
  let acc = findRegisteredAccountByEmail(clean);
  if (acc) return acc;

  // 2. By phone
  acc = findRegisteredAccountByPhone(clean);
  if (acc) return acc;

  // 3. By username
  acc = findRegisteredAccountByUsername(clean);
  if (acc) return acc;

  const accounts = getRegisteredAccounts();

  // 4. By account name or businessName
  acc = accounts.find((a) => {
    const aName = (a.name || '').toLowerCase();
    const aNameNoPunct = aName.replace(/[^a-z0-9]/g, '');
    if (aName === cleanLower || aNameNoPunct === cleanNoPunct) return true;
    if (cleanNoPunct.length >= 4 && aNameNoPunct.includes(cleanNoPunct)) return true;
    if (aNameNoPunct.length >= 4 && cleanNoPunct.includes(aNameNoPunct)) return true;
    if (a.businessName) {
      const bName = a.businessName.toLowerCase();
      const bNameNoPunct = bName.replace(/[^a-z0-9]/g, '');
      if (bName === cleanLower || bNameNoPunct === cleanNoPunct) return true;
      if (cleanNoPunct.length >= 4 && bNameNoPunct.includes(cleanNoPunct)) return true;
    }
    return false;
  }) || null;
  if (acc) return acc;

  // Match against stored businesses by owner email
  try {
    const businesses = getStoredBusinesses();
    const matchedBiz = businesses.find((b) => {
      const bName = (b.name || '').toLowerCase();
      const bNameNoPunct = bName.replace(/[^a-z0-9]/g, '');
      if (bName === cleanLower || bNameNoPunct === cleanNoPunct) return true;
      if (cleanNoPunct.length >= 6 && bNameNoPunct.includes(cleanNoPunct)) return true;
      if (bNameNoPunct.length >= 6 && cleanNoPunct.includes(bNameNoPunct)) return true;
      return false;
    });

    if (matchedBiz) {
      const ownerEmail = (matchedBiz.ownerEmail || (matchedBiz as any).owner_email || matchedBiz.email || '').toLowerCase();
      if (ownerEmail) {
        acc = findRegisteredAccountByEmail(ownerEmail);
        if (acc) return acc;
      }
    }
  } catch (e) {}

  return null;
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
    safeSetItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(history.slice(0, 10)));
  } catch (e) {
    console.warn('[Storage] Notice saving search history:', e);
  }
}

export function clearStoredSearchHistory(): void {
  try {
    safeSetItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify([]));
  } catch (e) {
    console.warn('[Storage] Notice clearing search history:', e);
  }
}

export function getExecutiveSectionVisibility(): boolean {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SHOW_EXECUTIVE_SECTION);
    if (data !== null) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.warn('[Storage] Notice loading executive section visibility:', e);
  }
  return false;
}

export function saveExecutiveSectionVisibility(visible: boolean): void {
  try {
    safeSetItem(STORAGE_KEYS.SHOW_EXECUTIVE_SECTION, JSON.stringify(visible));
  } catch (e) {
    console.warn('[Storage] Notice saving executive section visibility:', e);
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
            !getDynamicallyDeletedBusinessIds().has(inq.businessId)
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
    safeSetItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(inquiries));
  } catch (e) {
    console.warn('[Storage] Notice saving inquiries:', e);
  }
}

export function getStoredPromotions(): any[] | null {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PROMOTIONS);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.warn('[Storage] Notice loading promotions:', e);
  }
  return null;
}

export function savePromotions(promotions: any[]): void {
  try {
    safeSetItem(STORAGE_KEYS.PROMOTIONS, JSON.stringify(promotions));
  } catch (e) {
    console.warn('[Storage] Notice saving promotions:', e);
  }
}

export function getStoredReports(): BusinessReport[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.REPORTS);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.warn('[Storage] Notice loading reports:', e);
  }
  return [];
}

export function saveReports(reports: BusinessReport[]): void {
  try {
    safeSetItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
  } catch (e) {
    console.warn('[Storage] Notice saving reports:', e);
  }
}

export function getStoredCategorySuggestions(): CategorySuggestion[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SUGGESTIONS);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.warn('[Storage] Notice loading suggestions:', e);
  }
  return [];
}

export function saveCategorySuggestions(suggestions: CategorySuggestion[]): void {
  try {
    safeSetItem(STORAGE_KEYS.SUGGESTIONS, JSON.stringify(suggestions));
  } catch (e) {
    console.warn('[Storage] Notice saving suggestions:', e);
  }
}

export function getStoredFeedback(): PlatformFeedback[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.FEEDBACK);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.warn('[Storage] Notice loading feedback:', e);
  }
  return [];
}

export function saveFeedback(feedbackList: PlatformFeedback[]): void {
  try {
    safeSetItem(STORAGE_KEYS.FEEDBACK, JSON.stringify(feedbackList));
  } catch (e) {
    console.warn('[Storage] Notice saving feedback:', e);
  }
}

export function getStoredUserNotifications(): UserNotification[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USER_NOTIFICATIONS);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.warn('[Storage] Notice loading user notifications:', e);
  }
  return [];
}

export function saveUserNotification(notification: UserNotification): void {
  try {
    const current = getStoredUserNotifications();
    const updated = [notification, ...current.filter((n) => n.id !== notification.id)];
    safeSetItem(STORAGE_KEYS.USER_NOTIFICATIONS, JSON.stringify(updated));
  } catch (e) {
    console.warn('[Storage] Notice saving user notification:', e);
  }
}

export function markNotificationAsRead(notificationId: string): void {
  try {
    const current = getStoredUserNotifications();
    const updated = current.map((n) => (n.id === notificationId ? { ...n, read: true } : n));
    safeSetItem(STORAGE_KEYS.USER_NOTIFICATIONS, JSON.stringify(updated));
  } catch (e) {
    console.warn('[Storage] Notice marking notification as read:', e);
  }
}

