'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
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
import { useAuth } from '@/components/auth/auth-context'

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

// Skeleton component for admin loading state
function AdminSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[#053f52] border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-600">Verifying admin access...</p>
      </div>
    </div>
  )
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { isSignedIn, isAdmin, loading: authLoading, signOut } = useAuth()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isSignedIn) {
      router.push('/login?redirect=/dashboard/admin')
    }
  }, [authLoading, isSignedIn, router])

  // Redirect non-admins to student dashboard
  useEffect(() => {
    if (!authLoading && isSignedIn && !isAdmin) {
      router.push('/dashboard')
    }
  }, [authLoading, isSignedIn, isAdmin, router])

  // Show skeleton while checking auth
  if (authLoading || !isSignedIn) {
    return <AdminSkeleton />
  }

  // Redirecting message while non-admin is being redirected
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#053f52] border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-600">Redirecting to student portal...</p>
        </div>
      </div>
    )
  }

  const handleSignOut = async () => {
    await signOut()
    // signOut already redirects to '/', so no need for window.location.href
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-slate-50">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#053f52] z-50 flex items-center justify-between px-4 flex-shrink-0">
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

      {/* Desktop Layout - Flex container with sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <div className={`hidden lg:flex flex-col bg-[#053f52] z-40 transition-all duration-300 ${isSidebarCollapsed ? 'w-20' : 'w-64'}`}>
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b border-white/10 flex-shrink-0">
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
          <nav className="flex-1 p-4 overflow-y-auto">
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
          <div className="p-4 border-t border-white/10 space-y-2 flex-shrink-0">
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

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile Spacer */}
          <div className="lg:hidden h-16 flex-shrink-0" />
          
          {/* Page Content - Scrollable */}
          <main className="flex-1 overflow-auto p-4 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}

