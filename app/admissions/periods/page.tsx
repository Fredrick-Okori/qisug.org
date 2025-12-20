"use client"

import React, { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { 
  Calendar,
  Snowflake,
  Flower,
  Sun,
  Leaf,
  Clock,
  ArrowRight,
  CheckCircle2
} from "lucide-react"

const admissionPeriods = [
  {
    month: "September",
    icon: Leaf,
    color: "from-orange-500 to-red-500",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
    description: "The traditional start of the academic year, perfect for students transitioning from summer break.",
    ideal: "Traditional academic calendar",
    status: "Most Popular"
  },
  {
    month: "January",
    icon: Snowflake,
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    description: "A mid-year entry point, suitable for students who have completed a term or semester elsewhere and are looking to switch schools.",
    ideal: "Mid-year transfers",
    status: "Flexible"
  },
  {
    month: "April",
    icon: Flower,
    color: "from-pink-500 to-purple-500",
    bgColor: "bg-pink-50",
    borderColor: "border-pink-200",
    iconBg: "bg-pink-100",
    iconColor: "text-pink-600",
    description: "A spring entry, providing an alternative start time for students who need more time to prepare or finish previous commitments.",
    ideal: "Alternative start",
    status: "Available"
  },
  {
    month: "July",
    icon: Sun,
    color: "from-yellow-500 to-orange-500",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-600",
    description: "A summer entry, ideal for students who wish to get ahead or need to make up for lost time.",
    ideal: "Accelerated learning",
    status: "Open"
  }
]

export default function AdmissionPeriods() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
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
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  return (
    <section
      ref={sectionRef}
      className="pt-24 sm:pt-28 md:pt-32 lg:pt-40 pb-20 bg-white"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center max-w-4xl mx-auto mb-16"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 150 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#3d4fd4] to-[#2a3eb8] rounded-2xl mb-6 shadow-xl"
          >
            <Calendar className="w-8 h-8 text-white" />
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 font-serif mb-6 leading-tight">
            Admission Periods
          </h2>
          
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
            Queensgate offers multiple admission entry points throughout the year to accommodate the diverse needs 
            of students worldwide. These entry points are in <span className="font-semibold text-[#3d4fd4]">September, January, April, and July</span>, 
            allowing flexibility for students to start their education at a time that best suits their academic and personal schedules.
          </p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-[#EFBF04]/20 text-gray-800 rounded-full border border-[#EFBF04]/30"
          >
            <Clock className="w-5 h-5 text-[#3d4fd4]" />
            <span className="font-semibold">Apply at least 2 weeks before your desired admission period</span>
          </motion.div>
        </motion.div>

        {/* Admission Periods Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-7xl mx-auto grid md:grid-cols-2 gap-6 lg:gap-8"
        >
          {admissionPeriods.map((period, index) => {
            const Icon = period.icon
            
            return (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ y: -10, scale: 1.02 }}
                className={`relative ${period.bgColor} rounded-3xl p-8 border-2 ${period.borderColor} shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group`}
              >
                {/* Background Gradient on Hover */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  whileHover={{ opacity: 0.05, scale: 2 }}
                  transition={{ duration: 0.4 }}
                  className={`absolute inset-0 bg-gradient-to-br ${period.color}`}
                />

                {/* Status Badge */}
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={isInView ? { x: 0, opacity: 1 } : { x: -20, opacity: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  className="absolute top-6 right-6"
                >
                  <span className="px-4 py-1.5 bg-white/80 backdrop-blur-sm text-gray-700 rounded-full text-sm font-semibold shadow-md">
                    {period.status}
                  </span>
                </motion.div>

                {/* Icon */}
                <motion.div
                  whileHover={{ rotate: [0, -15, 15, -15, 0], scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  className={`relative z-10 w-16 h-16 ${period.iconBg} rounded-2xl flex items-center justify-center mb-6 shadow-md group-hover:shadow-lg transition-shadow`}
                >
                  <Icon className={`w-8 h-8 ${period.iconColor}`} />
                </motion.div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                    {period.month}
                  </h3>

                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle2 className="w-5 h-5 text-[#3d4fd4]" />
                    <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                      {period.ideal}
                    </span>
                  </div>

                  <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-6">
                    {period.description}
                  </p>

                  {/* Apply Button */}
                  <motion.a
                    whileHover={{ x: 5 }}
                    href="/apply"
                    className="inline-flex items-center gap-2 text-[#3d4fd4] font-semibold group-hover:gap-3 transition-all duration-300"
                  >
                    Apply for {period.month}
                    <ArrowRight className="w-5 h-5" />
                  </motion.a>
                </div>

                {/* Decorative Element */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1, opacity: 0.1 }}
                  transition={{ duration: 0.3 }}
                  className="absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-br from-gray-900 to-gray-600 rounded-full"
                />
              </motion.div>
            )
          })}
        </motion.div>

        {/* Timeline Visual */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 max-w-5xl mx-auto"
        >
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-blue-500 via-pink-500 to-yellow-500 rounded-full -translate-y-1/2" />
            
            {/* Timeline Points */}
            <div className="relative grid grid-cols-4 gap-4">
              {admissionPeriods.map((period, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : { scale: 0 }}
                  transition={{ duration: 0.4, delay: 1 + index * 0.1 }}
                  className="flex flex-col items-center"
                >
                  <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${period.color} shadow-lg mb-3`} />
                  <span className="text-sm font-semibold text-gray-700 text-center">
                    {period.month}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="text-center mt-16"
        >
          <motion.a
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            href="/apply"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#3d4fd4] text-white rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            <Calendar className="w-5 h-5" />
            Start Your Application Today
          </motion.a>
          
          <p className="mt-6 text-gray-600">
            Questions about admission periods?{" "}
            <a href="/contact" className="text-[#3d4fd4] font-semibold hover:underline">
              Contact our admissions team
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  )
}