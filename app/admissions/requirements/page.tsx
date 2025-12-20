"use client"

import React, { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { 
  Laptop, 
  Wifi, 
  FileText, 
  GraduationCap, 
  User, 
  CheckCircle2,
  Download,
  Home
} from "lucide-react"
import { BlueSiteHeader } from "@/components/blue-header"
import { CTA } from "@/components/home/cta"
import { MainSiteFooter } from "@/components/main-footer"
import { SiteFooter } from "@/components/site-footer"

const requirements = [
  {
    title: "Technological Requirements",
    icon: Laptop,
    description: "To succeed in our online learning environment, students must have the following technological setup:",
    items: [
      {
        icon: Laptop,
        text: "Device: A laptop or desktop computer equipped with essential software, a web camera, a microphone, and speakers."
      },
      {
        icon: Wifi,
        text: "Internet: A stable internet connection with at least 3G speed to ensure smooth streaming of classes and participation in virtual labs."
      },
      {
        icon: Download,
        text: "Software: Necessary software installed, including a web browser, word processing software, and any other course-specific applications."
      }
    ]
  },
  {
    title: "Environmental Requirements",
    icon: Home,
    description: "To succeed in our online learning environment, students must have the following environmental setup:",
    items: [
      {
        icon: Home,
        text: "Learning Environment: A quiet and distraction-free space for attending classes and studying."
      },
      {
        icon: CheckCircle2,
        text: "Exam Environment: A controlled and quiet environment for taking exams and tests to ensure academic integrity."
      }
    ]
  },
  {
    title: "Academic Documentation",
    icon: GraduationCap,
    description: "Please prepare the following academic documents for your application:",
    items: [
      {
        icon: FileText,
        text: "Transcripts: Translated official transcripts for the last three school years, demonstrating satisfactory academic performance."
      },
      {
        icon: GraduationCap,
        text: "Academic History: Detailed records of your previous academic achievements and coursework."
      }
    ]
  },
  {
    title: "Personal Identification",
    icon: User,
    description: "Valid identification documents are required for enrollment:",
    items: [
      {
        icon: User,
        text: "Identification: Bio-data page from your passport or national ID with a photo."
      },
      {
        icon: FileText,
        text: "Birth Certificate: A copy of your birth certificate."
      },
      {
        icon: User,
        text: "Passport-Sized Photo: A recent digital passport-sized color photo."
      }
    ]
  }
]

export default function RequirementsPage() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  }

  const headerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  }

  return (
    <>
  <BlueSiteHeader/>
    <section
      ref={sectionRef}
      className="pt-24 sm:pt-28 md:pt-32 lg:pt-40 pb-20"
    >
      <div className="container mx-auto px-4 pt-20">
        {/* Header */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center max-w-3xl mx-auto mb-16"
        >
         

          <h2 className="text-4xl md:text-6xl text-gray-900 font-serif mb-4 leading-tight">
            Requirements to Study at{" "}
            <span className="text-[#3d4fd4]">Queensgate</span>
          </h2>
          
          <p className="text-lg md:text-xl text-gray-600">
            Everything you need to know to start your educational journey with us
          </p>
        </motion.div>

        {/* Requirements Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-6xl mx-auto space-y-8"
        >
          {requirements.map((requirement, index) => {
            const Icon = requirement.icon
            
            return (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ y: -5 }}
                className="bg-white overflow-hidden"
              >
                <div className="p-8 md:p-10">
                  {/* Card Header */}
                  <div className="flex items-start gap-4 mb-6">
                    <motion.div
                      whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                      className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-[#3d4fd4] to-[#2a3eb8] rounded-2xl flex items-center justify-center shadow-lg"
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </motion.div>
                    
                    <div className="flex-1">
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                        {requirement.title}
                      </h3>
                      <p className="text-gray-600 text-base md:text-lg">
                        {requirement.description}
                      </p>
                    </div>
                  </div>

                  {/* Requirements List */}
                  <motion.div
                    variants={containerVariants}
                    className="space-y-4 pl-0 md:pl-18"
                  >
                    {requirement.items.map((item, itemIndex) => {
                      const ItemIcon = item.icon
                      
                      return (
                        <motion.div
                          key={itemIndex}
                          variants={itemVariants}
                          whileHover={{ x: 5 }}
                          className="flex items-start gap-4 group"
                        >
                          <motion.div
                            whileHover={{ scale: 1.2, rotate: 360 }}
                            transition={{ duration: 0.3 }}
                            className="flex-shrink-0 w-10 h-10 bg-[#EFBF04]/20 rounded-xl flex items-center justify-center group-hover:bg-[#EFBF04]/30 transition-colors duration-300"
                          >
                            <ItemIcon className="w-5 h-5 text-[#EFBF04]" />
                          </motion.div>
                          
                          <p className="text-gray-700 text-base md:text-lg leading-relaxed pt-1.5">
                            {item.text}
                          </p>
                        </motion.div>
                      )
                    })}
                  </motion.div>
                </div>

                {/* Decorative Bottom Border */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="h-1 bg-gradient-to-r from-[#EFBF04] via-[#EFBF04] to-[#EFBF04]"
                />
              </motion.div>
            )
          })}
        </motion.div>

     
      </div>
    </section>
    <div className="bg-[#f9f9f9]">
  <CTA/>
  <SiteFooter/>
    </div>
   
      </>
  )
}