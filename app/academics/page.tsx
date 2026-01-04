import type { Metadata } from "next"
import AcademicsContent from "@/components/academics-content"

export const metadata: Metadata = {
  title: "Academics | Queensgate International School Curriculum & Programs",
  description: "Explore Queensgate International School's comprehensive academic programs including OSSD curriculum, compulsory courses, academic pathways, and Ontario Secondary School Diploma requirements.",
  keywords: [
    "Queensgate International School academics",
    "OSSD curriculum",
    "Ontario Secondary School Diploma",
    "academic programs",
    "compulsory courses",
    "academic pathways",
    "STEM education",
    "international curriculum",
    "high school diploma"
  ],
  openGraph: {
    title: "Academics | Queensgate International School Curriculum & Programs",
    description: "Explore Queensgate International School's comprehensive academic programs including OSSD curriculum, compulsory courses, academic pathways, and Ontario Secondary School Diploma requirements.",
    url: "https://www.qisug.org/academics",
    images: [
      {
        url: "/images/design_portability_1__gfw34rh367u6_large_2x.jpg",
        width: 1200,
        height: 630,
        alt: "Queensgate International School academic programs and curriculum",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Academics | Queensgate International School Curriculum & Programs",
    description: "Explore Queensgate International School's comprehensive academic programs and OSSD curriculum.",
    images: ["/images/design_portability_1__gfw34rh367u6_large_2x.jpg"],
  },
}

export default function AcademicsPage() {
  return <AcademicsContent />
}

