"use client"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { motion, useAnimation } from "framer-motion"
import MotionWrapper from "@/components/motion-wrapper"
import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ApplySectionProduction } from "@/components/home/apply-component"
import { Resources } from "@/components/home/resources"
import { CTA } from "@/components/home/cta"
import { Accreditations } from "@/components/home/accreditations"
import { ImprovedHomeSection } from "@/components/home/improved"
import FeaturedNews from "@/components/home/featured-news"

// Structured Data for SEO
const schemaOrgData = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": "Queensgate International School",
  "description": "Queensgate International School provides world-class education for students worldwide. Discover our innovative curriculum, dedicated faculty, and nurturing learning environment.",
  "url": "https://www.qgis.ac.ug",
  "logo": "https://www.qgis.ac.ug/images/logo_white.png",
  "image": "https://www.qgis.ac.ug/images/ndpjkk1uol9irckqx6db.avif",
  "telephone": "+1-234-567-8900",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "US"
  },
  "sameAs": [
    "https://www.facebook.com/qgis",
    "https://www.twitter.com/qgis",
    "https://www.instagram.com/qgis"
  ],
  "areaServed": "Worldwide",
  "type": "PrivateSchool"
}

export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const rafRef = useRef<number | null>(null)
  const controls = useAnimation()

  useEffect(() => {
    let ticking = false
    const handle = () => {
      const y = window.scrollY
      if (!ticking) {
        rafRef.current = window.requestAnimationFrame(() => {
          setScrollY(y)
          setIsScrolled(y > 50)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", handle, { passive: true })
    handle()
    return () => {
      window.removeEventListener("scroll", handle)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  // Subtle floating animation for desktop image
  useEffect(() => {
    controls.start({
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut" as const
      }
    })
  }, [controls])

  return (
    <div className="w-full flex flex-col">
      {/* JSON-LD Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrgData) }}
      />
      <SiteHeader/>
      
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

      {/* Hero Section — padding-top tracks the navbar height via CSS variable */}
      <main
        className="flex-1 bg-[#032f36] relative overflow-hidden"
        style={{
          paddingTop: 'var(--navbar-height, 6rem)',
          transition: 'padding-top 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        <MotionWrapper className="relative overflow-hidden">
          {/* Mobile/Tablet Layout - Text overlaid on student image */}
          <div
            className="lg:hidden relative overflow-hidden"
            style={{ minHeight: 'calc(100vh - var(--navbar-height, 4rem))' }}
          >
            {/* Student image — fills full hero */}
            <motion.div
              className="absolute inset-0 z-0"
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image
                src="/images/ndpjkk1uol9irckqx6db.avif"
                alt="Happy students with backpacks"
                fill
                sizes="100vw"
                className="object-contain object-top"
                priority
              />
            </motion.div>

            {/* Gradient — covers bottom half for text readability */}
            <div
              className="absolute inset-x-0 bottom-0 z-10 pointer-events-none"
              style={{
                height: '65%',
                background: 'linear-gradient(to top, #032f36 55%, rgba(3,47,54,0.85) 75%, transparent 100%)',
              }}
            />

            {/* Text — bottom of image, overlaid on gradient */}
            <div className="absolute inset-x-0 bottom-0 z-20 px-6 sm:px-10 pb-12 sm:pb-16">
              <motion.h1
                className="font-serif text-5xl sm:text-6xl font-bold text-white mb-3 leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
              >
                Queensgate International School
              </motion.h1>

              <motion.p
                className="font-serif text-xl text-white/85 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.48 }}
              >
                Your place and space to{' '}
                <span className="text-[#efbf04] italic">thrive</span>
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.6 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link href="/admissions/apply-now">
                  <Button
                    size="lg"
                    className="bg-[#20cece] text-white hover:bg-[#20cece]/90 text-base px-8 py-6 rounded-full shadow-lg transition-all hover:shadow-xl"
                  >
                    Apply Today
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Desktop Layout - Original Grid */}
          <div className="hidden lg:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className="grid lg:grid-cols-2 gap-0"
              style={{ minHeight: 'calc(100vh - var(--navbar-height, 5rem))' }}
            >
              {/* Left Side - Text Content with animations */}
              <div className="flex items-center justify-center lg:justify-start py-8 sm:py-12 lg:py-20 z-10">
                <div className="max-w-xl w-full text-center lg:text-left px-4 sm:px-6 lg:px-0">
                  {/* Animated heading with stagger effect */}
                  <motion.h1 
                    className="font-serif text-4xl sm:text-6xl md:text-5xl lg:text-6xl xl:text-7xl font-medium text-white"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.8, 
                      ease: [0.22, 1, 0.36, 1],
                      delay: 0.2
                    }}
                  >
                    Queensgate International School
                  </motion.h1>
                  <div className="mb-6 sm:mb-8">

                    <p className="text-white text-3xl font-serif">Your place and space to <span className="text-[#efbf04] font-serif italic">thrive</span></p>
                  </div>
                  {/* Animated button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.8, 
                      ease: [0.22, 1, 0.36, 1],
                      delay: 0.5
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link href="/admissions/apply-now">
                      <Button
                        size="lg"
                        className="bg-[#20cece] text-[#032f36] rounded-full hover:bg-[#20cece]/90 border-[#20cece] text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6  transition-all "
                      >
                        Apply Today
                      </Button>
                    </Link>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        
        </MotionWrapper>

        {/*
          Student image — anchored to top:0 of <main> (which starts at y=0 in flow).
          When not scrolled: z-[60] puts it in front of the navbar (z-50), so the
          student visually "stands through" the yellow bar.
          When scrolled: z-40 drops it behind the shrunken navbar.
        */}
        <motion.div
          className={`pointer-events-none absolute left-0 right-0 hidden lg:flex items-end justify-end pr-4 xl:pr-8 ${isScrolled ? 'z-40' : 'z-[60]'}`}
          style={{
            top: 'calc(var(--navbar-height, 6rem) * 0.47)',
            height: 'calc(100vh - var(--navbar-height, 6rem) * 0.45)',
          }}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 1,
            ease: [0.22, 1, 0.36, 1],
            delay: 0.3
          }}
        >
          <motion.div
            className="w-full max-w-2xl xl:max-w-3xl 2xl:max-w-4xl px-4 h-full"
            animate={controls}
            style={{
              transform: `translateY(${Math.min(scrollY * 0.6, 220)}px) translateX(2rem)`,
              opacity: Math.max(1 - scrollY / 700, 0.45),
              transition: 'transform 160ms linear, opacity 160ms linear',
            }}
          >
            <Image
              src="/images/ndpjkk1uol9irckqx6db.avif"
              alt="Happy students with backpacks"
              width={1300}
              height={850}
              sizes="(max-width: 1200px) 50vw, 40vw"
              className="w-full h-full object-contain"
              style={{ objectPosition: 'bottom' }}
              priority
            />
          </motion.div>
        </motion.div>
      </main>
<ApplySectionProduction/>
<ImprovedHomeSection/>
<Resources/>
<FeaturedNews/>
<Accreditations/>
<CTA/>
      <SiteFooter />
    </div>
  )
}

