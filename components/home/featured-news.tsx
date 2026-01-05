import React from 'react'
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
  FileText,
  Calendar,
  Clock,
  Bell,
  Megaphone,
  Star,
  TrendingUp,
  Heart,
  Trophy,
  Sparkles,
  MessageSquare
} from "lucide-react"


const featuredNews = [
  {
    id: 1,
    title: "Queensgate Students Excel in Provincial Math Competition",
    excerpt: "Our students brought home multiple awards from the Ontario Mathematics Competition, showcasing excellence in STEM education.",
    date: "January 15, 2025",
    category: "Achievements",
    image: "/images/1366158e-3727-4192-8787-63c649015dc2_JPG.avif",
    author: "Principal Anderson",
    readTime: "3 min read",
    featured: true
  },
  {
    id: 2,
    title: "New STEM Lab Opening February 2025",
    excerpt: "State-of-the-art science and technology laboratory to enhance hands-on learning experiences for all students.",
    date: "January 10, 2025",
    category: "Facilities", 
    image: "/images/queen-27s-20gate-20web-20nw-06.jpeg",
    author: "Administration",
    readTime: "4 min read",
    featured: true
  }
]
export default function FeaturedNews(){
    return(
        <>
                {/* Featured News Section */}
        <div className="relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <motion.div
              className="mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-4">
                
                <h2 className="text-3xl text-left lg:text-4xl text-[#053F52]">
                  Featured Announcements
                </h2>
              </div>
                <p className='text-[#052f53]'>Here is what is happening at QISU</p>
            
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
              {featuredNews.map((article, index) => (
                <motion.article
                  key={article.id}
                  className="bg-[#efbf04] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-[#efbf04] hover:border-[#20cece] group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-[#EFBF04] text-[#053F52] text-xs  px-3 py-1 rounded-full">
                        {article.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {article.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {article.readTime}
                      </span>
                    </div>
                    <h3 className="text-xl  text-[#053F52] mb-3 group-hover:text-[#20cece] transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-gray-700 mb-4 leading-relaxed">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">By {article.author}</span>
                      <Button
                        size="sm"
                        className="bg-[#20cece] text-white hover:bg-[#053F52] transition-colors"
                      >
                        Read More
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
        </>
    )
}