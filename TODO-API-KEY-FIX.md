# TODO - API Key Fixes

## Task: Fix "Invalid API key" error when submitting applications

### Issues Identified:
1. Type Mismatches in `types/database.ts` - nested vs flat column names
2. Missing environment validation for Supabase config
3. Poor error handling when Supabase client fails

### Fix Plan:

- [ ] 1. Update `types/database.ts` to match database schema (flat columns)
- [ ] 2. Add environment validation in `lib/supabase/client.ts`
- [ ] 3. Add try-catch wrapper with better error messages in apply-now page
- [ ] 4. Add client-side Supabase initialization check
- [ ] 5. Test the application submission

### Files to Modify:
1. `types/database.ts` - Fix type definitions
2. `lib/supabase/client.ts` - Add environment validation
3. `app/admissions/apply-now/page.tsx` - Add error handling

