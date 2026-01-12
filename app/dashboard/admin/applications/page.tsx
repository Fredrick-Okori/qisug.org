'use client'

import { useState, useEffect } from 'react'
import { 
  Search, 
  Filter, 
  Download, 
  Eye,
  Check,
  X,
  FileText,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Clock,
  Upload
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Document {
  application_id: string
  file_name: string
  file_type: string
  file_url?: string
  status: 'pending' | 'approved' | 'rejected'
  uploaded_at: string
}

interface Payment {
  id: string
  amount: number
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  payment_method: string
  created_at: string
  transaction_id: string
  receipt_url: string | null
}

interface Application {
  id: string
  reference: string
  applicant_name: string
  email: string
  phone: string
  program: string
  grade: string
  status: 'pending' | 'approved' | 'rejected' | 'under_review'
  submitted_at: string
  last_updated: string
  payment_status: 'pending' | 'paid' | 'failed'
  payment: Payment | null
  documents: Document[]
}

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const itemsPerPage = 10

  useEffect(() => {
    fetchApplications()
  }, [statusFilter])

  const fetchApplications = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/applications?status=${statusFilter}`)
      const data = await response.json()
      
      if (data.success) {
        setApplications(data.data || [])
        setError(null)
      } else {
        setError(data.error || 'Failed to fetch applications')
      }
    } catch (err) {
      console.error('Error fetching applications:', err)
      setError('Failed to fetch applications. Please check your connection.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    let filtered = applications

    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (app) =>
          app.applicant_name.toLowerCase().includes(searchLower) ||
          app.email.toLowerCase().includes(searchLower) ||
          app.reference.toLowerCase().includes(searchLower)
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

  const getPaymentBadge = (status: string | null) => {
    const styles: Record<string, string> = {
      paid: 'bg-green-100 text-green-800',
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
    }
    const safeStatus = status || 'pending'
    const label = safeStatus.charAt(0).toUpperCase() + safeStatus.slice(1)

    return (
      <span className={`px-2 py-0.5 text-xs font-medium rounded ${styles[safeStatus] || 'bg-gray-100 text-gray-800'}`}>
        {label}
      </span>
    )
  }

  const getDocStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />
    }
  }

  const getDocStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      approved: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
      pending: 'bg-yellow-100 text-yellow-700',
    }
    return (
      <span className={`px-2 py-0.5 text-xs font-medium rounded ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const getRequiredDocTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      passport: 'Passport',
      transcript: 'Transcript',
      recommendation: 'Recommendation Letter',
      photo: 'Passport Photo',
      birth_certificate: 'Birth Certificate',
      previous_school: 'Previous School Report',
      medical_form: 'Medical Form',
    }
    return labels[type] || type.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
  }

  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage)
  const paginatedApplications = filteredApplications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const updateApplicationStatus = async (id: string, status: 'approved' | 'rejected') => {
    setIsUpdating(true)
    try {
      const response = await fetch('/api/admin/applications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          applicationId: id,
          status
        })
      })

      const data = await response.json()

      if (data.success) {
        // Refresh the applications list
        await fetchApplications()
        setSelectedApplication(null)
      } else {
        alert(data.error || 'Failed to update application status')
      }
    } catch (err) {
      console.error('Error updating application:', err)
      alert('Failed to update application status. Please try again.')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleApprove = (id: string) => {
    if (confirm('Are you sure you want to approve this application?')) {
      updateApplicationStatus(id, 'approved')
    }
  }

  const handleReject = (id: string) => {
    if (confirm('Are you sure you want to reject this application?')) {
      updateApplicationStatus(id, 'rejected')
    }
  }

  const updatePaymentReference = async (applicationId: string, paymentReference: string) => {
    setIsUpdating(true)
    try {
      const response = await fetch('/api/admin/applications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          applicationId,
          paymentReference
        })
      })

      const data = await response.json()

      if (data.success) {
        await fetchApplications()
        return true
      } else {
        alert(data.error || 'Failed to update payment reference')
        return false
      }
    } catch (err) {
      console.error('Error updating payment reference:', err)
      alert('Failed to update payment reference. Please try again.')
      return false
    } finally {
      setIsUpdating(false)
    }
  }

  const getDocumentCompletionStatus = (docs: Document[]) => {
    if (!docs || docs.length === 0) return { complete: false, count: 0, total: 6 }
    const complete = docs.filter((d) => d.status === 'approved').length
    return { complete: complete >= 4, count: complete, total: docs.length }
  }

  const exportApplications = () => {
    // Create CSV content
    const headers = ['Reference', 'Name', 'Email', 'Phone', 'Program', 'Grade', 'Status', 'Payment Status', 'Submitted']
    const rows = filteredApplications.map(app => [
      app.reference,
      app.applicant_name,
      app.email,
      app.phone,
      app.program,
      app.grade,
      app.status,
      app.payment_status,
      app.submitted_at
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `applications-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
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
            <p className="text-sm text-yellow-800">Please check your connection and try again.</p>
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
          <button 
            onClick={exportApplications}
            className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors font-medium flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
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
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Documents</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Payment</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Submitted</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedApplications.map((app) => {
                const docStatus = getDocumentCompletionStatus(app.documents)
                return (
                  <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm text-slate-700">{app.reference}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-slate-900">{app.applicant_name}</p>
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
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-slate-400" />
                        <span className={`text-sm font-medium ${docStatus.complete ? 'text-green-600' : 'text-orange-600'}`}>
                          {docStatus.count}/{docStatus.total}
                        </span>
                        {docStatus.complete ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <Clock className="w-4 h-4 text-orange-500" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(app.status)}</td>
                    <td className="px-6 py-4">{getPaymentBadge(app.payment_status)}</td>
                    <td className="px-6 py-4 text-slate-600">{app.submitted_at}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedApplication(app)}
                          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4 text-slate-600" />
                        </button>
                        {app.status !== 'approved' && (
                          <button
                            onClick={() => handleApprove(app.id)}
                            disabled={isUpdating}
                            className="p-2 hover:bg-green-100 rounded-lg transition-colors disabled:opacity-50"
                            title="Approve"
                          >
                            <Check className="w-4 h-4 text-green-600" />
                          </button>
                        )}
                        {app.status !== 'rejected' && (
                          <button
                            onClick={() => handleReject(app.id)}
                            disabled={isUpdating}
                            className="p-2 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                            title="Reject"
                          >
                            <X className="w-4 h-4 text-red-600" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
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
              className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
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
                {/* Basic Info */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Applicant Name</p>
                    <p className="font-semibold text-slate-900">{selectedApplication.applicant_name}</p>
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
                    <p className="text-sm text-slate-500 mb-1">Submitted</p>
                    <p className="font-semibold text-slate-900">{selectedApplication.submitted_at}</p>
                  </div>
                </div>

                {/* Documents Section */}
                <div className="border-t border-slate-100 pt-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Uploaded Documents</h3>
                  {selectedApplication.documents && selectedApplication.documents.length > 0 ? (
                    <div className="bg-slate-50 rounded-xl p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {selectedApplication.documents.map((doc, idx) => (
                          <div key={idx} className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-100">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <FileText className="w-5 h-5 text-[#053f52] flex-shrink-0" />
                              <div className="min-w-0 flex-1">
                                <p className="font-medium text-slate-900 text-sm">{getRequiredDocTypeLabel(doc.file_type)}</p>
                                <p className="text-xs text-slate-500 truncate">{doc.file_name}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                              {getDocStatusIcon(doc.status)}
                              {getDocStatusBadge(doc.status)}
                              {doc.file_url && (
                                <a
                                  href={doc.file_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1 hover:bg-slate-100 rounded"
                                  title="View document"
                                >
                                  <Eye className="w-4 h-4 text-slate-600" />
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-50 rounded-xl p-8 text-center">
                      <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-500">No documents uploaded yet</p>
                    </div>
                  )}
                </div>

                {/* Payment Section */}
                <div className="border-t border-slate-100 pt-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Payment Information</h3>
                  {selectedApplication.payment ? (
                    <div className="bg-slate-50 rounded-xl p-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-slate-500 mb-1">Amount</p>
                          <p className="font-semibold text-slate-900">
                            ${selectedApplication.payment.amount.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500 mb-1">Status</p>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            selectedApplication.payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                            selectedApplication.payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            selectedApplication.payment.status === 'failed' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {selectedApplication.payment.status.charAt(0).toUpperCase() + selectedApplication.payment.status.slice(1)}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500 mb-1">Method</p>
                          <p className="font-semibold text-slate-900">{selectedApplication.payment.payment_method}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500 mb-1">Transaction ID</p>
                          <p className="font-mono text-xs text-slate-900">{selectedApplication.payment.transaction_id}</p>
                        </div>
                      </div>
                      {selectedApplication.payment.receipt_url && (
                        <div className="mt-4 pt-4 border-t border-slate-200">
                          <a 
                            href={selectedApplication.payment.receipt_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-[#053f52] text-white rounded-lg hover:bg-[#042d3d] transition-colors text-sm font-medium"
                          >
                            <Download className="w-4 h-4" />
                            View Payment Slip
                          </a>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-slate-50 rounded-xl p-8 text-center">
                      <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-500">No payment information available</p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-slate-100">
                  {selectedApplication.status !== 'approved' && (
                    <button
                      onClick={() => handleApprove(selectedApplication.id)}
                      disabled={isUpdating}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
                    >
                      {isUpdating ? 'Processing...' : 'Approve Application'}
                    </button>
                  )}
                  {selectedApplication.status !== 'rejected' && (
                    <button
                      onClick={() => handleReject(selectedApplication.id)}
                      disabled={isUpdating}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
                    >
                      {isUpdating ? 'Processing...' : 'Reject Application'}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
