"use client"

import Link from "next/link"
import { SiteFooter } from "@/components/site-footer"
import { BlueSiteHeader } from "@/components/blue-header"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { 
  Users, 
  GraduationCap, 
  Award, 
  Globe, 
  Heart,
  Target,
  Lightbulb,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Star,
  Quote
} from "lucide-react"
import { CTA } from "@/components/home/cta"
import Image from "next/image"

// Structured Data for SEO
const aboutSchemaData = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": "Queensgate International School",
  "description": "Queensgate International School is a leading institution dedicated to delivering world-class education to students across the globe.",
  "url": "https://www.qisug.org/about",
  "image": "https://www.qisug.org/images/queen-27s-20gate-20web-20nw-02.jpeg",
  "telephone": "+1-234-567-8900",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "US"
  },
  "foundingDate": "2004",
  "areaServed": "Worldwide",
  "type": "PrivateSchool",
  "numberOfEmployees": {
    "@type": "QuantitativeValue",
    "value": "100+"
  },
  "memberOf": {
    "@type": "Organization",
    "name": "International Baccalaureate"
  }
}

const stats = [
  { icon: Award, number: "100%", label: "University Placement Rate" },
  { icon: GraduationCap, number: "20+", label: "Years of Excellence" },
  { icon: Users, number: "5:1", label: "Student to Teacher Ratio" },
  { icon: Globe, number: "50+", label: "Countries Represented" }
]

const coreValues = [
  {
    icon: Target,
    title: "Excellence",
    description: "We strive for the highest standards in all aspects of education, pushing students to reach their full potential."
  },
  {
    icon: Heart,
    title: "Integrity",
    description: "We foster honesty, ethical behavior, and strong moral character in all our students and staff."
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "We embrace new ideas, technologies, and teaching methods to prepare students for tomorrow's challenges."
  },
  {
    icon: Globe,
    title: "Global Citizenship",
    description: "We develop students who think globally, act locally, and contribute positively to society."
  }
]

const educators = [
  {
    name: "Dr. Sarah Mitchell",
    title: "Head of Mathematics",
    initials: "SM",
    bio: "Dr. Mitchell has over 25 years of experience teaching mathematics at all levels. She holds a PhD in Mathematics Education and is passionate about making complex concepts accessible and engaging for all students.",
    expertise: ["Calculus", "Statistics", "Problem Solving"]
  },
  {
    name: "Mr. James Thompson",
    title: "Head of Sciences",
    initials: "JT",
    bio: "With a Master's degree in Biology and 20 years of teaching experience, Mr. Thompson brings enthusiasm and real-world applications to science classes, inspiring students to explore the natural world.",
    expertise: ["Biology", "Chemistry", "Lab Sciences"]
  },
  {
    name: "Ms. Emily Chen",
    title: "English Department Lead",
    initials: "EC",
    bio: "Ms. Chen holds a Master's in English Literature and has dedicated 15 years to developing students' critical thinking and communication skills through language and literature.",
    expertise: ["Literature", "Writing", "Critical Analysis"]
  }
]

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Class of 2023, Now at University of Toronto",
    content: "Queensgate gave me the foundation I needed to excel at university. The personalized attention and challenging curriculum prepared me for success.",
    rating: 5
  },
  {
    name: "Michael Okonkwo",
    role: "Class of 2022, Now at McGill University",
    content: "The teachers at Queensgate truly care about your success. They pushed me to think critically and helped me discover my passion for engineering.",
    rating: 5
  },
  {
    name: "Amina Hassan",
    role: "Class of 2024, Now at University of British Columbia",
    content: "As an international student, I appreciated the global perspective and supportive environment. Queensgate feels like a family.",
    rating: 5
  }
]

export default function AboutContent() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* JSON-LD Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchemaData) }}
      />
      
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            
              </motion.div>
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl pt-10 text-[#053F52] leading-tight mb-6">
                About Queensgate International School
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-[#053F52] leading-relaxed">
                Excellence in Education, Global in Reach
              </p>
            </motion.div>
          </div>
        </div>

        {/* Our Mission Section */}
        <div className="bg-[#EFBF04]  relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-16 items-start lg:items-center">
              {/* Left Side - Text Content */}
              <div className="order-2 lg:order-1">
                <motion.h2 
                  className="text-3xl lg:text-4xl xl:text-5xl text-[#053F52] mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  Our Mission
                </motion.h2>
                <div className="space-y-4 sm:space-y-5 md:space-y-6 text-[#053F52]">
                  <motion.p 
                    className="text-base sm:text-lg md:text-xl leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    The mission of Queensgate International School is to promote excellence and integrity in learning while 
                    honoring and developing the intellectual, ethical, emotional, and physical capabilities of each individual.
                  </motion.p>

                  <motion.p 
                    className="text-base sm:text-lg md:text-xl leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    Our students will meet the challenges of today and the future, thus enriching the global community. 
                    Through our innovative platform, students learn core academic courses and develop essential skills such 
                    as critical thinking, collaboration, and effective communication.
                  </motion.p>

                  <motion.p 
                    className="text-base sm:text-lg md:text-xl leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                  >
                    Our mission is to create responsible, contributing citizens who feel deeply, think clearly, collaborate, 
                    and act ethically in our society. Queensgate offers programs and courses that are suitable for the next 
                    generation of leaders.
                  </motion.p>
                </div>
              </div>

              {/* Right Side - Image */}
              <motion.div 
                className="order-1 lg:order-2 w-full"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
              >
                <motion.div 
                  className="relative w-full aspect-[4/3] overflow-hidden rounded-lg shadow-2xl"
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35)"
                  }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <Image
                    src="/images/queen-27s-20gate-20web-20nw-02.jpeg"
                    alt="Students learning together"
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

        {/* Stats Section */}
        <div className="bg-[#053F52] max-w-7xl mx-auto rounded-2xl relative z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <motion.h2 
              className="text-3xl lg:text-4xl xl:text-5xl text-white text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Queensgate by the Numbers
            </motion.h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="bg-gradient-to-br from-[#053F52] to-[#053F52] rounded-2xl p-8 text-center shadow-xl hover:shadow-2xl transition-all duration-300"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                >
                  <stat.icon className="w-12 h-12 mx-auto mb-4 text-[#20cece]" />
                  <div className="text-4xl md:text-5xl text-white mb-2">
                    {stat.number}
                  </div>
                  <div className="text-base text-white/90">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Core Values Section */}
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
                Our Core Values
              </h2>
              <p className="text-lg text-[#053F52] max-w-3xl mx-auto">
                The principles that guide everything we do at Queensgate International School
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {coreValues.map((value, index) => (
                <motion.div
                  key={value.title}
                  className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                >
                  <div className="w-16 h-16 bg-[#20cece] rounded-xl flex items-center justify-center mb-4">
                    <value.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl text-[#053F52] mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Meet Our Educators Section */}
        <div className="bg-[#053F52] relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl lg:text-4xl xl:text-5xl text-white mb-4">
                Meet Our Educators
              </h2>
              <p className="text-lg text-white max-w-3xl mx-auto">
                Our faculty consists of highly experienced and passionate educators dedicated to 
                fostering academic excellence and personal growth
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {educators.map((teacher, index) => (
                <motion.div
                  key={teacher.name}
                  className="bg-gradient-to-br from-[#EFBF04]/10 to-white border-2 border-[#EFBF04]/30 rounded-xl overflow-hidden hover:border-[#053F52] hover:shadow-xl transition-all duration-300"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="relative h-48 bg-gradient-to-br from-[#053F52] to-[#2a3dc8ff] flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-white text-4xl font-bold">
                      {teacher.initials}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-[#053F52] mb-1">
                      {teacher.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {teacher.title}
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed mb-4">
                      {teacher.bio}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {teacher.expertise.map((skill) => (
                        <span 
                          key={skill}
                          className="bg-[#EFBF04]/20 text-[#053F52] px-3 py-1 rounded-full text-xs font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Principal's Message Section */}
        <div className="bg-[#EFBF04] relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-16 items-start lg:items-center">
              {/* Left Side - Image */}
              <motion.div 
                className="order-1 lg:order-1 w-full"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              >
                <motion.div 
                  className="relative w-full aspect-[3/4] overflow-hidden rounded-lg shadow-2xl"
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35)"
                  }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#053F52] to-[#053F52] flex items-center justify-center">
                    <div className="text-white text-center p-8">
                      <div className="w-40 h-40 mx-auto rounded-full bg-white/20 flex items-center justify-center text-7xl font-bold mb-4">
                        MW
                      </div>
                      <p className="text-2xl font-bold">Dr. Margaret Williams</p>
                      <p className="text-lg opacity-90">Principal</p>
                    </div>
                  </div>
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
                  A Message from Our Principal
                </motion.h2>
                <div className="space-y-4 text-[#053F52] text-base sm:text-lg leading-relaxed">
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    At Queensgate International School, we excel in preparing students for universities and colleges 
                    worldwide through our comprehensive academic program. As a forward-thinking institution, we are 
                    dedicated to educating young minds with purpose and passion.
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    Our staff ensures students are adaptable, resilient, and resourceful, contributing to our 100% 
                    post-secondary placement record. At Queensgate, students follow a rigorous curriculum while 
                    developing essential skills like independent thinking, collaboration, and effective communication.
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                  >
                    Our community provides a peaceful and conducive learning environment. The smaller school community 
                    allows our staff to know each student by name and offer personalized academic guidance.
                  </motion.p>
                  <motion.div 
                    className="mt-6 pt-6 border-t-2 border-[#053F52]/20"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                  >
                    <p className="font-semibold text-[#053F52]">Dr. Margaret Williams</p>
                    <p className="text-sm text-[#053F52]/80">Principal, Queensgate International School</p>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Student Testimonials Section */}
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
                Student Success Stories
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Hear from our graduates about their Queensgate experience
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  className="bg-gradient-to-br from-[#20cece]/10 to-white border-2 border-[#20cece]/30 rounded-xl p-6 hover:border-[#053F52] hover:shadow-xl transition-all duration-300"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Quote className="w-10 h-10 text-[#053f52] mb-4" />
                  <p className="text-gray-700 mb-4 leading-relaxed italic">
                    "{testimonial.content}"
                  </p>
                  <div className="flex gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#EFBF04] text-[#EFBF04]" />
                    ))}
                  </div>
                  <div>
                    <p className="font-semibold text-[#053F52]">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Global Excellence Section */}
        <div className="bg-[#EFBF04] relative z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <motion.div
              className="max-w-4xl mx-auto text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl lg:text-4xl xl:text-5xl text-[#053F52] mb-6">
                Empowering Students Globally with Exceptional Education
              </h2>
              <div className="space-y-4 text-[#053F52] text-base sm:text-lg leading-relaxed">
                <p>
                  Queensgate International School is a leading institution dedicated to delivering world-class education 
                  to students across the globe. With over 20 years of educational leadership, we offer a robust and 
                  interactive learning platform that ensures a comprehensive and engaging educational experience.
                </p>
                <p>
                  Our experienced and qualified teachers provide individualized attention with a low student-teacher ratio, 
                  fostering academic excellence and personal growth. Students can join at any grade level, provided they 
                  have the necessary previous educational records.
                </p>
                <p>
                  At Queensgate, we are committed to preparing students for post-secondary success with a 100% placement 
                  record, emphasizing adaptability, resilience, and resourcefulness.
                </p>
              </div>

              <motion.div
                className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                {[
                  { icon: BookOpen, text: "Comprehensive Curriculum" },
                  { icon: Users, text: "Personalized Learning" },
                  { icon: Award, text: "100% University Placement" }
                ].map((feature, index) => (
                  <div 
                    key={index}
                    className="bg-white rounded-xl p-6 shadow-lg"
                  >
                    <feature.icon className="w-10 h-10 text-[#20cece] mx-auto mb-3" />
                    <p className="text-gray-700 font-medium">{feature.text}</p>
                  </div>
                ))}
              </motion.div>
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

