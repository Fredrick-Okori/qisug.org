'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/auth/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  FileText, 
  Send, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  GraduationCap,
  Upload,
  ChevronRight,
  Loader2,
  Plus,
  ExternalLink
} from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface Application {
  id: string
  status: string
  intake_month: string
  academic_year: string
  submitted_at: string | null
  program_name: string
  grade: number
  stream: string
}

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClient()
  const { user, fullName, isSignedIn, loading: authLoading } = useAuth()
  const [applications, setApplications] = useState<Application[]>([])
  const [applicationsLoading, setApplicationsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || authLoading) return

    if (!isSignedIn) {
      router.push('/login?redirect=/dashboard')
      return
    }

    fetchApplications()
  }, [mounted, authLoading, isSignedIn, router])

  const fetchApplications = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) return

      const { data, error } = await supabase
        .from('applications')
        .select(`
          id,
          status,
          intake_month,
          academic_year,
          submitted_at,
          programs (
            grade,
            stream,
            name
          )
        `)
        .eq('applicant_id', session.user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching applications:', error)
        return
      }

      const formattedApplications = data?.map((app: any) => ({
        id: app.id,
        status: app.status,
        intake_month: app.intake_month,
        academic_year: app.academic_year,
        submitted_at: app.submitted_at,
        program_name: app.programs?.name || 'N/A',
        grade: app.programs?.grade || 0,
        stream: app.programs?.stream || 'N/A'
      })) || []

      setApplications(formattedApplications)
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setApplicationsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft': return 'bg-gray-100 text-gray-800'
      case 'Submitted': return 'bg-blue-100 text-blue-800'
      case 'Under Review': return 'bg-yellow-100 text-yellow-800'
      case 'Accepted': return 'bg-green-100 text-green-800'
      case 'Rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Draft': return <FileText className="w-4 h-4" />
      case 'Submitted': return <Send className="w-4 h-4" />
      case 'Under Review': return <Clock className="w-4 h-4" />
      case 'Accepted': return <CheckCircle className="w-4 h-4" />
      case 'Rejected': return <AlertCircle className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  const getStatusDescription = (status: string) => {
    switch (status) {
      case 'Draft': return 'Your application is being prepared'
      case 'Submitted': return 'Your application has been received'
      case 'Under Review': return 'Our team is reviewing your application'
      case 'Accepted': return 'Congratulations! Your application has been approved'
      case 'Rejected': return 'Your application was not successful'
      default: return 'Status pending'
    }
  }

  // Show loading state
  if (!mounted || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#053f52] border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-600">Loading your portal...</p>
        </div>
      </div>
    )
  }

  // Show redirect message if not signed in
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#053f52]" style={{ fontFamily: "'Crimson Pro', serif" }}>
            My Dashboard
          </h1>
          <p className="text-slate-600 mt-1">
            Welcome back, {fullName || user?.email?.split('@')[0] || 'Student'}! 
            Manage your applications and track their progress.
          </p>
        </div>
        <Link href="/admissions/apply-now">
          <Button className="bg-[#053f52] hover:bg-[#0a4d63] flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Start New Application
          </Button>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#053f52] to-[#042a3a] rounded-xl p-6 text-white"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#EFBF04] rounded-full flex items-center justify-center">
              <FileText className="w-6 h-6 text-[#053f52]" />
            </div>
            <div>
              <p className="text-blue-100 text-sm">Total Applications</p>
              <p className="text-3xl font-bold">{applications.length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-slate-100"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-slate-600 text-sm">Accepted</p>
              <p className="text-3xl font-bold text-slate-900">
                {applications.filter(a => a.status === 'Accepted').length}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-slate-100"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-slate-600 text-sm">Under Review</p>
              <p className="text-3xl font-bold text-slate-900">
                {applications.filter(a => a.status === 'Under Review' || a.status === 'Submitted').length}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Applications Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                My Applications
              </CardTitle>
              <CardDescription>
                Track the status of your admission applications
              </CardDescription>
            </div>
            {applications.length > 0 && (
              <Link href="/dashboard/applied">
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  View All
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            )}
          </CardHeader>
          <CardContent>
            {applicationsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
              </div>
            ) : applications.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">No applications yet</h3>
                <p className="text-slate-500 mb-6 max-w-md mx-auto">
                  You haven't started any applications. Begin your journey with Queensgate International School today!
                </p>
                <Link href="/admissions/apply-now">
                  <Button className="bg-[#053f52] text-white hover:bg-[#0a4d63]">
                    <Plus className="w-4 h-4 mr-2" />
                    Start Your First Application
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.slice(0, 3).map((app) => (
                  <div
                    key={app.id}
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-slate-50 rounded-lg gap-4 hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getStatusColor(app.status)}`}>
                        {getStatusIcon(app.status)}
                      </div>
                      <div>
                        <h4 className="font-medium text-[#053f52]">
                          Grade {app.grade} - {app.stream} Stream
                        </h4>
                        <p className="text-sm text-slate-500">
                          {app.program_name} • {app.intake_month} {app.academic_year}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          {getStatusDescription(app.status)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(app.status)}`}>
                        {app.status}
                      </span>
                      {app.status === 'Draft' && (
                        <Link href={`/admissions/apply-now?edit=${app.id}`}>
                          <Button size="sm" variant="outline">
                            Continue
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
                
                {applications.length > 3 && (
                  <div className="text-center pt-4">
                    <Link href="/dashboard/applied">
                      <Button variant="outline" className="flex items-center gap-2 mx-auto">
                        View All {applications.length} Applications
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/admissions/apply-now" className="block">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-[#EFBF04] h-full">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#053f52] rounded-full flex items-center justify-center">
                    <Plus className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">New Application</CardTitle>
                    <CardDescription>Apply for a new program</CardDescription>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admissions/how-to-apply" className="block">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-[#EFBF04] h-full">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#EFBF04] rounded-full flex items-center justify-center">
                    <FileText className="w-6 h-6 text-[#053f52]" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Application Guide</CardTitle>
                    <CardDescription>Learn how to apply</CardDescription>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/more/downloads" className="block">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-[#EFBF04] h-full">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                    <Upload className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Upload Documents</CardTitle>
                    <CardDescription>Submit required documents</CardDescription>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </motion.div>

      {/* Help Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-blue-50 rounded-xl p-6"
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-[#053f52] rounded-full flex items-center justify-center flex-shrink-0">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-[#053f52]">Need Help?</h3>
            <p className="text-slate-600 mt-1">
              If you have any questions about your application or the admissions process, 
              our team is here to help.
            </p>
            <div className="flex flex-wrap gap-4 mt-3">
              <a href="mailto:admissions@qisug.ac.ug" className="text-[#053f52] hover:underline text-sm">
                admissions@qisug.ac.ug
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

