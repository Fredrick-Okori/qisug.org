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
        ease: "easeInOut"
      }
    })
  }, [controls])

  return (
    <div className="w-full flex flex-col">
      <SiteHeader />

      {/* Hero Section */}
      <main className="flex-1 bg-[#203dce] pt-24 sm:pt-32 md:pt-20 lg:pt-25">
        <MotionWrapper className="relative overflow-hidden">
          {/* Mobile/Tablet Layout - Image on top, text overlays at bottom */}
          <div className="lg:hidden relative min-h-[calc(100vh-8rem)] sm:min-h-[calc(100vh-10rem)]">
            {/* Mobile Image - Covers upper portion */}
            <motion.div 
              className="relative w-full h-[50vh] sm:h-[55vh] z-10"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.8, 
                ease: [0.22, 1, 0.36, 1],
                delay: 0.2
              }}
            >
              <Image
                src="/images/students.png"
                alt="Happy students with backpacks"
                fill
                className="object-contain object-top"
                priority
              />
            </motion.div>

            {/* Text Content - Positioned below or overlapping */}
            <div className="relative z-20 px-4 sm:px-6 py-8 sm:py-12">
              <div className="max-w-xl mx-auto text-center">
                {/* Animated heading */}
                <motion.h1 
                  className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-white mb-6 sm:mb-8 drop-shadow-2xl"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.8, 
                    ease: [0.22, 1, 0.36, 1],
                    delay: 0.4
                  }}
                >
                  Queensgate International School
                </motion.h1>
                
                {/* Animated button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.8, 
                    ease: [0.22, 1, 0.36, 1],
                    delay: 0.6
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link href="/admissions">
                    <Button
                      size="lg"
                      className="bg-[#ef] text-white hover:bg-[#3d4fd4]/90 text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 rounded-md shadow-lg transition-all hover:shadow-xl"
                    >
                      Apply Today
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Desktop Layout - Original Grid */}
          <div className="hidden lg:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-0 min-h-[calc(100vh-5rem)]">
              {/* Left Side - Text Content with animations */}
              <div className="flex items-center justify-center lg:justify-start py-8 sm:py-12 lg:py-20 z-10">
                <div className="max-w-xl w-full text-center lg:text-left px-4 sm:px-6 lg:px-0">
                  {/* Animated heading with stagger effect */}
                  <motion.h1 
                    className="font-serif text-4xl sm:text-6xl md:text-5xl lg:text-6xl xl:text-7xl font-medium text-white mb-6 sm:mb-8"
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
                    <Link href="/admissions">
                      <Button
                        size="lg"
                        className="bg-[#EFBF04] text-white hover:bg-[#3d4fd4]/90 text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6  transition-all "
                      >
                        Apply Today
                      </Button>
                    </Link>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        
          {/* Absolute overlay image - Desktop only with parallax, entrance, and floating animation */}
          <motion.div 
            className={`pointer-events-none absolute inset-0 hidden lg:flex items-center justify-end pr-4 xl:pr-8 ${isScrolled ? "z-40" : "z-70"}`}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
              duration: 1, 
              ease: [0.22, 1, 0.36, 1],
              delay: 0.3
            }}
          >
            <motion.div
              className="w-full max-w-2xl xl:max-w-3xl 2xl:max-w-4xl px-4 max-h-[calc(100vh-6rem)] overflow-visible"
              animate={controls}
              style={{
                transform: `translateY(${Math.min(scrollY * 0.6, 220)}px) translateX(2rem)`,
                opacity: Math.max(1 - scrollY / 700, 0.45),
                transition: 'transform 160ms linear, opacity 160ms linear',
              }}
            >
              <Image
                src="/images/students.png"
                alt="Happy students with backpacks"
                width={1300}
                height={850}
                className="w-full object-contain max-h-[calc(100vh-7rem)]"
                style={{ objectPosition: 'bottom' }}
                priority
              />
            </motion.div>
          </motion.div>
        </MotionWrapper>
      </main>
<ApplySectionProduction/>
<Resources/>
<CTA/>
      <SiteFooter />
    </div>
  )
}