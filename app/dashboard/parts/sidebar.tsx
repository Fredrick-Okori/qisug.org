"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FileUser,
  CheckCircle,
  ClipboardList,
  Settings,
  LogOut,
  Users,
  Shield,
  ShieldCheck,
  User,
  GraduationCap,
  BookOpen
} from 'lucide-react'
import { /* createClient */ } from '@/lib/supabase/client'
import { getRoleBadgeColor, getRoleDisplayName, type AdminUser } from '@/lib/admin-utils'
import { useAuth } from '@/components/auth/auth-context'

interface AdminSidebarProps {
  children?: React.ReactNode
}

export default function AdminSidebar({ children }: AdminSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, adminUser, loading, signOut } = useAuth()
  const [isSigningOut, setIsSigningOut] = useState(false)

  const isLoading = loading

  useEffect(() => {
    // auth state is provided by AuthProvider; no local fetch required
  }, [])

  const handleSignOut = async () => {
    setIsSigningOut(true)
    try {
      await signOut()
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Sign out error:', error)
    } finally {
      setIsSigningOut(false)
    }
  }

  const menuItems = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Applications', href: '/dashboard/admin/applications', icon: ClipboardList },
    { name: 'Applied Students', href: '/dashboard/admin/users', icon: Users },
    { name: 'Review Documents', href: '/dashboard/admin/documents', icon: FileUser },
    { name: 'Classes & Streams', href: '/dashboard/admin/classes', icon: BookOpen },
    { name: 'Approved Students', href: '/dashboard/admin/approved', icon: CheckCircle },
  ];

  // Get role icon and color
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="w-4 h-4 text-red-500" />
      case 'reviewer':
        return <ShieldCheck className="w-4 h-4 text-blue-500" />
      default:
        return <User className="w-4 h-4 text-gray-500" />
    }
  }

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard'
    }
    return pathname.startsWith(href)
  }

  return (
    <div className="flex flex-col h-screen w-64 bg-slate-900 text-slate-300 border-r border-slate-800">
      {/* School Logo/Title Area */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">
              QISUG <span className="text-blue-400">Admin</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5 font-medium uppercase">Management Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-1 mt-4">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors group ${
              isActive(item.href)
                ? 'bg-blue-600 text-white'
                : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <item.icon size={20} className={isActive(item.href) ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'} />
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>

      {/* User Info Section */}
      <div className="px-4 py-3 border-t border-slate-800">
            {isLoading ? (
          <div className="animate-pulse">
            <div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-slate-700 rounded w-1/2"></div>
          </div>
        ) : user ? (
          <div className="space-y-2">
            {/* User Email */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-slate-300" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {adminUser?.full_name ?? (user?.email ? user.email.split('@')[0] : 'Admin')}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {user?.email}
                </p>
              </div>
            </div>

            {/* Role Badge */}
            {adminUser && (
              <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(adminUser.role)}`}>
                {getRoleIcon(adminUser.role)}
                <span>{getRoleDisplayName(adminUser.role)}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="text-xs text-slate-500">
            Not signed in
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-slate-800 space-y-1">
        <Link
          href="/dashboard/admin/settings"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${
            pathname === '/dashboard/admin/settings'
              ? 'bg-blue-600 text-white'
              : 'hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Settings size={20} />
          <span>Settings</span>
        </Link>
        <button
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-red-400 rounded-md hover:bg-red-900/30 transition-colors disabled:opacity-50"
        >
          {isSigningOut ? (
            <>
              <div className="w-5 h-5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
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

