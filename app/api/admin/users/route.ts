/**
 * Admin Users API Route
 * 
 * Handles listing and creating admin users
 * Only accessible by authenticated admins with 'admin' role
 */

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { AdminRole } from '@/lib/supabase/admin'

// ============================================================================
// Types
// ============================================================================

interface AddAdminUserRequest {
  email: string
  role?: AdminRole
  full_name?: string
}

interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Verify that the current user is an admin with 'admin' role
 */
async function verifyAdminAccess(
  cookieStore: Awaited<ReturnType<typeof cookies>>
): Promise<{ authorized: boolean; error?: string }> {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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

    if (adminUser.role !== 'admin') {
      return { authorized: false, error: 'Only administrators can manage admin users' }
    }

    return { authorized: true }
  } catch (error) {
    console.error('Error verifying admin access:', error)
    return { authorized: false, error: 'Authentication verification failed' }
  }
}

/**
 * Validate email format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate role
 */
function isValidRole(role: string): role is AdminRole {
  return ['admin', 'reviewer', 'viewer'].includes(role)
}

// ============================================================================
// GET: List all admin users
// ============================================================================

export async function GET() {
  try {
    const cookieStore = await cookies()
    
    // Verify admin access
    const { authorized, error } = await verifyAdminAccess(cookieStore)
    
    if (!authorized) {
      return NextResponse.json<ApiResponse>(
        { success: false, error },
        { status: 403 }
      )
    }

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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

    // Fetch all admin users
    const { data: adminUsers, error: fetchError } = await supabase
      .from('admin_users')
      .select('*')
      .order('created_at', { ascending: false })

    if (fetchError) {
      console.error('Error fetching admin users:', fetchError)
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Failed to fetch admin users' },
        { status: 500 }
      )
    }

    return NextResponse.json<ApiResponse<typeof adminUsers>>({
      success: true,
      data: adminUsers
    })
  } catch (error) {
    console.error('Unexpected error in GET /api/admin/users:', error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

// ============================================================================
// POST: Add a new admin user
// ============================================================================

export async function POST(request: Request) {
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

    // Parse request body
    const body: AddAdminUserRequest = await request.json()

    // Validate required fields
    if (!body.email) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Email is required' },
        { status: 400 }
      )
    }

    // Validate email format
    if (!isValidEmail(body.email)) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate role if provided
    const role: AdminRole = body.role && isValidRole(body.role) ? body.role : 'viewer'

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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

    // Get the user from auth.users by email
    // Note: This requires service_role key, so we'll use admin API
    const { data: { users }, error: userError } = await supabase
      .auth
      .admin
      .listUsers()

    if (userError) {
      console.error('Error listing users:', userError)
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Failed to find user. They must sign up first.' },
        { status: 400 }
      )
    }

    const targetUser = users.find((u) => u.email === body.email)

    if (!targetUser) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'User not found. They must sign up at /login first.' },
        { status: 404 }
      )
    }

    // Check if user is already an admin
    const { data: existingAdmin } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', targetUser.id)
      .maybeSingle()

    if (existingAdmin) {
      // Update existing admin
      const { data: updatedAdmin, error: updateError } = await supabase
        .from('admin_users')
        .update({ 
          role,
          is_active: true,
          full_name: body.full_name || existingAdmin.full_name,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingAdmin.id)
        .select()
        .maybeSingle()

      if (updateError) {
        console.error('Error updating admin:', updateError)
        return NextResponse.json<ApiResponse>(
          { success: false, error: 'Failed to update admin user' },
          { status: 500 }
        )
      }

      return NextResponse.json<ApiResponse<typeof updatedAdmin>>({
        success: true,
        data: updatedAdmin,
        message: 'Admin role updated successfully'
      })
    }

    // Create new admin user
    const { data: newAdmin, error: createError } = await supabase
      .from('admin_users')
      .insert({
        user_id: targetUser.id,
        email: body.email,
        full_name: body.full_name,
        role,
        is_active: true
      })
      .select()
      .maybeSingle()

    if (createError) {
      console.error('Error creating admin:', createError)
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Failed to create admin user' },
        { status: 500 }
      )
    }

    return NextResponse.json<ApiResponse<typeof newAdmin>>({
      success: true,
      data: newAdmin,
      message: 'User added as admin successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('Unexpected error in POST /api/admin/users:', error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

