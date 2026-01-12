/**
 * Applications API Route
 * 
 * Handles fetching and managing applications for the admin dashboard.
 * Provides comprehensive error handling and configuration validation.
 */

import { createClient, isServerConfigured, getServerConfigStatus, getServerErrorMessage } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { ApplicationStatus, IntakeMonth } from '@/types/database'

// ============================================================================
// TYPES
// ============================================================================

interface ApplicationsResponse {
  success: boolean
  data?: unknown[]
  count?: number
  limit?: number
  offset?: number
  error?: string
  message?: string
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Validate status parameter
 */
function isValidStatus(status: string | null): status is ApplicationStatus {
  if (!status) return true
  const validStatuses = ['Draft', 'Submitted', 'Under Review', 'Interview', 'Accepted', 'Rejected', 'Withdrawn']
  return validStatuses.includes(status)
}

/**
 * Validate intake month parameter
 */
function isValidIntake(intake: string | null): intake is IntakeMonth {
  if (!intake) return true
  const validIntakes = ['September', 'January', 'April']
  return validIntakes.includes(intake)
}

// ============================================================================
// GET: List Applications
// ============================================================================

export async function GET(request: Request) {
  try {
    // Check if Supabase is configured
    if (!isServerConfigured()) {
      const status = getServerConfigStatus()
      console.error('[Applications API] Supabase not configured:', status.error)
      
      return NextResponse.json<ApplicationsResponse>(
        { 
          success: false, 
          error: 'System is not properly configured. Please contact support.',
          message: status.error
        },
        { status: 500 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') as ApplicationStatus | null
    const intakeMonth = searchParams.get('intake') as IntakeMonth | null
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Validate parameters
    if (status && !isValidStatus(status)) {
      return NextResponse.json<ApplicationsResponse>(
        { success: false, error: 'Invalid status parameter' },
        { status: 400 }
      )
    }

    if (intakeMonth && !isValidIntake(intakeMonth)) {
      return NextResponse.json<ApplicationsResponse>(
        { success: false, error: 'Invalid intake month parameter' },
        { status: 400 }
      )
    }

    if (isNaN(limit) || limit < 1 || limit > 100) {
      return NextResponse.json<ApplicationsResponse>(
        { success: false, error: 'Invalid limit parameter (must be 1-100)' },
        { status: 400 }
      )
    }

    if (isNaN(offset) || offset < 0) {
      return NextResponse.json<ApplicationsResponse>(
        { success: false, error: 'Invalid offset parameter (must be >= 0)' },
        { status: 400 }
      )
    }

    // Create Supabase client
    const supabase = await createClient()

    if (!supabase) {
      return NextResponse.json<ApplicationsResponse>(
        { success: false, error: 'Failed to create Supabase client' },
        { status: 500 }
      )
    }

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

    if (search && search.trim()) {
      // Sanitize search term to prevent SQL injection
      const sanitizedSearch = search.trim().replace(/[%_]/g, '')
      if (sanitizedSearch.length > 0) {
        query = query.or(`first_name.ilike.%${sanitizedSearch}%,last_name.ilike.%${sanitizedSearch}%,email.ilike.%${sanitizedSearch}%`)
      }
    }

    // Get total count for pagination
    const { count, error: countError } = await query.count()

    if (countError) {
      console.error('[Applications API] Count error:', countError)
      // Continue without count - not critical
    }

    // Apply pagination and ordering
    const { data: applications, error } = await query
      .range(offset, offset + limit - 1)
      .order('submitted_at', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[Applications API] Fetch error:', error)
      
      // Check if it's a configuration error
      if (error.message.includes('api key') || error.message.includes('Invalid API')) {
        return NextResponse.json<ApplicationsResponse>(
          { success: false, error: 'Configuration error: Invalid or missing API key' },
          { status: 500 }
        )
      }

      // Check if it's a permission error
      if (error.message.includes('permission') || error.message.includes('RLS') || error.message.includes('row level security')) {
        return NextResponse.json<ApplicationsResponse>(
          { success: false, error: 'Permission denied. You do not have access to this data.' },
          { status: 403 }
        )
      }

      // Check if table doesn't exist
      if (error.message.includes('does not exist') || error.message.includes('relation')) {
        return NextResponse.json<ApplicationsResponse>(
          { success: false, error: 'Database table not found. Please run database migrations.' },
          { status: 500 }
        )
      }

      return NextResponse.json<ApplicationsResponse>(
        { success: false, error: 'Failed to fetch applications' },
        { status: 500 }
      )
    }

    return NextResponse.json<ApplicationsResponse>({
      success: true,
      data: applications || [],
      count: count || 0,
      limit,
      offset
    })

  } catch (error) {
    console.error('[Applications API] Unexpected error:', error)
    
    // Check for configuration errors
    if (isServerConfigured() === false || getServerConfigStatus().error) {
      return NextResponse.json<ApplicationsResponse>(
        { success: false, error: 'System configuration error' },
        { status: 500 }
      )
    }

    return NextResponse.json<ApplicationsResponse>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// ============================================================================
// POST: Create Application (placeholder for future use)
// ============================================================================

export async function POST(request: Request) {
  try {
    // Check if Supabase is configured
    if (!isServerConfigured()) {
      const status = getServerConfigStatus()
      return NextResponse.json<ApplicationsResponse>(
        { success: false, error: 'System is not properly configured' },
        { status: 500 }
      )
    }

    // Parse request body
    const body = await request.json()

    // Validate required fields
    if (!body.applicantId || !body.programId) {
      return NextResponse.json<ApplicationsResponse>(
        { success: false, error: 'Missing required fields: applicantId, programId' },
        { status: 400 }
      )
    }

    // Create Supabase client
    const supabase = await createClient()

    if (!supabase) {
      return NextResponse.json<ApplicationsResponse>(
        { success: false, error: 'Failed to create Supabase client' },
        { status: 500 }
      )
    }

    // Create the application
    const { data: application, error } = await supabase
      .from('applications')
      .insert({
        applicant_id: body.applicantId,
        program_id: body.programId,
        academic_year: body.academicYear || '2026/2027',
        intake_month: body.intakeMonth || 'September',
        status: 'Submitted',
        submitted_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('[Applications API] Create error:', error)
      return NextResponse.json<ApplicationsResponse>(
        { success: false, error: getServerErrorMessage(error) },
        { status: 500 }
      )
    }

    return NextResponse.json<ApplicationsResponse>({
      success: true,
      data: [application],
      message: 'Application created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('[Applications API] POST error:', error)
    return NextResponse.json<ApplicationsResponse>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

