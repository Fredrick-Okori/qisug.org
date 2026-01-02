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
  AlertCircle,
  CalendarDays,
  CalendarCheck,
  CalendarClock,
  CalendarRange,
  Sun,
  Snowflake,
  Leaf,
  Flower2
} from "lucide-react"

const academicYear = {
  year: "2024-2025",
  startDate: "September 3, 2024",
  endDate: "June 27, 2025"
}

const semesters = [
  {
    name: "Fall Semester",
    icon: Leaf,
    color: "from-orange-400/20 to-transparent border-orange-400",
    startDate: "September 3, 2024",
    endDate: "January 24, 2025",
    midterm: "October 21-25, 2024",
    finals: "January 13-24, 2025",
    breaks: [
      { name: "Thanksgiving Break", dates: "October 14, 2024" },
      { name: "Winter Break", dates: "December 23, 2024 - January 3, 2025" }
    ]
  },
  {
    name: "Spring Semester",
    icon: Flower2,
    color: "from-green-400/20 to-transparent border-green-400",
    startDate: "January 27, 2025",
    endDate: "June 27, 2025",
    midterm: "March 17-21, 2025",
    finals: "June 16-27, 2025",
    breaks: [
      { name: "Spring Break", dates: "March 10-14, 2025" },
      { name: "Good Friday", dates: "April 18, 2025" },
      { name: "Victoria Day", dates: "May 19, 2025" }
    ]
  }
]

const importantDates = [
  {
    date: "September 3, 2024",
    title: "First Day of Classes",
    type: "Academic",
    icon: CalendarCheck,
    description: "Fall semester begins. Welcome back students!",
    color: "from-blue-400/20 to-transparent border-blue-400"
  },
  {
    date: "September 16-20, 2024",
    title: "Add/Drop Period",
    type: "Registration",
    icon: CalendarClock,
    description: "Last week to add or drop courses without academic penalty.",
    color: "from-purple-400/20 to-transparent border-purple-400"
  },
  {
    date: "October 21-25, 2024",
    title: "Fall Midterm Exams",
    type: "Exams",
    icon: FileText,
    description: "Midterm examination period for fall semester courses.",
    color: "from-red-400/20 to-transparent border-red-400"
  },
  {
    date: "November 4-8, 2024",
    title: "Parent-Teacher Conferences",
    type: "Event",
    icon: Users,
    description: "Schedule meetings with teachers to discuss student progress.",
    color: "from-green-400/20 to-transparent border-green-400"
  },
  {
    date: "December 23, 2024 - January 3, 2025",
    title: "Winter Break",
    type: "Holiday",
    icon: Snowflake,
    description: "School closed for winter holidays. Classes resume January 6, 2025.",
    color: "from-cyan-400/20 to-transparent border-cyan-400"
  },
  {
    date: "January 13-24, 2025",
    title: "Fall Final Exams",
    type: "Exams",
    icon: FileText,
    description: "Final examination period for fall semester. Good luck!",
    color: "from-red-400/20 to-transparent border-red-400"
  },
  {
    date: "January 27, 2025",
    title: "Spring Semester Begins",
    type: "Academic",
    icon: CalendarCheck,
    description: "First day of spring semester classes.",
    color: "from-blue-400/20 to-transparent border-blue-400"
  },
  {
    date: "February 10-14, 2025",
    title: "Spring Registration",
    type: "Registration",
    icon: CalendarClock,
    description: "Registration opens for summer and fall 2025 courses.",
    color: "from-purple-400/20 to-transparent border-purple-400"
  },
  {
    date: "March 10-14, 2025",
    title: "Spring Break",
    type: "Holiday",
    icon: Sun,
    description: "Mid-semester break. School closed.",
    color: "from-amber-400/20 to-transparent border-amber-400"
  },
  {
    date: "March 17-21, 2025",
    title: "Spring Midterm Exams",
    type: "Exams",
    icon: FileText,
    description: "Midterm examination period for spring semester courses.",
    color: "from-red-400/20 to-transparent border-red-400"
  },
  {
    date: "April 28 - May 2, 2025",
    title: "University Fair Week",
    type: "Event",
    icon: GraduationCap,
    description: "Meet with university representatives and explore post-secondary options.",
    color: "from-green-400/20 to-transparent border-green-400"
  },
  {
    date: "June 16-27, 2025",
    title: "Spring Final Exams",
    type: "Exams",
    icon: FileText,
    description: "Final examination period for spring semester.",
    color: "from-red-400/20 to-transparent border-red-400"
  },
  {
    date: "June 27, 2025",
    title: "Graduation Ceremony",
    type: "Event",
    icon: GraduationCap,
    description: "Celebrating our graduating class of 2025! Congratulations graduates!",
    color: "from-purple-400/20 to-transparent border-purple-400"
  }
]

const upcomingEvents = [
  {
    date: "February 5, 2025",
    time: "6:00 PM - 8:00 PM",
    title: "Open House",
    location: "Main Campus",
    description: "Prospective students and families are invited to tour our facilities and meet our faculty.",
    category: "Admissions"
  },
  {
    date: "February 14, 2025",
    time: "12:00 PM - 2:00 PM",
    title: "International Food Festival",
    location: "Student Center",
    description: "Celebrate diversity with food, music, and performances from around the world.",
    category: "Cultural"
  },
  {
    date: "February 20, 2025",
    time: "9:00 AM - 4:00 PM",
    title: "Virtual University Fair",
    location: "Online",
    description: "Connect with representatives from 50+ universities via video sessions.",
    category: "Academic"
  },
  {
    date: "March 1, 2025",
    time: "10:00 AM - 2:00 PM",
    title: "Career Day",
    location: "Main Auditorium",
    description: "Guest speakers from various industries share insights about career paths.",
    category: "Career"
  },
  {
    date: "March 15, 2025",
    time: "7:00 PM - 9:00 PM",
    title: "Spring Concert",
    location: "Theater",
    description: "Our music students showcase their talents in this semester's performance.",
    category: "Arts"
  },
  {
    date: "April 22, 2025",
    time: "All Day",
    title: "Earth Day Sustainability Fair",
    location: "Campus Grounds",
    description: "Learn about environmental initiatives and participate in eco-friendly activities.",
    category: "Community"
  }
]

const monthlyHighlights = [
  {
    month: "September",
    icon: Leaf,
    color: "bg-orange-500",
    highlights: ["School Year Begins", "Orientation Week", "Club Fair"]
  },
  {
    month: "October",
    icon: Leaf,
    color: "bg-amber-600",
    highlights: ["Midterm Exams", "Thanksgiving", "Parent Conferences"]
  },
  {
    month: "November",
    icon: Leaf,
    color: "bg-orange-700",
    highlights: ["Course Selection", "Fall Sports Finals", "Remembrance Day"]
  },
  {
    month: "December",
    icon: Snowflake,
    color: "bg-cyan-500",
    highlights: ["Final Exams", "Winter Concert", "Holiday Break Begins"]
  },
  {
    month: "January",
    icon: Snowflake,
    color: "bg-blue-500",
    highlights: ["Spring Semester Starts", "New Student Orientation", "Winter Sports"]
  },
  {
    month: "February",
    icon: Snowflake,
    color: "bg-blue-600",
    highlights: ["Open House", "Food Festival", "University Fair"]
  },
  {
    month: "March",
    icon: Flower2,
    color: "bg-green-500",
    highlights: ["Spring Break", "Midterm Exams", "Career Day"]
  },
  {
    month: "April",
    icon: Flower2,
    color: "bg-green-600",
    highlights: ["Easter Break", "Earth Day", "Spring Sports"]
  },
  {
    month: "May",
    icon: Flower2,
    color: "bg-emerald-500",
    highlights: ["Victoria Day", "Final Projects Due", "Spring Concert"]
  },
  {
    month: "June",
    icon: Sun,
    color: "bg-yellow-500",
    highlights: ["Final Exams", "Graduation Ceremony", "School Year Ends"]
  }
]

export default function CalendarPage() {
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
                Academic Calendar
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
                {academicYear.year} Academic Year
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
                  <CalendarDays className="w-8 h-8 text-[#053F52]" />
                  <h2 className="text-3xl  text-[#053F52]">Plan Your Year</h2>
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
                    Welcome to the Queensgate International School academic calendar for the {academicYear.year} school 
                    year. Stay organized and never miss important dates, deadlines, or events.
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
                    Our academic year runs from <strong>{academicYear.startDate}</strong> to{' '}
                    <strong>{academicYear.endDate}</strong>, divided into two semesters with scheduled breaks 
                    throughout the year.
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
                    <div className="flex items-start gap-3">
                      <Download className="w-6 h-6 text-[#20cece] flex-shrink-0 mt-1" />
                      <div>
                        <h3 className=" text-[#053F52] mb-2">Download Full Calendar</h3>
                        <p className="text-gray-700 text-sm mb-4">
                          Get a PDF version of the complete academic calendar with all important dates, 
                          exam schedules, and event information.
                        </p>
                        <Button
                          className="bg-[#20cece] text-white hover:bg-[#053F52] transition-colors duration-300"
                        >
                          <Download className="mr-2 w-4 h-4" />
                          Download PDF Calendar
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
                    src="/images/gettyimages-840243874-1-1102x1102.webp"
                    alt="Academic Planning"
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

        {/* Semester Overview Section */}
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
                <CalendarRange className="w-8 h-8 text-[#053F52]" />
                <h2 className="text-3xl lg:text-4xl text-[#053F52]">
                  Semester Schedule
                </h2>
              </div>
              <div className="h-1 w-24 bg-[#20cece] rounded-full"></div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {semesters.map((semester, index) => {
                const SemesterIcon = semester.icon
                return (
                  <motion.div
                    key={semester.name}
                    className={`bg-gradient-to-r ${semester.color} rounded-xl p-8 hover:shadow-xl transition-all duration-300`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-[#053F52] rounded-xl flex items-center justify-center">
                        <SemesterIcon className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl  text-[#053F52]">{semester.name}</h3>
                        <p className="text-gray-600 text-sm">{academicYear.year}</p>
                      </div>
                    </div>

                    <div className="space-y-4 mb-6">
                      <div className="flex items-start gap-3 bg-white/70 p-4 rounded-lg">
                        <CalendarCheck className="w-5 h-5 text-[#20cece] flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-[#053F52]">Semester Dates</p>
                          <p className="text-sm text-gray-700">{semester.startDate} - {semester.endDate}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 bg-white/70 p-4 rounded-lg">
                        <Clock className="w-5 h-5 text-[#20cece] flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-[#053F52]">Midterm Exams</p>
                          <p className="text-sm text-gray-700">{semester.midterm}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 bg-white/70 p-4 rounded-lg">
                        <FileText className="w-5 h-5 text-[#20cece] flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-[#053F52]">Final Exams</p>
                          <p className="text-sm text-gray-700">{semester.finals}</p>
                        </div>
                      </div>
                    </div>

                    <div className="border-t-2 border-gray-200 pt-4">
                      <h4 className="text-sm  text-[#053F52] mb-3">Breaks & Holidays:</h4>
                      <ul className="space-y-2">
                        {semester.breaks.map((break_item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                            <CheckCircle2 className="w-4 h-4 text-[#20cece] flex-shrink-0 mt-0.5" />
                            <div>
                              <span className="font-medium">{break_item.name}:</span> {break_item.dates}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Important Dates Section */}
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
                <AlertCircle className="w-8 h-8 text-[#053F52]" />
                <h2 className="text-3xl lg:text-4xl text-[#053F52]">
                  Important Dates
                </h2>
              </div>
              <div className="h-1 w-24 bg-[#20cece] rounded-full"></div>
              <p className="text-[#053F52] mt-4 text-lg">
                Mark these key dates on your calendar to stay on track throughout the academic year.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
              {importantDates.map((item, index) => {
                const Icon = item.icon
                return (
                  <motion.div
                    key={item.title}
                    className={`bg-gradient-to-r ${item.color} rounded-xl p-6 hover:shadow-xl transition-all duration-300`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-[#053F52] rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <span className="bg-[#053F52] text-white text-xs  px-3 py-1 rounded-full">
                            {item.type}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{item.date}</p>
                        <h3 className="text-lg  text-[#053F52] mb-2">
                          {item.title}
                        </h3>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Upcoming Events Section */}
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
                  Upcoming Events
                </h2>
              </div>
              <div className="h-1 w-24 bg-[#20cece] rounded-full"></div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {upcomingEvents.map((event, index) => (
                <motion.div
                  key={event.title}
                  className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-[#20cece] hover:shadow-xl transition-all duration-300 group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <div className="mb-4">
                    <span className="bg-[#20cece] text-white text-xs  px-3 py-1 rounded-full">
                      {event.category}
                    </span>
                  </div>
                  
                  <h3 className="text-lg  text-[#053F52] mb-3 group-hover:text-[#20cece] transition-colors">
                    {event.title}
                  </h3>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 text-[#20cece]" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4 text-[#20cece]" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Globe className="w-4 h-4 text-[#20cece]" />
                      <span>{event.location}</span>
                    </div>
                  </div>

                  <p className="text-gray-700 text-sm leading-relaxed mb-4">
                    {event.description}
                  </p>

                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full border-[#20cece] text-[#20cece] hover:bg-[#20cece] hover:text-white transition-colors"
                  >
                    Learn More
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Monthly Highlights Section */}
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
                <CalendarDays className="w-8 h-8 text-[#053F52]" />
                <h2 className="text-3xl lg:text-4xl text-[#053F52]">
                  Month-by-Month Overview
                </h2>
              </div>
              <div className="h-1 w-24 bg-[#20cece] rounded-full"></div>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
              {monthlyHighlights.map((month, index) => {
                const MonthIcon = month.icon
                return (
                  <motion.div
                    key={month.month}
                    className="bg-white rounded-xl p-5 hover:shadow-xl transition-all duration-300 border-2 border-gray-200 hover:border-[#20cece]"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                  >
                    <div className={`w-12 h-12 ${month.color} rounded-xl flex items-center justify-center mb-4 mx-auto`}>
                      <MonthIcon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg  text-[#053F52] text-center mb-3">
                      {month.month}
                    </h3>
                    <ul className="space-y-2">
                      {month.highlights.map((highlight, idx) => (
                        <li key={idx} className="text-xs text-gray-700 flex items-start gap-1">
                          <span className="text-[#20cece] mt-0.5">•</span>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Download & Subscribe Section */}
        <div className="bg-white relative z-10">
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
                    alt="Calendar Synchronization"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                    className="object-cover"
                  />
                </motion.div>
              </motion.div>

              {/* Right Side - Download Options */}
              <div className="order-2 lg:order-2">
                <motion.div
                  className="flex items-center gap-3 mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <Download className="w-8 h-8 text-[#053F52]" />
                  <h2 className="text-3xl lg:text-4xl text-[#053F52]">
                    Stay Synchronized
                  </h2>
                </motion.div>

                <div className="space-y-6">
                  <motion.div 
                    className="bg-gradient-to-r from-blue-50 to-white border-l-4 border-blue-400 p-6 rounded-r-xl"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <h3 className=" text-[#053F52] mb-3 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-500" />
                      Download PDF Calendar
                    </h3>
                    <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                      Get a printable PDF version of the complete academic calendar with all dates, 
                      events, and important deadlines for the {academicYear.year} school year.
                    </p>
                    <Button
                      className="bg-blue-500 text-white hover:bg-blue-600 transition-colors w-full"
                    >
                      <Download className="mr-2 w-4 h-4" />
                      Download Full Calendar
                    </Button>
                  </motion.div>

                  <motion.div 
                    className="bg-gradient-to-r from-green-50 to-white border-l-4 border-green-400 p-6 rounded-r-xl"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    <h3 className=" text-[#053F52] mb-3 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-green-500" />
                      Subscribe to Calendar
                    </h3>
                    <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                      Sync our academic calendar with your Google Calendar, Apple Calendar, or Outlook to 
                      receive automatic updates and reminders.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        variant="outline"
                        className="flex-1 border-green-400 text-green-600 hover:bg-green-400 hover:text-white"
                      >
                        Google Calendar
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 border-green-400 text-green-600 hover:bg-green-400 hover:text-white"
                      >
                        iCal/Outlook
                      </Button>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="bg-gradient-to-r from-purple-50 to-white border-l-4 border-purple-400 p-6 rounded-r-xl"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    <h3 className=" text-[#053F52] mb-3 flex items-center gap-2">
                      <Bell className="w-5 h-5 text-purple-500" />
                      Calendar Notifications
                    </h3>
                    <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                      Sign up for email or SMS reminders for important dates and upcoming events. Never miss 
                      a deadline again!
                    </p>
                    <Button
                      variant="outline"
                      className="w-full border-purple-400 text-purple-600 hover:bg-purple-400 hover:text-white"
                    >
                      <Bell className="mr-2 w-4 h-4" />
                      Set Up Reminders
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="bg-[#EFBF04] relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <motion.div
              className="bg-gradient-to-r from-[#053F52] to-[#064d66] rounded-2xl p-8 sm:p-12 lg:p-16 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <CalendarCheck className="w-16 h-16 text-[#20cece] mx-auto mb-6" />
              <h2 className="text-3xl lg:text-4xl  text-white mb-4">
                Have Questions About Our Schedule?
              </h2>
              <p className="text-slate-200 text-lg mb-8 max-w-2xl mx-auto">
                Our admissions team is here to help answer any questions about our academic calendar, 
                important dates, or upcoming events.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-[#20cece] text-[#053F52] hover:bg-white  px-10 py-6 rounded-full transition-all duration-300 text-lg"
                >
                  Contact Us
                  <ArrowRight className="ml-2 w-6 h-6" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#053F52]  px-10 py-6 rounded-full transition-all duration-300 text-lg"
                >
                  View FAQ
                </Button>
              </div>
            </motion.div>
          </div>
        </div>

      </main>

      <MainSiteFooter />
    </div>
  )
}