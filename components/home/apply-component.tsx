"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ArrowBigDown } from "lucide-react"

const cards = [
  {
    title: "Requirements",
    image: "/images/Laptop and Stationery.avif",
    href: "/admissions/requirements",
    // Position: Bottom left
    position: "bottom-0 left-0",
    delay: 0.2,
  },
  {
    title: "How to apply",
    image: "/images/Image by Hermes Rivera.avif",
    href: "/admissions/how-to-apply",
    // Position: Middle center
    position: "top-1/2 -translate-y-1/2 left-[15%] lg:left-[20%]",
    delay: 0.35,
  },
  {
    title: "Admission Periods",
    image: "/images/Image by charlesdeluvio.avif",
    href: "/admissions/period",
    // Position: Top right
    position: "top-0 left-[30%] lg:left-[40%]",
    delay: 0.5,
  },
]

export function ApplySectionProduction() {
  return (
    <section className="relative py-12 sm:py-16 lg:py-24 xl:py-32 bg-[#EFBF04] overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Content */}
          <motion.div
            className="max-w-xl mx-auto lg:mx-0 z-30"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#3d4fd4] mb-6 leading-tight">
              Join the Future of Education
            </h2>
            
            <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed mb-8">
              Embark on your academic adventure with Queensgate International School. 
              Explore the requirements, understand the application process, and take 
              the first step towards joining our vibrant learning community.
            </p>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Link href="/admissions">
                <Button
                  variant="outline"
                  className="border-2 border-[#3d4fd4] text-[#3d4fd4] hover:bg-[#3d4fd4] hover:text-white px-8 py-6 text-base font-semibold rounded-full transition-all duration-300"
                >
                  Explore
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Cards - Ladder Layout Climbing from Left */}
          <div className="relative w-full h-[600px] sm:h-[700px] lg:h-[800px]">
            {cards.map((card, index) => (
              <motion.div
                key={index}
                className={`absolute ${card.position} w-[75%] sm:w-[70%] lg:w-[65%] max-w-xs z-${(index + 1) * 10}`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: card.delay }}
                whileHover={{ 
                  scale: 1.02, 
                  y: -10,
                  transition: { duration: 0.3 } 
                }}
              >
                <Link href={card.href}>
                  <div className="relative h-64 sm:h-80 lg:h-96 rounded-3xl overflow-hidden shadow-2xl group cursor-pointer">
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    {/* Darker Gradient for better text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                      <motion.div
                        className="flex items-center gap-3 text-white"
                        whileHover={{ x: 8 }}
                      >
                        <span className="tracking-tight">
                          {card.title}
                        </span>
                        <ArrowRight className="w-3 h-3 text-[#EFBF04]" />
                      </motion.div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}