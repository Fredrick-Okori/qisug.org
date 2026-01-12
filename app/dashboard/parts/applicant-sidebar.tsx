'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  FileText,
  Upload,
  User,
  Settings,
  LogOut,
  GraduationCap
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { User as SupabaseUser } from '@supabase/supabase-js'

interface ApplicantSidebarProps {
  children?: React.ReactNode
}

export default function ApplicantSidebar({ children }: ApplicantSidebarProps) {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [fullName, setFullName] = useState<string>('')

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()

        if (session?.user) {
          setUser(session.user)

          // Prefer using auth user metadata when available (safer and avoids missing profiles table)
          const metaFullName = (session.user.user_metadata && (
            session.user.user_metadata.full_name ||
            session.user.user_metadata.name ||
            session.user.user_metadata.fullName
          )) || null

          if (metaFullName) {
            setFullName(metaFullName)
          } else {
            // Fallback: try to get user profile data from public `profiles` table if it exists
            try {
              const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('full_name')
                .eq('user_id', session.user.id)
                .maybeSingle()

              if (!profileError && profileData?.full_name) {
                setFullName(profileData.full_name)
              } else {
                setFullName(session.user.email?.split('@')[0] || 'Applicant')
              }
            } catch (err) {
              // If the `profiles` table or `user_id` column does not exist, ignore and use fallback
              console.warn('Profiles lookup skipped (missing table/column):', err)
              setFullName(session.user.email?.split('@')[0] || 'Applicant')
            }
          }
        }
      } catch (error) {
        console.error('Error getting user:', error)
      } finally {
        setIsLoading(false)
      }
    }

    getUser()
  }, [supabase])

  const handleSignOut = async () => {
    setIsSigningOut(true)
    try {
      const { error } = await supabase.auth.signOut()

      if (error) {
        console.error('Sign out error:', error)
      } else {
        router.push('/')
        router.refresh()
      }
    } catch (error) {
      console.error('Sign out error:', error)
    } finally {
      setIsSigningOut(false)
    }
  }

  const menuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Applications', href: '/dashboard/applied', icon: FileText },
    { name: 'Upload Documents', href: '/more/downloads', icon: Upload },
  ];

  return (
    <div className="flex flex-col h-screen w-64 bg-[#053f52] text-white border-r border-[#042a3a]">
      {/* School Logo/Title Area */}
      <div className="p-6 border-b border-[#042a3a]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#EFBF04] rounded-full flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-[#053f52]" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">
              QISUG <span className="text-[#EFBF04]">Portal</span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5 font-medium uppercase">Student Area</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-1 mt-4">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-[#042a3a] transition-colors group"
          >
            <item.icon size={20} className="text-slate-300 group-hover:text-[#EFBF04]" />
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>

      {/* User Info Section */}
      <div className="px-4 py-3 border-t border-[#042a3a]">
        {isLoading ? (
          <div className="animate-pulse">
            <div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-slate-700 rounded w-1/2"></div>
          </div>
        ) : user ? (
          <div className="space-y-2">
            {/* User Info */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-slate-300" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {fullName}
                </p>
                <p className="text-xs text-slate-400 truncate">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-xs text-slate-400">
            Not signed in
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-[#042a3a] space-y-1">
        <Link
          href="/dashboard/settings"
          className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#042a3a] transition-colors"
        >
          <Settings size={20} />
          <span>Settings</span>
        </Link>
        <button
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="w-full flex items-center gap-3 px-3 py-2 text-red-300 rounded-md hover:bg-red-900/30 transition-colors disabled:opacity-50"
        >
          {isSigningOut ? (
            <>
              <div className="w-5 h-5 border-2 border-red-300 border-t-transparent rounded-full animate-spin" />
              <span>Signing out...</span>
            </>
          ) : (
            <>
              <LogOut size={20} />
              <span>Logout</span>
            </>
          )}
        </button>
      </div>

      {/* Children (additional content) */}
      {children}
    </div>
  );
}

