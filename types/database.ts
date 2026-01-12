// Database types for Supabase - Updated to match flat column schema

export type Gender = 'Male' | 'Female'
export type CitizenshipType = 'Ugandan' | 'Non-Ugandan'
export type VisaStatus = 'Permanent Resident' | 'Refugee' | 'Student Visa' | null
export type IntakeMonth = 'January' | 'March' | 'May' | 'September'
export type ProgramStream = 'Science' | 'Arts'
export type ApplicationStatus = 'Draft' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected'

export interface Applicant {
  id: string
  qis_id: string | null
  first_name: string
  middle_name: string | null
  preferred_name: string | null
  former_last_name: string | null
  last_name: string
  birth_date: string
  gender: Gender
  citizenship_type: CitizenshipType
  citizenship_country: string | null
  visa_status: VisaStatus
  email: string
  phone_primary: string
  phone_other: string | null
  // Flat columns (matching database schema)
  address_street: string | null
  address_city: string | null
  address_district: string | null
  address_postal_code: string | null
  address_country: string | null
  emergency_contact_name: string | null
  emergency_contact_phone: string | null
  emergency_contact_email: string | null
  created_at: string
  updated_at: string
}

export interface Program {
  id: string
  grade: 9 | 10 | 11 | 12
  stream: ProgramStream
  name: string
  description: string | null
  is_active: boolean
  created_at: string
}

export interface Application {
  id: string
  applicant_id: string
  academic_year: string
  intake_month: IntakeMonth
  program_id: string
  status: ApplicationStatus
  declaration_signed: boolean
  declaration_date: string | null
  has_agent: boolean
  application_fee_paid: boolean
  payment_reference: string | null
  payment_amount: number | null
  submitted_at: string | null
  reviewed_at: string | null
  reviewed_by: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface AcademicHistory {
  id: string
  application_id: string
  school_name: string
  province: string
  country: string
  start_date: string
  end_date: string
  grade_completed: string
  is_current: boolean
  certificate_url: string | null
  created_at: string
  updated_at: string
}

export interface Agent {
  id: string
  application_id: string
  agent_id_number: string
  agency_name: string
  agent_name: string
  // Flat columns
  address_street: string | null
  address_city: string | null
  address_province: string | null
  address_postal_code: string | null
  address_country: string | null
  phone_primary: string
  phone_other: string | null
  email: string
  authorized_to_receive_info: boolean
  commission_rate: number | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface ApplicationDocument {
  id: string
  application_id: string
  document_type: string
  file_name: string
  file_path: string
  file_size: number | null
  mime_type: string | null
  description: string | null
  is_verified: boolean
  verified_by: string | null
  verified_at: string | null
  created_at: string
}

export interface TuitionStructure {
  id: string
  grade: 9 | 10 | 11 | 12
  stream: ProgramStream
  admission_fee: number
  term_1_fee: number
  term_2_fee: number
  term_3_fee: number
  exam_fee: number
  uniform_fee: number
  clubs_charity_fee: number
  is_active: boolean
  academic_year: string
  created_at: string
}

export interface PaymentSlip {
  id: string
  application_id: string
  applicant_id: string
  file_name: string
  file_path: string
  file_size: number | null
  mime_type: string | null
  bank_name: string | null
  transaction_reference: string | null
  amount_paid: number | null
  payment_date: string | null
  is_verified: boolean
  verified_by: string | null
  verified_at: string | null
  notification_sent: boolean
  notification_sent_at: string | null
  created_at: string
}

export interface AdminUser {
  id: string
  user_id: string
  email: string
  full_name: string | null
  role: 'admin' | 'reviewer' | 'viewer'
  is_active: boolean
  created_at: string
  updated_at: string
}

// Form input types - for creating new records
export interface ApplicantFormData {
  firstName: string
  middleName?: string
  preferredName?: string
  formerLastName?: string
  lastName: string
  birthDate: string
  gender: Gender
  citizenshipType: CitizenshipType
  citizenshipCountry?: string
  visaStatus?: VisaStatus
  email: string
  phonePrimary: string
  phoneOther?: string
  address: {
    street: string
    city: string
    district?: string
    postalCode?: string
    country: string
  }
  emergencyContact: {
    name: string
    phone: string
    email?: string
  }
}

export interface ApplicationFormData {
  academicYear: string
  intakeMonth: IntakeMonth
  programId: string
  hasAgent: boolean
}

export interface AcademicHistoryFormData {
  schoolName: string
  province: string
  country: string
  startDate: string
  endDate: string
  gradeCompleted: string
  isCurrent?: boolean
}

export interface AgentFormData {
  agentIdNumber: string
  agencyName: string
  agentName: string
  address: {
    street: string
    city: string
    province?: string
    postalCode?: string
    country: string
  }
  contact: {
    phonePrimary: string
    phoneOther?: string
    email: string
  }
  authorizedToReceiveInfo: boolean
}

export interface FullApplicationData {
  applicant: ApplicantFormData
  application: ApplicationFormData
  academicHistory: AcademicHistoryFormData[]
  agent?: AgentFormData
}

// Dashboard view types
export interface ApplicationDashboardRow {
  application_id: string
  status: ApplicationStatus
  intake_month: IntakeMonth
  academic_year: string
  submitted_at: string | null
  application_fee_paid: boolean
  first_name: string
  last_name: string
  email: string
  phone_primary: string
  grade: number
  stream: ProgramStream
  program_name: string
}

export interface TuitionCalculatorRow {
  grade: number
  stream: ProgramStream
  admission_fee: number
  term_1_fee: number
  term_2_fee: number
  term_3_fee: number
  exam_fee: number
  uniform_fee: number
  clubs_charity_fee: number
  annual_total: number
}

