import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const redirectParam = searchParams.get('redirect')
  
  // Default redirect for regular users
  const defaultNext = '/admissions/apply-now'

  if (code) {
    const cookieStore = await cookies()
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Check if user is an admin
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        // Check if user is an active admin
        const { data: adminUser } = await supabase
          .from('admin_users')
          .select('role, is_active')
          .eq('user_id', session.user.id)
          .eq('is_active', true)
          .single()

        // If user is an admin, redirect to admin dashboard
        if (adminUser && adminUser.is_active) {
          // Admin users go to admin dashboard
          return NextResponse.redirect(`${origin}/dashboard/admin`)
        }
      }

      // Regular users go to the intended page or default
      const next = redirectParam || defaultNext
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // If there's an error or no code, redirect to login
  return NextResponse.redirect(`${origin}/login?error=auth_failed`)
}

