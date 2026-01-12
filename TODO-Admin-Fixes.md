# Admin Dashboard Fixes - Implementation Plan

## Issues Identified
1. Multiple admin dashboard implementations causing route conflicts
2. Admin pages use mock data instead of real API calls
3. Sidebar links point to inconsistent routes

## Implementation Plan

### Phase 1: Route Consolidation
- [ ] Use `/dashboard/admin/*` as canonical admin routes
- [ ] Keep `app/dashboard/admin/*` pages (already correct)
- [ ] Remove or deprecate conflicting routes if needed

### Phase 2: Update Admin Pages to Use Real APIs
- [ ] Update `app/dashboard/admin/dashboard/page.tsx` - Already uses API ✓
- [ ] Update `app/dashboard/admin/applications/page.tsx` - Add API integration
- [ ] Update `app/dashboard/admin/users/page.tsx` - Add API integration
- [ ] Update `app/dashboard/admin/approved/page.tsx` - Add API integration

### Phase 3: Create API Routes
- [ ] Create `GET /api/admin/applications` for applications list
- [ ] Create `GET /api/admin/approved` for approved students
- [ ] Update `GET /api/admin/users` for users list

### Phase 4: Update Sidebar Links
- [ ] Update `app/dashboard/admin/layout.tsx` sidebar links
- [ ] Verify all links point to `/dashboard/admin/*`

## Files to Modify
1. `app/dashboard/admin/applications/page.tsx`
2. `app/dashboard/admin/users/page.tsx`
3. `app/dashboard/admin/approved/page.tsx`
4. `app/dashboard/admin/layout.tsx`
5. `app/api/admin/applications/route.ts` (new)
6. `app/api/admin/approved/route.ts` (new)

## API Endpoints to Create

### GET /api/admin/applications
```json
{
  "success": true,
  "data": [...],
  "pagination": { "page": 1, "limit": 10, "total": 50 }
}
```

### GET /api/admin/approved
```json
{
  "success": true,
  "data": [...],
  "stats": { "total": 100, "confirmed": 50, "enrolled": 30, "pending": 20 }
}
```

### GET /api/admin/users
```json
{
  "success": true,
  "data": [...]
}
```

