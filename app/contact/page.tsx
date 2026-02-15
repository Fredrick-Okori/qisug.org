import type { Metadata } from "next"
import ContactForm from "@/components/contact-form"

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
    url: "https://www.qgis.ac.ug/contact",
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

export default function ContactPage() {
  return <ContactForm />
}

