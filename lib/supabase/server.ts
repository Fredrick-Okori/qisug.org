/**
 * Supabase Server Client Configuration with Enhanced Error Handling
 * 
 * This module provides server-side Supabase client with proper
 * environment validation and error handling.
 */

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

// ============================================================================
// TYPES
// ============================================================================

export interface ServerConfig {
  url: string
  anonKey: string
}

export interface ServerConfigStatus {
  configured: boolean
  url?: string
  keyLength?: number
  error?: string
}

export interface ServerValidationResult {
  valid: boolean
  error?: string
  details?: {
    url?: string
    keyLength?: number
  }
}

// ============================================================================
// ENVIRONMENT VALIDATION
// ============================================================================

/**
 * Validates Supabase environment configuration (server-side)
 * Returns detailed information about the configuration status
 */
export function validateServerConfig(): ServerValidationResult {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Check if environment variables exist
  if (!url) {
    return {
      valid: false,
      error: 'Missing NEXT_PUBLIC_SUPABASE_URL environment variable',
    }
  }

  if (!anonKey) {
    return {
      valid: false,
      error: 'Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable',
      details: { url: url.substring(0, 30) + '...' }
    }
  }

  // Validate URL format
  if (!url.startsWith('https://') && !url.startsWith('http://')) {
    return {
      valid: false,
      error: 'Invalid NEXT_PUBLIC_SUPABASE_URL format. Must start with https:// or http://',
      details: { url: url.substring(0, 30) + '...', keyLength: anonKey.length }
    }
  }

  // Basic anon key format validation
  if (anonKey.length < 10) {
    return {
      valid: false,
      error: 'Invalid NEXT_PUBLIC_SUPABASE_ANON_KEY format. Key appears too short',
      details: { url: url.substring(0, 30) + '...', keyLength: anonKey.length }
    }
  }

  return {
    valid: true,
    details: { url: url.substring(0, 30) + '...', keyLength: anonKey.length }
  }
}

/**
 * Check if Supabase is properly configured (server-side)
 */
export function isServerConfigured(): boolean {
  const result = validateServerConfig()
  return result.valid
}

/**
 * Get detailed configuration status for debugging (server-side)
 */
export function getServerConfigStatus(): ServerConfigStatus {
  const result = validateServerConfig()

  if (result.valid) {
    return {
      configured: true,
      url: result.details?.url,
      keyLength: result.details?.keyLength
    }
  }

  return {
    configured: false,
    url: result.details?.url,
    keyLength: result.details?.keyLength,
    error: result.error
  }
}

// ============================================================================
// CLIENT FACTORY
// ============================================================================

/**
 * Creates a Supabase server client with cookie handling
 * Returns null if configuration is invalid
 */
export async function createClient(): Promise<ReturnType<typeof createServerClient> | null> {
  const result = validateServerConfig()

  if (!result.valid) {
    console.warn('[Supabase Server] Configuration error:', result.error)
    return null
  }

  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          try {
            return cookieStore.get(name)?.value
          } catch {
            return undefined
          }
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // Handle cookie errors in edge cases
            console.error('[Supabase Server] Cookie set error:', error)
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // Handle cookie errors in edge cases
            console.error('[Supabase Server] Cookie remove error:', error)
          }
        },
      },
    }
  )
}

/**
 * Safe client creation - throws on configuration error
 * Use this when you need to handle errors explicitly
 */
export async function createClientOrThrow(): Promise<ReturnType<typeof createServerClient>> {
  const result = validateServerConfig()

  if (!result.valid) {
    throw new Error(`Supabase configuration error: ${result.error}`)
  }

  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          try {
            return cookieStore.get(name)?.value
          } catch {
            return undefined
          }
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            console.error('[Supabase Server] Cookie set error:', error)
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            console.error('[Supabase Server] Cookie remove error:', error)
          }
        },
      },
    }
  )
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get a user-friendly error message for server-side errors
 */
export function getServerErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    const message = error.message
    
    if (message.includes('Invalid API key') || message.includes('API key')) {
      return 'Configuration error: Invalid or missing Supabase API key. Please contact support.'
    }
    
    if (message.includes('Missing') && message.includes('environment variable')) {
      return 'Configuration error: Supabase environment variables are not set. Please contact support.'
    }
    
    if (message.includes('Failed to fetch') || message.includes('network') || message.includes('NetworkError')) {
      return 'Network error: Unable to connect to Supabase. Please check your internet connection and try again.'
    }
    
    if (message.includes('JWT') || message.includes('token') || message.includes('session')) {
      return 'Authentication error: Your session has expired. Please sign in again.'
    }
    
    if (message.includes('permission') || message.includes('RLS') || message.includes('row level security')) {
      return 'Permission error: You do not have access to this resource. Please contact support.'
    }
    
    return message
  }
  
  return 'An unexpected error occurred. Please try again or contact support.'
}

/**
 * Check if error is related to Supabase configuration
 */
export function isConfigError(error: unknown): boolean {
  if (error instanceof Error) {
    const message = error.message.toLowerCase()
    return (
      message.includes('api key') ||
      message.includes('configuration') ||
      message.includes('environment variable') ||
      message.includes('supabase_url') ||
      message.includes('supabase_anon_key')
    )
  }
  return false
}

/**
 * Check if error is related to authentication
 */
export function isAuthError(error: unknown): boolean {
  if (error instanceof Error) {
    const message = error.message.toLowerCase()
    return (
      message.includes('auth') ||
      message.includes('session') ||
      message.includes('token') ||
      message.includes('jwt') ||
      message.includes('credentials') ||
      message.includes('unauthorized') ||
      message.includes('forbidden')
    )
  }
  return false
}

/**
 * Get authentication error details
 */
export function getServerAuthErrorDetails(error: unknown): {
  isAuthError: boolean
  message: string
  isSessionExpired: boolean
  isInvalidToken: boolean
  isUnauthorized: boolean
} {
  const result = {
    isAuthError: false,
    message: '',
    isSessionExpired: false,
    isInvalidToken: false,
    isUnauthorized: false,
  }

  if (error instanceof Error) {
    const message = error.message.toLowerCase()
    result.message = error.message

    // Check for specific auth errors
    if (
      message.includes('session') ||
      message.includes('expired') ||
      message.includes('jwt')
    ) {
      result.isAuthError = true
      result.isSessionExpired = true
      result.message = 'Your session has expired. Please sign in again.'
    } else if (
      message.includes('invalid token') ||
      message.includes('invalid jwt') ||
      message.includes('malformed')
    ) {
      result.isAuthError = true
      result.isInvalidToken = true
      result.message = 'Invalid authentication token. Please sign in again.'
    } else if (
      message.includes('unauthorized') ||
      message.includes('forbidden') ||
      message.includes('permission')
    ) {
      result.isAuthError = true
      result.isUnauthorized = true
      result.message = 'You are not authorized to access this resource.'
    } else if (
      message.includes('auth') ||
      message.includes('credentials')
    ) {
      result.isAuthError = true
    }
  }

  return result
}

