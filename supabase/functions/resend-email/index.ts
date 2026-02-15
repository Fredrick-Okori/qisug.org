// Supabase Edge Function: resend-email
// File: supabase/functions/resend-email/index.ts
// Enhanced version with support for all email notification types

// TypeScript declaration for Deno globals in Supabase Edge Functions
declare const Deno: {
  env: {
    get(name: string): string | undefined
  }
  serve(handler: (req: Request) => Promise<Response>): void
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Email request interface
interface EmailRequest {
  to: string
  subject?: string
  applicantName: string
  referenceNumber: string
  grade?: string
  stream?: string
  admissionPeriod?: string
  emailType: string
  rejectionReason?: string
  notes?: string
  adminEmail?: string
  adminName?: string
  // Contact form specific fields
  userEmail?: string
  userFirstName?: string
  userLastName?: string
  userMessage?: string
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get Resend API key from environment variable
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    
    console.log('=== RESEND EMAIL FUNCTION STARTED ===')
    console.log('RESEND_API_KEY present:', !!RESEND_API_KEY)
    console.log('RESEND_API_KEY value:', RESEND_API_KEY ? `${RESEND_API_KEY.substring(0, 10)}...` : 'NOT SET')
    
    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY not configured')
      return new Response(
        JSON.stringify({ error: 'Email service not configured - RESEND_API_KEY missing in Supabase secrets' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Parse request body
    const requestData: EmailRequest = await req.json()
    
    console.log('Email request received:', JSON.stringify({
      to: requestData.to,
      type: requestData.emailType,
      name: requestData.applicantName,
      reference: requestData.referenceNumber,
      userFirstName: requestData.userFirstName,
      userLastName: requestData.userLastName,
      userEmail: requestData.userEmail
    }))

    // Validate required fields
    if (!requestData.to || !requestData.applicantName || !requestData.referenceNumber) {
      console.error('Missing required fields:', {
        to: requestData.to,
        applicantName: requestData.applicantName,
        referenceNumber: requestData.referenceNumber
      })
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields',
          required: ['to', 'applicantName', 'referenceNumber'],
          received: {
            to: requestData.to,
            applicantName: requestData.applicantName,
            referenceNumber: requestData.referenceNumber
          }
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Generate email HTML and text based on email type
    const emailHtml = generateEmailHtml(requestData)
    const emailText = generateEmailText(requestData)

    // Determine subject line based on email type
    const subject = requestData.subject || getDefaultSubject(requestData)

    console.log(`Sending ${requestData.emailType} email via Resend...`)
    console.log(`To: ${requestData.to}`)
    console.log(`Subject: ${subject}`)

    // Send email via Resend
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'Queensgate International School <onboarding@resend.dev>',
        to: [requestData.to],
        subject: subject,
        html: emailHtml,
        text: emailText
      })
    })

    const responseData = await resendResponse.text()
    console.log('Resend API Response Status:', resendResponse.status)
    console.log('Resend API Response Body:', responseData)

    if (resendResponse.ok) {
      const result = JSON.parse(responseData)
      console.log('Email sent successfully:', result.id)
      console.log('=== RESEND EMAIL FUNCTION COMPLETED ===')
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          emailId: result.id,
          emailType: requestData.emailType,
          message: `${requestData.emailType} email sent successfully to ${requestData.to}`
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    } else {
      console.error('Resend API error:', responseData)
      console.log('=== RESEND EMAIL FUNCTION FAILED ===')
      
      return new Response(
        JSON.stringify({ 
          error: 'Failed to send email via Resend',
          details: responseData,
          status: resendResponse.status
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

  } catch (error) {
    console.error('Edge function error:', error)
    console.log('=== RESEND EMAIL FUNCTION ERROR ===')
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

/**
 * Get default subject line based on email type
 */
function getDefaultSubject(requestData: EmailRequest): string {
  switch (requestData.emailType) {
    case 'application_submitted':
      return `Application Received - Reference ${requestData.referenceNumber}`
    case 'payment_received':
      return `Payment Received - Reference ${requestData.referenceNumber}`
    case 'application_under_review':
      return `Application Now Under Review - Reference ${requestData.referenceNumber}`
    case 'application_accepted':
      return `Congratulations! Application Accepted - Reference ${requestData.referenceNumber}`
    case 'application_rejected':
      return `Application Update - Reference ${requestData.referenceNumber}`
    case 'admin_new_application':
      return `New Application - ${requestData.applicantName}`
    case 'admin_payment_received':
      return `Payment Received - ${requestData.applicantName}`
    case 'admin_review_status':
      return `Status Updated - ${requestData.applicantName}`
    case 'contact_form':
      const userName = `${requestData.userFirstName || ''} ${requestData.userLastName || ''}`.trim()
      return `New Contact Form Submission from ${userName}`
    default:
      return `QIS Notification - ${requestData.referenceNumber}`
  }
}

/**
 * Generate HTML email based on email type
 */
function generateEmailHtml(data: EmailRequest): string {
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
    case 'contact_form':
      return generateContactFormEmail(data, baseStyles)
    default:
      return generateApplicationSubmittedEmail(data, baseStyles)
  }
}

/**
 * Generate plain text email based on email type
 */
function generateEmailText(data: EmailRequest): string {
  switch (data.emailType) {
    case 'application_submitted':
      return generateApplicationSubmittedText(data)
    case 'payment_received':
      return generatePaymentReceivedText(data)
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
    case 'contact_form':
      return generateContactFormText(data)
    default:
      return generateApplicationSubmittedText(data)
  }
}

// ============================================================================
// USER EMAIL TEMPLATES
// ============================================================================

function generateApplicationSubmittedEmail(data: EmailRequest, styles: string): string {
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

function generateApplicationSubmittedText(data: EmailRequest): string {
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

function generatePaymentReceivedEmail(data: EmailRequest, styles: string): string {
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
      <p>Thank you for choosing Queensgate International School!</p>
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

function generatePaymentReceivedText(data: EmailRequest): string {
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

function generateUnderReviewEmail(data: EmailRequest, styles: string): string {
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
      <p>Great news! Your application is now being reviewed by our admissions committee.</p>
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
        <p>• Our admissions committee is carefully reviewing your application</p>
        <p>• The review process typically takes 5-7 business days</p>
        <p>• You will receive another email once a decision has been made</p>
      </div>
      <p>We appreciate your patience!</p>
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

function generateUnderReviewText(data: EmailRequest): string {
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

We appreciate your patience!
The Admissions Team
  `
}

function generateAcceptedEmail(data: EmailRequest, styles: string): string {
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
        <p>1. You will receive an official acceptance letter</p>
        <p>2. Review the enrollment requirements and deadlines</p>
        <p>3. Complete the enrollment process</p>
      </div>
      <p>Welcome to the Queensgate family!</p>
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

function generateAcceptedText(data: EmailRequest): string {
  return `
QUEENSGATE INTERNATIONAL SCHOOL
Congratulations! Application Accepted!

Dear ${data.applicantName},

We are thrilled to inform you that your application has been ACCEPTED!

APPLICATION REFERENCE: ${data.referenceNumber}
STATUS: ACCEPTED

NEXT STEPS:
1. You will receive an official acceptance letter
2. Review the enrollment requirements and deadlines
3. Complete the enrollment process

Welcome to the Queensgate family!
The Admissions Team
  `
}

function generateRejectedEmail(data: EmailRequest, styles: string): string {
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
      </div>
      <p>We wish you the best in your educational journey.</p>
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

function generateRejectedText(data: EmailRequest): string {
  return `
QUEENSGATE INTERNATIONAL SCHOOL
Application Update

Dear ${data.applicantName},

Thank you for your interest in Queensgate International School. After careful consideration, we regret to inform you that your application was not successful at this time.

APPLICATION REFERENCE: ${data.referenceNumber}
STATUS: Not Accepted

${data.rejectionReason ? `REASON: ${data.rejectionReason}` : ''}

We wish you the best in your educational journey.
The Admissions Team
  `
}

// ============================================================================
// ADMIN EMAIL TEMPLATES
// ============================================================================

function generateAdminNewApplicationEmail(data: EmailRequest, styles: string): string {
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
      <p>A new application has been submitted.</p>
      <div class="details" style="background-color: #f3e8ff;">
        <h3 style="color: #7c3aed;">📋 Applicant Details</h3>
        <p><strong>Name:</strong> ${data.applicantName}</p>
        <p><strong>Email:</strong> ${data.to}</p>
        <p><strong>Grade:</strong> Grade ${data.grade || 'N/A'}</p>
        <p><strong>Stream:</strong> ${data.stream || 'N/A'}</p>
        <p><strong>Reference:</strong> ${data.referenceNumber}</p>
      </div>
      <p>Please review the application in the admin dashboard.</p>
    </div>
    <div class="footer">
      <p><strong>Queensgate International School</strong></p>
      <p>Admissions Management System</p>
    </div>
  </div>
</body>
</html>
  `
}

function generateAdminNewApplicationText(data: EmailRequest): string {
  return `
QUEENSGATE INTERNATIONAL SCHOOL
NEW APPLICATION RECEIVED

Dear Admissions Team,

A new application has been submitted.

APPLICANT DETAILS:
- Name: ${data.applicantName}
- Email: ${data.to}
- Grade: Grade ${data.grade || 'N/A'}
- Reference: ${data.referenceNumber}

Please review the application in the admin dashboard.
  `
}

function generateAdminPaymentReceivedEmail(data: EmailRequest, styles: string): string {
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
      <p>Queensgate International School</p>
    </div>
    <div class="content">
      <h2>Dear Admissions Team,</h2>
      <p>Payment has been received and verified.</p>
      <div class="details" style="background-color: #dcfce7;">
        <h3 style="color: #166034;">✅ Payment Confirmed</h3>
        <p><strong>Name:</strong> ${data.applicantName}</p>
        <p><strong>Email:</strong> ${data.to}</p>
        <p><strong>Reference:</strong> ${data.referenceNumber}</p>
        <p><strong>Amount:</strong> $300 USD</p>
      </div>
      <p>Application is ready for review.</p>
    </div>
    <div class="footer">
      <p><strong>Queensgate International School</strong></p>
      <p>Admissions Management System</p>
    </div>
  </div>
</body>
</html>
  `
}

function generateAdminPaymentReceivedText(data: EmailRequest): string {
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

Application is ready for review.
  `
}

function generateAdminReviewStatusEmail(data: EmailRequest, styles: string): string {
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
      <p>Queensgate International School</p>
    </div>
    <div class="content">
      <h2>Dear Admissions Team,</h2>
      <p>An application status has been updated.</p>
      <div class="details" style="background-color: ${statusBg};">
        <h3 style="color: ${statusColor};">${data.notes || 'Status Updated'}</h3>
        <p><strong>Name:</strong> ${data.applicantName}</p>
        <p><strong>Email:</strong> ${data.to}</p>
        <p><strong>Reference:</strong> ${data.referenceNumber}</p>
      </div>
    </div>
    <div class="footer">
      <p><strong>Queensgate International School</strong></p>
      <p>Admissions Management System</p>
    </div>
  </div>
</body>
</html>
  `
}

function generateAdminReviewStatusText(data: EmailRequest): string {
  return `
QUEENSGATE INTERNATIONAL SCHOOL
APPLICATION STATUS UPDATE

Dear Admissions Team,

An application status has been updated.

APPLICANT DETAILS:
- Name: ${data.applicantName}
- Email: ${data.to}
- Reference: ${data.referenceNumber}

STATUS: ${data.notes || 'Updated'}
  `
}

// ============================================================================
// CONTACT FORM EMAIL TEMPLATES
// ============================================================================

function generateContactFormEmail(data: EmailRequest, styles: string): string {
  const userName = `${data.userFirstName || ''} ${data.userLastName || ''}`.trim()
  const userEmail = data.userEmail || 'N/A'
  const userMessage = data.userMessage || 'No message provided'
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Form Submission</title>
  ${styles}
</head>
<body>
  <div class="email-container">
    <div class="header" style="background-color: #7c3aed;">
      <h1>📬 New Contact Form Submission</h1>
      <p>Queensgate International School - Website Contact</p>
    </div>
    <div class="content">
      <h2>Hello Admissions Team,</h2>
      <p>A new contact form submission has been received from the school website.</p>
      <div class="details" style="background-color: #f3e8ff;">
        <h3 style="color: #7c3aed;">👤 Sender Information</h3>
        <p><strong>Name:</strong> ${userName}</p>
        <p><strong>Email:</strong> <a href="mailto:${userEmail}">${userEmail}</a></p>
      </div>
      <div class="details">
        <h3>📝 Message</h3>
        <p style="white-space: pre-wrap; line-height: 1.8;">${userMessage}</p>
      </div>
      <div class="details" style="background-color: #fff9e6;">
        <h3>📧 How to Reply</h3>
        <p>Simply reply to this email at <strong>${userEmail}</strong> to respond to this inquiry.</p>
      </div>
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

function generateContactFormText(data: EmailRequest): string {
  const userName = `${data.userFirstName || ''} ${data.userLastName || ''}`.trim()
  const userEmail = data.userEmail || 'N/A'
  const userMessage = data.userMessage || 'No message provided'
  
  return `
QUEENSGATE INTERNATIONAL SCHOOL
NEW CONTACT FORM SUBMISSION

Hello Admissions Team,

A new contact form submission has been received from the school website.

SENDER INFORMATION:
- Name: ${userName}
- Email: ${userEmail}

MESSAGE:
${userMessage}

---
To reply to this inquiry, simply email: ${userEmail}
  `
}

