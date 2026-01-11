// Supabase Edge Function: resend-email
// File: supabase/functions/resend-email/index.ts
// FIXED VERSION WITH CORS SUPPORT

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

// CORS headers - THIS IS CRITICAL
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailRequest {
  to: string
  subject?: string
  applicantName: string
  referenceNumber: string
  grade: string
  stream: string
  admissionPeriod: string
}

serve(async (req) => {
  // Handle CORS preflight requests - THIS IS CRITICAL
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get Resend API key from environment
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    
    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY not configured')
      return new Response(
        JSON.stringify({ error: 'Email service not configured' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Parse request body
    const requestData: EmailRequest = await req.json()
    
    console.log('Email request received:', {
      to: requestData.to,
      name: requestData.applicantName,
      reference: requestData.referenceNumber
    })

    // Validate required fields
    if (!requestData.to || !requestData.applicantName || !requestData.referenceNumber) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields',
          required: ['to', 'applicantName', 'referenceNumber']
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Generate email HTML
    const emailHtml = generateConfirmationEmail(requestData)
    const emailText = generateConfirmationEmailText(requestData)

    // Send email via Resend
    console.log('Sending email via Resend...')
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'Queensgate International School <admissions@qgis.ac.ug>',
        to: [requestData.to],
        subject: requestData.subject || `Application Received - Reference ${requestData.referenceNumber}`,
        html: emailHtml,
        text: emailText
      })
    })

    if (resendResponse.ok) {
      const result = await resendResponse.json()
      console.log('Email sent successfully:', result.id)
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          emailId: result.id,
          message: 'Confirmation email sent successfully'
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    } else {
      const errorText = await resendResponse.text()
      console.error('Resend API error:', errorText)
      
      return new Response(
        JSON.stringify({ 
          error: 'Failed to send email via Resend',
          details: errorText
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

  } catch (error) {
    console.error('Edge function error:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

/**
 * Generate HTML email template
 */
function generateConfirmationEmail(data: EmailRequest): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Application Confirmation</title>
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
    .header h1 {
      margin: 0;
      font-size: 28px;
    }
    .header p {
      margin: 10px 0 0 0;
      opacity: 0.9;
    }
    .content {
      padding: 30px;
    }
    .content h2 {
      color: #053f52;
      margin-top: 0;
    }
    .reference-box {
      background-color: #EFBF04;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
      margin: 20px 0;
    }
    .reference-box .label {
      font-size: 14px;
      color: #053f52;
      margin-bottom: 5px;
      font-weight: 600;
    }
    .reference-box .number {
      font-size: 32px;
      font-weight: bold;
      color: #053f52;
      font-family: 'Courier New', monospace;
      letter-spacing: 2px;
      margin: 10px 0;
    }
    .details {
      background-color: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .details h3 {
      color: #053f52;
      margin-top: 0;
    }
    .bank-details {
      background-color: #fff9e6;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
      border: 2px solid #EFBF04;
    }
    .bank-details h3 {
      color: #053f52;
      margin-top: 0;
    }
    .bank-details p {
      margin: 8px 0;
    }
    .footer {
      background-color: #053f52;
      color: white;
      padding: 20px;
      text-align: center;
    }
    .footer p {
      margin: 5px 0;
      font-size: 14px;
    }
    .footer a {
      color: #EFBF04;
      text-decoration: none;
    }
  </style>
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
        <p><strong>Grade:</strong> Grade ${data.grade}</p>
        <p><strong>Stream:</strong> ${data.stream}</p>
        <p><strong>Admission Period:</strong> ${data.admissionPeriod}</p>
        <p><strong>Reference:</strong> ${data.referenceNumber}</p>
      </div>
      
      <div class="bank-details">
        <h3>💳 Bank Payment Instructions</h3>
        <p><strong>Bank:</strong> I&M Bank (Uganda) Limited</p>
        <p><strong>Account Name:</strong> Queensgate International School</p>
        <p><strong>Account Number (UGX):</strong> 5076029001</p>
        <p><strong>Account Number (USD):</strong> 5076029002</p>
        <p><strong>Amount:</strong> $300 USD</p>
        <p><strong>Reference:</strong> ${data.referenceNumber}</p>
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

/**
 * Generate plain text email version
 */
function generateConfirmationEmailText(data: EmailRequest): string {
  return `
QUEENSGATE INTERNATIONAL SCHOOL
Application Received Successfully

Dear ${data.applicantName},

Thank you for submitting your application to Queensgate International School.

YOUR APPLICATION REFERENCE NUMBER: ${data.referenceNumber}

APPLICATION SUMMARY:
- Name: ${data.applicantName}
- Grade: Grade ${data.grade}
- Stream: ${data.stream}
- Admission Period: ${data.admissionPeriod}

BANK PAYMENT INSTRUCTIONS:
Bank: I&M Bank (Uganda) Limited
Account Name: Queensgate International School
Account Number (UGX): 5076029001
Account Number (USD): 5076029002
Amount: $300 USD
Reference: ${data.referenceNumber}

Warm regards,
The Admissions Team
Queensgate International School
  `
}