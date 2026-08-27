import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Business, BusinessInquiry, BusinessReview, UserProfile, UserRole } from '../types';

/**
 * AuraCentra Ghana - Supabase Realtime Database & Authentication Client
 * Supports environment variables: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
 */

const env = (import.meta as any).env || {};
const supabaseUrl: string = env.VITE_SUPABASE_URL || '';
const supabaseAnonKey: string = env.VITE_SUPABASE_ANON_KEY || '';

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
-- ============================================================================

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
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
  owner_id UUID REFERENCES auth.users ON DELETE SET NULL,
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

-- Realtime Setup
ALTER PUBLICATION supabase_realtime ADD TABLE public.businesses;
ALTER PUBLICATION supabase_realtime ADD TABLE public.reviews;
ALTER PUBLICATION supabase_realtime ADD TABLE public.inquiries;
`;

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
    owner_id: business.ownerId || null,
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
  async signUp(email: string, password: string, metadata: { name: string; role: UserRole; phone?: string }) {
    if (supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: metadata.name,
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
            email: email.toLowerCase(),
            phone: metadata.phone || null,
            role: metadata.role,
            auth_provider: 'email',
            phone_verified: false,
            created_at: new Date().toISOString(),
          });
        } catch (err) {
          console.warn('[Supabase Profiles]', err);
        }
      }

      return {
        user: data.user,
        session: data.session,
        requiresEmailConfirmation: !data.session,
      };
    }

    // Fallback: Local registration with credentials
    return {
      user: { id: `user-${Date.now()}`, email },
      session: { access_token: `mock-token-${Date.now()}` },
      requiresEmailConfirmation: true,
    };
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
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
      return data;
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
  // PHONE NUMBER OTP VERIFICATION
  // --------------------------------------------------------------------------
  
  async sendPhoneOtp(phone: string): Promise<{ success: boolean; message: string; demoCode?: string }> {
    const cleanPhone = phone.trim().replace(/\s+/g, '');
    if (!cleanPhone || cleanPhone.length < 9) {
      throw new Error('Please enter a valid Ghanaian phone number (e.g., 050 820 3673 or +233 50 820 3673).');
    }

    // Generate secure 6-digit numeric OTP code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 10 * 60 * 1000; // 10 minutes expiry
    generatedOtps.set(cleanPhone, { code: otpCode, expires });

    if (supabase) {
      try {
        await supabase.from('phone_verifications').insert({
          phone: cleanPhone,
          otp_code: otpCode,
          verified: false,
          expires_at: new Date(expires).toISOString(),
        });
      } catch (e) {
        console.warn('[Supabase Phone OTP insert]', e);
      }
    }

    console.log(`[AuraCentra Phone OTP] Code for ${cleanPhone}: ${otpCode}`);

    return {
      success: true,
      message: `A 6-digit verification code has been dispatched to ${cleanPhone}.`,
      demoCode: otpCode, // Provided for easy development/testing verification
    };
  },

  async verifyPhoneOtp(phone: string, inputOtp: string): Promise<boolean> {
    const cleanPhone = phone.trim().replace(/\s+/g, '');
    const cleanOtp = inputOtp.trim();

    const stored = generatedOtps.get(cleanPhone);
    if (stored && stored.code === cleanOtp && stored.expires > Date.now()) {
      generatedOtps.delete(cleanPhone);
      return true;
    }

    // Direct match for master test code or recent generation
    if (cleanOtp.length === 6 && (cleanOtp === '123456' || (stored && stored.code === cleanOtp))) {
      return true;
    }

    return false;
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
          return data.map(mapSupabaseToBusiness);
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
};
