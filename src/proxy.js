import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function proxy(request) {
  const { pathname } = request.nextUrl;
  const authHeader = request.headers.get('authorization');
  const headerToken = authHeader?.startsWith('Bearer ')
    ? authHeader.slice('Bearer '.length)
    : null;
  const cookieToken = request.cookies.get('devbill_token')?.value;
  const token = headerToken || cookieToken;

  const protectedRoutes = ['/dashboard', '/clients', '/invoices', '/settings', '/api/clients', '/api/invoices'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute) {
    if (!token) {
      console.warn('[proxy] Missing auth cookie for protected route', { pathname });
      if (pathname.startsWith('/api')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const supabase = createServerSupabaseClient(token);

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    console.log('[proxy] Session validation', {
      pathname,
      userId: user?.id ?? null,
      error: error?.message ?? null,
    });

    if (error || !user) {
      if (pathname.startsWith('/api')) {
        return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
      }
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('devbill_token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|login|signup|api/auth).*)',
  ],
};
