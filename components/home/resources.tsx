"use client"

import React, { useRef, useState, useEffect, useCallback, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, useInView, useReducedMotion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"

const resources = [
  {
    title: "Physics 12",
    image: "/images/file-20220906-16-vkvxrf.avif",
    href: "/resources/physics",
  },
  {
    title: "Calculus and Vectors",
    image: "/images/1366158e-3727-4192-8787-63c649015dc2_JPG.avif",
    href: "/resources/calculus",
  },
  {
    title: "Biology 12",
    image: "/images/home-courses-img-6-1.jpg",
    href: "/resources/biology",
  },
  {
    title: "Curriculum Guide",
    image: "/images/gettyimages-840243874-1-1102x1102.webp",
    href: "/resources/curriculum",
  },
  {
    title: "Chemistry 12",
    image: "/images/home-courses-img-6-1.jpg",
    href: "/resources/chemistry",
  },
] as const

// Debounce utility for scroll events
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

export function Resources() {
  const containerRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })
  const shouldReduceMotion = useReducedMotion()
  
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  // Memoized scroll check function
  const checkScroll = useCallback(() => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current
      setAtStart(scrollLeft <= 5)
      setAtEnd(scrollLeft >= scrollWidth - clientWidth - 5)
    }
  }, [])

  // Debounced scroll handler for better performance
  const debouncedCheckScroll = useMemo(
    () => debounce(checkScroll, 100),
    [checkScroll]
  )

  // Optimized scroll function with RAF for smooth animation
  const scroll = useCallback((direction: "left" | "right") => {
    if (containerRef.current) {
      const scrollAmount = containerRef.current.clientWidth * 0.8
      containerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }, [])

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") scroll("left")
    if (e.key === "ArrowRight") scroll("right")
  }, [scroll])

  useEffect(() => {
    const container = containerRef.current
    if (container) {
      // Use passive listener for better scroll performance
      container.addEventListener("scroll", debouncedCheckScroll, { passive: true })
      checkScroll()
      
      return () => container.removeEventListener("scroll", debouncedCheckScroll)
    }
  }, [checkScroll, debouncedCheckScroll])

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
      transition: { duration: 0.6, delay: 0.2, ease: "easeOut" as const },
    },
  }), [getAnimationVariants])

  const containerVariants = useMemo(() => getAnimationVariants({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 },
    },
  }), [getAnimationVariants])

  const cardVariants = useMemo(() => getAnimationVariants({
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" as const },
    },
  }), [getAnimationVariants])

  const buttonVariants = useMemo(() => getAnimationVariants({
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, delay: 0.5 },
    },
  }), [getAnimationVariants])

  return (
    <section ref={sectionRef} className="py-12 md:py-20 bg-[#EFBF04]">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-16">
          <motion.h2
            variants={headerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="text-3xl md:text-5xl lg:text-6xl text-[#053F52] font-serif tracking-tight leading-tight"
          >
            Queensgate Certified Courses
          </motion.h2>
          <motion.p
            variants={descriptionVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="mt-3 md:mt-4 text-base md:text-lg lg:text-xl text-gray-800 px-4"
          >
            Our curriculum is designed to meet the highest standards set by the Ontario Ministry of Education, ensuring that students receive a quality education that is recognized globally.
          </motion.p>
        </div>

        {/* Hero Image - Optimized with responsive sizes */}
        <div className="relative max-w-7xl mx-auto px-2 sm:px-4 md:px-12 mb-8 md:mb-12">
          <div className="relative w-full aspect-[2.4/1] md:aspect-[2.4/1]">
            <Image
              src="/images/chatgptimagemar272c20252c12_25_02pm.avif"
              alt="Queensgate Certified Courses"
              
              width={1200}
              height={500}
              className="object-contain rounded-lg"
              priority
              quality={85}
            />
          </div>
        </div>

      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
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