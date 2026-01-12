-- ============================================================================
-- ADD UNDER_REVIEW STATUS TO APPLICATION ENUM
-- ============================================================================
-- Run this in your Supabase SQL Editor to fix the enum error
-- ============================================================================

-- Step 1: First check what values exist in the database
-- SELECT DISTINCT status FROM applications;

-- Step 2: Check the current enum values
-- SELECT enumlabel FROM pg_enum WHERE enumtypid = 'application_status_type'::regtype;

-- Step 3: Convert status column to TEXT temporarily to handle any non-standard values
ALTER TABLE applications ALTER COLUMN status TYPE TEXT;

-- Step 4: Update "Submitted" to "Submitted" (keep the same value)
-- No change needed since we're standardizing to use the enum values directly

-- Step 5: Drop the view that depends on the column (if exists)
DROP VIEW IF EXISTS application_dashboard;

-- Step 6: Drop the default temporarily
ALTER TABLE applications ALTER COLUMN status DROP DEFAULT;

-- Step 7: Create new enum type with 4 statuses
CREATE TYPE application_status_type_new AS ENUM ('Submitted', 'Under Review', 'Approved', 'Rejected');

-- Step 8: Update the column to use the new enum type
ALTER TABLE applications ALTER COLUMN status TYPE application_status_type_new USING status::application_status_type_new;

-- Step 9: Drop the old type (if exists)
DROP TYPE IF EXISTS application_status_type;

-- Step 10: Rename the new type to the original name
ALTER TYPE application_status_type_new RENAME TO application_status_type;

-- Step 11: Restore the default value
ALTER TABLE applications ALTER COLUMN status SET DEFAULT 'Submitted';

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Check the enum values after running:
-- SELECT enumlabel FROM pg_enum WHERE enumtypid = 'application_status_type'::regtype ORDER BY enumlabel;

-- Verify the column type:
-- SELECT column_name, data_type FROM information_schema.columns 
-- WHERE table_name = 'applications' AND column_name = 'status';

-- Check for any remaining non-standard values:
-- SELECT DISTINCT status FROM applications;

