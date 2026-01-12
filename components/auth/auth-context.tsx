"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null)
  const [session, setSession] = useState<any | null>(null)
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminUser, setAdminUser] = useState<any | null>(null)
  const [fullName, setFullName] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

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

        // determine admin via metadata or fallback to admin_users
        const role = (user.user_metadata && (user.user_metadata.role || user.user_metadata.roles))
          || (user.app_metadata && user.app_metadata.role) || null

        const adminRoles = ['admin', 'reviewer', 'viewer']
        let admin = false

        if (role) {
          if (typeof role === 'string' && adminRoles.includes(role)) admin = true
          if (Array.isArray(role) && role.some((r: string) => adminRoles.includes(r))) admin = true
        }

        if (!admin) {
          try {
            const { data: adminRow } = await supabase
              .from('admin_users')
              .select('id, role, is_active, full_name, email, user_id')
              .eq('user_id', user.id)
              .eq('is_active', true)
              .maybeSingle()

            if (adminRow) {
              admin = true
              setAdminUser(adminRow)
            } else {
              setAdminUser(null)
            }
          } catch (err) {
            admin = false
            setAdminUser(null)
          }
        } else {
          setAdminUser(null)
        }

        setIsAdmin(admin)
      }

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

          // Update adminUser when auth state changes
          try {
            const { data: adminRow } = await supabase
              .from('admin_users')
              .select('id, role, is_active, full_name, email, user_id')
              .eq('user_id', user.id)
              .eq('is_active', true)
              .maybeSingle()

            if (adminRow) setAdminUser(adminRow)
            else setAdminUser(null)
          } catch (err) {
            setAdminUser(null)
          }
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
  }, [])

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
      await supabase.auth.signOut()
      setUser(null)
      setSession(null)
      setIsSignedIn(false)
      setIsAdmin(false)
      setFullName(null)
      setAdminUser(null)
    } catch (err) {
      console.error('Sign out error:', err)
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
