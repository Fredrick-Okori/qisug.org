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
      question: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed",
      answer:
        "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl",
    },
    {
      question: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed",
      answer:
        "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.",
    },
    {
      question: "Lorem ipsum dolor sit amet, con-",
      answer:
        "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.",
    },
    {
      question: "Lorem ipsum dolor sit amet, consectetuer adipisc-",
      answer:
        "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.",
    },
  ],
  curriculum: [
    {
      question: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit",
      answer:
        "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.",
    },
  ],
  online: [
    {
      question: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit",
      answer:
        "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.",
    },
  ],
  assessment: [
    {
      question: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit",
      answer:
        "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.",
    },
  ],
}

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState("admission")
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="min-h-screen flex flex-col">
      <BlueSiteHeader />

      <main className="flex-1 bg-white">
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="max-w-5xl mx-auto">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#3d4fd4] mb-12 text-center">
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
                  className="pl-10 bg-white border-[#3d4fd4] focus:ring-[#3d4fd4]"
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
                      ? "bg-[#ffd500] text-[#3d4fd4]"
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
                  className="border border-gray-200 rounded-lg px-6 data-[state=open]:border-[#3d4fd4]"
                >
                  <AccordionTrigger className="text-left text-[#3d4fd4] font-semibold hover:no-underline py-6">
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
