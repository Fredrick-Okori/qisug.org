/**
 * Admin Check API Route
 * 
 * This endpoint checks if the currently authenticated user is an admin.
 * Returns { isAdmin: true } if user is an active admin, { isAdmin: false } otherwise.
 * This is used after login to redirect admins to the admin dashboard.
 */

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

interface AdminCheckResponse {
  success: boolean
  isAdmin: boolean
  error?: string
}

/**
 * Check if user is an active admin
 */
async function checkIsAdmin(
  supabase: ReturnType<typeof createServerClient>,
  userId: string
): Promise<boolean> {
  try {
    const { data: adminUser, error } = await supabase
      .from('admin_users')
      .select('role, is_active')
      .eq('user_id', userId)
      .eq('is_active', true)
      .maybeSingle()

    if (error) {
      console.warn('[AdminCheck] admin_users lookup error:', error)
    }

    return !!adminUser
  } catch (error) {
    console.error('[AdminCheck] Error checking admin status:', error)
    return false
  }
}

/**
 * GET /api/auth/admin-check
 * 
 * Checks if the currently authenticated user is an admin.
 * Requires authentication.
 */
export async function GET(request: NextRequest) {
  try {
    // Create Supabase server client
    const cookieStore = await cookies()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            // Read-only operation
          },
          remove(name: string, options: CookieOptions) {
            // Read-only operation
          },
        },
      }
    )

    // Get current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError || !session?.user) {
      console.warn('[AdminCheck] No authenticated session found')
      return NextResponse.json<AdminCheckResponse>(
        { success: false, isAdmin: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Check if user is an admin
    const isAdmin = await checkIsAdmin(supabase, session.user.id)

    console.log(`[AdminCheck] User ${session.user.id} admin status: ${isAdmin}`)

    return NextResponse.json<AdminCheckResponse>({
      success: true,
      isAdmin,
    })

  } catch (error) {
    console.error('[AdminCheck] Unexpected error:', error)
    return NextResponse.json<AdminCheckResponse>(
      { success: false, isAdmin: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/auth/admin-check
 * 
 * Alternative POST endpoint for checking admin status.
 * Same behavior as GET but for use in form submissions.
 */
export async function POST(request: NextRequest) {
  try {
    // Create Supabase server client
    const cookieStore = await cookies()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            // Read-only operation
          },
          remove(name: string, options: CookieOptions) {
            // Read-only operation
          },
        },
      }
    )

    // Get current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError || !session?.user) {
      return NextResponse.json<AdminCheckResponse>(
        { success: false, isAdmin: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Check if user is an admin
    const isAdmin = await checkIsAdmin(supabase, session.user.id)

    return NextResponse.json<AdminCheckResponse>({
      success: true,
      isAdmin,
    })

  } catch (error) {
    console.error('[AdminCheck] Unexpected error:', error)
    return NextResponse.json<AdminCheckResponse>(
      { success: false, isAdmin: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

