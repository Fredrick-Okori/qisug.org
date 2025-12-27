"use client"

import Link from "next/link"
import { SiteFooter } from "@/components/site-footer"
import { BlueSiteHeader } from "@/components/blue-header"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { 
  Shield, 
  BookOpen, 
  Clock, 
  FileText, 
  Monitor,
  Heart,
  GraduationCap,
  Users,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Scale
} from "lucide-react"

const policies = [
  {
    id: "privacy-policy",
    title: "Privacy Policy",
    icon: Shield,
    description: "Learn how we protect and manage your personal information, student data, and comply with privacy legislation.",
    color: "from-[#3d4fd4] to-[#2a3dc8ff]",
    link: "/policies/privacy-policy"
  },
  {
    id: "academic-integrity",
    title: "Academic Integrity",
    icon: GraduationCap,
    description: "Our commitment to honest academic work, plagiarism prevention, and maintaining high standards of scholarship.",
    color: "from-[#EFBF04] to-[#d4a803]",
    link: "/policies/academic-integrity"
  },
  {
    id: "attendance",
    title: "Attendance Policy",
    icon: Clock,
    description: "Requirements for class participation, attendance tracking, and procedures for absences and late arrivals.",
    color: "from-[#3d4fd4] to-[#2a3dc8ff]",
    link: "/policies/attendance"
  },
  {
    id: "late-assignments",
    title: "Late & Missing Assignment Policy",
    icon: FileText,
    description: "Guidelines for assignment submission, late penalties, extensions, and academic consequences.",
    color: "from-[#EFBF04] to-[#d4a803]",
    link: "/policies/late-assignments"
  },
  {
    id: "acceptable-use",
    title: "Acceptable Use Policy",
    icon: Monitor,
    description: "Rules for using school technology, online resources, digital platforms, and internet safety guidelines.",
    color: "from-[#3d4fd4] to-[#2a3dc8ff]",
    link: "/policies/acceptable-use"
  },
  {
    id: "code-of-conduct",
    title: "Code of Conduct & Mutual Respect",
    icon: Heart,
    description: "Behavioral expectations, anti-bullying measures, respect for diversity, and creating a safe learning environment.",
    color: "from-[#EFBF04] to-[#d4a803]",
    link: "/policies/code-of-conduct"
  }
]

const coreValues = [
  {
    title: "Integrity",
    description: "We expect honesty, ethical behavior, and personal accountability in all academic and personal interactions."
  },
  {
    title: "Respect",
    description: "We foster an inclusive community where every individual is valued, heard, and treated with dignity."
  },
  {
    title: "Responsibility",
    description: "Students are responsible for their learning, behavior, and contributions to the school community."
  },
  {
    title: "Excellence",
    description: "We maintain high standards in academics, conduct, and personal development for all students."
  }
]

export default function PoliciesPage() {
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
                <span className="bg-[#3d4fd4] text-white px-6 py-2 text-sm tracking-wider uppercase font-semibold rounded-full inline-flex items-center gap-2">
                  <Scale className="w-4 h-4" />
                  School Policies
                </span>
              </motion.div>
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl pt-10 text-[#3d4fd4] leading-tight mb-6">
                School Policies & Guidelines
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-[#3d4fd4] leading-relaxed">
                Creating a Safe, Respectful, and Academically Excellent Learning Environment
              </p>
            </motion.div>
          </div>
        </div>

        {/* Introduction Section */}
        <div className="bg-[#EFBF04] relative z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <div className="max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl lg:text-4xl text-[#3d4fd4] mb-6 font-bold">
                  Our Commitment to Excellence
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4 text-[#3d4fd4] text-base sm:text-lg leading-relaxed">
                    <p>
                      At Queensgate International School, our policies are designed to create a supportive, 
                      safe, and academically rigorous environment where every student can thrive. These guidelines 
                      ensure consistency, fairness, and clarity in all aspects of school life.
                    </p>
                    <p>
                      Our policies reflect our core values of integrity, respect, responsibility, and excellence. 
                      They provide a framework for positive behavior, academic honesty, and mutual respect among 
                      all members of our school community.
                    </p>
                  </div>
                  <div className="space-y-4 text-[#3d4fd4] text-base sm:text-lg leading-relaxed">
                    <p>
                      All students, parents, and staff are expected to familiarize themselves with these policies 
                      and adhere to them throughout their time at Queensgate. By maintaining high standards and 
                      clear expectations, we create an environment conducive to learning and personal growth.
                    </p>
                    <p>
                      We regularly review and update our policies to ensure they remain relevant, effective, and 
                      aligned with educational best practices and legal requirements.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Core Values Section */}
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
                Guiding Principles
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                The values that shape our policies and guide our school community
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {coreValues.map((value, index) => (
                <motion.div
                  key={value.title}
                  className="bg-gradient-to-br from-[#EFBF04]/10 to-white border-2 border-[#EFBF04]/30 rounded-xl p-6 hover:border-[#3d4fd4] hover:shadow-lg transition-all duration-300"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <h3 className="text-xl font-bold text-[#3d4fd4] mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Policies Grid */}
        <div className="bg-[#EFBF04] relative z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl lg:text-4xl xl:text-5xl text-[#3d4fd4] mb-4">
                Our School Policies
              </h2>
              <p className="text-lg text-[#3d4fd4] max-w-3xl mx-auto">
                Click on any policy to read the full details and guidelines
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {policies.map((policy, index) => (
                <motion.div
                  key={policy.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Link href={policy.link}>
                    <div className="bg-white rounded-2xl p-6 h-full hover:shadow-2xl transition-all duration-300 cursor-pointer group">
                      <div className={`w-14 h-14 bg-gradient-to-br ${policy.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <policy.icon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-[#3d4fd4] mb-3 group-hover:text-[#2a3dc8ff] transition-colors">
                        {policy.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed mb-4 text-sm">
                        {policy.description}
                      </p>
                      <div className="flex items-center gap-2 text-[#3d4fd4] font-medium text-sm group-hover:gap-3 transition-all">
                        Read Policy
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Important Information Section */}
        <div className="bg-white relative z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <div className="max-w-5xl mx-auto">
              <div className="bg-gradient-to-br from-[#3d4fd4] to-[#2a3dc8ff] rounded-2xl p-8 lg:p-12 text-white">
                <div className="flex items-start gap-4 mb-6">
                  <AlertCircle className="w-8 h-8 flex-shrink-0 mt-1" />
                  <div>
                    <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                      Important Policy Information
                    </h2>
                    <div className="space-y-4 text-lg leading-relaxed">
                      <p>
                        All students and parents/guardians are required to read and acknowledge understanding of 
                        these policies upon enrollment. Adherence to these policies is a condition of enrollment 
                        and continued attendance at Queensgate International School.
                      </p>
                      <p>
                        Violations of school policies may result in academic penalties, disciplinary action, or 
                        in severe cases, suspension or expulsion from the school. We believe in progressive discipline 
                        and work with students and families to address concerns constructively.
                      </p>
                      <p>
                        Policies are reviewed annually and may be updated as needed. Students and parents will be 
                        notified of any significant policy changes. The most current versions of all policies are 
                        always available on our website.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Student Rights & Responsibilities */}
        <div className="bg-[#EFBF04] relative z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <div className="max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl lg:text-4xl text-[#3d4fd4] mb-8 font-bold text-center">
                  Student Rights & Responsibilities
                </h2>
                
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Rights */}
                  <div className="bg-white rounded-xl p-8">
                    <h3 className="text-2xl font-bold text-[#3d4fd4] mb-6 flex items-center gap-3">
                      <CheckCircle2 className="w-6 h-6" />
                      Your Rights
                    </h3>
                    <ul className="space-y-3">
                      {[
                        "To be treated with dignity and respect",
                        "To learn in a safe and supportive environment",
                        "To express opinions respectfully",
                        "To access quality educational resources",
                        "To receive fair and timely assessment",
                        "To privacy and confidentiality",
                        "To appeal academic or disciplinary decisions"
                      ].map((right, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-[#EFBF04] flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{right}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Responsibilities */}
                  <div className="bg-white rounded-xl p-8">
                    <h3 className="text-2xl font-bold text-[#3d4fd4] mb-6 flex items-center gap-3">
                      <Users className="w-6 h-6" />
                      Your Responsibilities
                    </h3>
                    <ul className="space-y-3">
                      {[
                        "Attend all classes and be punctual",
                        "Complete assignments on time",
                        "Maintain academic integrity",
                        "Respect teachers, staff, and peers",
                        "Follow school policies and procedures",
                        "Take care of school property",
                        "Communicate proactively about challenges"
                      ].map((responsibility, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-[#3d4fd4] flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{responsibility}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-white relative z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl lg:text-4xl xl:text-5xl text-[#3d4fd4] mb-6">
                Questions About Our Policies?
              </h2>
              <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                If you have questions about any of our school policies or need clarification, 
                please don't hesitate to contact our administration.
              </p>
              <Link href="/contact">
                <Button
                  size="lg"
                  className="bg-[#3d4fd4] text-white hover:bg-[#2a3dc8ff] px-8 py-6 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  Contact Us <ArrowRight className="ml-2" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}