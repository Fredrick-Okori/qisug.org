-- Migration: Add user_id and Other gender option
-- Run this in Supabase SQL Editor
-- This is for existing databases - new databases should use schema.sql directly

-- ============================================================================
-- Step 1: Add user_id column to applicants table (if not exists)
-- ============================================================================

ALTER TABLE applicants ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_applicants_user_id ON applicants(user_id);

-- ============================================================================
-- Step 2: Update gender_type enum to include 'Other'
-- ============================================================================

-- Add 'Other' value to the enum (PostgreSQL 10+ syntax)
ALTER TYPE gender_type ADD VALUE IF NOT EXISTS 'Other';

-- ============================================================================
-- Step 3: Update RLS policy to allow users to see their own applications
-- ============================================================================

-- This allows applicants who are logged in to view their own applications
CREATE POLICY IF NOT EXISTS "Users can view their own applications" ON applications FOR SELECT
USING (
  auth.uid() IN (
    SELECT user_id FROM applicants WHERE id = applications.applicant_id
  )
);

-- Similarly for applicants table
CREATE POLICY IF NOT EXISTS "Users can view their own applicant record" ON applicants FOR SELECT
USING (
  auth.uid() = user_id
);

-- ============================================================================
-- Step 4: Update RLS for documents
-- ============================================================================

CREATE POLICY IF NOT EXISTS "Users can view their own documents" ON application_documents FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM applications
    WHERE applications.id = application_documents.application_id
    AND applications.applicant_id IN (SELECT id FROM applicants WHERE user_id = auth.uid())
  )
);

-- ============================================================================
-- Verification queries
-- ============================================================================

-- Check if user_id column was added:
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'applicants' AND column_name = 'user_id';

-- Check if Other was added to gender_type:
-- SELECT enumlabel FROM pg_enum WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'gender_type') ORDER BY enumlabel;

-- Check new indexes:
-- SELECT indexname FROM pg_indexes WHERE tablename = 'applicants';

