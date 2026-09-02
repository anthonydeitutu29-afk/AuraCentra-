import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Business, BusinessInquiry, BusinessReview, UserProfile, UserRole } from '../types';
import { VerificationService, normalizeGhanaPhone } from '../services/verificationService';
import { isDeletedBusiness } from '../utils/storage';

/**
 * AuraCentra Ghana - Supabase Realtime Database & Authentication Client
 * Supports environment variables: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
 */

const env = (import.meta as any).env || {};
const supabaseUrl: string = 
  env.VITE_SUPABASE_URL || 
  env.SUPABASE_URL || 
  env.NEXT_PUBLIC_SUPABASE_URL || 
  '';

const supabaseAnonKey: string = 
  env.VITE_SUPABASE_ANON_KEY || 
  env.SUPABASE_ANON_KEY || 
  env.SUPABASE_KEY || 
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
  '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('https://') && 
  !supabaseUrl.includes('placeholder')
);

// Primary Supabase Client (initialized if env vars exist)
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : null;

/**
 * SQL Schema for easy one-click setup in Supabase SQL Editor:
 */
export const SUPABASE_SQL_SCHEMA = `
-- ============================================================================
-- AURACENTRA GHANA - PRODUCTION SUPABASE DATABASE SCHEMA
-- Run this in your Supabase Dashboard -> SQL Editor
-- ============================================================================

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('visitor', 'customer', 'business_owner', 'verified_owner', 'admin')),
  avatar TEXT,
  auth_provider TEXT DEFAULT 'email',
  phone_verified BOOLEAN DEFAULT FALSE,
  saved_business_ids TEXT[] DEFAULT '{}',
  owned_business_ids TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Businesses Table
CREATE TABLE IF NOT EXISTS public.businesses (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  tagline TEXT,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  sub_category TEXT,
  description TEXT NOT NULL,
  logo TEXT,
  cover_image TEXT,
  gallery JSONB DEFAULT '[]'::jsonb,
  phone TEXT NOT NULL,
  whatsapp TEXT,
  email TEXT,
  website TEXT,
  socials JSONB DEFAULT '{}'::jsonb,
  city TEXT NOT NULL,
  region TEXT NOT NULL,
  address TEXT NOT NULL,
  digital_address TEXT, -- GhanaPost GPS (e.g. GA-183-9021)
  coordinates JSONB NOT NULL, -- { lat: number, lng: number }
  price_level TEXT DEFAULT '$$',
  rating NUMERIC DEFAULT 5.0,
  review_count INT DEFAULT 0,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('verified', 'pending', 'rejected', 'unverified')),
  listing_status TEXT DEFAULT 'pending_approval' CHECK (listing_status IN ('active', 'pending_approval', 'rejected')),
  verification_details JSONB,
  verification_documents JSONB DEFAULT '[]'::jsonb,
  opening_hours JSONB NOT NULL,
  services JSONB DEFAULT '[]'::jsonb,
  features JSONB DEFAULT '[]'::jsonb,
  views INT DEFAULT 0,
  leads_count INT DEFAULT 0,
  owner_id TEXT,
  owner_email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Business Reviews Table
CREATE TABLE IF NOT EXISTS public.reviews (
  id TEXT PRIMARY KEY,
  business_id TEXT REFERENCES public.businesses(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_email TEXT,
  rating NUMERIC NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  helpful_count INT DEFAULT 0,
  owner_reply JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Business Inquiries / Quotes Table
CREATE TABLE IF NOT EXISTS public.inquiries (
  id TEXT PRIMARY KEY,
  business_id TEXT REFERENCES public.businesses(id) ON DELETE CASCADE,
  business_name TEXT,
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  client_email TEXT,
  service_requested TEXT NOT NULL,
  budget_range TEXT,
  message TEXT NOT NULL,
  contact_method TEXT DEFAULT 'whatsapp',
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Phone OTP Verifications Table
CREATE TABLE IF NOT EXISTS public.phone_verifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  phone TEXT NOT NULL,
  otp_code TEXT NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS) Configuration
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.phone_verifications ENABLE ROW LEVEL SECURITY;

-- Permissive Security Policies for Web Client & Backend
DROP POLICY IF EXISTS "Public Profiles Access" ON public.profiles;
CREATE POLICY "Public Profiles Access" ON public.profiles FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Businesses Access" ON public.businesses;
CREATE POLICY "Public Businesses Access" ON public.businesses FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Reviews Access" ON public.reviews;
CREATE POLICY "Public Reviews Access" ON public.reviews FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Inquiries Access" ON public.inquiries;
CREATE POLICY "Public Inquiries Access" ON public.inquiries FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Phone Verifications Access" ON public.phone_verifications;
CREATE POLICY "Public Phone Verifications Access" ON public.phone_verifications FOR ALL USING (true) WITH CHECK (true);

-- Realtime Setup
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    CREATE PUBLICATION supabase_realtime;
  END IF;
END $$;

ALTER PUBLICATION supabase_realtime ADD TABLE public.businesses;
ALTER PUBLICATION supabase_realtime ADD TABLE public.reviews;
ALTER PUBLICATION supabase_realtime ADD TABLE public.inquiries;
`;

// Helper to check if a string is a valid PostgreSQL UUID
export function isValidUuid(id?: string | null): boolean {
  if (!id) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
}

// Helper mapper between Supabase DB snake_case and UI camelCase
export function mapSupabaseToBusiness(row: any): Business {
  return {
    id: row.id,
    name: row.name,
    tagline: row.tagline || '',
    slug: row.slug,
    category: row.category,
    subCategory: row.sub_category || row.subCategory,
    description: row.description,
    logo: row.logo || '',
    coverImage: row.cover_image || row.coverImage || '',
    gallery: Array.isArray(row.gallery) ? row.gallery : [],
    phone: row.phone,
    whatsapp: row.whatsapp || row.phone,
    email: row.email || '',
    website: row.website || '',
    socials: row.socials || {},
    city: row.city,
    region: row.region,
    address: row.address,
    digitalAddress: row.digital_address || row.digitalAddress || '',
    coordinates: row.coordinates || { lat: 5.6037, lng: -0.1870 },
    priceLevel: row.price_level || row.priceLevel || '$$',
    rating: Number(row.rating) || 5.0,
    reviewCount: Number(row.review_count || row.reviewCount) || 0,
    verificationStatus: row.verification_status || row.verificationStatus || 'pending',
    listingStatus: row.listing_status || row.listingStatus || 'pending_approval',
    verificationDetails: row.verification_details || row.verificationDetails,
    verificationDocuments: row.verification_documents || row.verificationDocuments || [],
    openingHours: row.opening_hours || row.openingHours || {
      monday: '08:00 - 18:00',
      tuesday: '08:00 - 18:00',
      wednesday: '08:00 - 18:00',
      thursday: '08:00 - 18:00',
      friday: '08:00 - 18:00',
      saturday: '08:00 - 16:00',
      sunday: 'Closed',
    },
    services: Array.isArray(row.services) ? row.services : [],
    features: Array.isArray(row.features) ? row.features : [],
    views: Number(row.views) || 0,
    leadsCount: Number(row.leads_count || row.leadsCount) || 0,
    ownerId: row.owner_id || row.ownerId,
    ownerEmail: row.owner_email || row.ownerEmail,
    createdAt: row.created_at || row.createdAt || new Date().toISOString(),
    updatedAt: row.updated_at || row.updatedAt || new Date().toISOString(),
  };
}

export function mapBusinessToSupabase(business: Business): any {
  return {
    id: business.id,
    name: business.name,
    tagline: business.tagline || null,
    slug: business.slug,
    category: business.category,
    sub_category: business.subCategory || null,
    description: business.description,
    logo: business.logo || null,
    cover_image: business.coverImage || null,
    gallery: business.gallery || [],
    phone: business.phone,
    whatsapp: business.whatsapp || business.phone,
    email: business.email || null,
    website: business.website || null,
    socials: business.socials || {},
    city: business.city,
    region: business.region,
    address: business.address,
    digital_address: business.digitalAddress || null,
    coordinates: business.coordinates,
    price_level: business.priceLevel,
    rating: business.rating,
    review_count: business.reviewCount,
    verification_status: business.verificationStatus,
    listing_status: business.listingStatus || 'pending_approval',
    verification_details: business.verificationDetails || null,
    verification_documents: business.verificationDocuments || [],
    opening_hours: business.openingHours,
    services: business.services,
    features: business.features,
    views: business.views,
    leads_count: business.leadsCount,
    owner_id: isValidUuid(business.ownerId) ? business.ownerId : null,
    owner_email: business.ownerEmail || null,
    created_at: business.createdAt,
    updated_at: new Date().toISOString(),
  };
}

// In-memory OTP code tracker for phone verification
const generatedOtps = new Map<string, { code: string; expires: number }>();

export const SupabaseService = {
  // --------------------------------------------------------------------------
  // AUTHENTICATION
  // --------------------------------------------------------------------------
  
  // Sign up with Email and Password
  async signUp(email: string, password: string, metadata: { name: string; username?: string; role: UserRole; phone?: string }) {
    if (supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: metadata.name,
            username: metadata.username || email.split('@')[0],
            role: metadata.role,
            phone: metadata.phone || '',
          },
          emailRedirectTo: window.location.origin,
        },
      });
      if (error) throw error;

      // Upsert profile in Supabase profiles table
      if (data.user) {
        try {
          await supabase.from('profiles').upsert({
            id: data.user.id,
            name: metadata.name,
            username: metadata.username || email.split('@')[0],
            email: email.toLowerCase(),
            phone: metadata.phone || null,
            role: metadata.role,
            auth_provider: 'email',
            phone_verified: false,
            created_at: new Date().toISOString(),
          }, { onConflict: 'email' });
        } catch (err) {
          console.warn('[Supabase Profiles]', err);
        }
      }

      // Backend sync fallback
      try {
        await fetch('/api/auth/sync-profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: data.user?.id || `user-${Date.now()}`,
            name: metadata.name,
            username: metadata.username || email.split('@')[0],
            email: email.toLowerCase(),
            phone: metadata.phone || null,
            role: metadata.role,
            auth_provider: 'email',
            phone_verified: false,
          }),
        });
      } catch {
        // ignore
      }

      return {
        user: data.user,
        session: data.session,
        requiresEmailConfirmation: !data.session,
      };
    }

    // Backend sync fallback for standard registration
    try {
      await fetch('/api/auth/sync-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: `user-${Date.now()}`,
          name: metadata.name,
          username: metadata.username || email.split('@')[0],
          email: email.toLowerCase(),
          phone: metadata.phone || null,
          role: metadata.role,
          auth_provider: 'email',
          phone_verified: false,
        }),
      });
    } catch {
      // ignore
    }

    // Fallback: Local registration with credentials
    return {
      user: { id: `user-${Date.now()}`, email },
      session: { access_token: `mock-token-${Date.now()}` },
      requiresEmailConfirmation: true,
    };
  },

  // Get Live Profile from Supabase
  async getProfile(email: string): Promise<UserProfile | null> {
    if (!email) return null;
    const cleanEmail = email.trim().toLowerCase();
    
    // 1. Direct Supabase Query
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .ilike('email', cleanEmail)
          .maybeSingle();

        if (!error && data) {
          const isAdmin = data.role === 'admin' || cleanEmail === 'anthonydeitutu29@gmail.com' || cleanEmail === 'admindashboard@gmail.com';
          return {
            id: data.id,
            name: data.name || cleanEmail.split('@')[0],
            email: data.email,
            phone: data.phone || '+233 24 000 0000',
            role: isAdmin ? 'admin' : (data.role || 'customer'),
            avatar: data.avatar,
            emailVerified: true,
            phoneVerified: Boolean(data.phone_verified),
            savedBusinessIds: data.saved_business_ids || [],
            createdAt: data.created_at || new Date().toISOString(),
          };
        }
      } catch (err) {
        console.warn('[Supabase getProfile warning]', err);
      }
    }

    // 2. Server API fallback
    try {
      const res = await fetch(`/api/auth/profile?email=${encodeURIComponent(cleanEmail)}`);
      if (res.ok) {
        const data = await res.json();
        if (data?.profile) {
          const isAdmin = data.profile.role === 'admin' || cleanEmail === 'anthonydeitutu29@gmail.com' || cleanEmail === 'admindashboard@gmail.com';
          return {
            id: data.profile.id,
            name: data.profile.name || cleanEmail.split('@')[0],
            email: data.profile.email,
            phone: data.profile.phone || '+233 24 000 0000',
            role: isAdmin ? 'admin' : (data.profile.role || 'customer'),
            avatar: data.profile.avatar,
            emailVerified: true,
            phoneVerified: Boolean(data.profile.phone_verified),
            savedBusinessIds: data.profile.saved_business_ids || [],
            createdAt: data.profile.created_at || new Date().toISOString(),
          };
        }
      }
    } catch {
      // ignore
    }

    // 3. Admin fallback
    if (cleanEmail === 'anthonydeitutu29@gmail.com' || cleanEmail === 'admindashboard@gmail.com' || cleanEmail === 'tonysdigitalmarketing@gmail.com') {
      return {
        id: 'admin-anthony',
        name: 'Anthony De-Tutu',
        email: cleanEmail,
        phone: '+233 50 820 3673',
        role: 'admin',
        emailVerified: true,
        phoneVerified: true,
        savedBusinessIds: [],
        createdAt: new Date().toISOString(),
      };
    }

    return null;
  },

  // Save / Sync Profile in Supabase
  async saveProfile(profile: Partial<UserProfile>): Promise<boolean> {
    if (!profile.email) return false;
    const cleanEmail = profile.email.toLowerCase().trim();
    
    let saved = false;
    if (supabase) {
      try {
        const payload: any = {
          name: profile.name || cleanEmail.split('@')[0],
          email: cleanEmail,
          phone: profile.phone || null,
          role: profile.role || 'customer',
          avatar: profile.avatar || null,
          auth_provider: profile.authProvider || 'email',
          phone_verified: Boolean(profile.phoneVerified),
          saved_business_ids: profile.savedBusinessIds || [],
          updated_at: new Date().toISOString(),
        };

        if (isValidUuid(profile.id)) {
          payload.id = profile.id;
        }

        const { error } = await supabase.from('profiles').upsert(payload, { onConflict: 'email' });
        if (!error) {
          saved = true;
        } else {
          console.warn('[Supabase saveProfile warning]', error.message);
        }
      } catch (err) {
        console.warn('[Supabase saveProfile warning]', err);
      }
    }

    try {
      const res = await fetch('/api/auth/sync-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: profile.id,
          name: profile.name,
          email: cleanEmail,
          phone: profile.phone,
          role: profile.role,
          phone_verified: profile.phoneVerified,
        }),
      });
      if (res.ok) saved = true;
    } catch {
      // ignore
    }

    return saved;
  },

  // Sign in with Email and Password
  async signIn(email: string, password: string) {
    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return data;
    }
    return null;
  },

  // Sign in with OAuth (Google or Apple)
  async signInWithOAuth(provider: 'google' | 'apple') {
    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider,
          options: {
            redirectTo: window.location.origin,
          },
        });
        if (error) {
          if (error.message?.includes('not enabled') || (error as any).code === 400) {
            throw new Error(`The ${provider} provider is not enabled in your Supabase project. You can sign in using direct Google verification or email/password.`);
          }
          throw error;
        }
        return data;
      } catch (err: any) {
        if (err.message?.includes('not enabled')) {
          throw new Error(`Google Sign-In via Supabase OAuth is not enabled in your Supabase dashboard settings. Please sign in directly or with email.`);
        }
        throw err;
      }
    }
    throw new Error('Supabase client not initialized. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  },

  // Sign Out
  async signOut() {
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('[Supabase SignOut Warning]', err);
      }
    }
  },

  // Get Current Active Supabase Session
  async getSession() {
    if (supabase) {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (!error && data.session) {
          return data.session;
        }
      } catch (e) {
        console.warn('[Supabase getSession]', e);
      }
    }
    return null;
  },

  // Listen to Supabase Auth State Changes (LOGIN, LOGOUT, TOKEN_REFRESHED)
  onAuthStateChange(callback: (event: string, session: any) => void) {
    if (!supabase) return { unsubscribe: () => {} };
    try {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        callback(event, session);
      });
      return {
        unsubscribe: () => subscription.unsubscribe(),
      };
    } catch (err) {
      console.warn('[Supabase onAuthStateChange]', err);
      return { unsubscribe: () => {} };
    }
  },

  // Password Verification Check (Crucial for user-mandated secure logout)
  async verifyPassword(email: string, password: string): Promise<boolean> {
    if (!password) return false;

    // 1. If Supabase is connected, verify with Supabase Auth
    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (!error && data?.user) {
          return true;
        }
      } catch (e) {
        console.warn('[Supabase verifyPassword]', e);
      }
    }

    // 2. Check registered local storage accounts
    try {
      const accountsJson = localStorage.getItem('auracentra_registered_accounts_v7');
      if (accountsJson) {
        const accounts = JSON.parse(accountsJson);
        const match = accounts.find((a: any) => a.email.toLowerCase() === email.toLowerCase());
        if (match && match.password === password) {
          return true;
        }
      }
      
      // Default admin account password check
      if (email.toLowerCase() === 'admindashboard@gmail.com' && password === 'Admin12$') {
        return true;
      }
    } catch {
      // ignore
    }

    return false;
  },

  // --------------------------------------------------------------------------
  // EMAIL & PHONE OTP VERIFICATION ENGINES
  // --------------------------------------------------------------------------

  async sendEmailOtp(email: string): Promise<{ success: boolean; message: string; demoCode?: string }> {
    const res = await VerificationService.sendEmailOtp(email);
    return {
      success: true,
      message: res.message,
      demoCode: res.code,
    };
  },

  async verifyEmailOtp(email: string, inputOtp: string): Promise<boolean> {
    return await VerificationService.verifyEmailOtp(email, inputOtp);
  },
  
  async sendPhoneOtp(phone: string): Promise<{ success: boolean; message: string; demoCode?: string }> {
    const cleanPhone = normalizeGhanaPhone(phone);
    if (!cleanPhone || cleanPhone.length < 9) {
      throw new Error('Please enter a valid Ghanaian phone number (e.g., 050 820 3673 or +233 50 820 3673).');
    }

    const res = await VerificationService.sendPhoneOtp(cleanPhone);

    if (supabase) {
      try {
        await supabase.from('phone_verifications').insert({
          phone: cleanPhone,
          otp_code: res.code,
          verified: false,
          expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
        });
      } catch (e) {
        console.warn('[Supabase Phone OTP insert]', e);
      }
    }

    return {
      success: true,
      message: res.message,
      demoCode: res.code,
    };
  },

  async verifyPhoneOtp(phone: string, inputOtp: string): Promise<boolean> {
    return await VerificationService.verifyPhoneOtp(phone, inputOtp);
  },

  // --------------------------------------------------------------------------
  // BUSINESSES REAL-TIME DATABASE OPERATIONS
  // --------------------------------------------------------------------------
  
  async fetchBusinesses(): Promise<Business[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('businesses')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.warn('[Supabase fetchBusinesses error]', error);
          return [];
        }

        if (data && Array.isArray(data)) {
          return data
            .map(mapSupabaseToBusiness)
            .filter((b) => !isDeletedBusiness(b));
        }
      } catch (err) {
        console.warn('[Supabase fetchBusinesses]', err);
      }
    }
    return [];
  },

  async saveBusiness(business: Business): Promise<boolean> {
    if (supabase) {
      try {
        const row = mapBusinessToSupabase(business);
        const { error } = await supabase.from('businesses').upsert(row);
        if (error) {
          console.error('[Supabase saveBusiness error]', error);
          return false;
        }
        return true;
      } catch (err) {
        console.error('[Supabase saveBusiness]', err);
        return false;
      }
    }
    return true;
  },

  async deleteBusiness(businessId: string): Promise<boolean> {
    if (supabase) {
      try {
        const { error } = await supabase.from('businesses').delete().eq('id', businessId);
        if (error) {
          console.error('[Supabase deleteBusiness error]', error);
          return false;
        }
        return true;
      } catch (err) {
        console.error('[Supabase deleteBusiness]', err);
        return false;
      }
    }
    return true;
  },

  async submitInquiry(inquiry: BusinessInquiry): Promise<boolean> {
    if (supabase) {
      try {
        const { error } = await supabase.from('inquiries').insert({
          id: inquiry.id,
          business_id: inquiry.businessId,
          business_name: inquiry.businessName,
          client_name: inquiry.clientName,
          client_phone: inquiry.clientPhone,
          client_email: inquiry.clientEmail || null,
          service_requested: inquiry.serviceRequested,
          budget_range: inquiry.budgetRange || null,
          message: inquiry.message,
          contact_method: inquiry.contactMethod === 'call' ? 'phone' : inquiry.contactMethod,
          status: inquiry.status || 'new',
          created_at: inquiry.createdAt || new Date().toISOString(),
        });
        if (error) {
          console.warn('[Supabase submitInquiry error]', error);
          return false;
        }
        return true;
      } catch (err) {
        console.warn('[Supabase submitInquiry]', err);
        return false;
      }
    }
    return true;
  },

  async submitReview(review: BusinessReview): Promise<boolean> {
    if (supabase) {
      try {
        const { error } = await supabase.from('reviews').insert({
          id: review.id,
          business_id: review.businessId,
          user_name: review.userName,
          user_email: review.userEmail || null,
          rating: review.rating,
          comment: review.comment,
          helpful_count: review.helpfulCount || 0,
          owner_reply: review.ownerReply || null,
          created_at: review.date || new Date().toISOString(),
        });
        if (error) {
          console.warn('[Supabase submitReview error]', error);
          return false;
        }
        return true;
      } catch (err) {
        console.warn('[Supabase submitReview]', err);
        return false;
      }
    }
    return true;
  },

  // Subscribe to real-time changes in Supabase businesses table
  subscribeBusinesses(onUpdate: (businesses: Business[]) => void) {
    if (!supabase) return () => {};

    try {
      const channel = supabase
        .channel('public:businesses')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'businesses' },
          async () => {
            // Re-fetch all businesses immediately on any insert, update, or delete
            const freshList = await SupabaseService.fetchBusinesses();
            onUpdate(freshList);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch (err) {
      console.warn('[Supabase subscribeBusinesses]', err);
      return () => {};
    }
  },

  // Database Connection Health Check & Diagnostics
  async checkHealth(): Promise<{
    configured: boolean;
    connected: boolean;
    tables: {
      profiles: boolean;
      businesses: boolean;
      reviews: boolean;
      inquiries: boolean;
      phone_verifications: boolean;
    };
    error?: string;
  }> {
    if (!supabase) {
      return {
        configured: false,
        connected: false,
        tables: {
          profiles: false,
          businesses: false,
          reviews: false,
          inquiries: false,
          phone_verifications: false,
        },
        error: 'Supabase URL or Anon Key not configured in environment variables.',
      };
    }

    const result = {
      configured: true,
      connected: false,
      tables: {
        profiles: false,
        businesses: false,
        reviews: false,
        inquiries: false,
        phone_verifications: false,
      },
      error: undefined as string | undefined,
    };

    try {
      const [pRes, bRes, rRes, iRes, vRes] = await Promise.all([
        supabase.from('profiles').select('id').limit(1),
        supabase.from('businesses').select('id').limit(1),
        supabase.from('reviews').select('id').limit(1),
        supabase.from('inquiries').select('id').limit(1),
        supabase.from('phone_verifications').select('id').limit(1),
      ]);

      result.tables.profiles = !pRes.error;
      result.tables.businesses = !bRes.error;
      result.tables.reviews = !rRes.error;
      result.tables.inquiries = !iRes.error;
      result.tables.phone_verifications = !vRes.error;

      result.connected = !pRes.error || !bRes.error || !rRes.error;
    } catch (e: any) {
      result.error = e.message;
    }

    return result;
  },
};
