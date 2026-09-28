import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Business, BusinessInsert } from '../types';

// Storage keys
const SUPABASE_URL_KEY = 'auracentra_supabase_url';
const SUPABASE_ANON_KEY = 'auracentra_supabase_anon_key';
const PERMANENT_LISTINGS_KEY = 'auracentra_permanent_listings';
const RESET_FLAG_KEY = 'auracentra_businesses_reset_v2';

const DEFAULT_SUPABASE_URL = 'https://oatpbsemkwmglmrdlmld.supabase.co';
const DEFAULT_SUPABASE_KEY = 'sb_publishable_6sT0WCaqD8kLx74LhDyOJQ_fnEZmhVz';

// Template and current businesses removed: directory begins with a clean slate
export const INITIAL_VERIFIED_BUSINESSES: Business[] = [];

// Template IDs to purge
const TEMPLATE_BUSINESS_IDS = new Set([
  'biz-royal-taste',
  'biz-zee-fashion',
  'biz-quickfix-auto',
  'biz-techworld-ghana',
  'biz-tony-digital',
  'biz-buka-osu',
  'biz-hubtel-ghana',
  'biz-silverbird-cinema',
  'biz-kempinski-accra',
  'biz-movenpick-ambassador',
  'biz-accra-mall',
  'biz-denya-developers',
  'biz-melcom-plus',
  'biz-palace-hypermarket',
  'biz-tema-freight',
  'biz-seed-1',
  'biz-seed-2',
  'biz-seed-3'
]);

export function getSupabaseCredentials(): { url: string; key: string; source: 'env' | 'custom' | 'none' } {
  if (typeof window !== 'undefined') {
    const customUrl = localStorage.getItem(SUPABASE_URL_KEY);
    const customKey = localStorage.getItem(SUPABASE_ANON_KEY);
    if (customUrl && customKey && customUrl.startsWith('http')) {
      return { url: customUrl, key: customKey, source: 'custom' };
    }
  }

  const metaEnv = typeof import.meta !== 'undefined' && (import.meta as any).env ? (import.meta as any).env : {};
  const procEnv = typeof process !== 'undefined' && process.env ? process.env : {};
  const envUrl = metaEnv.VITE_SUPABASE_URL || metaEnv.NEXT_PUBLIC_SUPABASE_URL || procEnv.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const envKey = metaEnv.VITE_SUPABASE_ANON_KEY || metaEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY || procEnv.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_KEY;

  if (envUrl && envKey && !envUrl.includes('your-project') && envUrl.startsWith('http')) {
    return { url: envUrl, key: envKey, source: 'env' };
  }

  return { url: DEFAULT_SUPABASE_URL, key: DEFAULT_SUPABASE_KEY, source: 'env' };
}

let activeSupabaseClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  const creds = getSupabaseCredentials();
  const url = creds.url || 'https://placeholder.supabase.co';
  const key = creds.key || 'placeholder-key';

  if (!activeSupabaseClient) {
    activeSupabaseClient = createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      }
    });
  }
  return activeSupabaseClient;
}

export const isSupabaseConfigured = (): boolean => {
  const creds = getSupabaseCredentials();
  return creds.source !== 'none';
};

/**
 * Returns all permanent listings stored in the user's browser, purged of all current and template businesses
 */
export function getPermanentListings(): Business[] {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      // One-time complete purge of legacy current and template businesses
      if (!localStorage.getItem(RESET_FLAG_KEY)) {
        localStorage.removeItem(PERMANENT_LISTINGS_KEY);
        localStorage.setItem(RESET_FLAG_KEY, 'true');
        return [];
      }

      const stored = localStorage.getItem(PERMANENT_LISTINGS_KEY);
      if (stored) {
        const parsed: Business[] = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const cleaned = parsed.filter(b => !TEMPLATE_BUSINESS_IDS.has(b.id) && !b.id.startsWith('biz-seed-'));
          if (cleaned.length !== parsed.length) {
            localStorage.setItem(PERMANENT_LISTINGS_KEY, JSON.stringify(cleaned));
          }
          return cleaned;
        }
      }
    } catch (e) {
      console.warn('Failed to parse permanent listings from localStorage:', e);
    }
  }
  return [];
}

/**
 * Permanently saves an enlisted business so it stays in localStorage and shows on the live site
 */
export function saveListingPermanently(listing: Business): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getPermanentListings();
    const filtered = current.filter(b => b.id !== listing.id && !(b.name.toLowerCase() === listing.name.toLowerCase() && b.phone === listing.phone));
    filtered.unshift(listing); // Prepend to show at the very top!
    localStorage.setItem(PERMANENT_LISTINGS_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new CustomEvent('auracentra_listings_updated', { detail: listing }));
  } catch (err) {
    console.warn('Failed to persist listing in localStorage:', err);
  }
}

/**
 * Insert business listing ensuring it is permanently saved in browser storage
 */
export async function insertBusinessListing(listing: BusinessInsert): Promise<{
  success: boolean;
  data: Business;
  error: any | null;
  savedToSupabase: boolean;
}> {
  const finalListing: Business = {
    ...listing,
    id: listing.id || `biz-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    created_at: new Date().toISOString(),
    verified: Boolean(listing.ghana_card_number?.trim()),
    featured: true,
    status: 'approved',
  };

  // Save permanently in browser localStorage
  saveListingPermanently(finalListing);

  return { success: true, data: finalListing, error: null, savedToSupabase: false };
}

/**
 * Fetch all enlisted businesses (clean slate - returns only newly enlisted businesses)
 */
export async function fetchBusinessListings(): Promise<{
  businesses: Business[];
  error: any | null;
  fromSupabase: boolean;
}> {
  const permanentItems = getPermanentListings();
  return { businesses: permanentItems, error: null, fromSupabase: false };
}
