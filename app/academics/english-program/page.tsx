"use client"

import Image from "next/image"
import Link from "next/link"
import { BlueSiteHeader } from "@/components/blue-header"
import { MainSiteFooter } from "@/components/main-footer"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { 
  ArrowRight, 
  BookOpen, 
  Award, 
  CheckCircle2,
  Users,
  Globe,
  GraduationCap,
  Download,
  Mail,
  Phone,
  MapPin
} from "lucide-react"

const programLevels = [
  { 
    level: "Level 1 (ESLAO/ELDAO)", 
    description: "For beginners with limited proficiency.",
    color: "from-red-400/20 to-transparent border-red-400"
  },
  { 
    level: "Level 2 (ESLBO/ELDBO)", 
    description: "For students with basic English skills.",
    color: "from-orange-400/20 to-transparent border-orange-400"
  },
  { 
    level: "Level 3 (ESLCO/ELDCO)", 
    description: "Intermediate level focusing on expanding vocabulary and comprehension.",
    color: "from-yellow-400/20 to-transparent border-yellow-400"
  },
  { 
    level: "Level 4 (ESLDO/ELDDO)", 
    description: "Advanced level emphasizing complex sentence structures and academic language.",
    color: "from-green-400/20 to-transparent border-green-400"
  },
  { 
    level: "Level 5 (ESLEO/ELDEO)", 
    description: "Proficiency level preparing students for mainstream English courses and academic success.",
    color: "from-blue-400/20 to-transparent border-blue-400"
  }
]

const supportServices = [
  "Certified Ontario Teachers with extensive experience",
  "Interactive Learning Tools and Virtual Labs",
  "Small Class Sizes for Personalized Attention",
  "Comprehensive Language Assessment",
  "Cultural Integration Support",
  "Personalized Learning Plans"
]

export default function ESLProgramPage() {
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
        {/* Header Section - Pattern visible */}
        <div className="pt-24 sm:pt-28 md:pt-40 lg:pt-50 xl:pt-48 pb-6 sm:pb-8 md:pb-10 lg:pb-12">
          <div className="max-w-7xl mx-auto px-4 py-5">
            <div className="max-w-5xl">
            
              <motion.h1 
                className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl pt-10 text-[#053F52]"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.8, 
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.2
                }}
              >
                ESL Program
              </motion.h1>
              <motion.p
                className="text-xl sm:text-2xl text-[#053F52] mt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.8, 
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.3
                }}
              >
                English as a Second Language
              </motion.p>
            </div>
          </div>
        </div>

        {/* Program Overview Section */}
        <div className="bg-[#EFBF04] relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12 lg:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-16 items-start lg:items-center">
              {/* Left Side - Text Content */}
              <div className="order-2 lg:order-1">
                <motion.div
                  className="flex items-center gap-3 mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.8, 
                    ease: [0.22, 1, 0.36, 1],
                    delay: 0.3
                  }}
                >
                  <BookOpen className="w-8 h-8 text-[#053F52]" />
                  <h2 className="text-3xl font-bold text-[#053F52]">Program Overview</h2>
                </motion.div>

                <div className="space-y-4 sm:space-y-5 md:space-y-6 text-[#053F52]">
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
                    At Queensgate International School, we offer a comprehensive English as a Second Language (ESL) 
                    program tailored to meet the diverse needs of our students. Our ESL program is designed to help 
                    students from various linguistic backgrounds achieve fluency in English, focusing on both everyday 
                    communication and academic language skills.
                  </motion.p>

                  <motion.p 
                    className="text-base sm:text-lg md:text-xl leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.8, 
                      ease: [0.22, 1, 0.36, 1],
                      delay: 0.5
                    }}
                  >
                    Each student begins with a placement test to determine their current level, ensuring they receive 
                    instruction that is appropriate and effective for their individual needs. The ESL curriculum is 
                    structured into <strong>five levels</strong>, from beginner to advanced, allowing students to 
                    progress at their own pace.
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
                    The goal of our ESL and ELD programs is to equip students with the language skills necessary to 
                    succeed in mainstream academic courses and beyond, while maintaining their cultural identities and 
                    becoming both bilingual and bicultural.
                  </motion.p>
                </div>
              </div>

              {/* Right Side - Image */}
              <motion.div 
                className="order-1 lg:order-2 w-full"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  duration: 0.8, 
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.3
                }}
              >
                <motion.div 
                  className="relative w-full aspect-[4/3] overflow-hidden rounded-lg shadow-2xl"
                  whileHover={{ 
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35)"
                  }}
                  transition={{ 
                    duration: 0.3,
                    ease: "easeOut"
                  }}
                >
                  <Image
                    src="/images/Image by Ivan Shilov.avif"
                    alt="ESL Classroom"
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

        {/* Program Levels Section */}
        <div className="bg-white relative z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl lg:text-4xl xl:text-5xl text-[#053F52] mb-4">
                Program Levels
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Our ESL program is structured into five progressive levels, each designed to build 
                language skills and confidence
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {programLevels.map((item, index) => (
                <motion.div
                  key={item.level}
                  className={`bg-gradient-to-r ${item.color} border-l-4 rounded-r-xl p-6 hover:shadow-lg transition-all duration-300`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <h3 className="text-lg font-bold text-[#053F52] mb-3">
                    {item.level}
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Information & Download Section */}
        <div className="bg-[#EFBF04] relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-16 items-start lg:items-center">
              {/* Left Side - Image */}
              <motion.div 
                className="order-1 lg:order-1 w-full"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.8, 
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.2
                }}
              >
                <motion.div 
                  className="relative w-full aspect-[4/3] overflow-hidden rounded-lg shadow-2xl"
                  whileHover={{ 
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35)"
                  }}
                  transition={{ 
                    duration: 0.3,
                    ease: "easeOut"
                  }}
                >
                  <Image
                    src="/images/courses-800x800.jpg"
                    alt="ESL Learning"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                    className="object-cover"
                  />
                </motion.div>
              </motion.div>

              {/* Right Side - Text Content */}
              <div className="order-2 lg:order-2">
                <motion.div
                  className="flex items-center gap-3 mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <GraduationCap className="w-8 h-8 text-[#053F52]" />
                  <h2 className="text-3xl lg:text-4xl text-[#053F52]">
                    Additional Information
                  </h2>
                </motion.div>

                <div className="space-y-6">
                  <motion.div 
                    className="bg-white/80 border-l-4 border-[#053F52] p-6 rounded-r-xl"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <p className="text-gray-700 mb-4 leading-relaxed">
                      Students typically complete one ESL and one ELD course per semester, progressing through 
                      the levels as their skills improve. Our program emphasizes maintaining students' cultural 
                      identities while helping them achieve fluency in English, making them both bilingual and 
                      bicultural.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-gray-600">
                        <CheckCircle2 className="w-5 h-5 text-[#053F52] flex-shrink-0 mt-0.5" />
                        <span>Placement testing for appropriate level assignment</span>
                      </li>
                      <li className="flex items-start gap-2 text-gray-600">
                        <CheckCircle2 className="w-5 h-5 text-[#053F52] flex-shrink-0 mt-0.5" />
                        <span>Self-paced progression through levels</span>
                      </li>
                      <li className="flex items-start gap-2 text-gray-600">
                        <CheckCircle2 className="w-5 h-5 text-[#053F52] flex-shrink-0 mt-0.5" />
                        <span>Cultural identity preservation</span>
                      </li>
                    </ul>
                  </motion.div>

                  <motion.div 
                    className="bg-white/80 rounded-xl p-6 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    <p className="text-[#053F52] mb-4 font-medium">
                      For more details on the program structure and course progression chart, download our complete ESL program guide.
                    </p>
                    <Button
                      size="lg"
                      className="bg-[#20cece] text-[#053f52] hover:bg-[#053f52] hover:text-white px-8 py-6 rounded-full transition-all duration-300"
                    >
                      <Download className="mr-2 w-5 h-5" />
                      Download Full ESL Program Guide
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Support Services Section */}
        <div className="bg-white relative z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl lg:text-4xl xl:text-5xl text-[#053F52] mb-4">
                How We Support Our ESL Students
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                At Queensgate International School, we provide a supportive and engaging learning 
                environment to help every ESL student succeed and achieve English fluency.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {supportServices.map((service, index) => (
                <motion.div
                  key={service}
                  className="bg-gradient-to-br from-[#EFBF04]/10 to-white border-2 border-[#EFBF04]/30 rounded-xl p-6 hover:border-[#053F52] hover:shadow-lg transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-[#053F52] flex-shrink-0 mt-1" />
                    <p className="text-gray-700">
                      {service}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>


      </main>

      <MainSiteFooter />
    </div>
  )
}
