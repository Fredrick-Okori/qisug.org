-- ============================================================================
-- SCHEMA CACHE RELOAD FIX FOR USER_ID COLUMN
-- ============================================================================
-- This SQL script fixes the PGRST204 error by:
-- 1. Verifying the user_id column exists in the applicants table
-- 2. Ensuring the index exists for faster lookups
-- 3. NOTIFYing PostgREST to reload its schema cache
-- 4. Verifying the schema changes are applied
--
-- Run this in Supabase SQL Editor to fix the application submission error
-- ============================================================================

-- Step 1: Verify and Add user_id Column (idempotent - safe to run multiple times)
-- ============================================================================
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'applicants' AND column_name = 'user_id'
    ) THEN
        ALTER TABLE applicants ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
        RAISE NOTICE 'user_id column added to applicants table';
    ELSE
        RAISE NOTICE 'user_id column already exists in applicants table';
    END IF;
END $$;

-- Step 2: Create or Verify Index on user_id (for faster lookups)
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_applicants_user_id ON applicants(user_id);

-- Step 3: CRITICAL - Notify PostgREST to Reload Schema Cache
-- ============================================================================
-- This is the KEY command that fixes the PGRST204 error!
-- PostgREST caches the database schema, and when new columns are added,
-- it needs to be notified to reload its cache.

NOTIFY pgrst, 'reload_schema';

-- Step 4: Verify the fix - Check if user_id column is now recognized
-- ============================================================================
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'applicants'
AND column_name IN ('id', 'user_id', 'first_name', 'last_name', 'email')
ORDER BY column_name;

-- Step 5: Check indexes on applicants table
-- ============================================================================
SELECT 
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename = 'applicants'
ORDER BY indexname;

-- ============================================================================
-- EXPECTED OUTPUT
-- ============================================================================
-- After running this script, you should see:
-- 1. NOTICE about user_id column (added or already exists)
-- 2. NOTICE about idx_applicants_user_id index (created or already exists)
-- 3. NOTIFY command execution (no output, but schema cache is reloaded)
-- 4. Query results showing user_id column exists with UUID data type
-- 5. Index information showing idx_applicants_user_id exists
--
-- TEST: After running this, try submitting a new application.
-- The PGRST204 error should be resolved.
-- ============================================================================

-- ============================================================================
-- ALTERNATIVE: If NOTIFY doesn't work, try these additional steps:
-- ============================================================================
-- Sometimes PostgREST needs a complete schema reload. If the above doesn't work:

-- Option A: Restart the PostgREST service (via Supabase Dashboard)
-- 1. Go to Dashboard > Database > Extensions
-- 2. Find "pgREST" extension
-- 3. Disable then re-enable it

-- Option B: Force schema reload via API call:
-- curl -X POST "https://your-project.supabase.co/rest/v1/" \
--   -H "Authorization: Bearer SERVICE_ROLE_KEY" \
--   -H "Content-Type: application/json" \
--   -d "{}" \
--   -H "Prefer: transient=true"

-- Option C: Toggle schema caching in Dashboard:
-- 1. Go to API settings in Supabase Dashboard
-- 2. Find "Schema caching" option
-- 3. Toggle it OFF, wait 5 seconds, then toggle it back ON

-- ============================================================================

