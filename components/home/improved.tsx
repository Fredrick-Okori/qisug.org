import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export function ImprovedHomeSection() {
  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div>
            <motion.h2
              className="text-4xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Experience the QISU Difference
            </motion.h2>
            <motion.p
              className="text-lg mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
              At Queensgate International School Uganda, we are committed to providing an exceptional education that nurtures creativity, critical thinking, and global citizenship. Join us to embark on a transformative learning journey.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Button
                size="lg"
                className="bg-[#3d4fd4] text-white hover:bg-[#2c3bb0] px-6 py-4 rounded-md flex items-center gap-2"
              >
                Learn More <ArrowRight size={20} />
              </Button>
            </motion.div>
          </div>

          {/* Image Content */}
          <div className="relative w-full h-70 lg:h-100">
            <motion.div
              className="absolute inset-0"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <Image
                src="/images/design_portability_1__gfw34rh367u6_large_2x.jpg"
                alt="Queensgate International School Uganda"
                layout="fill"
                objectFit="cover"
                className="rounded-lg shadow-lg"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}