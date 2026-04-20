import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import Client from '@/models/Client';
import { verifyAuth } from '@/lib/auth';

const validateClientId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid client id' }, { status: 400 });
  }
  return null;
};

export async function GET(request, { params }) {
  try {
    const auth = await verifyAuth(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { id } = await params;
    const invalidIdResponse = validateClientId(id);
    if (invalidIdResponse) return invalidIdResponse;
    
    await connectDB();

    const client = await Client.findOne({ _id: id, userId: auth.user._id });

    if (!client) {
      return NextResponse.json({ error: 'Client not found or access denied' }, { status: 404 });
    }

    return NextResponse.json(client);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch client: ' + error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/clients/[id]
 * Update an existing client.
 */
export async function PUT(request, { params }) {
  try {
    const auth = await verifyAuth(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { id } = await params;
    const invalidIdResponse = validateClientId(id);
    if (invalidIdResponse) return invalidIdResponse;
    
    await connectDB();
    const body = await request.json();

    const updatedClient = await Client.findOneAndUpdate(
      { _id: id, userId: auth.user._id },
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!updatedClient) {
      return NextResponse.json({ error: 'Client not found or access denied' }, { status: 404 });
    }

    return NextResponse.json(updatedClient);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update client: ' + error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/clients/[id]
 * Delete a client.
 */
export async function DELETE(request, { params }) {
  try {
    const auth = await verifyAuth(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { id } = await params;
    const invalidIdResponse = validateClientId(id);
    if (invalidIdResponse) return invalidIdResponse;
    
    await connectDB();

    const deletedClient = await Client.findOneAndUpdate(
      { _id: id, userId: auth.user._id, isActive: true },
      { $set: { isActive: false } },
      { new: true }
    );

    if (!deletedClient) {
      return NextResponse.json({ error: 'Client not found or already deleted' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Client deactivated successfully', id });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete client: ' + error.message },
      { status: 500 }
    );
  }
}
