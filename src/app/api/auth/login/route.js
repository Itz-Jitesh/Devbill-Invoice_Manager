import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // 1. Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // 2. Normalize email
    const normalizedEmail = email.toLowerCase();

    // 3. Authenticate with Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password: password,
    });

    if (authError || !authData.user) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // Fetch user details from custom table (if needed for username)
    // Supabase auth.users raw_user_meta_data can also hold username
    let username = authData.user.user_metadata?.username;
    
    // Attempt to pull from public.users table just in case
    const { data: userRecord } = await supabase
      .from('users')
      .select('username')
      .eq('id', authData.user.id)
      .single();
      
    if (userRecord && userRecord.username) {
      username = userRecord.username;
    }

    const token = authData.session.access_token;

    // Set Secure HTTP-Only Cookie
    const response = NextResponse.json(
      {
        token, // Supabase JWT access token
        user: {
          id: authData.user.id,
          name: username || authData.user.email,
          username: username || authData.user.email,
          email: authData.user.email,
        },
      },
      { status: 200 }
    );

    response.cookies.set('devbill_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Login error:', error.message);
    return NextResponse.json(
      { message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}
