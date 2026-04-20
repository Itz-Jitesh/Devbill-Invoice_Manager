import jwt from 'jsonwebtoken';
import connectDB from './db';
import User from '@/models/user.model';

/**
 * Verify JWT from the Authorization: Bearer <token> header.
 *
 * Usage inside a route handler:
 *   const auth = await verifyAuth(request)
 *   if (auth.error) return Response.json({ message: auth.error }, { status: auth.status })
 *   const user = auth.user
 *
 * @param {Request} request - The incoming Web Request object
 * @returns {{ user: object } | { error: string, status: number }}
 */
export async function verifyAuth(request) {
  const authHeader = request.headers.get('authorization');

  // 1. Check Authorization header format
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'Please provide a valid authentication token', status: 401 };
  }

  const token = authHeader.split(' ')[1];

  try {
    // 2. Verify and decode JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Hydrate user from DB (excluding password)
    await connectDB();
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return { error: 'User not found', status: 401 };
    }

    return { user };
  } catch (error) {
    console.error('Auth verification error:', error.message);
    return { error: 'Token is invalid or has expired', status: 401 };
  }
}
