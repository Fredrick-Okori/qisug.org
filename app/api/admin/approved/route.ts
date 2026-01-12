import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'all' // approved, confirmed, enrolled, pending
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const cookieStore = await cookies()
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      // Return mock data if Supabase is not configured
      return NextResponse.json({
        success: true,
        data: getMockApprovedStudents(status),
        stats: {
          total: 156,
          confirmed: 45,
          enrolled: 38,
          pending: 73
        },
        pagination: {
          page,
          limit,
          total: 156,
          totalPages: 16
        },
        mock: true
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

    // Build query for approved applications
    let query = supabase
      .from('applications')
      .select('*', { count: 'exact' })
      .eq('status', 'approved')

    if (status !== 'all' && status !== 'approved') {
      query = query.eq('confirmation_status', status)
    }

    const { data: approvedStudents, error, count } = await query
      .order('updated_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    if (error) {
      console.error('Error fetching approved students:', error)
      return NextResponse.json(
        { error: 'Failed to fetch approved students' },
        { status: 500 }
      )
    }

    // Get stats
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

    return NextResponse.json({
      success: true,
      data: approvedStudents || [],
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
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Mock data function for fallback
function getMockApprovedStudents(statusFilter: string) {
  const mockStudents = [
    { id: '1', reference: 'QIS-2024-001', applicant_name: 'John Kamau', email: 'john@example.com', program: 'IB Diploma', grade: 'Grade 11', status: 'approved', confirmation_status: 'confirmed', confirmed_at: '2024-01-16', parent_name: 'James Kamau', phone: '+256 701234567' },
    { id: '2', reference: 'QIS-2024-002', applicant_name: 'Sarah Mukiibi', email: 'sarah@example.com', program: 'A-Level', grade: 'Grade 12', status: 'approved', confirmation_status: 'enrolled', enrolled_at: '2024-01-15', parent_name: 'Robert Mukiibi', phone: '+256 702345678' },
    { id: '3', reference: 'QIS-2024-003', applicant_name: 'Emma Nakiwala', email: 'emma@example.com', program: 'IB Diploma', grade: 'Grade 11', status: 'approved', confirmation_status: 'confirmed', confirmed_at: '2024-01-14', parent_name: 'Thomas Nakiwala', phone: '+256 704567890' },
    { id: '4', reference: 'QIS-2024-004', applicant_name: 'Grace Nakintu', email: 'grace@example.com', program: 'IB Diploma', grade: 'Grade 11', status: 'approved', confirmation_status: null, parent_name: 'Charles Nakintu', phone: '+256 706789012' },
    { id: '5', reference: 'QIS-2024-005', applicant_name: 'Alice Babirye', email: 'alice@example.com', program: 'A-Level', grade: 'Grade 12', status: 'approved', confirmation_status: 'enrolled', enrolled_at: '2024-01-13', parent_name: 'David Babirye', phone: '+256 708901234' },
    { id: '6', reference: 'QIS-2024-006', applicant_name: 'Victoria Nampijja', email: 'victoria@example.com', program: 'IGCSE', grade: 'Grade 10', status: 'approved', confirmation_status: 'pending', parent_name: 'Henry Nampijja', phone: '+256 709012345' },
    { id: '7', reference: 'QIS-2024-007', applicant_name: 'Samuel Kizza', email: 'samuel@example.com', program: 'A-Level', grade: 'Grade 12', status: 'approved', confirmation_status: 'confirmed', confirmed_at: '2024-01-12', parent_name: 'Peter Kizza', phone: '+256 710123456' },
    { id: '8', reference: 'QIS-2024-008', applicant_name: 'Jennifer Nabuke', email: 'jennifer@example.com', program: 'IB Diploma', grade: 'Grade 11', status: 'approved', confirmation_status: null, parent_name: 'John Nabuke', phone: '+256 711234567' },
  ]

  if (statusFilter === 'all') return mockStudents
  if (statusFilter === 'confirmed') return mockStudents.filter(s => s.confirmation_status === 'confirmed')
  if (statusFilter === 'enrolled') return mockStudents.filter(s => s.confirmation_status === 'enrolled')
  if (statusFilter === 'pending') return mockStudents.filter(s => !s.confirmation_status || s.confirmation_status === 'pending')
  
  return mockStudents
}

