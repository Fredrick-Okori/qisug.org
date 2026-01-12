'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { 
  LogOut, 
  Loader2, 
  AlertCircle,
  CheckCircle 
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import type { User, Session } from '@supabase/supabase-js'

interface SignOutButtonProps {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  showIcon?: boolean
  children?: React.ReactNode
}

export function SignOutButton({ 
  variant = 'outline', 
  size = 'default',
  showIcon = true,
  children 
}: SignOutButtonProps) {
  const router = useRouter()
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSignOut = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        setError(error.message)
      } else {
        // Redirect to home page after successful sign out
        router.push('/')
        router.refresh()
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size}>
          {showIcon && <LogOut className="w-4 h-4 mr-2" />}
          {children || 'Sign Out'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LogOut className="w-5 h-5" />
            Sign Out
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to sign out of your account?
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 mb-4">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div className="text-sm text-gray-600">
            <p>You will need to sign in again to access:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Your application dashboard</li>
              <li>Application status tracking</li>
              <li>Document uploads</li>
            </ul>
          </div>
        </div>

        <DialogFooter className="sm:justify-end">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setIsOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleSignOut}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Signing out...
              </>
            ) : (
              <>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Hook for checking authentication status
export function useAuth() {
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user || null)
      setLoading(false)
    }
    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event: any, session: Session | null) => {
        setUser(session?.user || null)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase])

  return { user, loading }
}

// Component for showing user email in header
export function UserMenu({ user }: { user: User | null }) {
  if (!user) return null

  const userInitials = user.email?.split('@')[0]?.slice(0, 2).toUpperCase() || 'U'

  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 bg-[#053f52] rounded-full flex items-center justify-center text-white text-sm font-medium">
        {userInitials}
      </div>
      <span className="text-sm text-gray-700 hidden sm:block">
        {user.email}
      </span>
    </div>
  )
}

