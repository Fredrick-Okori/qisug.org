import type { Metadata } from "next"
import AboutContent from "@/components/about-content"

export const metadata: Metadata = {
  title: "About Queensgate International School | Our Mission & Values",
  description: "Learn about Queensgate International School's mission to provide world-class education. Discover our core values, experienced faculty, and commitment to academic excellence and global citizenship.",
  keywords: [
    "about Queensgate International School",
    "school mission",
    "educational values",
    "international school faculty",
    "academic excellence",
    "global citizenship education",
    "student success stories"
  ],
  openGraph: {
    title: "About Queensgate International School | Our Mission & Values",
    description: "Learn about Queensgate International School's mission to provide world-class education. Discover our core values, experienced faculty, and commitment to academic excellence and global citizenship.",
    url: "https://www.qisug.org/about",
    images: [
      {
        url: "/images/queen-27s-20gate-20web-20nw-02.jpeg",
        width: 1200,
        height: 630,
        alt: "Queensgate International School students learning together",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Queensgate International School | Our Mission & Values",
    description: "Learn about Queensgate International School's mission to provide world-class education.",
    images: ["/images/queen-27s-20gate-20web-20nw-02.jpeg"],
  },
}

export default function AboutPage() {
  return <AboutContent />
}

