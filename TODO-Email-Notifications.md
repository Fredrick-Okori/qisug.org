# Email Notification System Implementation

## Overview
Implement comprehensive email notification system for application lifecycle.

## User Emails to Implement
1. ✅ Application Submitted (Already exists)
2. 🔄 Payment Receipt Uploaded (Modify)
3. ⬜ Application Under Review (New)
4. ⬜ Application Accepted (New)
5. ⬜ Application Rejected (New)

## Admin Emails to Implement
1. ⬜ New Application Received (New)
2. ⬜ Payment Receipt Uploaded (New)
3. ⬜ Application Moved to Review (New)

## Tasks

### Phase 1: Email Service Module
- [x] Create `lib/email-service.ts` with email templates
- [x] Add helper functions for sending different email types

### Phase 2: Update Edge Function
- [x] Update `supabase/functions/resend-email/index.ts`
- [x] Add support for multiple email templates
- [x] Add admin notification functionality

### Phase 3: Update Payment Upload Flow
- [x] Modify `app/admissions/apply-now/page.tsx`
- [x] Add payment receipt email after upload
- [x] Send admin notification for new payments

### Phase 4: Admin API Routes
- [x] Create `app/api/admin/send-notification/route.ts`
- [x] Implement admin-triggered email functionality
- [x] Update application status to trigger emails

### Phase 5: Auto-notification on New Applications
- [x] Update `app/admissions/apply-now/page.tsx`
- [x] Send admin notification when new application submitted

---

## Progress
- [x] Analyze codebase and existing email functionality
- [x] Create implementation plan
- [x] Phase 1: Create email service module
- [x] Phase 2: Update Edge Function
- [x] Phase 3: Update payment upload flow
- [x] Phase 4: Create admin API routes
- [x] Phase 5: Update auto-notification

---

## All Email Types Implemented
### User Notifications (5 emails)
1. ✅ Application Submitted - Sent when user completes application form
2. ✅ Payment Received - Sent when user uploads payment slip
3. ✅ Application Under Review - Admin triggers via API
4. ✅ Application Accepted - Admin triggers via API
5. ✅ Application Rejected - Admin triggers via API

### Admin Notifications (3 emails)
1. ✅ New Application - Auto-sent when user submits application
2. ✅ Payment Received - Auto-sent when user uploads payment slip
3. ✅ Status Update - Auto-sent when admin changes application status

## Email Types Reference
```
EMAIL_TYPES = {
  // User notifications
  APPLICATION_SUBMITTED: 'application_submitted',
  PAYMENT_RECEIVED: 'payment_received',
  APPLICATION_UNDER_REVIEW: 'application_under_review',
  APPLICATION_ACCEPTED: 'application_accepted',
  APPLICATION_REJECTED: 'application_rejected',
  
  // Admin notifications  
  ADMIN_NEW_APPLICATION: 'admin_new_application',
  ADMIN_PAYMENT_RECEIVED: 'admin_payment_received',
  ADMIN_REVIEW_STATUS: 'admin_review_status'
}
```

## Files Created/Modified
1. ✅ `lib/email-service.ts` - New email service module
2. ✅ `supabase/functions/resend-email/index.ts` - Updated Edge Function
3. ✅ `app/api/send-email/route.ts` - NEW server-side API route (uses SERVICE_ROLE_KEY)
4. ✅ `app/admissions/apply-now/page.tsx` - Added notification triggers via server-side API
5. ✅ `app/api/admin/send-notification/route.ts` - Updated to use server-side API

## Environment Variables Needed
- `RESEND_API_KEY` - For sending emails via Resend (in Supabase Edge Function)
- `SUPABASE_SERVICE_ROLE_KEY` - For server-side API to call Edge Function
- `ADMIN_NOTIFICATION_EMAIL` - Admin email for notifications (default: admissions@qgis.ac.ug)

## Architecture Note
All email sending now goes through the server-side API route `/api/send-email` which securely uses the `SUPABASE_SERVICE_ROLE_KEY` to call the Edge Function. This fixes the 401 "Missing authorization header" error that occurred when calling the Edge Function directly from the client.

