import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Client from '@/models/Client';
import { verifyAuth } from '@/lib/auth';

/**
 * GET /api/clients
 * Fetch all clients belonging to the authenticated user.
 */
export async function GET(request) {
  try {
    const auth = await verifyAuth(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    await connectDB();
    const clients = await Client.find({ userId: auth.user._id }).sort({ createdAt: -1 });
    return NextResponse.json(clients);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch clients: ' + error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/clients
 * Create a new client for the authenticated user.
 */
export async function POST(request) {
  try {
    const auth = await verifyAuth(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    await connectDB();
    const body = await request.json();
    
    if (!body.name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    // Attach userId to the new client
    const client = await Client.create({
      ...body,
      userId: auth.user._id
    });

    return NextResponse.json(client, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create client: ' + error.message },
      { status: 500 }
    );
  }
}
