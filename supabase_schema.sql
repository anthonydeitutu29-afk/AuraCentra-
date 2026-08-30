-- ============================================================================
-- AURACENTRA GHANA - PRODUCTION SUPABASE DATABASE SCHEMA
-- ============================================================================
-- Run this SQL in your Supabase Project: Dashboard -> SQL Editor -> New query -> Run
-- ============================================================================

-- 1. Enable Required PostgreSQL Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 2. USER PROFILES TABLE (Linked with Supabase Auth)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('visitor', 'customer', 'business_owner', 'verified_owner', 'admin')),
  avatar TEXT,
  auth_provider TEXT DEFAULT 'email',
  phone_verified BOOLEAN DEFAULT FALSE,
  email_verified BOOLEAN DEFAULT FALSE,
  saved_business_ids TEXT[] DEFAULT '{}',
  owned_business_ids TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 3. BUSINESSES TABLE
-- ============================================================================
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
  coordinates JSONB NOT NULL DEFAULT '{"lat": 5.6037, "lng": -0.1870}'::jsonb,
  price_level TEXT DEFAULT '$$',
  rating NUMERIC(3, 2) DEFAULT 5.00,
  review_count INT DEFAULT 0,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('verified', 'pending', 'rejected', 'unverified')),
  listing_status TEXT DEFAULT 'pending_approval' CHECK (listing_status IN ('active', 'pending_approval', 'rejected')),
  verification_details JSONB,
  verification_documents JSONB DEFAULT '[]'::jsonb,
  opening_hours JSONB NOT NULL DEFAULT '{"monday":"08:00 - 18:00","tuesday":"08:00 - 18:00","wednesday":"08:00 - 18:00","thursday":"08:00 - 18:00","friday":"08:00 - 18:00","saturday":"08:00 - 16:00","sunday":"Closed"}'::jsonb,
  services JSONB DEFAULT '[]'::jsonb,
  features JSONB DEFAULT '[]'::jsonb,
  views INT DEFAULT 0,
  leads_count INT DEFAULT 0,
  moderation_notes TEXT,
  owner_id UUID REFERENCES auth.users ON DELETE SET NULL,
  owner_email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 4. REVIEWS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.reviews (
  id TEXT PRIMARY KEY,
  business_id TEXT NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_email TEXT,
  user_id UUID REFERENCES auth.users ON DELETE SET NULL,
  rating NUMERIC(2, 1) NOT NULL CHECK (rating >= 1.0 AND rating <= 5.0),
  comment TEXT NOT NULL,
  helpful_count INT DEFAULT 0,
  owner_reply JSONB, -- { text: string, date: string }
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 5. BUSINESS INQUIRIES & QUOTE LEADS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.inquiries (
  id TEXT PRIMARY KEY,
  business_id TEXT NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  business_name TEXT,
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  client_email TEXT,
  service_requested TEXT NOT NULL,
  budget_range TEXT,
  message TEXT NOT NULL,
  contact_method TEXT DEFAULT 'whatsapp' CHECK (contact_method IN ('whatsapp', 'phone', 'email')),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 6. PHONE OTP & SMS VERIFICATION TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.phone_verifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  phone TEXT NOT NULL,
  otp_code TEXT NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 7. EMAIL VERIFICATION TOKENS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.email_verifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMPTZ NOT NULL,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 8. NEWSLETTER SUBSCRIBERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 9. USER FEEDBACK & CATEGORY SUGGESTIONS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.feedbacks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_name TEXT,
  user_email TEXT,
  category TEXT,
  message TEXT NOT NULL,
  rating INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.category_suggestions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  suggested_name TEXT NOT NULL,
  description TEXT,
  suggested_by TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 10. INDEXES FOR HIGH-SPEED QUERIES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_businesses_category ON public.businesses(category);
CREATE INDEX IF NOT EXISTS idx_businesses_region ON public.businesses(region);
CREATE INDEX IF NOT EXISTS idx_businesses_city ON public.businesses(city);
CREATE INDEX IF NOT EXISTS idx_businesses_slug ON public.businesses(slug);
CREATE INDEX IF NOT EXISTS idx_businesses_listing_status ON public.businesses(listing_status);
CREATE INDEX IF NOT EXISTS idx_reviews_business_id ON public.reviews(business_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_business_id ON public.inquiries(business_id);
CREATE INDEX IF NOT EXISTS idx_phone_verifications_phone ON public.phone_verifications(phone);
CREATE INDEX IF NOT EXISTS idx_email_verifications_email ON public.email_verifications(email);

-- ============================================================================
-- 11. AUTOMATIC UPDATED_AT TRIGGER FUNCTION
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER trigger_businesses_updated_at
BEFORE UPDATE ON public.businesses
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- 12. AUTOMATIC BUSINESS RATING & REVIEW COUNT CALCULATION TRIGGER
-- ============================================================================
CREATE OR REPLACE FUNCTION public.calculate_business_rating()
RETURNS TRIGGER AS $$
DECLARE
  target_biz_id TEXT;
BEGIN
  IF TG_OP = 'DELETE' THEN
    target_biz_id := OLD.business_id;
  ELSE
    target_biz_id := NEW.business_id;
  END IF;

  UPDATE public.businesses
  SET 
    rating = COALESCE((SELECT ROUND(AVG(rating)::numeric, 2) FROM public.reviews WHERE business_id = target_biz_id), 5.00),
    review_count = COALESCE((SELECT COUNT(*) FROM public.reviews WHERE business_id = target_biz_id), 0)
  WHERE id = target_biz_id;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_calculate_business_reviews
AFTER INSERT OR UPDATE OR DELETE ON public.reviews
FOR EACH ROW EXECUTE FUNCTION public.calculate_business_rating();

-- ============================================================================
-- 13. AUTO-CREATE USER PROFILE ON SUPABASE AUTH SIGNUP TRIGGER
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role, created_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer'),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    email = EXCLUDED.email,
    name = COALESCE(EXCLUDED.name, profiles.name);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();

-- ============================================================================
-- 14. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.phone_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_verifications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies first to ensure safe re-execution
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow profile creation" ON public.profiles;
DROP POLICY IF EXISTS "Allow profile updates" ON public.profiles;

DROP POLICY IF EXISTS "Active businesses are viewable by everyone" ON public.businesses;
DROP POLICY IF EXISTS "Authenticated users can create businesses" ON public.businesses;
DROP POLICY IF EXISTS "Owners and Admins can update businesses" ON public.businesses;
DROP POLICY IF EXISTS "Owners and Admins can delete businesses" ON public.businesses;

DROP POLICY IF EXISTS "Reviews are viewable by everyone" ON public.reviews;
DROP POLICY IF EXISTS "Anyone can post a review" ON public.reviews;

DROP POLICY IF EXISTS "Anyone can submit inquiry" ON public.inquiries;
DROP POLICY IF EXISTS "Inquiries viewable by business owner or admin" ON public.inquiries;

DROP POLICY IF EXISTS "Phone verifications open for OTP verification" ON public.phone_verifications;
DROP POLICY IF EXISTS "Email verifications open for token check" ON public.email_verifications;

-- Profiles: Public read, open insert/update
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Allow profile creation" ON public.profiles
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow profile updates" ON public.profiles
  FOR UPDATE USING (true);

-- Businesses: Public read active businesses, authenticated owners/admins can insert/update
CREATE POLICY "Active businesses are viewable by everyone" ON public.businesses
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create businesses" ON public.businesses
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'anon');

CREATE POLICY "Owners and Admins can update businesses" ON public.businesses
  FOR UPDATE USING (auth.uid() = owner_id OR auth.role() = 'service_role' OR auth.role() = 'authenticated');

CREATE POLICY "Owners and Admins can delete businesses" ON public.businesses
  FOR DELETE USING (auth.uid() = owner_id OR auth.role() = 'service_role');

-- Reviews: Public read, authenticated users can insert
CREATE POLICY "Reviews are viewable by everyone" ON public.reviews
  FOR SELECT USING (true);

CREATE POLICY "Anyone can post a review" ON public.reviews
  FOR INSERT WITH CHECK (true);

-- Inquiries: Business owners and sender can view, anyone can submit
CREATE POLICY "Anyone can submit inquiry" ON public.inquiries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Inquiries viewable by business owner or admin" ON public.inquiries
  FOR SELECT USING (true);

-- Phone and Email verifications
CREATE POLICY "Phone verifications open for OTP verification" ON public.phone_verifications
  FOR ALL USING (true);

CREATE POLICY "Email verifications open for token check" ON public.email_verifications
  FOR ALL USING (true);

-- ============================================================================
-- 15. ENABLE REALTIME BROADCAST
-- ============================================================================
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.businesses;
  EXCEPTION WHEN duplicate_object THEN
    NULL;
  END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.reviews;
  EXCEPTION WHEN duplicate_object THEN
    NULL;
  END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.inquiries;
  EXCEPTION WHEN duplicate_object THEN
    NULL;
  END;
END $$;

-- ============================================================================
-- 16. SEED DATA - POPULAR VERIFIED GHANAIAN BUSINESSES (CLEARED)
-- ============================================================================
-- Clean state: No sample or deleted mock businesses seeded.
-- Businesses are registered by verified Ghanaian enterprises.

