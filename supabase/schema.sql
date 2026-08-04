-- AVENOR SUPABASE DATABASE SCHEMA MIGRATION --

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT CHECK (role IN ('Guest', 'User', 'Admin', 'Property Owner', 'Agent')) DEFAULT 'User',
  phone TEXT,
  avatar_url TEXT DEFAULT 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  is_verified BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. PROPERTIES TABLE
CREATE TABLE IF NOT EXISTS public.properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT NOT NULL,
  purpose TEXT CHECK (purpose IN ('Buy', 'Rent', 'Lease')) DEFAULT 'Buy',
  category TEXT NOT NULL,
  price NUMERIC NOT NULL,
  emi NUMERIC DEFAULT 0,
  location TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT DEFAULT 'India',
  address TEXT,
  latitude NUMERIC DEFAULT 18.6414,
  longitude NUMERIC DEFAULT 72.8722,
  builder_name TEXT DEFAULT 'Avenor Signature Developments',
  builder_rating NUMERIC DEFAULT 4.9,
  bedrooms INTEGER DEFAULT 4,
  bathrooms INTEGER DEFAULT 4,
  parking INTEGER DEFAULT 2,
  area_sqft NUMERIC NOT NULL,
  year_built INTEGER DEFAULT 2024,
  possession TEXT DEFAULT 'Ready to Move',
  property_status TEXT CHECK (property_status IN ('Active', 'Sold', 'Rented', 'Archived')) DEFAULT 'Active',
  approval_status TEXT CHECK (approval_status IN ('Pending', 'Approved', 'Rejected')) DEFAULT 'Approved',
  is_featured BOOLEAN DEFAULT TRUE,
  is_luxury BOOLEAN DEFAULT TRUE,
  tags TEXT[],
  hero_video TEXT DEFAULT '/video.mp4',
  images TEXT[],
  tour_360 JSONB DEFAULT '[]',
  floor_plan TEXT,
  amenities TEXT[],
  metrics JSONB DEFAULT '{"investmentScore": 94, "rentalYield": "6.8%", "roi5Year": "42%", "crimeSafetyScore": 98, "energyRating": "A++"}',
  owner_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. APPOINTMENTS TABLE
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  appointment_date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  status TEXT CHECK (status IN ('Pending', 'Confirmed', 'Cancelled')) DEFAULT 'Confirmed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. FAVORITES TABLE
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, property_id)
);

-- 5. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. CONTACT REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.contact_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  interest TEXT DEFAULT 'Buying',
  message TEXT,
  status TEXT DEFAULT 'New',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS) Policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Access for Properties" ON public.properties FOR SELECT USING (true);
CREATE POLICY "Public Read Access for Users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Allow All Insert Appointments" ON public.appointments FOR INSERT WITH CHECK (true);
