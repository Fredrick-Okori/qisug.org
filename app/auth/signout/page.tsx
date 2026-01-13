'use client'

import { useEffect, useState, Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useSearchParams } from 'next/navigation'

// Fast cookie clearing - minimal version
function clearCookies() {
  const cookies = document.cookie.split(';')
  for (const cookie of cookies) {
    const [name] = cookie.split('=')
    const nameTrimmed = name.trim()
    if (nameTrimmed) {
      // Clear with multiple path variations
      document.cookie = `${nameTrimmed}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`
      document.cookie = `${nameTrimmed}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`
    }
  }
}

function SignOutContent() {
  const searchParams = useSearchParams()
  const supabase = createClient()
  const [status, setStatus] = useState('Signing out...')
  const redirectTo = searchParams.get('redirect') || '/'

  useEffect(() => {
    let cleanupStarted = false

    const signOut = async () => {
      if (cleanupStarted) return
      cleanupStarted = true

      try {
        // Fire and forget - don't await
        fetch('/api/auth/signout', { method: 'POST' }).catch(() => {})

        // Sign out from Supabase (fire and forget)
        supabase.auth.signOut().catch(() => {})

        // Clear localStorage in one go
        try {
          localStorage.clear()
        } catch (e) {}

        // Clear sessionStorage
        try {
          sessionStorage.clear()
        } catch (e) {}

        // Clear cookies
        clearCookies()

        // Update status and redirect quickly
        setStatus('Almost done...')

        // Use setTimeout to allow UI to update before redirect
        setTimeout(() => {
          // Hard redirect to clear all state
          window.location.replace(redirectTo)
        }, 100)

      } catch (err) {
        console.error('Sign out error:', err)
        // Still redirect even on error
        window.location.replace(redirectTo)
      }
    }

    // Small delay to allow the page to render first
    const timer = setTimeout(signOut, 50)

    return () => clearTimeout(timer)
  }, [supabase, redirectTo])

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[#053f52] border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-600">{status}</p>
      </div>
    </div>
  )
}

function SignOutLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[#053f52] border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-600">Preparing to sign out...</p>
      </div>
    </div>
  )
}

export default function SignOutPage() {
  return (
    <Suspense fallback={<SignOutLoading />}>
      <SignOutContent />
    </Suspense>
  )
}

