import { NextResponse } from 'next/server';

/**
 * @desc    Clear auth cookie
 * @route   POST /api/auth/logout
 * @access  Private/Public
 */
export async function POST() {
  const response = NextResponse.json({ message: 'Logged out successfully' });

  // Clear cookie by setting expiry to past
  response.cookies.set('devbill_token', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  });

  return response;
}
