# Admin Users Implementation Plan

## Goal
Create a user management system where:
- **Public users** sign up/login and access `/admissions/apply-now`
- **Admin users** sign up/login and access the admin dashboard to manage admissions

## Implementation Steps

### Step 1: Update Database Schema
- [ ] Add `is_admin` column to `profiles` table (or use existing `admin_users` table)
- [ ] Create RLS policies for admin access

### Step 2: Update Auth Callback
- [ ] Check if user is admin after successful authentication
- [ ] Redirect admin users to `/admin/dashboard`
- [ ] Redirect regular users to `/admissions/apply-now`

### Step 3: Update Middleware
- [ ] Allow admin users to access `/admin/*` routes
- [ ] Add proper role-based access control

### Step 4: Create Admin Dashboard
- [ ] Create `app/(admin)/dashboard/page.tsx`
- [ ] Show application statistics
- [ ] List all applications with status
- [ ] Allow viewing and managing applications

### Step 5: Update Site Header
- [ ] Add admin dashboard link for authenticated admin users
- [ ] Show appropriate navigation based on user role

### Step 6: Create Admin Layout
- [ ] Create `app/(admin)/layout.tsx` with sidebar navigation
- [ ] Add admin-specific styling and components

## Files to Create/Modify

### New Files
- `app/(admin)/layout.tsx` - Admin dashboard layout
- `app/(admin)/dashboard/page.tsx` - Main admin dashboard
- `lib/supabase/admin.ts` - Admin-specific utilities (may already exist)

### Modified Files
- `app/auth/callback/route.ts` - Add admin redirect logic
- `middleware.ts` - Add admin route protection
- `components/site-header.tsx` - Add admin navigation
- `supabase/schema.sql` - Add profile table with is_admin column
- `types/database.ts` - Add Profile type with is_admin

## User Flow

```
User visits /login
    ↓
Signs up/logs in
    ↓
Auth callback triggered
    ↓
Is user an admin? → YES → /admin/dashboard
    ↓ NO
/admissions/apply-now
```

## Admin Dashboard Features
1. Overview statistics (total applications, by status, by intake)
2. List of all applications with filters
3. View application details
4. Accept/Reject applications
5. Manage admin users (for super admins)

