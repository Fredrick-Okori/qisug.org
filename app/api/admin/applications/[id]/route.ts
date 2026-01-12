/**
 * Admin Single Application API Route
 * 
 * Handles fetching full application details including:
 * - Applicant personal info, address, emergency contact
 * - Academic history
 * - Agent information
 * - Documents
 * - Program/Grade/Stream info
 */

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// ============================================================================
// Types
// ============================================================================

interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Verify that the current user is an admin
 */
async function verifyAdminAccess(
  cookieStore: Awaited<ReturnType<typeof cookies>>
): Promise<{ authorized: boolean; error?: string; userId?: string }> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    return { authorized: false, error: 'Supabase not configured' }
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
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
  })

  try {
    const { data: { session } } = await supabase.auth.getSession()

    if (!session?.user) {
      return { authorized: false, error: 'Authentication required' }
    }

    // Check if user is an active admin
    const { data: adminUser, error } = await supabase
      .from('admin_users')
      .select('role, is_active')
      .eq('user_id', session.user.id)
      .eq('is_active', true)
      .maybeSingle()

    if (error || !adminUser) {
      return { authorized: false, error: 'Admin access required' }
    }

    return { authorized: true, userId: session.user.id }
  } catch (error) {
    console.error('Error verifying admin access:', error)
    return { authorized: false, error: 'Authentication verification failed' }
  }
}

// ============================================================================
// GET: Fetch full application details
// ============================================================================

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies()
    const { id: applicationId } = await params

    // Verify admin access
    const { authorized, error: authError } = await verifyAdminAccess(cookieStore)
    
    if (!authorized) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: authError },
        { status: 403 }
      )
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Supabase not configured' },
        { status: 500 }
      )
    }

    const supabase = createServerClient(supabaseUrl, supabaseKey, {
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
    })

    // Fetch application with all related data
    const { data: application, error: appError } = await supabase
      .from('applications')
      .select(`
        id,
        applicant_id,
        academic_year,
        intake_month,
        status,
        has_agent,
        application_fee_paid,
        payment_reference,
        payment_amount,
        declaration_signed,
        declaration_date,
        submitted_at,
        reviewed_at,
        notes,
        created_at,
        updated_at,
        applicants (
          id,
          qis_id,
          first_name,
          middle_name,
          preferred_name,
          last_name,
          birth_date,
          gender,
          citizenship_type,
          citizenship_country,
          email,
          phone_primary,
          phone_other,
          address_street,
          address_city,
          address_district,
          address_postal_code,
          address_country,
          emergency_contact_name,
          emergency_contact_phone,
          emergency_contact_email,
          created_at,
          updated_at
        ),
        programs (
          id,
          name,
          grade,
          stream,
          description
        ),
        application_documents (
          id,
          document_type,
          file_name,
          file_path,
          file_size,
          mime_type,
          is_verified,
          verified_by,
          verified_at,
          created_at
        ),
        academic_histories (
          id,
          school_name,
          province,
          country,
          start_date,
          end_date,
          grade_completed,
          is_current,
          certificate_url,
          created_at
        ),
        agents (
          id,
          agent_id_number,
          agency_name,
          agent_name,
          address_street,
          address_city,
          address_province,
          address_postal_code,
          address_country,
          phone_primary,
          phone_other,
          email,
          authorized_to_receive_info,
          commission_rate,
          notes,
          created_at
        )
      `)
      .eq('id', applicationId)
      .single()

    if (appError) {
      console.error('Error fetching application:', appError)
      return NextResponse.json<ApiResponse>(
        { success: false, error: appError.message },
        { status: 500 }
      )
    }

    if (!application) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Application not found' },
        { status: 404 }
      )
    }

    // Transform the data for the frontend
    const applicant = Array.isArray(application.applicants) ? application.applicants[0] : application.applicants
    const program = Array.isArray(application.programs) ? application.programs[0] : application.programs
    const documents = Array.isArray(application.application_documents) ? application.application_documents : []
    const academicHistories = Array.isArray(application.academic_histories) ? application.academic_histories : []
    const agents = Array.isArray(application.agents) ? application.agents[0] : application.agents

    // Build full address
    const fullAddress = [
      application.address_street,
      application.address_city,
      application.address_district,
      application.address_postal_code,
      application.address_country
    ].filter(Boolean).join(', ')

    // Transform documents
    const transformedDocs = documents.map((doc: any) => ({
      id: doc.id,
      document_type: doc.document_type,
      file_name: doc.file_name,
      file_path: doc.file_path,
      file_size: doc.file_size,
      mime_type: doc.mime_type,
      is_verified: doc.is_verified,
      verified_by: doc.verified_by,
      verified_at: doc.verified_at,
      uploaded_at: doc.created_at
        ? new Date(doc.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        : ''
    }))

    // Transform academic history
    const transformedAcademicHistory = academicHistories.map((history: any) => ({
      id: history.id,
      school_name: history.school_name,
      province: history.province,
      country: history.country,
      start_date: history.start_date
        ? new Date(history.start_date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short'
          })
        : '',
      end_date: history.end_date
        ? new Date(history.end_date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short'
          })
        : '',
      grade_completed: history.grade_completed,
      is_current: history.is_current,
      certificate_url: history.certificate_url
    }))

    // Payment data
    const paymentData = {
      id: null,
      amount: application.payment_amount || 0,
      status: application.application_fee_paid ? 'completed' : 'pending',
      payment_method: 'Bank Transfer',
      transaction_id: application.payment_reference || 'N/A',
      created_at: application.submitted_at || ''
    }

    const responseData = {
      id: application.id,
      reference: applicant?.qis_id || `APP-${application.id.substring(0, 8).toUpperCase()}`,
      // Application details
      academic_year: application.academic_year,
      intake_month: application.intake_month,
      status: application.status,
      has_agent: application.has_agent,
      submitted_at: application.submitted_at
        ? new Date(application.submitted_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        : '',
      declaration_signed: application.declaration_signed,
      declaration_date: application.declaration_date,
      notes: application.notes,
      // Applicant details
      applicant: {
        id: applicant?.id || '',
        qis_id: applicant?.qis_id || 'N/A',
        first_name: applicant?.first_name || '',
        middle_name: applicant?.middle_name || '',
        preferred_name: applicant?.preferred_name || '',
        last_name: applicant?.last_name || '',
        full_name: `${applicant?.first_name || ''} ${applicant?.middle_name || ''} ${applicant?.last_name || ''}`.trim(),
        birth_date: applicant?.birth_date
          ? new Date(applicant.birth_date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })
          : '',
        gender: applicant?.gender || '',
        citizenship_type: applicant?.citizenship_type || '',
        citizenship_country: applicant?.citizenship_country || '',
        email: applicant?.email || '',
        phone_primary: applicant?.phone_primary || '',
        phone_other: applicant?.phone_other || '',
        address: fullAddress,
        address_street: applicant?.address_street || '',
        address_city: applicant?.address_city || '',
        address_district: applicant?.address_district || '',
        address_postal_code: applicant?.address_postal_code || '',
        address_country: applicant?.address_country || '',
        emergency_contact_name: applicant?.emergency_contact_name || '',
        emergency_contact_phone: applicant?.emergency_contact_phone || '',
        emergency_contact_email: applicant?.emergency_contact_email || ''
      },
      // Program details
      program: {
        id: program?.id || '',
        name: program?.name || 'N/A',
        grade: program?.grade || 'N/A',
        stream: program?.stream || 'N/A',
        description: program?.description || ''
      },
      // Documents
      documents: transformedDocs,
      // Academic history
      academic_history: transformedAcademicHistory,
      // Agent
      agent: agents ? {
        id: agents.id,
        agent_id_number: agents.agent_id_number,
        agency_name: agents.agency_name,
        agent_name: agents.agent_name,
        address: [
          agents.address_street,
          agents.address_city,
          agents.address_province,
          agents.address_postal_code,
          agents.address_country
        ].filter(Boolean).join(', '),
        phone_primary: agents.phone_primary,
        phone_other: agents.phone_other,
        email: agents.email,
        authorized_to_receive_info: agents.authorized_to_receive_info,
        commission_rate: agents.commission_rate,
        notes: agents.notes
      } : null,
      // Payment
      payment: paymentData
    }

    return NextResponse.json<ApiResponse<typeof responseData>>({
      success: true,
      data: responseData
    })

  } catch (error) {
    console.error('Error fetching application details:', error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

