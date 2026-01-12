'use client'

import { useState, useEffect } from 'react'
import { 
  Search, 
  Plus, 
  Edit,
  Trash2,
  Check,
  X,
  Shield,
  ShieldCheck,
  User
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface AdminUser {
  id: string
  email: string
  fullName: string
  role: 'admin' | 'reviewer' | 'viewer'
  isActive: boolean
  createdAt: string
  lastLogin: string
}

const mockAdminUsers: AdminUser[] = [
  { id: '1', email: 'admin@qisug.org', fullName: 'System Administrator', role: 'admin', isActive: true, createdAt: '2023-01-15', lastLogin: '2024-01-16' },
  { id: '2', email: 'john@qisug.org', fullName: 'John Kamau', role: 'reviewer', isActive: true, createdAt: '2023-06-20', lastLogin: '2024-01-15' },
  { id: '3', email: 'sarah@qisug.org', fullName: 'Sarah Mukiibi', role: 'reviewer', isActive: true, createdAt: '2023-08-10', lastLogin: '2024-01-14' },
  { id: '4', email: 'michael@qisug.org', fullName: 'Michael Omondi', role: 'viewer', isActive: false, createdAt: '2023-09-05', lastLogin: '2024-01-10' },
  { id: '5', email: 'emma@qisug.org', fullName: 'Emma Nakiwala', role: 'reviewer', isActive: true, createdAt: '2023-11-20', lastLogin: '2024-01-16' },
]

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [filteredUsers, setFilteredUsers] = useState<AdminUser[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/admin/users')
        const data = await response.json()
        
        if (data.success) {
          const mappedUsers = data.data.map((user: any) => ({
            id: user.id,
            email: user.email,
            fullName: user.full_name || user.email,
            role: user.role || 'viewer',
            isActive: user.is_active,
            createdAt: user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A',
            lastLogin: 'N/A',
          }))
          setUsers(mappedUsers)
          setError(null)
        } else {
          setError(data.error || 'Failed to fetch users')
          setUsers(mockAdminUsers)
        }
      } catch (err) {
        console.error('Error fetching users:', err)
        setError('Failed to fetch users')
        setUsers(mockAdminUsers)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [])

  useEffect(() => {
    let filtered = users

    if (searchQuery) {
      filtered = filtered.filter(
        (user) =>
          user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (roleFilter !== 'all') {
      filtered = filtered.filter((user) => user.role === roleFilter)
    }

    setFilteredUsers(filtered)
  }, [searchQuery, roleFilter, users])

  const getRoleBadge = (role: string) => {
    const styles: Record<string, string> = {
      admin: 'bg-red-100 text-red-800',
      reviewer: 'bg-blue-100 text-blue-800',
      viewer: 'bg-gray-100 text-gray-800',
    }
    const icons: Record<string, React.ComponentType<{ className?: string }>> = {
      admin: Shield,
      reviewer: ShieldCheck,
      viewer: User,
    }
    const Icon = icons[role] || User

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${styles[role] || 'bg-gray-100 text-gray-800'}`}>
        <Icon className="w-3 h-3" />
        {role ? role.charAt(0).toUpperCase() + role.slice(1) : ''}
      </span>
    )
  }

  const getStatusBadge = (isActive: boolean) => (
    <span className={`px-2 py-0.5 text-xs font-medium rounded ${isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
      {isActive ? 'Active' : 'Inactive'}
    </span>
  )

  const handleToggleActive = (userId: string) => {
    setUsers((prev) =>
      prev.map((user) => (user.id === userId ? { ...user, isActive: !user.isActive } : user))
    )
  }

  const handleDelete = (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers((prev) => prev.filter((user) => user.id !== userId))
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
          <h1 className="text-2xl font-bold text-slate-900">Admin Users</h1>
          <p className="text-slate-600 mt-1">Manage administrative user accounts and permissions</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-[#053f52] text-white rounded-lg hover:bg-[#0a4d63] transition-colors font-medium flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add New User
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-4 shadow-sm border border-slate-100"
        >
          <p className="text-sm text-slate-600">Total Users</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{users.length}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-4 shadow-sm border border-slate-100"
        >
          <p className="text-sm text-slate-600">Admins</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{users.filter((u) => u.role === 'admin').length}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-4 shadow-sm border border-slate-100"
        >
          <p className="text-sm text-slate-600">Reviewers</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{users.filter((u) => u.role === 'reviewer').length}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-4 shadow-sm border border-slate-100"
        >
          <p className="text-sm text-slate-600">Active Users</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{users.filter((u) => u.isActive).length}</p>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#053f52] focus:border-transparent"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#053f52] focus:border-transparent bg-white"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="reviewer">Reviewer</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Last Login</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-slate-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{user.fullName}</p>
                        <p className="text-sm text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
                  <td className="px-6 py-4">{getStatusBadge(user.isActive)}</td>
                  <td className="px-6 py-4 text-slate-600">{user.createdAt}</td>
                  <td className="px-6 py-4 text-slate-600">{user.lastLogin}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4 text-slate-600" />
                      </button>
                      <button
                        onClick={() => handleToggleActive(user.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          user.isActive ? 'hover:bg-yellow-100' : 'hover:bg-green-100'
                        }`}
                        title={user.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {user.isActive ? (
                          <X className="w-4 h-4 text-yellow-600" />
                        ) : (
                          <Check className="w-4 h-4 text-green-600" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit User Modal */}
      <AnimatePresence>
        {selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedUser(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">Edit User</h2>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    defaultValue={selectedUser.fullName}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#053f52] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    defaultValue={selectedUser.email}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#053f52] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                  <select
                    defaultValue={selectedUser.role}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#053f52] focus:border-transparent bg-white"
                  >
                    <option value="admin">Admin</option>
                    <option value="reviewer">Reviewer</option>
                    <option value="viewer">Viewer</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="flex-1 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setSelectedUser(null)}
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

      {/* Add User Modal */}
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
                <h2 className="text-xl font-bold text-slate-900">Add New User</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter full name"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#053f52] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="Enter email address"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#053f52] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                  <select className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#053f52] focus:border-transparent bg-white">
                    <option value="viewer">Viewer</option>
                    <option value="reviewer">Reviewer</option>
                    <option value="admin">Admin</option>
                  </select>
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
                    className="flex-1 px-4 py-2 bg-[#053f52] text-white rounded-lg hover:bg-[#0a4d63] transition-colors font-medium"
                  >
                    Add User
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

