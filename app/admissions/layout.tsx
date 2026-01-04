import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admissions | Queensgate International School",
  description: "Join Queensgate International School. Learn about our admissions process, requirements, application periods, and how to apply for world-class international education.",
  keywords: [
    "school admissions",
    "Queensgate International School admissions",
    "how to apply",
    "admission requirements",
    "application process",
    "international school enrollment",
    "student admissions"
  ],
  openGraph: {
    title: "Admissions | Queensgate International School",
    description: "Join Queensgate International School. Learn about our admissions process, requirements, application periods, and how to apply for world-class international education.",
    url: "https://www.qisug.org/admissions",
    images: [
      {
        url: "/images/admissions-hero.jpg",
        width: 1200,
        height: 630,
        alt: "Queensgate International School admissions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Admissions | Queensgate International School",
    description: "Join Queensgate International School. Learn about our admissions process and how to apply.",
    images: ["/images/admissions-hero.jpg"],
  },
}

// Structured Data for SEO
const admissionsSchemaData = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": "Queensgate International School",
  "description": "Queensgate International School offers comprehensive admissions for students worldwide seeking international education excellence.",
  "url": "https://www.qisug.org/admissions",
  "telephone": "+1-234-567-8900",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "US"
  },
  "areaServed": "Worldwide",
  "type": "PrivateSchool",
  "applicationProcess": "Online application with document submission",
  "applicationDeadline": "Rolling admissions with priority deadlines",
  "educationalCredentialAwarded": "High School Diploma, International Baccalaureate"
}

export default function AdmissionsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(admissionsSchemaData),
        }}
      />
      {children}
    </>
  )
}
