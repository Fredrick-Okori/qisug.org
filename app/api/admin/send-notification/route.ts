import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Email types for admin notifications
type NotificationEmailType = 
  | 'application_under_review'
  | 'application_accepted'
  | 'application_rejected'

interface NotificationRequest {
  applicationId: string
  emailType: NotificationEmailType
  rejectionReason?: string
  notes?: string
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    
    // Create Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey || !supabaseServiceKey) {
      return NextResponse.json(
        { success: false, error: 'Supabase not configured' },
        { status: 500 }
      )
    }

    const supabase = createServerClient(
      supabaseUrl,
      supabaseKey,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            try {
              cookieStore.set({ name, value, ...options })
            } catch (error) {
              // Handle cookie errors
            }
          },
          remove(name: string, options: CookieOptions) {
            try {
              cookieStore.set({ name, value: '', ...options })
            } catch (error) {
              // Handle cookie errors
            }
          },
        },
      }
    )

    // Parse request body
    const body: NotificationRequest = await request.json()
    const { applicationId, emailType, rejectionReason, notes } = body

    // Validate required fields
    if (!applicationId || !emailType) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Fetch application data with applicant info
    const { data: application, error: appError } = await supabase
      .from('applications')
      .select(`
        id,
        applicant_id,
        qis_id,
        status,
        program_id,
        applicants (
          id,
          first_name,
          last_name,
          email,
          qis_id
        ),
        programs (
          id,
          name,
          grade,
          stream
        )
      `)
      .eq('id', applicationId)
      .single()

    if (appError || !application) {
      console.error('Error fetching application:', appError)
      return NextResponse.json(
        { success: false, error: 'Application not found' },
        { status: 404 }
      )
    }

    const applicant = Array.isArray(application.applicants) ? application.applicants[0] : application.applicants
    const program = Array.isArray(application.programs) ? application.programs[0] : application.programs

    if (!applicant) {
      return NextResponse.json(
        { success: false, error: 'Applicant not found' },
        { status: 404 }
      )
    }

    const applicantName = `${applicant.first_name} ${applicant.last_name}`
    const referenceNumber = application.qis_id || applicant.qis_id || applicationId
    const applicantEmail = applicant.email

    // Determine subject based on email type
    let subject: string
    switch (emailType) {
      case 'application_under_review':
        subject = `Application Now Under Review - Reference ${referenceNumber}`
        break
      case 'application_accepted':
        subject = `Congratulations! Application Accepted - Reference ${referenceNumber}`
        break
      case 'application_rejected':
        subject = `Application Update - Reference ${referenceNumber}`
        break
      default:
        subject = `Application Update - Reference ${referenceNumber}`
    }

    // Send email to applicant via server-side API
    console.log(`[AdminNotification] Sending ${emailType} email to applicant: ${applicantEmail}`)
    
    const emailResponse = await fetch(`${request.nextUrl.origin}/api/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: applicantEmail,
        subject,
        applicantName,
        referenceNumber,
        grade: program?.grade?.toString() || '',
        stream: program?.stream || '',
        emailType,
        rejectionReason,
        notes: notes || getDefaultNotes(emailType),
      }),
    })

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text()
      console.error('[AdminNotification] Failed to send email:', errorText)
      return NextResponse.json(
        { success: false, error: 'Failed to send email', details: errorText },
        { status: 500 }
      )
    }

    const emailResult = await emailResponse.json()
    console.log('[AdminNotification] Email sent successfully:', emailResult)

    // Update application status if specified
    let statusUpdate = null
    if (emailType === 'application_under_review') {
      const { data: updatedApp, error: updateError } = await supabase
        .from('applications')
        .update({
          status: 'Under Review',
          reviewed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', applicationId)
        .select()
        .single()

      if (updateError) {
        console.error('[AdminNotification] Failed to update status:', updateError)
      } else {
        statusUpdate = updatedApp
        console.log('[AdminNotification] Application status updated to Under Review')
      }
    } else if (emailType === 'application_accepted') {
      const { data: updatedApp, error: updateError } = await supabase
        .from('applications')
        .update({
          status: 'Approved',
          updated_at: new Date().toISOString(),
        })
        .eq('id', applicationId)
        .select()
        .single()

      if (updateError) {
        console.error('[AdminNotification] Failed to update status:', updateError)
      } else {
        statusUpdate = updatedApp
        console.log('[AdminNotification] Application status updated to Approved')
      }
    } else if (emailType === 'application_rejected') {
      const { data: updatedApp, error: updateError } = await supabase
        .from('applications')
        .update({
          status: 'Rejected',
          updated_at: new Date().toISOString(),
        })
        .eq('id', applicationId)
        .select()
        .single()

      if (updateError) {
        console.error('[AdminNotification] Failed to update status:', updateError)
      } else {
        statusUpdate = updatedApp
        console.log('[AdminNotification] Application status updated to Rejected')
      }
    }

    // Send confirmation to admin
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'admissions@qgis.ac.ug'
    
    await fetch(`${request.nextUrl.origin}/api/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: adminEmail,
        subject: `Status Updated - ${applicantName}`,
        applicantName,
        referenceNumber,
        emailType: 'admin_review_status',
        notes: `Status changed to: ${getStatusDisplayName(emailType)}`,
      }),
    })

    return NextResponse.json({
      success: true,
      message: `${emailType} notification sent successfully`,
      data: {
        applicantEmail,
        applicantName,
        referenceNumber,
        emailId: emailResult.emailId,
        statusUpdate,
      },
    })

  } catch (error) {
    console.error('[AdminNotification] Error sending notification:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Get default notes based on email type
 */
function getDefaultNotes(emailType: NotificationEmailType): string {
  switch (emailType) {
    case 'application_under_review':
      return 'Application moved to Under Review status'
    case 'application_accepted':
      return 'Application Approved - Welcome to Queensgate!'
    case 'application_rejected':
      return 'Application was not accepted this time'
    default:
      return 'Application status updated'
  }
}

/**
 * Get display name for status
 */
function getStatusDisplayName(emailType: NotificationEmailType): string {
  switch (emailType) {
    case 'application_under_review':
      return 'Under Review'
    case 'application_accepted':
      return 'Approved'
    case 'application_rejected':
      return 'Rejected'
    default:
      return 'Updated'
  }
}

