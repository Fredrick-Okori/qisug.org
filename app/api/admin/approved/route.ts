/**
 * Admin Approved Students API Route
 * 
 * Handles listing approved/confirmed/enrolled students
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
): Promise<{ authorized: boolean; error?: string }> {
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

    return { authorized: true }
  } catch (error) {
    console.error('Error verifying admin access:', error)
    return { authorized: false, error: 'Authentication verification failed' }
  }
}

// ============================================================================
// GET: List approved students
// ============================================================================

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies()
    const { searchParams } = new URL(request.url)
    
    const status = searchParams.get('status') || 'all' // approved, confirmed, enrolled, pending
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

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

    // Build query for approved applications
    let query = supabase
      .from('applications')
      .select(`
        id,
        applicant_id,
        academic_year,
        intake_month,
        status,
        confirmation_status,
        confirmed_at,
        enrolled_at,
        created_at,
        updated_at,
        applicants (
          id,
          full_name,
          email,
          phone_number,
          parent_name
        ),
        programs (
          id,
          name,
          grade_level
        )
      `, { count: 'exact' })
      .eq('status', 'approved')

    // Apply status filter
    if (status !== 'all' && status !== 'approved') {
      if (status === 'pending') {
        query = query.is('confirmation_status', null)
      } else {
        query = query.eq('confirmation_status', status)
      }
    }

    // Get data with pagination
    const { data: approvedStudents, error, count } = await query
      .order('updated_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Error fetching approved students:', error)
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Failed to fetch approved students' },
        { status: 500 }
      )
    }

    // Get stats counts
    const { count: confirmedCount } = await supabase
      .from('applications')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'approved')
      .eq('confirmation_status', 'confirmed')

    const { count: enrolledCount } = await supabase
      .from('applications')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'approved')
      .eq('confirmation_status', 'enrolled')

    const { count: pendingCount } = await supabase
      .from('applications')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'approved')
      .is('confirmation_status', null)

    // Transform the data
    const transformedData = approvedStudents?.map((app: any) => {
      const applicant = Array.isArray(app.applicants) ? app.applicants[0] : app.applicants
      const program = Array.isArray(app.programs) ? app.programs[0] : app.programs
      const reference = `QIS-${app.academic_year || '2024'}-${app.id.substring(0, 3).toUpperCase()}`

      return {
        id: app.id,
        reference: reference,
        applicant_name: applicant?.full_name || 'N/A',
        email: applicant?.email || 'N/A',
        program: program?.name || 'N/A',
        grade: program?.grade_level || 'N/A',
        status: app.status || 'approved',
        confirmation_status: app.confirmation_status || null,
        confirmed_at: app.confirmation_status === 'confirmed' ? app.confirmed_at : null,
        enrolled_at: app.confirmation_status === 'enrolled' ? app.enrolled_at : null,
        parent_name: applicant?.parent_name || 'N/A',
        phone: applicant?.phone_number || 'N/A',
      }
    }) || []

    return NextResponse.json<ApiResponse<typeof transformedData>>({
      success: true,
      data: transformedData,
      stats: {
        total: count || 0,
        confirmed: confirmedCount || 0,
        enrolled: enrolledCount || 0,
        pending: pendingCount || 0
      },
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })

  } catch (error) {
    console.error('Error in admin approved API:', error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

