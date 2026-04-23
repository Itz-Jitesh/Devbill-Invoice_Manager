import supabase from './supabase';

/**
 * Verify authentication using Supabase.
 *
 * @param {Request} request - The incoming Web Request object
 * @returns {{ user: object } | { error: string, status: number }}
 */
export async function verifyAuth(request) {
  // 1. Get session/user from Supabase
  // The backend can use headers or cookies. 
  // Since we set 'devbill_token' in cookies, we could use that, 
  // but supabase.auth.getUser() is the standard way if the client is configured.
  
  const authHeader = request.headers.get('authorization');
  let token = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else {
    // Check cookies as fallback (handled by Next.js headers)
    const cookie = request.headers.get('cookie');
    if (cookie) {
      const match = cookie.match(/devbill_token=([^;]+)/);
      if (match) token = match[1];
    }
  }

  if (!token || token === 'undefined' || token === 'null') {
    console.warn('[verifyAuth] No token found in header or cookie');
    return { error: 'Please provide a valid authentication token', status: 401 };
  }

  try {
    // 2. Use Supabase to verify the token and get the user
    console.log('[verifyAuth] Verifying token (prefix):', token.substring(0, 10));
    let { data: { user }, error } = await supabase.auth.getUser(token);

    // If header token fails, try the cookie if it's different
    if ((error || !user) && request.headers.get('cookie')) {
      const cookieMatch = request.headers.get('cookie').match(/devbill_token=([^;]+)/);
      const cookieToken = cookieMatch ? cookieMatch[1] : null;
      
      if (cookieToken && cookieToken !== token) {
        console.log('[verifyAuth] Header token failed, trying cookie token...');
        const cookieResult = await supabase.auth.getUser(cookieToken);
        if (!cookieResult.error && cookieResult.data.user) {
          user = cookieResult.data.user;
          error = null;
        }
      }
    }

    if (error || !user) {
      console.error('[verifyAuth] Auth failed. Error:', error?.message || 'User not found');
      return { error: 'Token is invalid or has expired', status: 401 };
    }

    return { 
      user: {
        ...user,
        _id: user.id 
      } 
    };
  } catch (error) {
    console.error('Auth verification error:', error.message);
    return { error: 'Internal server error during auth', status: 500 };
  }
}
