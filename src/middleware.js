import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  const protectedRoutes = ['/dashboard', '/clients', '/invoices', '/settings', '/api/clients', '/api/invoices'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute) {
    const token = request.cookies.get('devbill_token')?.value;

    if (!token) {
      if (pathname.startsWith('/api')) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Initialize a temporary client for validation
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      if (pathname.startsWith('/api')) {
        return NextResponse.json({ message: 'Invalid session' }, { status: 401 });
      }
      // Clear invalid cookie
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('devbill_token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login (login page)
     * - signup (signup page)
     */
    '/((?!_next/static|_next/image|favicon.ico|login|signup|api/auth).*)',
  ],
};
