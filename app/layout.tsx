import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono, Spectral, Montserrat } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import PageTransition from "@/components/page-transition"
import { AuthProvider } from '@/components/auth/auth-context'
import { Toaster } from '@/components/ui/toaster'


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
  metadataBase: new URL("https://www.qgis.ac.ug"),
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
    url: "https://www.qgis.ac.ug",
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
        url: "/favicon.ico",
        sizes: "48x48",
        type: "image/x-icon",
      },
      {
        url: "/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/icon.png",
        sizes: "180x180",
        type: "image/png",
      },
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
        sizes: "32x32",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    other: [
      {
        rel: "apple-touch-icon-precomposed",
        url: "/apple-touch-icon.png",
      },
      {
        rel: "manifest",
        url: "/site.webmanifest",
      },
    ],
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
      <head>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon.png" />
        <link rel="apple-touch-icon-precomposed" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#053F52" />
        <meta name="google-site-verification" content="UqDDsrSU8IL7pdXJRvNnXM2cyUdX-J0s21Iu59oWsqc" />
        <link rel="icon" href="/favicon.ico?v=2" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png?v=2" />
      </head>
      <body className={`${montserrat.variable} ${spectral.variable} font-sans antialiased`}>
        <AuthProvider>
          <PageTransition>
            {children}
          </PageTransition>
        </AuthProvider>
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}