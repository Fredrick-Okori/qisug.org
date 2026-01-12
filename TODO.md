# Admin Dashboard Implementation - Detailed Tasks

## Phase 1: Connect Dashboard to Supabase

### 1.1 Create Dashboard Stats API Route
- [ ] Create `app/api/dashboard/stats/route.ts`
- [ ] Fetch total applications count
- [ ] Fetch pending applications count
- [ ] Fetch approved applications count
- [ ] Fetch rejected applications count
- [ ] Fetch total users count
- [ ] Fetch new applications this week

### 1.2 Update Dashboard Overview Page
- [ ] Replace mock stats with real data from API
- [ ] Add loading state with skeleton
- [ ] Add error handling
- [ ] Refetch data on mount

### 1.3 Connect Applications Page to Supabase
- [ ] Create `app/api/applications/admin/route.ts` for admin
- [ ] Update applications page to fetch from API
- [ ] Add pagination to API
- [ ] Add filtering to API
- [ ] Implement approve/reject actions

### 1.4 Connect Users Page to Supabase API
- [ ] Update `app/api/admin/users/route.ts` for admin users
- [ ] Add CRUD operations
- [ ] Update users page to use real API

## Phase 2: Add Real Charts & Visualizations

### 2.1 Install Recharts
- [ ] Add recharts to package.json
- [ ] Test recharts installation

### 2.2 Add Application Status Chart
- [ ] Create status distribution pie chart
- [ ] Add to dashboard overview
- [ ] Use real data from stats API

### 2.3 Add Monthly Trend Chart
- [ ] Create applications trend bar chart
- [ ] Show last 6 months data
- [ ] Add to dashboard overview

### 2.4 Add Program Distribution Chart
- [ ] Create program distribution chart
- [ ] Show IB Diploma, A-Level, IGCSE counts
- [ ] Add to dashboard overview

### 2.5 Add Payment Status Overview
- [ ] Add payment status breakdown
- [ ] Show paid, pending, failed counts
- [ ] Add to dashboard overview

## Phase 3: Implement Missing Features

### 3.1 Create Document Review Page
- [ ] Create `app/dashboard/admin/documents/page.tsx`
- [ ] List all uploaded documents
- [ ] Add filter by status (pending, verified, rejected)
- [ ] Add verify/reject actions
- [ ] Create `app/api/documents/route.ts`
- [ ] Create `app/api/documents/[id]/route.ts`

### 3.2 Create Classes & Streams Page
- [ ] Create `app/dashboard/admin/classes/page.tsx`
- [ ] List all classes and streams
- [ ] Add create/edit/delete class functionality
- [ ] Show student counts per class
- [ ] Create API routes for classes

### 3.3 Create Approved Students Page
- [ ] Create `app/dashboard/admin/approved/page.tsx`
- [ ] List all approved students
- [ ] Add filter by program, year
- [ ] Add export functionality
- [ ] Create API route for approved students

### 3.4 Update Sidebar
- [ ] Add links to Documents, Classes, Approved pages
- [ ] Ensure proper active state highlighting

## Phase 4: Polish & Testing

### 4.1 Add Loading States
- [ ] Add skeleton components to all pages
- [ ] Add skeleton to dashboard stats
- [ ] Add skeleton to table pages

### 4.2 Error Handling
- [ ] Add error boundaries
- [ ] Add toast notifications for errors
- [ ] Handle network failures gracefully

### 4.3 Testing Checklist
- [ ] Test dashboard stats loading
- [ ] Test applications search and filter
- [ ] Test approve/reject actions
- [ ] Test users management
- [ ] Test settings tabs
- [ ] Test mobile responsiveness
- [ ] Test sidebar collapse

### 4.4 Performance Optimization
- [ ] Add pagination to all list pages
- [ ] Implement data caching
- [ ] Add optimistic updates for actions

