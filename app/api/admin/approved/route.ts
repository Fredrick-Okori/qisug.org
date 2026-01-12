/**
 * Admin Approved Students API Route
 * 
 * Handles listing approved/confirmed/enrolled students
 * Only accessible by authenticated admins
 * 
 * Strategy: Fetch ALL applications first, then filter in JavaScript
 * to ensure we correctly identify approved students
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
  stats?: {
    total: number
    confirmed: number
    enrolled: number
    pending: number
  }
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
    console.error('[APPROVED-API] Supabase environment variables not configured')
    return { authorized: false, error: 'Supabase not configured. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.' }
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
          console.error('[APPROVED-API] Error setting cookie:', error)
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: '', ...options })
        } catch (error) {
          console.error('[APPROVED-API] Error removing cookie:', error)
        }
      },
    },
  })

  try {
    const { data: { session } } = await supabase.auth.getSession()
    console.log('[APPROVED-API] Session check:', session ? 'Session exists' : 'No session')

    if (!session?.user) {
      console.log('[APPROVED-API] No authenticated user session found')
      return { authorized: false, error: 'Authentication required. Please log in first.' }
    }

    console.log('[APPROVED-API] User ID:', session.user.id)
    console.log('[APPROVED-API] User email:', session.user.email)

    // Check if user is an active admin
    const { data: adminUser, error } = await supabase
      .from('admin_users')
      .select('id, role, is_active, email, full_name')
      .eq('user_id', session.user.id)
      .eq('is_active', true)
      .maybeSingle()

    if (error) {
      console.error('[APPROVED-API] Error querying admin_users:', error)
      return { authorized: false, error: 'Database error while checking admin permissions.' }
    }

    if (!adminUser) {
      console.log('[APPROVED-API] User not found in admin_users table or is inactive')
      console.log('[APPROVED-API] User ID to add:', session.user.id)
      return { authorized: false, error: 'Admin access required. Your account is not registered as an admin. Please contact the system administrator.' }
    }

    console.log('[APPROVED-API] Admin verified:', adminUser.email, 'Role:', adminUser.role)
    return { authorized: true, userId: session.user.id }

  } catch (error) {
    console.error('[APPROVED-API] Error verifying admin access:', error)
    return { authorized: false, error: 'Authentication verification failed. Please try logging in again.' }
  }
}

// ============================================================================
// GET: List approved students
// ============================================================================

export async function GET(request: Request) {
  console.log('[APPROVED-API] GET /api/admin/approved - Starting request')
  
  try {
    const cookieStore = await cookies()
    const { searchParams } = new URL(request.url)
    
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = (page - 1) * limit

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error('[APPROVED-API] Supabase environment variables not configured')
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Supabase not configured. Please check environment variables.' },
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

    // Verify admin access first
    console.log('[APPROVED-API] Verifying admin access...')
    const { authorized, error: authError, userId } = await verifyAdminAccess(cookieStore)
    
    if (!authorized) {
      console.log('[APPROVED-API] Admin access denied:', authError)
      return NextResponse.json<ApiResponse>(
        { success: false, error: authError },
        { status: 403 }
      )
    }

    console.log('[APPROVED-API] Admin access granted for user:', userId)

    // Fetch ALL applications - we will filter in JavaScript
    console.log('[APPROVED-API] Fetching ALL applications from database...')
    
    const { data: allApplications, error: fetchError } = await supabase
      .from('applications')
      .select(`
        id,
        applicant_id,
        academic_year,
        intake_month,
        status,
        created_at,
        updated_at,
        submitted_at,
        reviewed_at,
        applicants (
          id,
          qis_id,
          first_name,
          last_name,
          email,
          phone_primary
        ),
        programs (
          id,
          name,
          grade,
          stream
        )
      `)
      .order('created_at', { ascending: false })

    if (fetchError) {
      console.error('[APPROVED-API] Error fetching applications:', fetchError)
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Failed to fetch applications: ' + fetchError.message },
        { status: 500 }
      )
    }

    console.log('[APPROVED-API] Total applications fetched:', allApplications?.length || 0)

    // Log all unique statuses for debugging
    const uniqueStatuses = [...new Set(allApplications?.map((app: any) => app.status) || [])]
    console.log('[APPROVED-API] Unique statuses in database:', uniqueStatuses)

    // Filter in JavaScript to get only approved applications
    // This ensures we correctly identify 'Approved' status regardless of enum issues
    const approvedApplications = allApplications?.filter((app: any) => {
      const status = app.status?.toLowerCase() || ''
      return status === 'approved'
    }) || []

    console.log('[APPROVED-API] Filtered approved applications:', approvedApplications.length)

    // Get statistics for different statuses
    const statusCounts = allApplications?.reduce((acc: Record<string, number>, app: any) => {
      const status = app.status || 'Unknown'
      acc[status] = (acc[status] || 0) + 1
      return acc
    }, {}) || {}

    console.log('[APPROVED-API] Status counts:', statusCounts)

    // Apply pagination to approved applications
    const paginatedApplications = approvedApplications.slice(offset, offset + limit)

    // Transform the data
    const transformedData = paginatedApplications.map((app: any) => {
      const applicant = Array.isArray(app.applicants) ? app.applicants[0] : app.applicants
      const program = Array.isArray(app.programs) ? app.programs[0] : app.programs
      
      // Generate reference from QIS ID or application ID
      const reference = applicant?.qis_id 
        ? applicant.qis_id 
        : `QIS-${(app.academic_year || '2024').split('/')[0]}-${app.id.substring(0, 4).toUpperCase()}`

      // Build full name
      const fullName = applicant 
        ? `${applicant.first_name || ''} ${applicant.last_name || ''}`.trim()
        : 'Unknown Student'

      return {
        id: app.id,
        reference: reference,
        applicant_name: fullName,
        first_name: applicant?.first_name || '',
        last_name: applicant?.last_name || '',
        email: applicant?.email || 'N/A',
        phone: applicant?.phone_primary || 'N/A',
        program: program?.name || 'N/A',
        grade: program?.grade ? `Grade ${program.grade}` : 'N/A',
        grade_raw: program?.grade || null,
        stream: program?.stream || null,
        status: app.status || 'Approved',
        created_at: app.created_at,
        updated_at: app.updated_at,
        submitted_at: app.submitted_at,
        reviewed_at: app.reviewed_at,
        academic_year: app.academic_year,
        intake_month: app.intake_month,
        // Legacy fields for compatibility
        fullName: fullName,
        parentName: 'N/A',
        parent_phone: 'N/A',
      }
    })

    console.log('[APPROVED-API] Transformed data:', transformedData.length, 'students')

    return NextResponse.json<ApiResponse<typeof transformedData>>({
      success: true,
      data: transformedData,
      message: `Successfully fetched ${transformedData.length} approved students`,
      stats: {
        total: approvedApplications.length,
        confirmed: approvedApplications.length,
        enrolled: 0,
        pending: 0
      },
      pagination: {
        page,
        limit,
        total: approvedApplications.length,
        totalPages: Math.ceil(approvedApplications.length / limit)
      }
    })

  } catch (error) {
    console.error('[APPROVED-API] Unexpected error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Internal server error: ' + errorMessage },
      { status: 500 }
    )
  }
}

