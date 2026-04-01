
"use client"

import Link from "next/link"
import { Menu, Search, User, LogOut, UserCheck, Settings, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { X } from "lucide-react"
import React, { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { useAuth } from '@/components/auth/auth-context'
import type { AuthSession } from "@supabase/supabase-js"



const navItems = [
  { title: "Home", href: "/" },
  {
    title: "About us",
    href: "/about",
    submenu: [
      { 
        title: "Our School", 
        href: "/about",
        description: "Learn about our history and mission",
        image: "/images/chatgptimagemar272c20252c12_25_02pm.png"
      },
      { 
        title: "Our Approach", 
        href: "/about/our-approach",
        description: "Discover our educational philosophy",
        image: "/images/img-2023-mature-students-home-banner-0257960.jpg"
      },
    ],
  },
  {
    title: "Admissions",
    href: "#",
    submenu: [
      { 
        title: "Requirements", 
        href: "/admissions/requirements",
        description: "Find out what you need to apply",
        image: "/images/design_portability_1__gfw34rh367u6_large_2x.avif"
      },
      { 
        title: "Admission Period", 
        href: "/admissions/periods",
        description: "View application deadlines",
        image: "/images/admission-period.jpg"
      },
      { 
        title: "How to Apply", 
        href: "/admissions/how-to-apply",
        description: "Step-by-step application guide",
        image: "/images/img-2023-mature-students-home-banner-0257960.jpg"
      },
    ],
  },

    {
    title: "Academics",
    href: "#",
    submenu: [
      { 
        title: "Course Outline", 
        href: "/academics/course-outline",
        description: "Find out about our courses",
        image: "/images/design_portability_1__gfw34rh367u6_large_2x.avif"
      },
      { 
        title: "English Program", 
        href: "/academics/english-program",
        description: "ESL and language support",
        image: "/images/admission-period.jpg"
      },
      { 
        title: "Graduation Requirements", 
        href: "/academics/graduation-requirements",
        description: "Graduation requirements and procedures",
        image: "/images/img-2023-mature-students-home-banner-0257960.jpg"
      },
      
    ],
  },
  {
    title: "Policies",
    href: "",
    submenu: [
      { 
        title: "Privacy Policy", 
        href: "/policies/privacy-policy",
        description: "How we protect your information",
        image: "/images/privacy.jpg"
      },
      { 
        title: "Academic Integrity", 
        href: "/policies/academic-integrity",
        description: "Our standards for honest work",
        image: "/images/academic-integrity.jpg"
      },
      { 
        title: "Attendance Policy", 
        href: "/policies/attendance-policy",
        description: "Attendance requirements and procedures",
        image: "/images/attendance.jpg"
      },
      { 
        title: "Acceptable Use Policy", 
        href: "/policies/acceptable-use-policy",
        description: "Technology and resource guidelines",
        image: "/images/acceptable-use.jpg"
      },
    ],
  },
  {
    title: "Info",
    href: "",
    submenu: [
      { 
        title: "News & Announcements", 
        href: "/more/news-announcement",
        description: "What is happening at QGIS",
        image: "/images/privacy.jpg"
      },
      { 
        title: "Downloads", 
        href: "/more/downloads",
        description: "important files to download",
        image: "/images/academic-integrity.jpg"
      },
      { 
        title: "Calendar", 
        href: "/more/calendar",
        description: "QGIS Calendar",
        image: "/images/attendance.jpg"
      },
      
    ]
  },
  { title: "Contact Us", href: "/contact" },
  { title: "FAQ", href: "/faq" },
   
]

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
    const { user, isSignedIn: ctxSignedIn, isAdmin, fullName, signOut } = useAuth()
    const isSignedIn = ctxSignedIn
    const [userEmail, setUserEmail] = useState("")

  useEffect(() => {
    setIsMounted(true)
    
    // sync with auth context - update when auth state changes
    if (ctxSignedIn && user?.email) {
      setUserEmail(user.email)
    } else {
      setUserEmail("")
    }
  }, [ctxSignedIn, user])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 50)
      }
      window.addEventListener('scroll', handleScroll)

      return () => {
        window.removeEventListener('scroll', handleScroll)
      }
    }
  }, [])

  // Keep --navbar-height CSS variable in sync with the actual rendered header height
  useEffect(() => {
    if (!isMounted) return
    const el = headerRef.current
    if (!el) return
    const update = () =>
      document.documentElement.style.setProperty('--navbar-height', `${el.offsetHeight}px`)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [isMounted])

  const router = useRouter()

  const handleSignOut = async () => {
    try {
      setUserEmail("")
      // Navigate to dedicated sign-out page which handles complete cleanup
      window.location.href = '/auth/signout'
    } catch (err) {
      console.error('Unexpected sign out error:', err)
      window.location.href = '/auth/signout'
    }
  }

  // Handle Apply Now click - redirect to login if not signed in
  const handleApplyClick = (e: React.MouseEvent) => {
    if (!isMounted || !isSignedIn) {
      e.preventDefault()
      window.location.href = "/login?redirect=/admissions/apply-now"
    }
  }

  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)
  const [isAdminState, setIsAdminState] = useState(false)
  useEffect(() => {
    setIsAdminState(!!isAdmin)
  }, [isAdmin])

  // Don't render until mounted to prevent hydration mismatch
  if (!isMounted) {
    return null
  }

  return (
    <motion.header
      ref={headerRef as React.RefObject<HTMLElement>}
      className="fixed left-0 right-0 z-50 w-full bg-transparent"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
        delay: 0.1
      }}
    >

      {/* Background Pattern */}
      <div
        className="absolute inset-0 bg-center bg-repeat"
        style={{ backgroundImage: "url('/images/pattern.webp')" }}
      />

      <motion.div
        className="absolute inset-0"
        style={{ backgroundColor: '#EFBF04', opacity: 0.88 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.88 }}
        transition={{ duration: 0.4 }}
      />

      <div className=" max-w-7xl mx-auto sm:px-4  relative">
        <div className="flex items-center lg:items-start justify-between w-full gap-2 sm:gap-4">
          {/* Left: Logo Section with animation */}
          <motion.div
            className={`flex-shrink-0 flex items-center gap-2 transition-all duration-300 ${
              isScrolled
                ? 'py-2'
                : 'py-2 sm:py-4 md:py-6'
            }`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.2
            }}
          >
            <Link href="/" className="flex items-center">
              <motion.div
                className={`relative transition-all duration-300 ${
                  isScrolled
                    ? 'w-11 h-11 sm:w-14 sm:h-16'
                    : 'w-11 h-11 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-40 lg:h-43'
                }`}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <Image
                  src="/images/zas5zz9dmzkxht9zd4vz.avif"
                  alt="Queensgate International School"
                  width={340}
                  height={256}
                  sizes="100px"
                  className="object-contain"
                  priority
                />
              </motion.div>
            </Link>

            {/* School Name Text - Always on mobile, only when scrolled on sm+ */}
            <motion.div
              className="flex lg:hidden flex-col"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-[#053F52] font-bold whitespace-nowrap leading-tight text-[13px] sm:text-[16px] font-serif">
                QUEENSGATE
              </span>
              <span className="text-[#053F52] whitespace-nowrap text-[9px] sm:text-[11px] font-serif">
                INTERNATIONAL SCHOOL
              </span>
            </motion.div>
            {isScrolled && (
              <motion.div
                className="hidden lg:flex flex-col"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <span className="text-[#053F52] font-bold whitespace-nowrap leading-tight text-[20px] font-serif">
                  QUEENSGATE
                </span>
                <span className="text-[#053F52] whitespace-nowrap text-[11px] font-serif">
                  INTERNATIONAL SCHOOL
                </span>
              </motion.div>
            )}
          </motion.div>

          {/* Mobile Menu Button with animation */}
          <motion.div 
            className="lg:hidden"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
              duration: 0.5, 
              ease: [0.22, 1, 0.36, 1],
              delay: 0.3
            }}
          >
            <Sheet>
              <SheetTrigger asChild>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button variant="ghost" size="icon" className="text-[#053F52] h-10 w-10">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </motion.div>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="bg-[#EFBF04] text-[#053F52] border-l-0 w-[85vw] sm:w-[350px] px-0 flex flex-col overflow-y-auto"
              >
                {/* Sheet Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-[#053F52]/15">
                  <div className="flex items-center gap-3">
                    <div className="relative w-9 h-9 flex-shrink-0">
                      <Image src="/images/zas5zz9dmzkxht9zd4vz.avif" alt="QGIS" width={36} height={36} className="object-contain w-full h-full" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-[#053F52] text-[13px] font-serif leading-tight">QUEENSGATE</span>
                      <span className="text-[#053F52] text-[9px] font-serif tracking-wide">INTERNATIONAL SCHOOL</span>
                    </div>
                  </div>
                  <SheetClose asChild>
                    <motion.div whileHover={{ rotate: 90 }} transition={{ duration: 0.2 }}>
                      <Button variant="ghost" size="icon" className="text-[#053F52] h-8 w-8 hover:bg-[#053F52]/10">
                        <X className="h-5 w-5" />
                        <span className="sr-only">Close menu</span>
                      </Button>
                    </motion.div>
                  </SheetClose>
                </div>

                {/* Apply Now CTA */}
                {!isAdminState && (
                  <div className="px-5 pt-5 pb-3">
                    <SheetClose asChild>
                      <Link
                        href={isSignedIn ? "/admissions/apply-now" : "/login?redirect=/admissions/apply-now"}
                        className="flex items-center justify-center gap-2 bg-[#053F52] text-white rounded-full px-6 py-3 font-semibold text-sm hover:bg-[#20cece] transition-colors w-full"
                      >
                        Apply Now
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </Link>
                    </SheetClose>
                  </div>
                )}

                {/* Nav Items */}
                <nav className="flex flex-col px-3 pb-4 flex-1">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.08 + index * 0.04, duration: 0.25 }}
                    >
                      {item.submenu ? (
                        <>
                          <button
                            onClick={() => setOpenSubmenu(openSubmenu === item.title ? null : item.title)}
                            className="flex items-center justify-between w-full py-3 px-3 text-[15px] font-semibold text-[#053F52] hover:bg-[#053F52]/10 rounded-lg transition-colors"
                          >
                            <span>{item.title}</span>
                            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${openSubmenu === item.title ? 'rotate-180' : ''}`} />
                          </button>
                          <AnimatePresence>
                            {openSubmenu === item.title && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="ml-3 mb-1 space-y-0.5 border-l-2 border-[#053F52]/25 pl-3">
                                  {item.submenu.map((subitem) => (
                                    <SheetClose asChild key={subitem.href}>
                                      <Link
                                        href={subitem.href}
                                        className="block py-2.5 px-3 text-sm text-[#053F52]/85 font-medium hover:text-[#053F52] hover:bg-[#053F52]/10 rounded-md transition-colors"
                                      >
                                        {subitem.title}
                                      </Link>
                                    </SheetClose>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </>
                      ) : (
                        <SheetClose asChild>
                          <Link
                            href={item.href}
                            className="block py-3 px-3 text-[15px] font-semibold text-[#053F52] hover:bg-[#053F52]/10 rounded-lg transition-colors"
                          >
                            {item.title}
                          </Link>
                        </SheetClose>
                      )}
                    </motion.div>
                  ))}
                </nav>

                {/* Mobile Auth Section */}
                <div className="px-5 pt-4 pb-6 border-t border-[#053F52]/15 mt-auto">
                  {isSignedIn ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-[#053F52]/70 px-1 mb-3">
                        <UserCheck className="h-3.5 w-3.5" />
                        <span className="truncate">{userEmail || "Signed in"}</span>
                      </div>
                      <Link
                        href={isAdminState ? '/dashboard/admin' : '/dashboard'}
                        className="w-full inline-flex items-center justify-center gap-2 bg-white/60 text-[#053F52] hover:bg-white font-medium py-2.5 px-4 rounded-lg transition-colors text-sm"
                      >
                        <Settings className="h-4 w-4" />
                        <span>{isAdminState ? 'Admin Portal' : 'Student Portal'}</span>
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="w-full inline-flex items-center justify-center gap-2 text-[#053F52] hover:bg-[#053F52]/10 font-medium py-2.5 px-4 rounded-lg transition-colors text-sm"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  ) : (
                    <SheetClose asChild>
                      <Link
                        href="/login"
                        className="w-full inline-flex items-center justify-center gap-2 bg-white/60 text-[#053F52] hover:bg-white font-medium py-2.5 px-4 rounded-lg transition-colors text-sm"
                      >
                        <User className="h-4 w-4" />
                        <span>Log In</span>
                      </Link>
                    </SheetClose>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </motion.div>

          {/* Desktop Navigation and Actions */}
          <div className={`hidden lg:flex items-center gap-2 xl:gap-2 ml-auto transition-all duration-300 ${
            isScrolled ? "py-3" : "py-6"
          }`}>
            {/* Desktop Navigation with simple dropdown */}
            <motion.nav 
              className="flex items-center space-x-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {navItems.map((item, index) =>
                item.submenu ? (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      delay: 0.4 + index * 0.05,
                      duration: 0.3
                    }}
                    className="relative group"
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {/* <Button 
                        variant="ghost" 
                        className={`text-[#053F52] hover:bg-[#053F52]/10 font-bold transition-all duration-300 ${
                          isScrolled ? "text-xs xl:text-sm px-2 xl:px-3 py-1.5 h-8" : "text-sm px-3 py-2"
                        }`}
                      >
                        {item.title}
                      </Button> */}
                   <Link
                      href={item.href}
                      className={`text-[#053F52] hover:border-b hover:border-[#20cece] hover:rounded-none font-bold transition-all duration-300 inline-block rounded-md ${
                        isScrolled ? "text-xs xl:text-sm px-2 xl:px-3 py-1.5 h-8 leading-8" : "text-sm px-3 h-9 leading-9"
                      }`}
                    >
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {item.title}
                      </motion.div>
                    </Link>
                    </motion.div>
                    
                    {/* Simple Dropdown Menu - isolation creates new stacking context with z-index */}
                    <div className="isolate absolute left-1/2 -translate-x-1/2 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[100]">
                      <div className="bg-white shadow-xl rounded-lg border border-gray-200 py-2 min-w-[220px] overflow-hidden">
                        {item.submenu.map((subitem) => (
                          <Link
                            key={subitem.href}
                            href={subitem.href}
                            className="block px-5 py-2.5 text-sm text-[#053F52] hover:bg-[#EFBF04]/20 hover:pl-6 transition-all duration-200 font-medium"
                          >
                            {subitem.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      delay: 0.4 + index * 0.05,
                      duration: 0.3
                    }}
                  >
                    <Link
                      href={item.href}
                      className={`text-[#053F52] hover:border-b hover:border-[#20cece] hover:rounded-none font-bold transition-all duration-300 inline-block rounded-md ${
                        isScrolled ? "text-xs xl:text-sm px-2 xl:px-3 py-1.5 h-8 leading-8" : "text-sm px-3 h-9 leading-9"
                      }`}
                    >
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {item.title}
                      </motion.div>
                    </Link>
                  </motion.div>
                ),
              )}
            </motion.nav>



            {/* Apply Now Button - redirects to login if not signed in - hide for admin users */}
            {!isAdminState && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  delay: 0.8,
                  duration: 0.4
                }}
              >
                <Link href={isSignedIn ? "/admissions/apply-now" : "#"}>
                  <motion.button 
                    onClick={handleApplyClick}
                    className={`flex items-center gap-2 bg-[#053F52] truncate text-white rounded-full border border-[#053F52] transition-all duration-300 hover:bg-[#20cece] hover:border-[#20cece] ${
                      isScrolled ? "px-5 py-2 text-xs xl:px-6 xl:py-2.5" : "px-6 py-2.5 text-sm xl:px-8 xl:py-3"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="font-medium">Apply Now</span>
                    <svg 
                      className={`transition-all duration-300 ${
                        isScrolled ? "h-3.5 w-3.5 xl:h-4 xl:w-4" : "h-4 w-4 xl:h-5 xl:w-5"
                      }`}
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </motion.button>
                </Link>
              </motion.div>
            )}

            {/* Auth Section - User Dropdown when signed in */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                delay: 0.7,
                duration: 0.3
              }}
              className="relative group"
            >
              {isSignedIn ? (
                // User dropdown when signed in - shows on hover
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center gap-2 text-[#053F52] font-medium transition-all duration-300 rounded-full hover:bg-[#053F52]/10 ${
                      isScrolled ? "text-xs xl:text-sm px-2 py-1.5 h-8" : "text-sm px-3 py-2 h-9"
                    }`}
                  >
                    <motion.div 
                      className={`flex items-center justify-center rounded-full bg-[#053F52] transition-all duration-300 ${
                        isScrolled ? "w-6 h-6 xl:w-7 xl:h-7" : "w-8 h-8 xl:w-9 xl:h-9"
                      }`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <UserCheck className={`text-white transition-all duration-300 ${
                        isScrolled ? "h-3 w-3 xl:h-4 xl:w-4" : "h-4 w-4 xl:h-5 xl:w-5"
                      }`} />
                    </motion.div>
                  <span className="hidden xl:inline truncate text-sm font-medium truncate max-w-[120px]"> {(userEmail ? userEmail.split('@')[0] : "User")} </span>
                  </motion.button>

                  {/* Hover Dropdown Menu */}
                  <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[10000]">
                    <div className="bg-white shadow-xl rounded-lg border border-gray-200 py-2 min-w-[220px] overflow-hidden">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-[#053f52] truncate">
                          {userEmail || "User"}
                        </p>
                        <p className="text-xs text-gray-500">Signed in</p>
                      </div>
                      <Link 
                        href={isAdminState ? '/dashboard/admin' : '/dashboard'} 
                        className="flex items-center gap-2 px-4 py-2 text-sm text-[#053f52] hover:bg-gray-50 transition-colors"
                      >
                        <Settings className="h-4 w-4" />
                        <span>{isAdminState ? 'Admin Portal' : 'Student Portal'}</span>
                      </Link>
                      <div className="border-t border-gray-100 my-1" />
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                // Log In button when signed out
                <Link
                  href="/login"
                  className={`text-[#053F52] font-medium flex items-center gap-2 transition-all duration-300 rounded-md ${
                    isScrolled ? "text-xs xl:text-sm px-2 py-1.5 h-8" : "text-sm px-3 py-2 h-9"
                  }`}
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2"
                  >
                    <motion.div 
                      className={`flex items-center justify-center rounded-full bg-[#053F52] transition-all duration-300 ${
                        isScrolled ? "w-6 h-6 xl:w-7 xl:h-7" : "w-8 h-8 xl:w-9 xl:h-9"
                      }`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <User className={`text-white transition-all duration-300 ${
                        isScrolled ? "h-3 w-3 xl:h-4 xl:w-4" : "h-4 w-4 xl:h-5 xl:w-5"
                      }`} />
                    </motion.div>
                    <span className="hidden xl:inline">Log In</span>
                  </motion.div>
                </Link>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.header>
  )
}

