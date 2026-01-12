/**
 * Authentication Helper Utility
 * 
 * Provides client-side authentication checks for role-based routing.
 */

import { createClient } from '@/lib/supabase/client'

export type UserRole = 'admin' | 'reviewer' | 'viewer' | 'user' | null

export interface AuthState {
  isAuthenticated: boolean
  isAdmin: boolean
  userRole: UserRole
  user: any | null
  loading: boolean
}

/**
 * Check if user is authenticated and get their role
 * Returns null if Supabase is not configured or error occurs
 */
export async function checkUserAuth(): Promise<AuthState> {
  try {
    const supabase = createClient()
    
    if (!supabase) {
      return {
        isAuthenticated: false,
        isAdmin: false,
        userRole: null,
        user: null,
        loading: false
      }
    }

    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.user) {
      return {
        isAuthenticated: false,
        isAdmin: false,
        userRole: null,
        user: null,
        loading: false
      }
    }

    // Log the logged-in user's details for debugging (who is currently signed in)
    console.log('[AuthHelper] logged-in user:', session.user)

    // Check if user is an active admin
    const { data: adminUser, error } = await supabase
      .from('admin_users')
      .select('role, is_active')
      .eq('user_id', session.user.id)
      .eq('is_active', true)
      .maybeSingle()

    if (error) console.warn('[AuthHelper] admin_users lookup error:', error)

    if (!adminUser) {
      // User is authenticated but not an admin
      return {
        isAuthenticated: true,
        isAdmin: false,
        userRole: 'user',
        user: session.user,
        loading: false
      }
    }

    // User is an active admin
    return {
      isAuthenticated: true,
      isAdmin: true,
      userRole: adminUser.role as UserRole,
      user: session.user,
      loading: false
    }
  } catch (error) {
    console.error('[AuthHelper] Error checking auth state:', error)
    return {
      isAuthenticated: false,
      isAdmin: false,
      userRole: null,
      user: null,
      loading: false
    }
  }
}

/**
 * Redirect admin users to admin dashboard
 * Returns true if redirect was triggered
 */
export async function redirectAdmins(): Promise<boolean> {
  try {
    const supabase = createClient()
    
    if (!supabase) {
      return false
    }

    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.user) {
      return false
    }

    // Debug: show who is attempting a redirect check
    console.log('[AuthHelper] redirectAdmins check for user:', session.user)

    const { data: adminUser, error } = await supabase
      .from('admin_users')
      .select('role, is_active')
      .eq('user_id', session.user.id)
      .eq('is_active', true)
      .maybeSingle()

    if (error) console.warn('[AuthHelper] redirectAdmins admin_users lookup error:', error)

    if (adminUser) {
      // User is an admin, redirect to admin dashboard
      window.location.href = '/dashboard/admin'
      return true
    }

    return false
  } catch (error) {
    console.error('[AuthHelper] Error checking admin status:', error)
    return false
  }
}

/**
 * Get current session
 */
export async function getSession() {
  try {
    const supabase = createClient()
    
    if (!supabase) {
      return null
    }

    const { data: { session } } = await supabase.auth.getSession()
    return session
  } catch (error) {
    console.error('[AuthHelper] Error getting session:', error)
    return null
  }
}

/**
 * Check if Supabase client is available and configured
 */
export function isSupabaseClientConfigured(): boolean {
  try {
    const supabase = createClient()
    return supabase !== null
  } catch {
    return false
  }
}

