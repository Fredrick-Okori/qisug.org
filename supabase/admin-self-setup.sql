-- ============================================================================
-- ADMIN SELF-SETUP SCRIPT
-- Run this in Supabase Dashboard → SQL Editor to grant yourself admin access
-- ============================================================================

-- STEP 1: Find your user ID
-- Replace 'your-email@example.com' with YOUR email
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'your-email@example.com';

-- STEP 2: Add yourself as admin (after getting user ID from Step 1)
-- Replace 'your-user-id-here' with the ID from Step 1
-- Replace 'your-email@example.com' with YOUR email

INSERT INTO admin_users (user_id, email, full_name, role)
VALUES ('your-user-id-here', 'your-email@example.com', 'Administrator', 'admin')
ON CONFLICT (user_id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  is_active = true,
  updated_at = NOW();

-- STEP 3: Verify admin access
SELECT 
  u.id,
  u.email,
  a.role,
  a.is_active
FROM auth.users u
LEFT JOIN admin_users a ON u.id = a.user_id
WHERE u.email = 'your-email@example.com';

-- ============================================================================
-- INSTRUCTIONS:
-- 1. Go to Supabase Dashboard: https://supabase.com/dashboard
-- 2. Select project: https://iapgweupfjjaenshfgkx.supabase.co
-- 3. Click "SQL Editor" in the left sidebar
-- 4. Copy and paste this entire script
-- 5. Replace 'your-email@example.com' with your actual email
-- 6. Run Step 1 first to get your user ID
-- 7. Replace 'your-user-id-here' with that ID
-- 8. Run Step 2
-- 9. Sign out and sign back in at /login
-- 10. Access /admin
-- ============================================================================

