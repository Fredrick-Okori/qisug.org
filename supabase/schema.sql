-- Supabase Database Schema for Queensgate International School Admissions
-- Run this SQL in your Supabase SQL Editor

-- ============================================================================
-- ENUMS
-- ============================================================================

CREATE TYPE gender_type AS ENUM ('Male', 'Female');
CREATE TYPE citizenship_type AS ENUM ('Ugandan', 'Non-Ugandan');
CREATE TYPE visa_status_type AS ENUM ('Permanent Resident', 'Refugee', 'Student Visa');
CREATE TYPE intake_month_type AS ENUM ('January', 'March', 'May', 'September');
CREATE TYPE program_stream_type AS ENUM ('Science', 'Arts');
CREATE TYPE application_status_type AS ENUM ('Draft', 'Submitted', 'Under Review', 'Accepted', 'Rejected');

-- ============================================================================
-- PROGRAMS TABLE
-- ============================================================================

CREATE TABLE programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  grade INTEGER NOT NULL CHECK (grade BETWEEN 9 AND 12),
  stream program_stream_type NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (grade, stream)
);

-- Insert default programs
INSERT INTO programs (grade, stream, name) VALUES
(9, 'Science', 'Grade 9 Science'),
(9, 'Arts', 'Grade 9 Arts'),
(10, 'Science', 'Grade 10 Science'),
(10, 'Arts', 'Grade 10 Arts'),
(11, 'Science', 'Grade 11 Science'),
(11, 'Arts', 'Grade 11 Arts'),
(12, 'Science', 'Grade 12 Science'),
(12, 'Arts', 'Grade 12 Arts')
ON CONFLICT (grade, stream) DO NOTHING;

-- ============================================================================
-- APPLICANTS TABLE
-- ============================================================================

CREATE TABLE applicants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  qis_id TEXT UNIQUE,
  first_name TEXT NOT NULL,
  middle_name TEXT,
  preferred_name TEXT,
  former_last_name TEXT,
  last_name TEXT NOT NULL,
  birth_date DATE NOT NULL,
  gender gender_type NOT NULL,
  citizenship_type citizenship_type NOT NULL,
  citizenship_country TEXT,
  visa_status visa_status_type,
  email TEXT NOT NULL,
  phone_primary TEXT NOT NULL,
  phone_other TEXT,
  address_street TEXT,
  address_city TEXT,
  address_district TEXT,
  address_postal_code TEXT,
  address_country TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  emergency_contact_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for faster lookups
CREATE INDEX idx_applicants_email ON applicants(email);
CREATE INDEX idx_applicants_qis_id ON applicants(qis_id);
CREATE INDEX idx_applicants_name ON applicants(last_name, first_name);

-- ============================================================================
-- APPLICATIONS TABLE
-- ============================================================================

CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  applicant_id UUID NOT NULL REFERENCES applicants(id) ON DELETE CASCADE,
  academic_year TEXT NOT NULL DEFAULT '2026/2027',
  intake_month intake_month_type NOT NULL,
  program_id UUID NOT NULL REFERENCES programs(id),
  status application_status_type DEFAULT 'Submitted',
  declaration_signed BOOLEAN DEFAULT FALSE,
  declaration_date DATE,
  has_agent BOOLEAN DEFAULT FALSE,
  application_fee_paid BOOLEAN DEFAULT FALSE,
  payment_reference TEXT,
  payment_amount DECIMAL(10,2) DEFAULT 300.00,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES auth.users(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_applications_applicant ON applications(applicant_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_intake ON applications(intake_month);
CREATE INDEX idx_applications_academic_year ON applications(academic_year);

-- ============================================================================
-- ACADEMIC HISTORIES TABLE
-- ============================================================================

CREATE TABLE academic_histories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  school_name TEXT NOT NULL,
  province TEXT NOT NULL,
  country TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  grade_completed TEXT NOT NULL,
  is_current BOOLEAN DEFAULT FALSE,
  certificate_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_academic_histories_application ON academic_histories(application_id);

-- ============================================================================
-- AGENTS TABLE (Optional for international applicants)
-- ============================================================================

CREATE TABLE agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  agent_id_number TEXT NOT NULL,
  agency_name TEXT NOT NULL,
  agent_name TEXT NOT NULL,
  address_street TEXT,
  address_city TEXT,
  address_province TEXT,
  address_postal_code TEXT,
  address_country TEXT,
  phone_primary TEXT NOT NULL,
  phone_other TEXT,
  email TEXT NOT NULL,
  authorized_to_receive_info BOOLEAN DEFAULT FALSE,
  commission_rate DECIMAL(5,2) DEFAULT 10.00,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_agents_application ON agents(application_id);
CREATE INDEX idx_agents_email ON agents(email);

-- ============================================================================
-- TUITION STRUCTURES TABLE
-- ============================================================================

CREATE TABLE tuition_structures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  grade INTEGER NOT NULL CHECK (grade BETWEEN 9 AND 12),
  stream program_stream_type NOT NULL,
  admission_fee DECIMAL(10,2) DEFAULT 300.00,
  term_1_fee DECIMAL(10,2) NOT NULL,
  term_2_fee DECIMAL(10,2) NOT NULL,
  term_3_fee DECIMAL(10,2) NOT NULL,
  exam_fee DECIMAL(10,2) DEFAULT 120.00,
  uniform_fee DECIMAL(10,2) DEFAULT 235.00,
  clubs_charity_fee DECIMAL(10,2) DEFAULT 70.00,
  is_active BOOLEAN DEFAULT true,
  academic_year TEXT DEFAULT '2026/2027',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (grade, stream, academic_year)
);

-- Insert default tuition structures
INSERT INTO tuition_structures (grade, stream, admission_fee, term_1_fee, term_2_fee, term_3_fee, exam_fee, uniform_fee, clubs_charity_fee) VALUES
(9, 'Science', 300.00, 850000, 850000, 850000, 120, 235, 70),
(9, 'Arts', 300.00, 750000, 750000, 750000, 120, 235, 70),
(10, 'Science', 300.00, 950000, 950000, 950000, 120, 235, 70),
(10, 'Arts', 300.00, 850000, 850000, 850000, 120, 235, 70),
(11, 'Science', 300.00, 1050000, 1050000, 1050000, 120, 235, 70),
(11, 'Arts', 300.00, 950000, 950000, 950000, 120, 235, 70),
(12, 'Science', 300.00, 1150000, 1150000, 1150000, 120, 235, 70),
(12, 'Arts', 300.00, 1050000, 1050000, 1050000, 120, 235, 70);

-- ============================================================================
-- APPLICATION DOCUMENTS TABLE
-- ============================================================================

CREATE TABLE application_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT,
  mime_type TEXT,
  description TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  verified_by UUID REFERENCES auth.users(id),
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_documents_application ON application_documents(application_id);
CREATE INDEX idx_documents_type ON application_documents(document_type);

-- ============================================================================
-- STORAGE BUCKET SETUP (Run manually in Supabase Dashboard)
-- ============================================================================
-- Create a storage bucket named 'admission-documents' in your Supabase dashboard
-- Go to Storage -> New Bucket -> Name: admission-documents -> Make public

-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function to generate QIS ID
CREATE OR REPLACE FUNCTION generate_qis_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.qis_id IS NULL THEN
    NEW.qis_id := 'QIS-' || TO_CHAR(NOW(), 'YYYY') || '-' || 
                  LPAD(FLOOR(RANDOM() * 100000)::TEXT, 5, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate QIS ID
CREATE TRIGGER auto_generate_qis_id
  BEFORE INSERT ON applicants
  FOR EACH ROW
  EXECUTE FUNCTION generate_qis_id();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_applicants_updated_at
  BEFORE UPDATE ON applicants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_academic_histories_updated_at
  BEFORE UPDATE ON academic_histories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_agents_updated_at
  BEFORE UPDATE ON agents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- VIEWS
-- ============================================================================

-- View for dashboard
CREATE OR REPLACE VIEW application_dashboard AS
SELECT 
  a.id as application_id,
  a.status,
  a.intake_month,
  a.academic_year,
  a.submitted_at,
  a.application_fee_paid,
  ap.first_name,
  ap.last_name,
  ap.email,
  ap.phone_primary,
  p.grade,
  p.stream,
  p.name as program_name
FROM applications a
JOIN applicants ap ON a.applicant_id = ap.id
JOIN programs p ON a.program_id = p.id
ORDER BY a.created_at DESC;

-- View for tuition calculation
CREATE OR REPLACE VIEW tuition_calculator AS
SELECT 
  t.grade,
  t.stream,
  t.admission_fee,
  t.term_1_fee,
  t.term_2_fee,
  t.term_3_fee,
  t.exam_fee,
  t.uniform_fee,
  t.clubs_charity_fee,
  t.admission_fee + t.term_1_fee + t.term_2_fee + t.term_3_fee + t.exam_fee + t.uniform_fee + t.clubs_charity_fee as annual_total
FROM tuition_structures t
WHERE t.is_active = true
ORDER BY t.grade, t.stream;

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Run this to verify tables were created:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;

