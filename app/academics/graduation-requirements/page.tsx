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
  MapPin,
  Calendar,
  FileText
} from "lucide-react"

const compulsoryCredits2023 = [
  { credits: "4", subject: "English", details: "1 credit per grade" },
  { credits: "3", subject: "Mathematics", details: "Including at least 1 credit in Grade 11 or 12" },
  { credits: "2", subject: "Science", details: "" },
  { credits: "1", subject: "Canadian History", details: "Grade 10" },
  { credits: "1", subject: "Canadian Geography", details: "Grade 9" },
  { credits: "1", subject: "The Arts", details: "" },
  { credits: "1", subject: "Health and Physical Education", details: "" },
  { credits: "1", subject: "French as a Second Language", details: "" },
  { credits: "0.5", subject: "Career Studies", details: "" },
  { credits: "0.5", subject: "Civics and Citizenship", details: "" },
  { credits: "3", subject: "Group Requirements", details: "1 credit from each of Groups 1, 2, and 3" }
]

const compulsoryCredits2024 = [
  { credits: "4", subject: "English", details: "1 credit per grade" },
  { credits: "3", subject: "Mathematics", details: "Grade 9, Grade 10, and 1 credit in Grade 11 or 12" },
  { credits: "2", subject: "Science", details: "" },
  { credits: "1", subject: "Technological Education", details: "Grade 9 or 10" },
  { credits: "1", subject: "Canadian History", details: "Grade 10" },
  { credits: "1", subject: "Canadian Geography", details: "Grade 9" },
  { credits: "1", subject: "The Arts", details: "" },
  { credits: "1", subject: "Health and Physical Education", details: "" },
  { credits: "1", subject: "French as a Second Language", details: "" },
  { credits: "0.5", subject: "Career Studies", details: "" },
  { credits: "0.5", subject: "Civics and Citizenship", details: "" },
  { credits: "1", subject: "STEM-Related Course", details: "NEW REQUIREMENT" }
]

const stemCourses = [
  "Business Studies",
  "Computer Studies",
  "Cooperative Education",
  "Additional Mathematics or Science",
  "Technological Education"
]

const additionalRequirements = [
  {
    title: "Financial Literacy",
    badge: "Starting 2025",
    icon: Award,
    description: "As part of the compulsory Grade 10 mathematics course, students must achieve a mark of 70% or higher to pass this requirement.",
    note: "This ensures students have essential financial knowledge for their future.",
    color: "from-amber-400/20 to-transparent border-amber-400"
  },
  {
    title: "Literacy Requirement",
    badge: "OSSLT or OLC4O",
    icon: BookOpen,
    description: "Students must meet the provincial literacy standard by either passing the Ontario Secondary School Literacy Test (OSSLT) or completing the Ontario Secondary School Literacy Course (OLC4O).",
    note: "Queensgate offers the OLC4O course for students who need to fulfill this requirement.",
    color: "from-blue-400/20 to-transparent border-blue-400"
  },
  {
    title: "Community Involvement",
    badge: "40 Hours Required",
    icon: Users,
    description: "Complete a minimum of 40 hours of unpaid community service. This requirement helps students gain civic awareness, impact their communities, and explore career options.",
    note: "Our Guidance Team provides a tracking sheet and assists with finding suitable activities.",
    color: "from-green-400/20 to-transparent border-green-400"
  }
]

export default function GraduationRequirementsPage() {
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
                Graduation Requirements
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
                Queensgate International School Diploma (OSSD)
              </motion.p>
            </div>
          </div>
        </div>

        {/* Overview Section */}
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
                  <GraduationCap className="w-8 h-8 text-[#053F52]" />
                  <h2 className="text-3xl font-bold text-[#053F52]">Your Path to Success</h2>
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
                    At Queensgate International School, students must meet specific requirements to earn the 
                    Ontario Secondary School Diploma (OSSD). These requirements ensure a well-rounded education 
                    that prepares students for future academic and career success.
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
                    The requirements vary depending on when students start Grade 9. Students beginning in 
                    <strong> 2023 or earlier</strong> need <strong>30 credits</strong>, while those starting in 
                    <strong> 2024 or later</strong> need <strong>31 credits</strong> including a new STEM requirement.
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
                    Beyond credit requirements, all students must complete additional requirements including 
                    financial literacy, literacy testing, and community service hours.
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
                    src="/images/Life-After-Graduation-Demands-Practical-Skills-in-Ugandan-Education.webp"
                    alt="Graduation Ceremony"
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

        {/* 2023 Cohort Section */}
        <div className="bg-white relative z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center justify-center gap-3 mb-4">
                <Calendar className="w-8 h-8 text-amber-600" />
                <h2 className="text-3xl lg:text-4xl xl:text-5xl text-[#053F52]">
                  For Students Starting Grade 9 in 2023 or Earlier
                </h2>
              </div>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Total: <strong className="text-amber-600">30 Credits Required</strong> (18 compulsory + 12 optional)
              </p>
            </motion.div>

            {/* Compulsory Credits */}
            <div className="mb-12">
              <motion.h3 
                className="text-2xl font-bold text-[#053F52] mb-6 flex items-center gap-2 justify-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <CheckCircle2 className="w-6 h-6 text-amber-600" />
                Compulsory Credits (18 credits)
              </motion.h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
                {compulsoryCredits2023.map((item, index) => (
                  <motion.div
                    key={item.subject}
                    className="bg-gradient-to-r from-amber-50 to-white border-l-4 border-amber-400 rounded-r-xl p-5 hover:shadow-lg transition-all duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-12 h-12 bg-amber-500 text-white rounded-lg flex items-center justify-center font-bold text-lg">
                        {item.credits}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-[#053F52] mb-1">{item.subject}</h4>
                        {item.details && (
                          <p className="text-sm text-gray-600">{item.details}</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Group Requirements */}
            <motion.div 
              className="bg-gradient-to-br from-amber-50 to-white border-2 border-amber-200 rounded-xl p-6 sm:p-8 max-w-5xl mx-auto mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h4 className="font-bold text-[#053F52] text-xl mb-6">Group Requirements (3 credits total):</h4>
              <div className="space-y-4 text-gray-700">
                <div className="bg-white/70 rounded-lg p-4">
                  <span className="font-semibold text-amber-600">Group 1:</span> English, French as a second language, 
                  Native languages, First Nations/Métis/Inuit studies, classical studies and international languages, 
                  social sciences and humanities, Canadian and world studies, guidance and career education, 
                  cooperative education, American Sign Language, Langue des signes québécoise.
                </div>
                <div className="bg-white/70 rounded-lg p-4">
                  <span className="font-semibold text-amber-600">Group 2:</span> Health and physical education, 
                  the arts, business studies, French as a second language, cooperative education, American Sign Language, 
                  Langue des signes québécoise.
                </div>
                <div className="bg-white/70 rounded-lg p-4">
                  <span className="font-semibold text-amber-600">Group 3:</span> Science (Grade 11 or 12), 
                  technological education, French as a second language, computer studies, cooperative education, 
                  American Sign Language, Langue des signes québécoise.
                </div>
                <div className="bg-amber-100 rounded-lg p-4 border-l-4 border-amber-500">
                  <span className="font-semibold text-[#053F52]">Note:</span> Up to 2 credits in French as a 
                  second language (1 from Group 1 and 1 from either Group 2 or 3); Up to 2 credits in 
                  cooperative education from any group.
                </div>
              </div>
            </motion.div>

            {/* Optional Credits */}
            <motion.div 
              className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 sm:p-8 max-w-4xl mx-auto border-2 border-gray-200"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-2xl font-bold text-[#053F52] mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-amber-600" />
                Optional Credits (12 credits)
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <ArrowRight className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Earn 12 optional credits through courses in the school's program calendar</span>
                </li>
                <li className="flex items-start gap-3">
                  <ArrowRight className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Up to 4 credits from approved dual credit programs</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>

        {/* 2024 Cohort Section */}
        <div className="bg-[#EFBF04] relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center justify-center gap-3 mb-4">
                <Calendar className="w-8 h-8 text-[#053F52]" />
                <h2 className="text-3xl lg:text-4xl xl:text-5xl text-[#053F52]">
                  For Students Starting Grade 9 in 2024 or Later
                </h2>
              </div>
              <p className="text-lg text-[#053F52] max-w-3xl mx-auto">
                Total: <strong className="text-[#20cece]">31 Credits Required</strong> (19 compulsory including STEM + 12 optional)
              </p>
            </motion.div>

            {/* Compulsory Credits */}
            <div className="mb-12">
              <motion.h3 
                className="text-2xl font-bold text-[#053F52] mb-6 flex items-center gap-2 justify-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <CheckCircle2 className="w-6 h-6 text-[#20cece]" />
                Compulsory Credits (19 credits including STEM)
              </motion.h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
                {compulsoryCredits2024.map((item, index) => (
                  <motion.div
                    key={item.subject}
                    className={`bg-gradient-to-r from-cyan-50 to-white border-l-4 ${
                      item.subject === "STEM-Related Course" 
                        ? "border-[#20cece] ring-2 ring-[#20cece] ring-offset-2" 
                        : "border-cyan-400"
                    } rounded-r-xl p-5 hover:shadow-lg transition-all duration-300`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`flex-shrink-0 w-12 h-12 ${
                        item.subject === "STEM-Related Course" ? "bg-[#20cece]" : "bg-cyan-500"
                      } text-white rounded-lg flex items-center justify-center font-bold text-lg`}>
                        {item.credits}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-[#053F52] mb-1">
                          {item.subject}
                          {item.subject === "STEM-Related Course" && (
                            <span className="ml-2 text-xs bg-[#20cece] text-white px-2 py-1 rounded-full">
                              NEW
                            </span>
                          )}
                        </h4>
                        {item.details && (
                          <p className="text-sm text-gray-600">{item.details}</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* STEM Course Options */}
            <motion.div 
              className="bg-white rounded-xl p-6 sm:p-8 max-w-5xl mx-auto mb-8 border-2 border-[#20cece]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <Award className="w-8 h-8 text-[#20cece]" />
                <h4 className="font-bold text-[#053F52] text-xl">STEM-Related Course Options:</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {stemCourses.map((course, index) => (
                  <motion.div
                    key={course}
                    className="flex items-center gap-2 bg-cyan-50 p-3 rounded-lg"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <CheckCircle2 className="w-5 h-5 text-[#20cece] flex-shrink-0" />
                    <span className="text-gray-700">{course}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Optional Credits */}
            <motion.div 
              className="bg-white rounded-xl p-6 sm:p-8 max-w-4xl mx-auto border-2 border-gray-200"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-2xl font-bold text-[#053F52] mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-[#20cece]" />
                Optional Credits (12 credits)
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <ArrowRight className="w-5 h-5 text-[#20cece] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Earn 12 optional credits through courses in the school's program calendar</span>
                </li>
                <li className="flex items-start gap-3">
                  <ArrowRight className="w-5 h-5 text-[#20cece] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Up to 4 credits from approved dual credit programs</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Additional Requirements Section */}
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
                Additional Graduation Requirements
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Beyond credit requirements, all students must complete these essential graduation requirements
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {additionalRequirements.map((req, index) => {
                const Icon = req.icon
                return (
                  <motion.div
                    key={req.title}
                    className={`bg-gradient-to-r ${req.color} rounded-xl p-6 hover:shadow-lg transition-all duration-300`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-14 h-14 bg-[#053F52] rounded-xl flex items-center justify-center">
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <span className="bg-[#053F52] text-white text-xs font-bold px-3 py-1 rounded-full">
                        {req.badge}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-[#053F52] mb-3">{req.title}</h3>
                    <p className="text-gray-700 mb-3 leading-relaxed text-sm">
                      {req.description}
                    </p>
                    <p className="text-sm text-gray-600 italic">
                      {req.note}
                    </p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>

        {/* OLC4O Information & Download Section */}
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
                    src="/images/queen-27s-20gate-20web-20nw-06.jpeg"
                    alt="Student Learning"
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
                  <BookOpen className="w-8 h-8 text-[#053F52]" />
                  <h2 className="text-3xl lg:text-4xl text-[#053F52]">
                    About the OLC4O Course
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
                      The Ontario Secondary School Literacy Course (OLC4O) is designed for students who need to 
                      fulfill the literacy requirement for graduation. This course focuses on developing the reading 
                      and writing skills necessary to succeed in school and beyond.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-gray-600">
                        <CheckCircle2 className="w-5 h-5 text-[#053F52] flex-shrink-0 mt-0.5" />
                        <span>Alternative to the OSSLT literacy test</span>
                      </li>
                      <li className="flex items-start gap-2 text-gray-600">
                        <CheckCircle2 className="w-5 h-5 text-[#053F52] flex-shrink-0 mt-0.5" />
                        <span>Comprehensive reading and writing development</span>
                      </li>
                      <li className="flex items-start gap-2 text-gray-600">
                        <CheckCircle2 className="w-5 h-5 text-[#053F52] flex-shrink-0 mt-0.5" />
                        <span>Offered to students who need literacy support</span>
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
                      For more details on graduation requirements, credit planning, and the complete OSSD pathway, 
                      download our comprehensive guide.
                    </p>
                    <Button
                      size="lg"
                      className="bg-[#20cece] text-[#053f52] hover:bg-[#053f52] hover:text-white px-8 py-6 rounded-full transition-all duration-300"
                    >
                      <Download className="mr-2 w-5 h-5" />
                      Download Graduation Requirements Guide
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>



      </main>

      <MainSiteFooter />
    </div>
  )
}