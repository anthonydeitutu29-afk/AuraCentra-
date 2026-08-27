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

-- Profiles: Public read, User can update own profile
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

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
ALTER PUBLICATION supabase_realtime ADD TABLE public.businesses;
ALTER PUBLICATION supabase_realtime ADD TABLE public.reviews;
ALTER PUBLICATION supabase_realtime ADD TABLE public.inquiries;

-- ============================================================================
-- 16. SEED DATA - POPULAR VERIFIED GHANAIAN BUSINESSES
-- ============================================================================
INSERT INTO public.businesses (
  id, name, tagline, slug, category, sub_category, description, logo, cover_image,
  phone, whatsapp, email, website, city, region, address, digital_address, coordinates,
  price_level, rating, review_count, verification_status, listing_status, opening_hours,
  services, features, views, leads_count
) VALUES
(
  'biz-buka-accra',
  'Buka Restaurant Osu',
  'Authentic West African & Ghanaian Fine Dining',
  'buka-restaurant-osu',
  'food_dining',
  'Fine Dining & Local Cuisine',
  'Buka Restaurant is one of Accra''s most beloved traditional African restaurants located in the vibrant heart of Osu. Famous for authentic Jollof rice, Waakye, Grilled Tilapia, Kontomire stew, and refreshing Palm Wine in a lush open-terrace setting.',
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&auto=format&fit=crop',
  '+233 30 276 7005',
  '+233 50 123 4567',
  'info@bukarestaurant.com',
  'https://bukarestaurant.com',
  'Accra',
  'Greater Accra',
  '10th Street, Osu, Accra, Ghana',
  'GA-032-8419',
  '{"lat": 5.5560, "lng": -0.1790}'::jsonb,
  '$$$',
  4.9,
  86,
  'verified',
  'active',
  '{"monday":"11:00 - 22:00","tuesday":"11:00 - 22:00","wednesday":"11:00 - 22:00","thursday":"11:00 - 22:00","friday":"11:00 - 23:00","saturday":"11:00 - 23:00","sunday":"12:00 - 21:00"}'::jsonb,
  '["Dine-In Terraces", "Corporate Catering", "Authentic Ghanaian Jollof", "Grilled Tilapia & Banku", "Private Events"]'::jsonb,
  '["Outdoor Seating", "Air Conditioned Dining", "Free Wi-Fi", "Mobile Money Accepted", "Card Payments", "Security Parking"]'::jsonb,
  1420,
  38
),
(
  'biz-kempinski-accra',
  'Kempinski Hotel Gold Coast City',
  'Luxury 5-Star Hospitality in Central Accra',
  'kempinski-hotel-gold-coast-city',
  'hospitality_tourism',
  '5-Star Luxury Hotel',
  'The only five-star luxury hotel in the heart of Accra, Kempinski Hotel Gold Coast City offers world-class suites, the Resense Spa, an Olympic-sized infinity pool, luxury conference rooms, and fine dining at the Papillon Restaurant.',
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&auto=format&fit=crop',
  '+233 24 243 6000',
  '+233 24 243 6000',
  'reservations.accra@kempinski.com',
  'https://kempinski.com/accra',
  'Accra',
  'Greater Accra',
  'Gamal Abdul Nasser Avenue, Ridge, Accra',
  'GA-107-2024',
  '{"lat": 5.5539, "lng": -0.1989}'::jsonb,
  '$$$$',
  5.0,
  142,
  'verified',
  'active',
  '{"monday":"24 Hours","tuesday":"24 Hours","wednesday":"24 Hours","thursday":"24 Hours","friday":"24 Hours","saturday":"24 Hours","sunday":"24 Hours"}'::jsonb,
  '["Luxury Accommodation", "Resense Spa & Wellness", "International Buffet", "Executive Boardrooms", "Airport Shuttle"]'::jsonb,
  '["Swimming Pool", "High-Speed Wi-Fi", "Valet Parking", "24/7 Concierge", "Fitness Center", "Forex Exchange"]'::jsonb,
  3105,
  89
),
(
  'biz-nyaho-clinic',
  'Nyaho Medical Centre',
  'Pioneering Excellence in Healthcare & Diagnostics',
  'nyaho-medical-centre-airport',
  'health_wellness',
  'Private Hospital & Diagnostics',
  'Established in 1970, Nyaho Medical Centre is Ghana''s premier private medical hospital with state-of-the-art 24-hour emergency care, surgical suites, pharmacy, diagnostic lab, pediatrics, and specialized cardiology clinics in Airport Residential.',
  'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=1200&auto=format&fit=crop',
  '+233 30 708 6400',
  '+233 50 144 8888',
  'enquiries@nyahomedical.com',
  'https://nyahomedical.com',
  'Accra',
  'Greater Accra',
  '35 Kofi Annan Street, Airport Residential Area, Accra',
  'GA-152-3390',
  '{"lat": 5.6022, "lng": -0.1834}'::jsonb,
  '$$$',
  4.8,
  98,
  'verified',
  'active',
  '{"monday":"24 Hours","tuesday":"24 Hours","wednesday":"24 Hours","thursday":"24 Hours","friday":"24 Hours","saturday":"24 Hours","sunday":"24 Hours"}'::jsonb,
  '["24/7 Emergency Care", "Diagnostic Imaging & CT Scan", "Pediatric Care", "Pharmacy Services", "Telemedicine"]'::jsonb,
  '["24/7 Ambulance", "Emergency Room", "Wheelchair Accessible", "Private Rooms", "Insurance Accepted"]'::jsonb,
  2450,
  64
),
(
  'biz-vodam-kumasi',
  'Sweet Gardens Hotel Kumasi',
  'Boutique Hospitality & Garden Dining in Kumasi',
  'sweet-gardens-hotel-kumasi',
  'hospitality_tourism',
  'Boutique Hotel & Garden Restaurant',
  'Located in Danyame Kumasi, Sweet Gardens Hotel offers quiet and serene garden accommodations, authentic Ashanti dining, conference facilities, and prompt access to the Manhyia Palace and Kumasi City Mall.',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&auto=format&fit=crop',
  '+233 32 203 1245',
  '+233 24 456 7890',
  'info@sweetgardenshotel.com',
  'https://sweetgardenshotel.com',
  'Kumasi',
  'Ashanti',
  'Parks & Gardens Road, Danyame, Kumasi',
  'AK-189-4021',
  '{"lat": 6.6885, "lng": -1.6244}'::jsonb,
  '$$',
  4.7,
  52,
  'verified',
  'active',
  '{"monday":"24 Hours","tuesday":"24 Hours","wednesday":"24 Hours","thursday":"24 Hours","friday":"24 Hours","saturday":"24 Hours","sunday":"24 Hours"}'::jsonb,
  '["Garden Rooms", "Ashanti Local Dishes", "Conference Hall", "Airport Pickup"]'::jsonb,
  '["Free Breakfast", "Wi-Fi", "Swimming Pool", "Event Lawn", "CCTV Security"]'::jsonb,
  980,
  24
)
ON CONFLICT (id) DO NOTHING;

-- Seed Sample Reviews
INSERT INTO public.reviews (id, business_id, user_name, user_email, rating, comment, helpful_count, created_at)
VALUES
(
  'rev-buka-1',
  'biz-buka-accra',
  'Kwame Mensah',
  'kwame.mensah@gmail.com',
  5.0,
  'The best Ghanaian Jollof and Grilled Tilapia in Osu! Service is very welcoming and the open terrace environment is top notch.',
  14,
  NOW() - INTERVAL '3 days'
),
(
  'rev-kempinski-1',
  'biz-kempinski-accra',
  'Akosua Boateng',
  'akosua.b@outlook.com',
  5.0,
  'Outstanding service and world class pool. Perfect for weekend staycations and executive meetings.',
  22,
  NOW() - INTERVAL '6 days'
)
ON CONFLICT (id) DO NOTHING;
