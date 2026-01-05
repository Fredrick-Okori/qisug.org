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
  FolderOpen,
  ClipboardList,
  Shield,
  Calendar,
  DollarSign,
  BookMarked,
  Info
} from "lucide-react"

const documentCategories = [
  {
    title: "Program Information",
    icon: BookOpen,
    color: "from-blue-400/20 to-transparent border-blue-400",
    documents: [
      {
        name: "ESL Program Guide",
        description: "Complete overview of our English as a Second Language program, including all five levels and progression pathway.",
        fileType: "PDF",
        fileSize: "2.4 MB",
        icon: BookOpen
      },
      {
        name: "Graduation Requirements Guide",
        description: "Detailed breakdown of OSSD requirements for both 2023 and 2024 cohorts, including credit requirements and additional graduation criteria.",
        fileType: "PDF",
        fileSize: "1.8 MB",
        icon: GraduationCap
      },
      {
        name: "Course Calendar 2024-2025",
        description: "Full academic year calendar with important dates, semester schedules, and holiday breaks.",
        fileType: "PDF",
        fileSize: "890 KB",
        icon: Calendar
      },
      {
        name: "Curriculum Overview",
        description: "Comprehensive guide to our curriculum structure, course offerings, and academic streams.",
        fileType: "PDF",
        fileSize: "3.1 MB",
        icon: BookMarked
      }
    ]
  },
  {
    title: "Admissions Documents",
    icon: ClipboardList,
    color: "from-green-400/20 to-transparent border-green-400",
    documents: [
      {
        name: "Application Form",
        description: "Complete this form to begin your application to Queensgate International School.",
        fileType: "PDF",
        fileSize: "650 KB",
        icon: FileText
      },
      {
        name: "Application Requirements Checklist",
        description: "Step-by-step checklist of all documents and requirements needed for a complete application.",
        fileType: "PDF",
        fileSize: "420 KB",
        icon: ClipboardList
      },
      {
        name: "Tuition & Fees Schedule",
        description: "Detailed breakdown of tuition costs, payment schedules, and additional fees for the academic year.",
        fileType: "PDF",
        fileSize: "780 KB",
        icon: DollarSign
      },
      {
        name: "Admission Periods Guide",
        description: "Information about our rolling admissions process and key enrollment deadlines throughout the year.",
        fileType: "PDF",
        fileSize: "520 KB",
        icon: Calendar
      }
    ]
  },
  {
    title: "Academic Policies",
    icon: Shield,
    color: "from-amber-400/20 to-transparent border-amber-400",
    documents: [
      {
        name: "Academic Integrity Policy",
        description: "Guidelines on academic honesty, plagiarism prevention, and consequences of academic misconduct.",
        fileType: "PDF",
        fileSize: "890 KB",
        icon: Shield
      },
      {
        name: "Attendance Policy",
        description: "Requirements for class attendance, procedures for reporting absences, and attendance expectations.",
        fileType: "PDF",
        fileSize: "620 KB",
        icon: CheckCircle2
      },
      {
        name: "Late & Missing Assignment Policy",
        description: "Procedures for submitting late work, deadline extensions, and impact on grades.",
        fileType: "PDF",
        fileSize: "540 KB",
        icon: FileText
      },
      {
        name: "Acceptable Use Policy",
        description: "Guidelines for appropriate use of school technology, internet access, and digital resources.",
        fileType: "PDF",
        fileSize: "710 KB",
        icon: Globe
      }
    ]
  },
  {
    title: "Student Resources",
    icon: Users,
    color: "from-purple-400/20 to-transparent border-purple-400",
    documents: [
      {
        name: "Community Service Guide",
        description: "Information about the 40-hour community service requirement, approved activities, and tracking forms.",
        fileType: "PDF",
        fileSize: "1.2 MB",
        icon: Users
      },
      {
        name: "Course Selection Guide",
        description: "Help students choose the right courses based on their goals, university streams, and graduation requirements.",
        fileType: "PDF",
        fileSize: "2.1 MB",
        icon: BookOpen
      },
      {
        name: "Student Handbook",
        description: "Comprehensive handbook covering school policies, procedures, expectations, and student rights.",
        fileType: "PDF",
        fileSize: "4.3 MB",
        icon: BookMarked
      },
      {
        name: "Parent Information Package",
        description: "Essential information for parents including communication protocols, involvement opportunities, and support resources.",
        fileType: "PDF",
        fileSize: "1.9 MB",
        icon: Info
      }
    ]
  }
]

export default function DownloadsPage() {
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
                Downloads
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
                Important Documents & Resources
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
                  <FolderOpen className="w-8 h-8 text-[#053F52]" />
                  <h2 className="text-3xl text-[#053F52]">Document Center</h2>
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
                    Welcome to the Queensgate International School downloads center. Here you'll find all the 
                    important documents, guides, and resources you need for a successful academic journey.
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
                    Our documents are organized into categories for easy access. All files are available in PDF 
                    format for convenient viewing and printing. If you need assistance or have questions about 
                    any document, please don't hesitate to contact our office.
                  </motion.p>

                  <motion.div 
                    className="bg-white/80 border-l-4 border-[#053F52] p-6 rounded-r-xl"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                      duration: 0.8, 
                      ease: [0.22, 1, 0.36, 1],
                      delay: 0.6
                    }}
                  >
                    <p className="text-[#053F52] font-medium mb-3">
                      Need Help?
                    </p>
                    <p className="text-gray-700 text-sm mb-3">
                      If you're having trouble downloading or opening any documents, or if you need a document 
                      that's not listed here, please contact us:
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        variant="outline"
                        className="border-[#053F52] text-[#053F52] hover:bg-[#053F52] hover:text-white"
                      >
                        Contact Support
                      </Button>
                      <Button
                        variant="outline"
                        className="border-[#20cece] text-[#20cece] hover:bg-[#20cece] hover:text-white"
                      >
                        Email Us
                      </Button>
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
                    src="/images/img-2023-mature-students-home-banner-0257960.jpg"
                    alt="Student Resources"
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

        {/* Document Categories */}
        {documentCategories.map((category, categoryIndex) => {
          const CategoryIcon = category.icon
          const isYellowBg = categoryIndex % 2 === 0
          
          return (
            <div key={category.title} className={`${isYellowBg ? 'bg-white' : 'bg-[#EFBF04]'} relative z-10`}>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
                <motion.div
                  className="mb-12"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <CategoryIcon className="w-8 h-8 text-[#053F52]" />
                    <h2 className="text-3xl lg:text-4xl text-[#053F52]">
                      {category.title}
                    </h2>
                  </div>
                  <div className="h-1 w-24 bg-[#20cece] rounded-full"></div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
                  {category.documents.map((doc, docIndex) => {
                    const DocIcon = doc.icon
                    return (
                      <motion.div
                        key={doc.name}
                        className={`bg-gradient-to-r ${category.color} rounded-xl p-6 hover:shadow-xl transition-all duration-300 group cursor-pointer`}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: docIndex * 0.05 }}
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-14 h-14 bg-[#053F52] rounded-xl flex items-center justify-center group-hover:bg-[#20cece] transition-colors duration-300">
                              <DocIcon className="w-7 h-7 text-white" />
                            </div>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg text-[#053F52] mb-2 group-hover:text-[#20cece] transition-colors duration-300">
                              {doc.name}
                            </h3>
                            <p className="text-gray-700 text-sm leading-relaxed mb-4">
                              {doc.description}
                            </p>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 text-sm text-gray-600">
                                <span className="flex items-center gap-1">
                                  <FileText className="w-4 h-4" />
                                  {doc.fileType}
                                </span>
                                <span>•</span>
                                <span>{doc.fileSize}</span>
                              </div>
                              
                              <Button
                                size="sm"
                                className="bg-[#20cece] text-white hover:bg-[#053F52] transition-colors duration-300"
                              >
                                <Download className="w-4 h-4 mr-1" />
                                Download
                              </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            </div>
          )
        })}

        {/* Additional Information Section */}
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
                    src="/images/gettyimages-840243874-1-1102x1102.webp"
                    alt="Library and Study"
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
                  <Info className="w-8 h-8 text-[#053F52]" />
                  <h2 className="text-3xl lg:text-4xl text-[#053F52]">
                    Important Information
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
                    <h3 className="text-[#053F52] mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-blue-500" />
                      Document Formats
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-sm">
                      All documents are provided in PDF format for universal compatibility. You'll need a PDF 
                      reader like Adobe Acrobat Reader (free) to view these files. Most modern browsers can also 
                      display PDFs directly.
                    </p>
                  </motion.div>

                  <motion.div 
                    className="bg-gradient-to-r from-green-50 to-white border-l-4 border-green-400 p-6 rounded-r-xl"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    <h3 className="text-[#053F52] mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      Document Updates
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-sm">
                      We regularly update our documents to ensure you have the most current information. Each 
                      document includes a version date. Check back periodically or subscribe to our newsletter 
                      for update notifications.
                    </p>
                  </motion.div>

                  <motion.div 
                    className="bg-gradient-to-r from-amber-50 to-white border-l-4 border-amber-400 p-6 rounded-r-xl"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    <h3 className="text-[#053F52] mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-amber-500" />
                      Accessibility
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-sm mb-3">
                      We're committed to making our documents accessible to everyone. If you need a document in 
                      an alternative format (large print, braille, audio, etc.), please contact our office and 
                      we'll be happy to accommodate your needs.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-amber-400 text-amber-600 hover:bg-amber-400 hover:text-white"
                    >
                      Request Alternative Format
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
              <FolderOpen className="w-16 h-16 text-[#20cece] mx-auto mb-6" />
              <h2 className="text-3xl lg:text-4xl text-white mb-4">
                Can't Find What You're Looking For?
              </h2>
              <p className="text-slate-200 text-lg mb-8 max-w-2xl mx-auto">
                If you need a specific document that's not listed here, or if you have questions about any 
                of our resources, our team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                 <Link href="/contact">
                      <Button
                        size="lg"
                        className="bg-[#20cece] text-[#053f52] rounded-full hover:bg-[#20cece]/90 border-[#20cece] text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6  transition-all "
                      >
                        Contact us
                        <ArrowRight className="ml-2"/>
                      </Button>
                    </Link>
               <Link href="/faq">
                      <Button
                        size="lg"
                        className="border bg-transparent rounded-full border-[#20cece] text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6  transition-all "
                      >
                        Faqs
                        <ArrowRight className="ml-2"/>
                      </Button>
                    </Link>
              
              </div>
            </motion.div>
          </div>
        </div>

      </main>

      <MainSiteFooter />
    </div>
  )
}