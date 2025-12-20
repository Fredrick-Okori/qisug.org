"use client"

import Image from "next/image"
import { SiteFooter } from "@/components/site-footer"
import { BlueSiteHeader } from "@/components/blue-header"
import { motion } from "framer-motion"
import { Users, GraduationCap, Award, Globe } from "lucide-react"

export default function AboutPage() {
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
        {/* Hero Section with Pattern */}
        <div className="pt-24 sm:pt-28 md:pt-32 lg:pt-40 xl:pt-48 pb-6 sm:pb-8 md:pb-10 lg:pb-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="max-w-5xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            >
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-[#3d4fd4] leading-tight mb-6">
                About Queensgate International School
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-black leading-relaxed">
                Excellence in Education, Global in Reach
              </p>
            </motion.div>
          </div>
        </div>

        {/* Main Content - Solid Yellow Background */}
        <div className="bg-[#EFBF04] relative z-10">
          {/* Our Mission Section */}
          <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-[#3d4fd4] mb-6">
                  Our Mission
                </h2>
                <div className="space-y-4 text-black text-base sm:text-lg leading-relaxed">
                  <p>
                    The mission of Queensgate International School is to promote excellence and integrity in learning while 
                    honoring and developing the intellectual, ethical, emotional, and physical capabilities of each individual.
                  </p>
                  <p>
                    Our students will meet the challenges of today and the future, thus enriching the global community. 
                    Queensgate is committed to challenging and educating the whole person in a dynamic learning environment.
                  </p>
                  <p>
                    Through our innovative platform, students learn core academic courses and develop essential skills such 
                    as critical thinking, collaboration, and effective communication, all while being part of their global community.
                  </p>
                  <p>
                    Our mission is to create responsible, contributing citizens who feel deeply, think clearly, collaborate, 
                    and act ethically in our society. Queensgate offers programs and courses that are suitable for the next 
                    generation of leaders.
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-2xl"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              >
                <Image
                  src="/images/queen-27s-20gate-20web-20nw-02.jpeg"
                  alt="Students learning together"
                  fill
                  className="object-cover"
                />
              </motion.div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="bg-[#3d4fd4] py-12 lg:py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.h2 
                className="font-serif text-3xl md:text-4xl font-bold text-white text-center mb-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                Queensgate by the Numbers
              </motion.h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { icon: Award, number: "100%", label: "University Placement Rate" },
                  { icon: GraduationCap, number: "20+", label: "Years of Educational Excellence" },
                  { icon: Users, number: "5:1", label: "Student to Teacher Ratio" },
                  { icon: Globe, number: "50+", label: "Countries Represented" }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    className="text-center"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <stat.icon className="w-12 h-12 mx-auto mb-4 text-[#EFBF04]" />
                    <div className="text-5xl md:text-6xl font-bold text-white mb-2">
                      {stat.number}
                    </div>
                    <div className="text-lg text-white/90">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Meet Our Team Section */}
          <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
            <motion.h2 
              className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-[#3d4fd4] text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Meet Our Educators
            </motion.h2>
            
            <p className="text-center text-lg text-black mb-12 max-w-3xl mx-auto">
              At Queensgate, our faculty consists of highly experienced and passionate educators dedicated to 
              fostering academic excellence and personal growth.
            </p>

            {/* Faculty Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
              {[
                {
                  name: "Dr. Sarah Mitchell",
                  title: "Head of Mathematics",
                  bio: "Dr. Mitchell has over 25 years of experience teaching mathematics at all levels. She holds a PhD in Mathematics Education and is passionate about making complex mathematical concepts accessible and engaging for all students.",
                  image: "/images/teacher-1.jpg"
                },
                {
                  name: "Mr. James Thompson",
                  title: "Head of Sciences",
                  bio: "With a Master's degree in Biology and 20 years of teaching experience, Mr. Thompson brings enthusiasm and real-world applications to his science classes, inspiring students to explore the wonders of the natural world.",
                  image: "/images/teacher-2.jpg"
                },
                {
                  name: "Ms. Emily Chen",
                  title: "English Department Lead",
                  bio: "Ms. Chen holds a Master's in English Literature and has dedicated 15 years to developing students' critical thinking and communication skills through the power of language and literature.",
                  image: "/images/teacher-3.jpg"
                }
              ].map((teacher, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="relative h-64 bg-gradient-to-br from-[#3d4fd4] to-[#2a2d8c]">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-32 h-32 rounded-full bg-white/20 flex items-center justify-center text-white text-5xl font-bold">
                        {teacher.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-[#3d4fd4] mb-1">
                      {teacher.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {teacher.title}
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {teacher.bio}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Principal's Message Section */}
          <section className="bg-white/30 backdrop-blur-sm py-12 lg:py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                <motion.div
                  className="order-2 lg:order-1"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#3d4fd4] mb-6">
                    A Message from Our Principal
                  </h2>
                  <div className="space-y-4 text-black text-base sm:text-lg leading-relaxed">
                    <p>
                      At Queensgate International School, we excel in preparing students for universities and colleges 
                      worldwide through our comprehensive academic program. As a forward-thinking institution, we are 
                      dedicated to educating young minds with purpose and passion.
                    </p>
                    <p>
                      Our staff ensures students are adaptable, resilient, and resourceful, contributing to our 100% 
                      post-secondary placement record. At Queensgate, students follow a rigorous curriculum while 
                      developing essential skills like independent thinking, collaboration, and effective communication.
                    </p>
                    <p>
                      Our community provides a peaceful and conducive learning environment. Students find it both 
                      challenging and supportive. The smaller school community allows our staff to know each student 
                      by name and offer personalized academic guidance.
                    </p>
                    <p>
                      It is a privilege to work with such ambitious students. We look forward to welcoming you to 
                      Queensgate International School and wish each of our students success in their academic endeavors.
                    </p>
                    <div className="mt-6">
                      <p className="font-semibold text-[#3d4fd4]">Dr. Margaret Williams</p>
                      <p className="text-sm text-gray-700">Principal, Queensgate International School</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="order-1 lg:order-2 relative aspect-[3/4] rounded-lg overflow-hidden shadow-2xl"
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#3d4fd4] to-[#2a2d8c] flex items-center justify-center">
                    <div className="text-white text-center p-8">
                      <div className="w-40 h-40 mx-auto rounded-full bg-white/20 flex items-center justify-center text-7xl font-bold mb-4">
                        MW
                      </div>
                      <p className="text-2xl font-bold">Dr. Margaret Williams</p>
                      <p className="text-lg opacity-90">Principal</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Global Excellence Section */}
          <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
            <motion.div
              className="max-w-4xl mx-auto text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-[#3d4fd4] mb-6">
                Empowering Students Globally with Exceptional Education
              </h2>
              <div className="space-y-4 text-black text-base sm:text-lg leading-relaxed">
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
                  record, emphasizing adaptability, resilience, and resourcefulness. Join us to embark on a journey of 
                  academic achievement and global opportunities.
                </p>
              </div>
            </motion.div>
          </section>

          {/* Call to Action */}
          <section className="bg-[#3d4fd4] py-16 lg:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                  Begin Your Journey with Queensgate Today
                </h2>
                <p className="text-lg md:text-xl text-white/90 mb-8 max-w-3xl mx-auto">
                  No matter where you are in the world, you can access our prestigious education. Join Queensgate 
                  International School and experience world-class learning tailored to your needs.
                </p>
                <motion.a
                  href="/admissions"
                  className="inline-block bg-[#EFBF04] text-[#3d4fd4] px-8 py-4 rounded-md text-lg font-bold hover:bg-[#d4a803] transition-colors shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Apply Now
                </motion.a>
              </motion.div>
            </div>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}