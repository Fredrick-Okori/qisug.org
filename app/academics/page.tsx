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
  Heart,
  Target,
  Lightbulb
} from "lucide-react"

const compulsoryCourses = [
  { name: "English", credits: 4, description: "Develops literacy, communication, and critical thinking skills" },
  { name: "Mathematics", credits: 3, description: "Covers algebra, geometry, and data management" },
  { name: "Science", credits: 2, description: "Introduction to biology, chemistry, and physics" },
  { name: "Canadian History", credits: 1, description: "Explores key events in Canadian history" },
  { name: "Canadian Geography", credits: 1, description: "Examines physical and human geography" },
  { name: "Arts", credits: 1, description: "Encourages creativity through visual arts, music, or drama" },
  { name: "Health & Physical Education", credits: 1, description: "Promotes physical fitness and healthy living" },
  { name: "French as Second Language", credits: 1, description: "Enhances language skills and cultural understanding" },
  { name: "Civics & Careers", credits: 1, description: "Citizenship responsibilities and career planning" }
]

const pathways = [
  {
    title: "Arts & Humanities",
    description: "Explore creative and cultural studies, literature, and social sciences",
    icon: Lightbulb,
  },
  {
    title: "STEM",
    description: "Science, Technology, Engineering, and Mathematics pathways",
    icon: Target,
  },
  {
    title: "Business & Commerce",
    description: "Prepare for careers in business, finance, and entrepreneurship",
    icon: Users,
  },
  {
    title: "Health Sciences",
    description: "Foundation for careers in healthcare and life sciences",
    icon: Heart,
  }
]

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
        {/* Header Section - Pattern visible */}
        <div className="pt-24 sm:pt-28 md:pt-40 lg:pt-50 xl:pt-48 pb-6 sm:pb-8 md:pb-10 lg:pb-12">
          <div className="container mx-auto px-4 py-5">
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
                The Queensgate International School Diploma 
              </motion.h1>
            </div>
          </div>
        </div>

        {/* Introduction Section */}
        <div className="bg-[#EFBF04] relative z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12 lg:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-16 items-start lg:items-center">
              {/* Left Side - Text Content */}
              <div className="order-2 lg:order-1">
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
                    The Queensgate International School Diploma is a prestigious qualification recognized globally. 
                    It signifies the completion of a rigorous and well-rounded education, equipping students with 
                    the knowledge and skills necessary for higher education and the workforce.
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
                    To earn the OSSD, students must complete <strong>30 credits</strong> (18 compulsory, 12 elective), 
                    <strong> 40 hours of community service</strong>, and pass the <strong>Ontario Secondary School 
                    Literacy Test (OSSLT)</strong>. The curriculum is designed to provide a well-rounded education, 
                    preparing students for success in their future careers.
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.8, 
                      ease: [0.22, 1, 0.36, 1],
                      delay: 0.8
                    }}
                  >
                    <a 
                      href="https://www.ontario.ca/page/high-school-graduation-requirements"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        size="lg"
                        className="bg-[#053F52] text-white hover:bg-[#2a3dc8ff] px-8 py-6 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
                      >
                        Learn More <ArrowRight className="ml-2" />
                      </Button>
                    </a>
                  </motion.div>
                </div>
              </div>

              {/* Right Side - Image */}
              <motion.div 
                className="order-1 lg:order-2 w-full"
              
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
                    src="/images/design_portability_1__gfw34rh367u6_large_2x.jpg"
                    alt="OSSD Certificate"
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

        {/* Compulsory Courses Section */}
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
                Compulsory Courses
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                These courses form the foundation of the OSSD curriculum, ensuring students 
                acquire essential skills and knowledge across diverse subject areas
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {compulsoryCourses.map((course, index) => (
                <motion.div
                  key={course.name}
                  className="bg-gradient-to-br from-[#EFBF04]/10 to-white border-2 border-[#EFBF04]/30 rounded-xl p-6 hover:border-[#053F52] hover:shadow-lg transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg text-[#053F52]">
                      {course.name}
                    </h3>
                    <span className="bg-[#EFBF04] text-[#053F52] px-3 py-1 rounded-full text-sm">
                      {course.credits} {course.credits === 1 ? 'Credit' : 'Credits'}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {course.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Pathways Section */}
        <div className="bg-[#EFBF04] relative z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl lg:text-4xl xl:text-5xl text-[#053F52] mb-4">
                Academic Pathways & Streams
              </h2>
              <p className="text-lg text-[#053F52] max-w-3xl mx-auto">
                Choose a pathway that aligns with your passions and career goals. 
                Our flexible curriculum allows you to specialize in areas of interest.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {pathways.map((pathway, index) => (
                <motion.div
                  key={pathway.title}
                  className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                >
                  <div className="w-16 h-16 bg-[#053F52] rounded-xl flex items-center justify-center mb-4">
                    <pathway.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl text-[#053F52] mb-3">
                    {pathway.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {pathway.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Community & Literacy Section */}
        <div className="bg-white relative z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-16 items-start lg:items-center">
              {/* Left Side - Image */}
              <motion.div 
                className="order-1 lg:order-1 w-full"
               

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
                    src="/images/courses-800x800.jpg"
                    alt="Community Service"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                    className="object-cover"
                  />
                </motion.div>
              </motion.div>

              {/* Right Side - Text Content */}
              <div className="order-2 lg:order-2">
                <motion.h2 
                  className="text-3xl lg:text-4xl text-[#053F52] mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  Community Involvement & Literacy
                </motion.h2>
                <div className="space-y-6">
                  <motion.div 
                    className="bg-gradient-to-r from-[#053F52]/10 to-transparent border-l-4 border-[#053F52] p-6 rounded-r-xl"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <h3 className="text-xl text-[#053F52] mb-3">
                      40 Hours Community Service
                    </h3>
                    <p className="text-gray-700 mb-3">
                      Encourages civic responsibility and personal growth through volunteer work, 
                      community service projects, and other approved activities.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-gray-600">
                        <CheckCircle2 className="w-5 h-5 text-[#EFBF04] flex-shrink-0 mt-0.5" />
                        <span>Volunteer work in local organizations</span>
                      </li>
                      <li className="flex items-start gap-2 text-gray-600">
                        <CheckCircle2 className="w-5 h-5 text-[#EFBF04] flex-shrink-0 mt-0.5" />
                        <span>Community service projects</span>
                      </li>
                      <li className="flex items-start gap-2 text-gray-600">
                        <CheckCircle2 className="w-5 h-5 text-[#EFBF04] flex-shrink-0 mt-0.5" />
                        <span>Environmental initiatives</span>
                      </li>
                    </ul>
                  </motion.div>

                  <motion.div 
                    className="bg-gradient-to-r from-[#EFBF04]/10 to-transparent border-l-4 border-[#EFBF04] p-6 rounded-r-xl"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    <h3 className="text-xl text-[#053F52] mb-3">
                      Ontario Secondary School Literacy Test (OSSLT)
                    </h3>
                    <p className="text-gray-700 mb-3">
                      Assesses reading and writing skills across all subject areas. 
                      Typically taken in Grade 10.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-gray-600">
                        <CheckCircle2 className="w-5 h-5 text-[#EFBF04] flex-shrink-0 mt-0.5" />
                        <span>Reading comprehension assessment</span>
                      </li>
                      <li className="flex items-start gap-2 text-gray-600">
                        <CheckCircle2 className="w-5 h-5 text-[#EFBF04] flex-shrink-0 mt-0.5" />
                        <span>Writing skills evaluation</span>
                      </li>
                      <li className="flex items-start gap-2 text-gray-600">
                        <CheckCircle2 className="w-5 h-5 text-[#EFBF04] flex-shrink-0 mt-0.5" />
                        <span>Test preparation support provided</span>
                      </li>
                    </ul>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Support Services Section */}
        <div className="bg-[#EFBF04] relative z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl lg:text-4xl xl:text-5xl text-[#053F52] mb-4">
                How We Support Our Students
              </h2>
              <p className="text-lg text-[#053F52] max-w-3xl mx-auto">
                At Queensgate International School Uganda, we provide a supportive and engaging 
                learning environment to help every student succeed and reach their full potential.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {[
                "Certified Ontario Teachers with extensive experience",
                "Virtual Labs and Interactive Learning Tools",
                "Discussion Forums and Collaborative Projects",
                "Comprehensive Academic Advising",
                "24/7 Access to Online Resources and Textbooks",
                "Personalized Learning Plans"
              ].map((service, index) => (
                <motion.div
                  key={service}
                  className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
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

            <motion.div
              className="text-center mt-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Link href="/admissions/apply-now">
                <Button
                  size="lg"
                  className="bg-[#053F52] text-white hover:bg-[#2a3dc8ff] px-8 py-6 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  Apply Now <ArrowRight className="ml-2" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </main>

      <MainSiteFooter />
    </div>
  )
}
