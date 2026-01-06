'use client';

import { BlueSiteHeader } from '@/components/blue-header';
import { MainSiteFooter } from '@/components/main-footer';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export default function ApplyNowPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [applicationId, setApplicationId] = useState('');

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

  const supabase = createClient();

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

  const uploadDocument = async (file: File, folder: string, applicantId: string) => {
    const fileExtension = file.name.split('.').pop();
    const fileName = `${applicantId}/${folder}/${Date.now()}.${fileExtension}`;
    
    const { data, error } = await supabase.storage
      .from('admission-documents')
      .upload(fileName, file);
    
    if (error) {
      throw new Error(`Failed to upload ${folder}: ${error.message}`);
    }
    
    const { data: urlData } = supabase.storage
      .from('admission-documents')
      .getPublicUrl(data.path);
    
    return urlData.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      // 1. Create applicant record
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
        throw new Error(`Failed to create applicant: ${applicantError.message}`);
      }

      // 2. Get the selected program
      const grade = parseInt(formData.currentGrade);
      const { data: program } = await supabase
        .from('programs')
        .select('id')
        .eq('grade', grade)
        .eq('stream', 'Science')
        .single();

      if (!program) {
        throw new Error('Program not found. Please check grade selection.');
      }

      // 3. Create application record
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
        throw new Error(`Failed to create application: ${appError.message}`);
      }

      setApplicationId(application.id);

      // 4. Create academic history
      await supabase.from('academic_histories').insert({
        application_id: application.id,
        school_name: formData.previousSchool,
        province: formData.city,
        country: formData.country,
        start_date: '2020-01-01',
        end_date: '2024-12-31',
        grade_completed: `Grade ${grade - 1}`,
      });

      // 5. Upload documents
      const uploads = [];
      if (formData.transcript) {
        uploads.push(uploadDocument(formData.transcript, 'transcripts', applicant.id).then(url => 
          supabase.from('application_documents').insert({
            application_id: application.id,
            document_type: 'transcript',
            file_name: formData.transcript!.name,
            file_path: url,
            file_size: formData.transcript!.size,
          })
        ).catch(() => {}));
      }
      if (formData.passport) {
        uploads.push(uploadDocument(formData.passport, 'passports', applicant.id).then(url => 
          supabase.from('application_documents').insert({
            application_id: application.id,
            document_type: 'passport',
            file_name: formData.passport!.name,
            file_path: url,
            file_size: formData.passport!.size,
          })
        ).catch(() => {}));
      }
      if (formData.birthCertificate) {
        uploads.push(uploadDocument(formData.birthCertificate, 'birth-certificates', applicant.id).then(url => 
          supabase.from('application_documents').insert({
            application_id: application.id,
            document_type: 'birth_certificate',
            file_name: formData.birthCertificate!.name,
            file_path: url,
            file_size: formData.birthCertificate!.size,
          })
        ).catch(() => {}));
      }
      if (formData.photo) {
        uploads.push(uploadDocument(formData.photo, 'photos', applicant.id).then(url => 
          supabase.from('application_documents').insert({
            application_id: application.id,
            document_type: 'photo',
            file_name: formData.photo!.name,
            file_path: url,
            file_size: formData.photo!.size,
          })
        ).catch(() => {}));
      }

      await Promise.all(uploads);
      setSubmitStatus('success');
      
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (delay: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut', delay }
    })
  };

  if (submitStatus === 'success') {
    return (
      <>
        <BlueSiteHeader />
        <div className="min-h-screen pt-[120px] md:pt-[200px] lg:pt-[240px] pb-16 px-6">
          <div className="fixed inset-0 bg-center bg-repeat -z-10" style={{ backgroundImage: "url('/images/pattern.webp')" }} />
          <motion.div className="fixed inset-0 -z-[5]" style={{ backgroundColor: '#EFBF04', opacity: 0.88 }} />
          <motion.div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl md:text-4xl text-[#053f52] mb-4" style={{ fontFamily: "'Crimson Pro', serif" }}>
              Application Submitted Successfully!
            </h1>
            <p className="text-lg text-gray-700 mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
              Thank you for applying to Queensgate International School.
            </p>
            {applicationId && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600">Application ID: <span className="font-mono font-semibold">{applicationId}</span></p>
              </div>
            )}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6 text-left">
              <h3 className="font-semibold text-[#053f52] mb-3">Next Steps:</h3>
              <ul className="text-gray-700 space-y-2">
                <li>1. Confirmation email will be sent to <strong>{formData.email}</strong></li>
                <li>2. Pay the $300 application fee</li>
                <li>3. Admissions team will review your application</li>
                <li>4. Contact within 5-7 business days</li>
              </ul>
            </div>
            <a href="/admissions" className="inline-block bg-[#053f52] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#042a38] transition-colors">
              Return to Admissions
            </a>
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

        <motion.div className="max-w-7xl mx-auto" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="flex flex-col gap-8">
              <motion.h1 className="text-5xl md:text-6xl text-[#053f52] leading-tight" style={{ fontFamily: "'Crimson Pro', serif" }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                Apply Now
              </motion.h1>
              <motion.div className="h-1 w-24 bg-[#20cece] rounded-full" initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }} />
              <motion.p className="text-lg text-gray-700 leading-relaxed max-w-xl" style={{ fontFamily: "'Inter', sans-serif" }} variants={fadeInVariants} initial="hidden" animate="visible" custom={0.3}>
                Take the first step toward your educational journey at Queensgate International School.
              </motion.p>
              <motion.img src="/images/02a-header-How-To-Apply-Header-PhotoV3.jpg" alt="Students" className="rounded-2xl shadow-lg" variants={fadeInVariants} initial="hidden" animate="visible" custom={0.4} />
              <motion.div className="bg-white rounded-xl p-6 shadow-lg" variants={fadeInVariants} initial="hidden" animate="visible" custom={0.6}>
                <h3 className="text-xl font-bold text-[#053f52] mb-3" style={{ fontFamily: "'Crimson Pro', serif" }}>Need Help?</h3>
                <p className="text-gray-700 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>Contact our admissions team:</p>
                <a href="mailto:admissions@queensgate.ac.ug" className="text-[#EFBF04] font-semibold" style={{ fontFamily: "'Inter', sans-serif" }}>admissions@queensgate.ac.ug</a>
              </motion.div>
            </div>

            {submitStatus === 'error' && (
              <motion.div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-800">Submission Failed</p>
                  <p className="text-red-700 text-sm">{errorMessage || 'Please try again.'}</p>
                </div>
              </motion.div>
            )}

            <motion.form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-6 md:p-8" variants={fadeInVariants} initial="hidden" animate="visible" custom={0.5}>
              {/* Personal Information */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-[#053f52] mb-4 pb-2 border-b-2 border-[#EFBF04]" style={{ fontFamily: "'Crimson Pro', serif" }}>Personal Information</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>First Name *</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg" style={{ fontFamily: "'Inter', sans-serif" }} />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>Last Name *</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg" style={{ fontFamily: "'Inter', sans-serif" }} />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>Date of Birth *</label>
                    <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg" style={{ fontFamily: "'Inter', sans-serif" }} />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>Gender *</label>
                    <select name="gender" value={formData.gender} onChange={handleChange} required className="form-select w-full px-4 py-3 border border-gray-300 rounded-lg" style={{ fontFamily: "'Inter', sans-serif" }}>
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 font-semibold mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>Nationality *</label>
                    <input type="text" name="nationality" value={formData.nationality} onChange={handleChange} required className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg" style={{ fontFamily: "'Inter', sans-serif" }} />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-[#053f52] mb-4 pb-2 border-b-2 border-[#EFBF04]" style={{ fontFamily: "'Crimson Pro', serif" }}>Contact Information</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>Email Address *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg" style={{ fontFamily: "'Inter', sans-serif" }} />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>Phone Number *</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg" style={{ fontFamily: "'Inter', sans-serif" }} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 font-semibold mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>Address *</label>
                    <input type="text" name="address" value={formData.address} onChange={handleChange} required className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg" style={{ fontFamily: "'Inter', sans-serif" }} />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>City *</label>
                    <input type="text" name="city" value={formData.city} onChange={handleChange} required className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg" style={{ fontFamily: "'Inter', sans-serif" }} />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>Country *</label>
                    <input type="text" name="country" value={formData.country} onChange={handleChange} required className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg" style={{ fontFamily: "'Inter', sans-serif" }} />
                  </div>
                </div>
              </div>

              {/* Academic Information */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-[#053f52] mb-4 pb-2 border-b-2 border-[#EFBF04]" style={{ fontFamily: "'Crimson Pro', serif" }}>Academic Information</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>Current Grade/Year *</label>
                    <select name="currentGrade" value={formData.currentGrade} onChange={handleChange} required className="form-select w-full px-4 py-3 border border-gray-300 rounded-lg" style={{ fontFamily: "'Inter', sans-serif" }}>
                      <option value="">Select Grade</option>
                      <option value="9">Grade 9</option>
                      <option value="10">Grade 10</option>
                      <option value="11">Grade 11</option>
                      <option value="12">Grade 12</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>Admission Period *</label>
                    <select name="admissionPeriod" value={formData.admissionPeriod} onChange={handleChange} required className="form-select w-full px-4 py-3 border border-gray-300 rounded-lg" style={{ fontFamily: "'Inter', sans-serif" }}>
                      <option value="">Select Period</option>
                      <option value="september">September 2026</option>
                      <option value="january">January 2027</option>
                      <option value="april">April 2027</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 font-semibold mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>Previous School *</label>
                    <input type="text" name="previousSchool" value={formData.previousSchool} onChange={handleChange} required className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg" style={{ fontFamily: "'Inter', sans-serif" }} />
                  </div>
                </div>
              </div>

              {/* Document Uploads */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-[#053f52] mb-4 pb-2 border-b-2 border-[#EFBF04]" style={{ fontFamily: "'Crimson Pro', serif" }}>Required Documents</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Academic Transcript *</label>
                    <input type="file" name="transcript" onChange={handleChange} accept=".pdf,.jpg,.jpeg,.png" required className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Passport/ID Bio Page *</label>
                    <input type="file" name="passport" onChange={handleChange} accept=".pdf,.jpg,.jpeg,.png" required className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Birth Certificate *</label>
                    <input type="file" name="birthCertificate" onChange={handleChange} accept=".pdf,.jpg,.jpeg,.png" required className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Passport Photo *</label>
                    <input type="file" name="photo" onChange={handleChange} accept=".jpg,.jpeg,.png" required className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg" />
                  </div>
                </div>
              </div>

              {/* Terms */}
              <div className="mb-8">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" required className="mt-1 w-5 h-5 text-[#EFBF04] border-gray-300 rounded" />
                  <span className="text-gray-700" style={{ fontFamily: "'Inter', sans-serif" }}>I confirm all information is accurate and agree to the terms and conditions of Queensgate International School. *</span>
                </label>
              </div>

              {/* Submit */}
              <div className="text-center">
                <motion.button type="submit" disabled={isSubmitting} className={`bg-[#053f52] text-white px-12 py-4 rounded-full font-semibold text-lg hover:shadow-xl transition-all ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`} style={{ fontFamily: "'Inter', sans-serif" }} whileHover={!isSubmitting ? { scale: 1.05 } : {}}>
                  {isSubmitting ? <span className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" />Submitting...</span> : 'Submit Application'}
                </motion.button>
                <p className="text-sm text-gray-500 mt-4" style={{ fontFamily: "'Inter', sans-serif" }}>Application Fee: $300 USD</p>
              </div>
            </motion.form>
          </div>
        </motion.div>
      </div>
      <MainSiteFooter />
    </>
  );
}

