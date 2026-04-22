import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
export async function POST(request) {
  try {
    const body = await request.json();
    console.log('Login attempt for:', body.email);

    const { email, password } = body;

    // 1. Validate input
    if (!email || !password) {
      console.log('Missing credentials in request body');
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // 2. Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // 3. Authenticate with Supabase
    console.log('Calling Supabase signInWithPassword...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password: password,
    });

    if (authError) {
      console.error('Supabase Auth Error:', {
        status: authError.status,
        message: authError.message,
        code: authError.code
      });

      // Handle specific error cases
      if (authError.message.includes('Email not confirmed')) {
        return NextResponse.json(
          { message: 'Please confirm your email address before logging in.' },
          { status: 403 }
        );
      }

      return NextResponse.json(
        { message: authError.message || 'Invalid credentials' },
        { status: authError.status || 401 }
      );
    }

    if (!authData.user || !authData.session) {
      console.error('No user or session in auth response');
      return NextResponse.json({ message: 'Authentication failed' }, { status: 401 });
    }

    console.log('Login successful for user:', authData.user.id);

    // 4. Fetch user details from public.users table (optional fallback)
    let username = authData.user.user_metadata?.username;
    
    try {
      const { data: userRecord } = await supabase
        .from('users')
        .select('username')
        .eq('id', authData.user.id)
        .single();
        
      if (userRecord && userRecord.username) {
        username = userRecord.username;
      }
    } catch (dbError) {
      console.warn('Could not fetch additional user meta from DB:', dbError.message);
    }

    const token = authData.session.access_token;

    // 5. Create Response and Set Secure HTTP-Only Cookie
    const response = NextResponse.json(
      {
        message: 'Login successful',
        token,
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
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return response;
  } catch (error) {
    console.error('SERVER FATAL LOGIN ERROR:', error);
    return NextResponse.json(
      { message: 'An unexpected server error occurred', error: error.message },
      { status: 500 }
    );
  }
}
