import connectDB from '@/lib/db';
import User from '@/models/user.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 *
 * Replaces: Express route POST /api/auth/login via auth.controller.js
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

    // 3. Find user in MongoDB
    await connectDB();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 401 });
    }

    // 4. Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    if (!process.env.JWT_SECRET) {
      return NextResponse.json({ message: 'JWT_SECRET is not configured' }, { status: 500 });
    }

    // 5. Generate JWT (7-day expiry — matches original Express backend)
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 6. Return token and user info
    return NextResponse.json(
      {
        token,
        user: {
          id: user._id,
          name: user.username,
          username: user.username,
          email: user.email,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error.message);
    return NextResponse.json(
      { message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}
