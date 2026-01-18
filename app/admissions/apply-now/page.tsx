'use client';

import { BlueSiteHeader } from '@/components/blue-header';
import { MainSiteFooter } from '@/components/main-footer';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient, isSupabaseConfigured, getSupabaseConfigStatus } from '@/lib/supabase/client';
import { Loader2, CheckCircle, AlertCircle, ChevronRight, ChevronLeft, Upload, Download, FileText, RotateCcw } from 'lucide-react';
import { generateApplicationReference, storeReference } from '@/lib/application-reference';
import { submitApplication, uploadDocument, confirmPayment } from '@/lib/admissions';
import { useAuth } from '@/components/auth/auth-context';
import type { CitizenshipType, VisaStatus, IntakeMonth, FullApplicationData } from '@/types/database';
import confetti from 'canvas-confetti';
import jsPDF from 'jspdf';

// Local storage key
const STORAGE_KEY = 'qis_application_progress';

// Step indicator component
const StepIndicator = ({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) => {
  return (
    <div className="flex items-center justify-center mb-8 gap-2">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <React.Fragment key={index}>
          <motion.div
            className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${
              index + 1 < currentStep
                ? 'bg-green-500 text-white'
                : index + 1 === currentStep
                ? 'bg-[#053f52] text-white'
                : 'bg-gray-200 text-gray-500'
            }`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            {index + 1 < currentStep ? <CheckCircle className="w-5 h-5" /> : index + 1}
          </motion.div>
          {index < totalSteps - 1 && (
            <div className={`h-1 w-12 rounded-full ${index + 1 < currentStep ? 'bg-green-500' : 'bg-gray-200'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default function ApplyNowPage() {
  const { user, isSignedIn } = useAuth()
  const [currentStep, setCurrentStep] = useState(1);
  const [supabaseError, setSupabaseError] = useState<string | null>(null);
  const [supabaseConfigStatus, setSupabaseConfigStatus] = useState<{ configured: boolean; error?: string; url?: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [applicationId, setApplicationId] = useState('');
  const [applicantId, setApplicantId] = useState('');
  const [generatedReference, setGeneratedReference] = useState<string | null>(null);
  const [paymentSlip, setPaymentSlip] = useState<File | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    middleName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    nationality: '',
    
    // Contact Information
    email: '',
    phone: '',
    phoneOther: '',
    
    // Address Information
    addressStreet: '',
    addressCity: '',
    addressDistrict: '',
    addressPostalCode: '',
    addressCountry: '',
    
    // Emergency Contact (Required)
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactEmail: '',
    
    // Academic Information
    currentGrade: '',
    programStream: '',
    previousSchool: '',
    admissionPeriod: '',
    
    // Documents
    transcript: null as File | null,
    passport: null as File | null,
    birthCertificate: null as File | null,
    photo: null as File | null,
  });

  // Load saved progress from localStorage on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem(STORAGE_KEY);
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress);
        
        if (parsed.formData) {
          setFormData(prev => ({
            ...prev,
            ...parsed.formData,
            // Files cannot be restored
            transcript: null,
            passport: null,
            birthCertificate: null,
            photo: null,
          }));
        }
        
        if (parsed.currentStep) setCurrentStep(parsed.currentStep);
        if (parsed.applicationId) setApplicationId(parsed.applicationId);
        if (parsed.applicantId) setApplicantId(parsed.applicantId);
        if (parsed.generatedReference) setGeneratedReference(parsed.generatedReference);
        
        console.log('[LocalStorage] Progress restored from localStorage');
      } catch (error) {
        console.error('[LocalStorage] Failed to parse saved progress:', error);
      }
    }
  }, []);

  // Save progress to localStorage whenever relevant state changes
  useEffect(() => {
    if (currentStep === 5) {
      return;
    }

    const progressData = {
      currentStep,
      formData: {
        firstName: formData.firstName,
        middleName: formData.middleName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        nationality: formData.nationality,
        email: formData.email,
        phone: formData.phone,
        phoneOther: formData.phoneOther,
        addressStreet: formData.addressStreet,
        addressCity: formData.addressCity,
        addressDistrict: formData.addressDistrict,
        addressPostalCode: formData.addressPostalCode,
        addressCountry: formData.addressCountry,
        emergencyContactName: formData.emergencyContactName,
        emergencyContactPhone: formData.emergencyContactPhone,
        emergencyContactEmail: formData.emergencyContactEmail,
        currentGrade: formData.currentGrade,
        programStream: formData.programStream,
        previousSchool: formData.previousSchool,
        admissionPeriod: formData.admissionPeriod,
      },
      applicationId,
      applicantId,
      generatedReference,
      lastSaved: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(progressData));
  }, [currentStep, formData, applicationId, applicantId, generatedReference]);

  // Clear localStorage and reset form
  const clearProgress = () => {
    localStorage.removeItem(STORAGE_KEY);
    
    setCurrentStep(1);
    setFormData({
      firstName: '',
      middleName: '',
      lastName: '',
      dateOfBirth: '',
      gender: '',
      nationality: '',
      email: '',
      phone: '',
      phoneOther: '',
      addressStreet: '',
      addressCity: '',
      addressDistrict: '',
      addressPostalCode: '',
      addressCountry: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
      emergencyContactEmail: '',
      currentGrade: '',
      programStream: '',
      previousSchool: '',
      admissionPeriod: '',
      transcript: null,
      passport: null,
      birthCertificate: null,
      photo: null,
    });
    setApplicationId('');
    setApplicantId('');
    setGeneratedReference(null);
    setPaymentSlip(null);
    setSubmitStatus('idle');
    setErrorMessage('');
    setShowClearConfirm(false);
    
    console.log('[LocalStorage] Progress cleared');
  };

  // Check Supabase configuration on mount
  useEffect(() => {
    const status = getSupabaseConfigStatus();
    setSupabaseConfigStatus(status);
    
    if (!status.configured) {
      setSupabaseError(status.error || 'Supabase is not properly configured. Please check your environment variables.');
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'file') {
      const fileInput = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: fileInput.files?.[0] || null
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFormSubmit = async () => {
    if (!isSupabaseConfigured()) {
      setSubmitStatus('error');
      setErrorMessage('Supabase is not properly configured. Please contact support.');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const supabase = createClient();

      // Get program ID based on grade and stream
      const grade = parseInt(formData.currentGrade);
      const stream = formData.programStream;
      
      const { data: program, error: programError } = await supabase
        .from('programs')
        .select('id')
        .eq('grade', grade)
        .eq('stream', stream)
        .single();

      if (programError || !program) {
        console.error('[ApplyNow] Program lookup failed:', programError);
        throw new Error(`Program not found for Grade ${grade} - ${stream}. Please check your selections.`);
      }

      console.log('[ApplyNow] Program found:', program.id);

      // Determine citizenship type
      const citizenshipType: CitizenshipType = formData.nationality.toLowerCase().includes('uganda') 
        ? 'Ugandan' 
        : 'Non-Ugandan';

      const visaStatus: VisaStatus = citizenshipType === 'Ugandan' 
        ? null  // Ugandans don't need a visa
        : 'Student Visa' as VisaStatus;  // Non-Ugandans need student visa for school

      // Map intake period
      const intakeMonthMap: Record<string, string> = {
        'september': 'September',
        'january': 'January',
        'april': 'April',
      };

      // Prepare application data according to API schema
      const applicationData = {
        applicant: {
          firstName: formData.firstName,
          middleName: formData.middleName || undefined,
          preferredName: undefined,
          formerLastName: undefined,
          lastName: formData.lastName,
          birthDate: formData.dateOfBirth,
          gender: (formData.gender === 'male' ? 'Male' : formData.gender === 'female' ? 'Female' : 'Other') as 'Male' | 'Female' | 'Other',
          citizenshipType: citizenshipType as CitizenshipType,
          citizenshipCountry: formData.nationality,
          visaStatus: visaStatus,
          email: formData.email,
          phonePrimary: formData.phone,
          phoneOther: formData.phoneOther || undefined,
          address: {
            street: formData.addressStreet,
            city: formData.addressCity,
            district: formData.addressDistrict || '',
            postalCode: formData.addressPostalCode || '',
            country: formData.addressCountry,
          },
          emergencyContact: {
            name: formData.emergencyContactName,
            phone: formData.emergencyContactPhone,
            email: formData.emergencyContactEmail || undefined,
          },
        },
        application: {
          academicYear: '2026/2027',
          intakeMonth: (intakeMonthMap[formData.admissionPeriod] || 'September') as IntakeMonth,
          programId: program.id,
          hasAgent: false,
        },
        academicHistory: [
          {
            schoolName: formData.previousSchool,
            province: formData.addressCity,
            country: formData.addressCountry,
            startDate: '2020-01-01',
            endDate: '2024-12-31',
            gradeCompleted: `Grade ${grade - 1}`,
          }
        ],
        agent: undefined,
      };

      console.log('[ApplyNow] Submitting application...');
      
      // Submit application using API
      const result = await submitApplication(applicationData as FullApplicationData);

      if (!result.success || !result.data) {
        throw new Error('Failed to submit application');
      }

      const { applicantId, applicationId } = result.data;
      
      console.log('[ApplyNow] Application created:', applicationId);
      console.log('[ApplyNow] Applicant created:', applicantId);
      
      setApplicationId(applicationId);
      setApplicantId(applicantId);

      // Upload documents
      console.log('[ApplyNow] Uploading documents...');
      
      if (formData.transcript) {
        console.log('[ApplyNow] Uploading transcript...');
        const transcriptResult = await uploadDocument(applicationId, 'transcript', formData.transcript);
        if (!transcriptResult.success) {
          throw new Error('Failed to upload transcript');
        }
        console.log('[ApplyNow] Transcript uploaded successfully');
      }

      if (formData.passport) {
        console.log('[ApplyNow] Uploading passport...');
        const passportResult = await uploadDocument(applicationId, 'passport', formData.passport);
        if (!passportResult.success) {
          throw new Error('Failed to upload passport');
        }
        console.log('[ApplyNow] Passport uploaded successfully');
      }

      if (formData.birthCertificate) {
        console.log('[ApplyNow] Uploading birth certificate...');
        const birthCertResult = await uploadDocument(applicationId, 'birth_certificate', formData.birthCertificate);
        if (!birthCertResult.success) {
          throw new Error('Failed to upload birth certificate');
        }
        console.log('[ApplyNow] Birth certificate uploaded successfully');
      }

      if (formData.photo) {
        console.log('[ApplyNow] Uploading photo...');
        const photoResult = await uploadDocument(applicationId, 'photo', formData.photo);
        if (!photoResult.success) {
          throw new Error('Failed to upload photo');
        }
        console.log('[ApplyNow] Photo uploaded successfully');
      }

      // Generate application reference and update applicant record
      console.log('[ApplyNow] Generating reference...');
      const reference = generateApplicationReference();
      setGeneratedReference(reference);
      storeReference(reference);
      
      // Update applicant record with reference AND user_id if logged in
      const { error: updateError } = await supabase
        .from('applicants')
        .update({ 
          qis_id: reference,
          ...(user?.id ? { user_id: user.id } : {})
        })
        .eq('id', applicantId);

      if (updateError) {
        console.error('[ApplyNow] Reference update failed:', updateError);
      } else {
        console.log('[ApplyNow] Reference and user_id saved to applicant record');
      }

  console.log('[ApplyNow] Application submitted successfully');

      // Send confirmation email to applicant via server-side API
      console.log('[ApplyNow] Sending confirmation email...');
      try {
        const emailResponse = await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: formData.email,
            subject: `Application Received - Reference ${reference}`,
            applicantName: `${formData.firstName} ${formData.lastName}`,
            referenceNumber: reference,
            grade: formData.currentGrade,
            stream: formData.programStream,
            admissionPeriod: formData.admissionPeriod ? formData.admissionPeriod.charAt(0).toUpperCase() + formData.admissionPeriod.slice(1) : '',
            emailType: 'application_submitted',
          }),
        });
        
        if (emailResponse.ok) {
          const emailResult = await emailResponse.json();
          console.log('[ApplyNow] Confirmation email sent successfully:', emailResult);
        } else {
          const errorText = await emailResponse.text();
          console.warn('[ApplyNow] Failed to send confirmation email:', errorText);
        }
      } catch (emailError) {
        console.error('[ApplyNow] Error sending confirmation email:', emailError);
      }

      // Send admin notification for new application
      console.log('[ApplyNow] Sending admin notification for new application...');
      try {
        const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'admissions@qgis.ac.ug';
        
        const adminEmailResponse = await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: adminEmail,
            applicantName: `${formData.firstName} ${formData.lastName}`,
            referenceNumber: reference,
            grade: formData.currentGrade,
            stream: formData.programStream,
            admissionPeriod: formData.admissionPeriod ? formData.admissionPeriod.charAt(0).toUpperCase() + formData.admissionPeriod.slice(1) : '',
            emailType: 'admin_new_application',
          }),
        });
        
        if (adminEmailResponse.ok) {
          const adminEmailResult = await adminEmailResponse.json();
          console.log('[ApplyNow] Admin notification sent successfully:', adminEmailResult);
        } else {
          const errorText = await adminEmailResponse.text();
          console.warn('[ApplyNow] Failed to send admin notification:', errorText);
        }
      } catch (adminEmailError) {
        console.error('[ApplyNow] Error sending admin notification:', adminEmailError);
      }

      setSubmitStatus('success');
      setCurrentStep(3);
      
    } catch (error) {
      console.error('[ApplyNow] Submission error:', error);
      setSubmitStatus('error');
      const userMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setErrorMessage(userMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentSubmit = async () => {
    if (!paymentSlip) {
      setErrorMessage('Please upload your payment slip');
      return;
    }

    if (!applicationId) {
      setErrorMessage('Application ID is missing. Please try submitting your application again.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    
    try {
      console.log('[PaymentUpload] Starting payment slip upload...');
      
      // Upload payment slip
      const paymentResult = await uploadDocument(applicationId, 'payment_slip', paymentSlip);
      
      if (!paymentResult.success) {
        throw new Error('Failed to upload payment slip');
      }

      console.log('[PaymentUpload] Payment slip uploaded successfully');

      // Confirm payment using API
      if (generatedReference) {
        const confirmResult = await confirmPayment(applicationId, generatedReference, 300);
        
        if (!confirmResult.success) {
          console.warn('[PaymentUpload] Payment confirmation failed, but slip was uploaded');
        } else {
          console.log('[PaymentUpload] Payment confirmed successfully');
        }
      }

      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 }
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 }
        });
      }, 250);

      console.log('[PaymentUpload] Payment submission complete!');

      // Send payment receipt email to applicant
      console.log('[PaymentUpload] Sending payment receipt email to applicant...');
      try {
        if (generatedReference) {
          const emailResponse = await fetch('/api/send-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              to: formData.email,
              applicantName: `${formData.firstName} ${formData.lastName}`,
              referenceNumber: generatedReference,
              emailType: 'payment_received',
            }),
          });
          
          if (emailResponse.ok) {
            const emailResult = await emailResponse.json();
            console.log('[PaymentUpload] Payment receipt email sent successfully:', emailResult);
          } else {
            const errorText = await emailResponse.text();
            console.warn('[PaymentUpload] Failed to send payment receipt email:', errorText);
          }
        }
      } catch (emailError) {
        console.error('[PaymentUpload] Error sending payment receipt email:', emailError);
      }

      // Send admin notification for payment received
      console.log('[PaymentUpload] Sending admin notification for payment received...');
      try {
        const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'admissions@qgis.ac.ug';
        
        if (generatedReference) {
          const adminEmailResponse = await fetch('/api/send-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              to: adminEmail,
              applicantName: `${formData.firstName} ${formData.lastName}`,
              referenceNumber: generatedReference,
              emailType: 'admin_payment_received',
            }),
          });
          
          if (adminEmailResponse.ok) {
            const emailResult = await adminEmailResponse.json();
            console.log('[PaymentUpload] Admin notification sent successfully:', emailResult);
          } else {
            const errorText = await adminEmailResponse.text();
            console.warn('[PaymentUpload] Failed to send admin notification:', errorText);
          }
        }
      } catch (adminEmailError) {
        console.error('[PaymentUpload] Error sending admin notification:', adminEmailError);
      }
      
      // Clear localStorage after successful completion
      localStorage.removeItem(STORAGE_KEY);
      console.log('[LocalStorage] Progress cleared after successful completion');
      
      setCurrentStep(5);
    } catch (error: any) {
      console.error('[PaymentUpload] Payment submission error:', error);
      
      let userMessage = 'Failed to submit payment slip. ';
      
      if (error.message?.includes('Invalid API key')) {
        userMessage += 'Configuration error - please contact support.';
      } else if (error.message?.includes('permission')) {
        userMessage += 'Permission error - please contact support.';
      } else if (error.message?.includes('bucket')) {
        userMessage += 'Storage configuration error - please contact support.';
      } else if (error.message) {
        userMessage += error.message;
      } else {
        userMessage += 'Please try again or contact support.';
      }
      
      setErrorMessage(userMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(5, 63, 82);
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text('Queensgate International School', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text('Application Reference Document', 105, 30, { align: 'center' });
    
    // Content
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text('Application Details', 20, 60);
    
    doc.setFontSize(11);
    doc.text(`Name: ${formData.firstName} ${formData.lastName}`, 20, 75);
    doc.text(`Email: ${formData.email}`, 20, 85);
    doc.text(`Phone: ${formData.phone}`, 20, 95);
    doc.text(`Grade: ${formData.currentGrade}`, 20, 105);
    doc.text(`Stream: ${formData.programStream}`, 20, 115);
    
    // Reference number box
    doc.setFillColor(239, 191, 4);
    doc.rect(20, 130, 170, 30, 'F');
    doc.setFontSize(16);
    doc.setTextColor(5, 63, 82);
    doc.text('Payment Reference Number:', 25, 145);
    doc.setFontSize(20);
    doc.text(generatedReference || '', 25, 155);
    
    // Bank details
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text('Bank Payment Instructions', 20, 180);
    
    doc.setFontSize(11);
    doc.text('Bank: I&M Bank (Uganda) Limited', 20, 195);
    doc.text('Account Name: Queensgate International School', 20, 205);
    doc.text('Account Number UGX: 5076029001', 20, 215);
    doc.text('Account Number USD: 5076029002', 20, 225);
    doc.text('Amount: $300 USD (Application Fee)', 20, 235);
    doc.text(`Reference: ${generatedReference}`, 20, 245);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Please present this reference number when making your payment at any I&M Bank branch.', 20, 260);
    doc.text('After payment, upload your payment slip to complete your application.', 20, 270);
    
    // Footer
    doc.setFillColor(5, 63, 82);
    doc.rect(0, 270, 210, 27, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.text('Queensgate International School | admissions@queensgate.ac.ug | +256-XXX-XXXXX', 105, 283, { align: 'center' });
    
    doc.save(`QIS-Application-${generatedReference}.pdf`);
  };

  // Error page for Supabase configuration issues
  if (supabaseError) {
    return (
      <>
        <BlueSiteHeader />
        <div className="min-h-screen pt-[120px] md:pt-[200px] lg:pt-[240px] pb-16 px-6">
          <div className="fixed inset-0 bg-center bg-repeat -z-10" style={{ backgroundImage: "url('/images/pattern.webp')" }} />
          <motion.div className="fixed inset-0 -z-[5]" style={{ backgroundColor: '#EFBF04', opacity: 0.88 }} />
          <motion.div 
            className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center" 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }}
          >
            <motion.div 
              className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
            >
              <AlertCircle className="w-12 h-12 text-red-600" />
            </motion.div>
            
            <motion.h1 
              className="text-3xl md:text-4xl text-[#053f52] mb-4 font-serif"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Configuration Error
            </motion.h1>
            
            <motion.p 
              className="text-lg text-gray-700 mb-6 font-sans"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {supabaseError}
            </motion.p>
            
            <motion.p 
              className="text-gray-600 font-sans"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Please contact the system administrator or check your environment variables.
            </motion.p>
          </motion.div>
        </div>
        <MainSiteFooter />
      </>
    );
  }

  return (
    <>
      <BlueSiteHeader />
      <div className="min-h-screen pt-[120px] md:pt-[200px] lg:pt-[240px] pb-16 px-6">
        <style>{`
          .form-input:focus { outline: none; border-color: #EFBF04; box-shadow: 0 0 0 3px rgba(239, 191, 4, 0.1); }
          .form-select:focus { outline: none; border-color: #EFBF04; box-shadow: 0 0 0 3px rgba(239, 191, 4, 0.1); }
        `}</style>
        <div className="fixed inset-0 bg-center bg-repeat -z-10" style={{ backgroundImage: "url('/images/pattern.webp')" }} />
        <motion.div className="fixed inset-0 -z-[5]" style={{ backgroundColor: '#EFBF04', opacity: 0.88 }} />

       {/* Clear Progress Button - Show on application page and payment upload page only */}
        {(currentStep === 2 || currentStep === 4) && (
          <motion.div 
            className="max-w-7xl mx-auto mb-4 flex justify-end"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <button
              onClick={() => setShowClearConfirm(true)}
              className="bg-red-500  hover:bg-red-600 text-white px-5 py-3 rounded-full font-semibold text-sm flex items-center gap-2 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Clear & Restart
            </button>
          </motion.div>
        )}

        {/* Clear Confirmation Modal */}
        <AnimatePresence>
          {showClearConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
              onClick={() => setShowClearConfirm(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
              >
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                
                <h3 className="text-2xl font-bold text-[#053f52] mb-3 text-center font-serif">
                  Clear All Progress?
                </h3>
                
                <p className="text-gray-700 mb-6 text-center font-sans">
                  This will delete all saved data and restart your application from the beginning. This action cannot be undone.
                </p>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={clearProgress}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Clear All
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          className="max-w-7xl mx-auto" 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }}
        >
          {/* Step 1: Information Page */}
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start"
              >
                {/* Left Side - Image and Title */}
                <div className="flex flex-col gap-8">
                    <motion.h1 
                      className="text-5xl md:text-6xl text-[#053f52] leading-tight font-serif"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                    Apply Now
                  </motion.h1>
                  
                  <motion.div 
                    className="h-1 w-24 bg-[#20cece] rounded-full" 
                    initial={{ opacity: 0, scaleX: 0 }} 
                    animate={{ opacity: 1, scaleX: 1 }} 
                  />
                  
                    <motion.p 
                      className="text-lg text-gray-700 leading-relaxed font-sans"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                    Take the first step toward your educational journey at Queensgate International School.
                  </motion.p>
                  
                  <motion.img 
                    src="/images/02a-header-How-To-Apply-Header-PhotoV3.jpg" 
                    alt="Students at Queensgate International School" 
                    className="rounded-2xl shadow-lg w-full"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                  />
                  
                  <motion.div 
                    className="bg-white rounded-xl p-6 shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <h3 className="text-xl font-bold text-[#053f52] mb-3 font-serif">
                      Need Help?
                    </h3>
                    <p className="text-gray-700 mb-2 font-sans">
                      Contact our admissions team:
                    </p>
                    <a href="mailto:admissions@queensgate.ac.ug" className="text-[#EFBF04] font-semibold hover:underline font-sans">
                      admissions@queensgate.ac.ug
                    </a>
                  </motion.div>
                </div>

                {/* Right Side - Information Content */}
                <motion.div
                  className="bg-white rounded-2xl shadow-xl p-8 md:p-10"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.h2 
                    className="text-3xl md:text-4xl text-[#053f52] mb-6 font-serif"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    Welcome to Queensgate International School
                  </motion.h2>
                  
                  <div className="prose prose-lg max-w-none font-sans">
                    <motion.p 
                      className="text-gray-700 mb-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      Thank you for your interest in Queensgate International School. We are delighted that you are considering our institution for your educational journey.
                    </motion.p>
                    
                    <motion.div 
                      className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-6"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <h3 className="text-xl font-bold text-[#053f52] mb-3 font-serif">
                        Important Information
                      </h3>
                      <ul className="space-y-2 text-gray-700">
                        <li>• All information provided must be accurate and truthful</li>
                        <li>• Required documents must be clear and legible</li>
                        <li>• Application fee: <strong>$300 USD (non-refundable)</strong></li>
                        <li>• Processing time: 5-7 business days</li>
                      </ul>
                    </motion.div>
                    
                    <motion.div 
                      className="bg-yellow-50 border-l-4 border-yellow-500 p-6 mb-6"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <h3 className="text-xl font-bold text-[#053f52] mb-3 font-serif">
                        Required Documents
                      </h3>
                      <ul className="space-y-2 text-gray-700">
                        <li>• Academic transcript (most recent)</li>
                        <li>• Passport or ID bio page</li>
                        <li>• Birth certificate</li>
                        <li>• Passport-sized photograph</li>
                      </ul>
                    </motion.div>
                    
                    <motion.div 
                      className="bg-gray-50 rounded-lg p-6 mb-8"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      <h3 className="text-xl font-bold text-[#053f52] mb-3 font-serif">
                        Application Process
                      </h3>
                      <ol className="space-y-3 text-gray-700">
                        <li>1. Complete the application form</li>
                        <li>2. Receive your payment reference number</li>
                        <li>3. Make payment at any I&M Bank (Uganda) Limited</li>
                        <li>4. Upload your payment slip</li>
                        <li>5. Await confirmation from our admissions team</li>
                      </ol>
                    </motion.div>
                  </div>
                  
                  <motion.div 
                    className="flex justify-center mt-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <motion.button
                      onClick={() => setCurrentStep(2)}
                      className="bg-[#053f52] text-white px-12 py-4 rounded-full font-semibold text-lg hover:shadow-xl transition-all flex items-center gap-2 font-sans"
                      whileHover={{ scale: 1.05 }}
                    >
                      Proceed to Application
                      <ChevronRight className="w-5 h-5" />
                    </motion.button>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}

            {/* Step 2: Application Form */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
              >
                <StepIndicator currentStep={2} totalSteps={5} />
                
                {submitStatus === 'error' && (
                  <motion.div 
                    className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3" 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-red-800">Submission Failed</p>
                      <p className="text-red-700 text-sm">{errorMessage || 'Please try again.'}</p>
                    </div>
                  </motion.div>
                )}

                <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
                  <h2 className="text-3xl font-bold text-[#053f52] mb-8 text-center font-serif">
                    Application Form
                  </h2>

                  <form onSubmit={(e) => { e.preventDefault(); handleFormSubmit(); }}>
                    {/* Personal Information */}
                    <div className="mb-8">
                      <h3 className="text-xl font-bold text-[#053f52] mb-4 pb-2 border-b-2 border-[#EFBF04] font-serif">
                        Personal Information
                      </h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-gray-700 font-semibold mb-2">First Name *</label>
                          <input 
                            type="text" 
                            name="firstName" 
                            value={formData.firstName} 
                            onChange={handleChange} 
                            required 
                            className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg" 
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 font-semibold mb-2">Middle Name</label>
                          <input 
                            type="text" 
                            name="middleName" 
                            value={formData.middleName} 
                            onChange={handleChange} 
                            className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg" 
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 font-semibold mb-2">Last Name *</label>
                          <input 
                            type="text" 
                            name="lastName" 
                            value={formData.lastName} 
                            onChange={handleChange} 
                            required 
                            className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg" 
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 font-semibold mb-2">Date of Birth *</label>
                          <input 
                            type="date" 
                            name="dateOfBirth" 
                            value={formData.dateOfBirth} 
                            onChange={handleChange} 
                            required 
                            className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg" 
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 font-semibold mb-2">Gender *</label>
                          <select 
                            name="gender" 
                            value={formData.gender} 
                            onChange={handleChange} 
                            required 
                            className="form-select w-full px-4 py-3 border border-gray-300 rounded-lg"
                          >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-gray-700 font-semibold mb-2">Nationality *</label>
                          <select 
                            name="nationality" 
                            value={formData.nationality} 
                            onChange={handleChange} 
                            required 
                            className="form-select w-full px-4 py-3 border border-gray-300 rounded-lg"
                          >
                            <option value="">Select Country</option>
                            <option value="Uganda">Uganda</option>
                            <option value="Kenya">Kenya</option>
                            <option value="Tanzania">Tanzania</option>
                            <option value="Rwanda">Rwanda</option>
                            <option value="Burundi">Burundi</option>
                            <option value="South Sudan">South Sudan</option>
                            <option value="Democratic Republic of Congo">Democratic Republic of Congo</option>
                            <option value="United Kingdom">United Kingdom</option>
                            <option value="United States">United States</option>
                            <option value="Canada">Canada</option>
                            <option value="Australia">Australia</option>
                            <option value="India">India</option>
                            <option value="Nigeria">Nigeria</option>
                            <option value="Ghana">Ghana</option>
                            <option value="South Africa">South Africa</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="mb-8">
                      <h3 className="text-xl font-bold text-[#053f52] mb-4 pb-2 border-b-2 border-[#EFBF04] font-serif">
                        Contact Information
                      </h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-gray-700 font-semibold mb-2">Email Address *</label>
                          <input 
                            type="email" 
                            name="email" 
                            value={formData.email} 
                            onChange={handleChange} 
                            required 
                            className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg" 
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 font-semibold mb-2">Primary Phone Number *</label>
                          <input 
                            type="tel" 
                            name="phone" 
                            value={formData.phone} 
                            onChange={handleChange} 
                            required 
                            className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg" 
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-gray-700 font-semibold mb-2">Alternative Phone Number</label>
                          <input 
                            type="tel" 
                            name="phoneOther" 
                            value={formData.phoneOther} 
                            onChange={handleChange} 
                            className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg" 
                          />
                        </div>
                      </div>
                    </div>

                    {/* Address Information */}
                    <div className="mb-8">
                      <h3 className="text-xl font-bold text-[#053f52] mb-4 pb-2 border-b-2 border-[#EFBF04] font-serif">
                        Address Information
                      </h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                          <label className="block text-gray-700 font-semibold mb-2">Street Address *</label>
                          <input 
                            type="text" 
                            name="addressStreet" 
                            value={formData.addressStreet} 
                            onChange={handleChange} 
                            required 
                            placeholder="House number, street name"
                            className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg" 
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 font-semibold mb-2">City *</label>
                          <input 
                            type="text" 
                            name="addressCity" 
                            value={formData.addressCity} 
                            onChange={handleChange} 
                            required 
                            className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg" 
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 font-semibold mb-2">District/State</label>
                          <input 
                            type="text" 
                            name="addressDistrict" 
                            value={formData.addressDistrict} 
                            onChange={handleChange} 
                            className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg" 
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 font-semibold mb-2">Postal Code</label>
                          <input 
                            type="text" 
                            name="addressPostalCode" 
                            value={formData.addressPostalCode} 
                            onChange={handleChange} 
                            className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg" 
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 font-semibold mb-2">Country *</label>
                          <input 
                            type="text" 
                            name="addressCountry" 
                            value={formData.addressCountry} 
                            onChange={handleChange} 
                            required 
                            className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg" 
                          />
                        </div>
                      </div>
                    </div>

                    {/* Emergency Contact */}
                    <div className="mb-8">
                      <h3 className="text-xl font-bold text-[#053f52] mb-4 pb-2 border-b-2 border-[#EFBF04] font-serif">
                        Emergency Contact Information
                      </h3>
                      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4 rounded-r-lg">
                        <p className="text-sm text-blue-800">
                          Please provide details of a person we can contact in case of emergency.
                        </p>
                      </div>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-gray-700 font-semibold mb-2">Contact Name *</label>
                          <input 
                            type="text" 
                            name="emergencyContactName" 
                            value={formData.emergencyContactName} 
                            onChange={handleChange} 
                            required 
                            placeholder="Full name"
                            className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg" 
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 font-semibold mb-2">Contact Phone *</label>
                          <input 
                            type="tel" 
                            name="emergencyContactPhone" 
                            value={formData.emergencyContactPhone} 
                            onChange={handleChange} 
                            required 
                            className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg" 
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-gray-700 font-semibold mb-2">Contact Email</label>
                          <input 
                            type="email" 
                            name="emergencyContactEmail" 
                            value={formData.emergencyContactEmail} 
                            onChange={handleChange} 
                            className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg" 
                          />
                        </div>
                      </div>
                    </div>

                    {/* Academic Information */}
                    <div className="mb-8">
                      <h3 className="text-xl font-bold text-[#053f52] mb-4 pb-2 border-b-2 border-[#EFBF04] font-serif">
                        Academic Information
                      </h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-gray-700 font-semibold mb-2">Applying for Grade *</label>
                          <select 
                            name="currentGrade" 
                            value={formData.currentGrade} 
                            onChange={handleChange} 
                            required 
                            className="form-select w-full px-4 py-3 border border-gray-300 rounded-lg"
                          >
                            <option value="">Select Grade</option>
                            <option value="8">Grade 8</option>
                            <option value="9">Grade 9</option>
                            <option value="10">Grade 10</option>
                            <option value="11">Grade 11</option>
                            <option value="12">Grade 12</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-gray-700 font-semibold mb-2">Program Stream *</label>
                          <select 
                            name="programStream" 
                            value={formData.programStream} 
                            onChange={handleChange} 
                            required 
                            className="form-select w-full px-4 py-3 border border-gray-300 rounded-lg"
                          >
                            <option value="">Select Program</option>
                            <option value="Science">Science</option>
                            <option value="Arts">Arts</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-gray-700 font-semibold mb-2">Admission Period *</label>
                          <select 
                            name="admissionPeriod" 
                            value={formData.admissionPeriod} 
                            onChange={handleChange} 
                            required 
                            className="form-select w-full px-4 py-3 border border-gray-300 rounded-lg"
                          >
                            <option value="">Select Period</option>
                            <option value="september">September 2026</option>
                            <option value="january">January 2027</option>
                            <option value="april">April 2027</option>
                          </select>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-gray-700 font-semibold mb-2">Previous/Current School *</label>
                          <input 
                            type="text" 
                            name="previousSchool" 
                            value={formData.previousSchool} 
                            onChange={handleChange} 
                            required 
                            placeholder="Name of your current or most recent school"
                            className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg" 
                          />
                        </div>
                      </div>
                    </div>

                    {/* Required Documents */}
                    <div className="mb-8">
                      <h3 className="text-xl font-bold text-[#053f52] mb-4 pb-2 border-b-2 border-[#EFBF04] font-serif">
                        Required Documents
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-gray-700 font-semibold mb-2">Academic Transcript *</label>
                          <input 
                            type="file" 
                            name="transcript" 
                            onChange={handleChange} 
                            accept=".pdf,.jpg,.jpeg,.png" 
                            required 
                            className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg" 
                          />
                          <p className="text-sm text-gray-500 mt-1">Most recent report card or transcript</p>
                        </div>
                        <div>
                          <label className="block text-gray-700 font-semibold mb-2">Passport/ID Bio Page *</label>
                          <input 
                            type="file" 
                            name="passport" 
                            onChange={handleChange} 
                            accept=".pdf,.jpg,.jpeg,.png" 
                            required 
                            className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg" 
                          />
                          <p className="text-sm text-gray-500 mt-1">Clear copy of passport bio page or national ID</p>
                        </div>
                        <div>
                          <label className="block text-gray-700 font-semibold mb-2">Birth Certificate *</label>
                          <input 
                            type="file" 
                            name="birthCertificate" 
                            onChange={handleChange} 
                            accept=".pdf,.jpg,.jpeg,.png" 
                            required 
                            className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg" 
                          />
                          <p className="text-sm text-gray-500 mt-1">Official birth certificate</p>
                        </div>
                        <div>
                          <label className="block text-gray-700 font-semibold mb-2">Passport Photo *</label>
                          <input 
                            type="file" 
                            name="photo" 
                            onChange={handleChange} 
                            accept=".jpg,.jpeg,.png" 
                            required 
                            className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg" 
                          />
                          <p className="text-sm text-gray-500 mt-1">Recent passport-sized photograph</p>
                        </div>
                      </div>
                    </div>

                    {/* Declaration */}
                    <div className="mb-8">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input type="checkbox" required className="mt-1 w-5 h-5 text-[#EFBF04] border-gray-300 rounded" />
                        <span className="text-gray-700">
                          I confirm that all information provided is accurate and truthful. I agree to the terms and conditions of Queensgate International School and understand that false information may result in application rejection. *
                        </span>
                      </label>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between items-center">
                      <motion.button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="bg-gray-200 text-gray-700 px-8 py-3 rounded-full font-semibold hover:bg-gray-300 transition-all flex items-center gap-2"
                        whileHover={{ scale: 1.05 }}
                      >
                        <ChevronLeft className="w-5 h-5" />
                        Back
                      </motion.button>
                      
                      <motion.button 
                        type="submit" 
                        disabled={isSubmitting} 
                        className={`bg-[#053f52] text-white px-12 py-4 rounded-full font-semibold text-lg hover:shadow-xl transition-all ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                        whileHover={!isSubmitting ? { scale: 1.05 } : {}}
                      >
                        {isSubmitting ? (
                          <span className="flex items-center gap-2">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Saving...
                          </span>
                        ) : (
                          'Next Step'
                        )}
                      </motion.button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}

            {/* Step 3: Reference Number Display */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
              >
                <StepIndicator currentStep={3} totalSteps={5} />
                
                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
                  <div className="max-w-3xl mx-auto text-center">
                    <motion.div 
                      className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: 'spring' }}
                    >
                      <FileText className="w-12 h-12 text-blue-600" />
                    </motion.div>
                    
                    <h2 className="text-3xl md:text-4xl text-[#053f52] mb-4 font-serif">
                     One More Step to Go
                    </h2>
                    
                    <p className="text-lg text-gray-700 mb-8 font-sans">
                      Your information & documents has been sent successfully. Here is your payment reference number for bnak payments:
                    </p>

                    {/* Reference Number Box */}
                    <motion.div 
                      className="bg-[#053f52] rounded-xl p-8 mb-8"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <p className="text-white/70 text-sm mb-3 font-sans">
                        Payment Reference Number
                      </p>
                      <p className="text-4xl md:text-5xl font-mono font-bold text-[#EFBF04] mb-4">
                        {generatedReference}
                      </p>
                      <button
                        onClick={() => {
                          if (generatedReference) {
                            navigator.clipboard.writeText(generatedReference);
                          }
                        }}
                        className="text-white/80 hover:text-white text-sm underline"
                      >
                        Click to copy
                      </button>
                    </motion.div>

                    {/* Application Summary */}
                    <motion.div 
                      className="bg-gray-50 rounded-lg p-6 mb-8 text-left"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                    <h3 className="font-semibold text-[#053f52] mb-4 text-center font-sans">
                        Application Summary
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Name:</span>
                          <span className="ml-2 font-semibold">{formData.firstName} {formData.lastName}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Grade:</span>
                          <span className="ml-2 font-semibold">Grade {formData.currentGrade}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Stream:</span>
                          <span className="ml-2 font-semibold">{formData.programStream}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Email:</span>
                          <span className="ml-2 font-semibold">{formData.email}</span>
                        </div>
                        <div className="md:col-span-2">
                          <span className="text-gray-600">Intake:</span>
                          <span className="ml-2 font-semibold capitalize">{formData.admissionPeriod}</span>
                        </div>
                      </div>
                    </motion.div>

                    {/* Bank Information */}
                    <motion.div 
                      className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8 text-left"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                    <h3 className="font-semibold text-[#053f52] mb-4 font-sans">
                        Bank Payment Instructions
                      </h3>
                      <div className="space-y-2 text-gray-700 font-sans">
                        <p><strong>Bank:</strong> I&M Bank (Uganda) Limited</p>
                        <p><strong>Account Name:</strong> Queensgate International School</p>
                        <p><strong>Account Number UGX:</strong> 5076029001</p>
                        <p><strong>Account Number USD:</strong> 5076029002</p>
                        <p><strong>Amount:</strong> $300 USD (Application Fee)</p>
                        <p><strong>Reference:</strong> {generatedReference}</p>
                      </div>
                      <p className="text-sm text-gray-600 mt-4">
                        Please present this reference number when making your payment at any I&M Bank.
                      </p>
                    </motion.div>

                    {/* Download PDF Button */}
                    <motion.div 
                      className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <button
                        onClick={generatePDF}
                        className="bg-[#20cece] text-[#053f52] px-8 py-3 rounded-full font-semibold hover:bg-[#20cece]/90 transition-all flex items-center justify-center gap-2"
                      >
                        <Download className="w-5 h-5" />
                        Download PDF
                      </button>
                    </motion.div>

                    {/* Next Step Button */}
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      <button
                        onClick={() => setCurrentStep(4)}
                        className="bg-[#053f52] text-white px-12 py-4 rounded-full font-semibold text-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 mx-auto"
                      >
                        Upload Payment Slip
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Payment Upload */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
              >
                <StepIndicator currentStep={4} totalSteps={5} />
                
                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
                  <div className="max-w-2xl mx-auto">
                    <h2 className="text-3xl md:text-4xl text-[#053f52] mb-6 text-center font-serif">
                      Upload Payment Slip
                    </h2>
                    
                    <p className="text-center text-gray-700 mb-8 font-sans">
                      After making your payment at the bank, please upload your payment slip to complete your application.
                    </p>

                    {errorMessage && (
                      <motion.div 
                        className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3" 
                        initial={{ opacity: 0, y: -10 }} 
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                        <p className="text-red-700 text-sm">{errorMessage}</p>
                      </motion.div>
                    )}

                    {/* Upload Area */}
                    <div className="mb-8">
                      <label className="block text-center">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 hover:border-[#EFBF04] transition-colors cursor-pointer">
                          <Upload className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                          <p className="text-gray-700 font-semibold mb-2">Click to upload payment slip</p>
                          <p className="text-sm text-gray-500">PNG, JPG or PDF (max 5MB)</p>
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => setPaymentSlip(e.target.files?.[0] || null)}
                            className="hidden"
                          />
                        </div>
                      </label>
                      
                      {paymentSlip && (
                        <motion.div 
                          className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                        >
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <div className="flex-1">
                            <p className="font-semibold text-green-900">{paymentSlip.name}</p>
                            <p className="text-sm text-green-700">{(paymentSlip.size / 1024).toFixed(2)} KB</p>
                          </div>
                        </motion.div>
                      )}
                    </div>

                    {/* Reference Reminder */}
                    <motion.div 
                      className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <p className="text-sm text-gray-700 mb-2">
                        <strong>Your Reference Number:</strong>
                      </p>
                      <p className="text-2xl font-mono font-bold text-[#053f52]">{generatedReference}</p>
                    </motion.div>

                    {/* Navigation Buttons */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                      <motion.button
                        type="button"
                        onClick={() => setCurrentStep(3)}
                        className="bg-gray-200 text-gray-700 px-8 py-3 rounded-full font-semibold hover:bg-gray-300 transition-all flex items-center gap-2"
                        whileHover={{ scale: 1.05 }}
                      >
                        <ChevronLeft className="w-5 h-5" />
                        Back
                      </motion.button>
                      
                      <div className="flex flex-col sm:flex-row gap-3">
                       
                       
                        
                        <motion.button
                          onClick={handlePaymentSubmit}
                          disabled={!paymentSlip || isSubmitting}
                          className={`bg-[#053f52] text-white px-12 py-4 rounded-full font-semibold text-lg hover:shadow-xl transition-all ${
                            !paymentSlip || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                          whileHover={paymentSlip && !isSubmitting ? { scale: 1.05 } : {}}
                        >
                          {isSubmitting ? (
                            <span className="flex items-center gap-2">
                              <Loader2 className="w-5 h-5 animate-spin" />
                              Submitting...
                            </span>
                          ) : (
                            'Complete Application'
                          )}
                        </motion.button>
                      </div>
                    </div>
                    
                    <motion.p 
                      className="text-center text-sm text-gray-500 mt-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      You can skip this step and upload your payment slip later via email to{' '}
                      <a href="mailto:admissions@queensgate.ac.ug" className="text-[#EFBF04] underline">
                        admissions@queensgate.ac.ug
                      </a>
                    </motion.p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 5: Success Page */}
            {currentStep === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="bg-[#efbf04] rounded-2xl shadow-xl p-8 md:p-12">
                  <div className="max-w-2xl mx-auto text-center">
                    <motion.div 
                      className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    >
                      <CheckCircle className="w-16 h-16 text-green-600" />
                    </motion.div>
                    
                    <motion.h1 
                      className="text-4xl md:text-5xl text-[#053f52] mb-6 font-serif"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      Congratulations!
                    </motion.h1>
                    
                    <motion.p 
                      className="text-xl text-gray-700 mb-8 font-sans"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      Your application has been successfully submitted to Queensgate International School.
                    </motion.p>

                    <motion.div 
                      className="rounded-xl p-8 mb-8"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <h3 className="text-xl font-bold text-[#053f52] mb-4 font-serif">
                        What Happens Next?
                      </h3>
                      <div className="text-left space-y-3 font-sans">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-[#053f52] text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">1</div>
                          <p className="text-gray-700">Our admissions team will review your application and documents</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-[#053f52] text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">2</div>
                          <p className="text-gray-700">You will receive a confirmation email at <strong>{formData.email}</strong></p>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-[#053f52] text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">3</div>
                          <p className="text-gray-700">We will contact you within <strong>5-7 business days</strong> regarding next steps</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-[#053f52] text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">4</div>
                          <p className="text-gray-700">Keep your reference number (<strong>{generatedReference}</strong>) for future correspondence</p>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div 
                      className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <p className="text-gray-700 font-sans">
                        <strong>Need help?</strong> Contact our admissions team at{' '}
                        <a href="mailto:admissions@queensgate.ac.ug" className="text-[#EFBF04] font-semibold underline">
                          admissions@queensgate.ac.ug
                        </a>
                      </p>
                    </motion.div>

                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      <a
                        href="/dashboard"
                        className="inline-block bg-[#EFBF04] text-[#053f52] px-12 py-4 rounded-full font-semibold text-lg hover:shadow-xl transition-all"
                      >
                        View My Application
                      </a>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
      <MainSiteFooter />
    </>
  );
}