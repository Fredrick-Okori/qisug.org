"use client"

import React, { useRef, useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, useInView } from "framer-motion"
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
]

export function Resources() {
  const containerRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  const checkScroll = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current
      setAtStart(scrollLeft <= 5) // Small buffer
      setAtEnd(scrollLeft >= scrollWidth - clientWidth - 5)
    }
  }

  const scroll = (direction: "left" | "right") => {
    if (containerRef.current) {
      const scrollAmount = containerRef.current.clientWidth * 0.8
      containerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  useEffect(() => {
    const container = containerRef.current
    if (container) {
      container.addEventListener("scroll", checkScroll)
      checkScroll()
      return () => container.removeEventListener("scroll", checkScroll)
    }
  }, [])

  // Animation variants
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

  const descriptionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: 0.2,
        ease: "easeOut",
      },
    },
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  }

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        delay: 0.5,
      },
    },
  }

  return (
    <section ref={sectionRef} className="py-20 bg-[#EFBF04]">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            variants={headerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="text-4xl md:text-6xl text-[#3d4fd4] font-serif tracking-tight leading-tight"
          >
            Queensgate Certified Courses
          </motion.h2>
          <motion.p
            variants={descriptionVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="mt-4 text-lg md:text-xl text-gray-800"
          >
            Our curriculum is designed to meet the highest standards set by the Ontario Ministry of Education, ensuring that students receive a quality education that is recognized globally.
          </motion.p>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-12">
          {/* Left Button - Always Visible */}
          <motion.button
            variants={buttonVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            whileHover={{ scale: atStart ? 0.9 : 1.1 }}
            whileTap={{ scale: atStart ? 0.9 : 0.95 }}
            onClick={() => scroll("left")}
            disabled={atStart}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-30 bg-white/95 text-gray-800 rounded-full p-4 shadow-2xl transition-all border border-gray-100 hidden md:flex items-center justify-center
              ${atStart ? "opacity-40 cursor-not-allowed" : "opacity-100"}
            `}
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>

          {/* Right Button - Always Visible */}
          <motion.button
            variants={buttonVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            whileHover={{ scale: atEnd ? 0.9 : 1.1 }}
            whileTap={{ scale: atEnd ? 0.9 : 0.95 }}
            onClick={() => scroll("right")}
            disabled={atEnd}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-30 bg-white/95 text-gray-800 rounded-full p-4 shadow-2xl transition-all border border-gray-100 hidden md:flex items-center justify-center
              ${atEnd ? "opacity-40 cursor-not-allowed" : "opacity-100"}
            `}
          >
            <ChevronRight className="w-6 h-6" />
          </motion.button>

          {/* Scrolling Viewport */}
          <motion.div
            ref={containerRef}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar py-10"
          >
            {resources.map((item, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                className="flex-[0_0_260px] sm:flex-[0_0_300px] md:flex-[0_0_340px] snap-center first:pl-4 last:pr-4"
              >
                <Link href={item.href} className="group block outline-none">
                  <motion.div
                    whileHover={{ scale: 1.05, y: -8 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="relative aspect-[3/4.2] rounded-[1.5rem] overflow-hidden shadow-[0_15px_45px_rgba(0,0,0,0.12)] group-hover:shadow-[0_25px_60px_rgba(0,0,0,0.22)] transition-shadow duration-500 bg-gray-100"
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"
                    />

                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      whileHover={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="absolute inset-0 flex flex-col justify-end p-6"
                    >
                      <motion.p
                        className="text-[#EFBF04] text-xl font-semibold"
                        initial={{ y: 10 }}
                        whileHover={{ y: 0 }}
                        transition={{ duration: 0.2, delay: 0.1 }}
                      >
                        {item.title}
                      </motion.p>
                    </motion.div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
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
      `}</style>
    </section>
  )
}