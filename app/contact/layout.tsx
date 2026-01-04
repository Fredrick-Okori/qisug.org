import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact Queensgate International School | Get in Touch",
  description: "Contact Queensgate International School for admissions inquiries, academic information, and support. Reach us by email, phone, or visit our campus in Uganda.",
  keywords: [
    "contact Queensgate International School",
    "school contact information",
    "admissions inquiry",
    "school location Uganda",
    "Queensgate contact details",
    "international school contact",
    "school phone number",
    "school email address"
  ],
  openGraph: {
    title: "Contact Queensgate International School | Get in Touch",
    description: "Contact Queensgate International School for admissions inquiries, academic information, and support. Reach us by email, phone, or visit our campus in Uganda.",
    url: "https://www.qisug.org/contact",
    images: [
      {
        url: "/images/queen-27s-20gate-20web-20nw-06.jpeg",
        width: 1200,
        height: 630,
        alt: "Queensgate International School campus and contact information",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Queensgate International School | Get in Touch",
    description: "Contact Queensgate International School for admissions inquiries and support.",
    images: ["/images/queen-27s-20gate-20web-20nw-06.jpeg"],
  },
}

// Structured Data for SEO
const contactSchemaData = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": "Queensgate International School",
  "description": "Contact Queensgate International School for world-class international education in Uganda.",
  "url": "https://www.qisug.org/contact",
  "telephone": "+256-414-123-456",
  "email": "queensgateinternational@gmail.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Plot 38 Martyr's village, Intinda",
    "addressCountry": "UG"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+256-414-123-456",
    "contactType": "customer service",
    "availableLanguage": "English",
    "hoursAvailable": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "08:00",
      "closes": "17:00"
    }
  },
  "areaServed": "Worldwide",
  "type": "PrivateSchool"
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(contactSchemaData),
        }}
      />
      {children}
    </>
  )
}
