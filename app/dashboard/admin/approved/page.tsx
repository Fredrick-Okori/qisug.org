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
  FileText
} from 'lucide-react'
import { motion } from 'framer-motion'

interface ApprovedStudent {
  id: string
  reference: string
  fullName: string
  email: string
  phone: string
  program: string
  grade: string
  approvedDate: string
  startDate: string
  status: 'confirmed' | 'pending_enrollment' | 'enrolled'
  parentName: string
  parentPhone: string
}

const mockStudents: ApprovedStudent[] = [
  { id: '1', reference: 'QIS-2024-001', fullName: 'John Kamau', email: 'john@example.com', phone: '+256 701234567', program: 'IB Diploma', grade: 'Grade 11', approvedDate: '2024-01-10', startDate: '2024-02-01', status: 'confirmed', parentName: 'Mr. James Kamau', parentPhone: '+256 701234568' },
  { id: '2', reference: 'QIS-2024-002', fullName: 'Sarah Mukiibi', email: 'sarah@example.com', phone: '+256 702345678', program: 'A-Level', grade: 'Grade 12', approvedDate: '2024-01-08', startDate: '2024-02-01', status: 'enrolled', parentName: 'Mrs. Grace Mukiibi', parentPhone: '+256 702345679' },
  { id: '3', reference: 'QIS-2024-003', fullName: 'Michael Omondi', email: 'michael@example.com', phone: '+256 703456789', program: 'IGCSE', grade: 'Grade 10', approvedDate: '2024-01-05', startDate: '2024-02-01', status: 'confirmed', parentName: 'Mr. Robert Omondi', parentPhone: '+256 703456780' },
  { id: '4', reference: 'QIS-2024-004', fullName: 'Emma Nakiwala', email: 'emma@example.com', phone: '+256 704567890', program: 'IB Diploma', grade: 'Grade 11', approvedDate: '2024-01-03', startDate: '2024-02-01', status: 'pending_enrollment', parentName: 'Dr. David Nakiwala', parentPhone: '+256 704567891' },
  { id: '5', reference: 'QIS-2024-005', fullName: 'David Ssentamu', email: 'david@example.com', phone: '+256 705678901', program: 'A-Level', grade: 'Grade 12', approvedDate: '2024-01-02', startDate: '2024-02-01', status: 'enrolled', parentName: 'Ms. Ruth Ssentamu', parentPhone: '+256 705678902' },
  { id: '6', reference: 'QIS-2024-006', fullName: 'Grace Nakintu', email: 'grace@example.com', phone: '+256 706789012', program: 'IB Diploma', grade: 'Grade 11', approvedDate: '2024-01-01', startDate: '2024-02-01', status: 'confirmed', parentName: 'Mr. Thomas Nakintu', parentPhone: '+256 706789013' },
  { id: '7', reference: 'QIS-2024-007', fullName: 'Robert Mukasa', email: 'robert@example.com', phone: '+256 707890123', program: 'IGCSE', grade: 'Grade 10', approvedDate: '2023-12-28', startDate: '2024-02-01', status: 'enrolled', parentName: 'Mrs. Alice Mukasa', parentPhone: '+256 707890124' },
  { id: '8', reference: 'QIS-2024-008', fullName: 'Alice Babirye', email: 'alice@example.com', phone: '+256 708901234', program: 'A-Level', grade: 'Grade 12', approvedDate: '2023-12-25', startDate: '2024-02-01', status: 'confirmed', parentName: 'Mr. Charles Babirye', parentPhone: '+256 708901235' },
]

export default function AdminApprovedPage() {
  const [students, setStudents] = useState<ApprovedStudent[]>([])
  const [filteredStudents, setFilteredStudents] = useState<ApprovedStudent[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [programFilter, setProgramFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('/api/admin/approved')
        const data = await response.json()
        
        if (data.success) {
          const mappedStudents = data.data.map((student: any) => ({
            id: student.id,
            reference: student.reference,
            fullName: student.applicant_name,
            email: student.email,
            phone: student.phone,
            program: student.program,
            grade: student.grade,
            approvedDate: student.approved_at ? new Date(student.approved_at).toLocaleDateString() : 'N/A',
            startDate: student.start_date ? new Date(student.start_date).toLocaleDateString() : 'N/A',
            status: student.confirmation_status === 'confirmed' ? 'confirmed' : student.confirmation_status === 'enrolled' ? 'enrolled' : 'pending_enrollment',
            parentName: student.parent_name || 'N/A',
            parentPhone: student.parent_phone || 'N/A',
          }))
          setStudents(mappedStudents)
          setError(null)
        } else {
          setError(data.error || 'Failed to fetch approved students')
          setStudents(mockStudents)
        }
      } catch (err) {
        console.error('Error fetching approved students:', err)
        setError('Failed to fetch approved students')
        setStudents(mockStudents)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStudents()
  }, [])

  useEffect(() => {
    let filtered = students

    if (searchQuery) {
      filtered = filtered.filter(
        (student) =>
          student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.reference.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (programFilter !== 'all') {
      filtered = filtered.filter((student) => student.program === programFilter)
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((student) => student.status === statusFilter)
    }

    setFilteredStudents(filtered)
  }, [searchQuery, programFilter, statusFilter, students])

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      confirmed: 'bg-green-100 text-green-800',
      enrolled: 'bg-blue-100 text-blue-800',
      pending_enrollment: 'bg-yellow-100 text-yellow-800',
    }
    const labels: Record<string, string> = {
      confirmed: 'Confirmed',
      enrolled: 'Enrolled',
      pending_enrollment: 'Pending Enrollment',
    }
    return (
      <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${styles[status]}`}>
        {labels[status]}
      </span>
    )
  }

  const confirmedCount = students.filter((s) => s.status === 'confirmed').length
  const enrolledCount = students.filter((s) => s.status === 'enrolled').length
  const pendingCount = students.filter((s) => s.status === 'pending_enrollment').length

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
          <h1 className="text-2xl font-bold text-slate-900">Approved Students</h1>
          <p className="text-slate-600 mt-1">Manage admitted and enrolled students</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors font-medium flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export List
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-4 shadow-sm border border-slate-100"
        >
          <p className="text-sm text-slate-600">Total Approved</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{students.length}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-4 shadow-sm border border-slate-100"
        >
          <p className="text-sm text-slate-600">Confirmed</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{confirmedCount}</p>
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
          <p className="text-sm text-slate-600">Pending Enrollment</p>
          <p className="text-2xl font-bold text-yellow-600 mt-1">{pendingCount}</p>
        </motion.div>
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
          <select
            value={programFilter}
            onChange={(e) => setProgramFilter(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#053f52] focus:border-transparent bg-white"
          >
            <option value="all">All Programs</option>
            <option value="IB Diploma">IB Diploma</option>
            <option value="A-Level">A-Level</option>
            <option value="IGCSE">IGCSE</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#053f52] focus:border-transparent bg-white"
          >
            <option value="all">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="enrolled">Enrolled</option>
            <option value="pending_enrollment">Pending Enrollment</option>
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Reference</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Program</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Approved</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Start Date</th>
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
                        <p className="font-medium text-slate-900">{student.fullName}</p>
                        <p className="text-sm text-slate-500">{student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-slate-900">{student.program}</p>
                      <p className="text-sm text-slate-500">{student.grade}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(student.status)}</td>
                  <td className="px-6 py-4 text-slate-600">{student.approvedDate}</td>
                  <td className="px-6 py-4 text-slate-600">{student.startDate}</td>
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

        {filteredStudents.length === 0 && (
          <div className="px-6 py-12 text-center">
            <CheckCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No approved students found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Program Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-blue-50 rounded-xl p-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-blue-600">IB Diploma</p>
              <p className="text-2xl font-bold text-blue-900">
                {students.filter((s) => s.program === 'IB Diploma').length}
              </p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-purple-50 rounded-xl p-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-purple-600">A-Level</p>
              <p className="text-2xl font-bold text-purple-900">
                {students.filter((s) => s.program === 'A-Level').length}
              </p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-amber-50 rounded-xl p-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-amber-600">IGCSE</p>
              <p className="text-2xl font-bold text-amber-900">
                {students.filter((s) => s.program === 'IGCSE').length}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

