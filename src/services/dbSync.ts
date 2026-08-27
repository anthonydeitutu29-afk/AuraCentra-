import { collection, doc, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Business, BusinessInquiry, BusinessReview } from '../types';
import { ApiClient } from './apiClient';
import { SupabaseService, isSupabaseConfigured } from '../lib/supabase';

/**
 * Real-time Supabase Database & REST Backend Synchronizer for AuraCentra Ghana
 */

export const FirestoreSync = {
  // Sync business to Supabase, Firestore, and backend
  async saveBusiness(business: Business) {
    try {
      // 1. Save to Supabase (primary)
      if (isSupabaseConfigured) {
        await SupabaseService.saveBusiness(business).catch((e) => console.warn('[Supabase Sync]', e));
      }

      // 2. Fallback to Firestore if configured
      if (db) {
        try {
          const docRef = doc(db, 'businesses', business.id);
          await setDoc(docRef, {
            ...business,
            updatedAt: new Date().toISOString()
          }, { merge: true });
        } catch (e) {
          // ignore
        }
      }

      // 3. Notify Express backend
      await ApiClient.createBusiness(business).catch((e) => console.warn('[Backend Notice]', e));
    } catch (err) {
      console.warn('[Data Sync] Business save warning:', err);
    }
  },

  // Delete business from Supabase, Firestore, and backend
  async deleteBusiness(businessId: string) {
    try {
      // 1. Delete from Supabase
      if (isSupabaseConfigured) {
        await SupabaseService.deleteBusiness(businessId).catch((e) => console.warn('[Supabase Delete]', e));
      }

      // 2. Delete from Firestore if configured
      if (db) {
        try {
          const docRef = doc(db, 'businesses', businessId);
          await deleteDoc(docRef);
        } catch (e) {
          // ignore
        }
      }

      // 3. Delete from backend cache
      await ApiClient.deleteBusiness(businessId).catch((e) => console.warn('[Backend Delete]', e));
    } catch (err) {
      console.warn('[Data Sync] Business delete warning:', err);
    }
  },

  // Save inquiry/lead to Supabase, Firestore, and backend
  async saveInquiry(inquiry: BusinessInquiry) {
    try {
      if (db) {
        try {
          const docRef = doc(db, 'inquiries', inquiry.id);
          await setDoc(docRef, {
            ...inquiry,
            createdAt: inquiry.createdAt || new Date().toISOString()
          }, { merge: true });
        } catch {}
      }
      await ApiClient.submitInquiry(inquiry).catch((e) => console.warn('[Backend Notice]', e));
    } catch (err) {
      console.warn('[Data Sync] Inquiry save warning:', err);
    }
  },

  // Save review
  async saveReview(review: BusinessReview) {
    try {
      if (db) {
        try {
          const docRef = doc(db, 'reviews', review.id);
          await setDoc(docRef, {
            ...review,
            date: review.date || new Date().toISOString()
          }, { merge: true });
        } catch {}
      }
      await ApiClient.submitReview(review).catch((e) => console.warn('[Backend Notice]', e));
    } catch (err) {
      console.warn('[Data Sync] Review save warning:', err);
    }
  },

  // Subscribe to real-time businesses updates from Supabase / Firestore
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

      // 2. Fallback to Firestore real-time listener if present
      if (db) {
        const q = collection(db, 'businesses');
        return onSnapshot(q, (snapshot) => {
          const list: Business[] = [];
          snapshot.forEach((d) => {
            list.push(d.data() as Business);
          });
          onUpdate(list);
        }, (err) => {
          console.warn('[Data Sync] Realtime listener notice:', err);
        });
      }

      return () => {};
    } catch (err) {
      console.warn('[Data Sync] Subscribe listener error:', err);
      return () => {};
    }
  }
};

