import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "FAQ | Queensgate International School",
  description: "Find answers to frequently asked questions about Queensgate International School admissions, academics, policies, and student life.",
  keywords: [
    "school FAQ",
    "Queensgate International School FAQ",
    "frequently asked questions",
    "admissions questions",
    "school policies FAQ",
    "student questions",
    "international school FAQ"
  ],
  openGraph: {
    title: "FAQ | Queensgate International School",
    description: "Find answers to frequently asked questions about Queensgate International School admissions, academics, policies, and student life.",
    url: "https://www.qisug.org/faq",
    images: [
      {
        url: "/images/faq-hero.jpg",
        width: 1200,
        height: 630,
        alt: "Queensgate International School frequently asked questions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FAQ | Queensgate International School",
    description: "Find answers to frequently asked questions about Queensgate International School.",
    images: ["/images/faq-hero.jpg"],
  },
}

// FAQ Schema for SEO
const faqSchemaData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is the student-teacher ratio at Queensgate International School?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Queensgate International School maintains a low student-teacher ratio of 5:1, ensuring personalized attention and support for each student."
      }
    },
    {
      "@type": "Question",
      "name": "What curriculum does Queensgate International School follow?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We offer a comprehensive international curriculum including International Baccalaureate programs and specialized English language courses."
      }
    },
    {
      "@type": "Question",
      "name": "What is the admission process?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Our admission process includes online application submission, document review, assessment, and interview. We offer rolling admissions with priority deadlines."
      }
    },
    {
      "@type": "Question",
      "name": "Does Queensgate International School have a 100% university placement rate?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, Queensgate International School has achieved a 100% university placement rate, preparing students for success in higher education worldwide."
      }
    }
  ]
}

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchemaData),
        }}
      />
      {children}
    </>
  )
}
