import { supabase } from '@/lib/supabase/client'
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
// APPLICATION SUBMISSION
// ============================================================================

export async function submitApplication(data: FullApplicationData) {
  try {
    // 1. Create applicant
    const applicantResult = await createApplicant(data.applicant)
    if (applicantResult.error) throw applicantResult.error
    
    const applicantId = applicantResult.data.id

    // 2. Create application
    const applicationResult = await createApplication(
      applicantId, 
      data.application
    )
    if (applicationResult.error) throw applicationResult.error
    
    const applicationId = applicationResult.data.id

    // 3. Create academic histories
    for (const history of data.academicHistory) {
      await createAcademicHistory(applicationId, history)
    }

    // 4. Create agent if applicable
    if (data.agent) {
      await createAgent(applicationId, data.agent)
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

async function createApplicant(data: ApplicantFormData) {
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

async function createAgent(applicationId: string, data: AgentFormData) {
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
  const { data, error } = await supabase
    .from('programs')
    .select('*')
    .eq('is_active', true)
    .order('grade', { ascending: true })
    .order('stream', { ascending: true })

  if (error) {
    return { success: false, error, data: null }
  }

  return { success: true, data: data as Program[] }
}

export async function getTuitionStructure(grade: number, stream: string) {
  const { data, error } = await supabase
    .from('tuition_structures')
    .select('*')
    .eq('grade', grade)
    .eq('stream', stream)
    .eq('is_active', true)
    .single()

  if (error) {
    return { success: false, error, data: null }
  }

  return { success: true, data: data as TuitionStructure }
}

export async function getApplicationById(applicationId: string) {
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
  // If no applicant ID, create a new draft
  if (!applicantId) {
    const applicantResult = await createApplicant(data.applicant)
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
  const appResult = await createApplication(applicantId, {
    ...data.application,
    academicYear: data.application.academicYear || '2026/2027',
  })

  if (appResult.error) return appResult

  return { success: true, applicationId: appResult.data.id }
}
