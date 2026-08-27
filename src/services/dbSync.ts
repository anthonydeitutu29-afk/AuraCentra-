import { Business, BusinessInquiry, BusinessReview } from '../types';
import { ApiClient } from './apiClient';
import { SupabaseService, isSupabaseConfigured } from '../lib/supabase';

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

  // Subscribe to real-time businesses updates from Supabase
  subscribeBusinesses(onUpdate: (businesses: Business[]) => void) {
    try {
      // 1. Prefer Supabase Realtime if configured
      if (isSupabaseConfigured) {
        const unsubscribeSupabase = SupabaseService.subscribeBusinesses((list) => {
          onUpdate(list);
        });

        // Also fetch initial list immediately
        SupabaseService.fetchBusinesses().then((list) => {
          if (list && list.length > 0) {
            onUpdate(list);
          }
        }).catch(() => {});

        return unsubscribeSupabase;
      }

      return () => {};
    } catch (err) {
      console.warn('[Data Sync] Subscribe listener error:', err);
      return () => {};
    }
  }
};
