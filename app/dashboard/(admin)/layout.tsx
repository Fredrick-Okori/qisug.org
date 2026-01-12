'use client'

import { useEffect, useState } from 'react'
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
  Menu
} from 'lucide-react'
import { createClient, getSupabaseConfigStatus } from '@/lib/supabase/client'
import { useAuth } from '@/components/auth/auth-context'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const adminNavItems: NavItem[] = [
  { title: 'Dashboard', href: '/dashboard/admin', icon: LayoutDashboard },
  { title: 'Applications', href: '/dashboard/admin/applications', icon: FileText },
  { title: 'Users', href: '/dashboard/admin/users', icon: Users },
  { title: 'Settings', href: '/dashboard/admin/settings', icon: Settings },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const supabase = createClient()
  const configStatus = getSupabaseConfigStatus()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [adminUser, setAdminUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  const { isSignedIn, isAdmin, loading: authLoading, signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return

    if (authLoading) return

    if (!isSignedIn) {
      router.push('/login?redirect=/dashboard/admin')
      return
    }

    if (!isAdmin) {
      router.push('/dashboard')
      return
    }

    setLoading(false)
  }, [supabase, isMounted, configStatus])

  const handleSignOut = async () => {
    try {
      await signOut()
      window.location.href = '/'
    } catch (err) {
      console.error('Sign out error:', err)
      window.location.href = '/'
    }
  }

  // Show loading state only on server and initial client render
  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#053f52] border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-600">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#053f52] border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-600">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  // If Supabase is not configured on client show helpful error
  if (isMounted && !configStatus.configured) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="text-center max-w-xl">
          <h2 className="text-2xl font-semibold text-slate-900 mb-2">Supabase Not Configured</h2>
          <p className="text-slate-600 mb-4">The Supabase client could not initialize on the browser. Please ensure the following environment variables are set in your .env.local and restart the dev server:</p>
          <ul className="text-left list-disc list-inside text-sm text-slate-700">
            <li>NEXT_PUBLIC_SUPABASE_URL</li>
            <li>NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
          </ul>
          <p className="text-sm text-slate-500 mt-4">Config error: {configStatus.error}</p>
        </div>
      </div>
    )
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

