'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BlueSiteHeader } from '@/components/blue-header';
import { MainSiteFooter } from '@/components/main-footer';
import { motion } from 'framer-motion';
import { 
  CheckCircle, Upload, CreditCard, FileText, 
  User, Calendar, GraduationCap, Clock, AlertCircle, Loader2, Mail, Phone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { 
  getStoredReference, 
  clearReference,
  isReferenceValid,
  getReferenceTimestamp
} from '@/lib/application-reference';

interface ApplicationSummary {
  reference: string;
  applicantName: string;
  email: string;
  phone: string;
  grade: string;
  admissionPeriod: string;
  applicationId: string;
  submittedAt: string;
}

const REFERENCE_EXPIRY_HOURS = 48;

export default function SuccessPage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [applicationSummary, setApplicationSummary] = useState<ApplicationSummary | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<{ hours: number; minutes: number } | null>(null);
  const [isExpired, setIsExpired] = useState(false);
  const [paymentSlip, setPaymentSlip] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Check for stored reference and load application
  useEffect(() => {
    const storedRef = getStoredReference();
    
    if (!storedRef || !isReferenceValid(storedRef)) {
      setIsExpired(true);
      return;
    }

    loadApplicationDetails(storedRef);
    updateTimer();
  }, []);

  const updateTimer = () => {
    const timestamp = getReferenceTimestamp();
    if (!timestamp) return;

    const expiryMs = REFERENCE_EXPIRY_HOURS * 60 * 60 * 1000;
    const elapsed = Date.now() - timestamp;
    const remaining = expiryMs - elapsed;

    if (remaining <= 0) {
      setIsExpired(true);
      setTimeRemaining({ hours: 0, minutes: 0 });
    } else {
      const hours = Math.floor(remaining / (1000 * 60 * 60));
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      setTimeRemaining({ hours, minutes });
    }
  };

  useEffect(() => {
    const interval = setInterval(updateTimer, 60000);
    return () => clearInterval(interval);
  }, [applicationSummary]);

  const loadApplicationDetails = async (ref: string) => {
    try {
      const { data: applicant } = await supabase
        .from('applicants')
        .select('*')
        .eq('qis_id', ref)
        .single();

      if (applicant) {
        const { data: application } = await supabase
          .from('applications')
          .select('*')
          .eq('applicant_id', applicant.id)
          .single();

        let programName = 'N/A';
        if (application?.program_id) {
          const { data: program } = await supabase
            .from('programs')
            .select('grade, stream')
            .eq('id', application.program_id)
            .single();
          
          if (program) {
            programName = `Grade ${program.grade} - ${program.stream}`;
          }
        }

        setApplicationSummary({
          reference: ref,
          applicantName: `${applicant.first_name} ${applicant.last_name}`,
          email: applicant.email || 'N/A',
          phone: applicant.phone_primary || 'N/A',
          grade: programName,
          admissionPeriod: application?.intake_month 
            ? `${application.intake_month} ${application.academic_year || new Date().getFullYear()}`
            : 'N/A',
          applicationId: application?.id || 'N/A',
          submittedAt: application?.submitted_at || new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error('Error loading application:', error);
    }
  };

  const handlePaymentSlipUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPaymentSlip(file);
      setUploadError(null);
      setUploadSuccess(false);
    }
  };

  const handleSubmitPaymentSlip = async () => {
    if (!paymentSlip || !applicationSummary) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      // Upload payment slip to storage
      const fileExtension = paymentSlip.name.split('.').pop();
      const fileName = `payment-slips/${applicationSummary.reference}/${Date.now()}.${fileExtension}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('admission-documents')
        .upload(fileName, paymentSlip);

      if (uploadError) {
        throw new Error('Failed to upload payment slip');
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('admission-documents')
        .getPublicUrl(uploadData.path);

      // Save payment slip record
      await supabase.from('payment_slips').insert({
        application_id: applicationSummary.applicationId,
        applicant_id: applicationSummary.reference,
        file_name: paymentSlip.name,
        file_path: urlData.publicUrl,
        file_size: paymentSlip.size,
      });

      // Send email notification (simulated via API call)
      const emailResponse = await fetch('/api/send-payment-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: 'admissions@qisug.ac.ug',
          applicantName: applicationSummary.applicantName,
          reference: applicationSummary.reference,
          email: applicationSummary.email,
          paymentSlipUrl: urlData.publicUrl,
        }),
      });

      if (!emailResponse.ok) {
        console.warn('Email notification failed, but upload was successful');
      }

      setUploadSuccess(true);
      setPaymentSlip(null);
      
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleStartNewApplication = () => {
    clearReference();
    router.push('/admissions/apply-now');
  };

  // Show expired state
  if (isExpired) {
    return (
      <>
        <BlueSiteHeader />
        <div className="min-h-screen pt-[120px] md:pt-[200px] lg:pt-[240px] pb-16 px-6">
          <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600;700&family=Inter:wght@400;500;600&display=swap');
          `}</style>
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
              transition={{ type: 'spring' }}
            >
              <AlertCircle className="w-12 h-12 text-red-600" />
            </motion.div>
            
            <h2 className="text-3xl text-[#053f52] mb-4" style={{ fontFamily: "'Crimson Pro', serif" }}>
              Session Expired
            </h2>
            <p className="text-gray-600 mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
              Your application session has expired. Please start a new application.
            </p>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
              <p className="text-yellow-800" style={{ fontFamily: "'Inter', sans-serif" }}>
                If you've already made the bank payment, please contact admissions with your payment receipt.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={handleStartNewApplication}
                className="bg-[#053f52] text-white hover:bg-[#042a38] rounded-full px-8 py-3"
              >
                Start New Application
              </Button>
              <Button 
                onClick={() => router.push('/contact')}
                variant="outline"
                className="border-2 border-[#053f52] text-[#053f52] hover:bg-[#053f52] hover:text-white rounded-full px-8 py-3"
              >
                Contact Admissions
              </Button>
            </div>
          </motion.div>
        </div>
        <MainSiteFooter />
      </>
    );
  }

  // Show application details with payment slip upload
  return (
    <>
      <BlueSiteHeader />
      <div className="min-h-screen pt-[120px] md:pt-[200px] lg:pt-[240px] pb-16 px-6">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600;700&family=Inter:wght@400;500;600&display=swap');
        `}</style>
        <div className="fixed inset-0 bg-center bg-repeat -z-10" style={{ backgroundImage: "url('/images/pattern.webp')" }} />
        <motion.div className="fixed inset-0 -z-[5]" style={{ backgroundColor: '#EFBF04', opacity: 0.88 }} />
        
        <motion.div 
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Timer Banner */}
          {timeRemaining && !isExpired && (
            <motion.div 
              className="bg-[#053f52] rounded-xl p-4 mb-6 flex items-center justify-between"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6 text-[#EFBF04]" />
                <div>
                  <p className="text-white/70 text-sm">Time remaining to upload payment slip</p>
                  <p className="text-white font-mono font-bold text-xl">
                    {timeRemaining.hours}h {timeRemaining.minutes}m
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Application Header */}
          <motion.div 
            className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center mb-8"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          >
            <motion.div 
              className="w-28 h-28 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
            >
              <CheckCircle className="w-16 h-16 text-green-600" />
            </motion.div>
            
            <motion.h1 
              className="text-3xl md:text-4xl text-[#053f52] mb-4"
              style={{ fontFamily: "'Crimson Pro', serif" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Your Application Has Been Successfully Received!
            </motion.h1>
            
            <motion.p 
              className="text-lg text-gray-700 mb-6"
              style={{ fontFamily: "'Inter', sans-serif" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Our admissions team will review your application and contact you within 24-48 hours.
            </motion.p>
          </motion.div>

          {/* Application Summary */}
          <motion.div 
            className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-[#053f52] mb-6" style={{ fontFamily: "'Crimson Pro', serif" }}>
              Application Summary
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-[#EFBF04]/20 p-2 rounded-lg">
                    <User className="w-5 h-5 text-[#053f52]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Applicant Name</p>
                    <p className="font-semibold text-gray-800">{applicationSummary?.applicantName || 'Loading...'}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-[#EFBF04]/20 p-2 rounded-lg">
                    <FileText className="w-5 h-5 text-[#053f52]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-semibold text-gray-800">{applicationSummary?.email || 'Loading...'}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-[#EFBF04]/20 p-2 rounded-lg">
                    <Calendar className="w-5 h-5 text-[#053f52]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-semibold text-gray-800">{applicationSummary?.phone || 'Loading...'}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-[#20cece]/20 p-2 rounded-lg">
                    <GraduationCap className="w-5 h-5 text-[#053f52]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Grade Applying</p>
                    <p className="font-semibold text-gray-800">{applicationSummary?.grade || 'Loading...'}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-[#20cece]/20 p-2 rounded-lg">
                    <Calendar className="w-5 h-5 text-[#053f52]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Admission Period</p>
                    <p className="font-semibold text-gray-800">{applicationSummary?.admissionPeriod || 'Loading...'}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-[#20cece]/20 p-2 rounded-lg">
                    <CreditCard className="w-5 h-5 text-[#053f52]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Application Fee</p>
                    <p className="font-semibold text-[#053f52]">$300 USD</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Payment Slip Upload */}
          <motion.div 
            className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <h2 className="text-2xl font-bold text-[#053f52] mb-2" style={{ fontFamily: "'Crimson Pro', serif" }}>
              Upload Bank Payment Slip
            </h2>
            <p className="text-gray-600 mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
              Upload your bank payment receipt to confirm your application.
            </p>

            {uploadSuccess ? (
              <motion.div 
                className="bg-green-50 border border-green-200 rounded-xl p-6 text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <motion.div 
                  className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring' }}
                >
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </motion.div>
                <h3 className="text-xl font-bold text-green-800 mb-2">Payment Slip Uploaded!</h3>
                <p className="text-green-700" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Your payment slip has been submitted successfully. Our admissions team will review it and contact you within 24-48 hours.
                </p>
              </motion.div>
            ) : (
              <>
                {uploadError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-red-800">Upload Failed</p>
                      <p className="text-red-700 text-sm">{uploadError}</p>
                    </div>
                  </div>
                )}

                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[#EFBF04] transition-colors">
                  <input
                    type="file"
                    id="payment-slip"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handlePaymentSlipUpload}
                    className="hidden"
                  />
                  <label htmlFor="payment-slip" className="cursor-pointer">
                    <div className="w-16 h-16 bg-[#EFBF04]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Upload className="w-8 h-8 text-[#053f52]" />
                    </div>
                    <p className="text-lg font-semibold text-[#053f52] mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {paymentSlip ? paymentSlip.name : 'Click to upload payment slip'}
                    </p>
                    <p className="text-sm text-gray-500" style={{ fontFamily: "'Inter', sans-serif" }}>
                      PDF, JPG, or PNG (max 10MB)
                    </p>
                  </label>
                </div>

                {paymentSlip && (
                  <div className="mt-6">
                    <Button
                      onClick={handleSubmitPaymentSlip}
                      disabled={isUploading}
                      className="w-full bg-[#053f52] text-white hover:bg-[#042a38] rounded-full py-4 text-lg"
                    >
                      {isUploading ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Uploading...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Upload className="w-5 h-5" />
                          Submit Payment Slip
                        </span>
                      )}
                    </Button>
                  </div>
                )}
              </>
            )}
          </motion.div>

          {/* Bank Payment Instructions */}
          <motion.div 
            className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75 }}
          >
            <h3 className="font-bold text-[#053f52] mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              ABSA Bank Payment Details
            </h3>
            
            {/* ABSA Bank Details */}
            <div className="bg-white rounded-lg p-4 mb-4 border border-yellow-200">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Account Name</p>
                  <p className="font-semibold text-gray-800">Queensgate International School</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Account Number (UGX)</p>
                  <p className="font-mono font-semibold text-gray-800">XXXX-XXXX-XXXX</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Branch</p>
                  <p className="font-semibold text-gray-800">Main Branch</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Swift Code</p>
                  <p className="font-mono font-semibold text-gray-800">ABSAUGKA</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-yellow-200">
              <p className="text-sm text-gray-700 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                <strong>Application Fee:</strong> $300 USD (or UGX equivalent)
              </p>
              <p className="text-sm text-gray-600" style={{ fontFamily: "'Inter', sans-serif" }}>
                After making the payment, please upload your bank payment receipt/slip using the upload section above.
              </p>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Button 
              onClick={() => router.push('/')}
              className="bg-[#053f52] text-white hover:bg-[#042a38] rounded-full px-6 py-3"
            >
              Return Home
            </Button>
          </motion.div>

          {/* Contact Info */}
          <motion.div 
            className="mt-10 bg-white/80 backdrop-blur-sm rounded-xl p-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <h3 className="text-xl font-bold text-[#053f52] mb-4" style={{ fontFamily: "'Crimson Pro', serif" }}>
              Need Help?
            </h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center text-gray-700">
              <a href="mailto:admissions@qisug.ac.ug" className="flex items-center gap-2 hover:text-[#EFBF04]">
                <Mail className="w-5 h-5" />
                admissions@qisug.ac.ug
              </a>
              <a href="tel:+256XXXXXXXX" className="flex items-center gap-2 hover:text-[#EFBF04]">
                <Phone className="w-5 h-5" />
                +256 XXX XXXXXX
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
      <MainSiteFooter />
    </>
  );
}

