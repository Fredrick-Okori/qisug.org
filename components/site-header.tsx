"use client"

import Link from "next/link"
import { Menu, Search, User, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

const navItems = [
  { title: "Home", href: "/" },
  {
    title: "About us",
    href: "/about",
    submenu: [
      { title: "Our School", href: "/about#school" },
      { title: "Our Approach", href: "/about#approach" },
    ],
  },
  {
    title: "Admissions",
    href: "/admissions",
    submenu: [
      { title: "Requirements", href: "/admissions#requirements" },
      { title: "Admission Period", href: "/admissions#period" },
      { title: "How to Apply", href: "/admissions#how-to-apply" },
      { title: "Apply Now", href: "/admissions#apply" },
    ],
  },
  { title: "Academics", href: "/academics" },
  {
    title: "Policies",
    href: "/policies",
    submenu: [
      { title: "Lorem ipsum dolor sit", href: "/policies#policy1" },
      { title: "Lorem ipsum dolor sit", href: "/policies#policy2" },
      { title: "Lorem ipsum dolor sit", href: "/policies#policy3" },
      { title: "Lorem ipsum dolor sit", href: "/policies#policy4" },
    ],
  },
  { title: "Contact Us", href: "/contact" },
  { title: "FAQ", href: "/faq" },
]

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setIsScrolled(scrollPosition > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.header 
      className="fixed left-0 right-0 z-50 w-full bg-transparent"
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
        style={{ backgroundImage: "url('/images/pattern.webp')" }}
      />

      <motion.div
        className="absolute inset-0"
        style={{ backgroundColor: '#EFBF04', opacity: 0.88 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.88 }}
        transition={{ duration: 0.4 }}
      />

      <div className="container max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 relative">
        <div className="flex items-start justify-between w-full gap-2 sm:gap-4">
          {/* Left: Logo Section with animation */}
          <motion.div 
            className={`flex-shrink-0 transition-all duration-300 ${
              isScrolled 
                ? 'py-2' 
                : 'py-3 sm:py-4 md:py-6'
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
                    ? 'w-12 h-12 sm:w-14 sm:h-14' 
                    : 'w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-40 lg:h-70'
                }`}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <Image
                  src="/images/logo_blue.webp"
                  alt="Queensgate International School"
                  width={340}
                  height={256}
                  className="object-contain"
                  priority
                />
              </motion.div>
            </Link>
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
                  <Button variant="ghost" size="icon" className="text-[#3d4fd4] h-10 w-10">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </motion.div>
              </SheetTrigger>
              <SheetContent 
                side="right" 
                className="bg-[#ffd500] text-[#3d4fd4] border-l-0 w-[85vw] sm:w-[350px] px-4 sm:px-6"
              >
                <motion.div 
                  className="flex items-center justify-between mb-6"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <h2 className="text-xl font-bold text-[#3d4fd4]">Menu</h2>
                  <SheetClose asChild>
                    <motion.div whileHover={{ rotate: 90 }} transition={{ duration: 0.2 }}>
                      <Button variant="ghost" size="icon" className="text-[#3d4fd4] h-8 w-8">
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
                          className="block py-2.5 px-3 text-base font-semibold hover:bg-[#3d4fd4]/10 rounded-md transition-colors"
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
                                  className="block py-1.5 px-3 text-sm text-[#3d4fd4]/80 hover:bg-[#3d4fd4]/10 rounded-md transition-colors"
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
                  className="mt-6 pt-6 border-t border-[#3d4fd4]/20"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <SheetClose asChild>
                    <Link href="/login" className="block">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          variant="outline"
                          className="w-full text-[#3d4fd4] border-[#3d4fd4] hover:bg-[#3d4fd4] hover:text-white font-medium flex items-center justify-center gap-2"
                        >
                          <User className="h-5 w-5" />
                          <span>Log In</span>
                        </Button>
                      </motion.div>
                    </Link>
                  </SheetClose>
                </motion.div>
              </SheetContent>
            </Sheet>
          </motion.div>

          {/* Desktop Navigation and Actions */}
          <div className={`hidden lg:flex items-center gap-2 xl:gap-3 ml-auto transition-all duration-300 ${
            isScrolled ? "py-3" : "py-6"
          }`}>
            {/* Desktop Navigation with stagger animation */}
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
                  >
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button 
                            variant="ghost" 
                            className={`text-[#3d4fd4] hover:bg-[#3d4fd4]/10 font-bold transition-all duration-300 ${
                              isScrolled ? "text-xs xl:text-sm px-2 xl:px-3 py-1.5 h-8" : "text-sm px-3 py-2 h-9"
                            }`}
                          >
                            {item.title}
                          </Button>
                        </motion.div>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-white border-[#3d4fd4]/20">
                        {item.submenu.map((subitem) => (
                          <DropdownMenuItem key={subitem.href} asChild>
                            <Link
                              href={subitem.href}
                              className="text-[#3d4fd4] font-bold hover:bg-[#3d4fd4] hover:text-white cursor-pointer"
                            >
                              {subitem.title}
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
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
                    <Link href={item.href}>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button 
                          variant="ghost" 
                          className={`text-[#3d4fd4] hover:bg-[#3d4fd4]/10 font-bold transition-all duration-300 ${
                            isScrolled ? "text-xs xl:text-sm px-2 xl:px-3 py-1.5 h-8" : "text-sm px-3 py-2 h-9"
                          }`}
                        >
                          {item.title}
                        </Button>
                      </motion.div>
                    </Link>
                  </motion.div>
                ),
              )}
            </motion.nav>

            {/* Log In Button with animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                delay: 0.7,
                duration: 0.3
              }}
            >
              <Link href="/login">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    className={`text-[#3d4fd4] hover:bg-[#3d4fd4]/10 font-medium flex items-center gap-2 transition-all duration-300 ${
                      isScrolled ? "text-xs xl:text-sm px-2 py-1.5 h-8" : "text-sm px-3 py-2 h-9"
                    }`}
                  >
                    <motion.div 
                      className={`flex items-center justify-center rounded-full bg-[#3d4fd4] transition-all duration-300 ${
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
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            {/* Search Bar with animation */}
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                delay: 0.8,
                duration: 0.4
              }}
            >
              <div className={`flex items-center bg-white rounded-full pl-3 pr-1.5 border border-[#3d4fd4]/20 transition-all duration-300 ${
                isScrolled ? "py-1 w-32 xl:w-48" : "py-1.5 w-40 xl:w-56"
              }`}>
                <Input
                  type="search"
                  placeholder="Search..."
                  className={`flex-1 bg-transparent border-0 text-[#3d4fd4] placeholder:text-[#3d4fd4]/40 focus-visible:ring-0 focus-visible:ring-offset-0 px-0 transition-all duration-300 ${
                    isScrolled ? "text-xs" : "text-sm"
                  }`}
                />
                <motion.div 
                  className={`flex items-center justify-center rounded-full bg-[#3d4fd4] flex-shrink-0 transition-all duration-300 ${
                    isScrolled ? "w-6 h-6 xl:w-7 xl:h-7" : "w-8 h-8 xl:w-9 xl:h-9"
                  }`}
                  whileHover={{ scale: 1.1, rotate: 15 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Search className={`text-white transition-all duration-300 ${
                    isScrolled ? "h-3 w-3 xl:h-4 xl:w-4" : "h-4 w-4 xl:h-5 xl:w-5"
                  }`} />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.header>
  )
}