"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Search, User, X, LogOut, UserCheck, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
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
        image: "/images/02a-header-How-To-Apply-Header-PhotoV3.jpg"
      },
      { 
        title: "Our Approach", 
        href: "/about/our-approach",
        description: "Discover our educational philosophy",
        image: "/images/courses-800x800.jpg"
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
        image: "/images/Laptop and Stationery.avif"
      },
      { 
        title: "Admission Period", 
        href: "/admissions/periods",
        description: "View application deadlines",
        image: "/images/chatgptimagemar272c20252c12_25_02pm.png"
      },
      { 
        title: "How to Apply", 
        href: "/admissions/how-to-apply",
        description: "Step-by-step application guide",
        image: "/images/blue_sholastic_pattern.webp"
      },
      { 
        title: "Apply Now", 
        href: "/admissions/apply-now",
        description: "Start your application today",
        image: "/images/student_grade.avif"
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
    href: "#",
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
        description: "What is happening at Qisu",
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
        description: "Qisu Calendar",
        image: "/images/attendance.jpg"
      },
      
    ]
  },
  { title: "Contact Us", href: "/contact" },
  { title: "FAQ", href: "/faq" },

]

export function BlueSiteHeader() {
  const pathname = usePathname()
  const [isMounted, setIsMounted] = useState(false)
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [userEmail, setUserEmail] = useState("")
  const [supabase, setSupabase] = useState<ReturnType<typeof createClient> | null>(null)

  // Check if a nav item is active based on current pathname
  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(href)
  }

  useEffect(() => {
    setIsMounted(true)
    
    // Initialize Supabase client lazily on client side
    const supabaseClient = createClient()
    setSupabase(supabaseClient)
    
    // If Supabase is not configured, skip auth checks
    if (!supabaseClient) {
      return
    }
    
    // Check auth state
    const checkAuth = async () => {
      const { data: { session } } = await supabaseClient.auth.getSession()
      setIsSignedIn(!!session)
      if (session?.user?.email) {
        setUserEmail(session.user.email)
      }
    }
    
    checkAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((_event: string, session: AuthSession | null) => {
      setIsSignedIn(!!session)
      if (session?.user?.email) {
        setUserEmail(session.user.email)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleSignOut = async () => {
    try {
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('Sign out error:', error)
        // Still redirect even if there's an error - the session might be invalid
      }
      
      // Clear local auth state
      setIsSignedIn(false)
      setUserEmail("")
      
      // Force a full page redirect to home
      // This ensures the user is completely logged out and taken to the home page
      window.location.href = '/'
    } catch (err) {
      console.error('Unexpected sign out error:', err)
      // Fallback: clear state and redirect anyway
      setIsSignedIn(false)
      setUserEmail("")
      window.location.href = '/'
    }
  }

  if (!isMounted) {
    return null
  }

  return (
    <motion.header 
      className="fixed left-0 right-0 z-[9999] w-full bg-transparent"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ 
        duration: 0.6, 
        ease: [0.22, 1, 0.36, 1],
        delay: 0.1
      }}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-center bg-repeat"
        style={{ backgroundImage: "url('/images/blue_sholastic_pattern.webp')" }}
      />

      <motion.div
        className="absolute inset-0"
        style={{ backgroundColor: '#053F52', opacity: 0.90 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.90 }}
        transition={{ duration: 0.4 }}
      />

      <div className="container max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 relative z-10 py-4">
        <div className="flex items-start justify-between w-full gap-2 sm:gap-4">
          {/* Left: Logo Section with animation */}
          <motion.div 
            className="flex-shrink-0 flex items-center gap-2"
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
                className="relative w-12 h-12 sm:w-14 sm:h-16"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <Image
                  src="/images/logo_white.png"
                  alt="Queensgate International School"
                  width={240}
                  height={256}
                  className="object-contain"
                  priority
                />
              </motion.div>
            </Link>

            {/* School Name Text - Always Visible */}
            <div className="hidden sm:flex flex-col">
              <span className="text-white font-bold whitespace-nowrap leading-tight text-[20px] font-serif">
                QUEENSGATE
              </span>
              <span className="text-white whitespace-nowrap text-[11px] font-serif">
                INTERNATIONAL SCHOOL
              </span>
            </div>
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
                  <Button variant="ghost" size="icon" className="text-white h-10 w-10">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </motion.div>
              </SheetTrigger>
              <SheetContent 
                side="right" 
                className="bg-[#053f52] text-white border-l-0 w-[85vw] sm:w-[350px] px-4 sm:px-6"
              >
                <motion.div 
                  className="flex items-center justify-between mb-6"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <h2 className="text-xl font-bold text-white">Menu</h2>
                  <SheetClose asChild>
                    <motion.div whileHover={{ rotate: 90 }} transition={{ duration: 0.2 }}>
                      <Button variant="ghost" size="icon" className="text-white h-8 w-8">
                        <X className="h-5 w-5" />
                        <span className="sr-only">Close menu</span>
                      </Button>
                    </motion.div>
                  </SheetClose>
                </motion.div>
                <nav className="flex flex-col space-y-1">
                  {navItems.map((item, index) => (
                    <motion.div 
                      key={item.title}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ 
                        delay: 0.1 + index * 0.05,
                        duration: 0.3
                      }}
                    >
                      <SheetClose asChild>
                        <Link 
                          href={item.href} 
                          className="block py-2.5 px-3 text-base hover:bg-white/10 rounded-md transition-colors"
                        >
                          {item.title}
                        </Link>
                      </SheetClose>
                      {item.submenu && (
                        <div className="ml-4 mt-1 mb-2 space-y-1">
                          {item.submenu.map((subitem, subIndex) => (
                            <motion.div
                              key={subitem.href}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ 
                                delay: 0.2 + index * 0.05 + subIndex * 0.03,
                                duration: 0.2
                              }}
                            >
                              <SheetClose asChild>
                                <Link 
                                  href={subitem.href} 
                                  className="block py-1.5 px-3 text-sm text-white/80 hover:bg-white/10 rounded-md transition-colors"
                                >
                                  {subitem.title}
                                </Link>
                              </SheetClose>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </nav>
                
                {/* Mobile Login Button */}
                <motion.div 
                  className="mt-6 pt-6 border-t border-white/20"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  {isSignedIn ? (
                    // Show user info and sign out when signed in
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-white">
                        <UserCheck className="h-4 w-4" />
                        <span className="truncate">{userEmail || "Signed in"}</span>
                      </div>
                      <button
                        onClick={handleSignOut}
                        className="w-full inline-flex items-center justify-center gap-2 text-white border-white hover:bg-white hover:text-[#2a3dc8ff] font-medium py-2 px-3 rounded-md transition-colors"
                      >
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex items-center gap-2"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Sign Out</span>
                        </motion.div>
                      </button>
                    </div>
                  ) : (
                    <SheetClose asChild>
                      <Link
                        href="/login"
                        className="w-full inline-flex items-center justify-center gap-2 text-white border-white hover:bg-white hover:text-[#2a3dc8ff] font-medium py-2 px-3 rounded-md"
                      >
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex items-center gap-2"
                        >
                          <User className="h-5 w-5" />
                          <span>Log In</span>
                        </motion.div>
                      </Link>
                    </SheetClose>
                  )}
                </motion.div>
              </SheetContent>
            </Sheet>
          </motion.div>

          {/* Desktop Navigation and Actions */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2 ml-auto">
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
                      <Link
                        href={item.href}
                        className={`text-white font-bold transition-all duration-300 inline-block text-sm px-2 py-2 ${
                          isActive(item.href) ? "border-b-2 border-[#20cece]" : "hover:border-b hover:border-[#20cece] hover:rounded-none"
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
                    
                    {/* Simple Dropdown Menu */}
                    <div className="isolate absolute left-1/2 -translate-x-1/2 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="bg-white shadow-xl rounded-lg border border-gray-200 py-2 min-w-[220px] overflow-hidden">
                        {item.submenu.map((subitem) => (
                          <Link
                            key={subitem.href}
                            href={subitem.href}
                            className="block px-5 py-2.5 text-sm text-[#053f52] hover:bg-white/20 hover:pl-6 transition-all duration-200 font-medium"
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
                      className={`text-white font-bold transition-all duration-300 inline-block rounded-md text-sm px-3 py-2 ${
                        isActive(item.href) ? "border-b-2 border-[#20cece]" : "hover:border-b hover:border-[#20cece] hover:rounded-none"
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

            {/* User Dropdown / Log In Button with animation */}
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
                    className="flex items-center gap-2 text-white hover:bg-white/10 transition-all duration-300 rounded-full px-2 py-1"
                  >
                    <motion.div 
                      className="flex items-center justify-center rounded-full bg-[#20cece] w-8 h-8 xl:w-9 xl:h-9"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <UserCheck className="h-4 w-4 xl:h-5 xl:w-5 text-[#053f52]" />
                    </motion.div>
                    <span className="hidden xl:inline text-sm font-medium truncate max-w-[120px]">
                      {userEmail?.split('@')[0] || "User"}
                    </span>
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
                        href="/profile" 
                        className="flex items-center gap-2 px-4 py-2 text-sm text-[#053f52] hover:bg-gray-50 transition-colors"
                      >
                        <Settings className="h-4 w-4" />
                        <span>Settings</span>
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
                  className="text-white hover:bg-white/10 font-medium flex items-center gap-2 transition-all duration-300 rounded-md text-sm px-3 py-2"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2"
                  >
                    <motion.div 
                      className="flex items-center justify-center rounded-full bg-[#20cece] w-8 h-8 xl:w-9 xl:h-9"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <User className="h-4 w-4 xl:h-5 xl:w-5 text-[#053f52]" />
                    </motion.div>
                    <span className="hidden xl:inline">Log In</span>
                  </motion.div>
                </Link>
              )}
            </motion.div>

            {/* Apply Now Button with animation */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                delay: 0.8,
                duration: 0.4
              }}
            >
              <Link href="/admissions/apply-now">
                <motion.button 
                  className="flex items-center gap-2 bg-[#20cece] text-[#053f52] rounded-full border border-[#20cece] transition-all duration-300 hover:bg-white hover:border-white px-6 py-2.5 text-sm xl:px-8 xl:py-3"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="font-medium">Apply Now</span>
                  <svg 
                    className="h-4 w-4 xl:h-5 xl:w-5"
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.header>
  )
}

