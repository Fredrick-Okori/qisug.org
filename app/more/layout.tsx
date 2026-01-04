import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Resources & Information | Queensgate International School",
  description: "Access important resources at Queensgate International School including news and announcements, downloadable files, academic calendar, and school information.",
  keywords: [
    "school resources",
    "Queensgate International School news",
    "school announcements",
    "downloadable files",
    "academic calendar",
    "school events",
    "student resources",
    "educational materials"
  ],
  openGraph: {
    title: "Resources & Information | Queensgate International School",
    description: "Access important resources at Queensgate International School including news and announcements, downloadable files, academic calendar, and school information.",
    url: "https://www.qisug.org/more",
    images: [
      {
        url: "/images/queen-27s-20gate-20web-20nw-02.jpeg",
        width: 1200,
        height: 630,
        alt: "Queensgate International School resources and information",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Resources & Information | Queensgate International School",
    description: "Access important resources at Queensgate International School including news and announcements, downloadable files, academic calendar, and school information.",
    images: ["/images/queen-27s-20gate-20web-20nw-02.jpeg"],
  },
}

// Structured Data for SEO
const moreSchemaData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Resources & Information",
  "description": "Access important resources at Queensgate International School including news and announcements, downloadable files, academic calendar, and school information.",
  "url": "https://www.qisug.org/more",
  "isPartOf": {
    "@type": "WebSite",
    "name": "Queensgate International School",
    "url": "https://www.qisug.org"
  },
  "about": {
    "@type": "EducationalOrganization",
    "name": "Queensgate International School",
    "url": "https://www.qisug.org"
  },
  "mainEntity": {
    "@type": "ItemList",
    "name": "School Resources",
    "description": "Collection of important resources and information for Queensgate International School community",
    "numberOfItems": 3,
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "News & Announcements",
        "description": "Stay updated with the latest news and announcements from Queensgate International School"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Downloads",
        "description": "Access downloadable files, forms, and educational materials"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Academic Calendar",
        "description": "View important dates, holidays, and academic events"
      }
    ]
  }
}

export default function MoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

