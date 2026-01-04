import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono, Spectral, Montserrat } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import PageTransition from "@/components/page-transition"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })
const spectral = Spectral({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-spectral",
})
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://www.qisug.org"),
  title: {
    default: "Queensgate International School | Excellence in Education",
    template: "%s | Queensgate International School",
  },
  description: "Queensgate International School provides world-class education for students worldwide. Discover our innovative curriculum, dedicated faculty, and nurturing learning environment.",
  keywords: [
    "Queensgate International School",
    "international school",
    "private school",
    "education",
    "academic excellence",
    "students",
    "learning",
    "curriculum",
    "admissions",
    "school",
  ],
  authors: [{ name: "Queensgate International School" }],
  creator: "Queensgate International School",
  publisher: "Queensgate International School",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.qisug.org",
    siteName: "Queensgate International School",
    title: "Queensgate International School | Excellence in Education",
    description: "Queensgate International School provides world-class education for students worldwide. Discover our innovative curriculum and nurturing learning environment.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Queensgate International School",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Queensgate International School | Excellence in Education",
    description: "Queensgate International School provides world-class education for students worldwide.",
    images: ["/images/og-image.jpg"],
    creator: "@qisug",
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.png",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
    shortcut: "/favicon.ico",
  },
  manifest: "/site.webmanifest",
  verification: {
    google: "google-site-verification-code",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} ${spectral.variable} font-sans antialiased`}>
        <PageTransition>
          {children}
        </PageTransition>
        <Analytics />
      </body>
    </html>
  )
}
