import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status') || 'all'
    const search = searchParams.get('search') || ''

    const cookieStore = await cookies()
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      // Return mock data if Supabase is not configured
      return NextResponse.json({
        success: true,
        data: getMockApplications(status, search),
        pagination: {
          page,
          limit,
          total: 8,
          totalPages: 1
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

    // Build query
    let query = supabase
      .from('applications')
      .select('*', { count: 'exact' })

    if (status !== 'all') {
      query = query.eq('status', status)
    }

    if (search) {
      query = query.or(`applicant_name.ilike.%${search}%,email.ilike.%${search}%,reference.ilike.%${search}%`)
    }

    const { data: applications, error, count } = await query
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    if (error) {
      console.error('Error fetching applications:', error)
      return NextResponse.json(
        { error: 'Failed to fetch applications' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: applications || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error) {
    console.error('Error in admin applications API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Mock data function for fallback
function getMockApplications(statusFilter: string, search: string) {
  const mockApplications = [
    { id: '1', reference: 'QIS-2024-001', applicant_name: 'John Kamau', email: 'john@example.com', phone: '+256 701234567', program: 'IB Diploma', grade: 'Grade 11', status: 'pending', submitted_at: '2024-01-15', documents_complete: true, payment_status: 'paid' },
    { id: '2', reference: 'QIS-2024-002', applicant_name: 'Sarah Mukiibi', email: 'sarah@example.com', phone: '+256 702345678', program: 'A-Level', grade: 'Grade 12', status: 'approved', submitted_at: '2024-01-14', documents_complete: true, payment_status: 'paid' },
    { id: '3', reference: 'QIS-2024-003', applicant_name: 'Michael Omondi', email: 'michael@example.com', phone: '+256 703456789', program: 'IGCSE', grade: 'Grade 10', status: 'under_review', submitted_at: '2024-01-14', documents_complete: false, payment_status: 'pending' },
    { id: '4', reference: 'QIS-2024-004', applicant_name: 'Emma Nakiwala', email: 'emma@example.com', phone: '+256 704567890', program: 'IB Diploma', grade: 'Grade 11', status: 'rejected', submitted_at: '2024-01-13', documents_complete: true, payment_status: 'paid' },
    { id: '5', reference: 'QIS-2024-005', applicant_name: 'David Ssentamu', email: 'david@example.com', phone: '+256 705678901', program: 'A-Level', grade: 'Grade 12', status: 'pending', submitted_at: '2024-01-13', documents_complete: true, payment_status: 'paid' },
    { id: '6', reference: 'QIS-2024-006', applicant_name: 'Grace Nakintu', email: 'grace@example.com', phone: '+256 706789012', program: 'IB Diploma', grade: 'Grade 11', status: 'approved', submitted_at: '2024-01-12', documents_complete: true, payment_status: 'paid' },
    { id: '7', reference: 'QIS-2024-007', applicant_name: 'Robert Mukasa', email: 'robert@example.com', phone: '+256 707890123', program: 'IGCSE', grade: 'Grade 9', status: 'pending', submitted_at: '2024-01-11', documents_complete: false, payment_status: 'failed' },
    { id: '8', reference: 'QIS-2024-008', applicant_name: 'Alice Babirye', email: 'alice@example.com', phone: '+256 708901234', program: 'A-Level', grade: 'Grade 12', status: 'under_review', submitted_at: '2024-01-10', documents_complete: true, payment_status: 'paid' },
  ]

  let filtered = mockApplications

  if (statusFilter !== 'all') {
    filtered = filtered.filter(app => app.status === statusFilter)
  }

  if (search) {
    const searchLower = search.toLowerCase()
    filtered = filtered.filter(app =>
      app.applicant_name.toLowerCase().includes(searchLower) ||
      app.email.toLowerCase().includes(searchLower) ||
      app.reference.toLowerCase().includes(searchLower)
    )
  }

  return filtered
}

