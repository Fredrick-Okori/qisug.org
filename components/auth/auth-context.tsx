"use client"

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

type AuthContextType = {
  user: any | null
  session: any | null
  isSignedIn: boolean
  isAdmin: boolean
  adminUser?: any | null
  fullName: string | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: any; data?: any }>
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error?: any; data?: any }>
  signOut: () => Promise<void>
  signInWithGoogle: (redirectTo?: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Cache for admin user status to reduce database queries
const adminCache = new Map<string, { data: any; timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null)
  const [session, setSession] = useState<any | null>(null)
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminUser, setAdminUser] = useState<any | null>(null)
  const [fullName, setFullName] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  // Cached admin check function
  const checkAdminStatus = useCallback(async (userId: string): Promise<{ admin: boolean; adminUser: any | null }> => {
    // Check cache first
    const cached = adminCache.get(userId)
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return { admin: cached.data.admin, adminUser: cached.data.adminUser }
    }

    try {
      const { data: adminRow } = await supabase
        .from('admin_users')
        .select('id, role, is_active, full_name, email, user_id')
        .eq('user_id', userId)
        .eq('is_active', true)
        .maybeSingle()

      const result = { 
        admin: !!adminRow, 
        adminUser: adminRow 
      }

      // Cache the result
      adminCache.set(userId, { data: result, timestamp: Date.now() })

      return result
    } catch (err) {
      return { admin: false, adminUser: null }
    }
  }, [supabase])

  // Clear admin cache on sign out
  const clearAdminCache = useCallback(() => {
    adminCache.clear()
  }, [])

  useEffect(() => {
    let mounted = true

    const init = async () => {
      if (!supabase) {
        setLoading(false)
        return
      }

      const { data: { session: initialSession } } = await supabase.auth.getSession()
      // Verify the user by asking Supabase Auth server for an authenticated user
      // This avoids trusting the session storage directly.
      let verifiedUser: any = null
      try {
        const { data: userData, error: userError } = await supabase.auth.getUser()
        if (!userError && userData?.user) verifiedUser = userData.user
      } catch (e) {
        // ignore and fallback
      }
      const user = verifiedUser ?? initialSession?.user ?? null

      if (!mounted) return
      setSession(initialSession ?? null)
      setUser(user)
      setIsSignedIn(!!initialSession)

      // derive full name from metadata when possible
      if (user) {
        const metaName = (user.user_metadata && (user.user_metadata.full_name || user.user_metadata.name)) || null
        setFullName(metaName ?? (user?.email ? user.email.split('@')[0] : null))

        // Check admin status (cached) - must complete before setting loading=false
        const { admin, adminUser: adminResult } = await checkAdminStatus(user.id)
        setIsAdmin(admin)
        setAdminUser(adminResult)
      }

      // Only set loading=false AFTER admin check completes
      // This ensures isAdmin is properly determined before rendering
      setLoading(false)

      // subscribe to auth changes
      const { data } = supabase.auth.onAuthStateChange(async (_event: string, session: any) => {
        // Prefer an authenticated user from the Supabase Auth server
        let verifiedUser: any = null
        try {
          const { data: userData, error: userError } = await supabase.auth.getUser()
          if (!userError && userData?.user) verifiedUser = userData.user
        } catch (e) {
          // ignore and fallback to session user
        }
        const user = verifiedUser ?? session?.user ?? null
        setSession(session ?? null)
        setUser(user)
        setIsSignedIn(!!session)

        if (user) {
          const metaName = (user.user_metadata && (user.user_metadata.full_name || user.user_metadata.name)) || null
          setFullName(metaName ?? (user?.email ? user.email.split('@')[0] : null))

          // Update adminUser when auth state changes (cached)
          const { admin, adminUser: adminResult } = await checkAdminStatus(user.id)
          setIsAdmin(admin)
          setAdminUser(adminResult)
        } else {
          setFullName(null)
          setIsAdmin(false)
          setAdminUser(null)
        }
      })

      return () => {
        data.subscription.unsubscribe()
        mounted = false
      }
    }

    init()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase, checkAdminStatus])

  const signIn = async (email: string, password: string) => {
    if (!supabase) return { error: new Error('Supabase not configured') }
    const res = await supabase.auth.signInWithPassword({ email, password })
    return res
  }

  const signUp = async (email: string, password: string, fullName?: string) => {
    if (!supabase) return { error: new Error('Supabase not configured') }
    const res = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } }
    })
    return res
  }

  const signOut = async () => {
    if (!supabase) return
    try {
      // Clear admin cache on sign out
      clearAdminCache()
      
      // Navigate to dedicated sign-out page which handles complete cleanup
      // This page will: call server-side signout, clear all cookies, localStorage, 
      // sessionStorage, IndexedDB, and redirect to home
      window.location.href = '/auth/signout'
    } catch (err) {
      console.error('Sign out error:', err)
      // Even on error, redirect to signout page for cleanup
      window.location.href = '/auth/signout'
    }
  }

  const signInWithGoogle = async (redirectTo?: string) => {
    if (!supabase) return
    await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo } })
  }

  return (
    <AuthContext.Provider value={{ user, session, isSignedIn, isAdmin, adminUser, fullName, loading, signIn, signUp, signOut, signInWithGoogle }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export default AuthProvider
