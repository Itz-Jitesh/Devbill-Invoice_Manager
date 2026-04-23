import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

/**
 * @desc    Register a new user
 * @route   POST /api/auth/signup
 * @access  Public
 */
export async function POST(request) {
  try {
    const body = await request.json();
    console.log('Signup payload received:', body);
    const supabase = createServerSupabaseClient();

    const { username, email, password } = body;

    // 1. Basic validation
    if (!username || !email || !password) {
      return NextResponse.json(
        { message: 'Username, email and password are required' },
        { status: 400 }
      );
    }

    // 2. Normalize data
    const normalizedEmail = email.toLowerCase();

    // 3. Supabase Auth Signup
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: normalizedEmail,
      password: password,
      options: {
        data: {
          username: username
        }
      }
    });

    if (authError) {
      return NextResponse.json({ message: authError.message }, { status: 400 });
    }

    if (!authData.user) {
      return NextResponse.json({ message: 'User already exists or signup failed' }, { status: 400 });
    }

    // 4. Insert into custom users table
    const { error: insertError } = await supabase.from('users').insert([{
      id: authData.user.id,
      username: username,
      email: normalizedEmail
    }]);

    if (insertError) {
      // If error (e.g. duplicate key), we can handle it
      console.error('Error inserting into users table:', insertError.message);
      // Not failing the request since auth user was created, but ideally we'd use a postgres trigger.
    }

    // 5. Return success (no token on signup — user must login)
    return NextResponse.json(
      {
        message: 'User created',
        user: {
          id: authData.user.id,
          name: username,
          username: username,
          email: normalizedEmail,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error.message);
    return NextResponse.json(
      { message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}
