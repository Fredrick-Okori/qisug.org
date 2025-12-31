"use client"

import Link from "next/link"
import { SiteFooter } from "@/components/site-footer"
import { BlueSiteHeader } from "@/components/blue-header"
import { motion } from "framer-motion"
import { 
  Clock, 
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Users,
  FileText,
  MessageSquare,
  Video,
  ClipboardCheck,
  ArrowRight,
  AlertCircle,
  UserCheck
} from "lucide-react"

const participationMethods = [
  {
    icon: FileText,
    title: "Completion of Tests",
    description: "Regular participation in quizzes, tests, and examinations as scheduled"
  },
  {
    icon: ClipboardCheck,
    title: "Submission of Assignments",
    description: "Timely submission of all assignments, projects, and homework"
  },
  {
    icon: MessageSquare,
    title: "Discussion Forums",
    description: "Active participation in online discussion boards and class forums"
  },
  {
    icon: Video,
    title: "Live Sessions",
    description: "Attendance and participation in scheduled live virtual classes"
  },
  {
    icon: FileText,
    title: "ISU Projects/Portfolio",
    description: "Completion and submission of Independent Study Unit projects"
  },
  {
    icon: Clock,
    title: "Timed Assignments",
    description: "Completion of writing assignments with set deadlines and time constraints"
  }
]

const absenceProcedure = [
  {
    step: "1",
    title: "Notify Your Teacher",
    description: "Contact your teacher as soon as possible to inform them of your absence"
  },
  {
    step: "2",
    title: "Make-Up Consultation",
    description: "Consult with your teacher about how to make up missed time and coursework"
  },
  {
    step: "3",
    title: "Complete Missed Work",
    description: "Complete all missed assignments, activities, and assessments as agreed"
  },
  {
    step: "4",
    title: "Assessment Review",
    description: "Teacher will assess the skills and knowledge that would have been covered"
  }
]

export default function AttendancePolicyPage() {
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
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="max-w-5xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            >
              
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl pt-10 text-[#053F52] leading-tight mb-6">
                Attendance Policy
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-[#053F52] leading-relaxed">
                Ensuring Success Through Consistent Participation
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
              <div className="space-y-6 text-[#053F52] text-base sm:text-lg leading-relaxed">
                <p>
                  Queensgate International School's Attendance Policy emphasizes the importance of regular attendance 
                  as it is directly related to student success. We believe that students must attend class consistently 
                  to be well prepared for university and beyond. Our policy aligns with the Ontario Ministry of 
                  Education's requirements to ensure every student meets the necessary standards for academic achievement.
                </p>
                <p>
                  Attendance in online courses is just as crucial as in traditional classroom settings. Active 
                  participation is defined by regular engagement in course activities, including tests, assignments, 
                  discussion forums, and projects. Students who fail to maintain active participation will be subject 
                  to our attendance policy procedures to ensure they meet the 110-hour requirement for credit courses.
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Attendance Requirements Section */}
        <div className="bg-white relative z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <motion.div
              className="max-w-5xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl lg:text-4xl text-[#053F52] mb-8">
                Attendance Requirements
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border-2 border-[#EFBF04]/30 rounded-xl p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <Calendar className="w-8 h-8 text-[#053F52]" />
                    <h3 className="text-2xl text-[#053F52]">
                      Class Attendance
                    </h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    Students are expected to attend all classes. Internet-based courses are no different from 
                    traditional classroom courses in this regard. Regular attendance demonstrates commitment 
                    to learning and is essential for academic success.
                  </p>
                </div>

                <div className="bg-white border-2 border-[#053F52]/30 rounded-xl p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <UserCheck className="w-8 h-8 text-[#053F52]" />
                    <h3 className="text-2xl text-[#053F52]">
                      Active Participation
                    </h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    Attendance in online courses is defined as active participation in the course as described 
                    in the individual course syllabus and Ontario Ministry of Education Course Expectations. 
                    Engagement is key to learning.
                  </p>
                </div>
              </div>

              {/* 110-Hour Requirement */}
              <div className="mt-8 bg-gradient-to-r from-[#053F52] to-[#053F52] rounded-2xl p-8 lg:p-12 text-white">
                <div className="flex items-start gap-4">
                  <AlertCircle className="w-10 h-10 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-2xl lg:text-3xl mb-4">
                      Credit Requirements
                    </h3>
                    <p className="text-lg leading-relaxed mb-4">
                      The Ministry of Education mandates that an academic credit includes <strong>110 hours of 
                      classroom instruction</strong>. Students who miss eight or more classes in a course of study 
                      may not be able to attain a credit in the course.
                    </p>
                    <p className="text-white/90">
                      The Administrative Team will review the circumstances related to the student and the reasons 
                      for absence to determine if credit can still be awarded.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Methods of Recording Participation */}
        <div className="bg-[#EFBF04] relative z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <motion.div
              className="max-w-5xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl lg:text-4xl text-[#053F52] mb-4 text-center">
                Methods of Recording Participation
              </h2>
              <p className="text-lg text-[#053F52] text-center mb-12 max-w-3xl mx-auto">
                Internet-based courses will, at a minimum, have weekly assignments to record student participation, 
                which can be documented by any or all of the following methods:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {participationMethods.map((method, index) => (
                  <motion.div
                    key={method.title}
                    className="bg-white rounded-xl p-6 hover:shadow-xl transition-all duration-300"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <div className="w-12 h-12 bg-[#053F52] rounded-lg flex items-center justify-center mb-4">
                      <method.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg text-[#053F52] mb-2">
                      {method.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {method.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Handling Absences Section */}
        <div className="bg-white relative z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <motion.div
              className="max-w-5xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl lg:text-4xl text-[#053F52] mb-8">
                Handling Absences
              </h2>

              <div className="bg-gradient-to-r from-yellow-50 to-white border-l-4 border-yellow-500 p-6 rounded-r-xl mb-8">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl text-gray-900 mb-2">
                      Missed Classes
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      When a student misses a class, they will be expected to make up the time missed. Teachers 
                      and the student will consult about how to make up the time and how to assess the skills and 
                      knowledge that would have been missed by the student.
                    </p>
                  </div>
                </div>
              </div>

              {/* Absence Procedure */}
              <h3 className="text-2xl text-[#053F52] mb-6">
                Absence Procedure
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                {absenceProcedure.map((item, index) => (
                  <motion.div
                    key={item.step}
                    className="flex gap-4 bg-gradient-to-br from-[#EFBF04]/10 to-white border-2 border-[#EFBF04]/30 rounded-xl p-6"
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <div className="w-12 h-12 bg-[#053F52] rounded-full flex items-center justify-center flex-shrink-0 text-white text-xl">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="text-lg text-[#053F52] mb-2">
                        {item.title}
                      </h4>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Exceeding Absence Limit Section */}
        <div className="bg-[#EFBF04] relative z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <motion.div
              className="max-w-5xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl lg:text-4xl text-[#053F52] mb-8">
                Exceeding the Absence Limit
              </h2>

              <div className="bg-white rounded-2xl p-8 lg:p-12">
                <div className="bg-red-50 border-2 border-red-500 rounded-xl p-6 mb-8">
                  <div className="flex items-start gap-4">
                    <AlertTriangle className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl text-red-900 mb-2">
                        Important Notice
                      </h3>
                      <p className="text-red-800 font-medium">
                        If a student's absences exceed the limit of <strong>eight classes</strong> in a course, 
                        the following actions will be taken:
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#053F52] rounded-lg flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg text-[#053F52] mb-2">
                        Administrative Review
                      </h4>
                      <p className="text-gray-700 leading-relaxed">
                        The Administrative Team will review the student's attendance record and the reasons for 
                        the excessive absences to determine appropriate action.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#053F52] rounded-lg flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg text-[#053F52] mb-2">
                        Student and Parent Meeting
                      </h4>
                      <p className="text-gray-700 leading-relaxed">
                        A meeting will be scheduled with the student, their parents, and relevant school staff 
                        to discuss the situation and potential solutions.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#053F52] rounded-lg flex items-center justify-center flex-shrink-0">
                      <ClipboardCheck className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg text-[#053F52] mb-2">
                        Make-Up Plan
                      </h4>
                      <p className="text-gray-700 leading-relaxed">
                        A plan will be developed to help the student make up missed time and assignments, if feasible. 
                        This plan will include specific deadlines and expectations.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg text-red-600 mb-2">
                        Credit Impact
                      </h4>
                      <p className="text-gray-700 leading-relaxed">
                        If it is determined that the student cannot meet the 110-hour requirement, they may not 
                        receive credit for the course. This decision is made on a case-by-case basis.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Importance of Attendance */}
        <div className="bg-white relative z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <motion.div
              className="max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-gradient-to-br from-[#053F52] to-[#053F52] rounded-2xl p-8 lg:p-12 text-white">
                <div className="flex items-start gap-4 mb-6">
                  <CheckCircle2 className="w-10 h-10 flex-shrink-0 mt-1" />
                  <div>
                    <h2 className="text-3xl lg:text-4xl mb-4">
                      Importance of Attendance
                    </h2>
                    <div className="space-y-4 text-lg leading-relaxed">
                      <p>
                        Maintaining regular attendance is crucial for academic success and preparation for future 
                        educational endeavors. Consistent participation ensures students stay engaged with the 
                        curriculum and develop the necessary skills for their academic and professional journeys.
                      </p>
                      <p>
                        Understanding the impact of absences highlights the importance of commitment and responsibility 
                        in achieving educational goals. Regular attendance demonstrates dedication to learning and 
                        respect for the educational process.
                      </p>
                      <p className="font-medium">
                        Students who attend classes regularly are more likely to succeed academically, build stronger 
                        relationships with teachers and peers, and be better prepared for post-secondary education.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Best Practices Section */}
        <div className="bg-[#EFBF04] relative z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <motion.div
              className="max-w-5xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl lg:text-4xl text-[#053F52] mb-8 text-center">
                Best Practices for Attendance
              </h2>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    title: "Set a Schedule",
                    description: "Create a consistent daily routine for attending classes and completing coursework"
                  },
                  {
                    title: "Communicate Early",
                    description: "If you must be absent, notify your teacher as soon as possible"
                  },
                  {
                    title: "Stay Organized",
                    description: "Keep track of all assignments, tests, and participation requirements"
                  },
                  {
                    title: "Prioritize Learning",
                    description: "Treat online classes with the same importance as in-person attendance"
                  },
                  {
                    title: "Seek Help",
                    description: "Contact your teacher if you're struggling with attendance or coursework"
                  },
                  {
                    title: "Plan Ahead",
                    description: "Schedule appointments and activities around your class schedule when possible"
                  }
                ].map((practice, index) => (
                  <motion.div
                    key={practice.title}
                    className="bg-white rounded-xl p-6 hover:shadow-lg transition-all duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-[#EFBF04] flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="text-lg text-[#053F52] mb-2">
                          {practice.title}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {practice.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="bg-white relative z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl lg:text-4xl xl:text-5xl text-[#053F52] mb-6">
                Questions About Attendance?
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
                If you have questions about attendance requirements or need to discuss your specific situation, 
                please contact your teacher or the administration.
              </p>
              <Link 
                href="/policies"
                className="inline-flex items-center gap-2 text-[#053F52] hover:underline font-medium text-lg"
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