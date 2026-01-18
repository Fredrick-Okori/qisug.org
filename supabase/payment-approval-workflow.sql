-- ============================================================================
-- Application Fee Payment Workflow SQL
-- Approves payment for ALL applications of an applicant
-- ============================================================================

-- Run this in your Supabase SQL Editor
-- ============================================================================

-- STEP 1: Ensure application_fee_paid has proper default
-- ============================================================================

-- First, set all NULL values to FALSE
UPDATE applications SET application_fee_paid = FALSE WHERE application_fee_paid IS NULL;

-- Add default if not exists
ALTER TABLE applications ALTER COLUMN application_fee_paid SET DEFAULT FALSE;

-- STEP 2: Add payment_approved_at column if not exists
-- ============================================================================

ALTER TABLE applications ADD COLUMN IF NOT EXISTS payment_approved_at TIMESTAMP WITH TIME ZONE;

-- STEP 3: Create function to approve payment for ALL applications of an applicant
-- ============================================================================

-- Drop existing function first (use OR REPLACE for functions)
DROP FUNCTION IF EXISTS approve_applicant_payment(UUID, UUID, TEXT);

CREATE OR REPLACE FUNCTION approve_applicant_payment(
  p_applicant_id UUID,
  p_admin_user_id UUID,
  p_payment_reference TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_updated_count INTEGER;
  v_result JSON;
BEGIN
  -- Update ALL applications for this applicant
  UPDATE applications
  SET 
    application_fee_paid = TRUE,
    payment_reference = COALESCE(p_payment_reference, payment_reference),
    status = CASE 
      WHEN status = 'Submitted' THEN 'Under Review' 
      ELSE status 
    END,
    reviewed_at = NOW(),
    reviewed_by = p_admin_user_id,
    payment_approved_at = NOW(),
    updated_at = NOW()
  WHERE applicant_id = p_applicant_id
  AND application_fee_paid = FALSE; -- Only update unpaid applications

  GET DIAGNOSTICS v_updated_count = ROW_COUNT;

  -- Return success
  SELECT json_build_object(
    'success', TRUE,
    'data', json_build_object(
      'applicant_id', p_applicant_id,
      'applications_updated', v_updated_count,
      'approved_by', p_admin_user_id,
      'payment_reference', p_payment_reference
    )
  ) INTO v_result;

  RETURN v_result;
EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object(
    'success', FALSE,
    'error', SQLERRM
  );
END;
$$;

-- STEP 4: Create function to reset payment for ALL applications of an applicant
-- ============================================================================

DROP FUNCTION IF EXISTS reset_applicant_payment(UUID);

CREATE OR REPLACE FUNCTION reset_applicant_payment(
  p_applicant_id UUID
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_updated_count INTEGER;
  v_result JSON;
BEGIN
  -- Reset ALL applications for this applicant
  UPDATE applications
  SET 
    application_fee_paid = FALSE,
    payment_approved_at = NULL,
    updated_at = NOW()
  WHERE applicant_id = p_applicant_id;

  GET DIAGNOSTICS v_updated_count = ROW_COUNT;

  -- Return success
  SELECT json_build_object(
    'success', TRUE,
    'data', json_build_object(
      'applicant_id', p_applicant_id,
      'applications_updated', v_updated_count
    )
  ) INTO v_result;

  RETURN v_result;
EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object(
    'success', FALSE,
    'error', SQLERRM
  );
END;
$$;

-- STEP 5: Create or replace views to monitor payment status
-- ============================================================================

-- Drop views with CASCADE to handle dependencies
DROP VIEW IF EXISTS pending_payment_approvals CASCADE;
DROP VIEW IF EXISTS application_payment_status CASCADE;

-- Create the view
CREATE OR REPLACE VIEW application_payment_status AS
SELECT 
  a.id AS application_id,
  a.applicant_id,
  ap.first_name || ' ' || ap.last_name AS applicant_name,
  ap.email,
  a.status AS application_status,
  a.application_fee_paid,
  a.payment_reference,
  a.payment_amount,
  a.submitted_at,
  a.payment_approved_at,
  au.full_name AS approved_by,
  CASE 
    WHEN a.application_fee_paid = TRUE THEN 'Paid & Approved'
    WHEN a.payment_reference IS NOT NULL THEN 'Payment Reference Added - Pending Approval'
    ELSE 'No Payment'
  END AS payment_status
FROM applications a
LEFT JOIN applicants ap ON a.applicant_id = ap.id
LEFT JOIN admin_users au ON a.reviewed_by = au.user_id
ORDER BY a.created_at DESC;

-- View for applications pending payment approval
CREATE OR REPLACE VIEW pending_payment_approvals AS
SELECT DISTINCT
  aps.applicant_id,
  aps.applicant_name,
  aps.email,
  aps.payment_reference,
  aps.payment_amount,
  aps.submitted_at
FROM application_payment_status aps
WHERE aps.payment_reference IS NOT NULL 
  AND aps.application_fee_paid = FALSE
ORDER BY aps.submitted_at DESC;

-- ============================================================================
-- Usage Examples
-- ============================================================================

-- Approve payment for all applications of an applicant:
-- SELECT approve_applicant_payment('applicant-uuid', 'admin-user-id', 'PAY-12345');

-- Reset payment for all applications of an applicant:
-- SELECT reset_applicant_payment('applicant-uuid');

-- View all payment statuses:
-- SELECT * FROM application_payment_status;

-- View applicants pending payment approval:
-- SELECT * FROM pending_payment_approvals;

-- ============================================================================
-- Summary
-- ============================================================================
--
-- When admin clicks "Approve Payment":
-- 1. API calls approve_applicant_payment(applicant_id, admin_id, payment_ref)
-- 2. ALL applications for that applicant get:
--    - application_fee_paid = TRUE
--    - payment_approved_at = NOW()
--    - status = 'Under Review' (if was 'Submitted')
--    - reviewed_by = admin_id
-- 3. Frontend shows "Payment Approved" for all those applications
--
-- ============================================================================

