# Admin Classes Dashboard Implementation Plan

## Task
Update `/app/dashboard/admin/classes/page.tsx` to:
1. Fetch all approved applicants with their programs, grade, and stream
2. Display applicants grouped by class/program
3. Allow updating program/grade/stream assignments

## Files to Create/Update

### 1. New API Endpoint
- `app/api/admin/classes/route.ts` - GET/PATCH for classes data

### 2. Update Frontend
- `app/dashboard/admin/classes/page.tsx` - Replace mock data with real data

### 3. Update Types
- `types/database.ts` - Add ClassApplicant interface

## Implementation Steps

### Step 1: Create API Endpoint (`app/api/admin/classes/route.ts`)
- GET: Fetch all programs + approved applicants grouped by program
- PATCH: Update applicant's program_id

### Step 2: Update Classes Page
- Remove mock data
- Add API fetch for programs and applicants
- Show classes as cards with capacity/enrollment
- Show applicant list per class
- Add modal to reassign applicants to different programs

### Step 3: Data Flow
```
API /api/admin/classes
  ├── programs: { id, grade, stream, name }
  └── applicants: { id, first_name, last_name, email, program_id }
  
Frontend
  ├── Classes Grid: Programs with applicant counts
  └── Applicants List: Show applicants per class with reassign option
```

## Database Schema Reference
- `programs` table: id, grade, stream, name
- `applications` table: id, applicant_id, program_id, status='Approved'
- `applicants` table: id, first_name, last_name, email

## UI Components
1. **Stats Cards**: Total classes, total students, capacity overview
2. **Classes Grid**: Cards showing each program with enrollment
3. **Applicants Table**: List of applicants per class
4. **Reassign Modal**: Change applicant's program/stream

