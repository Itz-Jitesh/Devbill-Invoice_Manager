import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Client from '@/models/Client';

/**
 * GET /api/clients
 * Fetch all clients from the database.
 */
export async function GET() {
  try {
    await connectDB();
    const clients = await Client.find({}).sort({ createdAt: -1 });
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
 * Create a new client.
 */
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    
    if (!body.name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    const client = await Client.create(body);
    return NextResponse.json(client, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create client: ' + error.message },
      { status: 500 }
    );
  }
}
