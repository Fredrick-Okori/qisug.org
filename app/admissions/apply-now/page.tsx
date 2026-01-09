'use client';

import { BlueSiteHeader } from '@/components/blue-header';
import { MainSiteFooter } from '@/components/main-footer';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient, isSupabaseConfigured, getSupabaseConfigStatus, getSupabaseErrorMessage } from '@/lib/supabase/client';
import { Loader2, CheckCircle, AlertCircle, ChevronRight, ChevronLeft, Upload, Download, FileText } from 'lucide-react';
import { generateApplicationReference, storeReference } from '@/lib/application-reference';
import confetti from 'canvas-confetti';
import jsPDF from 'jspdf';

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
  const [currentStep, setCurrentStep] = useState(1);
  const [supabaseError, setSupabaseError] = useState<string | null>(null);
  const [supabaseConfigStatus, setSupabaseConfigStatus] = useState<{ configured: boolean; error?: string; url?: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [applicationId, setApplicationId] = useState('');
  const [generatedReference, setGeneratedReference] = useState<string | null>(null);
  const [paymentSlip, setPaymentSlip] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    nationality: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    currentGrade: '',
    previousSchool: '',
    admissionPeriod: '',
    transcript: null as File | null,
    passport: null as File | null,
    birthCertificate: null as File | null,
    photo: null as File | null,
  });

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

  const uploadDocument = async (supabaseClient: ReturnType<typeof createClient>, file: File, folder: string, applicantId: string): Promise<string> => {
    const fileExtension = file.name.split('.').pop();
    const fileName = `${applicantId}/${folder}/${Date.now()}.${fileExtension}`;
    
    const { data, error } = await supabaseClient.storage
      .from('admission-documents')
      .upload(fileName, file);
    
    if (error) {
      throw new Error(`Failed to upload ${folder}: ${error.message}`);
    }
    
    const { data: urlData } = supabaseClient.storage
      .from('admission-documents')
      .getPublicUrl(data.path);
    
    return urlData.publicUrl;
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

      // Step 1: Create applicant
      console.log('[ApplyNow] Creating applicant...');
      const { data: applicant, error: applicantError } = await supabase
        .from('applicants')
        .insert({
          first_name: formData.firstName,
          last_name: formData.lastName,
          birth_date: formData.dateOfBirth,
          gender: formData.gender === 'male' ? 'Male' : formData.gender === 'female' ? 'Female' : 'Male',
          citizenship_type: formData.nationality.toLowerCase().includes('uganda') ? 'Ugandan' : 'Non-Ugandan',
          citizenship_country: formData.nationality,
          email: formData.email,
          phone_primary: formData.phone,
          address_street: formData.address,
          address_city: formData.city,
          address_country: formData.country,
        })
        .select()
        .single();

      if (applicantError) {
        console.error('[ApplyNow] Applicant creation failed:', applicantError);
        if (applicantError.message.includes('Invalid API key')) {
          throw new Error('Invalid API key. Please check your Supabase configuration.');
        }
        throw new Error(`Failed to create applicant: ${applicantError.message}`);
      }

      console.log('[ApplyNow] Applicant created:', applicant.id);

      // Step 2: Get program ID
      const grade = parseInt(formData.currentGrade);
      const { data: program, error: programError } = await supabase
        .from('programs')
        .select('id')
        .eq('grade', grade)
        .eq('stream', 'Science')
        .single();

      if (programError || !program) {
        console.error('[ApplyNow] Program lookup failed:', programError);
        throw new Error('Program not found. Please check grade selection.');
      }

      // Step 3: Create application
      console.log('[ApplyNow] Creating application...');
      const intakeMonthMap: Record<string, string> = {
        'september': 'September',
        'january': 'January',
        'april': 'April',
        'july': 'May',
      };

      const { data: application, error: appError } = await supabase
        .from('applications')
        .insert({
          applicant_id: applicant.id,
          academic_year: '2026/2027',
          intake_month: intakeMonthMap[formData.admissionPeriod] || 'September',
          program_id: program.id,
          status: 'Submitted',
          declaration_signed: true,
          declaration_date: new Date().toISOString().split('T')[0],
          application_fee_paid: false,
          has_agent: false,
        })
        .select()
        .single();

      if (appError) {
        console.error('[ApplyNow] Application creation failed:', appError);
        if (appError.message.includes('Invalid API key')) {
          throw new Error('Invalid API key. Please check your Supabase configuration.');
        }
        throw new Error(`Failed to create application: ${appError.message}`);
      }

      console.log('[ApplyNow] Application created:', application.id);
      setApplicationId(application.id);

      // Step 4: Create academic history
      await supabase.from('academic_histories').insert({
        application_id: application.id,
        school_name: formData.previousSchool,
        province: formData.city,
        country: formData.country,
        start_date: '2020-01-01',
        end_date: '2024-12-31',
        grade_completed: `Grade ${grade - 1}`,
      });

      // Step 5: Upload documents
      console.log('[ApplyNow] Uploading documents...');
      const uploads = [];
      if (formData.transcript) {
        uploads.push(
          uploadDocument(supabase, formData.transcript, 'transcripts', applicant.id)
            .then(url => 
              supabase.from('application_documents').insert({
                application_id: application.id,
                document_type: 'transcript',
                file_name: formData.transcript!.name,
                file_path: url,
                file_size: formData.transcript!.size,
              })
            )
            .catch(err => console.warn('[ApplyNow] Transcript upload failed:', err))
        );
      }
      if (formData.passport) {
        uploads.push(
          uploadDocument(supabase, formData.passport, 'passports', applicant.id)
            .then(url => 
              supabase.from('application_documents').insert({
                application_id: application.id,
                document_type: 'passport',
                file_name: formData.passport!.name,
                file_path: url,
                file_size: formData.passport!.size,
              })
            )
            .catch(err => console.warn('[ApplyNow] Passport upload failed:', err))
        );
      }
      if (formData.birthCertificate) {
        uploads.push(
          uploadDocument(supabase, formData.birthCertificate, 'birth-certificates', applicant.id)
            .then(url => 
              supabase.from('application_documents').insert({
                application_id: application.id,
                document_type: 'birth_certificate',
                file_name: formData.birthCertificate!.name,
                file_path: url,
                file_size: formData.birthCertificate!.size,
              })
            )
            .catch(err => console.warn('[ApplyNow] Birth certificate upload failed:', err))
        );
      }
      if (formData.photo) {
        uploads.push(
          uploadDocument(supabase, formData.photo, 'photos', applicant.id)
            .then(url => 
              supabase.from('application_documents').insert({
                application_id: application.id,
                document_type: 'photo',
                file_name: formData.photo!.name,
                file_path: url,
                file_size: formData.photo!.size,
              })
            )
            .catch(err => console.warn('[ApplyNow] Photo upload failed:', err))
        );
      }

      await Promise.all(uploads);

      // Step 6: Generate application reference and update applicant record
      const reference = generateApplicationReference();
      setGeneratedReference(reference);
      storeReference(reference);
      
      await supabase
        .from('applicants')
        .update({ qis_id: reference })
        .eq('id', applicant.id);

      console.log('[ApplyNow] Application submitted successfully');
      setSubmitStatus('success');
      setCurrentStep(3); // Move to reference number step
      
    } catch (error) {
      console.error('[ApplyNow] Submission error:', error);
      setSubmitStatus('error');
      const userMessage = getSupabaseErrorMessage(error);
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

    setIsSubmitting(true);
    setErrorMessage(''); // Clear any previous errors
    
    try {
      const supabase = createClient();
      
      console.log('[PaymentUpload] Starting payment slip upload...');
      console.log('[PaymentUpload] Application ID:', applicationId);
      console.log('[PaymentUpload] File name:', paymentSlip.name);
      console.log('[PaymentUpload] File size:', paymentSlip.size);
      
      // Upload payment slip
      const fileExtension = paymentSlip.name.split('.').pop();
      const fileName = `payments/${applicationId}/${Date.now()}.${fileExtension}`;
      
      console.log('[PaymentUpload] Uploading to:', fileName);
      
      const { data, error: uploadError } = await supabase.storage
        .from('admission-documents')
        .upload(fileName, paymentSlip);
      
      if (uploadError) {
        console.error('[PaymentUpload] Upload error:', uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      console.log('[PaymentUpload] Upload successful:', data.path);

      const { data: urlData } = supabase.storage
        .from('admission-documents')
        .getPublicUrl(data.path);

      console.log('[PaymentUpload] Public URL:', urlData.publicUrl);

      // Store payment slip reference
      const { error: docError } = await supabase.from('application_documents').insert({
        application_id: applicationId,
        document_type: 'payment_slip',
        file_name: paymentSlip.name,
        file_path: urlData.publicUrl,
        file_size: paymentSlip.size,
      });

      if (docError) {
        console.error('[PaymentUpload] Document insert error:', docError);
        throw new Error(`Failed to save document record: ${docError.message}`);
      }

      console.log('[PaymentUpload] Document record saved');

      // Update application status
      const { error: updateError } = await supabase
        .from('applications')
        .update({ application_fee_paid: true })
        .eq('id', applicationId);

      if (updateError) {
        console.error('[PaymentUpload] Application update error:', updateError);
        // Don't throw here - payment slip is uploaded, just status update failed
        console.warn('[PaymentUpload] Payment uploaded but status not updated');
      } else {
        console.log('[PaymentUpload] Application status updated');
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
      setCurrentStep(5); // Move to success step
    } catch (error: any) {
      console.error('[PaymentUpload] Payment submission error:', error);
      
      // Provide more specific error messages
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
    
    // Reference number box
    doc.setFillColor(239, 191, 4);
    doc.rect(20, 120, 170, 30, 'F');
    doc.setFontSize(16);
    doc.setTextColor(5, 63, 82);
    doc.text('Payment Reference Number:', 25, 135);
    doc.setFontSize(20);
    doc.text(generatedReference || '', 25, 145);
    
    // Bank details
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text('Bank Payment Instructions', 20, 170);
    
    doc.setFontSize(11);
    doc.text('Bank: ABSA Bank Uganda', 20, 185);
    doc.text('Account Name: Queensgate International School', 20, 195);
    doc.text('Amount: $300 USD (Application Fee)', 20, 205);
    doc.text(`Reference: ${generatedReference}`, 20, 215);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Please present this reference number when making your payment at any ABSA branch.', 20, 235);
    doc.text('After payment, upload your payment slip to complete your application.', 20, 245);
    
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
              className="text-3xl md:text-4xl text-[#053f52] mb-4"
              style={{ fontFamily: "'Crimson Pro', serif" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Configuration Error
            </motion.h1>
            
            <motion.p 
              className="text-lg text-gray-700 mb-6"
              style={{ fontFamily: "'Inter', sans-serif" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {supabaseError}
            </motion.p>
            
            <motion.p 
              className="text-gray-600"
              style={{ fontFamily: "'Inter', sans-serif" }}
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
          @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600;700&family=Inter:wght@400;500;600&display=swap');
          .form-input:focus { outline: none; border-color: #EFBF04; box-shadow: 0 0 0 3px rgba(239, 191, 4, 0.1); }
          .form-select:focus { outline: none; border-color: #EFBF04; box-shadow: 0 0 0 3px rgba(239, 191, 4, 0.1); }
        `}</style>
        <div className="fixed inset-0 bg-center bg-repeat -z-10" style={{ backgroundImage: "url('/images/pattern.webp')" }} />
        <motion.div className="fixed inset-0 -z-[5]" style={{ backgroundColor: '#EFBF04', opacity: 0.88 }} />

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
                    className="text-5xl md:text-6xl text-[#053f52] leading-tight" 
                    style={{ fontFamily: "'Crimson Pro', serif" }}
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
                    className="text-lg text-gray-700 leading-relaxed" 
                    style={{ fontFamily: "'Inter', sans-serif" }}
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
                    <h3 className="text-xl font-bold text-[#053f52] mb-3" style={{ fontFamily: "'Crimson Pro', serif" }}>
                      Need Help?
                    </h3>
                    <p className="text-gray-700 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                      Contact our admissions team:
                    </p>
                    <a href="mailto:admissions@queensgate.ac.ug" className="text-[#EFBF04] font-semibold hover:underline" style={{ fontFamily: "'Inter', sans-serif" }}>
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
                    className="text-3xl md:text-4xl text-[#053f52] mb-6"
                    style={{ fontFamily: "'Crimson Pro', serif" }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    Welcome to Queensgate International School
                  </motion.h2>
                  
                  <div className="prose prose-lg max-w-none" style={{ fontFamily: "'Inter', sans-serif" }}>
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
                      <h3 className="text-xl font-bold text-[#053f52] mb-3" style={{ fontFamily: "'Crimson Pro', serif" }}>
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
                      <h3 className="text-xl font-bold text-[#053f52] mb-3" style={{ fontFamily: "'Crimson Pro', serif" }}>
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
                      <h3 className="text-xl font-bold text-[#053f52] mb-3" style={{ fontFamily: "'Crimson Pro', serif" }}>
                        Application Process
                      </h3>
                      <ol className="space-y-3 text-gray-700">
                        <li>1. Complete the application form</li>
                        <li>2. Receive your payment reference number</li>
                        <li>3. Make payment at any ABSA bank branch</li>
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
                      className="bg-[#053f52] text-white px-12 py-4 rounded-full font-semibold text-lg hover:shadow-xl transition-all flex items-center gap-2"
                      style={{ fontFamily: "'Inter', sans-serif" }}
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
                  <h2 className="text-3xl font-bold text-[#053f52] mb-8 text-center" style={{ fontFamily: "'Crimson Pro', serif" }}>
                    Application Form
                  </h2>

                  <form onSubmit={(e) => { e.preventDefault(); handleFormSubmit(); }}>
                    {/* Personal Information */}
                    <div className="mb-8">
                      <h3 className="text-xl font-bold text-[#053f52] mb-4 pb-2 border-b-2 border-[#EFBF04]" style={{ fontFamily: "'Crimson Pro', serif" }}>
                        Personal Information
                      </h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-gray-700 font-semibold mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>First Name *</label>
                          <input 
                            type="text" 
                            name="firstName" 
                            value={formData.firstName} 
                            onChange={handleChange} 
                            required 
                            className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg" 
                            style={{ fontFamily: "'Inter', sans-serif" }} 
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 font-semibold mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>Last Name *</label>
                          <input 
                            type="text" 
                            name="lastName" 
                            value={formData.lastName} 
                            onChange={handleChange} 
                            required 
                            className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg" 
                            style={{ fontFamily: "'Inter', sans-serif" }} 
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 font-semibold mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>Date of Birth *</label>
                          <input 
                            type="date" 
                            name="dateOfBirth" 
                            value={formData.dateOfBirth} 
                            onChange={handleChange} 
                            required 
                            className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg" 
                            style={{ fontFamily: "'Inter', sans-serif" }} 
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 font-semibold mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>Gender *</label>
                          <select 
                            name="gender" 
                            value={formData.gender} 
                            onChange={handleChange} 
                            required 
                            className="form-select w-full px-4 py-3 border border-gray-300 rounded-lg" 
                            style={{ fontFamily: "'Inter', sans-serif" }}
                          >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                          </select>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-gray-700 font-semibold mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>Nationality *</label>
                          <select 
                            name="nationality" 
                            value={formData.nationality} 
                            onChange={handleChange} 
                            required 
                            className="form-select w-full px-4 py-3 border border-gray-300 rounded-lg" 
                            style={{ fontFamily: "'Inter', sans-serif" }}
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
                      <h3 className="text-xl font-bold text-[#053f52] mb-4 pb-2 border-b-2 border-[#EFBF04]" style={{ fontFamily: "'Crimson Pro', serif" }}>
                        Contact Information
                      </h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-gray-700 font-semibold mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>Email Address *</label>
                          <input 
                            type="email" 
                            name="email" 
                            value={formData.email} 
                            onChange={handleChange} 
                            required 
                            className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg" 
                            style={{ fontFamily: "'Inter', sans-serif" }} 
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 font-semibold mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>Phone Number *</label>
                          <input 
                            type="tel" 
                            name="phone" 
                            value={formData.phone} 
                            onChange={handleChange} 
                            required 
                            className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg" 
                            style={{ fontFamily: "'Inter', sans-serif" }} 
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-gray-700 font-semibold mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>Address *</label>
                          <input 
                            type="text" 
                            name="address" 
                            value={formData.address} 
                            onChange={handleChange} 
                            required 
                            className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg" 
                            style={{ fontFamily: "'Inter', sans-serif" }} 
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 font-semibold mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>City *</label>
                          <input 
                            type="text" 
                            name="city" 
                            value={formData.city} 
                            onChange={handleChange} 
                            required 
                            className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg" 
                            style={{ fontFamily: "'Inter', sans-serif" }} 
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 font-semibold mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>Country *</label>
                          <input 
                            type="text" 
                            name="country" 
                            value={formData.country} 
                            onChange={handleChange} 
                            required 
                            className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg" 
                            style={{ fontFamily: "'Inter', sans-serif" }} 
                          />
                        </div>
                      </div>
                    </div>

                    {/* Academic Information */}
                    <div className="mb-8">
                      <h3 className="text-xl font-bold text-[#053f52] mb-4 pb-2 border-b-2 border-[#EFBF04]" style={{ fontFamily: "'Crimson Pro', serif" }}>
                        Academic Information
                      </h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-gray-700 font-semibold mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>Current Grade/Year *</label>
                          <select 
                            name="currentGrade" 
                            value={formData.currentGrade} 
                            onChange={handleChange} 
                            required 
                            className="form-select w-full px-4 py-3 border border-gray-300 rounded-lg" 
                            style={{ fontFamily: "'Inter', sans-serif" }}
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
                          <label className="block text-gray-700 font-semibold mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>Admission Period *</label>
                          <select 
                            name="admissionPeriod" 
                            value={formData.admissionPeriod} 
                            onChange={handleChange} 
                            required 
                            className="form-select w-full px-4 py-3 border border-gray-300 rounded-lg" 
                            style={{ fontFamily: "'Inter', sans-serif" }}
                          >
                            <option value="">Select Period</option>
                            <option value="september">September 2026</option>
                            <option value="january">January 2027</option>
                            <option value="april">April 2027</option>
                          </select>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-gray-700 font-semibold mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>Previous School *</label>
                          <input 
                            type="text" 
                            name="previousSchool" 
                            value={formData.previousSchool} 
                            onChange={handleChange} 
                            required 
                            className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg" 
                            style={{ fontFamily: "'Inter', sans-serif" }} 
                          />
                        </div>
                      </div>
                    </div>

                    {/* Required Documents */}
                    <div className="mb-8">
                      <h3 className="text-xl font-bold text-[#053f52] mb-4 pb-2 border-b-2 border-[#EFBF04]" style={{ fontFamily: "'Crimson Pro', serif" }}>
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
                        </div>
                      </div>
                    </div>

                    {/* Declaration */}
                    <div className="mb-8">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input type="checkbox" required className="mt-1 w-5 h-5 text-[#EFBF04] border-gray-300 rounded" />
                        <span className="text-gray-700" style={{ fontFamily: "'Inter', sans-serif" }}>
                          I confirm all information is accurate and agree to the terms and conditions of Queensgate International School. *
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
                        style={{ fontFamily: "'Inter', sans-serif" }}
                        whileHover={!isSubmitting ? { scale: 1.05 } : {}}
                      >
                        {isSubmitting ? (
                          <span className="flex items-center gap-2">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Submitting...
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
                    
                    <h2 className="text-3xl md:text-4xl text-[#053f52] mb-4" style={{ fontFamily: "'Crimson Pro', serif" }}>
                      Application Received!
                    </h2>
                    
                    <p className="text-lg text-gray-700 mb-8" style={{ fontFamily: "'Inter', sans-serif" }}>
                      Your application has been submitted successfully. Here is your payment reference number:
                    </p>

                    {/* Reference Number Box */}
                    <motion.div 
                      className="bg-[#053f52] rounded-xl p-8 mb-8"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <p className="text-white/70 text-sm mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>
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
                      <h3 className="font-semibold text-[#053f52] mb-4 text-center" style={{ fontFamily: "'Inter', sans-serif" }}>
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
                          <span className="text-gray-600">Email:</span>
                          <span className="ml-2 font-semibold">{formData.email}</span>
                        </div>
                        <div>
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
                      <h3 className="font-semibold text-[#053f52] mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
                        Bank Payment Instructions
                      </h3>
                      <div className="space-y-2 text-gray-700" style={{ fontFamily: "'Inter', sans-serif" }}>
                        <p><strong>Bank:</strong> ABSA Bank Uganda</p>
                        <p><strong>Account Name:</strong> Queensgate International School</p>
                        <p><strong>Amount:</strong> $300 USD (Application Fee)</p>
                        <p><strong>Reference:</strong> {generatedReference}</p>
                      </div>
                      <p className="text-sm text-gray-600 mt-4">
                        Please present this reference number when making your payment at any ABSA branch.
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
                    <h2 className="text-3xl md:text-4xl text-[#053f52] mb-6 text-center" style={{ fontFamily: "'Crimson Pro', serif" }}>
                      Upload Payment Slip
                    </h2>
                    
                    <p className="text-center text-gray-700 mb-8" style={{ fontFamily: "'Inter', sans-serif" }}>
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
                          type="button"
                          onClick={() => {
                            // Skip to success without uploading payment
                            confetti({
                              particleCount: 50,
                              spread: 60,
                              origin: { y: 0.6 }
                            });
                            setCurrentStep(5);
                          }}
                          className="bg-yellow-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-yellow-600 transition-all"
                          whileHover={{ scale: 1.05 }}
                        >
                          Skip for Now
                        </motion.button>
                        
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
                      className="text-4xl md:text-5xl text-[#053f52] mb-6"
                      style={{ fontFamily: "'Crimson Pro', serif" }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      Congratulations!
                    </motion.h1>
                    
                    <motion.p 
                      className="text-xl text-gray-700 mb-8"
                      style={{ fontFamily: "'Inter', sans-serif" }}
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
                      <h3 className="text-xl font-bold text-[#053f52] mb-4" style={{ fontFamily: "'Crimson Pro', serif" }}>
                        What Happens Next?
                      </h3>
                      <div className="text-left space-y-3" style={{ fontFamily: "'Inter', sans-serif" }}>
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
                      <p className="text-gray-700" style={{ fontFamily: "'Inter', sans-serif" }}>
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
                        href="/"
                        className="inline-block bg-[#053f52] text-white px-12 py-4 rounded-full font-semibold text-lg hover:shadow-xl transition-all"
                      >
                        Return to Homepage
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
