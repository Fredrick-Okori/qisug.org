'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  FileText, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  UserPlus,
  Upload,
  DollarSign,
  Eye,
  Download,
  BarChart3,
  AlertCircle
} from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface DashboardStats {
  totalApplications: number
  pendingApplications: number
  approvedApplications: number
  rejectedApplications: number
  totalUsers: number
  newThisWeek: number
  documentsUploaded: number
  revenue: number
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const { isSignedIn, isAdmin, loading: authLoading } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || authLoading) return

    if (!isSignedIn) {
      router.push('/login?redirect=/dashboard/admin')
      return
    }

    if (!isAdmin) {
      router.push('/dashboard')
      return
    }

    fetchStats()
  }, [mounted, authLoading, isSignedIn, isAdmin, router])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats')
      const data = await response.json()
      
      if (data.success) {
        setStats(data.data)
      } else {
        setError(data.error || 'Failed to fetch stats')
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err)
      setError('Failed to fetch dashboard statistics')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'under_review': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved': return 'Approved'
      case 'rejected': return 'Rejected'
      case 'pending': return 'Pending'
      case 'under_review': return 'Under Review'
      default: return status ? status.charAt(0).toUpperCase() + status.slice(1) : ''
    }
  }

  // Show loading state
  if (!mounted || authLoading || isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="h-8 w-64 bg-slate-200 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
              <div className="h-4 w-24 bg-slate-200 rounded animate-pulse mb-4" />
              <div className="h-8 w-16 bg-slate-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Show error state
  if (error || !stats) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-2">Error loading dashboard</p>
          <p className="text-slate-500">{error || 'No data available'}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-[#053f52] text-white rounded-lg hover:bg-[#0a4d63] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  const statCards = [
    { 
      title: 'Total Applications', 
      value: stats.totalApplications, 
      icon: FileText, 
      color: 'bg-blue-500',
      change: '+12%',
      href: '/dashboard/admin/applications'
    },
    { 
      title: 'Pending Review', 
      value: stats.pendingApplications, 
      icon: Clock, 
      color: 'bg-yellow-500',
      change: '-5%',
      href: '/dashboard/admin/applications?status=pending'
    },
    { 
      title: 'Approved', 
      value: stats.approvedApplications, 
      icon: CheckCircle, 
      color: 'bg-green-500',
      change: '+8%',
      href: '/dashboard/admin/applications?status=approved'
    },
    { 
      title: 'Total Users', 
      value: stats.totalUsers, 
      icon: Users, 
      color: 'bg-purple-500',
      change: '+15%',
      href: '/dashboard/admin/users'
    },
  ]

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-600 mt-1">Welcome back! Here's an overview of your admissions system.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
          <Link href="/dashboard/admin/applications">
            <Button className="bg-[#053f52] hover:bg-[#0a4d63]">
              View All Applications
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={stat.href}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-[#EFBF04]">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-600 font-medium">{stat.title}</p>
                        <p className="text-3xl font-bold text-slate-900 mt-2">
                          {stat.value.toLocaleString()}
                        </p>
                        <div className="flex items-center gap-1 mt-2">
                          <TrendingUp className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                          <span className="text-sm text-slate-500">from last month</span>
                        </div>
                      </div>
                      <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <UserPlus className="w-6 h-6" />
            </div>
            <div>
              <p className="text-blue-100 text-sm">New Applications</p>
              <p className="text-2xl font-bold">{stats.newThisWeek} this week</p>
            </div>
          </div>
          <p className="text-blue-100 text-sm mt-4">Review and process new applications quickly</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <p className="text-green-100 text-sm">Documents Uploaded</p>
              <p className="text-2xl font-bold">{stats.documentsUploaded} files</p>
            </div>
          </div>
          <p className="text-green-100 text-sm mt-4">All documents reviewed and verified</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-purple-100 text-sm">Revenue</p>
              <p className="text-2xl font-bold">${stats.revenue.toLocaleString()}</p>
            </div>
          </div>
          <p className="text-purple-100 text-sm mt-4">Application fees collected this month</p>
        </motion.div>
      </div>

      {/* Quick Actions Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <Link 
          href="/dashboard/admin/applications"
          className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors text-left group"
        >
          <FileText className="w-6 h-6 text-[#053f52] mb-2 group-hover:scale-110 transition-transform" />
          <p className="font-medium text-slate-900">Review Applications</p>
          <p className="text-sm text-slate-500">{stats.pendingApplications} pending</p>
        </Link>
        <Link 
          href="/dashboard/admin/users"
          className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors text-left group"
        >
          <Users className="w-6 h-6 text-[#053f52] mb-2 group-hover:scale-110 transition-transform" />
          <p className="font-medium text-slate-900">Manage Users</p>
          <p className="text-sm text-slate-500">{stats.totalUsers} total</p>
        </Link>
        <Link 
          href="/dashboard/admin/documents"
          className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors text-left group"
        >
          <CheckCircle className="w-6 h-6 text-[#053f52] mb-2 group-hover:scale-110 transition-transform" />
          <p className="font-medium text-slate-900">Approve Documents</p>
          <p className="text-sm text-slate-500">Review uploads</p>
        </Link>
        <Link 
          href="/dashboard/admin/settings"
          className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors text-left group"
        >
          <BarChart3 className="w-6 h-6 text-[#053f52] mb-2 group-hover:scale-110 transition-transform" />
          <p className="font-medium text-slate-900">View Reports</p>
          <p className="text-sm text-slate-500">Analytics</p>
        </Link>
      </motion.div>

      {/* Application Status Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white rounded-xl shadow-sm border border-slate-100 p-6"
      >
        <h2 className="text-lg font-semibold text-slate-900 mb-6">Application Status Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-gray-900">{stats.totalApplications}</p>
            <p className="text-sm text-gray-600 mt-1">Total Applications</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-yellow-700">{stats.pendingApplications}</p>
            <p className="text-sm text-yellow-600 mt-1">Pending Review</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-green-700">{stats.approvedApplications}</p>
            <p className="text-sm text-green-600 mt-1">Approved</p>
          </div>
          <div className="bg-red-50 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-red-700">{stats.rejectedApplications}</p>
            <p className="text-sm text-red-600 mt-1">Rejected</p>
          </div>
        </div>
      </motion.div>

      {/* Help Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="bg-blue-50 rounded-xl p-6"
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-[#053f52] rounded-full flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-[#053f52]">Need Help?</h3>
            <p className="text-slate-600 mt-1">
              If you have questions about managing applications or user accounts, 
              our support team is here to assist you.
            </p>
            <div className="flex flex-wrap gap-4 mt-3">
              <a href="mailto:support@qisug.ac.ug" className="text-[#053f52] hover:underline text-sm">
                support@qisug.ac.ug
              </a>
              <span className="text-slate-400">|</span>
              <a href="tel:+256414123456" className="text-[#053f52] hover:underline text-sm">
                +256 414 123 456
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

