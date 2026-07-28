"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { motion, useAnimation, useScroll, useTransform, useSpring } from "framer-motion"
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
import { ArrowRight, Sparkles } from "lucide-react"

// Structured Data for SEO
const schemaOrgData = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": "Queensgate International School",
  "description": "Queensgate International School provides world-class education for students worldwide.",
  "url": "https://www.qgis.ac.ug",
  "logo": "https://www.qgis.ac.ug/images/logo_white.png",
  "image": "https://www.qgis.ac.ug/images/ndpjkk1uol9irckqx6db.avif",
  "telephone": "+256-757-882-623",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "UG"
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
  const controls = useAnimation()

  // 1. Smooth Spring Scroll Tracking
  const { scrollY } = useScroll()
  
  const smoothScrollY = useSpring(scrollY, {
    stiffness: 80,
    damping: 24,
    restDelta: 0.001
  })

  // Parallax motion and scale (Opacity transform removed)
  const heroImageY = useTransform(smoothScrollY, [0, 500], [0, 120])
  const heroImageScale = useTransform(smoothScrollY, [0, 500], [1, 0.96])

  // Dynamic top mask feathering as user scrolls down
  const maskTopStart = useTransform(smoothScrollY, [0, 100], [0, 15])

  // In front of the header at rest; eases behind it (crossing the header's z-50
  // partway through) as scrolling starts, riding the same spring as the rest of
  // the hero motion so the switch isn't an abrupt jump.
  const heroImageZIndex = useTransform(smoothScrollY, [0, 100], [60, 40])

  useEffect(() => {
    controls.start({
      y: [0, -8, 0],
      transition: {
        duration: 4.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    })
  }, [controls])

  return (
    <div className="w-full flex flex-col bg-[#032f36] antialiased selection:bg-[#efbf04] selection:text-[#032f36]">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrgData) }}
      />
      
      <SiteHeader />

      {/* Full-Page Background Texture */}
      <div
        className="fixed inset-0 bg-center bg-repeat -z-10 opacity-30 pointer-events-none"
        style={{ backgroundImage: "url('/images/pattern.webp')" }}
      />

      <div className="fixed top-0 left-1/4 w-96 h-96 bg-[#20cece]/10 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="fixed bottom-1/3 right-10 w-96 h-96 bg-[#efbf04]/10 blur-[140px] rounded-full pointer-events-none -z-10" />

      {/* Hero Section */}
      <main
        className="flex-1 bg-[#032f36] relative overflow-visible"
        style={{
          paddingTop: 'calc(var(--navbar-height, 5rem) + 4.5rem)',
          transition: 'padding-top 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <MotionWrapper className="relative overflow-visible">
          
          {/* ================= MOBILE & TABLET LAYOUT ================= */}
          <div
            className="lg:hidden relative overflow-hidden flex flex-col justify-end"
            style={{ minHeight: 'calc(100vh - var(--navbar-height, 4rem) - 2.5rem)' }}
          >
            <motion.div
              className="absolute inset-0 z-0"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image
                src="/images/ndpjkk1uol9irckqx6db.avif"
                alt="Queensgate International School Students"
                fill
                sizes="100vw"
                className="object-cover object-top"
                priority
              />
            </motion.div>

            <div
              className="absolute inset-x-0 bottom-0 z-10 pointer-events-none"
              style={{
                height: '75%',
                background: 'linear-gradient(to top, #032f36 60%, rgba(3,47,54,0.85) 80%, transparent 100%)',
              }}
            />

            <div className="relative z-20 px-6 sm:px-10 pb-12 sm:pb-16 flex flex-col gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center gap-2 self-start bg-white/10 backdrop-blur-md border border-white/15 px-3.5 py-1.5 rounded-full text-xs font-medium text-white/90"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#efbf04]" />
                Admissions Open 2026/2027
              </motion.div>

              <motion.h1
                className="font-serif uppercase tracking-tight text-white mb-2 leading-[0.98]"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
              >
                <span className="block text-5xl sm:text-6xl font-black tracking-[0.08em] text-[#20cece] drop-shadow-md">
                  QUEENSGATE
                </span>
                <span className="block text-xl sm:text-2xl font-extrabold tracking-[0.18em] text-white mt-1.5 drop-shadow-sm">
                  INTERNATIONAL SCHOOL
                </span>
              </motion.h1>

              <motion.p
                className="font-sans text-base sm:text-lg text-white/80 max-w-md font-light leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
              >
                Your place and space to{' '}
                <span className="text-[#efbf04] font-serif italic font-normal">thrive</span>. Nurturing global leaders through world-class academic excellence.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-3 pt-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
              >
                <Link href="/admissions/apply-now" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full bg-[#20cece] text-[#032f36] font-semibold hover:bg-[#20cece]/90 text-base px-8 py-6 rounded-full shadow-lg shadow-[#20cece]/20 transition-all"
                  >
                    Apply Today <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/academics" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full border-white/20 text-white bg-white/5 hover:bg-white/10 backdrop-blur-md text-base px-6 py-6 rounded-full"
                  >
                    Explore Programs
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>

          {/* ================= DESKTOP LAYOUT ================= */}
          <div className="hidden lg:block max-w-7xl mx-auto px-6 lg:px-8">
            <div
              className="grid lg:grid-cols-12 gap-8 items-center"
              style={{ minHeight: 'calc(100vh - var(--navbar-height, 5rem) - 2.5rem)' }}
            >
              <div className="lg:col-span-8 xl:col-span-8 py-12 lg:py-20 z-10 flex flex-col justify-center">
                
                <motion.h1 
                  className="font-serif uppercase text-white leading-[0.92] mb-8"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                >
                  <span className="block text-6xl sm:text-7xl lg:text-8xl xl:text-[96px] font-black text-white">
                    QUEENSGATE
                  </span>
                  <span className="block text-2xl sm:text-3xl lg:text-4xl xl:text-[42px] font-normal tracking-[0.09em] text-white/95 mt-3 drop-shadow-md">
                    INTERNATIONAL SCHOOL
                  </span>
                </motion.h1>

                <motion.p 
                  className="text-white/80 text-xl lg:text-2xl font-sans font-light max-w-xl mb-10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
                >
                  Your place and space to{" "}
                  <span className="text-[#efbf04] font-serif italic font-semibold">thrive</span>. Preparing students to lead, innovate, and excel on a global stage.
                </motion.p>

                <motion.div
                  className="flex items-center gap-4 mb-12"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
                >
                  <Link href="/admissions/apply-now">
                    <Button
                      size="lg"
                      className="bg-[#20cece] text-[#032f36] font-normal hover:bg-[#20cece]/90 text-base sm:text-lg px-9 py-6 rounded-full shadow-lg shadow-[#20cece]/25 hover:shadow-xl transition-all duration-300"
                    >
                      Apply Today <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>

                  <Link href="/academics">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-white/25 hover:text-white text-white bg-white/5 hover:bg-white/10 backdrop-blur-md text-base sm:text-lg px-8 py-6 rounded-full transition-all"
                    >
                      Explore Academics
                    </Button>
                  </Link>
                </motion.div>

               

              </div>
            </div>
          </div>
        
        </MotionWrapper>

        {/* 
            FLOATING HERO IMAGE LAYER (DESKTOP)
            - Opacity fade property has been completely removed to keep the image vivid and solid.
            - Keeps spring-driven translation, scaling, and dynamic top mask feathering.
        */}
        <motion.div
          className="pointer-events-none absolute left-0 right-0 hidden lg:flex items-end justify-end pr-4 lg:pr-16 xl:pr-28 2xl:pr-36 top-6"
          style={{
            height: 'calc(100vh - 3.5rem)',
            zIndex: heroImageZIndex,
            WebkitMaskImage: useTransform(
              maskTopStart,
              (v) => `linear-gradient(to bottom, transparent 0%, black ${v}%, black 100%)`
            ),
            maskImage: useTransform(
              maskTopStart,
              (v) => `linear-gradient(to bottom, transparent 0%, black ${v}%, black 100%)`
            ),
          }}
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
        >
          <motion.div
            className="w-full max-w-xl xl:max-w-2xl 2xl:max-w-3xl h-full flex items-end justify-end"
            animate={controls}
            style={{
              y: heroImageY,
              scale: heroImageScale,
            }}
          >
            <Image
              src="/images/ndpjkk1uol9irckqx6db.avif"
              alt="Queensgate International School Happy Students"
              width={1200}
              height={900}
              sizes="(max-width: 1200px) 45vw, 40vw"
              className="w-full h-[88%] xl:h-[90%] object-contain drop-shadow-2xl"
              style={{ objectPosition: 'bottom right' }}
              priority
            />
          </motion.div>

          {/* Bottom fade so the image blends into the page background instead of looking cut off */}
          <div
            className="absolute inset-x-0 bottom-0 h-24 xl:h-32 pointer-events-none"
            style={{ background: 'linear-gradient(to top, #032f36 0%, transparent 100%)' }}
          />
        </motion.div>
      </main>

      {/* Other Sections — stacked above the floating hero image so it tucks behind on scroll */}
      <div className="relative z-[70]">
        <ApplySectionProduction />
        <ImprovedHomeSection />
        <Resources />
        <FeaturedNews />
        <Accreditations />
        <CTA />
        <SiteFooter />
      </div>
    </div>
  )
}