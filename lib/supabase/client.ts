import { createBrowserClient } from '@supabase/ssr'

// ============================================================================
// ENVIRONMENT VALIDATION - Safe for build time
// ============================================================================

/**
 * Check if we're in a browser environment (not during build/SSR)
 */
function isBrowser(): boolean {
  return typeof window !== 'undefined'
}

/**
 * Validates that all required Supabase environment variables are present and valid
 * Returns gracefully without throwing during build/SSR
 */
function validateEnvironment(): { valid: boolean; error?: string; details?: { url?: string; keyLength?: number } } {
  // During build/SSR, return a safe placeholder
  if (!isBrowser()) {
    // Don't log during build to avoid noise
    return { 
      valid: false, 
      error: 'Supabase not configured (build-time)',
      details: { url: undefined }
    }
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Check if environment variables exist
  if (!url) {
    return { 
      valid: false, 
      error: 'Missing NEXT_PUBLIC_SUPABASE_URL environment variable',
      details: { url: undefined }
    }
  }

  if (!anonKey) {
    return { 
      valid: false, 
      error: 'Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable',
      details: { url: url?.substring(0, 30) + '...' }
    }
  }

  // Validate URL format
  if (!url.startsWith('https://') && !url.startsWith('http://')) {
    return { 
      valid: false, 
      error: 'Invalid NEXT_PUBLIC_SUPABASE_URL format. Must start with https:// or http://',
      details: { url: url.substring(0, 30) + '...', keyLength: anonKey?.length }
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

// ============================================================================
// VALIDATION CACHING
// ============================================================================

// Store validation result to avoid repeated checks
let validationCache: { valid: boolean; error?: string; details?: { url?: string; keyLength?: number } } | null = null

/**
 * Get cached validation result
 */
function getValidationResult(): { valid: boolean; error?: string; details?: { url?: string; keyLength?: number } } {
  if (validationCache === null) {
    validationCache = validateEnvironment()
    if (validationCache.valid) {
      console.log('[Supabase] Configuration validated successfully')
    } else if (isBrowser()) {
      // Only log in browser to avoid build noise
      console.warn('[Supabase] Configuration warning:', validationCache.error)
    }
  }
  return validationCache
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

  const { valid, error } = getValidationResult()

  if (!valid) {
    console.warn('[Supabase] Configuration error:', error)
    return null
  }

  // Return cached instance if available
  if (supabaseInstance) {
    return supabaseInstance
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  supabaseInstance = createBrowserClient(url, anonKey)

  console.log('[Supabase] Client initialized successfully')

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
 * Check if Supabase is properly configured
 * Safe to call on client side for UI feedback
 */
export function isSupabaseConfigured(): boolean {
  // During build, return false to prevent usage
  if (!isBrowser()) {
    return false
  }
  const { valid } = getValidationResult()
  return valid
}

/**
 * Get detailed configuration status for debugging
 */
export function getSupabaseConfigStatus(): {
  configured: boolean
  url?: string
  keyLength?: number
  error?: string
} {
  const { valid, error, details } = getValidationResult()

  if (valid) {
    return {
      configured: true,
      url: details?.url,
      keyLength: details?.keyLength
    }
  }

  return {
    configured: false,
    url: details?.url,
    keyLength: details?.keyLength,
    error
  }
}

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
    
    return message
  }
  
  return 'An unexpected error occurred. Please try again or contact support.'
}

/**
 * Reset the cached validation (useful for testing or hot reload)
 */
export function resetSupabaseValidation(): void {
  validationCache = null
  supabaseInstance = null
  console.log('[Supabase] Validation cache reset')
}

