# Admin Authentication Implementation Plan

## Objective
Implement Supabase authentication with admin role-based access control for Queensgate International School website.

## Implementation Steps

### Step 1: Create Admin Role Checking Utilities ✅ COMPLETED
- [x] Create `lib/supabase/admin.ts` with functions:
  - `getCurrentAdminUser()` - Get current admin user
  - `isAdminUser()` - Check if user is admin
  - `hasRole(roles)` - Check if user has specific role
  - `isSuperAdmin()` - Check if user is admin
  - `addAdminUser()` - Add new admin user
  - `updateAdminUserRole()` - Update admin role
  - `removeAdminUser()` - Remove admin access
  - `getAllAdminUsers()` - Get all admin users

### Step 2: Create Admin Users API Routes ✅ COMPLETED
- [x] Create `app/api/admin/users/route.ts`:
  - `GET` - List all admin users
  - `POST` - Create new admin user
- [x] Create `app/api/admin/users/[id]/route.ts`:
  - `PATCH` - Update admin user role
  - `DELETE` - Remove admin access

### Step 3: Create Admin Users Management Page ✅ COMPLETED
- [x] Create `app/(admin)/users/page.tsx`:
  - List all admin users with their roles
  - Form to add new admin users
  - Ability to change roles and remove admins

### Step 4: Update Middleware for Admin Protection ✅ COMPLETED
- [x] Update `middleware.ts`:
  - Only admin users can access `/admin/*` routes
  - Non-admin users are redirected to dashboard

### Step 5: Update Admin Sidebar with User Menu ✅ COMPLETED
- [x] Update `app/dashboard/parts/sidebar.tsx`:
  - Show current user info
  - Show user role badge
  - Add logout functionality

### Step 6: Update Setup SQL Script ✅ COMPLETED
- [x] Update `supabase/setup-admin.sql`:
  - Provide step-by-step instructions
  - Add troubleshooting guide

## Database Requirements
The `admin_users` table already exists in the schema with:
- `user_id` UUID (references auth.users)
- `email` TEXT
- `full_name` TEXT
- `role` TEXT ('admin', 'reviewer', 'viewer')
- `is_active` BOOLEAN

## API Response Format

### GET /api/admin/users
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "email": "admin@school.ac.ug",
      "full_name": "Administrator",
      "role": "admin",
      "is_active": true,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### POST /api/admin/users
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "message": "User added as admin successfully"
  }
}
```

## Usage Instructions

### Making a User an Admin
1. User signs up at `/login`
2. Admin goes to `/admin/users`
3. Enter the user's email and assign role
4. User now has admin access

### Admin Role Permissions
- **admin**: Full access to all admin features
- **reviewer**: Can view and review applications
- **viewer**: Read-only access to dashboard

## Testing Checklist
- [ ] Login as regular user - cannot access /admin/*
- [ ] Login as admin - can access /admin/*
- [ ] Can add new admin user
- [ ] Can change user roles
- [ ] Can remove admin access
- [ ] Logout works correctly

