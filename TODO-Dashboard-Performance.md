# Dashboard Performance Optimization Plan

## Performance Issues Identified

### 1. Authentication Context (auth-context.tsx)
- **Issue**: Makes database query on every auth state change to check admin status
- **Impact**: Adds latency on every login/logout/session refresh
- **Solution**: Cache admin check results, only query when user ID changes

### 2. Dashboard Page (dashboard/page.tsx)
- **Issue**: Multiple nested loading states, Framer Motion animations on all elements
- **Impact**: Slow initial render, layout shifts
- **Solution**: Use skeleton loading, defer animations, reduce initial data fetching

### 3. No Server-Side Data Fetching
- **Issue**: All dashboard data fetched client-side via Supabase
- **Impact**: Waterfall requests, slower Time to Interactive
- **Solution**: Use server components with streaming for faster initial render

### 4. No Data Caching
- **Issue**: Every page visit triggers fresh Supabase queries
- **Solution**: Implement React Query or similar for caching

## Optimizations to Implement

### Step 1: Optimize Auth Context
- [ ] Cache admin user check with localStorage/sessionStorage
- [ ] Debounce admin queries
- [ ] Reduce unnecessary state updates

### Step 2: Optimize Dashboard Page
- [ ] Replace Framer Motion with CSS transitions (lighter weight)
- [ ] Add skeleton loading instead of spinner
- [ ] Lazy load non-critical sections
- [ ] Defer application statistics until after main content

### Step 3: Add Suspense Boundaries
- [ ] Wrap dashboard sections in Suspense for streaming
- [ ] Add skeleton fallbacks

### Step 4: Optimize Database Queries
- [ ] Add select limits to queries
- [ ] Use proper indexing on foreign keys
- [ ] Batch related queries where possible

## Expected Improvements
- **First Contentful Paint**: ~40% faster
- **Time to Interactive**: ~50% faster
- **Cumulative Layout Shift**: Reduced by ~60%

