"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { BlueSiteHeader } from "@/components/blue-header"

const faqCategories = [
  { id: "admission", label: "Admission" },
  { id: "curriculum", label: "curriculum and courses" },
  { id: "online", label: "Online learning" },
  { id: "assessment", label: "Assessment and progress" },
]

const faqItems = {
  admission: [
    {
      question: "What is the admission process at Queensgate International School?",
      answer:
        "The admission process includes submitting an online application form, academic transcripts from previous schools, two letters of recommendation, a personal statement, and proof of English proficiency if applicable. Applications are reviewed on a rolling basis with priority deadlines throughout the year.",
    },
    {
      question: "What are the admission requirements?",
      answer:
        "Requirements include: completed application form, academic transcripts, two recommendation letters, personal statement or essay, proof of English proficiency (if applicable), copy of passport or birth certificate, and recent photograph. Specific grade requirements may apply based on the program.",
    },
    {
      question: "When are the application deadlines?",
      answer:
        "We have rolling admissions with priority deadlines. Early applications are recommended as spaces fill quickly. Priority deadlines are typically in December for the following academic year, with final deadlines in March.",
    },
    {
      question: "Is there an entrance assessment or interview?",
      answer:
        "Yes, qualified applicants are invited to complete entrance assessments and participate in an interview with our admissions team. This helps us understand each student's academic background and ensure the best fit for our programs.",
    },
  ],
  curriculum: [
    {
      question: "What curriculum does Queensgate International School follow?",
      answer:
        "We follow the Ontario Secondary School Diploma (OSSD) curriculum, which is recognized worldwide. This includes compulsory courses in English, Mathematics, Science, Canadian History, Canadian Geography, Arts, Health & Physical Education, French, and Civics & Careers, plus elective courses in various pathways.",
    },
    {
      question: "What academic pathways are available?",
      answer:
        "We offer four main pathways: Arts & Humanities (literature, social sciences), STEM (Science, Technology, Engineering, Mathematics), Business & Commerce (finance, entrepreneurship), and Health Sciences (preparation for healthcare careers).",
    },
    {
      question: "How many credits are needed for graduation?",
      answer:
        "Students need 30 credits total: 18 compulsory credits and 12 elective credits. Additionally, 40 hours of community service and passing the Ontario Secondary School Literacy Test (OSSLT) are required.",
    },
    {
      question: "Are the courses Ontario-certified?",
      answer:
        "Yes, all our courses are taught by certified Ontario teachers and follow the official Ontario curriculum. Graduates receive the Ontario Secondary School Diploma (OSSD), which is recognized by universities worldwide.",
    },
  ],
  online: [
    {
      question: "How does online learning work at Queensgate International School?",
      answer:
        "Our online learning platform provides 24/7 access to courses, interactive learning tools, virtual labs, discussion forums, and collaborative projects. Students receive personalized support from certified Ontario teachers through email, video calls, and our learning management system.",
    },
    {
      question: "What technology and resources are provided?",
      answer:
        "Students receive access to virtual labs, interactive whiteboards, video conferencing tools, online libraries, academic databases, and multimedia learning resources. Technical support is available to ensure smooth online learning experiences.",
    },
    {
      question: "How much interaction is there with teachers?",
      answer:
        "Teachers provide regular feedback on assignments, host virtual office hours, lead discussion forums, and offer one-on-one support sessions. Students can expect weekly interaction with their teachers and immediate responses to academic inquiries.",
    },
    {
      question: "Is the online program flexible?",
      answer:
        "Yes, our online program offers flexibility while maintaining academic rigor. Students can access materials 24/7 and progress at their own pace within established timelines. This accommodates different time zones and learning styles.",
    },
  ],
  assessment: [
    {
      question: "How are students assessed and graded?",
      answer:
        "Assessment includes regular quizzes, assignments, projects, presentations, and final exams. Grades are based on the Ontario rubric system and include detailed feedback. Progress reports are issued regularly to keep students and parents informed.",
    },
    {
      question: "What is the Ontario Secondary School Literacy Test (OSSLT)?",
      answer:
        "The OSSLT assesses reading and writing skills across all subject areas. It's typically taken in Grade 10 and is a requirement for the OSSD. We provide comprehensive preparation and support for this provincial assessment.",
    },
    {
      question: "How can students track their progress?",
      answer:
        "Students have access to real-time grade tracking through our learning management system. Regular progress reports, parent-teacher conferences, and academic advising sessions help students stay on track and address any challenges.",
    },
    {
      question: "What support is available for struggling students?",
      answer:
        "We offer academic advising, tutoring support, extended deadlines when appropriate, and personalized learning plans. Our certified teachers work closely with students to ensure they receive the support needed to succeed.",
    },
  ],
}

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState("admission")
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="min-h-screen flex flex-col">
      <BlueSiteHeader />

      <main className="flex-1 bg-white pt-24 lg:pt-32">
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="max-w-5xl mx-auto">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#053F52] my-12 text-center">
              Frequently Asked questions
            </h1>

            {/* Search Bar */}
            <div className="mb-8 max-w-md ml-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Looking for something?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white border-[#053F52] focus:ring-[#053F52]"
                />
              </div>
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 mb-8 border-b-2 border-[#ffd500] pb-4">
              {faqCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-6 py-2 rounded-full font-medium transition-all ${
                    activeCategory === category.id
                      ? "bg-[#ffd500] text-[#053F52]"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>

            {/* FAQ Accordion */}
            <Accordion type="single" collapsible className="space-y-4">
              {faqItems[activeCategory as keyof typeof faqItems]?.map((item, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border border-gray-200 rounded-lg px-6 data-[state=open]:border-[#053F52]"
                >
                  <AccordionTrigger className="text-left text-[#053F52] font-semibold hover:no-underline py-6">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-700 pb-6">{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
