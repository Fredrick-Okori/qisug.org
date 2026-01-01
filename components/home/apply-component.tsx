"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowRight, GraduationCap, FileText, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

const cards = [
  {
    title: "Requirements",
    description: "Discover what you need to join our community",
    image: "/images/Laptop and Stationery.avif",
    href: "/admissions/requirements",
    icon: FileText,
    size: "large",
  },
  {
    title: "How to Apply",
    description: "Step-by-step guide to your application",
    image: "/images/Image by Hermes Rivera.avif",
    href: "/admissions/how-to-apply",
    icon: GraduationCap,
    size: "medium",
  },
  {
    title: "Admission Periods",
    description: "Find the right time to start your journey",
    image: "/images/Image by charlesdeluvio.avif",
    href: "/admissions/periods",
    icon: Calendar,
    size: "medium",
  },
]

export function ApplySectionProduction() {
  return (
    <section className="relative py-16 lg:py-24 xl:py-32 bg-gradient-to-br from-[#EFBF04] via-[#EFBF04] to-[#EFBF04] overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-10 right-10 w-72 h-72 bg-[#053F52]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-053F52/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-12 lg:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          
          
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-[#053F52] mb-6 leading-tight">
            Start Your Journey
          </h2>
          
          <p className="text-base lg:text-lg text-gray-800 leading-relaxed mb-8">
            Everything you need to know about joining Queensgate International School. 
            Explore our admissions process and take the first step towards excellence.
          </p>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
            <Link href="/admissions">
              <Button
                className="bg-[#053F52] mr-2 text-white hover:bg-[#053F52] px-8 py-6 text-base font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                Admissions Info
                <ArrowRight className="ml-2 mr-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Bento Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
          
          {/* Card 1 - Large (spans 2 columns on lg+) */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Link href={cards[0].href}>
              <motion.div
                className="relative h-[400px] lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl group cursor-pointer bg-white"
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src={cards[0].image}
                  alt={cards[0].title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                <div className="absolute inset-0 bg-gradient-to-br from-[#053F52]/80 to-[#053F52]/80" />
                
                <div className="absolute inset-0 p-8 lg:p-10 flex flex-col justify-between">
                  <motion.div
                    className="self-start bg-white/20 backdrop-blur-md p-3 rounded-2xl"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    {(() => {
                      const Icon = cards[0].icon
                      return <Icon className="w-8 h-8 text-white" />
                    })()}
                  </motion.div>
                  
                  <div>
                    <h3 className="text-3xl lg:text-4xl  text-white mb-3">
                      {cards[0].title}
                    </h3>
                    <p className="text-white/90 text-base lg:text-lg mb-4">
                      {cards[0].description}
                    </p>
                    <motion.div
                      className="inline-flex items-center gap-2 text-[#EFBF04] font-semibold"
                      whileHover={{ x: 5 }}
                    >
                      Learn More
                      <ArrowRight className="w-5 h-5" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </Link>
          </motion.div>

          {/* Card 2 - Medium */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link href={cards[1].href}>
              <motion.div
                className="relative h-[400px] lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl group cursor-pointer bg-white"
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src={cards[1].image}
                  alt={cards[1].title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                <div className="absolute inset-0 bg-gradient-to-br from-[#053F52]/80 to-[#053F52]/80" />
                
                <div className="absolute inset-0 p-8 flex flex-col justify-between">
                  <motion.div
                    className="self-start bg-[#EFBF04] p-3 rounded-2xl"
                    whileHover={{ scale: 1.1, rotate: -5 }}
                  >
                    {(() => {
                      const Icon = cards[1].icon
                      return <Icon className="w-7 h-7 text-[#053F52]" />
                    })()}
                  </motion.div>
                  
                  <div>
                    <h3 className="text-2xl lg:text-3xl  text-white mb-2">
                      {cards[1].title}
                    </h3>
                    <p className="text-white/90 text-sm lg:text-base mb-4">
                      {cards[1].description}
                    </p>
                    <motion.div
                      className="inline-flex items-center gap-2 text-[#EFBF04] font-semibold text-sm"
                      whileHover={{ x: 5 }}
                    >
                      Explore
                      <ArrowRight className="w-4 h-4" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </Link>
          </motion.div>

          {/* Card 3 - Medium */}
          <motion.div
            className="md:col-span-2 lg:col-span-1"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link href={cards[2].href}>
              <motion.div
                className="relative h-[350px] lg:h-[400px] rounded-3xl overflow-hidden shadow-2xl group cursor-pointer bg-gradient-to-br from-[#053F52] to-[#053F52]"
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src={cards[2].image}
                  alt={cards[2].title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-30"
                />
                
                <div className="absolute inset-0 bg-gradient-to-br from-[#053F52]/80 to-[#053F52]/80" />
                
                <div className="absolute inset-0 p-8 flex flex-col justify-between">
                  <motion.div
                    className="self-start  p-3 rounded-2xl"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    
                  </motion.div>
                  
                  <div>
                    <h3 className="text-2xl lg:text-3xl  text-white mb-2">
                      {cards[2].title}
                    </h3>
                    <p className="text-white/90 text-sm lg:text-base mb-4">
                      {cards[2].description}
                    </p>
                    <motion.div
                      className="inline-flex items-center gap-2 text-[#EFBF04] font-semibold text-sm"
                      whileHover={{ x: 5 }}
                    >
                      View Dates
                      <ArrowRight className="w-4 h-4" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </Link>
          </motion.div>

          {/* Additional Info Card - spans 2 columns on md+ */}
          <motion.div
            className="md:col-span-2 h-[350px] lg:h-[400px] lg:col-span-2"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 lg:p-10 shadow-xl">
              <h3 className="text-2xl lg:text-3xl  text-[#053F52] mb-4">
                Need Help with Your Application?
              </h3>
              <p className="text-gray-700 mb-6 text-base lg:text-lg">
                Our admissions team is here to guide you through every step of the process. 
                Get personalized support and answers to all your questions.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/contact">
                  <Button
                    variant="outline"
                    className="border-2 border-[#053F52] text-[#053F52] hover:bg-[#053F52] hover:text-white rounded-full px-6 py-3"
                  >
                    Contact Admissions
                  </Button>
                </Link>
                <Link href="/faq">
                  <Button
                    variant="ghost"
                    className="text-[#053F52] hover:bg-[#053F52]/10 rounded-full px-6 py-3"
                  >
                    View FAQs
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
