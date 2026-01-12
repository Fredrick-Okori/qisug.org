/**
 * Admin Dashboard Stats API Route
 * 
 * Returns dashboard statistics - only for authenticated admins
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
// GET: Fetch dashboard statistics
// ============================================================================

export async function GET() {
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

    // Fetch statistics from database using correct schema
    const [
      { count: totalApplications },
      { count: pendingApplications },
      { count: approvedApplications },
      { count: rejectedApplications },
      { count: totalApplicants },
    ] = await Promise.all([
      supabase.from('applications').select('*', { count: 'exact', head: true }),
      supabase.from('applications').select('*', { count: 'exact', head: true }).eq('status', 'Submitted'),
      supabase.from('applications').select('*', { count: 'exact', head: true }).eq('status', 'Accepted'),
      supabase.from('applications').select('*', { count: 'exact', head: true }).eq('status', 'Rejected'),
      supabase.from('applicants').select('*', { count: 'exact', head: true }),
    ])

    // Get new applications this week
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    
    const { count: newThisWeek } = await supabase
      .from('applications')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', oneWeekAgo.toISOString())

    // Fetch documents count
    const { count: documentsUploaded } = await supabase
      .from('application_documents')
      .select('*', { count: 'exact', head: true })

    // Fetch approved documents count
    const { count: approvedDocuments } = await supabase
      .from('application_documents')
      .select('*', { count: 'exact', head: true })
      .eq('is_verified', true)

    // Fetch recent applications with applicant info
    const { data: recentApplicationsRaw } = await supabase
      .from('applications')
      .select(`
        id,
        status,
        created_at,
        applicants (
          first_name,
          last_name,
          email
        ),
        programs (
          name,
          grade
        )
      `)
      .order('created_at', { ascending: false })
      .limit(5)

    // Process recent applications
    const recentApplications = recentApplicationsRaw?.map((app: any) => {
      const applicant = Array.isArray(app.applicants) ? app.applicants[0] : app.applicants
      const program = Array.isArray(app.programs) ? app.programs[0] : app.programs
      
      return {
        id: app.id,
        applicantName: applicant 
          ? `${applicant.first_name || ''} ${applicant.last_name || ''}`.trim() 
          : 'N/A',
        email: applicant?.email || '',
        program: program?.name || 'N/A',
        grade: program?.grade ? `Grade ${program.grade}` : 'N/A',
        status: app.status || 'Submitted',
        submittedAt: app.created_at ? new Date(app.created_at).toISOString().split('T')[0] : '',
      }
    }) || []

    // Fetch applications by status for chart
    const { data: statusDistribution } = await supabase
      .from('applications')
      .select('status')
      .not('status', 'is', null)

    // Process status distribution
    const statusCounts: Record<string, number> = {
      Draft: 0,
      Submitted: 0,
      'Under Review': 0,
      Accepted: 0,
      Rejected: 0,
    }
    
    statusDistribution?.forEach((app: any) => {
      if (app.status) {
        statusCounts[app.status] = (statusCounts[app.status] || 0) + 1
      }
    })

    const applicationsByStatus = [
      { name: 'Accepted', value: statusCounts.Accepted || 0, color: '#22c55e' },
      { name: 'Submitted', value: statusCounts.Submitted || 0, color: '#eab308' },
      { name: 'Under Review', value: statusCounts['Under Review'] || 0, color: '#3b82f6' },
      { name: 'Rejected', value: statusCounts.Rejected || 0, color: '#ef4444' },
      { name: 'Draft', value: statusCounts.Draft || 0, color: '#6b7280' },
    ].filter(item => item.value > 0)

    // Fetch applications by program for chart
    const { data: programDistribution } = await supabase
      .from('applications')
      .select(`
        programs (
          name
        )
      `)
      .not('programs', 'is', null)

    // Process program distribution
    const programCounts: Record<string, number> = {}
    programDistribution?.forEach((app: any) => {
      const program = Array.isArray(app.programs) ? app.programs[0] : app.programs
      if (program?.name) {
        programCounts[program.name] = (programCounts[program.name] || 0) + 1
      }
    })

    const applicationsByProgram = Object.entries(programCounts).map(([name, value], index) => ({
      name,
      value,
      color: ['#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899', '#14b8a6', '#06b6d4'][index % 6],
    }))

    // Generate monthly trend (last 6 months)
    const monthlyTrend = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0)
      
      const { count } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', monthStart.toISOString())
        .lte('created_at', monthEnd.toISOString())

      monthlyTrend.push({
        month: monthStart.toLocaleString('default', { month: 'short' }),
        applications: count || 0,
      })
    }

    // Calculate revenue from payment slips
    const { data: paymentData } = await supabase
      .from('payment_slips')
      .select('amount_paid')
      .eq('is_verified', true)

    const revenue = paymentData?.reduce((sum, p) => sum + (p.amount_paid || 0), 0) || 0

    return NextResponse.json<ApiResponse<any>>({
      success: true,
      data: {
        totalApplications: totalApplications || 0,
        pendingApplications: pendingApplications || 0,
        approvedApplications: approvedApplications || 0,
        rejectedApplications: rejectedApplications || 0,
        totalUsers: totalApplicants || 0,
        newThisWeek: newThisWeek || 0,
        documentsUploaded: documentsUploaded || 0,
        approvedDocuments: approvedDocuments || 0,
        revenue,
        applicationsByStatus,
        applicationsByProgram,
        monthlyTrend,
        recentApplications,
      },
    })

  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

