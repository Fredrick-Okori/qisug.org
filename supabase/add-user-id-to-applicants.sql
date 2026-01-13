-- Migration: Add user_id to applicants table and create index
-- Run this in Supabase SQL Editor to fix the dashboard application lookup

-- 1. Add user_id column to applicants table (if not exists)
ALTER TABLE applicants ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- 2. Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_applicants_user_id ON applicants(user_id);

-- 3. Create a policy to allow users to see their own applicant record
-- Note: RLS should already be enabled, this adds user-based access

-- 4. Verify the column was added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'applicants' 
AND column_name = 'user_id';

-- 5. Optional: Update existing applicants to link to users by email
-- This helps if users created accounts after submitting applications
-- Run this to match existing applicants to auth users by email:
/*
UPDATE applicants a
SET user_id = u.id
FROM auth.users u
WHERE a.email = u.email
AND a.user_id IS NULL;
*/

-- 6. Verify existing applications can be found by email match
-- The dashboard will now query by user_id OR by matching email

