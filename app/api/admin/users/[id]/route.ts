/**
 * Single Admin User API Route
 * 
 * Handles updating and deleting individual admin users
 * Only accessible by authenticated admins with 'admin' role
 */

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { AdminRole } from '@/lib/supabase/admin'

// ============================================================================
// Types
// ============================================================================

interface UpdateAdminUserRequest {
  role?: AdminRole
  is_active?: boolean
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
): Promise<{ authorized: boolean; error?: string; currentAdminId?: string }> {
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
      .select('id, role, is_active')
      .eq('user_id', session.user.id)
      .eq('is_active', true)
      .single()

    if (error || !adminUser) {
      return { authorized: false, error: 'Admin access required' }
    }

    if (adminUser.role !== 'admin') {
      return { authorized: false, error: 'Only administrators can manage admin users' }
    }

    return { authorized: true, currentAdminId: adminUser.id }
  } catch (error) {
    console.error('Error verifying admin access:', error)
    return { authorized: false, error: 'Authentication verification failed' }
  }
}

/**
 * Validate role
 */
function isValidRole(role: string): role is AdminRole {
  return ['admin', 'reviewer', 'viewer'].includes(role)
}

// ============================================================================
// PATCH: Update an admin user
// ============================================================================

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: adminUserId } = await params
    const cookieStore = await cookies()
    
    // Verify admin access
    const { authorized, error: authError, currentAdminId } = await verifyAdminAccess(cookieStore)
    
    if (!authorized) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: authError },
        { status: 403 }
      )
    }

    // Parse request body
    const body: UpdateAdminUserRequest = await request.json()

    // Prevent modifying yourself
    if (adminUserId === currentAdminId) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'You cannot modify your own admin account' },
        { status: 400 }
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
            } catch (err) {
              // Handle cookie errors
            }
          },
          remove(name: string, options: CookieOptions) {
            try {
              cookieStore.set({ name, value: '', ...options })
            } catch (err) {
              // Handle cookie errors
            }
          },
        },
      }
    )

    // Validate role if provided
    if (body.role && !isValidRole(body.role)) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Invalid role. Must be admin, reviewer, or viewer' },
        { status: 400 }
      )
    }

    // Build update object
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString()
    }

    if (body.role) updateData.role = body.role
    if (typeof body.is_active === 'boolean') updateData.is_active = body.is_active
    if (body.full_name !== undefined) updateData.full_name = body.full_name

    // Update the admin user
    const { data: updatedAdmin, error: updateError } = await supabase
      .from('admin_users')
      .update(updateData)
      .eq('id', adminUserId)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating admin user:', updateError)
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Failed to update admin user' },
        { status: 500 }
      )
    }

    return NextResponse.json<ApiResponse<typeof updatedAdmin>>({
      success: true,
      data: updatedAdmin,
      message: 'Admin user updated successfully'
    })
  } catch (error) {
    console.error('Unexpected error in PATCH /api/admin/users/[id]:', error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

// ============================================================================
// DELETE: Remove an admin user (deactivate)
// ============================================================================

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: adminUserId } = await params
    const cookieStore = await cookies()
    
    // Verify admin access
    const { authorized, error: authError, currentAdminId } = await verifyAdminAccess(cookieStore)
    
    if (!authorized) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: authError },
        { status: 403 }
      )
    }

    // Prevent deleting yourself
    if (adminUserId === currentAdminId) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'You cannot remove your own admin access' },
        { status: 400 }
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
            } catch (err) {
              // Handle cookie errors
            }
          },
          remove(name: string, options: CookieOptions) {
            try {
              cookieStore.set({ name, value: '', ...options })
            } catch (err) {
              // Handle cookie errors
            }
          },
        },
      }
    )

    // Check if the admin user exists
    const { data: targetAdmin, error: fetchError } = await supabase
      .from('admin_users')
      .select('id, email, full_name')
      .eq('id', adminUserId)
      .single()

    if (fetchError || !targetAdmin) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Admin user not found' },
        { status: 404 }
      )
    }

    // Deactivate the admin user (soft delete)
    const { error: deleteError } = await supabase
      .from('admin_users')
      .update({ 
        is_active: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', adminUserId)

    if (deleteError) {
      console.error('Error removing admin user:', deleteError)
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Failed to remove admin user' },
        { status: 500 }
      )
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: `Admin access removed for ${targetAdmin.email || 'user'}`
    })
  } catch (error) {
    console.error('Unexpected error in DELETE /api/admin/users/[id]:', error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

