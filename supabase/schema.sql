-- AVENOR REALTY SUPABASE DATABASE SCHEMA & RLS POLICIES --
-- PRODUCTION ARCHITECTURE MIGRATION

-- Enable necessary PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ========================================================
-- 1. USERS & PROFILES TABLE
-- ========================================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  full_name TEXT NOT NULL,
  role TEXT CHECK (role IN ('Guest', 'User', 'Admin', 'Property Owner', 'Agent')) DEFAULT 'User',
  phone TEXT,
  avatar_url TEXT DEFAULT 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  is_verified BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================================
-- 2. PROPERTIES TABLE
-- ========================================================
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================================
-- 3. RENTALS TABLE
-- ========================================================
CREATE TABLE IF NOT EXISTS public.rentals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  monthly_rent NUMERIC NOT NULL,
  security_deposit NUMERIC NOT NULL,
  lease_term_months INTEGER DEFAULT 12,
  furnished_status TEXT CHECK (furnished_status IN ('Fully Furnished', 'Semi-Furnished', 'Unfurnished')) DEFAULT 'Fully Furnished',
  available_from DATE DEFAULT CURRENT_DATE,
  pet_friendly BOOLEAN DEFAULT TRUE,
  utilities_included TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================================
-- 4. APPOINTMENTS / PRIVATE INSPECTIONS TABLE
-- ========================================================
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  appointment_date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  status TEXT CHECK (status IN ('Pending', 'Confirmed', 'Cancelled')) DEFAULT 'Confirmed',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================================
-- 5. FAVORITES TABLE
-- ========================================================
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, property_id)
);

-- ========================================================
-- 6. REVIEWS & RATINGS TABLE
-- ========================================================
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================================
-- 7. CONTACT REQUESTS / GENERAL INQUIRIES TABLE
-- ========================================================
CREATE TABLE IF NOT EXISTS public.contact_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  interest TEXT DEFAULT 'Buying',
  message TEXT,
  status TEXT CHECK (status IN ('New', 'InContact', 'Resolved', 'Archived')) DEFAULT 'New',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================================
-- 8. REAL-TIME MESSAGING / CONVERSATIONS TABLE
-- ========================================================
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.conversation_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(conversation_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================================
-- 9. PERFORMANCE INDEXES
-- ========================================================
-- Properties query indexes
CREATE INDEX IF NOT EXISTS idx_properties_location_city ON public.properties (city, location);
CREATE INDEX IF NOT EXISTS idx_properties_purpose_category ON public.properties (purpose, category);
CREATE INDEX IF NOT EXISTS idx_properties_price ON public.properties (price);
CREATE INDEX IF NOT EXISTS idx_properties_bedrooms ON public.properties (bedrooms);
CREATE INDEX IF NOT EXISTS idx_properties_status_approval ON public.properties (property_status, approval_status);
CREATE INDEX IF NOT EXISTS idx_properties_owner_id ON public.properties (owner_id);
CREATE INDEX IF NOT EXISTS idx_properties_created_at ON public.properties (created_at DESC);

-- Rentals indexes
CREATE INDEX IF NOT EXISTS idx_rentals_property_id ON public.rentals (property_id);
CREATE INDEX IF NOT EXISTS idx_rentals_monthly_rent ON public.rentals (monthly_rent);

-- Favorites indexes
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON public.favorites (user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_property_id ON public.favorites (property_id);

-- Appointments indexes
CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON public.appointments (user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_property_date ON public.appointments (property_id, appointment_date);

-- Messaging indexes
CREATE INDEX IF NOT EXISTS idx_conv_participants_user ON public.conversation_participants (user_id, conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages (conversation_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON public.messages (sender_id);

-- ========================================================
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================
-- Enable RLS across all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rentals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------------------
-- Users Table RLS Policies
-- --------------------------------------------------------
-- Public can view public profile details
CREATE POLICY "Public Read Users" 
  ON public.users 
  FOR SELECT 
  USING (true);

-- Users can update only their own profile
CREATE POLICY "Users Update Own Profile" 
  ON public.users 
  FOR UPDATE 
  USING (auth.uid() = id) 
  WITH CHECK (auth.uid() = id);

-- --------------------------------------------------------
-- Properties Table RLS Policies
-- --------------------------------------------------------
-- Public can read approved & active properties
CREATE POLICY "Public Read Approved Properties" 
  ON public.properties 
  FOR SELECT 
  USING (approval_status = 'Approved' AND property_status = 'Active');

-- Authenticated Property Owners can insert new listings (default status Pending/Approved)
CREATE POLICY "Owners Insert Properties" 
  ON public.properties 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = owner_id);

-- Property owners can update only their own listings
CREATE POLICY "Owners Update Own Properties" 
  ON public.properties 
  FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = owner_id) 
  WITH CHECK (auth.uid() = owner_id);

-- Property owners can delete their own listings
CREATE POLICY "Owners Delete Own Properties" 
  ON public.properties 
  FOR DELETE 
  TO authenticated 
  USING (auth.uid() = owner_id);

-- --------------------------------------------------------
-- Favorites Table RLS Policies
-- --------------------------------------------------------
-- Users can only view their own favorites
CREATE POLICY "Users Read Own Favorites" 
  ON public.favorites 
  FOR SELECT 
  TO authenticated 
  USING (auth.uid() = user_id);

-- Users can only insert favorites for themselves
CREATE POLICY "Users Insert Own Favorites" 
  ON public.favorites 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

-- Users can only delete their own favorites
CREATE POLICY "Users Delete Own Favorites" 
  ON public.favorites 
  FOR DELETE 
  TO authenticated 
  USING (auth.uid() = user_id);

-- --------------------------------------------------------
-- Appointments & Contact Requests RLS Policies
-- --------------------------------------------------------
-- Anyone can request an appointment / contact
CREATE POLICY "Public Insert Appointments" 
  ON public.appointments 
  FOR INSERT 
  WITH CHECK (true);

-- Authenticated users can view their own appointments
CREATE POLICY "Users Read Own Appointments" 
  ON public.appointments 
  FOR SELECT 
  TO authenticated 
  USING (auth.uid() = user_id);

-- Public can submit contact requests
CREATE POLICY "Public Insert Contact Requests" 
  ON public.contact_requests 
  FOR INSERT 
  WITH CHECK (true);

-- --------------------------------------------------------
-- Messaging & Conversations RLS Policies
-- --------------------------------------------------------
-- Users can view conversations they participate in
CREATE POLICY "Users Read Participating Conversations" 
  ON public.conversations 
  FOR SELECT 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM public.conversation_participants 
      WHERE conversation_id = public.conversations.id 
      AND user_id = auth.uid()
    )
  );

-- Users can view messages in conversations they belong to
CREATE POLICY "Users Read Conversation Messages" 
  ON public.messages 
  FOR SELECT 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM public.conversation_participants 
      WHERE conversation_id = public.messages.conversation_id 
      AND user_id = auth.uid()
    )
  );

-- Users can send messages in conversations they belong to
CREATE POLICY "Users Insert Messages" 
  ON public.messages 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM public.conversation_participants 
      WHERE conversation_id = public.messages.conversation_id 
      AND user_id = auth.uid()
    )
  );
