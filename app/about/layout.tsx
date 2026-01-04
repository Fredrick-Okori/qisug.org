import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Queensgate International School, our mission, core values, and dedicated faculty. With over 20 years of excellence, we prepare students for success worldwide.",
  keywords: ["about Queensgate International School", "mission", "values", "faculty", "educators", "principal", "private school"],
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

