'use client'

import { useState, useEffect } from 'react'
import { 
  Search, 
  Filter, 
  Download,
  CheckCircle,
  User,
  Mail,
  Phone,
  Calendar,
  GraduationCap,
  Eye,
  FileText,
  AlertCircle,
  RefreshCw
} from 'lucide-react'
import { motion } from 'framer-motion'

interface ApprovedStudent {
  id: string
  reference: string
  applicant_name: string
  first_name: string
  last_name: string
  email: string
  phone: string
  program: string
  grade: string
  grade_raw: number | null
  stream: string | null
  status: string
  created_at: string
  updated_at: string
  academic_year: string
  intake_month: string
  // Legacy field names for compatibility
  fullName?: string
  parentName?: string
  parent_phone?: string
}

export default function AdminApprovedPage() {
  const [students, setStudents] = useState<ApprovedStudent[]>([])
  const [filteredStudents, setFilteredStudents] = useState<ApprovedStudent[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [programFilter, setProgramFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<string | null>(null)

  const fetchStudents = async () => {
    setIsLoading(true)
    setIsRefreshing(true)
    setError(null)
    setDebugInfo(null)
    
    try {
      console.log('[ApprovedPage] Fetching approved students from API...')
      const response = await fetch('/api/admin/approved')
      const data = await response.json()
      
      console.log('[ApprovedPage] API Response:', data)
      
      if (data.success && data.data) {
        console.log('[ApprovedPage] Successfully fetched', data.data.length, 'students')
        setStudents(data.data)
        setError(null)
      } else {
        const errorMsg = data.error || 'Failed to fetch approved students'
        console.error('[ApprovedPage] API Error:', errorMsg)
        setError(errorMsg)
        setDebugInfo(data.message || 'No additional details available')
        // Don't fall back to mock data - show the actual error
        setStudents([])
      }
    } catch (err) {
      console.error('[ApprovedPage] Fetch error:', err)
      const errorMsg = err instanceof Error ? err.message : 'Network error occurred'
      setError('Failed to connect to server: ' + errorMsg)
      setDebugInfo('Please check your connection and try again')
      setStudents([])
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  useEffect(() => {
    let filtered = students

    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (student) =>
          (student.applicant_name || '').toLowerCase().includes(searchLower) ||
          (student.email || '').toLowerCase().includes(searchLower) ||
          (student.reference || '').toLowerCase().includes(searchLower) ||
          (student.first_name || '').toLowerCase().includes(searchLower) ||
          (student.last_name || '').toLowerCase().includes(searchLower)
      )
    }

    if (programFilter !== 'all') {
      filtered = filtered.filter((student) => student.program === programFilter)
    }

    // Status filter based on various status fields
    if (statusFilter !== 'all') {
      filtered = filtered.filter((student) => {
        if (statusFilter === 'confirmed') {
          // For now, all approved students are considered pending confirmation
          return false
        }
        if (statusFilter === 'enrolled') {
          return false
        }
        if (statusFilter === 'pending_enrollment') {
          return true // All approved students pending enrollment
        }
        return true
      })
    }

    setFilteredStudents(filtered)
  }, [searchQuery, programFilter, statusFilter, students])

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      confirmed: 'bg-green-100 text-green-800',
      enrolled: 'bg-blue-100 text-blue-800',
      Approved: 'bg-green-100 text-green-800',
      pending_enrollment: 'bg-yellow-100 text-yellow-800',
    }
    const labels: Record<string, string> = {
      confirmed: 'Confirmed',
      enrolled: 'Enrolled',
      Approved: 'Approved',
      pending_enrollment: 'Pending Enrollment',
    }
    const displayStatus = labels[status] || status
    const bgStyle = styles[status] || 'bg-gray-100 text-gray-800'
    
    return (
      <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${bgStyle}`}>
        {displayStatus}
      </span>
    )
  }

  const confirmedCount = filteredStudents.length // All approved students are considered confirmed
  const enrolledCount = 0 // No enrolled tracking yet
  const pendingCount = filteredStudents.length

  // Get unique programs for filter
  const uniquePrograms = [...new Set(students.map(s => s.program).filter(Boolean))]

  // Calculate stats
  const totalCount = students.length

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-[#053f52] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-red-900">{error}</p>
              {debugInfo && (
                <p className="text-sm text-red-800 mt-1">{debugInfo}</p>
              )}
              <button
                onClick={fetchStudents}
                disabled={isRefreshing}
                className="mt-3 px-4 py-2 bg-red-100 text-red-800 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Refreshing...' : 'Try Again'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Approved Students</h1>
          <p className="text-slate-600 mt-1">
            {totalCount > 0 
              ? `Manage ${totalCount} admitted student${totalCount !== 1 ? 's' : ''}`
              : 'No approved students yet'}
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={fetchStudents}
            disabled={isRefreshing}
            className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors font-medium flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          {totalCount > 0 && (
            <button className="px-4 py-2 bg-[#053f52] text-white rounded-lg hover:bg-[#042d40] transition-colors font-medium flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export List
            </button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      {totalCount > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-4 shadow-sm border border-slate-100"
          >
            <p className="text-sm text-slate-600">Total Approved</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{totalCount}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-4 shadow-sm border border-slate-100"
          >
            <p className="text-sm text-slate-600">Pending Confirmation</p>
            <p className="text-2xl font-bold text-yellow-600 mt-1">{pendingCount}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-4 shadow-sm border border-slate-100"
          >
            <p className="text-sm text-slate-600">Enrolled</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">{enrolledCount}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-4 shadow-sm border border-slate-100"
          >
            <p className="text-sm text-slate-600">Confirmed</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{confirmedCount}</p>
          </motion.div>
        </div>
      )}

      {/* Filters */}
      {totalCount > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, email, or reference..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#053f52] focus:border-transparent"
              />
            </div>
            <select
              value={programFilter}
              onChange={(e) => setProgramFilter(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#053f52] focus:border-transparent bg-white"
            >
              <option value="all">All Programs</option>
              {uniquePrograms.map((program) => (
                <option key={program} value={program}>{program}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#053f52] focus:border-transparent bg-white"
            >
              <option value="all">All Status</option>
              <option value="pending_enrollment">Pending Enrollment</option>
              <option value="confirmed">Confirmed</option>
              <option value="enrolled">Enrolled</option>
            </select>
          </div>
        </div>
      )}

      {/* Empty State or Students Table */}
      {totalCount === 0 && !error ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 text-center">
          <CheckCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No Approved Students Yet</h3>
          <p className="text-slate-600 max-w-md mx-auto">
            There are no applications with "Approved" status yet. 
            Applications will appear here once they are approved from the Applications page.
          </p>
          <button
            onClick={fetchStudents}
            className="mt-6 px-4 py-2 bg-[#053f52] text-white rounded-lg hover:bg-[#042d40] transition-colors font-medium inline-flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh Data
          </button>
        </div>
      ) : filteredStudents.length === 0 && totalCount > 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 text-center">
          <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No Students Found</h3>
          <p className="text-slate-600">
            No students match your current search criteria. Try adjusting your filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('')
              setProgramFilter('all')
              setStatusFilter('all')
            }}
            className="mt-4 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Reference</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Program</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Approved Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Intake</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm text-slate-700">{student.reference}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-slate-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{student.applicant_name || 'N/A'}</p>
                          <p className="text-sm text-slate-500">{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-slate-900">{student.program}</p>
                        <p className="text-sm text-slate-500">{student.grade} {student.stream && `• ${student.stream}`}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(student.status)}</td>
                    <td className="px-6 py-4 text-slate-600">
                      {student.created_at 
                        ? new Date(student.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })
                        : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {student.intake_month || 'TBD'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4 text-slate-600" />
                        </button>
                        <button
                          className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                          title="View Documents"
                        >
                          <FileText className="w-4 h-4 text-blue-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Program Distribution */}
      {totalCount > 0 && uniquePrograms.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {uniquePrograms.slice(0, 3).map((program, index) => {
            const count = students.filter(s => s.program === program).length
            const colors = [
              { bg: 'bg-blue-50', text: 'text-blue-600', bg2: 'bg-blue-100' },
              { bg: 'bg-purple-50', text: 'text-purple-600', bg2: 'bg-purple-100' },
              { bg: 'bg-amber-50', text: 'text-amber-600', bg2: 'bg-amber-100' },
            ]
            const color = colors[index % colors.length]
            
            return (
              <motion.div
                key={program}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + (index * 0.1) }}
                className={`${color.bg} rounded-xl p-4`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${color.bg2} rounded-lg flex items-center justify-center`}>
                    <GraduationCap className={`w-5 h-5 ${color.text}`} />
                  </div>
                  <div>
                    <p className={`text-sm ${color.text}`}>{program}</p>
                    <p className={`text-2xl font-bold ${color.text.replace('600', '900')}`}>
                      {count}
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}

