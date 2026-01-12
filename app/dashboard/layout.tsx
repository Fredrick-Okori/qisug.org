import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createServerClient } from '@supabase/ssr'
import ApplicantSidebar from './parts/applicant-sidebar'
import AdminSidebar from './parts/sidebar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login?redirect=/dashboard')
  }

  // Check if user is an admin
  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('*')
    .eq('user_id', session.user.id)
    .eq('is_active', true)
    .single()

  const isAdmin = !!adminUser

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Dynamic Sidebar based on user role */}
      {isAdmin ? <AdminSidebar /> : <ApplicantSidebar />}

      {/* Content Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}

