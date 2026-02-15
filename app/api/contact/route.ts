// Contact form API route
// Handles contact form submissions and sends emails to admissions using Resend

import { NextRequest, NextResponse } from 'next/server'

interface ContactFormData {
  firstName: string
  lastName: string
  email: string
  subject: string
  message: string
}

export async function POST(request: NextRequest) {
  console.log('[ContactAPI] === START ===')
  
  try {
    // Get Resend API key
    const RESEND_API_KEY = process.env.RESEND_API_KEY
    
    console.log('[ContactAPI] RESEND_API_KEY:', RESEND_API_KEY ? '✓ set' : '✗ undefined')
    
    if (!RESEND_API_KEY) {
      console.error('[ContactAPI] ERROR: RESEND_API_KEY is not set')
      return NextResponse.json(
        { success: false, error: 'Email service not configured. Please contact the administrator.' },
        { status: 500 }
      )
    }

    // Parse request body
    console.log('[ContactAPI] Parsing request body...')
    const body: ContactFormData = await request.json().catch(e => {
      console.error('[ContactAPI] Failed to parse body:', e)
      throw new Error('Invalid JSON body')
    })
    
    const { firstName, lastName, email, subject, message } = body

    console.log('[ContactAPI] Form data received:', { firstName, lastName, email, subject, messageLength: message?.length })

    // Validate required fields
    if (!firstName || !lastName || !email || !subject || !message) {
      console.error('[ContactAPI] Missing required fields')
      return NextResponse.json(
        { success: false, error: 'Missing required fields: firstName, lastName, email, subject, and message are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.error('[ContactAPI] Invalid email format')
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      )
    }

    const fullName = `${firstName} ${lastName}`
    
    console.log('[ContactAPI] Sending email to admissions@qgis.ac.ug...')
    
    // Send plain text email - subject as subject line, message as body
    // Using verified domain for sender, user's email in reply_to for direct response
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: `${fullName} via QIS <admissions@qgis.ac.ug>`,
        to: ['admissions@qgis.ac.ug'],
        subject: subject,
        text: `From: ${fullName} (${email})\n\n${message}`,
        reply_to: email, // Allow replying directly to the user
      })
    })

    const responseData = await resendResponse.json()
    console.log('[ContactAPI] Resend Response Status:', resendResponse.status)
    console.log('[ContactAPI] Resend Response:', JSON.stringify(responseData))

    if (!resendResponse.ok) {
      console.error('[ContactAPI] Resend API error:', responseData)
      return NextResponse.json(
        { success: false, error: 'Failed to send email', details: responseData.message || 'Unknown error' },
        { status: resendResponse.status }
      )
    }

    console.log('[ContactAPI] Email sent successfully:', responseData.id)
    console.log('[ContactAPI] === END ===')

    return NextResponse.json({
      success: true,
      message: 'Thank you! Your message has been sent to our admissions team. We will get back to you soon.',
      emailId: responseData.id,
    })

  } catch (error) {
    console.error('[ContactAPI] FATAL ERROR:', error)
    console.log('[ContactAPI] === END WITH ERROR ===')
    
    return NextResponse.json(
      { success: false, error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

