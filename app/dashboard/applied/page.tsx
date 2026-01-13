'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  Eye,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Send,
  AlertCircle
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/auth/auth-context'
import { useRouter } from 'next/navigation'
import type { ApplicationStatus, IntakeMonth } from '@/types/database'

interface Application {
  id: string
  status: ApplicationStatus
  intake_month: IntakeMonth
  academic_year: string
  submitted_at: string | null
  created_at: string
  program_name: string
  grade: number
  stream: string
  program_id: string
}

// Status badge colors
const statusColors: Record<ApplicationStatus, string> = {
  'Draft': 'bg-gray-100 text-gray-700',
  'Submitted': 'bg-blue-100 text-blue-700',
  'Under Review': 'bg-yellow-100 text-yellow-700',
  'Approved': 'bg-green-100 text-green-700',
  'Rejected': 'bg-red-100 text-red-700'
}

// Stream badge colors
const streamColors: Record<string, string> = {
  'Science': 'bg-emerald-100 text-emerald-700',
  'Arts': 'bg-purple-100 text-purple-700'
}

const statusIcons: Record<ApplicationStatus, React.ReactNode> = {
  'Draft': <FileText className="w-4 h-4" />,
  'Submitted': <Send className="w-4 h-4" />,
  'Under Review': <Clock className="w-4 h-4" />,
  'Approved': <CheckCircle className="w-4 h-4" />,
  'Rejected': <XCircle className="w-4 h-4" />
}

const statusDescriptions: Record<ApplicationStatus, string> = {
  'Draft': 'Your application is being prepared',
  'Submitted': 'Your application has been received',
  'Under Review': 'Our team is reviewing your application',
  'Approved': 'Congratulations! Your application has been approved',
  'Rejected': 'Your application was not successful'
}

export default function AppliedStudentsPage() {
  const supabase = createClient()
  const { user, isSignedIn, loading: authLoading } = useAuth()
  const router = useRouter()
  
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | ''>('')
  const [page, setPage] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const limit = 10

  useEffect(() => {
    setMounted(true)
  }, [])

  const fetchApplications = useCallback(async () => {
    if (!user) return

    setLoading(true)
    try {
      // Step 1: Find the applicant record for this user
      // First try to find by user_id (if the column exists and is populated)
      // Fall back to email match for existing applications
      let applicantId: string | null = null

      // Try to get applicant by user_id first (preferred method)
      const { data: applicantByUserId } = await supabase
        .from('applicants')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (applicantByUserId) {
        applicantId = applicantByUserId.id
      } else {
        // Fallback: Find applicant by email (for existing applications before user_id was added)
        const { data: applicantByEmail } = await supabase
          .from('applicants')
          .select('id')
          .eq('email', user.email)
          .single()

        if (applicantByEmail) {
          applicantId = applicantByEmail.id
          
          // Update the applicant record with user_id for future lookups
          await supabase
            .from('applicants')
            .update({ user_id: user.id })
            .eq('id', applicantId)
        }
      }

      if (!applicantId) {
        console.log('No applicant found for this user')
        setApplications([])
        setTotalCount(0)
        setLoading(false)
        return
      }

      // Step 2: Query applications for this applicant
      let query = supabase
        .from('applications')
        .select(`
          id,
          applicant_id,
          status,
          intake_month,
          academic_year,
          submitted_at,
          created_at,
          programs (
            grade,
            stream,
            name
          )
        `, { count: 'exact' })
        .eq('applicant_id', applicantId)

      // Apply status filter
      if (statusFilter) {
        query = query.eq('status', statusFilter)
      }

      // Get paginated data
      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(page * limit, (page + 1) * limit - 1)

      if (error) {
        console.error('Error fetching applications:', error)
        setLoading(false)
        return
      }

      setTotalCount(count || 0)

      const formattedApplications: Application[] = (data || []).map((app: any) => ({
        id: app.id,
        status: app.status as ApplicationStatus,
        intake_month: app.intake_month as IntakeMonth,
        academic_year: app.academic_year,
        submitted_at: app.submitted_at,
        created_at: app.created_at,
        program_name: app.programs?.name || 'N/A',
        grade: app.programs?.grade || 0,
        stream: app.programs?.stream || 'N/A',
        program_id: app.programs?.id || ''
      }))

      setApplications(formattedApplications)
    } catch (error) {
      console.error('Error fetching applications:', error)
    } finally {
      setLoading(false)
    }
  }, [supabase, user, page, statusFilter])

  useEffect(() => {
    if (!mounted || authLoading) return

    if (!isSignedIn) {
      router.push('/login?redirect=/dashboard/applied')
      return
    }

    fetchApplications()
  }, [mounted, authLoading, isSignedIn, router, fetchApplications])

  const totalPages = Math.ceil(totalCount / limit)

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Filter applications locally for search
  const filteredApplications = applications.filter(app => {
    if (!search) return true
    const searchLower = search.toLowerCase()
    return (
      app.program_name.toLowerCase().includes(searchLower) ||
      app.status.toLowerCase().includes(searchLower) ||
      app.intake_month.toLowerCase().includes(searchLower)
    )
  })

  // Show loading state
  if (!mounted || authLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-slate-200 rounded mb-2" />
          <div className="h-4 w-64 bg-slate-200 rounded" />
        </div>
        <div className="bg-white rounded-xl p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-slate-200 rounded" />
            <div className="h-12 bg-slate-200 rounded" />
            <div className="h-12 bg-slate-200 rounded" />
          </div>
        </div>
      </div>
    )
  }

  // Show redirect if not signed in
  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#053f52] border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-600">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          My Applications
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Track the status of your admission applications
        </p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
          <p className="text-sm text-slate-500 dark:text-slate-400">Total</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalCount}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
          <p className="text-sm text-slate-500 dark:text-slate-400">Submitted</p>
          <p className="text-2xl font-bold text-blue-600">
            {applications.filter(a => a.status === 'Submitted').length}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
          <p className="text-sm text-slate-500 dark:text-slate-400">Under Review</p>
          <p className="text-2xl font-bold text-yellow-600">
            {applications.filter(a => a.status === 'Under Review').length}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
          <p className="text-sm text-slate-500 dark:text-slate-400">Approved</p>
          <p className="text-2xl font-bold text-green-600">
            {applications.filter(a => a.status === 'Approved').length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search applications..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(0)
              }}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#053f52]"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as ApplicationStatus | '')
                setPage(0)
              }}
              className="pl-10 pr-8 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#053f52] appearance-none"
            >
              <option value="">All Statuses</option>
              <option value="Draft">Draft</option>
              <option value="Submitted">Submitted</option>
              <option value="Under Review">Under Review</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#053f52]"></div>
            <p className="mt-2 text-slate-500 dark:text-slate-400">Loading your applications...</p>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="p-8 text-center">
            <FileText className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600" />
            <h3 className="mt-4 text-lg font-medium text-slate-900 dark:text-white">No applications found</h3>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              {search || statusFilter 
                ? 'Try adjusting your filters'
                : 'You haven\'t submitted any applications yet'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {filteredApplications.map((app) => (
              <div
                key={app.id}
                className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${statusColors[app.status]}`}>
                      {statusIcons[app.status]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-medium text-slate-900 dark:text-white">
                          Grade {app.grade} - {app.stream} Stream
                        </h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[app.status]}`}>
                          {app.status}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        {app.program_name} • {app.intake_month} {app.academic_year}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                        {statusDescriptions[app.status]}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 md:flex-shrink-0">
                    <div className="text-right">
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {app.submitted_at ? 'Submitted' : 'Created'}
                      </p>
                      <p className="text-sm text-slate-900 dark:text-white">
                        {formatDate(app.submitted_at || app.created_at)}
                      </p>
                    </div>
                    <button 
                      onClick={() => router.push(`/dashboard/applications/${app.id}`)}
                      className="p-2 text-slate-400 hover:text-[#053f52] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {filteredApplications.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Showing {page * limit + 1} to {Math.min((page + 1) * limit, totalCount)} of {totalCount} applications
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 0}
                className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="px-3 py-1 text-sm text-slate-600 dark:text-slate-400">
                Page {page + 1} of {totalPages || 1}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page >= totalPages - 1}
                className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Help Section */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-[#053f52] mt-0.5" />
          <div>
            <h4 className="font-medium text-[#053f52]">Need Help?</h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
              If you have questions about your application status, please contact admissions at{' '}
              <a href="mailto:admissions@qisug.ac.ug" className="text-[#053f52] hover:underline">
                admissions@qisug.ac.ug
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
