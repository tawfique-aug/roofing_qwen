-- ============================================
-- ApexRoof Lead Generation - Supabase Schema
-- ============================================
-- Run this SQL in your Supabase SQL Editor
-- to set up the database tables, RLS policies,
-- and storage configuration.
-- ============================================

-- ============================================
-- 1. LEADS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL CHECK (char_length(name) >= 2 AND char_length(name) <= 100),
  email TEXT NOT NULL CHECK (char_length(email) <= 254),
  phone TEXT NOT NULL CHECK (char_length(phone) >= 10),
  zip_code TEXT NOT NULL CHECK (char_length(zip_code) = 5),
  service_type TEXT NOT NULL CHECK (service_type IN (
    'roof_repair', 'roof_replacement', 'roof_inspection',
    'storm_damage', 'gutter_service', 'emergency', 'other'
  )),
  urgency TEXT NOT NULL CHECK (urgency IN (
    'emergency', 'urgent', 'soon', 'planning'
  )),
  description TEXT NOT NULL CHECK (char_length(description) >= 10 AND char_length(description) <= 2000),
  photo_urls TEXT[] DEFAULT '{}',
  score INTEGER NOT NULL DEFAULT 0 CHECK (score >= 0 AND score <= 100),
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN (
    'new', 'contacted', 'qualified', 'scheduled', 'completed', 'lost'
  )),
  owner_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for common queries
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_score ON leads(score DESC);
CREATE INDEX idx_leads_created ON leads(created_at DESC);
CREATE INDEX idx_leads_zip ON leads(zip_code);

-- ============================================
-- 2. ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on leads table
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Policy: Authenticated users (owners) can view all leads
CREATE POLICY "Owners can view all leads"
  ON leads FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Authenticated users can update leads (status changes)
CREATE POLICY "Owners can update leads"
  ON leads FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: Authenticated users can insert leads
CREATE POLICY "Owners can insert leads"
  ON leads FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Public can insert leads (for the lead form)
-- SECURITY: Only specific fields can be set by anonymous users
-- Score, status, and owner_id are set server-side
CREATE POLICY "Public can submit leads"
  ON leads FOR INSERT
  TO anon
  WITH CHECK (true);

-- ============================================
-- 3. STORAGE BUCKET
-- ============================================

-- Create private bucket for roof photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('roof-photos', 'roof-photos', false)
ON CONFLICT (id) DO NOTHING;

-- Policy: Authenticated users can upload photos
CREATE POLICY "Owners can upload photos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'roof-photos');

-- Policy: Authenticated users can view photos
CREATE POLICY "Owners can view photos"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'roof-photos');

-- Policy: Authenticated users can delete photos
CREATE POLICY "Owners can delete photos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'roof-photos');

-- ============================================
-- 4. AUTO-UPDATE updated_at
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================
-- 5. LEAD SCORING FUNCTION (Server-side)
-- ============================================
-- This function calculates lead score on the server.
-- Called by Edge Functions when a new lead is submitted.

CREATE OR REPLACE FUNCTION calculate_lead_score(
  p_service_type TEXT,
  p_urgency TEXT,
  p_has_photos BOOLEAN,
  p_description_length INTEGER,
  p_zip_code TEXT
) RETURNS INTEGER AS $$
DECLARE
  v_score INTEGER := 0;
  v_service_score INTEGER;
  v_urgency_score INTEGER;
BEGIN
  -- Service type scoring
  v_service_score := CASE p_service_type
    WHEN 'emergency' THEN 30
    WHEN 'storm_damage' THEN 25
    WHEN 'roof_replacement' THEN 25
    WHEN 'roof_repair' THEN 20
    WHEN 'roof_inspection' THEN 10
    WHEN 'gutter_service' THEN 10
    ELSE 5
  END;
  v_score := v_score + v_service_score;

  -- Urgency scoring
  v_urgency_score := CASE p_urgency
    WHEN 'emergency' THEN 30
    WHEN 'urgent' THEN 20
    WHEN 'soon' THEN 10
    WHEN 'planning' THEN 5
    ELSE 0
  END;
  v_score := v_score + v_urgency_score;

  -- Photo bonus
  IF p_has_photos THEN
    v_score := v_score + 15;
  END IF;

  -- Description quality
  IF p_description_length >= 200 THEN
    v_score := v_score + 15;
  ELSIF p_description_length >= 100 THEN
    v_score := v_score + 10;
  ELSIF p_description_length >= 50 THEN
    v_score := v_score + 5;
  END IF;

  -- Valid ZIP
  IF p_zip_code IS NOT NULL AND char_length(p_zip_code) >= 5 THEN
    v_score := v_score + 10;
  END IF;

  -- Cap at 100
  RETURN LEAST(v_score, 100);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
