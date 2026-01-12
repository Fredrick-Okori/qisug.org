import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    const cookieStore = await cookies()
    
    // Create server client with cookie handling
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      // Return mock data if Supabase is not configured
      return NextResponse.json({
        success: true,
        data: {
          totalApplications: 156,
          pendingApplications: 42,
          approvedApplications: 89,
          rejectedApplications: 25,
          totalUsers: 312,
          newThisWeek: 18,
          documentsUploaded: 847,
          revenue: 124500,
          applicationsByStatus: [
            { name: 'Approved', value: 89, color: '#22c55e' },
            { name: 'Pending', value: 42, color: '#eab308' },
            { name: 'Rejected', value: 25, color: '#ef4444' },
          ],
          applicationsByProgram: [
            { name: 'IB Diploma', value: 65, color: '#3b82f6' },
            { name: 'A-Level', value: 52, color: '#8b5cf6' },
            { name: 'IGCSE', value: 39, color: '#f59e0b' },
          ],
          monthlyTrend: [
            { month: 'Aug', applications: 23 },
            { month: 'Sep', applications: 45 },
            { month: 'Oct', applications: 67 },
            { month: 'Nov', applications: 89 },
            { month: 'Dec', applications: 45 },
            { month: 'Jan', applications: 78 },
          ],
        },
        mock: true,
      })
    }

    const supabase = (await import('@supabase/ssr')).createServerClient(
      supabaseUrl,
      supabaseKey,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      }
    )

    // Check authentication
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is admin
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('role')
      .eq('user_id', session.user.id)
      .eq('is_active', true)
      .single()

    if (!adminUser) {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      )
    }

    // Fetch statistics from database
    // Note: Adjust table/column names based on your actual schema
    const [
      { count: totalApplications },
      { count: pendingApplications },
      { count: approvedApplications },
      { count: rejectedApplications },
      { count: totalUsers },
    ] = await Promise.all([
      supabase.from('applications').select('*', { count: 'exact', head: true }),
      supabase.from('applications').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('applications').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
      supabase.from('applications').select('*', { count: 'exact', head: true }).eq('status', 'rejected'),
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
    ])

    // Get new applications this week
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    
    const { count: newThisWeek } = await supabase
      .from('applications')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', oneWeekAgo.toISOString())

    // Fetch recent applications
    const { data: recentApplications } = await supabase
      .from('applications')
      .select('id, applicant_name, email, program, grade, status, created_at')
      .order('created_at', { ascending: false })
      .limit(5)

    // Fetch applications by status for chart
    const { data: statusDistribution } = await supabase
      .from('applications')
      .select('status')
      .not('status', 'is', null)

    // Process status distribution
    const statusCounts: Record<string, number> = {
      pending: 0,
      approved: 0,
      rejected: 0,
      under_review: 0,
    }
    
    statusDistribution?.forEach((app: any) => {
      if (app.status) {
        statusCounts[app.status] = (statusCounts[app.status] || 0) + 1
      }
    })

    const applicationsByStatus = [
      { name: 'Approved', value: statusCounts.approved || 0, color: '#22c55e' },
      { name: 'Pending', value: statusCounts.pending || 0, color: '#eab308' },
      { name: 'Under Review', value: statusCounts.under_review || 0, color: '#3b82f6' },
      { name: 'Rejected', value: statusCounts.rejected || 0, color: '#ef4444' },
    ].filter(item => item.value > 0)

    // Fetch applications by program for chart
    const { data: programDistribution } = await supabase
      .from('applications')
      .select('program')
      .not('program', 'is', null)

    // Process program distribution
    const programCounts: Record<string, number> = {}
    programDistribution?.forEach((app: any) => {
      if (app.program) {
        programCounts[app.program] = (programCounts[app.program] || 0) + 1
      }
    })

    const applicationsByProgram = Object.entries(programCounts).map(([name, value], index) => ({
      name,
      value,
      color: ['#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899', '#14b8a6'][index % 5],
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

    return NextResponse.json({
      success: true,
      data: {
        totalApplications: totalApplications || 0,
        pendingApplications: pendingApplications || 0,
        approvedApplications: approvedApplications || 0,
        rejectedApplications: rejectedApplications || 0,
        totalUsers: totalUsers || 0,
        newThisWeek: newThisWeek || 0,
        documentsUploaded: 0, // Would need documents table
        revenue: 0, // Would need payments table
        applicationsByStatus,
        applicationsByProgram,
        monthlyTrend,
        recentApplications: recentApplications?.map((app: any) => ({
          id: app.id,
          applicantName: app.applicant_name || 'Unknown',
          email: app.email || '',
          program: app.program || '',
          grade: app.grade || '',
          status: app.status || 'pending',
          submittedAt: app.created_at ? new Date(app.created_at).toISOString().split('T')[0] : '',
        })) || [],
      },
    })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

