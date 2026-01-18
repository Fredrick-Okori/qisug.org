'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/auth/auth-context'
import ApplicantSidebar from './parts/applicant-sidebar'

// Skeleton component for loading states
function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="h-8 w-48 bg-slate-200 rounded animate-pulse mb-2" />
            <div className="h-4 w-64 bg-slate-200 rounded animate-pulse" />
          </div>
          <div className="h-10 w-40 bg-slate-200 rounded animate-pulse" />
        </div>
        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-28 bg-slate-200 rounded-xl animate-pulse" />
          <div className="h-28 bg-slate-200 rounded-xl animate-pulse" />
          <div className="h-28 bg-slate-200 rounded-xl animate-pulse" />
        </div>
        {/* Card Skeleton */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <div className="h-6 w-40 bg-slate-200 rounded animate-pulse mb-4" />
          <div className="space-y-4">
            <div className="h-20 bg-slate-100 rounded-lg animate-pulse" />
            <div className="h-20 bg-slate-100 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()
  const { isSignedIn, isAdmin, loading: authLoading } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Redirect if not authenticated (only after mount to avoid hydration mismatch)
  // Don't wait for authLoading - redirect immediately when we know user is not signed in
  useEffect(() => {
    if (!mounted) return

    if (!isSignedIn) {
      router.push('/login?redirect=/dashboard')
    }
  }, [mounted, isSignedIn, router])

  // Show skeleton only during initial mount, then show content immediately
  // This prevents long loading times even when user is authenticated
  if (!mounted) {
    return <DashboardSkeleton />
  }

  // Show loading while redirecting
  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#053f52] border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-600">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  // Check if this is an admin route - if so, don't render student layout
  if (pathname?.startsWith('/dashboard/admin') || pathname?.startsWith('/dashboard/(admin)')) {
    return (
      <div className="h-screen flex flex-col overflow-hidden bg-slate-50">
        {children}
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-slate-50">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#053f52] z-50 flex items-center justify-between px-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            className="p-2 text-white hover:bg-white/10 rounded-lg"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="text-white font-semibold">Student Portal</span>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-50"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="lg:hidden fixed left-0 top-0 bottom-0 w-[280px] bg-[#053f52] z-50">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <span className="text-white font-semibold">Navigation</span>
              <button
                className="p-2 text-white hover:bg-white/10 rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <ApplicantSidebar />
            </div>
          </div>
        </>
      )}

      {/* Desktop Layout */}
      <div className="lg:flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex flex-col w-64 bg-[#053f52] flex-shrink-0">
          <ApplicantSidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile spacer */}
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

