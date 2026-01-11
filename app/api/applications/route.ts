import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { ApplicationStatus, IntakeMonth } from '@/types/database'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') as ApplicationStatus | null
    const intakeMonth = searchParams.get('intake') as IntakeMonth | null
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const supabase = await createClient()

    // Build base query
    let query = supabase
      .from('application_dashboard')
      .select('*', { count: 'exact' })

    // Apply filters
    if (status) {
      query = query.eq('status', status)
    }
    
    if (intakeMonth) {
      query = query.eq('intake_month', intakeMonth)
    }

    if (search) {
      query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%`)
    }

    // Get total count for pagination
    const { count, error: countError } = await query.count()

    if (countError) {
      console.error('Error counting applications:', countError)
    }

    // Apply pagination and ordering
    const { data: applications, error } = await query
      .range(offset, offset + limit - 1)
      .order('submitted_at', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching applications:', error)
      return NextResponse.json(
        { error: 'Failed to fetch applications' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      data: applications || [],
      count: count || 0,
      limit,
      offset
    })
  } catch (error) {
    console.error('Error in applications API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

