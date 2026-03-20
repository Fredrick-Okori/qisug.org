"use client"

import Link from "next/link"
import { SiteFooter } from "@/components/site-footer"
import { BlueSiteHeader } from "@/components/blue-header"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { 
  Users, 
  GraduationCap, 
  Award, 
  Globe, 
  Heart,
  Target,
  Lightbulb,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Star,
  Quote
} from "lucide-react"
import { CTA } from "@/components/home/cta"
import Accreditations from "./home/accreditations"
import Image from "next/image"

// Structured Data for SEO
const aboutSchemaData = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": "Queensgate International School",
  "description": "Queensgate International School is a leading institution dedicated to delivering world-class education to students across the globe.",
  "url": "https://www.qgis.ac.ug/about",
  "image": "https://www.qgis.ac.ug/images/queen-27s-20gate-20web-20nw-02.jpeg",
  "telephone": "+1-234-567-8900",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "US"
  },
  "foundingDate": "2004",
  "areaServed": "Worldwide",
  "type": "PrivateSchool",
  "numberOfEmployees": {
    "@type": "QuantitativeValue",
    "value": "100+"
  },
  "memberOf": {
    "@type": "Organization",
    "name": "International Baccalaureate"
  }
}



const coreValues = [
  {
    icon: Target,
    title: "Excellence",
    description: "We strive for the highest standards in all aspects of education, pushing students to reach their full potential."
  },
  {
    icon: Heart,
    title: "Integrity",
    description: "We foster honesty, ethical behavior, and strong moral character in all our students and staff."
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "We embrace new ideas, technologies, and teaching methods to prepare students for tomorrow's challenges."
  },
  {
    icon: Globe,
    title: "Global Citizenship",
    description: "We develop students who think globally, act locally, and contribute positively to society."
  }
]

const educators = [
  {
    name: "Ms. Hedwig Namazzi",
    title: "English and History",
    initials: "",
    image: "/team/hedwig_namazzi.avif",
    expertise: ["English", "History"]
  },
  {
    name: "Ms. Emma Golola",
    title: "Head of English and Computer Science Department",
    initials: "JT",
    image: "/team/emma_golola.avif",
    expertise: ["English", "Computer Science"]
  },
  {
    name: "Mrs. Claire Gomushabe",
    title: "Teacher Facilitator/Chemistry",
    initials: "EC",
    image: "/team/claire_gomushabe.avif",
    expertise: ["Facilitator", "Chemistry"]
  }
]

const directors = [
  {
    name: "Turinawe Edmund",
    title: "Board Director & Corporate Strategy, Growth & Infrastructure",
    image: "/directors/Edmund 1_converted.avif"
  },
  {
    name: "Gahongaire Mary Kinobe",
    title: "Chairperson, Board of Directors of Propietors",
    image: "/directors/Maria 4_converted.avif"
  },
  {
    name: "Eng. Kuteesa Tumwiine Ferdinand",
    title: "Board Director Propietor | Finance & Infrastructure",
    image: "/directors/ferdinand.avif"
  },
]

const testimonials = [
  {
    name: "Laurent Kiiza Nahabwe",
    role: "UNEB (S2) → OSSD (Grades 11 & 12) → University of the Fraser Valley, Canada",
    content: "Transitioning from the UNEB curriculum after Senior 2 to the Ontario Secondary School Diploma (OSSD) was a game-changer for me. The shift exposed me to a skills-based, research-driven system where continuous assessment and structured coursework replaced rote learning. By the time I joined the University of the Fraser Valley, I was already comfortable with the Canadian academic structure. OSSD gave me the confidence, communication skills, and a direct pathway to excel in Canada.",
    rating: 5
  },
  {
    name: "Victor Karamagi Naturinda",
    role: "UNEB (S4) → OSSD (1 Year) → University of the Fraser Valley, Canada",
    content: "After Senior 4, I spent one transformative year in the OSSD program before moving to Canada. The emphasis on critical thinking and practical application perfectly prepared me for the pace of a Canadian university. When I arrived at UFV, the transition felt seamless because the academic style was already familiar. OSSD didn't just strengthen my profile; it made my international education goals clear and achievable.",
    rating: 5
  },
  {
    name: "Anonymous Alumni",
    role: "UNEB (Senior 4) → OSSD (Grade 12 Pathway) → Saint Mary's University (SMU), Halifax → Clinical Psychologist",
    content: "After finishing Senior 4 under the UNEB system, I pursued the Ontario Secondary School Diploma (OSSD) before enrolling at Saint Mary's University in Halifax. The program strengthened my academic writing, research ability, and independent learning habits—skills that were essential for studying psychology in Canada. Today, as a Clinical Psychologist, I can confidently say the OSSD pathway laid a strong foundation for my university journey and professional growth. It bridges students from UNEB into the Canadian education system in a structured and empowering way.",
    rating: 5
  }
]

export default function AboutContent() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* JSON-LD Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchemaData) }}
      />
      
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            
              </motion.div>
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl pt-10 text-[#053F52] leading-tight mb-6">
                About Queensgate International School
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-[#053F52] leading-relaxed">
                Excellence in Education, Global in Reach
              </p>
            </motion.div>
          </div>
        </div>



        {/* Directors's Message Section - TWO COLUMNS LAYOUT */}
        <div className="bg-[#EFBF04] relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-16 items-start lg:items-center">
              {/* Left Side - Title, Quote and Director's Image */}
              <motion.div 
                className="order-1 lg:order-1 w-full"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              >
                <motion.h2 
                  className="text-3xl lg:text-4xl text-[#053F52] mb-4 font-serif"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  A Message from Our Managing Director
                </motion.h2>
                
                {/* Quote Block */}
                <motion.div 
                  className="bg-white/60 rounded-xl p-5 border-l-4 border-[#053F52] mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <Quote className="w-10 h-10 text-[#053F52]/30 mb-2" />
                  <p className="text-lg lg:text-xl text-[#053F52] font-serif italic leading-relaxed">
                    "Canada has shown us what is possible when students are trusted to think, research, and lead. Through years of living, studying, and placing students abroad, I have seen the transformative power of the right academic foundation."
                  </p>
                </motion.div>

                <motion.div 
                  className="relative w-full aspect-[3/4] overflow-hidden rounded-lg shadow-2xl"
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35)"
                  }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#053F52] to-[#053F52] flex items-center justify-center">
                      <Image 
src="/directors/Aaron (1)_converted.avif"
                        alt="Mr. Aaron Namanya - Managing Director" 
                        className="w-full h-full object-cover rounded-lg" 
                        width={400} 
                        height={600} 
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority 
                      />
                  </div>
                </motion.div>
              </motion.div>

              {/* Right Side - Director's Message Content */}
              <div className="order-2 lg:order-2">

                {/* Two Column Layout for Text */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[#053F52] text-base leading-relaxed">
                  {/* Left Column */}
                  <div className="space-y-5">
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                    >
                      At Queensgate International School, our vision is deeply personal to me. Having lived and studied in Canada since 2016, I have had the privilege of experiencing firsthand what makes that great nation's education system exceptional. Canada is not just a country of opportunity; it is a country that deliberately builds thinkers, innovators, and independent learners.
                    </motion.p>
                    
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                    >
                      Its classrooms emphasize inquiry over cramming, research over repetition, and application over memorization. Students are trained to ask why, to defend their ideas, to collaborate across cultures, and to take ownership of their academic journeys.
                    </motion.p>
                    
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                    >
                      Over the years, I have witnessed how the Ontario Secondary School Diploma (OSSD) framework shapes students into confident, self-driven individuals. It cultivates discipline, structured research skills, critical thinking, and the courage to explore ideas beyond textbooks.
                    </motion.p>

                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.5 }}
                    >
                      This conviction is strengthened by my own family experience. All my siblings have gone through the OSSD pathway. Beyond academic success, I have seen how the program shaped them early, instilling a strong culture of independent learning, personal research, responsibility, and intellectual curiosity.
                    </motion.p>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-5">
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                    >
                      In 2018, I established Inspire Education Consultants with a clear mission: to bridge African students to global education opportunities. Since then, we have successfully placed over 150 students into Canadian, U.S., and European universities.
                    </motion.p>
                    
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                    >
                      This experience benefits our students at QGIS immensely. We understand transcript structuring, course selection strategies, volunteer profiling, personal statement development, and how to build a competitive academic portfolio from as early as Grade 9.
                    </motion.p>

                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.5 }}
                    >
                      At the same time, I am encouraged to see that Uganda's UNEB system is gradually transitioning toward a more competency-based, learner-centered model. We recognize the strength and heritage of UNEB, and we are proud to supplement it with the globally recognized OSSD alternative. Our goal is not replacement — it is enhancement.
                    </motion.p>
                    
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.6 }}
                    >
                      At QGIS, we are committed to bringing that same spirit of academic independence, structured research culture, and global opportunity to our learners. Together, we are raising a generation that is confident, capable, and ready for the world.
                    </motion.p>
                  </div>
                </div>

                

                {/* Signature Section */}
                <motion.div 
                  className="mt-10 pt-6 border-t-2 border-[#053F52]/20"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="font-serif text-xl text-[#053F52] font-bold">Aaron Namanya</p>
                        <p className="text-[#053F52]/70 text-sm">Managing Director | Proprietor | Academic Oversight</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Our Mission Section with Core Values */}
        <div className="bg-[#EFBF04] relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-16 items-start lg:items-center">
              {/* Left Side - Text Content */}
              <div className="order-2 lg:order-1">
                <motion.h2 
                  className="text-3xl lg:text-4xl xl:text-5xl text-[#053F52] mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  Our Mission
                </motion.h2>
                <div className="space-y-4 sm:space-y-5 md:space-y-6 text-[#053F52]">
                  <motion.p 
                    className="text-base sm:text-lg md:text-xl leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    The mission of Queensgate International School is to promote excellence and integrity in learning while 
                    honoring and developing the intellectual, ethical, emotional, and physical capabilities of each individual.
                  </motion.p>

                  <motion.p 
                    className="text-base sm:text-lg md:text-xl leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    Our students will meet the challenges of today and the future, thus enriching the global community. 
                    Through our innovative platform, students learn core academic courses and develop essential skills such 
                    as critical thinking, collaboration, and effective communication.
                  </motion.p>

                  <motion.p 
                    className="text-base sm:text-lg md:text-xl leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                  >
                    Our mission is to create responsible, contributing citizens who feel deeply, think clearly, collaborate, 
                    and act ethically in our society. Queensgate offers programs and courses that are suitable for the next 
                    generation of leaders.
                  </motion.p>
                </div>
              </div>

              {/* Right Side - Core Values */}
              <div className="order-1 lg:order-2">
                <motion.h2 
                  className="text-3xl lg:text-4xl xl:text-5xl text-[#053F52] mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  Our Core Values
                </motion.h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {coreValues.map((value, index) => (
                    <motion.div
                      key={value.title}
                      className="bg-white rounded-xl p-5 shadow-lg hover:shadow-xl transition-all duration-300"
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <div className="w-12 h-12 bg-[#20cece] rounded-lg flex items-center justify-center mb-3">
                        <value.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg text-[#053F52] font-semibold mb-2">
                        {value.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {value.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Meet Our Directors Section */}
        <div className="bg-[#053F52] relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              <motion.div
                className="text-center mx-auto mb-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl lg:text-4xl xl:text-5xl text-white mb-4">
                  Meet Our Directors
                </h2>
                <p className="text-lg text-white max-w-3xl mx-auto">
                  Our leadership team consists of experienced professionals dedicated to guiding our school towards excellence
                </p>
              </motion.div>
              {directors.map((director, index) => (
                <motion.div
                  key={director.name}
                  className="bg-white justify-center rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 group"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="relative h-96 w-full overflow-hidden">
                    <Image
                      src={director.image}
                      alt={director.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      width={400} height={600} loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center">
                      <h3 className="text-xl font-bold text-white mb-1">
                        {director.name}
                      </h3>
                      <p className="text-sm text-white/80">
                        {director.title}
                      </p>
                    </div>
                  </div>
                  <div className="p-4 text-center bg-[#EFBF04]">
                    <p className="text-[#053F52] font-medium">{director.name}</p>
                    <p className="text-[#053F52]/70 text-sm">{director.title}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Principal's Message Section */}
        <div className="bg-[#EFBF04] relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-16 items-start lg:items-center">
              {/* Left Side - Image */}
              <motion.div 
                className="order-1 lg:order-1 w-full"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              >
                <motion.div 
                  className="relative w-full aspect-[3/4] overflow-hidden rounded-lg shadow-2xl"
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35)"
                  }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#053F52] to-[#053F52] flex items-center justify-center">
                    <Image src="/team/Principal_s Official Portrait.avif" alt="Principal Dr. Margaret Williams" className="w-full h-full object-cover rounded-lg" width={400} height={600} sizes="(max-width: 768px) 100vw, 50vw" priority />
                  </div>
                </motion.div>
              </motion.div>

              {/* Right Side - Text Content */}
              <div className="order-2 lg:order-2">
                <motion.h2 
                  className="text-3xl lg:text-4xl text-[#053F52] mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  A Message from Our Principal
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  At Queensgate International School, we excel in preparing students for universities and colleges 
                  worldwide through our comprehensive academic program. As a forward-thinking institution, we are 
                  dedicated to educating young minds with purpose and passion.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  Our staff ensures students are adaptable, resilient, and resourceful, contributing to our 100% 
                  post-secondary placement record. At Queensgate, students follow a rigorous curriculum while 
                  developing essential skills like independent thinking, collaboration, and effective communication.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  Our community provides a peaceful and conducive learning environment. The smaller school community 
                  allows our staff to know each student by name and offer personalized academic guidance.
                </motion.p>
                <motion.div 
                  className="mt-6 pt-6 border-t-2 border-[#053F52]/20"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  <p className="font-semibold text-[#053F52]">Ms. Ritah Kasembo</p>
                  <p className="text-sm text-[#053F52]/80">Principal, Queensgate International School</p>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Meet Our Educators Section */}
        <div className="bg-[#053F52] relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl lg:text-4xl xl:text-5xl text-white mb-4">
                Meet Our Educators
              </h2>
              <p className="text-lg text-white max-w-3xl mx-auto">
                Our faculty consists of highly experienced and passionate educators dedicated to 
                fostering academic excellence and personal growth
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {educators.map((teacher, index) => (
                <motion.div
                  key={teacher.name}
                  className="bg-white rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 group"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="relative h-96 w-full overflow-hidden">
                    <Image
                      src={teacher.image}
                      alt={teacher.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center">
                      <h3 className="text-xl font-bold text-white mb-1">
                        {teacher.name}
                      </h3>
                      <p className="text-sm text-white/80">
                        {teacher.title}
                      </p>
                    </div>
                  </div>
                  <div className="p-4 text-center bg-[#EFBF04]">
                    <div className="flex flex-wrap gap-2 justify-center">
                      {teacher.expertise.map((skill) => (
                        <span 
                          key={skill}
                          className="bg-white/30 text-[#053F52] px-3 py-1 rounded-full text-xs font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>



        {/* Student Testimonials Section */}
        <div 
          className="bg-white relative z-10"
          style={{ backgroundImage: "url('/dotted-map-2.png')", backgroundSize: '400px', backgroundPosition: 'center' }}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl lg:text-4xl xl:text-5xl text-[#053F52] mb-4">
                Student Success Stories
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Hear from our graduates about their Queensgate experience
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  className="bg-gradient-to-br from-[#20cece]/10 to-white border-2 border-[#20cece]/30 rounded-xl p-6 hover:border-[#053F52] hover:shadow-xl transition-all duration-300"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Quote className="w-10 h-10 text-[#053f52] mb-4" />
                  <p className="text-gray-700 mb-4 leading-relaxed italic">
                    "{testimonial.content}"
                  </p>
                  <div className="flex gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#EFBF04] text-[#EFBF04]" />
                    ))}
                  </div>
                  <div>
                    <p className="font-semibold text-[#053F52]">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Global Excellence Section */}
        <div className="bg-[#EFBF04] relative z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <motion.div
              className="max-w-4xl mx-auto text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl lg:text-4xl xl:text-5xl text-[#053F52] mb-6">
                Empowering Students Globally with Exceptional Education
              </h2>
              <div className="space-y-4 text-[#053F52] text-base sm:text-lg leading-relaxed">
                <p>
                  Queensgate International School is a leading institution dedicated to delivering world-class education 
                  to students across the globe. With over 20 years of educational leadership, we offer a robust and 
                  interactive learning platform that ensures a comprehensive and engaging educational experience.
                </p>
                <p>
                  Our experienced and qualified teachers provide individualized attention with a low student-teacher ratio, 
                  fostering academic excellence and personal growth. Students can join at any grade level, provided they 
                  have the necessary previous educational records.
                </p>
                <p>
                  At Queensgate, we are committed to preparing students for post-secondary success with a 100% placement 
                  record, emphasizing adaptability, resilience, and resourcefulness.
                </p>
              </div>

              <motion.div
                className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                {[
                  { icon: BookOpen, text: "Comprehensive Curriculum" },
                  { icon: Users, text: "Personalized Learning" },
                  { icon: Award, text: "100% University Placement" }
                ].map((feature, index) => (
                  <div 
                    key={index}
                    className="bg-white rounded-xl p-6 shadow-lg"
                  >
                    <feature.icon className="w-10 h-10 text-[#20cece] mx-auto mb-3" />
                    <p className="text-gray-700 font-medium">{feature.text}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>

        <div>
          {/* Call to Action */}
          <CTA/>
          <Accreditations/>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}