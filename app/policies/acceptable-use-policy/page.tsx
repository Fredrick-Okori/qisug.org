"use client"

import Link from "next/link"
import { SiteFooter } from "@/components/site-footer"
import { BlueSiteHeader } from "@/components/blue-header"
import { motion } from "framer-motion"
import { 
  Monitor, 
  Shield,
  Lock,
  AlertTriangle,
  XCircle,
  FileText,
  User,
  Eye,
  Globe,
  CheckCircle2,
  ArrowRight,
  AlertCircle,
  Ban,
  Camera,
  MessageSquare,
  Scale,
  Clock
} from "lucide-react"

const safetyRules = [
  {
    icon: User,
    title: "Personal Information",
    description: "Never reveal personal identity information (name, address, phone number, age, physical description, or school) to strangers online. Do not reveal such information in public online forums."
  },
  {
    icon: Shield,
    title: "Other's Information",
    description: "Do not reveal personal information about others without their permission. Respect the privacy of fellow students, staff, and community members."
  },
  {
    icon: Lock,
    title: "Passwords",
    description: "Never reveal your access password or that of anyone else. Keep your login credentials secure and confidential at all times."
  },
  {
    icon: Camera,
    title: "Images",
    description: "Do not send pictures of yourself or others over an electronic network without prior permission from all parties involved."
  },
  {
    icon: AlertCircle,
    title: "Suspicious Messages",
    description: "Report immediately to a teacher any message or request that bothers you or suggests personal contact from unknown individuals."
  },
  {
    icon: Globe,
    title: "Field Trips",
    description: "Never publish specific dates, times, and locations of field trips to unauthorized individuals or public forums for safety reasons."
  }
]

const prohibitedContent = [
  "Advocates illegal acts or facilitates unlawful activity",
  "Threatens or intimidates others",
  "Uses inappropriate or abusive language or conduct",
  "Contains inappropriate religious or political messages",
  "Violates the rights of others",
  "Is racially, culturally, or religiously offensive",
  "Encourages use of controlled substances or illegal acts",
  "Is defamatory, abusive, obscene, or sexually explicit",
  "Contains personal information or images without consent",
  "Constitutes sexual harassment or inappropriate romantic overtones",
  "Solicits on behalf of a business or commercial organization without authorization",
  "Supports bulk mail, junk mail, or 'spamming'",
  "Propagates chain letters",
  "Attempts to hide or misrepresent the identity of the sender"
]

const prohibitedActivities = [
  {
    title: "Unauthorized Software",
    description: "Do not copy, download, install, or run viruses or inappropriate materials on school systems."
  },
  {
    title: "Damage",
    description: "Do not cause damage to computer equipment, files, or network infrastructure."
  },
  {
    title: "Account Misuse",
    description: "Do not use another person's account or cause a user to lose access to their account."
  },
  {
    title: "Unauthorized Access",
    description: "Do not tamper with hardware, software, or network configurations without authorization."
  },
  {
    title: "Information Misuse",
    description: "Do not compromise others by unauthorized copying or use of information."
  },
  {
    title: "Security Breaches",
    description: "Do not attempt to breach security measures or hack the system in any way."
  }
]

const publishingGuidelines = [
  "Ensure information published online meets Queensgate policies and guidelines",
  "Links to outside sites must meet content quality standards",
  "Clearly identify the publisher of any information collection",
  "Ensure information is current and accurate",
  "Do not publish personal information without permission",
  "Do not publish specific details of field trips for safety reasons",
  "Ensure all published work is original or cleared for copyright",
  "All advertising is subject to approval by the supervisory officer",
  "All web pages on the Queensgate site are property of Queensgate International School"
]

export default function AcceptableUsePolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#efbf04]">
      <BlueSiteHeader />

      <main className="flex-1 relative">
        {/* Hero Section */}
        <div className="pt-24 sm:pt-28 md:pt-40 lg:pt-50 xl:pt-48 pb-6 sm:pb-8 md:pb-10 lg:pb-12 bg-[#efbf04]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="max-w-5xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            >
              
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl pt-10 text-[#053F52] leading-tight mb-6">
                Acceptable Use Policy
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-700 leading-relaxed">
                Responsible and Safe Use of Technology and Online Resources
              </p>
            </motion.div>
          </div>
        </div>

        {/* Introduction Section */}
        <div className="bg-[#efbf04] relative z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <motion.div
              className="max-w-5xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="border-l-4 border-[#053F52] pl-6 mb-8">
                <h2 className="text-3xl lg:text-4xl text-[#053F52] mb-4">
                  Code of Online Conduct
                </h2>
                <div className="space-y-4 text-gray-700 text-base sm:text-lg leading-relaxed">
                  <p>
                    Queensgate International School provides online systems and resources for use by students, staff, 
                    and teachers through online courses, resources, and training. This includes all materials accessed 
                    through any electronic devices or telecommunications network. All Queensgate policies, procedures, 
                    codes of behaviour, and rules apply to the use of online systems and resources provided by or on 
                    behalf of Queensgate International School.
                  </p>
                  <p>
                    This Code of Online Conduct protects the rights and safety of all stakeholders. Queensgate takes 
                    appropriate measures to ensure the security of its facilities and information. Queensgate reserves 
                    the right to monitor the use of online resources and learning tools by all who access the systems.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Individual Safety Rules Section */}
        <div className="bg-[#efbf04] relative z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <motion.div
              className="max-w-6xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#053F52] rounded-2xl mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl lg:text-4xl text-[#053F52] mb-4">
                  Individual Safety Rules
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Protect yourself and others by following these essential safety guidelines
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {safetyRules.map((rule, index) => (
                  <motion.div
                    key={rule.title}
                    className="bg-[#efbf04] border-2 border-gray-200 rounded-xl p-6 hover:border-[#053F52] hover:shadow-lg transition-all duration-300"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <div className="w-12 h-12 bg-[#EFBF04] rounded-lg flex items-center justify-center mb-4">
                      <rule.icon className="w-6 h-6 text-[#053F52]" />
                    </div>
                    <h3 className="text-lg text-[#053F52] mb-3">
                      {rule.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {rule.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Unacceptable Sites and Materials */}
        <div className=" relative z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <motion.div
              className="max-w-5xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500 rounded-2xl mb-4">
                  <Ban className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl lg:text-4xl text-[#203dce] mb-4">
                  Unacceptable Sites and Materials
                </h2>
              </div>

              <div className="bg-[#efbf04] rounded-xl border-2 border-red-200 p-8 mb-6">
                <div className="flex items-start gap-4 mb-6">
                  <AlertTriangle className="w-8 h-8 text-red-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl text-gray-900 mb-3">
                      Controversial Content
                    </h3>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      Do not intentionally access material considered inappropriate or offensive. Report accidental 
                      access immediately to your teacher or administrator.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      Online systems must not be used to access sites containing discriminatory or harassing material.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-[#efbf04] rounded-xl border-2 border-red-200 p-8">
                <h3 className="text-2xl text-[#053F52] mb-6">
                  Prohibited Content
                </h3>
                <p className="text-gray-700 mb-6">
                  Do not access, upload, download, store, display, distribute, or publish information that:
                </p>
                <div className="grid md:grid-cols-2 gap-3">
                  {prohibitedContent.map((item, index) => (
                    <div 
                      key={index}
                      className="flex items-start gap-2"
                    >
                      <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Use Guidelines */}
        <div className="bg-[#efbf04] relative z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <motion.div
              className="max-w-5xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#EFBF04] rounded-2xl mb-4">
                  <CheckCircle2 className="w-8 h-8 text-[#053F52]" />
                </div>
                <h2 className="text-3xl lg:text-4xl text-[#053F52] mb-4">
                  Queensgate Use Guidelines
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-[#efbf04] border-2 border-[#EFBF04] rounded-xl p-8">
                  <div className="flex items-start gap-4">
                    <Clock className="w-8 h-8 text-[#053F52] flex-shrink-0" />
                    <div>
                      <h3 className="text-xl text-[#053F52] mb-3">
                        Usage Limits
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        Keep online use reasonable in terms of time and volume of information transferred. 
                        Be mindful of bandwidth and system resources.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#efbf04] border-2 border-[#EFBF04] rounded-xl p-8">
                  <div className="flex items-start gap-4">
                    <AlertCircle className="w-8 h-8 text-[#053F52] flex-shrink-0" />
                    <div>
                      <h3 className="text-xl text-[#053F52] mb-3">
                        Reporting Harm
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        Report any harm to the system or information immediately to your teacher or IT 
                        administrator. This includes technical issues and security concerns.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Prohibited Uses and Activities */}
        <div className="bg-[#203dce] relative z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <motion.div
              className="max-w-5xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500 rounded-2xl mb-4">
                  <XCircle className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl lg:text-4xl text-white mb-4">
                  Prohibited Uses and Activities
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {prohibitedActivities.map((activity, index) => (
                  <motion.div
                    key={activity.title}
                    className="bg-[#efbf04] border-2 border-gray-200 rounded-xl p-6"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Ban className="w-5 h-5 text-red-500" />
                      </div>
                      <div>
                        <h3 className="text-lg text-[#053F52] mb-2">
                          {activity.title}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {activity.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Consequences Section */}
        <div className="bg-[#efbf04] relative z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <motion.div
              className="max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-red-50 border-2 border-red-500 rounded-2xl p-8 lg:p-12">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="w-10 h-10 text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <h2 className="text-3xl lg:text-4xl text-[#053F52] mb-4">
                      Consequences for Violating This Policy
                    </h2>
                    <p className="text-gray-800 text-lg leading-relaxed font-medium">
                      Inappropriate use of online access could result in disciplinary action, including but not 
                      limited to:
                    </p>
                    <ul className="mt-6 space-y-3">
                      {[
                        "Suspension or termination of technology privileges",
                        "Academic penalties",
                        "In-school or out-of-school suspension",
                        "Expulsion from the school",
                        "Legal action and/or police involvement for serious violations"
                      ].map((consequence, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{consequence}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Online Publishing Section */}
        <div className="bg-[#203dce] relative z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <motion.div
              className="max-w-5xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#053F52] rounded-2xl mb-4">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl lg:text-4xl text-white mb-4">
                  Online Publishing Guidelines
                </h2>
                <p className="text-lg text-white max-w-3xl mx-auto">
                  If you publish content representing Queensgate International School, follow these guidelines
                </p>
              </div>

              <div className="bg-[#efbf04] border-2 border-[#053F52] rounded-xl p-8">
                <div className="space-y-4">
                  {publishingGuidelines.map((guideline, index) => (
                    <div 
                      key={index}
                      className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                    >
                      <CheckCircle2 className="w-5 h-5 text-[#053F52] flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 leading-relaxed">{guideline}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Liability Section */}
        <div className="bg-[#efbf04] relative z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <motion.div
              className="max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-gray-100 border-l-4 border-[#EFBF04] rounded-r-xl p-8">
                <div className="flex items-start gap-4">
                  <Scale className="w-8 h-8 text-[#053F52] flex-shrink-0 mt-1" />
                  <div>
                    <h2 className="text-2xl lg:text-3xl text-[#053F52] mb-4">
                      Liability
                    </h2>
                    <div className="space-y-3 text-gray-700 leading-relaxed">
                      <p>
                        Queensgate International School makes no warranties regarding its online services, resources, 
                        equipment, or facilities. The school provides these resources on an "as is" and "as available" basis.
                      </p>
                      <p>
                        Queensgate is not responsible for the operability and safety of any program or file posted on 
                        its systems by third parties. Users access and use online resources at their own risk.
                      </p>
                      <p className="font-medium">
                        Users are responsible for their own actions when using school technology and online resources.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Summary Section */}
        <div className=" relative z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <motion.div
              className="max-w-4xl mx-auto text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl lg:text-4xl text-[#203dce] mb-6">
                Your Commitment to Responsible Technology Use
              </h2>
              <p className="text-lg text-[#203dce] leading-relaxed mb-8">
                By using Queensgate International School's technology resources, you agree to follow this 
                Acceptable Use Policy. Responsible use of technology is essential for maintaining a safe, 
                productive, and respectful learning environment for all members of our school community.
              </p>
              <div className="bg-[#efbf04] backdrop-blur-sm rounded-xl p-6">
                <p className="text-[#203dce] font-medium">
                  Remember: All online activities may be monitored to ensure compliance with this policy 
                  and to maintain the safety and security of our school community.
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="bg-[#efbf04] relative z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl lg:text-4xl text-[#053F52] mb-6">
                Questions About This Policy?
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
                If you need clarification on any aspect of our Acceptable Use Policy, please contact 
                your teacher or the administration.
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