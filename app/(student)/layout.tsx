"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ApplicantSidebar from '@/app/dashboard/parts/applicant-sidebar'
import { useAuth } from '@/components/auth/auth-context'

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const { isSignedIn, loading: authLoading } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (authLoading) return
    if (!isSignedIn) {
      router.push('/login?redirect=/dashboard')
    }
  }, [authLoading, isSignedIn])

  if (!mounted || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-[#053f52] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="lg:flex">
        <div className="hidden lg:block">
          <ApplicantSidebar />
        </div>

        <div className="flex-1 lg:pl-64">
          <div className="lg:hidden h-16" />
          <main className="p-4 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
