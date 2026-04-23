import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { normalizeClientRecord } from '@/lib/data-normalizers';

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
    
    const { data: client, error } = await auth.supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .eq('user_id', auth.user._id)
      .single();

    if (error || !client) {
      return NextResponse.json({ error: 'Client not found or access denied' }, { status: 404 });
    }

    console.log('[api/clients/:id][GET] Fetch response', {
      userId: auth.user._id,
      clientId: client?.id ?? id,
      error: error?.message ?? null,
    });

    return NextResponse.json(normalizeClientRecord(client));
  } catch (error) {
    console.error('[api/clients/:id][GET] Failed', error);
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

    const updates = {};

    if (body.name !== undefined) updates.name = body.name;
    if (body.email !== undefined) updates.email = body.email || null;
    if (body.company !== undefined) updates.company = body.company || null;

    const { data: updatedClient, error } = await auth.supabase
      .from('clients')
      .update(updates)
      .eq('id', id)
      .eq('user_id', auth.user._id)
      .select()
      .single();

    if (error || !updatedClient) {
      return NextResponse.json({ error: 'Client not found or access denied' }, { status: 404 });
    }

    console.log('[api/clients/:id][PUT] Update response', {
      userId: auth.user._id,
      clientId: updatedClient?.id ?? id,
      error: error?.message ?? null,
    });

    return NextResponse.json(normalizeClientRecord(updatedClient));
  } catch (error) {
    console.error('[api/clients/:id][PUT] Failed', error);
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
    const { data: existingClient, error: existingClientError } = await auth.supabase
      .from('clients')
      .select('id, is_active')
      .eq('id', id)
      .eq('user_id', auth.user._id)
      .maybeSingle();

    console.log('[api/clients/:id][DELETE] Existing client lookup', {
      userId: auth.user._id,
      clientId: id,
      isActive: existingClient?.is_active ?? null,
      error: existingClientError?.message ?? null,
    });

    if (existingClientError) {
      throw new Error(existingClientError.message);
    }

    if (!existingClient) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    if (existingClient.is_active === false) {
      return NextResponse.json({ message: 'Client already deleted', id });
    }

    const { error } = await auth.supabase
      .from('clients')
      .update({ is_active: false })
      .eq('id', id)
      .eq('user_id', auth.user._id);

    console.log('[api/clients/:id][DELETE] Update response', {
      userId: auth.user._id,
      clientId: id,
      error: error?.message ?? null,
    });

    if (error) {
      return NextResponse.json({ error: 'Failed to delete client' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Client deactivated successfully', id });
  } catch (error) {
    console.error('[api/clients/:id][DELETE] Failed', error);
    return NextResponse.json(
      { error: 'Failed to delete client: ' + error.message },
      { status: 500 }
    );
  }
}
