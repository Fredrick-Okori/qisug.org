/**
 * Admin Applications API Route
 * 
 * Handles listing and managing applications
 * Only accessible by authenticated admins
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
  message?: string
  total?: number
  page?: number
  limit?: number
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
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
// GET: List all applications
// ============================================================================

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies()
    const { searchParams } = new URL(request.url)
    
    const status = searchParams.get('status')

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

    // Build the query using the correct schema
    let query = supabase
      .from('applications')
      .select(`
        id,
        applicant_id,
        academic_year,
        intake_month,
        status,
        application_fee_paid,
        payment_reference,
        payment_amount,
        submitted_at,
        reviewed_at,
        created_at,
        updated_at,
        applicants (
          id,
          qis_id,
          first_name,
          last_name,
          email,
          phone_primary,
          birth_date,
          citizenship_type
        ),
        programs (
          id,
          name,
          grade,
          stream
        ),
        application_documents (
          id,
          document_type,
          file_name,
          is_verified,
          verified_at,
          created_at
        )
      `)
      .order('created_at', { ascending: false })

    // Filter by status if provided and not 'all'
    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    // Get all applications (no pagination limits on database query)
    const { data, error } = await query

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json<ApiResponse>(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

      // Transform the data to match the frontend interface
    const transformedData = data?.map((app: any) => {
      const applicant = Array.isArray(app.applicants) ? app.applicants[0] : app.applicants
      const program = Array.isArray(app.programs) ? app.programs[0] : app.programs
      const documents = Array.isArray(app.application_documents) ? app.application_documents : []
      
      const fullName = applicant 
        ? `${applicant.first_name || ''} ${applicant.last_name || ''}`.trim()
        : 'N/A'

      // Use QIS ID as reference, or generate one if not set
      const reference = applicant?.qis_id || `APP-${app.id.substring(0, 8).toUpperCase()}`

      // Transform documents
      const transformedDocs = documents.map((doc: any) => ({
        id: doc.id,
        application_id: app.id,
        file_name: doc.file_name,
        file_type: doc.document_type,
        status: doc.is_verified ? 'approved' : 'pending',
        uploaded_at: doc.created_at 
          ? new Date(doc.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })
          : ''
      }))

      // Payment data from application table
      const paymentData = {
        id: null,
        amount: app.payment_amount || 0,
        status: app.application_fee_paid ? 'completed' : 'pending',
        payment_method: 'Bank Transfer',
        transaction_id: app.payment_reference || 'N/A',
        created_at: '',
        receipt_url: null
      }

      return {
        id: app.id,
        reference: reference,
        applicant_name: fullName,
        email: applicant?.email || 'N/A',
        phone: applicant?.phone_primary || 'N/A',
        program: program?.name || 'N/A',
        grade: `Grade ${program?.grade || 'N/A'}`,
        status: app.status || 'Submitted',
        submitted_at: app.submitted_at
          ? new Date(app.submitted_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })
          : '',
        last_updated: app.updated_at
          ? new Date(app.updated_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })
          : '',
        payment_status: app.application_fee_paid ? 'completed' : 'pending',
        payment: paymentData,
        documents: transformedDocs
      }
    }) || []

    return NextResponse.json<ApiResponse<typeof transformedData>>({
      success: true,
      data: transformedData,
      total: transformedData.length
    })

  } catch (error) {
    console.error('Error fetching applications:', error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// ============================================================================
// PATCH: Update application status
// ============================================================================

export async function PATCH(request: Request) {
  try {
    const cookieStore = await cookies()
    const body = await request.json()
    const { applicationId, status, paymentReference } = body

    // Verify admin access
    const { authorized, error: authError } = await verifyAdminAccess(cookieStore)
    
    if (!authorized) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: authError },
        { status: 403 }
      )
    }

    if (!applicationId) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Missing required field: applicationId' },
        { status: 400 }
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

    // Build update object
    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString()
    }

    // Only update status if provided
    if (status) {
      updateData.status = status
      updateData.reviewed_by = (await verifyAdminAccess(cookieStore)).userId
      updateData.reviewed_at = new Date().toISOString()
    }

    // Only update payment_reference if provided
    if (paymentReference !== undefined) {
      updateData.payment_reference = paymentReference
    }

    const { data, error } = await supabase
      .from('applications')
      .update(updateData)
      .eq('id', applicationId)
      .select()
      .single()

    if (error) {
      console.error('Error updating application:', error)
      return NextResponse.json<ApiResponse>(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json<ApiResponse<typeof data>>({
      success: true,
      data,
      message: status ? 'Application status updated successfully' : 'Payment reference updated successfully'
    })

  } catch (error) {
    console.error('Error updating application:', error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

