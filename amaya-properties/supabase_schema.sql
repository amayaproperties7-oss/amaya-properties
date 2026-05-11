-- Create Properties Table
CREATE TABLE IF NOT EXISTS properties (
  id TEXT PRIMARY KEY,
  project_name TEXT NOT NULL,
  region TEXT,
  location TEXT,
  price TEXT,
  price_numeric BIGINT,
  listing_type TEXT,
  bhk_type TEXT,
  area TEXT,
  project_status TEXT,
  developer_name TEXT,
  description TEXT,
  image_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  user_type TEXT DEFAULT 'Member',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create Inquiries Table
CREATE TABLE IF NOT EXISTS inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id TEXT REFERENCES properties(id) ON DELETE CASCADE,
  user_email TEXT,
  user_name TEXT,
  user_phone TEXT,
  message TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Enable Row Level Security
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- Helper function to check if the current user is an admin
CREATE OR REPLACE FUNCTION is_admin() 
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid()::text 
    AND user_type = 'Admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- Properties Policies
-- ==========================================
CREATE POLICY "Allow public read access to properties" 
  ON properties FOR SELECT USING (true);

CREATE POLICY "Allow admin full access to properties" 
  ON properties FOR ALL USING (is_admin());

-- ==========================================
-- Users Policies
-- ==========================================
CREATE POLICY "Allow users to read their own profile" 
  ON users FOR SELECT USING (auth.uid()::text = id OR is_admin());

CREATE POLICY "Allow users to update their own profile" 
  ON users FOR UPDATE USING (auth.uid()::text = id OR is_admin());

CREATE POLICY "Allow individual insert" 
  ON users FOR INSERT WITH CHECK (auth.uid()::text = id);

CREATE POLICY "Allow admins to see all profiles" 
  ON users FOR SELECT USING (is_admin());

-- ==========================================
-- Inquiries Policies
-- ==========================================
CREATE POLICY "Allow public to submit inquiries" 
  ON inquiries FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow users to view their own inquiries" 
  ON inquiries FOR SELECT USING (
    user_email = (SELECT email FROM users WHERE id = auth.uid()::text) 
    OR is_admin()
  );

CREATE POLICY "Allow admins full access to inquiries" 
  ON inquiries FOR ALL USING (is_admin());

-- Migration to add ON DELETE CASCADE if inquiries table already exists
DO $$ 
BEGIN
    -- Check if the foreign key exists and drop it to recreate with CASCADE
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'inquiries_property_id_fkey') THEN
        ALTER TABLE inquiries DROP CONSTRAINT inquiries_property_id_fkey;
    END IF;
    
    -- Re-add the constraint with ON DELETE CASCADE
    ALTER TABLE inquiries 
    ADD CONSTRAINT inquiries_property_id_fkey 
    FOREIGN KEY (property_id) 
    REFERENCES properties(id) 
    ON DELETE CASCADE;
END $$;
