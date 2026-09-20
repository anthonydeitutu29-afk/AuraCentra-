import { Business, BusinessInquiry, BusinessReview } from '../types';
import { ApiClient } from './apiClient';
import { SupabaseService, isSupabaseConfigured } from '../lib/supabase';
import { isDeletedBusiness } from '../utils/storage';

/**
 * Real-time Supabase Database & REST Backend Synchronizer for AuraCentra Ghana
 */

export const FirestoreSync = {
  // Sync business to Supabase and backend
  async saveBusiness(business: Business) {
    try {
      // 1. Save to Supabase (primary)
      if (isSupabaseConfigured) {
        await SupabaseService.saveBusiness(business).catch((e) => console.warn('[Supabase Sync]', e));
      }

      // 2. Notify Express backend
      await ApiClient.createBusiness(business).catch((e) => console.warn('[Backend Notice]', e));
    } catch (err) {
      console.warn('[Data Sync] Business save warning:', err);
    }
  },

  // Delete business from Supabase and backend
  async deleteBusiness(businessId: string) {
    try {
      // 1. Delete from Supabase
      if (isSupabaseConfigured) {
        await SupabaseService.deleteBusiness(businessId).catch((e) => console.warn('[Supabase Delete]', e));
      }

      // 2. Delete from backend cache
      await ApiClient.deleteBusiness(businessId).catch((e) => console.warn('[Backend Delete]', e));
    } catch (err) {
      console.warn('[Data Sync] Business delete warning:', err);
    }
  },

  // Save inquiry/lead to Supabase and backend
  async saveInquiry(inquiry: BusinessInquiry) {
    try {
      if (isSupabaseConfigured) {
        await SupabaseService.submitInquiry(inquiry).catch((e) => console.warn('[Supabase Inquiry]', e));
      }
      await ApiClient.submitInquiry(inquiry).catch((e) => console.warn('[Backend Notice]', e));
    } catch (err) {
      console.warn('[Data Sync] Inquiry save warning:', err);
    }
  },

  // Save review
  async saveReview(review: BusinessReview) {
    try {
      if (isSupabaseConfigured) {
        await SupabaseService.submitReview(review).catch((e) => console.warn('[Supabase Review]', e));
      }
      await ApiClient.submitReview(review).catch((e) => console.warn('[Backend Notice]', e));
    } catch (err) {
      console.warn('[Data Sync] Review save warning:', err);
    }
  },

  // Subscribe to real-time businesses updates from backend API and Supabase
  subscribeBusinesses(onUpdate: (businesses: Business[]) => void) {
    let isSubscribed = true;
    let pollTimer: any = null;
    let unsubscribeSupabase: (() => void) | null = null;
    let lastFetchedHash = '';

    const computeHash = (list: Business[]) => {
      return `${list.length}_${list.map((b) => `${b.id}:${b.updatedAt || ''}:${b.listingStatus}`).join(',')}`;
    };

    const fetchBackendBusinesses = async () => {
      if (!isSubscribed) return;
      // Skip background polling if document is hidden to conserve CPU/network
      if (typeof document !== 'undefined' && document.hidden) return;

      try {
        const list = await ApiClient.getBusinesses();
        if (isSubscribed && Array.isArray(list)) {
          const cleanList = list.filter((b) => !isDeletedBusiness(b));
          const currentHash = computeHash(cleanList);
          if (currentHash !== lastFetchedHash) {
            lastFetchedHash = currentHash;
            onUpdate(cleanList);
          }
        }
      } catch (e) {
        // Silent fallback
      }
    };

    try {
      // 1. Initial immediate fetch from backend
      fetchBackendBusinesses();

      // 2. Poll backend every 12 seconds when active
      pollTimer = setInterval(fetchBackendBusinesses, 12000);

      // 3. Fast re-sync when window regains visibility
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
          fetchBackendBusinesses();
        }
      };
      if (typeof document !== 'undefined') {
        document.addEventListener('visibilitychange', handleVisibilityChange);
      }

      // 4. Prefer Supabase Realtime if configured
      if (isSupabaseConfigured) {
        unsubscribeSupabase = SupabaseService.subscribeBusinesses((list) => {
          if (isSubscribed && Array.isArray(list)) {
            const cleanList = list.filter((b) => !isDeletedBusiness(b));
            const currentHash = computeHash(cleanList);
            if (currentHash !== lastFetchedHash) {
              lastFetchedHash = currentHash;
              onUpdate(cleanList);
            }
          }
        });

        // Also fetch initial list from Supabase
        SupabaseService.fetchBusinesses().then((list) => {
          if (isSubscribed && Array.isArray(list)) {
            const cleanList = list.filter((b) => !isDeletedBusiness(b));
            const currentHash = computeHash(cleanList);
            if (currentHash !== lastFetchedHash) {
              lastFetchedHash = currentHash;
              onUpdate(cleanList);
            }
          }
        }).catch(() => {});
      }

      return () => {
        isSubscribed = false;
        if (pollTimer) clearInterval(pollTimer);
        if (unsubscribeSupabase) unsubscribeSupabase();
        if (typeof document !== 'undefined') {
          document.removeEventListener('visibilitychange', handleVisibilityChange);
        }
      };
    } catch (err) {
      console.warn('[Data Sync] Subscribe listener error:', err);
      return () => {
        isSubscribed = false;
        if (pollTimer) clearInterval(pollTimer);
      };
    }
  }
};
