"use client"

import React, { useRef } from "react"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { ArrowRight, Calendar, Phone, Mail, MapPin } from "lucide-react"

export function CTA() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 })

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

  const itemVariants = {
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

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
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

  return (
    <section ref={sectionRef} className="relative py-24 bg-[#203dce] overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -top-1/4 -right-1/4 w-96 h-96 bg-[#EFBF04]/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -bottom-1/4 -left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-6xl mx-auto"
        >
          {/* Main CTA Content */}
          <div className="text-center mb-16">
            <motion.div
              variants={itemVariants}
              className="inline-block mb-4"
            >
              <span className="px-4 py-2 bg-[#EFBF04]/20 text-[#EFBF04] rounded-full text-sm font-semibold border border-[#EFBF04]/30">
                Join Our Community
              </span>
            </motion.div>

            <motion.h2
              variants={itemVariants}
              className="text-4xl md:text-6xl text-white font-serif mb-6 leading-tight"
            >
             Ready to Step into a World of Opportunities?

            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto mb-10"
            >
              Join thousands of students who have chosen Queensgate for excellence in education. 
              Start your path to academic success today.
            </motion.p>

            {/* Primary CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <motion.div
                variants={buttonVariants}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href="/enroll"
                  className="group inline-flex items-center gap-2 px-8 py-4 bg-[#EFBF04] text-gray-900 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  Apply Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>

              <motion.div
                variants={buttonVariants}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href="/tour"
                  className="group inline-flex items-center gap-2 px-8 py-4 bg-white/10 text-white rounded-full font-semibold text-lg border-2 border-white/30 backdrop-blur-sm hover:bg-white/20 transition-all duration-300"
                >
                  <Calendar className="w-5 h-5" />
                  Schedule a Tour
                </Link>
              </motion.div>
            </motion.div>
          </div>



        

          
        </motion.div>
      </div>
    </section>
  )
}