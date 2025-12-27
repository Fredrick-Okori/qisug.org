"use client"

import Image from "next/image"
import Link from "next/link"
import { SiteFooter } from "@/components/site-footer"
import { BlueSiteHeader } from "@/components/blue-header"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { 
  BookOpen, 
  MessageSquare, 
  Video, 
  FlaskConical,
  MonitorPlay,
  Users,
  Clock,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Globe,
  GraduationCap,
  Target
} from "lucide-react"
import { CTA } from "@/components/home/cta"

const learningTools = [
  {
    icon: BookOpen,
    title: "Lecture Slides",
    description: "Comprehensive and Accessible Content",
    details: "Our lecture slides are meticulously prepared to cover all essential topics and concepts. These slides are available for students to review at any time, providing a reliable resource for studying and revising course material.",
    color: "from-[#3d4fd4] to-[#2a3dc8ff]"
  },
  {
    icon: MessageSquare,
    title: "Discussion Forums",
    description: "Collaborative Learning Environment",
    details: "Our discussion forums foster collaboration and communication among students and teachers. These forums provide a platform for students to ask questions, share insights, and engage in meaningful academic discussions.",
    color: "from-[#EFBF04] to-[#d4a803]"
  },
  {
    icon: Video,
    title: "Prerecorded Lectures",
    description: "Flexible Learning Opportunities",
    details: "Prerecorded lectures allow students to learn at their own pace. These lectures are available 24/7, enabling students to revisit complex topics and ensure they have a solid understanding before moving forward.",
    color: "from-[#3d4fd4] to-[#2a3dc8ff]"
  },
  {
    icon: MonitorPlay,
    title: "Live Sessions",
    description: "Real-Time Interaction with Instructors",
    details: "Live sessions offer students the opportunity to interact with certified Ontario teachers in real-time. These sessions are designed to provide immediate feedback and support, helping students stay on track and succeed in their studies.",
    color: "from-[#EFBF04] to-[#d4a803]"
  }
]

const virtualLabFeatures = [
  {
    icon: Sparkles,
    title: "Interactive Simulations",
    description: "Our virtual labs feature interactive simulations that replicate real-world scientific experiments, allowing students to manipulate variables and observe outcomes in a controlled environment."
  },
  {
    icon: Target,
    title: "Real-Time Feedback",
    description: "Students receive instant feedback on their experiments, helping them understand their mistakes and learn the correct scientific principles in a dynamic and engaging way."
  },
  {
    icon: Globe,
    title: "Accessible Anywhere",
    description: "Whether at home or on the go, our virtual labs are accessible from any device with an internet connection, providing flexibility and convenience for all students."
  },
  {
    icon: GraduationCap,
    title: "Aligned with Curriculum",
    description: "All virtual lab activities are aligned with the Ontario curriculum, ensuring that students are meeting educational standards while gaining practical, hands-on experience."
  }
]

export default function OurApproachPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <BlueSiteHeader />

      {/* Full-Page Background Pattern */}
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
        {/* Hero Section */}
        <div className="pt-24 sm:pt-28 md:pt-40 lg:pt-50 xl:pt-48 pb-6 sm:pb-8 md:pb-10 lg:pb-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="max-w-5xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            >
              <motion.div
                className="inline-block mb-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <span className="bg-[#3d4fd4] text-white px-6 py-2 text-sm tracking-wider uppercase font-semibold rounded-full">
                  Innovative Education
                </span>
              </motion.div>
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl pt-10 text-[#3d4fd4] leading-tight mb-6">
                Learning Made Simple
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-[#3d4fd4] leading-relaxed">
                Innovative and Engaging Learning Methods
              </p>
            </motion.div>
          </div>
        </div>

        {/* Main Approach Section */}
        <div className="bg-[#EFBF04] relative z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <motion.div
              className="max-w-5xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl lg:text-4xl xl:text-5xl text-[#3d4fd4] mb-8 text-center">
                Innovative Learning for a Digital Age
              </h2>
              <div className="space-y-6 text-[#3d4fd4] text-base sm:text-lg leading-relaxed">
                <p>
                  At Queensgate International School, we leverage cutting-edge technology and innovative teaching methods 
                  to provide a comprehensive and flexible online learning experience. Our approach integrates a variety of 
                  educational tools, including Ontario Certified Textbooks, interactive Virtual Labs, comprehensive Lecture 
                  Slides, and engaging Discussion Forums.
                </p>
                <p>
                  This dynamic blend of resources ensures that students receive a well-rounded education, tailored to their 
                  individual learning styles and needs. Our certified Ontario teachers are dedicated to delivering high-quality 
                  instruction and support, fostering an environment where students can thrive academically and personally.
                </p>
                <p>
                  Through our unique approach, we empower students to achieve their full potential and succeed in an 
                  ever-evolving digital world. Our commitment to excellence means every student receives personalized 
                  attention and access to world-class educational resources.
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Learning Tools Grid */}
        <div className="bg-white relative z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl lg:text-4xl xl:text-5xl text-[#3d4fd4] mb-4">
                Our Learning Tools
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                A comprehensive suite of digital resources designed to enhance your learning experience
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
              {learningTools.map((tool, index) => (
                <motion.div
                  key={tool.title}
                  className="bg-white border-2 border-gray-100 rounded-2xl p-8 hover:border-[#3d4fd4] hover:shadow-xl transition-all duration-300"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${tool.color} rounded-xl flex items-center justify-center mb-4`}>
                    <tool.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#3d4fd4] mb-2">
                    {tool.title}
                  </h3>
                  <p className="text-lg text-gray-700 font-medium mb-3">
                    {tool.description}
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    {tool.details}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Virtual Labs Section */}
        <div className="bg-[#EFBF04] relative z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-[#3d4fd4] rounded-2xl mb-6">
                <FlaskConical className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl lg:text-4xl xl:text-5xl text-[#3d4fd4] mb-4">
                Virtual Labs
              </h2>
              <p className="text-lg text-[#3d4fd4] max-w-3xl mx-auto">
                Cutting-edge virtual laboratory experiences that bring science to life
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
              {virtualLabFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#EFBF04]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-6 h-6 text-[#3d4fd4]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#3d4fd4] mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Ontario Certified Resources Section */}
        <div className="bg-white relative z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl lg:text-4xl xl:text-5xl text-[#3d4fd4] mb-4">
                Ontario Certified Resources
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                All our materials are aligned with Ontario Ministry of Education standards and requirements
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {[
                {
                  title: "Certified Textbooks",
                  description: "Ontario Ministry-approved textbooks and digital resources for every course"
                },
                {
                  title: "Curriculum Alignment",
                  description: "All content is perfectly aligned with Ontario Secondary School Diploma requirements"
                },
                {
                  title: "Regular Updates",
                  description: "Resources are continuously updated to reflect the latest curriculum changes"
                },
                {
                  title: "Qualified Instructors",
                  description: "All teachers are certified by the Ontario College of Teachers"
                },
                {
                  title: "Quality Assurance",
                  description: "Rigorous quality control ensures the highest educational standards"
                },
                {
                  title: "Comprehensive Support",
                  description: "24/7 access to study materials, practice tests, and supplementary resources"
                }
              ].map((resource, index) => (
                <motion.div
                  key={resource.title}
                  className="bg-gradient-to-br from-[#EFBF04]/10 to-white border-2 border-[#EFBF04]/30 rounded-xl p-6 hover:border-[#3d4fd4] hover:shadow-lg transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <CheckCircle2 className="w-6 h-6 text-[#3d4fd4] flex-shrink-0 mt-1" />
                    <h3 className="text-lg font-bold text-[#3d4fd4]">
                      {resource.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {resource.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Why Our Approach Works */}
        <div className="bg-[#EFBF04] relative z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <motion.div
              className="max-w-5xl mx-auto text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl lg:text-4xl xl:text-5xl text-[#3d4fd4] mb-8">
                Designed with You in Mind
              </h2>
              <p className="text-lg text-[#3d4fd4] leading-relaxed mb-12">
                Our approach to learning is designed to cater to the diverse needs of our students, providing them 
                with the tools and resources they need to excel academically. By integrating technology and innovative 
                teaching methods, we ensure that our students are well-prepared for their future educational and 
                professional endeavors.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    icon: Clock,
                    title: "Learn at Your Pace",
                    description: "Access materials 24/7 and progress through courses on your own schedule"
                  },
                  {
                    icon: Users,
                    title: "Personalized Support",
                    description: "One-on-one guidance from certified teachers whenever you need it"
                  },
                  {
                    icon: Target,
                    title: "Proven Results",
                    description: "100% university placement rate with our comprehensive approach"
                  }
                ].map((benefit, index) => (
                  <motion.div
                    key={benefit.title}
                    className="bg-white rounded-xl p-6 shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <benefit.icon className="w-12 h-12 text-[#3d4fd4] mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-[#3d4fd4] mb-3">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {benefit.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Call to Action */}
      <CTA/>
      </main>

      <SiteFooter />
    </div>
  )
}