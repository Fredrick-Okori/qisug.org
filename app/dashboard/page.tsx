'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

import { SignOutButton, UserMenu } from '@/components/auth/sign-out-button'
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
  Loader2
} from 'lucide-react'
import Link from 'next/link'

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
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [applications, setApplications] = useState<Application[]>([])
  const [applicationsLoading, setApplicationsLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setLoading(false)
        router.push('/login?redirect=/dashboard')
        return
      }
      setUser(session.user)
      setLoading(false)
      fetchApplications(session.user.id)
    }
    checkUser()
  }, [router, supabase])

  const fetchApplications = async (userId: string) => {
    try {
      // Fetch applications for the current user
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
        .eq('applicant_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching applications:', error)
        return
      }

      // Transform the data
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#053f52]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-16 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#053f52]" style={{ fontFamily: "'Crimson Pro', serif" }}>
              My Dashboard
            </h1>
            <p className="text-gray-600 mt-1">Welcome back! Manage your applications here.</p>
          </div>
          <div className="flex items-center gap-4">
            <UserMenu user={user} />
            <SignOutButton variant="outline" />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <Link href="/admissions/apply-now" className="block">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-[#EFBF04]">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="w-12 h-12 bg-[#053f52] rounded-full flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">Start New Application</CardTitle>
                  <CardDescription>Begin your admission process</CardDescription>
                </div>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/admissions/how-to-apply" className="block">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-[#EFBF04]">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="w-12 h-12 bg-[#EFBF04] rounded-full flex items-center justify-center">
                  <FileText className="w-6 h-6 text-[#053f52]" />
                </div>
                <div>
                  <CardTitle className="text-lg">Application Guide</CardTitle>
                  <CardDescription>Learn how to apply</CardDescription>
                </div>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/more/downloads" className="block">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-[#EFBF04]">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                  <Upload className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">Upload Documents</CardTitle>
                  <CardDescription>Submit required documents</CardDescription>
                </div>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {/* Applications Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              My Applications
            </CardTitle>
            <CardDescription>
              Track the status of your admission applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            {applicationsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
              </div>
            ) : applications.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
                <p className="text-gray-500 mb-4">You haven't submitted any applications.</p>
                <Link href="/admissions/apply-now">
                  <Button className="bg-[#053f52] text-white">
                    Start Application
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50 rounded-lg gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getStatusColor(app.status)}`}>
                        {getStatusIcon(app.status)}
                      </div>
                      <div>
                        <h4 className="font-medium text-[#053f52]">
                          Grade {app.grade} - {app.stream} Stream
                        </h4>
                        <p className="text-sm text-gray-500">
                          {app.intake_month} {app.academic_year} • {app.program_name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
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
              </div>
            )}
          </CardContent>
        </Card>

        {/* Help Section */}
        <div className="mt-8 p-6 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-[#053f52] mb-2">Need Help?</h3>
          <p className="text-gray-600 mb-4">
            If you have any questions about your application or the admissions process,
            our team is here to help.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="mailto:admissions@qisug.ac.ug" className="text-[#053f52] hover:underline">
              admissions@qisug.ac.ug
            </a>
            <span className="text-gray-400">|</span>
            <a href="tel:+256414123456" className="text-[#053f52] hover:underline">
              +256 414 123 456
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

