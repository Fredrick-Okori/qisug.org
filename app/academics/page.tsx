"use client"

import Image from "next/image"
import { SiteFooter } from "@/components/site-footer"
import { BlueSiteHeader } from "@/components/blue-header"
import { motion } from "framer-motion"
import { MainSiteFooter } from "@/components/main-footer"

export default function AcademicsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <BlueSiteHeader />

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

      <main className="flex-1 relative">
        {/* Header Section - Pattern visible, fully responsive padding */}
        <div className="pt-24 sm:pt-28 md:pt-32 lg:pt-40 xl:pt-48 pb-6 sm:pb-8 md:pb-10 lg:pb-12">
          <div className="container mx-auto px-4 py-5 sm:px-6 lg:px-8">
            <div className="max-w-5xl">
              <motion.h1 
                className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl   text-[#3d4fd4]"
                style={{ fontWeight: 700 }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.8, 
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.2
                }}
              >
                Lorem ipsum dolor sit amet, consectetuer adipiscing elit
              </motion.h1>
            </div>
          </div>
        </div>

        {/* Content Section - Solid Yellow Background */}
        <div className="bg-[#EFBF04] relative z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12 lg:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-16 items-start lg:items-center">
              {/* Left Side - Text Content */}
              <div className="order-2 lg:order-1">
                <div className="space-y-4 sm:space-y-5 md:space-y-6 text-black">
                  <motion.p 
                    className="text-base sm:text-lg md:text-xl leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.8, 
                      ease: [0.22, 1, 0.36, 1],
                      delay: 0.4
                    }}
                  >
                    Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut
                    laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation
                    ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor
                    in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis
                    at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue
                    duis dolore te feugait nulla facilisi.
                  </motion.p>

                  <motion.p 
                    className="text-base sm:text-lg md:text-xl leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.8, 
                      ease: [0.22, 1, 0.36, 1],
                      delay: 0.6
                    }}
                  >
                    Lorem ipsum dolor sit amet, cons ectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut
                    laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation
                    ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.
                  </motion.p>
                </div>
              </div>

              {/* Right Side - Certificate Image */}
              <motion.div 
                className="order-1 lg:order-2 w-full"
                initial={{ opacity: 0, scale: 0.9, rotate: 3 }}
                animate={{ opacity: 1, scale: 1, rotate: 3 }}
                transition={{ 
                  duration: 0.8, 
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.3
                }}
              >
                <motion.div 
                  className="relative w-full aspect-[4/3] overflow-hidden rounded-lg shadow-2xl"
                  initial={{ rotate: 3 }}
                  whileHover={{ 
                    rotate: 0,
                    scale: 1.02,
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35)"
                  }}
                  transition={{ 
                    duration: 0.3,
                    ease: "easeOut"
                  }}
                >
                  <Image
                    src="/images/certificate_mockup.avif"
                    alt="Certificate mockup"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                    className="object-cover"
                    priority
                  />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <MainSiteFooter />
    </div>
  )
}