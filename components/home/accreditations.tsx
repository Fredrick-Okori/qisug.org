"use client"

import React, { useCallback, useMemo } from "react"
import Image from "next/image"
import { motion, useInView, useReducedMotion } from "framer-motion"

// Partner/Accreditation logos data
const partners = [
  {
    name: "Edumandate",
    logo: "/partners/edumandate logo.svg",
    alt: "Edumandate Logo",
    website: "https://www.edumandate.com",
  },
  {
    name: "Inspire",
    logo: "/partners/inspire logo.avif",
    alt: "Inspire Logo",
    website: "https://www.inspire.com",
  },
  {
    name: "ITAC",
    logo: "/partners/ITAC Dark.avif",
    alt: "ITAC Logo",
    website: "https://www.itac.org",
  },
  {
    name: "Kampala Quality",
    logo: "/partners/KAMPALA QUALITY LOGO.avif",
    alt: "Kampala Quality Logo",
    website: "#",
  },
  {
    name: "ISO Certification",
    logo: "/partners/PHOTO-2026-02-21-08-31-30.avif",
    alt: "ISO 9001 Certification Logo",
    website: "#",
  },
] as const

export function Accreditations() {
  const sectionRef = React.useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })
  const shouldReduceMotion = useReducedMotion()

  // Animation variants - optimized for reduced motion
  const getAnimationVariants = useCallback((baseVariant: any) => {
    if (shouldReduceMotion) {
      return {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.2 } }
      }
    }
    return baseVariant
  }, [shouldReduceMotion])

  const headerVariants = useMemo(() => getAnimationVariants({
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const },
    },
  }), [getAnimationVariants])

  const descriptionVariants = useMemo(() => getAnimationVariants({
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: 0.15, ease: "easeOut" as const },
    },
  }), [getAnimationVariants])

  const containerVariants = useMemo(() => getAnimationVariants({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.06, delayChildren: 0.3 },
    },
  }), [getAnimationVariants])

  const logoVariants = useMemo(() => getAnimationVariants({
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as const },
    },
  }), [getAnimationVariants])

  // Split partners into rows (5 partners total - will display in flexible grid)
  const rows = [
    partners.slice(0, 5),
  ]

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-24 bg-[#053F52]"
      role="region"
      aria-label="Partners and Accreditations"
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto mb-12 md:mb-16">
          <motion.div
            variants={headerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <span className="inline-block px-4 py-2 bg-[#20cece]/20 text-[#20cece] rounded-full text-sm font-medium mb-4">
              Recognized & Accredited
            </span>
          </motion.div>

          <motion.h2
            variants={headerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="text-3xl md:text-4xl lg:text-5xl text-white font-serif mb-4 md:mb-6 leading-tight"
          >
            Our Partners & Accreditations
          </motion.h2>

          <motion.p
            variants={descriptionVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto"
          >
            Queensgate International School maintains the highest standards through partnerships 
            with globally recognized educational bodies and organizations.
          </motion.p>
        </div>

        {/* Logo Grid - 3 Rows x 4 Columns */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-6xl mx-auto"
          role="list"
          aria-label="Partner logos"
        >
          {rows.map((row, rowIndex) => (
            <motion.div
              key={`row-${rowIndex}`}
              variants={containerVariants}
              className="flex flex-wrap justify-center gap-4 md:gap-6 lg:gap-8 mb-6 last:mb-0"
            >
              {row.map((partner, index) => (
                <motion.div
                  key={partner.name}
                  variants={logoVariants}
                  className="flex-shrink-0"
                  style={{ animationDelay: `${(rowIndex * 4 + index) * 0.06}s` }}
                >
                  <a
                    href={partner.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit ${partner.name} website`}
                    className="group block"
                  >
                    <div className="relative w-32 h-24 md:w-40 md:h-28 lg:w-48 lg:h-32 bg-white rounded-lg md:rounded-xl flex items-center justify-center p-3 md:p-4 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border border-white/10">
                      {/* Placeholder gradient background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 rounded-lg md:rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Logo Image */}
                      <div className="relative w-full h-full flex items-center justify-center">
                        <Image
                          src={partner.logo}
                          alt={partner.alt}
                          width={160}
                          height={100}
                          className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                        />
                      </div>
                    </div>
                  </a>
                </motion.div>
              ))}
            </motion.div>
          ))}
        </motion.div>

        {/* Decorative bottom element */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 1.2, duration: 0.8, ease: "easeOut" }}
          className="flex justify-center mt-12"
        >
          <div className="h-1 w-24 bg-[#EFBF04] rounded-full" />
        </motion.div>
      </div>

      <style jsx global>{`
        /* Focus styles for accessibility */
        a:focus {
          outline: 2px solid #20cece;
          outline-offset: 4px;
        }
        
        /* Performance optimizations */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </section>
  )
}

export default Accreditations

