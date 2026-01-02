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

const recentAnnouncements = [
  {
    title: "Spring Semester Registration Now Open",
    date: "January 20, 2025",
    type: "Important",
    icon: Bell,
    description: "Registration for Spring 2025 semester is now open. Students can access the course selection portal through their student accounts. Deadline: February 15, 2025.",
    color: "from-red-400/20 to-transparent border-red-400"
  },
  {
    title: "Parent-Teacher Conference Week",
    date: "January 18, 2025",
    type: "Event",
    icon: Calendar,
    description: "Join us for parent-teacher conferences February 5-9, 2025. Schedule your appointment through the parent portal. Virtual and in-person options available.",
    color: "from-blue-400/20 to-transparent border-blue-400"
  },
  {
    title: "Updated COVID-19 Safety Protocols",
    date: "January 12, 2025",
    type: "Policy",
    icon: CheckCircle2,
    description: "Updated health and safety guidelines are now in effect. Please review the new protocols on our website and ensure compliance for the safety of our community.",
    color: "from-green-400/20 to-transparent border-green-400"
  },
  {
    title: "Virtual University Fair - February 20",
    date: "January 8, 2025",
    type: "Opportunity",
    icon: GraduationCap,
    description: "Connect with representatives from 50+ universities at our virtual university fair. Register now to schedule one-on-one sessions with admissions counselors.",
    color: "from-purple-400/20 to-transparent border-purple-400"
  }
]

const newsArticles = [
  {
    id: 3,
    title: "International Student Welcome Ceremony Success",
    excerpt: "Over 100 new international students joined our community this semester, bringing diversity and cultural richness to Queensgate.",
    date: "January 5, 2025",
    category: "Community",
    image: "/images/student_grade.avif",
    author: "Student Services",
    readTime: "2 min read"
  },
  {
    id: 4,
    title: "Queensgate Launches New ESL Level 5 Course",
    excerpt: "Enhanced curriculum focuses on academic preparation and university readiness for advanced ESL students.",
    date: "December 28, 2024",
    category: "Academics",
    image: "/images/queen-27s-20gate-20web-20nw-06.jpeg",
    author: "Academic Director",
    readTime: "5 min read"
  },
  {
    id: 5,
    title: "Students Organize Successful Charity Drive",
    excerpt: "Student council raises over $5,000 for local food bank through community outreach initiatives.",
    date: "December 20, 2024",
    category: "Community",
    image: "/images/ndpjkk1uol9irckqx6db.avif",
    author: "Student Council",
    readTime: "3 min read"
  },
  {
    id: 6,
    title: "New Partnership with Local Tech Companies",
    excerpt: "Queensgate announces cooperative education opportunities with leading technology firms in the region.",
    date: "December 15, 2024",
    category: "Partnerships",
    image: "/images/Life-After-Graduation-Demands-Practical-Skills-in-Ugandan-Education.webp",
    author: "Career Services",
    readTime: "4 min read"
  },
  {
    id: 7,
    title: "Art Students Featured in Community Exhibition",
    excerpt: "Talented artists showcase their work at the downtown gallery, receiving recognition from local arts community.",
    date: "December 10, 2024",
    category: "Arts",
    image: "/images/gettyimages-840243874-1-1102x1102.webp",
    author: "Arts Department",
    readTime: "3 min read"
  },
  {
    id: 8,
    title: "Athletics Department Celebrates Championship Win",
    excerpt: "Queensgate basketball team takes home the regional championship title after an undefeated season.",
    date: "December 5, 2024",
    category: "Athletics",
    image: "/images/1366158e-3727-4192-8787-63c649015dc2_JPG.avif",
    author: "Athletics Director",
    readTime: "4 min read"
  }
]

const categories = [
  { name: "All News", count: 12, color: "bg-[#053F52]" },
  { name: "Achievements", count: 3, color: "bg-[#20cece]" },
  { name: "Academics", count: 4, color: "bg-[#EFBF04]" },
  { name: "Community", count: 2, color: "bg-green-500" },
  { name: "Events", count: 3, color: "bg-purple-500" }
]

export default function NewsAnnouncementsPage() {
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
                News & Announcements
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
                Stay Updated with Queensgate International School
              </motion.p>
            </div>
          </div>
        </div>

        {/* Introduction Section */}
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
                  <Megaphone className="w-8 h-8 text-[#053F52]" />
                  <h2 className="text-3xl  text-[#053F52]">What's Happening</h2>
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
                    Welcome to the Queensgate International School news center. Stay informed about the latest 
                    achievements, events, and important announcements from our vibrant school community.
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
                    From academic milestones and student successes to facility updates and community partnerships, 
                    we share the stories that make Queensgate a special place to learn and grow.
                  </motion.p>

                  <motion.div 
                    className="bg-white/80 border-l-4 border-[#20cece] p-6 rounded-r-xl"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                      duration: 0.8, 
                      ease: [0.22, 1, 0.36, 1],
                      delay: 0.6
                    }}
                  >
                    <div className="flex items-start gap-3 mb-4">
                      <Bell className="w-6 h-6 text-[#20cece] flex-shrink-0 mt-1" />
                      <div>
                        <h3 className=" text-[#053F52] mb-2">Never Miss an Update</h3>
                        <p className="text-gray-700 text-sm mb-4">
                          Subscribe to our newsletter to receive the latest news, announcements, and important 
                          dates directly to your inbox.
                        </p>
                        <Button
                          className="bg-[#20cece] text-white hover:bg-[#053F52] transition-colors duration-300"
                        >
                          Subscribe to Newsletter
                        </Button>
                      </div>
                    </div>
                  </motion.div>
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
                    src="/images/chatgptimagemar272c20252c12_25_02pm.avif"
                    alt="School Campus"
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

        {/* Featured News Section */}
        <div className="bg-white relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <motion.div
              className="mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Star className="w-8 h-8 text-[#EFBF04]" />
                <h2 className="text-3xl lg:text-4xl text-[#053F52]">
                  Featured Stories
                </h2>
              </div>
              <div className="h-1 w-24 bg-[#20cece] rounded-full"></div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {featuredNews.map((article, index) => (
                <motion.article
                  key={article.id}
                  className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-[#20cece] group"
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

        {/* Recent Announcements Section */}
        <div className="bg-[#EFBF04] relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <motion.div
              className="mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Bell className="w-8 h-8 text-[#053F52]" />
                <h2 className="text-3xl lg:text-4xl text-[#053F52]">
                  Recent Announcements
                </h2>
              </div>
              <div className="h-1 w-24 bg-[#20cece] rounded-full"></div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
              {recentAnnouncements.map((announcement, index) => {
                const Icon = announcement.icon
                return (
                  <motion.div
                    key={announcement.title}
                    className={`bg-gradient-to-r ${announcement.color} rounded-xl p-6 hover:shadow-xl transition-all duration-300`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 bg-[#053F52] rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <span className="bg-[#053F52] text-white text-xs  px-3 py-1 rounded-full">
                            {announcement.type}
                          </span>
                          <span className="text-sm text-gray-600">{announcement.date}</span>
                        </div>
                      </div>
                    </div>
                    <h3 className="text-lg  text-[#053F52] mb-3">
                      {announcement.title}
                    </h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {announcement.description}
                    </p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>

        {/* All News Articles Section */}
        <div className="bg-white relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <motion.div
              className="mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-8 h-8 text-[#053F52]" />
                <h2 className="text-3xl lg:text-4xl text-[#053F52]">
                  Latest News
                </h2>
              </div>
              <div className="h-1 w-24 bg-[#20cece] rounded-full"></div>
            </motion.div>

            {/* Category Filter */}
            <motion.div 
              className="flex flex-wrap gap-3 mb-8 justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {categories.map((category, index) => (
                <button
                  key={category.name}
                  className={`${category.color} text-white px-4 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2`}
                >
                  {category.name}
                  <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                    {category.count}
                  </span>
                </button>
              ))}
            </motion.div>

            {/* News Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {newsArticles.map((article, index) => (
                <motion.article
                  key={article.id}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-[#20cece] group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-white/90 text-[#053F52] text-xs  px-3 py-1 rounded-full">
                        {article.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-3 text-xs text-gray-600 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {article.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {article.readTime}
                      </span>
                    </div>
                    <h3 className="text-base  text-[#053F52] mb-2 group-hover:text-[#20cece] transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-gray-700 text-sm mb-4 leading-relaxed line-clamp-3">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">By {article.author}</span>
                      <button className="text-[#20cece] hover:text-[#053F52] font-medium flex items-center gap-1">
                        Read
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>

            {/* Load More Button */}
            <motion.div 
              className="text-center mt-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-[#053F52] text-[#053F52] hover:bg-[#053F52] hover:text-white px-8 py-6 rounded-full transition-all duration-300"
              >
                Load More Articles
                <TrendingUp className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Newsletter Signup Section */}
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
                    alt="Stay Connected"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                    className="object-cover"
                  />
                </motion.div>
              </motion.div>

              {/* Right Side - Newsletter Form */}
              <div className="order-2 lg:order-2">
                <motion.div
                  className="flex items-center gap-3 mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <Sparkles className="w-8 h-8 text-[#053F52]" />
                  <h2 className="text-3xl lg:text-4xl text-[#053F52]">
                    Stay in the Loop
                  </h2>
                </motion.div>

                <div className="space-y-6">
                  <motion.div 
                    className="bg-white/90 rounded-xl p-6 border-l-4 border-[#20cece]"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <h3 className=" text-[#053F52] text-xl mb-4">
                      Subscribe to Our Newsletter
                    </h3>
                    <p className="text-gray-700 mb-6 leading-relaxed">
                      Get the latest news, announcements, and important updates delivered directly to your inbox. 
                      Never miss an important date or exciting school event!
                    </p>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          placeholder="your@email.com"
                          className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-[#20cece] focus:outline-none transition-colors"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          <span>I'm a current student</span>
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          <span>I'm a parent or guardian</span>
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          <span>I'm interested in applying</span>
                        </label>
                      </div>

                      <Button
                        size="lg"
                        className="w-full bg-[#20cece] text-white hover:bg-[#053F52] transition-colors duration-300 py-6"
                      >
                        Subscribe Now
                        <Bell className="ml-2 w-5 h-5" />
                      </Button>
                    </div>

                    <p className="text-xs text-gray-600 mt-4">
                      We respect your privacy. Unsubscribe at any time.
                    </p>
                  </motion.div>

                  <motion.div 
                    className="bg-white/80 rounded-xl p-6 border-2 border-gray-200"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    <h4 className=" text-[#053F52] mb-3 flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-[#20cece]" />
                      Follow Us on Social Media
                    </h4>
                    <p className="text-gray-700 text-sm mb-4">
                      Stay connected through our social media channels for daily updates, photos, and stories 
                      from our school community.
                    </p>
                    <div className="flex gap-3">
                      <button className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium">
                        Facebook
                      </button>
                      <button className="flex-1 bg-sky-500 text-white py-2 rounded-lg hover:bg-sky-600 transition-colors text-sm font-medium">
                        Twitter
                      </button>
                      <button className="flex-1 bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 transition-colors text-sm font-medium">
                        Instagram
                      </button>
                    </div>
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