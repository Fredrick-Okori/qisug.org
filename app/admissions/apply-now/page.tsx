'use client';

import { BlueSiteHeader } from '@/components/blue-header';
import { MainSiteFooter } from '@/components/main-footer';
import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function ApplyNowPage() {
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    nationality: '',
    
    // Contact Information
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    
    // Academic Information
    currentGrade: '',
    previousSchool: '',
    admissionPeriod: '',
    
    // Document Uploads
    transcript: null,
    passport: null,
    birthCertificate: null,
    photo: null,
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'file' ? files[0] : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission logic here
    alert('Application submitted successfully! We will contact you soon.');
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' }
    }
  };

  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (delay) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut', delay }
    })
  };

  return (
    <>
      <BlueSiteHeader />

      <div className="min-h-screen  pt-[120px] md:pt-[200px] lg:pt-[240px] pb-16 px-6">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600;700&family=Inter:wght@400;500;600&display=swap');
          
          .form-input:focus {
            outline: none;
            border-color: #EFBF04;
            box-shadow: 0 0 0 3px rgba(239, 191, 4, 0.1);
          }
          
          .form-select:focus {
            outline: none;
            border-color: #EFBF04;
            box-shadow: 0 0 0 3px rgba(239, 191, 4, 0.1);
          }
        `}</style>

            {/* Full-Page Background Pattern - Independent Layer */}
              <div
                className="fixed inset-0 bg-center bg-repeat -z-10"
                style={{ backgroundImage: "url('/images/pattern.webp')" }}
              />
              
              <motion.div
                className="fixed inset-0 -z-[5]"
                style={{ backgroundColor: '#EFBF04', opacity: 0.88 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.88 }}
                transition={{ duration: 0.4 }}
              />

        <motion.div 
          className="max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left Column - Title and Image */}
            <div className="flex flex-col gap-8">
              {/* Header */}
              <div className="relative">
                <motion.h1 
                  className="text-5xl md:text-6xl font-bold text-[#3d4fd4] mb-6 leading-tight"
                  style={{ fontFamily: "'Crimson Pro', serif" }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                  Apply Now
                </motion.h1>
                <motion.div 
                  className="h-1 w-24 bg-gradient-to-r from-[#EFBF04] to-[#d4a803] rounded-full mb-6"
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                />
                <motion.p 
                  className="text-lg text-gray-700 leading-relaxed max-w-xl"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                  variants={fadeInVariants}
                  initial="hidden"
                  animate="visible"
                  custom={0.3}
                >
                  Take the first step toward your educational journey at Queensgate International School. 
                  Complete the form to begin your application.
                </motion.p>
              </div>

              {/* Image */}
              <motion.div 
                className="relative overflow-hidden rounded-2xl"
                style={{ boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15), 0 8px 16px rgba(0, 0, 0, 0.1)' }}
                variants={fadeInVariants}
                initial="hidden"
                animate="visible"
                custom={0.4}
              >
                <img 
                  src="/images/02a-header-How-To-Apply-Header-PhotoV3.jpg"
                  alt="Students studying"
                  className="w-full h-auto object-cover"
                />
              </motion.div>

              {/* Contact Information */}
              <motion.div 
                className="bg-white rounded-xl p-6 shadow-lg"
                variants={fadeInVariants}
                initial="hidden"
                animate="visible"
                custom={0.6}
              >
                <h3 
                  className="text-xl font-bold text-[#3d4fd4] mb-3"
                  style={{ fontFamily: "'Crimson Pro', serif" }}
                >
                  Need Help?
                </h3>
                <p className="text-gray-700 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                  If you have any questions about the application process, contact our admissions team:
                </p>
                <a 
                  href="mailto:admissions@queensgate.ac.ug"
                  className="text-[#EFBF04] hover:text-[#d4a803] font-semibold transition-colors"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  admissions@queensgate.ac.ug
                </a>
              </motion.div>
            </div>

            {/* Right Column - Application Form */}
            <motion.form 
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl shadow-xl p-6 md:p-8 max-h-[calc(100vh-120px)] overflow-y-auto"
              variants={fadeInVariants}
              initial="hidden"
              animate="visible"
              custom={0.5}
            >
            {/* Personal Information */}
            <div className="mb-8">
              <h2 
                className="text-xl font-bold text-[#3d4fd4] mb-4 pb-2 border-b-2 border-[#EFBF04]"
                style={{ fontFamily: "'Crimson Pro', serif" }}
              >
                Personal Information
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label 
                    className="block text-gray-700 font-semibold mb-2"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg transition-all"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  />
                </div>
                
                <div>
                  <label 
                    className="block text-gray-700 font-semibold mb-2"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg transition-all"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  />
                </div>
                
                <div>
                  <label 
                    className="block text-gray-700 font-semibold mb-2"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    required
                    className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg transition-all"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  />
                </div>
                
                <div>
                  <label 
                    className="block text-gray-700 font-semibold mb-2"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Gender *
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                    className="form-select w-full px-4 py-3 border border-gray-300 rounded-lg transition-all"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label 
                    className="block text-gray-700 font-semibold mb-2"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Nationality *
                  </label>
                  <input
                    type="text"
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleChange}
                    required
                    className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg transition-all"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="mb-8">
              <h2 
                className="text-xl font-bold text-[#3d4fd4] mb-4 pb-2 border-b-2 border-[#EFBF04]"
                style={{ fontFamily: "'Crimson Pro', serif" }}
              >
                Contact Information
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label 
                    className="block text-gray-700 font-semibold mb-2"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg transition-all"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  />
                </div>
                
                <div>
                  <label 
                    className="block text-gray-700 font-semibold mb-2"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg transition-all"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label 
                    className="block text-gray-700 font-semibold mb-2"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg transition-all"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  />
                </div>
                
                <div>
                  <label 
                    className="block text-gray-700 font-semibold mb-2"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg transition-all"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  />
                </div>
                
                <div>
                  <label 
                    className="block text-gray-700 font-semibold mb-2"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Country *
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                    className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg transition-all"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  />
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div className="mb-8">
              <h2 
                className="text-xl font-bold text-[#3d4fd4] mb-4 pb-2 border-b-2 border-[#EFBF04]"
                style={{ fontFamily: "'Crimson Pro', serif" }}
              >
                Academic Information
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label 
                    className="block text-gray-700 font-semibold mb-2"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Current Grade/Year *
                  </label>
                  <select
                    name="currentGrade"
                    value={formData.currentGrade}
                    onChange={handleChange}
                    required
                    className="form-select w-full px-4 py-3 border border-gray-300 rounded-lg transition-all"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    <option value="">Select Grade</option>
                    <option value="9">Grade 9</option>
                    <option value="10">Grade 10</option>
                    <option value="11">Grade 11</option>
                    <option value="12">Grade 12</option>
                  </select>
                </div>
                
                <div>
                  <label 
                    className="block text-gray-700 font-semibold mb-2"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Preferred Admission Period *
                  </label>
                  <select
                    name="admissionPeriod"
                    value={formData.admissionPeriod}
                    onChange={handleChange}
                    required
                    className="form-select w-full px-4 py-3 border border-gray-300 rounded-lg transition-all"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    <option value="">Select Period</option>
                    <option value="september">September</option>
                    <option value="january">January</option>
                    <option value="april">April</option>
                    <option value="july">July</option>
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label 
                    className="block text-gray-700 font-semibold mb-2"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Previous School Name *
                  </label>
                  <input
                    type="text"
                    name="previousSchool"
                    value={formData.previousSchool}
                    onChange={handleChange}
                    required
                    className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg transition-all"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  />
                </div>
              </div>
            </div>

            {/* Document Uploads */}
            <div className="mb-8">
              <h2 
                className="text-xl font-bold text-[#3d4fd4] mb-4 pb-2 border-b-2 border-[#EFBF04]"
                style={{ fontFamily: "'Crimson Pro', serif" }}
              >
                Required Documents
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label 
                    className="block text-gray-700 font-semibold mb-2"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Academic Transcript *
                  </label>
                  <input
                    type="file"
                    name="transcript"
                    onChange={handleChange}
                    required
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg transition-all"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  />
                  <p className="text-sm text-gray-500 mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Upload your last 3 years of transcripts (PDF, JPG, or PNG)
                  </p>
                </div>
                
                <div>
                  <label 
                    className="block text-gray-700 font-semibold mb-2"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Passport/ID Bio Page *
                  </label>
                  <input
                    type="file"
                    name="passport"
                    onChange={handleChange}
                    required
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg transition-all"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  />
                  <p className="text-sm text-gray-500 mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Upload bio-data page from passport or national ID (PDF, JPG, or PNG)
                  </p>
                </div>
                
                <div>
                  <label 
                    className="block text-gray-700 font-semibold mb-2"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Birth Certificate *
                  </label>
                  <input
                    type="file"
                    name="birthCertificate"
                    onChange={handleChange}
                    required
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg transition-all"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  />
                  <p className="text-sm text-gray-500 mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Upload a copy of your birth certificate (PDF, JPG, or PNG)
                  </p>
                </div>
                
                <div>
                  <label 
                    className="block text-gray-700 font-semibold mb-2"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Passport Photo *
                  </label>
                  <input
                    type="file"
                    name="photo"
                    onChange={handleChange}
                    required
                    accept=".jpg,.jpeg,.png"
                    className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg transition-all"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  />
                  <p className="text-sm text-gray-500 mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Upload a recent passport-sized photo (JPG or PNG)
                  </p>
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="mb-8">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  className="mt-1 w-5 h-5 text-[#EFBF04] border-gray-300 rounded focus:ring-[#EFBF04]"
                />
                <span className="text-gray-700" style={{ fontFamily: "'Inter', sans-serif" }}>
                  I confirm that all information provided is accurate and I agree to the terms and conditions 
                  of Queensgate International School. *
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <motion.button
                type="submit"
                className="bg-gradient-to-r from-[#3d4fd4] to-[#2d3eb4] text-white px-12 py-4 rounded-full font-semibold text-lg hover:shadow-xl transition-all duration-300"
                style={{ fontFamily: "'Inter', sans-serif" }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                Submit Application
              </motion.button>
              <p className="text-sm text-gray-500 mt-4" style={{ fontFamily: "'Inter', sans-serif" }}>
                After submission, you will receive a confirmation email with next steps and payment instructions.
              </p>
            </div>
          </motion.form>
          </div>
        </motion.div>
      </div>

      <MainSiteFooter />
    </>
  );
}