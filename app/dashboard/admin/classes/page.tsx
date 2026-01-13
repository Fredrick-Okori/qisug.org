'use client'

import { useState, useEffect } from 'react'
import { 
  Search, 
  Plus, 
  Edit,
  Users,
  BookOpen,
  GraduationCap,
  X,
  Check,
  ChevronDown,
  UserCheck,
  ArrowRight
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useToast } from '@/hooks/use-toast'

// ============================================================================
// Types
// ============================================================================

interface ClassInfo {
  id: string
  name: string
  grade: number
  stream: string
  capacity: number
  applicantCount: number
  capacityPercentage: number
}

interface ApplicantInfo {
  id: string
  application_id: string
  first_name: string
  last_name: string
  email: string
  phone_primary: string
  qis_id: string | null
  program_id: string
  program_name: string
  grade: number
  stream: string
}

interface ProgramOption {
  id: string
  name: string
  grade: number
  stream: string
}

interface ClassesData {
  classes: ClassInfo[]
  applicants: ApplicantInfo[]
  programs: ProgramOption[]
}

// ============================================================================
// Mock Data (fallback when no API)
// ============================================================================

const mockClasses: ClassInfo[] = [
  { id: '1', name: 'Grade 9 Science', grade: 9, stream: 'Science', capacity: 30, applicantCount: 12, capacityPercentage: 40 },
  { id: '2', name: 'Grade 9 Arts', grade: 9, stream: 'Arts', capacity: 30, applicantCount: 8, capacityPercentage: 27 },
  { id: '3', name: 'Grade 10 Science', grade: 10, stream: 'Science', capacity: 30, applicantCount: 15, capacityPercentage: 50 },
  { id: '4', name: 'Grade 10 Arts', grade: 10, stream: 'Arts', capacity: 30, applicantCount: 10, capacityPercentage: 33 },
  { id: '5', name: 'Grade 11 Science', grade: 11, stream: 'Science', capacity: 30, applicantCount: 18, capacityPercentage: 60 },
  { id: '6', name: 'Grade 11 Arts', grade: 11, stream: 'Arts', capacity: 30, applicantCount: 14, capacityPercentage: 47 },
  { id: '7', name: 'Grade 12 Science', grade: 12, stream: 'Science', capacity: 30, applicantCount: 20, capacityPercentage: 67 },
  { id: '8', name: 'Grade 12 Arts', grade: 12, stream: 'Arts', capacity: 30, applicantCount: 16, capacityPercentage: 53 },
]

const mockApplicants: ApplicantInfo[] = [
  { id: '1', application_id: 'app-1', first_name: 'John', last_name: 'Smith', email: 'john@example.com', phone_primary: '+256 701 234567', qis_id: 'QIS-2026-00001', program_id: '1', program_name: 'Grade 9 Science', grade: 9, stream: 'Science' },
  { id: '2', application_id: 'app-2', first_name: 'Jane', last_name: 'Doe', email: 'jane@example.com', phone_primary: '+256 702 234567', qis_id: 'QIS-2026-00002', program_id: '1', program_name: 'Grade 9 Science', grade: 9, stream: 'Science' },
  { id: '3', application_id: 'app-3', first_name: 'Michael', last_name: 'Johnson', email: 'michael@example.com', phone_primary: '+256 703 234567', qis_id: 'QIS-2026-00003', program_id: '2', program_name: 'Grade 9 Arts', grade: 9, stream: 'Arts' },
  { id: '4', application_id: 'app-4', first_name: 'Emily', last_name: 'Brown', email: 'emily@example.com', phone_primary: '+256 704 234567', qis_id: 'QIS-2026-00004', program_id: '3', program_name: 'Grade 10 Science', grade: 10, stream: 'Science' },
  { id: '5', application_id: 'app-5', first_name: 'David', last_name: 'Wilson', email: 'david@example.com', phone_primary: '+256 705 234567', qis_id: 'QIS-2026-00005', program_id: '3', program_name: 'Grade 10 Science', grade: 10, stream: 'Science' },
  { id: '6', application_id: 'app-6', first_name: 'Sarah', last_name: 'Taylor', email: 'sarah@example.com', phone_primary: '+256 706 234567', qis_id: 'QIS-2026-00006', program_id: '5', program_name: 'Grade 11 Science', grade: 11, stream: 'Science' },
]

const mockPrograms: ProgramOption[] = [
  { id: '1', name: 'Grade 9 Science', grade: 9, stream: 'Science' },
  { id: '2', name: 'Grade 9 Arts', grade: 9, stream: 'Arts' },
  { id: '3', name: 'Grade 10 Science', grade: 10, stream: 'Science' },
  { id: '4', name: 'Grade 10 Arts', grade: 10, stream: 'Arts' },
  { id: '5', name: 'Grade 11 Science', grade: 11, stream: 'Science' },
  { id: '6', name: 'Grade 11 Arts', grade: 11, stream: 'Arts' },
  { id: '7', name: 'Grade 12 Science', grade: 12, stream: 'Science' },
  { id: '8', name: 'Grade 12 Arts', grade: 12, stream: 'Arts' },
]

export default function AdminClassesPage() {
  const [classes, setClasses] = useState<ClassInfo[]>([])
  const [applicants, setApplicants] = useState<ApplicantInfo[]>([])
  const [programs, setPrograms] = useState<ProgramOption[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGrade, setSelectedGrade] = useState<string>('all')
  const [selectedClass, setSelectedClass] = useState<ClassInfo | null>(null)
  const [showApplicantsModal, setShowApplicantsModal] = useState(false)
  const [showReassignModal, setShowReassignModal] = useState(false)
  const [selectedApplicant, setSelectedApplicant] = useState<ApplicantInfo | null>(null)
  const [newProgramId, setNewProgramId] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [useMockData, setUseMockData] = useState(false)
  const [refreshData, setRefreshData] = useState(false)
  const [editingClassId, setEditingClassId] = useState<string | null>(null)
  const [newCapacityValue, setNewCapacityValue] = useState<number>(0)
  const { toast } = useToast()

  // Fetch classes data from API
  useEffect(() => {
    const fetchClassesData = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('/api/admin/classes')
        const data = await response.json()
        
        if (data.success && data.data) {
          setClasses(data.data.classes)
          setApplicants(data.data.applicants)
          setPrograms(data.data.programs)
        } else {
          // Fallback to mock data
          console.log('Using mock data:', data.error)
          setUseMockData(true)
          setClasses(mockClasses)
          setApplicants(mockApplicants)
          setPrograms(mockPrograms)
        }
      } catch (error) {
        console.error('Error fetching classes data:', error)
        // Fallback to mock data
        setUseMockData(true)
        setClasses(mockClasses)
        setApplicants(mockApplicants)
        setPrograms(mockPrograms)
      } finally {
        setIsLoading(false)
      }
    }

    fetchClassesData()
  }, [refreshData])

  // Filter classes by grade
  const filteredClasses = selectedGrade === 'all' 
    ? classes 
    : classes.filter(cls => cls.grade === parseInt(selectedGrade))

  // Get applicants for a specific class
  const getApplicantsForClass = (classInfo: ClassInfo) => {
    return applicants.filter(app => app.grade === classInfo.grade && app.stream === classInfo.stream)
  }

  // Handle program reassignment
  const handleReassign = async () => {
    if (!selectedApplicant || !newProgramId) return

    setIsUpdating(true)
    try {
      const response = await fetch('/api/admin/classes', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          applicationId: selectedApplicant.application_id,
          newProgramId
        })
      })

      const data = await response.json()

      if (data.success) {
        // Trigger a data refresh
        setRefreshData(prev => !prev)
        toast({
          title: 'Success',
          description: 'Applicant has been reassigned successfully.',
          variant: 'default'
        })
        setShowReassignModal(false)
        setSelectedApplicant(null)
        setNewProgramId('')
      } else {
        throw new Error(data.error || 'Failed to reassign')
      }
    } catch (error) {
      console.error('Error reassigning applicant:', error)
      toast({
        title: 'Error',
        description: 'Failed to reassign applicant. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsUpdating(false)
    }
  }

  // Handle capacity update
  const handleCapacityUpdate = async (programId: string) => {
    setIsUpdating(true)
    try {
      const response = await fetch('/api/admin/classes', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          programId: programId,
          newCapacity: newCapacityValue
        })
      })

      const data = await response.json()

      if (data.success) {
        setRefreshData(prev => !prev)
        toast({
          title: 'Success',
          description: 'Class capacity has been updated.',
          variant: 'default'
        })
        setEditingClassId(null)
      } else {
        throw new Error(data.error || 'Failed to update capacity')
      }
    } catch (error) {
      console.error('Error updating capacity:', error)
      toast({
        title: 'Error',
        description: 'Failed to update capacity. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsUpdating(false)
    }
  }

  // Get capacity color
  const getCapacityColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-red-500'
    if (percentage >= 80) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  // Get capacity status
  const getCapacityStatus = (percentage: number) => {
    if (percentage >= 100) return { text: 'Full', class: 'text-red-600' }
    if (percentage >= 80) return { text: 'Filling Up', class: 'text-yellow-600' }
    return { text: 'Available', class: 'text-green-600' }
  }

  // Calculate overall stats
  const totalStudents = classes.reduce((sum, cls) => sum + cls.applicantCount, 0)
  const totalCapacity = classes.reduce((sum, cls) => sum + cls.capacity, 0)
  const overallCapacity = totalCapacity > 0 ? Math.round((totalStudents / totalCapacity) * 100) : 0

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-[#053f52] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Mock Data Banner */}
      {useMockData && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
          <div className="w-5 h-5 rounded-full bg-blue-400 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-bold">i</span>
          </div>
          <div>
            <p className="font-semibold text-blue-900">Demo Mode</p>
            <p className="text-sm text-blue-800">Showing sample data. Connect to Supabase to see real applicants.</p>
          </div>
        </div>
      )}
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Classes & Streams</h1>
          <p className="text-slate-600 mt-1">Manage approved applicants by program, grade and stream</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#053f52] focus:border-transparent bg-white"
          >
            <option value="all">All Grades</option>
            <option value="9">Grade 9</option>
            <option value="10">Grade 10</option>
            <option value="11">Grade 11</option>
            <option value="12">Grade 12</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-4 shadow-sm border border-slate-100"
        >
          <p className="text-sm text-slate-600">Total Classes</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{classes.length}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-4 shadow-sm border border-slate-100"
        >
          <p className="text-sm text-slate-600">Approved Students</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{totalStudents}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-4 shadow-sm border border-slate-100"
        >
          <p className="text-sm text-slate-600">Overall Capacity</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{overallCapacity}%</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-4 shadow-sm border border-slate-100"
        >
          <p className="text-sm text-slate-600">Available Spots</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{totalCapacity - totalStudents}</p>
        </motion.div>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.map((cls, index) => {
          const classApplicants = getApplicantsForClass(cls)
          const capacityStatus = getCapacityStatus(cls.capacityPercentage)
          
          return (
            <motion.div
              key={cls.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-4 border-b border-slate-100">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900">{cls.name}</h3>
                    <p className="text-sm text-slate-500">Stream {cls.stream}</p>
                  </div>
                  <span className={`text-xs font-medium ${capacityStatus.class}`}>
                    {capacityStatus.text}
                  </span>
                </div>
              </div>
              
              {/* Capacity Bar */}
              <div className="px-4 pt-3">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-slate-600">Capacity</span>
                  {editingClassId === cls.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={newCapacityValue}
                        onChange={(e) => setNewCapacityValue(parseInt(e.target.value, 10))}
                        className="w-16 text-right border border-slate-300 rounded-md px-1"
                        autoFocus
                      />
                      <button onClick={() => handleCapacityUpdate(cls.id)} disabled={isUpdating} className="p-1 hover:bg-green-100 rounded-md">
                        <Check className="w-4 h-4 text-green-600" />
                      </button>
                      <button onClick={() => setEditingClassId(null)} className="p-1 hover:bg-red-100 rounded-md">
                        <X className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900">
                        {cls.applicantCount}/{cls.capacity}
                      </span>
                      <button
                        onClick={() => {
                          setEditingClassId(cls.id)
                          setNewCapacityValue(cls.capacity)
                        }}
                        className="p-1 hover:bg-slate-100 rounded-md"
                        title="Edit Capacity"
                      >
                        <Edit className="w-3 h-3 text-slate-500" />
                      </button>
                    </div>
                  )}
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getCapacityColor(cls.capacityPercentage)} rounded-full transition-all`}
                    style={{ width: `${Math.min(cls.capacityPercentage, 100)}%` }}
                  />
                </div>
              </div>

              {/* Applicant Preview */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Users className="w-4 h-4" />
                    <span>{classApplicants.length} approved applicants</span>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedClass(cls)
                      setShowApplicantsModal(true)
                    }}
                    className="text-sm text-[#053f52] hover:text-[#0a4d63] font-medium flex items-center gap-1"
                  >
                    View All
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Applicant Avatars */}
                {classApplicants.length > 0 ? (
                  <div className="flex -space-x-2">
                    {classApplicants.slice(0, 5).map((app) => (
                      <div
                        key={app.id}
                        className="w-8 h-8 rounded-full bg-[#053f52] text-white flex items-center justify-center text-xs font-medium border-2 border-white"
                        title={`${app.first_name} ${app.last_name}`}
                      >
                        {app.first_name.charAt(0)}{app.last_name.charAt(0)}
                      </div>
                    ))}
                    {classApplicants.length > 5 && (
                      <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-medium border-2 border-white">
                        +{classApplicants.length - 5}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 italic">No applicants yet</p>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      {filteredClasses.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 text-center">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">No classes found for the selected grade</p>
        </div>
      )}

      {/* Applicants List Modal */}
      <AnimatePresence>
        {showApplicantsModal && selectedClass && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowApplicantsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{selectedClass.name}</h2>
                  <p className="text-sm text-slate-500">{getApplicantsForClass(selectedClass).length} Approved Applicants</p>
                </div>
                <button
                  onClick={() => setShowApplicantsModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              
              {/* Search */}
              <div className="p-4 border-b border-slate-100">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search applicants..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#053f52] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Applicants List */}
              <div className="overflow-y-auto max-h-[50vh] p-4 space-y-3">
                {getApplicantsForClass(selectedClass)
                  .filter(app => 
                    searchQuery === '' || 
                    `${app.first_name} ${app.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (app.qis_id?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
                  )
                  .map((app) => (
                    <div
                      key={app.id}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#053f52] text-white flex items-center justify-center font-medium">
                          {app.first_name.charAt(0)}{app.last_name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">
                            {app.first_name} {app.last_name}
                          </p>
                          <p className="text-sm text-slate-500">{app.email}</p>
                          {app.qis_id && (
                            <p className="text-xs text-slate-400 font-mono">{app.qis_id}</p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedApplicant(app)
                          setShowReassignModal(true)
                        }}
                        className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg hover:bg-[#053f52] hover:text-white transition-colors flex items-center gap-1"
                      >
                        <Edit className="w-3 h-3" />
                        Reassign
                      </button>
                    </div>
                  ))}
                
                {getApplicantsForClass(selectedClass).length === 0 && (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">No approved applicants in this class</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reassign Modal */}
      <AnimatePresence>
        {showReassignModal && selectedApplicant && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowReassignModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">Reassign Applicant</h2>
                <button
                  onClick={() => setShowReassignModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                {/* Current Assignment */}
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-500 mb-1">Current Assignment</p>
                  <p className="font-medium text-slate-900">
                    {selectedApplicant.program_name}
                  </p>
                </div>

                {/* Arrow */}
                <div className="flex justify-center">
                  <div className="w-8 h-8 rounded-full bg-[#053f52] text-white flex items-center justify-center">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>

                {/* New Program Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Reassign To
                  </label>
                  <select
                    value={newProgramId}
                    onChange={(e) => setNewProgramId(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#053f52] focus:border-transparent"
                  >
                    <option value="">Select a program</option>
                    {programs
                      .filter(p => p.id !== selectedApplicant?.program_id)
                      .map((program) => (
                        <option key={program.id} value={program.id}>
                          {program.name}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowReassignModal(false)}
                    className="flex-1 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-slate-700 font-medium"
                    disabled={isUpdating}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReassign}
                    disabled={!newProgramId || isUpdating}
                    className="flex-1 px-4 py-2 bg-[#053f52] text-white rounded-lg hover:bg-[#0a4d63] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isUpdating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Reassigning...
                      </>
                    ) : (
                      'Confirm Reassignment'
                    )}
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
