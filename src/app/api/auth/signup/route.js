import connectDB from '@/lib/db';
import User from '@/models/user.model';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

/**
 * @desc    Register a new user
 * @route   POST /api/auth/signup
 * @access  Public
 *
 * Replaces: Express route POST /api/auth/signup via auth.controller.js
 */
export async function POST(request) {
  try {
    const body = await request.json();
    console.log('Signup payload received:', body);

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

    // 3. Connect and check for existing user
    await connectDB();
    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    // 4. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 5. Create and save new user
    const user = await User.create({
      username,
      email: normalizedEmail,
      password: hashedPassword,
    });

    // 6. Return success (no token on signup — user must login)
    return NextResponse.json(
      {
        message: 'User created',
        user: {
          id: user._id,
          name: user.username,
          username: user.username,
          email: user.email,
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
