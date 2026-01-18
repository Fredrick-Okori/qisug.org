/**
 * Email Service Module
 * 
 * Provides email notification functionality for the QIS application lifecycle.
 * Uses Supabase Edge Functions with Resend API for sending emails.
 */

// ============================================================================
// TYPES
// ============================================================================

export type EmailType = 
  | 'application_submitted'
  | 'payment_received'
  | 'payment_approved'
  | 'application_under_review'
  | 'application_accepted'
  | 'application_rejected'
  | 'admin_new_application'
  | 'admin_payment_received'
  | 'admin_review_status'

export interface EmailPayload {
  to: string
  subject?: string
  applicantName: string
  referenceNumber: string
  grade?: string
  stream?: string
  admissionPeriod?: string
  emailType: EmailType
  // Admin notification fields
  adminEmail?: string
  adminName?: string
  rejectionReason?: string
  notes?: string
}

export interface EmailResponse {
  success: boolean
  emailId?: string
  error?: string
}

// ============================================================================
// EMAIL TEMPLATES
// ============================================================================

/**
 * Generate HTML email based on email type
 */
export function generateEmailHTML(data: EmailPayload): string {
  const baseStyles = `
    <style>
      body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        line-height: 1.6;
        color: #333;
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #f5f5f5;
      }
      .email-container {
        background-color: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      }
      .header {
        background-color: #053f52;
        color: white;
        padding: 30px 20px;
        text-align: center;
      }
      .header h1 { margin: 0; font-size: 24px; }
      .header p { margin: 10px 0 0 0; opacity: 0.9; }
      .content { padding: 30px; }
      .content h2 { color: #053f52; margin-top: 0; }
      .reference-box {
        background-color: #EFBF04;
        padding: 20px;
        border-radius: 8px;
        text-align: center;
        margin: 20px 0;
      }
      .reference-box .label { font-size: 14px; color: #053f52; margin-bottom: 5px; font-weight: 600; }
      .reference-box .number { font-size: 28px; font-weight: bold; color: #053f52; font-family: 'Courier New', monospace; }
      .details { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
      .details h3 { color: #053f52; margin-top: 0; }
      .footer { background-color: #053f52; color: white; padding: 20px; text-align: center; }
      .footer p { margin: 5px 0; font-size: 14px; }
      .footer a { color: #EFBF04; text-decoration: none; }
      .status-badge { display: inline-block; padding: 8px 16px; border-radius: 20px; font-weight: 600; }
      .status-review { background-color: #dbeafe; color: #1e40af; }
      .status-accepted { background-color: #dcfce7; color: #166534; }
      .status-rejected { background-color: #fee2e2; color: #991b1b; }
      .status-payment { background-color: #fef3c7; color: #92400e; }
    </style>
  `

  switch (data.emailType) {
    case 'application_submitted':
      return generateApplicationSubmittedEmail(data, baseStyles)
    case 'payment_received':
      return generatePaymentReceivedEmail(data, baseStyles)
    case 'payment_approved':
      return generatePaymentApprovedEmail(data, baseStyles)
    case 'application_under_review':
      return generateUnderReviewEmail(data, baseStyles)
    case 'application_accepted':
      return generateAcceptedEmail(data, baseStyles)
    case 'application_rejected':
      return generateRejectedEmail(data, baseStyles)
    case 'admin_new_application':
      return generateAdminNewApplicationEmail(data, baseStyles)
    case 'admin_payment_received':
      return generateAdminPaymentReceivedEmail(data, baseStyles)
    case 'admin_review_status':
      return generateAdminReviewStatusEmail(data, baseStyles)
    default:
      return generateApplicationSubmittedEmail(data, baseStyles)
  }
}

/**
 * Generate plain text email based on email type
 */
export function generateEmailText(data: EmailPayload): string {
  switch (data.emailType) {
    case 'application_submitted':
      return generateApplicationSubmittedText(data)
    case 'payment_received':
      return generatePaymentReceivedText(data)
    case 'payment_approved':
      return generatePaymentApprovedText(data)
    case 'application_under_review':
      return generateUnderReviewText(data)
    case 'application_accepted':
      return generateAcceptedText(data)
    case 'application_rejected':
      return generateRejectedText(data)
    case 'admin_new_application':
      return generateAdminNewApplicationText(data)
    case 'admin_payment_received':
      return generateAdminPaymentReceivedText(data)
    case 'admin_review_status':
      return generateAdminReviewStatusText(data)
    default:
      return generateApplicationSubmittedText(data)
  }
}

// ============================================================================
// USER EMAIL TEMPLATES
// ============================================================================

function generateApplicationSubmittedEmail(data: EmailPayload, styles: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Application Received</title>
  ${styles}
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>🎓 Queensgate International School</h1>
      <p>Application Received Successfully</p>
    </div>
    <div class="content">
      <h2>Dear ${data.applicantName},</h2>
      <p>Thank you for submitting your application to Queensgate International School. Your application has been successfully received and is now under review by our admissions team.</p>
      <div class="reference-box">
        <div class="label">Your Application Reference Number</div>
        <div class="number">${data.referenceNumber}</div>
      </div>
      <div class="details">
        <h3>📄 Application Summary</h3>
        <p><strong>Name:</strong> ${data.applicantName}</p>
        <p><strong>Grade:</strong> Grade ${data.grade || 'N/A'}</p>
        <p><strong>Stream:</strong> ${data.stream || 'N/A'}</p>
        <p><strong>Admission Period:</strong> ${data.admissionPeriod || 'N/A'}</p>
        <p><strong>Reference:</strong> ${data.referenceNumber}</p>
      </div>
      <div class="details" style="background-color: #fff9e6;">
        <h3>💳 Next Steps</h3>
        <p>Please proceed with your application fee payment of <strong>$300 USD</strong> at any I&M Bank branch using your reference number.</p>
      </div>
      <p>We look forward to welcoming you to the Queensgate family!</p>
      <p>Warm regards,<br><strong>The Admissions Team</strong><br>Queensgate International School</p>
    </div>
    <div class="footer">
      <p><strong>Queensgate International School</strong></p>
      <p>Excellence in Education | Nurturing Future Leaders</p>
      <p><a href="mailto:admissions@qgis.ac.ug">admissions@qgis.ac.ug</a></p>
    </div>
  </div>
</body>
</html>
  `
}

function generateApplicationSubmittedText(data: EmailPayload): string {
  return `
QUEENSGATE INTERNATIONAL SCHOOL
Application Received Successfully

Dear ${data.applicantName},

Thank you for submitting your application to Queensgate International School.

YOUR APPLICATION REFERENCE NUMBER: ${data.referenceNumber}

APPLICATION SUMMARY:
- Name: ${data.applicantName}
- Grade: Grade ${data.grade || 'N/A'}
- Stream: ${data.stream || 'N/A'}
- Admission Period: ${data.admissionPeriod || 'N/A'}

NEXT STEPS:
Please proceed with your application fee payment of $300 USD at any I&M Bank branch using your reference number.

Warm regards,
The Admissions Team
Queensgate International School
  `
}

function generatePaymentReceivedEmail(data: EmailPayload, styles: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Received</title>
  ${styles}
</head>
<body>
  <div class="email-container">
    <div class="header" style="background-color: #16a34a;">
      <h1>✅ Payment Received</h1>
      <p>Queensgate International School</p>
    </div>
    <div class="content">
      <h2>Dear ${data.applicantName},</h2>
      <p>We are pleased to confirm that we have received your payment for the application fee. Your payment slip has been verified and your application is now being processed.</p>
      <div class="reference-box">
        <div class="label">Application Reference</div>
        <div class="number">${data.referenceNumber}</div>
      </div>
      <div class="details">
        <h3>📋 Application Status</h3>
        <p><strong>Status:</strong> <span class="status-badge status-payment">Payment Verified</span></p>
        <p><strong>Reference:</strong> ${data.referenceNumber}</p>
      </div>
      <div class="details">
        <h3>📅 What Happens Next?</h3>
        <p>1. Our admissions team will review your complete application</p>
        <p>2. You will receive a notification when your application is moved to "Under Review"</p>
        <p>3. The review process typically takes 5-7 business days</p>
      </div>
      you for choosing Queens <p>Thankgate International School!</p>
      <p>Warm regards,<br><strong>The Admissions Team</strong><br>Queensgate International School</p>
    </div>
    <div class="footer">
      <p><strong>Queensgate International School</strong></p>
      <p>Excellence in Education | Nurturing Future Leaders</p>
      <p><a href="mailto:admissions@qgis.ac.ug">admissions@qgis.ac.ug</a></p>
    </div>
  </div>
</body>
</html>
  `
}

function generatePaymentReceivedText(data: EmailPayload): string {
  return `
QUEENSGATE INTERNATIONAL SCHOOL
Payment Received Confirmation

Dear ${data.applicantName},

We are pleased to confirm that we have received your payment for the application fee.

APPLICATION REFERENCE: ${data.referenceNumber}
STATUS: Payment Verified

WHAT HAPPENS NEXT:
1. Our admissions team will review your complete application
2. You will receive a notification when your application is moved to "Under Review"
3. The review process typically takes 5-7 business days

Thank you for choosing Queensgate International School!
The Admissions Team
  `
}

function generatePaymentApprovedEmail(data: EmailPayload, styles: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Approved - Application Under Review</title>
  ${styles}
</head>
<body>
  <div class="email-container">
    <div class="header" style="background-color: #16a34a;">
      <h1>✅ Payment Approved</h1>
      <p>Queensgate International School</p>
    </div>
    <div class="content">
      <h2>Dear ${data.applicantName},</h2>
      <p>We are pleased to confirm that your application fee payment has been received and approved. Your application is now under review by our admissions team.</p>
      <div class="reference-box">
        <div class="label">Application Reference</div>
        <div class="number">${data.referenceNumber}</div>
      </div>
      <div class="details" style="background-color: #dcfce7;">
        <h3 style="color: #166534;">✅ Payment Status: Approved</h3>
        <p><strong>Reference:</strong> ${data.referenceNumber}</p>
      </div>
      <div class="details">
        <h3>📋 Current Status</h3>
        <p><strong>Status:</strong> <span class="status-badge status-review">Under Review</span></p>
      </div>
      <div class="details">
        <h3>⏳ Next Steps</h3>
        <p>Our admissions team will now carefully review your complete application. You will be notified once a decision has been made.</p>
        <p>Please note that the review process typically takes 5-7 business days.</p>
      </div>
      <p>Thank you for choosing Queensgate International School.</p>
      <p>Kind regards,<br><strong>The Admissions Team</strong><br>Queensgate International School</p>
    </div>
    <div class="footer">
      <p><strong>Queensgate International School</strong></p>
      <p>Excellence in Education | Nurturing Future Leaders</p>
      <p><a href="mailto:admissions@qgis.ac.ug">admissions@qgis.ac.ug</a></p>
    </div>
  </div>
</body>
</html>
  `
}

function generatePaymentApprovedText(data: EmailPayload): string {
  return `
QUEENSGATE INTERNATIONAL SCHOOL
Payment Approved - Application Under Review

Dear ${data.applicantName},

We are pleased to confirm that your application fee payment has been received and approved. Your application is now under review by our admissions team.

APPLICATION REFERENCE: ${data.referenceNumber}
STATUS: Under Review

NEXT STEPS:
Our admissions team will now carefully review your complete application. You will be notified once a decision has been made.

Please note that the review process typically takes 5-7 business days.

Thank you for choosing Queensgate International School.

Kind regards,
The Admissions Team
Queensgate International School
  `
}

function generateUnderReviewEmail(data: EmailPayload, styles: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Application Under Review</title>
  ${styles}
</head>
<body>
  <div class="email-container">
    <div class="header" style="background-color: #2563eb;">
      <h1>🔍 Application Under Review</h1>
      <p>Queensgate International School</p>
    </div>
    <div class="content">
      <h2>Dear ${data.applicantName},</h2>
      <p>Great news! Your application is now being reviewed by our admissions committee. This is an important step in the admissions process.</p>
      <div class="reference-box">
        <div class="label">Application Reference</div>
        <div class="number">${data.referenceNumber}</div>
      </div>
      <div class="details">
        <h3>📋 Current Status</h3>
        <p><strong>Status:</strong> <span class="status-badge status-review">Under Review</span></p>
        <p><strong>Reference:</strong> ${data.referenceNumber}</p>
      </div>
      <div class="details">
        <h3>⏳ What to Expect</h3>
        <p>• Our admissions committee is carefully reviewing your application and supporting documents</p>
        <p>• The review process typically takes 5-7 business days</p>
        <p>• You will receive another email once a decision has been made</p>
        <p>• Please check your email regularly for updates</p>
      </div>
      <p>We appreciate your patience and look forward to getting back to you soon!</p>
      <p>Warm regards,<br><strong>The Admissions Team</strong><br>Queensgate International School</p>
    </div>
    <div class="footer">
      <p><strong>Queensgate International School</strong></p>
      <p>Excellence in Education | Nurturing Future Leaders</p>
      <p><a href="mailto:admissions@qgis.ac.ug">admissions@qgis.ac.ug</a></p>
    </div>
  </div>
</body>
</html>
  `
}

function generateUnderReviewText(data: EmailPayload): string {
  return `
QUEENSGATE INTERNATIONAL SCHOOL
Application Now Under Review

Dear ${data.applicantName},

Great news! Your application is now being reviewed by our admissions committee.

APPLICATION REFERENCE: ${data.referenceNumber}
STATUS: Under Review

WHAT TO EXPECT:
• Our admissions committee is carefully reviewing your application
• The review process typically takes 5-7 business days
• You will receive another email once a decision has been made
• Please check your email regularly for updates

We appreciate your patience!
The Admissions Team
  `
}

function generateAcceptedEmail(data: EmailPayload, styles: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Application Accepted!</title>
  ${styles}
</head>
<body>
  <div class="email-container">
    <div class="header" style="background-color: #16a34a;">
      <h1>🎉 Congratulations!</h1>
      <p>Queensgate International School</p>
    </div>
    <div class="content">
      <h2>Dear ${data.applicantName},</h2>
      <p>We are thrilled to inform you that your application to Queensgate International School has been <strong style="color: #16a34a;">ACCEPTED</strong>!</p>
      <div class="reference-box">
        <div class="label">Application Reference</div>
        <div class="number">${data.referenceNumber}</div>
      </div>
      <div class="details" style="background-color: #dcfce7;">
        <h3 style="color: #166534;">✅ Admission Status: ACCEPTED</h3>
        <p><strong>Reference:</strong> ${data.referenceNumber}</p>
      </div>
      <div class="details">
        <h3>📄 Next Steps</h3>
        <p>1. You will receive an official acceptance letter with detailed instructions</p>
        <p>2. Review the enrollment requirements and deadlines</p>
        <p>3. Complete the enrollment process before the deadline</p>
        <p>4. Contact us if you have any questions about enrollment</p>
      </div>
      <p>Welcome to the Queensgate family! We are excited to have you join our community of learners.</p>
      <p>Warm regards,<br><strong>The Admissions Team</strong><br>Queensgate International School</p>
    </div>
    <div class="footer">
      <p><strong>Queensgate International School</strong></p>
      <p>Excellence in Education | Nurturing Future Leaders</p>
      <p><a href="mailto:admissions@qgis.ac.ug">admissions@qgis.ac.ug</a></p>
    </div>
  </div>
</body>
</html>
  `
}

function generateAcceptedText(data: EmailPayload): string {
  return `
QUEENSGATE INTERNATIONAL SCHOOL
Congratulations! Application Accepted!

Dear ${data.applicantName},

We are thrilled to inform you that your application to Queensgate International School has been ACCEPTED!

APPLICATION REFERENCE: ${data.referenceNumber}
STATUS: ACCEPTED

NEXT STEPS:
1. You will receive an official acceptance letter with detailed instructions
2. Review the enrollment requirements and deadlines
3. Complete the enrollment process before the deadline
4. Contact us if you have any questions

Welcome to the Queensgate family!
The Admissions Team
  `
}

function generateRejectedEmail(data: EmailPayload, styles: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Application Update</title>
  ${styles}
</head>
<body>
  <div class="email-container">
    <div class="header" style="background-color: #dc2626;">
      <h1>Application Update</h1>
      <p>Queensgate International School</p>
    </div>
    <div class="content">
      <h2>Dear ${data.applicantName},</h2>
      <p>Thank you for your interest in Queensgate International School. After careful consideration, we regret to inform you that your application was not successful at this time.</p>
      <div class="reference-box">
        <div class="label">Application Reference</div>
        <div class="number">${data.referenceNumber}</div>
      </div>
      <div class="details" style="background-color: #fee2e2;">
        <h3 style="color: #991b1b;">❌ Admission Status: Not Accepted</h3>
        <p><strong>Reference:</strong> ${data.referenceNumber}</p>
      </div>
      ${data.rejectionReason ? `
      <div class="details">
        <h3>Reason for This Decision</h3>
        <p>${data.rejectionReason}</p>
      </div>
      ` : ''}
      <div class="details">
        <h3>📝 Notes</h3>
        <p>• This decision is final for this admissions cycle</p>
        <p>• You may reapply in a future admissions period</p>
        <p>• We encourage you to strengthen your application for next time</p>
      </div>
      <p>We appreciate the effort you put into your application and wish you the best in your educational journey.</p>
      <p>Warm regards,<br><strong>The Admissions Team</strong><br>Queensgate International School</p>
    </div>
    <div class="footer">
      <p><strong>Queensgate International School</strong></p>
      <p>Excellence in Education | Nurturing Future Leaders</p>
      <p><a href="mailto:admissions@qgis.ac.ug">admissions@qgis.ac.ug</a></p>
    </div>
  </div>
</body>
</html>
  `
}

function generateRejectedText(data: EmailPayload): string {
  return `
QUEENSGATE INTERNATIONAL SCHOOL
Application Update

Dear ${data.applicantName},

Thank you for your interest in Queensgate International School. After careful consideration, we regret to inform you that your application was not successful at this time.

APPLICATION REFERENCE: ${data.referenceNumber}
STATUS: Not Accepted

${data.rejectionReason ? `REASON: ${data.rejectionReason}` : ''}

NOTES:
• This decision is final for this admissions cycle
• You may reapply in a future admissions period
• We encourage you to strengthen your application for next time

We wish you the best in your educational journey.
The Admissions Team
  `
}

// ============================================================================
// ADMIN EMAIL TEMPLATES
// ============================================================================

function generateAdminNewApplicationEmail(data: EmailPayload, styles: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Application Received</title>
  ${styles}
</head>
<body>
  <div class="email-container">
    <div class="header" style="background-color: #7c3aed;">
      <h1>📥 New Application</h1>
      <p>Queensgate International School - Admin Notification</p>
    </div>
    <div class="content">
      <h2>Dear Admissions Team,</h2>
      <p>A new application has been submitted and is awaiting review.</p>
      <div class="details" style="background-color: #f3e8ff;">
        <h3 style="color: #7c3aed;">📋 Applicant Details</h3>
        <p><strong>Name:</strong> ${data.applicantName}</p>
        <p><strong>Email:</strong> ${data.to}</p>
        <p><strong>Grade:</strong> Grade ${data.grade || 'N/A'}</p>
        <p><strong>Stream:</strong> ${data.stream || 'N/A'}</p>
        <p><strong>Admission Period:</strong> ${data.admissionPeriod || 'N/A'}</p>
        <p><strong>Reference:</strong> ${data.referenceNumber}</p>
        <p><strong>Payment Status:</strong> ⏳ Pending</p>
      </div>
      <div class="details">
        <h3>📝 Admin Actions</h3>
        <p>• Review the application in the admin dashboard</p>
        <p>• Wait for payment receipt upload from applicant</p>
        <p>• Update application status when ready for review</p>
      </div>
      <p>Log in to the admin dashboard to view the full application.</p>
    </div>
    <div class="footer">
      <p><strong>Queensgate International School</strong></p>
      <p>Admissions Management System</p>
      <p><a href="mailto:admissions@qgis.ac.ug">admissions@qgis.ac.ug</a></p>
    </div>
  </div>
</body>
</html>
  `
}

function generateAdminNewApplicationText(data: EmailPayload): string {
  return `
QUEENSGATE INTERNATIONAL SCHOOL
NEW APPLICATION RECEIVED

Dear Admissions Team,

A new application has been submitted and is awaiting review.

APPLICANT DETAILS:
- Name: ${data.applicantName}
- Email: ${data.to}
- Grade: Grade ${data.grade || 'N/A'}
- Stream: ${data.stream || 'N/A'}
- Admission Period: ${data.admissionPeriod || 'N/A'}
- Reference: ${data.referenceNumber}
- Payment Status: Pending

Please review the application in the admin dashboard.
  `
}

function generateAdminPaymentReceivedEmail(data: EmailPayload, styles: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Received</title>
  ${styles}
</head>
<body>
  <div class="email-container">
    <div class="header" style="background-color: #16a34a;">
      <h1>💰 Payment Received</h1>
      <p>Queensgate International School - Admin Notification</p>
    </div>
    <div class="content">
      <h2>Dear Admissions Team,</h2>
      <p>Payment has been received and verified for the following application.</p>
      <div class="details" style="background-color: #dcfce7;">
        <h3 style="color: #166034;">✅ Payment Confirmed</h3>
        <p><strong>Name:</strong> ${data.applicantName}</p>
        <p><strong>Email:</strong> ${data.to}</p>
        <p><strong>Reference:</strong> ${data.referenceNumber}</p>
        <p><strong>Amount:</strong> $300 USD</p>
        <p><strong>Payment Method:</strong> Bank Transfer</p>
      </div>
      <div class="details">
        <h3>📝 Admin Actions</h3>
        <p>• Payment verification complete</p>
        <p>• Application is ready for review</p>
        <p>• Consider moving application to "Under Review" status</p>
      </div>
      <p>The applicant has been notified via email. Log in to the admin dashboard to continue processing.</p>
    </div>
    <div class="footer">
      <p><strong>Queensgate International School</strong></p>
      <p>Admissions Management System</p>
      <p><a href="mailto:admissions@qgis.ac.ug">admissions@qgis.ac.ug</a></p>
    </div>
  </div>
</body>
</html>
  `
}

function generateAdminPaymentReceivedText(data: EmailPayload): string {
  return `
QUEENSGATE INTERNATIONAL SCHOOL
PAYMENT RECEIVED

Dear Admissions Team,

Payment has been received and verified.

APPLICANT DETAILS:
- Name: ${data.applicantName}
- Email: ${data.to}
- Reference: ${data.referenceNumber}
- Amount: $300 USD
- Payment Method: Bank Transfer

Payment verification complete. Application is ready for review.
  `
}

function generateAdminReviewStatusEmail(data: EmailPayload, styles: string): string {
  const statusColor = data.notes?.includes('Approved') || data.notes?.includes('Accepted') 
    ? '#16a34a' 
    : data.notes?.includes('Rejected') 
    ? '#dc2626' 
    : '#2563eb'
  const statusBg = data.notes?.includes('Approved') || data.notes?.includes('Accepted')
    ? '#dcfce7'
    : data.notes?.includes('Rejected')
    ? '#fee2e2'
    : '#dbeafe'

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Application Status Update</title>
  ${styles}
</head>
<body>
  <div class="email-container">
    <div class="header" style="background-color: ${statusColor};">
      <h1>📋 Status Update</h1>
      <p>Queensgate International School - Admin Notification</p>
    </div>
    <div class="content">
      <h2>Dear Admissions Team,</h2>
      <p>An application status has been updated. The applicant has been notified.</p>
      <div class="details" style="background-color: ${statusBg};">
        <h3 style="color: ${statusColor};">${data.notes || 'Status Updated'}</h3>
        <p><strong>Name:</strong> ${data.applicantName}</p>
        <p><strong>Email:</strong> ${data.to}</p>
        <p><strong>Reference:</strong> ${data.referenceNumber}</p>
      </div>
      <div class="details">
        <h3>📝 Actions Taken</h3>
        <p>• Status changed to: ${data.notes || 'Updated'}</p>
        <p>• Applicant notified via email</p>
        <p>• Application updated in system</p>
      </div>
      <p>Log in to the admin dashboard to continue managing applications.</p>
    </div>
    <div class="footer">
      <p><strong>Queensgate International School</strong></p>
      <p>Admissions Management System</p>
      <p><a href="mailto:admissions@qgis.ac.ug">admissions@qgis.ac.ug</a></p>
    </div>
  </div>
</body>
</html>
  `
}

function generateAdminReviewStatusText(data: EmailPayload): string {
  return `
QUEENSGATE INTERNATIONAL SCHOOL
APPLICATION STATUS UPDATE

Dear Admissions Team,

An application status has been updated. The applicant has been notified.

APPLICANT DETAILS:
- Name: ${data.applicantName}
- Email: ${data.to}
- Reference: ${data.referenceNumber}

STATUS: ${data.notes || 'Updated'}

The applicant has been notified via email.
  `
}

// ============================================================================
// EMAIL SENDING FUNCTION
// ============================================================================

/**
 * Send email via Supabase Edge Function
 */
export async function sendEmail(payload: EmailPayload): Promise<EmailResponse> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('[EmailService] Supabase credentials not configured')
      return { success: false, error: 'Supabase not configured' }
    }

    const endpoint = `${supabaseUrl}/functions/v1/resend-email`

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify({
        to: payload.to,
        subject: payload.subject,
        applicantName: payload.applicantName,
        referenceNumber: payload.referenceNumber,
        grade: payload.grade,
        stream: payload.stream,
        admissionPeriod: payload.admissionPeriod,
        emailType: payload.emailType,
        rejectionReason: payload.rejectionReason,
        notes: payload.notes,
        adminEmail: payload.adminEmail,
        adminName: payload.adminName,
      }),
    })

    if (response.ok) {
      const result = await response.json()
      console.log(`[EmailService] Email sent successfully: ${result.emailId}`)
      return { success: true, emailId: result.emailId }
    } else {
      const errorText = await response.text()
      console.error(`[EmailService] Failed to send email: ${errorText}`)
      return { success: false, error: errorText }
    }
  } catch (error) {
    console.error('[EmailService] Error sending email:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

/**
 * Send application submitted confirmation to user
 */
export async function sendApplicationSubmittedEmail(
  to: string,
  applicantName: string,
  referenceNumber: string,
  grade: string,
  stream: string,
  admissionPeriod: string
): Promise<EmailResponse> {
  return sendEmail({
    to,
    subject: `Application Received - Reference ${referenceNumber}`,
    applicantName,
    referenceNumber,
    grade,
    stream,
    admissionPeriod,
    emailType: 'application_submitted',
  })
}

/**
 * Send payment received confirmation to user
 */
export async function sendPaymentReceivedEmail(
  to: string,
  applicantName: string,
  referenceNumber: string
): Promise<EmailResponse> {
  return sendEmail({
    to,
    subject: `Payment Received - Reference ${referenceNumber}`,
    applicantName,
    referenceNumber,
    emailType: 'payment_received',
  })
}

/**
 * Send application under review notification to user
 */
export async function sendUnderReviewEmail(
  to: string,
  applicantName: string,
  referenceNumber: string
): Promise<EmailResponse> {
  return sendEmail({
    to,
    subject: `Application Now Under Review - Reference ${referenceNumber}`,
    applicantName,
    referenceNumber,
    emailType: 'application_under_review',
  })
}

/**
 * Send application accepted notification to user
 */
export async function sendAcceptedEmail(
  to: string,
  applicantName: string,
  referenceNumber: string
): Promise<EmailResponse> {
  return sendEmail({
    to,
    subject: `Congratulations! Application Accepted - Reference ${referenceNumber}`,
    applicantName,
    referenceNumber,
    emailType: 'application_accepted',
  })
}

/**
 * Send application rejected notification to user
 */
export async function sendRejectedEmail(
  to: string,
  applicantName: string,
  referenceNumber: string,
  rejectionReason?: string
): Promise<EmailResponse> {
  return sendEmail({
    to,
    subject: `Application Update - Reference ${referenceNumber}`,
    applicantName,
    referenceNumber,
    emailType: 'application_rejected',
    rejectionReason,
  })
}

/**
 * Send new application notification to admin
 */
export async function sendAdminNewApplicationEmail(
  adminEmail: string,
  applicantName: string,
  applicantEmail: string,
  referenceNumber: string,
  grade: string,
  stream: string,
  admissionPeriod: string
): Promise<EmailResponse> {
  return sendEmail({
    to: adminEmail,
    subject: `New Application - ${applicantName}`,
    applicantName,
    referenceNumber,
    grade,
    stream,
    admissionPeriod,
    emailType: 'admin_new_application',
    adminEmail,
  })
}

/**
 * Send payment received notification to admin
 */
export async function sendAdminPaymentReceivedEmail(
  adminEmail: string,
  applicantName: string,
  applicantEmail: string,
  referenceNumber: string
): Promise<EmailResponse> {
  return sendEmail({
    to: adminEmail,
    subject: `Payment Received - ${applicantName}`,
    applicantName,
    referenceNumber,
    emailType: 'admin_payment_received',
    adminEmail,
  })
}

/**
 * Send status update notification to admin
 */
export async function sendAdminStatusUpdateEmail(
  adminEmail: string,
  applicantName: string,
  applicantEmail: string,
  referenceNumber: string,
  status: string
): Promise<EmailResponse> {
  return sendEmail({
    to: adminEmail,
    subject: `Status Updated - ${applicantName}`,
    applicantName,
    referenceNumber,
    emailType: 'admin_review_status',
    adminEmail,
    notes: status,
  })
}

/**
 * Send payment approved notification to user (payment approved + application under review)
 */
export async function sendPaymentApprovedEmail(
  to: string,
  applicantName: string,
  referenceNumber: string
): Promise<EmailResponse> {
  return sendEmail({
    to,
    subject: `Payment Approved - Application Under Review - Reference ${referenceNumber}`,
    applicantName,
    referenceNumber,
    emailType: 'payment_approved',
  })
}

