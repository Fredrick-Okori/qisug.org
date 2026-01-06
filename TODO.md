# Supabase Admissions Integration - Implementation Plan

## Overview
This document outlines the plan to integrate Supabase for managing student admissions submissions with a comprehensive data structure including Applicants, Applications, Programs, Academic History, Tuition Structure, and Agents.

---

## Phase 1: Supabase Setup & Configuration

### 1.1 Install Dependencies
```bash
npm install @supabase/supabase-js @supabase/ssr zod react-hook-form @hookform/resolvers
```

### 1.2 Create Configuration Files
- `lib/supabase/client.ts` - Browser client
- `lib/supabase/server.ts` - Server client  
- `lib/supabase/middleware.ts` - Auth middleware
- `.env.local` - Environment variables

### 1.3 Database Schema (supabase/schema.sql)
Create tables following the provided data structure:
- `applicants` - Core applicant information
- `applications` - Application records linked to applicants
- `programs` - Available programs (grades 9-12, streams)
- `academic_histories` - Previous schools (max 3)
- `tuition_structures` - Fee structure
- `agents` - Optional agent information for international applicants

### 1.4 TypeScript Types (types/database.ts)
Define TypeScript interfaces matching the schema

---

## Phase 2: Database Schema Implementation

### 2.1 Main Tables
```sql
-- applicants table
CREATE TABLE applicants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  qis_id TEXT UNIQUE,
  first_name TEXT NOT NULL,
  middle_name TEXT,
  preferred_name TEXT,
  former_last_name TEXT,
  last_name TEXT NOT NULL,
  birth_date DATE NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('Male', 'Female')),
  citizenship_type TEXT NOT NULL CHECK (citizenship_type IN ('Ugandan', 'Non-Ugandan')),
  citizenship_country TEXT,
  visa_status TEXT CHECK (visa_status IN ('Permanent Resident', 'Refugee', 'Student Visa')),
  email TEXT NOT NULL,
  phone_primary TEXT NOT NULL,
  phone_other TEXT,
  street TEXT,
  city TEXT,
  district TEXT,
  postal_code TEXT,
  country TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  emergency_contact_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- programs table
CREATE TABLE programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  grade INTEGER NOT NULL CHECK (grade BETWEEN 9 AND 12),
  stream TEXT NOT NULL CHECK (stream IN ('Science', 'Arts')),
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- applications table
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  applicant_id UUID REFERENCES applicants(id) ON DELETE CASCADE,
  academic_year TEXT NOT NULL,
  intake_month TEXT NOT NULL CHECK (intake_month IN ('January', 'March', 'May', 'September')),
  program_id UUID REFERENCES programs(id),
  status TEXT DEFAULT 'Draft' CHECK (status IN ('Draft', 'Submitted', 'Under Review', 'Accepted', 'Rejected')),
  declaration_signed BOOLEAN DEFAULT FALSE,
  declaration_date DATE,
  has_agent BOOLEAN DEFAULT FALSE,
  application_fee_paid BOOLEAN DEFAULT FALSE,
  payment_reference TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- academic_histories table
CREATE TABLE academic_histories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  school_name TEXT NOT NULL,
  province TEXT NOT NULL,
  country TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  grade_completed TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- agents table
CREATE TABLE agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  agent_id_number TEXT NOT NULL,
  agency_name TEXT NOT NULL,
  agent_name TEXT NOT NULL,
  street TEXT,
  city TEXT,
  province TEXT,
  postal_code TEXT,
  country TEXT,
  phone_primary TEXT NOT NULL,
  phone_other TEXT,
  email TEXT NOT NULL,
  authorized_to_receive_info BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- tuition_structures table
CREATE TABLE tuition_structures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  grade INTEGER NOT NULL CHECK (grade BETWEEN 9 AND 12),
  stream TEXT NOT NULL CHECK (stream IN ('Science', 'Arts')),
  admission_fee DECIMAL(10,2) DEFAULT 300.00,
  term_1_fee DECIMAL(10,2),
  term_2_fee DECIMAL(10,2),
  term_3_fee DECIMAL(10,2),
  exam_fee DECIMAL(10,2) DEFAULT 120.00,
  uniform_fee DECIMAL(10,2) DEFAULT 235.00,
  clubs_charity_fee DECIMAL(10,2) DEFAULT 70.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2.2 Storage Buckets
```sql
-- Document storage bucket
CREATE STORAGE BUCKET admission_documents;

-- Set storage policies for authenticated uploads
```

---

## Phase 3: Front 3.1 Updated Apply Nowend Implementation

### Page
- Multi-step form matching the data structure
- Step 1: Personal Information (Applicant)
- Step 2: Contact Details & Address
- Step 3: Emergency Contact
- Step 4: Academic History (max 3 entries)
- Step 5: Program Selection
- Step 6: Agent Information (optional, for non-Ugandan)
- Step 7: Declaration & Payment
- Step 8: Document Uploads

### 3.2 Supabase Integration
- `lib/supabase/client.ts` - Client-side Supabase client
- `lib/supabase/server.ts` - Server-side Supabase client
- `lib/admissions.ts` - API functions for CRUD operations

### 3.3 Form Components
- Reuse existing UI components (Button, Input, Select, etc.)
- Create form validation with Zod
- Multi-step navigation with progress indicator

---

## Phase 4: API Routes (if needed)

- `app/api/applications/route.ts` - POST new application
- `app/api/applications/[id]/route.ts` - GET/PUT application
- `app/api/programs/route.ts` - GET available programs
- `app/api/tuition/route.ts` - GET tuition structure

---

## Business Rules Implementation

### 4.1 Validation Rules
- [ ] Application fee ($300) must be paid before submission
- [ ] Only ONE program per application
- [ ] Intake months limited to: Jan, Mar, May, Sep
- [ ] Academic history max 3 entries
- [ ] Tuition calculated by (grade + stream)
- [ ] Agent optional for international applicants
- [ ] Admissions open year-round

### 4.2 Form Validation
```typescript
// Sample Zod schema
const applicationSchema = z.object({
  applicant: applicantSchema,
  application: z.object({
    academic_year: z.string(),
    intake_month: z.enum(['January', 'March', 'May', 'September']),
    program_id: z.string().uuid(),
    has_agent: z.boolean(),
    declaration_signed: z.literal(true),
  }),
  academic_history: z.array(academicHistorySchema).max(3),
  agent: agentSchema.optional(),
});
```

---

## Phase 5: Environment Setup

### 5.1 Required Environment Variables (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 5.2 Documentation
- Create `supabase/SETUP.md` with setup instructions
- Document API usage and examples
- Include migration scripts

---

## Implementation Order

1. Install dependencies
2. Create Supabase config files
3. Create TypeScript types
4. Create database schema SQL file
5. Update Apply Now page with multi-step form
6. Implement Supabase client
7. Create admissions API functions
8. Add document upload functionality
9. Implement payment validation
10. Test and verify

---

## Files to Create/Modify

### New Files:
- `lib/supabase/client.ts`
- `lib/supabase/server.ts`
- `lib/supabase/middleware.ts`
- `lib/admissions.ts`
- `types/database.ts`
- `supabase/schema.sql`
- `supabase/SETUP.md`
- `app/admissions/apply-now/components/*` (if needed)

### Modified Files:
- `app/admissions/apply-now/page.tsx` - Complete rewrite
- `.env.local` - Add Supabase credentials
- `package.json` - Add dependencies

---

## Timeline Estimate
- Phase 1: 1 hour
- Phase 2: 2 hours (including schema review)
- Phase 3: 4-6 hours (main implementation)
- Phase 4: 1 hour
- Phase 5: 30 minutes

**Total: 8-10 hours**

