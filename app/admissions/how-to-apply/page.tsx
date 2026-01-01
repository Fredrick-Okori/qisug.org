'use client';

import { BlueSiteHeader } from '@/components/blue-header';
import { MainSiteFooter } from '@/components/main-footer';
import React from 'react';
import { motion } from 'framer-motion';

export default function HowToApplyPage() {
  const steps = [
    {
      number: '1',
      title: 'Gather Necessary Documents',
      description: 'Transcripts: Obtain translated official transcripts for the last three school years. Identification: Prepare a bio-data page from your passport or national ID with a photo. Birth Certificate: Have a copy of your birth certificate ready. Passport-Sized Photo: Ensure you have a recent digital passport-sized color photo.'
    },
    {
      number: '2',
      title: 'Fill Out the Application Form',
      description: 'Fill out the application form with accurate and up-to-date information. Make sure all required fields are completed. You can locate the application form by clicking the "Apply Now" button across our website.'
    },
    {
      number: '3',
      title: 'Submit the Application Form',
      description: 'Review: Double-check all information for accuracy before submitting. Upload Documents: Attach the necessary documents (transcripts, ID, birth certificate, photo) as part of the application form submission.'
    },
    {
      number: '4',
      title: 'Pay the Application Fee',
      description: 'A non-refundable application fee is required to process your application. The payment processor is located at the end of the application form. Payments can be made through our secure online payment system. Once the payment is completed, you will receive a confirmation email.'
    },
    {
      number: '5',
      title: 'Application Review',
      description: 'Our admissions team will review your application and documents. You will be notified of your admission status via email.'
    },
    {
      number: '6',
      title: 'Next Steps',
      description: 'If accepted, follow the instructions provided in your acceptance email to complete your enrollment. Prepare for the online orientation session to get acquainted with our learning platform and resources.'
    },
    {
      number: '7',
      title: 'Additional Information',
      description: 'If you have any questions during the application process, our admissions team is available to assist you. Contact us via email or phone for any inquiries. Ensure you submit your application before the relevant deadlines to secure your spot at Queensgate International School.'
    }
  ];

  const requiredDocs = [
    {
      title: 'Transcripts',
      description: 'Translated official transcripts for the last three years of academic study'
    },
    {
      title: 'Passport',
      description: 'Bio-data page from your passport or national ID with photo'
    },
    {
      title: 'Passport Photo',
      description: 'Recent digital passport-sized color photo'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' }
    }
  };

  const slideInVariants = {
    hidden: { opacity: 0, x: 40 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: 'easeOut', delay: i * 0.1 }
    })
  };

  const fadeInVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (delay) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut', delay }
    })
  };

  const floatVariants = {
    animate: {
      x: [0, 20, 0],
      y: [0, -20, 0],
      transition: {
        duration: 6,
        ease: 'easeInOut',
        repeat: Infinity
      }
    }
  };

  return (
    <>
      <BlueSiteHeader />
      <div className="min-h-screen  pt-[120px] md:pt-[200px] lg:pt-[240px] pb-16 px-6">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600;700&family=Inter:wght@400;500;600&display=swap');
          
          .step-card::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 4px;
            background: linear-gradient(180deg, #EFBF04 0%, #d4a803 100%);
            transform: scaleY(0);
            transition: transform 0.3s ease;
            transform-origin: top;
          }
          
          .step-card:hover::before {
            transform: scaleY(1);
          }
          
          .doc-card {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .doc-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 24px rgba(239, 191, 4, 0.15);
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
            {/* Left Column - Application Steps */}
            <div className="flex flex-col gap-8">
              <div className="relative">
                <motion.div 
                  className="absolute w-[120px] h-[120px] "
                  variants={floatVariants}
                  animate="animate"
                />
                <motion.h1 
                  className="text-6xl  text-[#053f52] mb-6 leading-tight"
                  style={{ fontFamily: "'Crimson Pro', serif" }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                  How to Apply
                </motion.h1>
                <div 
                  className="h-1 w-24 bg-gradient-to-r from-[#20cece] to-[#20cece] rounded-full"
                />
              </div>
              
              <motion.p 
                className="text-lg text-gray-700 leading-relaxed max-w-xl"
                style={{ fontFamily: "'Inter', sans-serif" }}
                variants={fadeInVariants}
                initial="hidden"
                animate="visible"
                custom={0.3}
              >
                Begin your journey at Queensgate International School with our streamlined application process. 
                Follow these steps to apply online, submit your documents, and secure your spot in our 
                world-class educational program.
              </motion.p>

              {/* Application Steps */}
              <div className="space-y-1">
                {steps.map((step, index) => (
                  <motion.div 
                    key={step.number}
                    className="step-card relative pl-8 pr-6 py-6 border-b border-gray-200 last:border-b-0 transition-all duration-300 ease-out hover:translate-x-2 hover:bg-gradient-to-br hover:from-[rgba(239,191,4,0.03)] hover:to-[rgba(239,191,4,0.01)]"
                    variants={slideInVariants}
                    initial="hidden"
                    animate="visible"
                    custom={index + 1}
                  >
                    <h3 
                      className="text-2xl  text-[#053f52] mb-2"
                      style={{ fontFamily: "'Crimson Pro', serif" }}
                    >
                      {step.number}. {step.title}
                    </h3>
                    <p 
                      className="text-gray-700 leading-relaxed"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {step.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right Column - Required Documents & Info */}
            <div className="flex flex-col gap-8 bg-[#efbf04]/20 p-6 rounded-xl">
              {/* Required Documents Section */}
              <motion.div
                variants={fadeInVariants}
                initial="hidden"
                animate="visible"
                custom={0.4}
              >
                <h2 
                  className="text-3xl  text-[#053f52] mb-6"
                  style={{ fontFamily: "'Crimson Pro', serif" }}
                >
                  Required Documentation
                </h2>
                <div className="space-y-4">
                  {requiredDocs.map((doc, index) => (
                    <motion.div
                      key={doc.title}
                      className="doc-card bg-white rounded-xl p-6 border border-gray-200"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.5 + (index * 0.1) }}
                    >
                      <h3 
                        className="text-xl  text-[#053f52] mb-2"
                        style={{ fontFamily: "'Crimson Pro', serif" }}
                      >
                        {doc.title}
                      </h3>
                      <p 
                        className="text-gray-700 leading-relaxed"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {doc.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Important Information Box */}
              <motion.div
                className="bg-gradient-to-br from-[#053f52] to-[#053f52] rounded-xl p-8 text-white"
                variants={fadeInVariants}
                initial="hidden"
                animate="visible"
                custom={0.8}
              >
                <h3 
                  className="text-2xl  mb-4 text-white"
                  style={{ fontFamily: "'Crimson Pro', serif" }}
                >
                  Admission Periods
                </h3>
                <p 
                  className="leading-relaxed mb-4"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Queensgate International School offers admission entry points in SEPTEMBER, JANUARY, 
                  APRIL, and JULY.
                </p>
                <p 
                  className="leading-relaxed mb-4"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  It is recommended to apply at least 2 weeks before your desired entry date.
                </p>
                <div className="border-t border-white/30 pt-4 mt-4">
                  <p 
                    className="text-sm leading-relaxed"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    For any inquiries regarding admissions, please reach out to our admissions office at{' '}
                    <a 
                      href="mailto:admissions@queensgate.ac.ug" 
                      className="underline hover:text-gray-200 transition-colors"
                    >
                      admissions@queensgate.ac.ug
                    </a>
                  </p>
                </div>
              </motion.div>

              {/* Apply Now CTA */}
              <motion.div
                className="text-center"
                variants={fadeInVariants}
                initial="hidden"
                animate="visible"
                custom={1.0}
              >
                <h3 
                  className="text-2xl  text-[#053f52] mb-4"
                  style={{ fontFamily: "'Crimson Pro', serif" }}
                >
                  Apply Today
                </h3>
                <p 
                  className="text-gray-700 leading-relaxed mb-6"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Ready to embark on an enriching educational journey? Apply today and take the 
                  first step towards a world-class online education.
                </p>
                <a
                  href="/apply-now"
                  className="inline-block bg-gradient-to-r from-[#053f52] to-[#053f52] text-white px-8 py-4 rounded-full text-lg hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Apply Now
                </a>
              </motion.div>
            </div>
          </div>

          {/* Decorative Element */}
          <motion.div 
            className="mt-20 text-center opacity-30"
            variants={fadeInVariants}
            initial="hidden"
            animate="visible"
            custom={1.2}
          >
            <div className="flex items-center justify-center gap-2">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#EFBF04]" />
              <div className="w-2 h-2 rounded-full bg-[#EFBF04]" />
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#EFBF04]" />
            </div>
          </motion.div>
        </motion.div>
      </div>

      <MainSiteFooter />
    </>
  );
}