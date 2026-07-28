/**
 * Supabase Heartbeat
 *
 * Free-tier Supabase projects auto-pause after a week with no API activity.
 * This route runs on a schedule (see vercel.json) and issues a trivial query
 * so the project always looks active. It carries no other side effects.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret) return true // no secret configured — allow (e.g. local testing)

  if (request.headers.get('authorization') === `Bearer ${secret}`) return true
  return request.nextUrl.searchParams.get('secret') === secret
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ ok: false, error: 'Supabase is not configured' }, { status: 500 })
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
  })

  const { error } = await supabase.from('admin_users').select('id').limit(1)

  if (error) {
    console.error('[Heartbeat] Supabase query failed:', error.message)
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, timestamp: new Date().toISOString() })
}
