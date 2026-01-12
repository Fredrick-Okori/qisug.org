'use client'

import AdminDashboardPage from './dashboard/page'

// This page is the index for /dashboard/admin
// It directly renders the dashboard component to avoid redirect loops
export default function AdminIndexPage() {
  return <AdminDashboardPage />
}

