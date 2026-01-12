# Admin Dashboard Implementation Plan

## Overview
Connect the admin dashboard to real Supabase data, add real charts, and implement missing features.

## Tasks

### Phase 1: Connect Dashboard to Supabase
- [ ] 1.1 Create dashboard API routes for fetching stats
- [ ] 1.2 Update dashboard overview to fetch real data
- [ ] 1.3 Connect applications page to Supabase
- [ ] 1.4 Connect users page to Supabase API

### Phase 2: Add Real Charts & Visualizations
- [ ] 2.1 Install recharts for data visualization
- [ ] 2.2 Add application status distribution chart
- [ ] 2.3 Add monthly applications trend chart
- [ ] 2.4 Add program distribution pie chart
- [ ] 2.5 Add payment status overview

### Phase 3: Implement Missing Features
- [ ] 3.1 Create document review page (`/dashboard/admin/documents`)
- [ ] 3.2 Create classes & streams page (`/dashboard/admin/classes`)
- [ ] 3.3 Create approved students page (`/dashboard/admin/approved`)
- [ ] 3.4 Add sidebar links for new pages

### Phase 4: API Routes & Database
- [ ] 4.1 Create `GET /api/dashboard/stats` endpoint
- [ ] 4.2 Create `GET /api/dashboard/documents` endpoint
- [ ] 4.3 Create `GET /api/dashboard/classes` endpoint
- [ ] 4.4 Update database schema if needed

### Phase 5: Polish & Testing
- [ ] 5.1 Add loading states and skeletons
- [ ] 5.2 Add error handling
- [ ] 5.3 Test all dashboard pages
- [ ] 5.4 Verify role-based access

## Implementation Order
1. Create TODO.md with detailed tasks
2. Install recharts package
3. Create dashboard API routes
4. Update dashboard overview page
5. Update applications page
6. Update users page
7. Create missing pages
8. Test and polish

