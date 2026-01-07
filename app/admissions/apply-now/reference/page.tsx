'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BlueSiteHeader } from '@/components/blue-header';
import { MainSiteFooter } from '@/components/main-footer';
import { motion } from 'framer-motion';
import { Loader2, Search, RefreshCw, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { 
  hasValidStoredReference, 
  getStoredReference, 
  storeReference, 
  clearReference,
  validateReferenceInDatabase,
  createNewApplicantWithReference,
  generateApplicationReference
} from '@/lib/application-reference';

export default function ReferenceEntryPage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [referenceInput, setReferenceInput] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    valid: boolean;
    message?: string;
    applicantName?: string;
  } | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [createdReference, setCreatedReference] = useState<string | null>(null);
  const [showNewApplicantForm, setShowNewApplicantForm] = useState(false);
  const [newApplicantName, setNewApplicantName] = useState({ firstName: '', lastName: '' });

  // Check for existing valid reference on mount
  useEffect(() => {
    if (hasValidStoredReference()) {
      const storedRef = getStoredReference();
      if (storedRef) {
        router.push('/admissions/apply-now');
      }
    }
  }, [router]);

  // Validate reference input
  const validateReference = async () => {
    if (!referenceInput.trim()) {
      setValidationResult({ valid: false, message: 'Please enter your application reference' });
      return;
    }

    setIsValidating(true);
    setValidationResult(null);

    const result = await validateReferenceInDatabase(referenceInput.trim());
    
    if (result.valid && result.data) {
      setValidationResult({ 
        valid: true, 
        message: 'Reference found!',
        applicantName: result.data.applicantName
      });
      storeReference(referenceInput.trim());
      
      // Navigate after a brief delay
      setTimeout(() => {
        router.push('/admissions/apply-now');
      }, 1500);
    } else {
      setValidationResult({ 
        valid: false, 
        message: result.error || 'Invalid reference. Please check and try again.' 
      });
    }
    
    setIsValidating(false);
  };

  // Create new applicant with reference
  const handleCreateNewApplicant = async () => {
    if (!newApplicantName.firstName.trim() || !newApplicantName.lastName.trim()) {
      return;
    }

    setIsCreatingNew(true);
    
    const result = await createNewApplicantWithReference();
    
    if (result.success && result.reference) {
      setCreatedReference(result.reference);
      // Store the applicant name for later use
      storeReference(result.reference);
    } else {
      setValidationResult({
        valid: false,
        message: result.error || 'Failed to create application. Please try again.'
      });
    }
    
    setIsCreatingNew(false);
  };

  // Navigate to application form
  const proceedToApplication = () => {
    router.push('/admissions/apply-now');
  };

  // Format reference for display
  const formatReference = (ref: string) => {
    return ref.toUpperCase().replace(/[^A-Z0-9-]/g, '');
  };

  if (createdReference) {
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
              className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
            >
              <CheckCircle className="w-12 h-12 text-green-600" />
            </motion.div>
            
            <motion.h1 
              className="text-3xl md:text-4xl text-[#053f52] mb-4"
              style={{ fontFamily: "'Crimson Pro', serif" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Application Created Successfully!
            </motion.h1>
            
            <motion.p 
              className="text-lg text-gray-700 mb-8"
              style={{ fontFamily: "'Inter', sans-serif" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Your application reference has been generated. Please save this reference for future use.
            </motion.p>
            
            <motion.div 
              className="bg-[#053f52] rounded-xl p-6 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-white/70 text-sm mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                Your Application Reference
              </p>
              <p className="text-3xl md:text-4xl font-mono font-bold text-[#EFBF04]" style={{ fontFamily: "'Inter', sans-serif" }}>
                {createdReference}
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8 text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <p className="text-yellow-800 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                <strong>Important:</strong> Please save this reference number. You will need it to:
              </p>
              <ul className="text-yellow-800 text-sm mt-2 space-y-1 list-disc list-inside" style={{ fontFamily: "'Inter', sans-serif" }}>
                <li>Resume your application later</li>
                <li>Check your application status</li>
                <li>Complete payment</li>
              </ul>
            </motion.div>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Button 
                onClick={() => {
                  navigator.clipboard.writeText(createdReference);
                }}
                variant="outline"
                className="border-2 border-[#053f52] text-[#053f52] hover:bg-[#053f52] hover:text-white rounded-full px-6 py-3"
              >
                Copy Reference
              </Button>
              <Button 
                onClick={proceedToApplication}
                className="bg-[#053f52] text-white hover:bg-[#042a38] rounded-full px-8 py-3"
              >
                Continue to Application <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>
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
        `}</style>
        <div className="fixed inset-0 bg-center bg-repeat -z-10" style={{ backgroundImage: "url('/images/pattern.webp')" }} />
        <motion.div className="fixed inset-0 -z-[5]" style={{ backgroundColor: '#EFBF04', opacity: 0.88 }} />

        <motion.div 
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-10">
            <motion.h1 
              className="text-4xl md:text-5xl text-[#053f52] mb-4"
              style={{ fontFamily: "'Crimson Pro', serif" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Application Reference
            </motion.h1>
            <motion.p 
              className="text-lg text-gray-700"
              style={{ fontFamily: "'Inter', sans-serif" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Enter your application reference to continue or create a new application
            </motion.p>
          </div>

          {/* Validation Result Message */}
          {validationResult && !isValidating && (
            <motion.div 
              className={`rounded-lg p-4 mb-6 flex items-start gap-3 ${
                validationResult.valid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {validationResult.valid ? (
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              )}
              <div>
                <p className={validationResult.valid ? 'text-green-800' : 'text-red-800'}>
                  {validationResult.message}
                </p>
                {validationResult.applicantName && (
                  <p className="text-green-700 text-sm mt-1">
                    Welcome back, {validationResult.applicantName}!
                  </p>
                )}
              </div>
            </motion.div>
          )}

          <motion.div 
            className="bg-white rounded-2xl shadow-xl p-6 md:p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Reference Input Section */}
            {!showNewApplicantForm ? (
              <>
                <div className="mb-8">
                  <label className="block text-gray-700 font-semibold mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Enter Your Application Reference
                  </label>
                  <div className="relative">
                    <Input
                      type="text"
                      value={referenceInput}
                      onChange={(e) => {
                        setReferenceInput(formatReference(e.target.value));
                        setValidationResult(null);
                      }}
                      placeholder="e.g., QIS-2025-12345"
                      className="w-full px-4 py-4 pr-32 text-lg border border-gray-300 rounded-lg"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') validateReference();
                      }}
                    />
                    <Button
                      onClick={validateReference}
                      disabled={isValidating || !referenceInput.trim()}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#053f52] hover:bg-[#042a38] rounded-lg px-4"
                    >
                      {isValidating ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Search className="w-5 h-5" />
                      )}
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500 mt-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Format: QIS-YYYY-XXXXX (e.g., QIS-2025-12345)
                  </p>
                </div>

                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">OR</span>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-gray-700 mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Starting a new application?
                  </p>
                  <Button
                    onClick={() => setShowNewApplicantForm(true)}
                    className="bg-[#20cece] text-[#053f52] hover:bg-[#20cece]/90 rounded-full px-8 py-4 text-lg font-semibold"
                  >
                    Create New Application <RefreshCw className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              </>
            ) : (
              /* New Applicant Form */
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-[#053f52]" style={{ fontFamily: "'Crimson Pro', serif" }}>
                    Create New Application
                  </h2>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setShowNewApplicantForm(false);
                      setValidationResult(null);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Cancel
                  </Button>
                </div>

                <div className="mb-6">
                  <p className="text-gray-700 mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
                    A unique application reference will be generated for you. Please enter the applicant's name.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                        First Name *
                      </label>
                      <Input
                        type="text"
                        value={newApplicantName.firstName}
                        onChange={(e) => setNewApplicantName(prev => ({ ...prev, firstName: e.target.value }))}
                        placeholder="Enter first name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                        Last Name *
                      </label>
                      <Input
                        type="text"
                        value={newApplicantName.lastName}
                        onChange={(e) => setNewApplicantName(prev => ({ ...prev, lastName: e.target.value }))}
                        placeholder="Enter last name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      />
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <p className="text-blue-800 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                      <strong>Note:</strong> This will create a new application record in our system. 
                      You will receive a unique reference that must be saved to complete your application later.
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowNewApplicantForm(false);
                      setNewApplicantName({ firstName: '', lastName: '' });
                    }}
                    className="border-2 border-gray-300 rounded-full px-6"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateNewApplicant}
                    disabled={isCreatingNew || !newApplicantName.firstName.trim() || !newApplicantName.lastName.trim()}
                    className="bg-[#053f52] text-white hover:bg-[#042a38] rounded-full px-8"
                  >
                    {isCreatingNew ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Creating...
                      </span>
                    ) : (
                      'Generate Reference'
                    )}
                  </Button>
                </div>
              </div>
            )}
          </motion.div>

          {/* Help Section */}
          <motion.div 
            className="mt-8 bg-white/80 backdrop-blur-sm rounded-xl p-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <p className="text-gray-700 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
              Need help finding your reference?
            </p>
            <p className="text-gray-500 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
              Check your email for the confirmation message sent when you started your application.
            </p>
            <a 
              href="mailto:admissions@queensgate.ac.ug" 
              className="text-[#EFBF04] font-semibold hover:underline mt-2 inline-block"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Contact Admissions
            </a>
          </motion.div>
        </motion.div>
      </div>
      <MainSiteFooter />
    </>
  );
}

