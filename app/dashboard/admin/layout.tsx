'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings, 
  LogOut,
  GraduationCap,
  ChevronLeft,
  Menu,
  BookOpen,
  FolderOpen
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const adminNavItems: NavItem[] = [
  { title: 'Dashboard', href: '/dashboard/admin', icon: LayoutDashboard },
  { title: 'Applications', href: '/dashboard/admin/applications', icon: FileText },
  { title: 'Approved Students', href: '/dashboard/admin/approved', icon: GraduationCap },
  { title: 'Users', href: '/dashboard/admin/users', icon: Users },
  { title: 'Documents', href: '/dashboard/admin/documents', icon: FolderOpen },
  { title: 'Classes', href: '/dashboard/admin/classes', icon: BookOpen },
  { title: 'Settings', href: '/dashboard/admin/settings', icon: Settings },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleSignOut = () => {
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#053f52] z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(true)}
            className="text-white hover:bg-white/10"
          >
            <Menu className="h-6 w-6" />
          </Button>
          <span className="text-white font-semibold">Admin Panel</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleSignOut}
          className="text-white hover:bg-white/10"
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-50"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="lg:hidden fixed left-0 top-0 bottom-0 w-[280px] bg-[#053f52] z-50 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#EFBF04] rounded-full flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-[#053f52]" />
                </div>
                <span className="text-white font-semibold">Admin Panel</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-white hover:bg-white/10"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </div>
            <nav className="flex-1 p-4">
              <ul className="space-y-2">
                {adminNavItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                          isActive
                            ? 'bg-[#EFBF04] text-[#053f52]'
                            : 'text-white/80 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.title}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>
            <div className="p-4 border-t border-white/10 space-y-2">
              <Link
                href="/dashboard"
                className="flex items-center gap-3 px-4 py-3 text-white/80 hover:bg-white/10 rounded-lg transition-colors"
              >
                <GraduationCap className="w-5 h-5" />
                <span>Student View</span>
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 px-4 py-3 text-red-300 hover:bg-red-500/10 rounded-lg transition-colors w-full"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Desktop Sidebar */}
      <div className={`hidden lg:flex flex-col fixed left-0 top-0 bottom-0 bg-[#053f52] z-40 transition-all duration-300 ${isSidebarCollapsed ? 'w-20' : 'w-64'}`}>
        {/* Logo */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          {!isSidebarCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#EFBF04] rounded-full flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-[#053f52]" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">QIS Admin</p>
                <p className="text-white/60 text-xs">Portal</p>
              </div>
            </div>
          )}
          {isSidebarCollapsed && (
            <div className="w-10 h-10 bg-[#EFBF04] rounded-full flex items-center justify-center mx-auto">
              <GraduationCap className="w-6 h-6 text-[#053f52]" />
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="text-white hover:bg-white/10 ml-auto"
          >
            <ChevronLeft className={`h-4 w-4 transition-transform ${isSidebarCollapsed ? 'rotate-180' : ''}`} />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {adminNavItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-[#EFBF04] text-[#053f52]'
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                    title={isSidebarCollapsed ? item.title : undefined}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {!isSidebarCollapsed && (
                      <span className="font-medium">{item.title}</span>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            href="/dashboard"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              pathname === '/dashboard'
                ? 'bg-[#EFBF04] text-[#053f52]'
                : 'text-white/80 hover:bg-white/10 hover:text-white'
            }`}
            title={isSidebarCollapsed ? 'Student View' : undefined}
          >
            <GraduationCap className="w-5 h-5 flex-shrink-0" />
            {!isSidebarCollapsed && <span className="font-medium">Student View</span>}
          </Link>
          <button
            onClick={handleSignOut}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-red-300 hover:bg-red-500/10 w-full ${
              isSidebarCollapsed ? 'justify-center' : ''
            }`}
            title={isSidebarCollapsed ? 'Sign Out' : undefined}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!isSidebarCollapsed && <span className="font-medium">Sign Out</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
        {/* Mobile Spacer */}
        <div className="lg:hidden h-16" />
        
        {/* Page Content */}
        <main className="p-4 lg:p-8 pt-20 lg:pt-8">
          {children}
        </main>
      </div>
    </div>
  )
}

