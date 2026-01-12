/**
 * Admin utility functions (client-safe)
 * These are utility functions that don't depend on server-only imports
 */

export type AdminRole = 'admin' | 'reviewer' | 'viewer'

export interface AdminUser {
  id: string
  user_id: string
  email: string
  full_name: string | null
  role: AdminRole
  is_active: boolean
  created_at: string
  updated_at: string
}

export function getRoleBadgeColor(role: AdminRole | string): string {
  switch (role) {
    case 'admin':
      return 'bg-red-100 text-red-800'
    case 'reviewer':
      return 'bg-blue-100 text-blue-800'
    case 'viewer':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export function getRoleDisplayName(role: AdminRole | string): string {
  switch (role) {
    case 'admin':
      return 'Administrator'
    case 'reviewer':
      return 'Reviewer'
    case 'viewer':
      return 'Viewer'
    default:
      return role ? role.charAt(0).toUpperCase() + role.slice(1) : ''
  }
}

export function getRoleDescription(role: AdminRole | string): string {
  switch (role) {
    case 'admin':
      return 'Full access to all admin features'
    case 'reviewer':
      return 'Can review and manage applications'
    case 'viewer':
      return 'Read-only access to dashboard'
    default:
      return 'Standard user access'
  }
}
