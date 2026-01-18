/**
 * Admin Classes API Route
 * 
 * Handles fetching and updating class/program assignments for approved applicants
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
}

interface ClassInfo {
  id: string
  name: string
  grade: number
  stream: string
  capacity: number
  applicantCount: number
  capacityPercentage: number;
}

interface ApplicantInfo {
  id: string
  application_id: string
  first_name: string
  last_name: string
  email: string
  phone_primary: string
  qis_id: string | null
  program_id: string
  program_name: string
  grade: number
  stream: string
}

interface ClassApplicantsResponse {
  classes: ClassInfo[]
  applicants: ApplicantInfo[]
  programs: {
    id: string
    name: string
    grade: number
    stream: string
  }[]
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
// GET: Fetch all classes and approved applicants
// ============================================================================

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies()
    
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

    // Fetch all programs
    const { data: programs, error: programsError } = await supabase
      .from('programs')
      .select('id, name, grade, stream, capacity')
      .eq('is_active', true)
      .order('grade', { ascending: true })
      .order('stream', { ascending: true })

    if (programsError) {
      console.error('Error fetching programs:', programsError)
      return NextResponse.json<ApiResponse>(
        { success: false, error: programsError.message },
        { status: 500 }
      )
    }

    // Fetch approved applicants with their program details
    const { data: applications, error: appsError } = await supabase
      .from('applications')
      .select(`
        id,
        applicant_id,
        program_id,
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
      .eq('status', 'Approved')

    if (appsError) {
      console.error('Error fetching applications:', appsError)
      return NextResponse.json<ApiResponse>(
        { success: false, error: appsError.message },
        { status: 500 }
      )
    }

    // Transform applications into applicant info
    const applicants: ApplicantInfo[] = (applications || []).map((app: any) => {
      const applicant = Array.isArray(app.applicants) ? app.applicants[0] : app.applicants
      const program = Array.isArray(app.programs) ? app.programs[0] : app.programs
      
      return {
        id: applicant?.id || '',
        application_id: app.id,
        first_name: applicant?.first_name || '',
        last_name: applicant?.last_name || '',
        email: applicant?.email || '',
        phone_primary: applicant?.phone_primary || '',
        qis_id: applicant?.qis_id || null,
        program_id: app.program_id,
        program_name: program?.name || 'N/A',
        grade: program?.grade || 0,
        stream: program?.stream || 'N/A'
      }
    })

    // Calculate class statistics
    const classMap = new Map<string, ClassInfo>()
    
    // Initialize class info from programs
    programs?.forEach((prog: any) => {
      const key = `${prog.grade}-${prog.stream}`
      classMap.set(key, {
        id: prog.id,
        name: prog.name,
        grade: prog.grade,
        stream: prog.stream,
        capacity: prog.capacity || 30, // Use capacity from DB or default
        applicantCount: 0,
        capacityPercentage: 0 // Will be calculated after counting applicants
      })
    })

    // Count applicants per class
    applicants.forEach((app: ApplicantInfo) => {
      const key = `${app.grade}-${app.stream}`
      const classInfo = classMap.get(key)
      if (classInfo) {
        classInfo.applicantCount += 1
      }
    })

    // Convert map to array and calculate capacity utilization
    const classes: ClassInfo[] = Array.from(classMap.values()).map(cls => ({
      ...cls,
      capacity: cls.capacity,
      capacityPercentage: cls.capacity > 0 ? Math.round((cls.applicantCount / cls.capacity) * 100) : 0
    }))

    // Sort by grade then stream
    classes.sort((a, b) => {
      if (a.grade !== b.grade) return a.grade - b.grade
      return a.stream.localeCompare(b.stream)
    })

    return NextResponse.json<ApiResponse<ClassApplicantsResponse>>({
      success: true,
      data: {
        classes,
        applicants,
        programs: programs || []
      }
    })

  } catch (error) {
    console.error('Error fetching classes data:', error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// ============================================================================
// PATCH: Update applicant's program assignment
// ============================================================================

export async function PATCH(request: Request) {
  try {
    const cookieStore = await cookies()
    const body = await request.json()
    const { applicationId, newProgramId, programId, newCapacity } = body

    // Verify admin access
    const { authorized, error: authError } = await verifyAdminAccess(cookieStore)
    
    if (!authorized) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: authError },
        { status: 403 }
      )
    }

    // Differentiate between reassigning an applicant and updating capacity
    const isReassigning = applicationId && newProgramId
    const isUpdatingCapacity = programId && newCapacity !== undefined

    if (!isReassigning && !isUpdatingCapacity) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Missing required fields for the requested action.' },
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

    if (isReassigning) {
      // Update the application with new program
      const { data, error } = await supabase
        .from('applications')
        .update({
          program_id: newProgramId,
          updated_at: new Date().toISOString()
        })
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
        message: 'Applicant program assignment updated successfully'
      })
    } else if (isUpdatingCapacity) {
      // Update the program capacity
      const { data, error } = await supabase
        .from('programs')
        .update({ 
          capacity: newCapacity,
          updated_at: new Date().toISOString()
        })
        .eq('id', programId)
        .select()
        .single()

      if (error) {
        console.error('Error updating program capacity:', error)
        return NextResponse.json<ApiResponse>(
          { success: false, error: error.message },
          { status: 500 }
        )
      }

      return NextResponse.json<ApiResponse<typeof data>>({
        success: true,
        data,
        message: 'Class capacity updated successfully'
      })
    }

  } catch (error) {
    console.error('Error updating application:', error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
