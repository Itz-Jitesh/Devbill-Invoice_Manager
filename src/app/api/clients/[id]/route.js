import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase';
import { verifyAuth } from '@/lib/auth';

/**
 * GET /api/clients/[id]
 * Fetch a single client.
 */
export async function GET(request, { params }) {
  try {
    const auth = await verifyAuth(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { id } = await params;
    
    const { data: client, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .eq('user_id', auth.user._id)
      .single();

    if (error || !client) {
      return NextResponse.json({ error: 'Client not found or access denied' }, { status: 404 });
    }

    const normalizedClient = {
      ...client,
      _id: client.id,
      userId: client.user_id
    };

    return NextResponse.json(normalizedClient);
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
    const body = await request.json();

    const { data: updatedClient, error } = await supabase
      .from('clients')
      .update(body)
      .eq('id', id)
      .eq('user_id', auth.user._id)
      .select()
      .single();

    if (error || !updatedClient) {
      return NextResponse.json({ error: 'Client not found or access denied' }, { status: 404 });
    }

    const normalizedClient = {
      ...updatedClient,
      _id: updatedClient.id,
      userId: updatedClient.user_id
    };

    return NextResponse.json(normalizedClient);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update client: ' + error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/clients/[id]
 * Delete a client (Soft Delete).
 */
export async function DELETE(request, { params }) {
  try {
    const auth = await verifyAuth(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { id } = await params;

    const { data: deletedClient, error } = await supabase
      .from('clients')
      .update({ is_active: false })
      .eq('id', id)
      .eq('user_id', auth.user._id)
      .eq('is_active', true)
      .select()
      .single();

    if (error || !deletedClient) {
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
