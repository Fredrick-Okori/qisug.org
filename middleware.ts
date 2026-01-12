import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // Check if Supabase environment variables are configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // If not configured, skip Supabase operations (allows build to complete)
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('[Middleware] Supabase not configured, skipping auth checks')
    // Still protect admin routes even without Supabase
    if (request.nextUrl.pathname.startsWith('/admin')) {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/login'
      redirectUrl.searchParams.set('redirect', request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }
    return supabaseResponse
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          supabaseResponse = NextResponse.next({
            request,
          })
          supabaseResponse.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          supabaseResponse = NextResponse.next({
            request,
          })
          supabaseResponse.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Protect admin routes - require authentication AND admin role
  if (request.nextUrl.pathname.startsWith('/dashboard/admin')) {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = '/login'
        redirectUrl.searchParams.set('redirect', request.nextUrl.pathname)
        return NextResponse.redirect(redirectUrl)
      }

      // Check if user is an active admin (any role: admin, reviewer, viewer)
      const { data: adminUser } = await supabase
        .from('admin_users')
        .select('role, is_active')
        .eq('user_id', session.user.id)
        .eq('is_active', true)
        .single()

      if (!adminUser) {
        // User is logged in but not an admin
        // Redirect to student dashboard instead of login to avoid confusion
        const dashboardUrl = request.nextUrl.clone()
        dashboardUrl.pathname = '/dashboard'
        return NextResponse.redirect(dashboardUrl)
      }
      // Admin users (admin, reviewer, viewer) are allowed access
    } catch (error) {
      console.error('[Middleware] Admin auth check error:', error)
      // On error, redirect to login
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/login'
      redirectUrl.searchParams.set('redirect', request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }
  }

  // Keep old /admin routes protection for backward compatibility
  if (request.nextUrl.pathname.startsWith('/admin')) {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = '/login'
        redirectUrl.searchParams.set('redirect', request.nextUrl.pathname)
        return NextResponse.redirect(redirectUrl)
      }

      // Check if user is an active admin (any role: admin, reviewer, viewer)
      const { data: adminUser } = await supabase
        .from('admin_users')
        .select('role, is_active')
        .eq('user_id', session.user.id)
        .eq('is_active', true)
        .single()

      if (!adminUser) {
        // User is logged in but not an admin
        // Redirect to student dashboard instead of login to avoid confusion
        const dashboardUrl = request.nextUrl.clone()
        dashboardUrl.pathname = '/dashboard'
        return NextResponse.redirect(dashboardUrl)
      }
      // Admin users (admin, reviewer, viewer) are allowed access
    } catch (error) {
      console.error('[Middleware] Admin auth check error:', error)
      // On error, redirect to login
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/login'
      redirectUrl.searchParams.set('redirect', request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }
  }

  // Protect dashboard routes (require authentication)
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = '/login'
        redirectUrl.searchParams.set('redirect', request.nextUrl.pathname)
        return NextResponse.redirect(redirectUrl)
      }
    } catch (error) {
      console.error('[Middleware] Dashboard auth check error:', error)
      // On error, redirect to login
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/login'
      redirectUrl.searchParams.set('redirect', request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    '/admin/:path*',
    '/dashboard/:path*',
  ],
}

