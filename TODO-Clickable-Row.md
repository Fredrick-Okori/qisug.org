# TODO: Make Full Row Clickable & Create Application Detail Page

## Task: Make full row clickable and create separate page for application details

### Steps:

- [x] 1. Create new application detail page: `app/dashboard/admin/applications/[id]/page.tsx`
  - [x] Fetch full application details from API
  - [x] Display personal information section
  - [x] Display program details section
  - [x] Display documents section with verification status
  - [x] Display academic history section
  - [x] Display agent information (if applicable)
  - [x] Display payment information section
  - [x] Add approve/reject action buttons
  - [x] Add back navigation to applications list

- [x] 2. Modify applications list page: `app/dashboard/admin/applications/page.tsx`
  - [x] Remove modal/dialog component (AnimatePresence, motion.div)
  - [x] Make entire table rows clickable using Link component
  - [x] Update styling to indicate clickable rows (cursor-pointer, hover effects)
  - [x] Keep search, filter, pagination functionality
  - [x] Keep approve/reject buttons (but prevent row click from triggering actions)

### Changes Summary:
1. **New Page**: `app/dashboard/admin/applications/[id]/page.tsx` - Full page view of application details
2. **Modified**: `app/dashboard/admin/applications/page.tsx` - Clickable rows, no modal

