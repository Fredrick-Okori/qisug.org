'use client';

import { BlueSiteHeader } from '@/components/blue-header';
import { MainSiteFooter } from '@/components/main-footer';
import React from 'react';
import { motion } from 'framer-motion';

export default function AdmissionPeriods() {
  const periods = [
    {
      month: 'September',
      description: 'The traditional start of the academic year, perfect for students transitioning from summer break.'
    },
    {
      month: 'January',
      description: 'A mid-year entry point, suitable for students who have completed a term or semester elsewhere and are looking to switch schools.'
    },
    {
      month: 'April',
      description: 'A spring entry, providing an alternative start time for students who need more time to prepare or finish previous commitments.'
    },
    {
      month: 'July',
      description: 'A summer entry, ideal for students who wish to get ahead or need to make up for lost time.'
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
          
          .period-card::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 4px;
            background: linear-gradient(180deg, #EFBF04 0%, #6B1616 100%);
            transform: scaleY(0);
            transition: transform 0.3s ease;
            transform-origin: top;
          }
          
          .period-card:hover::before {
            transform: scaleY(1);
          }
          
          .image-container::after {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, rgba(139, 30, 30, 0.1) 0%, transparent 60%);
            pointer-events: none;
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
            {/* Left Column */}
            <div className="flex flex-col gap-8">
              <div className="relative">
                <motion.div 
                  className="absolute w-[120px] h-[120px] bg-[radial-gradient(circle,rgba(139,30,30,0.08)_0%,transparent_70%)] rounded-full blur-[40px] -top-[60px] -left-[60px]"
                  variants={floatVariants}
                  animate="animate"
                />
                <motion.h1 
                  className="text-6xl  text-[#3d4fd4] mb-6 leading-tight"
                  style={{ fontFamily: "'Crimson Pro', serif" }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                  Admission Periods
                </motion.h1>
                <motion.div 
                  className="h-1 w-24 bg-gradient-to-r from-[#3d4fd4] to-[#6B1616] rounded-full"
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
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
                CIC Ontario Secondary School offers multiple admission entry points throughout the year 
                to accommodate the diverse needs of students worldwide. These entry points are in 
                September, January, April, and July, allowing flexibility for students to start their education 
                at a time that best suits their academic and personal schedules. It is recommended to 
                apply a minimum of two weeks before your desired admission period.
              </motion.p>
              
              <motion.div 
                className="image-container relative overflow-hidden rounded-2xl"
                style={{ boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15), 0 8px 16px rgba(0, 0, 0, 0.1)' }}
                variants={fadeInVariants}
                initial="hidden"
                animate="visible"
                custom={0.4}
              >
                <img 
                  src="/images/02a-header-How-To-Apply-Header-PhotoV3.jpg"
                  alt="University Application Accepted"
                  className="w-full h-auto object-cover"
                />
              </motion.div>
            </div>

            {/* Right Column - Periods */}
            <div>
              {periods.map((period, index) => (
                <motion.div 
                  key={period.month}
                  className="period-card relative pl-8 pr-6 py-8 border-b border-gray-200 last:border-b-0 transition-all duration-300 ease-out hover:translate-x-2 hover:bg-gradient-to-br hover:from-[rgba(139,30,30,0.03)] hover:to-[rgba(139,30,30,0.01)]"
                  variants={slideInVariants}
                  initial="hidden"
                  animate="visible"
                  custom={index + 1}
                >
                  <h2 
                    className="text-3xl  text-[#3d4fd4] mb-3"
                    style={{ fontFamily: "'Crimson Pro', serif" }}
                  >
                    {period.month}
                  </h2>
                  <p 
                    className="text-gray-700 leading-relaxed"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {period.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Decorative Element */}
          <motion.div 
            className="mt-20 text-center opacity-30"
            variants={fadeInVariants}
            initial="hidden"
            animate="visible"
            custom={0.8}
          >
            <div className="flex items-center justify-center gap-2">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#3d4fd4]" />
              <div className="w-2 h-2 rounded-full bg-[#3d4fd4]" />
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#3d4fd4]" />
            </div>
          </motion.div>
        </motion.div>
      </div>

      <MainSiteFooter />
    </>
  );
}