import { createClient } from '@/lib/supabase/client'

// Reference format: QIS-YYYY-XXXXX
// YYYY = Current year
// XXXXX = Random 5-digit number

const STORAGE_KEY = 'qis_application_reference'
const STORAGE_TIMESTAMP_KEY = 'qis_reference_timestamp'

/**
 * Generate a unique application reference
 * Format: QIS-YYYY-XXXXX (e.g., QIS-2025-12345)
 */
export function generateApplicationReference(): string {
  const year = new Date().getFullYear()
  const randomNum = Math.floor(10000 + Math.random() * 90000) // 5-digit number
  return `QIS-${year}-${randomNum}`
}

/**
 * Store reference in localStorage
 */
export function storeReference(reference: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, reference)
    localStorage.setItem(STORAGE_TIMESTAMP_KEY, Date.now().toString())
  }
}

/**
 * Get reference from localStorage
 */
export function getStoredReference(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(STORAGE_KEY)
  }
  return null
}

/**
 * Get reference timestamp from localStorage
 */
export function getReferenceTimestamp(): number | null {
  if (typeof window !== 'undefined') {
    const timestamp = localStorage.getItem(STORAGE_TIMESTAMP_KEY)
    return timestamp ? parseInt(timestamp, 10) : null
  }
  return null
}

/**
 * Clear reference from localStorage
 */
export function clearReference(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(STORAGE_TIMESTAMP_KEY)
  }
}

/**
 * Check if reference is valid (exists and not expired)
 * Reference expires after 48 hours
 */
export function isReferenceValid(reference: string): boolean {
  if (!reference) return false
  
  // Check format
  const formatRegex = /^QIS-\d{4}-\d{5}$/
  if (!formatRegex.test(reference)) return false
  
  // Check timestamp
  const timestamp = getReferenceTimestamp()
  if (!timestamp) return false
  
  // Check if not expired (48 hours = 172800000 ms)
  const expiry = 48 * 60 * 60 * 1000
  const now = Date.now()
  
  return (now - timestamp) < expiry
}

/**
 * Refresh reference timestamp (extend validity)
 */
export function refreshReferenceTimestamp(): void {
  if (typeof window !== 'undefined') {
    const reference = localStorage.getItem(STORAGE_KEY)
    if (reference) {
      localStorage.setItem(STORAGE_TIMESTAMP_KEY, Date.now().toString())
    }
  }
}

/**
 * Validate reference against Supabase database
 * Returns the applicant data if found, null otherwise
 */
export async function validateReferenceInDatabase(reference: string): Promise<{
  valid: boolean
  data?: {
    applicantId: string
    applicantName: string
    applicationId?: string
    status?: string
  }
  error?: string
}> {
  const supabase = createClient()
  
  try {
    // Check if reference exists in applicants table
    const { data: applicant, error: applicantError } = await supabase
      .from('applicants')
      .select('id, first_name, last_name, qis_id')
      .eq('qis_id', reference)
      .single()
    
    if (applicantError) {
      if (applicantError.code === 'PGRST116') {
        return { valid: false, error: 'Application reference not found. Please check and try again.' }
      }
      return { valid: false, error: 'Database error. Please try again.' }
    }
    
    // Get associated application if exists
    const { data: application } = await supabase
      .from('applications')
      .select('id, status')
      .eq('applicant_id', applicant.id)
      .single()
    
    return {
      valid: true,
      data: {
        applicantId: applicant.id,
        applicantName: `${applicant.first_name} ${applicant.last_name}`,
        applicationId: application?.id,
        status: application?.status
      }
    }
  } catch (error) {
    console.error('Error validating reference:', error)
    return { valid: false, error: 'An unexpected error occurred. Please try again.' }
  }
}

/**
 * Check if a reference already exists in the database
 */
export async function referenceExistsInDatabase(reference: string): Promise<boolean> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('applicants')
    .select('id')
    .eq('qis_id', reference)
    .single()
  
  return !error && data !== null
}

/**
 * Create a new applicant with a generated reference
 * Returns the generated reference
 */
export async function createNewApplicantWithReference(): Promise<{
  success: boolean
  reference?: string
  applicantId?: string
  error?: string
}> {
  const supabase = createClient()
  
  try {
    // Generate a unique reference
    let reference = generateApplicationReference()
    let attempts = 0
    const maxAttempts = 5
    
    // Ensure reference is unique
    while (await referenceExistsInDatabase(reference) && attempts < maxAttempts) {
      reference = generateApplicationReference()
      attempts++
    }
    
    if (attempts >= maxAttempts) {
      return { success: false, error: 'Failed to generate unique reference. Please try again.' }
    }
    
    // Create applicant with the reference
    const { data: applicant, error } = await supabase
      .from('applicants')
      .insert({
        qis_id: reference,
        first_name: 'Pending',
        last_name: 'Application',
        birth_date: '2000-01-01',
        gender: 'Male',
        citizenship_type: 'Non-Ugandan',
        email: 'pending@application.com',
        phone_primary: '+0000000000',
      })
      .select()
      .single()
    
    if (error) {
      return { success: false, error: `Failed to create applicant: ${error.message}` }
    }
    
    // Store the reference in localStorage
    storeReference(reference)
    
    return {
      success: true,
      reference,
      applicantId: applicant.id
    }
  } catch (error) {
    console.error('Error creating applicant:', error)
    return { success: false, error: 'An unexpected error occurred. Please try again.' }
  }
}

/**
 * Check if user has a valid stored reference
 */
export function hasValidStoredReference(): boolean {
  const reference = getStoredReference()
  if (!reference) return false
  return isReferenceValid(reference)
}

