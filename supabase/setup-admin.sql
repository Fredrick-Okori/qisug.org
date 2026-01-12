-- ============================================================================
-- SUPABASE ADMIN SETUP SCRIPT
-- ============================================================================
-- This script sets up admin user management for Queensgate International School
-- Run this in your Supabase SQL Editor
-- ============================================================================

-- IMPORTANT: First run supabase/schema.sql to create all tables including admin_users
-- The admin_users table is created by the schema.sql file

-- STEP 1: Find your user ID
-- After signing up at /login, run this query to get your user ID:
-- SELECT id, email FROM auth.users;

-- Or, if you know your email, find your user ID:
-- SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';

-- STEP 2: Add your user as an admin
-- Replace 'your-user-id-here' with the actual user ID from Step 1
-- Replace 'your-email@example.com' with your actual email

INSERT INTO admin_users (user_id, email, full_name, role)
VALUES ('01a7205e-4f73-44bf-8d1d-7584cf49663f', 'fredokoririck@gmail.com', 'Administrator', 'admin')
ON CONFLICT (user_id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  is_active = true,
  updated_at = NOW();

-- Verify the table exists and you can access it:
-- SELECT * FROM admin_users LIMIT 5;

-- ============================================================================
-- ADMIN ROLES EXPLANATION
-- ============================================================================
-- 
-- admin:  - Full access to all admin features
--          - Can add/remove admin users
--          - Can change admin roles
--          - Access to all dashboard sections
--
-- reviewer: - Can view applications
--           - Can review and update application status
--           - Cannot manage admin users
--
-- viewer:   - Read-only access
--           - Can view dashboard statistics
--           - Cannot modify any data

-- ============================================================================
-- EXAMPLE: Add multiple admin users
-- ============================================================================

-- Add a reviewer:
-- INSERT INTO admin_users (user_id, email, full_name, role)
-- VALUES ('reviewer-user-id', 'reviewer@school.ac.ug', 'Admissions Officer', 'reviewer')
-- ON CONFLICT (user_id) DO UPDATE SET role = 'reviewer', is_active = true;

-- Add a viewer:
-- INSERT INTO admin_users (user_id, email, full_name, role)
-- VALUES ('viewer-user-id', 'viewer@school.ac.ug', 'Staff Member', 'viewer')
-- ON CONFLICT (user_id) DO UPDATE SET role = 'viewer', is_active = true;

-- ============================================================================
-- VERIFICATION: Check admin users
-- ============================================================================

-- View all admin users:
-- SELECT id, email, full_name, role, is_active, created_at FROM admin_users ORDER BY created_at DESC;

-- Check if your admin access is set up:
-- SELECT 
--   u.id,
--   u.email,
--   a.role,
--   a.is_active
-- FROM auth.users u
-- LEFT JOIN admin_users a ON u.id = a.user_id
-- WHERE u.email = 'your-email@example.com';

-- ============================================================================
-- TROUBLESHOOTING
-- ============================================================================
--
-- If you can't access /admin after setup:
-- 1. Make sure you've signed up at /login first
-- 2. Run the SQL above to add yourself as admin
-- 3. Sign out and sign back in
-- 4. Clear your browser cache if needed
--
-- If you get "Admin access required" error:
-- 1. Check that your user_id is correctly entered
-- 2. Check that is_active = true in admin_users table
-- 3. Check that your role is 'admin' (not 'reviewer' or 'viewer')

