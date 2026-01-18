/**
 * Supabase Client Configuration with Enhanced Error Handling
 * 
 * This module provides a centralized Supabase client with proper
 * environment validation and error handling for the QIS application.
 */

import { createBrowserClient, isBrowser } from '@supabase/ssr'

// Re-export for external usage
export { createBrowserClient, isBrowser }

// ============================================================================
// TYPES
// ============================================================================

export interface SupabaseConfig {
  url: string
  anonKey: string
}

export interface SupabaseConfigStatus {
  configured: boolean
  url?: string
  keyLength?: number
  error?: string
}

export interface ValidationResult {
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
 * Validates Supabase environment configuration
 * Returns detailed information about the configuration status
 */
export function validateSupabaseConfig(): ValidationResult {
  // During server-side rendering, return safe placeholder
  if (!isBrowser()) {
    return {
      valid: false,
      error: 'Supabase not configured (server-side)',
    }
  }

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
 * Check if Supabase is properly configured (client-side only)
 * Safe to call on client side for UI feedback
 */
export function isSupabaseConfigured(): boolean {
  if (!isBrowser()) {
    return false
  }
  const result = validateSupabaseConfig()
  return result.valid
}

/**
 * Get detailed configuration status for debugging
 */
export function getSupabaseConfigStatus(): SupabaseConfigStatus {
  const result = validateSupabaseConfig()

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
// VALIDATION CACHING
// ============================================================================

// Store validation result to avoid repeated checks
let validationCache: ValidationResult | null = null

/**
 * Get cached validation result
 */
function getCachedValidation(): ValidationResult {
  if (validationCache === null) {
    validationCache = validateSupabaseConfig()
  }
  return validationCache
}

/**
 * Reset the cached validation (useful for testing or hot reload)
 */
export function resetSupabaseValidation(): void {
  validationCache = null
  supabaseInstance = null
}

// ============================================================================
// SUPABASE CLIENT - Lazy initialization
// ============================================================================

let supabaseInstance: ReturnType<typeof createBrowserClient> | null = null

/**
 * Creates a Supabase client with environment validation
 * Returns null if configuration is invalid (safe for build/SSR)
 */
export function createClient(): ReturnType<typeof createBrowserClient> | null {
  // During build/SSR, return null instead of throwing
  if (!isBrowser()) {
    return null
  }

  const result = getCachedValidation()

  if (!result.valid) {
    return null
  }

  // Return cached instance if available
  if (supabaseInstance) {
    return supabaseInstance
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  supabaseInstance = createBrowserClient(url, anonKey)

  return supabaseInstance
}

/**
 * Legacy export - creates client and returns it (may return null during build)
 * Used by lib/admissions.ts - callers should handle null case
 */
export const supabase = createClient()

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get a user-friendly error message for display
 */
export function getSupabaseErrorMessage(error: unknown): string {
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
    
    if (message.includes('Invalid credentials') || message.includes('user not found')) {
      return 'Invalid email or password. Please check your credentials and try again.'
    }
    
    if (message.includes('email_not_confirmed')) {
      return 'Please verify your email address before signing in. Check your inbox for the verification link.'
    }
    
    return message
  }
  
  return 'An unexpected error occurred. Please try again or contact support.'
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
      message.includes('credentials') ||
      message.includes('unauthorized')
    )
  }
  return false
}

/**
 * Get authentication error details
 */
export function getAuthErrorDetails(error: unknown): {
  isAuthError: boolean
  message: string
  isUserNotFound: boolean
  isInvalidPassword: boolean
  isEmailNotConfirmed: boolean
  isProviderDisabled: boolean
  isNetworkError: boolean
} {
  const result = {
    isAuthError: false,
    message: '',
    isUserNotFound: false,
    isInvalidPassword: false,
    isEmailNotConfirmed: false,
    isProviderDisabled: false,
    isNetworkError: false,
  }

  if (error instanceof Error) {
    const message = error.message.toLowerCase()
    result.message = error.message

    // Check for specific auth errors
    if (
      message.includes('invalid credentials') ||
      message.includes('user not found') ||
      message.includes('email not found')
    ) {
      result.isAuthError = true
      result.isUserNotFound = true
      result.message = 'No account found with this email address.'
    } else if (
      message.includes('invalid password') ||
      message.includes('wrong password')
    ) {
      result.isAuthError = true
      result.isInvalidPassword = true
      result.message = 'Incorrect password. Please try again.'
    } else if (
      message.includes('email_not_confirmed') ||
      message.includes('email not confirmed') ||
      message.includes('verify your email')
    ) {
      result.isAuthError = true
      result.isEmailNotConfirmed = true
      result.message = 'Please verify your email address before signing in.'
    } else if (
      message.includes('provider is not enabled') ||
      message.includes('email provider is disabled') ||
      message.includes('auth method not enabled')
    ) {
      result.isAuthError = true
      result.isProviderDisabled = true
      result.message = 'Email/password authentication is not enabled. Please contact the administrator.'
    } else if (
      message.includes('failed to fetch') ||
      message.includes('network') ||
      message.includes('networkerror') ||
      message.includes('connection')
    ) {
      result.isAuthError = true
      result.isNetworkError = true
      result.message = 'Network error: Unable to connect to the authentication service. Please check your internet connection and try again.'
    } else if (
      message.includes('auth') ||
      message.includes('session') ||
      message.includes('token') ||
      message.includes('credentials') ||
      message.includes('unauthorized')
    ) {
      result.isAuthError = true
    }
  }

  return result
}

/**
 * Resend confirmation email for a user
 */
export async function resendConfirmationEmail(email: string): Promise<{ error: Error | null }> {
  const client = createClient()
  if (!client) {
    return { error: new Error('Supabase client not initialized') }
  }

  const { error } = await client.auth.resend({
    type: 'signup',
    email,
    options: {
      emailRedirectTo: `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/auth/callback`,
    },
  })

  return { error: error ? new Error(error.message) : null }
}

/**
 * Check if email/password authentication is available
 * This is a best-effort check that can be enhanced with server-side validation
 */
export async function isEmailAuthEnabled(): Promise<boolean> {
  const client = createClient()
  if (!client) {
    return false
  }

  try {
    // Attempt to get the signUp methods to check available providers
    // Note: This may not work in all Supabase versions
    const { data, error } = await client.auth.getSession()
    
    // If we can create a client and get session (even null), auth is working
    if (!error) {
      return true
    }
    
    // Check if the error is about provider being disabled
    const errorMsg = error.message.toLowerCase()
    if (
      errorMsg.includes('provider is not enabled') ||
      errorMsg.includes('email provider is disabled')
    ) {
      return false
    }
    
    return true
  } catch {
    // If we can't determine, assume it's enabled
    return true
  }
}

