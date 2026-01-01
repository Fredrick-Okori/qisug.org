"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useRef, useState, useCallback, useMemo, memo } from "react"
import { motion, useReducedMotion } from "framer-motion"
import dynamic from "next/dynamic"
import MotionWrapper from "@/components/motion-wrapper"
import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

// Lazy load below-the-fold components for better initial page load
const ApplySectionProduction = dynamic(
  () => import("@/components/home/apply-component").then(mod => ({ default: mod.ApplySectionProduction })),
  { 
    loading: () => <div className="min-h-[400px]" />,
    ssr: true 
  }
)

const Resources = dynamic(
  () => import("@/components/home/resources").then(mod => ({ default: mod.Resources })),
  { 
    loading: () => <div className="min-h-[500px]" />,
    ssr: true 
  }
)

const CTA = dynamic(
  () => import("@/components/home/cta").then(mod => ({ default: mod.CTA })),
  { 
    loading: () => <div className="min-h-[300px]" />,
    ssr: true 
  }
)

const ImprovedHomeSection = dynamic(
  () => import("@/components/home/improved").then(mod => ({ default: mod.ImprovedHomeSection })),
  { 
    loading: () => <div className="min-h-[600px]" />,
    ssr: true 
  }
)

// Debounce utility
function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Memoized hero content components for better performance
const MobileHeroContent = memo(({ onApplyClick }: { onApplyClick: () => void }) => (
  <div className="lg:hidden relative min-h-[calc(100vh-8rem)] sm:min-h-[calc(100vh-10rem)]">
    {/* Mobile Image - Optimized with proper sizing */}
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
        src="/images/ndpjkk1uol9irckqx6db.avif"
        alt="Happy students with backpacks at Queensgate International School"
        fill
        sizes="100vw"
        className="object-contain object-top"
        priority
        quality={85}
      />
    </motion.div>

    {/* Text Content */}
    <div className="relative z-20 px-4 sm:px-6 py-8 sm:py-12">
      <div className="max-w-xl mx-auto text-center">
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
          <Link href="/admissions/apply-now" prefetch={false}>
            <Button
              size="lg"
              className="bg-[#20cece] text-white hover:bg-[#20cece]/90 text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 rounded-md shadow-lg transition-all hover:shadow-xl"
              onClick={onApplyClick}
            >
              Apply Today
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  </div>
))
MobileHeroContent.displayName = 'MobileHeroContent'

const DesktopHeroText = memo(({ onApplyClick }: { onApplyClick: () => void }) => (
  <div className="flex items-center justify-center lg:justify-start py-8 sm:py-12 lg:py-20 z-10">
    <div className="max-w-xl w-full text-center lg:text-left px-4 sm:px-6 lg:px-0">
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
        <Link href="/admissions/apply-now" prefetch={false}>
          <Button
            size="lg"
            className="bg-[#20cece] text-[#053f52] rounded-full hover:bg-[#20cece]/90 border-[#20cece] text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 transition-all"
            onClick={onApplyClick}
          >
            Apply Today
          </Button>
        </Link>
      </motion.div>
    </div>
  </div>
))
DesktopHeroText.displayName = 'DesktopHeroText'

export default function HomePage() {
  const [scrollState, setScrollState] = useState({ y: 0, isScrolled: false })
  const rafRef = useRef<number | null>(null)
  const shouldReduceMotion = useReducedMotion()

  // Memoized scroll handler with debouncing
  const handleScroll = useCallback(() => {
    if (rafRef.current) return

    rafRef.current = window.requestAnimationFrame(() => {
      const y = window.scrollY
      setScrollState({
        y,
        isScrolled: y > 50
      })
      rafRef.current = null
    })
  }, [])

  // Debounced version for non-critical updates
  const debouncedScroll = useMemo(
    () => debounce(handleScroll, 16), // ~60fps
    [handleScroll]
  )

  useEffect(() => {
    // Use passive listener for better scroll performance
    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll() // Initial call
    
    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [handleScroll])

  // Memoized transform calculations
  const desktopImageStyle = useMemo(() => {
    if (typeof window === 'undefined') return {}
    
    const parallaxY = Math.min(scrollState.y * 0.6, 220)
    const opacity = Math.max(1 - scrollState.y / 700, 0.45)
    
    return {
      transform: `translate3d(2rem, ${parallaxY}px, 0)`,
      opacity,
      transition: 'transform 160ms linear, opacity 160ms linear',
      willChange: scrollState.y > 0 && scrollState.y < 400 ? 'transform, opacity' : 'auto',
    }
  }, [scrollState.y])

  // Memoized floating animation variants
  const floatingAnimation = useMemo(() => {
    if (shouldReduceMotion) {
      return {}
    }
    return {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }, [shouldReduceMotion])

  // Analytics or tracking callback
  const handleApplyClick = useCallback(() => {
    // Add analytics tracking here if needed
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'click', {
        event_category: 'CTA',
        event_label: 'Apply Today - Hero'
      })
    }
  }, [])

  return (
    <div className="w-full flex flex-col">
      <SiteHeader />

      {/* Hero Section - Optimized */}
      <main className="flex-1 bg-[#053f52] pt-24 sm:pt-32 md:pt-20 lg:pt-25">
        <MotionWrapper className="relative overflow-hidden">
          {/* Mobile/Tablet Layout */}
          <MobileHeroContent onApplyClick={handleApplyClick} />

          {/* Desktop Layout */}
          <div className="hidden lg:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-0 min-h-[calc(100vh-5rem)]">
              <DesktopHeroText onApplyClick={handleApplyClick} />
            </div>
          </div>
        
          {/* Desktop Parallax Image - Optimized with proper GPU acceleration */}
          <motion.div 
            className={`pointer-events-none absolute inset-0 hidden lg:flex items-center justify-end pr-4 xl:pr-8 z-30`}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
              duration: 1, 
              ease: [0.22, 1, 0.36, 1],
              delay: 0.3
            }}
            style={{ contain: 'layout style paint' }}
          >
            <motion.div
              className="w-full max-w-2xl xl:max-w-3xl 2xl:max-w-4xl px-4 max-h-[calc(100vh-6rem)] overflow-visible"
              animate={floatingAnimation}
              style={desktopImageStyle}
            >
              <Image
                src="/images/ndpjkk1uol9irckqx6db.avif"
                alt="Happy students with backpacks at Queensgate International School"
                width={1300}
                height={850}
                sizes="(max-width: 1024px) 0vw, (max-width: 1280px) 50vw, (max-width: 1536px) 45vw, 800px"
                className="w-full object-contain max-h-[calc(100vh-7rem)]"
                style={{ objectPosition: 'bottom' }}
                priority
                quality={90}
              />
            </motion.div>
          </motion.div>
        </MotionWrapper>
      </main>

      {/* Below-the-fold content - Lazy loaded */}
      <ApplySectionProduction />
      <ImprovedHomeSection />
      <Resources />
      <CTA />
      
      <SiteFooter />
    </div>
  )
}