import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Policies | Queensgate International School",
  description: "Review Queensgate International School's policies including privacy policy, attendance policy, academic integrity, and acceptable use policy.",
  keywords: [
    "school policies",
    "Queensgate International School policies",
    "privacy policy",
    "attendance policy",
    "academic integrity policy",
    "acceptable use policy",
    "school rules and regulations"
  ],
  openGraph: {
    title: "Policies | Queensgate International School",
    description: "Review Queensgate International School's policies including privacy policy, attendance policy, academic integrity, and acceptable use policy.",
    url: "https://www.qisug.org/policies",
    images: [
      {
        url: "/images/policies-hero.jpg",
        width: 1200,
        height: 630,
        alt: "Queensgate International School policies and regulations",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Policies | Queensgate International School",
    description: "Review Queensgate International School's policies and regulations.",
    images: ["/images/policies-hero.jpg"],
  },
}

// Structured Data for SEO
const policiesSchemaData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "School Policies",
  "description": "Queensgate International School policies and regulations for students, parents, and staff.",
  "url": "https://www.qisug.org/policies",
  "mainEntity": {
    "@type": "ItemList",
    "name": "School Policies",
    "description": "List of important policies at Queensgate International School",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Privacy Policy",
        "description": "How we protect and handle personal information"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Attendance Policy",
        "description": "School attendance requirements and procedures"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Academic Integrity Policy",
        "description": "Standards for academic honesty and integrity"
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": "Acceptable Use Policy",
        "description": "Guidelines for technology and internet usage"
      }
    ]
  }
}

export default function PoliciesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(policiesSchemaData),
        }}
      />
      {children}
    </>
  )
}
