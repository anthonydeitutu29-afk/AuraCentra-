import { collection, doc, setDoc, getDocs, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Business, BusinessInquiry, BusinessReview } from '../types';
import { ApiClient } from './apiClient';

/**
 * Real-time Firebase Firestore & REST Backend Synchronizer for AuraCentra Ghana
 */

export const FirestoreSync = {
  // Sync business to Firestore
  async saveBusiness(business: Business) {
    try {
      if (db) {
        const docRef = doc(db, 'businesses', business.id);
        await setDoc(docRef, {
          ...business,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      }
      // Also notify Express backend
      await ApiClient.createBusiness(business).catch((e) => console.warn('[Backend Notice]', e));
    } catch (err) {
      console.warn('[Firestore Sync] Business save warning:', err);
    }
  },

  // Save inquiry/lead to Firestore
  async saveInquiry(inquiry: BusinessInquiry) {
    try {
      if (db) {
        const docRef = doc(db, 'inquiries', inquiry.id);
        await setDoc(docRef, {
          ...inquiry,
          createdAt: inquiry.createdAt || new Date().toISOString()
        }, { merge: true });
      }
      await ApiClient.submitInquiry(inquiry).catch((e) => console.warn('[Backend Notice]', e));
    } catch (err) {
      console.warn('[Firestore Sync] Inquiry save warning:', err);
    }
  },

  // Save review to Firestore
  async saveReview(review: BusinessReview) {
    try {
      if (db) {
        const docRef = doc(db, 'reviews', review.id);
        await setDoc(docRef, {
          ...review,
          date: review.date || new Date().toISOString()
        }, { merge: true });
      }
      await ApiClient.submitReview(review).catch((e) => console.warn('[Backend Notice]', e));
    } catch (err) {
      console.warn('[Firestore Sync] Review save warning:', err);
    }
  },

  // Subscribe to real-time businesses updates from Firestore
  subscribeBusinesses(onUpdate: (businesses: Business[]) => void) {
    try {
      if (!db) return () => {};
      const q = collection(db, 'businesses');
      return onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const list: Business[] = [];
          snapshot.forEach((d) => {
            list.push(d.data() as Business);
          });
          if (list.length > 0) {
            onUpdate(list);
          }
        }
      }, (err) => {
        console.warn('[Firestore Sync] Realtime listener notice:', err);
      });
    } catch (err) {
      console.warn('[Firestore Sync] Subscribe listener error:', err);
      return () => {};
    }
  }
};
