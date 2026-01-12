# Application Status Standardization

Standardize all application statuses to: `Submitted`, `Under Review`, `Approved`, `Rejected`

## Status Values

| Status | Description |
|--------|-------------|
| Submitted | Initial status when application is submitted |
| Under Review | When admin starts reviewing |
| Approved | When application is approved |
| Rejected | When application is rejected |

## Tasks

### Phase 1: Type Updates
- [x] 1. Database schema already has correct 4 statuses
- [x] 2. Update `types/database.ts` - Changed `'Accepted'` to `'Approved'`

### Phase 2: Admin Dashboard Updates
- [x] 3. Update `app/dashboard/admin/applications/page.tsx` - Use correct enum values
- [x] 4. Update `app/dashboard/admin/applications/[id]/page.tsx` - Use correct enum values

### Phase 3: Student Dashboard Updates
- [x] 5. Update `app/dashboard/page.tsx` - Changed `'Accepted'` to `'Approved'`
- [x] 6. Update `app/dashboard/applied/page.tsx` - Changed `'Accepted'` to `'Approved'`

### Phase 4: Verification
- [x] 7. All TypeScript errors fixed
- [x] 8. All status values now consistent with database enum

