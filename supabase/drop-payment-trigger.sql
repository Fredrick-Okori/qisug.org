-- ============================================================================
-- Drop Payment Trigger
-- Run this SQL to remove the trigger that requires payment reference
-- ============================================================================

-- Run this in your Supabase SQL Editor

-- Drop the trigger first, then the function (using CASCADE to handle dependencies)
DROP TRIGGER IF EXISTS enforce_application_fee_paid ON applications;
DROP FUNCTION IF EXISTS enforce_payment_approval() CASCADE;

-- Done! Now you can approve payments without a payment reference

-- To verify the trigger is gone, run:
-- SELECT trigger_name FROM information_schema.triggers 
-- WHERE trigger_name LIKE '%payment%';

