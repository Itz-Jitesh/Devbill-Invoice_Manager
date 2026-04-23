import { createServerSupabaseClient } from '@/lib/supabase-server';

export function getRequestAccessToken(request) {
  const authHeader = request.headers.get('authorization');

  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }

  const cookie = request.headers.get('cookie');
  if (!cookie) {
    return null;
  }

  const match = cookie.match(/devbill_token=([^;]+)/);
  return match ? match[1] : null;
}

/**
 * Verify authentication using Supabase.
 *
 * @param {Request} request - The incoming Web Request object
 * @returns {{ user: object } | { error: string, status: number }}
 */
export async function verifyAuth(request) {
  const token = getRequestAccessToken(request);

  if (!token || token === 'undefined' || token === 'null') {
    console.warn('[verifyAuth] No token found in header or cookie');
    return { error: 'Please provide a valid authentication token', status: 401 };
  }

  try {
    const supabase = createServerSupabaseClient(token);
    console.log('[verifyAuth] Verifying session', { tokenPrefix: token.slice(0, 10) });

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      console.error('[verifyAuth] Auth failed. Error:', error?.message || 'User not found');
      return { error: 'Token is invalid or has expired', status: 401 };
    }

    console.log('[verifyAuth] Authenticated user', { userId: user.id, email: user.email });

    return {
      supabase,
      token,
      user: {
        ...user,
        _id: user.id,
      },
    };
  } catch (error) {
    console.error('Auth verification error:', error.message);
    return { error: 'Internal server error during auth', status: 500 };
  }
}
