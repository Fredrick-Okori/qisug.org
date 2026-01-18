import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

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
}

export async function POST(request: NextRequest) {
  console.log('[SendEmail] === START ===')
  console.log('[SendEmail] Request URL:', request.url)
  
  try {
    // Debug: Log environment variables presence (not values)
    console.log('[SendEmail] Checking environment...')
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    console.log('[SendEmail] NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? `✓ (${supabaseUrl.substring(0, 30)}...)` : '✗ undefined')
    console.log('[SendEmail] SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✓ set' : '✗ undefined')
    
    if (!supabaseUrl) {
      console.error('[SendEmail] ERROR: NEXT_PUBLIC_SUPABASE_URL is not set')
      return NextResponse.json(
        { success: false, error: 'Server configuration error - NEXT_PUBLIC_SUPABASE_URL not set' },
        { status: 500 }
      )
    }
    
    if (!supabaseServiceKey) {
      console.error('[SendEmail] ERROR: SUPABASE_SERVICE_ROLE_KEY is not set')
      return NextResponse.json(
        { success: false, error: 'Server configuration error - SUPABASE_SERVICE_ROLE_KEY not set' },
        { status: 500 }
      )
    }

    // Parse request body
    console.log('[SendEmail] Parsing request body...')
    const body: EmailRequest = await request.json().catch(e => {
      console.error('[SendEmail] Failed to parse body:', e)
      throw new Error('Invalid JSON body')
    })
    
    const { to, subject, applicantName, referenceNumber, grade, stream, admissionPeriod, emailType, rejectionReason, notes } = body

    console.log('[SendEmail] Request data:', { to, applicantName, referenceNumber, emailType })

    // Validate required fields
    if (!to || !applicantName || !referenceNumber) {
      console.error('[SendEmail] Missing required fields')
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Call the Edge Function using service role key
    const edgeFunctionUrl = `${supabaseUrl}/functions/v1/resend-email`
    console.log('[SendEmail] Calling Edge Function:', edgeFunctionUrl)
    
    const response = await fetch(edgeFunctionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseServiceKey}`,
      },
      body: JSON.stringify({
        to,
        subject,
        applicantName,
        referenceNumber,
        grade,
        stream,
        admissionPeriod,
        emailType,
        rejectionReason,
        notes,
      }),
    })

    // Read response
    const responseText = await response.text()
    console.log('[SendEmail] Edge Function Response Status:', response.status)
    console.log('[SendEmail] Edge Function Response Body:', responseText)

    if (!response.ok) {
      console.error('[SendEmail] Edge Function returned error')
      return NextResponse.json(
        { success: false, error: 'Failed to send email', details: responseText },
        { status: response.status }
      )
    }

    // Parse successful response
    let result
    try {
      result = JSON.parse(responseText)
    } catch {
      console.log('[SendEmail] Response is plain text, not JSON')
      result = { message: responseText }
    }
    
    console.log('[SendEmail] Email sent successfully:', result)
    console.log('[SendEmail] === END ===')

    return NextResponse.json({
      success: true,
      ...result,
    })

  } catch (error) {
    console.error('[SendEmail] FATAL ERROR:', error)
    console.error('[SendEmail] Stack:', error instanceof Error ? error.stack : 'no stack')
    console.log('[SendEmail] === END WITH ERROR ===')
    
    return NextResponse.json(
      { success: false, error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

