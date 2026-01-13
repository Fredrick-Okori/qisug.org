'use client'

import { useEffect, useState, Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useSearchParams, useRouter } from 'next/navigation'

function SignOutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  const [status, setStatus] = useState('Signing out...')
  const redirectTo = searchParams.get('redirect') || '/'

  useEffect(() => {
    const signOut = async () => {
      try {
        setStatus('Clearing session...')
        
        // 1. First, call server-side signout to clear cookies on the server
        try {
          await fetch('/api/auth/signout', { method: 'POST' })
        } catch (e) {
          console.warn('Server signout failed:', e)
        }

        // 2. Client-side sign out from Supabase
        await supabase.auth.signOut()

        // 3. Clear ALL possible Supabase-related cookies
        const cookieNames = [
          'sb-access-token',
          'sb-refresh-token', 
          'sb-provider-token',
          'supabase-auth-token',
          'auth-token',
          'session',
          'user-email',
          'user_session'
        ]

        // Clear each cookie for all paths, domains, and variations
        const domains = ['', window.location.hostname, '.' + window.location.hostname]
        const paths = ['/', '/dashboard', '/admin', '/api', '']

        cookieNames.forEach(name => {
          domains.forEach(domain => {
            paths.forEach(path => {
              const cookieParts = []
              if (name) cookieParts.push(`${name}=`)
              cookieParts.push('expires=Thu, 01 Jan 1970 00:00:00 UTC')
              if (path) cookieParts.push(`path=${path}`)
              if (domain) cookieParts.push(`domain=${domain}`)
              cookieParts.push('SameSite=Lax')
              document.cookie = cookieParts.join('; ')
            })
          })
          // Also clear with no domain/path variations
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=None; Secure`
        })

        // 4. Clear ALL localStorage (except Next.js cache)
        const localStorageKeys = Object.keys(localStorage)
        localStorageKeys.forEach(key => {
          if (
            key.startsWith('next.') && 
            !key.includes('supabase') && 
            !key.includes('auth') &&
            !key.includes('sb-')
          ) {
            return
          }
          localStorage.removeItem(key)
        })

        // 5. Clear sessionStorage completely
        sessionStorage.clear()

        // 6. Clear any Supabase IndexedDB
        try {
          indexedDB.databases().then(dbs => {
            dbs.forEach(db => {
              if (db.name && db.name.toLowerCase().includes('supabase')) {
                indexedDB.deleteDatabase(db.name)
              }
            })
          })
        } catch (e) {
          console.warn('IndexedDB cleanup failed:', e)
        }

        setStatus('Redirecting...')

        // 7. Force a hard redirect to clear any React state
        window.location.replace(redirectTo)

      } catch (err) {
        console.error('Sign out error:', err)
        setStatus('Error signing out, redirecting...')
        window.location.replace(redirectTo)
      }
    }

    signOut()
  }, [supabase, redirectTo])

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[#053f52] border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-600">{status}</p>
        <p className="text-sm text-slate-400">Please wait while we sign you out...</p>
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

