"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type AuthContextType = {
  user: any | null
  session: any | null
  isSignedIn: boolean
  isAdmin: boolean
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
      const user = initialSession?.user ?? null

      if (!mounted) return
      setSession(initialSession ?? null)
      setUser(user)
      setIsSignedIn(!!initialSession)

      // derive full name from metadata when possible
      if (user) {
        const metaName = (user.user_metadata && (user.user_metadata.full_name || user.user_metadata.name)) || null
        setFullName(metaName || user.email?.split('@')[0] || null)

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
            const { data: adminUser } = await supabase
              .from('admin_users')
              .select('role, is_active')
              .eq('user_id', user.id)
              .eq('is_active', true)
              .maybeSingle()

            admin = !!adminUser
          } catch (err) {
            admin = false
          }
        }

        setIsAdmin(admin)
      }

      setLoading(false)

      // subscribe to auth changes
      const { data } = supabase.auth.onAuthStateChange((_event: string, session: any) => {
        const user = session?.user ?? null
        setSession(session ?? null)
        setUser(user)
        setIsSignedIn(!!session)

        if (user) {
          const metaName = (user.user_metadata && (user.user_metadata.full_name || user.user_metadata.name)) || null
          setFullName(metaName || user.email?.split('@')[0] || null)
        } else {
          setFullName(null)
          setIsAdmin(false)
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
    } catch (err) {
      console.error('Sign out error:', err)
    }
  }

  const signInWithGoogle = async (redirectTo?: string) => {
    if (!supabase) return
    await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo } })
  }

  return (
    <AuthContext.Provider value={{ user, session, isSignedIn, isAdmin, fullName, loading, signIn, signUp, signOut, signInWithGoogle }}>
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
