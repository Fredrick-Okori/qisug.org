# Dashboard Portals Implementation

## Task: Create different layouts for admin and applicant portals with proper redirection

## Progress Tracker

### Step 1: Update Login Page Redirect Logic
- [ ] Review and enhance login page redirect function
- [ ] Ensure admins redirect to `/dashboard/admin`
- [ ] Ensure applicants redirect to `/dashboard`

### Step 2: Create/Update Admin Portal Layout
- [ ] Create/enhance admin layout at `/app/dashboard/(admin)/layout.tsx`
- [ ] Use admin sidebar with appropriate navigation
- [ ] Add authentication check for admin access
- [ ] Include mobile-responsive sidebar

### Step 3: Create/Update Applicant Portal Layout
- [ ] Create/enhance applicant layout at `/app/dashboard/layout.tsx`
- [ ] Use applicant sidebar with appropriate navigation
- [ ] Add authentication check for applicant access
- [ ] Include mobile-responsive sidebar

### Step 4: Update Middleware
- [ ] Review middleware protection for dashboard routes
- [ ] Ensure proper redirects for admin vs applicant users
- [ ] Protect admin routes from non-admin users

### Step 5: Create/Enhance Dashboard Pages
- [ ] Create admin dashboard overview at `/app/dashboard/(admin)/page.tsx`
- [ ] Create applicant dashboard overview at `/app/dashboard/page.tsx`
- [ ] Update admin pages (applications, users, settings)
- [ ] Update applicant pages (applied, documents)

### Step 6: Clean Up & Test
- [ ] Remove conflicting/duplicate layout files
- [ ] Test login flow for both admin and applicant
- [ ] Test sidebar navigation for both user types
- [ ] Verify middleware protection works correctly

---

## File Structure Plan

```
app/
├── dashboard/
│   ├── layout.tsx              # Applicant portal layout (default)
│   ├── page.tsx                # Applicant dashboard overview
│   ├── applied/                # Applicant's applications
│   │   └── page.tsx
│   └── parts/
│       ├── sidebar.tsx         # Admin sidebar
│       └── applicant-sidebar.tsx # Applicant sidebar
│
│── dashboard/(admin)/          # Admin portal route group
│   ├── layout.tsx              # Admin portal layout
│   ├── page.tsx                # Admin dashboard overview
│   ├── applications/           # Admin applications management
│   │   └── page.tsx
│   ├── users/                  # Admin users management
│   │   └── page.tsx
│   └── settings/               # Admin settings
│       └── page.tsx
```

## Implementation Status

### Current State Analysis
1. Login page has redirect logic ✓
2. Admin layout exists at `/app/(admin)/layout.tsx` and `/app/dashboard/admin/layout.tsx`
3. Applicant layout exists at `/app/dashboard/layout.tsx`
4. Sidebars exist for both admin and applicant
5. Middleware has route protection

### Issues to Fix
1. Multiple conflicting admin layouts
2. Login redirects to `/dashboard/admin` for admins, but applicant dashboard is at `/dashboard`
3. Need clear separation between admin and applicant portals

### Solution Approach
1. Use Next.js route groups to separate admin and applicant layouts
2. `/dashboard` → Applicant portal (student/applicant view)
3. `/dashboard/admin` → Admin portal (administrative view)
4. Update login redirect to send users to correct portal
5. Clean up duplicate layouts

