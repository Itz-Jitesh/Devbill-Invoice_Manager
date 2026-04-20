import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import Client from '@/models/Client';

const validateClientId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid client id' }, { status: 400 });
  }

  return null;
};

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const invalidIdResponse = validateClientId(id);
    if (invalidIdResponse) return invalidIdResponse;
    await connectDB();

    const client = await Client.findById(id);

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
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
    const { id } = await params;
    const invalidIdResponse = validateClientId(id);
    if (invalidIdResponse) return invalidIdResponse;
    await connectDB();
    const body = await request.json();

    const updatedClient = await Client.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!updatedClient) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
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
    const { id } = await params;
    const invalidIdResponse = validateClientId(id);
    if (invalidIdResponse) return invalidIdResponse;
    await connectDB();

    const deletedClient = await Client.findByIdAndDelete(id);

    if (!deletedClient) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Client deleted successfully', id });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete client: ' + error.message },
      { status: 500 }
    );
  }
}
