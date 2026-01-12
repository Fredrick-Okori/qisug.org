'use client'

import { useState, useEffect } from 'react'
import { 
  Search, 
  Filter, 
  FileText, 
  Check, 
  X, 
  Eye,
  Download,
  File,
  FileImage,
  FileType,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Document {
  id: string
  applicantName: string
  email: string
  documentType: string
  fileName: string
  fileSize: string
  uploadedAt: string
  status: 'pending' | 'verified' | 'rejected'
  notes?: string
}

const mockDocuments: Document[] = [
  { id: '1', applicantName: 'John Kamau', email: 'john@example.com', documentType: 'Birth Certificate', fileName: 'birth_certificate.pdf', fileSize: '245 KB', uploadedAt: '2024-01-15', status: 'pending' },
  { id: '2', applicantName: 'Sarah Mukiibi', email: 'sarah@example.com', documentType: 'Passport Photo', fileName: 'photo.jpg', fileSize: '125 KB', uploadedAt: '2024-01-14', status: 'verified' },
  { id: '3', applicantName: 'Michael Omondi', email: 'michael@example.com', documentType: 'Academic Transcript', fileName: 'transcript.pdf', fileSize: '1.2 MB', uploadedAt: '2024-01-14', status: 'pending' },
  { id: '4', applicantName: 'Emma Nakiwala', email: 'emma@example.com', documentType: 'Recommendation Letter', fileName: 'recommendation.pdf', fileSize: '890 KB', uploadedAt: '2024-01-13', status: 'rejected', notes: 'Letter is outdated - needs new one' },
  { id: '5', applicantName: 'David Ssentamu', email: 'david@example.com', documentType: 'Birth Certificate', fileName: 'birth_cert.pdf', fileSize: '312 KB', uploadedAt: '2024-01-13', status: 'pending' },
  { id: '6', applicantName: 'Grace Nakintu', email: 'grace@example.com', documentType: 'Passport Photo', fileName: 'passport_photo.jpg', fileSize: '98 KB', uploadedAt: '2024-01-12', status: 'verified' },
  { id: '7', applicantName: 'Robert Mukasa', email: 'robert@example.com', documentType: 'Academic Transcript', fileName: 'grades.pdf', fileSize: '2.1 MB', uploadedAt: '2024-01-11', status: 'pending' },
  { id: '8', applicantName: 'Alice Babirye', email: 'alice@example.com', documentType: 'Recommendation Letter', fileName: 'ref_letter.pdf', fileSize: '567 KB', uploadedAt: '2024-01-10', status: 'pending' },
]

export default function AdminDocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments)
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>(mockDocuments)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    let filtered = documents

    if (searchQuery) {
      filtered = filtered.filter(
        (doc) =>
          doc.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.fileName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((doc) => doc.status === statusFilter)
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter((doc) => doc.documentType === typeFilter)
    }

    setFilteredDocuments(filtered)
  }, [searchQuery, statusFilter, typeFilter, documents])

  const documentTypes = [...new Set(documents.map((d) => d.documentType))]

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      verified: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    }
    const icons: Record<string, React.ComponentType<{ className?: string }>> = {
      pending: Clock,
      verified: CheckCircle,
      rejected: XCircle,
    }
    const Icon = icons[status] || Clock
    const labels: Record<string, string> = {
      pending: 'Pending Review',
      verified: 'Verified',
      rejected: 'Rejected',
    }

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${styles[status]}`}>
        <Icon className="w-3 h-3" />
        {labels[status]}
      </span>
    )
  }

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase()
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext || '')) {
      return <FileImage className="w-5 h-5 text-blue-500" />
    }
    if (ext === 'pdf') {
      return <FileType className="w-5 h-5 text-red-500" />
    }
    return <File className="w-5 h-5 text-slate-500" />
  }

  const handleVerify = (id: string) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === id ? { ...doc, status: 'verified' } : doc
      )
    )
    setSelectedDocument(null)
  }

  const handleReject = (id: string) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === id ? { ...doc, status: 'rejected' } : doc
      )
    )
    setSelectedDocument(null)
  }

  const pendingCount = documents.filter((d) => d.status === 'pending').length
  const verifiedCount = documents.filter((d) => d.status === 'verified').length
  const rejectedCount = documents.filter((d) => d.status === 'rejected').length

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-[#053f52] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Document Review</h1>
          <p className="text-slate-600 mt-1">Review and verify uploaded documents</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-4 shadow-sm border border-slate-100"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Pending Review</p>
              <p className="text-2xl font-bold text-slate-900">{pendingCount}</p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-4 shadow-sm border border-slate-100"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Verified</p>
              <p className="text-2xl font-bold text-slate-900">{verifiedCount}</p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-4 shadow-sm border border-slate-100"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Rejected</p>
              <p className="text-2xl font-bold text-slate-900">{rejectedCount}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, or file..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#053f52] focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#053f52] focus:border-transparent bg-white"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending Review</option>
            <option value="verified">Verified</option>
            <option value="rejected">Rejected</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#053f52] focus:border-transparent bg-white"
          >
            <option value="all">All Types</option>
            {documentTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Document</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Applicant</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Size</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Uploaded</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDocuments.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {getFileIcon(doc.fileName)}
                      <div>
                        <p className="font-medium text-slate-900 truncate max-w-xs">{doc.fileName}</p>
                        <p className="text-xs text-slate-500">{doc.uploadedAt}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-slate-900">{doc.applicantName}</p>
                      <p className="text-sm text-slate-500">{doc.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-700">{doc.documentType}</td>
                  <td className="px-6 py-4 text-slate-600">{doc.fileSize}</td>
                  <td className="px-6 py-4">{getStatusBadge(doc.status)}</td>
                  <td className="px-6 py-4 text-slate-600">{doc.uploadedAt}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedDocument(doc)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4 text-slate-600" />
                      </button>
                      <button
                        className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Download"
                      >
                        <Download className="w-4 h-4 text-blue-600" />
                      </button>
                      {doc.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleVerify(doc.id)}
                            className="p-2 hover:bg-green-100 rounded-lg transition-colors"
                            title="Verify"
                          >
                            <Check className="w-4 h-4 text-green-600" />
                          </button>
                          <button
                            onClick={() => handleReject(doc.id)}
                            className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                            title="Reject"
                          >
                            <X className="w-4 h-4 text-red-600" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredDocuments.length === 0 && (
          <div className="px-6 py-12 text-center">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No documents found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Document Detail Modal */}
      <AnimatePresence>
        {selectedDocument && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedDocument(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getFileIcon(selectedDocument.fileName)}
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">{selectedDocument.fileName}</h2>
                    <p className="text-sm text-slate-500">{selectedDocument.documentType}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedDocument(null)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                {/* Document Preview Placeholder */}
                <div className="bg-slate-100 rounded-lg h-64 flex items-center justify-center">
                  <div className="text-center">
                    {getFileIcon(selectedDocument.fileName)}
                    <p className="text-slate-500 mt-2">Document Preview</p>
                    <button className="mt-2 px-4 py-2 bg-[#053f52] text-white rounded-lg hover:bg-[#0a4d63] transition-colors text-sm">
                      Open Full Preview
                    </button>
                  </div>
                </div>

                {/* Document Info */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Applicant Name</p>
                    <p className="font-semibold text-slate-900">{selectedDocument.applicantName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Email</p>
                    <p className="font-semibold text-slate-900">{selectedDocument.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">File Size</p>
                    <p className="font-semibold text-slate-900">{selectedDocument.fileSize}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Uploaded</p>
                    <p className="font-semibold text-slate-900">{selectedDocument.uploadedAt}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Status</p>
                    {getStatusBadge(selectedDocument.status)}
                  </div>
                </div>

                {selectedDocument.notes && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-red-800">Rejection Reason</p>
                        <p className="text-sm text-red-600 mt-1">{selectedDocument.notes}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                {selectedDocument.status === 'pending' && (
                  <div className="flex gap-3 pt-4 border-t border-slate-100">
                    <button
                      onClick={() => handleVerify(selectedDocument.id)}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      Verify Document
                    </button>
                    <button
                      onClick={() => handleReject(selectedDocument.id)}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Reject Document
                    </button>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    className="flex-1 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download
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

