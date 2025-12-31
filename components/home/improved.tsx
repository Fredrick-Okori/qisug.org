import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, User, Globe, Clock, GraduationCap } from 'lucide-react'
import Link from 'next/link'

const features = [
  {
    icon: User,
    title: "Personalized Education",
    description: "Individualized learning plans tailored to each student's unique needs and pace, with small class sizes ensuring one-on-one support."
  },
  {
    icon: Globe,
    title: "Global Community",
    description: "A diverse, multicultural environment that celebrates different perspectives and prepares students for an interconnected world."
  },
  {
    icon: Clock,
    title: "Flexible Learning",
    description: "24/7 access to course materials with the freedom to learn at your own pace, from anywhere in the world."
  },
  {
    icon: GraduationCap,
    title: "Qualified Educators",
    description: "Learn from experienced professionals passionate about teaching and committed to your success."
  }
]

export function ImprovedHomeSection() {
  return (
    <div className='bg-[#EFBF04]'>

   
    <section className="bg-[#053F52] max-w-7xl rounded-2xl mx-auto py-16 lg:py-24">
      <div className="container mx-auto px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text Content */}
          <div>
            <motion.h2
              className="text-4xl lg:text-5xl mb-6 text-white"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Why Choose QISU
            </motion.h2>
            <motion.p
              className="text-lg text-white mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              At Queensgate International School Uganda, we are committed to providing an exceptional education that nurtures creativity, critical thinking, and global citizenship.
            </motion.p>

            {/* Features Grid */}
            <div className="space-y-6 mb-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="flex gap-4 items-start"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-[#EFBF04] rounded-lg flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-[#3d4fd4]" />
                  </div>
                  <div>
                    <h3 className=" text-lg text-white mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-white text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <Link href="/about">
                <Button
                  size="lg"
                  className="bg-[#EFBF04] text-white hover:bg-[#2c3bb0] px-8 py-6 rounded-full flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Learn More <ArrowRight size={20} />
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Image Content */}
          <div className="relative w-full h-[500px] lg:h-[600px]">
            <motion.div
              className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl"
              initial={{ scale: 0.95, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <Image
                src="/images/design_portability_1__gfw34rh367u6_large_2x.jpg"
                alt="Queensgate International School Uganda"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#3d4fd4]/20 to-transparent" />
            </motion.div>

            {/* Floating Stats Card */}
            <motion.div
              className="absolute bottom-8 left-8 right-8 bg-[#EFBF04]/95 backdrop-blur-sm rounded-xl p-6 shadow-xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-[#053F52]">1000+</div>
                  <div className="text-xs text-gray-600">Students</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#053F52]">50+</div>
                  <div className="text-xs text-gray-600">Countries</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#053F52]">15+</div>
                  <div className="text-xs text-gray-600">Years</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
     </div>
  )
}
