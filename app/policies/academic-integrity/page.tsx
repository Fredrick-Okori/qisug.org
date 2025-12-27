"use client"

import Link from "next/link"
import { SiteFooter } from "@/components/site-footer"
import { BlueSiteHeader } from "@/components/blue-header"
import { motion } from "framer-motion"
import { 
  GraduationCap, 
  Shield, 
  AlertTriangle,
  FileText,
  Users,
  Scale,
  CheckCircle2,
  XCircle,
  ArrowRight,
  BookOpen,
  AlertCircle
} from "lucide-react"

const plagiarismExamples = [
  "Copying or paraphrasing the work of others without proper citation",
  "Misrepresenting someone else's work as one's own",
  "Copying another student's work",
  "Translating work from one language to another without citation",
  "Using the same piece of work for two different courses or assignments"
]

const cheatingExamples = [
  "Viewing or using unauthorized materials during tests or exams",
  "Bringing unauthorized notes or electronic devices into an examination",
  "Giving or receiving unauthorized aid on assignments or tests",
  "Sharing or copying another student's work",
  "Theft of tests or examination materials"
]

const consequences = [
  {
    level: "Grades 9, 10, and 11",
    firstOffence: [
      "Receive a zero on the test or assignment",
      "Complete an alternative assignment with a maximum value of up to 50% of the original assignment"
    ],
    repeatedOffences: [
      "Parents informed",
      "Zero on the test or assignment",
      "Complete an alternative assignment with a maximum value of up to 50%",
      "One-day in-school suspension"
    ]
  },
  {
    level: "Grade 12/Pre-University",
    firstOffence: [
      "Receive a zero on the test or assignment",
      "Complete an alternative assignment with a maximum value of up to 50%",
      "Inform parents",
      "Write a letter demonstrating understanding and assurance against future dishonesty"
    ],
    repeatedOffences: [
      "Zero on the test or assignment with no opportunity for an alternative assignment",
      "Zero included in the final grade calculation",
      "Potential further disciplinary action up to expulsion"
    ]
  }
]

export default function AcademicIntegrityPage() {
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
              
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl pt-10 text-[#3d4fd4] leading-tight mb-6">
                Academic Integrity
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-[#3d4fd4] leading-relaxed">
                Upholding the Standards of Academic Excellence
              </p>
            </motion.div>
          </div>
        </div>

        {/* Introduction Section */}
        <div className="bg-[#EFBF04] relative z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <motion.div
              className="max-w-5xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-[#EFBF04] rounded-2xl p-8 lg:p-12 mb-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-[#3d4fd4] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl lg:text-4xl text-[#3d4fd4]  mb-4">
                      Our Commitment
                    </h2>
                    <p className="text-gray-700 text-lg leading-relaxed">
                      Queensgate International School's Academic Integrity Policy is designed to align with the 
                      Ontario Ministry of Education's Growing Success Document. Our goal is to ensure that all 
                      students understand and adhere to the highest standards of academic honesty, preparing them 
                      for future academic and professional success.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-[#EFBF04] rounded-xl p-6">
                  <h3 className="text-xl  text-[#3d4fd4] mb-4">
                    What is Academic Integrity?
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Academic integrity is the commitment to honesty, trust, fairness, respect, and responsibility 
                    in all academic work. It is the foundation of scholarly and educational excellence.
                  </p>
                </div>
                <div className="bg-[#EFBF04] rounded-xl p-6">
                  <h3 className="text-xl  text-[#3d4fd4] mb-4">
                    Why It Matters
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Maintaining academic integrity is essential for fostering a culture of honesty and responsibility. 
                    It ensures fair evaluation and prepares students for ethical professional conduct.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Definition Section */}
        <div className="bg-[#EFBF04] relative z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <motion.div
              className="max-w-5xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl lg:text-4xl text-[#3d4fd4] mb-8 ">
                Definition of Academic Dishonesty
              </h2>
              <div className="bg-gradient-to-r from-red-50 to-white border-l-4 border-red-500 p-6 rounded-r-xl mb-8">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                  <p className="text-gray-700 text-lg">
                    Engaging in any form of academic dishonesty or misconduct to obtain academic credit or 
                    advantage is a <strong>serious offence</strong> under this policy.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Plagiarism */}
                <motion.div
                  className="bg-gradient-to-br from-[#EFBF04]/10 to-white border-2 border-[#EFBF04]/30 rounded-xl p-8"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <FileText className="w-8 h-8 text-[#3d4fd4]" />
                    <h3 className="text-2xl  text-[#3d4fd4]">
                      Plagiarism
                    </h3>
                  </div>
                  <p className="text-gray-700 mb-4 font-medium">
                    Examples include:
                  </p>
                  <ul className="space-y-3">
                    {plagiarismExamples.map((example, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{example}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* Cheating */}
                <motion.div
                  className="bg-gradient-to-br from-[#3d4fd4]/10 to-white border-2 border-[#3d4fd4]/30 rounded-xl p-8"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <AlertCircle className="w-8 h-8 text-[#3d4fd4]" />
                    <h3 className="text-2xl  text-[#3d4fd4]">
                      Cheating
                    </h3>
                  </div>
                  <p className="text-gray-700 mb-4 font-medium">
                    Examples include:
                  </p>
                  <ul className="space-y-3">
                    {cheatingExamples.map((example, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{example}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Roles and Responsibilities */}
        <div className="bg-[#EFBF04] relative z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <motion.div
              className="max-w-5xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl lg:text-4xl text-[#3d4fd4] mb-8 ">
                Roles and Responsibilities
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Teacher Responsibilities */}
                <div className="bg-[#EFBF04] rounded-xl p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <Users className="w-6 h-6 text-[#3d4fd4]" />
                    <h3 className="text-2xl  text-[#3d4fd4]">
                      Teacher
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-[#3d4fd4] flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">
                        Assemble relevant evidence and interview the student if academic dishonesty is suspected
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-[#3d4fd4] flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">
                        If the explanation is satisfactory, the process stops
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-[#3d4fd4] flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">
                        If the explanation is unsatisfactory or if dishonesty is denied, communicate with the 
                        Principal within 24 hours
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Principal Responsibilities */}
                <div className="bg-[#EFBF04] rounded-xl p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <Scale className="w-6 h-6 text-[#3d4fd4]" />
                    <h3 className="text-2xl  text-[#3d4fd4]">
                      Principal
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-[#3d4fd4] flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">
                        Examine the evidence and interview the student(s)
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-[#3d4fd4] flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">
                        Inform parent(s) as needed about the investigation, including the allegations, policy, 
                        and potential outcomes
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Consequences Section */}
        <div className="bg-[#EFBF04] relative z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <motion.div
              className="max-w-5xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl lg:text-4xl text-[#3d4fd4] mb-4 ">
                Guidelines for Deciding Consequences of Academic Dishonesty
              </h2>
              
              {/* Examinations Warning */}
              <div className="bg-gradient-to-r from-red-100 to-red-50 border-2 border-red-500 rounded-xl p-6 mb-8">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl  text-red-900 mb-2">
                      Examinations
                    </h3>
                    <p className="text-red-800 font-medium">
                      Academic dishonesty on Midterm and Final exams warrants expulsion and may result in that decision.
                    </p>
                  </div>
                </div>
              </div>

              {/* Other Evaluations */}
              <h3 className="text-2xl  text-[#3d4fd4] mb-6">
                Other Evaluations, Assignments, or Tests
              </h3>

              <div className="space-y-6">
                {consequences.map((consequence, index) => (
                  <motion.div
                    key={consequence.level}
                    className="bg-gradient-to-br from-[#EFBF04]/10 to-white border-2 border-[#EFBF04]/30 rounded-xl p-8"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <h4 className="text-2xl  text-[#3d4fd4] mb-6">
                      {consequence.level}
                    </h4>

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* First Offence */}
                      <div>
                        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded-r-lg mb-4">
                          <h5 className=" text-yellow-900 mb-2">
                            First Offence
                          </h5>
                        </div>
                        <ul className="space-y-2">
                          {consequence.firstOffence.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <CheckCircle2 className="w-5 h-5 text-[#3d4fd4] flex-shrink-0 mt-0.5" />
                              <span className="text-gray-700">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Repeated Offences */}
                      <div>
                        <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded-r-lg mb-4">
                          <h5 className=" text-red-900 mb-2">
                            Repeated Offences
                          </h5>
                        </div>
                        <ul className="space-y-2">
                          {consequence.repeatedOffences.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                              <span className="text-gray-700">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Importance Section */}
        <div className="bg-[#EFBF04] relative z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <motion.div
              className="max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-[#EFBF04] rounded-2xl p-8 lg:p-12">
                <div className="flex items-start gap-4 mb-6">
                  <BookOpen className="w-10 h-10 text-[#3d4fd4] flex-shrink-0" />
                  <div>
                    <h2 className="text-3xl lg:text-4xl text-[#3d4fd4]  mb-4">
                      Importance of Academic Integrity
                    </h2>
                    <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
                      <p>
                        Maintaining academic integrity is essential for fostering a culture of honesty and 
                        responsibility. Students must understand the seriousness of academic dishonesty and 
                        its consequences.
                      </p>
                      <p>
                        This policy ensures that all students have a clear understanding of the expectations 
                        and the importance of integrity in their academic journey. By upholding these standards, 
                        we prepare students for ethical conduct in higher education and their future careers.
                      </p>
                      <p className="font-medium text-[#3d4fd4]">
                        Academic integrity is not just about following rules—it's about developing character, 
                        building trust, and contributing to a community of honest scholarship.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Resources Section */}
        <div className="bg-[#EFBF04] relative z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <motion.div
              className="max-w-5xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl lg:text-4xl text-[#3d4fd4] mb-8  text-center">
                Additional Resources
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-[#EFBF04]/10 to-white border-2 border-[#EFBF04]/30 rounded-xl p-6 text-center">
                  <BookOpen className="w-10 h-10 text-[#3d4fd4] mx-auto mb-4" />
                  <h3 className="text-lg  text-[#3d4fd4] mb-2">
                    Growing Success
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Ontario Ministry of Education assessment policy
                  </p>
                  <a 
                    href="http://www.edu.gov.on.ca/eng/policyfunding/growSuccess.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#3d4fd4] hover:underline text-sm font-medium"
                  >
                    Read Document →
                  </a>
                </div>

                <div className="bg-gradient-to-br from-[#3d4fd4]/10 to-white border-2 border-[#3d4fd4]/30 rounded-xl p-6 text-center">
                  <Users className="w-10 h-10 text-[#3d4fd4] mx-auto mb-4" />
                  <h3 className="text-lg  text-[#3d4fd4] mb-2">
                    Student Support
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Need help with citations or writing?
                  </p>
                  <Link 
                    href="/contact"
                    className="text-[#3d4fd4] hover:underline text-sm font-medium"
                  >
                    Contact Us →
                  </Link>
                </div>

                <div className="bg-gradient-to-br from-[#EFBF04]/10 to-white border-2 border-[#EFBF04]/30 rounded-xl p-6 text-center">
                  <FileText className="w-10 h-10 text-[#3d4fd4] mx-auto mb-4" />
                  <h3 className="text-lg  text-[#3d4fd4] mb-2">
                    All Policies
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    View all school policies and guidelines
                  </p>
                  <Link 
                    href="/policies"
                    className="text-[#3d4fd4] hover:underline text-sm font-medium"
                  >
                    View Policies →
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="bg-[#EFBF04] relative z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl lg:text-4xl xl:text-5xl text-[#3d4fd4] mb-6">
                Questions About This Policy?
              </h2>
              <p className="text-lg text-[#3d4fd4] mb-8 max-w-3xl mx-auto">
                If you need clarification on any aspect of our Academic Integrity Policy, 
                please don't hesitate to reach out to our administration.
              </p>
              <Link 
                href="/policies"
                className="inline-flex items-center gap-2 text-[#3d4fd4] hover:underline font-medium text-lg"
              >
                <ArrowRight className="w-5 h-5" />
                Back to All Policies
              </Link>
            </motion.div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}