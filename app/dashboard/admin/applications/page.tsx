'use client'

import { useState, useEffect, ReactNode } from 'react'
import Link from 'next/link'
import { 
  Search, 
  Filter, 
  Download, 
  Check,
  X,
  FileText,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Clock,
  ExternalLink,
  Eye
} from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

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
  status: 'Submitted' | 'Under Review' | 'Approved' | 'Rejected'
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
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const itemsPerPage = 10

  // Modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [modalApplicationId, setModalApplicationId] = useState<string | null>(null)
  const [modalAction, setModalAction] = useState<'Approved' | 'Rejected' | 'Under Review' | null>(null)

  // Modal configuration for each action type
  const modalConfig = {
    Approved: {
      title: 'Approve Application',
      description: 'Are you sure you want to approve this application? This will change the status to Approved.',
      confirmText: 'Approve',
      confirmClass: 'bg-green-600 hover:bg-green-700 text-white',
    },
    'Under Review': {
      title: 'Mark as Under Review',
      description: 'Are you sure you want to mark this application as Under Review?',
      confirmText: 'Mark as Under Review',
      confirmClass: 'bg-blue-600 hover:bg-blue-700 text-white',
    },
    Rejected: {
      title: 'Reject Application',
      description: 'Are you sure you want to reject this application? This action cannot be undone.',
      confirmText: 'Reject',
      confirmClass: 'bg-red-600 hover:bg-red-700 text-white',
    },
  }

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
      Submitted: 'bg-blue-100 text-blue-800',
      'Under Review': 'bg-yellow-100 text-yellow-800',
      Approved: 'bg-green-100 text-green-800',
      Rejected: 'bg-red-100 text-red-800',
    }
    return (
      <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    )
  }

  const getPaymentBadge = (status: string | null): ReactNode => {
    const styles: Record<string, string> = {
      paid: 'bg-green-100 text-green-800',
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
    }
    const safeStatus = status || 'pending'
    const label = safeStatus.charAt(0).toUpperCase() + safeStatus.slice(1)

    // If payment is completed, show green with verified check
    if (safeStatus === 'completed' || safeStatus === 'paid') {
      return (
        <div className="flex items-center gap-1.5">
          <span className="px-2 py-0.5 text-xs font-medium rounded bg-green-100 text-green-800">
            {label}
          </span>
          <CheckCircle className="w-4 h-4 text-green-600" />
        </div>
      )
    }

    return (
      <span className={`px-2 py-0.5 text-xs font-medium rounded ${styles[safeStatus] || 'bg-gray-100 text-gray-800'}`}>
        {label}
      </span>
    )
  }

  const getDocumentCompletionStatus = (docs: Document[]) => {
    if (!docs || docs.length === 0) return { complete: false, count: 0, total: 6 }
    const complete = docs.filter((d) => d.status === 'approved').length
    return { complete: complete >= 4, count: complete, total: docs.length }
  }

  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage)
  const paginatedApplications = filteredApplications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const updateApplicationStatus = async (id: string, status: 'Approved' | 'Rejected' | 'Under Review') => {
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
        await fetchApplications()
        toast({
          title: 'Success',
          description: `Application has been ${status.toLowerCase()}.`,
          variant: 'default'
        })
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to update application status',
          variant: 'destructive'
        })
      }
    } catch (err) {
      console.error('Error updating application:', err)
      toast({
        title: 'Error',
        description: 'Failed to update application status. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleApprove = (id: string) => {
    setModalApplicationId(id)
    setModalAction('Approved')
    setModalOpen(true)
  }

  const handleUnderReview = (id: string) => {
    setModalApplicationId(id)
    setModalAction('Under Review')
    setModalOpen(true)
  }

  const handleReject = (id: string) => {
    setModalApplicationId(id)
    setModalAction('Rejected')
    setModalOpen(true)
  }

  const handleModalConfirm = () => {
    if (modalApplicationId && modalAction) {
      updateApplicationStatus(modalApplicationId, modalAction)
    }
    setModalOpen(false)
    setModalApplicationId(null)
    setModalAction(null)
  }

  const handleModalCancel = () => {
    setModalOpen(false)
    setModalApplicationId(null)
    setModalAction(null)
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
              <option value="Submitted">Submitted</option>
              <option value="Under Review">Under Review</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
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
                  <tr key={app.id} className="hover:bg-slate-50 transition-colors cursor-pointer group">
                    <td className="px-6 py-4">
                      <Link 
                        href={`/dashboard/admin/applications/${app.id}`}
                        className="block"
                      >
                        <span className="font-mono text-sm text-slate-700 group-hover:text-[#053f52] transition-colors">
                          {app.reference}
                        </span>
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <Link 
                        href={`/dashboard/admin/applications/${app.id}`}
                        className="block"
                      >
                        <p className="font-medium text-slate-900 group-hover:text-[#053f52] transition-colors">
                          {app.applicant_name}
                        </p>
                        <p className="text-sm text-slate-500">{app.email}</p>
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <Link 
                        href={`/dashboard/admin/applications/${app.id}`}
                        className="block"
                      >
                        <p className="text-slate-900 group-hover:text-[#053f52] transition-colors">
                          {app.program}
                        </p>
                        <p className="text-sm text-slate-500">{app.grade}</p>
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <Link 
                        href={`/dashboard/admin/applications/${app.id}`}
                        className="block"
                      >
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
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <Link 
                        href={`/dashboard/admin/applications/${app.id}`}
                        className="block"
                      >
                        {getStatusBadge(app.status)}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <Link 
                        href={`/dashboard/admin/applications/${app.id}`}
                        className="block"
                      >
                        {getPaymentBadge(app.payment_status)}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      <Link 
                        href={`/dashboard/admin/applications/${app.id}`}
                        className="block group-hover:text-[#053f52] transition-colors"
                      >
                        {app.submitted_at}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                        <Link
                          href={`/dashboard/admin/applications/${app.id}`}
                          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                          title="View Full Details"
                        >
                          <Eye className="w-4 h-4 text-slate-600" />
                        </Link>
                        {app.status !== 'Approved' && (
                          <button
                            onClick={() => handleApprove(app.id)}
                            disabled={isUpdating}
                            className="p-2 hover:bg-green-100 rounded-lg transition-colors disabled:opacity-50"
                            title="Approve"
                          >
                            <Check className="w-4 h-4 text-green-600" />
                          </button>
                        )}
                        {app.status !== 'Under Review' && app.status !== 'Approved' && (
                          <button
                            onClick={() => handleUnderReview(app.id)}
                            disabled={isUpdating}
                            className="p-2 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-50"
                            title="Mark as Under Review"
                          >
                            <Clock className="w-4 h-4 text-blue-600" />
                          </button>
                        )}
                        {app.status !== 'Rejected' && (
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

      {/* Status Change Confirmation Modal */}
      <AlertDialog open={modalOpen} onOpenChange={setModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {modalAction ? modalConfig[modalAction].title : ''}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {modalAction ? modalConfig[modalAction].description : ''}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleModalCancel}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleModalConfirm}
              className={modalAction ? modalConfig[modalAction].confirmClass : ''}
            >
              {modalAction ? modalConfig[modalAction].confirmText : ''}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

