// Database types for Supabase

export type Gender = 'Male' | 'Female'
export type CitizenshipType = 'Ugandan' | 'Non-Ugandan'
export type VisaStatus = 'Permanent Resident' | 'Refugee' | 'Student Visa' | null
export type IntakeMonth = 'January' | 'March' | 'May' | 'September'
export type ProgramStream = 'Science' | 'Arts'
export type ApplicationStatus = 'Draft' | 'Submitted' | 'Under Review' | 'Accepted' | 'Rejected'

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
  address: {
    street: string | null
    city: string | null
    district: string | null
    postal_code: string | null
    country: string | null
  }
  emergency_contact: {
    name: string | null
    phone: string | null
    email: string | null
  }
  created_at: string
  updated_at: string
}

export interface Program {
  id: string
  grade: 9 | 10 | 11 | 12
  stream: ProgramStream
  name: string
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
  created_at: string
}

export interface Agent {
  id: string
  application_id: string
  agent_id_number: string
  agency_name: string
  agent_name: string
  address: {
    street: string | null
    city: string | null
    province: string | null
    postal_code: string | null
    country: string | null
  }
  contact: {
    phone_primary: string
    phone_other: string | null
    email: string
  }
  authorized_to_receive_info: boolean
  created_at: string
}

export interface TuitionStructure {
  id: string
  grade: 9 | 10 | 11 | 12
  stream: ProgramStream
  fees: {
    admission: number
    term_1: number
    term_2: number
    term_3: number
    exam_fee: number
    uniform: number
    clubs_charity: number
  }
  annual_total: number
  created_at: string
}

// Form input types
export interface ApplicantFormData {
  firstName: string
  middleName: string
  preferredName: string
  formerLastName: string
  lastName: string
  birthDate: string
  gender: Gender
  citizenshipType: CitizenshipType
  citizenshipCountry: string
  visaStatus: VisaStatus
  email: string
  phonePrimary: string
  phoneOther: string
  address: {
    street: string
    city: string
    district: string
    postalCode: string
    country: string
  }
  emergencyContact: {
    name: string
    phone: string
    email: string
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
}

export interface AgentFormData {
  agentIdNumber: string
  agencyName: string
  agentName: string
  address: {
    street: string
    city: string
    province: string
    postalCode: string
    country: string
  }
  contact: {
    phonePrimary: string
    phoneOther: string
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

