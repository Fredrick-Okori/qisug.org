import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Academics",
  description: "Discover Queensgate International School's comprehensive academic programs. Explore our course outlines, English language programs, and graduation requirements designed for student success.",
  keywords: ["academics", "courses", "curriculum", "English program", "graduation requirements", "Queensgate International School"],
}

export default function AcademicsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

