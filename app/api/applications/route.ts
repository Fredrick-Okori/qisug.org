import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// Mock data for when Supabase is not configured
const MOCK_APPLICATIONS = [
  {
    id: '1',
    reference: 'APP-8F7A2B1C',
    applicant_name: 'John Kamau',
    email: 'john.kamau@email.com',
    phone: '+256 701234567',
    program: 'IB Diploma',
    grade: 'Grade 11',
    status: 'pending',
    submitted_at: 'Jan 15, 2024',
    last_updated: 'Jan 15, 2024',
    payment_status: 'paid',
    payment: {
      id: 'pay_1',
      amount: 300,
      status: 'completed',
      payment_method: 'Bank Transfer',
      transaction_id: 'TXN-001234',
      receipt_url: '#',
      created_at: 'Jan 14, 2024',
    },
    documents: [
      { application_id: '1', file_name: 'passport.pdf', file_type: 'passport', status: 'approved', uploaded_at: 'Jan 14, 2024' },
      { application_id: '1', file_name: 'transcript.pdf', file_type: 'transcript', status: 'pending', uploaded_at: 'Jan 14, 2024' },
    ],
  },
  {
    id: '2',
    reference: 'APP-3D4E5F6A',
    applicant_name: 'Sarah Mukiibi',
    email: 'sarah.mukiibi@email.com',
    phone: '+256 702345678',
    program: 'A-Level',
    grade: 'Grade 12',
    status: 'approved',
    submitted_at: 'Jan 14, 2024',
    last_updated: 'Jan 16, 2024',
    payment_status: 'paid',
    payment: {
      id: 'pay_2',
      amount: 300,
      status: 'completed',
      payment_method: 'Bank Transfer',
      transaction_id: 'TXN-001235',
      receipt_url: '#',
      created_at: 'Jan 13, 2024',
    },
    documents: [
      { application_id: '2', file_name: 'passport.pdf', file_type: 'passport', status: 'approved', uploaded_at: 'Jan 13, 2024' },
    ],
  },
  {
    id: '3',
    reference: 'APP-7B8C9D0E',
    applicant_name: 'Michael Omondi',
    email: 'michael.omondi@email.com',
    phone: '+256 703456789',
    program: 'IGCSE',
    grade: 'Grade 10',
    status: 'under_review',
    submitted_at: 'Jan 14, 2024',
    last_updated: 'Jan 15, 2024',
    payment_status: 'paid',
    payment: {
      id: 'pay_3',
      amount: 300,
      status: 'completed',
      payment_method: 'Mobile Money',
      transaction_id: 'TXN-001236',
      receipt_url: '#',
      created_at: 'Jan 13, 2024',
    },
    documents: [],
  },
  {
    id: '4',
    reference: 'APP-1A2B3C4D',
    applicant_name: 'Emma Nakiwala',
    email: 'emma.nakiwala@email.com',
    phone: '+256 704567890',
    program: 'IB Diploma',
    grade: 'Grade 11',
    status: 'rejected',
    submitted_at: 'Jan 13, 2024',
    last_updated: 'Jan 14, 2024',
    payment_status: 'failed',
    payment: null,
    documents: [],
  },
  {
    id: '5',
    reference: 'APP-5E6F7A8B',
    applicant_name: 'David Ssentamu',
    email: 'david.ssentamu@email.com',
    phone: '+256 705678901',
    program: 'A-Level',
    grade: 'Grade 12',
    status: 'pending',
    submitted_at: 'Jan 13, 2024',
    last_updated: 'Jan 13, 2024',
    payment_status: 'pending',
    payment: null,
    documents: [],
  },
]

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies()
    const { searchParams } = new URL(request.url)
    
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const isConfigured = supabaseUrl && supabaseKey && supabaseServiceKey

    if (!isConfigured) {
      // Return mock data
      let filteredApps = [...MOCK_APPLICATIONS]
      
      if (status && status !== 'all') {
        filteredApps = filteredApps.filter(app => app.status === status)
      }

      const total = filteredApps.length
      const paginatedApps = filteredApps.slice(offset, offset + limit)

      return NextResponse.json({
        success: true,
        data: paginatedApps,
        total,
        page,
        limit,
        mock: true,
      })
    }

    // Create Supabase client
    const supabase = createServerClient(
      supabaseUrl,
      supabaseKey,
      {
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
      }
    )

    // Build the query
    let query = supabase
      .from('applications')
      .select(`
        id,
        applicant_id,
        academic_year,
        intake_month,
        status,
        created_at,
        updated_at,
        program_id,
        applicants (
          id,
          full_name,
          email,
          phone_number
        ),
        programs (
          id,
          name,
          grade_level
        ),
        application_documents (
          id,
          application_id,
          document_type,
          file_name,
          file_url,
          status,
          uploaded_at,
          verified_at
        ),
        payments (
          id,
          amount,
          status,
          payment_method,
          transaction_id,
          payment_slip_url,
          created_at,
          updated_at
        )
      `)
      .order('created_at', { ascending: false })

    // Filter by status if provided and not 'all'
    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    // Transform the data to match the frontend interface
    const transformedData = data?.map((app: any) => {
      // Get applicant info
      const applicant = Array.isArray(app.applicants) ? app.applicants[0] : app.applicants
      const program = Array.isArray(app.programs) ? app.programs[0] : app.programs
      const payment = Array.isArray(app.payments) ? app.payments[0] : app.payments

      // Generate reference number (you might want to store this in DB)
      const reference = `APP-${app.id.substring(0, 8).toUpperCase()}`

      // Transform documents
      const documents = app.application_documents?.map((doc: any) => ({
        application_id: doc.application_id,
        file_name: doc.file_name,
        file_type: doc.document_type,
        file_url: doc.file_url,
        status: doc.status || 'pending',
        uploaded_at: new Date(doc.uploaded_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      })) || []

      // Transform payment
      const paymentData = payment ? {
        id: payment.id,
        amount: payment.amount || 0,
        status: payment.status || 'pending',
        payment_method: payment.payment_method || 'N/A',
        created_at: new Date(payment.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }),
        transaction_id: payment.transaction_id || 'N/A',
        receipt_url: payment.payment_slip_url || null
      } : null

      return {
        id: app.id,
        reference: reference,
        applicant_name: applicant?.full_name || 'N/A',
        email: applicant?.email || 'N/A',
        phone: applicant?.phone_number || 'N/A',
        program: program?.name || 'N/A',
        grade: program?.grade_level || 'N/A',
        status: app.status || 'pending',
        submitted_at: new Date(app.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }),
        last_updated: new Date(app.updated_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }),
        payment_status: payment?.status || 'pending',
        payment: paymentData,
        documents: documents
      }
    })

    return NextResponse.json({
      success: true,
      data: transformedData,
      total: count,
      page,
      limit
    })

  } catch (error) {
    console.error('Error fetching applications:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Update application status
export async function PATCH(request: Request) {
  try {
    const cookieStore = await cookies()
    const body = await request.json()
    const { applicationId, status } = body

    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const isConfigured = supabaseUrl && supabaseKey && supabaseServiceKey

    if (!applicationId || !status) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (!isConfigured) {
      // Update mock data
      const appIndex = MOCK_APPLICATIONS.findIndex(a => a.id === applicationId)
      if (appIndex >= 0) {
        MOCK_APPLICATIONS[appIndex] = {
          ...MOCK_APPLICATIONS[appIndex],
          status,
          last_updated: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }),
        }
        return NextResponse.json({
          success: true,
          data: MOCK_APPLICATIONS[appIndex],
          mock: true,
        })
      }
      return NextResponse.json(
        { success: false, error: 'Application not found' },
        { status: 404 }
      )
    }

    const supabase = createServerClient(
      supabaseUrl,
      supabaseKey,
      {
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
      }
    )

    const { data, error } = await supabase
      .from('applications')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', applicationId)
      .select()
      .single()

    if (error) {
      console.error('Error updating application:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data
    })

  } catch (error) {
    console.error('Error updating application:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

