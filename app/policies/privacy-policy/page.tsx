"use client"

import Link from "next/link"
import { SiteFooter } from "@/components/site-footer"
import { BlueSiteHeader } from "@/components/blue-header"
import { motion } from "framer-motion"
import { 
  Shield, 
  Lock, 
  Eye, 
  FileText, 
  Users,
  Mail,
  AlertCircle,
  CheckCircle2,
  ArrowRight
} from "lucide-react"

const sections = [
  {
    id: "introduction",
    title: "Introduction",
    icon: Shield
  },
  {
    id: "privacy-information",
    title: "Privacy Information",
    icon: Lock
  },
  {
    id: "automatic-recording",
    title: "What We Record Automatically",
    icon: Eye
  },
  {
    id: "student-information",
    title: "Student Personal Information",
    icon: Users
  },
  {
    id: "student-photographs",
    title: "Student Photographs",
    icon: FileText
  },
  {
    id: "contact",
    title: "Contact Us",
    icon: Mail
  }
]

export default function PrivacyPolicyPage() {
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
                Privacy Policy
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-[#3d4fd4] leading-relaxed">
                Your Privacy and Data Protection Matter to Us
              </p>
              <p className="text-base text-[#3d4fd4] mt-4 opacity-80">
                Last Updated: December 2024
              </p>
            </motion.div>
          </div>
        </div>

        {/* Table of Contents */}
        <div className=" relative z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <motion.div
              className="max-w-5xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl lg:text-3xl text-[#3d4fd4] mb-6 font-bold">
                Quick Navigation
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sections.map((section, index) => (
                  <motion.a
                    key={section.id}
                    href={`#${section.id}`}
                    className="flex items-center gap-3 p-4 bg-gradient-to-br from-[#2a3dc8ff] to-[#3d4fd4] border-2 border-[#2a3dc8ff] rounded-lg hover:border-[#3d4fd4] hover:shadow-lg transition-all duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                  >
                    <section.icon className="w-5 h-5 text-white flex-shrink-0" />
                    <span className="text-white font-medium text-sm">
                      {section.title}
                    </span>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Introduction Section */}
        <div id="introduction" className="bg-[#EFBF04] relative z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <motion.div
              className="max-w-5xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#3d4fd4] rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl lg:text-4xl text-[#3d4fd4] font-bold">
                  Introduction
                </h2>
              </div>
              <div className="space-y-4 text-[#3d4fd4] text-base sm:text-lg leading-relaxed">
                <p>
                  Queensgate International School provides online systems and resources for use by students, staff, 
                  and teachers through online courses, resources, and training. This includes all materials accessed 
                  through any electronic devices or telecommunications network. All Queensgate policies, procedures, 
                  codes of behaviour, and rules apply to the use of online systems and resources provided by or on 
                  behalf of Queensgate International School.
                </p>
                <p>
                  This Privacy Policy protects the rights and safety of all stakeholders. Queensgate International 
                  School takes appropriate measures to ensure the security of its facilities and information. We 
                  reserve the right to monitor the use of online resources and learning tools by all who access 
                  the systems.
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Privacy Information Section */}
        <div id="privacy-information" className=" relative z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <motion.div
              className="max-w-5xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#3d4fd4] rounded-lg flex items-center justify-center">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl lg:text-4xl text-[#3d4fd4] font-bold">
                  How We Manage Your Personal Information
                </h2>
              </div>
              
              <div className="space-y-6 text-gray-700 text-base leading-relaxed">
                <p>
                  Queensgate International School does not automatically gather any personal information from you, 
                  such as your name, phone number, email, or address. This information is only obtained if you 
                  supply it voluntarily, usually through contacting us via email, subscribing to our newsfeeds, 
                  or registering in a secure portion of the site.
                </p>
                <p>
                  If you choose to provide us with personal information—such as in an email or by filling out a 
                  form with your personal information and submitting it through our website—we use that information 
                  to respond to your message and to help us get you the information or service you have requested. 
                  We treat emails the same way we treat letters sent to the school.
                </p>

                <div className="bg-gradient-to-r from-[#3d4fd4]/10 to-transparent border-l-4 border-[#3d4fd4] p-6 rounded-r-xl my-6">
                  <h3 className="text-xl font-bold text-[#3d4fd4] mb-3 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Important Commitments
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-[#EFBF04] flex-shrink-0 mt-0.5" />
                      <span>We do not create individual profiles with the information you provide</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-[#EFBF04] flex-shrink-0 mt-0.5" />
                      <span>We do not give your information to any private organizations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-[#EFBF04] flex-shrink-0 mt-0.5" />
                      <span>We do not collect information for commercial marketing purposes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-[#EFBF04] flex-shrink-0 mt-0.5" />
                      <span>We keep information only as long as necessary (maximum one year)</span>
                    </li>
                  </ul>
                </div>

                <p>
                  Any personal information you provide is managed according to applicable privacy legislation, 
                  including the Municipal Freedom of Information and Protection of Privacy Act and/or the Education 
                  Act. This means that, at the point of collection, you will be informed that your personal information 
                  is being collected, the purpose for which it is being collected, and that you have a right of access 
                  to the information.
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Automatic Recording Section */}
        <div id="automatic-recording" className="bg-[#EFBF04] relative z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <motion.div
              className="max-w-5xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#3d4fd4] rounded-lg flex items-center justify-center">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl lg:text-4xl text-[#3d4fd4] font-bold">
                  What We Record Automatically
                </h2>
              </div>
              
              <div className="space-y-6 text-[#3d4fd4] text-base leading-relaxed">
                <p>
                  When you access our website, our servers automatically record information that your browser 
                  routinely sends whenever you visit a website. These "server logs" may include information such as:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    "Your web request",
                    "Internet Protocol (IP) address",
                    "Browser type and language",
                    "Date and time of your request",
                    "Cookies that may uniquely identify your browser"
                  ].map((item, index) => (
                    <div 
                      key={index}
                      className="flex items-start gap-2  p-4 rounded-lg"
                    >
                      <CheckCircle2 className="w-5 h-5 text-[#3d4fd4] flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>

                <p className="font-medium">
                  Queensgate International School may use this information to monitor network traffic, for 
                  statistical purposes, or to identify unauthorized access attempts.
                </p>

                <div className=" p-6 rounded-xl">
                  <h3 className="text-xl font-bold text-[#3d4fd4] mb-3">
                    We Will Not Attempt to Identify You Personally
                  </h3>
                  <p className="text-gray-700 mb-4">
                    We will not identify specific users or their browsing activities, except as required by Ontario 
                    or Canadian law or if we are compelled to produce this information for a legal proceeding.
                  </p>
                  <p className="text-gray-700 mb-4">
                    However, our website does use Cookies to speed navigation, keep track of information, and provide 
                    you with custom-tailored content. We also use Cookies to remember information you gave us so you 
                    don't have to re-enter it each time you visit the website.
                  </p>
                  <p className="text-gray-600 text-sm italic">
                    Most browsers are initially set to accept Cookies. If you prefer, you can set your browser to 
                    refuse Cookies.
                  </p>
                </div>

                <div className=" p-6 rounded-xl border-l-4 border-[#EFBF04]">
                  <h3 className="text-xl font-bold text-[#3d4fd4] mb-3">
                    We Cannot Guarantee the Content of Other Sites
                  </h3>
                  <p className="text-gray-700">
                    Our websites may contain links to other sites. We are not responsible for the content and the 
                    privacy practices of other websites and encourage you to examine each site's privacy policy and 
                    make your own decisions regarding the accuracy, reliability, and correctness of material and 
                    information found.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Student Information Section */}
        <div id="student-information" className=" relative z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <motion.div
              className="max-w-5xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#3d4fd4] rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl lg:text-4xl text-[#3d4fd4] font-bold">
                  Collection, Use and Disclosure of Student Personal Information
                </h2>
              </div>
              
              <div className="space-y-6 text-gray-700 text-base leading-relaxed">
                <div className="bg-gradient-to-r from-[#EFBF04]/10 to-transparent p-6 rounded-xl border-l-4 border-[#EFBF04]">
                  <h3 className="text-xl font-bold text-[#3d4fd4] mb-3">
                    Information Notice
                  </h3>
                  <p>
                    The information collected during the school registration process is personal information as 
                    referred to in the Municipal Freedom of Information and Protection of Privacy Act (MFIPPA) and 
                    is collected pursuant to the provisions of the Education Act.
                  </p>
                </div>

                <p>
                  The Education Act sets out the duties and powers of the board and authorizes school boards to 
                  collect personal information for the purpose of planning and delivering educational programs and 
                  services which best meet students' needs and for reporting to the Minister of Education as required. 
                  It also requires that the school principal maintain an Ontario Student Record (OSR) for each student 
                  attending the school. The OSR is a record of a student's educational progress through school in 
                  Ontario and follows students when they transfer schools.
                </p>

                <p>
                  Under the MFIPPA, personal information may be used or disclosed by the school for the purpose for 
                  which it was obtained or a consistent purpose; to board officers or employees who need access to 
                  the information in the performance of their duties if necessary and proper in the discharge of the 
                  board's authorized functions; to comply with legislation, a court order or subpoena, or to aid in 
                  a law enforcement investigation conducted by a law enforcement agency; and, in compelling circumstances 
                  affecting health or safety (providing notice of the disclosure is sent to the student's home).
                </p>

                <h3 className="text-2xl font-bold text-[#3d4fd4] mt-8 mb-4">
                  Routine Uses and Disclosures
                </h3>
                
                <div className="space-y-3">
                  {[
                    "The student's OSR will be used by school and board staff to support the classroom teacher in developing an educational program which best meets the student's needs. Staff working with the classroom teacher or directly with the student may include individuals working in areas such as Special Education, guidance counselling, student success, etc.",
                    "Student demographic information and Critical Medical Information will be released to the Student Success team.",
                    "Phone numbers will be used on emergency telephone lists and emergency contact lists.",
                    "Student information may be shared with medical responders or the hospital in the case of a medical emergency.",
                    "Student information may be shared with relevant public health departments or children's services as required by law.",
                    "Information may be used to deal with matters of health and safety or discipline and is required to be disclosed in compelling circumstances or for law enforcement matters or in accordance with any other Act.",
                    "Student work, including student names, may be displayed in the classroom or in school hallways, or may be shared with the public through science fairs, school and board newsletters, writing/colouring/poster contests, community events, and similar events/locations.",
                    "Student accidents that take place during school or on school-sponsored activities will be reported to the principal. Reports include the name of the injured student(s) and details about the incident as well as the name and contact information of witnesses to the accident.",
                    "Surveillance equipment may be used in schools and on buses to enhance the safety of students and staff, to protect property against theft or vandalism, and to aid in the identification of intruders and of persons who endanger the health, wellbeing, or safety of school community members."
                  ].map((item, index) => (
                    <div 
                      key={index}
                      className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg"
                    >
                      <CheckCircle2 className="w-5 h-5 text-[#3d4fd4] flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Student Photographs Section */}
        <div id="student-photographs" className="bg-[#EFBF04] relative z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <motion.div
              className="max-w-5xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#3d4fd4] rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl lg:text-4xl text-[#3d4fd4] font-bold">
                  Student Photographs and Media
                </h2>
              </div>
              
              <div className="space-y-6 text-[#3d4fd4] text-base leading-relaxed">
                <div className=" p-6 rounded-xl">
                  <p className="font-semibold text-lg mb-4 text-[#3d4fd4]">
                    Student photographs will be used for the following purposes only when consent is provided:
                  </p>
                  
                  <div className="space-y-3">
                    {[
                      "Student names and/or photographs may be printed in school programs (e.g., commencement or graduation programs, school plays and musical productions, student awards, academic and athletic awards and plaques, school brochures, honour roll, and classroom assignments) and in school yearbooks.",
                      "Students may be recorded or photographed by their classroom teacher in school or during school activities as part of their educational program.",
                      "School activities may be reported in school newsletters and on the websites. Individual students will only be photographed and identified with appropriate consents.",
                      "The media, such as newspapers, television, and radio, may be invited to the school for the purpose of reporting on newsworthy events or activities such as graduations, student achievements/awards, and current events. Their reports may include non-identifying photos of groups of students. Individual students would only be photographed or identified with appropriate consent."
                    ].map((item, index) => (
                      <div 
                        key={index}
                        className="flex items-start gap-3 p-4 bg-[#EFBF04]/10 rounded-lg border-l-4 border-[#3d4fd4]"
                      >
                        <CheckCircle2 className="w-5 h-5 text-[#3d4fd4] flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className=" p-6 rounded-xl border-2 border-[#3d4fd4]/20">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-6 h-6 text-[#EFBF04] flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-[#3d4fd4] mb-2">
                        Important Notice for Extra-Curricular Activities
                      </p>
                      <p className="text-gray-700">
                        Parents/guardians/adult students must be aware that when students participate in extra-curricular 
                        or non-compulsory activities on or off school grounds, the school principal is unable to control 
                        or prevent any media exposure which may occur.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Contact Section */}
        <div id="contact" className=" relative z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <motion.div
              className="max-w-4xl mx-auto text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#3d4fd4] rounded-2xl mb-6">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl lg:text-4xl xl:text-5xl text-[#3d4fd4] mb-6">
                Questions About Our Privacy Policy?
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
                If you have any questions or concerns about our privacy policy or how we handle your personal 
                information, please contact us. We are committed to ensuring the privacy and security of your 
                personal information and will address any issues promptly.
              </p>
              
              <div className="bg-gradient-to-br from-[#EFBF04]/10 to-white border-2 border-[#EFBF04]/30 rounded-2xl p-8 max-w-2xl mx-auto mb-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-3">
                    <Mail className="w-5 h-5 text-[#3d4fd4]" />
                    <a 
                      href="mailto:info@queensgateschool.com" 
                      className="text-[#3d4fd4] hover:underline font-medium"
                    >
                      info@queensgateschool.com
                    </a>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 italic">
                Thank you for trusting Queensgate International School with your educational journey.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="bg-[#EFBF04] relative z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Link 
                href="/policies"
                className="inline-flex items-center gap-2 text-[#3d4fd4] hover:underline font-medium"
              >
                <ArrowRight className="w-5 h-5" />
                View All School Policies
              </Link>
            </motion.div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}