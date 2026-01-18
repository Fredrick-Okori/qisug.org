'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Download, 
  Check, 
  X, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock,
  User,
  GraduationCap,
  Building,
  CreditCard,
  Briefcase,
  DollarSign
} from 'lucide-react'
import { motion } from 'framer-motion'
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
import { createClient } from '@/lib/supabase/client'
import { sendPaymentApprovedEmail } from '@/lib/email-service'

interface Document {
  id: string
  document_type: string
  file_name: string
  file_path?: string
  file_url?: string
  file_error?: string | null
  file_size?: number
  mime_type?: string
  is_verified: boolean
  verified_by?: string
  verified_at?: string
  uploaded_at: string
}

interface AcademicHistory {
  id: string
  school_name: string
  province: string
  country: string
  start_date: string
  end_date: string
  grade_completed: string
  is_current: boolean
  certificate_url?: string
}

interface Agent {
  id: string
  agent_id_number: string
  agency_name: string
  agent_name: string
  address: string
  phone_primary: string
  phone_other: string
  email: string
  authorized_to_receive_info: boolean
  commission_rate?: number
  notes?: string
}

interface Payment {
  id: string | null
  amount: number
  status: string
  payment_method: string
  transaction_id: string
  created_at: string
  slip_verified?: boolean
}

interface Application {
  id: string
  reference: string
  academic_year: string
  intake_month: string
  status: 'Submitted' | 'Under Review' | 'Approved' | 'Rejected'
  has_agent: boolean
  submitted_at: string
  declaration_signed: boolean
  declaration_date?: string
  notes?: string
  applicant: {
    id: string
    qis_id: string
    first_name: string
    middle_name: string
    preferred_name: string
    last_name: string
    full_name: string
    birth_date: string
    gender: string
    citizenship_type: string
    citizenship_country: string
    email: string
    phone_primary: string
    phone_other: string
    address: string
    address_street: string
    address_city: string
    address_district: string
    address_postal_code: string
    address_country: string
    emergency_contact_name: string
    emergency_contact_phone: string
    emergency_contact_email: string
  }
  program: {
    id: string
    name: string
    grade: string
    stream: string
    description: string
  }
  documents: Document[]
  academic_history: AcademicHistory[]
  agent: Agent | null
  payment: Payment
}

export default function ApplicationDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [application, setApplication] = useState<Application | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showApproveDialog, setShowApproveDialog] = useState(false)
  const [statusDialogConfig, setStatusDialogConfig] = useState<{
    show: boolean
    status: 'Approved' | 'Rejected' | 'Under Review' | null
  }>({ show: false, status: null })
  const { toast } = useToast()

  useEffect(() => {
    fetchApplicationDetails()
  }, [resolvedParams.id])

  const fetchApplicationDetails = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/applications/${resolvedParams.id}`)
      const data = await response.json()

      if (data.success && data.data) {
        console.log('Application data loaded:', {
          id: data.data.id,
          application_fee_paid: data.data.payment?.status,
          transaction_id: data.data.payment?.transaction_id
        })
        setApplication(data.data)
        setError(null)
      } else {
        setError(data.error || 'Failed to fetch application details')
      }
    } catch (err) {
      console.error('Error fetching application:', err)
      setError('Failed to fetch application details. Please check your connection.')
    } finally {
      setIsLoading(false)
    }
  }

  const updateApplicationStatus = async (status: 'Approved' | 'Rejected' | 'Under Review') => {
    setStatusDialogConfig({ show: true, status })
  }

  const confirmUpdateStatus = async () => {
    const status = statusDialogConfig.status
    if (!status) return

    setStatusDialogConfig({ show: false, status: null })
    setIsUpdating(true)
    try {
      const response = await fetch('/api/admin/applications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId: resolvedParams.id,
          status
        })
      })

      const data = await response.json()

      if (data.success) {
        await fetchApplicationDetails()
        toast({
          title: 'Success',
          description: `Application has been ${status.toLowerCase()}.`,
          variant: 'default'
        })
      } else {
        toast({
          title: 'Error',
          description: data.error || `Failed to ${status.toLowerCase()} application`,
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

  const approvePayment = async () => {
    setShowApproveDialog(true)
  }

  const confirmApprovePayment = async () => {
    setShowApproveDialog(false)
    setIsUpdating(true)
    
    try {
      const supabase = createClient()
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast({
          title: 'Error',
          description: 'You must be logged in to approve payments',
          variant: 'destructive'
        })
        setIsUpdating(false)
        return
      }

      // Generate a payment reference if one doesn't exist
      const paymentRef = application?.payment?.transaction_id && application?.payment?.transaction_id !== 'N/A' 
        ? application.payment.transaction_id
        : `PAY-${Date.now()}`

      // Update the application directly - set application_fee_paid to true
      // Also set payment_reference to satisfy the trigger requirement
      const { data, error } = await supabase
        .from('applications')
        .update({
          application_fee_paid: true,
          payment_reference: paymentRef,
          status: application?.status === 'Submitted' ? 'Under Review' : application?.status,
          reviewed_at: new Date().toISOString(),
          reviewed_by: user.id,
          updated_at: new Date().toISOString()
        })
        .eq('id', resolvedParams.id)
        .select()
        .single()

      if (error) {
        console.error('Error approving payment:', error)
        toast({
          title: 'Error',
          description: 'Failed to approve payment: ' + error.message,
          variant: 'destructive'
        })
      } else {
        console.log('Payment approved successfully:', data)
        
        // Send email notification to applicant
        if (application?.applicant?.email && application?.applicant?.full_name) {
          try {
            await sendPaymentApprovedEmail(
              application.applicant.email,
              application.applicant.full_name,
              application.reference
            )
            console.log('Payment approval email sent to:', application.applicant.email)
          } catch (emailError) {
            console.error('Failed to send payment approval email:', emailError)
          }
        }
        
        // Refresh the data
        await fetchApplicationDetails()
        toast({
          title: 'Success',
          description: 'Payment has been approved. Applicant has been notified via email.',
          variant: 'default'
        })
      }
    } catch (err) {
      console.error('Error approving payment:', err)
      toast({
        title: 'Error',
        description: 'Failed to approve payment. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const resetPayment = async () => {
    if (!confirm('Are you sure you want to reset the payment status to pending?')) {
      return
    }

    setIsUpdating(true)
    try {
      const supabase = createClient()
      
      // Update the application - set application_fee_paid to false
      // Clear the payment_reference as well
      const { data, error } = await supabase
        .from('applications')
        .update({
          application_fee_paid: false,
          payment_reference: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', resolvedParams.id)
        .select()
        .single()

      if (error) {
        console.error('Error resetting payment:', error)
        toast({
          title: 'Error',
          description: 'Failed to reset payment: ' + error.message,
          variant: 'destructive'
        })
      } else {
        console.log('Payment reset successfully:', data)
        await fetchApplicationDetails()
        toast({
          title: 'Success',
          description: 'Payment status has been reset to pending.',
          variant: 'default'
        })
      }
    } catch (err) {
      console.error('Error resetting payment:', err)
      toast({
        title: 'Error',
        description: 'Failed to reset payment. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      Submitted: 'bg-blue-100 text-blue-800',
      'Under Review': 'bg-yellow-100 text-yellow-800',
      Approved: 'bg-green-100 text-green-800',
      Rejected: 'bg-red-100 text-red-800',
    }
    return (
      <span className={`px-3 py-1 text-sm font-medium rounded-full ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    )
  }

  const getDocStatusIcon = (verified: boolean) => {
    if (verified) {
      return <CheckCircle className="w-5 h-5 text-green-500" />
    }
    return <Clock className="w-5 h-5 text-yellow-500" />
  }

  const getDocTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      passport: 'Passport',
      transcript: 'Transcript',
      recommendation: 'Recommendation Letter',
      photo: 'Passport Photo',
      birth_certificate: 'Birth Certificate',
      previous_school: 'Previous School Report',
      medical_form: 'Medical Form',
      grade_report: 'Grade Report',
      certificate: 'Certificate',
      other: 'Other Document',
    }
    return labels[type] || type.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
  }

  // Helper to get document URL - prefer file_url (full URL) over file_path
  const getDocumentUrl = (doc: Document) => {
    if (doc.file_url && doc.file_url.startsWith('http')) {
      return doc.file_url
    }
    return doc.file_path || ''
  }

  // Check if document has a valid accessible URL
  const isDocumentAccessible = (doc: Document) => {
    return !!getDocumentUrl(doc) && !doc.file_error
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A'
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-[#053f52] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !application) {
    return (
      <div className="space-y-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center gap-3">
          <div className="w-5 h-5 rounded-full bg-yellow-400 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-bold">!</span>
          </div>
          <div>
            <p className="font-semibold text-yellow-900">{error || 'Application not found'}</p>
          </div>
        </div>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-[#053f52] text-white rounded-lg hover:bg-[#042d3d] transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Applications
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Application Details</h1>
            <p className="text-slate-600 font-mono">{application.reference}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {getStatusBadge(application.status)}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        {application.status !== 'Approved' && (
          <button
            onClick={() => updateApplicationStatus('Approved')}
            disabled={isUpdating}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            {isUpdating ? 'Processing...' : 'Approve'}
          </button>
        )}
        {application.status !== 'Under Review' && application.status !== 'Approved' && (
          <button
            onClick={() => updateApplicationStatus('Under Review')}
            disabled={isUpdating}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 flex items-center gap-2"
          >
            <Clock className="w-4 h-4" />
            {isUpdating ? 'Processing...' : 'Mark as Under Review'}
          </button>
        )}
        {application.status !== 'Rejected' && (
          <button
            onClick={() => updateApplicationStatus('Rejected')}
            disabled={isUpdating}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            {isUpdating ? 'Processing...' : 'Reject'}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Applicant Information */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-slate-100 p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#053f52]/10 rounded-lg">
                <User className="w-5 h-5 text-[#053f52]" />
              </div>
              <h2 className="text-lg font-semibold text-slate-900">Applicant Information</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-slate-500 mb-1">Full Name</p>
                <p className="font-semibold text-slate-900">{application.applicant.full_name}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">QIS ID</p>
                <p className="font-mono text-sm text-slate-900">{application.applicant.qis_id}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Preferred Name</p>
                <p className="font-semibold text-slate-900">{application.applicant.preferred_name || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Date of Birth</p>
                <p className="font-semibold text-slate-900">{application.applicant.birth_date}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Gender</p>
                <p className="font-semibold text-slate-900">{application.applicant.gender || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Citizenship</p>
                <p className="font-semibold text-slate-900">{application.applicant.citizenship_country}</p>
              </div>
              <div className="col-span-2 md:col-span-3">
                <p className="text-sm text-slate-500 mb-1">Email</p>
                <p className="font-semibold text-slate-900">{application.applicant.email}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Phone (Primary)</p>
                <p className="font-semibold text-slate-900">{application.applicant.phone_primary}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Phone (Other)</p>
                <p className="font-semibold text-slate-900">{application.applicant.phone_other || '-'}</p>
              </div>
              <div className="col-span-2 md:col-span-3">
                <p className="text-sm text-slate-500 mb-1">Address</p>
                <p className="font-semibold text-slate-900">{application.applicant.address || '-'}</p>
              </div>
              
              {/* Emergency Contact */}
              <div className="col-span-2 md:col-span-3 pt-4 border-t border-slate-100 mt-2">
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Emergency Contact</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Name</p>
                    <p className="font-semibold text-slate-900">{application.applicant.emergency_contact_name || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Phone</p>
                    <p className="font-semibold text-slate-900">{application.applicant.emergency_contact_phone || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Email</p>
                    <p className="font-semibold text-slate-900">{application.applicant.emergency_contact_email || '-'}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Program Details */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-slate-100 p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#053f52]/10 rounded-lg">
                <GraduationCap className="w-5 h-5 text-[#053f52]" />
              </div>
              <h2 className="text-lg font-semibold text-slate-900">Program Details</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-slate-500 mb-1">Program</p>
                <p className="font-semibold text-slate-900">{application.program.name}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Grade</p>
                <p className="font-semibold text-slate-900">{application.program.grade}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Stream</p>
                <p className="font-semibold text-slate-900">{application.program.stream || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Academic Year</p>
                <p className="font-semibold text-slate-900">{application.academic_year}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Intake Month</p>
                <p className="font-semibold text-slate-900">{application.intake_month}</p>
              </div>
            </div>
          </motion.div>

          {/* Academic History */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-slate-100 p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#053f52]/10 rounded-lg">
                <Building className="w-5 h-5 text-[#053f52]" />
              </div>
              <h2 className="text-lg font-semibold text-slate-900">Academic History</h2>
            </div>
            
            {application.academic_history && application.academic_history.length > 0 ? (
              <div className="space-y-4">
                {application.academic_history.map((school, index) => (
                  <div key={school.id || index} className="bg-slate-50 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-slate-900">{school.school_name}</h3>
                        <p className="text-sm text-slate-600">{school.province}, {school.country}</p>
                        <p className="text-sm text-slate-500 mt-1">
                          {school.start_date} - {school.end_date}
                          {school.is_current && (
                            <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                              Current
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-500">Grade Completed</p>
                        <p className="font-semibold text-slate-900">{school.grade_completed}</p>
                      </div>
                    </div>
                    {school.certificate_url && (
                      <a
                        href={school.certificate_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 mt-3 text-sm text-[#053f52] hover:underline"
                      >
                        <FileText className="w-4 h-4" />
                        View Certificate
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-50 rounded-lg p-8 text-center">
                <Building className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">No academic history provided</p>
              </div>
            )}
          </motion.div>

          {/* Documents */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-slate-100 p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#053f52]/10 rounded-lg">
                <FileText className="w-5 h-5 text-[#053f52]" />
              </div>
              <h2 className="text-lg font-semibold text-slate-900">Uploaded Documents</h2>
            </div>
            
            {application.documents && application.documents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {application.documents.map((doc, index) => {
                  // Check if document is a payment slip (case-insensitive, partial match)
                  const isPaymentSlip = doc.document_type && 
                    (doc.document_type.toLowerCase().includes('payment') || 
                     doc.document_type.toLowerCase().includes('slip'))
                  return (
                    <div key={doc.id || index} className={`bg-slate-50 rounded-lg p-4 ${isPaymentSlip ? 'border-green-200 border' : ''}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <FileText className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isPaymentSlip ? 'text-green-600' : 'text-[#053f52]'}`} />
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-slate-900">{getDocTypeLabel(doc.document_type)}</p>
                            <p className="text-sm text-slate-500 truncate">{doc.file_name}</p>
                            <p className="text-xs text-slate-400">{formatFileSize(doc.file_size)}</p>
                            {doc.file_error && (
                              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                <XCircle className="w-3 h-3" />
                                {doc.file_error}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                          {getDocStatusIcon(doc.is_verified)}
                          <span className={`px-2 py-1 text-xs font-medium rounded ${
                            doc.is_verified 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {doc.is_verified ? 'Verified' : 'Pending'}
                          </span>
                        </div>
                      </div>
                      {isDocumentAccessible(doc) ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                          <a
                            href={getDocumentUrl(doc)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#053f52] text-white rounded-lg hover:bg-[#042d3d] transition-colors text-sm font-medium"
                          >
                            <FileText className="w-4 h-4" />
                            View
                          </a>
                          {getDocumentUrl(doc).match(/\.(jpg|jpeg|png|gif)$/i) && (
                            <a
                              href={getDocumentUrl(doc)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium"
                            >
                              <Download className="w-4 h-4" />
                              Download
                            </a>
                          )}
                          {/* Approve Payment button for payment slip documents */}
                          {isPaymentSlip && (
                            <button
                              onClick={approvePayment}
                              disabled={isUpdating || application.payment.status === 'completed'}
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ml-auto ${
                                application.payment.status === 'completed'
                                  ? 'bg-green-100 text-green-700 cursor-default'
                                  : 'bg-green-600 text-white hover:bg-green-700'
                              }`}
                            >
                              <Check className="w-4 h-4" />
                              {application.payment.status === 'completed' ? 'Approved' : 'Approve Payment'}
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="mt-3">
                          <p className="text-xs text-amber-600 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Document pending upload or storage unavailable
                          </p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="bg-slate-50 rounded-lg p-8 text-center">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">No documents uploaded yet</p>
              </div>
            )}
          </motion.div>

          {/* Agent Information */}
          {application.has_agent && application.agent && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-sm border border-slate-100 p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-[#053f52]/10 rounded-lg">
                  <Briefcase className="w-5 h-5 text-[#053f52]" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900">Agent Information</h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Agent Name</p>
                  <p className="font-semibold text-slate-900">{application.agent.agent_name}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Agency</p>
                  <p className="font-semibold text-slate-900">{application.agent.agency_name}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Agent ID</p>
                  <p className="font-mono text-sm text-slate-900">{application.agent.agent_id_number}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Email</p>
                  <p className="font-semibold text-slate-900">{application.agent.email}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Phone</p>
                  <p className="font-semibold text-slate-900">{application.agent.phone_primary}</p>
                </div>
                <div className="col-span-2 md:col-span-3">
                  <p className="text-sm text-slate-500 mb-1">Address</p>
                  <p className="font-semibold text-slate-900">{application.agent.address}</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Application Info */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-slate-100 p-6"
          >
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Application Info</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-500 mb-1">Submitted</p>
                <p className="font-semibold text-slate-900">{application.submitted_at}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Declaration Signed</p>
                <div className="flex items-center gap-2">
                  {application.declaration_signed ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                  <span className="font-semibold text-slate-900">
                    {application.declaration_signed ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
              {application.declaration_date && (
                <div>
                  <p className="text-sm text-slate-500 mb-1">Declaration Date</p>
                  <p className="font-semibold text-slate-900">{application.declaration_date}</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Payment Information */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-slate-100 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[#053f52]/10 rounded-lg">
                <CreditCard className="w-5 h-5 text-[#053f52]" />
              </div>
              <h2 className="text-lg font-semibold text-slate-900">Payment</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-500 mb-1">Amount</p>
                <p className="font-bold text-xl text-slate-900">
                  ${application.payment.amount.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Status</p>
                {application.payment.status === 'completed' ? (
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800">
                      Completed
                    </span>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                ) : (
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                    application.payment.status === 'pending' 
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {application.payment.status.charAt(0).toUpperCase() + application.payment.status.slice(1)}
                  </span>
                )}
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Method</p>
                <p className="font-semibold text-slate-900">{application.payment.payment_method}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Transaction ID</p>
                <p className="font-mono text-xs text-slate-900">{application.payment.transaction_id}</p>
              </div>
              
              {/* Payment Status Indicator */}
              <div className="pt-4 border-t border-slate-100">
                <p className="text-sm text-slate-500 mb-2">Payment Status</p>
                {application.payment.status === 'completed' ? (
                  <div className="flex items-center gap-2 bg-green-50 text-green-700 rounded-lg p-3">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Payment Approved</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 bg-yellow-50 text-yellow-700 rounded-lg p-3">
                    <Clock className="w-5 h-5" />
                    <span className="font-medium">Payment Pending Approval</span>
                  </div>
                )}
              </div>
              
              {/* Approve Payment Button */}
              <div className="pt-4 border-t border-slate-100">
                {application.payment.status !== 'completed' ? (
                  <button
                    onClick={approvePayment}
                    disabled={isUpdating || !application.payment.transaction_id || application.payment.transaction_id === 'N/A'}
                    className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    {isUpdating ? 'Processing...' : 'Approve Payment'}
                  </button>
                ) : (
                  <div className="w-full px-4 py-3 bg-green-100 text-green-700 rounded-lg flex items-center justify-center gap-2 font-medium">
                    <CheckCircle className="w-5 h-5" />
                    Payment Approved
                  </div>
                )}
                {!application.payment.transaction_id || application.payment.transaction_id === 'N/A' ? (
                  <p className="text-xs text-amber-600 mt-2 text-center">
                    Payment reference required before approval
                  </p>
                ) : null}
              </div>
            </div>
          </motion.div>

          {/* Notes */}
          {application.notes && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm border border-slate-100 p-6"
            >
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Notes</h2>
              <p className="text-slate-700 whitespace-pre-wrap">{application.notes}</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Approve Payment Confirmation Dialog */}
      <AlertDialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Payment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve this payment? This will mark the application fee as paid and update the payment status to completed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmApprovePayment}>
              Approve Payment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Status Change Confirmation Dialog */}
      <AlertDialog open={statusDialogConfig.show} onOpenChange={(open) => !open && setStatusDialogConfig({ show: false, status: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {statusDialogConfig.status === 'Approved' && 'Approve Application'}
              {statusDialogConfig.status === 'Under Review' && 'Mark as Under Review'}
              {statusDialogConfig.status === 'Rejected' && 'Reject Application'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {statusDialogConfig.status === 'Approved' && 'Are you sure you want to approve this application? This will change the status to Approved.'}
              {statusDialogConfig.status === 'Under Review' && 'Are you sure you want to mark this application as Under Review?'}
              {statusDialogConfig.status === 'Rejected' && 'Are you sure you want to reject this application? This action cannot be undone.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setStatusDialogConfig({ show: false, status: null })}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmUpdateStatus}
              className={
                statusDialogConfig.status === 'Approved' ? 'bg-green-600 hover:bg-green-700 text-white' :
                statusDialogConfig.status === 'Rejected' ? 'bg-red-600 hover:bg-red-700 text-white' :
                'bg-blue-600 hover:bg-blue-700 text-white'
              }
            >
              {statusDialogConfig.status === 'Approved' && 'Approve'}
              {statusDialogConfig.status === 'Under Review' && 'Mark as Under Review'}
              {statusDialogConfig.status === 'Rejected' && 'Reject'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

