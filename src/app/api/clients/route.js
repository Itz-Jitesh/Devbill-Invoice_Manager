import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { normalizeClientRecord } from '@/lib/data-normalizers';

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

    const { data: clients, error } = await auth.supabase
      .from('clients')
      .select('*')
      .eq('user_id', auth.user._id)
      .or('is_active.is.null,is_active.eq.true')
      .order('created_at', { ascending: false });

    console.log('[api/clients][GET] Fetch response', {
      userId: auth.user._id,
      count: clients?.length ?? 0,
      error: error?.message ?? null,
    });

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json(clients.map(normalizeClientRecord));
  } catch (error) {
    console.error('[api/clients][GET] Failed', error);
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

    const body = await request.json();
    
    if (!body.name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    // Prepare client data for Supabase
    const clientData = {
      name: body.name,
      email: body.email || null,
      company: body.company || null,
      user_id: auth.user._id,
      is_active: true,
    };

    const { data: client, error } = await auth.supabase
      .from('clients')
      .insert([clientData])
      .select()
      .single();

    console.log('[api/clients][POST] Insert response', {
      userId: auth.user._id,
      clientId: client?.id ?? null,
      error: error?.message ?? null,
    });

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json(normalizeClientRecord(client), { status: 201 });
  } catch (error) {
    console.error('[api/clients][POST] Failed', error);
    return NextResponse.json(
      { error: 'Failed to create client: ' + error.message },
      { status: 500 }
    );
  }
}
