import { createBrowserClient } from '@supabase/ssr'

// ============================================================================
// ENVIRONMENT VALIDATION
// ============================================================================

/**
 * Validates that all required Supabase environment variables are present and valid
 */
function validateEnvironment(): { valid: boolean; error?: string; details?: { url?: string; keyLength?: number } } {
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
      details: { url: url.substring(0, 30) + '...' }
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

  // Validate that it's a valid Supabase project URL (basic check)
  if (!url.includes('.supabase.co') && !url.includes('supabase')) {
    console.warn('[Supabase] Warning: URL does not look like a standard Supabase URL')
  }

  // Basic anon key format validation
  // Supabase anon keys are JWTs and typically start with 'eyJ' and are quite long
  if (anonKey.length < 10) {
    return { 
      valid: false, 
      error: 'Invalid NEXT_PUBLIC_SUPABASE_ANON_KEY format. Key appears too short (should be a JWT token)',
      details: { url: url.substring(0, 30) + '...', keyLength: anonKey.length }
    }
  }

  // Check if it looks like a JWT (should have 3 parts separated by dots)
  const jwtParts = anonKey.split('.')
  if (jwtParts.length !== 3) {
    console.warn('[Supabase] Warning: Anon key does not look like a valid JWT token')
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
    if (!validationCache.valid) {
      console.error('[Supabase] Configuration error:', validationCache.error)
    } else {
      console.log('[Supabase] Configuration validated successfully')
    }
  }
  return validationCache
}

// ============================================================================
// SUPABASE CLIENT
// ============================================================================

let supabaseInstance: ReturnType<typeof createBrowserClient> | null = null

/**
 * Creates a Supabase client with environment validation
 * Throws a descriptive error if configuration is invalid
 */
export function createClient() {
  const { valid, error } = getValidationResult()

  if (!valid) {
    console.error('[Supabase] Configuration error:', error)
    throw new Error(`Supabase configuration error: ${error}. Please contact support or check your environment variables.`)
  }

  // Return cached instance if available
  if (supabaseInstance) {
    return supabaseInstance
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  supabaseInstance = createBrowserClient(url, anonKey)

  console.log('[Supabase] Client initialized successfully')
  console.log('[Supabase] Project URL:', url.substring(0, 30) + '...')

  return supabaseInstance
}

/**
 * Export a named instance for cases where we don't need validation on every call
 * This is used by lib/admissions.ts
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

