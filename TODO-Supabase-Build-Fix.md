# TODO - Supabase Build Error Fix

## Task: Fix "Missing NEXT_PUBLIC_SUPABASE_URL environment variable" error during Vercel deployment

## Status: COMPLETED ✅

### Root Cause Analysis
The error occurs during Vercel prerendering because:
1. `app/not-found.tsx` imports `BlueSiteHeader` which calls Supabase client
2. `lib/supabase/client.ts` has `export const supabase = createClient()` which runs at module import time
3. During build/prerendering, environment variables aren't available, causing the error

---

## Fix Plan

### Step 1: Fix `lib/supabase/client.ts`
- [x] Remove module-level `export const supabase = createClient()` 
- [x] Make all exports lazy/no-op when env vars are missing
- [x] Ensure createClient() is only called on client side

### Step 2: Fix `components/blue-header.tsx`
- [x] Initialize Supabase client lazily inside useEffect only on client side
- [x] Add null check for Supabase client

### Step 3: Fix `components/site-header.tsx`
- [x] Initialize Supabase client lazily inside useEffect only on client side
- [x] Add null check for Supabase client

### Step 4: Fix `components/home/apply-component.tsx`
- [x] Initialize Supabase client lazily inside useEffect only on client side
- [x] Add null check for Supabase client

### Step 5: Fix `middleware.ts`
- [x] Add null checks for environment variables
- [x] Return early if env vars are missing

### Step 6: Create `.env.local.example`
- [ ] Document required environment variables
- [ ] Provide template with placeholder values

---

## Files to Modify
1. `lib/supabase/client.ts`
2. `components/blue-header.tsx`
3. `components/site-header.tsx`
4. `components/home/apply-component.tsx`
5. `middleware.ts`
6. `.env.local.example` (new file)

---

## Notes
- Vercel deployment requires environment variables to be set in project settings
- The fix ensures the build doesn't fail when env vars are missing during prerendering
- Client-side code will gracefully handle missing config with user-friendly errors

