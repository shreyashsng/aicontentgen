import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If user is signed in and trying to access the home page,
  // redirect them to dashboard
  if (session && req.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // If user is not signed in and trying to access protected routes,
  // redirect them to home page
  if (!session && (
    req.nextUrl.pathname.startsWith('/dashboard') || 
    req.nextUrl.pathname.startsWith('/api/generate-caption')
  )) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return res
}

export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/api/generate-caption'
  ]
} 