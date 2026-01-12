import { createClient, isSupabaseConfigured, getSupabaseErrorMessage } from '@/lib/supabase/client'
import type { 
  FullApplicationData, 
  ApplicantFormData, 
  ApplicationFormData,
  AcademicHistoryFormData,
  AgentFormData,
  Program,
  TuitionStructure
} from '@/types/database'

// ============================================================================
// CLIENT FACTORY - Safe client creation
// ============================================================================

/**
 * Get or create Supabase client
 * Returns null if not configured (safe for SSR/build)
 */
function getSupabaseClient() {
  if (!isSupabaseConfigured()) {
    console.warn('[Admissions] Supabase not configured, cannot perform operations')
    return null
  }
  return createClient()
}

// ============================================================================
// APPLICATION SUBMISSION
// ============================================================================

export async function submitApplication(data: FullApplicationData) {
  try {
    const supabase = getSupabaseClient()
    
    if (!supabase) {
      return { 
        success: false, 
        error: new Error('Supabase is not configured. Please check your environment variables.') 
      }
    }

    // 1. Create applicant
    const applicantResult = await createApplicant(supabase, data.applicant)
    if (applicantResult.error) throw applicantResult.error
    
    const applicantId = applicantResult.data.id

    // 2. Create application
    const applicationResult = await createApplication(supabase, applicantId, data.application)
    if (applicationResult.error) throw applicationResult.error
    
    const applicationId = applicationResult.data.id

    // 3. Create academic histories
    for (const history of data.academicHistory) {
      await createAcademicHistory(supabase, applicationId, history)
    }

    // 4. Create agent if applicable
    if (data.agent) {
      await createAgent(supabase, applicationId, data.agent)
    }

    return { 
      success: true, 
      data: { applicantId, applicationId }
    }
  } catch (error) {
    console.error('Error submitting application:', error)
    return { success: false, error }
  }
}

async function createApplicant(supabase: ReturnType<typeof createClient>, data: ApplicantFormData) {
  return await supabase
    .from('applicants')
    .insert({
      first_name: data.firstName,
      middle_name: data.middleName || null,
      preferred_name: data.preferredName || null,
      former_last_name: data.formerLastName || null,
      last_name: data.lastName,
      birth_date: data.birthDate,
      gender: data.gender,
      citizenship_type: data.citizenshipType,
      citizenship_country: data.citizenshipCountry || null,
      visa_status: data.visaStatus,
      email: data.email,
      phone_primary: data.phonePrimary,
      phone_other: data.phoneOther || null,
      address_street: data.address.street,
      address_city: data.address.city,
      address_district: data.address.district,
      address_postal_code: data.address.postalCode,
      address_country: data.address.country,
      emergency_contact_name: data.emergencyContact.name,
      emergency_contact_phone: data.emergencyContact.phone,
      emergency_contact_email: data.emergencyContact.email || null,
    })
    .select()
    .single()
}

async function createApplication(
  supabase: ReturnType<typeof createClient>,
  applicantId: string, 
  data: ApplicationFormData
) {
  return await supabase
    .from('applications')
    .insert({
      applicant_id: applicantId,
      academic_year: data.academicYear,
      intake_month: data.intakeMonth,
      program_id: data.programId,
      has_agent: data.hasAgent,
      status: 'Submitted',
      submitted_at: new Date().toISOString(),
    })
    .select()
    .single()
}

async function createAcademicHistory(
  supabase: ReturnType<typeof createClient>,
  applicationId: string, 
  data: AcademicHistoryFormData
) {
  return await supabase
    .from('academic_histories')
    .insert({
      application_id: applicationId,
      school_name: data.schoolName,
      province: data.province,
      country: data.country,
      start_date: data.startDate,
      end_date: data.endDate,
      grade_completed: data.gradeCompleted,
    })
    .select()
    .single()
}

async function createAgent(supabase: ReturnType<typeof createClient>, applicationId: string, data: AgentFormData) {
  return await supabase
    .from('agents')
    .insert({
      application_id: applicationId,
      agent_id_number: data.agentIdNumber,
      agency_name: data.agencyName,
      agent_name: data.agentName,
      address_street: data.address.street,
      address_city: data.address.city,
      address_province: data.address.province,
      address_postal_code: data.address.postalCode,
      address_country: data.address.country,
      phone_primary: data.contact.phonePrimary,
      phone_other: data.contact.phoneOther || null,
      email: data.contact.email,
      authorized_to_receive_info: data.authorizedToReceiveInfo,
    })
    .select()
    .single()
}

// ============================================================================
// DOCUMENT UPLOAD
// ============================================================================

export async function uploadDocument(
  applicationId: string,
  documentType: string,
  file: File
) {
  const supabase = getSupabaseClient()
  
  if (!supabase) {
    const error = new Error('Supabase is not configured')
    console.error('[UploadDocument] Configuration error:', error.message)
    return { success: false, error }
  }

  const filePath = `${applicationId}/${documentType}/${Date.now()}-${file.name}`
  
  // Upload to Supabase Storage (using underscore convention)
  const { data, error } = await supabase.storage
    .from('admission_documents')
    .upload(filePath, file)

  if (error) {
    console.error('[UploadDocument] Storage upload failed:', error)
    return { success: false, error }
  }

  console.log('[UploadDocument] Upload successful:', data.path)

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('admission_documents')
    .getPublicUrl(filePath)

  console.log('[UploadDocument] Public URL:', publicUrl)

  // Save document reference to database
  const { error: dbError } = await supabase
    .from('application_documents')
    .insert({
      application_id: applicationId,
      document_type: documentType,
      file_name: file.name,
      file_path: publicUrl,
      file_size: file.size,
      mime_type: file.type,
    })

  if (dbError) {
    console.error('[UploadDocument] Database insert failed:', dbError)
    return { success: false, error: dbError }
  }

  console.log('[UploadDocument] Document saved to database successfully')

  return { success: true, data: { url: publicUrl } }
}

// ============================================================================
// DATA FETCHING
// ============================================================================

export async function getPrograms() {
  const supabase = getSupabaseClient()
  
  if (!supabase) {
    console.warn('[GetPrograms] Supabase not configured')
    return { success: false, error: new Error('Supabase not configured'), data: null }
  }

  const { data, error } = await supabase
    .from('programs')
    .select('*')
    .eq('is_active', true)
    .order('grade', { ascending: true })
    .order('stream', { ascending: true })

  if (error) {
    console.error('[GetPrograms] Error:', error)
    return { success: false, error, data: null }
  }

  return { success: true, data: data as Program[] }
}

export async function getTuitionStructure(grade: number, stream: string) {
  const supabase = getSupabaseClient()
  
  if (!supabase) {
    console.warn('[GetTuitionStructure] Supabase not configured')
    return { success: false, error: new Error('Supabase not configured'), data: null }
  }

  const { data, error } = await supabase
    .from('tuition_structures')
    .select('*')
    .eq('grade', grade)
    .eq('stream', stream)
    .eq('is_active', true)
    .single()

  if (error) {
    console.error('[GetTuitionStructure] Error:', error)
    return { success: false, error, data: null }
  }

  return { success: true, data: data as TuitionStructure }
}

export async function getApplicationById(applicationId: string) {
  const supabase = getSupabaseClient()
  
  if (!supabase) {
    console.warn('[GetApplicationById] Supabase not configured')
    return { success: false, error: new Error('Supabase not configured'), data: null }
  }

  const { data, error } = await supabase
    .from('applications')
    .select(`
      *,
      applicant:applicants(*),
      program:programs(*),
      academic_histories(*),
      agent:agents(*)
    `)
    .eq('id', applicationId)
    .single()

  if (error) {
    console.error('[GetApplicationById] Error:', error)
    return { success: false, error, data: null }
  }

  return { success: true, data }
}

// ============================================================================
// APPLICATION STATUS
// ============================================================================

export async function updateApplicationStatus(
  applicationId: string,
  status: string,
  reviewedBy?: string
) {
  const supabase = getSupabaseClient()
  
  if (!supabase) {
    console.warn('[UpdateApplicationStatus] Supabase not configured')
    return { success: false, error: new Error('Supabase not configured') }
  }

  const updates: Record<string, unknown> = {
    status,
    updated_at: new Date().toISOString(),
  }

  if (status === 'Under Review') {
    updates.reviewed_at = new Date().toISOString()
  }

  if (reviewedBy) {
    updates.reviewed_by = reviewedBy
  }

  const { data, error } = await supabase
    .from('applications')
    .update(updates)
    .eq('id', applicationId)
    .select()
    .single()

  if (error) {
    console.error('[UpdateApplicationStatus] Error:', error)
    return { success: false, error }
  }

  return { success: true, data }
}

// ============================================================================
// PAYMENT CONFIRMATION
// ============================================================================

export async function confirmPayment(
  applicationId: string,
  paymentReference: string,
  amount: number = 300
) {
  const supabase = getSupabaseClient()
  
  if (!supabase) {
    console.warn('[ConfirmPayment] Supabase not configured')
    return { success: false, error: new Error('Supabase not configured') }
  }

  const { data, error } = await supabase
    .from('applications')
    .update({
      application_fee_paid: true,
      payment_reference: paymentReference,
      payment_amount: amount,
      updated_at: new Date().toISOString(),
    })
    .eq('id', applicationId)
    .select()
    .single()

  if (error) {
    console.error('[ConfirmPayment] Database update failed:', error)
    return { success: false, error }
  }

  console.log('[ConfirmPayment] Payment confirmed successfully')
  return { success: true, data }
}

// ============================================================================
// DRAFT SAVING (Auto-save feature)
// ============================================================================

export async function saveDraft(
  applicantId: string | null,
  data: FullApplicationData
) {
  const supabase = getSupabaseClient()
  
  if (!supabase) {
    console.warn('[SaveDraft] Supabase not configured')
    return { success: false, error: new Error('Supabase not configured') }
  }

  // If no applicant ID, create a new draft
  if (!applicantId) {
    const applicantResult = await createApplicant(supabase, data.applicant)
    if (applicantResult.error) return applicantResult
    
    applicantId = applicantResult.data.id
  }

  // Check for existing draft application
  const { data: existingApp } = await supabase
    .from('applications')
    .select('id')
    .eq('applicant_id', applicantId)
    .eq('status', 'Draft')
    .single()

  if (existingApp) {
    // Update existing draft
    await supabase
      .from('applications')
      .update({
        intake_month: data.application.intakeMonth,
        program_id: data.application.programId,
        has_agent: data.application.hasAgent,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existingApp.id)

    return { success: true, applicationId: existingApp.id }
  }

  // Create new draft
  const appResult = await createApplication(supabase, applicantId, {
    ...data.application,
    academicYear: data.application.academicYear || '2026/2027',
  })

  if (appResult.error) return appResult

  return { success: true, applicationId: appResult.data.id }
}

// ============================================================================
// USER CHECK HELPER
// ============================================================================

/**
 * Check if user exists by email
 * Returns: { exists: boolean, error?: string }
 */
export async function checkUserExists(email: string): Promise<{ exists: boolean; error?: string }> {
  const supabase = getSupabaseClient()
  
  if (!supabase) {
    return { exists: false, error: 'Supabase not configured' }
  }

  try {
    // Try to get user by email using admin API
    const { data: { users }, error } = await supabase.auth.admin.listUsers()

    if (error) {
      // Admin API not accessible with anon key
      console.warn('[CheckUserExists] Admin API not accessible:', error.message)
      
      // Alternative: Try to sign in with the email
      // This won't actually sign in, but will fail if user doesn't exist
      return { exists: true } // Can't determine with anon key
    }

    const userExists = users?.some((user: { email?: string | null }) => 
      user.email?.toLowerCase() === email.toLowerCase()
    )

    return { exists: userExists || false }
  } catch (err) {
    console.error('[CheckUserExists] Error:', err)
    return { exists: false, error: 'Unable to verify user' }
  }
}

/**
 * Sign in user with email and password
 * Returns: { session, user, error }
 */
export async function signInUser(email: string, password: string) {
  const supabase = getSupabaseClient()
  
  if (!supabase) {
    return { 
      session: null, 
      user: null, 
      error: new Error('Supabase is not configured. Please check your environment variables.') 
    }
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error('[SignInUser] Sign in error:', error)
      return { session: null, user: null, error }
    }

    return { session: data.session, user: data.user, error: null }
  } catch (err) {
    console.error('[SignInUser] Unexpected error:', err)
    return { 
      session: null, 
      user: null, 
      error: new Error('An unexpected error occurred during sign in') 
    }
  }
}

/**
 * Sign up new user
 * Returns: { session, user, error }
 */
export async function signUpUser(email: string, password: string, fullName?: string) {
  const supabase = getSupabaseClient()
  
  if (!supabase) {
    return { 
      session: null, 
      user: null, 
      error: new Error('Supabase is not configured. Please check your environment variables.') 
    }
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    if (error) {
      console.error('[SignUpUser] Sign up error:', error)
      return { session: null, user: null, error }
    }

    return { session: data.session, user: data.user, error: null }
  } catch (err) {
    console.error('[SignUpUser] Unexpected error:', err)
    return { 
      session: null, 
      user: null, 
      error: new Error('An unexpected error occurred during sign up') 
    }
  }
}

