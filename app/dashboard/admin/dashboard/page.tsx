'use client'

import { useEffect, useState } from 'react'
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
  Download
} from 'lucide-react'
import { motion } from 'framer-motion'
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts'

interface DashboardStats {
  totalApplications: number
  pendingApplications: number
  approvedApplications: number
  rejectedApplications: number
  totalUsers: number
  newThisWeek: number
  documentsUploaded: number
  revenue: number
  applicationsByStatus: { name: string; value: number; color: string }[]
  applicationsByProgram: { name: string; value: number; color: string }[]
  monthlyTrend: { month: string; applications: number }[]
  recentApplications: {
    id: string
    applicantName: string
    email: string
    program: string
    grade: string
    status: string
    submittedAt: string
  }[]
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
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

    fetchStats()
  }, [])

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
      default: return status.charAt(0).toUpperCase() + status.slice(1)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Loading skeleton */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="h-8 w-64 bg-slate-200 rounded animate-pulse" />
          <div className="flex gap-3">
            <div className="h-10 w-28 bg-slate-200 rounded animate-pulse" />
            <div className="h-10 w-40 bg-slate-200 rounded animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
              <div className="h-4 w-24 bg-slate-200 rounded animate-pulse mb-4" />
              <div className="h-8 w-16 bg-slate-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80 bg-slate-200 rounded-xl animate-pulse" />
          <div className="h-80 bg-slate-200 rounded-xl animate-pulse" />
        </div>
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
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
      change: '+12%'
    },
    { 
      title: 'Pending Review', 
      value: stats.pendingApplications, 
      icon: Clock, 
      color: 'bg-yellow-500',
      change: '-5%'
    },
    { 
      title: 'Approved', 
      value: stats.approvedApplications, 
      icon: CheckCircle, 
      color: 'bg-green-500',
      change: '+8%'
    },
    { 
      title: 'Total Users', 
      value: stats.totalUsers, 
      icon: Users, 
      color: 'bg-purple-500',
      change: '+15%'
    },
  ]

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
          <p className="text-slate-600 mt-1">Welcome back! Here&apos;s what&apos;s happening with your applications.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors font-medium flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </button>
          <button className="px-4 py-2 bg-[#053f52] text-white rounded-lg hover:bg-[#0a4d63] transition-colors font-medium">
            View All Applications
          </button>
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
              className="bg-white rounded-xl p-6 shadow-sm border border-slate-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 font-medium">{stat.title}</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">
                    {stat.value.toLocaleString()}
                  </p>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-4">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                <span className="text-sm text-slate-500">from last month</span>
              </div>
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

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-slate-100"
        >
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Applications Trend</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Bar dataKey="applications" fill="#053f52" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Status Distribution Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-slate-100"
        >
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Applications by Status</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.applicationsByStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {stats.applicationsByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Program Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.85 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-slate-100"
      >
        <h2 className="text-lg font-semibold text-slate-900 mb-6">Applications by Program</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.applicationsByProgram.map((program) => (
            <div key={program.name} className="bg-slate-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-slate-900">{program.name}</span>
                <span className="text-2xl font-bold" style={{ color: program.color }}>
                  {program.value}
                </span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: `${(program.value / stats.totalApplications) * 100}%`,
                    backgroundColor: program.color 
                  }}
                />
              </div>
              <p className="text-sm text-slate-500 mt-2">
                {((program.value / stats.totalApplications) * 100).toFixed(1)}% of total
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Recent Applications Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Recent Applications</h2>
            <a href="/dashboard/admin/applications" className="text-sm text-[#053f52] hover:underline font-medium flex items-center gap-1">
              View All
              <Eye className="w-4 h-4" />
            </a>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Applicant</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Program</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Submitted</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stats.recentApplications.length > 0 ? (
                stats.recentApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-slate-900">{app.applicantName}</p>
                        <p className="text-sm text-slate-500">{app.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-slate-900">{app.program}</p>
                        <p className="text-sm text-slate-500">{app.grade}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(app.status)}`}>
                        {getStatusLabel(app.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{app.submittedAt}</td>
                    <td className="px-6 py-4 text-right">
                      <a 
                        href={`/dashboard/admin/applications?id=${app.id}`}
                        className="text-[#053f52] hover:text-[#0a4d63] font-medium text-sm"
                      >
                        Review
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    No recent applications
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Quick Actions Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <a 
          href="/dashboard/admin/applications"
          className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors text-left group"
        >
          <FileText className="w-6 h-6 text-[#053f52] mb-2 group-hover:scale-110 transition-transform" />
          <p className="font-medium text-slate-900">Review Applications</p>
          <p className="text-sm text-slate-500">{stats.pendingApplications} pending</p>
        </a>
        <a 
          href="/dashboard/admin/users"
          className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors text-left group"
        >
          <Users className="w-6 h-6 text-[#053f52] mb-2 group-hover:scale-110 transition-transform" />
          <p className="font-medium text-slate-900">Manage Users</p>
          <p className="text-sm text-slate-500">{stats.totalUsers} total</p>
        </a>
        <a 
          href="/dashboard/admin/documents"
          className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors text-left group"
        >
          <CheckCircle className="w-6 h-6 text-[#053f52] mb-2 group-hover:scale-110 transition-transform" />
          <p className="font-medium text-slate-900">Approve Documents</p>
          <p className="text-sm text-slate-500">Review uploads</p>
        </a>
        <a 
          href="/dashboard/admin/settings"
          className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors text-left group"
        >
          <Clock className="w-6 h-6 text-[#053f52] mb-2 group-hover:scale-110 transition-transform" />
          <p className="font-medium text-slate-900">View Reports</p>
          <p className="text-sm text-slate-500">Analytics</p>
        </a>
      </motion.div>
    </div>
  )
}

