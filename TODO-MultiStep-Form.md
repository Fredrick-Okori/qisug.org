# Multi-Step Application Form

## Overview
Converting the apply-now page into a 5-step multi-step form wizard.

## Steps:
1. **Info Step**: Information page with disclaimers
   - School info content
   - Disclaimer about accuracy
   - Application fee: $300 USD (non-refundable)
   - "Proceed to Apply" button

2. **Fill Form Step**: Application form
   - Personal Information
   - Contact Information
   - Academic Information
   - Required Documents
   - Declaration checkbox

3. **Reference Number Step**: After form submission
   - Application reference number
   - Simple summary of application
   - Bank information (ABSA)
   - Download PDF button

4. **Payments Step**: Upload payment slip
   - Upload payment slip area
   - Submit Application button

5. **Success Step**: Final success page
   - Congratulations message
   - Confetti animation
   - Next steps info

## Files to modify:
- `app/admissions/apply-now/page.tsx` - Main multi-step form

## Dependencies:
- `canvas-confetti` for confetti effect
- `jspdf` for PDF generation (optional, can use window.print)

