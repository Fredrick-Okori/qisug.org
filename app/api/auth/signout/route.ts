import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const supabase = await createClient()
    
    if (supabase) {
      // Sign out from Supabase
      await supabase.auth.signOut()
    }
    
    // Clear all Supabase-related cookies on the server side
    const response = NextResponse.json({ success: true })
    
    const cookieNames = [
      'sb-access-token',
      'sb-refresh-token',
      'sb-provider-token',
      'supabase-auth-token',
      'auth-token',
      'session'
    ]
    
    cookieNames.forEach(name => {
      response.cookies.set(name, '', {
        expires: new Date(0),
        path: '/',
      })
    })
    
    return response
  } catch (error) {
    console.error('Server sign out error:', error)
    return NextResponse.json({ error: 'Sign out failed' }, { status: 500 })
  }
}

