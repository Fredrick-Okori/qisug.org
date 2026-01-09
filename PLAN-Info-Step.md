# Apply Now Multi-Step Form Landing Page (Step 1)

## Information Gathered

### Current State Analysis
1. **`app/admissions/apply-now/page.tsx`** - Currently a single-page application form with:
   - Personal information form fields
   - Contact information form fields
   - Academic information form fields
   - Document upload section
   - Form submission directly from the main page
   - Success/error handling with reference number display

2. **TODO-MultiStep-Form.md** - Defines the 5-step multi-step form architecture:
   - **Step 1 (Current)**: Info Step - Information page with disclaimers, school info, application fee ($300 USD non-refundable), "Proceed to Apply" button
   - **Step 2**: Fill Form Step - Application form (personal, contact, academic, documents, declaration)
   - **Step 3**: Reference Number Step - After form submission with bank info
   - **Step 4**: Payments Step - Upload payment slip
   - **Step 5**: Success Step - Final success page with confetti

3. **Design System Identified**:
   - **Primary Colors**: Yellow/Gold (#EFBF04), Blue (#053F52), Cyan (#20cece)
   - **Typography**: Crimson Pro (serif) for headings, Inter (sans-serif) for body text
   - **Animations**: Framer Motion for smooth transitions
   - **Layout**: Two-column grid layout on desktop, full-width on mobile
   - **Background**: Pattern overlay with color tint
   - **Components**: BlueSiteHeader, MainSiteFooter, motion components

4. **Key Dependencies**:
   - `framer-motion` for animations
   - `lucide-react` for icons
   - `@/components/blue-header` for site header
   - `@/components/main-footer` for site footer

---

## Plan

### Objective
Create a visually appealing, informative landing page (Step 1) for the apply-now multi-step form wizard that:
- Introduces Queensgate International School
- Displays important application information and disclaimers
- Shows application fee details ($300 USD non-refundable)
- Provides a clear call-to-action to proceed to the application form
- Uses consistent design patterns from the existing site

### Implementation Details

#### File: `app/admissions/apply-now/page.tsx`

**Major Changes:**
1. Add state management for multi-step navigation (currentStep: 1-5)
2. Replace current single-form layout with stepper-based layout
3. Create InfoStep component (Step 1) as the landing page
4. Create placeholder components for subsequent steps (to be implemented later)
5. Implement smooth step transitions using Framer Motion

**InfoStep (Step 1) Components:**
- School introduction section with image
- Key information cards:
  - Application Fee: $300 USD (non-refundable)
  - Multiple admission periods (September, January, April)
  - Required documents checklist
  - Important deadlines and timelines
- Disclaimer section with checkbox requirement
- "Proceed to Apply" button to advance to Step 2

**Design Specifications:**
- Use yellow background (#EFBF04) with pattern overlay
- Two-column layout: Left column for introduction and info, Right column for key details and CTA
- Serif font (Crimson Pro) for headings, Sans-serif (Inter) for body text
- Animated transitions between steps
- Responsive design for mobile and desktop

---

## Dependent Files to be Edited

### Primary File:
- `app/admissions/apply-now/page.tsx` - Main multi-step form implementation

### No External Dependencies:
- No new components needed (use existing UI components)
- No API route changes needed
- No database schema changes needed
- No new library installations required

---

## Followup Steps

1. **Implement Step 1 (Info Step) - CURRENT TASK**
   - Create landing page with school info and disclaimers
   - Add "Proceed to Apply" button functionality
   - Style with consistent design patterns

2. **Step 2 (Fill Form Step) - Next Task**
   - Migrate existing form fields to this step
   - Add validation and form state management
   - Implement document upload functionality

3. **Step 3 (Reference Number Step) - Future Task**
   - Display generated application reference
   - Show bank payment information (ABSA)
   - Add download PDF button

4. **Step 4 (Payments Step) - Future Task**
   - Implement payment slip upload
   - Add payment verification UI

5. **Step 5 (Success Step) - Future Task**
   - Create congratulations page
   - Add confetti animation (canvas-confetti)
   - Display next steps information

6. **Testing**
   - Test step navigation flow
   - Verify responsive design
   - Test form validation
   - Test document uploads

---

## Technical Notes

### State Management:
```typescript
const [currentStep, setCurrentStep] = useState(1)
const [formData, setFormData] = useState({...})
```

### Step Transition:
```typescript
const nextStep = () => setCurrentStep(prev => prev + 1)
const prevStep = () => setCurrentStep(prev => prev - 1)
```

### Animation:
Use Framer Motion `AnimatePresence` for smooth step transitions:
```typescript
<AnimatePresence mode="wait">
  {currentStep === 1 && <InfoStep key="step1" />}
  {currentStep === 2 && <FormStep key="step2" />}
  // ...
</AnimatePresence>
```

---

## File Structure (After Implementation)

```
app/admissions/apply-now/
├── page.tsx                  # Main multi-step form with all steps
└── components/               # (Optional) Step-specific components
    ├── info-step.tsx         # Step 1: Information page
    ├── form-step.tsx         # Step 2: Application form
    ├── reference-step.tsx    # Step 3: Reference number display
    ├── payment-step.tsx      # Step 4: Payment upload
    └── success-step.tsx      # Step 5: Success page
```

---

## Implementation Priority

1. **HIGH**: InfoStep (Step 1) - Landing page with school info and disclaimers
2. **HIGH**: Step navigation and state management
3. **MEDIUM**: FormStep (Step 2) - Application form with validation
4. **MEDIUM**: ReferenceStep (Step 3) - Reference number and bank info
5. **LOW**: PaymentStep (Step 4) - Payment slip upload
6. **LOW**: SuccessStep (Step 5) - Final success page

---

*Document created for multi-step form implementation planning*

