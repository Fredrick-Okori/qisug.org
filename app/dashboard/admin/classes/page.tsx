'use client'

import { useState, useEffect } from 'react'
import { 
  Search, 
  Plus, 
  Edit,
  Trash2,
  Users,
  BookOpen,
  GraduationCap,
  X,
  Check
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Class {
  id: string
  name: string
  program: string
  stream: string
  capacity: number
  currentEnrollment: number
  classTeacher: string
  room: string
  schedule: string
  status: 'active' | 'inactive' | 'full'
}

const mockClasses: Class[] = [
  { id: '1', name: 'IB Diploma Year 1', program: 'IB Diploma', stream: 'A', capacity: 25, currentEnrollment: 22, classTeacher: 'Mrs. Sarah K.', room: 'Room 101', schedule: 'Mon-Fri, 8:00-15:00', status: 'active' },
  { id: '2', name: 'IB Diploma Year 2', program: 'IB Diploma', stream: 'A', capacity: 25, currentEnrollment: 25, classTeacher: 'Mr. John M.', room: 'Room 102', schedule: 'Mon-Fri, 8:00-15:00', status: 'full' },
  { id: '3', name: 'A-Level Lower', program: 'A-Level', stream: 'Science', capacity: 30, currentEnrollment: 28, classTeacher: 'Dr. Emily R.', room: 'Room 201', schedule: 'Mon-Fri, 8:00-15:00', status: 'active' },
  { id: '4', name: 'A-Level Upper', program: 'A-Level', stream: 'Arts', capacity: 25, currentEnrollment: 20, classTeacher: 'Ms. Lisa T.', room: 'Room 202', schedule: 'Mon-Fri, 8:00-15:00', status: 'active' },
  { id: '5', name: 'IGCSE Year 10', program: 'IGCSE', stream: 'A', capacity: 30, currentEnrollment: 30, classTeacher: 'Mr. Robert W.', room: 'Room 301', schedule: 'Mon-Fri, 8:00-15:00', status: 'full' },
  { id: '6', name: 'IGCSE Year 11', program: 'IGCSE', stream: 'A', capacity: 30, currentEnrollment: 18, classTeacher: 'Mrs. Anna S.', room: 'Room 302', schedule: 'Mon-Fri, 8:00-15:00', status: 'active' },
  { id: '7', name: 'A-Level Lower', program: 'A-Level', stream: 'Commerce', capacity: 28, currentEnrollment: 15, classTeacher: 'Mr. David L.', room: 'Room 203', schedule: 'Mon-Fri, 8:00-15:00', status: 'active' },
]

const programs = ['IB Diploma', 'A-Level', 'IGCSE']
const streams = ['A', 'B', 'Science', 'Arts', 'Commerce']

export default function AdminClassesPage() {
  const [classes, setClasses] = useState<Class[]>(mockClasses)
  const [filteredClasses, setFilteredClasses] = useState<Class[]>(mockClasses)
  const [searchQuery, setSearchQuery] = useState('')
  const [programFilter, setProgramFilter] = useState<string>('all')
  const [selectedClass, setSelectedClass] = useState<Class | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    let filtered = classes

    if (searchQuery) {
      filtered = filtered.filter(
        (cls) =>
          cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cls.stream.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cls.classTeacher.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (programFilter !== 'all') {
      filtered = filtered.filter((cls) => cls.program === programFilter)
    }

    setFilteredClasses(filtered)
  }, [searchQuery, programFilter, classes])

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      full: 'bg-yellow-100 text-yellow-800',
    }
    const labels: Record<string, string> = {
      active: 'Active',
      inactive: 'Inactive',
      full: 'Full',
    }
    return (
      <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${styles[status]}`}>
        {labels[status]}
      </span>
    )
  }

  const getCapacityColor = (current: number, capacity: number) => {
    const ratio = current / capacity
    if (ratio >= 1) return 'bg-red-500'
    if (ratio >= 0.8) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const totalStudents = classes.reduce((sum, cls) => sum + cls.currentEnrollment, 0)
  const totalCapacity = classes.reduce((sum, cls) => sum + cls.capacity, 0)
  const activeClasses = classes.filter((cls) => cls.status === 'active').length

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this class?')) {
      setClasses((prev) => prev.filter((cls) => cls.id !== id))
    }
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
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Classes & Streams</h1>
          <p className="text-slate-600 mt-1">Manage school classes and stream assignments</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-[#053f52] text-white rounded-lg hover:bg-[#0a4d63] transition-colors font-medium flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add New Class
        </button>
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
          <p className="text-sm text-slate-600">Active Classes</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{activeClasses}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-4 shadow-sm border border-slate-100"
        >
          <p className="text-sm text-slate-600">Total Students</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{totalStudents}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-4 shadow-sm border border-slate-100"
        >
          <p className="text-sm text-slate-600">Overall Capacity</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{Math.round((totalStudents / totalCapacity) * 100)}%</p>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search classes..."
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
            {programs.map((program) => (
              <option key={program} value={program}>{program}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.map((cls) => (
          <motion.div
            key={cls.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden"
          >
            <div className="p-4 border-b border-slate-100">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900">{cls.name}</h3>
                  <p className="text-sm text-slate-500">{cls.program} - Stream {cls.stream}</p>
                </div>
                {getStatusBadge(cls.status)}
              </div>
            </div>
            <div className="p-4 space-y-3">
              {/* Capacity Bar */}
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-slate-600">Capacity</span>
                  <span className="font-medium text-slate-900">{cls.currentEnrollment}/{cls.capacity}</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getCapacityColor(cls.currentEnrollment, cls.capacity)} rounded-full transition-all`}
                    style={{ width: `${(cls.currentEnrollment / cls.capacity) * 100}%` }}
                  />
                </div>
              </div>

              {/* Class Details */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                  <Users className="w-4 h-4" />
                  <span>Class Teacher: <span className="font-medium text-slate-900">{cls.classTeacher}</span></span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <BookOpen className="w-4 h-4" />
                  <span>{cls.room}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <GraduationCap className="w-4 h-4" />
                  <span>{cls.schedule}</span>
                </div>
              </div>
            </div>
            <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedClass(cls)}
                className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                title="Edit"
              >
                <Edit className="w-4 h-4 text-slate-600" />
              </button>
              <button
                onClick={() => handleDelete(cls.id)}
                className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredClasses.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 text-center">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">No classes found matching your criteria</p>
        </div>
      )}

      {/* Add Class Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">Add New Class</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Class Name</label>
                  <input
                    type="text"
                    placeholder="e.g., IB Diploma Year 1"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#053f52] focus:border-transparent"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Program</label>
                    <select className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#053f52] focus:border-transparent bg-white">
                      {programs.map((program) => (
                        <option key={program} value={program}>{program}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Stream</label>
                    <select className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#053f52] focus:border-transparent bg-white">
                      {streams.map((stream) => (
                        <option key={stream} value={stream}>{stream}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Capacity</label>
                    <input
                      type="number"
                      placeholder="25"
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#053f52] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Room</label>
                    <input
                      type="text"
                      placeholder="Room 101"
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#053f52] focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Class Teacher</label>
                  <input
                    type="text"
                    placeholder="e.g., Mrs. Sarah K."
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#053f52] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Schedule</label>
                  <input
                    type="text"
                    placeholder="e.g., Mon-Fri, 8:00-15:00"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#053f52] focus:border-transparent"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-2 bg-[#053f52] text-white rounded-lg hover:bg-[#0a4d63] transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Add Class
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Class Modal */}
      <AnimatePresence>
        {selectedClass && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedClass(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">Edit Class</h2>
                <button
                  onClick={() => setSelectedClass(null)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Class Name</label>
                  <input
                    type="text"
                    defaultValue={selectedClass.name}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#053f52] focus:border-transparent"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Program</label>
                    <select
                      defaultValue={selectedClass.program}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#053f52] focus:border-transparent bg-white"
                    >
                      {programs.map((program) => (
                        <option key={program} value={program}>{program}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Stream</label>
                    <select
                      defaultValue={selectedClass.stream}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#053f52] focus:border-transparent bg-white"
                    >
                      {streams.map((stream) => (
                        <option key={stream} value={stream}>{stream}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Capacity</label>
                    <input
                      type="number"
                      defaultValue={selectedClass.capacity}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#053f52] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Room</label>
                    <input
                      type="text"
                      defaultValue={selectedClass.room}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#053f52] focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Class Teacher</label>
                  <input
                    type="text"
                    defaultValue={selectedClass.classTeacher}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#053f52] focus:border-transparent"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setSelectedClass(null)}
                    className="flex-1 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setSelectedClass(null)}
                    className="flex-1 px-4 py-2 bg-[#053f52] text-white rounded-lg hover:bg-[#0a4d63] transition-colors font-medium"
                  >
                    Save Changes
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

