/**
 * Admin Role Checking Utilities for Supabase Authentication
 * 
 * This module provides functions to check and manage admin user roles
 * for the Queensgate International School management portal.
 */

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { User } from '@supabase/supabase-js'

// ============================================================================
// Types
// ============================================================================

export type AdminRole = 'admin' | 'reviewer' | 'viewer'

export interface AdminUser {
  id: string
  user_id: string
  email: string
  full_name: string | null
  role: AdminRole
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface AuthenticatedAdmin {
  user: User
  adminUser: AdminUser
}

// ============================================================================
// Server Client Factory
// ============================================================================

/**
 * Creates a Supabase server client with cookie handling
 */
function createAdminClient(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    throw new Error('Supabase environment variables are not configured')
  }

  return createServerClient(url, anonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        try {
          cookieStore.set({ name, value, ...options })
        } catch (error) {
          // Handle cookie errors in edge cases
        }
      },
      remove(name: string, options: any) {
        try {
          cookieStore.set({ name, value: '', ...options })
        } catch (error) {
          // Handle cookie errors in edge cases
        }
      },
    },
  })
}

// ============================================================================
// Admin Check Functions (Server Components)
// ============================================================================

/**
 * Check if the current user is an active admin
 * Returns the admin user record if found, null otherwise
 */
export async function getCurrentAdminUser(): Promise<AdminUser | null> {
  try {
    const cookieStore = await cookies()
    const supabase = createAdminClient(cookieStore)

    const { data: { session } } = await supabase.auth.getSession()

    if (!session?.user) {
      return null
    }

    const { data: adminUser, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('is_active', true)
      .maybeSingle()

    if (error || !adminUser) {
      return null
    }

    return adminUser as AdminUser
  } catch (error) {
    console.error('Error checking admin status:', error)
    return null
  }
}

/**
 * Check if the current user has any admin role
 */
export async function isAdminUser(): Promise<boolean> {
  const adminUser = await getCurrentAdminUser()
  return adminUser !== null
}

/**
 * Check if the current user has a specific admin role
 */
export async function hasRole(allowedRoles: AdminRole[]): Promise<boolean> {
  const adminUser = await getCurrentAdminUser()
  
  if (!adminUser) {
    return false
  }

  return allowedRoles.includes(adminUser.role)
}

/**
 * Check if the current user is a super admin (full access)
 */
export async function isSuperAdmin(): Promise<boolean> {
  return hasRole(['admin'])
}

/**
 * Check if the current user is a reviewer
 */
export async function isReviewer(): Promise<boolean> {
  return hasRole(['admin', 'reviewer'])
}

/**
 * Check if the current user is a viewer
 */
export async function isViewer(): Promise<boolean> {
  return hasRole(['admin', 'reviewer', 'viewer'])
}

/**
 * Get the authenticated admin with user details
 */
export async function getAuthenticatedAdmin(): Promise<AuthenticatedAdmin | null> {
  try {
    const cookieStore = await cookies()
    const supabase = createAdminClient(cookieStore)

    const { data: { session } } = await supabase.auth.getSession()

    if (!session?.user) {
      return null
    }

    const { data: adminUser, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('is_active', true)
      .maybeSingle()

    if (error || !adminUser) {
      return null
    }

    return {
      user: session.user,
      adminUser: adminUser as AdminUser
    }
  } catch (error) {
    console.error('Error getting authenticated admin:', error)
    return null
  }
}

// ============================================================================
// Admin User Management Functions (Server Actions)
// ============================================================================

/**
 * Add a user as an admin
 */
export async function addAdminUser(
  email: string,
  role: AdminRole = 'viewer',
  fullName?: string
): Promise<{ success: boolean; data?: AdminUser; error?: string }> {
  try {
    const cookieStore = await cookies()
    const supabase = createAdminClient(cookieStore)

    // Verify the requesting user is an admin
    const currentAdmin = await getCurrentAdminUser()
    
    if (!currentAdmin || currentAdmin.role !== 'admin') {
      return { success: false, error: 'Only admins can add new admin users' }
    }

    // Get the user from auth.users by email
    const { data: { users }, error: userError } = await supabase
      .auth
      .admin
      .listUsers()

    if (userError) {
      return { success: false, error: 'Failed to find user' }
    }

    const targetUser = users.find((u) => u.email === email)

    if (!targetUser) {
      return { success: false, error: 'User not found. They must sign up first.' }
    }

    // Check if user is already an admin
    const { data: existingAdmin } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', targetUser.id)
      .maybeSingle()

    if (existingAdmin) {
      // Update existing admin
      const { data, error } = await supabase
        .from('admin_users')
        .update({ 
          role, 
          is_active: true,
          full_name: fullName || existingAdmin.full_name,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingAdmin.id)
        .select()
        .maybeSingle()

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data: data as AdminUser }
    }

    // Create new admin user
    const { data, error } = await supabase
      .from('admin_users')
      .insert({
        user_id: targetUser.id,
        email,
        full_name: fullName,
        role,
        is_active: true
      })
      .select()
      .maybeSingle()

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data: data as AdminUser }
  } catch (error) {
    console.error('Error adding admin user:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

/**
 * Update an admin user's role
 */
export async function updateAdminUserRole(
  adminUserId: string,
  newRole: AdminRole
): Promise<{ success: boolean; error?: string }> {
  try {
    // Verify the requesting user is an admin
    const currentAdmin = await getCurrentAdminUser()
    
    if (!currentAdmin || currentAdmin.role !== 'admin') {
      return { success: false, error: 'Only admins can update admin roles' }
    }

    const cookieStore = await cookies()
    const supabase = createAdminClient(cookieStore)

    const { error } = await supabase
      .from('admin_users')
      .update({ 
        role: newRole,
        updated_at: new Date().toISOString()
      })
      .eq('id', adminUserId)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Error updating admin role:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

/**
 * Deactivate (remove) an admin user
 */
export async function removeAdminUser(
  adminUserId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Verify the requesting user is an admin
    const currentAdmin = await getCurrentAdminUser()
    
    if (!currentAdmin || currentAdmin.role !== 'admin') {
      return { success: false, error: 'Only admins can remove admin users' }
    }

    // Prevent removing yourself
    if (currentAdmin.id === adminUserId) {
      return { success: false, error: 'You cannot remove your own admin access' }
    }

    const cookieStore = await cookies()
    const supabase = createAdminClient(cookieStore)

    const { error } = await supabase
      .from('admin_users')
      .update({ 
        is_active: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', adminUserId)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Error removing admin user:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

/**
 * Get all admin users
 */
export async function getAllAdminUsers(): Promise<AdminUser[]> {
  try {
    const cookieStore = await cookies()
    const supabase = createAdminClient(cookieStore)

    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching admin users:', error)
      return []
    }

    return data as AdminUser[]
  } catch (error) {
    console.error('Error getting admin users:', error)
    return []
  }
}

/**
 * Get active admin users only
 */
export async function getActiveAdminUsers(): Promise<AdminUser[]> {
  try {
    const cookieStore = await cookies()
    const supabase = createAdminClient(cookieStore)

    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching active admin users:', error)
      return []
    }

    return data as AdminUser[]
  } catch (error) {
    console.error('Error getting active admin users:', error)
    return []
  }
}

// ============================================================================
// Client-Side Helper Functions
// ============================================================================

/**
 * Get admin role from client-side (for UI display only)
 * Note: For security, always verify on server-side
 */
export function getRoleBadgeColor(role: AdminRole): string {
  const colors = {
    admin: 'bg-red-100 text-red-800',
    reviewer: 'bg-blue-100 text-blue-800',
    viewer: 'bg-gray-100 text-gray-800'
  }
  return colors[role]
}

export function getRoleDisplayName(role: AdminRole): string {
  const names = {
    admin: 'Administrator',
    reviewer: 'Reviewer',
    viewer: 'Viewer'
  }
  return names[role]
}

export function getRoleDescription(role: AdminRole): string {
  const descriptions = {
    admin: 'Full access to all admin features',
    reviewer: 'Can view and review applications',
    viewer: 'Read-only access to dashboard'
  }
  return descriptions[role]
}

