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

  if (!token) {
    return { error: 'Please provide a valid authentication token', status: 401 };
  }

  try {
    // 2. Use Supabase to verify the token and get the user
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return { error: 'Token is invalid or has expired', status: 401 };
    }

    // Hydrate local user ID (normalized to match MongoDB style if needed, 
    // but here we just map id to _id for frontend compatibility if necessary)
    return { 
      user: {
        ...user,
        _id: user.id // Maintain compatibility with frontend expecting _id
      } 
    };
  } catch (error) {
    console.error('Auth verification error:', error.message);
    return { error: 'Internal server error during auth', status: 500 };
  }
}
