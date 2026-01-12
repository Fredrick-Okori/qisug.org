'use client'

import { useState, useEffect } from 'react'
import { 
  Search, 
  Filter, 
  Download, 
  Eye,
  Check,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Application {
  id: string
  reference: string
  applicantName: string
  email: string
  phone: string
  program: string
  grade: string
  status: 'pending' | 'approved' | 'rejected' | 'under_review'
  submittedAt: string
  lastUpdated: string
  documentsComplete: boolean
  paymentStatus: 'pending' | 'paid' | 'failed'
}

const mockApplications: Application[] = [
  { id: '1', reference: 'QIS-2024-001', applicantName: 'John Kamau', email: 'john@example.com', phone: '+256 701234567', program: 'IB Diploma', grade: 'Grade 11', status: 'pending', submittedAt: '2024-01-15', lastUpdated: '2024-01-15', documentsComplete: true, paymentStatus: 'paid' },
  { id: '2', reference: 'QIS-2024-002', applicantName: 'Sarah Mukiibi', email: 'sarah@example.com', phone: '+256 702345678', program: 'A-Level', grade: 'Grade 12', status: 'approved', submittedAt: '2024-01-14', lastUpdated: '2024-01-16', documentsComplete: true, paymentStatus: 'paid' },
  { id: '3', reference: 'QIS-2024-003', applicantName: 'Michael Omondi', email: 'michael@example.com', phone: '+256 703456789', program: 'IGCSE', grade: 'Grade 10', status: 'under_review', submittedAt: '2024-01-14', lastUpdated: '2024-01-15', documentsComplete: false, paymentStatus: 'pending' },
  { id: '4', reference: 'QIS-2024-004', applicantName: 'Emma Nakiwala', email: 'emma@example.com', phone: '+256 704567890', program: 'IB Diploma', grade: 'Grade 11', status: 'rejected', submittedAt: '2024-01-13', lastUpdated: '2024-01-14', documentsComplete: true, paymentStatus: 'paid' },
  { id: '5', reference: 'QIS-2024-005', applicantName: 'David Ssentamu', email: 'david@example.com', phone: '+256 705678901', program: 'A-Level', grade: 'Grade 12', status: 'pending', submittedAt: '2024-01-13', lastUpdated: '2024-01-13', documentsComplete: true, paymentStatus: 'paid' },
  { id: '6', reference: 'QIS-2024-006', applicantName: 'Grace Nakintu', email: 'grace@example.com', phone: '+256 706789012', program: 'IB Diploma', grade: 'Grade 11', status: 'approved', submittedAt: '2024-01-12', lastUpdated: '2024-01-15', documentsComplete: true, paymentStatus: 'paid' },
  { id: '7', reference: 'QIS-2024-007', applicantName: 'Robert Mukasa', email: 'robert@example.com', phone: '+256 707890123', program: 'IGCSE', grade: 'Grade 9', status: 'pending', submittedAt: '2024-01-11', lastUpdated: '2024-01-11', documentsComplete: false, paymentStatus: 'failed' },
  { id: '8', reference: 'QIS-2024-008', applicantName: 'Alice Babirye', email: 'alice@example.com', phone: '+256 708901234', program: 'A-Level', grade: 'Grade 12', status: 'under_review', submittedAt: '2024-01-10', lastUpdated: '2024-01-14', documentsComplete: true, paymentStatus: 'paid' },
]

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const itemsPerPage = 10

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch(`/api/admin/applications?status=${statusFilter}&page=${currentPage}&limit=${itemsPerPage}`)
        const data = await response.json()
        
        if (data.success) {
          setApplications(data.data || [])
          setError(null)
        } else {
          setError(data.error || 'Failed to fetch applications')
          setApplications(mockApplications)
        }
      } catch (err) {
        console.error('Error fetching applications:', err)
        setError('Failed to fetch applications')
        setApplications(mockApplications)
      } finally {
        setIsLoading(false)
      }
    }

    fetchApplications()
  }, [statusFilter, currentPage])

  useEffect(() => {
    let filtered = applications

    if (searchQuery) {
      filtered = filtered.filter(
        (app) =>
          app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.reference.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredApplications(filtered)
    setCurrentPage(1)
  }, [searchQuery, applications])

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      under_review: 'bg-blue-100 text-blue-800',
    }
    const labels: Record<string, string> = {
      pending: 'Pending',
      approved: 'Approved',
      rejected: 'Rejected',
      under_review: 'Under Review',
    }
    return (
      <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
        {labels[status] || status}
      </span>
    )
  }

  const getPaymentBadge = (status: string) => {
    const styles: Record<string, string> = {
      paid: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
    }
    return (
      <span className={`px-2 py-0.5 text-xs font-medium rounded ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage)
  const paginatedApplications = filteredApplications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleApprove = (id: string) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: 'approved', lastUpdated: new Date().toISOString().split('T')[0] } : app))
    )
    setSelectedApplication(null)
  }

  const handleReject = (id: string) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: 'rejected', lastUpdated: new Date().toISOString().split('T')[0] } : app))
    )
    setSelectedApplication(null)
  }

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
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center gap-3">
          <div className="w-5 h-5 rounded-full bg-yellow-400 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-bold">!</span>
          </div>
          <div>
            <p className="font-semibold text-yellow-900">{error}</p>
            <p className="text-sm text-yellow-800">Using fallback data. Please check your connection.</p>
          </div>
        </div>
      )}
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Applications</h1>
          <p className="text-slate-600 mt-1">Manage and review student applications</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors font-medium flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="px-4 py-2 bg-[#053f52] text-white rounded-lg hover:bg-[#0a4d63] transition-colors font-medium">
            Add New
          </button>
        </div>
      </div>

      {/* Filters */}
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
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#053f52] focus:border-transparent bg-white"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="under_review">Under Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <button className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2">
              <Filter className="w-4 h-4" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Reference</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Applicant</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Program</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Payment</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Submitted</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedApplications.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm text-slate-700">{app.reference}</span>
                  </td>
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
                  <td className="px-6 py-4">{getStatusBadge(app.status)}</td>
                  <td className="px-6 py-4">{getPaymentBadge(app.paymentStatus)}</td>
                  <td className="px-6 py-4 text-slate-600">{app.submittedAt}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedApplication(app)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4 text-slate-600" />
                      </button>
                      <button
                        onClick={() => handleApprove(app.id)}
                        className="p-2 hover:bg-green-100 rounded-lg transition-colors"
                        title="Approve"
                      >
                        <Check className="w-4 h-4 text-green-600" />
                      </button>
                      <button
                        onClick={() => handleReject(app.id)}
                        className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                        title="Reject"
                      >
                        <X className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredApplications.length > itemsPerPage && (
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
            <p className="text-sm text-slate-600">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredApplications.length)} of {filteredApplications.length} applications
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === page
                        ? 'bg-[#053f52] text-white'
                        : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    {page}
                  </button>
                )
              })}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Application Detail Modal */}
      <AnimatePresence>
        {selectedApplication && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedApplication(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Application Details</h2>
                  <p className="text-sm text-slate-500 font-mono">{selectedApplication.reference}</p>
                </div>
                <button
                  onClick={() => setSelectedApplication(null)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Applicant Name</p>
                    <p className="font-semibold text-slate-900">{selectedApplication.applicantName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Email</p>
                    <p className="font-semibold text-slate-900">{selectedApplication.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Phone</p>
                    <p className="font-semibold text-slate-900">{selectedApplication.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Program</p>
                    <p className="font-semibold text-slate-900">{selectedApplication.program}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Grade</p>
                    <p className="font-semibold text-slate-900">{selectedApplication.grade}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Status</p>
                    {getStatusBadge(selectedApplication.status)}
                  </div>
                </div>
                <div className="flex gap-3 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => handleApprove(selectedApplication.id)}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Approve Application
                  </button>
                  <button
                    onClick={() => handleReject(selectedApplication.id)}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    Reject Application
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

