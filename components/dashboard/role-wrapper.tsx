"use client"

import React from 'react'
import { useAuth } from '@/components/auth/auth-context'
import AdminSidebar from '@/app/dashboard/parts/sidebar'
import ApplicantSidebar from '@/app/dashboard/parts/applicant-sidebar'

export default function RoleWrapper({ children }: { children?: React.ReactNode }) {
  const { isAdmin, loading } = useAuth()

  if (loading) {
    return (
      <div className="w-64">
        <div className="h-screen bg-gray-100 animate-pulse" />
      </div>
    )
  }

  return (
    <>{isAdmin ? <AdminSidebar>{children}</AdminSidebar> : <ApplicantSidebar>{children}</ApplicantSidebar>}</>
  )
}
