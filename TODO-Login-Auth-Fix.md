# Login Auth Fix - TODO

## Problem
The login page is querying the wrong table (`profiles`) for admin roles when it should be checking `admin_users` table.

## Plan
- [x] Fix login page to query `admin_users` table instead of `profiles`
- [x] Update both `useEffect` session check and `handleLogin` function
- [x] Verify the fix by reading the updated file

## Steps Completed
1. ✅ Analyzed the codebase and identified the issue
2. ✅ Confirmed the fix plan with user
3. ✅ Fixed `/app/login/page.tsx` - Replaced `profiles.is_admin` check with `admin_users` table query
4. ✅ Verified the fix - Both occurrences successfully updated

## Files Modified
- `/app/login/page.tsx` - Changed both occurrences of `profiles` to `admin_users`

## Changes Made

### Change 1: useEffect session check (lines 72-86)
```typescript
// BEFORE (broken):
const { data: profile } = await supabase
  .from('profiles')
  .select('is_admin')
  .eq('id', session.user.id)
  .single();
if (profile?.is_admin) { ... }

// AFTER (fixed):
const { data: adminUser } = await supabase
  .from('admin_users')
  .select('role, is_active')
  .eq('user_id', session.user.id)
  .eq('is_active', true)
  .single();
if (adminUser) { ... }
```

### Change 2: handleLogin function (lines 138-167)
```typescript
// BEFORE (broken):
const { data: profile, error: profileError } = await supabase
  .from('profiles')
  .select('is_admin')
  .eq('id', data.user.id)
  .single();

// AFTER (fixed):
const { data: adminUser, error: adminError } = await supabase
  .from('admin_users')
  .select('role, is_active')
  .eq('user_id', data.user.id)
  .eq('is_active', true)
  .single();
```

## Next Steps
Ensure your admin users are added to the `admin_users` table in Supabase. Run the SQL from `supabase/setup-admin.sql` to add your admin user:

```sql
INSERT INTO admin_users (user_id, email, full_name, role)
VALUES ('your-user-id', 'your-email@example.com', 'Administrator', 'admin')
ON CONFLICT (user_id) DO UPDATE SET
  role = 'admin',
  is_active = true;
```

