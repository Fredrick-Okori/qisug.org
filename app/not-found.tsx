'use client'
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import MotionWrapper from "@/components/motion-wrapper"
import { BlueSiteHeader } from "@/components/blue-header"

export default function NotFoundPage() {
  return (
    <div className="w-full flex flex-col min-h-screen">
     <BlueSiteHeader/>

      <main className="flex-1 bg-[#053f52] pt-24 sm:pt-32 md:pt-20 lg:pt-25">
        <MotionWrapper className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
              <div className="text-center max-w-2xl">
                {/* Animated 404 heading */}
                <motion.h1
                  className="font-serif text-6xl sm:text-8xl md:text-9xl font-medium text-white mb-6 drop-shadow-2xl"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.8,
                    ease: [0.22, 1, 0.36, 1],
                    delay: 0.2
                  }}
                >
                  404
                </motion.h1>

                {/* Animated subheading */}
                <motion.h2
                  className="font-serif text-2xl sm:text-3xl md:text-4xl font-medium text-white mb-4 drop-shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.8,
                    ease: [0.22, 1, 0.36, 1],
                    delay: 0.4
                  }}
                >
                  Page Not Found
                </motion.h2>

                {/* Animated description */}
                <motion.p
                  className="text-lg sm:text-xl text-white/80 mb-8 drop-shadow-md"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.8,
                    ease: [0.22, 1, 0.36, 1],
                    delay: 0.6
                  }}
                >
                  Sorry, the page you're looking for doesn't exist. It might have been moved or deleted.
                </motion.p>

                {/* Animated button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.8,
                    ease: [0.22, 1, 0.36, 1],
                    delay: 0.8
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link href="/">
                    <Button
                      size="lg"
                      className="bg-[#20cece] text-[#053f52] hover:bg-[#20cece]/90 text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 rounded-md shadow-lg transition-all hover:shadow-xl"
                    >
                      Go Back Home
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </MotionWrapper>
      </main>

      <SiteFooter />
    </div>
  )
}
